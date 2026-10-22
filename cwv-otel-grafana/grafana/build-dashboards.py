"""grafana/dashboards 의 대시보드 JSON 두 개를 만든다. 사용: python3 grafana/build-dashboards.py

- cwv-ops.json (Mimir): 지금 얼마나 느린가, 나빠졌는가, 어디가 느린가
- cwv-why.json (Tempo): 왜 느린가(LCP 요소, 단계별 시간, 밀린 요소)
"""

import json
from pathlib import Path

OUT = Path(__file__).parent / "dashboards"
MIMIR = {"type": "prometheus", "uid": "mimir"}
TEMPO = {"type": "tempo", "uid": "tempo"}

# (이름, 시리즈 접두사, good 경계, poor 경계, 단위)
METRICS = [
    ("LCP", "cwv_lcp_milliseconds", 2500, 4000, "ms"),
    ("INP", "cwv_inp_milliseconds", 200, 500, "ms"),
    ("CLS", "cwv_cls", 0.1, 0.25, "none"),
    ("FCP", "cwv_fcp_milliseconds", 1800, 3000, "ms"),
    ("TTFB", "cwv_ttfb_milliseconds", 800, 1800, "ms"),
]
# 같은 Mimir tenant 에 실험(E8~E11)이 보낸 시리즈도 있다. All 의 .* 는 page_route 가 없는 시리즈도 잡으므로 job 으로 거른다.
# job 은 수집 경로다. cwv-gateway 는 gateway 가 모아 확정한 값, demo-web 은 브라우저가 delta 로 보낸 대조군이다.
ROUTE = 'job="$source", page_route=~"$route"'
WIDTHS = [5, 5, 5, 5, 4]


def thresholds(good, poor):
    return {
        "mode": "absolute",
        "steps": [
            {"color": "green", "value": None},
            {"color": "orange", "value": good},
            {"color": "red", "value": poor},
        ],
    }


class Layout:
    """패널을 왼쪽에서 오른쪽으로 채우고 줄을 넘긴다."""

    def __init__(self):
        self.panels, self.x, self.y, self.row_h, self.next_id = [], 0, 0, 0, 1

    def row(self, title):
        self.newline()
        self.add({"type": "row", "title": title, "collapsed": False, "panels": []}, 24, 1)

    def newline(self):
        if self.x:
            self.x, self.y, self.row_h = 0, self.y + self.row_h, 0

    def add(self, panel, w, h):
        if self.x + w > 24:
            self.newline()
        panel["id"] = self.next_id
        panel["gridPos"] = {"x": self.x, "y": self.y, "w": w, "h": h}
        self.next_id += 1
        self.panels.append(panel)
        self.x += w
        self.row_h = max(self.row_h, h)


def prom(expr, legend="", instant=False):
    return {"datasource": MIMIR, "expr": expr, "legendFormat": legend, "instant": instant, "range": not instant, "refId": "A"}


def stat(title, expr, unit, th, description="", decimals=None):
    defaults = {"unit": unit, "thresholds": th, "color": {"mode": "thresholds"}}
    if decimals is not None:
        defaults["decimals"] = decimals
    return {
        "type": "stat",
        "title": title,
        "description": description,
        "datasource": MIMIR,
        "targets": [prom(expr, instant=True)],
        "fieldConfig": {"defaults": defaults, "overrides": []},
        "options": {"reduceOptions": {"calcs": ["lastNotNull"]}, "colorMode": "background", "graphMode": "none"},
    }


def timeseries(title, targets, unit, datasource, th=None, description="", stack=False):
    custom = {"lineWidth": 2, "fillOpacity": 10, "spanNulls": True}
    if stack:
        custom.update({"stacking": {"mode": "normal"}, "drawStyle": "bars", "fillOpacity": 80})
    if th:
        custom["thresholdsStyle"] = {"mode": "line+area"}
    defaults = {"unit": unit, "custom": custom}
    if th:
        defaults["thresholds"] = th
    return {
        "type": "timeseries",
        "title": title,
        "description": description,
        "datasource": datasource,
        "targets": targets,
        "fieldConfig": {"defaults": defaults, "overrides": []},
        "options": {"legend": {"displayMode": "list", "placement": "bottom"}, "tooltip": {"mode": "multi"}},
    }


def bargauge(title, expr, legend, unit, th):
    label = legend.strip("{}")
    return {
        "type": "bargauge",
        "title": title,
        "datasource": MIMIR,
        "targets": [prom(expr, legend, instant=True)],
        "fieldConfig": {"defaults": {"unit": unit, "thresholds": th, "color": {"mode": "thresholds"}, "displayName": f"${{__field.labels.{label}}}"}, "overrides": []},
        "options": {"orientation": "horizontal", "displayMode": "basic", "reduceOptions": {"calcs": ["lastNotNull"]}},
    }


def p75(series, window, by="le"):
    return f"histogram_quantile(0.75, sum by ({by}) (increase({series}_bucket{{{ROUTE}}}[{window}])))"


