(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
1705, ((__turbopack_context__, module, exports) => {
"use strict";

function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
exports._ = _interop_require_default;
}),
2456, ((__turbopack_context__, module, exports) => {
"use strict";

function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) return obj;
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") return {
        default: obj
    };
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) return cache.get(obj);
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) Object.defineProperty(newObj, key, desc);
            else newObj[key] = obj[key];
        }
    }
    newObj.default = obj;
    if (cache) cache.set(obj, newObj);
    return newObj;
}
exports._ = _interop_require_wildcard;
}),
955, ((__turbopack_context__, module, exports) => {

(function() {
    var e = {
        156: function(e) {
            var t = e.exports = {};
            var r;
            var n;
            function defaultSetTimout() {
                throw new Error("setTimeout has not been defined");
            }
            function defaultClearTimeout() {
                throw new Error("clearTimeout has not been defined");
            }
            (function() {
                try {
                    if (typeof setTimeout === "function") {
                        r = setTimeout;
                    } else {
                        r = defaultSetTimout;
                    }
                } catch (e) {
                    r = defaultSetTimout;
                }
                try {
                    if (typeof clearTimeout === "function") {
                        n = clearTimeout;
                    } else {
                        n = defaultClearTimeout;
                    }
                } catch (e) {
                    n = defaultClearTimeout;
                }
            })();
            function runTimeout(e) {
                if (r === setTimeout) {
                    return setTimeout(e, 0);
                }
                if ((r === defaultSetTimout || !r) && setTimeout) {
                    r = setTimeout;
                    return setTimeout(e, 0);
                }
                try {
                    return r(e, 0);
                } catch (t) {
                    try {
                        return r.call(null, e, 0);
                    } catch (t) {
                        return r.call(this, e, 0);
                    }
                }
            }
            function runClearTimeout(e) {
                if (n === clearTimeout) {
                    return clearTimeout(e);
                }
                if ((n === defaultClearTimeout || !n) && clearTimeout) {
                    n = clearTimeout;
                    return clearTimeout(e);
                }
                try {
                    return n(e);
                } catch (t) {
                    try {
                        return n.call(null, e);
                    } catch (t) {
                        return n.call(this, e);
                    }
                }
            }
            var i = [];
            var o = false;
            var u;
            var a = -1;
            function cleanUpNextTick() {
                if (!o || !u) {
                    return;
                }
                o = false;
                if (u.length) {
                    i = u.concat(i);
                } else {
                    a = -1;
                }
                if (i.length) {
                    drainQueue();
                }
            }
            function drainQueue() {
                if (o) {
                    return;
                }
                var e = runTimeout(cleanUpNextTick);
                o = true;
                var t = i.length;
                while(t){
                    u = i;
                    i = [];
                    while(++a < t){
                        if (u) {
                            u[a].run();
                        }
                    }
                    a = -1;
                    t = i.length;
                }
                u = null;
                o = false;
                runClearTimeout(e);
            }
            t.nextTick = function(e) {
                var t = new Array(arguments.length - 1);
                if (arguments.length > 1) {
                    for(var r = 1; r < arguments.length; r++){
                        t[r - 1] = arguments[r];
                    }
                }
                i.push(new Item(e, t));
                if (i.length === 1 && !o) {
                    runTimeout(drainQueue);
                }
            };
            function Item(e, t) {
                this.fun = e;
                this.array = t;
            }
            Item.prototype.run = function() {
                this.fun.apply(null, this.array);
            };
            t.title = "browser";
            t.browser = true;
            t.env = {};
            t.argv = [];
            t.version = "";
            t.versions = {};
            function noop() {}
            t.on = noop;
            t.addListener = noop;
            t.once = noop;
            t.off = noop;
            t.removeListener = noop;
            t.removeAllListeners = noop;
            t.emit = noop;
            t.prependListener = noop;
            t.prependOnceListener = noop;
            t.listeners = function(e) {
                return [];
            };
            t.binding = function(e) {
                throw new Error("process.binding is not supported");
            };
            t.cwd = function() {
                return "/";
            };
            t.chdir = function(e) {
                throw new Error("process.chdir is not supported");
            };
            t.umask = function() {
                return 0;
            };
        }
    };
    var t = {};
    function __nccwpck_require__(r) {
        var n = t[r];
        if (n !== undefined) {
            return n.exports;
        }
        var i = t[r] = {
            exports: {}
        };
        var o = true;
        try {
            e[r](i, i.exports, __nccwpck_require__);
            o = false;
        } finally{
            if (o) delete t[r];
        }
        return i.exports;
    }
    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = ("TURBOPACK compile-time value", "/ROOT/node_modules/next/dist/compiled/process") + "/";
    var r = __nccwpck_require__(156);
    module.exports = r;
})();
}),
461, ((__turbopack_context__, module, exports) => {
"use strict";

var _global_process, _global_process1;
module.exports = ((_global_process = /*TURBOPACK member replacement*/ __turbopack_context__.g.process) == null ? void 0 : _global_process.env) && typeof ((_global_process1 = /*TURBOPACK member replacement*/ __turbopack_context__.g.process) == null ? void 0 : _global_process1.env) === 'object' ? /*TURBOPACK member replacement*/ __turbopack_context__.g.process : __turbopack_context__.r(955);
}),
8805, ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "static/chunks/3k_s29v46utbx.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport(9466);
    });
});
}),
8761, ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "static/chunks/19jeumqomlcjr.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport(3594);
    });
});
}),
3584, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HeadManagerContext", {
    enumerable: true,
    get: function() {
        return HeadManagerContext;
    }
});
const _interop_require_default = __turbopack_context__.r(1705);
const _react = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r(1788));
const HeadManagerContext = _react.default.createContext({});
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
}),
9129, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    DecodeError: null,
    MiddlewareNotFoundError: null,
    MissingStaticPage: null,
    NormalizeError: null,
    PageNotFoundError: null,
    SP: null,
    ST: null,
    WEB_VITALS: null,
    execOnce: null,
    getDisplayName: null,
    getLocationOrigin: null,
    getURL: null,
    isAbsoluteUrl: null,
    isResSent: null,
    loadGetInitialProps: null,
    normalizeRepeatedSlashes: null,
    stringifyError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    DecodeError: function() {
        return DecodeError;
    },
    MiddlewareNotFoundError: function() {
        return MiddlewareNotFoundError;
    },
    MissingStaticPage: function() {
        return MissingStaticPage;
    },
    NormalizeError: function() {
        return NormalizeError;
    },
    PageNotFoundError: function() {
        return PageNotFoundError;
    },
    SP: function() {
        return SP;
    },
    ST: function() {
        return ST;
    },
    WEB_VITALS: function() {
        return WEB_VITALS;
    },
    execOnce: function() {
        return execOnce;
    },
    getDisplayName: function() {
        return getDisplayName;
    },
    getLocationOrigin: function() {
        return getLocationOrigin;
    },
    getURL: function() {
        return getURL;
    },
    isAbsoluteUrl: function() {
        return isAbsoluteUrl;
    },
    isResSent: function() {
        return isResSent;
    },
    loadGetInitialProps: function() {
        return loadGetInitialProps;
    },
    normalizeRepeatedSlashes: function() {
        return normalizeRepeatedSlashes;
    },
    stringifyError: function() {
        return stringifyError;
    }
});
const WEB_VITALS = [
    'CLS',
    'FCP',
    'FID',
    'INP',
    'LCP',
    'TTFB'
];
function execOnce(fn) {
    let used = false;
    let result;
    return (...args)=>{
        if (!used) {
            used = true;
            result = fn(...args);
        }
        return result;
    };
}
// Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
// Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
const ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
const isAbsoluteUrl = (url)=>{
    // Fast path: an absolute URL must start with a letter (the scheme).
    // Check for a-z and A-Z without the cost of the regex.
    const c = url.charCodeAt(0);
    const isLetter = c >= 65 /* A */  && c <= 90 || c >= 97 /* a */  && c <= 122;
    /* z */ if (!isLetter) {
        return false;
    }
    return ABSOLUTE_URL_REGEX.test(url);
};
function getLocationOrigin() {
    const { protocol, hostname, port } = window.location;
    return `${protocol}//${hostname}${port ? ':' + port : ''}`;
}
function getURL() {
    const { href } = window.location;
    const origin = getLocationOrigin();
    return href.substring(origin.length);
}
function getDisplayName(Component) {
    return typeof Component === 'string' ? Component : Component.displayName || Component.name || 'Unknown';
}
function isResSent(res) {
    return res.finished || res.headersSent;
}
function normalizeRepeatedSlashes(url) {
    const urlParts = url.split('?');
    const urlNoQuery = urlParts[0];
    return urlNoQuery // first we replace any non-encoded backslashes with forward
    // then normalize repeated forward slashes
    .replace(/\\/g, '/').replace(/\/\/+/g, '/') + (urlParts[1] ? `?${urlParts.slice(1).join('?')}` : '');
}
async function loadGetInitialProps(App, ctx) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // when called from _app `ctx` is nested in `ctx`
    const res = ctx.res || ctx.ctx && ctx.ctx.res;
    if (!App.getInitialProps) {
        if (ctx.ctx && ctx.Component) {
            // @ts-ignore pageProps default
            return {
                pageProps: await loadGetInitialProps(ctx.Component, ctx.ctx)
            };
        }
        return {};
    }
    const props = await App.getInitialProps(ctx);
    if (res && isResSent(res)) {
        return props;
    }
    if (!props) {
        const message = `"${getDisplayName(App)}.getInitialProps()" should resolve to an object. But found "${props}" instead.`;
        throw Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
            value: "E1025",
            enumerable: false,
            configurable: true
        });
    }
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return props;
}
const SP = typeof performance !== 'undefined';
const ST = SP && [
    'mark',
    'measure',
    'getEntriesByName'
].every((method)=>typeof performance[method] === 'function');
class DecodeError extends Error {
}
class NormalizeError extends Error {
}
class PageNotFoundError extends Error {
    constructor(page){
        super();
        this.code = 'ENOENT';
        this.name = 'PageNotFoundError';
        this.message = `Cannot find module for page: ${page}`;
    }
}
class MissingStaticPage extends Error {
    constructor(page, message){
        super();
        this.message = `Failed to load static file for page: ${page} ${message}`;
    }
}
class MiddlewareNotFoundError extends Error {
    constructor(){
        super();
        this.code = 'ENOENT';
        this.message = `Cannot find the middleware module`;
    }
}
function stringifyError(error) {
    return JSON.stringify({
        message: error.message,
        stack: error.stack
    });
}
}),
8481, ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
function jsxProd(type, config, maybeKey) {
    var key = null;
    void 0 !== maybeKey && (key = "" + maybeKey);
    void 0 !== config.key && (key = "" + config.key);
    if ("key" in config) {
        maybeKey = {};
        for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
    } else maybeKey = config;
    config = maybeKey.ref;
    return {
        $$typeof: REACT_ELEMENT_TYPE,
        type: type,
        key: key,
        ref: void 0 !== config ? config : null,
        props: maybeKey
    };
}
exports.Fragment = REACT_FRAGMENT_TYPE;
exports.jsx = jsxProd;
exports.jsxs = jsxProd;
}),
1398, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
'use strict';
if ("TURBOPACK compile-time truthy", 1) {
    module.exports = __turbopack_context__.r(8481);
} else //TURBOPACK unreachable
;
}),
1556, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
function getIteratorFn(maybeIterable) {
    if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
    maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
    return "function" === typeof maybeIterable ? maybeIterable : null;
}
var ReactNoopUpdateQueue = {
    isMounted: function() {
        return !1;
    },
    enqueueForceUpdate: function() {},
    enqueueReplaceState: function() {},
    enqueueSetState: function() {}
}, assign = Object.assign, emptyObject = {};
function Component(props, context, updater) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
}
Component.prototype.isReactComponent = {};
Component.prototype.setState = function(partialState, callback) {
    if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, partialState, callback, "setState");
};
Component.prototype.forceUpdate = function(callback) {
    this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
};
function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;
function PureComponent(props, context, updater) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
}
var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
pureComponentPrototype.constructor = PureComponent;
assign(pureComponentPrototype, Component.prototype);
pureComponentPrototype.isPureReactComponent = !0;
var isArrayImpl = Array.isArray;
function noop() {}
var ReactSharedInternals = {
    H: null,
    A: null,
    T: null,
    S: null
}, hasOwnProperty = Object.prototype.hasOwnProperty;
function ReactElement(type, key, props) {
    var refProp = props.ref;
    return {
        $$typeof: REACT_ELEMENT_TYPE,
        type: type,
        key: key,
        ref: void 0 !== refProp ? refProp : null,
        props: props
    };
}
function cloneAndReplaceKey(oldElement, newKey) {
    return ReactElement(oldElement.type, newKey, oldElement.props);
}
function isValidElement(object) {
    return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
}
function escape(key) {
    var escaperLookup = {
        "=": "=0",
        ":": "=2"
    };
    return "$" + key.replace(/[=:]/g, function(match) {
        return escaperLookup[match];
    });
}
var userProvidedKeyEscapeRegex = /\/+/g;
function getElementKey(element, index) {
    return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
}
function resolveThenable(thenable) {
    switch(thenable.status){
        case "fulfilled":
            return thenable.value;
        case "rejected":
            throw thenable.reason;
        default:
            switch("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(function(fulfilledValue) {
                "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
            }, function(error) {
                "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
            })), thenable.status){
                case "fulfilled":
                    return thenable.value;
                case "rejected":
                    throw thenable.reason;
            }
    }
    throw thenable;
}
function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
    var type = typeof children;
    if ("undefined" === type || "boolean" === type) children = null;
    var invokeCallback = !1;
    if (null === children) invokeCallback = !0;
    else switch(type){
        case "bigint":
        case "string":
        case "number":
            invokeCallback = !0;
            break;
        case "object":
            switch(children.$$typeof){
                case REACT_ELEMENT_TYPE:
                case REACT_PORTAL_TYPE:
                    invokeCallback = !0;
                    break;
                case REACT_LAZY_TYPE:
                    return invokeCallback = children._init, mapIntoArray(invokeCallback(children._payload), array, escapedPrefix, nameSoFar, callback);
            }
    }
    if (invokeCallback) return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
        return c;
    })) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(callback, escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(userProvidedKeyEscapeRegex, "$&/") + "/") + invokeCallback)), array.push(callback)), 1;
    invokeCallback = 0;
    var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
    if (isArrayImpl(children)) for(var i = 0; i < children.length; i++)nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
    else if (i = getIteratorFn(children), "function" === typeof i) for(children = i.call(children), i = 0; !(nameSoFar = children.next()).done;)nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
    else if ("object" === type) {
        if ("function" === typeof children.then) return mapIntoArray(resolveThenable(children), array, escapedPrefix, nameSoFar, callback);
        array = String(children);
        throw Error("Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead.");
    }
    return invokeCallback;
}
function mapChildren(children, func, context) {
    if (null == children) return children;
    var result = [], count = 0;
    mapIntoArray(children, result, "", "", function(child) {
        return func.call(context, child, count++);
    });
    return result;
}
function lazyInitializer(payload) {
    if (-1 === payload._status) {
        var ctor = payload._result, thenable = ctor();
        thenable.then(function(moduleObject) {
            if (0 === payload._status || -1 === payload._status) payload._status = 1, payload._result = moduleObject, void 0 === thenable.status && (thenable.status = "fulfilled", thenable.value = moduleObject);
        }, function(error) {
            if (0 === payload._status || -1 === payload._status) payload._status = 2, payload._result = error, void 0 === thenable.status && (thenable.status = "rejected", thenable.reason = error);
        });
        -1 === payload._status && (payload._status = 0, payload._result = thenable);
    }
    if (1 === payload._status) return payload._result.default;
    throw payload._result;
}
var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
    if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
        var event = new window.ErrorEvent("error", {
            bubbles: !0,
            cancelable: !0,
            message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
            error: error
        });
        if (!window.dispatchEvent(event)) return;
    } else if ("object" === typeof __TURBOPACK__imported__module__461__["default"] && "function" === typeof __TURBOPACK__imported__module__461__["default"].emit) {
        __TURBOPACK__imported__module__461__["default"].emit("uncaughtException", error);
        return;
    }
    console.error(error);
};
function startTransition(scope) {
    var prevTransition = ReactSharedInternals.T, currentTransition = {};
    currentTransition.types = null !== prevTransition ? prevTransition.types : null;
    ReactSharedInternals.T = currentTransition;
    try {
        var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
        null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
        "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
    } catch (error) {
        reportGlobalError(error);
    } finally{
        null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
    }
}
function addTransitionType(type) {
    var transition = ReactSharedInternals.T;
    if (null !== transition) {
        var transitionTypes = transition.types;
        null === transitionTypes ? transition.types = [
            type
        ] : -1 === transitionTypes.indexOf(type) && transitionTypes.push(type);
    } else startTransition(addTransitionType.bind(null, type));
}
var Children = {
    map: mapChildren,
    forEach: function(children, forEachFunc, forEachContext) {
        mapChildren(children, function() {
            forEachFunc.apply(this, arguments);
        }, forEachContext);
    },
    count: function(children) {
        var n = 0;
        mapChildren(children, function() {
            n++;
        });
        return n;
    },
    toArray: function(children) {
        return mapChildren(children, function(child) {
            return child;
        }) || [];
    },
    only: function(children) {
        if (!isValidElement(children)) throw Error("React.Children.only expected to receive a single React element child.");
        return children;
    }
};
exports.Activity = REACT_ACTIVITY_TYPE;
exports.Children = Children;
exports.Component = Component;
exports.Fragment = REACT_FRAGMENT_TYPE;
exports.Profiler = REACT_PROFILER_TYPE;
exports.PureComponent = PureComponent;
exports.StrictMode = REACT_STRICT_MODE_TYPE;
exports.Suspense = REACT_SUSPENSE_TYPE;
exports.ViewTransition = REACT_VIEW_TRANSITION_TYPE;
exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
exports.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(size) {
        return ReactSharedInternals.H.useMemoCache(size);
    }
};
exports.addTransitionType = addTransitionType;
exports.cache = function(fn) {
    return function() {
        return fn.apply(null, arguments);
    };
};
exports.cacheSignal = function() {
    return null;
};
exports.cloneElement = function(element, config, children) {
    if (null === element || void 0 === element) throw Error("The argument must be a React element, but you passed " + element + ".");
    var props = assign({}, element.props), key = element.key;
    if (null != config) for(propName in void 0 !== config.key && (key = "" + config.key), config)!hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
    var propName = arguments.length - 2;
    if (1 === propName) props.children = children;
    else if (1 < propName) {
        for(var childArray = Array(propName), i = 0; i < propName; i++)childArray[i] = arguments[i + 2];
        props.children = childArray;
    }
    return ReactElement(element.type, key, props);
};
exports.createContext = function(defaultValue) {
    defaultValue = {
        $$typeof: REACT_CONTEXT_TYPE,
        _currentValue: defaultValue,
        _currentValue2: defaultValue,
        _threadCount: 0,
        Provider: null,
        Consumer: null
    };
    defaultValue.Provider = defaultValue;
    defaultValue.Consumer = {
        $$typeof: REACT_CONSUMER_TYPE,
        _context: defaultValue
    };
    return defaultValue;
};
exports.createElement = function(type, config, children) {
    var propName, props = {}, key = null;
    if (null != config) for(propName in void 0 !== config.key && (key = "" + config.key), config)hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
    var childrenLength = arguments.length - 2;
    if (1 === childrenLength) props.children = children;
    else if (1 < childrenLength) {
        for(var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)childArray[i] = arguments[i + 2];
        props.children = childArray;
    }
    if (type && type.defaultProps) for(propName in childrenLength = type.defaultProps, childrenLength)void 0 === props[propName] && (props[propName] = childrenLength[propName]);
    return ReactElement(type, key, props);
};
exports.createRef = function() {
    return {
        current: null
    };
};
exports.forwardRef = function(render) {
    return {
        $$typeof: REACT_FORWARD_REF_TYPE,
        render: render
    };
};
exports.isValidElement = isValidElement;
exports.lazy = function(ctor) {
    return {
        $$typeof: REACT_LAZY_TYPE,
        _payload: {
            _status: -1,
            _result: ctor
        },
        _init: lazyInitializer
    };
};
exports.memo = function(type, compare) {
    return {
        $$typeof: REACT_MEMO_TYPE,
        type: type,
        compare: void 0 === compare ? null : compare
    };
};
exports.startTransition = startTransition;
exports.unstable_useCacheRefresh = function() {
    return ReactSharedInternals.H.useCacheRefresh();
};
exports.use = function(usable) {
    return ReactSharedInternals.H.use(usable);
};
exports.useActionState = function(action, initialState, permalink) {
    return ReactSharedInternals.H.useActionState(action, initialState, permalink);
};
exports.useCallback = function(callback, deps) {
    return ReactSharedInternals.H.useCallback(callback, deps);
};
exports.useContext = function(Context) {
    return ReactSharedInternals.H.useContext(Context);
};
exports.useDebugValue = function() {};
exports.useDeferredValue = function(value, initialValue) {
    return ReactSharedInternals.H.useDeferredValue(value, initialValue);
};
exports.useEffect = function(create, deps) {
    return ReactSharedInternals.H.useEffect(create, deps);
};
exports.useEffectEvent = function(callback) {
    return ReactSharedInternals.H.useEffectEvent(callback);
};
exports.useId = function() {
    return ReactSharedInternals.H.useId();
};
exports.useImperativeHandle = function(ref, create, deps) {
    return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
};
exports.useInsertionEffect = function(create, deps) {
    return ReactSharedInternals.H.useInsertionEffect(create, deps);
};
exports.useLayoutEffect = function(create, deps) {
    return ReactSharedInternals.H.useLayoutEffect(create, deps);
};
exports.useMemo = function(create, deps) {
    return ReactSharedInternals.H.useMemo(create, deps);
};
exports.useOptimistic = function(passthrough, reducer) {
    return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
};
exports.useReducer = function(reducer, initialArg, init) {
    return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
};
exports.useRef = function(initialValue) {
    return ReactSharedInternals.H.useRef(initialValue);
};
exports.useState = function(initialState) {
    return ReactSharedInternals.H.useState(initialState);
};
exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
    return ReactSharedInternals.H.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
