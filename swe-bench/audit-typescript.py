#!/usr/bin/env python3
"""Reproduce the Multi-SWE-bench TypeScript counts in the accompanying post.

Download the pinned full dataset and optional subsets described in README.md:
    python3 audit-typescript.py /path/to/ts \
        --mini /path/to/multi_swe_bench_mini.jsonl \
        --flash /path/to/multi_swe_bench_flash.jsonl > results/typescript-audit.json

Uses only the Python standard library. Reads data without running repository code.
The PASS/FAIL/PASS pattern is an observation, not proof of flaky tests.
"""

import argparse
import hashlib
import json
import posixpath
import re
import shlex
from collections import Counter
from pathlib import Path


DATASET = "ByteDance-Seed/Multi-SWE-bench"
DATASET_REVISION = "56ff018c04a38e27ada1e9d0a6d5839a51f88f0d"
EXPECTED_SHA256 = {
    "darkreader__darkreader_dataset.jsonl":
        "350ddd200d2774be699d72062b356a9ceecdf38c3f9ab72e1ece3887626a93a8",
    "mui__material-ui_dataset.jsonl":
        "3e87ddc463f5193577cf7e3be25d9fd3bceebfbfbf717ba702ffd55208c56543",
    "vuejs__core_dataset.jsonl":
        "10365ee2414d80b0985a1fda64588c06e260646b7f90b916551d0bfd00203b30",
}
PATTERN = {"run": "PASS", "test": "FAIL", "fix": "PASS"}
ADDITIONAL_PATTERN = {"run": "FAIL", "test": "FAIL", "fix": "PASS"}
TEST_PATCH_DEPENDENCIES = [
    "snapshot: __snapshots__/<test file>.snap next to the test file",
    "fixture_directory: files under <test file without extension>/",
    "test_case_directory: a directory under the test file's directory whose path ends the test ID",
]
SUBSETS = {
    "mini": {
        "dataset": "ByteDance-Seed/Multi-SWE-bench_mini",
        "revision": "d0fab3ccc7dff232fcaac234cf8af9a2efeaccf6",
        "filename": "multi_swe_bench_mini.jsonl",
        "sha256": "6644b9c9ebaf5e5b37cb9d81c4dce688c101f07436aed9d50fc55c85b164c3b2",
    },
    "flash": {
        "dataset": "ByteDance-Seed/Multi-SWE-bench-flash",
        "revision": "b0485dbebaf8a1317ebf140e80e6fc6c02d3502b",
        "filename": "multi_swe_bench_flash.jsonl",
        "sha256": "48d6d02cc976a71a06b494cc60581d92e82c06c2793c0d412c52c63e6956bebe",
    },
}


def file_hash(path):
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def patch_files(patch):
    files = set()
    for line in patch.splitlines():
        if line.startswith("diff --git "):
            for name in shlex.split(line)[2:4]:
                files.add(name[2:])
    return files


def test_file(test_id, repo):
    # These pinned Vitest/Mocha records use either "path > name" or "path: name".
    path = test_id.removeprefix(f"/home/{repo}/").split(" > ", 1)[0]
    return re.split(r":(?!//)", path, maxsplit=1)[0]


def test_patch_dependency(test_id, path, touched):
    # A test patch can change a test's expectations without touching the test file itself.
    directory, name = posixpath.split(path)
    snapshot = posixpath.join(directory, "__snapshots__", f"{name}.snap")
    fixture_dir = path.rsplit(".", 1)[0] + "/"
    for changed in sorted(touched):
        if changed == snapshot:
            return {"reason": "snapshot", "changed_file": changed}
        if changed.startswith(fixture_dir):
            return {"reason": "fixture_directory", "changed_file": changed}
        if changed.startswith(directory + "/"):
            case_dir = posixpath.dirname(changed)[len(directory) + 1:]
            if case_dir and test_id.endswith(case_dir):
                return {"reason": "test_case_directory", "changed_file": changed}
    return None


