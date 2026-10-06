//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var __toCommonJS = (mod) => __hasOwnProp.call(mod, "module.exports") ? mod["module.exports"] : __copyProps(__defProp({}, "__esModule", { value: true }), mod);
//#endregion
//#region work/module/src/esm-dep.js
function esmDep() {
	return "M_ESM_DEP";
}
//#endregion
//#region work/module/src/side-effect.js
var import_cjs_default = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function cjsDefault() {
		return "M_CJS_DEFAULT";
	};
})))(), 1);
globalThis.M_SIDE_EFFECT = "M_SIDE_EFFECT";
//#endregion
//#region \0vite/preload-helper.js
var scriptRel = "modulepreload";
var assetsURL = function(dep) {
	return "/" + dep;
};
var seen = {};
var isCssPreloadUrl = function isCssPreloadUrl(url) {
	return url.pathname.endsWith(".css");
};
var __vitePreload = function preload(baseModule, deps, importerUrl) {
	let promise = Promise.resolve();
	if (deps && deps.length > 0) {
		let preloadedHrefs;
		const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
		const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
		function allSettled(promises) {
			return Promise.all(promises.map((p) => Promise.resolve(p).then((value) => ({
				status: "fulfilled",
				value
			}), (reason) => ({
				status: "rejected",
				reason
			}))));
		}
		function importMetaResolve(specifier) {
			if (import.meta.resolve) return new URL(import.meta.resolve(specifier));
			return new URL(
				specifier,
				/** #__KEEP__ */
				import.meta.url
			);
		}
		promise = allSettled(deps.map((depString) => {
			depString = assetsURL(depString, importerUrl);
			const dep = importMetaResolve(depString);
			if (dep.href in seen) return;
			seen[dep.href] = true;
			const isCss = isCssPreloadUrl(dep);
			if (preloadedHrefs === void 0) {
				preloadedHrefs = {
					all: /* @__PURE__ */ new Set(),
					styles: /* @__PURE__ */ new Set()
				};
				const links = document.getElementsByTagName("link");
				for (let i = links.length - 1; i >= 0; i--) {
					const link = links[i];
					preloadedHrefs.all.add(link.href);
					if (link.rel === "stylesheet") preloadedHrefs.styles.add(link.href);
				}
			}
			if ((isCss ? preloadedHrefs.styles : preloadedHrefs.all).has(dep.href)) return;
			const link = document.createElement("link");
			link.rel = isCss ? "stylesheet" : scriptRel;
			if (!isCss) link.as = "script";
			link.crossOrigin = "";
			link.href = dep.href;
			if (cspNonce) link.setAttribute("nonce", cspNonce);
			document.head.appendChild(link);
			if (isCss) return new Promise((res, rej) => {
				link.addEventListener("load", res);
				link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
			});
		}).filter((p) => p !== void 0));
	}
	function handlePreloadError(err) {
		const e = new Event("vite:preloadError", { cancelable: true });
		e.payload = err;
		window.dispatchEvent(e);
		if (!e.defaultPrevented) throw err;
	}
	return promise.then((res) => {
		for (const item of res || []) {
			if (item.status !== "rejected") continue;
			handlePreloadError(item.reason);
		}
		return baseModule().catch(handlePreloadError);
	});
};
//#endregion
//#region work/module/src/cjs-dep.cjs
var require_cjs_dep = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = { cjsDep() {
		return "M_CJS_DEP";
	} };
}));
//#endregion
//#region work/module/src/esm-required.js
var esm_required_exports = /* @__PURE__ */ __exportAll({ esmRequired: () => esmRequired$1 });
function esmRequired$1() {
	return "M_ESM_REQUIRED";
}
//#endregion
//#region work/module/src/entry.js
var { cjsDep } = require_cjs_dep();
var { esmRequired } = __toCommonJS(esm_required_exports);
function run() {
	return [
		esmDep(),
		(0, import_cjs_default.default)(),
		cjsDep(),
		esmRequired(),
		globalThis.M_SIDE_EFFECT,
		() => __vitePreload(() => import("./lazy-dep-BQJruiYs.js").then((m) => m.lazyDep()), [])
	];
}
//#endregion
//#region work/module/src/index.js
globalThis.out = run();
//#endregion

//# sourceMappingURL=index-CAwIzhwK.js.map