def good_ratio(series, good, window):
    return (
        f'sum(increase({series}_bucket{{{ROUTE},le="{good}"}}[{window}]))'
        f" / sum(increase({series}_count{{{ROUTE}}}[{window}]))"
    )


def ops_dashboard():
    lay = Layout()
    lay.row("How slow is it now (p75 over the selected range)")
    for (name, series, good, poor, unit), w in zip(METRICS, WIDTHS):
        lay.add(stat(f"{name} p75", p75(series, "$__range"), unit, thresholds(good, poor), decimals=3 if unit == "none" else None), w, 4)
    lay.row("Good ratio (good-boundary bucket / total)")
    ratio_th = {"mode": "absolute", "steps": [{"color": "red", "value": None}, {"color": "orange", "value": 0.5}, {"color": "green", "value": 0.75}]}
    for (name, series, good, poor, unit), w in zip(METRICS, WIDTHS):
        lay.add(
            stat(f"{name} good ratio", good_ratio(series, good, "$__range"), "percentunit", ratio_th,
                 description=f"The le=\"{good}\" bucket is exactly the good threshold, so this value needs no interpolation."),
            w, 4,
        )
    lay.row("Is it getting worse (10-minute window p75 trend)")
    for name, series, good, poor, unit in METRICS:
        lay.add(timeseries(f"{name} p75 trend", [prom(p75(series, "10m"), "p75")], unit, MIMIR, thresholds(good, poor)), 12 if name in ("LCP", "INP") else 8, 7)
    lay.row("Where is it slow")
    lay.add(bargauge("LCP p75 by route", p75("cwv_lcp_milliseconds", "$__range", "le, page_route"), "{{page_route}}", "ms", thresholds(2500, 4000)), 8, 6)
    lay.add(bargauge("INP p75 by route", p75("cwv_inp_milliseconds", "$__range", "le, page_route"), "{{page_route}}", "ms", thresholds(200, 500)), 8, 6)
    lay.add(bargauge("INP p75 by interaction type", p75("cwv_inp_milliseconds", "$__range", "le, interaction_type"), "{{interaction_type}}", "ms", thresholds(200, 500)), 8, 6)
    lay.row("Rating distribution and sample count")
    lay.add(
        timeseries("LCP count by rating", [prom(f"sum by (rating) (increase(cwv_lcp_milliseconds_count{{{ROUTE}}}[$__interval]))", "{{rating}}")], "short", MIMIR, stack=True),
        12, 7,
    )
    lay.add(
        timeseries(
            "Samples by metric",
            [prom(f"sum(increase({series}_count{{{ROUTE}}}[$__interval]))", name) for name, series, *_ in METRICS],
            "short", MIMIR,
            description="cwv-gateway counts measurements the gateway finalized, so nothing expires; the only error is increase() extrapolating from the last sample to the query time (experiments/e11). demo-web goes through the collector's delta_to_cumulative, which drops a series after 5 minutes without samples (checked every minute); the count then restarts from 1, which Prometheus reads as a zero increase, so sparse label combinations undercount (experiments/e4, e8). Do not read the demo-web side as page loads.",
        ),
        12, 7,
    )
    for i, t in enumerate(lay.panels[-1]["targets"]):
        t["refId"] = chr(ord("A") + i)
    return {
        "uid": "cwv-ops",
        "title": "CWV operations (Mimir)",
        "tags": ["cwv"],
        "timezone": "browser",
        "schemaVersion": 41,
        "time": {"from": "now-1h", "to": "now"},
        "refresh": "1m",
        "templating": {
            "list": [
                {
                    "name": "source",
                    "label": "source",
                    "type": "custom",
                    "description": "cwv-gateway: the gateway keeps the latest value per measurement and finalizes it after 30 minutes without updates, so values show up 30 minutes late. LCPs that only ever sent a provisional (quiet) value go to cwv_lcp_provisional and are not included here. demo-web: the control group the browser sent as delta (loses samples under concurrent writers, experiments/e10).",
                    "query": "cwv-gateway,demo-web",
                    "options": [
                        {"text": "cwv-gateway", "value": "cwv-gateway", "selected": True},
                        {"text": "demo-web", "value": "demo-web", "selected": False},
                    ],
                    "current": {"text": "cwv-gateway", "value": "cwv-gateway"},
                },
                {
                    "name": "route",
                    "label": "route",
                    "type": "query",
                    "datasource": MIMIR,
                    "query": {"query": "label_values(cwv_lcp_milliseconds_count{job=\"$source\"}, page_route)", "refId": "route"},
                    "definition": "label_values(cwv_lcp_milliseconds_count{job=\"$source\"}, page_route)",
                    "includeAll": True,
                    "allValue": ".*",
                    "multi": True,
                    "current": {"text": "All", "value": "$__all"},
                    "refresh": 2,
                }
            ]
        },
        "panels": lay.panels,
    }