exports.useTransition = function() {
    return ReactSharedInternals.H.useTransition();
};
exports.version = "19.3.0";
}),
1788, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
'use strict';
if ("TURBOPACK compile-time truthy", 1) {
    module.exports = __turbopack_context__.r(1556);
} else //TURBOPACK unreachable
;
}),
350, ((__turbopack_context__) => {
"use strict";

// MERGED MODULE: [project]/work/auto/next-app/pages/index.jsx [client] (ecmascript)
;
var __TURBOPACK__imported__module__1398__ = __turbopack_context__.i(1398);
// MERGED MODULE: [project]/work/auto/src/entry.js [client] (ecmascript)
;
// MERGED MODULE: [project]/work/auto/src/esm-dep.js [client] (ecmascript)
;
function esmDep() {
    return 'M_ESM_DEP';
}
var __TURBOPACK__imported__module__9422__ = __turbopack_context__.i(9422);
var __TURBOPACK__imported__module__1323__ = __turbopack_context__.i(1323);
;
;
;
;
const { cjsDep } = __turbopack_context__.r(1934);
const { esmRequired } = __turbopack_context__.r(2989);
function run() {
    return [
        esmDep(),
        (0, __TURBOPACK__imported__module__9422__["default"])(),
        cjsDep(),
        esmRequired(),
        globalThis.M_SIDE_EFFECT,
        ()=>__turbopack_context__.A(3105).then((m)=>m.lazyDep())
    ];
}
;
;
function Page() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__1398__["jsx"])("p", {
        children: String(run().slice(0, 5))
    });
}
__turbopack_context__.s([
    "default",
    0,
    Page
], 350);
}),
3679, ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r(350);
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
9422, ((__turbopack_context__, module, exports) => {

module.exports = function cjsDefault() {
    return 'M_CJS_DEFAULT';
};
}),
1323, ((__turbopack_context__, module, exports) => {

globalThis.M_SIDE_EFFECT = 'M_SIDE_EFFECT';
}),
1934, ((__turbopack_context__, module, exports) => {

module.exports = {
    cjsDep () {
        return 'M_CJS_DEP';
    }
};
}),
2989, ((__turbopack_context__) => {
"use strict";

function esmRequired() {
    return 'M_ESM_REQUIRED';
}
__turbopack_context__.s([
    "esmRequired",
    0,
    esmRequired
]);
}),
3105, ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "static/chunks/11stsw_um_3ru.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport(9131);
    });
});
}),
]);

//# sourceMappingURL=38hjw4wjdmpwh.js.map