def extension_group(files):
    if any(f.endswith((".ts", ".tsx")) and not f.endswith(".d.ts") for f in files):
        return "ts_or_tsx"
    if any(f.endswith(".d.ts") for f in files):
        return "declarations_without_ts_or_tsx"
    return "no_ts_tsx_or_declarations"


def audit_subset(path, name, full_instances):
    metadata = SUBSETS[name]
    actual = file_hash(path)
    if actual != metadata["sha256"]:
        raise ValueError(f"Wrong revision or modified subset: {name} ({actual})")
    repositories = {item["repository"] for item in full_instances.values()}
    result = {
        **metadata,
        "source_url": (
            f"https://huggingface.co/datasets/{metadata['dataset']}/resolve/"
            f"{metadata['revision']}/{metadata['filename']}"
        ),
        "total_instances": 0,
        "typescript_instances": [],
        "pattern_instances": [],
        "broader_pattern_instances": [],
        "f2p_and_test_patch_match_full": True,
    }
    with path.open(encoding="utf-8") as source:
        for line in source:
            if not line.strip():
                continue
            row = json.loads(line)
            result["total_instances"] += 1
            repo = f"{row['org']}/{row['repo']}"
            if repo not in repositories:
                continue
            instance_id = f"{row['org']}__{row['repo']}-{row['number']}"
            original = full_instances[instance_id]
            if (
                row["f2p_tests"] != original["f2p_tests"]
                or row["test_patch"] != original["test_patch"]
            ):
                raise ValueError(f"Subset test records differ: {name}/{instance_id}")
            result["typescript_instances"].append(instance_id)
            if original["primary_pattern"]:
                result["pattern_instances"].append(instance_id)
            if original["broader_pattern"]:
                result["broader_pattern_instances"].append(instance_id)
    for key in ("typescript_instances", "pattern_instances", "broader_pattern_instances"):
        result[key].sort()
        if len(result[key]) != len(set(result[key])):
            raise ValueError(f"Duplicate instance IDs in {name}/{key}")
        result[f"{key}_count"] = len(result[key])
    return result


