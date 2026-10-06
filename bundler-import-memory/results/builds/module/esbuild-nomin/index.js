import {
  __commonJS,
  __esm,
  __export,
  __toCommonJS,
  __toESM
} from "./chunk-QLCLYZTY.js";

// src/cjs-default.cjs
var require_cjs_default = __commonJS({
  "src/cjs-default.cjs"(exports, module) {
    module.exports = function cjsDefault2() {
      return "M_CJS_DEFAULT";
    };
  }
});

// src/cjs-dep.cjs
var require_cjs_dep = __commonJS({
  "src/cjs-dep.cjs"(exports, module) {
    module.exports = {
      cjsDep() {
        return "M_CJS_DEP";
      }
    };
  }
});

// src/esm-required.js
var esm_required_exports = {};
__export(esm_required_exports, {
  esmRequired: () => esmRequired
});
function esmRequired() {
  return "M_ESM_REQUIRED";
}
var init_esm_required = __esm({
  "src/esm-required.js"() {
  }
});

// src/esm-dep.js
function esmDep() {
  return "M_ESM_DEP";
}

// src/entry.js
var import_cjs_default = __toESM(require_cjs_default(), 1);

// src/side-effect.js
globalThis.M_SIDE_EFFECT = "M_SIDE_EFFECT";

// src/entry.js
var { cjsDep } = require_cjs_dep();
var { esmRequired: esmRequired2 } = (init_esm_required(), __toCommonJS(esm_required_exports));
function run() {
  return [esmDep(), (0, import_cjs_default.default)(), cjsDep(), esmRequired2(), globalThis.M_SIDE_EFFECT, () => import("./lazy-dep-3QW5F3ED.js").then((m) => m.lazyDep())];
}

// src/index.js
globalThis.out = run();
//# sourceMappingURL=index.js.map