FILTER = 'resource.service.name="demo-web" && span.page.route=~"$route"'


def traceql(query, step="5m"):
    return {"datasource": TEMPO, "queryType": "traceql", "query": query, "metricsQueryType": "range", "step": step, "refId": "A"}


def tempo_ts(title, query, unit, description="", stack=False, th=None):
    return timeseries(title, [traceql(query)], unit, TEMPO, th=th, description=description, stack=stack)


def why_dashboard():
    lay = Layout()
    lay.row("What is the LCP element")
    lay.add(tempo_ts("LCP count by element", f'{{{FILTER} && name="cwv.lcp"}} | count_over_time() by (span.cwv.lcp.target)', "short", stack=True), 12, 8)
    lay.add(
        tempo_ts("LCP p75 by element", f'{{{FILTER} && name="cwv.lcp"}} | quantile_over_time(duration, .75) by (span.cwv.lcp.target)', "s",
                 description="The span duration is the LCP value, so the duration quantile is the LCP quantile. Tempo returns 0 for the quantile of an interval with no samples, so a 0 here is an empty interval, not a value.", th=thresholds(2.5, 4)),
        12, 8,
    )
    lay.row("Which LCP phase was slow (average ms)")
    note = "The Tempo data source overwrites each query's frame refId with the function name, so several queries in one panel cannot be told apart in the legend. One panel per phase."
    for label, attr in [("TTFB", "time_to_first_byte"), ("Resource load delay", "resource_load_delay"), ("Resource load duration", "resource_load_duration"), ("Element render delay", "element_render_delay")]:
        lay.add(tempo_ts(label, f'{{{FILTER} && name="cwv.lcp"}} | avg_over_time(span.cwv.lcp.{attr})', "ms", description=note), 6, 6)
    lay.row("Which INP phase was slow (average ms)")
    for label, attr in [("Input delay", "input_delay"), ("Processing duration", "processing_duration"), ("Presentation delay", "presentation_delay")]:
        lay.add(tempo_ts(label, f'{{{FILTER} && name="cwv.inp"}} | avg_over_time(span.cwv.inp.{attr})', "ms", description=note), 8, 6)
    lay.add(tempo_ts("INP p75 by target", f'{{{FILTER} && name="cwv.inp"}} | quantile_over_time(duration, .75) by (span.cwv.inp.target)', "s", th=thresholds(0.2, 0.5),
                     description="Intervals with no samples are drawn as 0."), 12, 7)
    lay.add(tempo_ts("CLS count by largest shift target", f'{{{FILTER} && name="cwv.cls" && duration > 0ms}} | count_over_time() by (span.cwv.cls.largest_shift_target)', "short", stack=True), 12, 7)
    lay.row("Finalization and slow page loads")
    lay.add(
        tempo_ts("LCP final vs quiet provisional", f'{{{FILTER} && (name="cwv.lcp" || name="cwv.lcp.quiet")}} | count_over_time() by (name)', "short",
                 description="cwv.lcp is the value web-vitals finalized on first input or hidden, one per page. cwv.lcp.quiet is the provisional value this code records whenever the candidate stays unchanged for 3 seconds, so a page can have several. Only the final value goes into the Mimir histogram."),
        8, 8,
    )
    lay.add(
        {
            "type": "table",
            "title": "Slow LCP (over 2.5 s)",
            "datasource": TEMPO,
            "targets": [{
                "datasource": TEMPO, "queryType": "traceql", "tableType": "spans", "limit": 50, "spss": 1, "refId": "A",
                "query": f'{{{FILTER} && name="cwv.lcp" && duration > 2.5s}} | select(span.cwv.lcp.target, span.cwv.lcp.element_render_delay, span.cwv.lcp.time_to_first_byte)',
            }],
            "fieldConfig": {"defaults": {}, "overrides": []},
            "transformations": [{"id": "organize", "options": {"excludeByName": {"traceService": True, "traceName": True, "service.name": True}}}],
            "options": {"showHeader": True},
        },
        16, 8,
    )
    return {
        "uid": "cwv-why",
        "title": "CWV root cause analysis (Tempo)",
        "tags": ["cwv"],
        "timezone": "browser",
        "schemaVersion": 41,
        "time": {"from": "now-1h", "to": "now"},
        "refresh": "1m",
        "templating": {
            "list": [
                {
                    "name": "route",
                    "label": "route",
                    "type": "custom",
                    "query": ".*,home,product",
                    "current": {"text": ".*", "value": ".*"},
                    "options": [{"text": v, "value": v, "selected": v == ".*"} for v in [".*", "home", "product"]],
                }
            ]
        },
        "panels": lay.panels,
    }


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    for dash in (ops_dashboard(), why_dashboard()):
        (OUT / f"{dash['uid']}.json").write_text(json.dumps(dash, ensure_ascii=False, indent=2) + "\n")
        print(dash["uid"], len(dash["panels"]), "panels")