def audit(directory, subset_files=None):
    report = {
        "dataset": DATASET,
        "revision": DATASET_REVISION,
        "source_url": f"https://huggingface.co/datasets/{DATASET}/tree/{DATASET_REVISION}/ts",
        "pattern": {
            "required_statuses": PATTERN,
            "test_file_not_in": "test_patch",
            "excluded_when_test_patch_changes": TEST_PATCH_DEPENDENCIES,
            "interpretation": "Recorded status pattern only; flakiness is not established.",
        },
        "additional_pattern": {
            "required_statuses": ADDITIONAL_PATTERN,
            "test_file_not_in": "test_patch",
            "excluded_when_test_patch_changes": TEST_PATCH_DEPENDENCIES,
            "interpretation": (
                "FAIL/FAIL/PASS is reported separately because both pre-fix runs fail. "
                "It is not evidence of changed behavior before the implementation fix."
            ),
        },
        "files": [],
        "repositories": {},
        "subsets": {},
    }
    full_instances = {}
    all_extensions = Counter()
    p2p_count = 0
    count = 0
    pattern_count = 0
    broader_count = 0
    empty_f2p_count = 0
    for filename, expected in EXPECTED_SHA256.items():
        path = directory / filename
        actual = file_hash(path)
        if actual != expected:
            raise ValueError(f"Wrong revision or modified file: {filename} ({actual})")
        report["files"].append({"path": f"ts/{filename}", "sha256": actual})
        summary = {
            "instances": 0,
            "gold_patch_extensions": Counter(),
            "empty_f2p_instances": [],
            "pattern_instances": [],
            "fail_fail_pass_instances": [],
            "broader_pattern_instances": [],
            "test_patch_dependencies": [],
        }
        with path.open(encoding="utf-8") as source:
            for line in source:
                if not line.strip():
                    continue
                row = json.loads(line)
                repo = f"{row['org']}/{row['repo']}"
                instance_id = f"{row['org']}__{row['repo']}-{row['number']}"
                summary["instances"] += 1
                count += 1
                group = extension_group(patch_files(row["fix_patch"]))
                summary["gold_patch_extensions"][group] += 1
                all_extensions[group] += 1
                p2p_count += len(row["p2p_tests"])
                if not row["f2p_tests"]:
                    summary["empty_f2p_instances"].append(instance_id)
                    empty_f2p_count += 1
                touched = patch_files(row["test_patch"])
                matches = []
                additional_matches = []
                for key, status in sorted(row["f2p_tests"].items()):
                    if status not in (PATTERN, ADDITIONAL_PATTERN):
                        continue
                    path = test_file(key, row["repo"])
                    if path in touched:
                        continue
                    test = {"id": key, "file": path, "statuses": status}
                    dependency = test_patch_dependency(key, path, touched)
                    if dependency:
                        summary["test_patch_dependencies"].append(
                            {"instance_id": instance_id, **test, **dependency}
                        )
                    elif status == PATTERN:
                        matches.append(test)
                    else:
                        additional_matches.append(test)
                if instance_id in full_instances:
                    raise ValueError(f"Duplicate full-set instance ID: {instance_id}")
                full_instances[instance_id] = {
                    "repository": repo,
                    "f2p_tests": row["f2p_tests"],
                    "test_patch": row["test_patch"],
                    "primary_pattern": bool(matches),
                    "broader_pattern": bool(matches or additional_matches),
                }
                if matches:
                    pattern_count += 1
                    summary["pattern_instances"].append({
                        "instance_id": instance_id,
                        "pr_number": row["number"],
                        "tests": matches,
                    })
                if additional_matches:
                    summary["fail_fail_pass_instances"].append({
                        "instance_id": instance_id,
                        "pr_number": row["number"],
                        "tests": additional_matches,
                    })
                if matches or additional_matches:
                    broader_count += 1
                    summary["broader_pattern_instances"].append(instance_id)
                if instance_id == "vuejs__core-11899":
                    report["example"] = {
                        "instance_id": instance_id,
                        "base": row["base"]["sha"],
                        "patch_lines": {
                            name: len(row[name].splitlines())
                            for name in ("fix_patch", "test_patch")
                        },
                        "runs": {
                            stage: {
                                status: row[stage][status]
                                for status in ("passed_count", "failed_count", "skipped_count")
                            }
                            for stage in ("run_result", "test_patch_result", "fix_patch_result")
                        },
                        "f2p_tests": row["f2p_tests"],
                        "p2p_count": len(row["p2p_tests"]),
                    }
        summary["pattern_instances"].sort(key=lambda item: item["pr_number"])
        summary["fail_fail_pass_instances"].sort(key=lambda item: item["pr_number"])
        summary["broader_pattern_instances"].sort()
        summary["test_patch_dependencies"].sort(key=lambda item: (item["instance_id"], item["id"]))
        summary["empty_f2p_instances"].sort()
        summary["pattern_instance_count"] = len(summary["pattern_instances"])
        summary["broader_pattern_instance_count"] = len(summary["broader_pattern_instances"])
        report["repositories"][repo] = summary
    report["totals"] = {
        "instances": count,
        "pattern_instances": pattern_count,
        "broader_pattern_instances": broader_count,
        "test_patch_dependency_tests": sum(
            len(summary["test_patch_dependencies"]) for summary in report["repositories"].values()
        ),
        "empty_f2p_instances": empty_f2p_count,
        "p2p_tests": p2p_count,
        "mean_p2p_tests_per_instance": p2p_count / count,
        "gold_patch_extensions": all_extensions,
    }
    for name, path in (subset_files or {}).items():
        report["subsets"][name] = audit_subset(path, name, full_instances)
    return report


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("directory", type=Path, help="Directory containing the three ts/*.jsonl files")
    parser.add_argument("--mini", type=Path, help="Pinned Multi-SWE-bench mini JSONL file")
    parser.add_argument("--flash", type=Path, help="Pinned Multi-SWE-bench flash JSONL file")
    args = parser.parse_args()
    subset_files = {name: getattr(args, name) for name in SUBSETS if getattr(args, name)}
    print(json.dumps(audit(args.directory, subset_files), ensure_ascii=False, indent=2, sort_keys=True))
