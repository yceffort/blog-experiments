(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
560, ((__turbopack_context__, module, exports) => {

"trimStart" in String.prototype || (String.prototype.trimStart = String.prototype.trimLeft), "trimEnd" in String.prototype || (String.prototype.trimEnd = String.prototype.trimRight), "description" in Symbol.prototype || Object.defineProperty(Symbol.prototype, "description", {
    configurable: !0,
    get: function() {
        var t = /\((.*)\)/.exec(this.toString());
        return t ? t[1] : void 0;
    }
}), Array.prototype.flat || (Array.prototype.flat = function(t, r) {
    return r = this.concat.apply([], this), t > 1 && r.some(Array.isArray) ? r.flat(t - 1) : r;
}, Array.prototype.flatMap = function(t, r) {
    return this.map(t, r).flat();
}), Promise.prototype.finally || (Promise.prototype.finally = function(t) {
    if ("function" != typeof t) return this.then(t, t);
    var r = this.constructor || Promise;
    return this.then(function(n) {
        return r.resolve(t()).then(function() {
            return n;
        });
    }, function(n) {
        return r.resolve(t()).then(function() {
            throw n;
        });
    });
}), Object.fromEntries || (Object.fromEntries = function(t) {
    return Array.from(t).reduce(function(t, r) {
        return t[r[0]] = r[1], t;
    }, {});
}), Array.prototype.at || (Array.prototype.at = function(t) {
    var r = Math.trunc(t) || 0;
    if (r < 0 && (r += this.length), !(r < 0 || r >= this.length)) return this[r];
}), Object.hasOwn || (Object.hasOwn = function(t, r) {
    if (null == t) throw new TypeError("Cannot convert undefined or null to object");
    return Object.prototype.hasOwnProperty.call(Object(t), r);
}), "canParse" in URL || (URL.canParse = function(t, r) {
    try {
        return !!new URL(t, r);
    } catch (t) {
        return !1;
    }
});
}),
3788, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
/* global location */ // imports polyfill from `@next/polyfill-module` after build.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    emitter: null,
    hydrate: null,
    initialize: null,
    router: null,
    version: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    emitter: function() {
        return emitter;
    },
    hydrate: function() {
        return hydrate;
    },
    initialize: function() {
        return initialize;
    },
    router: function() {
        return router;
    },
    version: function() {
        return version;
    }
});
const _interop_require_default = __turbopack_context__.r(1705);
const _jsxruntime = __turbopack_context__.r(1398);
__turbopack_context__.r(560);
const _react = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r(1788));
const _client = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r(1912));
const _headmanagercontextsharedruntime = __turbopack_context__.r(3584);
const _mitt = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r(7194));
const _routercontextsharedruntime = __turbopack_context__.r(5479);
const _disablesmoothscroll = __turbopack_context__.r(1280);
const _isdynamic = __turbopack_context__.r(8690);
const _querystring = __turbopack_context__.r(8928);
const _utils = __turbopack_context__.r(9129);
const _portal = __turbopack_context__.r(8035);
const _headmanager = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r(11));
const _pageloader = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r(7020));
const _routeannouncer = __turbopack_context__.r(5117);
const _router = __turbopack_context__.r(6990);
const _iserror = __turbopack_context__.r(3910);
const _imageconfigcontextsharedruntime = __turbopack_context__.r(3521);
const _removebasepath = __turbopack_context__.r(4691);
const _hasbasepath = __turbopack_context__.r(8186);
const _approutercontextsharedruntime = __turbopack_context__.r(1085);
const _adapters = __turbopack_context__.r(8126);
const _hooksclientcontextsharedruntime = __turbopack_context__.r(8);
const _onrecoverableerror = __turbopack_context__.r(5290);
const _tracer = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r(9651));
const _isnextroutererror = __turbopack_context__.r(8934);
const version = "16.3.8";
let router;
const emitter = (0, _mitt.default)();
const looseToArray = (input)=>[].slice.call(input);
let initialData;
let defaultLocale = undefined;
let asPath;
let pageLoader;
let appElement;
let headManager;
let initialMatchesMiddleware = false;
let lastAppProps;
let lastRenderReject;
let devClient;
let CachedApp, onPerfEntry;
let CachedComponent;
class Container extends _react.default.Component {
    componentDidCatch(componentErr, info) {
        this.props.fn(componentErr, info);
    }
    componentDidMount() {
        this.scrollToHash();
        // We need to replace the router state if:
        // - the page was (auto) exported and has a query string or search (hash)
        // - it was auto exported and is a dynamic route (to provide params)
        // - if it is a client-side skeleton (fallback render)
        // - if middleware matches the current page (may have rewrite params)
        // - if rewrites in next.config.js match (may have rewrite params)
        if (router.isSsr && (initialData.isFallback || initialData.nextExport && ((0, _isdynamic.isDynamicRoute)(router.pathname) || location.search || ("TURBOPACK compile-time value", false) || initialMatchesMiddleware) || initialData.props && initialData.props.__N_SSG && (location.search || ("TURBOPACK compile-time value", false) || initialMatchesMiddleware))) {
            // update query on mount for exported pages
            router.replace(router.pathname + '?' + String((0, _querystring.assign)((0, _querystring.urlQueryToSearchParams)(router.query), new URLSearchParams(location.search))), asPath, {
                // @ts-ignore
                // WARNING: `_h` is an internal option for handing Next.js
                // client-side hydration. Your app should _never_ use this property.
                // It may change at any time without notice.
                _h: 1,
                // Fallback pages must trigger the data fetch, so the transition is
                // not shallow.
                // Other pages (strictly updating query) happens shallowly, as data
                // requirements would already be present.
                shallow: !initialData.isFallback && !initialMatchesMiddleware
            }).catch((err)=>{
                if (!err.cancelled) throw err;
            });
        }
    }
    componentDidUpdate() {
        this.scrollToHash();
    }
    scrollToHash() {
        let { hash } = location;
        hash = hash && hash.substring(1);
        if (!hash) return;
        const el = document.getElementById(hash);
        if (!el) return;
        // If we call scrollIntoView() in here without a setTimeout
        // it won't scroll properly.
        setTimeout(()=>el.scrollIntoView(), 0);
    }
    render() {
        if ("TURBOPACK compile-time truthy", 1) {
            return this.props.children;
        } else //TURBOPACK unreachable
        ;
    }
}
async function initialize(opts = {}) {
    // This makes sure this specific lines are removed in production
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    initialData = JSON.parse(document.getElementById('__NEXT_DATA__').textContent);
    window.__NEXT_DATA__ = initialData;
    defaultLocale = initialData.defaultLocale;
    const prefix = initialData.assetPrefix || '';
    self.__next_set_public_path__(`${prefix}/_next/`);
    asPath = (0, _utils.getURL)();
    // make sure not to attempt stripping basePath for 404s
    if ((0, _hasbasepath.hasBasePath)(asPath)) {
        asPath = (0, _removebasepath.removeBasePath)(asPath);
    }
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if (initialData.scriptLoader) {
        const { initScriptLoader } = __turbopack_context__.r(1457);
        initScriptLoader(initialData.scriptLoader);
    }
    pageLoader = new _pageloader.default(initialData.buildId, prefix);
    const register = ([r, f])=>pageLoader.routeLoader.onEntrypoint(r, f);
    if (window.__NEXT_P) {
        // Defer page registration for another tick. This will increase the overall
        // latency in hydrating the page, but reduce the total blocking time.
        window.__NEXT_P.map((p)=>setTimeout(()=>register(p), 0));
    }
    window.__NEXT_P = [];
    window.__NEXT_P.push = register;
    headManager = (0, _headmanager.default)();
    headManager.getIsSsr = ()=>{
        return router.isSsr;
    };
    appElement = document.getElementById('__next');
    return {
        assetPrefix: prefix
    };
}
function renderApp(App, appProps) {
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(App, {
        ...appProps
    });
}
function AppContainer({ children }) {
    // Create a memoized value for next/navigation router context.
    const adaptedForAppRouter = _react.default.useMemo(()=>{
        return (0, _adapters.adaptForAppRouterInstance)(router);
    }, []);
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(Container, {
        fn: (error)=>renderError({
                App: CachedApp,
                err: error
            }).catch((err)=>console.error('Error rendering page: ', err)),
        children: /*#__PURE__*/ (0, _jsxruntime.jsx)(_approutercontextsharedruntime.AppRouterContext.Provider, {
            value: adaptedForAppRouter,
            children: /*#__PURE__*/ (0, _jsxruntime.jsx)(_hooksclientcontextsharedruntime.SearchParamsContext.Provider, {
                value: (0, _adapters.adaptForSearchParams)(router),
                children: /*#__PURE__*/ (0, _jsxruntime.jsx)(_adapters.PathnameContextProviderAdapter, {
                    router: router,
                    isAutoExport: self.__NEXT_DATA__.autoExport ?? false,
                    children: /*#__PURE__*/ (0, _jsxruntime.jsx)(_hooksclientcontextsharedruntime.PathParamsContext.Provider, {
                        value: (0, _adapters.adaptForPathParams)(router),
                        children: /*#__PURE__*/ (0, _jsxruntime.jsx)(_routercontextsharedruntime.RouterContext.Provider, {
                            value: (0, _router.makePublicRouterInstance)(router),
                            children: /*#__PURE__*/ (0, _jsxruntime.jsx)(_headmanagercontextsharedruntime.HeadManagerContext.Provider, {
                                value: headManager,
                                children: /*#__PURE__*/ (0, _jsxruntime.jsx)(_imageconfigcontextsharedruntime.ImageConfigContext.Provider, {
                                    value: ("TURBOPACK compile-time value", {
                                        "deviceSizes": ("TURBOPACK compile-time value", [
                                            ("TURBOPACK compile-time value", 640),
                                            ("TURBOPACK compile-time value", 750),
                                            ("TURBOPACK compile-time value", 828),
                                            ("TURBOPACK compile-time value", 1080),
                                            ("TURBOPACK compile-time value", 1200),
                                            ("TURBOPACK compile-time value", 1920),
                                            ("TURBOPACK compile-time value", 2048),
                                            ("TURBOPACK compile-time value", 3840)
                                        ]),
                                        "imageSizes": ("TURBOPACK compile-time value", [
                                            ("TURBOPACK compile-time value", 32),
                                            ("TURBOPACK compile-time value", 48),
                                            ("TURBOPACK compile-time value", 64),
                                            ("TURBOPACK compile-time value", 96),
                                            ("TURBOPACK compile-time value", 128),
                                            ("TURBOPACK compile-time value", 256),
                                            ("TURBOPACK compile-time value", 384)
                                        ]),
                                        "qualities": ("TURBOPACK compile-time value", [
                                            ("TURBOPACK compile-time value", 75)
                                        ]),
                                        "path": ("TURBOPACK compile-time value", "/_next/image"),
                                        "loader": ("TURBOPACK compile-time value", "default"),
                                        "dangerouslyAllowSVG": ("TURBOPACK compile-time value", false),
                                        "unoptimized": ("TURBOPACK compile-time value", false)
                                    }),
                                    children: children
                                })
                            })
                        })
                    })
                })
            })
        })
    });
}
const wrapApp = (App)=>(wrappedAppProps)=>{
        const appProps = {
            ...wrappedAppProps,
            Component: CachedComponent,
            err: initialData.err,
            router
        };
        return /*#__PURE__*/ (0, _jsxruntime.jsx)(AppContainer, {
            children: renderApp(App, appProps)
        });
    };
// This method handles all runtime and debug errors.
// 404 and 500 errors are special kind of errors
// and they are still handle via the main render method.
function renderError(renderErrorProps) {
    let { App, err } = renderErrorProps;
    // In development runtime errors are caught by our overlay
    // In production we catch runtime errors using componentDidCatch which will trigger renderError
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Make sure we log the error to the console, otherwise users can't track down issues.
    console.error(err);
    console.error(`A client-side exception has occurred, see here for more info: https://nextjs.org/docs/messages/client-side-exception-occurred`);
    return pageLoader.loadPage('/_error').then(({ page: ErrorComponent, styleSheets })=>{
        return lastAppProps?.Component === ErrorComponent ? __turbopack_context__.A(8761).then((errorModule)=>{
            return __turbopack_context__.A(8805).then((appModule)=>{
                App = appModule.default;
                renderErrorProps.App = App;
                return errorModule;
            });
        }).then((m)=>({
                ErrorComponent: m.default,
                styleSheets: []
            })) : {
            ErrorComponent,
            styleSheets
        };
    }).then(({ ErrorComponent, styleSheets })=>{
        // In production we do a normal render with the `ErrorComponent` as component.
        // If we've gotten here upon initial render, we can use the props from the server.
        // Otherwise, we need to call `getInitialProps` on `App` before mounting.
        const AppTree = wrapApp(App);
        const appCtx = {
            Component: ErrorComponent,
            AppTree,
            router,
            ctx: {
                err,
                pathname: initialData.page,
                query: initialData.query,
                asPath,
                AppTree
            }
        };
        return Promise.resolve(renderErrorProps.props?.err ? renderErrorProps.props : (0, _utils.loadGetInitialProps)(App, appCtx)).then((initProps)=>doRender({
                ...renderErrorProps,
                err,
                Component: ErrorComponent,
                styleSheets,
                props: initProps
            }));
    });
}
// Dummy component that we render as a child of Root so that we can
// toggle the correct styles before the page is rendered.
function Head({ callback }) {
    // We use `useLayoutEffect` to guarantee the callback is executed
    // as soon as React flushes the update.
    _react.default.useLayoutEffect(()=>callback(), [
        callback
    ]);
    return null;
}
const performanceMarks = {
    navigationStart: 'navigationStart',
    beforeRender: 'beforeRender',
    afterRender: 'afterRender',
    afterHydrate: 'afterHydrate',
    routeChange: 'routeChange'
};
const performanceMeasures = {
    hydration: 'Next.js-hydration',
    beforeHydration: 'Next.js-before-hydration',
    routeChangeToRender: 'Next.js-route-change-to-render',
    render: 'Next.js-render'
};
let reactRoot = null;
// On initial render a hydrate should always happen
let shouldHydrate = true;
function clearMarks() {
    ;
    [
        performanceMarks.beforeRender,
        performanceMarks.afterHydrate,
        performanceMarks.afterRender,
        performanceMarks.routeChange
    ].forEach((mark)=>performance.clearMarks(mark));
}
function markHydrateComplete() {
    if (!_utils.ST) return;
    performance.mark(performanceMarks.afterHydrate) // mark end of hydration
    ;
    const hasBeforeRenderMark = performance.getEntriesByName(performanceMarks.beforeRender, 'mark').length;
    if (hasBeforeRenderMark) {
        const beforeHydrationMeasure = performance.measure(performanceMeasures.beforeHydration, performanceMarks.navigationStart, performanceMarks.beforeRender);
        const hydrationMeasure = performance.measure(performanceMeasures.hydration, performanceMarks.beforeRender, performanceMarks.afterHydrate);
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    if (onPerfEntry) {
        performance.getEntriesByName(performanceMeasures.hydration).forEach(onPerfEntry);
    }
    clearMarks();
}
function markRenderComplete() {
    if (!_utils.ST) return;
    performance.mark(performanceMarks.afterRender) // mark end of render
    ;
    const navStartEntries = performance.getEntriesByName(performanceMarks.routeChange, 'mark');
    if (!navStartEntries.length) return;
    const hasBeforeRenderMark = performance.getEntriesByName(performanceMarks.beforeRender, 'mark').length;
    if (hasBeforeRenderMark) {
        performance.measure(performanceMeasures.routeChangeToRender, navStartEntries[0].name, performanceMarks.beforeRender);
        performance.measure(performanceMeasures.render, performanceMarks.beforeRender, performanceMarks.afterRender);
        if (onPerfEntry) {
            performance.getEntriesByName(performanceMeasures.render).forEach(onPerfEntry);
            performance.getEntriesByName(performanceMeasures.routeChangeToRender).forEach(onPerfEntry);
        }
    }
    clearMarks();
    [
        performanceMeasures.routeChangeToRender,
        performanceMeasures.render
    ].forEach((measure)=>performance.clearMeasures(measure));
}
function renderReactElement(domEl, fn) {
    // mark start of hydrate/render
    if (_utils.ST) {
        performance.mark(performanceMarks.beforeRender);
    }
    const reactEl = fn(shouldHydrate ? markHydrateComplete : markRenderComplete);
    if (!reactRoot) {
        // Unlike with createRoot, you don't need a separate root.render() call here
        reactRoot = _client.default.hydrateRoot(domEl, reactEl, {
            onRecoverableError: _onrecoverableerror.onRecoverableError
        });
        // TODO: Remove shouldHydrate variable when React 18 is stable as it can depend on `reactRoot` existing
        shouldHydrate = false;
    } else {
        const startTransition = _react.default.startTransition;
        startTransition(()=>{
            reactRoot.render(reactEl);
        });
    }
}
function Root({ callbacks, children }) {
    // We use `useLayoutEffect` to guarantee the callbacks are executed
    // as soon as React flushes the update
    _react.default.useLayoutEffect(()=>callbacks.forEach((callback)=>callback()), [
        callbacks
    ]);
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return children;
}
function doRender(input) {
    let { App, Component, props, err } = input;
    let styleSheets = 'initial' in input ? undefined : input.styleSheets;
    Component = Component || lastAppProps.Component;
    props = props || lastAppProps.props;
    const appProps = {
        ...props,
        Component,
        err,
        router
    };
    // lastAppProps has to be set before ReactDom.render to account for ReactDom throwing an error.
    lastAppProps = appProps;
    let canceled = false;
    let resolvePromise;
    const renderPromise = new Promise((resolve, reject)=>{
        if (lastRenderReject) {
            lastRenderReject();
        }
        resolvePromise = ()=>{
            lastRenderReject = null;
            resolve();
        };
        lastRenderReject = ()=>{
            canceled = true;
            lastRenderReject = null;
            const error = Object.defineProperty(new Error('Cancel rendering route'), "__NEXT_ERROR_CODE", {
                value: "E503",
                enumerable: false,
                configurable: true
            });
            error.cancelled = true;
            reject(error);
        };
    });
    // This function has a return type to ensure it doesn't start returning a
    // Promise. It should remain synchronous.
    function onStart() {
        if (!styleSheets || // We use `style-loader` in development, so we don't need to do anything
        // unless we're in production:
        ("TURBOPACK compile-time value", "production") !== 'production') {
            return false;
        }
        const currentStyleTags = looseToArray(document.querySelectorAll('style[data-n-href]'));
        const currentHrefs = new Set(currentStyleTags.map((tag)=>tag.getAttribute('data-n-href')));
        const noscript = document.querySelector('noscript[data-n-css]');
        const nonce = noscript?.getAttribute('data-n-css');
        styleSheets.forEach(({ href, text })=>{
            if (!currentHrefs.has(href)) {
                const styleTag = document.createElement('style');
                styleTag.setAttribute('data-n-href', href);
                styleTag.setAttribute('media', 'x');
                if (nonce) {
                    styleTag.setAttribute('nonce', nonce);
                }
                document.head.appendChild(styleTag);
                styleTag.appendChild(document.createTextNode(text));
            }
        });
        return true;
    }
    function onHeadCommit() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        if (input.scroll) {
            const { x, y } = input.scroll;
            (0, _disablesmoothscroll.disableSmoothScrollDuringRouteTransition)(()=>{
                window.scrollTo(x, y);
            });
        }
    }
    function onRootCommit() {
        resolvePromise();
    }
    onStart();
    const elem = /*#__PURE__*/ (0, _jsxruntime.jsxs)(_jsxruntime.Fragment, {
        children: [
            /*#__PURE__*/ (0, _jsxruntime.jsx)(Head, {
                callback: onHeadCommit
            }),
            /*#__PURE__*/ (0, _jsxruntime.jsxs)(AppContainer, {
                children: [
                    renderApp(App, appProps),
                    /*#__PURE__*/ (0, _jsxruntime.jsx)(_portal.Portal, {
                        type: "next-route-announcer",
                        children: /*#__PURE__*/ (0, _jsxruntime.jsx)(_routeannouncer.RouteAnnouncer, {})
                    })
                ]
            })
        ]
    });
    // We catch runtime errors using componentDidCatch which will trigger renderError
    renderReactElement(appElement, (callback)=>/*#__PURE__*/ (0, _jsxruntime.jsx)(Root, {
            callbacks: [
                callback,
                onRootCommit
            ],
            children: ("TURBOPACK compile-time falsy", 0) ? /*#__PURE__*/ "TURBOPACK unreachable" : elem
        }));
    return renderPromise;
}
async function render(renderingProps) {
    // if an error occurs in a server-side page (e.g. in getInitialProps),
    // skip re-rendering the error page client-side as data-fetching operations
    // will already have been done on the server and NEXT_DATA contains the correct
    // data for straight-forward hydration of the error page
    if (renderingProps.err && // renderingProps.Component might be undefined if there is a top/module-level error
    (typeof renderingProps.Component === 'undefined' || !renderingProps.isHydratePass)) {
        await renderError(renderingProps);
        return;
    }
    try {
        await doRender(renderingProps);
    } catch (err) {
        const renderErr = (0, _iserror.getProperError)(err);
        // bubble up cancelation errors
        if (renderErr.cancelled) {
            throw renderErr;
        }
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        await renderError({
            ...renderingProps,
            err: renderErr
        });
    }
}
async function hydrate(opts) {
    let initialErr = initialData.err;
    try {
        const appEntrypoint = await pageLoader.routeLoader.whenEntrypoint('/_app');
        if ('error' in appEntrypoint) {
            throw appEntrypoint.error;
        }
        const { component: app, exports: mod } = appEntrypoint;
        CachedApp = app;
        if (mod && mod.reportWebVitals) {
            onPerfEntry = ({ id, name, startTime, value, duration, entryType, entries, attribution })=>{
                // Combines timestamp with random number for unique ID
                const uniqueID = `${Date.now()}-${Math.floor(Math.random() * (9e12 - 1)) + 1e12}`;
                let perfStartEntry;
                if (entries && entries.length) {
                    perfStartEntry = entries[0].startTime;
                }
                const webVitals = {
                    id: id || uniqueID,
                    name,
                    startTime: startTime || perfStartEntry,
                    value: value == null ? duration : value,
                    label: entryType === 'mark' || entryType === 'measure' ? 'custom' : 'web-vital'
                };
                if (attribution) {
                    webVitals.attribution = attribution;
                }
                mod.reportWebVitals(webVitals);
            };
        }
        const pageEntrypoint = // error, so we need to skip waiting for the entrypoint.
        ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : await pageLoader.routeLoader.whenEntrypoint(initialData.page);
        if ('error' in pageEntrypoint) {
            throw pageEntrypoint.error;
        }
        CachedComponent = pageEntrypoint.component;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    } catch (error) {
        // This catches errors like throwing in the top level of a module
        initialErr = (0, _iserror.getProperError)(error);
    }
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if (window.__NEXT_PRELOADREADY) {
        await window.__NEXT_PRELOADREADY(initialData.dynamicIds);
    }
    router = (0, _router.createRouter)(initialData.page, initialData.query, asPath, {
        initialProps: initialData.props,
        pageLoader,
        App: CachedApp,
        Component: CachedComponent,
        wrapApp,
        err: initialErr,
        isFallback: Boolean(initialData.isFallback),
        subscription: (info, App, scroll)=>render(Object.assign({}, info, {
                App,
                scroll
            })),
        locale: initialData.locale,
        locales: initialData.locales,
        defaultLocale,
        domainLocales: initialData.domainLocales,
        isPreview: initialData.isPreview
    });
    initialMatchesMiddleware = await router._initialMatchesMiddlewarePromise;
    const renderCtx = {
        App: CachedApp,
        initial: true,
        Component: CachedComponent,
        props: initialData.props,
        err: initialErr,
        isHydratePass: true
    };
    if (opts?.beforeRender) {
        await opts.beforeRender();
    }
    render(renderCtx);
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
783, ((__turbopack_context__, module, exports) => {
"use strict";

// A client-side entry point for Turbopack builds. Includes logic to load chunks,
// but does not include development-time features like hot module reloading.
Object.defineProperty(exports, "__esModule", {
    value: true
});
__turbopack_context__.r(3033);
__turbopack_context__.r(7398);
const _ = __turbopack_context__.r(3788);
window.next = {
    version: _.version,
    turbopack: true,
    // router is initialized later so it has to be live-binded
    get router () {
        return _.router;
    },
    emitter: _.emitter
};
self.__next_set_public_path__ = ()=>{};
self.__webpack_hash__ = '';
(0, _.initialize)({}).then(()=>{
    // for the page loader
    ;
    self.__turbopack_load_page_chunks__ = (page, chunksData)=>{
        const chunkPromises = chunksData.map((c)=>/*TURBOPACK member replacement*/ __turbopack_context__.l(c));
        Promise.all(chunkPromises).catch((err)=>console.error('failed to load chunks for page ' + page, err));
    };
    return (0, _.hydrate)();
}).catch((err)=>{
    console.error('Error was not caught', err);
});
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
8035, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Portal", {
    enumerable: true,
    get: function() {
        return Portal;
    }
});
const _react = __turbopack_context__.r(1788);
const _reactdom = __turbopack_context__.r(943);
const Portal = ({ children, type })=>{
    const [portalNode, setPortalNode] = (0, _react.useState)(null);
    (0, _react.useEffect)(()=>{
        const element = document.createElement(type);
        document.body.appendChild(element);
        setPortalNode(element);
        return ()=>{
            document.body.removeChild(element);
        };
    }, [
        type
    ]);
    return portalNode ? /*#__PURE__*/ (0, _reactdom.createPortal)(children, portalNode) : null;
};
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
6016, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "setAttributesFromProps", {
    enumerable: true,
    get: function() {
        return setAttributesFromProps;
    }
});
const DOMAttributeNames = {
    acceptCharset: 'accept-charset',
    className: 'class',
    htmlFor: 'for',
    httpEquiv: 'http-equiv',
    noModule: 'noModule'
};
const ignoreProps = [
    'onLoad',
    'onReady',
    'dangerouslySetInnerHTML',
    'children',
    'onError',
    'strategy',
    'stylesheets'
];
function isBooleanScriptAttribute(attr) {
    return [
        'async',
        'defer',
        'noModule'
    ].includes(attr);
}
function setAttributesFromProps(el, props) {
    for (const [p, value] of Object.entries(props)){
        if (!props.hasOwnProperty(p)) continue;
        if (ignoreProps.includes(p)) continue;
        // we don't render undefined props to the DOM
        if (value === undefined) {
            continue;
        }
        const attr = DOMAttributeNames[p] || p.toLowerCase();
        if (el.tagName === 'SCRIPT' && isBooleanScriptAttribute(attr)) {
            // Correctly assign boolean script attributes
            // https://github.com/vercel/next.js/pull/20748
            ;
            el[attr] = !!value;
        } else {
            el.setAttribute(attr, String(value));
        }
        // Remove falsy non-zero boolean attributes so they are correctly interpreted
        // (e.g. if we set them to false, this coerces to the string "false", which the browser interprets as true)
        if (value === false || el.tagName === 'SCRIPT' && isBooleanScriptAttribute(attr) && (!value || value === 'false')) {
            // Call setAttribute before, as we need to set and unset the attribute to override force async:
            // https://html.spec.whatwg.org/multipage/scripting.html#script-force-async
            el.setAttribute(attr, '');
            el.removeAttribute(attr);
        }
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
11, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    isEqualNode: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    default: function() {
        return initHeadManager;
    },
    isEqualNode: function() {
        return isEqualNode;
    }
});
const _setattributesfromprops = __turbopack_context__.r(6016);
function reactElementToDOM({ type, props }) {
    const el = document.createElement(type);
    (0, _setattributesfromprops.setAttributesFromProps)(el, props);
    const { children, dangerouslySetInnerHTML } = props;
    if (dangerouslySetInnerHTML) {
        el.innerHTML = dangerouslySetInnerHTML.__html || '';
    } else if (children) {
        el.textContent = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';
    }
    return el;
}
function isEqualNode(oldTag, newTag) {
    if (oldTag instanceof HTMLElement && newTag instanceof HTMLElement) {
        const nonce = newTag.getAttribute('nonce');
        // Only strip the nonce if `oldTag` has had it stripped. An element's nonce attribute will not
        // be stripped if there is no content security policy response header that includes a nonce.
        if (nonce && !oldTag.getAttribute('nonce')) {
            const cloneTag = newTag.cloneNode(true);
            cloneTag.setAttribute('nonce', '');
            cloneTag.nonce = nonce;
            return nonce === oldTag.nonce && oldTag.isEqualNode(cloneTag);
        }
    }
    return oldTag.isEqualNode(newTag);
}
function updateElements(type, components) {
    const headEl = document.querySelector('head');
    if (!headEl) return;
    const oldTags = new Set(headEl.querySelectorAll(`${type}[data-next-head]`));
    if (type === 'meta') {
        const metaCharset = headEl.querySelector('meta[charset]');
        if (metaCharset !== null) {
            oldTags.add(metaCharset);
        }
    }
    const newTags = [];
    for(let i = 0; i < components.length; i++){
        const component = components[i];
        const newTag = reactElementToDOM(component);
        newTag.setAttribute('data-next-head', '');
        let isNew = true;
        for (const oldTag of oldTags){
            if (isEqualNode(oldTag, newTag)) {
                oldTags.delete(oldTag);
                isNew = false;
                break;
            }
        }
        if (isNew) {
            newTags.push(newTag);
        }
    }
    for (const oldTag of oldTags){
        oldTag.parentNode?.removeChild(oldTag);
    }
    for (const newTag of newTags){
        // meta[charset] must be first element so special case
        if (newTag.tagName.toLowerCase() === 'meta' && newTag.getAttribute('charset') !== null) {
            headEl.prepend(newTag);
        }
        headEl.appendChild(newTag);
    }
}
function initHeadManager() {
    return {
        mountedInstances: new Set(),
        updateHead: (head)=>{
            const tags = {};
            head.forEach((h)=>{
                if (// it won't be inlined. In this case revert to the original behavior
                h.type === 'link' && h.props['data-optimized-fonts']) {
                    if (document.querySelector(`style[data-href="${h.props['data-href']}"]`)) {
                        return;
                    } else {
                        h.props.href = h.props['data-href'];
                        h.props['data-href'] = undefined;
                    }
                }
                const components = tags[h.type] || [];
                components.push(h);
                tags[h.type] = components;
            });
            const titleComponent = tags.title ? tags.title[0] : null;
            let title = '';
            if (titleComponent) {
                const { children } = titleComponent.props;
                title = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';
            }
            if (title !== document.title) document.title = title;
            [
                'meta',
                'base',
                'link',
                'style',
                'script'
            ].forEach((type)=>{
                updateElements(type, tags[type] || []);
            });
        }
    };
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
2796, ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Given a path this function will find the pathname, query and hash and return
 * them. This is useful to parse full paths on the client side.
 * @param path A path to parse e.g. /foo/bar?id=1#hash
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parsePath", {
    enumerable: true,
    get: function() {
        return parsePath;
    }
});
function parsePath(path) {
    const hashIndex = path.indexOf('#');
    const queryIndex = path.indexOf('?');
    const hasQuery = queryIndex > -1 && (hashIndex < 0 || queryIndex < hashIndex);
    if (hasQuery || hashIndex > -1) {
        return {
            pathname: path.substring(0, hasQuery ? queryIndex : hashIndex),
            query: hasQuery ? path.substring(queryIndex, hashIndex > -1 ? hashIndex : undefined) : '',
            hash: hashIndex > -1 ? path.slice(hashIndex) : ''
        };
    }
    return {
        pathname: path,
        query: '',
        hash: ''
    };
}
}),
3980, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "addPathPrefix", {
    enumerable: true,
    get: function() {
        return addPathPrefix;
    }
});
const _parsepath = __turbopack_context__.r(2796);
function addPathPrefix(path, prefix) {
    if (!path.startsWith('/') || !prefix) {
        return path;
    }
    const { pathname, query, hash } = (0, _parsepath.parsePath)(path);
    return `${prefix}${pathname}${query}${hash}`;
}
}),
3486, ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Removes the trailing slash for a given route or page path. Examples:
 *   - `/foo/bar/` -> `/foo/bar`
 *   - `/foo/bar` -> `/foo/bar`
 *
 * Uses charCodeAt (47 === '/') instead of regex to avoid the overhead of
 * compiling and executing a RegExp on every call (~3-5x faster).
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "removeTrailingSlash", {
    enumerable: true,
    get: function() {
        return removeTrailingSlash;
    }
});
function removeTrailingSlash(route) {
    return route.charCodeAt(route.length - 1) === 47 && route.length > 1 ? route.slice(0, -1) : route;
}
}),
90, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "normalizePathTrailingSlash", {
    enumerable: true,
    get: function() {
        return normalizePathTrailingSlash;
    }
});
const _removetrailingslash = __turbopack_context__.r(3486);
const _parsepath = __turbopack_context__.r(2796);
const normalizePathTrailingSlash = (path)=>{
    // 47 is the char code for '/'
    if (path.charCodeAt(0) !== 47 || ("TURBOPACK compile-time value", void 0)) {
        return path;
    }
    const { pathname, query, hash } = (0, _parsepath.parsePath)(path);
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return `${(0, _removetrailingslash.removeTrailingSlash)(pathname)}${query}${hash}`;
};
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
4113, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "addBasePath", {
    enumerable: true,
    get: function() {
        return addBasePath;
    }
});
const _addpathprefix = __turbopack_context__.r(3980);
const _normalizetrailingslash = __turbopack_context__.r(90);
const basePath = ("TURBOPACK compile-time value", "") || '';
function addBasePath(path, required) {
    return (0, _normalizetrailingslash.normalizePathTrailingSlash)(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : (0, _addpathprefix.addPathPrefix)(path, basePath));
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
7091, ((__turbopack_context__, module, exports) => {

(()=>{
    "use strict";
    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = ("TURBOPACK compile-time value", "/ROOT/node_modules/next/dist/compiled/path-to-regexp") + "/";
    var e = {};
    (()=>{
        var n = e;
        Object.defineProperty(n, "__esModule", {
            value: true
        });
        n.pathToRegexp = n.tokensToRegexp = n.regexpToFunction = n.match = n.tokensToFunction = n.compile = n.parse = void 0;
        function lexer(e) {
            var n = [];
            var r = 0;
            while(r < e.length){
                var t = e[r];
                if (t === "*" || t === "+" || t === "?") {
                    n.push({
                        type: "MODIFIER",
                        index: r,
                        value: e[r++]
                    });
                    continue;
                }
                if (t === "\\") {
                    n.push({
                        type: "ESCAPED_CHAR",
                        index: r++,
                        value: e[r++]
                    });
                    continue;
                }
                if (t === "{") {
                    n.push({
                        type: "OPEN",
                        index: r,
                        value: e[r++]
                    });
                    continue;
                }
                if (t === "}") {
                    n.push({
                        type: "CLOSE",
                        index: r,
                        value: e[r++]
                    });
                    continue;
                }
                if (t === ":") {
                    var a = "";
                    var i = r + 1;
                    while(i < e.length){
                        var o = e.charCodeAt(i);
                        if (o >= 48 && o <= 57 || o >= 65 && o <= 90 || o >= 97 && o <= 122 || o === 95) {
                            a += e[i++];
                            continue;
                        }
                        break;
                    }
                    if (!a) throw new TypeError("Missing parameter name at ".concat(r));
                    n.push({
                        type: "NAME",
                        index: r,
                        value: a
                    });
                    r = i;
                    continue;
                }
                if (t === "(") {
                    var c = 1;
                    var f = "";
                    var i = r + 1;
                    if (e[i] === "?") {
                        throw new TypeError('Pattern cannot start with "?" at '.concat(i));
                    }
                    while(i < e.length){
                        if (e[i] === "\\") {
                            f += e[i++] + e[i++];
                            continue;
                        }
                        if (e[i] === ")") {
                            c--;
                            if (c === 0) {
                                i++;
                                break;
                            }
                        } else if (e[i] === "(") {
                            c++;
                            if (e[i + 1] !== "?") {
                                throw new TypeError("Capturing groups are not allowed at ".concat(i));
                            }
                        }
                        f += e[i++];
                    }
                    if (c) throw new TypeError("Unbalanced pattern at ".concat(r));
                    if (!f) throw new TypeError("Missing pattern at ".concat(r));
                    n.push({
                        type: "PATTERN",
                        index: r,
                        value: f
                    });
                    r = i;
                    continue;
                }
                n.push({
                    type: "CHAR",
                    index: r,
                    value: e[r++]
                });
            }
            n.push({
                type: "END",
                index: r,
                value: ""
            });
            return n;
        }
        function parse(e, n) {
            if (n === void 0) {
                n = {};
            }
            var r = lexer(e);
            var t = n.prefixes, a = t === void 0 ? "./" : t, i = n.delimiter, o = i === void 0 ? "/#?" : i;
            var c = [];
            var f = 0;
            var u = 0;
            var p = "";
            var tryConsume = function(e) {
                if (u < r.length && r[u].type === e) return r[u++].value;
            };
            var mustConsume = function(e) {
                var n = tryConsume(e);
                if (n !== undefined) return n;
                var t = r[u], a = t.type, i = t.index;
                throw new TypeError("Unexpected ".concat(a, " at ").concat(i, ", expected ").concat(e));
            };
            var consumeText = function() {
                var e = "";
                var n;
                while(n = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")){
                    e += n;
                }
                return e;
            };
            var isSafe = function(e) {
                for(var n = 0, r = o; n < r.length; n++){
                    var t = r[n];
                    if (e.indexOf(t) > -1) return true;
                }
                return false;
            };
            var safePattern = function(e) {
                var n = c[c.length - 1];
                var r = e || (n && typeof n === "string" ? n : "");
                if (n && !r) {
                    throw new TypeError('Must have text between two parameters, missing text after "'.concat(n.name, '"'));
                }
                if (!r || isSafe(r)) return "[^".concat(escapeString(o), "]+?");
                return "(?:(?!".concat(escapeString(r), ")[^").concat(escapeString(o), "])+?");
            };
            while(u < r.length){
                var v = tryConsume("CHAR");
                var s = tryConsume("NAME");
                var d = tryConsume("PATTERN");
                if (s || d) {
                    var g = v || "";
                    if (a.indexOf(g) === -1) {
                        p += g;
                        g = "";
                    }
                    if (p) {
                        c.push(p);
                        p = "";
                    }
                    c.push({
                        name: s || f++,
                        prefix: g,
                        suffix: "",
                        pattern: d || safePattern(g),
                        modifier: tryConsume("MODIFIER") || ""
                    });
                    continue;
                }
                var x = v || tryConsume("ESCAPED_CHAR");
                if (x) {
                    p += x;
                    continue;
                }
                if (p) {
                    c.push(p);
                    p = "";
                }
                var h = tryConsume("OPEN");
                if (h) {
                    var g = consumeText();
                    var l = tryConsume("NAME") || "";
                    var m = tryConsume("PATTERN") || "";
                    var T = consumeText();
                    mustConsume("CLOSE");
                    c.push({
                        name: l || (m ? f++ : ""),
                        pattern: l && !m ? safePattern(g) : m,
                        prefix: g,
                        suffix: T,
                        modifier: tryConsume("MODIFIER") || ""
                    });
                    continue;
                }
                mustConsume("END");
            }
            return c;
        }
        n.parse = parse;
        function compile(e, n) {
            return tokensToFunction(parse(e, n), n);
        }
        n.compile = compile;
        function tokensToFunction(e, n) {
            if (n === void 0) {
                n = {};
            }
            var r = flags(n);
            var t = n.encode, a = t === void 0 ? function(e) {
                return e;
            } : t, i = n.validate, o = i === void 0 ? true : i;
            var c = e.map(function(e) {
                if (typeof e === "object") {
                    return new RegExp("^(?:".concat(e.pattern, ")$"), r);
                }
            });
            return function(n) {
                var r = "";
                for(var t = 0; t < e.length; t++){
                    var i = e[t];
                    if (typeof i === "string") {
                        r += i;
                        continue;
                    }
                    var f = n ? n[i.name] : undefined;
                    var u = i.modifier === "?" || i.modifier === "*";
                    var p = i.modifier === "*" || i.modifier === "+";
                    if (Array.isArray(f)) {
                        if (!p) {
                            throw new TypeError('Expected "'.concat(i.name, '" to not repeat, but got an array'));
                        }
                        if (f.length === 0) {
                            if (u) continue;
                            throw new TypeError('Expected "'.concat(i.name, '" to not be empty'));
                        }
                        for(var v = 0; v < f.length; v++){
                            var s = a(f[v], i);
                            if (o && !c[t].test(s)) {
                                throw new TypeError('Expected all "'.concat(i.name, '" to match "').concat(i.pattern, '", but got "').concat(s, '"'));
                            }
                            r += i.prefix + s + i.suffix;
                        }
                        continue;
                    }
                    if (typeof f === "string" || typeof f === "number") {
                        var s = a(String(f), i);
                        if (o && !c[t].test(s)) {
                            throw new TypeError('Expected "'.concat(i.name, '" to match "').concat(i.pattern, '", but got "').concat(s, '"'));
                        }
                        r += i.prefix + s + i.suffix;
                        continue;
                    }
                    if (u) continue;
                    var d = p ? "an array" : "a string";
                    throw new TypeError('Expected "'.concat(i.name, '" to be ').concat(d));
                }
                return r;
            };
        }
        n.tokensToFunction = tokensToFunction;
        function match(e, n) {
            var r = [];
            var t = pathToRegexp(e, r, n);
            return regexpToFunction(t, r, n);
        }
        n.match = match;
        function regexpToFunction(e, n, r) {
            if (r === void 0) {
                r = {};
            }
            var t = r.decode, a = t === void 0 ? function(e) {
                return e;
            } : t;
            return function(r) {
                var t = e.exec(r);
                if (!t) return false;
                var i = t[0], o = t.index;
                var c = Object.create(null);
                var _loop_1 = function(e) {
                    if (t[e] === undefined) return "continue";
                    var r = n[e - 1];
                    if (r.modifier === "*" || r.modifier === "+") {
                        c[r.name] = t[e].split(r.prefix + r.suffix).map(function(e) {
                            return a(e, r);
                        });
                    } else {
                        c[r.name] = a(t[e], r);
                    }
                };
                for(var f = 1; f < t.length; f++){
                    _loop_1(f);
                }
                return {
                    path: i,
                    index: o,
                    params: c
                };
            };
        }
        n.regexpToFunction = regexpToFunction;
        function escapeString(e) {
            return e.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
        }
        function flags(e) {
            return e && e.sensitive ? "" : "i";
        }
        function regexpToRegexp(e, n) {
            if (!n) return e;
            var r = /\((?:\?<(.*?)>)?(?!\?)/g;
            var t = 0;
            var a = r.exec(e.source);
            while(a){
                n.push({
                    name: a[1] || t++,
                    prefix: "",
                    suffix: "",
                    modifier: "",
                    pattern: ""
                });
                a = r.exec(e.source);
            }
            return e;
        }
        function arrayToRegexp(e, n, r) {
            var t = e.map(function(e) {
                return pathToRegexp(e, n, r).source;
            });
            return new RegExp("(?:".concat(t.join("|"), ")"), flags(r));
        }
        function stringToRegexp(e, n, r) {
            return tokensToRegexp(parse(e, r), n, r);
        }
        function tokensToRegexp(e, n, r) {
            if (r === void 0) {
                r = {};
            }
            var t = r.strict, a = t === void 0 ? false : t, i = r.start, o = i === void 0 ? true : i, c = r.end, f = c === void 0 ? true : c, u = r.encode, p = u === void 0 ? function(e) {
                return e;
            } : u, v = r.delimiter, s = v === void 0 ? "/#?" : v, d = r.endsWith, g = d === void 0 ? "" : d;
            var x = "[".concat(escapeString(g), "]|$");
            var h = "[".concat(escapeString(s), "]");
            var l = o ? "^" : "";
            for(var m = 0, T = e; m < T.length; m++){
                var E = T[m];
                if (typeof E === "string") {
                    l += escapeString(p(E));
                } else {
                    var w = escapeString(p(E.prefix));
                    var y = escapeString(p(E.suffix));
                    if (E.pattern) {
                        if (n) n.push(E);
                        if (w || y) {
                            if (E.modifier === "+" || E.modifier === "*") {
                                var R = E.modifier === "*" ? "?" : "";
                                l += "(?:".concat(w, "((?:").concat(E.pattern, ")(?:").concat(y).concat(w, "(?:").concat(E.pattern, "))*)").concat(y, ")").concat(R);
                            } else {
                                l += "(?:".concat(w, "(").concat(E.pattern, ")").concat(y, ")").concat(E.modifier);
                            }
                        } else {
                            if (E.modifier === "+" || E.modifier === "*") {
                                throw new TypeError('Can not repeat "'.concat(E.name, '" without a prefix and suffix'));
                            }
                            l += "(".concat(E.pattern, ")").concat(E.modifier);
                        }
                    } else {
                        l += "(?:".concat(w).concat(y, ")").concat(E.modifier);
                    }
                }
            }
            if (f) {
                if (!a) l += "".concat(h, "?");
                l += !r.endsWith ? "$" : "(?=".concat(x, ")");
            } else {
                var A = e[e.length - 1];
                var _ = typeof A === "string" ? h.indexOf(A[A.length - 1]) > -1 : A === undefined;
                if (!a) {
                    l += "(?:".concat(h, "(?=").concat(x, "))?");
                }
                if (!_) {
                    l += "(?=".concat(h, "|").concat(x, ")");
                }
            }
            return new RegExp(l, flags(r));
        }
        n.tokensToRegexp = tokensToRegexp;
        function pathToRegexp(e, n, r) {
            if (e instanceof RegExp) return regexpToRegexp(e, n);
            if (Array.isArray(e)) return arrayToRegexp(e, n, r);
            return stringToRegexp(e, n, r);
        }
        n.pathToRegexp = pathToRegexp;
    })();
    module.exports = e;
})();
}),
8268, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    PARAM_SEPARATOR: null,
    hasAdjacentParameterIssues: null,
    normalizeAdjacentParameters: null,
    normalizeTokensForRegexp: null,
    stripNormalizedSeparators: null,
    stripParameterSeparators: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    PARAM_SEPARATOR: function() {
        return PARAM_SEPARATOR;
    },
    hasAdjacentParameterIssues: function() {
        return hasAdjacentParameterIssues;
    },
    normalizeAdjacentParameters: function() {
        return normalizeAdjacentParameters;
    },
    normalizeTokensForRegexp: function() {
        return normalizeTokensForRegexp;
    },
    stripNormalizedSeparators: function() {
        return stripNormalizedSeparators;
    },
    stripParameterSeparators: function() {
        return stripParameterSeparators;
    }
});
const PARAM_SEPARATOR = '_NEXTSEP_';
function hasAdjacentParameterIssues(route) {
    if (typeof route !== 'string') return false;
    // Check for interception route markers followed immediately by parameters
    // Pattern: /(.):param, /(..):param, /(...):param, /(.)(.):param etc.
    // These patterns cause "Must have text between two parameters" errors
    if (/\/\(\.{1,3}\):[^/\s]+/.test(route)) {
        return true;
    }
    // Check for basic adjacent parameters without separators
    // Pattern: :param1:param2 (but not :param* or other URL patterns)
    if (/:[a-zA-Z_][a-zA-Z0-9_]*:[a-zA-Z_][a-zA-Z0-9_]*/.test(route)) {
        return true;
    }
    return false;
}
function normalizeAdjacentParameters(route) {
    let normalized = route;
    // Handle interception route patterns: (.):param -> (.)_NEXTSEP_:param
    normalized = normalized.replace(/(\([^)]*\)):([^/\s]+)/g, `$1${PARAM_SEPARATOR}:$2`);
    // Handle other adjacent parameter patterns: :param1:param2 -> :param1_NEXTSEP_:param2
    normalized = normalized.replace(/:([^:/\s)]+)(?=:)/g, `:$1${PARAM_SEPARATOR}`);
    return normalized;
}
function normalizeTokensForRegexp(tokens) {
    return tokens.map((token)=>{
        // Token union type: Token = string | TokenObject
        // Literal path segments are strings, parameters/wildcards are objects
        if (typeof token === 'object' && token !== null && // Not all token objects have 'modifier' property (e.g., simple text tokens)
        'modifier' in token && // Only repeating modifiers (* or +) cause the validation error
        // Other modifiers like '?' (optional) are fine
        (token.modifier === '*' || token.modifier === '+') && // Token objects can have different shapes depending on route pattern
        'prefix' in token && 'suffix' in token && // Both prefix and suffix must be empty strings
        // This is what causes the validation error in path-to-regexp
        token.prefix === '' && token.suffix === '') {
            // Add minimal prefix to satisfy path-to-regexp validation
            // We use '/' as it's the most common path delimiter and won't break route matching
            // The prefix gets used in regex generation but doesn't affect parameter extraction
            return {
                ...token,
                prefix: '/'
            };
        }
        return token;
    });
}
function stripNormalizedSeparators(pathname) {
    // Remove separator after interception route markers
    // Pattern: (.)_NEXTSEP_ -> (.), (..)_NEXTSEP_ -> (..), etc.
    // The separator appears after the closing paren of interception markers
    return pathname.replace(new RegExp(`\\)${PARAM_SEPARATOR}`, 'g'), ')');
}
function stripParameterSeparators(params) {
    const cleaned = {};
    for (const [key, value] of Object.entries(params)){
        if (typeof value === 'string') {
            // Remove the separator if it appears at the start of parameter values
            cleaned[key] = value.replace(new RegExp(`^${PARAM_SEPARATOR}`), '');
        } else if (Array.isArray(value)) {
            // Handle array parameters (from repeated route segments)
            cleaned[key] = value.map((item)=>typeof item === 'string' ? item.replace(new RegExp(`^${PARAM_SEPARATOR}`), '') : item);
        } else {
            cleaned[key] = value;
        }
    }
    return cleaned;
}
}),
2443, ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Client-safe utilities for route matching that don't import server-side
 * utilities to avoid bundling issues with Turbopack
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    safeCompile: null,
    safePathToRegexp: null,
    safeRegexpToFunction: null,
    safeRouteMatcher: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    safeCompile: function() {
        return safeCompile;
    },
    safePathToRegexp: function() {
        return safePathToRegexp;
    },
    safeRegexpToFunction: function() {
        return safeRegexpToFunction;
    },
    safeRouteMatcher: function() {
        return safeRouteMatcher;
    }
});
const _pathtoregexp = __turbopack_context__.r(7091);
const _routepatternnormalizer = __turbopack_context__.r(8268);
function safePathToRegexp(route, keys, options) {
    if (typeof route !== 'string') {
        return (0, _pathtoregexp.pathToRegexp)(route, keys, options);
    }
    // Check if normalization is needed and cache the result
    const needsNormalization = (0, _routepatternnormalizer.hasAdjacentParameterIssues)(route);
    const routeToUse = needsNormalization ? (0, _routepatternnormalizer.normalizeAdjacentParameters)(route) : route;
    try {
        return (0, _pathtoregexp.pathToRegexp)(routeToUse, keys, options);
    } catch (error) {
        // Only try normalization if we haven't already normalized
        if (!needsNormalization) {
            try {
                const normalizedRoute = (0, _routepatternnormalizer.normalizeAdjacentParameters)(route);
                return (0, _pathtoregexp.pathToRegexp)(normalizedRoute, keys, options);
            } catch (retryError) {
                // If that doesn't work, fall back to original error
                throw error;
            }
        }
        throw error;
    }
}
function safeCompile(route, options) {
    // Check if normalization is needed and cache the result
    const needsNormalization = (0, _routepatternnormalizer.hasAdjacentParameterIssues)(route);
    const routeToUse = needsNormalization ? (0, _routepatternnormalizer.normalizeAdjacentParameters)(route) : route;
    try {
        const compiler = (0, _pathtoregexp.compile)(routeToUse, options);
        // If we normalized the route, wrap the compiler to strip separators from output
        // The normalization inserts _NEXTSEP_ as a literal string in the pattern to satisfy
        // path-to-regexp validation, but we don't want it in the final compiled URL
        if (needsNormalization) {
            return (params)=>{
                return (0, _routepatternnormalizer.stripNormalizedSeparators)(compiler(params));
            };
        }
        return compiler;
    } catch (error) {
        // Only try normalization if we haven't already normalized
        if (!needsNormalization) {
            try {
                const normalizedRoute = (0, _routepatternnormalizer.normalizeAdjacentParameters)(route);
                const compiler = (0, _pathtoregexp.compile)(normalizedRoute, options);
                // Wrap the compiler to strip separators from output
                return (params)=>{
                    return (0, _routepatternnormalizer.stripNormalizedSeparators)(compiler(params));
                };
            } catch (retryError) {
                // If that doesn't work, fall back to original error
                throw error;
            }
        }
        throw error;
    }
}
function safeRegexpToFunction(regexp, keys) {
    const originalMatcher = (0, _pathtoregexp.regexpToFunction)(regexp, keys || []);
    return (pathname)=>{
        const result = originalMatcher(pathname);
        if (!result) return false;
        // Clean parameters before returning
        return {
            ...result,
            params: (0, _routepatternnormalizer.stripParameterSeparators)(result.params)
        };
    };
}
function safeRouteMatcher(matcherFn) {
    return (pathname)=>{
        const result = matcherFn(pathname);
        if (!result) return false;
        // Clean parameters before returning
        return (0, _routepatternnormalizer.stripParameterSeparators)(result);
    };
}
}),
9944, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getRouteMatcher", {
    enumerable: true,
    get: function() {
        return getRouteMatcher;
    }
});
const _utils = __turbopack_context__.r(9129);
const _routematchutils = __turbopack_context__.r(2443);
function getRouteMatcher({ re, groups }) {
    const rawMatcher = (pathname)=>{
        const routeMatch = re.exec(pathname);
        if (!routeMatch) return false;
        const decode = (param)=>{
            try {
                return decodeURIComponent(param);
            } catch  {
                throw Object.defineProperty(new _utils.DecodeError('failed to decode param'), "__NEXT_ERROR_CODE", {
                    value: "E528",
                    enumerable: false,
                    configurable: true
                });
            }
        };
        const params = {};
        for (const [key, group] of Object.entries(groups)){
            const match = routeMatch[group.pos];
            if (match !== undefined) {
                if (group.repeat) {
                    params[key] = match.split('/').map((entry)=>decode(entry));
                } else {
                    params[key] = decode(match);
                }
            }
        }
        return params;
    };
    // Wrap with safe matcher to handle parameter cleaning
    return (0, _routematchutils.safeRouteMatcher)(rawMatcher);
}
}),
2987, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ACTION_SUFFIX: null,
    APP_DIR_ALIAS: null,
    CACHE_ONE_YEAR_SECONDS: null,
    DOT_NEXT_ALIAS: null,
    ESLINT_DEFAULT_DIRS: null,
    GSP_NO_RETURNED_VALUE: null,
    GSSP_COMPONENT_MEMBER_ERROR: null,
    GSSP_NO_RETURNED_VALUE: null,
    HTML_CONTENT_TYPE_HEADER: null,
    INFINITE_CACHE: null,
    INSTRUMENTATION_HOOK_FILENAME: null,
    JSON_CONTENT_TYPE_HEADER: null,
    MATCHED_PATH_HEADER: null,
    MIDDLEWARE_FILENAME: null,
    MIDDLEWARE_LOCATION_REGEXP: null,
    NEXT_BODY_SUFFIX: null,
    NEXT_CACHE_IMPLICIT_TAG_ID: null,
    NEXT_CACHE_REVALIDATED_TAGS_HEADER: null,
    NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER: null,
    NEXT_CACHE_ROOT_PARAM_TAG_ID: null,
    NEXT_CACHE_SOFT_TAG_MAX_LENGTH: null,
    NEXT_CACHE_TAGS_HEADER: null,
    NEXT_CACHE_TAG_MAX_ITEMS: null,
    NEXT_CACHE_TAG_MAX_LENGTH: null,
    NEXT_DATA_SUFFIX: null,
    NEXT_INTERCEPTION_MARKER_PREFIX: null,
    NEXT_META_SUFFIX: null,
    NEXT_NAV_DEPLOYMENT_ID_HEADER: null,
    NEXT_QUERY_PARAM_PREFIX: null,
    NEXT_RESUME_HEADER: null,
    NEXT_RESUME_STATE_LENGTH_HEADER: null,
    NON_STANDARD_NODE_ENV: null,
    PAGES_DIR_ALIAS: null,
    PRERENDER_REVALIDATE_HEADER: null,
    PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER: null,
    PROXY_FILENAME: null,
    PROXY_LOCATION_REGEXP: null,
    PUBLIC_DIR_MIDDLEWARE_CONFLICT: null,
    ROOT_DIR_ALIAS: null,
    RSC_ACTION_CLIENT_WRAPPER_ALIAS: null,
    RSC_ACTION_ENCRYPTION_ALIAS: null,
    RSC_ACTION_PROXY_ALIAS: null,
    RSC_ACTION_VALIDATE_ALIAS: null,
    RSC_CACHE_WRAPPER_ALIAS: null,
    RSC_DYNAMIC_IMPORT_WRAPPER_ALIAS: null,
    RSC_MOD_REF_PROXY_ALIAS: null,
    RSC_SEGMENTS_DIR_SUFFIX: null,
    RSC_SEGMENT_SUFFIX: null,
    RSC_SUFFIX: null,
    SERVER_PROPS_EXPORT_ERROR: null,
    SERVER_PROPS_GET_INIT_PROPS_CONFLICT: null,
    SERVER_PROPS_SSG_CONFLICT: null,
    SERVER_RUNTIME: null,
    SSG_FALLBACK_EXPORT_ERROR: null,
    SSG_GET_INITIAL_PROPS_CONFLICT: null,
    STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR: null,
    TEXT_PLAIN_CONTENT_TYPE_HEADER: null,
    UNSTABLE_REVALIDATE_RENAME_ERROR: null,
    WEBPACK_LAYERS: null,
    WEBPACK_RESOURCE_QUERIES: null,
    WEB_SOCKET_MAX_RECONNECTIONS: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    ACTION_SUFFIX: function() {
        return ACTION_SUFFIX;
    },
    APP_DIR_ALIAS: function() {
        return APP_DIR_ALIAS;
    },
    CACHE_ONE_YEAR_SECONDS: function() {
        return CACHE_ONE_YEAR_SECONDS;
    },
    DOT_NEXT_ALIAS: function() {
        return DOT_NEXT_ALIAS;
    },
    ESLINT_DEFAULT_DIRS: function() {
        return ESLINT_DEFAULT_DIRS;
    },
    GSP_NO_RETURNED_VALUE: function() {
        return GSP_NO_RETURNED_VALUE;
    },
    GSSP_COMPONENT_MEMBER_ERROR: function() {
        return GSSP_COMPONENT_MEMBER_ERROR;
    },
    GSSP_NO_RETURNED_VALUE: function() {
        return GSSP_NO_RETURNED_VALUE;
    },
    HTML_CONTENT_TYPE_HEADER: function() {
        return HTML_CONTENT_TYPE_HEADER;
    },
    INFINITE_CACHE: function() {
        return INFINITE_CACHE;
    },
    INSTRUMENTATION_HOOK_FILENAME: function() {
        return INSTRUMENTATION_HOOK_FILENAME;
    },
    JSON_CONTENT_TYPE_HEADER: function() {
        return JSON_CONTENT_TYPE_HEADER;
    },
    MATCHED_PATH_HEADER: function() {
        return MATCHED_PATH_HEADER;
    },
    MIDDLEWARE_FILENAME: function() {
        return MIDDLEWARE_FILENAME;
    },
    MIDDLEWARE_LOCATION_REGEXP: function() {
        return MIDDLEWARE_LOCATION_REGEXP;
    },
    NEXT_BODY_SUFFIX: function() {
        return NEXT_BODY_SUFFIX;
    },
    NEXT_CACHE_IMPLICIT_TAG_ID: function() {
        return NEXT_CACHE_IMPLICIT_TAG_ID;
    },
    NEXT_CACHE_REVALIDATED_TAGS_HEADER: function() {
        return NEXT_CACHE_REVALIDATED_TAGS_HEADER;
    },
    NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER: function() {
        return NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER;
    },
    NEXT_CACHE_ROOT_PARAM_TAG_ID: function() {
        return NEXT_CACHE_ROOT_PARAM_TAG_ID;
    },
    NEXT_CACHE_SOFT_TAG_MAX_LENGTH: function() {
        return NEXT_CACHE_SOFT_TAG_MAX_LENGTH;
    },
    NEXT_CACHE_TAGS_HEADER: function() {
        return NEXT_CACHE_TAGS_HEADER;
    },
    NEXT_CACHE_TAG_MAX_ITEMS: function() {
        return NEXT_CACHE_TAG_MAX_ITEMS;
    },
    NEXT_CACHE_TAG_MAX_LENGTH: function() {
        return NEXT_CACHE_TAG_MAX_LENGTH;
    },
    NEXT_DATA_SUFFIX: function() {
        return NEXT_DATA_SUFFIX;
    },
    NEXT_INTERCEPTION_MARKER_PREFIX: function() {
        return NEXT_INTERCEPTION_MARKER_PREFIX;
    },
    NEXT_META_SUFFIX: function() {
        return NEXT_META_SUFFIX;
    },
    NEXT_NAV_DEPLOYMENT_ID_HEADER: function() {
        return NEXT_NAV_DEPLOYMENT_ID_HEADER;
    },
    NEXT_QUERY_PARAM_PREFIX: function() {
        return NEXT_QUERY_PARAM_PREFIX;
    },
    NEXT_RESUME_HEADER: function() {
        return NEXT_RESUME_HEADER;
    },
    NEXT_RESUME_STATE_LENGTH_HEADER: function() {
        return NEXT_RESUME_STATE_LENGTH_HEADER;
    },
    NON_STANDARD_NODE_ENV: function() {
        return NON_STANDARD_NODE_ENV;
    },
    PAGES_DIR_ALIAS: function() {
        return PAGES_DIR_ALIAS;
    },
    PRERENDER_REVALIDATE_HEADER: function() {
        return PRERENDER_REVALIDATE_HEADER;
    },
    PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER: function() {
        return PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER;
    },
    PROXY_FILENAME: function() {
        return PROXY_FILENAME;
    },
    PROXY_LOCATION_REGEXP: function() {
        return PROXY_LOCATION_REGEXP;
    },
    PUBLIC_DIR_MIDDLEWARE_CONFLICT: function() {
        return PUBLIC_DIR_MIDDLEWARE_CONFLICT;
    },
    ROOT_DIR_ALIAS: function() {
        return ROOT_DIR_ALIAS;
    },
    RSC_ACTION_CLIENT_WRAPPER_ALIAS: function() {
        return RSC_ACTION_CLIENT_WRAPPER_ALIAS;
    },
    RSC_ACTION_ENCRYPTION_ALIAS: function() {
        return RSC_ACTION_ENCRYPTION_ALIAS;
    },
    RSC_ACTION_PROXY_ALIAS: function() {
        return RSC_ACTION_PROXY_ALIAS;
    },
    RSC_ACTION_VALIDATE_ALIAS: function() {
        return RSC_ACTION_VALIDATE_ALIAS;
    },
    RSC_CACHE_WRAPPER_ALIAS: function() {
        return RSC_CACHE_WRAPPER_ALIAS;
    },
    RSC_DYNAMIC_IMPORT_WRAPPER_ALIAS: function() {
        return RSC_DYNAMIC_IMPORT_WRAPPER_ALIAS;
    },
    RSC_MOD_REF_PROXY_ALIAS: function() {
        return RSC_MOD_REF_PROXY_ALIAS;
    },
    RSC_SEGMENTS_DIR_SUFFIX: function() {
        return RSC_SEGMENTS_DIR_SUFFIX;
    },
    RSC_SEGMENT_SUFFIX: function() {
        return RSC_SEGMENT_SUFFIX;
    },
    RSC_SUFFIX: function() {
        return RSC_SUFFIX;
    },
    SERVER_PROPS_EXPORT_ERROR: function() {
        return SERVER_PROPS_EXPORT_ERROR;
    },
    SERVER_PROPS_GET_INIT_PROPS_CONFLICT: function() {
        return SERVER_PROPS_GET_INIT_PROPS_CONFLICT;
    },
    SERVER_PROPS_SSG_CONFLICT: function() {
        return SERVER_PROPS_SSG_CONFLICT;
    },
    SERVER_RUNTIME: function() {
        return SERVER_RUNTIME;
    },
    SSG_FALLBACK_EXPORT_ERROR: function() {
        return SSG_FALLBACK_EXPORT_ERROR;
    },
    SSG_GET_INITIAL_PROPS_CONFLICT: function() {
        return SSG_GET_INITIAL_PROPS_CONFLICT;
    },
    STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR: function() {
        return STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR;
    },
    TEXT_PLAIN_CONTENT_TYPE_HEADER: function() {
        return TEXT_PLAIN_CONTENT_TYPE_HEADER;
    },
    UNSTABLE_REVALIDATE_RENAME_ERROR: function() {
        return UNSTABLE_REVALIDATE_RENAME_ERROR;
    },
    WEBPACK_LAYERS: function() {
        return WEBPACK_LAYERS;
    },
    WEBPACK_RESOURCE_QUERIES: function() {
        return WEBPACK_RESOURCE_QUERIES;
    },
    WEB_SOCKET_MAX_RECONNECTIONS: function() {
        return WEB_SOCKET_MAX_RECONNECTIONS;
    }
});
const TEXT_PLAIN_CONTENT_TYPE_HEADER = 'text/plain';
const HTML_CONTENT_TYPE_HEADER = 'text/html; charset=utf-8';
const JSON_CONTENT_TYPE_HEADER = 'application/json; charset=utf-8';
const NEXT_QUERY_PARAM_PREFIX = 'nxtP';
const NEXT_INTERCEPTION_MARKER_PREFIX = 'nxtI';
const MATCHED_PATH_HEADER = 'x-matched-path';
const PRERENDER_REVALIDATE_HEADER = 'x-prerender-revalidate';
const PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER = 'x-prerender-revalidate-if-generated';
const RSC_SEGMENTS_DIR_SUFFIX = '.segments';
const RSC_SEGMENT_SUFFIX = '.segment.rsc';
const RSC_SUFFIX = '.rsc';
const ACTION_SUFFIX = '.action';
const NEXT_DATA_SUFFIX = '.json';
const NEXT_META_SUFFIX = '.meta';
const NEXT_BODY_SUFFIX = '.body';
const NEXT_NAV_DEPLOYMENT_ID_HEADER = 'x-nextjs-deployment-id';
const NEXT_CACHE_TAGS_HEADER = 'x-next-cache-tags';
const NEXT_CACHE_REVALIDATED_TAGS_HEADER = 'x-next-revalidated-tags';
const NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER = 'x-next-revalidate-tag-token';
const NEXT_RESUME_HEADER = 'next-resume';
const NEXT_RESUME_STATE_LENGTH_HEADER = 'x-next-resume-state-length';
const NEXT_CACHE_TAG_MAX_ITEMS = 128;
const NEXT_CACHE_TAG_MAX_LENGTH = 256;
const NEXT_CACHE_SOFT_TAG_MAX_LENGTH = 1024;
const NEXT_CACHE_IMPLICIT_TAG_ID = '_N_T_';
const NEXT_CACHE_ROOT_PARAM_TAG_ID = '_N_RP_';
const CACHE_ONE_YEAR_SECONDS = 31536000;
const INFINITE_CACHE = 0xfffffffe;
const MIDDLEWARE_FILENAME = 'middleware';
const MIDDLEWARE_LOCATION_REGEXP = `(?:src/)?${MIDDLEWARE_FILENAME}`;
const PROXY_FILENAME = 'proxy';
const PROXY_LOCATION_REGEXP = `(?:src/)?${PROXY_FILENAME}`;
const INSTRUMENTATION_HOOK_FILENAME = 'instrumentation';
const PAGES_DIR_ALIAS = 'private-next-pages';
const DOT_NEXT_ALIAS = 'private-dot-next';
const ROOT_DIR_ALIAS = 'private-next-root-dir';
const APP_DIR_ALIAS = 'private-next-app-dir';
const RSC_MOD_REF_PROXY_ALIAS = 'private-next-rsc-mod-ref-proxy';
const RSC_ACTION_VALIDATE_ALIAS = 'private-next-rsc-action-validate';
const RSC_ACTION_PROXY_ALIAS = 'private-next-rsc-server-reference';
const RSC_CACHE_WRAPPER_ALIAS = 'private-next-rsc-cache-wrapper';
const RSC_DYNAMIC_IMPORT_WRAPPER_ALIAS = 'private-next-rsc-track-dynamic-import';
const RSC_ACTION_ENCRYPTION_ALIAS = 'private-next-rsc-action-encryption';
const RSC_ACTION_CLIENT_WRAPPER_ALIAS = 'private-next-rsc-action-client-wrapper';
const PUBLIC_DIR_MIDDLEWARE_CONFLICT = `You can not have a '_next' folder inside of your public folder. This conflicts with the internal '/_next' route. https://nextjs.org/docs/messages/public-next-folder-conflict`;
const SSG_GET_INITIAL_PROPS_CONFLICT = `You can not use getInitialProps with getStaticProps. To use SSG, please remove your getInitialProps`;
const SERVER_PROPS_GET_INIT_PROPS_CONFLICT = `You can not use getInitialProps with getServerSideProps. Please remove getInitialProps.`;
const SERVER_PROPS_SSG_CONFLICT = `You can not use getStaticProps or getStaticPaths with getServerSideProps. To use SSG, please remove getServerSideProps`;
const STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR = `can not have getInitialProps/getServerSideProps, https://nextjs.org/docs/messages/404-get-initial-props`;
const SERVER_PROPS_EXPORT_ERROR = `pages with \`getServerSideProps\` can not be exported. See more info here: https://nextjs.org/docs/messages/gssp-export`;
const GSP_NO_RETURNED_VALUE = 'Your `getStaticProps` function did not return an object. Did you forget to add a `return`?';
const GSSP_NO_RETURNED_VALUE = 'Your `getServerSideProps` function did not return an object. Did you forget to add a `return`?';
const UNSTABLE_REVALIDATE_RENAME_ERROR = 'The `unstable_revalidate` property is available for general use.\n' + 'Please use `revalidate` instead.';
const GSSP_COMPONENT_MEMBER_ERROR = `can not be attached to a page's component and must be exported from the page. See more info here: https://nextjs.org/docs/messages/gssp-component-member`;
const NON_STANDARD_NODE_ENV = `You are using a non-standard "NODE_ENV" value in your environment. This creates inconsistencies in the project and is strongly advised against. Read more: https://nextjs.org/docs/messages/non-standard-node-env`;
const SSG_FALLBACK_EXPORT_ERROR = `Pages with \`fallback\` enabled in \`getStaticPaths\` can not be exported. See more info here: https://nextjs.org/docs/messages/ssg-fallback-true-export`;
const ESLINT_DEFAULT_DIRS = [
    'app',
    'pages',
    'components',
    'lib',
    'src'
];
const SERVER_RUNTIME = {
    edge: 'edge',
    experimentalEdge: 'experimental-edge',
    nodejs: 'nodejs'
};
const WEB_SOCKET_MAX_RECONNECTIONS = 12;
/**
 * The names of the webpack layers. These layers are the primitives for the
 * webpack chunks.
 */ const WEBPACK_LAYERS_NAMES = {
    /**
   * The layer for the shared code between the client and server bundles.
   */ shared: 'shared',
    /**
   * The layer for server-only runtime and picking up `react-server` export conditions.
   * Including app router RSC pages and app router custom routes and metadata routes.
   */ reactServerComponents: 'rsc',
    /**
   * Server Side Rendering layer for app (ssr).
   */ serverSideRendering: 'ssr',
    /**
   * The browser client bundle layer for actions.
   */ actionBrowser: 'action-browser',
    /**
   * The Node.js bundle layer for the API routes.
   */ apiNode: 'api-node',
    /**
   * The Edge Lite bundle layer for the API routes.
   */ apiEdge: 'api-edge',
    /**
   * The layer for the middleware code.
   */ middleware: 'middleware',
    /**
   * The layer for the instrumentation hooks.
   */ instrument: 'instrument',
    /**
   * The layer for assets on the edge.
   */ edgeAsset: 'edge-asset',
    /**
   * The browser client bundle layer for App directory.
   */ appPagesBrowser: 'app-pages-browser',
    /**
   * The browser client bundle layer for Pages directory.
   */ pagesDirBrowser: 'pages-dir-browser',
    /**
   * The Edge Lite bundle layer for Pages directory.
   */ pagesDirEdge: 'pages-dir-edge',
    /**
   * The Node.js bundle layer for Pages directory.
   */ pagesDirNode: 'pages-dir-node'
};
const WEBPACK_LAYERS = {
    ...WEBPACK_LAYERS_NAMES,
    GROUP: {
        builtinReact: [
            WEBPACK_LAYERS_NAMES.reactServerComponents,
            WEBPACK_LAYERS_NAMES.actionBrowser
        ],
        serverOnly: [
            WEBPACK_LAYERS_NAMES.reactServerComponents,
            WEBPACK_LAYERS_NAMES.actionBrowser,
            WEBPACK_LAYERS_NAMES.instrument,
            WEBPACK_LAYERS_NAMES.middleware
        ],
        neutralTarget: [
            // pages api
            WEBPACK_LAYERS_NAMES.apiNode,
            WEBPACK_LAYERS_NAMES.apiEdge
        ],
        clientOnly: [
            WEBPACK_LAYERS_NAMES.serverSideRendering,
            WEBPACK_LAYERS_NAMES.appPagesBrowser
        ],
        bundled: [
            WEBPACK_LAYERS_NAMES.reactServerComponents,
            WEBPACK_LAYERS_NAMES.actionBrowser,
            WEBPACK_LAYERS_NAMES.serverSideRendering,
            WEBPACK_LAYERS_NAMES.appPagesBrowser,
            WEBPACK_LAYERS_NAMES.shared,
            WEBPACK_LAYERS_NAMES.instrument,
            WEBPACK_LAYERS_NAMES.middleware
        ],
        appPages: [
            // app router pages and layouts
            WEBPACK_LAYERS_NAMES.reactServerComponents,
            WEBPACK_LAYERS_NAMES.serverSideRendering,
            WEBPACK_LAYERS_NAMES.appPagesBrowser,
            WEBPACK_LAYERS_NAMES.actionBrowser
        ]
    }
};
const WEBPACK_RESOURCE_QUERIES = {
    edgeSSREntry: '__next_edge_ssr_entry__',
    metadata: '__next_metadata__',
    metadataRoute: '__next_metadata_route__',
    metadataImageMeta: '__next_metadata_image_meta__'
};
}),
2778, ((__turbopack_context__, module, exports) => {
"use strict";

// regexp is based on https://github.com/sindresorhus/escape-string-regexp
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "escapeStringRegexp", {
    enumerable: true,
    get: function() {
        return escapeStringRegexp;
    }
});
const reHasRegExp = /[|\\{}()[\]^$+*?.-]/;
const reReplaceRegExp = /[|\\{}()[\]^$+*?.-]/g;
function escapeStringRegexp(str) {
    // see also: https://github.com/lodash/lodash/blob/2da024c3b4f9947a48517639de7560457cd4ec6c/escapeRegExp.js#L23
    if (reHasRegExp.test(str)) {
        return str.replace(reReplaceRegExp, '\\$&');
    }
    return str;
}
}),
7117, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "InvariantError", {
    enumerable: true,
    get: function() {
        return InvariantError;
    }
});
class InvariantError extends Error {
    constructor(message, options){
        super(`Invariant: ${message.endsWith('.') ? message : message + '.'} This is a bug in Next.js.`, options);
        Object.defineProperty(this, "__NEXT_ERROR_CODE", {
            value: "E1179",
            enumerable: false,
            configurable: true
        });
        this.name = 'InvariantError';
    }
}
}),
9141, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseLoaderTree", {
    enumerable: true,
    get: function() {
        return parseLoaderTree;
    }
});
const _segment = __turbopack_context__.r(7915);
function parseLoaderTree(tree) {
    const [segment, parallelRoutes, modules, staticSiblings] = tree;
    const { layout, template } = modules;
    let { page } = modules;
    // a __DEFAULT__ segment means that this route didn't match any of the
    // segments in the route, so we should use the default page
    page = segment === _segment.DEFAULT_SEGMENT_KEY ? modules.defaultPage : page;
    const conventionPath = layout?.[1] || template?.[1] || page?.[1];
    return {
        page,
        segment,
        modules,
        /* it can be either layout / template / page */ conventionPath,
        parallelRoutes,
        staticSiblings
    };
}
}),
6309, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getParamProperties: null,
    getSegmentParam: null,
    isCatchAll: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getParamProperties: function() {
        return getParamProperties;
    },
    getSegmentParam: function() {
        return getSegmentParam;
    },
    isCatchAll: function() {
        return isCatchAll;
    }
});
const _interceptionroutes = __turbopack_context__.r(9161);
function getSegmentParam(segment) {
    const interceptionMarker = _interceptionroutes.INTERCEPTION_ROUTE_MARKERS.find((marker)=>segment.startsWith(marker));
    // if an interception marker is part of the path segment, we need to jump ahead
    // to the relevant portion for param parsing
    if (interceptionMarker) {
        segment = segment.slice(interceptionMarker.length);
    }
    if (segment.startsWith('[[...') && segment.endsWith(']]')) {
        return {
            // TODO-APP: Optional catchall does not currently work with parallel routes,
            // so for now aren't handling a potential interception marker.
            paramType: 'optional-catchall',
            paramName: segment.slice(5, -2)
        };
    }
    if (segment.startsWith('[...') && segment.endsWith(']')) {
        return {
            paramType: interceptionMarker ? `catchall-intercepted-${interceptionMarker}` : 'catchall',
            paramName: segment.slice(4, -1)
        };
    }
    if (segment.startsWith('[') && segment.endsWith(']')) {
        return {
            paramType: interceptionMarker ? `dynamic-intercepted-${interceptionMarker}` : 'dynamic',
            paramName: segment.slice(1, -1)
        };
    }
    return null;
}
function isCatchAll(type) {
    return type === 'catchall' || type === 'catchall-intercepted-(..)(..)' || type === 'catchall-intercepted-(.)' || type === 'catchall-intercepted-(..)' || type === 'catchall-intercepted-(...)' || type === 'optional-catchall';
}
function getParamProperties(paramType) {
    let repeat = false;
    let optional = false;
    switch(paramType){
        case 'catchall':
        case 'catchall-intercepted-(..)(..)':
        case 'catchall-intercepted-(.)':
        case 'catchall-intercepted-(..)':
        case 'catchall-intercepted-(...)':
            repeat = true;
            break;
        case 'optional-catchall':
            repeat = true;
            optional = true;
            break;
        case 'dynamic':
        case 'dynamic-intercepted-(..)(..)':
        case 'dynamic-intercepted-(.)':
        case 'dynamic-intercepted-(..)':
        case 'dynamic-intercepted-(...)':
            break;
        default:
            paramType;
    }
    return {
        repeat,
        optional
    };
}
}),
606, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    isInterceptionAppRoute: null,
    isNormalizedAppRoute: null,
    parseAppRouteSegment: null,
    parseAppRouteWithSlots: null,
    parseNormalizedAppRoute: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    isInterceptionAppRoute: function() {
        return isInterceptionAppRoute;
    },
    isNormalizedAppRoute: function() {
        return isNormalizedAppRoute;
    },
    parseAppRouteSegment: function() {
        return parseAppRouteSegment;
    },
    parseAppRouteWithSlots: function() {
        return parseAppRouteWithSlots;
    },
    parseNormalizedAppRoute: function() {
        return parseNormalizedAppRoute;
    }
});
const _invarianterror = __turbopack_context__.r(7117);
const _getsegmentparam = __turbopack_context__.r(6309);
const _interceptionroutes = __turbopack_context__.r(9161);
function normalizeEncodedDynamicPlaceholder(segment) {
    if (!/%5b|%5d/i.test(segment)) {
        return segment;
    }
    try {
        const decodedSegment = decodeURIComponent(segment);
        return (0, _getsegmentparam.getSegmentParam)(decodedSegment) ? decodedSegment : segment;
    } catch  {
        return segment;
    }
}
function parseAppRouteSegment(segment) {
    if (segment === '') {
        return null;
    }
    // Check if the segment starts with an interception marker
    const interceptionMarker = _interceptionroutes.INTERCEPTION_ROUTE_MARKERS.find((m)=>segment.startsWith(m));
    const param = (0, _getsegmentparam.getSegmentParam)(segment);
    if (param) {
        return {
            type: 'dynamic',
            name: segment,
            param,
            interceptionMarker
        };
    } else if (segment.startsWith('(') && segment.endsWith(')')) {
        return {
            type: 'route-group',
            name: segment,
            interceptionMarker
        };
    } else if (segment.startsWith('@')) {
        return {
            type: 'parallel-route',
            name: segment,
            interceptionMarker
        };
    } else {
        return {
            type: 'static',
            name: segment,
            interceptionMarker
        };
    }
}
function isNormalizedAppRoute(route) {
    return route.normalized;
}
function isInterceptionAppRoute(route) {
    return route.interceptionMarker !== undefined && route.interceptingRoute !== undefined && route.interceptedRoute !== undefined;
}
// Bitmask for which non-URL segment types to allow during parsing.
// By default, route groups and parallel routes are rejected because
// they should have been stripped by normalizeAppPath. These flags
// let callers opt in to allowing specific types.
const OnlyRoutableSegments = /*   */ 0;
const AllowParallelSegments = /*  */ 1;
const AllowGroupSegments = /*     */ 2;
function parseAppRouteImpl(pathname, allowedTypes) {
    const pathnameSegments = pathname.split('/').filter(Boolean);
    // Build segments array with static and dynamic segments
    const segments = [];
    // Parse if this is an interception route.
    let interceptionMarker;
    let interceptingRoute;
    let interceptedRoute;
    for (const segment of pathnameSegments){
        const normalizedSegment = normalizeEncodedDynamicPlaceholder(segment);
        // Parse the segment into an AppSegment.
        const appSegment = parseAppRouteSegment(normalizedSegment);
        if (!appSegment) {
            continue;
        }
        if (appSegment.type === 'route-group' && !(allowedTypes & AllowGroupSegments)) {
            throw Object.defineProperty(new _invarianterror.InvariantError(`${pathname} is being parsed as a normalized route, but it has a route group segment.`), "__NEXT_ERROR_CODE", {
                value: "E1151",
                enumerable: false,
                configurable: true
            });
        }
        if (appSegment.type === 'parallel-route' && !(allowedTypes & AllowParallelSegments)) {
            throw Object.defineProperty(new _invarianterror.InvariantError(`${pathname} is being parsed as a normalized route, but it has a parallel route segment.`), "__NEXT_ERROR_CODE", {
                value: "E1152",
                enumerable: false,
                configurable: true
            });
        }
        segments.push(appSegment);
        if (appSegment.interceptionMarker) {
            const parts = pathname.split(appSegment.interceptionMarker);
            if (parts.length !== 2) {
                throw Object.defineProperty(new Error(`Invalid interception route: ${pathname}`), "__NEXT_ERROR_CODE", {
                    value: "E924",
                    enumerable: false,
                    configurable: true
                });
            }
            interceptingRoute = parseAppRouteImpl(parts[0], allowedTypes);
            interceptedRoute = parseAppRouteImpl(parts[1], allowedTypes);
            interceptionMarker = appSegment.interceptionMarker;
        }
    }
    const dynamicSegments = segments.filter((segment)=>segment.type === 'dynamic');
    return {
        normalized: allowedTypes === OnlyRoutableSegments,
        pathname,
        segments,
        dynamicSegments,
        interceptionMarker,
        interceptingRoute,
        interceptedRoute
    };
}
function parseNormalizedAppRoute(pathname) {
    return parseAppRouteImpl(pathname, OnlyRoutableSegments);
}
function parseAppRouteWithSlots(pathname) {
    return parseAppRouteImpl(pathname, AllowParallelSegments);
}
}),
5179, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "interceptionPrefixFromParamType", {
    enumerable: true,
    get: function() {
        return interceptionPrefixFromParamType;
    }
});
function interceptionPrefixFromParamType(paramType) {
    switch(paramType){
        case 'catchall-intercepted-(..)(..)':
        case 'dynamic-intercepted-(..)(..)':
            return '(..)(..)';
        case 'catchall-intercepted-(.)':
        case 'dynamic-intercepted-(.)':
            return '(.)';
        case 'catchall-intercepted-(..)':
        case 'dynamic-intercepted-(..)':
            return '(..)';
        case 'catchall-intercepted-(...)':
        case 'dynamic-intercepted-(...)':
            return '(...)';
        case 'catchall':
        case 'dynamic':
        case 'optional-catchall':
        default:
            return null;
    }
}
}),
5882, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveParamValue", {
    enumerable: true,
    get: function() {
        return resolveParamValue;
    }
});
const _invarianterror = __turbopack_context__.r(7117);
const _interceptionprefixfromparamtype = __turbopack_context__.r(5179);
/**
 * Extracts the param value from a path segment, handling interception markers
 * based on the expected param type.
 *
 * @param pathSegment - The path segment to extract the value from
 * @param params - The current params object for resolving dynamic param references
 * @param paramType - The expected param type which may include interception marker info
 * @returns The extracted param value
 */ function getParamValueFromSegment(pathSegment, params, paramType) {
    // If the segment is dynamic, resolve it from the params object
    if (pathSegment.type === 'dynamic') {
        return params[pathSegment.param.paramName];
    }
    // If the paramType indicates this is an intercepted param, strip the marker
    // that matches the interception marker in the param type
    const interceptionPrefix = (0, _interceptionprefixfromparamtype.interceptionPrefixFromParamType)(paramType);
    if (interceptionPrefix === pathSegment.interceptionMarker) {
        return pathSegment.name.replace(pathSegment.interceptionMarker, '');
    }
    // For static segments, use the name
    return pathSegment.name;
}
function resolveParamValue(paramName, paramType, depth, route, params) {
    switch(paramType){
        case 'catchall':
        case 'optional-catchall':
        case 'catchall-intercepted-(..)(..)':
        case 'catchall-intercepted-(.)':
        case 'catchall-intercepted-(..)':
        case 'catchall-intercepted-(...)':
            // For catchall routes, derive from pathname using depth to determine
            // which segments to use
            const processedSegments = [];
            // Process segments to handle any embedded dynamic params
            for(let index = depth; index < route.segments.length; index++){
                const pathSegment = route.segments[index];
                if (pathSegment.type === 'static') {
                    let value = pathSegment.name;
                    // For intercepted catch-all params, strip the marker from the first segment
                    const interceptionPrefix = (0, _interceptionprefixfromparamtype.interceptionPrefixFromParamType)(paramType);
                    if (interceptionPrefix && index === depth && interceptionPrefix === pathSegment.interceptionMarker) {
                        // Strip the interception marker from the value
                        value = value.replace(pathSegment.interceptionMarker, '');
                    }
                    processedSegments.push(value);
                } else {
                    // If the segment is a param placeholder, check if we have its value
                    if (!params.hasOwnProperty(pathSegment.param.paramName)) {
                        // If the segment is an optional catchall, we can break out of the
                        // loop because it's optional!
                        if (pathSegment.param.paramType === 'optional-catchall') {
                            break;
                        }
                        // Unknown param placeholder in pathname - can't derive full value
                        return undefined;
                    }
                    // If the segment matches a param, use the param value
                    // We don't encode values here as that's handled during retrieval.
                    const paramValue = params[pathSegment.param.paramName];
                    if (Array.isArray(paramValue)) {
                        processedSegments.push(...paramValue);
                    } else {
                        processedSegments.push(paramValue);
                    }
                }
            }
            if (processedSegments.length > 0) {
                return processedSegments;
            } else if (paramType === 'optional-catchall') {
                return undefined;
            } else {
                // We shouldn't be able to match a catchall segment without any path
                // segments if it's not an optional catchall
                throw Object.defineProperty(new _invarianterror.InvariantError(`Unexpected empty path segments match for a route "${route.pathname}" with param "${paramName}" of type "${paramType}"`), "__NEXT_ERROR_CODE", {
                    value: "E931",
                    enumerable: false,
                    configurable: true
                });
            }
        case 'dynamic':
        case 'dynamic-intercepted-(..)(..)':
        case 'dynamic-intercepted-(.)':
        case 'dynamic-intercepted-(..)':
        case 'dynamic-intercepted-(...)':
            // For regular dynamic parameters, take the segment at this depth
            if (depth < route.segments.length) {
                const pathSegment = route.segments[depth];
                // Check if the segment at this depth is a placeholder for an unknown param
                if (pathSegment.type === 'dynamic' && !params.hasOwnProperty(pathSegment.param.paramName)) {
                    // The segment is a placeholder like [category] and we don't have the value
                    return undefined;
                }
                // If the segment matches a param, use the param value from params object
                // Otherwise it's a static segment, just use it directly
                // We don't encode values here as that's handled during retrieval
                return getParamValueFromSegment(pathSegment, params, paramType);
            }
            return undefined;
        default:
            paramType;
    }
}
}),
1902, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    PARAMETER_PATTERN: null,
    getDynamicParam: null,
    interpolateParallelRouteParams: null,
    parseMatchedParameter: null,
    parseParameter: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    PARAMETER_PATTERN: function() {
        return PARAMETER_PATTERN;
    },
    getDynamicParam: function() {
        return getDynamicParam;
    },
    interpolateParallelRouteParams: function() {
        return interpolateParallelRouteParams;
    },
    parseMatchedParameter: function() {
        return parseMatchedParameter;
    },
    parseParameter: function() {
        return parseParameter;
    }
});
const _invarianterror = __turbopack_context__.r(7117);
const _parseloadertree = __turbopack_context__.r(9141);
const _app = __turbopack_context__.r(606);
const _resolveparamvalue = __turbopack_context__.r(5882);
/**
 * Gets the value of a param from the params object. This correctly handles the
 * case where the param is a fallback route param and encodes the resulting
 * value.
 *
 * @param interpolatedParams - The params object.
 * @param segmentKey - The key of the segment.
 * @param fallbackRouteParams - The fallback route params.
 * @returns The value of the param.
 */ function getParamValue(interpolatedParams, segmentKey, fallbackRouteParams) {
    let value = interpolatedParams[segmentKey];
    if (fallbackRouteParams?.has(segmentKey)) {
        // We know that the fallback route params has the segment key because we
        // checked that above.
        const [searchValue] = fallbackRouteParams.get(segmentKey);
        value = searchValue;
    } else if (Array.isArray(value)) {
        value = value.map((i)=>encodeURIComponent(i));
    } else if (typeof value === 'string') {
        value = encodeURIComponent(value);
    }
    return value;
}
function interpolateParallelRouteParams(loaderTree, params, pagePath, fallbackRouteParams) {
    const interpolated = structuredClone(params);
    // Stack-based traversal with depth tracking
    const stack = [
        {
            tree: loaderTree,
            depth: 0
        }
    ];
    // Parse the route from the provided page path.
    const route = (0, _app.parseNormalizedAppRoute)(pagePath);
    while(stack.length > 0){
        const { tree, depth } = stack.pop();
        const { segment, parallelRoutes } = (0, _parseloadertree.parseLoaderTree)(tree);
        const appSegment = (0, _app.parseAppRouteSegment)(segment);
        if (appSegment?.type === 'dynamic' && !interpolated.hasOwnProperty(appSegment.param.paramName) && // If the param is in the fallback route params, we don't need to
        // interpolate it because it's already marked as being unknown.
        !fallbackRouteParams?.has(appSegment.param.paramName)) {
            const { paramName, paramType } = appSegment.param;
            const paramValue = (0, _resolveparamvalue.resolveParamValue)(paramName, paramType, depth, route, interpolated);
            if (paramValue !== undefined) {
                interpolated[paramName] = paramValue;
            } else if (paramType !== 'optional-catchall') {
                throw Object.defineProperty(new _invarianterror.InvariantError(`Could not resolve param value for segment: ${paramName}`), "__NEXT_ERROR_CODE", {
                    value: "E932",
                    enumerable: false,
                    configurable: true
                });
            }
        }
        // Calculate next depth - increment if this is not a route group and not empty
        let nextDepth = depth;
        if (appSegment && appSegment.type !== 'route-group' && appSegment.type !== 'parallel-route') {
            nextDepth++;
        }
        // Add all parallel routes to the stack for processing
        for (const parallelRoute of Object.values(parallelRoutes)){
            stack.push({
                tree: parallelRoute,
                depth: nextDepth
            });
        }
    }
    return interpolated;
}
function getDynamicParam(interpolatedParams, segmentKey, dynamicParamType, fallbackRouteParams, staticSiblings) {
    let value = getParamValue(interpolatedParams, segmentKey, fallbackRouteParams);
    // handle the case where an optional catchall does not have a value,
    // e.g. `/dashboard/[[...slug]]` when requesting `/dashboard`
    if (!value || value.length === 0) {
        if (dynamicParamType === 'oc') {
            return {
                param: segmentKey,
                value: null,
                type: dynamicParamType,
                treeSegment: [
                    segmentKey,
                    '',
                    dynamicParamType,
                    staticSiblings
                ]
            };
        }
        throw Object.defineProperty(new _invarianterror.InvariantError(`Missing value for segment key: "${segmentKey}" with dynamic param type: ${dynamicParamType}`), "__NEXT_ERROR_CODE", {
            value: "E864",
            enumerable: false,
            configurable: true
        });
    }
    const paramCacheKey = Array.isArray(value) ? value.join('/') : value;
    return {
        param: segmentKey,
        // The value that is passed to user code.
        value,
        // The value that is rendered in the router tree.
        // TODO: If the number of static siblings exceeds some threshold (e.g.,
        // dozens or hundreds), consider sending a Bloom filter instead of the full
        // array to reduce payload size. The client would then use the Bloom filter
        // to check membership with a small false positive rate.
        treeSegment: [
            segmentKey,
            paramCacheKey,
            dynamicParamType,
            staticSiblings
        ],
        type: dynamicParamType
    };
}
const PARAMETER_PATTERN = /^([^[]*)\[((?:\[[^\]]*\])|[^\]]+)\](.*)$/;
function parseParameter(param) {
    const match = param.match(PARAMETER_PATTERN);
    if (!match) {
        return parseMatchedParameter(param);
    }
    return parseMatchedParameter(match[2]);
}
function parseMatchedParameter(param) {
    const optional = param.startsWith('[') && param.endsWith(']');
    if (optional) {
        param = param.slice(1, -1);
    }
    const repeat = param.startsWith('...');
    if (repeat) {
        param = param.slice(3);
    }
    return {
        key: param,
        repeat,
        optional
    };
}
}),
4599, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getNamedMiddlewareRegex: null,
    getNamedRouteRegex: null,
    getRouteRegex: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getNamedMiddlewareRegex: function() {
        return getNamedMiddlewareRegex;
    },
    getNamedRouteRegex: function() {
        return getNamedRouteRegex;
    },
    getRouteRegex: function() {
        return getRouteRegex;
    }
});
const _constants = __turbopack_context__.r(2987);
const _interceptionroutes = __turbopack_context__.r(9161);
const _escaperegexp = __turbopack_context__.r(2778);
const _removetrailingslash = __turbopack_context__.r(3486);
const _getdynamicparam = __turbopack_context__.r(1902);
function getParametrizedRoute(route, includeSuffix, includePrefix) {
    const groups = {};
    let groupIndex = 1;
    const segments = [];
    for (const segment of (0, _removetrailingslash.removeTrailingSlash)(route).slice(1).split('/')){
        const markerMatch = _interceptionroutes.INTERCEPTION_ROUTE_MARKERS.find((m)=>segment.startsWith(m));
        const paramMatches = segment.match(_getdynamicparam.PARAMETER_PATTERN) // Check for parameters
        ;
        if (markerMatch && paramMatches && paramMatches[2]) {
            const { key, optional, repeat } = (0, _getdynamicparam.parseMatchedParameter)(paramMatches[2]);
            groups[key] = {
                pos: groupIndex++,
                repeat,
                optional
            };
            segments.push(`/${(0, _escaperegexp.escapeStringRegexp)(markerMatch)}([^/]+?)`);
        } else if (paramMatches && paramMatches[2]) {
            const { key, repeat, optional } = (0, _getdynamicparam.parseMatchedParameter)(paramMatches[2]);
            groups[key] = {
                pos: groupIndex++,
                repeat,
                optional
            };
            if (includePrefix && paramMatches[1]) {
                segments.push(`/${(0, _escaperegexp.escapeStringRegexp)(paramMatches[1])}`);
            }
            let s = repeat ? optional ? '(?:/(.+?))?' : '/(.+?)' : '/([^/]+?)';
            // Remove the leading slash if includePrefix already added it.
            if (includePrefix && paramMatches[1]) {
                s = s.substring(1);
            }
            segments.push(s);
        } else {
            segments.push(`/${(0, _escaperegexp.escapeStringRegexp)(segment)}`);
        }
        // If there's a suffix, add it to the segments if it's enabled.
        if (includeSuffix && paramMatches && paramMatches[3]) {
            segments.push((0, _escaperegexp.escapeStringRegexp)(paramMatches[3]));
        }
    }
    return {
        parameterizedRoute: segments.join(''),
        groups
    };
}
function getRouteRegex(normalizedRoute, { includeSuffix = false, includePrefix = false, excludeOptionalTrailingSlash = false } = {}) {
    const { parameterizedRoute, groups } = getParametrizedRoute(normalizedRoute, includeSuffix, includePrefix);
    let re = parameterizedRoute;
    if (!excludeOptionalTrailingSlash) {
        re += '(?:/)?';
    }
    return {
        re: new RegExp(`^${re}$`),
        groups: groups
    };
}
/**
 * Builds a function to generate a minimal routeKey using only a-z and minimal
 * number of characters.
 */ function buildGetSafeRouteKey() {
    let i = 0;
    return ()=>{
        let routeKey = '';
        let j = ++i;
        while(j > 0){
            routeKey += String.fromCharCode(97 + (j - 1) % 26);
            j = Math.floor((j - 1) / 26);
        }
        return routeKey;
    };
}
function getSafeKeyFromSegment({ interceptionMarker, getSafeRouteKey, segment, routeKeys, keyPrefix, backreferenceDuplicateKeys }) {
    const { key, optional, repeat } = (0, _getdynamicparam.parseMatchedParameter)(segment);
    // replace any non-word characters since they can break
    // the named regex
    let cleanedKey = key.replace(/\W/g, '');
    if (keyPrefix) {
        cleanedKey = `${keyPrefix}${cleanedKey}`;
    }
    let invalidKey = false;
    // check if the key is still invalid and fallback to using a known
    // safe key
    if (cleanedKey.length === 0 || cleanedKey.length > 30) {
        invalidKey = true;
    }
    if (!isNaN(parseInt(cleanedKey.slice(0, 1)))) {
        invalidKey = true;
    }
    if (invalidKey) {
        cleanedKey = getSafeRouteKey();
    }
    const duplicateKey = cleanedKey in routeKeys;
    if (keyPrefix) {
        routeKeys[cleanedKey] = `${keyPrefix}${key}`;
    } else {
        routeKeys[cleanedKey] = key;
    }
    // if the segment has an interception marker, make sure that's part of the regex pattern
    // this is to ensure that the route with the interception marker doesn't incorrectly match
    // the non-intercepted route (ie /app/(.)[username] should not match /app/[username])
    const interceptionPrefix = interceptionMarker ? (0, _escaperegexp.escapeStringRegexp)(interceptionMarker) : '';
    let pattern;
    if (duplicateKey && backreferenceDuplicateKeys) {
        // Use a backreference to the key to ensure that the key is the same value
        // in each of the placeholders.
        pattern = `\\k<${cleanedKey}>`;
    } else if (repeat) {
        pattern = `(?<${cleanedKey}>.+?)`;
    } else {
        pattern = `(?<${cleanedKey}>[^/]+?)`;
    }
    return {
        key,
        pattern: optional ? `(?:/${interceptionPrefix}${pattern})?` : `/${interceptionPrefix}${pattern}`,
        cleanedKey: cleanedKey,
        optional,
        repeat
    };
}
function getNamedParametrizedRoute(route, prefixRouteKeys, includeSuffix, includePrefix, backreferenceDuplicateKeys, reference = {
    names: {},
    intercepted: {}
}) {
    const getSafeRouteKey = buildGetSafeRouteKey();
    const routeKeys = {};
    const segments = [];
    const inverseParts = [];
    // Ensure we don't mutate the original reference object.
    reference = structuredClone(reference);
    for (const segment of (0, _removetrailingslash.removeTrailingSlash)(route).slice(1).split('/')){
        const hasInterceptionMarker = _interceptionroutes.INTERCEPTION_ROUTE_MARKERS.some((m)=>segment.startsWith(m));
        const paramMatches = segment.match(_getdynamicparam.PARAMETER_PATTERN) // Check for parameters
        ;
        const interceptionMarker = hasInterceptionMarker ? paramMatches?.[1] : undefined;
        let keyPrefix;
        if (interceptionMarker && paramMatches?.[2]) {
            keyPrefix = prefixRouteKeys ? _constants.NEXT_INTERCEPTION_MARKER_PREFIX : undefined;
            reference.intercepted[paramMatches[2]] = interceptionMarker;
        } else if (paramMatches?.[2] && reference.intercepted[paramMatches[2]]) {
            keyPrefix = prefixRouteKeys ? _constants.NEXT_INTERCEPTION_MARKER_PREFIX : undefined;
        } else {
            keyPrefix = prefixRouteKeys ? _constants.NEXT_QUERY_PARAM_PREFIX : undefined;
        }
        if (interceptionMarker && paramMatches && paramMatches[2]) {
            // If there's an interception marker, add it to the segments.
            const { key, pattern, cleanedKey, repeat, optional } = getSafeKeyFromSegment({
                getSafeRouteKey,
                interceptionMarker,
                segment: paramMatches[2],
                routeKeys,
                keyPrefix,
                backreferenceDuplicateKeys
            });
            segments.push(pattern);
            inverseParts.push(`/${paramMatches[1]}:${reference.names[key] ?? cleanedKey}${repeat ? optional ? '*' : '+' : ''}`);
            reference.names[key] ??= cleanedKey;
        } else if (paramMatches && paramMatches[2]) {
            // If there's a prefix, add it to the segments if it's enabled.
            if (includePrefix && paramMatches[1]) {
                segments.push(`/${(0, _escaperegexp.escapeStringRegexp)(paramMatches[1])}`);
                inverseParts.push(`/${paramMatches[1]}`);
            }
            const { key, pattern, cleanedKey, repeat, optional } = getSafeKeyFromSegment({
                getSafeRouteKey,
                segment: paramMatches[2],
                routeKeys,
                keyPrefix,
                backreferenceDuplicateKeys
            });
            // Remove the leading slash if includePrefix already added it.
            let s = pattern;
            if (includePrefix && paramMatches[1]) {
                s = s.substring(1);
            }
            segments.push(s);
            inverseParts.push(`/:${reference.names[key] ?? cleanedKey}${repeat ? optional ? '*' : '+' : ''}`);
            reference.names[key] ??= cleanedKey;
        } else {
            segments.push(`/${(0, _escaperegexp.escapeStringRegexp)(segment)}`);
            inverseParts.push(`/${segment}`);
        }
        // If there's a suffix, add it to the segments if it's enabled.
        if (includeSuffix && paramMatches && paramMatches[3]) {
            segments.push((0, _escaperegexp.escapeStringRegexp)(paramMatches[3]));
            inverseParts.push(paramMatches[3]);
        }
    }
    return {
        namedParameterizedRoute: segments.join(''),
        routeKeys,
        pathToRegexpPattern: inverseParts.join(''),
        reference
    };
}
function getNamedRouteRegex(normalizedRoute, options) {
    const result = getNamedParametrizedRoute(normalizedRoute, options.prefixRouteKeys, options.includeSuffix ?? false, options.includePrefix ?? false, options.backreferenceDuplicateKeys ?? false, options.reference);
    let namedRegex = result.namedParameterizedRoute;
    if (!options.excludeOptionalTrailingSlash) {
        namedRegex += '(?:/)?';
    }
    return {
        ...getRouteRegex(normalizedRoute, options),
        namedRegex: `^${namedRegex}$`,
        routeKeys: result.routeKeys,
        pathToRegexpPattern: result.pathToRegexpPattern,
        reference: result.reference
    };
}
function getNamedMiddlewareRegex(normalizedRoute, options) {
    const { parameterizedRoute } = getParametrizedRoute(normalizedRoute, false, false);
    const { catchAll = true } = options;
    if (parameterizedRoute === '/') {
        let catchAllRegex = catchAll ? '.*' : '';
        return {
            namedRegex: `^/${catchAllRegex}$`
        };
    }
    const { namedParameterizedRoute } = getNamedParametrizedRoute(normalizedRoute, false, false, false, false, undefined);
    let catchAllGroupedRegex = catchAll ? '(?:(/.*)?)' : '';
    return {
        namedRegex: `^${namedParameterizedRoute}${catchAllGroupedRegex}$`
    };
}
}),
169, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "interpolateAs", {
    enumerable: true,
    get: function() {
        return interpolateAs;
    }
});
const _routematcher = __turbopack_context__.r(9944);
const _routeregex = __turbopack_context__.r(4599);
function interpolateAs(route, asPathname, query) {
    let interpolatedRoute = '';
    const dynamicRegex = (0, _routeregex.getRouteRegex)(route);
    const dynamicGroups = dynamicRegex.groups;
    const dynamicMatches = (asPathname !== route ? (0, _routematcher.getRouteMatcher)(dynamicRegex)(asPathname) : '') || // Fall back to reading the values from the href
    // TODO: should this take priority; also need to change in the router.
    query;
    interpolatedRoute = route;
    const params = Object.keys(dynamicGroups);
    if (!params.every((param)=>{
        let value = dynamicMatches[param] || '';
        const { repeat, optional } = dynamicGroups[param];
        // support single-level catch-all
        // TODO: more robust handling for user-error (passing `/`)
        let replaced = `[${repeat ? '...' : ''}${param}]`;
        if (optional) {
            replaced = `${!value ? '/' : ''}[${replaced}]`;
        }
        if (repeat && !Array.isArray(value)) value = [
            value
        ];
        return (optional || param in dynamicMatches) && // Interpolate group into data URL if present
        (interpolatedRoute = interpolatedRoute.replace(replaced, repeat ? value.map(// path delimiter escaped since they are being inserted
        // into the URL and we expect URL encoded segments
        // when parsing dynamic route params
        (segment)=>encodeURIComponent(segment)).join('/') : encodeURIComponent(value)) || '/');
    })) {
        interpolatedRoute = '' // did not satisfy all requirements
        ;
    // n.b. We ignore this error because we handle warning for this case in
    // development in the `<Link>` component directly.
    }
    return {
        params,
        result: interpolatedRoute
    };
}
}),
6544, ((__turbopack_context__, module, exports) => {
"use strict";

// Translates a logical route into its pages asset path (relative from a common prefix)
// "asset path" being its javascript file, data file, prerendered html,...
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return getAssetPathFromRoute;
    }
});
function getAssetPathFromRoute(route, ext = '') {
    const path = route === '/' ? '/index' : /^\/index(\/|$)/.test(route) ? `/index${route}` : route;
    return path + ext;
}
}),
4862, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "addLocale", {
    enumerable: true,
    get: function() {
        return addLocale;
    }
});
const _normalizetrailingslash = __turbopack_context__.r(90);
const addLocale = (path, ...args)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return path;
};
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
9590, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseRelativeUrl", {
    enumerable: true,
    get: function() {
        return parseRelativeUrl;
    }
});
const _utils = __turbopack_context__.r(9129);
const _querystring = __turbopack_context__.r(8928);
function parseRelativeUrl(url, base, parseQuery = true) {
    const globalBase = new URL(typeof window === 'undefined' ? 'http://n' : (0, _utils.getLocationOrigin)());
    const resolvedBase = base ? new URL(base, globalBase) : url.startsWith('.') ? new URL(typeof window === 'undefined' ? 'http://n' : window.location.href) : globalBase;
    const { pathname, searchParams, search, hash, href, origin } = url.startsWith('/') ? // Not using `origin` to support other protocols
    new URL(`${resolvedBase.protocol}//${resolvedBase.host}${url}`) : new URL(url, resolvedBase);
    if (origin !== globalBase.origin) {
        throw Object.defineProperty(new Error(`invariant: invalid relative URL, router received ${url}`), "__NEXT_ERROR_CODE", {
            value: "E159",
            enumerable: false,
            configurable: true
        });
    }
    return {
        auth: null,
        host: null,
        hostname: null,
        pathname,
        port: null,
        protocol: null,
        query: parseQuery ? (0, _querystring.searchParamsToUrlQuery)(searchParams) : undefined,
        search,
        hash,
        href: href.slice(origin.length),
        // We don't know for relative URLs at this point since we set a custom, internal
        // base that isn't surfaced to users.
        slashes: null
    };
}
}),
8862, ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Stores the Trusted Types Policy. Starts as undefined and can be set to null
 * if Trusted Types is not supported in the browser.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "__unsafeCreateTrustedScriptURL", {
    enumerable: true,
    get: function() {
        return __unsafeCreateTrustedScriptURL;
    }
});
let policy;
/**
 * Getter for the Trusted Types Policy. If it is undefined, it is instantiated
 * here or set to null if Trusted Types is not supported in the browser.
 */ function getPolicy() {
    if (typeof policy === 'undefined' && typeof window !== 'undefined') {
        policy = window.trustedTypes?.createPolicy('nextjs', {
            createHTML: (input)=>input,
            createScript: (input)=>input,
            createScriptURL: (input)=>input
        }) || null;
    }
    return policy;
}
function __unsafeCreateTrustedScriptURL(url) {
    return getPolicy()?.createScriptURL(url) || url;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
9604, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    cancelIdleCallback: null,
    requestIdleCallback: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    cancelIdleCallback: function() {
        return cancelIdleCallback;
    },
    requestIdleCallback: function() {
        return requestIdleCallback;
    }
});
const requestIdleCallback = typeof self !== 'undefined' && self.requestIdleCallback && self.requestIdleCallback.bind(window) || function(cb) {
    let start = Date.now();
    return self.setTimeout(function() {
        cb({
            didTimeout: false,
            timeRemaining: function() {
                return Math.max(0, 50 - (Date.now() - start));
            }
        });
    }, 1);
};
const cancelIdleCallback = typeof self !== 'undefined' && self.cancelIdleCallback && self.cancelIdleCallback.bind(window) || function(id) {
    return clearTimeout(id);
};
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
931, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "encodeURIPath", {
    enumerable: true,
    get: function() {
        return encodeURIPath;
    }
});
function encodeURIPath(file) {
    return file.split('/').map((p)=>encodeURIComponent(p)).join('/');
}
}),
1741, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolvePromiseWithTimeout", {
    enumerable: true,
    get: function() {
        return resolvePromiseWithTimeout;
    }
});
const _requestidlecallback = __turbopack_context__.r(9604);
// 3.8s was arbitrarily chosen as it's what https://web.dev/interactive
// considers as "Good" time-to-interactive. We must assume something went
// wrong beyond this point, and then fall-back to a full page transition to
// show the user something of value.
const MS_MAX_IDLE_DELAY = 3800;
function resolvePromiseWithTimeout(p, err, devPromise) {
    return new Promise((resolve, reject)=>{
        let cancelled = false;
        p.then((r)=>{
            // Resolved, cancel the timeout
            cancelled = true;
            resolve(r);
        }).catch(reject);
        // We wrap these checks separately for better dead-code elimination in
        // production bundles.
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        if ("TURBOPACK compile-time truthy", 1) {
            (0, _requestidlecallback.requestIdleCallback)(()=>setTimeout(()=>{
                    if (!cancelled) {
                        reject(err);
                    }
                }, MS_MAX_IDLE_DELAY));
        }
    });
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
5447, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createRouteLoader: null,
    getClientBuildManifest: null,
    isAssetError: null,
    markAssetError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createRouteLoader: function() {
        return createRouteLoader;
    },
    getClientBuildManifest: function() {
        return getClientBuildManifest;
    },
    isAssetError: function() {
        return isAssetError;
    },
    markAssetError: function() {
        return markAssetError;
    }
});
const _interop_require_default = __turbopack_context__.r(1705);
const _getassetpathfromroute = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r(6544));
const _trustedtypes = __turbopack_context__.r(8862);
const _requestidlecallback = __turbopack_context__.r(9604);
const _deploymentid = __turbopack_context__.r(262);
const _encodeuripath = __turbopack_context__.r(931);
const _promise = __turbopack_context__.r(1741);
function withFuture(key, map, generator) {
    let entry = map.get(key);
    if (entry) {
        if ('future' in entry) {
            return entry.future;
        }
        return Promise.resolve(entry);
    }
    let resolver;
    const prom = new Promise((resolve)=>{
        resolver = resolve;
    });
    map.set(key, {
        resolve: resolver,
        future: prom
    });
    return generator ? generator().then((value)=>{
        resolver(value);
        return value;
    }).catch((err)=>{
        map.delete(key);
        throw err;
    }) : prom;
}
const ASSET_LOAD_ERROR = Symbol('ASSET_LOAD_ERROR');
function markAssetError(err) {
    return Object.defineProperty(err, ASSET_LOAD_ERROR, {});
}
function isAssetError(err) {
    return err && ASSET_LOAD_ERROR in err;
}
function hasPrefetch(link) {
    try {
        link = document.createElement('link');
        return(// with relList.support
        !!window.MSInputMethodContext && !!document.documentMode || link.relList.supports('prefetch'));
    } catch  {
        return false;
    }
}
const canPrefetch = hasPrefetch();
function prefetchViaDom(href, as, link) {
    return new Promise((resolve, reject)=>{
        const selector = `
      link[rel="prefetch"][href^="${href}"],
      link[rel="preload"][href^="${href}"],
      script[src^="${href}"]`;
        if (document.querySelector(selector)) {
            return resolve();
        }
        link = document.createElement('link');
        // The order of property assignment here is intentional:
        if (as) link.as = as;
        link.rel = `prefetch`;
        link.crossOrigin = ("TURBOPACK compile-time value", void 0);
        link.onload = resolve;
        link.onerror = ()=>reject(markAssetError(Object.defineProperty(new Error(`Failed to prefetch: ${href}`), "__NEXT_ERROR_CODE", {
                value: "E268",
                enumerable: false,
                configurable: true
            })));
        // `href` should always be last:
        link.href = href;
        document.head.appendChild(link);
    });
}
function appendScript(src, script) {
    return new Promise((resolve, reject)=>{
        script = document.createElement('script');
        // The order of property assignment here is intentional.
        // 1. Setup success/failure hooks in case the browser synchronously
        //    executes when `src` is set.
        script.onload = resolve;
        script.onerror = ()=>reject(markAssetError(Object.defineProperty(new Error(`Failed to load script: ${src}`), "__NEXT_ERROR_CODE", {
                value: "E74",
                enumerable: false,
                configurable: true
            })));
        // 2. Configure the cross-origin attribute before setting `src` in case the
        //    browser begins to fetch.
        script.crossOrigin = ("TURBOPACK compile-time value", void 0);
        // 3. Finally, set the source and inject into the DOM in case the child
        //    must be appended for fetching to start.
        script.src = src;
        document.body.appendChild(script);
    });
}
// We wait for pages to be built in dev before we start the route transition
// timeout to prevent an un-necessary hard navigation in development.
let devBuildPromise;
function getClientBuildManifest() {
    if (self.__BUILD_MANIFEST) {
        return Promise.resolve(self.__BUILD_MANIFEST);
    }
    const onBuildManifest = new Promise((resolve)=>{
        // Mandatory because this is not concurrent safe:
        const cb = self.__BUILD_MANIFEST_CB;
        self.__BUILD_MANIFEST_CB = ()=>{
            resolve(self.__BUILD_MANIFEST);
            cb && cb();
        };
    });
    return (0, _promise.resolvePromiseWithTimeout)(onBuildManifest, markAssetError(Object.defineProperty(new Error('Failed to load client build manifest'), "__NEXT_ERROR_CODE", {
        value: "E273",
        enumerable: false,
        configurable: true
    })), devBuildPromise);
}
function getFilesForRoute(assetPrefix, route) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return getClientBuildManifest().then((manifest)=>{
        if (!(route in manifest)) {
            throw markAssetError(Object.defineProperty(new Error(`Failed to lookup route: ${route}`), "__NEXT_ERROR_CODE", {
                value: "E446",
                enumerable: false,
                configurable: true
            }));
        }
        const allFiles = manifest[route].map((entry)=>assetPrefix + '/_next/' + (0, _encodeuripath.encodeURIPath)(entry));
        return {
            scripts: allFiles.filter((v)=>v.endsWith('.js')).map((v)=>(0, _trustedtypes.__unsafeCreateTrustedScriptURL)(v) + (0, _deploymentid.getAssetTokenQuery)()),
            css: allFiles.filter((v)=>v.endsWith('.css')).map((v)=>v + (0, _deploymentid.getAssetTokenQuery)())
        };
    });
}
function createRouteLoader(assetPrefix) {
    const entrypoints = new Map();
    const loadedScripts = new Map();
    const styleSheets = new Map();
    const routes = new Map();
    const bootstrappedRoutes = new Set();
    // Bootstrap a client-loaded route (navigation/prefetch) so its entry registers via
    // `window.__NEXT_P`. The initial page is bootstrapped in the document.
    function bootstrapRoute(route) {
        // Gated for DCE
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const params = undefined;
        const global = undefined;
    }
    function maybeExecuteScript(src) {
        // With HMR we might need to "reload" scripts when they are
        // disposed and readded. Executing scripts twice has no functional
        // differences
        if ("TURBOPACK compile-time truthy", 1) {
            let prom = loadedScripts.get(src.toString());
            if (prom) {
                return prom;
            }
            // Skip executing script if it's already in the DOM:
            if (document.querySelector(`script[src^="${src}"]`)) {
                return Promise.resolve();
            }
            loadedScripts.set(src.toString(), prom = appendScript(src));
            return prom;
        } else //TURBOPACK unreachable
        ;
    }
    function fetchStyleSheet(href) {
        let prom = styleSheets.get(href);
        if (prom) {
            return prom;
        }
        styleSheets.set(href, prom = fetch(href, {
            credentials: 'same-origin'
        }).then((res)=>{
            if (!res.ok) {
                throw Object.defineProperty(new Error(`Failed to load stylesheet: ${href}`), "__NEXT_ERROR_CODE", {
                    value: "E189",
                    enumerable: false,
                    configurable: true
                });
            }
            return res.text().then((text)=>({
                    href: href,
                    content: text
                }));
        }).catch((err)=>{
            throw markAssetError(err);
        }));
        return prom;
    }
    return {
        whenEntrypoint (route) {
            return withFuture(route, entrypoints);
        },
        onEntrypoint (route, execute) {
            ;
            (execute ? Promise.resolve().then(()=>execute()).then((exports1)=>({
                    component: exports1 && exports1.default || exports1,
                    exports: exports1
                }), (err)=>({
                    error: err
                })) : Promise.resolve(undefined)).then((input)=>{
                const old = entrypoints.get(route);
                if (old && 'resolve' in old) {
                    if (input) {
                        entrypoints.set(route, input);
                        old.resolve(input);
                    }
                } else {
                    if (input) {
                        entrypoints.set(route, input);
                    } else {
                        entrypoints.delete(route);
                    }
                    // when this entrypoint has been resolved before
                    // the route is outdated and we want to invalidate
                    // this cache entry
                    routes.delete(route);
                }
            });
        },
        loadRoute (route, prefetch) {
            return withFuture(route, routes, ()=>{
                let devBuildPromiseResolve;
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                return (0, _promise.resolvePromiseWithTimeout)(getFilesForRoute(assetPrefix, route).then(({ scripts, css })=>{
                    return Promise.all([
                        entrypoints.has(route) ? [] : Promise.all(scripts.map(maybeExecuteScript)).then((r)=>{
                            bootstrapRoute(route);
                            return r;
                        }),
                        Promise.all(css.map(fetchStyleSheet))
                    ]);
                }).then((res)=>{
                    return this.whenEntrypoint(route).then((entrypoint)=>({
                            entrypoint,
                            styles: res[1]
                        }));
                }), markAssetError(Object.defineProperty(new Error(`Route did not complete loading: ${route}`), "__NEXT_ERROR_CODE", {
                    value: "E12",
                    enumerable: false,
                    configurable: true
                })), devBuildPromise).then(({ entrypoint, styles })=>{
                    const res = Object.assign({
                        styles: styles
                    }, entrypoint);
                    return 'error' in entrypoint ? entrypoint : res;
                }).catch((err)=>{
                    if (prefetch) {
                        // we don't want to cache errors during prefetch
                        throw err;
                    }
                    return {
                        error: err
                    };
                }).finally(()=>devBuildPromiseResolve?.());
            });
        },
        prefetch (route) {
            // https://github.com/GoogleChromeLabs/quicklink/blob/453a661fa1fa940e2d2e044452398e38c67a98fb/src/index.mjs#L115-L118
            // License: Apache 2.0
            let cn;
            if (cn = navigator.connection) {
                // Don't prefetch if using 2G or if Save-Data is enabled.
                if (cn.saveData || /2g/.test(cn.effectiveType)) return Promise.resolve();
            }
            return getFilesForRoute(assetPrefix, route).then((output)=>Promise.all(canPrefetch ? output.scripts.map((script)=>prefetchViaDom(script.toString(), 'script')) : [])).then(()=>{
                (0, _requestidlecallback.requestIdleCallback)(()=>this.loadRoute(route, true).catch(()=>{}));
            }).catch(()=>{});
        }
    };
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
4221, ((__turbopack_context__, module, exports) => {
"use strict";

// Note: This file is JS because it's used by the taskfile-swc.js file, which is JS.
// Keep file changes in sync with the corresponding `.d.ts` files.
/**
 * These are the minimum browser versions that we consider "modern" and thus compile for by default.
 * This list was generated using `pnpm browserslist "baseline widely available"` on 2025-10-01.
 */ const MODERN_BROWSERSLIST_TARGET = [
    'chrome 111',
    'edge 111',
    'firefox 111',
    'safari 16.4'
];
module.exports = MODERN_BROWSERSLIST_TARGET;
}),
2063, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    UNDERSCORE_GLOBAL_ERROR_ROUTE: null,
    UNDERSCORE_GLOBAL_ERROR_ROUTE_ENTRY: null,
    UNDERSCORE_NOT_FOUND_ROUTE: null,
    UNDERSCORE_NOT_FOUND_ROUTE_ENTRY: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    UNDERSCORE_GLOBAL_ERROR_ROUTE: function() {
        return UNDERSCORE_GLOBAL_ERROR_ROUTE;
    },
    UNDERSCORE_GLOBAL_ERROR_ROUTE_ENTRY: function() {
        return UNDERSCORE_GLOBAL_ERROR_ROUTE_ENTRY;
    },
    UNDERSCORE_NOT_FOUND_ROUTE: function() {
        return UNDERSCORE_NOT_FOUND_ROUTE;
    },
    UNDERSCORE_NOT_FOUND_ROUTE_ENTRY: function() {
        return UNDERSCORE_NOT_FOUND_ROUTE_ENTRY;
    }
});
const UNDERSCORE_NOT_FOUND_ROUTE = '/_not-found';
const UNDERSCORE_NOT_FOUND_ROUTE_ENTRY = `${UNDERSCORE_NOT_FOUND_ROUTE}/page`;
const UNDERSCORE_GLOBAL_ERROR_ROUTE = '/_global-error';
const UNDERSCORE_GLOBAL_ERROR_ROUTE_ENTRY = `${UNDERSCORE_GLOBAL_ERROR_ROUTE}/page`;
}),
8784, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    APP_CLIENT_INTERNALS: null,
    APP_PATHS_MANIFEST: null,
    APP_PATH_ROUTES_MANIFEST: null,
    AdapterOutputType: null,
    BARREL_OPTIMIZATION_PREFIX: null,
    BLOCKED_PAGES: null,
    BUILD_ID_FILE: null,
    BUILD_MANIFEST: null,
    CLIENT_PUBLIC_FILES_PATH: null,
    CLIENT_REFERENCE_MANIFEST: null,
    CLIENT_STATIC_FILES_PATH: null,
    CLIENT_STATIC_FILES_RUNTIME_MAIN: null,
    CLIENT_STATIC_FILES_RUNTIME_MAIN_APP: null,
    CLIENT_STATIC_FILES_RUNTIME_POLYFILLS: null,
    CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL: null,
    CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH: null,
    CLIENT_STATIC_FILES_RUNTIME_WEBPACK: null,
    COMPILER_INDEXES: null,
    COMPILER_NAMES: null,
    CONFIG_FILES: null,
    DEFAULT_RUNTIME_WEBPACK: null,
    DEFAULT_SANS_SERIF_FONT: null,
    DEFAULT_SERIF_FONT: null,
    DEV_CLIENT_MIDDLEWARE_MANIFEST: null,
    DEV_CLIENT_PAGES_MANIFEST: null,
    DYNAMIC_CSS_MANIFEST: null,
    EDGE_RUNTIME_WEBPACK: null,
    EDGE_UNSUPPORTED_NODE_APIS: null,
    EXPORT_DETAIL: null,
    EXPORT_MARKER: null,
    FUNCTIONS_CONFIG_MANIFEST: null,
    IMAGES_MANIFEST: null,
    INTERCEPTION_ROUTE_REWRITE_MANIFEST: null,
    MIDDLEWARE_BUILD_MANIFEST: null,
    MIDDLEWARE_MANIFEST: null,
    MIDDLEWARE_REACT_LOADABLE_MANIFEST: null,
    MODERN_BROWSERSLIST_TARGET: null,
    NEXT_BUILTIN_DOCUMENT: null,
    NEXT_FONT_MANIFEST: null,
    PAGES_MANIFEST: null,
    PHASE_ANALYZE: null,
    PHASE_DEVELOPMENT_SERVER: null,
    PHASE_EXPORT: null,
    PHASE_INFO: null,
    PHASE_PRODUCTION_BUILD: null,
    PHASE_PRODUCTION_SERVER: null,
    PHASE_TEST: null,
    PREFETCH_HINTS: null,
    PRERENDER_MANIFEST: null,
    REACT_LOADABLE_MANIFEST: null,
    REQUEST_INSIGHTS_DEV_ENDPOINT: null,
    ROUTES_MANIFEST: null,
    RSC_MODULE_TYPES: null,
    SERVER_DIRECTORY: null,
    SERVER_FILES_MANIFEST: null,
    SERVER_PROPS_ID: null,
    SERVER_REFERENCE_MANIFEST: null,
    STATIC_PROPS_ID: null,
    STATIC_STATUS_PAGES: null,
    STRING_LITERAL_DROP_BUNDLE: null,
    SUBRESOURCE_INTEGRITY_MANIFEST: null,
    SYSTEM_ENTRYPOINTS: null,
    TRACE_OUTPUT_VERSION: null,
    TURBOPACK_CLIENT_BUILD_MANIFEST: null,
    TURBOPACK_CLIENT_MIDDLEWARE_MANIFEST: null,
    TURBO_TRACE_DEFAULT_MEMORY_LIMIT: null,
    UNDERSCORE_GLOBAL_ERROR_ROUTE: null,
    UNDERSCORE_GLOBAL_ERROR_ROUTE_ENTRY: null,
    UNDERSCORE_NOT_FOUND_ROUTE: null,
    UNDERSCORE_NOT_FOUND_ROUTE_ENTRY: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    APP_CLIENT_INTERNALS: function() {
        return APP_CLIENT_INTERNALS;
    },
    APP_PATHS_MANIFEST: function() {
        return APP_PATHS_MANIFEST;
    },
    APP_PATH_ROUTES_MANIFEST: function() {
        return APP_PATH_ROUTES_MANIFEST;
    },
    AdapterOutputType: function() {
        return AdapterOutputType;
    },
    BARREL_OPTIMIZATION_PREFIX: function() {
        return BARREL_OPTIMIZATION_PREFIX;
    },
    BLOCKED_PAGES: function() {
        return BLOCKED_PAGES;
    },
    BUILD_ID_FILE: function() {
        return BUILD_ID_FILE;
    },
    BUILD_MANIFEST: function() {
        return BUILD_MANIFEST;
    },
    CLIENT_PUBLIC_FILES_PATH: function() {
        return CLIENT_PUBLIC_FILES_PATH;
    },
    CLIENT_REFERENCE_MANIFEST: function() {
        return CLIENT_REFERENCE_MANIFEST;
    },
    CLIENT_STATIC_FILES_PATH: function() {
        return CLIENT_STATIC_FILES_PATH;
    },
    CLIENT_STATIC_FILES_RUNTIME_MAIN: function() {
        return CLIENT_STATIC_FILES_RUNTIME_MAIN;
    },
    CLIENT_STATIC_FILES_RUNTIME_MAIN_APP: function() {
        return CLIENT_STATIC_FILES_RUNTIME_MAIN_APP;
    },
    CLIENT_STATIC_FILES_RUNTIME_POLYFILLS: function() {
        return CLIENT_STATIC_FILES_RUNTIME_POLYFILLS;
    },
    CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL: function() {
        return CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL;
    },
    CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH: function() {
        return CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH;
    },
    CLIENT_STATIC_FILES_RUNTIME_WEBPACK: function() {
        return CLIENT_STATIC_FILES_RUNTIME_WEBPACK;
    },
    COMPILER_INDEXES: function() {
        return COMPILER_INDEXES;
    },
    COMPILER_NAMES: function() {
        return COMPILER_NAMES;
    },
    CONFIG_FILES: function() {
        return CONFIG_FILES;
    },
    DEFAULT_RUNTIME_WEBPACK: function() {
        return DEFAULT_RUNTIME_WEBPACK;
    },
    DEFAULT_SANS_SERIF_FONT: function() {
        return DEFAULT_SANS_SERIF_FONT;
    },
    DEFAULT_SERIF_FONT: function() {
        return DEFAULT_SERIF_FONT;
    },
    DEV_CLIENT_MIDDLEWARE_MANIFEST: function() {
        return DEV_CLIENT_MIDDLEWARE_MANIFEST;
    },
    DEV_CLIENT_PAGES_MANIFEST: function() {
        return DEV_CLIENT_PAGES_MANIFEST;
    },
    DYNAMIC_CSS_MANIFEST: function() {
        return DYNAMIC_CSS_MANIFEST;
    },
    EDGE_RUNTIME_WEBPACK: function() {
        return EDGE_RUNTIME_WEBPACK;
    },
    EDGE_UNSUPPORTED_NODE_APIS: function() {
        return EDGE_UNSUPPORTED_NODE_APIS;
    },
    EXPORT_DETAIL: function() {
        return EXPORT_DETAIL;
    },
    EXPORT_MARKER: function() {
        return EXPORT_MARKER;
    },
    FUNCTIONS_CONFIG_MANIFEST: function() {
        return FUNCTIONS_CONFIG_MANIFEST;
    },
    IMAGES_MANIFEST: function() {
        return IMAGES_MANIFEST;
    },
    INTERCEPTION_ROUTE_REWRITE_MANIFEST: function() {
        return INTERCEPTION_ROUTE_REWRITE_MANIFEST;
    },
    MIDDLEWARE_BUILD_MANIFEST: function() {
        return MIDDLEWARE_BUILD_MANIFEST;
    },
    MIDDLEWARE_MANIFEST: function() {
        return MIDDLEWARE_MANIFEST;
    },
    MIDDLEWARE_REACT_LOADABLE_MANIFEST: function() {
        return MIDDLEWARE_REACT_LOADABLE_MANIFEST;
    },
    MODERN_BROWSERSLIST_TARGET: function() {
        return _modernbrowserslisttarget.default;
    },
    NEXT_BUILTIN_DOCUMENT: function() {
        return NEXT_BUILTIN_DOCUMENT;
    },
    NEXT_FONT_MANIFEST: function() {
        return NEXT_FONT_MANIFEST;
    },
    PAGES_MANIFEST: function() {
        return PAGES_MANIFEST;
    },
    PHASE_ANALYZE: function() {
        return PHASE_ANALYZE;
    },
    PHASE_DEVELOPMENT_SERVER: function() {
        return PHASE_DEVELOPMENT_SERVER;
    },
    PHASE_EXPORT: function() {
        return PHASE_EXPORT;
    },
    PHASE_INFO: function() {
        return PHASE_INFO;
    },
    PHASE_PRODUCTION_BUILD: function() {
        return PHASE_PRODUCTION_BUILD;
    },
    PHASE_PRODUCTION_SERVER: function() {
        return PHASE_PRODUCTION_SERVER;
    },
    PHASE_TEST: function() {
        return PHASE_TEST;
    },
    PREFETCH_HINTS: function() {
        return PREFETCH_HINTS;
    },
    PRERENDER_MANIFEST: function() {
        return PRERENDER_MANIFEST;
    },
    REACT_LOADABLE_MANIFEST: function() {
        return REACT_LOADABLE_MANIFEST;
    },
    REQUEST_INSIGHTS_DEV_ENDPOINT: function() {
        return REQUEST_INSIGHTS_DEV_ENDPOINT;
    },
    ROUTES_MANIFEST: function() {
        return ROUTES_MANIFEST;
    },
    RSC_MODULE_TYPES: function() {
        return RSC_MODULE_TYPES;
    },
    SERVER_DIRECTORY: function() {
        return SERVER_DIRECTORY;
    },
    SERVER_FILES_MANIFEST: function() {
        return SERVER_FILES_MANIFEST;
    },
    SERVER_PROPS_ID: function() {
        return SERVER_PROPS_ID;
    },
    SERVER_REFERENCE_MANIFEST: function() {
        return SERVER_REFERENCE_MANIFEST;
    },
    STATIC_PROPS_ID: function() {
        return STATIC_PROPS_ID;
    },
    STATIC_STATUS_PAGES: function() {
        return STATIC_STATUS_PAGES;
    },
    STRING_LITERAL_DROP_BUNDLE: function() {
        return STRING_LITERAL_DROP_BUNDLE;
    },
    SUBRESOURCE_INTEGRITY_MANIFEST: function() {
        return SUBRESOURCE_INTEGRITY_MANIFEST;
    },
    SYSTEM_ENTRYPOINTS: function() {
        return SYSTEM_ENTRYPOINTS;
    },
    TRACE_OUTPUT_VERSION: function() {
        return TRACE_OUTPUT_VERSION;
    },
    TURBOPACK_CLIENT_BUILD_MANIFEST: function() {
        return TURBOPACK_CLIENT_BUILD_MANIFEST;
    },
    TURBOPACK_CLIENT_MIDDLEWARE_MANIFEST: function() {
        return TURBOPACK_CLIENT_MIDDLEWARE_MANIFEST;
    },
    TURBO_TRACE_DEFAULT_MEMORY_LIMIT: function() {
        return TURBO_TRACE_DEFAULT_MEMORY_LIMIT;
    },
    UNDERSCORE_GLOBAL_ERROR_ROUTE: function() {
        return _entryconstants.UNDERSCORE_GLOBAL_ERROR_ROUTE;
    },
    UNDERSCORE_GLOBAL_ERROR_ROUTE_ENTRY: function() {
        return _entryconstants.UNDERSCORE_GLOBAL_ERROR_ROUTE_ENTRY;
    },
    UNDERSCORE_NOT_FOUND_ROUTE: function() {
        return _entryconstants.UNDERSCORE_NOT_FOUND_ROUTE;
    },
    UNDERSCORE_NOT_FOUND_ROUTE_ENTRY: function() {
        return _entryconstants.UNDERSCORE_NOT_FOUND_ROUTE_ENTRY;
    }
});
const _interop_require_default = __turbopack_context__.r(1705);
const _modernbrowserslisttarget = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r(4221));
const _entryconstants = __turbopack_context__.r(2063);
const COMPILER_NAMES = {
    client: 'client',
    server: 'server',
    edgeServer: 'edge-server'
};
const COMPILER_INDEXES = {
    [COMPILER_NAMES.client]: 0,
    [COMPILER_NAMES.server]: 1,
    [COMPILER_NAMES.edgeServer]: 2
};
var AdapterOutputType = /*#__PURE__*/ function(AdapterOutputType) {
    /**
   * `PAGES` represents all the React pages that are under `pages/`.
   */ AdapterOutputType["PAGES"] = "PAGES";
    /**
   * `PAGES_API` represents all the API routes under `pages/api/`.
   */ AdapterOutputType["PAGES_API"] = "PAGES_API";
    /**
   * `APP_PAGE` represents all the React pages that are under `app/` with the
   * filename of `page.{j,t}s{,x}`.
   */ AdapterOutputType["APP_PAGE"] = "APP_PAGE";
    /**
   * `APP_ROUTE` represents all the API routes and metadata routes that are under `app/` with the
   * filename of `route.{j,t}s{,x}`.
   */ AdapterOutputType["APP_ROUTE"] = "APP_ROUTE";
    /**
   * `PRERENDER` represents an ISR enabled route that might
   * have a seeded cache entry or fallback generated during build
   */ AdapterOutputType["PRERENDER"] = "PRERENDER";
    /**
   * `STATIC_FILE` represents a static file (ie /_next/static)
   */ AdapterOutputType["STATIC_FILE"] = "STATIC_FILE";
    /**
   * `MIDDLEWARE` represents the middleware output if present
   */ AdapterOutputType["MIDDLEWARE"] = "MIDDLEWARE";
    return AdapterOutputType;
}({});
const PHASE_EXPORT = 'phase-export';
const PHASE_ANALYZE = 'phase-analyze';
const PHASE_PRODUCTION_BUILD = 'phase-production-build';
const PHASE_PRODUCTION_SERVER = 'phase-production-server';
const PHASE_DEVELOPMENT_SERVER = 'phase-development-server';
const PHASE_TEST = 'phase-test';
const PHASE_INFO = 'phase-info';
const PAGES_MANIFEST = 'pages-manifest.json';
const APP_PATHS_MANIFEST = 'app-paths-manifest.json';
const APP_PATH_ROUTES_MANIFEST = 'app-path-routes-manifest.json';
const BUILD_MANIFEST = 'build-manifest.json';
const FUNCTIONS_CONFIG_MANIFEST = 'functions-config-manifest.json';
const SUBRESOURCE_INTEGRITY_MANIFEST = 'subresource-integrity-manifest';
const NEXT_FONT_MANIFEST = 'next-font-manifest';
const EXPORT_MARKER = 'export-marker.json';
const EXPORT_DETAIL = 'export-detail.json';
const PRERENDER_MANIFEST = 'prerender-manifest.json';
const PREFETCH_HINTS = 'prefetch-hints.json';
const ROUTES_MANIFEST = 'routes-manifest.json';
const IMAGES_MANIFEST = 'images-manifest.json';
const SERVER_FILES_MANIFEST = 'required-server-files';
const DEV_CLIENT_PAGES_MANIFEST = '_devPagesManifest.json';
const REQUEST_INSIGHTS_DEV_ENDPOINT = '/_next/development/request-insights';
const MIDDLEWARE_MANIFEST = 'middleware-manifest.json';
const TURBOPACK_CLIENT_MIDDLEWARE_MANIFEST = '_clientMiddlewareManifest.js';
const TURBOPACK_CLIENT_BUILD_MANIFEST = 'client-build-manifest.json';
const DEV_CLIENT_MIDDLEWARE_MANIFEST = '_devMiddlewareManifest.json';
const REACT_LOADABLE_MANIFEST = 'react-loadable-manifest.json';
const SERVER_DIRECTORY = 'server';
const CONFIG_FILES = [
    'next.config.js',
    'next.config.mjs',
    'next.config.ts',
    // process.features can be undefined on Edge runtime
    // TODO: Remove `as any` once we bump @types/node to v22.10.0+
    ...__TURBOPACK__imported__module__461__["default"]?.features?.typescript ? [
        'next.config.mts'
    ] : []
];
const BUILD_ID_FILE = 'BUILD_ID';
const BLOCKED_PAGES = [
    '/_document',
    '/_app',
    '/_error'
];
const CLIENT_PUBLIC_FILES_PATH = 'public';
const CLIENT_STATIC_FILES_PATH = 'static';
const STRING_LITERAL_DROP_BUNDLE = '__NEXT_DROP_CLIENT_FILE__';
const NEXT_BUILTIN_DOCUMENT = '__NEXT_BUILTIN_DOCUMENT__';
const BARREL_OPTIMIZATION_PREFIX = '__barrel_optimize__';
const CLIENT_REFERENCE_MANIFEST = 'client-reference-manifest';
const SERVER_REFERENCE_MANIFEST = 'server-reference-manifest';
const MIDDLEWARE_BUILD_MANIFEST = 'middleware-build-manifest';
const MIDDLEWARE_REACT_LOADABLE_MANIFEST = 'middleware-react-loadable-manifest';
const INTERCEPTION_ROUTE_REWRITE_MANIFEST = 'interception-route-rewrite-manifest';
const DYNAMIC_CSS_MANIFEST = 'dynamic-css-manifest';
const CLIENT_STATIC_FILES_RUNTIME_MAIN = `main`;
const CLIENT_STATIC_FILES_RUNTIME_MAIN_APP = `${CLIENT_STATIC_FILES_RUNTIME_MAIN}-app`;
const APP_CLIENT_INTERNALS = 'app-pages-internals';
const CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH = `react-refresh`;
const CLIENT_STATIC_FILES_RUNTIME_WEBPACK = `webpack`;
const CLIENT_STATIC_FILES_RUNTIME_POLYFILLS = 'polyfills';
const CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL = Symbol(CLIENT_STATIC_FILES_RUNTIME_POLYFILLS);
const DEFAULT_RUNTIME_WEBPACK = 'webpack-runtime';
const EDGE_RUNTIME_WEBPACK = 'edge-runtime-webpack';
const STATIC_PROPS_ID = '__N_SSG';
const SERVER_PROPS_ID = '__N_SSP';
const DEFAULT_SERIF_FONT = {
    name: 'Times New Roman',
    xAvgCharWidth: 821,
    azAvgWidth: 854.3953488372093,
    unitsPerEm: 2048
};
const DEFAULT_SANS_SERIF_FONT = {
    name: 'Arial',
    xAvgCharWidth: 904,
    azAvgWidth: 934.5116279069767,
    unitsPerEm: 2048
};
const STATIC_STATUS_PAGES = [
    '/500'
];
const TRACE_OUTPUT_VERSION = 1;
const TURBO_TRACE_DEFAULT_MEMORY_LIMIT = 6000;
const RSC_MODULE_TYPES = {
    client: 'client',
    server: 'server'
};
const EDGE_UNSUPPORTED_NODE_APIS = [
    'clearImmediate',
    'setImmediate',
    'BroadcastChannel',
    'ByteLengthQueuingStrategy',
    'CompressionStream',
    'CountQueuingStrategy',
    'DecompressionStream',
    'DomException',
    'MessageChannel',
    'MessageEvent',
    'MessagePort',
    'ReadableByteStreamController',
    'ReadableStreamBYOBRequest',
    'ReadableStreamDefaultController',
    'TransformStreamDefaultController',
    'WritableStreamDefaultController'
];
const SYSTEM_ENTRYPOINTS = new Set([
    CLIENT_STATIC_FILES_RUNTIME_MAIN,
    CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH,
    CLIENT_STATIC_FILES_RUNTIME_MAIN_APP
]);
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
7020, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return PageLoader;
    }
});
const _interop_require_default = __turbopack_context__.r(1705);
const _addbasepath = __turbopack_context__.r(4113);
const _interpolateas = __turbopack_context__.r(169);
const _getassetpathfromroute = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r(6544));
const _addlocale = __turbopack_context__.r(4862);
const _isdynamic = __turbopack_context__.r(8690);
const _parserelativeurl = __turbopack_context__.r(9590);
const _removetrailingslash = __turbopack_context__.r(3486);
const _routeloader = __turbopack_context__.r(5447);
const _constants = __turbopack_context__.r(8784);
const _promise = __turbopack_context__.r(1741);
class PageLoader {
    constructor(buildId, assetPrefix){
        this.routeLoader = (0, _routeloader.createRouteLoader)(assetPrefix);
        this.buildId = buildId;
        this.assetPrefix = assetPrefix;
        this.promisedSsgManifest = new Promise((resolve)=>{
            if (window.__SSG_MANIFEST) {
                resolve(window.__SSG_MANIFEST);
            } else {
                window.__SSG_MANIFEST_CB = ()=>{
                    resolve(window.__SSG_MANIFEST);
                };
            }
        });
    }
    getPageList() {
        if ("TURBOPACK compile-time truthy", 1) {
            return (0, _routeloader.getClientBuildManifest)().then((manifest)=>manifest.sortedPages);
        } else //TURBOPACK unreachable
        ;
    }
    getMiddleware() {
        // Webpack production
        if (("TURBOPACK compile-time value", "production") === 'production' && __TURBOPACK__imported__module__461__["default"].env.__NEXT_MIDDLEWARE_MATCHERS) {
            const middlewareMatchers = __TURBOPACK__imported__module__461__["default"].env.__NEXT_MIDDLEWARE_MATCHERS;
            window.__MIDDLEWARE_MATCHERS = middlewareMatchers ? middlewareMatchers : undefined;
            return window.__MIDDLEWARE_MATCHERS;
        // Turbopack production
        } else if ("TURBOPACK compile-time truthy", 1) {
            if (window.__MIDDLEWARE_MATCHERS) {
                return window.__MIDDLEWARE_MATCHERS;
            } else {
                const onClientMiddlewareManifest = new Promise((resolve)=>{
                    // Mandatory because this is not concurrent safe:
                    const cb = self.__MIDDLEWARE_MATCHERS_CB;
                    self.__MIDDLEWARE_MATCHERS_CB = ()=>{
                        resolve(self.__MIDDLEWARE_MATCHERS);
                        cb && cb();
                    };
                });
                return (0, _promise.resolvePromiseWithTimeout)(onClientMiddlewareManifest, (0, _routeloader.markAssetError)(Object.defineProperty(new Error('Failed to load client middleware manifest'), "__NEXT_ERROR_CODE", {
                    value: "E980",
                    enumerable: false,
                    configurable: true
                })), undefined);
            }
        // Development both Turbopack and Webpack
        } else //TURBOPACK unreachable
        ;
    }
    getDataHref(params) {
        const { asPath, href, locale } = params;
        const { pathname: hrefPathname, query, search } = (0, _parserelativeurl.parseRelativeUrl)(href);
        const { pathname: asPathname } = (0, _parserelativeurl.parseRelativeUrl)(asPath);
        const route = (0, _removetrailingslash.removeTrailingSlash)(hrefPathname);
        if (route[0] !== '/') {
            throw Object.defineProperty(new Error(`Route name should start with a "/", got "${route}"`), "__NEXT_ERROR_CODE", {
                value: "E303",
                enumerable: false,
                configurable: true
            });
        }
        const getHrefForSlug = (path)=>{
            const dataRoute = (0, _getassetpathfromroute.default)((0, _removetrailingslash.removeTrailingSlash)((0, _addlocale.addLocale)(path, locale)), '.json');
            return (0, _addbasepath.addBasePath)(`/_next/data/${this.buildId}${dataRoute}${search}`, true);
        };
        return getHrefForSlug(params.skipInterpolation ? asPathname : (0, _isdynamic.isDynamicRoute)(route) ? (0, _interpolateas.interpolateAs)(hrefPathname, asPathname, query).result : route);
    }
    _isSsg(/** the route (file-system path) */ route) {
        return this.promisedSsgManifest.then((manifest)=>manifest.has(route));
    }
    loadPage(route) {
        return this.routeLoader.loadRoute(route).then((res)=>{
            if ('component' in res) {
                return {
                    page: res.component,
                    mod: res.exports,
                    styleSheets: res.styles.map((o)=>({
                            href: o.href,
                            text: o.content
                        }))
                };
            }
            throw res.error;
        });
    }
    prefetch(route) {
        return this.routeLoader.prefetch(route);
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
2522, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
// minimal implementation MurmurHash2 hash function
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BloomFilter", {
    enumerable: true,
    get: function() {
        return BloomFilter;
    }
});
function murmurhash2(str) {
    let h = 0;
    for(let i = 0; i < str.length; i++){
        const c = str.charCodeAt(i);
        h = Math.imul(h ^ c, 0x5bd1e995);
        h ^= h >>> 13;
        h = Math.imul(h, 0x5bd1e995);
    }
    return h >>> 0;
}
// default to 0.01% error rate as the filter compresses very well
const DEFAULT_ERROR_RATE = 0.0001;
class BloomFilter {
    constructor(numItems, errorRate = DEFAULT_ERROR_RATE){
        this.numItems = numItems;
        this.errorRate = errorRate;
        this.numBits = Math.ceil(-(numItems * Math.log(errorRate)) / (Math.log(2) * Math.log(2)));
        this.numHashes = Math.ceil(this.numBits / numItems * Math.log(2));
        this.bitArray = new Array(this.numBits).fill(0);
    }
    static from(items, errorRate = DEFAULT_ERROR_RATE) {
        const filter = new BloomFilter(items.length, errorRate);
        for (const item of items){
            filter.add(item);
        }
        return filter;
    }
    export() {
        const data = {
            numItems: this.numItems,
            errorRate: this.errorRate,
            numBits: this.numBits,
            numHashes: this.numHashes,
            bitArray: this.bitArray
        };
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return data;
    }
    import(data) {
        this.numItems = data.numItems;
        this.errorRate = data.errorRate;
        this.numBits = data.numBits;
        this.numHashes = data.numHashes;
        this.bitArray = data.bitArray;
    }
    add(item) {
        const hashValues = this.getHashValues(item);
        hashValues.forEach((hash)=>{
            this.bitArray[hash] = 1;
        });
    }
    contains(item) {
        const hashValues = this.getHashValues(item);
        return hashValues.every((hash)=>this.bitArray[hash]);
    }
    getHashValues(item) {
        const hashValues = [];
        for(let i = 1; i <= this.numHashes; i++){
            const hash = murmurhash2(`${item}${i}`) % this.numBits;
            hashValues.push(hash);
        }
        return hashValues;
    }
}
}),
262, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getAssetToken: null,
    getAssetTokenQuery: null,
    getDeploymentId: null,
    getDeploymentIdQuery: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getAssetToken: function() {
        return getAssetToken;
    },
    getAssetTokenQuery: function() {
        return getAssetTokenQuery;
    },
    getDeploymentId: function() {
        return getDeploymentId;
    },
    getDeploymentIdQuery: function() {
        return getDeploymentIdQuery;
    }
});
let deploymentId;
if (typeof window !== 'undefined') {
    deploymentId = document.documentElement.dataset.dplId;
    // Immediately remove the attribute to prevent hydration errors (the dplId was inserted into the
    // HTML only), React isn't aware of it at all.
    delete document.documentElement.dataset.dplId;
} else {
    // Client side: replaced with globalThis.NEXT_DEPLOYMENT_ID
    // Server side: left as is or replaced with a string or replaced with false
    deploymentId = ("TURBOPACK compile-time value", false) || undefined;
}
function getDeploymentId() {
    return deploymentId;
}
function getDeploymentIdQuery(ampersand = false) {
    let id = getDeploymentId();
    if (id) {
        return `${ampersand ? '&' : '?'}dpl=${id}`;
    }
    return '';
}
function getAssetToken() {
    return ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : ("TURBOPACK compile-time value", false);
}
function getAssetTokenQuery(ampersand = false) {
    let id = getAssetToken();
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return '';
}
}),
3033, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const _deploymentid = __turbopack_context__.r(262);
const deploymentId = (0, _deploymentid.getDeploymentId)();
globalThis.NEXT_DEPLOYMENT_ID = deploymentId;
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
7398, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
/**
 * This module imports the configured client instrumentation modules.
 *
 * The `private-next-instrumentation-client` module is automatically aliased to
 * either the user's instrumentation module or a generated module array.
 */ "use strict";
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    // eslint-disable-next-line @next/internal/typechecked-require -- Not a module.
    const instrumentationClient = {};
    module.exports = Array.isArray(instrumentationClient) ? instrumentationClient : [
        instrumentationClient
    ];
}
}),
616, ((__turbopack_context__, module, exports) => {
"use strict";

// This utility is based on https://github.com/zertosh/htmlescape
// License: https://github.com/zertosh/htmlescape/blob/0527ca7156a524d256101bb310a9f970f63078ad/LICENSE
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ESCAPE_REGEX: null,
    htmlEscapeAttributeString: null,
    htmlEscapeJsonString: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    ESCAPE_REGEX: function() {
        return ESCAPE_REGEX;
    },
    htmlEscapeAttributeString: function() {
        return htmlEscapeAttributeString;
    },
    htmlEscapeJsonString: function() {
        return htmlEscapeJsonString;
    }
});
const ESCAPE_LOOKUP = {
    '&': '\\u0026',
    '>': '\\u003e',
    '<': '\\u003c',
    '\u2028': '\\u2028',
    '\u2029': '\\u2029'
};
const ESCAPE_REGEX = /[&><\u2028\u2029]/g;
const ATTRIBUTE_ESCAPE_LOOKUP = {
    '&': '&amp;',
    '"': '&quot;',
    "'": '&#39;',
    '<': '&lt;',
    '>': '&gt;'
};
const ATTRIBUTE_ESCAPE_REGEX = /[&"'<>]/g;
function htmlEscapeJsonString(str) {
    return str.replace(ESCAPE_REGEX, (match)=>ESCAPE_LOOKUP[match]);
}
function htmlEscapeAttributeString(str) {
    return str.replace(ATTRIBUTE_ESCAPE_REGEX, (match)=>ATTRIBUTE_ESCAPE_LOOKUP[match]);
}
}),
1457, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    handleClientScriptLoad: null,
    initScriptLoader: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    default: function() {
        return _default;
    },
    handleClientScriptLoad: function() {
        return handleClientScriptLoad;
    },
    initScriptLoader: function() {
        return initScriptLoader;
    }
});
const _interop_require_default = __turbopack_context__.r(1705);
const _interop_require_wildcard = __turbopack_context__.r(2456);
const _jsxruntime = __turbopack_context__.r(1398);
const _reactdom = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r(943));
const _react = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r(1788));
const _headmanagercontextsharedruntime = __turbopack_context__.r(3584);
const _setattributesfromprops = __turbopack_context__.r(6016);
const _requestidlecallback = __turbopack_context__.r(9604);
const _htmlescape = __turbopack_context__.r(616);
const ScriptCache = new Map();
const LoadCache = new Set();
const insertStylesheets = (stylesheets)=>{
    // Case 1: Styles for afterInteractive/lazyOnload with appDir injected via handleClientScriptLoad
    //
    // Using ReactDOM.preinit to feature detect appDir and inject styles
    // Stylesheets might have already been loaded if initialized with Script component
    // Re-inject styles here to handle scripts loaded via handleClientScriptLoad
    // ReactDOM.preinit handles dedup and ensures the styles are loaded only once
    if (_reactdom.default.preinit) {
        stylesheets.forEach((stylesheet)=>{
            _reactdom.default.preinit(stylesheet, {
                as: 'style'
            });
        });
        return;
    }
    // Case 2: Styles for afterInteractive/lazyOnload with pages injected via handleClientScriptLoad
    //
    // We use this function to load styles when appdir is not detected
    // TODO: Use React float APIs to load styles once available for pages dir
    if (typeof window !== 'undefined') {
        let head = document.head;
        stylesheets.forEach((stylesheet)=>{
            let link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = stylesheet;
            head.appendChild(link);
        });
    }
};
const loadScript = (props)=>{
    const { src, id, onLoad = ()=>{}, onReady = null, dangerouslySetInnerHTML, children = '', strategy = 'afterInteractive', onError, stylesheets } = props;
    const cacheKey = id || src;
    // Script has already loaded
    if (cacheKey && LoadCache.has(cacheKey)) {
        return;
    }
    // Contents of this script are already loading/loaded
    if (ScriptCache.has(src)) {
        LoadCache.add(cacheKey);
        // It is possible that multiple `next/script` components all have same "src", but has different "onLoad"
        // This is to make sure the same remote script will only load once, but "onLoad" are executed in order
        ScriptCache.get(src).then(onLoad, onError);
        return;
    }
    /** Execute after the script first loaded */ const afterLoad = ()=>{
        // Run onReady for the first time after load event
        if (onReady) {
            onReady();
        }
        // add cacheKey to LoadCache when load successfully
        LoadCache.add(cacheKey);
    };
    const el = document.createElement('script');
    const loadPromise = new Promise((resolve, reject)=>{
        el.addEventListener('load', function(e) {
            resolve();
            if (onLoad) {
                onLoad.call(this, e);
            }
            afterLoad();
        });
        el.addEventListener('error', function(e) {
            reject(e);
        });
    }).catch(function(e) {
        if (onError) {
            onError(e);
        }
    });
    if (dangerouslySetInnerHTML) {
        // Casting since lib.dom.d.ts doesn't have TrustedHTML yet.
        el.innerHTML = dangerouslySetInnerHTML.__html || '';
        afterLoad();
    } else if (children) {
        el.textContent = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';
        afterLoad();
    } else if (src) {
        el.src = src;
        // do not add cacheKey into LoadCache for remote script here
        // cacheKey will be added to LoadCache when it is actually loaded (see loadPromise above)
        ScriptCache.set(src, loadPromise);
    }
    (0, _setattributesfromprops.setAttributesFromProps)(el, props);
    if (strategy === 'worker') {
        el.setAttribute('type', 'text/partytown');
    }
    el.setAttribute('data-nscript', strategy);
    // Load styles associated with this script
    if (stylesheets) {
        insertStylesheets(stylesheets);
    }
    document.body.appendChild(el);
};
function handleClientScriptLoad(props) {
    const { strategy = 'afterInteractive' } = props;
    if (strategy === 'lazyOnload') {
        window.addEventListener('load', ()=>{
            (0, _requestidlecallback.requestIdleCallback)(()=>loadScript(props));
        });
    } else {
        loadScript(props);
    }
}
function loadLazyScript(props) {
    if (document.readyState === 'complete') {
        (0, _requestidlecallback.requestIdleCallback)(()=>loadScript(props));
    } else {
        window.addEventListener('load', ()=>{
            (0, _requestidlecallback.requestIdleCallback)(()=>loadScript(props));
        });
    }
}
function addBeforeInteractiveToCache() {
    const scripts = [
        ...document.querySelectorAll('[data-nscript="beforeInteractive"]'),
        ...document.querySelectorAll('[data-nscript="beforePageRender"]')
    ];
    scripts.forEach((script)=>{
        const cacheKey = script.id || script.getAttribute('src');
        LoadCache.add(cacheKey);
    });
}
function initScriptLoader(scriptLoaderItems) {
    scriptLoaderItems.forEach(handleClientScriptLoad);
    addBeforeInteractiveToCache();
}
/**
 * Load a third-party scripts in an optimized way.
 *
 * Read more: [Next.js Docs: `next/script`](https://nextjs.org/docs/app/api-reference/components/script)
 */ function Script(props) {
    const { id, src = '', onLoad = ()=>{}, onReady = null, strategy = 'afterInteractive', onError, stylesheets, ...restProps } = props;
    // Context is available only during SSR
    let { updateScripts, scripts, getIsSsr, appDir, nonce } = (0, _react.useContext)(_headmanagercontextsharedruntime.HeadManagerContext);
    // if a nonce is explicitly passed to the script tag, favor that over the automatic handling
    nonce = restProps.nonce || nonce;
    /**
   * - First mount:
   *   1. The useEffect for onReady executes
   *   2. hasOnReadyEffectCalled.current is false, but the script hasn't loaded yet (not in LoadCache)
   *      onReady is skipped, set hasOnReadyEffectCalled.current to true
   *   3. The useEffect for loadScript executes
   *   4. hasLoadScriptEffectCalled.current is false, loadScript executes
   *      Once the script is loaded, the onLoad and onReady will be called by then
   *   [If strict mode is enabled / is wrapped in <OffScreen /> component]
   *   5. The useEffect for onReady executes again
   *   6. hasOnReadyEffectCalled.current is true, so entire effect is skipped
   *   7. The useEffect for loadScript executes again
   *   8. hasLoadScriptEffectCalled.current is true, so entire effect is skipped
   *
   * - Second mount:
   *   1. The useEffect for onReady executes
   *   2. hasOnReadyEffectCalled.current is false, but the script has already loaded (found in LoadCache)
   *      onReady is called, set hasOnReadyEffectCalled.current to true
   *   3. The useEffect for loadScript executes
   *   4. The script is already loaded, loadScript bails out
   *   [If strict mode is enabled / is wrapped in <OffScreen /> component]
   *   5. The useEffect for onReady executes again
   *   6. hasOnReadyEffectCalled.current is true, so entire effect is skipped
   *   7. The useEffect for loadScript executes again
   *   8. hasLoadScriptEffectCalled.current is true, so entire effect is skipped
   */ const hasOnReadyEffectCalled = (0, _react.useRef)(false);
    (0, _react.useEffect)(()=>{
        const cacheKey = id || src;
        if (!hasOnReadyEffectCalled.current) {
            // Run onReady if script has loaded before but component is re-mounted
            if (onReady && cacheKey && LoadCache.has(cacheKey)) {
                onReady();
            }
            hasOnReadyEffectCalled.current = true;
        }
    }, [
        onReady,
        id,
        src
    ]);
    const hasLoadScriptEffectCalled = (0, _react.useRef)(false);
    (0, _react.useEffect)(()=>{
        if (!hasLoadScriptEffectCalled.current) {
            if (strategy === 'afterInteractive') {
                loadScript(props);
            } else if (strategy === 'lazyOnload') {
                loadLazyScript(props);
            }
            hasLoadScriptEffectCalled.current = true;
        }
    }, [
        props,
        strategy
    ]);
    if (strategy === 'beforeInteractive' || strategy === 'worker') {
        if (updateScripts) {
            scripts[strategy] = (scripts[strategy] || []).concat([
                {
                    id,
                    src,
                    onLoad,
                    onReady,
                    onError,
                    ...restProps,
                    nonce
                }
            ]);
            updateScripts(scripts);
        } else if (getIsSsr && getIsSsr()) {
            // Script has already loaded during SSR
            LoadCache.add(id || src);
        } else if (getIsSsr && !getIsSsr()) {
            loadScript({
                ...props,
                nonce
            });
        }
    }
    // For the app directory, we need React Float to preload these scripts.
    if (appDir) {
        // Injecting stylesheets here handles beforeInteractive and worker scripts correctly
        // For other strategies injecting here ensures correct stylesheet order
        // ReactDOM.preinit handles loading the styles in the correct order,
        // also ensures the stylesheet is loaded only once and in a consistent manner
        //
        // Case 1: Styles for beforeInteractive/worker with appDir - handled here
        // Case 2: Styles for beforeInteractive/worker with pages dir - Not handled yet
        // Case 3: Styles for afterInteractive/lazyOnload with appDir - handled here
        // Case 4: Styles for afterInteractive/lazyOnload with pages dir - handled in insertStylesheets function
        if (stylesheets) {
            stylesheets.forEach((styleSrc)=>{
                _reactdom.default.preinit(styleSrc, {
                    as: 'style'
                });
            });
        }
        // Before interactive scripts need to be loaded by Next.js' runtime instead
        // of native <script> tags, because they no longer have `defer`.
        if (strategy === 'beforeInteractive') {
            if (!src) {
                // For inlined scripts, we put the content in `children`.
                if (restProps.dangerouslySetInnerHTML) {
                    // Casting since lib.dom.d.ts doesn't have TrustedHTML yet.
                    restProps.children = restProps.dangerouslySetInnerHTML.__html;
                    delete restProps.dangerouslySetInnerHTML;
                }
                return /*#__PURE__*/ (0, _jsxruntime.jsx)("script", {
                    nonce: nonce,
                    dangerouslySetInnerHTML: {
                        __html: `(self.__next_s=self.__next_s||[]).push(${(0, _htmlescape.htmlEscapeJsonString)(JSON.stringify([
                            0,
                            {
                                ...restProps,
                                id
                            }
                        ]))})`
                    }
                });
            } else {
                // @ts-ignore
                _reactdom.default.preload(src, restProps.integrity ? {
                    as: 'script',
                    integrity: restProps.integrity,
                    nonce,
                    crossOrigin: restProps.crossOrigin
                } : {
                    as: 'script',
                    nonce,
                    crossOrigin: restProps.crossOrigin
                });
                return /*#__PURE__*/ (0, _jsxruntime.jsx)("script", {
                    nonce: nonce,
                    dangerouslySetInnerHTML: {
                        __html: `(self.__next_s=self.__next_s||[]).push(${(0, _htmlescape.htmlEscapeJsonString)(JSON.stringify([
                            src,
                            {
                                ...restProps,
                                id
                            }
                        ]))})`
                    }
                });
            }
        } else if (strategy === 'afterInteractive') {
            if (src) {
                // @ts-ignore
                _reactdom.default.preload(src, restProps.integrity ? {
                    as: 'script',
                    integrity: restProps.integrity,
                    nonce,
                    crossOrigin: restProps.crossOrigin
                } : {
                    as: 'script',
                    nonce,
                    crossOrigin: restProps.crossOrigin
                });
            }
        }
    }
    return null;
}
Object.defineProperty(Script, '__nextScript', {
    value: true
});
const _default = Script;
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
7361, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getObjectClassLabel: null,
    isPlainObject: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getObjectClassLabel: function() {
        return getObjectClassLabel;
    },
    isPlainObject: function() {
        return isPlainObject;
    }
});
function getObjectClassLabel(value) {
    return Object.prototype.toString.call(value);
}
function isPlainObject(value) {
    if (getObjectClassLabel(value) !== '[object Object]') {
        return false;
    }
    const prototype = Object.getPrototypeOf(value);
    /**
   * this used to be previously:
   *
   * `return prototype === null || prototype === Object.prototype`
   *
   * but Edge Runtime expose Object from vm, being that kind of type-checking wrongly fail.
   *
   * It was changed to the current implementation since it's resilient to serialization.
   */ return prototype === null || prototype.hasOwnProperty('isPrototypeOf');
}
}),
3910, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    getProperError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    /**
 * Checks whether the given value is a NextError.
 * This can be used to print a more detailed error message with properties like `code` & `digest`.
 */ default: function() {
        return isError;
    },
    getProperError: function() {
        return getProperError;
    }
});
const _isplainobject = __turbopack_context__.r(7361);
/**
 * This is a safe stringify function that handles circular references.
 * We're using a simpler version here to avoid introducing
 * the dependency `safe-stable-stringify` into production bundle.
 *
 * This helper is used both in development and production.
 */ function safeStringifyLite(obj) {
    const seen = new WeakSet();
    return JSON.stringify(obj, (_key, value)=>{
        // If value is an object and already seen, replace with "[Circular]"
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return '[Circular]';
            }
            seen.add(value);
        }
        return value;
    });
}
function isError(err) {
    return typeof err === 'object' && err !== null && 'name' in err && 'message' in err;
}
function getProperError(err) {
    if (isError(err)) {
        return err;
    }
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return Object.defineProperty(new Error((0, _isplainobject.isPlainObject)(err) ? safeStringifyLite(err) : err + ''), "__NEXT_ERROR_CODE", {
        value: "E394",
        enumerable: false,
        configurable: true
    });
}
}),
4059, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getSortedRouteObjects: null,
    getSortedRoutes: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getSortedRouteObjects: function() {
        return getSortedRouteObjects;
    },
    getSortedRoutes: function() {
        return getSortedRoutes;
    }
});
class UrlNode {
    insert(urlPath) {
        this._insert(urlPath.split('/').filter(Boolean), [], false);
    }
    smoosh() {
        return this._smoosh();
    }
    _smoosh(prefix = '/') {
        const childrenPaths = [
            ...this.children.keys()
        ].sort();
        if (this.slugName !== null) {
            childrenPaths.splice(childrenPaths.indexOf('[]'), 1);
        }
        if (this.restSlugName !== null) {
            childrenPaths.splice(childrenPaths.indexOf('[...]'), 1);
        }
        if (this.optionalRestSlugName !== null) {
            childrenPaths.splice(childrenPaths.indexOf('[[...]]'), 1);
        }
        const routes = childrenPaths.map((c)=>this.children.get(c)._smoosh(`${prefix}${c}/`)).reduce((prev, curr)=>[
                ...prev,
                ...curr
            ], []);
        if (this.slugName !== null) {
            routes.push(...this.children.get('[]')._smoosh(`${prefix}[${this.slugName}]/`));
        }
        if (!this.placeholder) {
            const r = prefix === '/' ? '/' : prefix.slice(0, -1);
            if (this.optionalRestSlugName != null) {
                throw Object.defineProperty(new Error(`You cannot define a route with the same specificity as a optional catch-all route ("${r}" and "${r}[[...${this.optionalRestSlugName}]]").`), "__NEXT_ERROR_CODE", {
                    value: "E458",
                    enumerable: false,
                    configurable: true
                });
            }
            routes.unshift(r);
        }
        if (this.restSlugName !== null) {
            routes.push(...this.children.get('[...]')._smoosh(`${prefix}[...${this.restSlugName}]/`));
        }
        if (this.optionalRestSlugName !== null) {
            routes.push(...this.children.get('[[...]]')._smoosh(`${prefix}[[...${this.optionalRestSlugName}]]/`));
        }
        return routes;
    }
    _insert(urlPaths, slugNames, isCatchAll) {
        if (urlPaths.length === 0) {
            this.placeholder = false;
            return;
        }
        if (isCatchAll) {
            throw Object.defineProperty(new Error(`Catch-all must be the last part of the URL.`), "__NEXT_ERROR_CODE", {
                value: "E392",
                enumerable: false,
                configurable: true
            });
        }
        // The next segment in the urlPaths list
        let nextSegment = urlPaths[0];
        // Check if the segment matches `[something]`
        if (nextSegment.startsWith('[') && nextSegment.endsWith(']')) {
            // Strip `[` and `]`, leaving only `something`
            let segmentName = nextSegment.slice(1, -1);
            let isOptional = false;
            if (segmentName.startsWith('[') && segmentName.endsWith(']')) {
                // Strip optional `[` and `]`, leaving only `something`
                segmentName = segmentName.slice(1, -1);
                isOptional = true;
            }
            if (segmentName.startsWith('…')) {
                throw Object.defineProperty(new Error(`Detected a three-dot character ('…') at ('${segmentName}'). Did you mean ('...')?`), "__NEXT_ERROR_CODE", {
                    value: "E147",
                    enumerable: false,
                    configurable: true
                });
            }
            if (segmentName.startsWith('...')) {
                // Strip `...`, leaving only `something`
                segmentName = segmentName.substring(3);
                isCatchAll = true;
            }
            if (segmentName.startsWith('[') || segmentName.endsWith(']')) {
                throw Object.defineProperty(new Error(`Segment names may not start or end with extra brackets ('${segmentName}').`), "__NEXT_ERROR_CODE", {
                    value: "E421",
                    enumerable: false,
                    configurable: true
                });
            }
            if (segmentName.startsWith('.')) {
                throw Object.defineProperty(new Error(`Segment names may not start with erroneous periods ('${segmentName}').`), "__NEXT_ERROR_CODE", {
                    value: "E288",
                    enumerable: false,
                    configurable: true
                });
            }
            function handleSlug(previousSlug, nextSlug) {
                if (previousSlug !== null) {
                    // If the specific segment already has a slug but the slug is not `something`
                    // This prevents collisions like:
                    // pages/[post]/index.js
                    // pages/[id]/index.js
                    // Because currently multiple dynamic params on the same segment level are not supported
                    if (previousSlug !== nextSlug) {
                        // TODO: This error seems to be confusing for users, needs an error link, the description can be based on above comment.
                        throw Object.defineProperty(new Error(`You cannot use different slug names for the same dynamic path ('${previousSlug}' !== '${nextSlug}').`), "__NEXT_ERROR_CODE", {
                            value: "E337",
                            enumerable: false,
                            configurable: true
                        });
                    }
                }
                slugNames.forEach((slug)=>{
                    if (slug === nextSlug) {
                        throw Object.defineProperty(new Error(`You cannot have the same slug name "${nextSlug}" repeat within a single dynamic path`), "__NEXT_ERROR_CODE", {
                            value: "E247",
                            enumerable: false,
                            configurable: true
                        });
                    }
                    if (slug.replace(/\W/g, '') === nextSegment.replace(/\W/g, '')) {
                        throw Object.defineProperty(new Error(`You cannot have the slug names "${slug}" and "${nextSlug}" differ only by non-word symbols within a single dynamic path`), "__NEXT_ERROR_CODE", {
                            value: "E499",
                            enumerable: false,
                            configurable: true
                        });
                    }
                });
                slugNames.push(nextSlug);
            }
            if (isCatchAll) {
                if (isOptional) {
                    if (this.restSlugName != null) {
                        throw Object.defineProperty(new Error(`You cannot use both an required and optional catch-all route at the same level ("[...${this.restSlugName}]" and "${urlPaths[0]}" ).`), "__NEXT_ERROR_CODE", {
                            value: "E299",
                            enumerable: false,
                            configurable: true
                        });
                    }
                    handleSlug(this.optionalRestSlugName, segmentName);
                    // slugName is kept as it can only be one particular slugName
                    this.optionalRestSlugName = segmentName;
                    // nextSegment is overwritten to [[...]] so that it can later be sorted specifically
                    nextSegment = '[[...]]';
                } else {
                    if (this.optionalRestSlugName != null) {
                        throw Object.defineProperty(new Error(`You cannot use both an optional and required catch-all route at the same level ("[[...${this.optionalRestSlugName}]]" and "${urlPaths[0]}").`), "__NEXT_ERROR_CODE", {
                            value: "E300",
                            enumerable: false,
                            configurable: true
                        });
                    }
                    handleSlug(this.restSlugName, segmentName);
                    // slugName is kept as it can only be one particular slugName
                    this.restSlugName = segmentName;
                    // nextSegment is overwritten to [...] so that it can later be sorted specifically
                    nextSegment = '[...]';
                }
            } else {
                if (isOptional) {
                    throw Object.defineProperty(new Error(`Optional route parameters are not yet supported ("${urlPaths[0]}").`), "__NEXT_ERROR_CODE", {
                        value: "E435",
                        enumerable: false,
                        configurable: true
                    });
                }
                handleSlug(this.slugName, segmentName);
                // slugName is kept as it can only be one particular slugName
                this.slugName = segmentName;
                // nextSegment is overwritten to [] so that it can later be sorted specifically
                nextSegment = '[]';
            }
        }
        // If this UrlNode doesn't have the nextSegment yet we create a new child UrlNode
        if (!this.children.has(nextSegment)) {
            this.children.set(nextSegment, new UrlNode());
        }
        this.children.get(nextSegment)._insert(urlPaths.slice(1), slugNames, isCatchAll);
    }
    constructor(){
        this.placeholder = true;
        this.children = new Map();
        this.slugName = null;
        this.restSlugName = null;
        this.optionalRestSlugName = null;
    }
}
function getSortedRoutes(normalizedPages) {
    // First the UrlNode is created, and every UrlNode can have only 1 dynamic segment
    // Eg you can't have pages/[post]/abc.js and pages/[hello]/something-else.js
    // Only 1 dynamic segment per nesting level
    // So in the case that is test/e2e/dynamic-routing it'll be this:
    // pages/[post]/comments.js
    // pages/blog/[post]/comment/[id].js
    // Both are fine because `pages/[post]` and `pages/blog` are on the same level
    // So in this case `UrlNode` created here has `this.slugName === 'post'`
    // And since your PR passed through `slugName` as an array basically it'd including it in too many possibilities
    // Instead what has to be passed through is the upwards path's dynamic names
    const root = new UrlNode();
    // Here the `root` gets injected multiple paths, and insert will break them up into sublevels
    normalizedPages.forEach((pagePath)=>root.insert(pagePath));
    // Smoosh will then sort those sublevels up to the point where you get the correct route definition priority
    return root.smoosh();
}
function getSortedRouteObjects(objects, getter) {
    // We're assuming here that all the pathnames are unique, that way we can
    // sort the list and use the index as the key.
    const indexes = {};
    const pathnames = [];
    for(let i = 0; i < objects.length; i++){
        const pathname = getter(objects[i]);
        indexes[pathname] = i;
        pathnames[i] = pathname;
    }
    // Sort the pathnames.
    const sorted = getSortedRoutes(pathnames);
    // Map the sorted pathnames back to the original objects using the new sorted
    // index.
    return sorted.map((pathname)=>objects[indexes[pathname]]);
}
}),
1235, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getSortedRouteObjects: null,
    getSortedRoutes: null,
    isDynamicRoute: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getSortedRouteObjects: function() {
        return _sortedroutes.getSortedRouteObjects;
    },
    getSortedRoutes: function() {
        return _sortedroutes.getSortedRoutes;
    },
    isDynamicRoute: function() {
        return _isdynamic.isDynamicRoute;
    }
});
const _sortedroutes = __turbopack_context__.r(4059);
const _isdynamic = __turbopack_context__.r(8690);
}),
6090, ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * For a given page path, this function ensures that there is no backslash
 * escaping slashes in the path. Example:
 *  - `foo\/bar\/baz` -> `foo/bar/baz`
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "normalizePathSep", {
    enumerable: true,
    get: function() {
        return normalizePathSep;
    }
});
function normalizePathSep(path) {
    return path.replace(/\\/g, '/');
}
}),
291, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "denormalizePagePath", {
    enumerable: true,
    get: function() {
        return denormalizePagePath;
    }
});
const _utils = __turbopack_context__.r(1235);
const _normalizepathsep = __turbopack_context__.r(6090);
function denormalizePagePath(page) {
    let _page = (0, _normalizepathsep.normalizePathSep)(page);
    return _page.startsWith('/index/') && !(0, _utils.isDynamicRoute)(_page) ? _page.slice(6) : _page !== '/index' ? _page : '/';
}
}),
2090, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "normalizeLocalePath", {
    enumerable: true,
    get: function() {
        return normalizeLocalePath;
    }
});
/**
 * A cache of lowercased locales for each list of locales. This is stored as a
 * WeakMap so if the locales are garbage collected, the cache entry will be
 * removed as well.
 */ const cache = new WeakMap();
function normalizeLocalePath(pathname, locales) {
    // If locales is undefined, return the pathname as is.
    if (!locales) return {
        pathname
    };
    // Get the cached lowercased locales or create a new cache entry.
    let lowercasedLocales = cache.get(locales);
    if (!lowercasedLocales) {
        lowercasedLocales = locales.map((locale)=>locale.toLowerCase());
        cache.set(locales, lowercasedLocales);
    }
    let detectedLocale;
    // The first segment will be empty, because it has a leading `/`. If
    // there is no further segment, there is no locale (or it's the default).
    const segments = pathname.split('/', 2);
    // If there's no second segment (ie, the pathname is just `/`), there's no
    // locale.
    if (!segments[1]) return {
        pathname
    };
    // The second segment will contain the locale part if any.
    const segment = segments[1].toLowerCase();
    // See if the segment matches one of the locales. If it doesn't, there is
    // no locale (or it's the default).
    const index = lowercasedLocales.indexOf(segment);
    if (index < 0) return {
        pathname
    };
    // Return the case-sensitive locale.
    detectedLocale = locales[index];
    // Remove the `/${locale}` part of the pathname.
    pathname = pathname.slice(detectedLocale.length + 1) || '/';
    return {
        pathname,
        detectedLocale
    };
}
}),
3110, ((__turbopack_context__, module, exports) => {
"use strict";

// The client router filter handles app routes that begin with a dynamic segment
// (e.g. `/[locale]/about`). Such routes have no static prefix to anchor the
// prefix-based dynamic filter on, so the build-time producer
// (`createClientRouterFilter`) stores them as a normalized pattern with dynamic
// segments replaced by the placeholder token below, and the pages router
// reconstructs matching candidates from the route it resolved a navigation to.
/**
 * A token that can never collide with a real path segment (dynamic segments are
 * always `[name]`, `[...name]`, or `[[...name]]`, and static segments never
 * equal `[]`). Shared with the builder's `normalizeRouteToFilterPattern`.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    DYNAMIC_FILTER_PLACEHOLDER: null,
    hasDynamicFilterCandidate: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    DYNAMIC_FILTER_PLACEHOLDER: function() {
        return DYNAMIC_FILTER_PLACEHOLDER;
    },
    hasDynamicFilterCandidate: function() {
        return hasDynamicFilterCandidate;
    }
});
const DYNAMIC_FILTER_PLACEHOLDER = '[]';
/**
 * Beyond this many dynamic segments the 2^n candidate set is skipped. Real
 * routes never approach this; the cap only guards against pathological input.
 */ const MAX_DYNAMIC_SEGMENTS = 8;
function hasDynamicFilterCandidate(routePattern, concretePathname, test) {
    const routeSegments = routePattern.split('/');
    const concreteSegments = concretePathname.split('/');
    const lastSegment = routeSegments[routeSegments.length - 1] ?? '';
    const hasCatchAll = lastSegment.startsWith('[...') || lastSegment.startsWith('[[...');
    // A non-catch-all route always has the same segment count as the path it
    // matched; a mismatch there means the inputs don't line up. A catch-all route
    // legitimately differs because its final param absorbs the remaining
    // segments.
    if (!hasCatchAll && routeSegments.length !== concreteSegments.length) {
        return false;
    }
    // Collect the concrete positions that are dynamic in the matched route: any
    // position without a static route segment (a dynamic param, or one absorbed
    // by the trailing catch-all).
    const dynamicIndices = [];
    for(let i = 1; i < concreteSegments.length; i++){
        // An empty concrete segment is not a real path segment (splitting `/`
        // yields a trailing `''`). A trailing optional catch-all matches it by
        // absorbing nothing, so it must not be treated as a dynamic position:
        // otherwise `/` would reconstruct the `/[]` candidate and spuriously match
        // a root-level dynamic app route such as `/[lang]`, which does not own `/`.
        if (concreteSegments[i] === '') {
            continue;
        }
        const routeSegment = routeSegments[i];
        const isStaticSegment = routeSegment !== undefined && !routeSegment.startsWith('[');
        if (!isStaticSegment) {
            dynamicIndices.push(i);
        }
    }
    if (dynamicIndices.length === 0 || dynamicIndices.length > MAX_DYNAMIC_SEGMENTS) {
        return false;
    }
    // Enumerate the keep-literal/placeholder combinations as a bitmask over those
    // positions (a set bit keeps the concrete value, an unset bit is a
    // placeholder). The all-literal combination is skipped: a fully concrete path
    // is a static route, already covered by the static filter and the early
    // prefix check, so it can never appear in the dynamic filter as a pattern.
    const allLiteral = (1 << dynamicIndices.length) - 1;
    for(let mask = 0; mask < allLiteral; mask++){
        const segments = concreteSegments.slice();
        for(let bit = 0; bit < dynamicIndices.length; bit++){
            if ((mask & 1 << bit) === 0) {
                segments[dynamicIndices[bit]] = DYNAMIC_FILTER_PLACEHOLDER;
            }
        }
        if (test(segments.join('/'))) {
            return true;
        }
    }
    return false;
}
}),
8169, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
// Format function modified from nodejs
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    formatUrl: null,
    formatWithValidation: null,
    urlObjectKeys: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    formatUrl: function() {
        return formatUrl;
    },
    formatWithValidation: function() {
        return formatWithValidation;
    },
    urlObjectKeys: function() {
        return urlObjectKeys;
    }
});
const _interop_require_wildcard = __turbopack_context__.r(2456);
const _querystring = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r(8928));
const slashedProtocols = /https?|ftp|gopher|file/;
function formatUrl(urlObj) {
    let { auth, hostname } = urlObj;
    let protocol = urlObj.protocol || '';
    let pathname = urlObj.pathname || '';
    let hash = urlObj.hash || '';
    let query = urlObj.query || '';
    let host = false;
    auth = auth ? encodeURIComponent(auth).replace(/%3A/i, ':') + '@' : '';
    if (urlObj.host) {
        host = auth + urlObj.host;
    } else if (hostname) {
        host = auth + (~hostname.indexOf(':') ? `[${hostname}]` : hostname);
        if (urlObj.port) {
            host += ':' + urlObj.port;
        }
    }
    if (query && typeof query === 'object') {
        query = String(_querystring.urlQueryToSearchParams(query));
    }
    let search = urlObj.search || query && `?${query}` || '';
    if (protocol && !protocol.endsWith(':')) protocol += ':';
    if (urlObj.slashes || (!protocol || slashedProtocols.test(protocol)) && host !== false) {
        host = '//' + (host || '');
        if (pathname && pathname[0] !== '/') pathname = '/' + pathname;
    } else if (!host) {
        host = '';
    }
    if (hash && hash[0] !== '#') hash = '#' + hash;
    if (search && search[0] !== '?') search = '?' + search;
    pathname = pathname.replace(/[?#]/g, encodeURIComponent);
    search = search.replace('#', '%23');
    return `${protocol}${host}${pathname}${search}${hash}`;
}
const urlObjectKeys = [
    'auth',
    'hash',
    'host',
    'hostname',
    'href',
    'path',
    'pathname',
    'port',
    'protocol',
    'query',
    'search',
    'slashes'
];
function formatWithValidation(url) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return formatUrl(url);
}
}),
2205, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "detectDomainLocale", {
    enumerable: true,
    get: function() {
        return detectDomainLocale;
    }
});
const detectDomainLocale = (...args)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
};
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
7396, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "removeLocale", {
    enumerable: true,
    get: function() {
        return removeLocale;
    }
});
const _parsepath = __turbopack_context__.r(2796);
function removeLocale(path, locale) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return path;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
7742, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "pathHasPrefix", {
    enumerable: true,
    get: function() {
        return pathHasPrefix;
    }
});
const _parsepath = __turbopack_context__.r(2796);
function pathHasPrefix(path, prefix) {
    if (typeof path !== 'string') {
        return false;
    }
    const { pathname } = (0, _parsepath.parsePath)(path);
    return pathname === prefix || pathname.startsWith(prefix + '/');
}
}),
8186, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "hasBasePath", {
    enumerable: true,
    get: function() {
        return hasBasePath;
    }
});
const _pathhasprefix = __turbopack_context__.r(7742);
const basePath = ("TURBOPACK compile-time value", "") || '';
function hasBasePath(path) {
    return (0, _pathhasprefix.pathHasPrefix)(path, basePath);
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
4691, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "removeBasePath", {
    enumerable: true,
    get: function() {
        return removeBasePath;
    }
});
const _hasbasepath = __turbopack_context__.r(8186);
const basePath = ("TURBOPACK compile-time value", "") || '';
function removeBasePath(path) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Can't trim the basePath if it has zero length!
    if (basePath.length === 0) return path;
    path = path.slice(basePath.length);
    if (!path.startsWith('/')) path = `/${path}`;
    return path;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
7285, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "omit", {
    enumerable: true,
    get: function() {
        return omit;
    }
});
function omit(object, keys) {
    const omitted = {};
    Object.keys(object).forEach((key)=>{
        if (!keys.includes(key)) {
            omitted[key] = object[key];
        }
    });
    return omitted;
}
}),
1112, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isLocalURL", {
    enumerable: true,
    get: function() {
        return isLocalURL;
    }
});
const _utils = __turbopack_context__.r(9129);
const _hasbasepath = __turbopack_context__.r(8186);
function isLocalURL(url) {
    // prevent a hydration mismatch on href for url with anchor refs
    if (!(0, _utils.isAbsoluteUrl)(url)) return true;
    try {
        // absolute urls can be local if they are on the same origin
        const locationOrigin = (0, _utils.getLocationOrigin)();
        const resolved = new URL(url, locationOrigin);
        return resolved.origin === locationOrigin && (0, _hasbasepath.hasBasePath)(resolved.pathname);
    } catch (_) {
        return false;
    }
}
}),
472, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveHref", {
    enumerable: true,
    get: function() {
        return resolveHref;
    }
});
const _querystring = __turbopack_context__.r(8928);
const _formaturl = __turbopack_context__.r(8169);
const _omit = __turbopack_context__.r(7285);
const _utils = __turbopack_context__.r(9129);
const _normalizetrailingslash = __turbopack_context__.r(90);
const _islocalurl = __turbopack_context__.r(1112);
const _utils1 = __turbopack_context__.r(1235);
const _interpolateas = __turbopack_context__.r(169);
const _routeregex = __turbopack_context__.r(4599);
const _routematcher = __turbopack_context__.r(9944);
function resolveHref(router, href, resolveAs) {
    // we use a dummy base url for relative urls
    let base;
    let urlAsString = typeof href === 'string' ? href : (0, _formaturl.formatWithValidation)(href);
    // repeated slashes and backslashes in the URL are considered
    // invalid and will never match a Next.js page/file
    // https://www.rfc-editor.org/rfc/rfc3986.html#section-3.1
    const urlProtoMatch = urlAsString.match(/^[a-z][a-z0-9+.-]*:\/\//i);
    const urlAsStringNoProto = urlProtoMatch ? urlAsString.slice(urlProtoMatch[0].length) : urlAsString;
    const urlParts = urlAsStringNoProto.split('?', 1);
    if ((urlParts[0] || '').match(/(\/\/|\\)/)) {
        console.error(`Invalid href '${urlAsString}' passed to next/router in page: '${router.pathname}'. Repeated forward-slashes (//) or backslashes \\ are not valid in the href.`);
        const normalizedUrl = (0, _utils.normalizeRepeatedSlashes)(urlAsStringNoProto);
        urlAsString = (urlProtoMatch ? urlProtoMatch[0] : '') + normalizedUrl;
    }
    // Return because it cannot be routed by the Next.js router
    if (!(0, _islocalurl.isLocalURL)(urlAsString)) {
        return resolveAs ? [
            urlAsString
        ] : urlAsString;
    }
    try {
        let baseBase = urlAsString.startsWith('#') ? router.asPath : router.pathname;
        // If the provided href is only a query string, it is safer to use the asPath
        // considering rewrites.
        if (urlAsString.startsWith('?')) {
            baseBase = router.asPath;
            // However, if is a dynamic route, we need to use the pathname to preserve the
            // query interpolation and rewrites (router.pathname will look like "/[slug]").
            if ((0, _utils1.isDynamicRoute)(router.pathname)) {
                baseBase = router.pathname;
                const routeRegex = (0, _routeregex.getRouteRegex)(router.pathname);
                const match = (0, _routematcher.getRouteMatcher)(routeRegex)(router.asPath);
                // For dynamic routes, if asPath doesn't match the pathname regex, it is a rewritten path.
                // In this case, should use asPath to preserve the current URL.
                if (!match) {
                    baseBase = router.asPath;
                }
            // Note: There is an edge case where the pathname is dynamic, and also a rewrite path to the same segment.
            // E.g. in "/[slug]" path, rewrite "/foo" -> "/bar"
            // In this case, it will be treated as a non-rewritten path and possibly interpolate the query string.
            // E.g., "/any?slug=foo" will become the content of "/foo", not rewritten as "/bar"
            // This is currently a trade-off of not resolving rewrite paths on every Router/Link call,
            // but using a lighter route regex pattern check.
            }
        }
        base = new URL(baseBase, 'http://n');
    } catch (_) {
        // fallback to / for invalid asPath values e.g. //
        base = new URL('/', 'http://n');
    }
    try {
        const finalUrl = new URL(urlAsString, base);
        finalUrl.pathname = (0, _normalizetrailingslash.normalizePathTrailingSlash)(finalUrl.pathname);
        let interpolatedAs = '';
        if ((0, _utils1.isDynamicRoute)(finalUrl.pathname) && finalUrl.searchParams && resolveAs) {
            const query = (0, _querystring.searchParamsToUrlQuery)(finalUrl.searchParams);
            const { result, params } = (0, _interpolateas.interpolateAs)(finalUrl.pathname, finalUrl.pathname, query);
            if (result) {
                interpolatedAs = (0, _formaturl.formatWithValidation)({
                    pathname: result,
                    hash: finalUrl.hash,
                    query: (0, _omit.omit)(query, params)
                });
            }
        }
        // if the origin didn't change, it means we received a relative href
        const resolvedHref = finalUrl.origin === base.origin ? finalUrl.href.slice(finalUrl.origin.length) : finalUrl.href;
        return resolveAs ? [
            resolvedHref,
            interpolatedAs || resolvedHref
        ] : resolvedHref;
    } catch (_) {
        return resolveAs ? [
            urlAsString
        ] : urlAsString;
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
5399, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isAPIRoute", {
    enumerable: true,
    get: function() {
        return isAPIRoute;
    }
});
function isAPIRoute(value) {
    return value === '/api' || Boolean(value == null ? void 0 : value.startsWith('/api/'));
}
}),
671, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "removePathPrefix", {
    enumerable: true,
    get: function() {
        return removePathPrefix;
    }
});
const _pathhasprefix = __turbopack_context__.r(7742);
function removePathPrefix(path, prefix) {
    // If the path doesn't start with the prefix we can return it as is. This
    // protects us from situations where the prefix is a substring of the path
    // prefix such as:
    //
    // For prefix: /blog
    //
    //   /blog -> true
    //   /blog/ -> true
    //   /blog/1 -> true
    //   /blogging -> false
    //   /blogging/ -> false
    //   /blogging/1 -> false
    if (!(0, _pathhasprefix.pathHasPrefix)(path, prefix)) {
        return path;
    }
    // Remove the prefix from the path via slicing.
    const withoutPrefix = path.slice(prefix.length);
    // If the path without the prefix starts with a `/` we can return it as is.
    if (withoutPrefix.startsWith('/')) {
        return withoutPrefix;
    }
    // If the path without the prefix doesn't start with a `/` we need to add it
    // back to the path to make sure it's a valid path.
    return `/${withoutPrefix}`;
}
}),
1755, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getNextPathnameInfo", {
    enumerable: true,
    get: function() {
        return getNextPathnameInfo;
    }
});
const _normalizelocalepath = __turbopack_context__.r(2090);
const _removepathprefix = __turbopack_context__.r(671);
const _pathhasprefix = __turbopack_context__.r(7742);
function getNextPathnameInfo(pathname, options) {
    const { basePath, i18n, trailingSlash } = options.nextConfig ?? {};
    const info = {
        pathname,
        trailingSlash: pathname !== '/' ? pathname.endsWith('/') : trailingSlash
    };
    if (basePath && (0, _pathhasprefix.pathHasPrefix)(info.pathname, basePath)) {
        info.pathname = (0, _removepathprefix.removePathPrefix)(info.pathname, basePath);
        info.basePath = basePath;
    }
    let pathnameNoDataPrefix = info.pathname;
    if (info.pathname.startsWith('/_next/data/') && info.pathname.endsWith('.json')) {
        const paths = info.pathname.replace(/^\/_next\/data\//, '').replace(/\.json$/, '').split('/');
        const buildId = paths[0];
        info.buildId = buildId;
        pathnameNoDataPrefix = paths[1] !== 'index' ? `/${paths.slice(1).join('/')}` : '/';
        // update pathname with normalized if enabled although
        // we use normalized to populate locale info still
        if (options.parseData === true) {
            info.pathname = pathnameNoDataPrefix;
        }
    }
    // If provided, use the locale route normalizer to detect the locale instead
    // of the function below.
    if (i18n) {
        let result = options.i18nProvider ? options.i18nProvider.analyze(info.pathname) : (0, _normalizelocalepath.normalizeLocalePath)(info.pathname, i18n.locales);
        info.locale = result.detectedLocale;
        info.pathname = result.pathname ?? info.pathname;
        if (!result.detectedLocale && info.buildId) {
            result = options.i18nProvider ? options.i18nProvider.analyze(pathnameNoDataPrefix) : (0, _normalizelocalepath.normalizeLocalePath)(pathnameNoDataPrefix, i18n.locales);
            if (result.detectedLocale) {
                info.locale = result.detectedLocale;
            }
        }
    }
    return info;
}
}),
2393, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "addPathSuffix", {
    enumerable: true,
    get: function() {
        return addPathSuffix;
    }
});
const _parsepath = __turbopack_context__.r(2796);
function addPathSuffix(path, suffix) {
    if (!path.startsWith('/') || !suffix) {
        return path;
    }
    const { pathname, query, hash } = (0, _parsepath.parsePath)(path);
    return `${pathname}${suffix}${query}${hash}`;
}
}),
2419, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "addLocale", {
    enumerable: true,
    get: function() {
        return addLocale;
    }
});
const _addpathprefix = __turbopack_context__.r(3980);
const _pathhasprefix = __turbopack_context__.r(7742);
function addLocale(path, locale, defaultLocale, ignorePrefix) {
    // If no locale was given or the locale is the default locale, we don't need
    // to prefix the path.
    if (!locale || locale === defaultLocale) return path;
    const lower = path.toLowerCase();
    // If the path is an API path or the path already has the locale prefix, we
    // don't need to prefix the path.
    if (!ignorePrefix) {
        if ((0, _pathhasprefix.pathHasPrefix)(lower, '/api')) return path;
        if ((0, _pathhasprefix.pathHasPrefix)(lower, `/${locale.toLowerCase()}`)) return path;
    }
    // Add the locale prefix to the path.
    return (0, _addpathprefix.addPathPrefix)(path, `/${locale}`);
}
}),
5746, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "formatNextPathnameInfo", {
    enumerable: true,
    get: function() {
        return formatNextPathnameInfo;
    }
});
const _removetrailingslash = __turbopack_context__.r(3486);
const _addpathprefix = __turbopack_context__.r(3980);
const _addpathsuffix = __turbopack_context__.r(2393);
const _addlocale = __turbopack_context__.r(2419);
function formatNextPathnameInfo(info) {
    let pathname = (0, _addlocale.addLocale)(info.pathname, info.locale, info.buildId ? undefined : info.defaultLocale, info.ignorePrefix);
    if (info.buildId || !info.trailingSlash) {
        pathname = (0, _removetrailingslash.removeTrailingSlash)(pathname);
    }
    if (info.buildId) {
        pathname = (0, _addpathsuffix.addPathSuffix)((0, _addpathprefix.addPathPrefix)(pathname, `/_next/data/${info.buildId}`), info.pathname === '/' ? 'index.json' : '.json');
    }
    pathname = (0, _addpathprefix.addPathPrefix)(pathname, info.basePath);
    return !info.buildId && info.trailingSlash ? !pathname.endsWith('/') ? (0, _addpathsuffix.addPathSuffix)(pathname, '/') : pathname : (0, _removetrailingslash.removeTrailingSlash)(pathname);
}
}),
5755, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "compareRouterStates", {
    enumerable: true,
    get: function() {
        return compareRouterStates;
    }
});
function compareRouterStates(a, b) {
    const stateKeys = Object.keys(a);
    if (stateKeys.length !== Object.keys(b).length) return false;
    for(let i = stateKeys.length; i--;){
        const key = stateKeys[i];
        if (key === 'query') {
            const queryKeys = Object.keys(a.query);
            if (queryKeys.length !== Object.keys(b.query).length) {
                return false;
            }
            for(let j = queryKeys.length; j--;){
                const queryKey = queryKeys[j];
                if (!b.query.hasOwnProperty(queryKey) || a.query[queryKey] !== b.query[queryKey]) {
                    return false;
                }
            }
        } else if (!b.hasOwnProperty(key) || a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}
}),
3857, ((__turbopack_context__, module, exports) => {
"use strict";

// This regex contains the bots that we need to do a blocking render for and can't safely stream the response
// due to how they parse the DOM. For example, they might explicitly check for metadata in the `head` tag, so we can't stream metadata tags after the `head` was sent.
// Note: The pattern [\w-]+-Google captures all Google crawlers with "-Google" suffix (e.g., Mediapartners-Google, AdsBot-Google, Storebot-Google)
// as well as crawlers starting with "Google-" (e.g., Google-PageRenderer, Google-InspectionTool)
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HTML_LIMITED_BOT_UA_RE", {
    enumerable: true,
    get: function() {
        return HTML_LIMITED_BOT_UA_RE;
    }
});
const HTML_LIMITED_BOT_UA_RE = /[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight/i;
}),
7852, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    HTML_LIMITED_BOT_UA_RE: null,
    HTML_LIMITED_BOT_UA_RE_STRING: null,
    getBotType: null,
    isBot: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    HTML_LIMITED_BOT_UA_RE: function() {
        return _htmlbots.HTML_LIMITED_BOT_UA_RE;
    },
    HTML_LIMITED_BOT_UA_RE_STRING: function() {
        return HTML_LIMITED_BOT_UA_RE_STRING;
    },
    getBotType: function() {
        return getBotType;
    },
    isBot: function() {
        return isBot;
    }
});
const _htmlbots = __turbopack_context__.r(3857);
// Bot crawler that will spin up a headless browser and execute JS.
// Only the main Googlebot search crawler executes JavaScript, not other Google crawlers.
// x-ref: https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers
// This regex specifically matches "Googlebot" but NOT "Mediapartners-Google", "AdsBot-Google", etc.
const HEADLESS_BROWSER_BOT_UA_RE = /Googlebot(?!-)|Googlebot$/i;
const HTML_LIMITED_BOT_UA_RE_STRING = _htmlbots.HTML_LIMITED_BOT_UA_RE.source;
function isDomBotUA(userAgent) {
    return HEADLESS_BROWSER_BOT_UA_RE.test(userAgent);
}
function isHtmlLimitedBotUA(userAgent) {
    return _htmlbots.HTML_LIMITED_BOT_UA_RE.test(userAgent);
}
function isBot(userAgent) {
    return isDomBotUA(userAgent) || isHtmlLimitedBotUA(userAgent);
}
function getBotType(userAgent) {
    if (isDomBotUA(userAgent)) {
        return 'dom';
    }
    if (isHtmlLimitedBotUA(userAgent)) {
        return 'html';
    }
    return undefined;
}
}),
6149, ((__turbopack_context__, module, exports) => {
"use strict";

// Adapted from React's sanitizeURL function found here: https://github.com/facebook/react/blob/b565373afd0cc1988497e1107106e851e8cfb261/packages/react-dom-bindings/src/shared/sanitizeURL.js
// A javascript: URL can contain leading C0 control or \u0020 SPACE,
// and any newline or tab are filtered out as if they're not part of the URL.
// https://url.spec.whatwg.org/#url-parsing
// Tab or newline are defined as \r\n\t:
// https://infra.spec.whatwg.org/#ascii-tab-or-newline
// A C0 control is a code point in the range \u0000 NULL to \u001F
// INFORMATION SEPARATOR ONE, inclusive:
// https://infra.spec.whatwg.org/#c0-control-or-space
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isJavaScriptURLString", {
    enumerable: true,
    get: function() {
        return isJavaScriptURLString;
    }
});
const isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
function isJavaScriptURLString(url) {
    return isJavaScriptProtocol.test('' + url);
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
4438, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createKey: null,
    default: null,
    matchesMiddleware: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createKey: function() {
        return createKey;
    },
    default: function() {
        return Router;
    },
    matchesMiddleware: function() {
        return matchesMiddleware;
    }
});
const _interop_require_default = __turbopack_context__.r(1705);
const _interop_require_wildcard = __turbopack_context__.r(2456);
const _removetrailingslash = __turbopack_context__.r(3486);
const _routeloader = __turbopack_context__.r(5447);
const _script = __turbopack_context__.r(1457);
const _iserror = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r(3910));
const _denormalizepagepath = __turbopack_context__.r(291);
const _normalizelocalepath = __turbopack_context__.r(2090);
const _mitt = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r(7194));
const _utils = __turbopack_context__.r(9129);
const _isdynamic = __turbopack_context__.r(8690);
const _parserelativeurl = __turbopack_context__.r(9590);
const _routematcher = __turbopack_context__.r(9944);
const _routeregex = __turbopack_context__.r(4599);
const _dynamicfilterpattern = __turbopack_context__.r(3110);
const _formaturl = __turbopack_context__.r(8169);
const _detectdomainlocale = __turbopack_context__.r(2205);
const _parsepath = __turbopack_context__.r(2796);
const _addlocale = __turbopack_context__.r(4862);
const _removelocale = __turbopack_context__.r(7396);
const _removebasepath = __turbopack_context__.r(4691);
const _addbasepath = __turbopack_context__.r(4113);
const _hasbasepath = __turbopack_context__.r(8186);
const _resolvehref = __turbopack_context__.r(472);
const _isapiroute = __turbopack_context__.r(5399);
const _getnextpathnameinfo = __turbopack_context__.r(1755);
const _formatnextpathnameinfo = __turbopack_context__.r(5746);
const _comparestates = __turbopack_context__.r(5755);
const _islocalurl = __turbopack_context__.r(1112);
const _isbot = __turbopack_context__.r(7852);
const _omit = __turbopack_context__.r(7285);
const _interpolateas = __turbopack_context__.r(169);
const _disablesmoothscroll = __turbopack_context__.r(1280);
const _constants = __turbopack_context__.r(2987);
const _deploymentid = __turbopack_context__.r(262);
const _javascripturl = __turbopack_context__.r(6149);
let resolveRewrites;
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
function buildCancellationError() {
    return Object.assign(Object.defineProperty(new Error('Route Cancelled'), "__NEXT_ERROR_CODE", {
        value: "E315",
        enumerable: false,
        configurable: true
    }), {
        cancelled: true
    });
}
async function matchesMiddleware(options) {
    const matchers = await Promise.resolve(options.router.pageLoader.getMiddleware());
    if (!matchers) return false;
    const { pathname: asPathname } = (0, _parsepath.parsePath)(options.asPath);
    // remove basePath first since path prefix has to be in the order of `/${basePath}/${locale}`
    const cleanedAs = (0, _hasbasepath.hasBasePath)(asPathname) ? (0, _removebasepath.removeBasePath)(asPathname) : asPathname;
    const asWithBasePathAndLocale = (0, _addbasepath.addBasePath)((0, _addlocale.addLocale)(cleanedAs, options.locale));
    // Check only path match on client. Matching "has" should be done on server
    // where we can access more info such as headers, HttpOnly cookie, etc.
    return matchers.some((m)=>new RegExp(m.regexp).test(asWithBasePathAndLocale));
}
function stripOrigin(url) {
    const origin = (0, _utils.getLocationOrigin)();
    return url.startsWith(origin) ? url.substring(origin.length) : url;
}
function prepareUrlAs(router, url, as) {
    // If url and as provided as an object representation,
    // we'll format them into the string version here.
    let [resolvedHref, resolvedAs] = (0, _resolvehref.resolveHref)(router, url, true);
    const origin = (0, _utils.getLocationOrigin)();
    const hrefWasAbsolute = resolvedHref.startsWith(origin);
    const asWasAbsolute = resolvedAs && resolvedAs.startsWith(origin);
    resolvedHref = stripOrigin(resolvedHref);
    resolvedAs = resolvedAs ? stripOrigin(resolvedAs) : resolvedAs;
    const preparedUrl = hrefWasAbsolute ? resolvedHref : (0, _addbasepath.addBasePath)(resolvedHref);
    const preparedAs = as ? stripOrigin((0, _resolvehref.resolveHref)(router, as)) : resolvedAs || resolvedHref;
    return {
        url: preparedUrl,
        as: asWasAbsolute ? preparedAs : (0, _addbasepath.addBasePath)(preparedAs)
    };
}
function resolveDynamicRoute(pathname, pages) {
    const cleanPathname = (0, _removetrailingslash.removeTrailingSlash)((0, _denormalizepagepath.denormalizePagePath)(pathname));
    if (cleanPathname === '/404' || cleanPathname === '/_error') {
        return pathname;
    }
    // handle resolving href for dynamic routes
    if (!pages.includes(cleanPathname)) {
        // eslint-disable-next-line array-callback-return
        pages.some((page)=>{
            if ((0, _isdynamic.isDynamicRoute)(page) && (0, _routeregex.getRouteRegex)(page).re.test(cleanPathname)) {
                pathname = page;
                return true;
            }
        });
    }
    return (0, _removetrailingslash.removeTrailingSlash)(pathname);
}
function getMiddlewareData(source, response, options) {
    const nextConfig = {
        basePath: options.router.basePath,
        i18n: {
            locales: options.router.locales
        },
        trailingSlash: Boolean(("TURBOPACK compile-time value", false))
    };
    const rewriteHeader = response.headers.get('x-nextjs-rewrite');
    let rewriteTarget = rewriteHeader || response.headers.get('x-nextjs-matched-path');
    const matchedPath = response.headers.get(_constants.MATCHED_PATH_HEADER);
    if (matchedPath && !rewriteTarget && !matchedPath.includes('__next_data_catchall') && !matchedPath.includes('/_error') && !matchedPath.includes('/404')) {
        // leverage x-matched-path to detect next.config.js rewrites
        rewriteTarget = matchedPath;
    }
    if (rewriteTarget) {
        if (rewriteTarget.startsWith('/') || ("TURBOPACK compile-time value", false)) {
            const parsedRewriteTarget = (0, _parserelativeurl.parseRelativeUrl)(rewriteTarget);
            const pathnameInfo = (0, _getnextpathnameinfo.getNextPathnameInfo)(parsedRewriteTarget.pathname, {
                nextConfig,
                parseData: true
            });
            let fsPathname = (0, _removetrailingslash.removeTrailingSlash)(pathnameInfo.pathname);
            return Promise.all([
                options.router.pageLoader.getPageList(),
                (0, _routeloader.getClientBuildManifest)()
            ]).then(([pages, { __rewrites: rewrites }])=>{
                let as = (0, _addlocale.addLocale)(pathnameInfo.pathname, pathnameInfo.locale);
                if ((0, _isdynamic.isDynamicRoute)(as) || !rewriteHeader && pages.includes((0, _normalizelocalepath.normalizeLocalePath)((0, _removebasepath.removeBasePath)(as), options.router.locales).pathname)) {
                    const parsedSource = (0, _getnextpathnameinfo.getNextPathnameInfo)((0, _parserelativeurl.parseRelativeUrl)(source).pathname, {
                        // Pass basePath (and trailingSlash) so the basePath prefix is
                        // stripped before the `_next/data/` check, but omit `i18n` so the
                        // locale prefix is preserved here — the rewrite resolver below
                        // handles the locale-prefixed `as`.
                        nextConfig: {
                            basePath: nextConfig.basePath,
                            trailingSlash: nextConfig.trailingSlash
                        },
                        parseData: true
                    });
                    as = (0, _addbasepath.addBasePath)(parsedSource.pathname);
                    parsedRewriteTarget.pathname = as;
                }
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                else if (!pages.includes(fsPathname)) {
                    const resolvedPathname = resolveDynamicRoute(fsPathname, pages);
                    if (resolvedPathname !== fsPathname) {
                        fsPathname = resolvedPathname;
                    }
                }
                const resolvedHref = !pages.includes(fsPathname) ? resolveDynamicRoute((0, _normalizelocalepath.normalizeLocalePath)((0, _removebasepath.removeBasePath)(parsedRewriteTarget.pathname), options.router.locales).pathname, pages) : fsPathname;
                if ((0, _isdynamic.isDynamicRoute)(resolvedHref)) {
                    const matches = (0, _routematcher.getRouteMatcher)((0, _routeregex.getRouteRegex)(resolvedHref))(as);
                    Object.assign(parsedRewriteTarget.query, matches || {});
                }
                return {
                    type: 'rewrite',
                    parsedAs: parsedRewriteTarget,
                    resolvedHref
                };
            });
        }
        const src = (0, _parsepath.parsePath)(source);
        const pathname = (0, _formatnextpathnameinfo.formatNextPathnameInfo)({
            ...(0, _getnextpathnameinfo.getNextPathnameInfo)(src.pathname, {
                nextConfig,
                parseData: true
            }),
            defaultLocale: options.router.defaultLocale,
            buildId: ''
        });
        return Promise.resolve({
            type: 'redirect-external',
            destination: `${pathname}${src.query}${src.hash}`
        });
    }
    const redirectTarget = response.headers.get('x-nextjs-redirect');
    if (redirectTarget) {
        if (redirectTarget.startsWith('/')) {
            const src = (0, _parsepath.parsePath)(redirectTarget);
            const pathname = (0, _formatnextpathnameinfo.formatNextPathnameInfo)({
                ...(0, _getnextpathnameinfo.getNextPathnameInfo)(src.pathname, {
                    nextConfig,
                    parseData: true
                }),
                defaultLocale: options.router.defaultLocale,
                buildId: ''
            });
            return Promise.resolve({
                type: 'redirect-internal',
                newAs: `${pathname}${src.query}${src.hash}`,
                newUrl: `${pathname}${src.query}${src.hash}`
            });
        }
        return Promise.resolve({
            type: 'redirect-external',
            destination: redirectTarget
        });
    }
    return Promise.resolve({
        type: 'next'
    });
}
async function withMiddlewareEffects(options) {
    const matches = await matchesMiddleware(options);
    if (!matches || !options.fetchData) {
        return null;
    }
    const data = await options.fetchData();
    const effect = await getMiddlewareData(data.dataHref, data.response, options);
    return {
        dataHref: data.dataHref,
        json: data.json,
        response: data.response,
        text: data.text,
        cacheKey: data.cacheKey,
        effect
    };
}
const manualScrollRestoration = ("TURBOPACK compile-time value", false) && typeof window !== 'undefined' && 'scrollRestoration' in window.history && !!function() {
    try {
        let v = '__next';
        return sessionStorage.setItem(v, v), sessionStorage.removeItem(v), true;
    } catch (n) {}
}();
const SSG_DATA_NOT_FOUND = Symbol('SSG_DATA_NOT_FOUND');
function fetchRetry(url, attempts, options) {
    return fetch(url, {
        // Cookies are required to be present for Next.js' SSG "Preview Mode".
        // Cookies may also be required for `getServerSideProps`.
        //
        // > `fetch` won’t send cookies, unless you set the credentials init
        // > option.
        // https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch
        //
        // > For maximum browser compatibility when it comes to sending &
        // > receiving cookies, always supply the `credentials: 'same-origin'`
        // > option instead of relying on the default.
        // https://github.com/github/fetch#caveats
        credentials: 'same-origin',
        method: options.method || 'GET',
        headers: Object.assign({}, options.headers, {
            'x-nextjs-data': '1'
        })
    }).then((response)=>{
        return !response.ok && attempts > 1 && response.status >= 500 ? fetchRetry(url, attempts - 1, options) : response;
    });
}
function tryToParseAsJSON(text) {
    try {
        return JSON.parse(text);
    } catch (error) {
        return null;
    }
}
function fetchNextData({ dataHref, inflightCache, isPrefetch, hasMiddleware, isServerRender, parseJSON, persistCache, isBackground, unstable_skipClientCache }) {
    const { href: cacheKey } = new URL(dataHref, window.location.href);
    const deploymentId = (0, _deploymentid.getDeploymentId)();
    const getData = (params)=>fetchRetry(dataHref, isServerRender ? 3 : 1, {
            headers: Object.assign({}, isPrefetch ? {
                purpose: 'prefetch'
            } : {}, isPrefetch && hasMiddleware ? {
                'x-middleware-prefetch': '1'
            } : {}, deploymentId ? {
                'x-deployment-id': deploymentId
            } : {}),
            method: params?.method ?? 'GET'
        }).then((response)=>{
            if (response.ok && params?.method === 'HEAD') {
                return {
                    dataHref,
                    response,
                    text: '',
                    json: {},
                    cacheKey
                };
            }
            return response.text().then((text)=>{
                if (!response.ok) {
                    /**
             * When the data response is a redirect because of a middleware
             * we do not consider it an error. The headers must bring the
             * mapped location.
             * TODO: Change the status code in the handler.
             */ if (hasMiddleware && [
                        301,
                        302,
                        307,
                        308
                    ].includes(response.status)) {
                        return {
                            dataHref,
                            response,
                            text,
                            json: {},
                            cacheKey
                        };
                    }
                    if (response.status === 404) {
                        if (tryToParseAsJSON(text)?.notFound) {
                            return {
                                dataHref,
                                json: {
                                    notFound: SSG_DATA_NOT_FOUND
                                },
                                response,
                                text,
                                cacheKey
                            };
                        }
                    }
                    const error = Object.defineProperty(new Error(`Failed to load static props`), "__NEXT_ERROR_CODE", {
                        value: "E124",
                        enumerable: false,
                        configurable: true
                    });
                    /**
             * We should only trigger a server-side transition if this was
             * caused on a client-side transition. Otherwise, we'd get into
             * an infinite loop.
             */ if (!isServerRender) {
                        (0, _routeloader.markAssetError)(error);
                    }
                    throw error;
                }
                let dplResponseHeader = response.headers.get(_constants.NEXT_NAV_DEPLOYMENT_ID_HEADER);
                if (dplResponseHeader != null && dplResponseHeader !== deploymentId) {
                    // When not found, or we want to force a MPA navigation because of Skew Protection
                    const error = Object.defineProperty(new Error(`Loaded static props were from an outdated deployment, forcing a hard reload`), "__NEXT_ERROR_CODE", {
                        value: "E989",
                        enumerable: false,
                        configurable: true
                    });
                    /**
             * We should only trigger a server-side transition if this was
             * caused on a client-side transition. Otherwise, we'd get into
             * an infinite loop.
             */ if (!isServerRender) {
                        (0, _routeloader.markAssetError)(error);
                    }
                    throw error;
                }
                return {
                    dataHref,
                    json: parseJSON ? tryToParseAsJSON(text) : null,
                    response,
                    text,
                    cacheKey
                };
            });
        }).then((data)=>{
            if (!persistCache || ("TURBOPACK compile-time value", "production") !== 'production' || data.response.headers.get('x-middleware-cache') === 'no-cache') {
                delete inflightCache[cacheKey];
            }
            return data;
        }).catch((err)=>{
            if (!unstable_skipClientCache) {
                delete inflightCache[cacheKey];
            }
            if (err.message === 'Failed to fetch' || // firefox
            err.message === 'NetworkError when attempting to fetch resource.' || // safari
            err.message === 'Load failed') {
                (0, _routeloader.markAssetError)(err);
            }
            throw err;
        });
    // when skipping client cache we wait to update
    // inflight cache until successful data response
    // this allows racing click event with fetching newer data
    // without blocking navigation when stale data is available
    if (unstable_skipClientCache && persistCache) {
        return getData({}).then((data)=>{
            if (data.response.headers.get('x-middleware-cache') !== 'no-cache') {
                // only update cache if not marked as no-cache
                inflightCache[cacheKey] = Promise.resolve(data);
            }
            return data;
        });
    }
    if (inflightCache[cacheKey] !== undefined) {
        return inflightCache[cacheKey];
    }
    return inflightCache[cacheKey] = getData(isBackground ? {
        method: 'HEAD'
    } : {});
}
function createKey() {
    return Math.random().toString(36).slice(2, 10);
}
function handleHardNavigation({ url, router }) {
    // ensure we don't trigger a hard navigation to the same
    // URL as this can end up with an infinite refresh
    if (url === (0, _addbasepath.addBasePath)((0, _addlocale.addLocale)(router.asPath, router.locale))) {
        throw Object.defineProperty(new Error(`Invariant: attempted to hard navigate to the same URL ${url} ${location.href}`), "__NEXT_ERROR_CODE", {
            value: "E282",
            enumerable: false,
            configurable: true
        });
    }
    window.location.href = url;
}
const getCancelledHandler = ({ route, router })=>{
    let cancelled = false;
    const cancel = router.clc = ()=>{
        cancelled = true;
    };
    const handleCancelled = ()=>{
        if (cancelled) {
            const error = Object.defineProperty(new Error(`Abort fetching component for route: "${route}"`), "__NEXT_ERROR_CODE", {
                value: "E483",
                enumerable: false,
                configurable: true
            });
            error.cancelled = true;
            throw error;
        }
        if (cancel === router.clc) {
            router.clc = null;
        }
    };
    return handleCancelled;
};
class Router {
    static{
        this.events = (0, _mitt.default)();
    }
    constructor(pathname, query, as, { initialProps, pageLoader, App, wrapApp, Component, err, subscription, isFallback, locale, locales, defaultLocale, domainLocales, isPreview }){
        // Server Data Cache (full data requests)
        this.sdc = {};
        // Server Background Cache (HEAD requests)
        this.sbc = {};
        this.isFirstPopStateEvent = true;
        this._key = createKey();
        this.onPopState = (e)=>{
            const { isFirstPopStateEvent } = this;
            this.isFirstPopStateEvent = false;
            const state = e.state;
            if (!state) {
                // We get state as undefined for two reasons.
                //  1. With older safari (< 8) and older chrome (< 34)
                //  2. When the URL changed with #
                //
                // In the both cases, we don't need to proceed and change the route.
                // (as it's already changed)
                // But we can simply replace the state with the new changes.
                // Actually, for (1) we don't need to nothing. But it's hard to detect that event.
                // So, doing the following for (1) does no harm.
                const { pathname, query } = this;
                this.changeState('replaceState', (0, _formaturl.formatWithValidation)({
                    pathname: (0, _addbasepath.addBasePath)(pathname),
                    query
                }), (0, _utils.getURL)());
                return;
            }
            // __NA is used to identify if the history entry can be handled by the app-router.
            if (state.__NA) {
                window.location.reload();
                return;
            }
            if (!state.__N) {
                return;
            }
            // Safari fires popstateevent when reopening the browser.
            if (isFirstPopStateEvent && this.locale === state.options.locale && state.as === this.asPath) {
                return;
            }
            let forcedScroll;
            const { url, as, options, key } = state;
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            this._key = key;
            const { pathname } = (0, _parserelativeurl.parseRelativeUrl)(url);
            // Make sure we don't re-render on initial load,
            // can be caused by navigating back from an external site
            if (this.isSsr && as === (0, _addbasepath.addBasePath)(this.asPath) && pathname === (0, _addbasepath.addBasePath)(this.pathname)) {
                return;
            }
            // If the downstream application returns falsy, return.
            // They will then be responsible for handling the event.
            if (this._bps && !this._bps(state)) {
                return;
            }
            this.change('replaceState', url, as, Object.assign({}, options, {
                shallow: options.shallow && this._shallow,
                locale: options.locale || this.defaultLocale,
                // @ts-ignore internal value not exposed on types
                _h: 0
            }), forcedScroll);
        };
        // represents the current component key
        const route = (0, _removetrailingslash.removeTrailingSlash)(pathname);
        // set up the component cache (by route keys)
        this.components = {};
        // We should not keep the cache, if there's an error
        // Otherwise, this cause issues when when going back and
        // come again to the errored page.
        if (pathname !== '/_error') {
            this.components[route] = {
                Component,
                initial: true,
                props: initialProps,
                err,
                __N_SSG: initialProps && initialProps.__N_SSG,
                __N_SSP: initialProps && initialProps.__N_SSP
            };
        }
        this.components['/_app'] = {
            Component: App,
            styleSheets: []
        };
        // Backwards compat for Router.router.events
        // TODO: Should be remove the following major version as it was never documented
        this.events = Router.events;
        this.pageLoader = pageLoader;
        // if auto prerendered and dynamic route wait to update asPath
        // until after mount to prevent hydration mismatch
        const autoExportDynamic = (0, _isdynamic.isDynamicRoute)(pathname) && self.__NEXT_DATA__.autoExport;
        this.basePath = ("TURBOPACK compile-time value", "") || '';
        this.sub = subscription;
        this.clc = null;
        this._wrapApp = wrapApp;
        // make sure to ignore extra popState in safari on navigating
        // back from external site
        this.isSsr = true;
        this.isLocaleDomain = false;
        this.isReady = !!(self.__NEXT_DATA__.gssp || self.__NEXT_DATA__.gip || self.__NEXT_DATA__.isExperimentalCompile || self.__NEXT_DATA__.appGip && !self.__NEXT_DATA__.gsp || !autoExportDynamic && !self.location.search && !("TURBOPACK compile-time value", false));
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        this.state = {
            route,
            pathname,
            query,
            asPath: autoExportDynamic ? pathname : as,
            isPreview: !!isPreview,
            locale: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : undefined,
            isFallback
        };
        this._initialMatchesMiddlewarePromise = Promise.resolve(false);
        if (typeof window !== 'undefined') {
            // make sure "as" doesn't start with double slashes or else it can
            // throw an error as it's considered invalid
            if (!as.startsWith('//')) {
                // in order for `e.state` to work on the `onpopstate` event
                // we have to register the initial route upon initialization
                const options = {
                    locale
                };
                const asPath = (0, _utils.getURL)();
                this._initialMatchesMiddlewarePromise = matchesMiddleware({
                    router: this,
                    locale,
                    asPath
                }).then((matches)=>{
                    // if middleware matches we leave resolving to the change function
                    // as the server needs to resolve for correct priority
                    ;
                    options._shouldResolveHref = as !== pathname;
                    this.changeState('replaceState', matches ? asPath : (0, _formaturl.formatWithValidation)({
                        pathname: (0, _addbasepath.addBasePath)(pathname),
                        query
                    }), asPath, options);
                    return matches;
                });
            }
            window.addEventListener('popstate', this.onPopState);
            // enable custom scroll restoration handling when available
            // otherwise fallback to browser's default handling
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        }
    }
    reload() {
        window.location.reload();
    }
    /**
   * Go back in history
   */ back() {
        window.history.back();
    }
    /**
   * Go forward in history
   */ forward() {
        window.history.forward();
    }
    /**
   * Performs a `pushState` with arguments
   * @param url of the route
   * @param as masks `url` for the browser
   * @param options object you can define `shallow` and other options
   */ push(url, as, options = {}) {
        if ((0, _javascripturl.isJavaScriptURLString)(url.toString()) || as && (0, _javascripturl.isJavaScriptURLString)(as.toString())) {
            throw Object.defineProperty(new Error('Next.js has blocked a javascript: URL as a security precaution.'), "__NEXT_ERROR_CODE", {
                value: "E978",
                enumerable: false,
                configurable: true
            });
        }
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        ;
        ({ url, as } = prepareUrlAs(this, url, as));
        return this.change('pushState', url, as, options);
    }
    /**
   * Performs a `replaceState` with arguments
   * @param url of the route
   * @param as masks `url` for the browser
   * @param options object you can define `shallow` and other options
   */ replace(url, as, options = {}) {
        if ((0, _javascripturl.isJavaScriptURLString)(url.toString()) || as && (0, _javascripturl.isJavaScriptURLString)(as.toString())) {
            throw Object.defineProperty(new Error('Next.js has blocked a javascript: URL as a security precaution.'), "__NEXT_ERROR_CODE", {
                value: "E978",
                enumerable: false,
                configurable: true
            });
        }
        ;
        ({ url, as } = prepareUrlAs(this, url, as));
        return this.change('replaceState', url, as, options);
    }
    async _bfl(as, resolvedAs, locale, skipNavigate) {
        if ("TURBOPACK compile-time truthy", 1) {
            if (!this._bfl_s && !this._bfl_d) {
                const { BloomFilter } = __turbopack_context__.r(2522);
                let staticFilterData;
                let dynamicFilterData;
                try {
                    ;
                    ({ __routerFilterStatic: staticFilterData, __routerFilterDynamic: dynamicFilterData } = await (0, _routeloader.getClientBuildManifest)());
                } catch (err) {
                    // failed to load build manifest hard navigate
                    // to be safe
                    console.error(err);
                    if (skipNavigate) {
                        return true;
                    }
                    handleHardNavigation({
                        url: (0, _addbasepath.addBasePath)((0, _addlocale.addLocale)(as, locale || this.locale, this.defaultLocale)),
                        router: this
                    });
                    return new Promise(()=>{});
                }
                const routerFilterSValue = ("TURBOPACK compile-time value", {
                    "numItems": ("TURBOPACK compile-time value", 0),
                    "errorRate": ("TURBOPACK compile-time value", 0.0001),
                    "numBits": ("TURBOPACK compile-time value", 0),
                    "numHashes": ("TURBOPACK compile-time value", null),
                    "bitArray": ("TURBOPACK compile-time value", [])
                });
                if (!staticFilterData && routerFilterSValue) {
                    staticFilterData = ("TURBOPACK compile-time truthy", 1) ? routerFilterSValue : "TURBOPACK unreachable";
                }
                const routerFilterDValue = ("TURBOPACK compile-time value", {
                    "numItems": ("TURBOPACK compile-time value", 0),
                    "errorRate": ("TURBOPACK compile-time value", 0.0001),
                    "numBits": ("TURBOPACK compile-time value", 0),
                    "numHashes": ("TURBOPACK compile-time value", null),
                    "bitArray": ("TURBOPACK compile-time value", [])
                });
                if (!dynamicFilterData && routerFilterDValue) {
                    dynamicFilterData = ("TURBOPACK compile-time truthy", 1) ? routerFilterDValue : "TURBOPACK unreachable";
                }
                if (staticFilterData?.numHashes) {
                    this._bfl_s = new BloomFilter(staticFilterData.numItems, staticFilterData.errorRate);
                    this._bfl_s.import(staticFilterData);
                }
                if (dynamicFilterData?.numHashes) {
                    this._bfl_d = new BloomFilter(dynamicFilterData.numItems, dynamicFilterData.errorRate);
                    this._bfl_d.import(dynamicFilterData);
                }
            }
            let matchesBflStatic = false;
            let matchesBflDynamic = false;
            const pathsToCheck = [
                {
                    as
                },
                {
                    as: resolvedAs
                }
            ];
            for (const { as: curAs, allowMatchCurrent } of pathsToCheck){
                if (curAs) {
                    const asNoSlash = (0, _removetrailingslash.removeTrailingSlash)(new URL(curAs, 'http://n').pathname);
                    const asNoSlashLocale = (0, _addbasepath.addBasePath)((0, _addlocale.addLocale)(asNoSlash, locale || this.locale));
                    if (allowMatchCurrent || asNoSlash !== (0, _removetrailingslash.removeTrailingSlash)(new URL(this.asPath, 'http://n').pathname)) {
                        matchesBflStatic = matchesBflStatic || !!this._bfl_s?.contains(asNoSlash) || !!this._bfl_s?.contains(asNoSlashLocale);
                        for (const normalizedAS of [
                            asNoSlash,
                            asNoSlashLocale
                        ]){
                            // if any sub-path of as matches a dynamic filter path
                            // it should be hard navigated
                            const curAsParts = normalizedAS.split('/');
                            for(let i = 0; !matchesBflDynamic && i < curAsParts.length + 1; i++){
                                const currentPart = curAsParts.slice(0, i).join('/');
                                if (currentPart && this._bfl_d?.contains(currentPart)) {
                                    matchesBflDynamic = true;
                                    break;
                                }
                            }
                        }
                        // if the client router filter is matched then we trigger
                        // a hard navigation
                        if (matchesBflStatic || matchesBflDynamic) {
                            if (skipNavigate) {
                                return true;
                            }
                            handleHardNavigation({
                                url: (0, _addbasepath.addBasePath)((0, _addlocale.addLocale)(as, locale || this.locale, this.defaultLocale)),
                                router: this
                            });
                            return new Promise(()=>{});
                        }
                    }
                }
            }
        }
        return false;
    }
    async change(method, url, as, options, forcedScroll) {
        if (!(0, _islocalurl.isLocalURL)(url)) {
            handleHardNavigation({
                url,
                router: this
            });
            return false;
        }
        // WARNING: `_h` is an internal option for handing Next.js client-side
        // hydration. Your app should _never_ use this property. It may change at
        // any time without notice.
        const isQueryUpdating = options._h === 1;
        if (!isQueryUpdating && !options.shallow) {
            await this._bfl(as, undefined, options.locale);
        }
        let shouldResolveHref = isQueryUpdating || options._shouldResolveHref || (0, _parsepath.parsePath)(url).pathname === (0, _parsepath.parsePath)(as).pathname;
        const nextState = {
            ...this.state
        };
        // for static pages with query params in the URL we delay
        // marking the router ready until after the query is updated
        // or a navigation has occurred
        const readyStateChange = this.isReady !== true;
        this.isReady = true;
        const isSsr = this.isSsr;
        if (!isQueryUpdating) {
            this.isSsr = false;
        }
        // if a route transition is already in progress before
        // the query updating is triggered ignore query updating
        if (isQueryUpdating && this.clc) {
            return false;
        }
        const prevLocale = nextState.locale;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        // marking route changes as a navigation start entry
        if (_utils.ST) {
            performance.mark('routeChange');
        }
        const { shallow = false, scroll = true } = options;
        const routeProps = {
            shallow
        };
        if (this._inFlightRoute && this.clc) {
            if (!isSsr) {
                Router.events.emit('routeChangeError', buildCancellationError(), this._inFlightRoute, routeProps);
            }
            this.clc();
            this.clc = null;
        }
        as = (0, _addbasepath.addBasePath)((0, _addlocale.addLocale)((0, _hasbasepath.hasBasePath)(as) ? (0, _removebasepath.removeBasePath)(as) : as, options.locale, this.defaultLocale));
        const cleanedAs = (0, _removelocale.removeLocale)((0, _hasbasepath.hasBasePath)(as) ? (0, _removebasepath.removeBasePath)(as) : as, nextState.locale);
        this._inFlightRoute = as;
        const localeChange = prevLocale !== nextState.locale;
        // If the url change is only related to a hash change
        // We should not proceed. We should only change the state.
        if (!isQueryUpdating && this.onlyAHashChange(cleanedAs) && !localeChange) {
            nextState.asPath = cleanedAs;
            Router.events.emit('hashChangeStart', as, routeProps);
            // TODO: do we need the resolved href when only a hash change?
            this.changeState(method, url, as, {
                ...options,
                scroll: false
            });
            if (scroll) {
                this.scrollToHash(cleanedAs);
            }
            try {
                await this.set(nextState, this.components[nextState.route], null);
            } catch (err) {
                if ((0, _iserror.default)(err) && err.cancelled) {
                    Router.events.emit('routeChangeError', err, cleanedAs, routeProps);
                }
                throw err;
            }
            Router.events.emit('hashChangeComplete', as, routeProps);
            return true;
        }
        let parsed = (0, _parserelativeurl.parseRelativeUrl)(url);
        let { pathname, query } = parsed;
        // The build manifest needs to be loaded before auto-static dynamic pages
        // get their query parameters to allow ensuring they can be parsed properly
        // when rewritten to
        let pages, rewrites;
        try {
            ;
            [pages, { __rewrites: rewrites }] = await Promise.all([
                this.pageLoader.getPageList(),
                (0, _routeloader.getClientBuildManifest)(),
                this.pageLoader.getMiddleware()
            ]);
        } catch (err) {
            // If we fail to resolve the page list or client-build manifest, we must
            // do a server-side transition:
            handleHardNavigation({
                url: as,
                router: this
            });
            return false;
        }
        // If asked to change the current URL we should reload the current page
        // (not location.reload() but reload getInitialProps and other Next.js stuffs)
        // We also need to set the method = replaceState always
        // as this should not go into the history (That's how browsers work)
        // We should compare the new asPath to the current asPath, not the url
        if (!this.urlIsNew(cleanedAs) && !localeChange) {
            method = 'replaceState';
        }
        // we need to resolve the as value using rewrites for dynamic SSG
        // pages to allow building the data URL correctly
        let resolvedAs = as;
        // url and as should always be prefixed with basePath by this
        // point by either next/link or router.push/replace so strip the
        // basePath from the pathname to match the pages dir 1-to-1
        pathname = pathname ? (0, _removetrailingslash.removeTrailingSlash)((0, _removebasepath.removeBasePath)(pathname)) : pathname;
        let route = (0, _removetrailingslash.removeTrailingSlash)(pathname);
        const parsedAsPathname = as.startsWith('/') && (0, _parserelativeurl.parseRelativeUrl)(as).pathname;
        // if we detected the path as app route during prefetching
        // trigger hard navigation
        if (this.components[pathname]?.__appRouter) {
            handleHardNavigation({
                url: as,
                router: this
            });
            return new Promise(()=>{});
        }
        const isMiddlewareRewrite = !!(parsedAsPathname && route !== parsedAsPathname && (!(0, _isdynamic.isDynamicRoute)(route) || !(0, _routematcher.getRouteMatcher)((0, _routeregex.getRouteRegex)(route))(parsedAsPathname)));
        // we don't attempt resolve asPath when we need to execute
        // middleware as the resolving will occur server-side
        const isMiddlewareMatch = !options.shallow && await matchesMiddleware({
            asPath: as,
            locale: nextState.locale,
            router: this
        });
        if (isQueryUpdating && isMiddlewareMatch) {
            shouldResolveHref = false;
        }
        if (shouldResolveHref && pathname !== '/_error') {
            ;
            options._shouldResolveHref = true;
            if (("TURBOPACK compile-time value", false) && as.startsWith('/')) //TURBOPACK unreachable
            ;
            else {
                parsed.pathname = resolveDynamicRoute(pathname, pages);
                if (parsed.pathname !== pathname) {
                    pathname = parsed.pathname;
                    parsed.pathname = (0, _addbasepath.addBasePath)(pathname);
                    if (!isMiddlewareMatch) {
                        url = (0, _formaturl.formatWithValidation)(parsed);
                    }
                }
            }
        }
        // The pages client router resolves a navigation against pages routes only.
        // When it resolves to a dynamic pages route, an app route that begins with
        // a dynamic segment may be more specific and own this path on the server
        // (e.g. `/en/about` resolves to the pages route `/[locale]/[category]`, but
        // the app route `/[locale]/about` should win). Such app routes have no
        // static prefix for the early `_bfl` check, so reconstruct the candidate
        // patterns from the resolved route and hard navigate when one is in the
        // dynamic filter.
        if (!isQueryUpdating && !options.shallow && ("TURBOPACK compile-time value", true) && this._bfl_d && (0, _isdynamic.isDynamicRoute)(pathname)) {
            const concretePathname = (0, _removetrailingslash.removeTrailingSlash)((0, _parserelativeurl.parseRelativeUrl)(cleanedAs).pathname);
            const isShadowedByAppRoute = (0, _dynamicfilterpattern.hasDynamicFilterCandidate)(pathname, concretePathname, (candidate)=>!!this._bfl_d?.contains(candidate));
            if (isShadowedByAppRoute) {
                handleHardNavigation({
                    url: as,
                    router: this
                });
                return new Promise(()=>{});
            }
        }
        if (!(0, _islocalurl.isLocalURL)(as)) {
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            handleHardNavigation({
                url: as,
                router: this
            });
            return false;
        }
        resolvedAs = (0, _removelocale.removeLocale)((0, _removebasepath.removeBasePath)(resolvedAs), nextState.locale);
        route = (0, _removetrailingslash.removeTrailingSlash)(pathname);
        let routeMatch = false;
        if ((0, _isdynamic.isDynamicRoute)(route)) {
            const parsedAs = (0, _parserelativeurl.parseRelativeUrl)(resolvedAs);
            const asPathname = parsedAs.pathname;
            const routeRegex = (0, _routeregex.getRouteRegex)(route);
            routeMatch = (0, _routematcher.getRouteMatcher)(routeRegex)(asPathname);
            const shouldInterpolate = route === asPathname;
            const interpolatedAs = shouldInterpolate ? (0, _interpolateas.interpolateAs)(route, asPathname, query) : {};
            if (!routeMatch || shouldInterpolate && !interpolatedAs.result) {
                const missingParams = Object.keys(routeRegex.groups).filter((param)=>!query[param] && !routeRegex.groups[param].optional);
                if (missingParams.length > 0 && !isMiddlewareMatch) {
                    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                    ;
                    throw Object.defineProperty(new Error((shouldInterpolate ? `The provided \`href\` (${url}) value is missing query values (${missingParams.join(', ')}) to be interpolated properly. ` : `The provided \`as\` value (${asPathname}) is incompatible with the \`href\` value (${route}). `) + `Read more: https://nextjs.org/docs/messages/${shouldInterpolate ? 'href-interpolation-failed' : 'incompatible-href-as'}`), "__NEXT_ERROR_CODE", {
                        value: "E344",
                        enumerable: false,
                        configurable: true
                    });
                }
            } else if (shouldInterpolate) {
                as = (0, _formaturl.formatWithValidation)(Object.assign({}, parsedAs, {
                    pathname: interpolatedAs.result,
                    query: (0, _omit.omit)(query, interpolatedAs.params)
                }));
            } else {
                // Merge params into `query`, overwriting any specified in search
                Object.assign(query, routeMatch);
            }
        }
        if (!isQueryUpdating) {
            Router.events.emit('routeChangeStart', as, routeProps);
        }
        const isErrorRoute = this.pathname === '/404' || this.pathname === '/_error';
        try {
            let routeInfo = await this.getRouteInfo({
                route,
                pathname,
                query,
                as,
                resolvedAs,
                routeProps,
                locale: nextState.locale,
                isPreview: nextState.isPreview,
                hasMiddleware: isMiddlewareMatch,
                unstable_skipClientCache: options.unstable_skipClientCache,
                isQueryUpdating: isQueryUpdating && !this.isFallback,
                isMiddlewareRewrite
            });
            if (!isQueryUpdating && !options.shallow) {
                await this._bfl(as, 'resolvedAs' in routeInfo ? routeInfo.resolvedAs : undefined, nextState.locale);
            }
            if ('route' in routeInfo && isMiddlewareMatch) {
                pathname = routeInfo.route || route;
                route = pathname;
                if (!routeProps.shallow) {
                    query = Object.assign({}, routeInfo.query || {}, query);
                }
                const cleanedParsedPathname = (0, _hasbasepath.hasBasePath)(parsed.pathname) ? (0, _removebasepath.removeBasePath)(parsed.pathname) : parsed.pathname;
                if (routeMatch && pathname !== cleanedParsedPathname) {
                    Object.keys(routeMatch).forEach((key)=>{
                        if (routeMatch && query[key] === routeMatch[key]) {
                            delete query[key];
                        }
                    });
                }
                if ((0, _isdynamic.isDynamicRoute)(pathname)) {
                    const prefixedAs = !routeProps.shallow && routeInfo.resolvedAs ? routeInfo.resolvedAs : (0, _addbasepath.addBasePath)((0, _addlocale.addLocale)(new URL(as, location.href).pathname, nextState.locale), true);
                    let rewriteAs = prefixedAs;
                    if ((0, _hasbasepath.hasBasePath)(rewriteAs)) {
                        rewriteAs = (0, _removebasepath.removeBasePath)(rewriteAs);
                    }
                    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                    ;
                    const routeRegex = (0, _routeregex.getRouteRegex)(pathname);
                    const curRouteMatch = (0, _routematcher.getRouteMatcher)(routeRegex)(new URL(rewriteAs, location.href).pathname);
                    if (curRouteMatch) {
                        Object.assign(query, curRouteMatch);
                    }
                }
            }
            // If the routeInfo brings a redirect we simply apply it.
            if ('type' in routeInfo) {
                if (routeInfo.type === 'redirect-internal') {
                    return this.change(method, routeInfo.newUrl, routeInfo.newAs, options);
                } else {
                    handleHardNavigation({
                        url: routeInfo.destination,
                        router: this
                    });
                    return new Promise(()=>{});
                }
            }
            const component = routeInfo.Component;
            if (component && component.unstable_scriptLoader) {
                const scripts = [].concat(component.unstable_scriptLoader());
                scripts.forEach((script)=>{
                    (0, _script.handleClientScriptLoad)(script.props);
                });
            }
            // handle redirect on client-transition
            if ((routeInfo.__N_SSG || routeInfo.__N_SSP) && routeInfo.props) {
                if (routeInfo.props.pageProps && routeInfo.props.pageProps.__N_REDIRECT) {
                    // Use the destination from redirect without adding locale
                    options.locale = false;
                    const destination = routeInfo.props.pageProps.__N_REDIRECT;
                    // check if destination is internal (resolves to a page) and attempt
                    // client-navigation if it is falling back to hard navigation if
                    // it's not
                    if (destination.startsWith('/') && routeInfo.props.pageProps.__N_REDIRECT_BASE_PATH !== false) {
                        const parsedHref = (0, _parserelativeurl.parseRelativeUrl)(destination);
                        parsedHref.pathname = resolveDynamicRoute(parsedHref.pathname, pages);
                        const { url: newUrl, as: newAs } = prepareUrlAs(this, destination, destination);
                        return this.change(method, newUrl, newAs, options);
                    }
                    handleHardNavigation({
                        url: destination,
                        router: this
                    });
                    return new Promise(()=>{});
                }
                nextState.isPreview = !!routeInfo.props.__N_PREVIEW;
                // handle SSG data 404
                if (routeInfo.props.notFound === SSG_DATA_NOT_FOUND) {
                    let notFoundRoute;
                    try {
                        await this.fetchComponent('/404');
                        notFoundRoute = '/404';
                    } catch (_) {
                        notFoundRoute = '/_error';
                    }
                    routeInfo = await this.getRouteInfo({
                        route: notFoundRoute,
                        pathname: notFoundRoute,
                        query,
                        as,
                        resolvedAs,
                        routeProps: {
                            shallow: false
                        },
                        locale: nextState.locale,
                        isPreview: nextState.isPreview,
                        isNotFound: true
                    });
                    if ('type' in routeInfo) {
                        throw Object.defineProperty(new Error(`Unexpected middleware effect on /404`), "__NEXT_ERROR_CODE", {
                            value: "E158",
                            enumerable: false,
                            configurable: true
                        });
                    }
                }
            }
            if (isQueryUpdating && this.pathname === '/_error' && self.__NEXT_DATA__.props?.pageProps?.statusCode === 500 && routeInfo.props?.pageProps) {
                // ensure statusCode is still correct for static 500 page
                // when updating query information
                routeInfo.props.pageProps.statusCode = 500;
            }
            // shallow routing is only allowed for same page URL changes.
            const isValidShallowRoute = options.shallow && nextState.route === (routeInfo.route ?? route);
            const shouldScroll = options.scroll ?? (!isQueryUpdating && !isValidShallowRoute);
            const resetScroll = shouldScroll ? {
                x: 0,
                y: 0
            } : null;
            const upcomingScrollState = forcedScroll ?? resetScroll;
            // the new state that the router gonna set
            const upcomingRouterState = {
                ...nextState,
                route,
                pathname,
                query,
                asPath: cleanedAs,
                isFallback: false
            };
            // When the page being rendered is the 404 page, we should only update the
            // query parameters. Route changes here might add the basePath when it
            // wasn't originally present. This is also why this block is before the
            // below `changeState` call which updates the browser's history (changing
            // the URL).
            if (isQueryUpdating && isErrorRoute) {
                routeInfo = await this.getRouteInfo({
                    route: this.pathname,
                    pathname: this.pathname,
                    query,
                    as,
                    resolvedAs,
                    routeProps: {
                        shallow: false
                    },
                    locale: nextState.locale,
                    isPreview: nextState.isPreview,
                    isQueryUpdating: isQueryUpdating && !this.isFallback
                });
                if ('type' in routeInfo) {
                    throw Object.defineProperty(new Error(`Unexpected middleware effect on ${this.pathname}`), "__NEXT_ERROR_CODE", {
                        value: "E225",
                        enumerable: false,
                        configurable: true
                    });
                }
                if (this.pathname === '/_error' && self.__NEXT_DATA__.props?.pageProps?.statusCode === 500 && routeInfo.props?.pageProps) {
                    // ensure statusCode is still correct for static 500 page
                    // when updating query information
                    routeInfo.props.pageProps.statusCode = 500;
                }
                try {
                    await this.set(upcomingRouterState, routeInfo, upcomingScrollState);
                } catch (err) {
                    if ((0, _iserror.default)(err) && err.cancelled) {
                        Router.events.emit('routeChangeError', err, cleanedAs, routeProps);
                    }
                    throw err;
                }
                return true;
            }
            Router.events.emit('beforeHistoryChange', as, routeProps);
            this.changeState(method, url, as, options);
            // for query updates we can skip it if the state is unchanged and we don't
            // need to scroll
            // https://github.com/vercel/next.js/issues/37139
            const canSkipUpdating = isQueryUpdating && !upcomingScrollState && !readyStateChange && !localeChange && (0, _comparestates.compareRouterStates)(upcomingRouterState, this.state);
            if (!canSkipUpdating) {
                try {
                    await this.set(upcomingRouterState, routeInfo, upcomingScrollState);
                } catch (e) {
                    if (e.cancelled) routeInfo.error = routeInfo.error || e;
                    else throw e;
                }
                if (routeInfo.error) {
                    if (!isQueryUpdating) {
                        Router.events.emit('routeChangeError', routeInfo.error, cleanedAs, routeProps);
                    }
                    throw routeInfo.error;
                }
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                if (!isQueryUpdating) {
                    Router.events.emit('routeChangeComplete', as, routeProps);
                }
                // A hash mark # is the optional last part of a URL
                const hashRegex = /#.+$/;
                if (shouldScroll && hashRegex.test(as)) {
                    this.scrollToHash(as);
                }
            }
            return true;
        } catch (err) {
            if ((0, _iserror.default)(err) && err.cancelled) {
                return false;
            }
            throw err;
        }
    }
    changeState(method, url, as, options = {}) {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        if (method !== 'pushState' || (0, _utils.getURL)() !== as) {
            this._shallow = options.shallow;
            window.history[method]({
                url,
                as,
                options,
                __N: true,
                key: this._key = method !== 'pushState' ? this._key : createKey()
            }, // Passing the empty string here should be safe against future changes to the method.
            // https://developer.mozilla.org/docs/Web/API/History/replaceState
            '', as);
        }
    }
    async handleRouteInfoError(err, pathname, query, as, routeProps, loadErrorFail) {
        if (err.cancelled) {
            // bubble up cancellation errors
            throw err;
        }
        if ((0, _routeloader.isAssetError)(err) || loadErrorFail) {
            Router.events.emit('routeChangeError', err, as, routeProps);
            // If we can't load the page it could be one of following reasons
            //  1. Page doesn't exists
            //  2. Page does exist in a different zone
            //  3. Internal error while loading the page
            // So, doing a hard reload is the proper way to deal with this.
            handleHardNavigation({
                url: as,
                router: this
            });
            // Changing the URL doesn't block executing the current code path.
            // So let's throw a cancellation error stop the routing logic.
            throw buildCancellationError();
        }
        console.error(err);
        try {
            let props;
            const { page: Component, styleSheets } = await this.fetchComponent('/_error');
            const routeInfo = {
                props,
                Component,
                styleSheets,
                err,
                error: err
            };
            if (!routeInfo.props) {
                try {
                    routeInfo.props = await this.getInitialProps(Component, {
                        err,
                        pathname,
                        query
                    });
                } catch (gipErr) {
                    console.error('Error in error page `getInitialProps`: ', gipErr);
                    routeInfo.props = {};
                }
            }
            return routeInfo;
        } catch (routeInfoErr) {
            return this.handleRouteInfoError((0, _iserror.default)(routeInfoErr) ? routeInfoErr : Object.defineProperty(new Error(routeInfoErr + ''), "__NEXT_ERROR_CODE", {
                value: "E394",
                enumerable: false,
                configurable: true
            }), pathname, query, as, routeProps, true);
        }
    }
    async getRouteInfo({ route: requestedRoute, pathname, query, as, resolvedAs, routeProps, locale, hasMiddleware, isPreview, unstable_skipClientCache, isQueryUpdating, isMiddlewareRewrite, isNotFound }) {
        /**
     * This `route` binding can change if there's a rewrite
     * so we keep a reference to the original requested route
     * so we can store the cache for it and avoid re-requesting every time
     * for shallow routing purposes.
     */ let route = requestedRoute;
        try {
            let existingInfo = this.components[route];
            if (routeProps.shallow && existingInfo && this.route === route) {
                return existingInfo;
            }
            const handleCancelled = getCancelledHandler({
                route,
                router: this
            });
            if (hasMiddleware) {
                existingInfo = undefined;
            }
            let cachedRouteInfo = existingInfo && !('initial' in existingInfo) && ("TURBOPACK compile-time value", "production") !== 'development' ? existingInfo : undefined;
            const isBackground = isQueryUpdating;
            const fetchNextDataParams = {
                dataHref: this.pageLoader.getDataHref({
                    href: (0, _formaturl.formatWithValidation)({
                        pathname,
                        query
                    }),
                    skipInterpolation: true,
                    asPath: isNotFound ? '/404' : resolvedAs,
                    locale
                }),
                hasMiddleware: true,
                isServerRender: this.isSsr,
                parseJSON: true,
                inflightCache: isBackground ? this.sbc : this.sdc,
                persistCache: !isPreview,
                isPrefetch: false,
                unstable_skipClientCache,
                isBackground
            };
            let data = isQueryUpdating && !isMiddlewareRewrite ? null : await withMiddlewareEffects({
                fetchData: ()=>fetchNextData(fetchNextDataParams),
                asPath: isNotFound ? '/404' : resolvedAs,
                locale: locale,
                router: this
            }).catch((err)=>{
                // we don't hard error during query updating
                // as it's un-necessary and doesn't need to be fatal
                // unless it is a fallback route and the props can't
                // be loaded
                if (isQueryUpdating) {
                    return null;
                }
                throw err;
            });
            // when rendering error routes we don't apply middleware
            // effects
            if (data && (pathname === '/_error' || pathname === '/404')) {
                data.effect = undefined;
            }
            if (isQueryUpdating) {
                if (!data) {
                    data = {
                        json: self.__NEXT_DATA__.props
                    };
                } else {
                    data.json = self.__NEXT_DATA__.props;
                }
            }
            handleCancelled();
            if (data?.effect?.type === 'redirect-internal' || data?.effect?.type === 'redirect-external') {
                return data.effect;
            }
            if (data?.effect?.type === 'rewrite') {
                const resolvedRoute = (0, _removetrailingslash.removeTrailingSlash)(data.effect.resolvedHref);
                const pages = await this.pageLoader.getPageList();
                // during query updating the page must match although during
                // client-transition a redirect that doesn't match a page
                // can be returned and this should trigger a hard navigation
                // which is valid for incremental migration
                if (!isQueryUpdating || pages.includes(resolvedRoute)) {
                    route = resolvedRoute;
                    pathname = data.effect.resolvedHref;
                    query = {
                        ...query,
                        ...data.effect.parsedAs.query
                    };
                    resolvedAs = (0, _removebasepath.removeBasePath)((0, _normalizelocalepath.normalizeLocalePath)(data.effect.parsedAs.pathname, this.locales).pathname);
                    // Check again the cache with the new destination.
                    existingInfo = this.components[route];
                    if (routeProps.shallow && existingInfo && this.route === route && !hasMiddleware) {
                        // If we have a match with the current route due to rewrite,
                        // we can copy the existing information to the rewritten one.
                        // Then, we return the information along with the matched route.
                        return {
                            ...existingInfo,
                            route
                        };
                    }
                }
            }
            if ((0, _isapiroute.isAPIRoute)(route)) {
                handleHardNavigation({
                    url: as,
                    router: this
                });
                return new Promise(()=>{});
            }
            const routeInfo = cachedRouteInfo || await this.fetchComponent(route).then((res)=>({
                    Component: res.page,
                    styleSheets: res.styleSheets,
                    __N_SSG: res.mod.__N_SSG,
                    __N_SSP: res.mod.__N_SSP
                }));
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const wasBailedPrefetch = data?.response?.headers.get('x-middleware-skip');
            const shouldFetchData = routeInfo.__N_SSG || routeInfo.__N_SSP;
            // For non-SSG prefetches that bailed before sending data
            // we clear the cache to fetch full response
            if (wasBailedPrefetch && data?.dataHref) {
                delete this.sdc[data.dataHref];
            }
            const { props, cacheKey } = await this._getData(async ()=>{
                if (shouldFetchData) {
                    if (data?.json && !wasBailedPrefetch) {
                        return {
                            cacheKey: data.cacheKey,
                            props: data.json
                        };
                    }
                    const dataHref = data?.dataHref ? data.dataHref : this.pageLoader.getDataHref({
                        href: (0, _formaturl.formatWithValidation)({
                            pathname,
                            query
                        }),
                        asPath: resolvedAs,
                        locale
                    });
                    const fetched = await fetchNextData({
                        dataHref,
                        isServerRender: this.isSsr,
                        parseJSON: true,
                        inflightCache: wasBailedPrefetch ? {} : this.sdc,
                        persistCache: !isPreview,
                        isPrefetch: false,
                        unstable_skipClientCache
                    });
                    return {
                        cacheKey: fetched.cacheKey,
                        props: fetched.json || {}
                    };
                }
                return {
                    headers: {},
                    props: await this.getInitialProps(routeInfo.Component, {
                        pathname,
                        query,
                        asPath: as,
                        locale,
                        locales: this.locales,
                        defaultLocale: this.defaultLocale
                    })
                };
            });
            // Only bust the data cache for SSP routes although
            // middleware can skip cache per request with
            // x-middleware-cache: no-cache as well
            if (routeInfo.__N_SSP && fetchNextDataParams.dataHref && cacheKey) {
                delete this.sdc[cacheKey];
            }
            // we kick off a HEAD request in the background
            // when a non-prefetch request is made to signal revalidation
            if (!this.isPreview && routeInfo.__N_SSG && ("TURBOPACK compile-time value", "production") !== 'development' && !isQueryUpdating) {
                fetchNextData(Object.assign({}, fetchNextDataParams, {
                    isBackground: true,
                    persistCache: false,
                    inflightCache: this.sbc
                })).catch(()=>{});
            }
            props.pageProps = Object.assign({}, props.pageProps);
            routeInfo.props = props;
            routeInfo.route = route;
            routeInfo.query = query;
            routeInfo.resolvedAs = resolvedAs;
            this.components[route] = routeInfo;
            return routeInfo;
        } catch (err) {
            return this.handleRouteInfoError((0, _iserror.getProperError)(err), pathname, query, as, routeProps);
        }
    }
    set(state, data, resetScroll) {
        this.state = state;
        return this.sub(data, this.components['/_app'].Component, resetScroll);
    }
    /**
   * Callback to execute before replacing router state
   * @param cb callback to be executed
   */ beforePopState(cb) {
        this._bps = cb;
    }
    onlyAHashChange(as) {
        if (!this.asPath) return false;
        const [oldUrlNoHash, oldHash] = this.asPath.split('#', 2);
        const [newUrlNoHash, newHash] = as.split('#', 2);
        // Makes sure we scroll to the provided hash if the url/hash are the same
        if (newHash && oldUrlNoHash === newUrlNoHash && oldHash === newHash) {
            return true;
        }
        // If the urls are change, there's more than a hash change
        if (oldUrlNoHash !== newUrlNoHash) {
            return false;
        }
        // If the hash has changed, then it's a hash only change.
        // This check is necessary to handle both the enter and
        // leave hash === '' cases. The identity case falls through
        // and is treated as a next reload.
        return oldHash !== newHash;
    }
    scrollToHash(as) {
        const [, hash = ''] = as.split('#', 2);
        (0, _disablesmoothscroll.disableSmoothScrollDuringRouteTransition)(()=>{
            // Scroll to top if the hash is just `#` with no value or `#top`
            // To mirror browsers
            if (hash === '' || hash === 'top') {
                window.scrollTo(0, 0);
                return;
            }
            // Decode hash to make non-latin anchor works.
            const rawHash = decodeURIComponent(hash);
            // First we check if the element by id is found
            const idEl = document.getElementById(rawHash);
            if (idEl) {
                idEl.scrollIntoView();
                return;
            }
            // If there's no element with the id, we check the `name` property
            // To mirror browsers
            const nameEl = document.getElementsByName(rawHash)[0];
            if (nameEl) {
                nameEl.scrollIntoView();
            }
        }, {
            onlyHashChange: this.onlyAHashChange(as)
        });
    }
    urlIsNew(asPath) {
        return this.asPath !== asPath;
    }
    /**
   * Prefetch page code, you may wait for the data during page rendering.
   * This feature only works in production!
   * @param url the href of prefetched page
   * @param asPath the as path of the prefetched page
   */ async prefetch(url, asPath = url, options = {}) {
        // Prefetch is not supported in development mode because it would trigger on-demand-entries
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        if (typeof window !== 'undefined' && (0, _isbot.isBot)(window.navigator.userAgent)) {
            // No prefetches for bots that render the link since they are typically navigating
            // links via the equivalent of a hard navigation and hence never utilize these
            // prefetches.
            return;
        }
        let parsed = (0, _parserelativeurl.parseRelativeUrl)(url);
        const urlPathname = parsed.pathname;
        let { pathname, query } = parsed;
        const originalPathname = pathname;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const pages = await this.pageLoader.getPageList();
        let resolvedAs = asPath;
        const locale = typeof options.locale !== 'undefined' ? options.locale || undefined : this.locale;
        const isMiddlewareMatch = await matchesMiddleware({
            asPath: asPath,
            locale: locale,
            router: this
        });
        if (("TURBOPACK compile-time value", false) && asPath.startsWith('/')) //TURBOPACK unreachable
        ;
        parsed.pathname = resolveDynamicRoute(parsed.pathname, pages);
        if ((0, _isdynamic.isDynamicRoute)(parsed.pathname)) {
            pathname = parsed.pathname;
            parsed.pathname = pathname;
            Object.assign(query, (0, _routematcher.getRouteMatcher)((0, _routeregex.getRouteRegex)(parsed.pathname))((0, _parsepath.parsePath)(asPath).pathname) || {});
            if (!isMiddlewareMatch) {
                url = (0, _formaturl.formatWithValidation)(parsed);
            }
        }
        const data = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : await withMiddlewareEffects({
            fetchData: ()=>fetchNextData({
                    dataHref: this.pageLoader.getDataHref({
                        href: (0, _formaturl.formatWithValidation)({
                            pathname: originalPathname,
                            query
                        }),
                        skipInterpolation: true,
                        asPath: resolvedAs,
                        locale
                    }),
                    hasMiddleware: true,
                    isServerRender: false,
                    parseJSON: true,
                    inflightCache: this.sdc,
                    persistCache: !this.isPreview,
                    isPrefetch: true
                }),
            asPath: asPath,
            locale: locale,
            router: this
        });
        /**
     * If there was a rewrite we apply the effects of the rewrite on the
     * current parameters for the prefetch.
     */ if (data?.effect.type === 'rewrite') {
            parsed.pathname = data.effect.resolvedHref;
            pathname = data.effect.resolvedHref;
            query = {
                ...query,
                ...data.effect.parsedAs.query
            };
            resolvedAs = data.effect.parsedAs.pathname;
            url = (0, _formaturl.formatWithValidation)(parsed);
        }
        /**
     * If there is a redirect to an external destination then we don't have
     * to prefetch content as it will be unused.
     */ if (data?.effect.type === 'redirect-external') {
            return;
        }
        const route = (0, _removetrailingslash.removeTrailingSlash)(pathname);
        if (await this._bfl(asPath, resolvedAs, options.locale, true)) {
            this.components[urlPathname] = {
                __appRouter: true
            };
        }
        await Promise.all([
            this.pageLoader._isSsg(route).then((isSsg)=>{
                return isSsg ? fetchNextData({
                    dataHref: data?.json ? data?.dataHref : this.pageLoader.getDataHref({
                        href: url,
                        asPath: resolvedAs,
                        locale: locale
                    }),
                    isServerRender: false,
                    parseJSON: true,
                    inflightCache: this.sdc,
                    persistCache: !this.isPreview,
                    isPrefetch: true,
                    unstable_skipClientCache: options.unstable_skipClientCache || options.priority && !!("TURBOPACK compile-time value", true)
                }).then(()=>false).catch(()=>false) : false;
            }),
            this.pageLoader[options.priority ? 'loadPage' : 'prefetch'](route)
        ]);
    }
    async fetchComponent(route) {
        const handleCancelled = getCancelledHandler({
            route,
            router: this
        });
        try {
            const componentResult = await this.pageLoader.loadPage(route);
            handleCancelled();
            return componentResult;
        } catch (err) {
            handleCancelled();
            throw err;
        }
    }
    _getData(fn) {
        let cancelled = false;
        const cancel = ()=>{
            cancelled = true;
        };
        this.clc = cancel;
        return fn().then((data)=>{
            if (cancel === this.clc) {
                this.clc = null;
            }
            if (cancelled) {
                const err = Object.defineProperty(new Error('Loading initial props cancelled'), "__NEXT_ERROR_CODE", {
                    value: "E405",
                    enumerable: false,
                    configurable: true
                });
                err.cancelled = true;
                throw err;
            }
            return data;
        });
    }
    getInitialProps(Component, ctx) {
        const { Component: App } = this.components['/_app'];
        const AppTree = this._wrapApp(App);
        ctx.AppTree = AppTree;
        return (0, _utils.loadGetInitialProps)(App, {
            AppTree,
            Component,
            router: this,
            ctx
        });
    }
    get route() {
        return this.state.route;
    }
    get pathname() {
        return this.state.pathname;
    }
    get query() {
        return this.state.query;
    }
    get asPath() {
        return this.state.asPath;
    }
    get locale() {
        return this.state.locale;
    }
    get isFallback() {
        return this.state.isFallback;
    }
    get isPreview() {
        return this.state.isPreview;
    }
}
}),
4408, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return withRouter;
    }
});
const _interop_require_default = __turbopack_context__.r(1705);
const _jsxruntime = __turbopack_context__.r(1398);
const _react = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r(1788));
const _router = __turbopack_context__.r(6990);
function withRouter(ComposedComponent) {
    function WithRouterWrapper(props) {
        return /*#__PURE__*/ (0, _jsxruntime.jsx)(ComposedComponent, {
            router: (0, _router.useRouter)(),
            ...props
        });
    }
    WithRouterWrapper.getInitialProps = ComposedComponent.getInitialProps;
    WithRouterWrapper.origGetInitialProps = ComposedComponent.origGetInitialProps;
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return WithRouterWrapper;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
6990, ((__turbopack_context__, module, exports) => {
"use strict";

/* global window */ Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    Router: null,
    createRouter: null,
    default: null,
    makePublicRouterInstance: null,
    useRouter: null,
    withRouter: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    Router: function() {
        return _router.default;
    },
    createRouter: function() {
        return createRouter;
    },
    // Export the singletonRouter and this is the public API.
    default: function() {
        return _default;
    },
    makePublicRouterInstance: function() {
        return makePublicRouterInstance;
    },
    useRouter: function() {
        return useRouter;
    },
    withRouter: function() {
        return _withrouter.default;
    }
});
const _interop_require_default = __turbopack_context__.r(1705);
const _react = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r(1788));
const _router = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r(4438));
const _routercontextsharedruntime = __turbopack_context__.r(5479);
const _iserror = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r(3910));
const _withrouter = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r(4408));
const singletonRouter = {
    router: null,
    readyCallbacks: [],
    ready (callback) {
        if (this.router) return callback();
        if (typeof window !== 'undefined') {
            this.readyCallbacks.push(callback);
        }
    }
};
// Create public properties and methods of the router in the singletonRouter
const urlPropertyFields = [
    'pathname',
    'route',
    'query',
    'asPath',
    'components',
    'isFallback',
    'basePath',
    'locale',
    'locales',
    'defaultLocale',
    'isReady',
    'isPreview',
    'isLocaleDomain',
    'domainLocales'
];
const routerEvents = [
    'routeChangeStart',
    'beforeHistoryChange',
    'routeChangeComplete',
    'routeChangeError',
    'hashChangeStart',
    'hashChangeComplete'
];
const coreMethodFields = [
    'push',
    'replace',
    'reload',
    'back',
    'prefetch',
    'beforePopState'
];
// Events is a static property on the router, the router doesn't have to be initialized to use it
Object.defineProperty(singletonRouter, 'events', {
    get () {
        return _router.default.events;
    }
});
function getRouter() {
    if (!singletonRouter.router) {
        const message = 'No router instance found.\n' + 'You should only use "next/router" on the client side of your app.\n';
        throw Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
            value: "E1044",
            enumerable: false,
            configurable: true
        });
    }
    return singletonRouter.router;
}
urlPropertyFields.forEach((field)=>{
    // Here we need to use Object.defineProperty because we need to return
    // the property assigned to the actual router
    // The value might get changed as we change routes and this is the
    // proper way to access it
    Object.defineProperty(singletonRouter, field, {
        get () {
            const router = getRouter();
            return router[field];
        }
    });
});
coreMethodFields.forEach((field)=>{
    // We don't really know the types here, so we add them later instead
    ;
    singletonRouter[field] = (...args)=>{
        const router = getRouter();
        return router[field](...args);
    };
});
routerEvents.forEach((event)=>{
    singletonRouter.ready(()=>{
        _router.default.events.on(event, (...args)=>{
            const eventField = `on${event.charAt(0).toUpperCase()}${event.substring(1)}`;
            const _singletonRouter = singletonRouter;
            if (_singletonRouter[eventField]) {
                try {
                    _singletonRouter[eventField](...args);
                } catch (err) {
                    console.error(`Error when running the Router event: ${eventField}`);
                    console.error((0, _iserror.default)(err) ? `${err.message}\n${err.stack}` : err + '');
                }
            }
        });
    });
});
const _default = singletonRouter;
function useRouter() {
    const router = _react.default.useContext(_routercontextsharedruntime.RouterContext);
    if (!router) {
        throw Object.defineProperty(new Error('NextRouter was not mounted. https://nextjs.org/docs/messages/next-router-not-mounted'), "__NEXT_ERROR_CODE", {
            value: "E509",
            enumerable: false,
            configurable: true
        });
    }
    return router;
}
function createRouter(...args) {
    singletonRouter.router = new _router.default(...args);
    singletonRouter.readyCallbacks.forEach((cb)=>cb());
    singletonRouter.readyCallbacks = [];
    return singletonRouter.router;
}
function makePublicRouterInstance(router) {
    const scopedRouter = router;
    const instance = {};
    for (const property of urlPropertyFields){
        if (typeof scopedRouter[property] === 'object') {
            instance[property] = Object.assign(Array.isArray(scopedRouter[property]) ? [] : {}, scopedRouter[property]) // makes sure query is not stateful
            ;
            continue;
        }
        instance[property] = scopedRouter[property];
    }
    // Events is a static property on the router, the router doesn't have to be initialized to use it
    instance.events = _router.default.events;
    coreMethodFields.forEach((field)=>{
        instance[field] = (...args)=>{
            return scopedRouter[field](...args);
        };
    });
    return instance;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
5117, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    RouteAnnouncer: null,
    default: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    RouteAnnouncer: function() {
        return RouteAnnouncer;
    },
    default: function() {
        return _default;
    }
});
const _interop_require_default = __turbopack_context__.r(1705);
const _jsxruntime = __turbopack_context__.r(1398);
const _react = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r(1788));
const _router = __turbopack_context__.r(6990);
const nextjsRouteAnnouncerStyles = {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 0,
    width: '1px',
    // https://medium.com/@jessebeach/beware-smushed-off-screen-accessible-text-5952a4c2cbfe
    whiteSpace: 'nowrap',
    wordWrap: 'normal'
};
const RouteAnnouncer = ()=>{
    const { asPath } = (0, _router.useRouter)();
    const [routeAnnouncement, setRouteAnnouncement] = _react.default.useState('');
    // Only announce the path change, but not for the first load because screen
    // reader will do that automatically.
    const previouslyLoadedPath = _react.default.useRef(asPath);
    // Every time the path changes, announce the new page’s title following this
    // priority: first the document title (from head), otherwise the first h1, or
    // if none of these exist, then the pathname from the URL. This methodology is
    // inspired by Marcy Sutton’s accessible client routing user testing. More
    // information can be found here:
    // https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/
    _react.default.useEffect(()=>{
        // If the path hasn't change, we do nothing.
        if (previouslyLoadedPath.current === asPath) return;
        previouslyLoadedPath.current = asPath;
        if (document.title) {
            setRouteAnnouncement(document.title);
        } else {
            const pageHeader = document.querySelector('h1');
            const content = pageHeader?.innerText ?? pageHeader?.textContent;
            setRouteAnnouncement(content || asPath);
        }
    }, [
        asPath
    ]);
    return /*#__PURE__*/ (0, _jsxruntime.jsx)("p", {
        "aria-live": "assertive" // Make the announcement immediately.
        ,
        id: "__next-route-announcer__",
        role: "alert",
        style: nextjsRouteAnnouncerStyles,
        children: routeAnnouncement
    });
};
const _default = RouteAnnouncer;
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
5125, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    VALID_LOADERS: null,
    imageConfigDefault: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    VALID_LOADERS: function() {
        return VALID_LOADERS;
    },
    imageConfigDefault: function() {
        return imageConfigDefault;
    }
});
const VALID_LOADERS = [
    'default',
    'imgix',
    'cloudinary',
    'akamai',
    'custom'
];
const imageConfigDefault = {
    deviceSizes: [
        640,
        750,
        828,
        1080,
        1200,
        1920,
        2048,
        3840
    ],
    imageSizes: [
        32,
        48,
        64,
        96,
        128,
        256,
        384
    ],
    path: '/_next/image',
    loader: 'default',
    loaderFile: '',
    /**
   * @deprecated Use `remotePatterns` instead to protect your application from malicious users.
   */ domains: [],
    disableStaticImages: false,
    minimumCacheTTL: 14400,
    formats: [
        'image/webp'
    ],
    maximumDiskCacheSize: undefined,
    maximumRedirects: 3,
    maximumResponseBody: 50000000,
    dangerouslyAllowLocalIP: false,
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: `script-src 'none'; frame-src 'none'; sandbox;`,
    contentDispositionType: 'attachment',
    localPatterns: undefined,
    remotePatterns: [],
    qualities: [
        75
    ],
    unoptimized: false,
    customCacheHandler: false
};
}),
3521, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ImageConfigContext", {
    enumerable: true,
    get: function() {
        return ImageConfigContext;
    }
});
const _interop_require_default = __turbopack_context__.r(1705);
const _react = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r(1788));
const _imageconfig = __turbopack_context__.r(5125);
const ImageConfigContext = _react.default.createContext(_imageconfig.imageConfigDefault);
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
}),
1085, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    AppRouterContext: null,
    GlobalLayoutRouterContext: null,
    LayoutRouterContext: null,
    MissingSlotContext: null,
    TemplateContext: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    AppRouterContext: function() {
        return AppRouterContext;
    },
    GlobalLayoutRouterContext: function() {
        return GlobalLayoutRouterContext;
    },
    LayoutRouterContext: function() {
        return LayoutRouterContext;
    },
    MissingSlotContext: function() {
        return MissingSlotContext;
    },
    TemplateContext: function() {
        return TemplateContext;
    }
});
const _interop_require_default = __turbopack_context__.r(1705);
const _react = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r(1788));
const AppRouterContext = _react.default.createContext(null);
const LayoutRouterContext = _react.default.createContext(null);
const GlobalLayoutRouterContext = _react.default.createContext(null);
const TemplateContext = _react.default.createContext(null);
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const MissingSlotContext = _react.default.createContext(new Set());
}),
1430, ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * ReadonlyURLSearchParams implementation shared between client and server.
 * This file is intentionally not marked as 'use client' or 'use server'
 * so it can be imported by both environments.
 */ /** @internal */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReadonlyURLSearchParams", {
    enumerable: true,
    get: function() {
        return ReadonlyURLSearchParams;
    }
});
class ReadonlyURLSearchParamsError extends Error {
    constructor(){
        super('Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams');
        Object.defineProperty(this, "__NEXT_ERROR_CODE", {
            value: "E1174",
            enumerable: false,
            configurable: true
        });
    }
}
class ReadonlyURLSearchParams extends URLSearchParams {
    /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams */ append() {
        throw new ReadonlyURLSearchParamsError();
    }
    /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams */ delete() {
        throw new ReadonlyURLSearchParamsError();
    }
    /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams */ set() {
        throw new ReadonlyURLSearchParamsError();
    }
    /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams */ sort() {
        throw new ReadonlyURLSearchParamsError();
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
8, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    NavigationPromisesContext: null,
    PathParamsContext: null,
    PathnameContext: null,
    ReadonlyURLSearchParams: null,
    SearchParamsContext: null,
    createDevToolsInstrumentedPromise: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    NavigationPromisesContext: function() {
        return NavigationPromisesContext;
    },
    PathParamsContext: function() {
        return PathParamsContext;
    },
    PathnameContext: function() {
        return PathnameContext;
    },
    ReadonlyURLSearchParams: function() {
        return _readonlyurlsearchparams.ReadonlyURLSearchParams;
    },
    SearchParamsContext: function() {
        return SearchParamsContext;
    },
    createDevToolsInstrumentedPromise: function() {
        return createDevToolsInstrumentedPromise;
    }
});
const _react = __turbopack_context__.r(1788);
const _readonlyurlsearchparams = __turbopack_context__.r(1430);
const SearchParamsContext = (0, _react.createContext)(null);
const PathnameContext = (0, _react.createContext)(null);
const PathParamsContext = (0, _react.createContext)(null);
const NavigationPromisesContext = (0, _react.createContext)(null);
function createDevToolsInstrumentedPromise(displayName, value) {
    const promise = Promise.resolve(value);
    promise.status = 'fulfilled';
    promise.value = value;
    promise.displayName = `${displayName} (SSR)`;
    return promise;
}
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
}),
6717, ((__turbopack_context__, module, exports) => {
"use strict";

// Convert router.asPath to a URLSearchParams object
// example: /dynamic/[slug]?foo=bar -> { foo: 'bar' }
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "asPathToSearchParams", {
    enumerable: true,
    get: function() {
        return asPathToSearchParams;
    }
});
function asPathToSearchParams(asPath) {
    return new URL(asPath, 'http://n').searchParams;
}
}),
8126, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    PathnameContextProviderAdapter: null,
    adaptForAppRouterInstance: null,
    adaptForPathParams: null,
    adaptForSearchParams: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    PathnameContextProviderAdapter: function() {
        return PathnameContextProviderAdapter;
    },
    adaptForAppRouterInstance: function() {
        return adaptForAppRouterInstance;
    },
    adaptForPathParams: function() {
        return adaptForPathParams;
    },
    adaptForSearchParams: function() {
        return adaptForSearchParams;
    }
});
const _interop_require_wildcard = __turbopack_context__.r(2456);
const _jsxruntime = __turbopack_context__.r(1398);
const _react = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r(1788));
const _hooksclientcontextsharedruntime = __turbopack_context__.r(8);
const _utils = __turbopack_context__.r(1235);
const _aspathtosearchparams = __turbopack_context__.r(6717);
const _routeregex = __turbopack_context__.r(4599);
function adaptForAppRouterInstance(pagesRouter) {
    return {
        back () {
            pagesRouter.back();
        },
        forward () {
            pagesRouter.forward();
        },
        refresh () {
            pagesRouter.reload();
        },
        hmrRefresh () {},
        push (href, { scroll } = {}) {
            void pagesRouter.push(href, undefined, {
                scroll
            });
        },
        replace (href, { scroll } = {}) {
            void pagesRouter.replace(href, undefined, {
                scroll
            });
        },
        prefetch (href) {
            void pagesRouter.prefetch(href);
        },
        // The bfcacheId concept is App Router-only. Surfaced as a stable
        // placeholder so consumers using this adapter don't crash.
        bfcacheId: '0'
    };
}
function adaptForSearchParams(router) {
    if (!router.isReady || !router.query) {
        return new URLSearchParams();
    }
    return (0, _aspathtosearchparams.asPathToSearchParams)(router.asPath);
}
function adaptForPathParams(router) {
    if (!router.isReady || !router.query) {
        return null;
    }
    const pathParams = {};
    const routeRegex = (0, _routeregex.getRouteRegex)(router.pathname);
    const keys = Object.keys(routeRegex.groups);
    for (const key of keys){
        pathParams[key] = router.query[key];
    }
    return pathParams;
}
function PathnameContextProviderAdapter({ children, router, ...props }) {
    const ref = (0, _react.useRef)(props.isAutoExport);
    const value = (0, _react.useMemo)(()=>{
        // isAutoExport is only ever `true` on the first render from the server,
        // so reset it to `false` after we read it for the first time as `true`. If
        // we don't use the value, then we don't need it.
        const isAutoExport = ref.current;
        if (isAutoExport) {
            ref.current = false;
        }
        // When the route is a dynamic route, we need to do more processing to
        // determine if we need to stop showing the pathname.
        if ((0, _utils.isDynamicRoute)(router.pathname)) {
            // When the router is rendering the fallback page, it can't possibly know
            // the path, so return `null` here. Read more about fallback pages over
            // at:
            // https://nextjs.org/docs/api-reference/data-fetching/get-static-paths#fallback-pages
            if (router.isFallback) {
                return null;
            }
            // When `isAutoExport` is true, meaning this is a page page has been
            // automatically statically optimized, and the router is not ready, then
            // we can't know the pathname yet. Read more about automatic static
            // optimization at:
            // https://nextjs.org/docs/advanced-features/automatic-static-optimization
            if (isAutoExport && !router.isReady) {
                return null;
            }
        }
        // The `router.asPath` contains the pathname seen by the browser (including
        // any query strings), so it should have that stripped. Read more about the
        // `asPath` option over at:
        // https://nextjs.org/docs/api-reference/next/router#router-object
        let url;
        try {
            url = new URL(router.asPath, 'http://f');
        } catch (_) {
            // fallback to / for invalid asPath values e.g. //
            return '/';
        }
        return url.pathname;
    }, [
        router.asPath,
        router.isFallback,
        router.isReady,
        router.pathname
    ]);
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(_hooksclientcontextsharedruntime.PathnameContext.Provider, {
        value: value,
        children: children
    });
}
}),
4760, ((__turbopack_context__, module, exports) => {
"use strict";

// This has to be a shared module which is shared between client component error boundary and dynamic component
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    BailoutToCSRError: null,
    isBailoutToCSRError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    BailoutToCSRError: function() {
        return BailoutToCSRError;
    },
    isBailoutToCSRError: function() {
        return isBailoutToCSRError;
    }
});
const BAILOUT_TO_CSR = 'BAILOUT_TO_CLIENT_SIDE_RENDERING';
class BailoutToCSRError extends Error {
    constructor(reason){
        super(`Bail out to client-side rendering: ${reason}`), this.reason = reason, this.digest = BAILOUT_TO_CSR;
    }
}
function isBailoutToCSRError(err) {
    if (typeof err !== 'object' || err === null || !('digest' in err)) {
        return false;
    }
    return err.digest === BAILOUT_TO_CSR;
}
}),
5288, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "reportGlobalError", {
    enumerable: true,
    get: function() {
        return reportGlobalError;
    }
});
const reportGlobalError = typeof reportError === 'function' ? reportError : (error)=>{
    // TODO: Dispatch error event
    globalThis.console.error(error);
};
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
5290, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
// This module can be shared between both pages router and app router
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    isRecoverableError: null,
    onRecoverableError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    isRecoverableError: function() {
        return isRecoverableError;
    },
    onRecoverableError: function() {
        return onRecoverableError;
    }
});
const _interop_require_default = __turbopack_context__.r(1705);
const _bailouttocsr = __turbopack_context__.r(4760);
const _iserror = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r(3910));
const _reportglobalerror = __turbopack_context__.r(5288);
const recoverableErrors = new WeakSet();
const isInstantTest = ("TURBOPACK compile-time value", false) && typeof self !== 'undefined' && !!self.__next_instant_test;
function isRecoverableError(error) {
    return recoverableErrors.has(error);
}
const onRecoverableError = (error)=>{
    // x-ref: https://github.com/facebook/react/pull/28736
    let cause = (0, _iserror.default)(error) && 'cause' in error ? error.cause : error;
    // Skip certain custom errors which are not expected to be reported on client
    if ((0, _bailouttocsr.isBailoutToCSRError)(cause)) return;
    // Instant Navigation Testing API: suppress "server could not finish this
    // Suspense boundary" errors (React error #419) during instant test mode.
    // The static shell intentionally has incomplete Suspense boundaries — React
    // correctly falls back to client rendering, which is expected.
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    (0, _reportglobalerror.reportGlobalError)(cause);
};
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
9651, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _interop_require_default = __turbopack_context__.r(1705);
const _mitt = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r(7194));
class Span {
    constructor(name, options, onSpanEnd){
        this.name = name;
        this.attributes = options.attributes ?? {};
        this.startTime = options.startTime ?? Date.now();
        this.onSpanEnd = onSpanEnd;
        this.state = {
            state: 'inprogress'
        };
    }
    end(endTime) {
        if (this.state.state === 'ended') {
            throw Object.defineProperty(new Error('Span has already ended'), "__NEXT_ERROR_CODE", {
                value: "E17",
                enumerable: false,
                configurable: true
            });
        }
        this.state = {
            state: 'ended',
            endTime: endTime ?? Date.now()
        };
        this.onSpanEnd(this);
    }
}
class Tracer {
    startSpan(name, options) {
        return new Span(name, options, this.handleSpanEnd);
    }
    onSpanEnd(cb) {
        this._emitter.on('spanend', cb);
        return ()=>{
            this._emitter.off('spanend', cb);
        };
    }
    constructor(){
        this._emitter = (0, _mitt.default)();
        this.handleSpanEnd = (span)=>{
            this._emitter.emit('spanend', span);
        };
    }
}
const _default = new Tracer();
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
1622, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    HTTPAccessErrorStatus: null,
    HTTP_ERROR_FALLBACK_ERROR_CODE: null,
    getAccessFallbackErrorTypeByStatus: null,
    getAccessFallbackHTTPStatus: null,
    isHTTPAccessFallbackError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    HTTPAccessErrorStatus: function() {
        return HTTPAccessErrorStatus;
    },
    HTTP_ERROR_FALLBACK_ERROR_CODE: function() {
        return HTTP_ERROR_FALLBACK_ERROR_CODE;
    },
    getAccessFallbackErrorTypeByStatus: function() {
        return getAccessFallbackErrorTypeByStatus;
    },
    getAccessFallbackHTTPStatus: function() {
        return getAccessFallbackHTTPStatus;
    },
    isHTTPAccessFallbackError: function() {
        return isHTTPAccessFallbackError;
    }
});
const HTTPAccessErrorStatus = {
    NOT_FOUND: 404,
    FORBIDDEN: 403,
    UNAUTHORIZED: 401
};
const ALLOWED_CODES = new Set(Object.values(HTTPAccessErrorStatus));
const HTTP_ERROR_FALLBACK_ERROR_CODE = 'NEXT_HTTP_ERROR_FALLBACK';
function isHTTPAccessFallbackError(error) {
    if (typeof error !== 'object' || error === null || !('digest' in error) || typeof error.digest !== 'string') {
        return false;
    }
    const [prefix, httpStatus] = error.digest.split(';');
    return prefix === HTTP_ERROR_FALLBACK_ERROR_CODE && ALLOWED_CODES.has(Number(httpStatus));
}
function getAccessFallbackHTTPStatus(error) {
    const httpStatus = error.digest.split(';')[1];
    return Number(httpStatus);
}
function getAccessFallbackErrorTypeByStatus(status) {
    switch(status){
        case 401:
            return 'unauthorized';
        case 403:
            return 'forbidden';
        case 404:
            return 'not-found';
        default:
            return;
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
207, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RedirectStatusCode", {
    enumerable: true,
    get: function() {
        return RedirectStatusCode;
    }
});
var RedirectStatusCode = /*#__PURE__*/ function(RedirectStatusCode) {
    RedirectStatusCode[RedirectStatusCode["SeeOther"] = 303] = "SeeOther";
    RedirectStatusCode[RedirectStatusCode["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    RedirectStatusCode[RedirectStatusCode["PermanentRedirect"] = 308] = "PermanentRedirect";
    return RedirectStatusCode;
}({});
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
1939, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    REDIRECT_ERROR_CODE: null,
    isRedirectError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    REDIRECT_ERROR_CODE: function() {
        return REDIRECT_ERROR_CODE;
    },
    isRedirectError: function() {
        return isRedirectError;
    }
});
const _redirectstatuscode = __turbopack_context__.r(207);
const REDIRECT_ERROR_CODE = 'NEXT_REDIRECT';
function isRedirectError(error) {
    if (typeof error !== 'object' || error === null || !('digest' in error) || typeof error.digest !== 'string') {
        return false;
    }
    const digest = error.digest.split(';');
    const [errorCode, type] = digest;
    const destination = digest.slice(2, -2).join(';');
    const status = digest.at(-2);
    const statusCode = Number(status);
    return errorCode === REDIRECT_ERROR_CODE && (type === 'replace' || type === 'push') && typeof destination === 'string' && !isNaN(statusCode) && statusCode in _redirectstatuscode.RedirectStatusCode;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
8934, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isNextRouterError", {
    enumerable: true,
    get: function() {
        return isNextRouterError;
    }
});
const _httpaccessfallback = __turbopack_context__.r(1622);
const _redirecterror = __turbopack_context__.r(1939);
function isNextRouterError(error) {
    return (0, _redirecterror.isRedirectError)(error) || (0, _httpaccessfallback.isHTTPAccessFallbackError)(error);
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
7194, ((__turbopack_context__, module, exports) => {
"use strict";

/*
MIT License

Copyright (c) Jason Miller (https://jasonformat.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/ // This file is based on https://github.com/developit/mitt/blob/v1.1.3/src/index.js
// It's been edited for the needs of this script
// See the LICENSE at the top of the file
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return mitt;
    }
});
function mitt() {
    const all = Object.create(null);
    return {
        on (type, handler) {
            ;
            (all[type] || (all[type] = [])).push(handler);
        },
        off (type, handler) {
            if (all[type]) {
                all[type].splice(all[type].indexOf(handler) >>> 0, 1);
            }
        },
        emit (type, ...evts) {
            // eslint-disable-next-line array-callback-return
            ;
            (all[type] || []).slice().map((handler)=>{
                handler(...evts);
            });
        }
    };
}
}),
5479, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RouterContext", {
    enumerable: true,
    get: function() {
        return RouterContext;
    }
});
const _interop_require_default = __turbopack_context__.r(1705);
const _react = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r(1788));
const RouterContext = _react.default.createContext(null);
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
}),
1280, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
/**
 * Run function with `scroll-behavior: auto` applied to `<html/>`.
 * This css change will be reverted after the function finishes.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "disableSmoothScrollDuringRouteTransition", {
    enumerable: true,
    get: function() {
        return disableSmoothScrollDuringRouteTransition;
    }
});
function disableSmoothScrollDuringRouteTransition(fn, options = {}) {
    // if only the hash is changed, we don't need to disable smooth scrolling
    // we only care to prevent smooth scrolling when navigating to a new page to avoid jarring UX
    if (options.onlyHashChange) {
        fn();
        return;
    }
    const htmlElement = document.documentElement;
    const hasDataAttribute = htmlElement.dataset.scrollBehavior === 'smooth';
    if (!hasDataAttribute) {
        // Warn if smooth scrolling is detected but no data attribute is present
        if (("TURBOPACK compile-time value", "production") === 'development' && getComputedStyle(htmlElement).scrollBehavior === 'smooth') //TURBOPACK unreachable
        ;
        // No smooth scrolling configured, run directly without style manipulation
        fn();
        return;
    }
    // Proceed with temporarily disabling smooth scrolling
    const existing = htmlElement.style.scrollBehavior;
    htmlElement.style.scrollBehavior = 'auto';
    if (!options.dontForceLayout) {
        // In Chrome-based browsers we need to force reflow before calling `scrollTo`.
        // Otherwise it will not pickup the change in scrollBehavior
        // More info here: https://github.com/vercel/next.js/issues/40719#issuecomment-1336248042
        htmlElement.getClientRects();
    }
    fn();
    htmlElement.style.scrollBehavior = existing;
}
}),
1569, ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * For a given page path, this function ensures that there is a leading slash.
 * If there is not a leading slash, one is added, otherwise it is noop.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ensureLeadingSlash", {
    enumerable: true,
    get: function() {
        return ensureLeadingSlash;
    }
});
function ensureLeadingSlash(path) {
    return path.startsWith('/') ? path : `/${path}`;
}
}),
7915, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    DEFAULT_SEGMENT_KEY: null,
    NOT_FOUND_SEGMENT_KEY: null,
    PAGE_SEGMENT_KEY: null,
    addSearchParamsIfPageSegment: null,
    computeSelectedLayoutSegment: null,
    getSegmentValue: null,
    getSelectedLayoutSegmentPath: null,
    isGroupSegment: null,
    isParallelRouteSegment: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    DEFAULT_SEGMENT_KEY: function() {
        return DEFAULT_SEGMENT_KEY;
    },
    NOT_FOUND_SEGMENT_KEY: function() {
        return NOT_FOUND_SEGMENT_KEY;
    },
    PAGE_SEGMENT_KEY: function() {
        return PAGE_SEGMENT_KEY;
    },
    addSearchParamsIfPageSegment: function() {
        return addSearchParamsIfPageSegment;
    },
    computeSelectedLayoutSegment: function() {
        return computeSelectedLayoutSegment;
    },
    getSegmentValue: function() {
        return getSegmentValue;
    },
    getSelectedLayoutSegmentPath: function() {
        return getSelectedLayoutSegmentPath;
    },
    isGroupSegment: function() {
        return isGroupSegment;
    },
    isParallelRouteSegment: function() {
        return isParallelRouteSegment;
    }
});
function getSegmentValue(segment) {
    return Array.isArray(segment) ? segment[1] : segment;
}
function isGroupSegment(segment) {
    // Use array[0] for performant purpose
    return segment[0] === '(' && segment.endsWith(')');
}
function isParallelRouteSegment(segment) {
    return segment.startsWith('@') && segment !== '@children';
}
function addSearchParamsIfPageSegment(segment, searchParams) {
    const isPageSegment = segment.includes(PAGE_SEGMENT_KEY);
    if (isPageSegment) {
        const stringifiedQuery = JSON.stringify(searchParams);
        return stringifiedQuery !== '{}' ? PAGE_SEGMENT_KEY + '?' + stringifiedQuery : PAGE_SEGMENT_KEY;
    }
    return segment;
}
function computeSelectedLayoutSegment(segments, parallelRouteKey) {
    if (!segments || segments.length === 0) {
        return null;
    }
    // For 'children', use first segment; for other parallel routes, use last segment
    const rawSegment = parallelRouteKey === 'children' ? segments[0] : segments[segments.length - 1];
    // If the default slot is showing, return null since it's not technically "selected" (it's a fallback)
    // Returning an internal value like `__DEFAULT__` would be confusing
    return rawSegment === DEFAULT_SEGMENT_KEY ? null : rawSegment;
}
function getSelectedLayoutSegmentPath(tree, parallelRouteKey, first = true, segmentPath = []) {
    let node;
    if (first) {
        // Use the provided parallel route key on the first parallel route
        node = tree[1][parallelRouteKey];
    } else {
        // After first parallel route prefer children, if there's no children pick the first parallel route.
        const parallelRoutes = tree[1];
        node = parallelRoutes.children ?? Object.values(parallelRoutes)[0];
    }
    if (!node) return segmentPath;
    const segment = node[0];
    let segmentValue = getSegmentValue(segment);
    if (!segmentValue || segmentValue.startsWith(PAGE_SEGMENT_KEY)) {
        return segmentPath;
    }
    segmentPath.push(segmentValue);
    return getSelectedLayoutSegmentPath(node, parallelRouteKey, false, segmentPath);
}
const PAGE_SEGMENT_KEY = '__PAGE__';
const DEFAULT_SEGMENT_KEY = '__DEFAULT__';
const NOT_FOUND_SEGMENT_KEY = '/_not-found';
}),
6159, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    compareAppPaths: null,
    normalizeAppPath: null,
    normalizeRscURL: null,
    selectAppPageEntry: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    compareAppPaths: function() {
        return compareAppPaths;
    },
    normalizeAppPath: function() {
        return normalizeAppPath;
    },
    normalizeRscURL: function() {
        return normalizeRscURL;
    },
    selectAppPageEntry: function() {
        return selectAppPageEntry;
    }
});
const _ensureleadingslash = __turbopack_context__.r(1569);
const _segment = __turbopack_context__.r(7915);
function normalizeAppPath(route) {
    return (0, _ensureleadingslash.ensureLeadingSlash)(route.split('/').reduce((pathname, segment, index, segments)=>{
        // Empty segments are ignored.
        if (!segment) {
            return pathname;
        }
        // Groups are ignored.
        if ((0, _segment.isGroupSegment)(segment)) {
            return pathname;
        }
        // Parallel segments are ignored.
        if (segment[0] === '@') {
            return pathname;
        }
        // The last segment (if it's a leaf) should be ignored.
        if ((segment === 'page' || segment === 'route') && index === segments.length - 1) {
            return pathname;
        }
        return `${pathname}/${segment}`;
    }, ''));
}
function compareAppPaths(a, b) {
    const aHasSlot = a.includes('/@');
    const bHasSlot = b.includes('/@');
    if (aHasSlot && !bHasSlot) return -1;
    if (!aHasSlot && bHasSlot) return 1;
    return a.localeCompare(b);
}
function selectAppPageEntry(pathname, appPaths, normalizePathname = (appPath)=>normalizeAppPath(appPath).replace(/%5F/g, '_')) {
    let entry;
    for (const appPath of appPaths){
        if (normalizePathname(appPath) !== pathname) continue;
        if (entry === undefined || compareAppPaths(entry, appPath) < 0) {
            entry = appPath;
        }
    }
    if (entry === undefined) {
        throw new Error(`Invariant: no direct app page entry found for ${pathname}`);
    }
    return entry;
}
function normalizeRscURL(url) {
    return url.replace(/\.rsc($|\?)/, '$1');
}
}),
9161, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    INTERCEPTION_ROUTE_MARKERS: null,
    extractInterceptionRouteInformation: null,
    isInterceptionRouteAppPath: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    INTERCEPTION_ROUTE_MARKERS: function() {
        return INTERCEPTION_ROUTE_MARKERS;
    },
    extractInterceptionRouteInformation: function() {
        return extractInterceptionRouteInformation;
    },
    isInterceptionRouteAppPath: function() {
        return isInterceptionRouteAppPath;
    }
});
const _apppaths = __turbopack_context__.r(6159);
const INTERCEPTION_ROUTE_MARKERS = [
    '(..)(..)',
    '(.)',
    '(..)',
    '(...)'
];
function isInterceptionRouteAppPath(path) {
    // TODO-APP: add more serious validation
    return path.split('/').find((segment)=>INTERCEPTION_ROUTE_MARKERS.find((m)=>segment.startsWith(m))) !== undefined;
}
function extractInterceptionRouteInformation(path) {
    let interceptingRoute;
    let marker;
    let interceptedRoute;
    for (const segment of path.split('/')){
        marker = INTERCEPTION_ROUTE_MARKERS.find((m)=>segment.startsWith(m));
        if (marker) {
            ;
            [interceptingRoute, interceptedRoute] = path.split(marker, 2);
            break;
        }
    }
    if (!interceptingRoute || !marker || !interceptedRoute) {
        throw Object.defineProperty(new Error(`Invalid interception route: ${path}. Must be in the format /<intercepting route>/(..|...|..)(..)/<intercepted route>`), "__NEXT_ERROR_CODE", {
            value: "E269",
            enumerable: false,
            configurable: true
        });
    }
    interceptingRoute = (0, _apppaths.normalizeAppPath)(interceptingRoute) // normalize the path, e.g. /(blog)/feed -> /feed
    ;
    switch(marker){
        case '(.)':
            // (.) indicates that we should match with sibling routes, so we just need to append the intercepted route to the intercepting route
            if (interceptingRoute === '/') {
                interceptedRoute = `/${interceptedRoute}`;
            } else {
                interceptedRoute = interceptingRoute + '/' + interceptedRoute;
            }
            break;
        case '(..)':
            // (..) indicates that we should match at one level up, so we need to remove the last segment of the intercepting route
            if (interceptingRoute === '/') {
                throw Object.defineProperty(new Error(`Invalid interception route: ${path}. Cannot use (..) marker at the root level, use (.) instead.`), "__NEXT_ERROR_CODE", {
                    value: "E207",
                    enumerable: false,
                    configurable: true
                });
            }
            interceptedRoute = interceptingRoute.split('/').slice(0, -1).concat(interceptedRoute).join('/');
            break;
        case '(...)':
            // (...) will match the route segment in the root directory, so we need to use the root directory to prepend the intercepted route
            interceptedRoute = '/' + interceptedRoute;
            break;
        case '(..)(..)':
            // (..)(..) indicates that we should match at two levels up, so we need to remove the last two segments of the intercepting route
            const splitInterceptingRoute = interceptingRoute.split('/');
            if (splitInterceptingRoute.length <= 2) {
                throw Object.defineProperty(new Error(`Invalid interception route: ${path}. Cannot use (..)(..) marker at the root level or one level up.`), "__NEXT_ERROR_CODE", {
                    value: "E486",
                    enumerable: false,
                    configurable: true
                });
            }
            interceptedRoute = splitInterceptingRoute.slice(0, -2).concat(interceptedRoute).join('/');
            break;
        default:
            throw Object.defineProperty(new Error('Invariant: unexpected marker'), "__NEXT_ERROR_CODE", {
                value: "E112",
                enumerable: false,
                configurable: true
            });
    }
    return {
        interceptingRoute,
        interceptedRoute
    };
}
}),
8690, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isDynamicRoute", {
    enumerable: true,
    get: function() {
        return isDynamicRoute;
    }
});
const _interceptionroutes = __turbopack_context__.r(9161);
// Identify /.*[param].*/ in route string
const TEST_ROUTE = /\/[^/]*\[[^/]+\][^/]*(?=\/|$)/;
// Identify /[param]/ in route string
const TEST_STRICT_ROUTE = /\/\[[^/]+\](?=\/|$)/;
function isDynamicRoute(route, strict = true) {
    if ((0, _interceptionroutes.isInterceptionRouteAppPath)(route)) {
        route = (0, _interceptionroutes.extractInterceptionRouteInformation)(route).interceptedRoute;
    }
    if (strict) {
        return TEST_STRICT_ROUTE.test(route);
    }
    return TEST_ROUTE.test(route);
}
}),
8928, ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    assign: null,
    searchParamsToUrlQuery: null,
    urlQueryToSearchParams: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    assign: function() {
        return assign;
    },
    searchParamsToUrlQuery: function() {
        return searchParamsToUrlQuery;
    },
    urlQueryToSearchParams: function() {
        return urlQueryToSearchParams;
    }
});
function searchParamsToUrlQuery(searchParams) {
    const query = {};
    for (const [key, value] of searchParams.entries()){
        const existing = query[key];
        if (typeof existing === 'undefined') {
            query[key] = value;
        } else if (Array.isArray(existing)) {
            existing.push(value);
        } else {
            query[key] = [
                existing,
                value
            ];
        }
    }
    return query;
}
function stringifyUrlQueryParam(param) {
    if (typeof param === 'string') {
        return param;
    }
    if (typeof param === 'number' && !isNaN(param) || typeof param === 'boolean') {
        return String(param);
    } else {
        return '';
    }
}
function urlQueryToSearchParams(query) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query)){
        if (Array.isArray(value)) {
            for (const item of value){
                searchParams.append(key, stringifyUrlQueryParam(item));
            }
        } else {
            searchParams.set(key, stringifyUrlQueryParam(value));
        }
    }
    return searchParams;
}
function assign(target, ...searchParamsList) {
    for (const searchParams of searchParamsList){
        for (const key of searchParams.keys()){
            target.delete(key);
        }
        for (const [key, value] of searchParams.entries()){
            target.append(key, value);
        }
    }
    return target;
}
}),
1829, ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ function push(heap, node) {
    var index = heap.length;
    heap.push(node);
    a: for(; 0 < index;){
        var parentIndex = index - 1 >>> 1, parent = heap[parentIndex];
        if (0 < compare(parent, node)) heap[parentIndex] = node, heap[index] = parent, index = parentIndex;
        else break a;
    }
}
function peek(heap) {
    return 0 === heap.length ? null : heap[0];
}
function pop(heap) {
    if (0 === heap.length) return null;
    var first = heap[0], last = heap.pop();
    if (last !== first) {
        heap[0] = last;
        a: for(var index = 0, length = heap.length, halfLength = length >>> 1; index < halfLength;){
            var leftIndex = 2 * (index + 1) - 1, left = heap[leftIndex], rightIndex = leftIndex + 1, right = heap[rightIndex];
            if (0 > compare(left, last)) rightIndex < length && 0 > compare(right, left) ? (heap[index] = right, heap[rightIndex] = last, index = rightIndex) : (heap[index] = left, heap[leftIndex] = last, index = leftIndex);
            else if (rightIndex < length && 0 > compare(right, last)) heap[index] = right, heap[rightIndex] = last, index = rightIndex;
            else break a;
        }
    }
    return first;
}
function compare(a, b) {
    var diff = a.sortIndex - b.sortIndex;
    return 0 !== diff ? diff : a.id - b.id;
}
exports.unstable_now = void 0;
if ("object" === typeof performance && "function" === typeof performance.now) {
    var localPerformance = performance;
    exports.unstable_now = function() {
        return localPerformance.now();
    };
} else {
    var localDate = Date, initialTime = localDate.now();
    exports.unstable_now = function() {
        return localDate.now() - initialTime;
    };
}
var taskQueue = [], timerQueue = [], taskIdCounter = 1, currentTask = null, currentPriorityLevel = 3, isPerformingWork = !1, isHostCallbackScheduled = !1, isHostTimeoutScheduled = !1, needsPaint = !1, localSetTimeout = "function" === typeof setTimeout ? setTimeout : null, localClearTimeout = "function" === typeof clearTimeout ? clearTimeout : null, localSetImmediate = "undefined" !== typeof setImmediate ? setImmediate : null;
function advanceTimers(currentTime) {
    for(var timer = peek(timerQueue); null !== timer;){
        if (null === timer.callback) pop(timerQueue);
        else if (timer.startTime <= currentTime) pop(timerQueue), timer.sortIndex = timer.expirationTime, push(taskQueue, timer);
        else break;
        timer = peek(timerQueue);
    }
}
function handleTimeout(currentTime) {
    isHostTimeoutScheduled = !1;
    advanceTimers(currentTime);
    if (!isHostCallbackScheduled) if (null !== peek(taskQueue)) isHostCallbackScheduled = !0, isMessageLoopRunning || (isMessageLoopRunning = !0, schedulePerformWorkUntilDeadline());
    else {
        var firstTimer = peek(timerQueue);
        null !== firstTimer && requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
    }
}
var isMessageLoopRunning = !1, taskTimeoutID = -1, frameInterval = 5, startTime = -1;
function shouldYieldToHost() {
    return needsPaint ? !0 : exports.unstable_now() - startTime < frameInterval ? !1 : !0;
}
function performWorkUntilDeadline() {
    needsPaint = !1;
    if (isMessageLoopRunning) {
        var currentTime = exports.unstable_now();
        startTime = currentTime;
        var hasMoreWork = !0;
        try {
            a: {
                isHostCallbackScheduled = !1;
                isHostTimeoutScheduled && (isHostTimeoutScheduled = !1, localClearTimeout(taskTimeoutID), taskTimeoutID = -1);
                isPerformingWork = !0;
                var previousPriorityLevel = currentPriorityLevel;
                try {
                    b: {
                        advanceTimers(currentTime);
                        for(currentTask = peek(taskQueue); null !== currentTask && !(currentTask.expirationTime > currentTime && shouldYieldToHost());){
                            var callback = currentTask.callback;
                            if ("function" === typeof callback) {
                                currentTask.callback = null;
                                currentPriorityLevel = currentTask.priorityLevel;
                                var continuationCallback = callback(currentTask.expirationTime <= currentTime);
                                currentTime = exports.unstable_now();
                                if ("function" === typeof continuationCallback) {
                                    currentTask.callback = continuationCallback;
                                    advanceTimers(currentTime);
                                    hasMoreWork = !0;
                                    break b;
                                }
                                currentTask === peek(taskQueue) && pop(taskQueue);
                                advanceTimers(currentTime);
                            } else pop(taskQueue);
                            currentTask = peek(taskQueue);
                        }
                        if (null !== currentTask) hasMoreWork = !0;
                        else {
                            var firstTimer = peek(timerQueue);
                            null !== firstTimer && requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
                            hasMoreWork = !1;
                        }
                    }
                    break a;
                } finally{
                    currentTask = null, currentPriorityLevel = previousPriorityLevel, isPerformingWork = !1;
                }
                hasMoreWork = void 0;
            }
        } finally{
            hasMoreWork ? schedulePerformWorkUntilDeadline() : isMessageLoopRunning = !1;
        }
    }
}
var schedulePerformWorkUntilDeadline;
if ("function" === typeof localSetImmediate) schedulePerformWorkUntilDeadline = function() {
    localSetImmediate(performWorkUntilDeadline);
};
else if ("undefined" !== typeof MessageChannel) {
    var channel = new MessageChannel(), port = channel.port2;
    channel.port1.onmessage = performWorkUntilDeadline;
    schedulePerformWorkUntilDeadline = function() {
        port.postMessage(null);
    };
} else schedulePerformWorkUntilDeadline = function() {
    localSetTimeout(performWorkUntilDeadline, 0);
};
function requestHostTimeout(callback, ms) {
    taskTimeoutID = localSetTimeout(function() {
        callback(exports.unstable_now());
    }, ms);
}
exports.unstable_IdlePriority = 5;
exports.unstable_ImmediatePriority = 1;
exports.unstable_LowPriority = 4;
exports.unstable_NormalPriority = 3;
exports.unstable_Profiling = null;
exports.unstable_UserBlockingPriority = 2;
exports.unstable_cancelCallback = function(task) {
    task.callback = null;
};
exports.unstable_forceFrameRate = function(fps) {
    0 > fps || 125 < fps ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : frameInterval = 0 < fps ? Math.floor(1e3 / fps) : 5;
};
exports.unstable_getCurrentPriorityLevel = function() {
    return currentPriorityLevel;
};
exports.unstable_next = function(eventHandler) {
    switch(currentPriorityLevel){
        case 1:
        case 2:
        case 3:
            var priorityLevel = 3;
            break;
        default:
            priorityLevel = currentPriorityLevel;
    }
    var previousPriorityLevel = currentPriorityLevel;
    currentPriorityLevel = priorityLevel;
    try {
        return eventHandler();
    } finally{
        currentPriorityLevel = previousPriorityLevel;
    }
};
exports.unstable_requestPaint = function() {
    needsPaint = !0;
};
exports.unstable_runWithPriority = function(priorityLevel, eventHandler) {
    switch(priorityLevel){
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            break;
        default:
            priorityLevel = 3;
    }
    var previousPriorityLevel = currentPriorityLevel;
    currentPriorityLevel = priorityLevel;
    try {
        return eventHandler();
    } finally{
        currentPriorityLevel = previousPriorityLevel;
    }
};
exports.unstable_scheduleCallback = function(priorityLevel, callback, options) {
    var currentTime = exports.unstable_now();
    "object" === typeof options && null !== options ? (options = options.delay, options = "number" === typeof options && 0 < options ? currentTime + options : currentTime) : options = currentTime;
    switch(priorityLevel){
        case 1:
            var timeout = -1;
            break;
        case 2:
            timeout = 250;
            break;
        case 5:
            timeout = 1073741823;
            break;
        case 4:
            timeout = 1e4;
            break;
        default:
            timeout = 5e3;
    }
    timeout = options + timeout;
    priorityLevel = {
        id: taskIdCounter++,
        callback: callback,
        priorityLevel: priorityLevel,
        startTime: options,
        expirationTime: timeout,
        sortIndex: -1
    };
    options > currentTime ? (priorityLevel.sortIndex = options, push(timerQueue, priorityLevel), null === peek(taskQueue) && priorityLevel === peek(timerQueue) && (isHostTimeoutScheduled ? (localClearTimeout(taskTimeoutID), taskTimeoutID = -1) : isHostTimeoutScheduled = !0, requestHostTimeout(handleTimeout, options - currentTime))) : (priorityLevel.sortIndex = timeout, push(taskQueue, priorityLevel), isHostCallbackScheduled || isPerformingWork || (isHostCallbackScheduled = !0, isMessageLoopRunning || (isMessageLoopRunning = !0, schedulePerformWorkUntilDeadline())));
    return priorityLevel;
};
exports.unstable_shouldYield = shouldYieldToHost;
exports.unstable_wrapCallback = function(callback) {
    var parentPriorityLevel = currentPriorityLevel;
    return function() {
        var previousPriorityLevel = currentPriorityLevel;
        currentPriorityLevel = parentPriorityLevel;
        try {
            return callback.apply(this, arguments);
        } finally{
            currentPriorityLevel = previousPriorityLevel;
        }
    };
};
}),
2659, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
'use strict';
if ("TURBOPACK compile-time truthy", 1) {
    module.exports = __turbopack_context__.r(1829);
} else //TURBOPACK unreachable
;
}),
7431, ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var React = __turbopack_context__.r(1788);
function formatProdErrorMessage(code) {
    var url = "https://react.dev/errors/" + code;
    if (1 < arguments.length) {
        url += "?args[]=" + encodeURIComponent(arguments[1]);
        for(var i = 2; i < arguments.length; i++)url += "&args[]=" + encodeURIComponent(arguments[i]);
    }
    return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
function noop() {}
var Internals = {
    d: {
        f: noop,
        r: function() {
            throw Error(formatProdErrorMessage(522));
        },
        D: noop,
        C: noop,
        L: noop,
        m: noop,
        X: noop,
        S: noop,
        M: noop
    },
    p: 0,
    findDOMNode: null
}, REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_RECOVERABLE_TYPE = Symbol.for("react.recoverable"), REACT_OPTIMISTIC_KEY = Symbol.for("react.optimistic_key");
function createPortal$1(children, containerInfo, implementation) {
    var key = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
    return {
        $$typeof: REACT_PORTAL_TYPE,
        key: null == key ? null : key === REACT_OPTIMISTIC_KEY ? REACT_OPTIMISTIC_KEY : "" + key,
        children: children,
        containerInfo: containerInfo,
        implementation: implementation
    };
}
var ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
function getCrossOriginStringAs(as, input) {
    if ("font" === as) return "";
    if ("string" === typeof input) return "use-credentials" === input ? input : "";
}
exports.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Internals;
exports.browser = function(reason) {
    return {
        $$typeof: REACT_RECOVERABLE_TYPE,
        _reason: reason
    };
};
exports.createPortal = function(children, container) {
    var key = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
    if (!container || 1 !== container.nodeType && 9 !== container.nodeType && 11 !== container.nodeType) throw Error(formatProdErrorMessage(299));
    return createPortal$1(children, container, null, key);
};
exports.flushSync = function(fn) {
    var previousTransition = ReactSharedInternals.T, previousUpdatePriority = Internals.p;
    try {
        if (ReactSharedInternals.T = null, Internals.p = 2, fn) return fn();
    } finally{
        ReactSharedInternals.T = previousTransition, Internals.p = previousUpdatePriority, Internals.d.f();
    }
};
exports.preconnect = function(href, options) {
    "string" === typeof href && (options ? (options = options.crossOrigin, options = "string" === typeof options ? "use-credentials" === options ? options : "" : void 0) : options = null, Internals.d.C(href, options));
};
exports.prefetchDNS = function(href) {
    "string" === typeof href && Internals.d.D(href);
};
exports.preinit = function(href, options) {
    if ("string" === typeof href && options && "string" === typeof options.as) {
        var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin), integrity = "string" === typeof options.integrity ? options.integrity : void 0, fetchPriority = "string" === typeof options.fetchPriority ? options.fetchPriority : void 0;
        "style" === as ? Internals.d.S(href, "string" === typeof options.precedence ? options.precedence : void 0, {
            crossOrigin: crossOrigin,
            integrity: integrity,
            fetchPriority: fetchPriority
        }) : "script" === as && Internals.d.X(href, {
            crossOrigin: crossOrigin,
            integrity: integrity,
            fetchPriority: fetchPriority,
            nonce: "string" === typeof options.nonce ? options.nonce : void 0
        });
    }
};
exports.preinitModule = function(href, options) {
    if ("string" === typeof href) if ("object" === typeof options && null !== options) {
        if (null == options.as || "script" === options.as) {
            var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
            Internals.d.M(href, {
                crossOrigin: crossOrigin,
                integrity: "string" === typeof options.integrity ? options.integrity : void 0,
                nonce: "string" === typeof options.nonce ? options.nonce : void 0,
                fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0
            });
        }
    } else null == options && Internals.d.M(href);
};
exports.preload = function(href, options) {
    if ("string" === typeof href && "object" === typeof options && null !== options && "string" === typeof options.as) {
        var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin);
        Internals.d.L(href, as, {
            crossOrigin: crossOrigin,
            integrity: "string" === typeof options.integrity ? options.integrity : void 0,
            nonce: "string" === typeof options.nonce ? options.nonce : void 0,
            type: "string" === typeof options.type ? options.type : void 0,
            fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0,
            referrerPolicy: "string" === typeof options.referrerPolicy ? options.referrerPolicy : void 0,
            imageSrcSet: "string" === typeof options.imageSrcSet ? options.imageSrcSet : void 0,
            imageSizes: "string" === typeof options.imageSizes ? options.imageSizes : void 0,
            media: "string" === typeof options.media ? options.media : void 0
        });
    }
};
exports.preloadModule = function(href, options) {
    if ("string" === typeof href) if (options) {
        var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
        Internals.d.m(href, {
            as: "string" === typeof options.as && "script" !== options.as ? options.as : void 0,
            crossOrigin: crossOrigin,
            integrity: "string" === typeof options.integrity ? options.integrity : void 0,
            nonce: "string" === typeof options.nonce ? options.nonce : void 0,
            fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0
        });
    } else Internals.d.m(href);
};
exports.requestFormReset = function(form) {
    Internals.d.r(form);
};
exports.unstable_batchedUpdates = function(fn, a) {
    return fn(a);
};
exports.useFormState = function(action, initialState, permalink) {
    return ReactSharedInternals.H.useFormState(action, initialState, permalink);
};
exports.useFormStatus = function() {
    return ReactSharedInternals.H.useHostTransitionStatus();
};
exports.version = "19.3.0";
}),
943, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
'use strict';
function checkDCE() {
    /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */ if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined' || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== 'function') {
        return;
    }
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        // Verify that the code above has been dead code eliminated (DCE'd).
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
    } catch (err) {
        // DevTools shouldn't crash React, no matter what.
        // We should still report in case we break this code.
        console.error(err);
    }
}
if ("TURBOPACK compile-time truthy", 1) {
    // DCE check should happen before ReactDOM bundle executes so that
    // DevTools can report bad minification during injection.
    checkDCE();
    module.exports = __turbopack_context__.r(7431);
} else //TURBOPACK unreachable
;
}),
7647, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ /*
 Modernizr 3.0.0pre (Custom Build) | MIT
*/ "use strict";
var Scheduler = __turbopack_context__.r(2659), React = __turbopack_context__.r(1788), ReactDOM = __turbopack_context__.r(943);
function formatProdErrorMessage(code) {
    var url = "https://react.dev/errors/" + code;
    if (1 < arguments.length) {
        url += "?args[]=" + encodeURIComponent(arguments[1]);
        for(var i = 2; i < arguments.length; i++)url += "&args[]=" + encodeURIComponent(arguments[i]);
    }
    return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
function isValidContainer(node) {
    return !(!node || 1 !== node.nodeType && 9 !== node.nodeType && 11 !== node.nodeType);
}
function getNearestMountedFiber(fiber) {
    for(var node = fiber, nextNode = node; nextNode && !nextNode.alternate;)node = nextNode, 0 !== (node.flags & 4098) && (fiber = node.return), nextNode = node.return;
    for(; node.return;)node = node.return;
    return 3 === node.tag ? fiber : null;
}
function getSuspenseInstanceFromFiber(fiber) {
    if (13 === fiber.tag) {
        var suspenseState = fiber.memoizedState;
        null === suspenseState && (fiber = fiber.alternate, null !== fiber && (suspenseState = fiber.memoizedState));
        if (null !== suspenseState) return suspenseState.dehydrated;
    }
    return null;
}
function getActivityInstanceFromFiber(fiber) {
    if (31 === fiber.tag) {
        var activityState = fiber.memoizedState;
        null === activityState && (fiber = fiber.alternate, null !== fiber && (activityState = fiber.memoizedState));
        if (null !== activityState) return activityState.dehydrated;
    }
    return null;
}
function assertIsMounted(fiber) {
    if (getNearestMountedFiber(fiber) !== fiber) throw Error(formatProdErrorMessage(188));
}
function findCurrentFiberUsingSlowPath(fiber) {
    var alternate = fiber.alternate;
    if (!alternate) {
        alternate = getNearestMountedFiber(fiber);
        if (null === alternate) throw Error(formatProdErrorMessage(188));
        return alternate !== fiber ? null : fiber;
    }
    for(var a = fiber, b = alternate;;){
        var parentA = a.return;
        if (null === parentA) break;
        var parentB = parentA.alternate;
        if (null === parentB) {
            b = parentA.return;
            if (null !== b) {
                a = b;
                continue;
            }
            break;
        }
        if (parentA.child === parentB.child) {
            for(parentB = parentA.child; parentB;){
                if (parentB === a) return assertIsMounted(parentA), fiber;
                if (parentB === b) return assertIsMounted(parentA), alternate;
                parentB = parentB.sibling;
            }
            throw Error(formatProdErrorMessage(188));
        }
        if (a.return !== b.return) a = parentA, b = parentB;
        else {
            for(var didFindChild = !1, child$0 = parentA.child; child$0;){
                if (child$0 === a) {
                    didFindChild = !0;
                    a = parentA;
                    b = parentB;
                    break;
                }
                if (child$0 === b) {
                    didFindChild = !0;
                    b = parentA;
                    a = parentB;
                    break;
                }
                child$0 = child$0.sibling;
            }
            if (!didFindChild) {
                for(child$0 = parentB.child; child$0;){
                    if (child$0 === a) {
                        didFindChild = !0;
                        a = parentB;
                        b = parentA;
                        break;
                    }
                    if (child$0 === b) {
                        didFindChild = !0;
                        b = parentB;
                        a = parentA;
                        break;
                    }
                    child$0 = child$0.sibling;
                }
                if (!didFindChild) throw Error(formatProdErrorMessage(189));
            }
        }
        if (a.alternate !== b) throw Error(formatProdErrorMessage(190));
    }
    if (3 !== a.tag) throw Error(formatProdErrorMessage(188));
    return a.stateNode.current === a ? fiber : alternate;
}
function findCurrentHostFiberImpl(node) {
    var tag = node.tag;
    if (5 === tag || 26 === tag || 27 === tag || 6 === tag) return node;
    for(node = node.child; null !== node;){
        tag = findCurrentHostFiberImpl(node);
        if (null !== tag) return tag;
        node = node.sibling;
    }
    return null;
}
function traverseVisibleInstancesAndTextInstances(child, searchWithinHosts, fn, a, b, c) {
    for(; null !== child;){
        if ((5 === child.tag || 27 === child.tag || 6 === child.tag) && fn(child, a, b, c) || (22 !== child.tag || null === child.memoizedState) && (searchWithinHosts || 5 !== child.tag && 27 !== child.tag) && traverseVisibleInstancesAndTextInstances(child.child, searchWithinHosts, fn, a, b, c)) return !0;
        child = child.sibling;
    }
    return !1;
}
function getFragmentParentInstanceOrContainerFiber(fiber) {
    for(fiber = fiber.return; null !== fiber;){
        if (3 === fiber.tag || 5 === fiber.tag || 27 === fiber.tag) return fiber;
        fiber = fiber.return;
    }
    return null;
}
function fiberIsPortaledIntoHost(fiber) {
    var foundPortalParent = !1;
    for(fiber = fiber.return; null !== fiber;){
        4 === fiber.tag && (foundPortalParent = !0);
        if (3 === fiber.tag || 5 === fiber.tag || 27 === fiber.tag) break;
        fiber = fiber.return;
    }
    return foundPortalParent;
}
function getFragmentInstanceOrTextInstanceSiblings(fiber) {
    var result = [
        null,
        null
    ], parentHostFiber = getFragmentParentInstanceOrContainerFiber(fiber);
    if (null === parentHostFiber) return result;
    findFragmentInstanceOrTextInstanceSiblings(result, fiber, parentHostFiber.child, {
        foundSelf: !1
    });
    return result;
}
function findFragmentInstanceOrTextInstanceSiblings(result, self, child, state) {
    for(; null !== child;){
        if (child === self) state.foundSelf = !0;
        else if (5 === child.tag || 27 === child.tag || 6 === child.tag) {
            if (state.foundSelf) return result[1] = child, !0;
            result[0] = child;
        } else if ((22 !== child.tag || null === child.memoizedState) && findFragmentInstanceOrTextInstanceSiblings(result, self, child.child, state)) return !0;
        child = child.sibling;
    }
    return !1;
}
function getInstanceFromHostFiber(fiber) {
    switch(fiber.tag){
        case 5:
        case 27:
        case 6:
            return fiber.stateNode;
        case 3:
            return fiber.stateNode.containerInfo;
        default:
            throw Error(formatProdErrorMessage(559));
    }
}
var searchTarget = null, searchBoundary = null;
function isFiberPrecedingCheck(child, target, boundary) {
    return child === boundary ? !0 : child === target ? (searchTarget = child, !0) : !1;
}
function isFiberFollowingCheck(child, target, boundary) {
    return child === boundary ? (searchBoundary = child, !1) : child === target ? (null !== searchBoundary && (searchTarget = child), !0) : !1;
}
function getParentForFragmentAncestors(inst) {
    if (null === inst) return null;
    do inst = null === inst ? null : inst.return;
    while (inst && 5 !== inst.tag && 27 !== inst.tag && 3 !== inst.tag)
    return inst ? inst : null;
}
function getLowestCommonAncestor(instA, instB, getParent) {
    for(var depthA = 0, tempA = instA; tempA; tempA = getParent(tempA))depthA++;
    tempA = 0;
    for(var tempB = instB; tempB; tempB = getParent(tempB))tempA++;
    for(; 0 < depthA - tempA;)instA = getParent(instA), depthA--;
    for(; 0 < tempA - depthA;)instB = getParent(instB), tempA--;
    for(; depthA--;){
        if (instA === instB || null !== instB && instA === instB.alternate) return instA;
        instA = getParent(instA);
        instB = getParent(instB);
    }
    return null;
}
var assign = Object.assign, REACT_LEGACY_ELEMENT_TYPE = Symbol.for("react.element"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy");
Symbol.for("react.scope");
var REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_LEGACY_HIDDEN_TYPE = Symbol.for("react.legacy_hidden");
Symbol.for("react.tracing_marker");
var REACT_MEMO_CACHE_SENTINEL = Symbol.for("react.memo_cache_sentinel"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_RECOVERABLE_TYPE = Symbol.for("react.recoverable"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
function getIteratorFn(maybeIterable) {
    if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
    maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
    return "function" === typeof maybeIterable ? maybeIterable : null;
}
var REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference");
function getComponentNameFromType(type) {
    if (null == type) return null;
    if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
    if ("string" === typeof type) return type;
    switch(type){
        case REACT_FRAGMENT_TYPE:
            return "Fragment";
        case REACT_PROFILER_TYPE:
            return "Profiler";
        case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
        case REACT_SUSPENSE_TYPE:
            return "Suspense";
        case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
        case REACT_ACTIVITY_TYPE:
            return "Activity";
        case REACT_VIEW_TRANSITION_TYPE:
            return "ViewTransition";
    }
    if ("object" === typeof type) switch(type.$$typeof){
        case REACT_PORTAL_TYPE:
            return "Portal";
        case REACT_CONTEXT_TYPE:
            return type.displayName || "Context";
        case REACT_CONSUMER_TYPE:
            return (type._context.displayName || "Context") + ".Consumer";
        case REACT_FORWARD_REF_TYPE:
            var innerType = type.render;
            type = type.displayName;
            type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
            return type;
        case REACT_MEMO_TYPE:
            return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
        case REACT_LAZY_TYPE:
            innerType = type._payload;
            type = type._init;
            try {
                return getComponentNameFromType(type(innerType));
            } catch (x) {}
    }
    return null;
}
var isArrayImpl = Array.isArray, ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ReactDOMSharedInternals = ReactDOM.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, sharedNotPendingObject = {
    pending: !1,
    data: null,
    method: null,
    action: null
}, valueStack = [], index = -1;
function createCursor(defaultValue) {
    return {
        current: defaultValue
    };
}
function pop(cursor) {
    0 > index || (cursor.current = valueStack[index], valueStack[index] = null, index--);
}
function push(cursor, value) {
    index++;
    valueStack[index] = cursor.current;
    cursor.current = value;
}
var contextStackCursor = createCursor(null), contextFiberStackCursor = createCursor(null), rootInstanceStackCursor = createCursor(null), hostTransitionProviderCursor = createCursor(null);
function pushHostContainer(fiber, nextRootInstance) {
    push(rootInstanceStackCursor, nextRootInstance);
    push(contextFiberStackCursor, fiber);
    push(contextStackCursor, null);
    switch(nextRootInstance.nodeType){
        case 9:
        case 11:
            fiber = (fiber = nextRootInstance.documentElement) ? (fiber = fiber.namespaceURI) ? getOwnHostContext(fiber) : 0 : 0;
            break;
        default:
            if (fiber = nextRootInstance.tagName, nextRootInstance = nextRootInstance.namespaceURI) nextRootInstance = getOwnHostContext(nextRootInstance), fiber = getChildHostContextProd(nextRootInstance, fiber);
            else switch(fiber){
                case "svg":
                    fiber = 1;
                    break;
                case "math":
                    fiber = 2;
                    break;
                default:
                    fiber = 0;
            }
    }
    pop(contextStackCursor);
    push(contextStackCursor, fiber);
}
function popHostContainer() {
    pop(contextStackCursor);
    pop(contextFiberStackCursor);
    pop(rootInstanceStackCursor);
}
function pushHostContext(fiber) {
    var stateHook = fiber.memoizedState;
    null !== stateHook && (HostTransitionContext._currentValue = stateHook.memoizedState, push(hostTransitionProviderCursor, fiber));
    stateHook = contextStackCursor.current;
    var JSCompiler_inline_result = getChildHostContextProd(stateHook, fiber.type);
    stateHook !== JSCompiler_inline_result && (push(contextFiberStackCursor, fiber), push(contextStackCursor, JSCompiler_inline_result));
}
function popHostContext(fiber) {
    contextFiberStackCursor.current === fiber && (pop(contextStackCursor), pop(contextFiberStackCursor));
    hostTransitionProviderCursor.current === fiber && (pop(hostTransitionProviderCursor), HostTransitionContext._currentValue = sharedNotPendingObject);
}
var prefix, suffix;
function describeBuiltInComponentFrame(name) {
    if (void 0 === prefix) try {
        throw Error();
    } catch (x) {
        var match = x.stack.trim().match(/\n( *(at )?)/);
        prefix = match && match[1] || "";
        suffix = -1 < x.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < x.stack.indexOf("@") ? "@unknown:0:0" : "";
    }
    return "\n" + prefix + name + suffix;
}
var reentry = !1;
function describeNativeComponentFrame(fn, construct) {
    if (!fn || reentry) return "";
    reentry = !0;
    var previousPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
        var RunInRootFrame = {
            DetermineComponentFrameRoot: function() {
                try {
                    if (construct) {
                        var Fake = function() {
                            throw Error();
                        };
                        Object.defineProperty(Fake.prototype, "props", {
                            set: function() {
                                throw Error();
                            }
                        });
                        if ("object" === typeof Reflect && Reflect.construct) {
                            try {
                                Reflect.construct(Fake, []);
                            } catch (x) {
                                var control = x;
                            }
                            Reflect.construct(fn, [], Fake);
                        } else {
                            try {
                                Fake.call();
                            } catch (x$1) {
                                control = x$1;
                            }
                            Fake = !1;
                            try {
                                var prevProps = Object.getOwnPropertyDescriptor(fn.prototype, "props");
                                Object.defineProperty(fn.prototype, "props", {
                                    configurable: !0,
                                    set: function() {
                                        throw Error();
                                    }
                                });
                                Fake = !0;
                                new fn();
                            } finally{
                                Fake && (void 0 !== prevProps ? Object.defineProperty(fn.prototype, "props", prevProps) : delete fn.prototype.props);
                            }
                        }
                    } else {
                        try {
                            throw Error();
                        } catch (x$2) {
                            control = x$2;
                        }
                        (Fake = fn()) && "function" === typeof Fake.catch && Fake.catch(function() {});
                    }
                } catch (sample) {
                    if (sample && control && "string" === typeof sample.stack) return [
                        sample.stack,
                        control.stack
                    ];
                }
                return [
                    null,
                    null
                ];
            }
        };
        RunInRootFrame.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
        var namePropDescriptor = Object.getOwnPropertyDescriptor(RunInRootFrame.DetermineComponentFrameRoot, "name");
        namePropDescriptor && namePropDescriptor.configurable && Object.defineProperty(RunInRootFrame.DetermineComponentFrameRoot, "name", {
            value: "DetermineComponentFrameRoot"
        });
        var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(), sampleStack = _RunInRootFrame$Deter[0], controlStack = _RunInRootFrame$Deter[1];
        if (sampleStack && controlStack) {
            var sampleLines = sampleStack.split("\n"), controlLines = controlStack.split("\n");
            for(namePropDescriptor = RunInRootFrame = 0; RunInRootFrame < sampleLines.length && !sampleLines[RunInRootFrame].includes("DetermineComponentFrameRoot");)RunInRootFrame++;
            for(; namePropDescriptor < controlLines.length && !controlLines[namePropDescriptor].includes("DetermineComponentFrameRoot");)namePropDescriptor++;
            if (RunInRootFrame === sampleLines.length || namePropDescriptor === controlLines.length) for(RunInRootFrame = sampleLines.length - 1, namePropDescriptor = controlLines.length - 1; 1 <= RunInRootFrame && 0 <= namePropDescriptor && sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor];)namePropDescriptor--;
            for(; 1 <= RunInRootFrame && 0 <= namePropDescriptor; RunInRootFrame--, namePropDescriptor--)if (sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
                if (1 !== RunInRootFrame || 1 !== namePropDescriptor) {
                    do if (RunInRootFrame--, namePropDescriptor--, 0 > namePropDescriptor || sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
                        var frame = "\n" + sampleLines[RunInRootFrame].replace(" at new ", " at ");
                        fn.displayName && frame.includes("<anonymous>") && (frame = frame.replace("<anonymous>", fn.displayName));
                        return frame;
                    }
                    while (1 <= RunInRootFrame && 0 <= namePropDescriptor)
                }
                break;
            }
        }
    } finally{
        reentry = !1, Error.prepareStackTrace = previousPrepareStackTrace;
    }
    return (previousPrepareStackTrace = fn ? fn.displayName || fn.name : "") ? describeBuiltInComponentFrame(previousPrepareStackTrace) : "";
}
function describeFiber(fiber, childFiber) {
    switch(fiber.tag){
        case 26:
        case 27:
        case 5:
            return describeBuiltInComponentFrame(fiber.type);
        case 16:
            return describeBuiltInComponentFrame("Lazy");
        case 13:
            return fiber.child !== childFiber && null !== childFiber ? describeBuiltInComponentFrame("Suspense Fallback") : describeBuiltInComponentFrame("Suspense");
        case 19:
            return describeBuiltInComponentFrame("SuspenseList");
        case 0:
        case 15:
            return describeNativeComponentFrame(fiber.type, !1);
        case 11:
            return describeNativeComponentFrame(fiber.type.render, !1);
        case 1:
            return describeNativeComponentFrame(fiber.type, !0);
        case 31:
            return describeBuiltInComponentFrame("Activity");
        case 30:
            return describeBuiltInComponentFrame("ViewTransition");
        default:
            return "";
    }
}
function getStackByFiberInDevAndProd(workInProgress) {
    try {
        var info = "", previous = null;
        do info += describeFiber(workInProgress, previous), previous = workInProgress, workInProgress = workInProgress.return;
        while (workInProgress)
        return info;
    } catch (x) {
        return "\nError generating stack: " + x.message + "\n" + x.stack;
    }
}
var hasOwnProperty = Object.prototype.hasOwnProperty, scheduleCallback$3 = Scheduler.unstable_scheduleCallback, cancelCallback$1 = Scheduler.unstable_cancelCallback, shouldYield = Scheduler.unstable_shouldYield, requestPaint = Scheduler.unstable_requestPaint, now = Scheduler.unstable_now, getCurrentPriorityLevel = Scheduler.unstable_getCurrentPriorityLevel, ImmediatePriority = Scheduler.unstable_ImmediatePriority, UserBlockingPriority = Scheduler.unstable_UserBlockingPriority, NormalPriority$1 = Scheduler.unstable_NormalPriority, LowPriority = Scheduler.unstable_LowPriority, IdlePriority = Scheduler.unstable_IdlePriority, log$1 = Scheduler.log, unstable_setDisableYieldValue = Scheduler.unstable_setDisableYieldValue, rendererID = null, injectedHook = null;
function setIsStrictModeForDevtools(newIsStrictMode) {
    "function" === typeof log$1 && unstable_setDisableYieldValue(newIsStrictMode);
    if (injectedHook && "function" === typeof injectedHook.setStrictMode) try {
        injectedHook.setStrictMode(rendererID, newIsStrictMode);
    } catch (err) {}
}
var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback, log = Math.log, LN2 = Math.LN2;
function clz32Fallback(x) {
    x >>>= 0;
    return 0 === x ? 32 : 31 - (log(x) / LN2 | 0) | 0;
}
var nextTransitionUpdateLane = 256, nextTransitionDeferredLane = 262144, nextRetryLane = 4194304;
function getHighestPriorityLanes(lanes) {
    var pendingSyncLanes = lanes & 42;
    if (0 !== pendingSyncLanes) return pendingSyncLanes;
    switch(lanes & -lanes){
        case 1:
            return 1;
        case 2:
            return 2;
        case 4:
            return 4;
        case 8:
            return 8;
        case 16:
            return 16;
        case 32:
            return 32;
        case 64:
            return 64;
        case 128:
            return 128;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
            return lanes & -lanes;
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
            return lanes & 3932160;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
            return lanes & 62914560;
        case 67108864:
            return 67108864;
        case 134217728:
            return 134217728;
        case 268435456:
            return 268435456;
        case 536870912:
            return 536870912;
        case 1073741824:
            return 0;
        default:
            return lanes;
    }
}
function getNextLanes(root, wipLanes, rootHasPendingCommit) {
    var pendingLanes = root.pendingLanes;
    if (0 === pendingLanes) return 0;
    var nextLanes = 0, suspendedLanes = root.suspendedLanes, pingedLanes = root.pingedLanes;
    root = root.warmLanes;
    var nonIdlePendingLanes = pendingLanes & 134217727;
    0 !== nonIdlePendingLanes ? (pendingLanes = nonIdlePendingLanes & ~suspendedLanes, 0 !== pendingLanes ? nextLanes = getHighestPriorityLanes(pendingLanes) : (pingedLanes &= nonIdlePendingLanes, 0 !== pingedLanes ? nextLanes = getHighestPriorityLanes(pingedLanes) : rootHasPendingCommit || (rootHasPendingCommit = nonIdlePendingLanes & ~root, 0 !== rootHasPendingCommit && (nextLanes = getHighestPriorityLanes(rootHasPendingCommit))))) : (nonIdlePendingLanes = pendingLanes & ~suspendedLanes, 0 !== nonIdlePendingLanes ? nextLanes = getHighestPriorityLanes(nonIdlePendingLanes) : 0 !== pingedLanes ? nextLanes = getHighestPriorityLanes(pingedLanes) : rootHasPendingCommit || (rootHasPendingCommit = pendingLanes & ~root, 0 !== rootHasPendingCommit && (nextLanes = getHighestPriorityLanes(rootHasPendingCommit))));
    return 0 === nextLanes ? 0 : 0 !== wipLanes && wipLanes !== nextLanes && 0 === (wipLanes & suspendedLanes) && (suspendedLanes = nextLanes & -nextLanes, rootHasPendingCommit = wipLanes & -wipLanes, suspendedLanes >= rootHasPendingCommit || 32 === suspendedLanes && 0 !== (rootHasPendingCommit & 4194048)) ? wipLanes : nextLanes;
}
function checkIfRootIsPrerendering(root, renderLanes) {
    return 0 === (root.pendingLanes & ~(root.suspendedLanes & ~root.pingedLanes) & renderLanes);
}
function getEntangledLanes(root, renderLanes) {
    0 !== (renderLanes & 8) && (renderLanes |= renderLanes & 32);
    var allEntangledLanes = root.entangledLanes;
    if (0 !== allEntangledLanes) for(root = root.entanglements, allEntangledLanes &= renderLanes; 0 < allEntangledLanes;){
        var index$4 = 31 - clz32(allEntangledLanes), lane = 1 << index$4;
        renderLanes |= root[index$4];
        allEntangledLanes &= ~lane;
    }
    return renderLanes;
}
function computeExpirationTime(lane, currentTime) {
    switch(lane){
        case 1:
        case 2:
        case 4:
        case 8:
        case 64:
            return currentTime + 250;
        case 16:
        case 32:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
            return currentTime + 5e3;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
            return -1;
        case 67108864:
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824:
            return -1;
        default:
            return -1;
    }
}
function claimNextRetryLane() {
    var lane = nextRetryLane;
    nextRetryLane <<= 1;
    0 === (nextRetryLane & 62914560) && (nextRetryLane = 4194304);
    return lane;
}
function createLaneMap(initial) {
    for(var laneMap = [], i = 0; 31 > i; i++)laneMap.push(initial);
    return laneMap;
}
function markRootUpdated$1(root, updateLane) {
    root.pendingLanes |= updateLane;
    268435456 !== updateLane && (root.suspendedLanes = 0, root.pingedLanes = 0, root.warmLanes = 0);
}
function markRootFinished(root, finishedLanes, remainingLanes, spawnedLane, updatedLanes, suspendedRetryLanes) {
    var previouslyPendingLanes = root.pendingLanes;
    root.pendingLanes = remainingLanes;
    root.suspendedLanes = 0;
    root.pingedLanes = 0;
    root.warmLanes = 0;
    root.expiredLanes &= remainingLanes;
    root.entangledLanes &= remainingLanes;
    root.errorRecoveryDisabledLanes &= remainingLanes;
    root.shellSuspendCounter = 0;
    var entanglements = root.entanglements, expirationTimes = root.expirationTimes, hiddenUpdates = root.hiddenUpdates;
    for(remainingLanes = previouslyPendingLanes & ~remainingLanes; 0 < remainingLanes;){
        var index$7 = 31 - clz32(remainingLanes), lane = 1 << index$7;
        entanglements[index$7] = 0;
        expirationTimes[index$7] = -1;
        var hiddenUpdatesForLane = hiddenUpdates[index$7];
        if (null !== hiddenUpdatesForLane) for(hiddenUpdates[index$7] = null, index$7 = 0; index$7 < hiddenUpdatesForLane.length; index$7++){
            var update = hiddenUpdatesForLane[index$7];
            null !== update && (update.lane &= -536870913);
        }
        remainingLanes &= ~lane;
    }
    0 !== spawnedLane && markSpawnedDeferredLane(root, spawnedLane, 0);
    0 !== suspendedRetryLanes && 0 === updatedLanes && 0 !== root.tag && (root.suspendedLanes |= suspendedRetryLanes & ~(previouslyPendingLanes & ~finishedLanes));
}
function markSpawnedDeferredLane(root, spawnedLane, entangledLanes) {
    root.pendingLanes |= spawnedLane;
    root.suspendedLanes &= ~spawnedLane;
    var spawnedLaneIndex = 31 - clz32(spawnedLane);
    root.entangledLanes |= spawnedLane;
    root.entanglements[spawnedLaneIndex] = root.entanglements[spawnedLaneIndex] | 1073741824 | entangledLanes & 261930;
}
function markRootEntangled(root, entangledLanes) {
    var rootEntangledLanes = root.entangledLanes |= entangledLanes;
    for(root = root.entanglements; rootEntangledLanes;){
        var index$8 = 31 - clz32(rootEntangledLanes), lane = 1 << index$8;
        lane & entangledLanes | root[index$8] & entangledLanes && (root[index$8] |= entangledLanes);
        rootEntangledLanes &= ~lane;
    }
}
function getBumpedLaneForHydration(root, renderLanes) {
    var renderLane = renderLanes & -renderLanes;
    renderLane = 0 !== (renderLane & 42) ? 1 : getBumpedLaneForHydrationByLane(renderLane);
    return 0 !== (renderLane & (root.suspendedLanes | renderLanes)) ? 0 : renderLane;
}
function getBumpedLaneForHydrationByLane(lane) {
    switch(lane){
        case 2:
            lane = 1;
            break;
        case 8:
            lane = 4;
            break;
        case 32:
            lane = 16;
            break;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
            lane = 128;
            break;
        case 268435456:
            lane = 134217728;
            break;
        default:
            lane = 0;
    }
    return lane;
}
function lanesToEventPriority(lanes) {
    lanes &= -lanes;
    return 2 < lanes ? 8 < lanes ? 0 !== (lanes & 134217727) ? 32 : 268435456 : 8 : 2;
}
function resolveUpdatePriority() {
    var updatePriority = ReactDOMSharedInternals.p;
    if (0 !== updatePriority) return updatePriority;
    updatePriority = window.event;
    return void 0 === updatePriority ? 32 : getEventPriority(updatePriority.type);
}
function runWithPriority(priority, fn) {
    var previousPriority = ReactDOMSharedInternals.p;
    try {
        return ReactDOMSharedInternals.p = priority, fn();
    } finally{
        ReactDOMSharedInternals.p = previousPriority;
    }
}
var randomKey = Math.random().toString(36).slice(2), internalInstanceKey = "__reactFiber$" + randomKey, internalPropsKey = "__reactProps$" + randomKey, internalContainerInstanceKey = "__reactContainer$" + randomKey, internalEventHandlersKey = "__reactEvents$" + randomKey, internalEventHandlerListenersKey = "__reactListeners$" + randomKey, internalEventHandlesSetKey = "__reactHandles$" + randomKey, internalRootNodeResourcesKey = "__reactResources$" + randomKey, internalHoistableMarker = "__reactMarker$" + randomKey, internalLoadPendingKey = "__reactLoad$" + randomKey;
function detachDeletedInstance(node) {
    delete node[internalInstanceKey];
    delete node[internalPropsKey];
    delete node[internalEventHandlerListenersKey];
    delete node[internalEventHandlesSetKey];
}
function getClosestInstanceFromNode(targetNode) {
    var targetInst;
    if (targetInst = targetNode[internalInstanceKey]) return targetInst;
    for(var parentNode = targetNode.parentNode; parentNode;){
        if (targetInst = parentNode[internalContainerInstanceKey] || parentNode[internalInstanceKey]) {
            parentNode = targetInst.alternate;
            if (null !== targetInst.child || null !== parentNode && null !== parentNode.child) for(targetNode = getParentHydrationBoundary(targetNode); null !== targetNode;){
                if (parentNode = targetNode[internalInstanceKey]) return parentNode;
                targetNode = getParentHydrationBoundary(targetNode);
            }
            return targetInst;
        }
        targetNode = parentNode;
        parentNode = targetNode.parentNode;
    }
    return null;
}
function getInstanceFromNode(node) {
    if (node = node[internalInstanceKey] || node[internalContainerInstanceKey]) {
        var tag = node.tag;
        if (5 === tag || 6 === tag || 13 === tag || 31 === tag || 26 === tag || 27 === tag || 3 === tag) return node;
    }
    return null;
}
function getNodeFromInstance(inst) {
    var tag = inst.tag;
    if (5 === tag || 26 === tag || 27 === tag || 6 === tag) return inst.stateNode;
    throw Error(formatProdErrorMessage(33));
}
function getResourcesFromRoot(root) {
    var resources = root[internalRootNodeResourcesKey];
    resources || (resources = root[internalRootNodeResourcesKey] = {
        hoistableStyles: new Map(),
        hoistableScripts: new Map()
    });
    return resources;
}
function markNodeAsHoistable(node) {
    node[internalHoistableMarker] = !0;
}
function clearPendingLoadOnNode(node) {
    node[internalLoadPendingKey] = void 0;
}
var allNativeEvents = new Set(), registrationNameDependencies = {};
function registerTwoPhaseEvent(registrationName, dependencies) {
    registerDirectEvent(registrationName, dependencies);
    registerDirectEvent(registrationName + "Capture", dependencies);
}
function registerDirectEvent(registrationName, dependencies) {
    registrationNameDependencies[registrationName] = dependencies;
    for(registrationName = 0; registrationName < dependencies.length; registrationName++)allNativeEvents.add(dependencies[registrationName]);
}
var VALID_ATTRIBUTE_NAME_REGEX = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), illegalAttributeNameCache = {}, validatedAttributeNameCache = {};
function isAttributeNameSafe(attributeName) {
    if (hasOwnProperty.call(validatedAttributeNameCache, attributeName)) return !0;
    if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) return !1;
    if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) return validatedAttributeNameCache[attributeName] = !0;
    illegalAttributeNameCache[attributeName] = !0;
    return !1;
}
var viewTransitionMutationContext = !1;
function pushMutationContext() {
    var prev = viewTransitionMutationContext;
    viewTransitionMutationContext = !1;
    return prev;
}
function setValueForAttribute(node, name, value) {
    if (isAttributeNameSafe(name)) if (null === value) node.removeAttribute(name);
    else {
        switch(typeof value){
            case "undefined":
            case "function":
            case "symbol":
                node.removeAttribute(name);
                return;
            case "boolean":
                var prefix$10 = name.toLowerCase().slice(0, 5);
                if ("data-" !== prefix$10 && "aria-" !== prefix$10) {
                    node.removeAttribute(name);
                    return;
                }
        }
        node.setAttribute(name, value);
    }
}
function setValueForKnownAttribute(node, name, value) {
    if (null === value) node.removeAttribute(name);
    else {
        switch(typeof value){
            case "undefined":
            case "function":
            case "symbol":
            case "boolean":
                node.removeAttribute(name);
                return;
        }
        node.setAttribute(name, value);
    }
}
function setValueForNamespacedAttribute(node, namespace, name, value) {
    if (null === value) node.removeAttribute(name);
    else {
        switch(typeof value){
            case "undefined":
            case "function":
            case "symbol":
            case "boolean":
                node.removeAttribute(name);
                return;
        }
        node.setAttributeNS(namespace, name, value);
    }
}
function getToStringValue(value) {
    switch(typeof value){
        case "bigint":
        case "boolean":
        case "number":
        case "string":
        case "undefined":
            return value;
        case "object":
            return value;
        default:
            return "";
    }
}
function isCheckable(elem) {
    var type = elem.type;
    return (elem = elem.nodeName) && "input" === elem.toLowerCase() && ("checkbox" === type || "radio" === type);
}
function trackValueOnNode(node, valueField, currentValue) {
    var descriptor = Object.getOwnPropertyDescriptor(node.constructor.prototype, valueField);
    if (!node.hasOwnProperty(valueField) && "undefined" !== typeof descriptor && "function" === typeof descriptor.get && "function" === typeof descriptor.set) {
        var get = descriptor.get, set = descriptor.set;
        Object.defineProperty(node, valueField, {
            configurable: !0,
            get: function() {
                return get.call(this);
            },
            set: function(value) {
                currentValue = "" + value;
                set.call(this, value);
            }
        });
        Object.defineProperty(node, valueField, {
            enumerable: descriptor.enumerable
        });
        return {
            getValue: function() {
                return currentValue;
            },
            setValue: function(value) {
                currentValue = "" + value;
            },
            stopTracking: function() {
                node._valueTracker = null;
                delete node[valueField];
            }
        };
    }
}
function track(node) {
    if (!node._valueTracker) {
        var valueField = isCheckable(node) ? "checked" : "value";
        node._valueTracker = trackValueOnNode(node, valueField, "" + node[valueField]);
    }
}
function updateValueIfChanged(node) {
    if (!node) return !1;
    var tracker = node._valueTracker;
    if (!tracker) return !0;
    var lastValue = tracker.getValue();
    var value = "";
    node && (value = isCheckable(node) ? node.checked ? "true" : "false" : node.value);
    node = value;
    return node !== lastValue ? (tracker.setValue(node), !0) : !1;
}
var escapeSelectorAttributeValueInsideDoubleQuotesRegex = /[\n"\\]/g;
function escapeSelectorAttributeValueInsideDoubleQuotes(value) {
    return value.replace(escapeSelectorAttributeValueInsideDoubleQuotesRegex, function(ch) {
        return "\\" + ch.charCodeAt(0).toString(16) + " ";
    });
}
function updateInput(element, value, defaultValue, lastDefaultValue, checked, defaultChecked, type, name) {
    element.name = "";
    null != type && "function" !== typeof type && "symbol" !== typeof type && "boolean" !== typeof type ? element.type = type : element.removeAttribute("type");
    if (null != value) if ("number" === type) {
        if (0 === value && "" === element.value || element.value != value) element.value = "" + getToStringValue(value);
    } else element.value !== "" + getToStringValue(value) && (element.value = "" + getToStringValue(value));
    else "submit" !== type && "reset" !== type || element.removeAttribute("value");
    null != value ? "number" === type && element.value == value ? setDefaultValue(element, getToStringValue(element.value)) : setDefaultValue(element, getToStringValue(value)) : null != defaultValue ? setDefaultValue(element, getToStringValue(defaultValue)) : null != lastDefaultValue && element.removeAttribute("value");
    null == checked && null != defaultChecked && (element.defaultChecked = !!defaultChecked);
    null != checked && (element.checked = checked && "function" !== typeof checked && "symbol" !== typeof checked);
    null != name && "function" !== typeof name && "symbol" !== typeof name && "boolean" !== typeof name ? element.name = "" + getToStringValue(name) : element.removeAttribute("name");
}
function initInput(element, value, defaultValue, checked, defaultChecked, type, name, isHydrating) {
    null != type && "function" !== typeof type && "symbol" !== typeof type && "boolean" !== typeof type && (element.type = type);
    if (null != value || null != defaultValue) {
        if (!("submit" !== type && "reset" !== type || void 0 !== value && null !== value)) {
            track(element);
            return;
        }
        defaultValue = null != defaultValue ? "" + getToStringValue(defaultValue) : "";
        value = null != value ? "" + getToStringValue(value) : defaultValue;
        isHydrating || value === element.value || (element.value = value);
        element.defaultValue = value;
    }
    checked = null != checked ? checked : defaultChecked;
    checked = "function" !== typeof checked && "symbol" !== typeof checked && !!checked;
    element.checked = isHydrating ? element.checked : !!checked;
    element.defaultChecked = !!checked;
    null != name && "function" !== typeof name && "symbol" !== typeof name && "boolean" !== typeof name && (element.name = name);
    track(element);
}
function setDefaultValue(node, value) {
    node.defaultValue !== "" + value && (node.defaultValue = "" + value);
}
function updateOptions(node, multiple, propValue, setDefaultSelected) {
    node = node.options;
    if (multiple) {
        multiple = {};
        for(var i = 0; i < propValue.length; i++)multiple["$" + propValue[i]] = !0;
        for(propValue = 0; propValue < node.length; propValue++)i = multiple.hasOwnProperty("$" + node[propValue].value), node[propValue].selected !== i && (node[propValue].selected = i), i && setDefaultSelected && (node[propValue].defaultSelected = !0);
    } else {
        propValue = "" + getToStringValue(propValue);
        multiple = null;
        for(i = 0; i < node.length; i++){
            if (node[i].value === propValue) {
                node[i].selected = !0;
                setDefaultSelected && (node[i].defaultSelected = !0);
                return;
            }
            null !== multiple || node[i].disabled || (multiple = node[i]);
        }
        null !== multiple && (multiple.selected = !0);
    }
}
function updateTextarea(element, value, defaultValue) {
    if (null != value && (value = "" + getToStringValue(value), value !== element.value && (element.value = value), null == defaultValue)) {
        element.defaultValue !== value && (element.defaultValue = value);
        return;
    }
    element.defaultValue = null != defaultValue ? "" + getToStringValue(defaultValue) : "";
}
function initTextarea(element, value, defaultValue, children) {
    if (null == value) {
        if (null != children) {
            if (null != defaultValue) throw Error(formatProdErrorMessage(92));
            if (isArrayImpl(children)) {
                if (1 < children.length) throw Error(formatProdErrorMessage(93));
                children = children[0];
            }
            defaultValue = children;
        }
        null == defaultValue && (defaultValue = "");
        value = defaultValue;
    }
    defaultValue = getToStringValue(value);
    element.defaultValue = defaultValue;
    children = element.textContent;
    children === defaultValue && "" !== children && null !== children && (element.value = children);
    track(element);
}
function setTextContent(node, text) {
    if (text) {
        var firstChild = node.firstChild;
        if (firstChild && firstChild === node.lastChild && 3 === firstChild.nodeType) {
            firstChild.nodeValue = text;
            return;
        }
    }
    node.textContent = text;
}
var unitlessNumbers = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
function setValueForStyle(style, styleName, value) {
    var isCustomProperty = 0 === styleName.indexOf("--");
    null == value || "boolean" === typeof value || "" === value ? isCustomProperty ? style.setProperty(styleName, "") : "float" === styleName ? style.cssFloat = "" : style[styleName] = "" : isCustomProperty ? style.setProperty(styleName, value) : "number" !== typeof value || 0 === value || unitlessNumbers.has(styleName) ? "float" === styleName ? style.cssFloat = value : style[styleName] = ("" + value).trim() : style[styleName] = value + "px";
}
function setValueForStyles(node, styles, prevStyles) {
    if (null != styles && "object" !== typeof styles) throw Error(formatProdErrorMessage(62));
    node = node.style;
    if (null != prevStyles) {
        for(var styleName in prevStyles)!prevStyles.hasOwnProperty(styleName) || null != styles && styles.hasOwnProperty(styleName) || (0 === styleName.indexOf("--") ? node.setProperty(styleName, "") : "float" === styleName ? node.cssFloat = "" : node[styleName] = "", viewTransitionMutationContext = !0);
        for(var styleName$16 in styles)styleName = styles[styleName$16], styles.hasOwnProperty(styleName$16) && prevStyles[styleName$16] !== styleName && (setValueForStyle(node, styleName$16, styleName), viewTransitionMutationContext = !0);
    } else for(var styleName$17 in styles)styles.hasOwnProperty(styleName$17) && setValueForStyle(node, styleName$17, styles[styleName$17]);
}
function isCustomElement(tagName) {
    if (-1 === tagName.indexOf("-")) return !1;
    switch(tagName){
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
            return !1;
        default:
            return !0;
    }
}
var aliases = new Map([
    [
        "acceptCharset",
        "accept-charset"
    ],
    [
        "htmlFor",
        "for"
    ],
    [
        "httpEquiv",
        "http-equiv"
    ],
    [
        "crossOrigin",
        "crossorigin"
    ],
    [
        "accentHeight",
        "accent-height"
    ],
    [
        "alignmentBaseline",
        "alignment-baseline"
    ],
    [
        "arabicForm",
        "arabic-form"
    ],
    [
        "baselineShift",
        "baseline-shift"
    ],
    [
        "capHeight",
        "cap-height"
    ],
    [
        "clipPath",
        "clip-path"
    ],
    [
        "clipRule",
        "clip-rule"
    ],
    [
        "colorInterpolation",
        "color-interpolation"
    ],
    [
        "colorInterpolationFilters",
        "color-interpolation-filters"
    ],
    [
        "colorProfile",
        "color-profile"
    ],
    [
        "colorRendering",
        "color-rendering"
    ],
    [
        "dominantBaseline",
        "dominant-baseline"
    ],
    [
        "enableBackground",
        "enable-background"
    ],
    [
        "fillOpacity",
        "fill-opacity"
    ],
    [
        "fillRule",
        "fill-rule"
    ],
    [
        "floodColor",
        "flood-color"
    ],
    [
        "floodOpacity",
        "flood-opacity"
    ],
    [
        "fontFamily",
        "font-family"
    ],
    [
        "fontSize",
        "font-size"
    ],
    [
        "fontSizeAdjust",
        "font-size-adjust"
    ],
    [
        "fontStretch",
        "font-stretch"
    ],
    [
        "fontStyle",
        "font-style"
    ],
    [
        "fontVariant",
        "font-variant"
    ],
    [
        "fontWeight",
        "font-weight"
    ],
    [
        "glyphName",
        "glyph-name"
    ],
    [
        "glyphOrientationHorizontal",
        "glyph-orientation-horizontal"
    ],
    [
        "glyphOrientationVertical",
        "glyph-orientation-vertical"
    ],
    [
        "horizAdvX",
        "horiz-adv-x"
    ],
    [
        "horizOriginX",
        "horiz-origin-x"
    ],
    [
        "imageRendering",
        "image-rendering"
    ],
    [
        "letterSpacing",
        "letter-spacing"
    ],
    [
        "lightingColor",
        "lighting-color"
    ],
    [
        "markerEnd",
        "marker-end"
    ],
    [
        "markerMid",
        "marker-mid"
    ],
    [
        "markerStart",
        "marker-start"
    ],
    [
        "maskType",
        "mask-type"
    ],
    [
        "overlinePosition",
        "overline-position"
    ],
    [
        "overlineThickness",
        "overline-thickness"
    ],
    [
        "paintOrder",
        "paint-order"
    ],
    [
        "panose-1",
        "panose-1"
    ],
    [
        "pointerEvents",
        "pointer-events"
    ],
    [
        "renderingIntent",
        "rendering-intent"
    ],
    [
        "shapeRendering",
        "shape-rendering"
    ],
    [
        "stopColor",
        "stop-color"
    ],
    [
        "stopOpacity",
        "stop-opacity"
    ],
    [
        "strikethroughPosition",
        "strikethrough-position"
    ],
    [
        "strikethroughThickness",
        "strikethrough-thickness"
    ],
    [
        "strokeDasharray",
        "stroke-dasharray"
    ],
    [
        "strokeDashoffset",
        "stroke-dashoffset"
    ],
    [
        "strokeLinecap",
        "stroke-linecap"
    ],
    [
        "strokeLinejoin",
        "stroke-linejoin"
    ],
    [
        "strokeMiterlimit",
        "stroke-miterlimit"
    ],
    [
        "strokeOpacity",
        "stroke-opacity"
    ],
    [
        "strokeWidth",
        "stroke-width"
    ],
    [
        "textAnchor",
        "text-anchor"
    ],
    [
        "textDecoration",
        "text-decoration"
    ],
    [
        "textRendering",
        "text-rendering"
    ],
    [
        "transformOrigin",
        "transform-origin"
    ],
    [
        "underlinePosition",
        "underline-position"
    ],
    [
        "underlineThickness",
        "underline-thickness"
    ],
    [
        "unicodeBidi",
        "unicode-bidi"
    ],
    [
        "unicodeRange",
        "unicode-range"
    ],
    [
        "unitsPerEm",
        "units-per-em"
    ],
    [
        "vAlphabetic",
        "v-alphabetic"
    ],
    [
        "vHanging",
        "v-hanging"
    ],
    [
        "vIdeographic",
        "v-ideographic"
    ],
    [
        "vMathematical",
        "v-mathematical"
    ],
    [
        "vectorEffect",
        "vector-effect"
    ],
    [
        "vertAdvY",
        "vert-adv-y"
    ],
    [
        "vertOriginX",
        "vert-origin-x"
    ],
    [
        "vertOriginY",
        "vert-origin-y"
    ],
    [
        "wordSpacing",
        "word-spacing"
    ],
    [
        "writingMode",
        "writing-mode"
    ],
    [
        "xmlnsXlink",
        "xmlns:xlink"
    ],
    [
        "xHeight",
        "x-height"
    ]
]), isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
function sanitizeURL(url) {
    return isJavaScriptProtocol.test("" + url) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : url;
}
function noop$1() {}
var currentReplayingEvent = null;
function getEventTarget(nativeEvent) {
    nativeEvent = nativeEvent.target || nativeEvent.srcElement || window;
    nativeEvent.correspondingUseElement && (nativeEvent = nativeEvent.correspondingUseElement);
    return 3 === nativeEvent.nodeType ? nativeEvent.parentNode : nativeEvent;
}
var restoreTarget = null, restoreQueue = null;
function restoreStateOfTarget(target) {
    var internalInstance = getInstanceFromNode(target);
    if (internalInstance && (target = internalInstance.stateNode)) {
        var props = target[internalPropsKey] || null;
        a: switch(target = internalInstance.stateNode, internalInstance.type){
            case "input":
                updateInput(target, props.value, props.defaultValue, props.defaultValue, props.checked, props.defaultChecked, props.type, props.name);
                internalInstance = props.name;
                if ("radio" === props.type && null != internalInstance) {
                    for(props = target; props.parentNode;)props = props.parentNode;
                    props = props.querySelectorAll('input[name="' + escapeSelectorAttributeValueInsideDoubleQuotes("" + internalInstance) + '"][type="radio"]');
                    for(internalInstance = 0; internalInstance < props.length; internalInstance++){
                        var otherNode = props[internalInstance];
                        if (otherNode !== target && otherNode.form === target.form) {
                            var otherProps = otherNode[internalPropsKey] || null;
                            if (!otherProps) throw Error(formatProdErrorMessage(90));
                            updateInput(otherNode, otherProps.value, otherProps.defaultValue, otherProps.defaultValue, otherProps.checked, otherProps.defaultChecked, otherProps.type, otherProps.name);
                        }
                    }
                    for(internalInstance = 0; internalInstance < props.length; internalInstance++)otherNode = props[internalInstance], otherNode.form === target.form && updateValueIfChanged(otherNode);
                }
                break a;
            case "textarea":
                updateTextarea(target, props.value, props.defaultValue);
                break a;
            case "select":
                internalInstance = props.value, null != internalInstance && updateOptions(target, !!props.multiple, internalInstance, !1);
        }
    }
}
var isInsideEventHandler = !1;
function batchedUpdates$1(fn, a, b) {
    if (isInsideEventHandler) return fn(a, b);
    isInsideEventHandler = !0;
    try {
        var JSCompiler_inline_result = fn(a);
        return JSCompiler_inline_result;
    } finally{
        if (isInsideEventHandler = !1, null !== restoreTarget || null !== restoreQueue) {
            if (flushSyncWork$1(), restoreTarget && (a = restoreTarget, fn = restoreQueue, restoreQueue = restoreTarget = null, restoreStateOfTarget(a), fn)) for(a = 0; a < fn.length; a++)restoreStateOfTarget(fn[a]);
        }
    }
}
function getListener(inst, registrationName) {
    var stateNode = inst.stateNode;
    if (null === stateNode) return null;
    var props = stateNode[internalPropsKey] || null;
    if (null === props) return null;
    stateNode = props[registrationName];
    a: switch(registrationName){
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
            (props = !props.disabled) || (inst = inst.type, props = !("button" === inst || "input" === inst || "select" === inst || "textarea" === inst));
            inst = !props;
            break a;
        default:
            inst = !1;
    }
    if (inst) return null;
    if (stateNode && "function" !== typeof stateNode) throw Error(formatProdErrorMessage(231, registrationName, typeof stateNode));
    return stateNode;
}
var canUseDOM = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), passiveBrowserEventsSupported = !1;
if (canUseDOM) try {
    var options = {};
    Object.defineProperty(options, "passive", {
        get: function() {
            passiveBrowserEventsSupported = !0;
        }
    });
    window.addEventListener("test", options, options);
    window.removeEventListener("test", options, options);
} catch (e) {
    passiveBrowserEventsSupported = !1;
}
var root = null, startText = null, fallbackText = null;
function getData() {
    if (fallbackText) return fallbackText;
    var start, startValue = startText, startLength = startValue.length, end, endValue = "value" in root ? root.value : root.textContent, endLength = endValue.length;
    for(start = 0; start < startLength && startValue[start] === endValue[start]; start++);
    var minEnd = startLength - start;
    for(end = 1; end <= minEnd && startValue[startLength - end] === endValue[endLength - end]; end++);
    return fallbackText = endValue.slice(start, 1 < end ? 1 - end : void 0);
}
function getEventCharCode(nativeEvent) {
    var keyCode = nativeEvent.keyCode;
    "charCode" in nativeEvent ? (nativeEvent = nativeEvent.charCode, 0 === nativeEvent && 13 === keyCode && (nativeEvent = 13)) : nativeEvent = keyCode;
    10 === nativeEvent && (nativeEvent = 13);
    return 32 <= nativeEvent || 13 === nativeEvent ? nativeEvent : 0;
}
function functionThatReturnsTrue() {
    return !0;
}
function functionThatReturnsFalse() {
    return !1;
}
function createSyntheticEvent(Interface) {
    function SyntheticBaseEvent(reactName, reactEventType, targetInst, nativeEvent, nativeEventTarget) {
        this._reactName = reactName;
        this._targetInst = targetInst;
        this.type = reactEventType;
        this.nativeEvent = nativeEvent;
        this.target = nativeEventTarget;
        this.currentTarget = null;
        for(var propName in Interface)Interface.hasOwnProperty(propName) && (reactName = Interface[propName], this[propName] = reactName ? reactName(nativeEvent) : nativeEvent[propName]);
        this.isDefaultPrevented = (null != nativeEvent.defaultPrevented ? nativeEvent.defaultPrevented : !1 === nativeEvent.returnValue) ? functionThatReturnsTrue : functionThatReturnsFalse;
        this.isPropagationStopped = functionThatReturnsFalse;
        return this;
    }
    assign(SyntheticBaseEvent.prototype, {
        preventDefault: function() {
            this.defaultPrevented = !0;
            var event = this.nativeEvent;
            event && (event.preventDefault ? event.preventDefault() : "unknown" !== typeof event.returnValue && (event.returnValue = !1), this.isDefaultPrevented = functionThatReturnsTrue);
        },
        stopPropagation: function() {
            var event = this.nativeEvent;
            event && (event.stopPropagation ? event.stopPropagation() : "unknown" !== typeof event.cancelBubble && (event.cancelBubble = !0), this.isPropagationStopped = functionThatReturnsTrue);
        },
        persist: function() {},
        isPersistent: functionThatReturnsTrue
    });
    return SyntheticBaseEvent;
}
var EventInterface = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(event) {
        return event.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
}, SyntheticEvent = createSyntheticEvent(EventInterface), UIEventInterface = assign({}, EventInterface, {
    view: 0,
    detail: 0
}), SyntheticUIEvent = createSyntheticEvent(UIEventInterface), lastMovementX, lastMovementY, lastMouseEvent, MouseEventInterface = assign({}, UIEventInterface, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: getEventModifierState,
    button: 0,
    buttons: 0,
    relatedTarget: function(event) {
        return void 0 === event.relatedTarget ? event.fromElement === event.srcElement ? event.toElement : event.fromElement : event.relatedTarget;
    },
    movementX: function(event) {
        if ("movementX" in event) return event.movementX;
        event !== lastMouseEvent && (lastMouseEvent && "mousemove" === event.type ? (lastMovementX = event.screenX - lastMouseEvent.screenX, lastMovementY = event.screenY - lastMouseEvent.screenY) : lastMovementY = lastMovementX = 0, lastMouseEvent = event);
        return lastMovementX;
    },
    movementY: function(event) {
        return "movementY" in event ? event.movementY : lastMovementY;
    }
}), SyntheticMouseEvent = createSyntheticEvent(MouseEventInterface), DragEventInterface = assign({}, MouseEventInterface, {
    dataTransfer: 0
}), SyntheticDragEvent = createSyntheticEvent(DragEventInterface), FocusEventInterface = assign({}, UIEventInterface, {
    relatedTarget: 0
}), SyntheticFocusEvent = createSyntheticEvent(FocusEventInterface), AnimationEventInterface = assign({}, EventInterface, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
}), SyntheticAnimationEvent = createSyntheticEvent(AnimationEventInterface), ClipboardEventInterface = assign({}, EventInterface, {
    clipboardData: function(event) {
        return "clipboardData" in event ? event.clipboardData : window.clipboardData;
    }
}), SyntheticClipboardEvent = createSyntheticEvent(ClipboardEventInterface), CompositionEventInterface = assign({}, EventInterface, {
    data: 0
}), SyntheticCompositionEvent = createSyntheticEvent(CompositionEventInterface), normalizeKey = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
}, translateToKey = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
}, modifierKeyToProp = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
};
function modifierStateGetter(keyArg) {
    var nativeEvent = this.nativeEvent;
    return nativeEvent.getModifierState ? nativeEvent.getModifierState(keyArg) : (keyArg = modifierKeyToProp[keyArg]) ? !!nativeEvent[keyArg] : !1;
}
function getEventModifierState() {
    return modifierStateGetter;
}
var KeyboardEventInterface = assign({}, UIEventInterface, {
    key: function(nativeEvent) {
        if (nativeEvent.key) {
            var key = normalizeKey[nativeEvent.key] || nativeEvent.key;
            if ("Unidentified" !== key) return key;
        }
        return "keypress" === nativeEvent.type ? (nativeEvent = getEventCharCode(nativeEvent), 13 === nativeEvent ? "Enter" : String.fromCharCode(nativeEvent)) : "keydown" === nativeEvent.type || "keyup" === nativeEvent.type ? translateToKey[nativeEvent.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: getEventModifierState,
    charCode: function(event) {
        return "keypress" === event.type ? getEventCharCode(event) : 0;
    },
    keyCode: function(event) {
        return "keydown" === event.type || "keyup" === event.type ? event.keyCode : 0;
    },
    which: function(event) {
        return "keypress" === event.type ? getEventCharCode(event) : "keydown" === event.type || "keyup" === event.type ? event.keyCode : 0;
    }
}), SyntheticKeyboardEvent = createSyntheticEvent(KeyboardEventInterface), PointerEventInterface = assign({}, MouseEventInterface, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
}), SyntheticPointerEvent = createSyntheticEvent(PointerEventInterface), SubmitEventInterface = assign({}, EventInterface, {
    submitter: 0
}), SyntheticSubmitEvent = createSyntheticEvent(SubmitEventInterface), TouchEventInterface = assign({}, UIEventInterface, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: getEventModifierState
}), SyntheticTouchEvent = createSyntheticEvent(TouchEventInterface), TransitionEventInterface = assign({}, EventInterface, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
}), SyntheticTransitionEvent = createSyntheticEvent(TransitionEventInterface), WheelEventInterface = assign({}, MouseEventInterface, {
    deltaX: function(event) {
        return "deltaX" in event ? event.deltaX : "wheelDeltaX" in event ? -event.wheelDeltaX : 0;
    },
    deltaY: function(event) {
        return "deltaY" in event ? event.deltaY : "wheelDeltaY" in event ? -event.wheelDeltaY : "wheelDelta" in event ? -event.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
}), SyntheticWheelEvent = createSyntheticEvent(WheelEventInterface), ToggleEventInterface = assign({}, EventInterface, {
    newState: 0,
    oldState: 0,
    source: 0
}), SyntheticToggleEvent = createSyntheticEvent(ToggleEventInterface), END_KEYCODES = [
    9,
    13,
    27,
    32
], canUseCompositionEvent = canUseDOM && "CompositionEvent" in window, documentMode = null;
canUseDOM && "documentMode" in document && (documentMode = document.documentMode);
var canUseTextInputEvent = canUseDOM && "TextEvent" in window && !documentMode, useFallbackCompositionData = canUseDOM && (!canUseCompositionEvent || documentMode && 8 < documentMode && 11 >= documentMode), SPACEBAR_CHAR = String.fromCharCode(32), hasSpaceKeypress = !1;
function isFallbackCompositionEnd(domEventName, nativeEvent) {
    switch(domEventName){
        case "keyup":
            return -1 !== END_KEYCODES.indexOf(nativeEvent.keyCode);
        case "keydown":
            return 229 !== nativeEvent.keyCode;
        case "keypress":
        case "mousedown":
        case "focusout":
            return !0;
        default:
            return !1;
    }
}
function getDataFromCustomEvent(nativeEvent) {
    nativeEvent = nativeEvent.detail;
    return "object" === typeof nativeEvent && "data" in nativeEvent ? nativeEvent.data : null;
}
var isComposing = !1;
function getNativeBeforeInputChars(domEventName, nativeEvent) {
    switch(domEventName){
        case "compositionend":
            return getDataFromCustomEvent(nativeEvent);
        case "keypress":
            if (32 !== nativeEvent.which) return null;
            hasSpaceKeypress = !0;
            return SPACEBAR_CHAR;
        case "textInput":
            return domEventName = nativeEvent.data, domEventName === SPACEBAR_CHAR && hasSpaceKeypress ? null : domEventName;
        default:
            return null;
    }
}
function getFallbackBeforeInputChars(domEventName, nativeEvent) {
    if (isComposing) return "compositionend" === domEventName || !canUseCompositionEvent && isFallbackCompositionEnd(domEventName, nativeEvent) ? (domEventName = getData(), fallbackText = startText = root = null, isComposing = !1, domEventName) : null;
    switch(domEventName){
        case "paste":
            return null;
        case "keypress":
            if (!(nativeEvent.ctrlKey || nativeEvent.altKey || nativeEvent.metaKey) || nativeEvent.ctrlKey && nativeEvent.altKey) {
                if (nativeEvent.char && 1 < nativeEvent.char.length) return nativeEvent.char;
                if (nativeEvent.which) return String.fromCharCode(nativeEvent.which);
            }
            return null;
        case "compositionend":
            return useFallbackCompositionData && "ko" !== nativeEvent.locale ? null : nativeEvent.data;
        default:
            return null;
    }
}
var supportedInputTypes = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
};
function isTextInputElement(elem) {
    var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
    return "input" === nodeName ? !!supportedInputTypes[elem.type] : "textarea" === nodeName ? !0 : !1;
}
function createAndAccumulateChangeEvent(dispatchQueue, inst, nativeEvent, target) {
    restoreTarget ? restoreQueue ? restoreQueue.push(target) : restoreQueue = [
        target
    ] : restoreTarget = target;
    inst = accumulateTwoPhaseListeners(inst, "onChange");
    0 < inst.length && (nativeEvent = new SyntheticEvent("onChange", "change", null, nativeEvent, target), dispatchQueue.push({
        event: nativeEvent,
        listeners: inst
    }));
}
var activeElement$1 = null, activeElementInst$1 = null;
function runEventInBatch(dispatchQueue) {
    processDispatchQueue(dispatchQueue, 0);
}
function getInstIfValueChanged(targetInst) {
    var targetNode = getNodeFromInstance(targetInst);
    if (updateValueIfChanged(targetNode)) return targetInst;
}
function getTargetInstForChangeEvent(domEventName, targetInst) {
    if ("change" === domEventName) return targetInst;
}
var isInputEventSupported = !1;
if (canUseDOM) {
    var JSCompiler_inline_result$jscomp$318;
    if (canUseDOM) {
        var isSupported$jscomp$inline_474 = "oninput" in document;
        if (!isSupported$jscomp$inline_474) {
            var element$jscomp$inline_475 = document.createElement("div");
            element$jscomp$inline_475.setAttribute("oninput", "return;");
            isSupported$jscomp$inline_474 = "function" === typeof element$jscomp$inline_475.oninput;
        }
        JSCompiler_inline_result$jscomp$318 = isSupported$jscomp$inline_474;
    } else JSCompiler_inline_result$jscomp$318 = !1;
    isInputEventSupported = JSCompiler_inline_result$jscomp$318 && (!document.documentMode || 9 < document.documentMode);
}
function stopWatchingForValueChange() {
    activeElement$1 && (activeElement$1.detachEvent("onpropertychange", handlePropertyChange), activeElementInst$1 = activeElement$1 = null);
}
function handlePropertyChange(nativeEvent) {
    if ("value" === nativeEvent.propertyName && getInstIfValueChanged(activeElementInst$1)) {
        var dispatchQueue = [];
        createAndAccumulateChangeEvent(dispatchQueue, activeElementInst$1, nativeEvent, getEventTarget(nativeEvent));
        batchedUpdates$1(runEventInBatch, dispatchQueue);
    }
}
function handleEventsForInputEventPolyfill(domEventName, target, targetInst) {
    "focusin" === domEventName ? (stopWatchingForValueChange(), activeElement$1 = target, activeElementInst$1 = targetInst, activeElement$1.attachEvent("onpropertychange", handlePropertyChange)) : "focusout" === domEventName && stopWatchingForValueChange();
}
function getTargetInstForInputEventPolyfill(domEventName) {
    if ("selectionchange" === domEventName || "keyup" === domEventName || "keydown" === domEventName) return getInstIfValueChanged(activeElementInst$1);
}
function getTargetInstForClickEvent(domEventName, targetInst) {
    if ("click" === domEventName) return getInstIfValueChanged(targetInst);
}
function getTargetInstForInputOrChangeEvent(domEventName, targetInst) {
    if ("input" === domEventName || "change" === domEventName) return getInstIfValueChanged(targetInst);
}
function is(x, y) {
    return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
}
var objectIs = "function" === typeof Object.is ? Object.is : is;
function shallowEqual(objA, objB) {
    if (objectIs(objA, objB)) return !0;
    if ("object" !== typeof objA || null === objA || "object" !== typeof objB || null === objB) return !1;
    var keysA = Object.keys(objA), keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) return !1;
    for(keysB = 0; keysB < keysA.length; keysB++){
        var currentKey = keysA[keysB];
        if (!hasOwnProperty.call(objB, currentKey) || !objectIs(objA[currentKey], objB[currentKey])) return !1;
    }
    return !0;
}
function getActiveElement(doc) {
    doc = doc || ("undefined" !== typeof document ? document : void 0);
    if ("undefined" === typeof doc) return null;
    try {
        return doc.activeElement || doc.body;
    } catch (e$20) {
        return doc.body;
    }
}
function getLeafNode(node) {
    for(; node && node.firstChild;)node = node.firstChild;
    return node;
}
function getNodeForCharacterOffset(root, offset) {
    var node = getLeafNode(root);
    root = 0;
    for(var nodeEnd; node;){
        if (3 === node.nodeType) {
            nodeEnd = root + node.textContent.length;
            if (root <= offset && nodeEnd >= offset) return {
                node: node,
                offset: offset - root
            };
            root = nodeEnd;
        }
        a: {
            for(; node;){
                if (node.nextSibling) {
                    node = node.nextSibling;
                    break a;
                }
                node = node.parentNode;
            }
            node = void 0;
        }
        node = getLeafNode(node);
    }
}
function containsNode(outerNode, innerNode) {
    return outerNode && innerNode ? outerNode === innerNode ? !0 : outerNode && 3 === outerNode.nodeType ? !1 : innerNode && 3 === innerNode.nodeType ? containsNode(outerNode, innerNode.parentNode) : "contains" in outerNode ? outerNode.contains(innerNode) : outerNode.compareDocumentPosition ? !!(outerNode.compareDocumentPosition(innerNode) & 16) : !1 : !1;
}
function getActiveElementDeep(containerInfo) {
    containerInfo = null != containerInfo && null != containerInfo.ownerDocument && null != containerInfo.ownerDocument.defaultView ? containerInfo.ownerDocument.defaultView : window;
    for(var element = getActiveElement(containerInfo.document); element instanceof containerInfo.HTMLIFrameElement;){
        try {
            var JSCompiler_inline_result = "string" === typeof element.contentWindow.location.href;
        } catch (err) {
            JSCompiler_inline_result = !1;
        }
        if (JSCompiler_inline_result) containerInfo = element.contentWindow;
        else break;
        element = getActiveElement(containerInfo.document);
    }
    return element;
}
function hasSelectionCapabilities(elem) {
    var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
    return nodeName && ("input" === nodeName && ("text" === elem.type || "search" === elem.type || "tel" === elem.type || "url" === elem.type || "password" === elem.type) || "textarea" === nodeName || "true" === elem.contentEditable);
}
var skipSelectionChangeEvent = canUseDOM && "documentMode" in document && 11 >= document.documentMode, activeElement = null, activeElementInst = null, lastSelection = null, mouseDown = !1;
function constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget) {
    var doc = nativeEventTarget.window === nativeEventTarget ? nativeEventTarget.document : 9 === nativeEventTarget.nodeType ? nativeEventTarget : nativeEventTarget.ownerDocument;
    mouseDown || null == activeElement || activeElement !== getActiveElement(doc) || (doc = activeElement, "selectionStart" in doc && hasSelectionCapabilities(doc) ? doc = {
        start: doc.selectionStart,
        end: doc.selectionEnd
    } : (doc = (doc.ownerDocument && doc.ownerDocument.defaultView || window).getSelection(), doc = {
        anchorNode: doc.anchorNode,
        anchorOffset: doc.anchorOffset,
        focusNode: doc.focusNode,
        focusOffset: doc.focusOffset
    }), lastSelection && shallowEqual(lastSelection, doc) || (lastSelection = doc, doc = accumulateTwoPhaseListeners(activeElementInst, "onSelect"), 0 < doc.length && (nativeEvent = new SyntheticEvent("onSelect", "select", null, nativeEvent, nativeEventTarget), dispatchQueue.push({
        event: nativeEvent,
        listeners: doc
    }), nativeEvent.target = activeElement)));
}
function makePrefixMap(styleProp, eventName) {
    var prefixes = {};
    prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
    prefixes["Webkit" + styleProp] = "webkit" + eventName;
    prefixes["Moz" + styleProp] = "moz" + eventName;
    return prefixes;
}
var vendorPrefixes = {
    animationend: makePrefixMap("Animation", "AnimationEnd"),
    animationiteration: makePrefixMap("Animation", "AnimationIteration"),
    animationstart: makePrefixMap("Animation", "AnimationStart"),
    transitionrun: makePrefixMap("Transition", "TransitionRun"),
    transitionstart: makePrefixMap("Transition", "TransitionStart"),
    transitioncancel: makePrefixMap("Transition", "TransitionCancel"),
    transitionend: makePrefixMap("Transition", "TransitionEnd")
}, prefixedEventNames = {}, style = {};
canUseDOM && (style = document.createElement("div").style, "AnimationEvent" in window || (delete vendorPrefixes.animationend.animation, delete vendorPrefixes.animationiteration.animation, delete vendorPrefixes.animationstart.animation), "TransitionEvent" in window || delete vendorPrefixes.transitionend.transition);
function getVendorPrefixedEventName(eventName) {
    if (prefixedEventNames[eventName]) return prefixedEventNames[eventName];
    if (!vendorPrefixes[eventName]) return eventName;
    var prefixMap = vendorPrefixes[eventName], styleProp;
    for(styleProp in prefixMap)if (prefixMap.hasOwnProperty(styleProp) && styleProp in style) return prefixedEventNames[eventName] = prefixMap[styleProp];
    return eventName;
}
var ANIMATION_END = getVendorPrefixedEventName("animationend"), ANIMATION_ITERATION = getVendorPrefixedEventName("animationiteration"), ANIMATION_START = getVendorPrefixedEventName("animationstart"), TRANSITION_RUN = getVendorPrefixedEventName("transitionrun"), TRANSITION_START = getVendorPrefixedEventName("transitionstart"), TRANSITION_CANCEL = getVendorPrefixedEventName("transitioncancel"), TRANSITION_END = getVendorPrefixedEventName("transitionend"), topLevelEventsToReactNames = new Map(), simpleEventPluginEvents = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
simpleEventPluginEvents.push("scrollEnd");
function registerSimpleEvent(domEventName, reactName) {
    topLevelEventsToReactNames.set(domEventName, reactName);
    registerTwoPhaseEvent(reactName, [
        domEventName
    ]);
}
var globalClientIdCounter$1 = 0;
function getViewTransitionName(props, instance) {
    if (null != props.name && "auto" !== props.name) return props.name;
    if (null !== instance.autoName) return instance.autoName;
    props = pendingEffectsRoot.identifierPrefix;
    var globalClientId = globalClientIdCounter$1++;
    props = "_" + props + "t_" + globalClientId.toString(32) + "_";
    return instance.autoName = props;
}
function getClassNameByType(classByType) {
    if (null == classByType || "string" === typeof classByType) return classByType;
    var className = null, activeTypes = pendingTransitionTypes;
    if (null !== activeTypes) for(var i = 0; i < activeTypes.length; i++){
        var match = classByType[activeTypes[i]];
        if (null != match) {
            if ("none" === match) return "none";
            className = null == className ? match : className + (" " + match);
        }
    }
    return null == className ? classByType.default : className;
}
function getViewTransitionClassName(defaultClass, eventClass) {
    defaultClass = getClassNameByType(defaultClass);
    eventClass = getClassNameByType(eventClass);
    return null == eventClass ? "auto" === defaultClass ? null : defaultClass : "auto" === eventClass ? null : eventClass;
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
}, concurrentQueues = [], concurrentQueuesIndex = 0, concurrentlyUpdatedLanes = 0;
function finishQueueingConcurrentUpdates() {
    for(var endIndex = concurrentQueuesIndex, i = concurrentlyUpdatedLanes = concurrentQueuesIndex = 0; i < endIndex;){
        var fiber = concurrentQueues[i];
        concurrentQueues[i++] = null;
        var queue = concurrentQueues[i];
        concurrentQueues[i++] = null;
        var update = concurrentQueues[i];
        concurrentQueues[i++] = null;
        var lane = concurrentQueues[i];
        concurrentQueues[i++] = null;
        if (null !== queue && null !== update) {
            var pending = queue.pending;
            null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
            queue.pending = update;
        }
        0 !== lane && markUpdateLaneFromFiberToRoot(fiber, update, lane);
    }
}
function enqueueUpdate$1(fiber, queue, update, lane) {
    concurrentQueues[concurrentQueuesIndex++] = fiber;
    concurrentQueues[concurrentQueuesIndex++] = queue;
    concurrentQueues[concurrentQueuesIndex++] = update;
    concurrentQueues[concurrentQueuesIndex++] = lane;
    concurrentlyUpdatedLanes |= lane;
    fiber.lanes |= lane;
    fiber = fiber.alternate;
    null !== fiber && (fiber.lanes |= lane);
}
function enqueueConcurrentHookUpdate(fiber, queue, update, lane) {
    enqueueUpdate$1(fiber, queue, update, lane);
    return getRootForUpdatedFiber(fiber);
}
function enqueueConcurrentRenderForLane(fiber, lane) {
    enqueueUpdate$1(fiber, null, null, lane);
    return getRootForUpdatedFiber(fiber);
}
function markUpdateLaneFromFiberToRoot(sourceFiber, update, lane) {
    sourceFiber.lanes |= lane;
    var alternate = sourceFiber.alternate;
    null !== alternate && (alternate.lanes |= lane);
    for(var isHidden = !1, parent = sourceFiber.return; null !== parent;)parent.childLanes |= lane, alternate = parent.alternate, null !== alternate && (alternate.childLanes |= lane), 22 === parent.tag && (sourceFiber = parent.stateNode, null === sourceFiber || sourceFiber._visibility & 1 || (isHidden = !0)), sourceFiber = parent, parent = parent.return;
    return 3 === sourceFiber.tag ? (parent = sourceFiber.stateNode, isHidden && null !== update && (isHidden = 31 - clz32(lane), sourceFiber = parent.hiddenUpdates, alternate = sourceFiber[isHidden], null === alternate ? sourceFiber[isHidden] = [
        update
    ] : alternate.push(update), update.lane = lane | 536870912), parent) : null;
}
function getRootForUpdatedFiber(sourceFiber) {
    if (50 < nestedUpdateCount) throw nestedUpdateCount = 0, rootWithNestedUpdates = null, Error(formatProdErrorMessage(185));
    for(var parent = sourceFiber.return; null !== parent;)sourceFiber = parent, parent = sourceFiber.return;
    return 3 === sourceFiber.tag ? sourceFiber.stateNode : null;
}
var emptyContextObject = {};
function FiberNode(tag, pendingProps, key, mode) {
    this.tag = tag;
    this.key = key;
    this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
    this.index = 0;
    this.refCleanup = this.ref = null;
    this.pendingProps = pendingProps;
    this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
    this.mode = mode;
    this.subtreeFlags = this.flags = 0;
    this.deletions = null;
    this.childLanes = this.lanes = 0;
    this.alternate = null;
}
function createFiberImplClass(tag, pendingProps, key, mode) {
    return new FiberNode(tag, pendingProps, key, mode);
}
function shouldConstruct(Component) {
    Component = Component.prototype;
    return !(!Component || !Component.isReactComponent);
}
function createWorkInProgress(current, pendingProps) {
    var workInProgress = current.alternate;
    null === workInProgress ? (workInProgress = createFiberImplClass(current.tag, pendingProps, current.key, current.mode), workInProgress.elementType = current.elementType, workInProgress.type = current.type, workInProgress.stateNode = current.stateNode, workInProgress.alternate = current, current.alternate = workInProgress) : (workInProgress.pendingProps = pendingProps, workInProgress.type = current.type, workInProgress.flags = 0, workInProgress.subtreeFlags = 0, workInProgress.deletions = null);
    workInProgress.flags = current.flags & 1206910976;
    workInProgress.childLanes = current.childLanes;
    workInProgress.lanes = current.lanes;
    workInProgress.child = current.child;
    workInProgress.memoizedProps = current.memoizedProps;
    workInProgress.memoizedState = current.memoizedState;
    workInProgress.updateQueue = current.updateQueue;
    pendingProps = current.dependencies;
    workInProgress.dependencies = null === pendingProps ? null : {
        lanes: pendingProps.lanes,
        firstContext: pendingProps.firstContext
    };
    workInProgress.sibling = current.sibling;
    workInProgress.index = current.index;
    workInProgress.ref = current.ref;
    workInProgress.refCleanup = current.refCleanup;
    return workInProgress;
}
function resetWorkInProgress(workInProgress, renderLanes) {
    workInProgress.flags &= 1206910978;
    var current = workInProgress.alternate;
    null === current ? (workInProgress.childLanes = 0, workInProgress.lanes = renderLanes, workInProgress.child = null, workInProgress.subtreeFlags = 0, workInProgress.memoizedProps = null, workInProgress.memoizedState = null, workInProgress.updateQueue = null, workInProgress.dependencies = null, workInProgress.stateNode = null) : (workInProgress.childLanes = current.childLanes, workInProgress.lanes = current.lanes, workInProgress.child = current.child, workInProgress.subtreeFlags = 0, workInProgress.deletions = null, workInProgress.memoizedProps = current.memoizedProps, workInProgress.memoizedState = current.memoizedState, workInProgress.updateQueue = current.updateQueue, workInProgress.type = current.type, renderLanes = current.dependencies, workInProgress.dependencies = null === renderLanes ? null : {
        lanes: renderLanes.lanes,
        firstContext: renderLanes.firstContext
    });
    return workInProgress;
}
function createFiberFromTypeAndProps(type, key, pendingProps, owner, mode, lanes) {
    var fiberTag = 0;
    owner = type;
    if ("function" === typeof owner) shouldConstruct(owner) && (fiberTag = 1);
    else if ("string" === typeof owner) fiberTag = isHostHoistableType(type, pendingProps, contextStackCursor.current) ? 26 : "html" === type || "head" === type || "body" === type ? 27 : 5;
    else a: switch(owner){
        case REACT_ACTIVITY_TYPE:
            return type = createFiberImplClass(31, pendingProps, key, mode), type.elementType = REACT_ACTIVITY_TYPE, type.lanes = lanes, type;
        case REACT_FRAGMENT_TYPE:
            return createFiberFromFragment(pendingProps.children, mode, lanes, key);
        case REACT_STRICT_MODE_TYPE:
            fiberTag = 8;
            mode |= 24;
            break;
        case REACT_PROFILER_TYPE:
            return type = createFiberImplClass(12, pendingProps, key, mode | 2), type.elementType = REACT_PROFILER_TYPE, type.lanes = lanes, type;
        case REACT_SUSPENSE_TYPE:
            return type = createFiberImplClass(13, pendingProps, key, mode), type.elementType = REACT_SUSPENSE_TYPE, type.lanes = lanes, type;
        case REACT_SUSPENSE_LIST_TYPE:
            return type = createFiberImplClass(19, pendingProps, key, mode), type.elementType = REACT_SUSPENSE_LIST_TYPE, type.lanes = lanes, type;
        case REACT_LEGACY_HIDDEN_TYPE:
        case REACT_VIEW_TRANSITION_TYPE:
            return type = mode | 32, type = createFiberImplClass(30, pendingProps, key, type), type.elementType = REACT_VIEW_TRANSITION_TYPE, type.lanes = lanes, type.stateNode = {
                autoName: null,
                paired: null,
                clones: null,
                ref: null
            }, type;
        default:
            if ("object" === typeof owner && null !== owner) switch(owner.$$typeof){
                case REACT_CONTEXT_TYPE:
                    fiberTag = 10;
                    break a;
                case REACT_CONSUMER_TYPE:
                    fiberTag = 9;
                    break a;
                case REACT_FORWARD_REF_TYPE:
                    fiberTag = 11;
                    break a;
                case REACT_MEMO_TYPE:
                    fiberTag = 14;
                    break a;
                case REACT_LAZY_TYPE:
                    fiberTag = 16;
                    owner = null;
                    break a;
            }
            fiberTag = 29;
            pendingProps = Error(formatProdErrorMessage(130, null === type ? "null" : typeof type, ""));
            owner = null;
    }
    key = createFiberImplClass(fiberTag, pendingProps, key, mode);
    key.elementType = type;
    key.type = owner;
    key.lanes = lanes;
    return key;
}
function createFiberFromFragment(elements, mode, lanes, key) {
    elements = createFiberImplClass(7, elements, key, mode);
    elements.lanes = lanes;
    return elements;
}
function createFiberFromText(content, mode, lanes) {
    content = createFiberImplClass(6, content, null, mode);
    content.lanes = lanes;
    return content;
}
function createFiberFromDehydratedFragment(dehydratedNode) {
    var fiber = createFiberImplClass(18, null, null, 0);
    fiber.stateNode = dehydratedNode;
    return fiber;
}
function createFiberFromPortal(portal, mode, lanes) {
    mode = createFiberImplClass(4, null !== portal.children ? portal.children : [], portal.key, mode);
    mode.lanes = lanes;
    mode.stateNode = {
        containerInfo: portal.containerInfo,
        pendingChildren: null,
        implementation: portal.implementation
    };
    return mode;
}
var CapturedStacks = new WeakMap();
function createCapturedValueAtFiber(value, source) {
    if ("object" === typeof value && null !== value) {
        var existing = CapturedStacks.get(value);
        if (void 0 !== existing) return existing;
        source = {
            value: value,
            source: source,
            stack: getStackByFiberInDevAndProd(source)
        };
        CapturedStacks.set(value, source);
        return source;
    }
    return {
        value: value,
        source: source,
        stack: getStackByFiberInDevAndProd(source)
    };
}
var forkStack = [], forkStackIndex = 0, treeForkProvider = null, treeForkCount = 0, idStack = [], idStackIndex = 0, treeContextProvider = null, treeContextId = 1, treeContextOverflow = "";
function pushTreeFork(workInProgress, totalChildren) {
    forkStack[forkStackIndex++] = treeForkCount;
    forkStack[forkStackIndex++] = treeForkProvider;
    treeForkProvider = workInProgress;
    treeForkCount = totalChildren;
}
function pushTreeId(workInProgress, totalChildren, index) {
    idStack[idStackIndex++] = treeContextId;
    idStack[idStackIndex++] = treeContextOverflow;
    idStack[idStackIndex++] = treeContextProvider;
    treeContextProvider = workInProgress;
    var baseIdWithLeadingBit = treeContextId;
    workInProgress = treeContextOverflow;
    var baseLength = 32 - clz32(baseIdWithLeadingBit) - 1;
    baseIdWithLeadingBit &= ~(1 << baseLength);
    index += 1;
    var length = 32 - clz32(totalChildren) + baseLength;
    if (30 < length) {
        var numberOfOverflowBits = baseLength - baseLength % 5;
        length = (baseIdWithLeadingBit & (1 << numberOfOverflowBits) - 1).toString(32);
        baseIdWithLeadingBit >>= numberOfOverflowBits;
        baseLength -= numberOfOverflowBits;
        treeContextId = 1 << 32 - clz32(totalChildren) + baseLength | index << baseLength | baseIdWithLeadingBit;
        treeContextOverflow = length + workInProgress;
    } else treeContextId = 1 << length | index << baseLength | baseIdWithLeadingBit, treeContextOverflow = workInProgress;
}
function pushMaterializedTreeId(workInProgress) {
    null !== workInProgress.return && (pushTreeFork(workInProgress, 1), pushTreeId(workInProgress, 1, 0));
}
function popTreeContext(workInProgress) {
    for(; workInProgress === treeForkProvider;)treeForkProvider = forkStack[--forkStackIndex], forkStack[forkStackIndex] = null, treeForkCount = forkStack[--forkStackIndex], forkStack[forkStackIndex] = null;
    for(; workInProgress === treeContextProvider;)treeContextProvider = idStack[--idStackIndex], idStack[idStackIndex] = null, treeContextOverflow = idStack[--idStackIndex], idStack[idStackIndex] = null, treeContextId = idStack[--idStackIndex], idStack[idStackIndex] = null;
}
function restoreSuspendedTreeContext(workInProgress, suspendedContext) {
    idStack[idStackIndex++] = treeContextId;
    idStack[idStackIndex++] = treeContextOverflow;
    idStack[idStackIndex++] = treeContextProvider;
    treeContextId = suspendedContext.id;
    treeContextOverflow = suspendedContext.overflow;
    treeContextProvider = workInProgress;
}
var hydrationParentFiber = null, nextHydratableInstance = null, isHydrating = !1, hydrationErrors = null, rootOrSingletonContext = !1, HydrationMismatchException = Error(formatProdErrorMessage(519));
function throwOnHydrationMismatch(fiber) {
    var error = Error(formatProdErrorMessage(418, 1 < arguments.length && void 0 !== arguments[1] && arguments[1] ? "text" : "HTML", ""));
    queueHydrationError(createCapturedValueAtFiber(error, fiber));
    throw HydrationMismatchException;
}
function prepareToHydrateHostInstance(fiber) {
    var instance = fiber.stateNode, type = fiber.type, props = fiber.memoizedProps;
    instance[internalInstanceKey] = fiber;
    instance[internalPropsKey] = props;
    switch(type){
        case "dialog":
            listenToNonDelegatedEvent("cancel", instance);
            listenToNonDelegatedEvent("close", instance);
            break;
        case "iframe":
        case "object":
        case "embed":
            listenToNonDelegatedEvent("load", instance);
            break;
        case "video":
        case "audio":
            for(type = 0; type < mediaEventTypes.length; type++)listenToNonDelegatedEvent(mediaEventTypes[type], instance);
            break;
        case "source":
            listenToNonDelegatedEvent("error", instance);
            break;
        case "img":
        case "image":
        case "link":
            listenToNonDelegatedEvent("error", instance);
            listenToNonDelegatedEvent("load", instance);
            break;
        case "details":
            listenToNonDelegatedEvent("toggle", instance);
            break;
        case "input":
            listenToNonDelegatedEvent("invalid", instance);
            initInput(instance, props.value, props.defaultValue, props.checked, props.defaultChecked, props.type, props.name, !0);
            break;
        case "select":
            listenToNonDelegatedEvent("invalid", instance);
            break;
        case "textarea":
            listenToNonDelegatedEvent("invalid", instance), initTextarea(instance, props.value, props.defaultValue, props.children);
    }
    type = props.children;
    "string" !== typeof type && "number" !== typeof type && "bigint" !== typeof type || instance.textContent === "" + type || !0 === props.suppressHydrationWarning || checkForUnmatchedText(instance.textContent, type) ? (null != props.popover && (listenToNonDelegatedEvent("beforetoggle", instance), listenToNonDelegatedEvent("toggle", instance)), null != props.onScroll && listenToNonDelegatedEvent("scroll", instance), null != props.onScrollEnd && listenToNonDelegatedEvent("scrollend", instance), null != props.onClick && (instance.onclick = noop$1), instance = !0) : instance = !1;
    instance || throwOnHydrationMismatch(fiber, !0);
}
function popToNextHostParent(fiber) {
    for(hydrationParentFiber = fiber.return; hydrationParentFiber;)switch(hydrationParentFiber.tag){
        case 5:
        case 31:
        case 13:
            rootOrSingletonContext = !1;
            return;
        case 27:
        case 3:
            rootOrSingletonContext = !0;
            return;
        default:
            hydrationParentFiber = hydrationParentFiber.return;
    }
}
function popHydrationState(fiber) {
    if (fiber !== hydrationParentFiber) return !1;
    if (!isHydrating) return popToNextHostParent(fiber), isHydrating = !0, !1;
    var tag = fiber.tag, JSCompiler_temp;
    if (JSCompiler_temp = 3 !== tag && 27 !== tag) {
        if (JSCompiler_temp = 5 === tag) JSCompiler_temp = fiber.type, JSCompiler_temp = !("form" !== JSCompiler_temp && "button" !== JSCompiler_temp) || shouldSetTextContent(fiber.type, fiber.memoizedProps);
        JSCompiler_temp = !JSCompiler_temp;
    }
    JSCompiler_temp && nextHydratableInstance && throwOnHydrationMismatch(fiber);
    popToNextHostParent(fiber);
    if (13 === tag) {
        fiber = fiber.memoizedState;
        fiber = null !== fiber ? fiber.dehydrated : null;
        if (!fiber) throw Error(formatProdErrorMessage(317));
        nextHydratableInstance = getNextHydratableInstanceAfterHydrationBoundary(fiber);
    } else if (31 === tag) {
        fiber = fiber.memoizedState;
        fiber = null !== fiber ? fiber.dehydrated : null;
        if (!fiber) throw Error(formatProdErrorMessage(317));
        nextHydratableInstance = getNextHydratableInstanceAfterHydrationBoundary(fiber);
    } else 27 === tag ? (tag = nextHydratableInstance, isSingletonScope(fiber.type) ? (fiber = previousHydratableOnEnteringScopedSingleton, previousHydratableOnEnteringScopedSingleton = null, nextHydratableInstance = fiber) : nextHydratableInstance = tag) : nextHydratableInstance = hydrationParentFiber ? getNextHydratable(fiber.stateNode.nextSibling) : null;
    return !0;
}
function resetHydrationState() {
    nextHydratableInstance = hydrationParentFiber = null;
    isHydrating = !1;
}
function upgradeHydrationErrorsToRecoverable() {
    var queuedErrors = hydrationErrors;
    null !== queuedErrors && (null === workInProgressRootRecoverableErrors ? workInProgressRootRecoverableErrors = queuedErrors : workInProgressRootRecoverableErrors.push.apply(workInProgressRootRecoverableErrors, queuedErrors), hydrationErrors = null);
    return queuedErrors;
}
function queueHydrationError(error) {
    null === hydrationErrors ? hydrationErrors = [
        error
    ] : hydrationErrors.push(error);
}
var valueCursor = createCursor(null), currentlyRenderingFiber$1 = null, lastContextDependency = null;
function pushProvider(providerFiber, context, nextValue) {
    push(valueCursor, context._currentValue);
    context._currentValue = nextValue;
}
function popProvider(context) {
    context._currentValue = valueCursor.current;
    pop(valueCursor);
}
function scheduleContextWorkOnParentPath(parent, renderLanes, propagationRoot) {
    for(; null !== parent;){
        var alternate = parent.alternate;
        (parent.childLanes & renderLanes) !== renderLanes ? (parent.childLanes |= renderLanes, null !== alternate && (alternate.childLanes |= renderLanes)) : null !== alternate && (alternate.childLanes & renderLanes) !== renderLanes && (alternate.childLanes |= renderLanes);
        if (parent === propagationRoot) break;
        parent = parent.return;
    }
}
function propagateContextChanges(workInProgress, contexts, renderLanes, forcePropagateEntireTree) {
    var fiber = workInProgress.child;
    null !== fiber && (fiber.return = workInProgress);
    for(; null !== fiber;){
        var list = fiber.dependencies;
        if (null !== list) {
            var nextFiber = fiber.child;
            list = list.firstContext;
            a: for(; null !== list;){
                var dependency = list;
                list = fiber;
                for(var i = 0; i < contexts.length; i++)if (dependency.context === contexts[i]) {
                    list.lanes |= renderLanes;
                    dependency = list.alternate;
                    null !== dependency && (dependency.lanes |= renderLanes);
                    scheduleContextWorkOnParentPath(list.return, renderLanes, workInProgress);
                    forcePropagateEntireTree || (nextFiber = null);
                    break a;
                }
                list = dependency.next;
            }
        } else if (18 === fiber.tag) {
            nextFiber = fiber.return;
            if (null === nextFiber) throw Error(formatProdErrorMessage(341));
            nextFiber.lanes |= renderLanes;
            list = nextFiber.alternate;
            null !== list && (list.lanes |= renderLanes);
            scheduleContextWorkOnParentPath(nextFiber, renderLanes, workInProgress);
            nextFiber = null;
        } else 13 === fiber.tag && null !== fiber.memoizedState && null === fiber.memoizedState.dehydrated ? (fiber.lanes |= renderLanes, nextFiber = fiber.alternate, null !== nextFiber && (nextFiber.lanes |= renderLanes), scheduleContextWorkOnParentPath(fiber.return, renderLanes, workInProgress), nextFiber = fiber.child, nextFiber = null !== nextFiber ? nextFiber.sibling : null) : nextFiber = fiber.child;
        if (null !== nextFiber) nextFiber.return = fiber;
        else for(nextFiber = fiber; null !== nextFiber;){
            if (nextFiber === workInProgress) {
                nextFiber = null;
                break;
            }
            fiber = nextFiber.sibling;
            if (null !== fiber) {
                fiber.return = nextFiber.return;
                nextFiber = fiber;
                break;
            }
            nextFiber = nextFiber.return;
        }
        fiber = nextFiber;
    }
}
function propagateParentContextChanges(current, workInProgress, renderLanes, forcePropagateEntireTree) {
    current = null;
    for(var parent = workInProgress, isInsidePropagationBailout = !1; null !== parent;){
        if (!isInsidePropagationBailout) {
            if (0 !== (parent.flags & 524288)) isInsidePropagationBailout = !0;
            else if (0 !== (parent.flags & 262144)) break;
        }
        if (10 === parent.tag) {
            var currentParent = parent.alternate;
            if (null === currentParent) throw Error(formatProdErrorMessage(387));
            currentParent = currentParent.memoizedProps;
            if (null !== currentParent) {
                var context = parent.type;
                objectIs(parent.pendingProps.value, currentParent.value) || (null !== current ? current.push(context) : current = [
                    context
                ]);
            }
        } else if (parent === hostTransitionProviderCursor.current) {
            currentParent = parent.alternate;
            if (null === currentParent) throw Error(formatProdErrorMessage(387));
            currentParent.memoizedState.memoizedState !== parent.memoizedState.memoizedState && (null !== current ? current.push(HostTransitionContext) : current = [
                HostTransitionContext
            ]);
        }
        parent = parent.return;
    }
    null !== current && propagateContextChanges(workInProgress, current, renderLanes, forcePropagateEntireTree);
    workInProgress.flags |= 262144;
    return null !== current;
}
function checkIfContextChanged(currentDependencies) {
    for(currentDependencies = currentDependencies.firstContext; null !== currentDependencies;){
        if (!objectIs(currentDependencies.context._currentValue, currentDependencies.memoizedValue)) return !0;
        currentDependencies = currentDependencies.next;
    }
    return !1;
}
function prepareToReadContext(workInProgress) {
    currentlyRenderingFiber$1 = workInProgress;
    lastContextDependency = null;
    workInProgress = workInProgress.dependencies;
    null !== workInProgress && (workInProgress.firstContext = null);
}
function readContext(context) {
    return readContextForConsumer(currentlyRenderingFiber$1, context);
}
function readContextDuringReconciliation(consumer, context) {
    null === currentlyRenderingFiber$1 && prepareToReadContext(consumer);
    return readContextForConsumer(consumer, context);
}
function readContextForConsumer(consumer, context) {
    var value = context._currentValue;
    context = {
        context: context,
        memoizedValue: value,
        next: null
    };
    if (null === lastContextDependency) {
        if (null === consumer) throw Error(formatProdErrorMessage(308));
        lastContextDependency = context;
        consumer.dependencies = {
            lanes: 0,
            firstContext: context
        };
        consumer.flags |= 524288;
    } else lastContextDependency = lastContextDependency.next = context;
    return value;
}
var AbortControllerLocal = "undefined" !== typeof AbortController ? AbortController : function() {
    var listeners = [], signal = this.signal = {
        aborted: !1,
        addEventListener: function(type, listener) {
            listeners.push(listener);
        }
    };
    this.abort = function() {
        signal.aborted = !0;
        listeners.forEach(function(listener) {
            return listener();
        });
    };
}, scheduleCallback$2 = Scheduler.unstable_scheduleCallback, NormalPriority = Scheduler.unstable_NormalPriority, CacheContext = {
    $$typeof: REACT_CONTEXT_TYPE,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
};
function createCache() {
    return {
        controller: new AbortControllerLocal(),
        data: new Map(),
        refCount: 0
    };
}
function releaseCache(cache) {
    cache.refCount--;
    0 === cache.refCount && scheduleCallback$2(NormalPriority, function() {
        cache.controller.abort();
    });
}
function queueTransitionTypes(root, transitionTypes) {
    if (0 !== (root.pendingLanes & 4194048)) {
        var queued = root.transitionTypes;
        null === queued && (queued = root.transitionTypes = []);
        for(root = 0; root < transitionTypes.length; root++){
            var transitionType = transitionTypes[root];
            -1 === queued.indexOf(transitionType) && queued.push(transitionType);
        }
    }
}
var entangledTransitionTypes = null;
function claimQueuedTransitionTypes(root) {
    var claimed = root.transitionTypes;
    root.transitionTypes = null;
    return claimed;
}
var currentEntangledListeners = null, currentEntangledPendingCount = 0, currentEntangledLane = 0, currentEntangledActionThenable = null;
function entangleAsyncAction(transition, thenable) {
    if (null === currentEntangledListeners) {
        var entangledListeners = currentEntangledListeners = [];
        currentEntangledPendingCount = 0;
        currentEntangledLane = requestTransitionLane();
        currentEntangledActionThenable = {
            status: "pending",
            value: void 0,
            then: function(resolve) {
                entangledListeners.push(resolve);
            }
        };
    }
    currentEntangledPendingCount++;
    thenable.then(pingEngtangledActionScope, pingEngtangledActionScope);
    return thenable;
}
function pingEngtangledActionScope() {
    if (0 === --currentEntangledPendingCount && (entangledTransitionTypes = null, null !== currentEntangledListeners)) {
        null !== currentEntangledActionThenable && (currentEntangledActionThenable.status = "fulfilled");
        var listeners = currentEntangledListeners;
        currentEntangledListeners = null;
        currentEntangledLane = 0;
        currentEntangledActionThenable = null;
        for(var i = 0; i < listeners.length; i++)(0, listeners[i])();
    }
}
function chainThenableValue(thenable, result) {
    var listeners = [], thenableWithOverride = {
        status: "pending",
        value: null,
        reason: null,
        then: function(resolve) {
            listeners.push(resolve);
        }
    };
    thenable.then(function() {
        thenableWithOverride.status = "fulfilled";
        thenableWithOverride.value = result;
        for(var i = 0; i < listeners.length; i++)(0, listeners[i])(result);
    }, function(error) {
        thenableWithOverride.status = "rejected";
        thenableWithOverride.reason = error;
        for(error = 0; error < listeners.length; error++)(0, listeners[error])(void 0);
    });
    return thenableWithOverride;
}
var prevOnStartTransitionFinish = ReactSharedInternals.S;
ReactSharedInternals.S = function(transition, returnValue) {
    globalMostRecentTransitionTime = now();
    "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && entangleAsyncAction(transition, returnValue);
    if (null !== entangledTransitionTypes) for(var root$28 = firstScheduledRoot; null !== root$28;)queueTransitionTypes(root$28, entangledTransitionTypes), root$28 = root$28.next;
    root$28 = transition.types;
    if (null !== root$28) {
        for(var root$29 = firstScheduledRoot; null !== root$29;)queueTransitionTypes(root$29, root$28), root$29 = root$29.next;
        if (0 !== currentEntangledLane) {
            root$29 = entangledTransitionTypes;
            null === root$29 && (root$29 = entangledTransitionTypes = []);
            for(var i = 0; i < root$28.length; i++){
                var transitionType = root$28[i];
                -1 === root$29.indexOf(transitionType) && root$29.push(transitionType);
            }
        }
    }
    null !== prevOnStartTransitionFinish && prevOnStartTransitionFinish(transition, returnValue);
};
var resumedCache = createCursor(null);
function peekCacheFromPool() {
    var cacheResumedFromPreviousRender = resumedCache.current;
    return null !== cacheResumedFromPreviousRender ? cacheResumedFromPreviousRender : workInProgressRoot.pooledCache;
}
function pushTransition(offscreenWorkInProgress, prevCachePool) {
    null === prevCachePool ? push(resumedCache, resumedCache.current) : push(resumedCache, prevCachePool.pool);
}
function getSuspendedCache() {
    var cacheFromPool = peekCacheFromPool();
    return null === cacheFromPool ? null : {
        parent: CacheContext._currentValue,
        pool: cacheFromPool
    };
}
var SuspenseException = Error(formatProdErrorMessage(460)), SuspenseyCommitException = Error(formatProdErrorMessage(474)), SuspenseActionException = Error(formatProdErrorMessage(542)), noopSuspenseyCommitThenable = {
    then: function() {}
};
function isThenableResolved(thenable) {
    thenable = thenable.status;
    return "fulfilled" === thenable || "rejected" === thenable;
}
function trackUsedThenable(thenableState, thenable, index) {
    index = thenableState[index];
    void 0 === index ? thenableState.push(thenable) : index !== thenable && (thenable.then(noop$1, noop$1), thenable = index);
    switch(thenable.status){
        case "fulfilled":
            return thenable.value;
        case "rejected":
            thenableState = thenable.reason;
            checkIfUseWrappedInAsyncCatch(thenableState);
            if (void 0 === thenableState && !("reason" in thenable)) throw Error(formatProdErrorMessage(600));
            throw thenableState;
        default:
            if ("string" === typeof thenable.status) thenable.then(noop$1, noop$1);
            else {
                thenableState = workInProgressRoot;
                if (null !== thenableState && 100 < thenableState.shellSuspendCounter) throw Error(formatProdErrorMessage(482));
                thenableState = thenable;
                thenableState.status = "pending";
                thenableState.then(function(fulfilledValue) {
                    if ("pending" === thenable.status) {
                        var fulfilledThenable = thenable;
                        fulfilledThenable.status = "fulfilled";
                        fulfilledThenable.value = fulfilledValue;
                    }
                }, function(error) {
                    if ("pending" === thenable.status) {
                        var rejectedThenable = thenable;
                        rejectedThenable.status = "rejected";
                        rejectedThenable.reason = error;
                    }
                });
            }
            switch(thenable.status){
                case "fulfilled":
                    return thenable.value;
                case "rejected":
                    throw thenableState = thenable.reason, checkIfUseWrappedInAsyncCatch(thenableState), thenableState;
            }
            suspendedThenable = thenable;
            throw SuspenseException;
    }
}
function resolveLazy(lazyType) {
    try {
        var init = lazyType._init;
        return init(lazyType._payload);
    } catch (x) {
        if (null !== x && "object" === typeof x && "function" === typeof x.then) throw suspendedThenable = x, SuspenseException;
        throw x;
    }
}
var suspendedThenable = null;
function getSuspendedThenable() {
    if (null === suspendedThenable) throw Error(formatProdErrorMessage(459));
    var thenable = suspendedThenable;
    suspendedThenable = null;
    return thenable;
}
function checkIfUseWrappedInAsyncCatch(rejectedReason) {
    if (rejectedReason === SuspenseException || rejectedReason === SuspenseActionException) throw Error(formatProdErrorMessage(483));
}
var thenableState$1 = null, thenableIndexCounter$1 = 0;
function unwrapThenable(thenable) {
    var index = thenableIndexCounter$1;
    thenableIndexCounter$1 += 1;
    null === thenableState$1 && (thenableState$1 = []);
    return trackUsedThenable(thenableState$1, thenable, index);
}
function coerceRef(workInProgress, element) {
    element = element.props.ref;
    workInProgress.ref = void 0 !== element ? element : null;
}
function throwOnInvalidObjectTypeImpl(returnFiber, newChild) {
    if (newChild.$$typeof === REACT_LEGACY_ELEMENT_TYPE) throw Error(formatProdErrorMessage(525));
    returnFiber = Object.prototype.toString.call(newChild);
    throw Error(formatProdErrorMessage(31, "[object Object]" === returnFiber ? "object with keys {" + Object.keys(newChild).join(", ") + "}" : returnFiber));
}
function createChildReconciler(shouldTrackSideEffects) {
    function deleteChild(returnFiber, childToDelete) {
        if (shouldTrackSideEffects) {
            var deletions = returnFiber.deletions;
            null === deletions ? (returnFiber.deletions = [
                childToDelete
            ], returnFiber.flags |= 16) : deletions.push(childToDelete);
        }
    }
    function deleteRemainingChildren(returnFiber, currentFirstChild) {
        if (!shouldTrackSideEffects) return null;
        for(; null !== currentFirstChild;)deleteChild(returnFiber, currentFirstChild), currentFirstChild = currentFirstChild.sibling;
        return null;
    }
    function mapRemainingChildren(currentFirstChild) {
        for(var existingChildren = new Map(); null !== currentFirstChild;)null === currentFirstChild.key ? existingChildren.set(currentFirstChild.index, currentFirstChild) : existingChildren.set(currentFirstChild.key, currentFirstChild), currentFirstChild = currentFirstChild.sibling;
        return existingChildren;
    }
    function useFiber(fiber, pendingProps) {
        fiber = createWorkInProgress(fiber, pendingProps);
        fiber.index = 0;
        fiber.sibling = null;
        return fiber;
    }
    function placeChild(newFiber, lastPlacedIndex, newIndex) {
        newFiber.index = newIndex;
        if (!shouldTrackSideEffects) return newFiber.flags |= 1048576, lastPlacedIndex;
        newIndex = newFiber.alternate;
        if (null !== newIndex) return newIndex = newIndex.index, newIndex < lastPlacedIndex ? (newFiber.flags |= 2, lastPlacedIndex) : newIndex;
        newFiber.flags |= 134217730;
        return lastPlacedIndex;
    }
    function placeSingleChild(newFiber) {
        shouldTrackSideEffects && null === newFiber.alternate && (newFiber.flags |= 134217730);
        return newFiber;
    }
    function updateTextNode(returnFiber, current, textContent, lanes) {
        if (null === current || 6 !== current.tag) return current = createFiberFromText(textContent, returnFiber.mode, lanes), current.return = returnFiber, current;
        current = useFiber(current, textContent);
        current.return = returnFiber;
        return current;
    }
    function updateElement(returnFiber, current, element, lanes) {
        var elementType = element.type;
        if (elementType === REACT_FRAGMENT_TYPE) return returnFiber = updateFragment(returnFiber, current, element.props.children, lanes, element.key), coerceRef(returnFiber, element), returnFiber;
        if (null !== current && (current.elementType === elementType || "object" === typeof elementType && null !== elementType && elementType.$$typeof === REACT_LAZY_TYPE && resolveLazy(elementType) === current.type)) return current = useFiber(current, element.props), coerceRef(current, element), current.return = returnFiber, current;
        current = createFiberFromTypeAndProps(element.type, element.key, element.props, null, returnFiber.mode, lanes);
        coerceRef(current, element);
        current.return = returnFiber;
        return current;
    }
    function updatePortal(returnFiber, current, portal, lanes) {
        if (null === current || 4 !== current.tag || current.stateNode.containerInfo !== portal.containerInfo || current.stateNode.implementation !== portal.implementation) return current = createFiberFromPortal(portal, returnFiber.mode, lanes), current.return = returnFiber, current;
        current = useFiber(current, portal.children || []);
        current.return = returnFiber;
        return current;
    }
    function updateFragment(returnFiber, current, fragment, lanes, key) {
        if (null === current || 7 !== current.tag) return current = createFiberFromFragment(fragment, returnFiber.mode, lanes, key), current.return = returnFiber, current;
        current = useFiber(current, fragment);
        current.return = returnFiber;
        return current;
    }
    function createChild(returnFiber, newChild, lanes) {
        if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild) return newChild = createFiberFromText("" + newChild, returnFiber.mode, lanes), newChild.return = returnFiber, newChild;
        if ("object" === typeof newChild && null !== newChild) {
            switch(newChild.$$typeof){
                case REACT_ELEMENT_TYPE:
                    return lanes = createFiberFromTypeAndProps(newChild.type, newChild.key, newChild.props, null, returnFiber.mode, lanes), coerceRef(lanes, newChild), lanes.return = returnFiber, lanes;
                case REACT_PORTAL_TYPE:
                    return newChild = createFiberFromPortal(newChild, returnFiber.mode, lanes), newChild.return = returnFiber, newChild;
                case REACT_LAZY_TYPE:
                    return newChild = resolveLazy(newChild), createChild(returnFiber, newChild, lanes);
            }
            if (isArrayImpl(newChild) || getIteratorFn(newChild)) return newChild = createFiberFromFragment(newChild, returnFiber.mode, lanes, null), newChild.return = returnFiber, newChild;
            if ("function" === typeof newChild.then) return createChild(returnFiber, unwrapThenable(newChild), lanes);
            if (newChild.$$typeof === REACT_CONTEXT_TYPE) return createChild(returnFiber, readContextDuringReconciliation(returnFiber, newChild), lanes);
            throwOnInvalidObjectTypeImpl(returnFiber, newChild);
        }
        return null;
    }
    function updateSlot(returnFiber, oldFiber, newChild, lanes) {
        var key = null !== oldFiber ? oldFiber.key : null;
        if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild) return null !== key ? null : updateTextNode(returnFiber, oldFiber, "" + newChild, lanes);
        if ("object" === typeof newChild && null !== newChild) {
            switch(newChild.$$typeof){
                case REACT_ELEMENT_TYPE:
                    return newChild.key === key ? updateElement(returnFiber, oldFiber, newChild, lanes) : null;
                case REACT_PORTAL_TYPE:
                    return newChild.key === key ? updatePortal(returnFiber, oldFiber, newChild, lanes) : null;
                case REACT_LAZY_TYPE:
                    return newChild = resolveLazy(newChild), updateSlot(returnFiber, oldFiber, newChild, lanes);
            }
            if (isArrayImpl(newChild) || getIteratorFn(newChild)) return null !== key ? null : updateFragment(returnFiber, oldFiber, newChild, lanes, null);
            if ("function" === typeof newChild.then) return updateSlot(returnFiber, oldFiber, unwrapThenable(newChild), lanes);
            if (newChild.$$typeof === REACT_CONTEXT_TYPE) return updateSlot(returnFiber, oldFiber, readContextDuringReconciliation(returnFiber, newChild), lanes);
            throwOnInvalidObjectTypeImpl(returnFiber, newChild);
        }
        return null;
    }
    function updateFromMap(existingChildren, returnFiber, newIdx, newChild, lanes) {
        if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild) return existingChildren = existingChildren.get(newIdx) || null, updateTextNode(returnFiber, existingChildren, "" + newChild, lanes);
        if ("object" === typeof newChild && null !== newChild) {
            switch(newChild.$$typeof){
                case REACT_ELEMENT_TYPE:
                    return existingChildren = existingChildren.get(null === newChild.key ? newIdx : newChild.key) || null, updateElement(returnFiber, existingChildren, newChild, lanes);
                case REACT_PORTAL_TYPE:
                    return existingChildren = existingChildren.get(null === newChild.key ? newIdx : newChild.key) || null, updatePortal(returnFiber, existingChildren, newChild, lanes);
                case REACT_LAZY_TYPE:
                    return newChild = resolveLazy(newChild), updateFromMap(existingChildren, returnFiber, newIdx, newChild, lanes);
            }
            if (isArrayImpl(newChild) || getIteratorFn(newChild)) return existingChildren = existingChildren.get(newIdx) || null, updateFragment(returnFiber, existingChildren, newChild, lanes, null);
            if ("function" === typeof newChild.then) return updateFromMap(existingChildren, returnFiber, newIdx, unwrapThenable(newChild), lanes);
            if (newChild.$$typeof === REACT_CONTEXT_TYPE) return updateFromMap(existingChildren, returnFiber, newIdx, readContextDuringReconciliation(returnFiber, newChild), lanes);
            throwOnInvalidObjectTypeImpl(returnFiber, newChild);
        }
        return null;
    }
    function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, lanes) {
        for(var resultingFirstChild = null, previousNewFiber = null, oldFiber = currentFirstChild, newIdx = currentFirstChild = 0, nextOldFiber = null; null !== oldFiber && newIdx < newChildren.length; newIdx++){
            oldFiber.index > newIdx ? (nextOldFiber = oldFiber, oldFiber = null) : nextOldFiber = oldFiber.sibling;
            var newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx], lanes);
            if (null === newFiber) {
                null === oldFiber && (oldFiber = nextOldFiber);
                break;
            }
            shouldTrackSideEffects && oldFiber && null === newFiber.alternate && deleteChild(returnFiber, oldFiber);
            currentFirstChild = placeChild(newFiber, currentFirstChild, newIdx);
            null === previousNewFiber ? resultingFirstChild = newFiber : previousNewFiber.sibling = newFiber;
            previousNewFiber = newFiber;
            oldFiber = nextOldFiber;
        }
        if (newIdx === newChildren.length) return deleteRemainingChildren(returnFiber, oldFiber), isHydrating && pushTreeFork(returnFiber, newIdx), resultingFirstChild;
        if (null === oldFiber) {
            for(; newIdx < newChildren.length; newIdx++)oldFiber = createChild(returnFiber, newChildren[newIdx], lanes), null !== oldFiber && (currentFirstChild = placeChild(oldFiber, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = oldFiber : previousNewFiber.sibling = oldFiber, previousNewFiber = oldFiber);
            isHydrating && pushTreeFork(returnFiber, newIdx);
            return resultingFirstChild;
        }
        for(oldFiber = mapRemainingChildren(oldFiber); newIdx < newChildren.length; newIdx++)nextOldFiber = updateFromMap(oldFiber, returnFiber, newIdx, newChildren[newIdx], lanes), null !== nextOldFiber && (shouldTrackSideEffects && (newFiber = nextOldFiber.alternate, null !== newFiber && oldFiber.delete(null === newFiber.key ? newIdx : newFiber.key)), currentFirstChild = placeChild(nextOldFiber, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = nextOldFiber : previousNewFiber.sibling = nextOldFiber, previousNewFiber = nextOldFiber);
        shouldTrackSideEffects && oldFiber.forEach(function(child) {
            return deleteChild(returnFiber, child);
        });
        isHydrating && pushTreeFork(returnFiber, newIdx);
        return resultingFirstChild;
    }
    function reconcileChildrenIterator(returnFiber, currentFirstChild, newChildren, lanes) {
        if (null == newChildren) throw Error(formatProdErrorMessage(151));
        for(var resultingFirstChild = null, previousNewFiber = null, oldFiber = currentFirstChild, newIdx = currentFirstChild = 0, nextOldFiber = null, step = newChildren.next(); null !== oldFiber && !step.done; newIdx++, step = newChildren.next()){
            oldFiber.index > newIdx ? (nextOldFiber = oldFiber, oldFiber = null) : nextOldFiber = oldFiber.sibling;
            var newFiber = updateSlot(returnFiber, oldFiber, step.value, lanes);
            if (null === newFiber) {
                null === oldFiber && (oldFiber = nextOldFiber);
                break;
            }
            shouldTrackSideEffects && oldFiber && null === newFiber.alternate && deleteChild(returnFiber, oldFiber);
            currentFirstChild = placeChild(newFiber, currentFirstChild, newIdx);
            null === previousNewFiber ? resultingFirstChild = newFiber : previousNewFiber.sibling = newFiber;
            previousNewFiber = newFiber;
            oldFiber = nextOldFiber;
        }
        if (step.done) return deleteRemainingChildren(returnFiber, oldFiber), isHydrating && pushTreeFork(returnFiber, newIdx), resultingFirstChild;
        if (null === oldFiber) {
            for(; !step.done; newIdx++, step = newChildren.next())step = createChild(returnFiber, step.value, lanes), null !== step && (currentFirstChild = placeChild(step, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = step : previousNewFiber.sibling = step, previousNewFiber = step);
            isHydrating && pushTreeFork(returnFiber, newIdx);
            return resultingFirstChild;
        }
        for(oldFiber = mapRemainingChildren(oldFiber); !step.done; newIdx++, step = newChildren.next())step = updateFromMap(oldFiber, returnFiber, newIdx, step.value, lanes), null !== step && (shouldTrackSideEffects && (nextOldFiber = step.alternate, null !== nextOldFiber && oldFiber.delete(null === nextOldFiber.key ? newIdx : nextOldFiber.key)), currentFirstChild = placeChild(step, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = step : previousNewFiber.sibling = step, previousNewFiber = step);
        shouldTrackSideEffects && oldFiber.forEach(function(child) {
            return deleteChild(returnFiber, child);
        });
        isHydrating && pushTreeFork(returnFiber, newIdx);
        return resultingFirstChild;
    }
    function reconcileChildFibersImpl(returnFiber, currentFirstChild, newChild, lanes) {
        "object" === typeof newChild && null !== newChild && newChild.type === REACT_FRAGMENT_TYPE && null === newChild.key && void 0 === newChild.props.ref && (newChild = newChild.props.children);
        if ("object" === typeof newChild && null !== newChild) {
            switch(newChild.$$typeof){
                case REACT_ELEMENT_TYPE:
                    a: {
                        for(var key = newChild.key; null !== currentFirstChild;){
                            if (currentFirstChild.key === key) {
                                key = newChild.type;
                                if (key === REACT_FRAGMENT_TYPE) {
                                    if (7 === currentFirstChild.tag) {
                                        deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
                                        lanes = useFiber(currentFirstChild, newChild.props.children);
                                        coerceRef(lanes, newChild);
                                        lanes.return = returnFiber;
                                        returnFiber = lanes;
                                        break a;
                                    }
                                } else if (currentFirstChild.elementType === key || "object" === typeof key && null !== key && key.$$typeof === REACT_LAZY_TYPE && resolveLazy(key) === currentFirstChild.type) {
                                    deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
                                    lanes = useFiber(currentFirstChild, newChild.props);
                                    coerceRef(lanes, newChild);
                                    lanes.return = returnFiber;
                                    returnFiber = lanes;
                                    break a;
                                }
                                deleteRemainingChildren(returnFiber, currentFirstChild);
                                break;
                            } else deleteChild(returnFiber, currentFirstChild);
                            currentFirstChild = currentFirstChild.sibling;
                        }
                        newChild.type === REACT_FRAGMENT_TYPE ? (lanes = createFiberFromFragment(newChild.props.children, returnFiber.mode, lanes, newChild.key), coerceRef(lanes, newChild), lanes.return = returnFiber, returnFiber = lanes) : (lanes = createFiberFromTypeAndProps(newChild.type, newChild.key, newChild.props, null, returnFiber.mode, lanes), coerceRef(lanes, newChild), lanes.return = returnFiber, returnFiber = lanes);
                    }
                    return placeSingleChild(returnFiber);
                case REACT_PORTAL_TYPE:
                    a: {
                        for(key = newChild.key; null !== currentFirstChild;){
                            if (currentFirstChild.key === key) if (4 === currentFirstChild.tag && currentFirstChild.stateNode.containerInfo === newChild.containerInfo && currentFirstChild.stateNode.implementation === newChild.implementation) {
                                deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
                                lanes = useFiber(currentFirstChild, newChild.children || []);
                                lanes.return = returnFiber;
                                returnFiber = lanes;
                                break a;
                            } else {
                                deleteRemainingChildren(returnFiber, currentFirstChild);
                                break;
                            }
                            else deleteChild(returnFiber, currentFirstChild);
                            currentFirstChild = currentFirstChild.sibling;
                        }
                        lanes = createFiberFromPortal(newChild, returnFiber.mode, lanes);
                        lanes.return = returnFiber;
                        returnFiber = lanes;
                    }
                    return placeSingleChild(returnFiber);
                case REACT_LAZY_TYPE:
                    return newChild = resolveLazy(newChild), reconcileChildFibersImpl(returnFiber, currentFirstChild, newChild, lanes);
            }
            if (isArrayImpl(newChild)) return reconcileChildrenArray(returnFiber, currentFirstChild, newChild, lanes);
            if (getIteratorFn(newChild)) {
                key = getIteratorFn(newChild);
                if ("function" !== typeof key) throw Error(formatProdErrorMessage(150));
                newChild = key.call(newChild);
                return reconcileChildrenIterator(returnFiber, currentFirstChild, newChild, lanes);
            }
            if ("function" === typeof newChild.then) return reconcileChildFibersImpl(returnFiber, currentFirstChild, unwrapThenable(newChild), lanes);
            if (newChild.$$typeof === REACT_CONTEXT_TYPE) return reconcileChildFibersImpl(returnFiber, currentFirstChild, readContextDuringReconciliation(returnFiber, newChild), lanes);
            throwOnInvalidObjectTypeImpl(returnFiber, newChild);
        }
        return "string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild ? (newChild = "" + newChild, null !== currentFirstChild && 6 === currentFirstChild.tag ? (deleteRemainingChildren(returnFiber, currentFirstChild.sibling), lanes = useFiber(currentFirstChild, newChild), lanes.return = returnFiber, returnFiber = lanes) : (deleteRemainingChildren(returnFiber, currentFirstChild), lanes = createFiberFromText(newChild, returnFiber.mode, lanes), lanes.return = returnFiber, returnFiber = lanes), placeSingleChild(returnFiber)) : deleteRemainingChildren(returnFiber, currentFirstChild);
    }
    return function(returnFiber, currentFirstChild, newChild, lanes) {
        try {
            thenableIndexCounter$1 = 0;
            var firstChildFiber = reconcileChildFibersImpl(returnFiber, currentFirstChild, newChild, lanes);
            thenableState$1 = null;
            return firstChildFiber;
        } catch (x) {
            if (x === SuspenseException || x === SuspenseActionException) throw x;
            var fiber = createFiberImplClass(29, x, null, returnFiber.mode);
            fiber.lanes = lanes;
            fiber.return = returnFiber;
            return fiber;
        } finally{}
    };
}
var reconcileChildFibers = createChildReconciler(!0), mountChildFibers = createChildReconciler(!1), hasForceUpdate = !1;
function initializeUpdateQueue(fiber) {
    fiber.updateQueue = {
        baseState: fiber.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
            pending: null,
            lanes: 0,
            hiddenCallbacks: null
        },
        callbacks: null
    };
}
function cloneUpdateQueue(current, workInProgress) {
    current = current.updateQueue;
    workInProgress.updateQueue === current && (workInProgress.updateQueue = {
        baseState: current.baseState,
        firstBaseUpdate: current.firstBaseUpdate,
        lastBaseUpdate: current.lastBaseUpdate,
        shared: current.shared,
        callbacks: null
    });
}
function createUpdate(lane) {
    return {
        lane: lane,
        tag: 0,
        payload: null,
        callback: null,
        next: null
    };
}
function enqueueUpdate(fiber, update, lane) {
    var updateQueue = fiber.updateQueue;
    if (null === updateQueue) return null;
    updateQueue = updateQueue.shared;
    if (0 !== (executionContext & 2)) {
        var pending = updateQueue.pending;
        null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
        updateQueue.pending = update;
        update = getRootForUpdatedFiber(fiber);
        markUpdateLaneFromFiberToRoot(fiber, null, lane);
        return update;
    }
    enqueueUpdate$1(fiber, updateQueue, update, lane);
    return getRootForUpdatedFiber(fiber);
}
function entangleTransitions(root, fiber, lane) {
    fiber = fiber.updateQueue;
    if (null !== fiber && (fiber = fiber.shared, 0 !== (lane & 4194048))) {
        var queueLanes = fiber.lanes;
        queueLanes &= root.pendingLanes;
        lane |= queueLanes;
        fiber.lanes = lane;
        markRootEntangled(root, lane);
    }
}
function enqueueCapturedUpdate(workInProgress, capturedUpdate) {
    var queue = workInProgress.updateQueue, current = workInProgress.alternate;
    if (null !== current && (current = current.updateQueue, queue === current)) {
        var newFirst = null, newLast = null;
        queue = queue.firstBaseUpdate;
        if (null !== queue) {
            do {
                var clone = {
                    lane: queue.lane,
                    tag: queue.tag,
                    payload: queue.payload,
                    callback: null,
                    next: null
                };
                null === newLast ? newFirst = newLast = clone : newLast = newLast.next = clone;
                queue = queue.next;
            }while (null !== queue)
            null === newLast ? newFirst = newLast = capturedUpdate : newLast = newLast.next = capturedUpdate;
        } else newFirst = newLast = capturedUpdate;
        queue = {
            baseState: current.baseState,
            firstBaseUpdate: newFirst,
            lastBaseUpdate: newLast,
            shared: current.shared,
            callbacks: current.callbacks
        };
        workInProgress.updateQueue = queue;
        return;
    }
    workInProgress = queue.lastBaseUpdate;
    null === workInProgress ? queue.firstBaseUpdate = capturedUpdate : workInProgress.next = capturedUpdate;
    queue.lastBaseUpdate = capturedUpdate;
}
var didReadFromEntangledAsyncAction = !1;
function suspendIfUpdateReadFromEntangledAsyncAction() {
    if (didReadFromEntangledAsyncAction) {
        var entangledActionThenable = currentEntangledActionThenable;
        if (null !== entangledActionThenable) throw entangledActionThenable;
    }
}
function processUpdateQueue(workInProgress$jscomp$0, props, instance$jscomp$0, renderLanes) {
    didReadFromEntangledAsyncAction = !1;
    var queue = workInProgress$jscomp$0.updateQueue;
    hasForceUpdate = !1;
    var firstBaseUpdate = queue.firstBaseUpdate, lastBaseUpdate = queue.lastBaseUpdate, pendingQueue = queue.shared.pending;
    if (null !== pendingQueue) {
        queue.shared.pending = null;
        var lastPendingUpdate = pendingQueue, firstPendingUpdate = lastPendingUpdate.next;
        lastPendingUpdate.next = null;
        null === lastBaseUpdate ? firstBaseUpdate = firstPendingUpdate : lastBaseUpdate.next = firstPendingUpdate;
        lastBaseUpdate = lastPendingUpdate;
        var current = workInProgress$jscomp$0.alternate;
        null !== current && (current = current.updateQueue, pendingQueue = current.lastBaseUpdate, pendingQueue !== lastBaseUpdate && (null === pendingQueue ? current.firstBaseUpdate = firstPendingUpdate : pendingQueue.next = firstPendingUpdate, current.lastBaseUpdate = lastPendingUpdate));
    }
    if (null !== firstBaseUpdate) {
        var newState = queue.baseState;
        lastBaseUpdate = 0;
        current = firstPendingUpdate = lastPendingUpdate = null;
        pendingQueue = firstBaseUpdate;
        do {
            var updateLane = pendingQueue.lane & -536870913, isHiddenUpdate = updateLane !== pendingQueue.lane;
            if (isHiddenUpdate ? (workInProgressRootRenderLanes & updateLane) === updateLane : (renderLanes & updateLane) === updateLane) {
                0 !== updateLane && updateLane === currentEntangledLane && (didReadFromEntangledAsyncAction = !0);
                null !== current && (current = current.next = {
                    lane: 0,
                    tag: pendingQueue.tag,
                    payload: pendingQueue.payload,
                    callback: null,
                    next: null
                });
                a: {
                    var workInProgress = workInProgress$jscomp$0, update = pendingQueue;
                    updateLane = props;
                    var instance = instance$jscomp$0;
                    switch(update.tag){
                        case 1:
                            workInProgress = update.payload;
                            if ("function" === typeof workInProgress) {
                                newState = workInProgress.call(instance, newState, updateLane);
                                break a;
                            }
                            newState = workInProgress;
                            break a;
                        case 3:
                            workInProgress.flags = workInProgress.flags & -65537 | 128;
                        case 0:
                            workInProgress = update.payload;
                            updateLane = "function" === typeof workInProgress ? workInProgress.call(instance, newState, updateLane) : workInProgress;
                            if (null === updateLane || void 0 === updateLane) break a;
                            newState = assign({}, newState, updateLane);
                            break a;
                        case 2:
                            hasForceUpdate = !0;
                    }
                }
                updateLane = pendingQueue.callback;
                null !== updateLane && (workInProgress$jscomp$0.flags |= 64, isHiddenUpdate && (workInProgress$jscomp$0.flags |= 8192), isHiddenUpdate = queue.callbacks, null === isHiddenUpdate ? queue.callbacks = [
                    updateLane
                ] : isHiddenUpdate.push(updateLane));
            } else isHiddenUpdate = {
                lane: updateLane,
                tag: pendingQueue.tag,
                payload: pendingQueue.payload,
                callback: pendingQueue.callback,
                next: null
            }, null === current ? (firstPendingUpdate = current = isHiddenUpdate, lastPendingUpdate = newState) : current = current.next = isHiddenUpdate, lastBaseUpdate |= updateLane;
            pendingQueue = pendingQueue.next;
            if (null === pendingQueue) if (pendingQueue = queue.shared.pending, null === pendingQueue) break;
            else isHiddenUpdate = pendingQueue, pendingQueue = isHiddenUpdate.next, isHiddenUpdate.next = null, queue.lastBaseUpdate = isHiddenUpdate, queue.shared.pending = null;
        }while (1)
        null === current && (lastPendingUpdate = newState);
        queue.baseState = lastPendingUpdate;
        queue.firstBaseUpdate = firstPendingUpdate;
        queue.lastBaseUpdate = current;
        null === firstBaseUpdate && (queue.shared.lanes = 0);
        workInProgressRootSkippedLanes |= lastBaseUpdate;
        workInProgress$jscomp$0.lanes = lastBaseUpdate;
        workInProgress$jscomp$0.memoizedState = newState;
    }
}
function callCallback(callback, context) {
    if ("function" !== typeof callback) throw Error(formatProdErrorMessage(191, callback));
    callback.call(context);
}
function commitCallbacks(updateQueue, context) {
    var callbacks = updateQueue.callbacks;
    if (null !== callbacks) for(updateQueue.callbacks = null, updateQueue = 0; updateQueue < callbacks.length; updateQueue++)callCallback(callbacks[updateQueue], context);
}
var currentTreeHiddenStackCursor = createCursor(null), prevEntangledRenderLanesCursor = createCursor(0);
function pushHiddenContext(fiber, context) {
    fiber = entangledRenderLanes;
    push(prevEntangledRenderLanesCursor, fiber);
    push(currentTreeHiddenStackCursor, context);
    entangledRenderLanes = fiber | context.baseLanes;
}
function reuseHiddenContextOnStack() {
    push(prevEntangledRenderLanesCursor, entangledRenderLanes);
    push(currentTreeHiddenStackCursor, currentTreeHiddenStackCursor.current);
}
function popHiddenContext() {
    entangledRenderLanes = prevEntangledRenderLanesCursor.current;
    pop(currentTreeHiddenStackCursor);
    pop(prevEntangledRenderLanesCursor);
}
var suspenseHandlerStackCursor = createCursor(null), shellBoundary = null;
function pushPrimaryTreeSuspenseHandler(handler) {
    var current = handler.alternate;
    push(suspenseStackCursor, suspenseStackCursor.current & 1);
    push(suspenseHandlerStackCursor, handler);
    null === shellBoundary && (null === current || null !== currentTreeHiddenStackCursor.current ? shellBoundary = handler : null !== current.memoizedState && (shellBoundary = handler));
}
function pushDehydratedActivitySuspenseHandler(fiber) {
    push(suspenseStackCursor, suspenseStackCursor.current);
    push(suspenseHandlerStackCursor, fiber);
    null === shellBoundary && (shellBoundary = fiber);
}
function pushOffscreenSuspenseHandler(fiber) {
    22 === fiber.tag ? (push(suspenseStackCursor, suspenseStackCursor.current), push(suspenseHandlerStackCursor, fiber), null === shellBoundary && (shellBoundary = fiber)) : reuseSuspenseHandlerOnStack();
}
function reuseSuspenseHandlerOnStack() {
    push(suspenseStackCursor, suspenseStackCursor.current);
    push(suspenseHandlerStackCursor, suspenseHandlerStackCursor.current);
}
function popSuspenseHandler(fiber) {
    pop(suspenseHandlerStackCursor);
    shellBoundary === fiber && (shellBoundary = null);
    pop(suspenseStackCursor);
}
var suspenseStackCursor = createCursor(0);
function pushSuspenseListContext(fiber, newContext) {
    push(suspenseHandlerStackCursor, suspenseHandlerStackCursor.current);
    push(suspenseStackCursor, newContext);
}
function popSuspenseListContext(fiber) {
    pop(suspenseStackCursor);
    pop(suspenseHandlerStackCursor);
    shellBoundary === fiber && (shellBoundary = null);
}
function findFirstSuspended(row) {
    for(var node = row; null !== node;){
        if (13 === node.tag) {
            var state = node.memoizedState;
            if (null !== state && (state = state.dehydrated, null === state || isSuspenseInstancePending(state) || isSuspenseInstanceFallback(state))) return node;
        } else if (19 === node.tag && "independent" !== node.memoizedProps.revealOrder) {
            if (0 !== (node.flags & 128)) return node;
        } else if (null !== node.child) {
            node.child.return = node;
            node = node.child;
            continue;
        }
        if (node === row) break;
        for(; null === node.sibling;){
            if (null === node.return || node.return === row) return null;
            node = node.return;
        }
        node.sibling.return = node.return;
        node = node.sibling;
    }
    return null;
}
var renderLanes = 0, currentlyRenderingFiber = null, currentHook = null, workInProgressHook = null, didScheduleRenderPhaseUpdate = !1, didScheduleRenderPhaseUpdateDuringThisPass = !1, shouldDoubleInvokeUserFnsInHooksDEV = !1, localIdCounter = 0, thenableIndexCounter = 0, thenableState = null, globalClientIdCounter = 0;
function throwInvalidHookError() {
    throw Error(formatProdErrorMessage(321));
}
function areHookInputsEqual(nextDeps, prevDeps) {
    if (null === prevDeps) return !1;
    for(var i = 0; i < prevDeps.length && i < nextDeps.length; i++)if (!objectIs(nextDeps[i], prevDeps[i])) return !1;
    return !0;
}
function renderWithHooks(current, workInProgress, Component, props, secondArg, nextRenderLanes) {
    renderLanes = nextRenderLanes;
    currentlyRenderingFiber = workInProgress;
    workInProgress.memoizedState = null;
    workInProgress.updateQueue = null;
    workInProgress.lanes = 0;
    ReactSharedInternals.H = null === current || null === current.memoizedState ? HooksDispatcherOnMount : HooksDispatcherOnUpdate;
    shouldDoubleInvokeUserFnsInHooksDEV = !1;
    nextRenderLanes = Component(props, secondArg);
    shouldDoubleInvokeUserFnsInHooksDEV = !1;
    didScheduleRenderPhaseUpdateDuringThisPass && (nextRenderLanes = renderWithHooksAgain(workInProgress, Component, props, secondArg));
    finishRenderingHooks(current);
    return nextRenderLanes;
}
function finishRenderingHooks(current) {
    ReactSharedInternals.H = ContextOnlyDispatcher;
    var didRenderTooFewHooks = null !== currentHook && null !== currentHook.next;
    renderLanes = 0;
    workInProgressHook = currentHook = currentlyRenderingFiber = null;
    didScheduleRenderPhaseUpdate = !1;
    thenableIndexCounter = 0;
    thenableState = null;
    if (didRenderTooFewHooks) throw Error(formatProdErrorMessage(300));
    null === current || didReceiveUpdate || (current = current.dependencies, null !== current && checkIfContextChanged(current) && (didReceiveUpdate = !0));
}
function renderWithHooksAgain(workInProgress, Component, props, secondArg) {
    currentlyRenderingFiber = workInProgress;
    var numberOfReRenders = 0;
    do {
        didScheduleRenderPhaseUpdateDuringThisPass && (thenableState = null);
        thenableIndexCounter = 0;
        didScheduleRenderPhaseUpdateDuringThisPass = !1;
        if (25 <= numberOfReRenders) throw Error(formatProdErrorMessage(301));
        numberOfReRenders += 1;
        workInProgressHook = currentHook = null;
        if (null != workInProgress.updateQueue) {
            var children = workInProgress.updateQueue;
            children.lastEffect = null;
            children.events = null;
            children.stores = null;
            null != children.memoCache && (children.memoCache.index = 0);
        }
        ReactSharedInternals.H = HooksDispatcherOnRerender;
        children = Component(props, secondArg);
    }while (didScheduleRenderPhaseUpdateDuringThisPass)
    return children;
}
function TransitionAwareHostComponent() {
    var dispatcher = ReactSharedInternals.H, maybeThenable = dispatcher.useState()[0];
    maybeThenable = "function" === typeof maybeThenable.then ? useThenable(maybeThenable) : maybeThenable;
    dispatcher = dispatcher.useState()[0];
    (null !== currentHook ? currentHook.memoizedState : null) !== dispatcher && (currentlyRenderingFiber.flags |= 1024);
    return maybeThenable;
}
function checkDidRenderIdHook() {
    var didRenderIdHook = 0 !== localIdCounter;
    localIdCounter = 0;
    return didRenderIdHook;
}
function bailoutHooks(current, workInProgress, lanes) {
    workInProgress.updateQueue = current.updateQueue;
    workInProgress.flags &= -2053;
    current.lanes &= ~lanes;
}
function resetHooksOnUnwind(workInProgress) {
    if (didScheduleRenderPhaseUpdate) {
        for(workInProgress = workInProgress.memoizedState; null !== workInProgress;){
            var queue = workInProgress.queue;
            null !== queue && (queue.pending = null);
            workInProgress = workInProgress.next;
        }
        didScheduleRenderPhaseUpdate = !1;
    }
    renderLanes = 0;
    workInProgressHook = currentHook = currentlyRenderingFiber = null;
    didScheduleRenderPhaseUpdateDuringThisPass = !1;
    thenableIndexCounter = localIdCounter = 0;
    thenableState = null;
}
function mountWorkInProgressHook() {
    var hook = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
    };
    null === workInProgressHook ? currentlyRenderingFiber.memoizedState = workInProgressHook = hook : workInProgressHook = workInProgressHook.next = hook;
    return workInProgressHook;
}
function updateWorkInProgressHook() {
    if (null === currentHook) {
        var nextCurrentHook = currentlyRenderingFiber.alternate;
        nextCurrentHook = null !== nextCurrentHook ? nextCurrentHook.memoizedState : null;
    } else nextCurrentHook = currentHook.next;
    var nextWorkInProgressHook = null === workInProgressHook ? currentlyRenderingFiber.memoizedState : workInProgressHook.next;
    if (null !== nextWorkInProgressHook) workInProgressHook = nextWorkInProgressHook, currentHook = nextCurrentHook;
    else {
        if (null === nextCurrentHook) {
            if (null === currentlyRenderingFiber.alternate) throw Error(formatProdErrorMessage(467));
            throw Error(formatProdErrorMessage(310));
        }
        currentHook = nextCurrentHook;
        nextCurrentHook = {
            memoizedState: currentHook.memoizedState,
            baseState: currentHook.baseState,
            baseQueue: currentHook.baseQueue,
            queue: currentHook.queue,
            next: null
        };
        null === workInProgressHook ? currentlyRenderingFiber.memoizedState = workInProgressHook = nextCurrentHook : workInProgressHook = workInProgressHook.next = nextCurrentHook;
    }
    return workInProgressHook;
}
function createFunctionComponentUpdateQueue() {
    return {
        lastEffect: null,
        events: null,
        stores: null,
        memoCache: null
    };
}
function useThenable(thenable) {
    var index = thenableIndexCounter;
    thenableIndexCounter += 1;
    null === thenableState && (thenableState = []);
    thenable = trackUsedThenable(thenableState, thenable, index);
    index = currentlyRenderingFiber;
    null === (null === workInProgressHook ? index.memoizedState : workInProgressHook.next) && (index = index.alternate, ReactSharedInternals.H = null === index || null === index.memoizedState ? HooksDispatcherOnMount : HooksDispatcherOnUpdate);
    return thenable;
}
function use(usable) {
    if (null !== usable && "object" === typeof usable) {
        if ("function" === typeof usable.then) return useThenable(usable);
        if (usable.$$typeof === REACT_RECOVERABLE_TYPE) return;
        if (usable.$$typeof === REACT_CONTEXT_TYPE) return readContext(usable);
    }
    throw Error(formatProdErrorMessage(438, String(usable)));
}
function useMemoCache(size) {
    var memoCache = null, updateQueue = currentlyRenderingFiber.updateQueue;
    null !== updateQueue && (memoCache = updateQueue.memoCache);
    if (null == memoCache) {
        var current = currentlyRenderingFiber.alternate;
        null !== current && (current = current.updateQueue, null !== current && (current = current.memoCache, null != current && (memoCache = {
            data: current.data.map(function(array) {
                return array.slice();
            }),
            index: 0
        })));
    }
    null == memoCache && (memoCache = {
        data: [],
        index: 0
    });
    null === updateQueue && (updateQueue = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = updateQueue);
    updateQueue.memoCache = memoCache;
    updateQueue = memoCache.data[memoCache.index];
    if (void 0 === updateQueue) for(updateQueue = memoCache.data[memoCache.index] = Array(size), current = 0; current < size; current++)updateQueue[current] = REACT_MEMO_CACHE_SENTINEL;
    memoCache.index++;
    return updateQueue;
}
function basicStateReducer(state, action) {
    return "function" === typeof action ? action(state) : action;
}
function updateReducer(reducer) {
    var hook = updateWorkInProgressHook();
    return updateReducerImpl(hook, currentHook, reducer);
}
function updateReducerImpl(hook, current, reducer) {
    var queue = hook.queue;
    if (null === queue) throw Error(formatProdErrorMessage(311));
    queue.lastRenderedReducer = reducer;
    var baseQueue = hook.baseQueue, pendingQueue = queue.pending;
    if (null !== pendingQueue) {
        if (null !== baseQueue) {
            var baseFirst = baseQueue.next;
            baseQueue.next = pendingQueue.next;
            pendingQueue.next = baseFirst;
        }
        current.baseQueue = baseQueue = pendingQueue;
        queue.pending = null;
    }
    pendingQueue = hook.baseState;
    if (null === baseQueue) hook.memoizedState = pendingQueue;
    else {
        current = baseQueue.next;
        var newBaseQueueFirst = baseFirst = null, newBaseQueueLast = null, update = current, didReadFromEntangledAsyncAction$64 = !1;
        do {
            var updateLane = update.lane & -536870913;
            if (updateLane !== update.lane ? (workInProgressRootRenderLanes & updateLane) === updateLane : (renderLanes & updateLane) === updateLane) {
                var revertLane = update.revertLane;
                if (0 === revertLane) null !== newBaseQueueLast && (newBaseQueueLast = newBaseQueueLast.next = {
                    lane: 0,
                    revertLane: 0,
                    gesture: null,
                    action: update.action,
                    hasEagerState: update.hasEagerState,
                    eagerState: update.eagerState,
                    next: null
                }), updateLane === currentEntangledLane && (didReadFromEntangledAsyncAction$64 = !0);
                else if ((renderLanes & revertLane) === revertLane) {
                    update = update.next;
                    revertLane === currentEntangledLane && (didReadFromEntangledAsyncAction$64 = !0);
                    continue;
                } else updateLane = {
                    lane: 0,
                    revertLane: update.revertLane,
                    gesture: null,
                    action: update.action,
                    hasEagerState: update.hasEagerState,
                    eagerState: update.eagerState,
                    next: null
                }, null === newBaseQueueLast ? (newBaseQueueFirst = newBaseQueueLast = updateLane, baseFirst = pendingQueue) : newBaseQueueLast = newBaseQueueLast.next = updateLane, currentlyRenderingFiber.lanes |= revertLane, workInProgressRootSkippedLanes |= revertLane;
                updateLane = update.action;
                shouldDoubleInvokeUserFnsInHooksDEV && reducer(pendingQueue, updateLane);
                pendingQueue = update.hasEagerState ? update.eagerState : reducer(pendingQueue, updateLane);
            } else revertLane = {
                lane: updateLane,
                revertLane: update.revertLane,
                gesture: update.gesture,
                action: update.action,
                hasEagerState: update.hasEagerState,
                eagerState: update.eagerState,
                next: null
            }, null === newBaseQueueLast ? (newBaseQueueFirst = newBaseQueueLast = revertLane, baseFirst = pendingQueue) : newBaseQueueLast = newBaseQueueLast.next = revertLane, currentlyRenderingFiber.lanes |= updateLane, workInProgressRootSkippedLanes |= updateLane;
            update = update.next;
        }while (null !== update && update !== current)
        null === newBaseQueueLast ? baseFirst = pendingQueue : newBaseQueueLast.next = newBaseQueueFirst;
        if (!objectIs(pendingQueue, hook.memoizedState) && (didReceiveUpdate = !0, didReadFromEntangledAsyncAction$64 && (reducer = currentEntangledActionThenable, null !== reducer))) throw reducer;
        hook.memoizedState = pendingQueue;
        hook.baseState = baseFirst;
        hook.baseQueue = newBaseQueueLast;
        queue.lastRenderedState = pendingQueue;
    }
    null === baseQueue && (queue.lanes = 0);
    return [
        hook.memoizedState,
        queue.dispatch
    ];
}
function rerenderReducer(reducer) {
    var hook = updateWorkInProgressHook(), queue = hook.queue;
    if (null === queue) throw Error(formatProdErrorMessage(311));
    queue.lastRenderedReducer = reducer;
    var dispatch = queue.dispatch, lastRenderPhaseUpdate = queue.pending, newState = hook.memoizedState;
    if (null !== lastRenderPhaseUpdate) {
        queue.pending = null;
        var update = lastRenderPhaseUpdate = lastRenderPhaseUpdate.next;
        do newState = reducer(newState, update.action), update = update.next;
        while (update !== lastRenderPhaseUpdate)
        objectIs(newState, hook.memoizedState) || (didReceiveUpdate = !0);
        hook.memoizedState = newState;
        null === hook.baseQueue && (hook.baseState = newState);
        queue.lastRenderedState = newState;
    }
    return [
        newState,
        dispatch
    ];
}
function updateSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
    var fiber = currentlyRenderingFiber, hook = updateWorkInProgressHook(), isHydrating$jscomp$0 = isHydrating;
    if (isHydrating$jscomp$0) {
        if (void 0 === getServerSnapshot) throw Error(formatProdErrorMessage(407));
        getServerSnapshot = getServerSnapshot();
    } else getServerSnapshot = getSnapshot();
    var snapshotChanged = !objectIs((currentHook || hook).memoizedState, getServerSnapshot);
    snapshotChanged && (hook.memoizedState = getServerSnapshot, didReceiveUpdate = !0);
    hook = hook.queue;
    updateEffect(subscribeToStore.bind(null, fiber, hook, subscribe), [
        subscribe
    ]);
    subscribe = hook.getSnapshot !== getSnapshot || snapshotChanged || null !== workInProgressHook && 0 !== (workInProgressHook.memoizedState.tag & 1);
    pushSimpleEffect(subscribe ? 9 : 8, {
        destroy: void 0
    }, updateStoreInstance.bind(null, fiber, hook, getServerSnapshot, getSnapshot), null);
    if (subscribe) {
        fiber.flags |= 2048;
        if (null === workInProgressRoot) throw Error(formatProdErrorMessage(349));
        isHydrating$jscomp$0 || 0 !== (renderLanes & 127) || pushStoreConsistencyCheck(fiber, getSnapshot, getServerSnapshot);
    }
    return getServerSnapshot;
}
function pushStoreConsistencyCheck(fiber, getSnapshot, renderedSnapshot) {
    fiber.flags |= 16384;
    fiber = {
        getSnapshot: getSnapshot,
        value: renderedSnapshot
    };
    getSnapshot = currentlyRenderingFiber.updateQueue;
    null === getSnapshot ? (getSnapshot = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = getSnapshot, getSnapshot.stores = [
        fiber
    ]) : (renderedSnapshot = getSnapshot.stores, null === renderedSnapshot ? getSnapshot.stores = [
        fiber
    ] : renderedSnapshot.push(fiber));
}
function updateStoreInstance(fiber, inst, nextSnapshot, getSnapshot) {
    inst.value = nextSnapshot;
    inst.getSnapshot = getSnapshot;
    checkIfSnapshotChanged(inst) && forceStoreRerender(fiber);
}
function subscribeToStore(fiber, inst, subscribe) {
    return subscribe(function() {
        checkIfSnapshotChanged(inst) && forceStoreRerender(fiber);
    });
}
function checkIfSnapshotChanged(inst) {
    var latestGetSnapshot = inst.getSnapshot;
    inst = inst.value;
    try {
        var nextValue = latestGetSnapshot();
        return !objectIs(inst, nextValue);
    } catch (error) {
        return !0;
    }
}
function forceStoreRerender(fiber) {
    var root = enqueueConcurrentRenderForLane(fiber, 2);
    null !== root && scheduleUpdateOnFiber(root, fiber, 2);
}
function mountStateImpl(initialState) {
    var hook = mountWorkInProgressHook();
    if ("function" === typeof initialState) {
        var initialStateInitializer = initialState;
        initialState = initialStateInitializer();
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    hook.memoizedState = hook.baseState = initialState;
    hook.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: basicStateReducer,
        lastRenderedState: initialState
    };
    return hook;
}
function updateOptimisticImpl(hook, current, passthrough, reducer) {
    hook.baseState = passthrough;
    return updateReducerImpl(hook, currentHook, "function" === typeof reducer ? reducer : basicStateReducer);
}
function dispatchActionState(fiber, actionQueue, setPendingState, setState, payload) {
    if (isRenderPhaseUpdate(fiber)) throw Error(formatProdErrorMessage(485));
    fiber = actionQueue.action;
    if (null !== fiber) {
        var actionNode = {
            payload: payload,
            action: fiber,
            next: null,
            isTransition: !0,
            status: "pending",
            value: null,
            reason: null,
            listeners: [],
            then: function(listener) {
                actionNode.listeners.push(listener);
            }
        };
        null !== ReactSharedInternals.T ? setPendingState(!0) : actionNode.isTransition = !1;
        setState(actionNode);
        setPendingState = actionQueue.pending;
        null === setPendingState ? (actionNode.next = actionQueue.pending = actionNode, runActionStateAction(actionQueue, actionNode)) : (actionNode.next = setPendingState.next, actionQueue.pending = setPendingState.next = actionNode);
    }
}
function runActionStateAction(actionQueue, node) {
    var action = node.action, payload = node.payload, prevState = actionQueue.state;
    if (node.isTransition) {
        var prevTransition = ReactSharedInternals.T, currentTransition = {};
        currentTransition.types = null !== prevTransition ? prevTransition.types : null;
        ReactSharedInternals.T = currentTransition;
        try {
            var returnValue = action(prevState, payload), onStartTransitionFinish = ReactSharedInternals.S;
            null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
            handleActionReturnValue(actionQueue, node, returnValue);
        } catch (error) {
            onActionError(actionQueue, node, error);
        } finally{
            null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
        }
    } else try {
        prevTransition = action(prevState, payload), handleActionReturnValue(actionQueue, node, prevTransition);
    } catch (error$70) {
        onActionError(actionQueue, node, error$70);
    }
}
function handleActionReturnValue(actionQueue, node, returnValue) {
    null !== returnValue && "object" === typeof returnValue && "function" === typeof returnValue.then ? returnValue.then(function(nextState) {
        onActionSuccess(actionQueue, node, nextState);
    }, function(error) {
        return onActionError(actionQueue, node, error);
    }) : onActionSuccess(actionQueue, node, returnValue);
}
function onActionSuccess(actionQueue, actionNode, nextState) {
    actionNode.status = "fulfilled";
    actionNode.value = nextState;
    notifyActionListeners(actionNode);
    actionQueue.state = nextState;
    actionNode = actionQueue.pending;
    null !== actionNode && (nextState = actionNode.next, nextState === actionNode ? actionQueue.pending = null : (nextState = nextState.next, actionNode.next = nextState, runActionStateAction(actionQueue, nextState)));
}
function onActionError(actionQueue, actionNode, error) {
    var last = actionQueue.pending;
    actionQueue.pending = null;
    if (null !== last) {
        last = last.next;
        do actionNode.status = "rejected", actionNode.reason = error, notifyActionListeners(actionNode), actionNode = actionNode.next;
        while (actionNode !== last)
    }
    actionQueue.action = null;
}
function notifyActionListeners(actionNode) {
    actionNode = actionNode.listeners;
    for(var i = 0; i < actionNode.length; i++)(0, actionNode[i])();
}
function actionStateReducer(oldState, newState) {
    return newState;
}
function mountActionState(action, initialStateProp) {
    if (isHydrating) {
        var ssrFormState = workInProgressRoot.formState;
        if (null !== ssrFormState) {
            a: {
                var JSCompiler_inline_result = currentlyRenderingFiber;
                if (isHydrating) {
                    if (nextHydratableInstance) {
                        b: {
                            var JSCompiler_inline_result$jscomp$0 = nextHydratableInstance;
                            for(var inRootOrSingleton = rootOrSingletonContext; 8 !== JSCompiler_inline_result$jscomp$0.nodeType;){
                                if (!inRootOrSingleton) {
                                    JSCompiler_inline_result$jscomp$0 = null;
                                    break b;
                                }
                                JSCompiler_inline_result$jscomp$0 = getNextHydratable(JSCompiler_inline_result$jscomp$0.nextSibling);
                                if (null === JSCompiler_inline_result$jscomp$0) {
                                    JSCompiler_inline_result$jscomp$0 = null;
                                    break b;
                                }
                            }
                            inRootOrSingleton = JSCompiler_inline_result$jscomp$0.data;
                            JSCompiler_inline_result$jscomp$0 = "F!" === inRootOrSingleton || "F" === inRootOrSingleton ? JSCompiler_inline_result$jscomp$0 : null;
                        }
                        if (JSCompiler_inline_result$jscomp$0) {
                            nextHydratableInstance = getNextHydratable(JSCompiler_inline_result$jscomp$0.nextSibling);
                            JSCompiler_inline_result = "F!" === JSCompiler_inline_result$jscomp$0.data;
                            break a;
                        }
                    }
                    throwOnHydrationMismatch(JSCompiler_inline_result);
                }
                JSCompiler_inline_result = !1;
            }
            JSCompiler_inline_result && (initialStateProp = ssrFormState[0]);
        }
    }
    ssrFormState = mountWorkInProgressHook();
    ssrFormState.memoizedState = ssrFormState.baseState = initialStateProp;
    JSCompiler_inline_result = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: actionStateReducer,
        lastRenderedState: initialStateProp
    };
    ssrFormState.queue = JSCompiler_inline_result;
    ssrFormState = dispatchSetState.bind(null, currentlyRenderingFiber, JSCompiler_inline_result);
    JSCompiler_inline_result.dispatch = ssrFormState;
    JSCompiler_inline_result = mountStateImpl(!1);
    inRootOrSingleton = dispatchOptimisticSetState.bind(null, currentlyRenderingFiber, !1, JSCompiler_inline_result.queue);
    JSCompiler_inline_result = mountWorkInProgressHook();
    JSCompiler_inline_result$jscomp$0 = {
        state: initialStateProp,
        dispatch: null,
        action: action,
        pending: null
    };
    JSCompiler_inline_result.queue = JSCompiler_inline_result$jscomp$0;
    ssrFormState = dispatchActionState.bind(null, currentlyRenderingFiber, JSCompiler_inline_result$jscomp$0, inRootOrSingleton, ssrFormState);
    JSCompiler_inline_result$jscomp$0.dispatch = ssrFormState;
    JSCompiler_inline_result.memoizedState = action;
    return [
        initialStateProp,
        ssrFormState,
        !1
    ];
}
function updateActionState(action) {
    var stateHook = updateWorkInProgressHook();
    return updateActionStateImpl(stateHook, currentHook, action);
}
function updateActionStateImpl(stateHook, currentStateHook, action) {
    currentStateHook = updateReducerImpl(stateHook, currentStateHook, actionStateReducer)[0];
    stateHook = updateReducer(basicStateReducer)[0];
    if ("object" === typeof currentStateHook && null !== currentStateHook && "function" === typeof currentStateHook.then) try {
        var state = useThenable(currentStateHook);
    } catch (x) {
        if (x === SuspenseException) throw SuspenseActionException;
        throw x;
    }
    else state = currentStateHook;
    currentStateHook = updateWorkInProgressHook();
    var actionQueue = currentStateHook.queue, dispatch = actionQueue.dispatch;
    action !== currentStateHook.memoizedState && (currentlyRenderingFiber.flags |= 2048, pushSimpleEffect(9, {
        destroy: void 0
    }, actionStateActionEffect.bind(null, actionQueue, action), null));
    return [
        state,
        dispatch,
        stateHook
    ];
}
function actionStateActionEffect(actionQueue, action) {
    actionQueue.action = action;
}
function rerenderActionState(action) {
    var stateHook = updateWorkInProgressHook(), currentStateHook = currentHook;
    if (null !== currentStateHook) return updateActionStateImpl(stateHook, currentStateHook, action);
    updateWorkInProgressHook();
    stateHook = stateHook.memoizedState;
    currentStateHook = updateWorkInProgressHook();
    var dispatch = currentStateHook.queue.dispatch;
    currentStateHook.memoizedState = action;
    return [
        stateHook,
        dispatch,
        !1
    ];
}
function pushSimpleEffect(tag, inst, create, deps) {
    tag = {
        tag: tag,
        create: create,
        deps: deps,
        inst: inst,
        next: null
    };
    inst = currentlyRenderingFiber.updateQueue;
    null === inst && (inst = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = inst);
    create = inst.lastEffect;
    null === create ? inst.lastEffect = tag.next = tag : (deps = create.next, create.next = tag, tag.next = deps, inst.lastEffect = tag);
    return tag;
}
function updateRef() {
    return updateWorkInProgressHook().memoizedState;
}
function mountEffectImpl(fiberFlags, hookFlags, create, deps) {
    var hook = mountWorkInProgressHook();
    currentlyRenderingFiber.flags |= fiberFlags;
    hook.memoizedState = pushSimpleEffect(1 | hookFlags, {
        destroy: void 0
    }, create, void 0 === deps ? null : deps);
}
function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
    var hook = updateWorkInProgressHook();
    deps = void 0 === deps ? null : deps;
    var inst = hook.memoizedState.inst;
    null !== currentHook && null !== deps && areHookInputsEqual(deps, currentHook.memoizedState.deps) ? hook.memoizedState = pushSimpleEffect(hookFlags, inst, create, deps) : (currentlyRenderingFiber.flags |= fiberFlags, hook.memoizedState = pushSimpleEffect(1 | hookFlags, inst, create, deps));
}
function mountEffect(create, deps) {
    mountEffectImpl(8390656, 8, create, deps);
}
function updateEffect(create, deps) {
    updateEffectImpl(2048, 8, create, deps);
}
function useEffectEventImpl(payload) {
    currentlyRenderingFiber.flags |= 4;
    var componentUpdateQueue = currentlyRenderingFiber.updateQueue;
    if (null === componentUpdateQueue) componentUpdateQueue = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = componentUpdateQueue, componentUpdateQueue.events = [
        payload
    ];
    else {
        var events = componentUpdateQueue.events;
        null === events ? componentUpdateQueue.events = [
            payload
        ] : events.push(payload);
    }
}
function updateEvent(callback) {
    var ref = updateWorkInProgressHook().memoizedState;
    useEffectEventImpl({
        ref: ref,
        nextImpl: callback
    });
    return function() {
        if (0 !== (executionContext & 2)) throw Error(formatProdErrorMessage(440));
        return ref.impl.apply(void 0, arguments);
    };
}
function updateInsertionEffect(create, deps) {
    return updateEffectImpl(4, 2, create, deps);
}
function updateLayoutEffect(create, deps) {
    return updateEffectImpl(4, 4, create, deps);
}
function imperativeHandleEffect(create, ref) {
    if ("function" === typeof ref) {
        create = create();
        var refCleanup = ref(create);
        return function() {
            "function" === typeof refCleanup ? refCleanup() : ref(null);
        };
    }
    if (null !== ref && void 0 !== ref) return create = create(), ref.current = create, function() {
        ref.current = null;
    };
}
function updateImperativeHandle(ref, create, deps) {
    deps = null !== deps && void 0 !== deps ? deps.concat([
        ref
    ]) : null;
    updateEffectImpl(4, 4, imperativeHandleEffect.bind(null, create, ref), deps);
}
function mountDebugValue() {}
function updateCallback(callback, deps) {
    var hook = updateWorkInProgressHook();
    deps = void 0 === deps ? null : deps;
    var prevState = hook.memoizedState;
    if (null !== deps && areHookInputsEqual(deps, prevState[1])) return prevState[0];
    hook.memoizedState = [
        callback,
        deps
    ];
    return callback;
}
function updateMemo(nextCreate, deps) {
    var hook = updateWorkInProgressHook();
    deps = void 0 === deps ? null : deps;
    var prevState = hook.memoizedState;
    if (null !== deps && areHookInputsEqual(deps, prevState[1])) return prevState[0];
    prevState = nextCreate();
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    hook.memoizedState = [
        prevState,
        deps
    ];
    return prevState;
}
function mountDeferredValueImpl(hook, value, initialValue) {
    if (void 0 === initialValue || 0 !== (renderLanes & 1073741824) && 0 === (workInProgressRootRenderLanes & 261930)) return hook.memoizedState = value;
    hook.memoizedState = initialValue;
    hook = requestDeferredLane();
    currentlyRenderingFiber.lanes |= hook;
    workInProgressRootSkippedLanes |= hook;
    return initialValue;
}
function updateDeferredValueImpl(hook, prevValue, value, initialValue) {
    if (objectIs(value, prevValue)) return value;
    if (null !== currentTreeHiddenStackCursor.current) return hook = mountDeferredValueImpl(hook, value, initialValue), objectIs(hook, prevValue) || (didReceiveUpdate = !0), hook;
    if (0 === (renderLanes & 106) || 0 !== (renderLanes & 1073741824) && 0 === (workInProgressRootRenderLanes & 261930)) return didReceiveUpdate = !0, hook.memoizedState = value;
    hook = requestDeferredLane();
    currentlyRenderingFiber.lanes |= hook;
    workInProgressRootSkippedLanes |= hook;
    return prevValue;
}
function startTransition(fiber, queue, pendingState, finishedState, callback) {
    var previousPriority = ReactDOMSharedInternals.p;
    ReactDOMSharedInternals.p = 0 !== previousPriority && 8 > previousPriority ? previousPriority : 8;
    var prevTransition = ReactSharedInternals.T, currentTransition = {};
    currentTransition.types = null !== prevTransition ? prevTransition.types : null;
    ReactSharedInternals.T = currentTransition;
    dispatchOptimisticSetState(fiber, !1, queue, pendingState);
    try {
        var returnValue = callback(), onStartTransitionFinish = ReactSharedInternals.S;
        null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
        if (null !== returnValue && "object" === typeof returnValue && "function" === typeof returnValue.then) {
            var thenableForFinishedState = chainThenableValue(returnValue, finishedState);
            dispatchSetStateInternal(fiber, queue, thenableForFinishedState, requestUpdateLane(fiber));
        } else dispatchSetStateInternal(fiber, queue, finishedState, requestUpdateLane(fiber));
    } catch (error) {
        dispatchSetStateInternal(fiber, queue, {
            then: function() {},
            status: "rejected",
            reason: error
        }, requestUpdateLane());
    } finally{
        ReactDOMSharedInternals.p = previousPriority, null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
    }
}
function noop() {}
function startHostTransition(formFiber, pendingState, action, formData) {
    if (5 !== formFiber.tag) throw Error(formatProdErrorMessage(476));
    var queue = ensureFormComponentIsStateful(formFiber).queue;
    startTransition(formFiber, queue, pendingState, sharedNotPendingObject, null === action ? noop : function() {
        requestFormReset$1(formFiber);
        return action(formData);
    });
}
function ensureFormComponentIsStateful(formFiber) {
    var existingStateHook = formFiber.memoizedState;
    if (null !== existingStateHook) return existingStateHook;
    existingStateHook = {
        memoizedState: sharedNotPendingObject,
        baseState: sharedNotPendingObject,
        baseQueue: null,
        queue: {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: basicStateReducer,
            lastRenderedState: sharedNotPendingObject
        },
        next: null
    };
    var initialResetState = {};
    existingStateHook.next = {
        memoizedState: initialResetState,
        baseState: initialResetState,
        baseQueue: null,
        queue: {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: basicStateReducer,
            lastRenderedState: initialResetState
        },
        next: null
    };
    formFiber.memoizedState = existingStateHook;
    formFiber = formFiber.alternate;
    null !== formFiber && (formFiber.memoizedState = existingStateHook);
    return existingStateHook;
}
function requestFormReset$1(formFiber) {
    var stateHook = ensureFormComponentIsStateful(formFiber);
    null === stateHook.next && (stateHook = formFiber.alternate.memoizedState);
    dispatchSetStateInternal(formFiber, stateHook.next.queue, {}, requestUpdateLane());
}
function useHostTransitionStatus() {
    return readContext(HostTransitionContext);
}
function updateId() {
    return updateWorkInProgressHook().memoizedState;
}
function updateRefresh() {
    return updateWorkInProgressHook().memoizedState;
}
function refreshCache(fiber) {
    for(var provider = fiber.return; null !== provider;){
        switch(provider.tag){
            case 24:
            case 3:
                var lane = requestUpdateLane();
                fiber = createUpdate(lane);
                var root$73 = enqueueUpdate(provider, fiber, lane);
                null !== root$73 && (scheduleUpdateOnFiber(root$73, provider, lane), entangleTransitions(root$73, provider, lane));
                provider = {
                    cache: createCache()
                };
                fiber.payload = provider;
                return;
        }
        provider = provider.return;
    }
}
function dispatchReducerAction(fiber, queue, action) {
    var lane = requestUpdateLane();
    action = {
        lane: lane,
        revertLane: 0,
        gesture: null,
        action: action,
        hasEagerState: !1,
        eagerState: null,
        next: null
    };
    isRenderPhaseUpdate(fiber) ? enqueueRenderPhaseUpdate(queue, action) : (action = enqueueConcurrentHookUpdate(fiber, queue, action, lane), null !== action && (scheduleUpdateOnFiber(action, fiber, lane), entangleTransitionUpdate(action, queue, lane)));
}
function dispatchSetState(fiber, queue, action) {
    var lane = requestUpdateLane();
    dispatchSetStateInternal(fiber, queue, action, lane);
}
function dispatchSetStateInternal(fiber, queue, action, lane) {
    var update = {
        lane: lane,
        revertLane: 0,
        gesture: null,
        action: action,
        hasEagerState: !1,
        eagerState: null,
        next: null
    };
    if (isRenderPhaseUpdate(fiber)) enqueueRenderPhaseUpdate(queue, update);
    else {
        var alternate = fiber.alternate;
        if (0 === fiber.lanes && (null === alternate || 0 === alternate.lanes) && (alternate = queue.lastRenderedReducer, null !== alternate)) try {
            var currentState = queue.lastRenderedState, eagerState = alternate(currentState, action);
            update.hasEagerState = !0;
            update.eagerState = eagerState;
            if (objectIs(eagerState, currentState)) return enqueueUpdate$1(fiber, queue, update, 0), null === workInProgressRoot && finishQueueingConcurrentUpdates(), !1;
        } catch (error) {} finally{}
        action = enqueueConcurrentHookUpdate(fiber, queue, update, lane);
        if (null !== action) return scheduleUpdateOnFiber(action, fiber, lane), entangleTransitionUpdate(action, queue, lane), !0;
    }
    return !1;
}
function dispatchOptimisticSetState(fiber, throwIfDuringRender, queue, action) {
    action = {
        lane: 2,
        revertLane: requestTransitionLane(),
        gesture: null,
        action: action,
        hasEagerState: !1,
        eagerState: null,
        next: null
    };
    if (isRenderPhaseUpdate(fiber)) {
        if (throwIfDuringRender) throw Error(formatProdErrorMessage(479));
    } else throwIfDuringRender = enqueueConcurrentHookUpdate(fiber, queue, action, 2), null !== throwIfDuringRender && scheduleUpdateOnFiber(throwIfDuringRender, fiber, 2);
}
function isRenderPhaseUpdate(fiber) {
    var alternate = fiber.alternate;
    return fiber === currentlyRenderingFiber || null !== alternate && alternate === currentlyRenderingFiber;
}
function enqueueRenderPhaseUpdate(queue, update) {
    didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate = !0;
    var pending = queue.pending;
    null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
    queue.pending = update;
}
function entangleTransitionUpdate(root, queue, lane) {
    if (0 !== (lane & 4194048)) {
        var queueLanes = queue.lanes;
        queueLanes &= root.pendingLanes;
        lane |= queueLanes;
        queue.lanes = lane;
        markRootEntangled(root, lane);
    }
}
var ContextOnlyDispatcher = {
    readContext: readContext,
    use: use,
    useCallback: throwInvalidHookError,
    useContext: throwInvalidHookError,
    useEffect: throwInvalidHookError,
    useImperativeHandle: throwInvalidHookError,
    useLayoutEffect: throwInvalidHookError,
    useInsertionEffect: throwInvalidHookError,
    useMemo: throwInvalidHookError,
    useReducer: throwInvalidHookError,
    useRef: throwInvalidHookError,
    useState: throwInvalidHookError,
    useDebugValue: throwInvalidHookError,
    useDeferredValue: throwInvalidHookError,
    useTransition: throwInvalidHookError,
    useSyncExternalStore: throwInvalidHookError,
    useId: throwInvalidHookError,
    useHostTransitionStatus: throwInvalidHookError,
    useFormState: throwInvalidHookError,
    useActionState: throwInvalidHookError,
    useOptimistic: throwInvalidHookError,
    useMemoCache: throwInvalidHookError,
    useCacheRefresh: throwInvalidHookError,
    useEffectEvent: throwInvalidHookError
}, HooksDispatcherOnMount = {
    readContext: readContext,
    use: use,
    useCallback: function(callback, deps) {
        mountWorkInProgressHook().memoizedState = [
            callback,
            void 0 === deps ? null : deps
        ];
        return callback;
    },
    useContext: readContext,
    useEffect: mountEffect,
    useImperativeHandle: function(ref, create, deps) {
        deps = null !== deps && void 0 !== deps ? deps.concat([
            ref
        ]) : null;
        mountEffectImpl(4194308, 4, imperativeHandleEffect.bind(null, create, ref), deps);
    },
    useLayoutEffect: function(create, deps) {
        return mountEffectImpl(4194308, 4, create, deps);
    },
    useInsertionEffect: function(create, deps) {
        mountEffectImpl(4, 2, create, deps);
    },
    useMemo: function(nextCreate, deps) {
        var hook = mountWorkInProgressHook();
        deps = void 0 === deps ? null : deps;
        var nextValue = nextCreate();
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        hook.memoizedState = [
            nextValue,
            deps
        ];
        return nextValue;
    },
    useReducer: function(reducer, initialArg, init) {
        var hook = mountWorkInProgressHook();
        if (void 0 !== init) {
            var initialState = init(initialArg);
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        } else initialState = initialArg;
        hook.memoizedState = hook.baseState = initialState;
        reducer = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: reducer,
            lastRenderedState: initialState
        };
        hook.queue = reducer;
        reducer = reducer.dispatch = dispatchReducerAction.bind(null, currentlyRenderingFiber, reducer);
        return [
            hook.memoizedState,
            reducer
        ];
    },
    useRef: function(initialValue) {
        var hook = mountWorkInProgressHook();
        initialValue = {
            current: initialValue
        };
        return hook.memoizedState = initialValue;
    },
    useState: function(initialState) {
        initialState = mountStateImpl(initialState);
        var queue = initialState.queue, dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue);
        queue.dispatch = dispatch;
        return [
            initialState.memoizedState,
            dispatch
        ];
    },
    useDebugValue: mountDebugValue,
    useDeferredValue: function(value, initialValue) {
        var hook = mountWorkInProgressHook();
        return mountDeferredValueImpl(hook, value, initialValue);
    },
    useTransition: function() {
        var stateHook = mountStateImpl(!1);
        stateHook = startTransition.bind(null, currentlyRenderingFiber, stateHook.queue, !0, !1);
        mountWorkInProgressHook().memoizedState = stateHook;
        return [
            !1,
            stateHook
        ];
    },
    useSyncExternalStore: function(subscribe, getSnapshot, getServerSnapshot) {
        var fiber = currentlyRenderingFiber, hook = mountWorkInProgressHook();
        if (isHydrating) {
            if (void 0 === getServerSnapshot) throw Error(formatProdErrorMessage(407));
            getServerSnapshot = getServerSnapshot();
        } else {
            getServerSnapshot = getSnapshot();
            if (null === workInProgressRoot) throw Error(formatProdErrorMessage(349));
            0 !== (workInProgressRootRenderLanes & 127) || pushStoreConsistencyCheck(fiber, getSnapshot, getServerSnapshot);
        }
        hook.memoizedState = getServerSnapshot;
        var inst = {
            value: getServerSnapshot,
            getSnapshot: getSnapshot
        };
        hook.queue = inst;
        mountEffect(subscribeToStore.bind(null, fiber, inst, subscribe), [
            subscribe
        ]);
        fiber.flags |= 2048;
        pushSimpleEffect(9, {
            destroy: void 0
        }, updateStoreInstance.bind(null, fiber, inst, getServerSnapshot, getSnapshot), null);
        return getServerSnapshot;
    },
    useId: function() {
        var hook = mountWorkInProgressHook(), identifierPrefix = workInProgressRoot.identifierPrefix;
        if (isHydrating) {
            var JSCompiler_inline_result = treeContextOverflow;
            var idWithLeadingBit = treeContextId;
            JSCompiler_inline_result = (idWithLeadingBit & ~(1 << 32 - clz32(idWithLeadingBit) - 1)).toString(32) + JSCompiler_inline_result;
            identifierPrefix = "_" + identifierPrefix + "R_" + JSCompiler_inline_result;
            JSCompiler_inline_result = localIdCounter++;
            0 < JSCompiler_inline_result && (identifierPrefix += "H" + JSCompiler_inline_result.toString(32));
            identifierPrefix += "_";
        } else JSCompiler_inline_result = globalClientIdCounter++, identifierPrefix = "_" + identifierPrefix + "r_" + JSCompiler_inline_result.toString(32) + "_";
        return hook.memoizedState = identifierPrefix;
    },
    useHostTransitionStatus: useHostTransitionStatus,
    useFormState: mountActionState,
    useActionState: mountActionState,
    useOptimistic: function(passthrough) {
        var hook = mountWorkInProgressHook();
        hook.memoizedState = hook.baseState = passthrough;
        var queue = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: null,
            lastRenderedState: null
        };
        hook.queue = queue;
        hook = dispatchOptimisticSetState.bind(null, currentlyRenderingFiber, !0, queue);
        queue.dispatch = hook;
        return [
            passthrough,
            hook
        ];
    },
    useMemoCache: useMemoCache,
    useCacheRefresh: function() {
        return mountWorkInProgressHook().memoizedState = refreshCache.bind(null, currentlyRenderingFiber);
    },
    useEffectEvent: function(callback) {
        var hook = mountWorkInProgressHook(), ref = {
            impl: callback
        };
        hook.memoizedState = ref;
        return function() {
            if (0 !== (executionContext & 2)) throw Error(formatProdErrorMessage(440));
            return ref.impl.apply(void 0, arguments);
        };
    }
}, HooksDispatcherOnUpdate = {
    readContext: readContext,
    use: use,
    useCallback: updateCallback,
    useContext: readContext,
    useEffect: updateEffect,
    useImperativeHandle: updateImperativeHandle,
    useInsertionEffect: updateInsertionEffect,
    useLayoutEffect: updateLayoutEffect,
    useMemo: updateMemo,
    useReducer: updateReducer,
    useRef: updateRef,
    useState: function() {
        return updateReducer(basicStateReducer);
    },
    useDebugValue: mountDebugValue,
    useDeferredValue: function(value, initialValue) {
        var hook = updateWorkInProgressHook();
        return updateDeferredValueImpl(hook, currentHook.memoizedState, value, initialValue);
    },
    useTransition: function() {
        var booleanOrThenable = updateReducer(basicStateReducer)[0], start = updateWorkInProgressHook().memoizedState;
        return [
            "boolean" === typeof booleanOrThenable ? booleanOrThenable : useThenable(booleanOrThenable),
            start
        ];
    },
    useSyncExternalStore: updateSyncExternalStore,
    useId: updateId,
    useHostTransitionStatus: useHostTransitionStatus,
    useFormState: updateActionState,
    useActionState: updateActionState,
    useOptimistic: function(passthrough, reducer) {
        var hook = updateWorkInProgressHook();
        return updateOptimisticImpl(hook, currentHook, passthrough, reducer);
    },
    useMemoCache: useMemoCache,
    useCacheRefresh: updateRefresh,
    useEffectEvent: updateEvent
}, HooksDispatcherOnRerender = {
    readContext: readContext,
    use: use,
    useCallback: updateCallback,
    useContext: readContext,
    useEffect: updateEffect,
    useImperativeHandle: updateImperativeHandle,
    useInsertionEffect: updateInsertionEffect,
    useLayoutEffect: updateLayoutEffect,
    useMemo: updateMemo,
    useReducer: rerenderReducer,
    useRef: updateRef,
    useState: function() {
        return rerenderReducer(basicStateReducer);
    },
    useDebugValue: mountDebugValue,
    useDeferredValue: function(value, initialValue) {
        var hook = updateWorkInProgressHook();
        return null === currentHook ? mountDeferredValueImpl(hook, value, initialValue) : updateDeferredValueImpl(hook, currentHook.memoizedState, value, initialValue);
    },
    useTransition: function() {
        var booleanOrThenable = rerenderReducer(basicStateReducer)[0], start = updateWorkInProgressHook().memoizedState;
        return [
            "boolean" === typeof booleanOrThenable ? booleanOrThenable : useThenable(booleanOrThenable),
            start
        ];
    },
    useSyncExternalStore: updateSyncExternalStore,
    useId: updateId,
    useHostTransitionStatus: useHostTransitionStatus,
    useFormState: rerenderActionState,
    useActionState: rerenderActionState,
    useOptimistic: function(passthrough, reducer) {
        var hook = updateWorkInProgressHook();
        if (null !== currentHook) return updateOptimisticImpl(hook, currentHook, passthrough, reducer);
        hook.baseState = passthrough;
        return [
            passthrough,
            hook.queue.dispatch
        ];
    },
    useMemoCache: useMemoCache,
    useCacheRefresh: updateRefresh,
    useEffectEvent: updateEvent
};
function applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, nextProps) {
    ctor = workInProgress.memoizedState;
    getDerivedStateFromProps = getDerivedStateFromProps(nextProps, ctor);
    getDerivedStateFromProps = null === getDerivedStateFromProps || void 0 === getDerivedStateFromProps ? ctor : assign({}, ctor, getDerivedStateFromProps);
    workInProgress.memoizedState = getDerivedStateFromProps;
    0 === workInProgress.lanes && (workInProgress.updateQueue.baseState = getDerivedStateFromProps);
}
var classComponentUpdater = {
    enqueueSetState: function(inst, payload, callback) {
        inst = inst._reactInternals;
        var lane = requestUpdateLane(), update = createUpdate(lane);
        update.payload = payload;
        void 0 !== callback && null !== callback && (update.callback = callback);
        payload = enqueueUpdate(inst, update, lane);
        null !== payload && (scheduleUpdateOnFiber(payload, inst, lane), entangleTransitions(payload, inst, lane));
    },
    enqueueReplaceState: function(inst, payload, callback) {
        inst = inst._reactInternals;
        var lane = requestUpdateLane(), update = createUpdate(lane);
        update.tag = 1;
        update.payload = payload;
        void 0 !== callback && null !== callback && (update.callback = callback);
        payload = enqueueUpdate(inst, update, lane);
        null !== payload && (scheduleUpdateOnFiber(payload, inst, lane), entangleTransitions(payload, inst, lane));
    },
    enqueueForceUpdate: function(inst, callback) {
        inst = inst._reactInternals;
        var lane = requestUpdateLane(), update = createUpdate(lane);
        update.tag = 2;
        void 0 !== callback && null !== callback && (update.callback = callback);
        callback = enqueueUpdate(inst, update, lane);
        null !== callback && (scheduleUpdateOnFiber(callback, inst, lane), entangleTransitions(callback, inst, lane));
    }
};
function checkShouldComponentUpdate(workInProgress, ctor, oldProps, newProps, oldState, newState, nextContext) {
    workInProgress = workInProgress.stateNode;
    return "function" === typeof workInProgress.shouldComponentUpdate ? workInProgress.shouldComponentUpdate(newProps, newState, nextContext) : ctor.prototype && ctor.prototype.isPureReactComponent ? !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState) : !0;
}
function callComponentWillReceiveProps(workInProgress, instance, newProps, nextContext) {
    workInProgress = instance.state;
    "function" === typeof instance.componentWillReceiveProps && instance.componentWillReceiveProps(newProps, nextContext);
    "function" === typeof instance.UNSAFE_componentWillReceiveProps && instance.UNSAFE_componentWillReceiveProps(newProps, nextContext);
    instance.state !== workInProgress && classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
}
function resolveClassComponentProps(Component, baseProps) {
    var newProps = baseProps;
    if ("ref" in baseProps) {
        newProps = {};
        for(var propName in baseProps)"ref" !== propName && (newProps[propName] = baseProps[propName]);
    }
    if (Component = Component.defaultProps) {
        newProps === baseProps && (newProps = assign({}, newProps));
        for(var propName$77 in Component)void 0 === newProps[propName$77] && (newProps[propName$77] = Component[propName$77]);
    }
    return newProps;
}
function defaultOnUncaughtError(error) {
    reportGlobalError(error);
}
function defaultOnCaughtError(error) {
    console.error(error);
}
function defaultOnRecoverableError(error) {
    reportGlobalError(error);
}
function logUncaughtError(root, errorInfo) {
    try {
        var onUncaughtError = root.onUncaughtError;
        onUncaughtError(errorInfo.value, {
            componentStack: errorInfo.stack
        });
    } catch (e$78) {
        setTimeout(function() {
            throw e$78;
        });
    }
}
function logCaughtError(root, boundary, errorInfo) {
    try {
        var onCaughtError = root.onCaughtError;
        onCaughtError(errorInfo.value, {
            componentStack: errorInfo.stack,
            errorBoundary: 1 === boundary.tag ? boundary.stateNode : null
        });
    } catch (e$79) {
        setTimeout(function() {
            throw e$79;
        });
    }
}
function createRootErrorUpdate(root, errorInfo, lane) {
    lane = createUpdate(lane);
    lane.tag = 3;
    lane.payload = {
        element: null
    };
    lane.callback = function() {
        logUncaughtError(root, errorInfo);
    };
    return lane;
}
function createClassErrorUpdate(lane) {
    lane = createUpdate(lane);
    lane.tag = 3;
    return lane;
}
function initializeClassErrorUpdate(update, root, fiber, errorInfo) {
    var getDerivedStateFromError = fiber.type.getDerivedStateFromError;
    if ("function" === typeof getDerivedStateFromError) {
        var error = errorInfo.value;
        update.payload = function() {
            return getDerivedStateFromError(error);
        };
        update.callback = function() {
            logCaughtError(root, fiber, errorInfo);
        };
    }
    var inst = fiber.stateNode;
    null !== inst && "function" === typeof inst.componentDidCatch && (update.callback = function() {
        logCaughtError(root, fiber, errorInfo);
        "function" !== typeof getDerivedStateFromError && (null === legacyErrorBoundariesThatAlreadyFailed ? legacyErrorBoundariesThatAlreadyFailed = new Set([
            this
        ]) : legacyErrorBoundariesThatAlreadyFailed.add(this));
        var stack = errorInfo.stack;
        this.componentDidCatch(errorInfo.value, {
            componentStack: null !== stack ? stack : ""
        });
    });
}
function throwException(root, returnFiber, sourceFiber, value, rootRenderLanes) {
    sourceFiber.flags |= 32768;
    if (null !== value && "object" === typeof value && "function" === typeof value.then) {
        returnFiber = sourceFiber.alternate;
        null !== returnFiber && propagateParentContextChanges(returnFiber, sourceFiber, rootRenderLanes, !0);
        sourceFiber = suspenseHandlerStackCursor.current;
        if (null !== sourceFiber) {
            switch(sourceFiber.tag){
                case 31:
                case 13:
                case 19:
                    return null === shellBoundary ? renderDidSuspendDelayIfPossible() : null === sourceFiber.alternate && 0 === workInProgressRootExitStatus && (workInProgressRootExitStatus = 3), sourceFiber.flags &= -257, sourceFiber.flags |= 65536, sourceFiber.lanes = rootRenderLanes, value === noopSuspenseyCommitThenable ? sourceFiber.flags |= 16384 : (returnFiber = sourceFiber.updateQueue, null === returnFiber ? sourceFiber.updateQueue = new Set([
                        value
                    ]) : returnFiber.add(value), attachPingListener(root, value, rootRenderLanes)), !1;
                case 22:
                    return sourceFiber.flags |= 65536, value === noopSuspenseyCommitThenable ? sourceFiber.flags |= 16384 : (returnFiber = sourceFiber.updateQueue, null === returnFiber ? (returnFiber = {
                        transitions: null,
                        markerInstances: null,
                        retryQueue: new Set([
                            value
                        ])
                    }, sourceFiber.updateQueue = returnFiber) : (sourceFiber = returnFiber.retryQueue, null === sourceFiber ? returnFiber.retryQueue = new Set([
                        value
                    ]) : sourceFiber.add(value)), attachPingListener(root, value, rootRenderLanes)), !1;
            }
            throw Error(formatProdErrorMessage(435, sourceFiber.tag));
        }
        attachPingListener(root, value, rootRenderLanes);
        renderDidSuspendDelayIfPossible();
        return !1;
    }
    if (isHydrating) return returnFiber = suspenseHandlerStackCursor.current, null !== returnFiber ? (0 === (returnFiber.flags & 65536) && (returnFiber.flags |= 256), returnFiber.flags |= 65536, returnFiber.lanes = rootRenderLanes, value !== HydrationMismatchException && (root = Error(formatProdErrorMessage(422), {
        cause: value
    }), queueHydrationError(createCapturedValueAtFiber(root, sourceFiber)))) : (value !== HydrationMismatchException && (returnFiber = Error(formatProdErrorMessage(423), {
        cause: value
    }), queueHydrationError(createCapturedValueAtFiber(returnFiber, sourceFiber))), root = root.current.alternate, root.flags |= 65536, rootRenderLanes &= -rootRenderLanes, root.lanes |= rootRenderLanes, value = createCapturedValueAtFiber(value, sourceFiber), rootRenderLanes = createRootErrorUpdate(root.stateNode, value, rootRenderLanes), enqueueCapturedUpdate(root, rootRenderLanes), 4 !== workInProgressRootExitStatus && (workInProgressRootExitStatus = 2)), !1;
    var wrapperError = Error(formatProdErrorMessage(520), {
        cause: value
    });
    wrapperError = createCapturedValueAtFiber(wrapperError, sourceFiber);
    null === workInProgressRootConcurrentErrors ? workInProgressRootConcurrentErrors = [
        wrapperError
    ] : workInProgressRootConcurrentErrors.push(wrapperError);
    4 !== workInProgressRootExitStatus && (workInProgressRootExitStatus = 2);
    if (null === returnFiber) return !0;
    value = createCapturedValueAtFiber(value, sourceFiber);
    sourceFiber = returnFiber;
    do {
        switch(sourceFiber.tag){
            case 3:
                return sourceFiber.flags |= 65536, root = rootRenderLanes & -rootRenderLanes, sourceFiber.lanes |= root, root = createRootErrorUpdate(sourceFiber.stateNode, value, root), enqueueCapturedUpdate(sourceFiber, root), !1;
            case 1:
                returnFiber = sourceFiber.type;
                wrapperError = sourceFiber.stateNode;
                if (0 === (sourceFiber.flags & 128) && ("function" === typeof returnFiber.getDerivedStateFromError || null !== wrapperError && "function" === typeof wrapperError.componentDidCatch && (null === legacyErrorBoundariesThatAlreadyFailed || !legacyErrorBoundariesThatAlreadyFailed.has(wrapperError)))) return sourceFiber.flags |= 65536, rootRenderLanes &= -rootRenderLanes, sourceFiber.lanes |= rootRenderLanes, rootRenderLanes = createClassErrorUpdate(rootRenderLanes), initializeClassErrorUpdate(rootRenderLanes, root, sourceFiber, value), enqueueCapturedUpdate(sourceFiber, rootRenderLanes), !1;
                break;
            case 22:
                if (null !== sourceFiber.memoizedState) return sourceFiber.flags |= 65536, !1;
        }
        sourceFiber = sourceFiber.return;
    }while (null !== sourceFiber)
    return !1;
}
var SelectiveHydrationException = Error(formatProdErrorMessage(461)), didReceiveUpdate = !1;
function reconcileChildren(current, workInProgress, nextChildren, renderLanes) {
    workInProgress.child = null === current ? mountChildFibers(workInProgress, null, nextChildren, renderLanes) : reconcileChildFibers(workInProgress, current.child, nextChildren, renderLanes);
}
function updateForwardRef(current, workInProgress, Component, nextProps, renderLanes) {
    Component = Component.render;
    var ref = workInProgress.ref;
    if ("ref" in nextProps) {
        var propsWithoutRef = {};
        for(var key in nextProps)"ref" !== key && (propsWithoutRef[key] = nextProps[key]);
    } else propsWithoutRef = nextProps;
    prepareToReadContext(workInProgress);
    nextProps = renderWithHooks(current, workInProgress, Component, propsWithoutRef, ref, renderLanes);
    key = checkDidRenderIdHook();
    if (null !== current && !didReceiveUpdate) return bailoutHooks(current, workInProgress, renderLanes), bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
    isHydrating && key && pushMaterializedTreeId(workInProgress);
    workInProgress.flags |= 1;
    reconcileChildren(current, workInProgress, nextProps, renderLanes);
    return workInProgress.child;
}
function updateMemoComponent(current, workInProgress, Component, nextProps, renderLanes) {
    if (null === current) {
        var type = Component.type;
        if ("function" === typeof type && !shouldConstruct(type) && void 0 === type.defaultProps && null === Component.compare) return workInProgress.tag = 15, workInProgress.type = type, updateSimpleMemoComponent(current, workInProgress, type, nextProps, renderLanes);
        current = createFiberFromTypeAndProps(Component.type, null, nextProps, workInProgress, workInProgress.mode, renderLanes);
        current.ref = workInProgress.ref;
        current.return = workInProgress;
        return workInProgress.child = current;
    }
    type = current.child;
    if (!checkScheduledUpdateOrContext(current, renderLanes)) {
        var prevProps = type.memoizedProps;
        Component = Component.compare;
        Component = null !== Component ? Component : shallowEqual;
        if (Component(prevProps, nextProps) && current.ref === workInProgress.ref) return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
    }
    workInProgress.flags |= 1;
    current = createWorkInProgress(type, nextProps);
    current.ref = workInProgress.ref;
    current.return = workInProgress;
    return workInProgress.child = current;
}
function updateSimpleMemoComponent(current, workInProgress, Component, nextProps, renderLanes) {
    if (null !== current) {
        var prevProps = current.memoizedProps;
        if (shallowEqual(prevProps, nextProps) && current.ref === workInProgress.ref) if (didReceiveUpdate = !1, workInProgress.pendingProps = nextProps = prevProps, checkScheduledUpdateOrContext(current, renderLanes)) 0 !== (current.flags & 131072) && (didReceiveUpdate = !0);
        else return workInProgress.lanes = current.lanes, bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
    }
    return updateFunctionComponent(current, workInProgress, Component, nextProps, renderLanes);
}
function updateOffscreenComponent(current, workInProgress, renderLanes, nextProps) {
    var nextChildren = nextProps.children, prevState = null !== current ? current.memoizedState : null;
    null === current && null === workInProgress.stateNode && (workInProgress.stateNode = {
        _visibility: 1,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null
    });
    if ("hidden" === nextProps.mode) {
        if (0 !== (workInProgress.flags & 128)) {
            prevState = null !== prevState ? prevState.baseLanes | renderLanes : renderLanes;
            if (null !== current) {
                nextProps = workInProgress.child = current.child;
                for(nextChildren = 0; null !== nextProps;)nextChildren = nextChildren | nextProps.lanes | nextProps.childLanes, nextProps = nextProps.sibling;
                nextProps = nextChildren & ~prevState;
            } else nextProps = 0, workInProgress.child = null;
            return deferHiddenOffscreenComponent(current, workInProgress, prevState, renderLanes, nextProps);
        }
        if (0 !== (renderLanes & 536870912)) workInProgress.memoizedState = {
            baseLanes: 0,
            cachePool: null
        }, null !== current && pushTransition(workInProgress, null !== prevState ? prevState.cachePool : null), null !== prevState ? pushHiddenContext(workInProgress, prevState) : reuseHiddenContextOnStack(), pushOffscreenSuspenseHandler(workInProgress);
        else return nextProps = workInProgress.lanes = 536870912, deferHiddenOffscreenComponent(current, workInProgress, null !== prevState ? prevState.baseLanes | renderLanes : renderLanes, renderLanes, nextProps);
    } else null !== prevState ? (pushTransition(workInProgress, prevState.cachePool), pushHiddenContext(workInProgress, prevState), reuseSuspenseHandlerOnStack(), workInProgress.memoizedState = null) : (null !== current && pushTransition(workInProgress, null), reuseHiddenContextOnStack(), reuseSuspenseHandlerOnStack());
    reconcileChildren(current, workInProgress, nextChildren, renderLanes);
    return workInProgress.child;
}
function bailoutOffscreenComponent(current, workInProgress) {
    null !== current && 22 === current.tag || null !== workInProgress.stateNode || (workInProgress.stateNode = {
        _visibility: 1,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null
    });
    return workInProgress.sibling;
}
function deferHiddenOffscreenComponent(current, workInProgress, nextBaseLanes, renderLanes, remainingChildLanes) {
    var JSCompiler_inline_result = peekCacheFromPool();
    JSCompiler_inline_result = null === JSCompiler_inline_result ? null : {
        parent: CacheContext._currentValue,
        pool: JSCompiler_inline_result
    };
    workInProgress.memoizedState = {
        baseLanes: nextBaseLanes,
        cachePool: JSCompiler_inline_result
    };
    null !== current && pushTransition(workInProgress, null);
    reuseHiddenContextOnStack();
    pushOffscreenSuspenseHandler(workInProgress);
    null !== current && propagateParentContextChanges(current, workInProgress, renderLanes, !0);
    workInProgress.childLanes = remainingChildLanes;
    return null;
}
function mountActivityChildren(workInProgress, nextProps) {
    nextProps = mountWorkInProgressOffscreenFiber({
        mode: nextProps.mode,
        children: nextProps.children
    }, workInProgress.mode);
    nextProps.ref = workInProgress.ref;
    workInProgress.child = nextProps;
    nextProps.return = workInProgress;
    return nextProps;
}
function retryActivityComponentWithoutHydrating(current, workInProgress, renderLanes) {
    reconcileChildFibers(workInProgress, current.child, null, renderLanes);
    current = mountActivityChildren(workInProgress, workInProgress.pendingProps);
    current.flags |= 2;
    popSuspenseHandler(workInProgress);
    workInProgress.memoizedState = null;
    return current;
}
function updateActivityComponent(current, workInProgress, renderLanes) {
    var nextProps = workInProgress.pendingProps, didSuspend = 0 !== (workInProgress.flags & 128);
    workInProgress.flags &= -129;
    if (null === current) {
        if (isHydrating) {
            if ("hidden" === nextProps.mode) return current = mountActivityChildren(workInProgress, nextProps), workInProgress.lanes = 536870912, current.memoizedState = {
                baseLanes: 0,
                cachePool: null
            }, bailoutOffscreenComponent(null, current);
            pushDehydratedActivitySuspenseHandler(workInProgress);
            (current = nextHydratableInstance) ? (current = canHydrateHydrationBoundary(current, rootOrSingletonContext), current = null !== current && "&" === current.data ? current : null, null !== current && (workInProgress.memoizedState = {
                dehydrated: current,
                treeContext: null !== treeContextProvider ? {
                    id: treeContextId,
                    overflow: treeContextOverflow
                } : null,
                retryLane: 536870912,
                hydrationErrors: null
            }, renderLanes = createFiberFromDehydratedFragment(current), renderLanes.return = workInProgress, workInProgress.child = renderLanes, hydrationParentFiber = workInProgress, nextHydratableInstance = null)) : current = null;
            if (null === current) throw throwOnHydrationMismatch(workInProgress);
            workInProgress.lanes = 536870912;
            return null;
        }
        return mountActivityChildren(workInProgress, nextProps);
    }
    var prevState = current.memoizedState;
    if (null !== prevState) {
        var dehydrated = prevState.dehydrated;
        pushDehydratedActivitySuspenseHandler(workInProgress);
        if (didSuspend) if (workInProgress.flags & 256) workInProgress.flags &= -257, workInProgress = retryActivityComponentWithoutHydrating(current, workInProgress, renderLanes);
        else if (null !== workInProgress.memoizedState) workInProgress.child = current.child, workInProgress.flags |= 128, workInProgress = null;
        else throw Error(formatProdErrorMessage(558));
        else if (didReceiveUpdate || propagateParentContextChanges(current, workInProgress, renderLanes, !1), didSuspend = 0 !== (renderLanes & current.childLanes), didReceiveUpdate || didSuspend) {
            if (null === currentTreeHiddenStackCursor.current) {
                nextProps = workInProgressRoot;
                if (null !== nextProps && (dehydrated = getBumpedLaneForHydration(nextProps, renderLanes), 0 !== dehydrated && dehydrated !== prevState.retryLane)) throw prevState.retryLane = dehydrated, enqueueConcurrentRenderForLane(current, dehydrated), scheduleUpdateOnFiber(nextProps, current, dehydrated), SelectiveHydrationException;
                renderDidSuspendDelayIfPossible();
            }
            workInProgress = retryActivityComponentWithoutHydrating(current, workInProgress, renderLanes);
        } else current = prevState.treeContext, nextHydratableInstance = getNextHydratable(dehydrated.nextSibling), hydrationParentFiber = workInProgress, isHydrating = !0, hydrationErrors = null, rootOrSingletonContext = !1, null !== current && restoreSuspendedTreeContext(workInProgress, current), workInProgress = mountActivityChildren(workInProgress, nextProps), workInProgress.flags |= 134221824;
        return workInProgress;
    }
    current = createWorkInProgress(current.child, {
        mode: nextProps.mode,
        children: nextProps.children
    });
    current.ref = workInProgress.ref;
    workInProgress.child = current;
    current.return = workInProgress;
    return current;
}
function markRef(current, workInProgress) {
    var ref = workInProgress.ref;
    if (null === ref) null !== current && null !== current.ref && (workInProgress.flags |= 4194816);
    else {
        if ("function" !== typeof ref && "object" !== typeof ref) throw Error(formatProdErrorMessage(284));
        if (null === current || current.ref !== ref) workInProgress.flags |= 4194816;
    }
}
function updateFunctionComponent(current, workInProgress, Component, nextProps, renderLanes) {
    prepareToReadContext(workInProgress);
    Component = renderWithHooks(current, workInProgress, Component, nextProps, void 0, renderLanes);
    nextProps = checkDidRenderIdHook();
    if (null !== current && !didReceiveUpdate) return bailoutHooks(current, workInProgress, renderLanes), bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
    isHydrating && nextProps && pushMaterializedTreeId(workInProgress);
    workInProgress.flags |= 1;
    reconcileChildren(current, workInProgress, Component, renderLanes);
    return workInProgress.child;
}
function replayFunctionComponent(current, workInProgress, nextProps, Component, secondArg, renderLanes) {
    prepareToReadContext(workInProgress);
    workInProgress.updateQueue = null;
    nextProps = renderWithHooksAgain(workInProgress, Component, nextProps, secondArg);
    finishRenderingHooks(current);
    Component = checkDidRenderIdHook();
    if (null !== current && !didReceiveUpdate) return bailoutHooks(current, workInProgress, renderLanes), bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
    isHydrating && Component && pushMaterializedTreeId(workInProgress);
    workInProgress.flags |= 1;
    reconcileChildren(current, workInProgress, nextProps, renderLanes);
    return workInProgress.child;
}
function updateClassComponent(current, workInProgress, Component, nextProps, renderLanes) {
    prepareToReadContext(workInProgress);
    if (null === workInProgress.stateNode) {
        var context = emptyContextObject, contextType = Component.contextType;
        "object" === typeof contextType && null !== contextType && (context = readContext(contextType));
        context = new Component(nextProps, context);
        workInProgress.memoizedState = null !== context.state && void 0 !== context.state ? context.state : null;
        context.updater = classComponentUpdater;
        workInProgress.stateNode = context;
        context._reactInternals = workInProgress;
        context = workInProgress.stateNode;
        context.props = nextProps;
        context.state = workInProgress.memoizedState;
        context.refs = {};
        initializeUpdateQueue(workInProgress);
        contextType = Component.contextType;
        context.context = "object" === typeof contextType && null !== contextType ? readContext(contextType) : emptyContextObject;
        context.state = workInProgress.memoizedState;
        contextType = Component.getDerivedStateFromProps;
        "function" === typeof contextType && (applyDerivedStateFromProps(workInProgress, Component, contextType, nextProps), context.state = workInProgress.memoizedState);
        "function" === typeof Component.getDerivedStateFromProps || "function" === typeof context.getSnapshotBeforeUpdate || "function" !== typeof context.UNSAFE_componentWillMount && "function" !== typeof context.componentWillMount || (contextType = context.state, "function" === typeof context.componentWillMount && context.componentWillMount(), "function" === typeof context.UNSAFE_componentWillMount && context.UNSAFE_componentWillMount(), contextType !== context.state && classComponentUpdater.enqueueReplaceState(context, context.state, null), processUpdateQueue(workInProgress, nextProps, context, renderLanes), suspendIfUpdateReadFromEntangledAsyncAction(), context.state = workInProgress.memoizedState);
        "function" === typeof context.componentDidMount && (workInProgress.flags |= 4194308);
        nextProps = !0;
    } else if (null === current) {
        context = workInProgress.stateNode;
        var unresolvedOldProps = workInProgress.memoizedProps, oldProps = resolveClassComponentProps(Component, unresolvedOldProps);
        context.props = oldProps;
        var oldContext = context.context, contextType$jscomp$0 = Component.contextType;
        contextType = emptyContextObject;
        "object" === typeof contextType$jscomp$0 && null !== contextType$jscomp$0 && (contextType = readContext(contextType$jscomp$0));
        var getDerivedStateFromProps = Component.getDerivedStateFromProps;
        contextType$jscomp$0 = "function" === typeof getDerivedStateFromProps || "function" === typeof context.getSnapshotBeforeUpdate;
        unresolvedOldProps = workInProgress.pendingProps !== unresolvedOldProps;
        contextType$jscomp$0 || "function" !== typeof context.UNSAFE_componentWillReceiveProps && "function" !== typeof context.componentWillReceiveProps || (unresolvedOldProps || oldContext !== contextType) && callComponentWillReceiveProps(workInProgress, context, nextProps, contextType);
        hasForceUpdate = !1;
        var oldState = workInProgress.memoizedState;
        context.state = oldState;
        processUpdateQueue(workInProgress, nextProps, context, renderLanes);
        suspendIfUpdateReadFromEntangledAsyncAction();
        oldContext = workInProgress.memoizedState;
        unresolvedOldProps || oldState !== oldContext || hasForceUpdate ? ("function" === typeof getDerivedStateFromProps && (applyDerivedStateFromProps(workInProgress, Component, getDerivedStateFromProps, nextProps), oldContext = workInProgress.memoizedState), (oldProps = hasForceUpdate || checkShouldComponentUpdate(workInProgress, Component, oldProps, nextProps, oldState, oldContext, contextType)) ? (contextType$jscomp$0 || "function" !== typeof context.UNSAFE_componentWillMount && "function" !== typeof context.componentWillMount || ("function" === typeof context.componentWillMount && context.componentWillMount(), "function" === typeof context.UNSAFE_componentWillMount && context.UNSAFE_componentWillMount()), "function" === typeof context.componentDidMount && (workInProgress.flags |= 4194308)) : ("function" === typeof context.componentDidMount && (workInProgress.flags |= 4194308), workInProgress.memoizedProps = nextProps, workInProgress.memoizedState = oldContext), context.props = nextProps, context.state = oldContext, context.context = contextType, nextProps = oldProps) : ("function" === typeof context.componentDidMount && (workInProgress.flags |= 4194308), nextProps = !1);
    } else {
        context = workInProgress.stateNode;
        cloneUpdateQueue(current, workInProgress);
        contextType = workInProgress.memoizedProps;
        contextType$jscomp$0 = resolveClassComponentProps(Component, contextType);
        context.props = contextType$jscomp$0;
        getDerivedStateFromProps = workInProgress.pendingProps;
        oldState = context.context;
        oldContext = Component.contextType;
        oldProps = emptyContextObject;
        "object" === typeof oldContext && null !== oldContext && (oldProps = readContext(oldContext));
        unresolvedOldProps = Component.getDerivedStateFromProps;
        (oldContext = "function" === typeof unresolvedOldProps || "function" === typeof context.getSnapshotBeforeUpdate) || "function" !== typeof context.UNSAFE_componentWillReceiveProps && "function" !== typeof context.componentWillReceiveProps || (contextType !== getDerivedStateFromProps || oldState !== oldProps) && callComponentWillReceiveProps(workInProgress, context, nextProps, oldProps);
        hasForceUpdate = !1;
        oldState = workInProgress.memoizedState;
        context.state = oldState;
        processUpdateQueue(workInProgress, nextProps, context, renderLanes);
        suspendIfUpdateReadFromEntangledAsyncAction();
        var newState = workInProgress.memoizedState;
        contextType !== getDerivedStateFromProps || oldState !== newState || hasForceUpdate || null !== current && null !== current.dependencies && checkIfContextChanged(current.dependencies) ? ("function" === typeof unresolvedOldProps && (applyDerivedStateFromProps(workInProgress, Component, unresolvedOldProps, nextProps), newState = workInProgress.memoizedState), (contextType$jscomp$0 = hasForceUpdate || checkShouldComponentUpdate(workInProgress, Component, contextType$jscomp$0, nextProps, oldState, newState, oldProps) || null !== current && null !== current.dependencies && checkIfContextChanged(current.dependencies)) ? (oldContext || "function" !== typeof context.UNSAFE_componentWillUpdate && "function" !== typeof context.componentWillUpdate || ("function" === typeof context.componentWillUpdate && context.componentWillUpdate(nextProps, newState, oldProps), "function" === typeof context.UNSAFE_componentWillUpdate && context.UNSAFE_componentWillUpdate(nextProps, newState, oldProps)), "function" === typeof context.componentDidUpdate && (workInProgress.flags |= 4), "function" === typeof context.getSnapshotBeforeUpdate && (workInProgress.flags |= 1024)) : ("function" !== typeof context.componentDidUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress.flags |= 4), "function" !== typeof context.getSnapshotBeforeUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress.flags |= 1024), workInProgress.memoizedProps = nextProps, workInProgress.memoizedState = newState), context.props = nextProps, context.state = newState, context.context = oldProps, nextProps = contextType$jscomp$0) : ("function" !== typeof context.componentDidUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress.flags |= 4), "function" !== typeof context.getSnapshotBeforeUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress.flags |= 1024), nextProps = !1);
    }
    context = nextProps;
    markRef(current, workInProgress);
    nextProps = 0 !== (workInProgress.flags & 128);
    context || nextProps ? (context = workInProgress.stateNode, Component = nextProps && "function" !== typeof Component.getDerivedStateFromError ? null : context.render(), workInProgress.flags |= 1, null !== current && nextProps ? (workInProgress.child = reconcileChildFibers(workInProgress, current.child, null, renderLanes), workInProgress.child = reconcileChildFibers(workInProgress, null, Component, renderLanes)) : reconcileChildren(current, workInProgress, Component, renderLanes), workInProgress.memoizedState = context.state, current = workInProgress.child) : current = bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
    return current;
}
function mountHostRootWithoutHydrating(current, workInProgress, nextChildren, renderLanes) {
    resetHydrationState();
    workInProgress.flags |= 256;
    reconcileChildren(current, workInProgress, nextChildren, renderLanes);
    return workInProgress.child;
}
var SUSPENDED_MARKER = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
};
function mountSuspenseOffscreenState(renderLanes) {
    return {
        baseLanes: renderLanes,
        cachePool: getSuspendedCache()
    };
}
function getRemainingWorkInPrimaryTree(current, primaryTreeDidDefer, renderLanes) {
    current = null !== current ? current.childLanes & ~renderLanes : 0;
    primaryTreeDidDefer && (current |= workInProgressDeferredLane);
    return current;
}
function updateSuspenseComponent(current, workInProgress, renderLanes) {
    var nextProps = workInProgress.pendingProps, showFallback = !1, didSuspend = 0 !== (workInProgress.flags & 128), JSCompiler_temp;
    (JSCompiler_temp = didSuspend) || (JSCompiler_temp = null !== current && null === current.memoizedState ? !1 : 0 !== (suspenseStackCursor.current & 2));
    JSCompiler_temp && (showFallback = !0, workInProgress.flags &= -129);
    JSCompiler_temp = 0 !== (workInProgress.flags & 32);
    workInProgress.flags &= -33;
    if (null === current) {
        if (isHydrating) {
            showFallback ? pushPrimaryTreeSuspenseHandler(workInProgress) : reuseSuspenseHandlerOnStack();
            (current = nextHydratableInstance) ? (current = canHydrateHydrationBoundary(current, rootOrSingletonContext), current = null !== current && "&" !== current.data ? current : null, null !== current && (workInProgress.memoizedState = {
                dehydrated: current,
                treeContext: null !== treeContextProvider ? {
                    id: treeContextId,
                    overflow: treeContextOverflow
                } : null,
                retryLane: 536870912,
                hydrationErrors: null
            }, renderLanes = createFiberFromDehydratedFragment(current), renderLanes.return = workInProgress, workInProgress.child = renderLanes, hydrationParentFiber = workInProgress, nextHydratableInstance = null)) : current = null;
            if (null === current) throw throwOnHydrationMismatch(workInProgress);
            isSuspenseInstanceFallback(current) ? workInProgress.lanes = 32 : workInProgress.lanes = 536870912;
            return null;
        }
        didSuspend = nextProps.children;
        nextProps = nextProps.fallback;
        if (showFallback) return reuseSuspenseHandlerOnStack(), showFallback = workInProgress.mode, didSuspend = mountWorkInProgressOffscreenFiber({
            mode: "hidden",
            children: didSuspend
        }, showFallback), nextProps = createFiberFromFragment(nextProps, showFallback, renderLanes, null), didSuspend.return = workInProgress, nextProps.return = workInProgress, didSuspend.sibling = nextProps, workInProgress.child = didSuspend, nextProps = workInProgress.child, nextProps.memoizedState = mountSuspenseOffscreenState(renderLanes), nextProps.childLanes = getRemainingWorkInPrimaryTree(current, JSCompiler_temp, renderLanes), workInProgress.memoizedState = SUSPENDED_MARKER, bailoutOffscreenComponent(null, nextProps);
        pushPrimaryTreeSuspenseHandler(workInProgress);
        return mountSuspensePrimaryChildren(workInProgress, didSuspend);
    }
    var prevState = current.memoizedState;
    if (null !== prevState) {
        var dehydrated$96 = prevState.dehydrated;
        if (null !== dehydrated$96) return updateDehydratedSuspenseComponent(current, workInProgress, didSuspend, JSCompiler_temp, nextProps, dehydrated$96, prevState, renderLanes);
    }
    if (showFallback) return reuseSuspenseHandlerOnStack(), showFallback = nextProps.fallback, didSuspend = workInProgress.mode, prevState = current.child, dehydrated$96 = prevState.sibling, nextProps = createWorkInProgress(prevState, {
        mode: "hidden",
        children: nextProps.children
    }), nextProps.subtreeFlags = prevState.subtreeFlags & 1206910976, null !== dehydrated$96 ? showFallback = createWorkInProgress(dehydrated$96, showFallback) : (showFallback = createFiberFromFragment(showFallback, didSuspend, renderLanes, null), showFallback.flags |= 2), showFallback.return = workInProgress, nextProps.return = workInProgress, nextProps.sibling = showFallback, workInProgress.child = nextProps, bailoutOffscreenComponent(null, nextProps), nextProps = workInProgress.child, showFallback = current.child.memoizedState, null === showFallback ? showFallback = mountSuspenseOffscreenState(renderLanes) : (didSuspend = showFallback.cachePool, null !== didSuspend ? (prevState = CacheContext._currentValue, didSuspend = didSuspend.parent !== prevState ? {
        parent: prevState,
        pool: prevState
    } : didSuspend) : didSuspend = getSuspendedCache(), showFallback = {
        baseLanes: showFallback.baseLanes | renderLanes,
        cachePool: didSuspend
    }), nextProps.memoizedState = showFallback, nextProps.childLanes = getRemainingWorkInPrimaryTree(current, JSCompiler_temp, renderLanes), workInProgress.memoizedState = SUSPENDED_MARKER, bailoutOffscreenComponent(current.child, nextProps);
    pushPrimaryTreeSuspenseHandler(workInProgress);
    renderLanes = current.child;
    current = renderLanes.sibling;
    renderLanes = createWorkInProgress(renderLanes, {
        mode: "visible",
        children: nextProps.children
    });
    renderLanes.return = workInProgress;
    renderLanes.sibling = null;
    null !== current && (JSCompiler_temp = workInProgress.deletions, null === JSCompiler_temp ? (workInProgress.deletions = [
        current
    ], workInProgress.flags |= 16) : JSCompiler_temp.push(current));
    workInProgress.child = renderLanes;
    workInProgress.memoizedState = null;
    return renderLanes;
}
function mountSuspensePrimaryChildren(workInProgress, primaryChildren) {
    primaryChildren = mountWorkInProgressOffscreenFiber({
        mode: "visible",
        children: primaryChildren
    }, workInProgress.mode);
    primaryChildren.return = workInProgress;
    return workInProgress.child = primaryChildren;
}
function mountWorkInProgressOffscreenFiber(offscreenProps, mode) {
    offscreenProps = createFiberImplClass(22, offscreenProps, null, mode);
    offscreenProps.lanes = 0;
    return offscreenProps;
}
function retrySuspenseComponentWithoutHydrating(current, workInProgress, renderLanes) {
    reconcileChildFibers(workInProgress, current.child, null, renderLanes);
    current = mountSuspensePrimaryChildren(workInProgress, workInProgress.pendingProps.children);
    current.flags |= 2;
    workInProgress.memoizedState = null;
    return current;
}
function updateDehydratedSuspenseComponent(current, workInProgress, didSuspend, didPrimaryChildrenDefer, nextProps, suspenseInstance, suspenseState, renderLanes) {
    if (didSuspend) {
        if (workInProgress.flags & 256) return pushPrimaryTreeSuspenseHandler(workInProgress), workInProgress.flags &= -257, retrySuspenseComponentWithoutHydrating(current, workInProgress, renderLanes);
        if (null !== workInProgress.memoizedState) return reuseSuspenseHandlerOnStack(), workInProgress.child = current.child, workInProgress.flags |= 128, null;
        reuseSuspenseHandlerOnStack();
        suspenseInstance = nextProps.fallback;
        suspenseState = workInProgress.mode;
        nextProps = mountWorkInProgressOffscreenFiber({
            mode: "visible",
            children: nextProps.children
        }, suspenseState);
        suspenseInstance = createFiberFromFragment(suspenseInstance, suspenseState, renderLanes, null);
        suspenseInstance.flags |= 2;
        nextProps.return = workInProgress;
        suspenseInstance.return = workInProgress;
        nextProps.sibling = suspenseInstance;
        workInProgress.child = nextProps;
        reconcileChildFibers(workInProgress, current.child, null, renderLanes);
        nextProps = workInProgress.child;
        nextProps.memoizedState = mountSuspenseOffscreenState(renderLanes);
        nextProps.childLanes = getRemainingWorkInPrimaryTree(current, didPrimaryChildrenDefer, renderLanes);
        workInProgress.memoizedState = SUSPENDED_MARKER;
        return bailoutOffscreenComponent(null, nextProps);
    }
    pushPrimaryTreeSuspenseHandler(workInProgress);
    if (isSuspenseInstanceFallback(suspenseInstance)) {
        didPrimaryChildrenDefer = suspenseInstance.nextSibling && suspenseInstance.nextSibling.dataset;
        if (didPrimaryChildrenDefer) var digest = didPrimaryChildrenDefer.dgst;
        didPrimaryChildrenDefer = digest;
        "" !== didPrimaryChildrenDefer && (nextProps = Error(formatProdErrorMessage(419)), nextProps.stack = "", nextProps.digest = didPrimaryChildrenDefer, queueHydrationError({
            value: nextProps,
            source: null,
            stack: null
        }));
        return retrySuspenseComponentWithoutHydrating(current, workInProgress, renderLanes);
    }
    didReceiveUpdate || propagateParentContextChanges(current, workInProgress, renderLanes, !1);
    didPrimaryChildrenDefer = 0 !== (renderLanes & current.childLanes);
    if (didReceiveUpdate || didPrimaryChildrenDefer) {
        if (null !== currentTreeHiddenStackCursor.current) return retrySuspenseComponentWithoutHydrating(current, workInProgress, renderLanes);
        didPrimaryChildrenDefer = workInProgressRoot;
        if (null !== didPrimaryChildrenDefer && (nextProps = getBumpedLaneForHydration(didPrimaryChildrenDefer, renderLanes), 0 !== nextProps && nextProps !== suspenseState.retryLane)) throw suspenseState.retryLane = nextProps, enqueueConcurrentRenderForLane(current, nextProps), scheduleUpdateOnFiber(didPrimaryChildrenDefer, current, nextProps), SelectiveHydrationException;
        isSuspenseInstancePending(suspenseInstance) || renderDidSuspendDelayIfPossible();
        return retrySuspenseComponentWithoutHydrating(current, workInProgress, renderLanes);
    }
    if (isSuspenseInstancePending(suspenseInstance)) return workInProgress.flags |= 192, workInProgress.child = current.child, null;
    current = suspenseState.treeContext;
    nextHydratableInstance = getNextHydratable(suspenseInstance.nextSibling);
    hydrationParentFiber = workInProgress;
    isHydrating = !0;
    hydrationErrors = null;
    rootOrSingletonContext = !1;
    null !== current && restoreSuspendedTreeContext(workInProgress, current);
    workInProgress = mountSuspensePrimaryChildren(workInProgress, nextProps.children);
    workInProgress.flags |= 134221824;
    return workInProgress;
}
function scheduleSuspenseWorkOnFiber(fiber, renderLanes, propagationRoot) {
    fiber.lanes |= renderLanes;
    var alternate = fiber.alternate;
    null !== alternate && (alternate.lanes |= renderLanes);
    scheduleContextWorkOnParentPath(fiber.return, renderLanes, propagationRoot);
}
function findLastContentRow(firstChild) {
    for(var lastContentRow = null; null !== firstChild;){
        var currentRow = firstChild.alternate;
        null !== currentRow && null === findFirstSuspended(currentRow) && (lastContentRow = firstChild);
        firstChild = firstChild.sibling;
    }
    return lastContentRow;
}
function initSuspenseListRenderState(workInProgress, isBackwards, tail, lastContentRow, tailMode, treeForkCount) {
    var renderState = workInProgress.memoizedState;
    null === renderState ? workInProgress.memoizedState = {
        isBackwards: isBackwards,
        rendering: null,
        renderingStartTime: 0,
        last: lastContentRow,
        tail: tail,
        tailMode: tailMode,
        treeForkCount: treeForkCount
    } : (renderState.isBackwards = isBackwards, renderState.rendering = null, renderState.renderingStartTime = 0, renderState.last = lastContentRow, renderState.tail = tail, renderState.tailMode = tailMode, renderState.treeForkCount = treeForkCount);
}
function reverseChildren(fiber) {
    var row = fiber.child;
    for(fiber.child = null; null !== row;){
        var nextRow = row.sibling;
        row.sibling = fiber.child;
        fiber.child = row;
        row = nextRow;
    }
}
function updateSuspenseListComponent(current, workInProgress, renderLanes) {
    var nextProps = workInProgress.pendingProps, revealOrder = nextProps.revealOrder, tailMode = nextProps.tail;
    nextProps = nextProps.children;
    var suspenseContext = suspenseStackCursor.current;
    if (workInProgress.flags & 128) return pushSuspenseListContext(workInProgress, suspenseContext), null;
    var shouldForceFallback = 0 !== (suspenseContext & 2);
    shouldForceFallback ? (suspenseContext = suspenseContext & 1 | 2, workInProgress.flags |= 128) : suspenseContext &= 1;
    pushSuspenseListContext(workInProgress, suspenseContext);
    "backwards" === revealOrder && null !== current ? (reverseChildren(current), reconcileChildren(current, workInProgress, nextProps, renderLanes), reverseChildren(current)) : reconcileChildren(current, workInProgress, nextProps, renderLanes);
    nextProps = isHydrating ? treeForkCount : 0;
    if (!shouldForceFallback && null !== current && 0 !== (current.flags & 128)) a: for(current = workInProgress.child; null !== current;){
        if (13 === current.tag) null !== current.memoizedState && scheduleSuspenseWorkOnFiber(current, renderLanes, workInProgress);
        else if (19 === current.tag) scheduleSuspenseWorkOnFiber(current, renderLanes, workInProgress);
        else if (null !== current.child) {
            current.child.return = current;
            current = current.child;
            continue;
        }
        if (current === workInProgress) break a;
        for(; null === current.sibling;){
            if (null === current.return || current.return === workInProgress) break a;
            current = current.return;
        }
        current.sibling.return = current.return;
        current = current.sibling;
    }
    switch(revealOrder){
        case "backwards":
            renderLanes = findLastContentRow(workInProgress.child);
            null === renderLanes ? (revealOrder = workInProgress.child, workInProgress.child = null) : (revealOrder = renderLanes.sibling, renderLanes.sibling = null, reverseChildren(workInProgress));
            initSuspenseListRenderState(workInProgress, !0, revealOrder, null, tailMode, nextProps);
            break;
        case "unstable_legacy-backwards":
            renderLanes = null;
            revealOrder = workInProgress.child;
            for(workInProgress.child = null; null !== revealOrder;){
                current = revealOrder.alternate;
                if (null !== current && null === findFirstSuspended(current)) {
                    workInProgress.child = revealOrder;
                    break;
                }
                current = revealOrder.sibling;
                revealOrder.sibling = renderLanes;
                renderLanes = revealOrder;
                revealOrder = current;
            }
            initSuspenseListRenderState(workInProgress, !0, renderLanes, null, tailMode, nextProps);
            break;
        case "together":
            initSuspenseListRenderState(workInProgress, !1, null, null, void 0, nextProps);
            break;
        case "independent":
            workInProgress.memoizedState = null;
            break;
        default:
            renderLanes = findLastContentRow(workInProgress.child), null === renderLanes ? (revealOrder = workInProgress.child, workInProgress.child = null) : (revealOrder = renderLanes.sibling, renderLanes.sibling = null), initSuspenseListRenderState(workInProgress, !1, revealOrder, renderLanes, tailMode, nextProps);
    }
    return workInProgress.child;
}
function updateContextProvider(current, workInProgress, renderLanes) {
    var newProps = workInProgress.pendingProps;
    pushProvider(workInProgress, workInProgress.type, newProps.value);
    reconcileChildren(current, workInProgress, newProps.children, renderLanes);
    return workInProgress.child;
}
function bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes) {
    null !== current && (workInProgress.dependencies = current.dependencies);
    workInProgressRootSkippedLanes |= workInProgress.lanes;
    if (0 === (renderLanes & workInProgress.childLanes)) if (null !== current) {
        if (propagateParentContextChanges(current, workInProgress, renderLanes, !1), 0 === (renderLanes & workInProgress.childLanes)) return null;
    } else return null;
    if (null !== current && workInProgress.child !== current.child) throw Error(formatProdErrorMessage(153));
    if (null !== workInProgress.child) {
        current = workInProgress.child;
        renderLanes = createWorkInProgress(current, current.pendingProps);
        workInProgress.child = renderLanes;
        for(renderLanes.return = workInProgress; null !== current.sibling;)current = current.sibling, renderLanes = renderLanes.sibling = createWorkInProgress(current, current.pendingProps), renderLanes.return = workInProgress;
        renderLanes.sibling = null;
    }
    return workInProgress.child;
}
function checkScheduledUpdateOrContext(current, renderLanes) {
    if (0 !== (current.lanes & renderLanes)) return !0;
    current = current.dependencies;
    return null !== current && checkIfContextChanged(current) ? !0 : !1;
}
function attemptEarlyBailoutIfNoScheduledUpdate(current, workInProgress, renderLanes) {
    switch(workInProgress.tag){
        case 3:
            pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
            pushProvider(workInProgress, CacheContext, current.memoizedState.cache);
            resetHydrationState();
            break;
        case 27:
        case 5:
            pushHostContext(workInProgress);
            break;
        case 4:
            pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
            break;
        case 10:
            pushProvider(workInProgress, workInProgress.type, workInProgress.memoizedProps.value);
            break;
        case 31:
            if (null !== workInProgress.memoizedState) return workInProgress.flags |= 128, pushDehydratedActivitySuspenseHandler(workInProgress), null;
            break;
        case 13:
            var state$108 = workInProgress.memoizedState;
            if (null !== state$108) {
                if (null !== state$108.dehydrated) return pushPrimaryTreeSuspenseHandler(workInProgress), workInProgress.flags |= 128, null;
                state$108 = propagateParentContextChanges(current, workInProgress, renderLanes, !1);
                var primaryChildLanes = workInProgress.child.childLanes;
                if (state$108 || 0 !== (renderLanes & primaryChildLanes)) return updateSuspenseComponent(current, workInProgress, renderLanes);
                pushPrimaryTreeSuspenseHandler(workInProgress);
                current = bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
                return null !== current ? current.sibling : null;
            }
            pushPrimaryTreeSuspenseHandler(workInProgress);
            break;
        case 19:
            if (workInProgress.flags & 128) return updateSuspenseListComponent(current, workInProgress, renderLanes);
            primaryChildLanes = 0 !== (current.flags & 128);
            state$108 = 0 !== (renderLanes & workInProgress.childLanes);
            state$108 || (propagateParentContextChanges(current, workInProgress, renderLanes, !1), state$108 = 0 !== (renderLanes & workInProgress.childLanes));
            if (primaryChildLanes) {
                if (state$108) return updateSuspenseListComponent(current, workInProgress, renderLanes);
                workInProgress.flags |= 128;
            }
            primaryChildLanes = workInProgress.memoizedState;
            null !== primaryChildLanes && (primaryChildLanes.rendering = null, primaryChildLanes.tail = null, primaryChildLanes.lastEffect = null);
            pushSuspenseListContext(workInProgress, suspenseStackCursor.current);
            if (state$108) break;
            else return null;
        case 22:
            return workInProgress.lanes = 0, updateOffscreenComponent(current, workInProgress, renderLanes, workInProgress.pendingProps);
        case 24:
            pushProvider(workInProgress, CacheContext, current.memoizedState.cache);
    }
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
}
function beginWork(current, workInProgress, renderLanes) {
    if (null !== current) if (current.memoizedProps !== workInProgress.pendingProps) didReceiveUpdate = !0;
    else {
        if (!checkScheduledUpdateOrContext(current, renderLanes) && 0 === (workInProgress.flags & 128)) return didReceiveUpdate = !1, attemptEarlyBailoutIfNoScheduledUpdate(current, workInProgress, renderLanes);
        didReceiveUpdate = 0 !== (current.flags & 131072) ? !0 : !1;
    }
    else didReceiveUpdate = !1, isHydrating && 0 !== (workInProgress.flags & 1048576) && pushTreeId(workInProgress, treeForkCount, workInProgress.index);
    workInProgress.lanes = 0;
    switch(workInProgress.tag){
        case 16:
            a: {
                var props = workInProgress.pendingProps;
                current = resolveLazy(workInProgress.elementType);
                workInProgress.type = current;
                if ("function" === typeof current) shouldConstruct(current) ? (props = resolveClassComponentProps(current, props), workInProgress.tag = 1, workInProgress = updateClassComponent(null, workInProgress, current, props, renderLanes)) : (workInProgress.tag = 0, workInProgress = updateFunctionComponent(null, workInProgress, current, props, renderLanes));
                else {
                    if (void 0 !== current && null !== current) {
                        var $$typeof = current.$$typeof;
                        if ($$typeof === REACT_FORWARD_REF_TYPE) {
                            workInProgress.tag = 11;
                            workInProgress = updateForwardRef(null, workInProgress, current, props, renderLanes);
                            break a;
                        } else if ($$typeof === REACT_MEMO_TYPE) {
                            workInProgress.tag = 14;
                            workInProgress = updateMemoComponent(null, workInProgress, current, props, renderLanes);
                            break a;
                        } else if ($$typeof === REACT_CONTEXT_TYPE) {
                            workInProgress.tag = 10;
                            workInProgress.type = current;
                            workInProgress = updateContextProvider(null, workInProgress, renderLanes);
                            break a;
                        }
                    }
                    workInProgress = getComponentNameFromType(current) || current;
                    throw Error(formatProdErrorMessage(306, workInProgress, ""));
                }
            }
            return workInProgress;
        case 0:
            return updateFunctionComponent(current, workInProgress, workInProgress.type, workInProgress.pendingProps, renderLanes);
        case 1:
            return props = workInProgress.type, $$typeof = resolveClassComponentProps(props, workInProgress.pendingProps), updateClassComponent(current, workInProgress, props, $$typeof, renderLanes);
        case 3:
            a: {
                pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
                if (null === current) throw Error(formatProdErrorMessage(387));
                props = workInProgress.pendingProps;
                var prevState = workInProgress.memoizedState;
                $$typeof = prevState.element;
                cloneUpdateQueue(current, workInProgress);
                processUpdateQueue(workInProgress, props, null, renderLanes);
                var nextState = workInProgress.memoizedState;
                props = nextState.cache;
                pushProvider(workInProgress, CacheContext, props);
                props !== prevState.cache && propagateContextChanges(workInProgress, [
                    CacheContext
                ], renderLanes, !0);
                suspendIfUpdateReadFromEntangledAsyncAction();
                props = nextState.element;
                if (prevState.isDehydrated) if (prevState = {
                    element: props,
                    isDehydrated: !1,
                    cache: nextState.cache
                }, workInProgress.updateQueue.baseState = prevState, workInProgress.memoizedState = prevState, workInProgress.flags & 256) {
                    workInProgress = mountHostRootWithoutHydrating(current, workInProgress, props, renderLanes);
                    break a;
                } else if (props !== $$typeof) {
                    $$typeof = createCapturedValueAtFiber(Error(formatProdErrorMessage(424)), workInProgress);
                    queueHydrationError($$typeof);
                    workInProgress = mountHostRootWithoutHydrating(current, workInProgress, props, renderLanes);
                    break a;
                } else {
                    current = workInProgress.stateNode.containerInfo;
                    switch(current.nodeType){
                        case 9:
                            current = current.body;
                            break;
                        default:
                            current = "HTML" === current.nodeName ? current.ownerDocument.body : current;
                    }
                    nextHydratableInstance = getNextHydratable(current.firstChild);
                    hydrationParentFiber = workInProgress;
                    isHydrating = !0;
                    hydrationErrors = null;
                    rootOrSingletonContext = !0;
                    renderLanes = mountChildFibers(workInProgress, null, props, renderLanes);
                    for(workInProgress.child = renderLanes; renderLanes;)renderLanes.flags = renderLanes.flags & -3 | 134221824, renderLanes = renderLanes.sibling;
                }
                else {
                    resetHydrationState();
                    if (props === $$typeof) {
                        workInProgress = bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
                        break a;
                    }
                    reconcileChildren(current, workInProgress, props, renderLanes);
                }
                workInProgress = workInProgress.child;
            }
            return workInProgress;
        case 26:
            return markRef(current, workInProgress), null === current ? (renderLanes = getResource(workInProgress.type, null, workInProgress.pendingProps, null)) ? workInProgress.memoizedState = renderLanes : isHydrating || (workInProgress.stateNode = createHoistableInstance(workInProgress.type, workInProgress.pendingProps, rootInstanceStackCursor.current, workInProgress)) : workInProgress.memoizedState = getResource(workInProgress.type, current.memoizedProps, workInProgress.pendingProps, current.memoizedState), null;
        case 27:
            return pushHostContext(workInProgress), null === current && isHydrating && (props = workInProgress.stateNode = resolveSingletonInstance(workInProgress.type, workInProgress.pendingProps, rootInstanceStackCursor.current), hydrationParentFiber = workInProgress, rootOrSingletonContext = !0, $$typeof = nextHydratableInstance, isSingletonScope(workInProgress.type) ? (previousHydratableOnEnteringScopedSingleton = $$typeof, nextHydratableInstance = getNextHydratable(props.firstChild)) : nextHydratableInstance = $$typeof), reconcileChildren(current, workInProgress, workInProgress.pendingProps.children, renderLanes), markRef(current, workInProgress), null === current && (workInProgress.flags |= 4194304), workInProgress.child;
        case 5:
            if (null === current && isHydrating) {
                if ($$typeof = props = nextHydratableInstance) props = canHydrateInstance(props, workInProgress.type, workInProgress.pendingProps, rootOrSingletonContext), null !== props ? (workInProgress.stateNode = props, hydrationParentFiber = workInProgress, nextHydratableInstance = getNextHydratable(props.firstChild), rootOrSingletonContext = !1, $$typeof = !0) : $$typeof = !1;
                $$typeof || throwOnHydrationMismatch(workInProgress);
            }
            pushHostContext(workInProgress);
            $$typeof = workInProgress.type;
            prevState = workInProgress.pendingProps;
            nextState = null !== current ? current.memoizedProps : null;
            props = prevState.children;
            shouldSetTextContent($$typeof, prevState) ? props = null : null !== nextState && shouldSetTextContent($$typeof, nextState) && (workInProgress.flags |= 32);
            null !== workInProgress.memoizedState && ($$typeof = renderWithHooks(current, workInProgress, TransitionAwareHostComponent, null, null, renderLanes), HostTransitionContext._currentValue = $$typeof);
            markRef(current, workInProgress);
            reconcileChildren(current, workInProgress, props, renderLanes);
            return workInProgress.child;
        case 6:
            if (null === current && isHydrating) {
                if (current = renderLanes = nextHydratableInstance) renderLanes = canHydrateTextInstance(renderLanes, workInProgress.pendingProps, rootOrSingletonContext), null !== renderLanes ? (workInProgress.stateNode = renderLanes, hydrationParentFiber = workInProgress, nextHydratableInstance = null, current = !0) : current = !1;
                current || throwOnHydrationMismatch(workInProgress);
            }
            return null;
        case 13:
            return updateSuspenseComponent(current, workInProgress, renderLanes);
        case 4:
            return pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo), props = workInProgress.pendingProps, null === current ? workInProgress.child = reconcileChildFibers(workInProgress, null, props, renderLanes) : reconcileChildren(current, workInProgress, props, renderLanes), workInProgress.child;
        case 11:
            return updateForwardRef(current, workInProgress, workInProgress.type, workInProgress.pendingProps, renderLanes);
        case 7:
            return props = workInProgress.pendingProps, markRef(current, workInProgress), reconcileChildren(current, workInProgress, props, renderLanes), workInProgress.child;
        case 8:
            return reconcileChildren(current, workInProgress, workInProgress.pendingProps.children, renderLanes), workInProgress.child;
        case 12:
            return reconcileChildren(current, workInProgress, workInProgress.pendingProps.children, renderLanes), workInProgress.child;
        case 10:
            return updateContextProvider(current, workInProgress, renderLanes);
        case 9:
            return $$typeof = workInProgress.type._context, props = workInProgress.pendingProps.children, prepareToReadContext(workInProgress), $$typeof = readContext($$typeof), props = props($$typeof), workInProgress.flags |= 1, reconcileChildren(current, workInProgress, props, renderLanes), workInProgress.child;
        case 14:
            return updateMemoComponent(current, workInProgress, workInProgress.type, workInProgress.pendingProps, renderLanes);
        case 15:
            return updateSimpleMemoComponent(current, workInProgress, workInProgress.type, workInProgress.pendingProps, renderLanes);
        case 19:
            return updateSuspenseListComponent(current, workInProgress, renderLanes);
        case 31:
            return updateActivityComponent(current, workInProgress, renderLanes);
        case 22:
            return updateOffscreenComponent(current, workInProgress, renderLanes, workInProgress.pendingProps);
        case 24:
            return prepareToReadContext(workInProgress), props = readContext(CacheContext), null === current ? ($$typeof = peekCacheFromPool(), null === $$typeof && ($$typeof = workInProgressRoot, prevState = createCache(), $$typeof.pooledCache = prevState, prevState.refCount++, null !== prevState && ($$typeof.pooledCacheLanes |= renderLanes), $$typeof = prevState), workInProgress.memoizedState = {
                parent: props,
                cache: $$typeof
            }, initializeUpdateQueue(workInProgress), pushProvider(workInProgress, CacheContext, $$typeof)) : (0 !== (current.lanes & renderLanes) && (cloneUpdateQueue(current, workInProgress), processUpdateQueue(workInProgress, null, null, renderLanes), suspendIfUpdateReadFromEntangledAsyncAction()), $$typeof = current.memoizedState, prevState = workInProgress.memoizedState, $$typeof.parent !== props ? ($$typeof = {
                parent: props,
                cache: props
            }, workInProgress.memoizedState = $$typeof, 0 === workInProgress.lanes && (workInProgress.memoizedState = workInProgress.updateQueue.baseState = $$typeof), pushProvider(workInProgress, CacheContext, props)) : (props = prevState.cache, pushProvider(workInProgress, CacheContext, props), props !== $$typeof.cache && propagateContextChanges(workInProgress, [
                CacheContext
            ], renderLanes, !0))), reconcileChildren(current, workInProgress, workInProgress.pendingProps.children, renderLanes), workInProgress.child;
        case 30:
            return null === workInProgress.stateNode && (workInProgress.stateNode = {
                autoName: null,
                paired: null,
                clones: null,
                ref: null
            }), props = workInProgress.pendingProps, null != props.name && "auto" !== props.name ? workInProgress.flags |= null === current ? 18882560 : 18874368 : isHydrating && pushMaterializedTreeId(workInProgress), null !== current && current.memoizedProps.name !== props.name ? workInProgress.flags |= 4194816 : markRef(current, workInProgress), reconcileChildren(current, workInProgress, props.children, renderLanes), workInProgress.child;
        case 29:
            throw workInProgress.pendingProps;
    }
    throw Error(formatProdErrorMessage(156, workInProgress.tag));
}
function markUpdate(workInProgress) {
    workInProgress.flags |= 4;
}
function preloadInstanceAndSuspendIfNeeded(workInProgress, type, oldProps, newProps, renderLanes) {
    var JSCompiler_temp;
    if (JSCompiler_temp = 0 !== (workInProgress.mode & 32)) JSCompiler_temp = null === oldProps ? maySuspendCommit(type, newProps) : maySuspendCommit(type, newProps) && (newProps.src !== oldProps.src || newProps.srcSet !== oldProps.srcSet);
    if (JSCompiler_temp) {
        if (workInProgress.flags |= 16777216, (renderLanes & 335544128) === renderLanes) if (workInProgress.stateNode.complete) workInProgress.flags |= 8192;
        else if (shouldRemainOnPreviousScreen()) workInProgress.flags |= 8192;
        else throw suspendedThenable = noopSuspenseyCommitThenable, SuspenseyCommitException;
    } else workInProgress.flags &= -16777217;
}
function preloadResourceAndSuspendIfNeeded(workInProgress, resource) {
    if ("stylesheet" !== resource.type || 0 !== (resource.state.loading & 4)) workInProgress.flags &= -16777217;
    else if (workInProgress.flags |= 16777216, !preloadResource(resource)) if (shouldRemainOnPreviousScreen()) workInProgress.flags |= 8192;
    else throw suspendedThenable = noopSuspenseyCommitThenable, SuspenseyCommitException;
}
function scheduleRetryEffect(workInProgress, retryQueue) {
    null !== retryQueue && (workInProgress.flags |= 4);
    workInProgress.flags & 16384 && (retryQueue = 22 !== workInProgress.tag ? claimNextRetryLane() : 536870912, workInProgress.lanes |= retryQueue, workInProgressSuspendedRetryLanes |= retryQueue);
}
function cutOffTailIfNeeded(renderState, hasRenderedATailFallback) {
    if (!isHydrating) switch(renderState.tailMode){
        case "visible":
            break;
        case "collapsed":
            for(var tailNode = renderState.tail, lastTailNode = null; null !== tailNode;)null !== tailNode.alternate && (lastTailNode = tailNode), tailNode = tailNode.sibling;
            null === lastTailNode ? hasRenderedATailFallback || null === renderState.tail ? renderState.tail = null : renderState.tail.sibling = null : lastTailNode.sibling = null;
            break;
        default:
            hasRenderedATailFallback = renderState.tail;
            for(tailNode = null; null !== hasRenderedATailFallback;)null !== hasRenderedATailFallback.alternate && (tailNode = hasRenderedATailFallback), hasRenderedATailFallback = hasRenderedATailFallback.sibling;
            null === tailNode ? renderState.tail = null : tailNode.sibling = null;
    }
}
function bubbleProperties(completedWork) {
    var didBailout = null !== completedWork.alternate && completedWork.alternate.child === completedWork.child, newChildLanes = 0, subtreeFlags = 0;
    if (didBailout) for(var child$113 = completedWork.child; null !== child$113;)newChildLanes |= child$113.lanes | child$113.childLanes, subtreeFlags |= child$113.subtreeFlags & 1206910976, subtreeFlags |= child$113.flags & 1206910976, child$113.return = completedWork, child$113 = child$113.sibling;
    else for(child$113 = completedWork.child; null !== child$113;)newChildLanes |= child$113.lanes | child$113.childLanes, subtreeFlags |= child$113.subtreeFlags, subtreeFlags |= child$113.flags, child$113.return = completedWork, child$113 = child$113.sibling;
    completedWork.subtreeFlags |= subtreeFlags;
    completedWork.childLanes = newChildLanes;
    return didBailout;
}
function completeWork(current, workInProgress, renderLanes) {
    var newProps = workInProgress.pendingProps;
    popTreeContext(workInProgress);
    switch(workInProgress.tag){
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
            return bubbleProperties(workInProgress), null;
        case 1:
            return bubbleProperties(workInProgress), null;
        case 3:
            renderLanes = workInProgress.stateNode;
            newProps = null;
            null !== current && (newProps = current.memoizedState.cache);
            workInProgress.memoizedState.cache !== newProps && (workInProgress.flags |= 2048);
            popProvider(CacheContext);
            popHostContainer();
            renderLanes.pendingContext && (renderLanes.context = renderLanes.pendingContext, renderLanes.pendingContext = null);
            if (null === current || null === current.child) popHydrationState(workInProgress) ? markUpdate(workInProgress) : null === current || current.memoizedState.isDehydrated && 0 === (workInProgress.flags & 256) || (workInProgress.flags |= 1024, upgradeHydrationErrorsToRecoverable());
            bubbleProperties(workInProgress);
            return null;
        case 26:
            var type = workInProgress.type, nextResource = workInProgress.memoizedState;
            null === current ? (markUpdate(workInProgress), null !== nextResource ? (bubbleProperties(workInProgress), preloadResourceAndSuspendIfNeeded(workInProgress, nextResource)) : (bubbleProperties(workInProgress), preloadInstanceAndSuspendIfNeeded(workInProgress, type, null, newProps, renderLanes))) : nextResource ? nextResource !== current.memoizedState ? (markUpdate(workInProgress), bubbleProperties(workInProgress), preloadResourceAndSuspendIfNeeded(workInProgress, nextResource)) : (bubbleProperties(workInProgress), workInProgress.flags &= -16777217) : (current = current.memoizedProps, current !== newProps && markUpdate(workInProgress), bubbleProperties(workInProgress), preloadInstanceAndSuspendIfNeeded(workInProgress, type, current, newProps, renderLanes));
            return null;
        case 27:
            popHostContext(workInProgress);
            renderLanes = rootInstanceStackCursor.current;
            type = workInProgress.type;
            if (null !== current && null != workInProgress.stateNode) current.memoizedProps !== newProps && markUpdate(workInProgress);
            else {
                if (!newProps) {
                    if (null === workInProgress.stateNode) throw Error(formatProdErrorMessage(166));
                    bubbleProperties(workInProgress);
                    workInProgress.subtreeFlags &= -33554433;
                    return null;
                }
                current = contextStackCursor.current;
                popHydrationState(workInProgress) ? prepareToHydrateHostInstance(workInProgress, current) : (current = resolveSingletonInstance(type, newProps, renderLanes), workInProgress.stateNode = current, markUpdate(workInProgress));
            }
            bubbleProperties(workInProgress);
            workInProgress.subtreeFlags &= -33554433;
            return null;
        case 5:
            popHostContext(workInProgress);
            type = workInProgress.type;
            if (null !== current && null != workInProgress.stateNode) current.memoizedProps !== newProps && markUpdate(workInProgress);
            else {
                if (!newProps) {
                    if (null === workInProgress.stateNode) throw Error(formatProdErrorMessage(166));
                    bubbleProperties(workInProgress);
                    workInProgress.subtreeFlags &= -33554433;
                    return null;
                }
                nextResource = contextStackCursor.current;
                if (popHydrationState(workInProgress)) prepareToHydrateHostInstance(workInProgress, nextResource);
                else {
                    var ownerDocument = getOwnerDocumentFromRootContainer(rootInstanceStackCursor.current);
                    switch(nextResource){
                        case 1:
                            nextResource = ownerDocument.createElementNS("http://www.w3.org/2000/svg", type);
                            break;
                        case 2:
                            nextResource = ownerDocument.createElementNS("http://www.w3.org/1998/Math/MathML", type);
                            break;
                        default:
                            switch(type){
                                case "svg":
                                    nextResource = ownerDocument.createElementNS("http://www.w3.org/2000/svg", type);
                                    break;
                                case "math":
                                    nextResource = ownerDocument.createElementNS("http://www.w3.org/1998/Math/MathML", type);
                                    break;
                                case "script":
                                    nextResource = ownerDocument.createElement("div");
                                    nextResource.innerHTML = "<script>\x3c/script>";
                                    nextResource = nextResource.removeChild(nextResource.firstChild);
                                    break;
                                case "select":
                                    nextResource = "string" === typeof newProps.is ? ownerDocument.createElement("select", {
                                        is: newProps.is
                                    }) : ownerDocument.createElement("select");
                                    newProps.multiple ? nextResource.multiple = !0 : newProps.size && (nextResource.size = newProps.size);
                                    break;
                                default:
                                    nextResource = "string" === typeof newProps.is ? ownerDocument.createElement(type, {
                                        is: newProps.is
                                    }) : ownerDocument.createElement(type);
                            }
                    }
                    nextResource[internalInstanceKey] = workInProgress;
                    nextResource[internalPropsKey] = newProps;
                    a: for(ownerDocument = workInProgress.child; null !== ownerDocument;){
                        if (5 === ownerDocument.tag || 6 === ownerDocument.tag) nextResource.appendChild(ownerDocument.stateNode);
                        else if (4 !== ownerDocument.tag && 27 !== ownerDocument.tag && null !== ownerDocument.child) {
                            ownerDocument.child.return = ownerDocument;
                            ownerDocument = ownerDocument.child;
                            continue;
                        }
                        if (ownerDocument === workInProgress) break a;
                        for(; null === ownerDocument.sibling;){
                            if (null === ownerDocument.return || ownerDocument.return === workInProgress) break a;
                            ownerDocument = ownerDocument.return;
                        }
                        ownerDocument.sibling.return = ownerDocument.return;
                        ownerDocument = ownerDocument.sibling;
                    }
                    workInProgress.stateNode = nextResource;
                    a: switch(setInitialProperties(nextResource, type, newProps), type){
                        case "button":
                        case "input":
                        case "select":
                        case "textarea":
                            newProps = !!newProps.autoFocus;
                            break a;
                        case "img":
                            newProps = !0;
                            break a;
                        default:
                            newProps = !1;
                    }
                    newProps && markUpdate(workInProgress);
                }
            }
            bubbleProperties(workInProgress);
            workInProgress.subtreeFlags &= -33554433;
            preloadInstanceAndSuspendIfNeeded(workInProgress, workInProgress.type, null === current ? null : current.memoizedProps, workInProgress.pendingProps, renderLanes);
            return null;
        case 6:
            if (current && null != workInProgress.stateNode) current.memoizedProps !== newProps && markUpdate(workInProgress);
            else {
                if ("string" !== typeof newProps && null === workInProgress.stateNode) throw Error(formatProdErrorMessage(166));
                current = rootInstanceStackCursor.current;
                if (popHydrationState(workInProgress)) {
                    current = workInProgress.stateNode;
                    renderLanes = workInProgress.memoizedProps;
                    newProps = null;
                    type = hydrationParentFiber;
                    if (null !== type) switch(type.tag){
                        case 27:
                        case 5:
                            newProps = type.memoizedProps;
                    }
                    current[internalInstanceKey] = workInProgress;
                    current = current.nodeValue === renderLanes || null !== newProps && !0 === newProps.suppressHydrationWarning || checkForUnmatchedText(current.nodeValue, renderLanes) ? !0 : !1;
                    current || throwOnHydrationMismatch(workInProgress, !0);
                } else current = getOwnerDocumentFromRootContainer(current).createTextNode(newProps), current[internalInstanceKey] = workInProgress, workInProgress.stateNode = current;
            }
            bubbleProperties(workInProgress);
            return null;
        case 31:
            renderLanes = workInProgress.memoizedState;
            if (null === current || null !== current.memoizedState) {
                newProps = popHydrationState(workInProgress);
                if (null !== renderLanes) {
                    if (null === current) {
                        if (!newProps) throw Error(formatProdErrorMessage(318));
                        current = workInProgress.memoizedState;
                        current = null !== current ? current.dehydrated : null;
                        if (!current) throw Error(formatProdErrorMessage(557));
                        current[internalInstanceKey] = workInProgress;
                    } else resetHydrationState(), 0 === (workInProgress.flags & 128) && (workInProgress.memoizedState = null), workInProgress.flags |= 4;
                    bubbleProperties(workInProgress);
                    current = !1;
                } else renderLanes = upgradeHydrationErrorsToRecoverable(), null !== current && null !== current.memoizedState && (current.memoizedState.hydrationErrors = renderLanes), current = !0;
                if (!current) {
                    if (workInProgress.flags & 256) return popSuspenseHandler(workInProgress), workInProgress;
                    popSuspenseHandler(workInProgress);
                    return null;
                }
                if (0 !== (workInProgress.flags & 128)) throw Error(formatProdErrorMessage(558));
            }
            bubbleProperties(workInProgress);
            return null;
        case 13:
            newProps = workInProgress.memoizedState;
            if (null === current || null !== current.memoizedState && null !== current.memoizedState.dehydrated) {
                type = popHydrationState(workInProgress);
                if (null !== newProps && null !== newProps.dehydrated) {
                    if (null === current) {
                        if (!type) throw Error(formatProdErrorMessage(318));
                        type = workInProgress.memoizedState;
                        type = null !== type ? type.dehydrated : null;
                        if (!type) throw Error(formatProdErrorMessage(317));
                        type[internalInstanceKey] = workInProgress;
                    } else resetHydrationState(), 0 === (workInProgress.flags & 128) && (workInProgress.memoizedState = null), workInProgress.flags |= 4;
                    bubbleProperties(workInProgress);
                    type = !1;
                } else type = upgradeHydrationErrorsToRecoverable(), null !== current && null !== current.memoizedState && (current.memoizedState.hydrationErrors = type), type = !0;
                if (!type) {
                    if (workInProgress.flags & 256) return popSuspenseHandler(workInProgress), workInProgress;
                    popSuspenseHandler(workInProgress);
                    return null;
                }
            }
            popSuspenseHandler(workInProgress);
            if (0 !== (workInProgress.flags & 128)) return workInProgress.lanes = renderLanes, workInProgress;
            renderLanes = null !== newProps;
            current = null !== current && null !== current.memoizedState;
            renderLanes && (newProps = workInProgress.child, type = null, null !== newProps.alternate && null !== newProps.alternate.memoizedState && null !== newProps.alternate.memoizedState.cachePool && (type = newProps.alternate.memoizedState.cachePool.pool), nextResource = null, null !== newProps.memoizedState && null !== newProps.memoizedState.cachePool && (nextResource = newProps.memoizedState.cachePool.pool), nextResource !== type && (newProps.flags |= 2048));
            renderLanes !== current && renderLanes && (workInProgress.child.flags |= 8192);
            scheduleRetryEffect(workInProgress, workInProgress.updateQueue);
            bubbleProperties(workInProgress);
            return null;
        case 4:
            return popHostContainer(), null === current && listenToAllSupportedEvents(workInProgress.stateNode.containerInfo), workInProgress.flags |= 67108864, bubbleProperties(workInProgress), null;
        case 10:
            return popProvider(workInProgress.type), bubbleProperties(workInProgress), null;
        case 19:
            popSuspenseListContext(workInProgress);
            newProps = workInProgress.memoizedState;
            if (null === newProps) return bubbleProperties(workInProgress), null;
            type = 0 !== (workInProgress.flags & 128);
            nextResource = newProps.rendering;
            if (null === nextResource) if (type) cutOffTailIfNeeded(newProps, !1);
            else {
                if (0 !== workInProgressRootExitStatus || null !== current && 0 !== (current.flags & 128)) for(current = workInProgress.child; null !== current;){
                    nextResource = findFirstSuspended(current);
                    if (null !== nextResource) {
                        workInProgress.flags |= 128;
                        cutOffTailIfNeeded(newProps, !1);
                        current = nextResource.updateQueue;
                        workInProgress.updateQueue = current;
                        scheduleRetryEffect(workInProgress, current);
                        workInProgress.subtreeFlags = 0;
                        current = renderLanes;
                        for(renderLanes = workInProgress.child; null !== renderLanes;)resetWorkInProgress(renderLanes, current), renderLanes = renderLanes.sibling;
                        pushSuspenseListContext(workInProgress, suspenseStackCursor.current & 1 | 2);
                        isHydrating && pushTreeFork(workInProgress, newProps.treeForkCount);
                        return workInProgress.child;
                    }
                    current = current.sibling;
                }
                null !== newProps.tail && now() > workInProgressRootRenderTargetTime && (workInProgress.flags |= 128, type = !0, cutOffTailIfNeeded(newProps, !1), workInProgress.lanes = 4194304);
            }
            else {
                if (!type) if (current = findFirstSuspended(nextResource), null !== current) {
                    if (workInProgress.flags |= 128, type = !0, current = current.updateQueue, workInProgress.updateQueue = current, scheduleRetryEffect(workInProgress, current), cutOffTailIfNeeded(newProps, !0), null === newProps.tail && "collapsed" !== newProps.tailMode && "visible" !== newProps.tailMode && !nextResource.alternate && !isHydrating) return bubbleProperties(workInProgress), null;
                } else 2 * now() - newProps.renderingStartTime > workInProgressRootRenderTargetTime && 536870912 !== renderLanes && (workInProgress.flags |= 128, type = !0, cutOffTailIfNeeded(newProps, !1), workInProgress.lanes = 4194304);
                newProps.isBackwards ? (nextResource.sibling = workInProgress.child, workInProgress.child = nextResource) : (current = newProps.last, null !== current ? current.sibling = nextResource : workInProgress.child = nextResource, newProps.last = nextResource);
            }
            if (null !== newProps.tail) {
                current = newProps.tail;
                a: {
                    for(renderLanes = current; null !== renderLanes;){
                        if (null !== renderLanes.alternate) {
                            renderLanes = !1;
                            break a;
                        }
                        renderLanes = renderLanes.sibling;
                    }
                    renderLanes = !0;
                }
                newProps.rendering = current;
                newProps.tail = current.sibling;
                newProps.renderingStartTime = now();
                current.sibling = null;
                nextResource = suspenseStackCursor.current;
                nextResource = type ? nextResource & 1 | 2 : nextResource & 1;
                "visible" === newProps.tailMode || "collapsed" === newProps.tailMode || !renderLanes || isHydrating ? pushSuspenseListContext(workInProgress, nextResource) : (renderLanes = nextResource, push(suspenseHandlerStackCursor, workInProgress), push(suspenseStackCursor, renderLanes), null === shellBoundary && (shellBoundary = workInProgress));
                isHydrating && pushTreeFork(workInProgress, newProps.treeForkCount);
                return current;
            }
            bubbleProperties(workInProgress);
            return null;
        case 22:
        case 23:
            return popSuspenseHandler(workInProgress), popHiddenContext(), newProps = null !== workInProgress.memoizedState, null !== current ? null !== current.memoizedState !== newProps && (workInProgress.flags |= 8192) : newProps && (workInProgress.flags |= 8192), newProps ? 0 !== (renderLanes & 536870912) && 0 === (workInProgress.flags & 128) && (bubbleProperties(workInProgress), workInProgress.subtreeFlags & 6 && (workInProgress.flags |= 8192)) : bubbleProperties(workInProgress), renderLanes = workInProgress.updateQueue, null !== renderLanes && scheduleRetryEffect(workInProgress, renderLanes.retryQueue), renderLanes = null, null !== current && null !== current.memoizedState && null !== current.memoizedState.cachePool && (renderLanes = current.memoizedState.cachePool.pool), newProps = null, null !== workInProgress.memoizedState && null !== workInProgress.memoizedState.cachePool && (newProps = workInProgress.memoizedState.cachePool.pool), newProps !== renderLanes && (workInProgress.flags |= 2048), null !== current && pop(resumedCache), null;
        case 24:
            return renderLanes = null, null !== current && (renderLanes = current.memoizedState.cache), workInProgress.memoizedState.cache !== renderLanes && (workInProgress.flags |= 2048), popProvider(CacheContext), bubbleProperties(workInProgress), null;
        case 25:
            return null;
        case 30:
            return workInProgress.flags |= 33554432, bubbleProperties(workInProgress), null;
    }
    throw Error(formatProdErrorMessage(156, workInProgress.tag));
}
function unwindWork(current, workInProgress) {
    popTreeContext(workInProgress);
    switch(workInProgress.tag){
        case 1:
            return current = workInProgress.flags, current & 65536 ? (workInProgress.flags = current & -65537 | 128, workInProgress) : null;
        case 3:
            return popProvider(CacheContext), popHostContainer(), current = workInProgress.flags, 0 !== (current & 65536) && 0 === (current & 128) ? (workInProgress.flags = current & -65537 | 128, workInProgress) : null;
        case 26:
        case 27:
        case 5:
            return popHostContext(workInProgress), null;
        case 31:
            if (null !== workInProgress.memoizedState) {
                popSuspenseHandler(workInProgress);
                if (null === workInProgress.alternate) throw Error(formatProdErrorMessage(340));
                resetHydrationState();
            }
            current = workInProgress.flags;
            return current & 65536 ? (workInProgress.flags = current & -65537 | 128, workInProgress) : null;
        case 13:
            popSuspenseHandler(workInProgress);
            current = workInProgress.memoizedState;
            if (null !== current && null !== current.dehydrated) {
                if (null === workInProgress.alternate) throw Error(formatProdErrorMessage(340));
                resetHydrationState();
            }
            current = workInProgress.flags;
            return current & 65536 ? (workInProgress.flags = current & -65537 | 128, workInProgress) : null;
        case 19:
            return popSuspenseListContext(workInProgress), current = workInProgress.flags, current & 65536 ? (workInProgress.flags = current & -65537 | 128, current = workInProgress.memoizedState, null !== current && (current.rendering = null, current.tail = null), workInProgress.flags |= 4, workInProgress) : null;
        case 4:
            return popHostContainer(), null;
        case 10:
            return popProvider(workInProgress.type), null;
        case 22:
        case 23:
            return popSuspenseHandler(workInProgress), popHiddenContext(), null !== current && pop(resumedCache), current = workInProgress.flags, current & 65536 ? (workInProgress.flags = current & -65537 | 128, workInProgress) : null;
        case 24:
            return popProvider(CacheContext), null;
        case 25:
            return null;
        default:
            return null;
    }
}
function unwindInterruptedWork(current, interruptedWork) {
    popTreeContext(interruptedWork);
    switch(interruptedWork.tag){
        case 3:
            popProvider(CacheContext);
            popHostContainer();
            break;
        case 26:
        case 27:
        case 5:
            popHostContext(interruptedWork);
            break;
        case 4:
            popHostContainer();
            break;
        case 31:
            null !== interruptedWork.memoizedState && popSuspenseHandler(interruptedWork);
            break;
        case 13:
            popSuspenseHandler(interruptedWork);
            break;
        case 19:
            popSuspenseListContext(interruptedWork);
            break;
        case 10:
            popProvider(interruptedWork.type);
            break;
        case 22:
        case 23:
            popSuspenseHandler(interruptedWork);
            popHiddenContext();
            null !== current && pop(resumedCache);
            break;
        case 24:
            popProvider(CacheContext);
    }
}
function commitHookEffectListMount(flags, finishedWork) {
    try {
        var updateQueue = finishedWork.updateQueue, lastEffect = null !== updateQueue ? updateQueue.lastEffect : null;
        if (null !== lastEffect) {
            var firstEffect = lastEffect.next;
            updateQueue = firstEffect;
            do {
                if ((updateQueue.tag & flags) === flags) {
                    lastEffect = void 0;
                    var create = updateQueue.create, inst = updateQueue.inst;
                    lastEffect = create();
                    inst.destroy = lastEffect;
                }
                updateQueue = updateQueue.next;
            }while (updateQueue !== firstEffect)
        }
    } catch (error) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
}
function commitHookEffectListUnmount(flags, finishedWork, nearestMountedAncestor$jscomp$0) {
    try {
        var updateQueue = finishedWork.updateQueue, lastEffect = null !== updateQueue ? updateQueue.lastEffect : null;
        if (null !== lastEffect) {
            var firstEffect = lastEffect.next;
            updateQueue = firstEffect;
            do {
                if ((updateQueue.tag & flags) === flags) {
                    var inst = updateQueue.inst, destroy = inst.destroy;
                    if (void 0 !== destroy) {
                        inst.destroy = void 0;
                        lastEffect = finishedWork;
                        var nearestMountedAncestor = nearestMountedAncestor$jscomp$0, destroy_ = destroy;
                        try {
                            destroy_();
                        } catch (error) {
                            captureCommitPhaseError(lastEffect, nearestMountedAncestor, error);
                        }
                    }
                }
                updateQueue = updateQueue.next;
            }while (updateQueue !== firstEffect)
        }
    } catch (error) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
}
function commitClassCallbacks(finishedWork) {
    var updateQueue = finishedWork.updateQueue;
    if (null !== updateQueue) {
        var instance = finishedWork.stateNode;
        try {
            commitCallbacks(updateQueue, instance);
        } catch (error) {
            captureCommitPhaseError(finishedWork, finishedWork.return, error);
        }
    }
}
function safelyCallComponentWillUnmount(current, nearestMountedAncestor, instance) {
    instance.props = resolveClassComponentProps(current.type, current.memoizedProps);
    instance.state = current.memoizedState;
    try {
        instance.componentWillUnmount();
    } catch (error) {
        captureCommitPhaseError(current, nearestMountedAncestor, error);
    }
}
function safelyAttachRef(current, nearestMountedAncestor) {
    try {
        var ref = current.ref;
        if (null !== ref) {
            switch(current.tag){
                case 26:
                case 27:
                case 5:
                    var instanceToUse = current.stateNode;
                    break;
                case 30:
                    var instance = current.stateNode, name = getViewTransitionName(current.memoizedProps, instance);
                    if (null === instance.ref || instance.ref.name !== name) instance.ref = createViewTransitionInstance(name);
                    instanceToUse = instance.ref;
                    break;
                case 7:
                    if (null === current.stateNode) {
                        var fragmentInstance = new FragmentInstance(current);
                        traverseVisibleInstancesAndTextInstances(current.child, !1, addFragmentHandleToFiber, fragmentInstance, void 0, void 0);
                        current.stateNode = fragmentInstance;
                    }
                    instanceToUse = current.stateNode;
                    break;
                default:
                    instanceToUse = current.stateNode;
            }
            "function" === typeof ref ? current.refCleanup = ref(instanceToUse) : ref.current = instanceToUse;
        }
    } catch (error) {
        captureCommitPhaseError(current, nearestMountedAncestor, error);
    }
}
function safelyDetachRef(current, nearestMountedAncestor) {
    var ref = current.ref, refCleanup = current.refCleanup;
    if (null !== ref) if ("function" === typeof refCleanup) try {
        refCleanup();
    } catch (error) {
        captureCommitPhaseError(current, nearestMountedAncestor, error);
    } finally{
        current.refCleanup = null, current = current.alternate, null != current && (current.refCleanup = null);
    }
    else if ("function" === typeof ref) try {
        ref(null);
    } catch (error$148) {
        captureCommitPhaseError(current, nearestMountedAncestor, error$148);
    }
    else ref.current = null;
}
function commitNewChildToFragmentInstances(fiber, parentFragmentInstances) {
    if ((5 === fiber.tag || 27 === fiber.tag || 6 === fiber.tag) && null === fiber.alternate && null !== parentFragmentInstances) for(var i = 0; i < parentFragmentInstances.length; i++)commitNewChildToFragmentInstance(fiber.stateNode, parentFragmentInstances[i]);
}
function commitFragmentInstanceInsertionEffects(fiber) {
    for(var parent = fiber.return; null !== parent;){
        isFragmentInstanceParent(parent) && commitNewChildToFragmentInstance(fiber.stateNode, parent.stateNode);
        if (isFragmentInstanceHostBoundary(parent)) break;
        parent = parent.return;
    }
}
function commitFragmentInstanceDeletionEffects(fiber) {
    for(var parent = fiber.return; null !== parent;){
        isFragmentInstanceParent(parent) && deleteChildFromFragmentInstance(fiber.stateNode, parent.stateNode);
        if (isFragmentInstanceHostBoundary(parent)) break;
        parent = parent.return;
    }
}
function isFragmentInstanceHostBoundary(fiber) {
    return 5 === fiber.tag || 3 === fiber.tag || 27 === fiber.tag;
}
function isFragmentInstanceParent(fiber) {
    return fiber && 7 === fiber.tag && null !== fiber.stateNode;
}
function commitHostMount(finishedWork) {
    var type = finishedWork.type, props = finishedWork.memoizedProps, instance = finishedWork.stateNode;
    try {
        a: switch(type){
            case "button":
            case "input":
            case "select":
            case "textarea":
                props.autoFocus && instance.focus();
                break a;
            case "img":
                props.src ? instance.src = props.src : props.srcSet && (instance.srcset = props.srcSet);
        }
    } catch (error) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
}
function commitHostUpdate(finishedWork, newProps, oldProps) {
    try {
        var domElement = finishedWork.stateNode;
        updateProperties(domElement, finishedWork.type, oldProps, newProps);
        domElement[internalPropsKey] = newProps;
    } catch (error) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
}
function isHostParent(fiber) {
    return 5 === fiber.tag || 3 === fiber.tag || 26 === fiber.tag || 27 === fiber.tag && isSingletonScope(fiber.type) || 4 === fiber.tag;
}
function getHostSibling(fiber) {
    a: for(;;){
        for(; null === fiber.sibling;){
            if (null === fiber.return || isHostParent(fiber.return)) return null;
            fiber = fiber.return;
        }
        fiber.sibling.return = fiber.return;
        for(fiber = fiber.sibling; 5 !== fiber.tag && 6 !== fiber.tag && 18 !== fiber.tag;){
            if (27 === fiber.tag && isSingletonScope(fiber.type)) continue a;
            if (fiber.flags & 2) continue a;
            if (null === fiber.child || 4 === fiber.tag) continue a;
            else fiber.child.return = fiber, fiber = fiber.child;
        }
        if (!(fiber.flags & 2)) return fiber.stateNode;
    }
}
function insertOrAppendPlacementNodeIntoContainer(node, before, parent, parentFragmentInstances) {
    var tag = node.tag;
    if (5 === tag || 6 === tag) tag = node.stateNode, before ? (9 === parent.nodeType ? parent.body : "HTML" === parent.nodeName ? parent.ownerDocument.body : parent).insertBefore(tag, before) : (before = 9 === parent.nodeType ? parent.body : "HTML" === parent.nodeName ? parent.ownerDocument.body : parent, before.appendChild(tag), parent = parent._reactRootContainer, null !== parent && void 0 !== parent || null !== before.onclick || (before.onclick = noop$1)), commitNewChildToFragmentInstances(node, parentFragmentInstances), viewTransitionMutationContext = !0;
    else if (4 !== tag && (27 === tag && (commitNewChildToFragmentInstances(node, parentFragmentInstances), parentFragmentInstances = null, isSingletonScope(node.type) && (parent = node.stateNode, before = null)), node = node.child, null !== node)) for(insertOrAppendPlacementNodeIntoContainer(node, before, parent, parentFragmentInstances), node = node.sibling; null !== node;)insertOrAppendPlacementNodeIntoContainer(node, before, parent, parentFragmentInstances), node = node.sibling;
}
function insertOrAppendPlacementNode(node, before, parent, parentFragmentInstances) {
    var tag = node.tag;
    if (5 === tag || 6 === tag) tag = node.stateNode, before ? parent.insertBefore(tag, before) : parent.appendChild(tag), commitNewChildToFragmentInstances(node, parentFragmentInstances), viewTransitionMutationContext = !0;
    else if (4 !== tag && (27 === tag && (commitNewChildToFragmentInstances(node, parentFragmentInstances), parentFragmentInstances = null, isSingletonScope(node.type) && (parent = node.stateNode)), node = node.child, null !== node)) for(insertOrAppendPlacementNode(node, before, parent, parentFragmentInstances), node = node.sibling; null !== node;)insertOrAppendPlacementNode(node, before, parent, parentFragmentInstances), node = node.sibling;
}
function commitHostSingletonAcquisition(finishedWork) {
    var singleton = finishedWork.stateNode, props = finishedWork.memoizedProps;
    try {
        for(var type = finishedWork.type, attributes = singleton.attributes; attributes.length;)singleton.removeAttributeNode(attributes[0]);
        setInitialProperties(singleton, type, props);
        singleton[internalInstanceKey] = finishedWork;
        singleton[internalPropsKey] = props;
    } catch (error) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
}
var shouldStartViewTransition = !1, appearingViewTransitions = null;
function trackEnterViewTransitions(placement) {
    if (30 === placement.tag || 0 !== (placement.subtreeFlags & 33554432)) shouldStartViewTransition = !0;
}
var viewTransitionCancelableChildren = null;
function pushViewTransitionCancelableScope() {
    var prevChildren = viewTransitionCancelableChildren;
    viewTransitionCancelableChildren = null;
    return prevChildren;
}
var viewTransitionHostInstanceIdx = 0;
function applyViewTransitionToHostInstances(fiber, name, className, collectMeasurements, stopAtNestedViewTransitions) {
    viewTransitionHostInstanceIdx = 0;
    return applyViewTransitionToHostInstancesRecursive(fiber.child, name, className, collectMeasurements, stopAtNestedViewTransitions);
}
function applyViewTransitionToHostInstancesRecursive(child, name, className, collectMeasurements, stopAtNestedViewTransitions) {
    for(var inViewport = !1; null !== child;){
        if (5 === child.tag) {
            var instance = child.stateNode;
            if (null !== collectMeasurements) {
                var measurement = measureInstance(instance);
                collectMeasurements.push(measurement);
                measurement.view && (inViewport = !0);
            } else inViewport || measureInstance(instance).view && (inViewport = !0);
            shouldStartViewTransition = !0;
            applyViewTransitionName(instance, 0 === viewTransitionHostInstanceIdx ? name : name + "_" + viewTransitionHostInstanceIdx, className);
            viewTransitionHostInstanceIdx++;
        } else if (22 !== child.tag || null === child.memoizedState) 30 === child.tag && stopAtNestedViewTransitions || applyViewTransitionToHostInstancesRecursive(child.child, name, className, collectMeasurements, stopAtNestedViewTransitions) && (inViewport = !0);
        child = child.sibling;
    }
    return inViewport;
}
function restoreViewTransitionOnHostInstances(child, stopAtNestedViewTransitions) {
    for(; null !== child;){
        if (5 === child.tag) restoreViewTransitionName(child.stateNode, child.memoizedProps);
        else if (22 !== child.tag || null === child.memoizedState) 30 === child.tag && stopAtNestedViewTransitions || restoreViewTransitionOnHostInstances(child.child, stopAtNestedViewTransitions);
        child = child.sibling;
    }
}
function commitAppearingPairViewTransitions(placement) {
    if (0 !== (placement.subtreeFlags & 18874368)) for(placement = placement.child; null !== placement;){
        if (22 !== placement.tag || null === placement.memoizedState) {
            if (commitAppearingPairViewTransitions(placement), 30 === placement.tag && 0 !== (placement.flags & 18874368) && placement.stateNode.paired) {
                var props = placement.memoizedProps;
                if (null == props.name || "auto" === props.name) throw Error(formatProdErrorMessage(544));
                var name = props.name;
                props = getViewTransitionClassName(props.default, props.share);
                "none" !== props && (applyViewTransitionToHostInstances(placement, name, props, null, !1) || restoreViewTransitionOnHostInstances(placement.child, !1));
            }
        }
        placement = placement.sibling;
    }
}
function commitEnterViewTransitions(placement, gesture) {
    if (30 === placement.tag) {
        var state = placement.stateNode, props = placement.memoizedProps, name = getViewTransitionName(props, state), className = getViewTransitionClassName(props.default, state.paired ? props.share : props.enter);
        "none" !== className ? applyViewTransitionToHostInstances(placement, name, className, null, !1) ? (commitAppearingPairViewTransitions(placement), state.paired || gesture || scheduleViewTransitionEvent(placement, props.onEnter)) : restoreViewTransitionOnHostInstances(placement.child, !1) : commitAppearingPairViewTransitions(placement);
    } else if (0 !== (placement.subtreeFlags & 33554432)) for(placement = placement.child; null !== placement;)commitEnterViewTransitions(placement, gesture), placement = placement.sibling;
    else commitAppearingPairViewTransitions(placement);
}
function commitDeletedPairViewTransitions(deletion) {
    if (null !== appearingViewTransitions && 0 !== appearingViewTransitions.size) {
        var pairs = appearingViewTransitions;
        if (0 !== (deletion.subtreeFlags & 18874368)) for(deletion = deletion.child; null !== deletion;){
            if (22 !== deletion.tag || null === deletion.memoizedState) {
                if (30 === deletion.tag && 0 !== (deletion.flags & 18874368)) {
                    var props = deletion.memoizedProps, name = props.name;
                    if (null != name && "auto" !== name) {
                        var pair = pairs.get(name);
                        if (void 0 !== pair) {
                            var className = getViewTransitionClassName(props.default, props.share);
                            "none" !== className && (applyViewTransitionToHostInstances(deletion, name, className, null, !1) ? (className = deletion.stateNode, pair.paired = className, className.paired = pair, scheduleViewTransitionEvent(deletion, props.onShare)) : restoreViewTransitionOnHostInstances(deletion.child, !1));
                            pairs.delete(name);
                            if (0 === pairs.size) break;
                        }
                    }
                }
                commitDeletedPairViewTransitions(deletion);
            }
            deletion = deletion.sibling;
        }
    }
}
function commitExitViewTransitions(deletion) {
    if (30 === deletion.tag) {
        var props = deletion.memoizedProps, name = getViewTransitionName(props, deletion.stateNode), pair = null !== appearingViewTransitions ? appearingViewTransitions.get(name) : void 0, className = getViewTransitionClassName(props.default, void 0 !== pair ? props.share : props.exit);
        "none" !== className && (applyViewTransitionToHostInstances(deletion, name, className, null, !1) ? void 0 !== pair ? (className = deletion.stateNode, pair.paired = className, className.paired = pair, appearingViewTransitions.delete(name), scheduleViewTransitionEvent(deletion, props.onShare)) : scheduleViewTransitionEvent(deletion, props.onExit) : restoreViewTransitionOnHostInstances(deletion.child, !1));
        null !== appearingViewTransitions && commitDeletedPairViewTransitions(deletion);
    } else if (0 !== (deletion.subtreeFlags & 33554432)) for(deletion = deletion.child; null !== deletion;)commitExitViewTransitions(deletion), deletion = deletion.sibling;
    else null !== appearingViewTransitions && commitDeletedPairViewTransitions(deletion);
}
function commitNestedViewTransitions(changedParent) {
    for(changedParent = changedParent.child; null !== changedParent;){
        if (30 === changedParent.tag) {
            var props = changedParent.memoizedProps, name = getViewTransitionName(props, changedParent.stateNode);
            props = getViewTransitionClassName(props.default, props.update);
            changedParent.flags &= -5;
            "none" !== props && applyViewTransitionToHostInstances(changedParent, name, props, changedParent.memoizedState = [], !1);
        } else 0 !== (changedParent.subtreeFlags & 33554432) && commitNestedViewTransitions(changedParent);
        changedParent = changedParent.sibling;
    }
}
function restorePairedViewTransitions(parent) {
    if (0 !== (parent.subtreeFlags & 18874368)) for(parent = parent.child; null !== parent;){
        if (22 !== parent.tag || null === parent.memoizedState) {
            if (30 === parent.tag && 0 !== (parent.flags & 18874368)) {
                var instance = parent.stateNode;
                null !== instance.paired && (instance.paired = null, restoreViewTransitionOnHostInstances(parent.child, !1));
            }
            restorePairedViewTransitions(parent);
        }
        parent = parent.sibling;
    }
}
function restoreEnterOrExitViewTransitions(fiber) {
    if (30 === fiber.tag) fiber.stateNode.paired = null, restoreViewTransitionOnHostInstances(fiber.child, !1), restorePairedViewTransitions(fiber);
    else if (0 !== (fiber.subtreeFlags & 33554432)) for(fiber = fiber.child; null !== fiber;)restoreEnterOrExitViewTransitions(fiber), fiber = fiber.sibling;
    else restorePairedViewTransitions(fiber);
}
function restoreNestedViewTransitions(changedParent) {
    for(changedParent = changedParent.child; null !== changedParent;)30 === changedParent.tag ? restoreViewTransitionOnHostInstances(changedParent.child, !1) : 0 !== (changedParent.subtreeFlags & 33554432) && restoreNestedViewTransitions(changedParent), changedParent = changedParent.sibling;
}
function measureViewTransitionHostInstancesRecursive(parentViewTransition, child, newName, oldName, className, previousMeasurements, stopAtNestedViewTransitions) {
    for(var inViewport = !1; null !== child;){
        if (5 === child.tag) {
            var instance = child.stateNode;
            if (null !== previousMeasurements && viewTransitionHostInstanceIdx < previousMeasurements.length) {
                var previousMeasurement = previousMeasurements[viewTransitionHostInstanceIdx], nextMeasurement = measureInstance(instance);
                if (previousMeasurement.view || nextMeasurement.view) inViewport = !0;
                var JSCompiler_temp;
                if (JSCompiler_temp = 0 === (parentViewTransition.flags & 4)) if (nextMeasurement.clip) JSCompiler_temp = !0;
                else {
                    JSCompiler_temp = previousMeasurement.rect;
                    var newRect = nextMeasurement.rect;
                    JSCompiler_temp = JSCompiler_temp.y !== newRect.y || JSCompiler_temp.x !== newRect.x || JSCompiler_temp.height !== newRect.height || JSCompiler_temp.width !== newRect.width;
                }
                JSCompiler_temp && (parentViewTransition.flags |= 4);
                nextMeasurement.abs ? nextMeasurement = !previousMeasurement.abs : (previousMeasurement = previousMeasurement.rect, nextMeasurement = nextMeasurement.rect, nextMeasurement = previousMeasurement.height !== nextMeasurement.height || previousMeasurement.width !== nextMeasurement.width);
                nextMeasurement && (parentViewTransition.flags |= 32);
            } else parentViewTransition.flags |= 32;
            0 !== (parentViewTransition.flags & 4) && applyViewTransitionName(instance, 0 === viewTransitionHostInstanceIdx ? newName : newName + "_" + viewTransitionHostInstanceIdx, className);
            inViewport && 0 !== (parentViewTransition.flags & 4) || (null === viewTransitionCancelableChildren && (viewTransitionCancelableChildren = []), viewTransitionCancelableChildren.push(instance, 0 === viewTransitionHostInstanceIdx ? oldName : oldName + "_" + viewTransitionHostInstanceIdx, child.memoizedProps));
            viewTransitionHostInstanceIdx++;
        } else if (22 !== child.tag || null === child.memoizedState) 30 === child.tag && stopAtNestedViewTransitions ? parentViewTransition.flags |= child.flags & 32 : measureViewTransitionHostInstancesRecursive(parentViewTransition, child.child, newName, oldName, className, previousMeasurements, stopAtNestedViewTransitions) && (inViewport = !0);
        child = child.sibling;
    }
    return inViewport;
}
function measureNestedViewTransitions(changedParent, gesture) {
    for(changedParent = changedParent.child; null !== changedParent;){
        if (30 === changedParent.tag) {
            var props = changedParent.memoizedProps, state = changedParent.stateNode, name = getViewTransitionName(props, state), className = getViewTransitionClassName(props.default, props.update);
            if (gesture) {
                state = state.clones;
                var previousMeasurements = null === state ? null : state.map(measureClonedInstance);
            } else previousMeasurements = changedParent.memoizedState, changedParent.memoizedState = null;
            state = changedParent;
            var child = changedParent.child;
            viewTransitionHostInstanceIdx = 0;
            name = measureViewTransitionHostInstancesRecursive(state, child, name, name, className, previousMeasurements, !1);
            0 !== (changedParent.flags & 4) && name && (gesture || scheduleViewTransitionEvent(changedParent, props.onUpdate));
        } else 0 !== (changedParent.subtreeFlags & 33554432) && measureNestedViewTransitions(changedParent, gesture);
        changedParent = changedParent.sibling;
    }
}
var offscreenSubtreeIsHidden = !1, offscreenSubtreeWasHidden = !1, offscreenDirectParentIsHidden = !1, needsFormReset = !1, PossiblyWeakSet = "function" === typeof WeakSet ? WeakSet : Set, nextEffect = null, viewTransitionContextChanged = !1, inUpdateViewTransition = !1, rootViewTransitionAffected = !1, rootViewTransitionNameCanceled = !1;
function commitBeforeMutationEffects(root, firstChild, committedLanes) {
    root = root.containerInfo;
    eventsEnabled = _enabled;
    root = getActiveElementDeep(root);
    if (hasSelectionCapabilities(root)) {
        if ("selectionStart" in root) var JSCompiler_temp = {
            start: root.selectionStart,
            end: root.selectionEnd
        };
        else a: {
            JSCompiler_temp = (JSCompiler_temp = root.ownerDocument) && JSCompiler_temp.defaultView || window;
            var selection = JSCompiler_temp.getSelection && JSCompiler_temp.getSelection();
            if (selection && 0 !== selection.rangeCount) {
                JSCompiler_temp = selection.anchorNode;
                var anchorOffset = selection.anchorOffset, focusNode = selection.focusNode;
                selection = selection.focusOffset;
                try {
                    JSCompiler_temp.nodeType, focusNode.nodeType;
                } catch (e$21) {
                    JSCompiler_temp = null;
                    break a;
                }
                var length = 0, start = -1, end = -1, indexWithinAnchor = 0, indexWithinFocus = 0, node = root, parentNode = null;
                b: for(;;){
                    for(var next;;){
                        node !== JSCompiler_temp || 0 !== anchorOffset && 3 !== node.nodeType || (start = length + anchorOffset);
                        node !== focusNode || 0 !== selection && 3 !== node.nodeType || (end = length + selection);
                        3 === node.nodeType && (length += node.nodeValue.length);
                        if (null === (next = node.firstChild)) break;
                        parentNode = node;
                        node = next;
                    }
                    for(;;){
                        if (node === root) break b;
                        parentNode === JSCompiler_temp && ++indexWithinAnchor === anchorOffset && (start = length);
                        parentNode === focusNode && ++indexWithinFocus === selection && (end = length);
                        if (null !== (next = node.nextSibling)) break;
                        node = parentNode;
                        parentNode = node.parentNode;
                    }
                    node = next;
                }
                JSCompiler_temp = -1 === start || -1 === end ? null : {
                    start: start,
                    end: end
                };
            } else JSCompiler_temp = null;
        }
        JSCompiler_temp = JSCompiler_temp || {
            start: 0,
            end: 0
        };
    } else JSCompiler_temp = null;
    selectionInformation = {
        focusedElem: root,
        selectionRange: JSCompiler_temp
    };
    _enabled = !1;
    committedLanes = (committedLanes & 335544064) === committedLanes;
    nextEffect = firstChild;
    for(firstChild = committedLanes ? 9270 : 1024; null !== nextEffect;){
        root = nextEffect;
        if (committedLanes && (JSCompiler_temp = root.deletions, null !== JSCompiler_temp)) for(anchorOffset = 0; anchorOffset < JSCompiler_temp.length; anchorOffset++)committedLanes && commitExitViewTransitions(JSCompiler_temp[anchorOffset]);
        if (null === root.alternate && 0 !== (root.flags & 2)) committedLanes && trackEnterViewTransitions(root), commitBeforeMutationEffects_complete(committedLanes);
        else {
            if (22 === root.tag) {
                if (JSCompiler_temp = root.alternate, null !== root.memoizedState) {
                    null !== JSCompiler_temp && null === JSCompiler_temp.memoizedState && committedLanes && commitExitViewTransitions(JSCompiler_temp);
                    commitBeforeMutationEffects_complete(committedLanes);
                    continue;
                } else if (null !== JSCompiler_temp && null !== JSCompiler_temp.memoizedState) {
                    committedLanes && trackEnterViewTransitions(root);
                    commitBeforeMutationEffects_complete(committedLanes);
                    continue;
                }
            }
            JSCompiler_temp = root.child;
            0 !== (root.subtreeFlags & firstChild) && null !== JSCompiler_temp ? (JSCompiler_temp.return = root, nextEffect = JSCompiler_temp) : (committedLanes && commitNestedViewTransitions(root), commitBeforeMutationEffects_complete(committedLanes));
        }
    }
    appearingViewTransitions = null;
}
function commitBeforeMutationEffects_complete(isViewTransitionEligible$jscomp$0) {
    for(; null !== nextEffect;){
        var fiber = nextEffect, isViewTransitionEligible = isViewTransitionEligible$jscomp$0, current = fiber.alternate, flags = fiber.flags;
        switch(fiber.tag){
            case 0:
            case 11:
            case 15:
                break;
            case 1:
                if (0 !== (flags & 1024) && null !== current) {
                    isViewTransitionEligible = void 0;
                    flags = current.memoizedProps;
                    current = current.memoizedState;
                    var instance = fiber.stateNode;
                    try {
                        var resolvedPrevProps = resolveClassComponentProps(fiber.type, flags);
                        isViewTransitionEligible = instance.getSnapshotBeforeUpdate(resolvedPrevProps, current);
                        instance.__reactInternalSnapshotBeforeUpdate = isViewTransitionEligible;
                    } catch (error) {
                        captureCommitPhaseError(fiber, fiber.return, error);
                    }
                }
                break;
            case 3:
                if (0 !== (flags & 1024)) {
                    if (current = fiber.stateNode.containerInfo, isViewTransitionEligible = current.nodeType, 9 === isViewTransitionEligible) clearContainerSparingly(current);
                    else if (1 === isViewTransitionEligible) switch(current.nodeName){
                        case "HEAD":
                        case "HTML":
                        case "BODY":
                            clearContainerSparingly(current);
                            break;
                        default:
                            current.textContent = "";
                    }
                }
                break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
                break;
            case 30:
                isViewTransitionEligible && null !== current && (isViewTransitionEligible = getViewTransitionName(current.memoizedProps, current.stateNode), flags = fiber.memoizedProps, flags = getViewTransitionClassName(flags.default, flags.update), "none" !== flags && applyViewTransitionToHostInstances(current, isViewTransitionEligible, flags, current.memoizedState = [], !0));
                break;
            default:
                if (0 !== (flags & 1024)) throw Error(formatProdErrorMessage(163));
        }
        current = fiber.sibling;
        if (null !== current) {
            current.return = fiber.return;
            nextEffect = current;
            break;
        }
        nextEffect = fiber.return;
    }
}
function commitLayoutEffectOnFiber(finishedRoot, current, finishedWork) {
    var flags = finishedWork.flags;
    switch(finishedWork.tag){
        case 0:
        case 11:
        case 15:
            recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
            flags & 4 && commitHookEffectListMount(5, finishedWork);
            break;
        case 1:
            recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
            if (flags & 4) if (finishedRoot = finishedWork.stateNode, null === current) try {
                finishedRoot.componentDidMount();
            } catch (error) {
                captureCommitPhaseError(finishedWork, finishedWork.return, error);
            }
            else {
                var prevProps = resolveClassComponentProps(finishedWork.type, current.memoizedProps);
                current = current.memoizedState;
                try {
                    finishedRoot.componentDidUpdate(prevProps, current, finishedRoot.__reactInternalSnapshotBeforeUpdate);
                } catch (error$146) {
                    captureCommitPhaseError(finishedWork, finishedWork.return, error$146);
                }
            }
            flags & 64 && commitClassCallbacks(finishedWork);
            flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
            break;
        case 3:
            recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
            if (flags & 64 && (finishedRoot = finishedWork.updateQueue, null !== finishedRoot)) {
                current = null;
                if (null !== finishedWork.child) switch(finishedWork.child.tag){
                    case 27:
                    case 5:
                        current = finishedWork.child.stateNode;
                        break;
                    case 1:
                        current = finishedWork.child.stateNode;
                }
                try {
                    commitCallbacks(finishedRoot, current);
                } catch (error) {
                    captureCommitPhaseError(finishedWork, finishedWork.return, error);
                }
            }
            break;
        case 27:
            null === current && flags & 4 && commitHostSingletonAcquisition(finishedWork);
        case 26:
        case 5:
            recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
            null === current && flags & 4 && commitHostMount(finishedWork);
            flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
            break;
        case 12:
            recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
            break;
        case 31:
            recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
            flags & 4 && commitActivityHydrationCallbacks(finishedRoot, finishedWork);
            break;
        case 13:
            recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
            flags & 4 && commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
            flags & 64 && (finishedRoot = finishedWork.memoizedState, null !== finishedRoot && (finishedRoot = finishedRoot.dehydrated, null !== finishedRoot && (finishedWork = retryDehydratedSuspenseBoundary.bind(null, finishedWork), registerSuspenseInstanceRetry(finishedRoot, finishedWork))));
            break;
        case 22:
            flags = null !== finishedWork.memoizedState || offscreenSubtreeIsHidden;
            if (!flags) {
                var newOffscreenSubtreeWasHidden = null !== current && null !== current.memoizedState || offscreenSubtreeWasHidden;
                current = offscreenSubtreeIsHidden;
                prevProps = offscreenSubtreeWasHidden;
                offscreenSubtreeIsHidden = flags;
                (offscreenSubtreeWasHidden = newOffscreenSubtreeWasHidden) && !prevProps ? (flags = 2, 0 !== (finishedWork.subtreeFlags & 8772) && (flags |= 1), recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, flags)) : recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
                offscreenSubtreeIsHidden = current;
                offscreenSubtreeWasHidden = prevProps;
            }
            break;
        case 30:
            recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
            flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
            break;
        case 7:
            flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
        default:
            recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
    }
}
function hideOrUnhideAllChildren(parentFiber, isHidden) {
    for(parentFiber = parentFiber.child; null !== parentFiber;)hideOrUnhideAllChildrenOnFiber(parentFiber, isHidden), parentFiber = parentFiber.sibling;
}
function hideOrUnhideAllChildrenOnFiber(fiber, isHidden) {
    switch(fiber.tag){
        case 5:
        case 26:
            try {
                var instance = fiber.stateNode;
                if (isHidden) {
                    var style = instance.style;
                    "function" === typeof style.setProperty ? style.setProperty("display", "none", "important") : style.display = "none";
                } else {
                    var instance$jscomp$0 = fiber.stateNode, styleProp = fiber.memoizedProps.style, display = void 0 !== styleProp && null !== styleProp && styleProp.hasOwnProperty("display") ? styleProp.display : null;
                    instance$jscomp$0.style.display = null == display || "boolean" === typeof display ? "" : ("" + display).trim();
                }
            } catch (error) {
                captureCommitPhaseError(fiber, fiber.return, error);
            }
            hideOrUnhideNearestPortals(fiber, isHidden);
            break;
        case 6:
            try {
                fiber.stateNode.nodeValue = isHidden ? "" : fiber.memoizedProps, viewTransitionMutationContext = !0;
            } catch (error) {
                captureCommitPhaseError(fiber, fiber.return, error);
            }
            break;
        case 18:
            try {
                var instance$jscomp$1 = fiber.stateNode;
                isHidden ? hideOrUnhideDehydratedBoundary(instance$jscomp$1, !0) : hideOrUnhideDehydratedBoundary(fiber.stateNode, !1);
            } catch (error) {
                captureCommitPhaseError(fiber, fiber.return, error);
            }
            break;
        case 22:
        case 23:
            null === fiber.memoizedState && hideOrUnhideAllChildren(fiber, isHidden);
            break;
        default:
            hideOrUnhideAllChildren(fiber, isHidden);
    }
}
function hideOrUnhideNearestPortals(parentFiber, isHidden$jscomp$0) {
    if (parentFiber.subtreeFlags & 67108864) for(parentFiber = parentFiber.child; null !== parentFiber;){
        a: {
            var fiber = parentFiber, isHidden = isHidden$jscomp$0;
            switch(fiber.tag){
                case 4:
                    hideOrUnhideAllChildrenOnFiber(fiber, isHidden);
                    break a;
                case 22:
                    null === fiber.memoizedState && hideOrUnhideNearestPortals(fiber, isHidden);
                    break a;
                default:
                    hideOrUnhideNearestPortals(fiber, isHidden);
            }
        }
        parentFiber = parentFiber.sibling;
    }
}
function detachFiberAfterEffects(fiber) {
    var alternate = fiber.alternate;
    null !== alternate && (fiber.alternate = null, detachFiberAfterEffects(alternate));
    fiber.child = null;
    fiber.deletions = null;
    fiber.sibling = null;
    5 === fiber.tag && (alternate = fiber.stateNode, null !== alternate && detachDeletedInstance(alternate));
    fiber.stateNode = null;
    fiber.return = null;
    fiber.dependencies = null;
    fiber.memoizedProps = null;
    fiber.memoizedState = null;
    fiber.pendingProps = null;
    fiber.stateNode = null;
    fiber.updateQueue = null;
}
var hostParent = null, hostParentIsContainer = !1;
function recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, parent) {
    for(parent = parent.child; null !== parent;)commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, parent), parent = parent.sibling;
}
function commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, deletedFiber) {
    if (injectedHook && "function" === typeof injectedHook.onCommitFiberUnmount) try {
        injectedHook.onCommitFiberUnmount(rendererID, deletedFiber);
    } catch (err) {}
    switch(deletedFiber.tag){
        case 26:
            offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
            recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
            deletedFiber.memoizedState ? deletedFiber.memoizedState.count-- : deletedFiber.stateNode && !offscreenSubtreeWasHidden && (deletedFiber = deletedFiber.stateNode, deletedFiber.parentNode.removeChild(deletedFiber));
            break;
        case 27:
            offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
            commitFragmentInstanceDeletionEffects(deletedFiber);
            var prevHostParent = hostParent, prevHostParentIsContainer = hostParentIsContainer;
            isSingletonScope(deletedFiber.type) && (hostParent = deletedFiber.stateNode, hostParentIsContainer = !1);
            recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
            releaseSingletonInstance(deletedFiber.stateNode, deletedFiber.type, deletedFiber.memoizedProps);
            hostParent = prevHostParent;
            hostParentIsContainer = prevHostParentIsContainer;
            break;
        case 5:
            offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor), commitFragmentInstanceDeletionEffects(deletedFiber);
        case 6:
            6 === deletedFiber.tag && commitFragmentInstanceDeletionEffects(deletedFiber);
            prevHostParent = hostParent;
            prevHostParentIsContainer = hostParentIsContainer;
            hostParent = null;
            recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
            hostParent = prevHostParent;
            hostParentIsContainer = prevHostParentIsContainer;
            if (null !== hostParent) if (hostParentIsContainer) try {
                (9 === hostParent.nodeType ? hostParent.body : "HTML" === hostParent.nodeName ? hostParent.ownerDocument.body : hostParent).removeChild(deletedFiber.stateNode), viewTransitionMutationContext = !0;
            } catch (error) {
                captureCommitPhaseError(deletedFiber, nearestMountedAncestor, error);
            }
            else try {
                hostParent.removeChild(deletedFiber.stateNode), viewTransitionMutationContext = !0;
            } catch (error) {
                captureCommitPhaseError(deletedFiber, nearestMountedAncestor, error);
            }
            break;
        case 18:
            null !== hostParent && (hostParentIsContainer ? (finishedRoot = hostParent, clearHydrationBoundary(9 === finishedRoot.nodeType ? finishedRoot.body : "HTML" === finishedRoot.nodeName ? finishedRoot.ownerDocument.body : finishedRoot, deletedFiber.stateNode), retryIfBlockedOn(finishedRoot)) : clearHydrationBoundary(hostParent, deletedFiber.stateNode));
            break;
        case 4:
            prevHostParent = hostParent;
            prevHostParentIsContainer = hostParentIsContainer;
            hostParent = deletedFiber.stateNode.containerInfo;
            hostParentIsContainer = !0;
            recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
            hostParent = prevHostParent;
            hostParentIsContainer = prevHostParentIsContainer;
            break;
        case 0:
        case 11:
        case 14:
        case 15:
            commitHookEffectListUnmount(2, deletedFiber, nearestMountedAncestor);
            offscreenSubtreeWasHidden || commitHookEffectListUnmount(4, deletedFiber, nearestMountedAncestor);
            recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
            break;
        case 1:
            offscreenSubtreeWasHidden || (safelyDetachRef(deletedFiber, nearestMountedAncestor), prevHostParent = deletedFiber.stateNode, "function" === typeof prevHostParent.componentWillUnmount && safelyCallComponentWillUnmount(deletedFiber, nearestMountedAncestor, prevHostParent));
            recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
            break;
        case 21:
            recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
            break;
        case 22:
            offscreenSubtreeWasHidden = (prevHostParent = offscreenSubtreeWasHidden) || null !== deletedFiber.memoizedState;
            recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
            offscreenSubtreeWasHidden = prevHostParent;
            break;
        case 30:
            safelyDetachRef(deletedFiber, nearestMountedAncestor);
            recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
            break;
        case 7:
            offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
            recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
            break;
        default:
            recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
    }
}
function commitActivityHydrationCallbacks(finishedRoot, finishedWork) {
    if (null === finishedWork.memoizedState && (finishedRoot = finishedWork.alternate, null !== finishedRoot && (finishedRoot = finishedRoot.memoizedState, null !== finishedRoot))) {
        finishedRoot = finishedRoot.dehydrated;
        try {
            retryIfBlockedOn(finishedRoot);
        } catch (error) {
            captureCommitPhaseError(finishedWork, finishedWork.return, error);
        }
    }
}
function commitSuspenseHydrationCallbacks(finishedRoot, finishedWork) {
    if (null === finishedWork.memoizedState && (finishedRoot = finishedWork.alternate, null !== finishedRoot && (finishedRoot = finishedRoot.memoizedState, null !== finishedRoot && (finishedRoot = finishedRoot.dehydrated, null !== finishedRoot)))) try {
        retryIfBlockedOn(finishedRoot);
    } catch (error) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
}
function getRetryCache(finishedWork) {
    switch(finishedWork.tag){
        case 31:
        case 13:
        case 19:
            var retryCache = finishedWork.stateNode;
            null === retryCache && (retryCache = finishedWork.stateNode = new PossiblyWeakSet());
            return retryCache;
        case 22:
            return finishedWork = finishedWork.stateNode, retryCache = finishedWork._retryCache, null === retryCache && (retryCache = finishedWork._retryCache = new PossiblyWeakSet()), retryCache;
        default:
            throw Error(formatProdErrorMessage(435, finishedWork.tag));
    }
}
function attachSuspenseRetryListeners(finishedWork, wakeables) {
    var retryCache = getRetryCache(finishedWork);
    wakeables.forEach(function(wakeable) {
        if (!retryCache.has(wakeable)) {
            retryCache.add(wakeable);
            var retry = resolveRetryWakeable.bind(null, finishedWork, wakeable);
            wakeable.then(retry, retry);
        }
    });
}
function recursivelyTraverseMutationEffects(root$jscomp$0, parentFiber, lanes) {
    var deletions = parentFiber.deletions;
    if (null !== deletions) for(var i = 0; i < deletions.length; i++){
        var childToDelete = deletions[i], root = root$jscomp$0, returnFiber = parentFiber, parent = returnFiber;
        a: for(; null !== parent;){
            switch(parent.tag){
                case 27:
                    if (isSingletonScope(parent.type)) {
                        hostParent = parent.stateNode;
                        hostParentIsContainer = !1;
                        break a;
                    }
                    break;
                case 5:
                    hostParent = parent.stateNode;
                    hostParentIsContainer = !1;
                    break a;
                case 3:
                case 4:
                    hostParent = parent.stateNode.containerInfo;
                    hostParentIsContainer = !0;
                    break a;
            }
            parent = parent.return;
        }
        if (null === hostParent) throw Error(formatProdErrorMessage(160));
        commitDeletionEffectsOnFiber(root, returnFiber, childToDelete);
        hostParent = null;
        hostParentIsContainer = !1;
        root = childToDelete.alternate;
        null !== root && (root.return = null);
        childToDelete.return = null;
    }
    if (parentFiber.subtreeFlags & 13886) for(parentFiber = parentFiber.child; null !== parentFiber;)commitMutationEffectsOnFiber(parentFiber, root$jscomp$0, lanes), parentFiber = parentFiber.sibling;
}
var currentHoistableRoot = null;
function commitMutationEffectsOnFiber(finishedWork, root, lanes) {
    var current = finishedWork.alternate, flags = finishedWork.flags;
    switch(finishedWork.tag){
        case 0:
        case 11:
        case 14:
        case 15:
            if (flags & 4 && (current = finishedWork.updateQueue, current = null !== current ? current.events : null, null !== current)) for(var ii = 0; ii < current.length; ii++){
                var _eventPayloads$ii2 = current[ii];
                _eventPayloads$ii2.ref.impl = _eventPayloads$ii2.nextImpl;
            }
            recursivelyTraverseMutationEffects(root, finishedWork, lanes);
            commitReconciliationEffects(finishedWork);
            flags & 4 && (commitHookEffectListUnmount(3, finishedWork, finishedWork.return), commitHookEffectListMount(3, finishedWork), commitHookEffectListUnmount(5, finishedWork, finishedWork.return));
            break;
        case 1:
            recursivelyTraverseMutationEffects(root, finishedWork, lanes);
            commitReconciliationEffects(finishedWork);
            flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
            flags & 64 && offscreenSubtreeIsHidden && (finishedWork = finishedWork.updateQueue, null !== finishedWork && (root = finishedWork.callbacks, null !== root && (lanes = finishedWork.shared.hiddenCallbacks, finishedWork.shared.hiddenCallbacks = null === lanes ? root : lanes.concat(root))));
            break;
        case 26:
            ii = currentHoistableRoot;
            recursivelyTraverseMutationEffects(root, finishedWork, lanes);
            commitReconciliationEffects(finishedWork);
            flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
            if (flags & 4) if (flags = null !== current ? current.memoizedState : null, lanes = finishedWork.memoizedState, null === current) if (null === lanes) if (null === finishedWork.stateNode) if (offscreenSubtreeIsHidden) finishedWork.stateNode = createHoistableInstance(finishedWork.type, finishedWork.memoizedProps, root.containerInfo, finishedWork);
            else {
                a: {
                    root = finishedWork.type;
                    lanes = finishedWork.memoizedProps;
                    flags = ii.ownerDocument || ii;
                    b: switch(root){
                        case "title":
                            current = flags.getElementsByTagName("title")[0];
                            if (!current || current[internalHoistableMarker] || current[internalInstanceKey] || "http://www.w3.org/2000/svg" === current.namespaceURI || current.hasAttribute("itemprop")) current = flags.createElement(root), flags.head.insertBefore(current, flags.querySelector("head > title"));
                            setInitialProperties(current, root, lanes);
                            current[internalInstanceKey] = finishedWork;
                            markNodeAsHoistable(current);
                            root = current;
                            break a;
                        case "link":
                            if (ii = getHydratableHoistableCache("link", "href", flags).get(root + (lanes.href || ""))) {
                                for(_eventPayloads$ii2 = 0; _eventPayloads$ii2 < ii.length; _eventPayloads$ii2++)if (current = ii[_eventPayloads$ii2], current.getAttribute("href") === (null == lanes.href || "" === lanes.href ? null : lanes.href) && current.getAttribute("rel") === (null == lanes.rel ? null : lanes.rel) && current.getAttribute("title") === (null == lanes.title ? null : lanes.title) && current.getAttribute("crossorigin") === (null == lanes.crossOrigin ? null : lanes.crossOrigin)) {
                                    ii.splice(_eventPayloads$ii2, 1);
                                    break b;
                                }
                            }
                            current = flags.createElement(root);
                            setInitialProperties(current, root, lanes);
                            flags.head.appendChild(current);
                            break;
                        case "meta":
                            if (ii = getHydratableHoistableCache("meta", "content", flags).get(root + (lanes.content || ""))) {
                                for(_eventPayloads$ii2 = 0; _eventPayloads$ii2 < ii.length; _eventPayloads$ii2++)if (current = ii[_eventPayloads$ii2], current.getAttribute("content") === (null == lanes.content ? null : "" + lanes.content) && current.getAttribute("name") === (null == lanes.name ? null : lanes.name) && current.getAttribute("property") === (null == lanes.property ? null : lanes.property) && current.getAttribute("http-equiv") === (null == lanes.httpEquiv ? null : lanes.httpEquiv) && current.getAttribute("charset") === (null == lanes.charSet ? null : lanes.charSet)) {
                                    ii.splice(_eventPayloads$ii2, 1);
                                    break b;
                                }
                            }
                            current = flags.createElement(root);
                            setInitialProperties(current, root, lanes);
                            flags.head.appendChild(current);
                            break;
                        default:
                            throw Error(formatProdErrorMessage(468, root));
                    }
                    current[internalInstanceKey] = finishedWork;
                    markNodeAsHoistable(current);
                    root = current;
                }
                finishedWork.stateNode = root;
            }
            else offscreenSubtreeIsHidden || mountHoistable(ii, finishedWork.type, finishedWork.stateNode);
            else finishedWork.stateNode = acquireResource(ii, lanes, finishedWork.memoizedProps);
            else flags !== lanes ? (null === flags ? (root = current.stateNode, null === root || offscreenSubtreeWasHidden || root.parentNode.removeChild(root)) : flags.count--, null === lanes ? offscreenSubtreeIsHidden || mountHoistable(ii, finishedWork.type, finishedWork.stateNode) : acquireResource(ii, lanes, finishedWork.memoizedProps)) : null === lanes && null !== finishedWork.stateNode && commitHostUpdate(finishedWork, finishedWork.memoizedProps, current.memoizedProps);
            break;
        case 27:
            recursivelyTraverseMutationEffects(root, finishedWork, lanes);
            commitReconciliationEffects(finishedWork);
            flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
            null !== current && flags & 4 && commitHostUpdate(finishedWork, finishedWork.memoizedProps, current.memoizedProps);
            break;
        case 5:
            ii = offscreenDirectParentIsHidden;
            offscreenDirectParentIsHidden = !1;
            recursivelyTraverseMutationEffects(root, finishedWork, lanes);
            offscreenDirectParentIsHidden = ii;
            commitReconciliationEffects(finishedWork);
            flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
            if (finishedWork.flags & 32) {
                root = finishedWork.stateNode;
                try {
                    setTextContent(root, ""), viewTransitionMutationContext = !0;
                } catch (error) {
                    captureCommitPhaseError(finishedWork, finishedWork.return, error);
                }
            }
            flags & 4 && null != finishedWork.stateNode && (root = finishedWork.memoizedProps, commitHostUpdate(finishedWork, root, null !== current ? current.memoizedProps : root));
            flags & 1024 && (needsFormReset = !0);
            break;
        case 6:
            recursivelyTraverseMutationEffects(root, finishedWork, lanes);
            commitReconciliationEffects(finishedWork);
            if (flags & 4) {
                if (null === finishedWork.stateNode) throw Error(formatProdErrorMessage(162));
                root = finishedWork.memoizedProps;
                lanes = finishedWork.stateNode;
                try {
                    lanes.nodeValue = root, viewTransitionMutationContext = !0;
                } catch (error) {
                    captureCommitPhaseError(finishedWork, finishedWork.return, error);
                }
            }
            break;
        case 3:
            viewTransitionMutationContext = !1;
            tagCaches = null;
            ii = currentHoistableRoot;
            currentHoistableRoot = getHoistableRoot(root.containerInfo);
            recursivelyTraverseMutationEffects(root, finishedWork, lanes);
            currentHoistableRoot = ii;
            commitReconciliationEffects(finishedWork);
            if (flags & 4 && null !== current && current.memoizedState.isDehydrated) try {
                retryIfBlockedOn(root.containerInfo);
            } catch (error) {
                captureCommitPhaseError(finishedWork, finishedWork.return, error);
            }
            needsFormReset && (needsFormReset = !1, recursivelyResetForms(finishedWork));
            viewTransitionMutationContext = !1;
            break;
        case 4:
            flags = offscreenDirectParentIsHidden;
            offscreenDirectParentIsHidden = offscreenSubtreeIsHidden;
            current = pushMutationContext();
            ii = currentHoistableRoot;
            currentHoistableRoot = getHoistableRoot(finishedWork.stateNode.containerInfo);
            recursivelyTraverseMutationEffects(root, finishedWork, lanes);
            commitReconciliationEffects(finishedWork);
            currentHoistableRoot = ii;
            viewTransitionMutationContext && inUpdateViewTransition && (rootViewTransitionAffected = !0);
            viewTransitionMutationContext = current;
            offscreenDirectParentIsHidden = flags;
            break;
        case 12:
            recursivelyTraverseMutationEffects(root, finishedWork, lanes);
            commitReconciliationEffects(finishedWork);
            break;
        case 31:
            recursivelyTraverseMutationEffects(root, finishedWork, lanes);
            commitReconciliationEffects(finishedWork);
            flags & 4 && (root = finishedWork.updateQueue, null !== root && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, root)));
            break;
        case 13:
            recursivelyTraverseMutationEffects(root, finishedWork, lanes);
            commitReconciliationEffects(finishedWork);
            finishedWork.child.flags & 8192 && null !== finishedWork.memoizedState !== (null !== current && null !== current.memoizedState) && (globalMostRecentFallbackTime = now());
            flags & 4 && (root = finishedWork.updateQueue, null !== root && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, root)));
            break;
        case 22:
            ii = null !== finishedWork.memoizedState;
            _eventPayloads$ii2 = null !== current && null !== current.memoizedState;
            var prevOffscreenSubtreeIsHidden = offscreenSubtreeIsHidden, prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden, prevOffscreenDirectParentIsHidden$166 = offscreenDirectParentIsHidden;
            offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden || ii;
            offscreenDirectParentIsHidden = prevOffscreenDirectParentIsHidden$166 || ii;
            offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden || _eventPayloads$ii2;
            recursivelyTraverseMutationEffects(root, finishedWork, lanes);
            offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
            offscreenDirectParentIsHidden = prevOffscreenDirectParentIsHidden$166;
            offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden;
            commitReconciliationEffects(finishedWork);
            flags & 8192 && (root = finishedWork.stateNode, root._visibility = ii ? root._visibility & -2 : root._visibility | 1, !ii || null === current || _eventPayloads$ii2 || offscreenSubtreeIsHidden || offscreenSubtreeWasHidden || (root = _eventPayloads$ii2 || offscreenSubtreeWasHidden, lanes = offscreenSubtreeIsHidden, current = offscreenSubtreeWasHidden, offscreenSubtreeIsHidden = ii || offscreenSubtreeIsHidden, offscreenSubtreeWasHidden = root, recursivelyTraverseDisappearLayoutEffects(finishedWork, 2), offscreenSubtreeIsHidden = lanes, offscreenSubtreeWasHidden = current), !ii && offscreenDirectParentIsHidden || hideOrUnhideAllChildren(finishedWork, ii));
            flags & 4 && (root = finishedWork.updateQueue, null !== root && (lanes = root.retryQueue, null !== lanes && (root.retryQueue = null, attachSuspenseRetryListeners(finishedWork, lanes))));
            break;
        case 19:
            recursivelyTraverseMutationEffects(root, finishedWork, lanes);
            commitReconciliationEffects(finishedWork);
            flags & 4 && (root = finishedWork.updateQueue, null !== root && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, root)));
            break;
        case 30:
            flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
            flags = pushMutationContext();
            ii = inUpdateViewTransition;
            _eventPayloads$ii2 = (lanes & 335544064) === lanes;
            prevOffscreenSubtreeIsHidden = finishedWork.memoizedProps;
            inUpdateViewTransition = _eventPayloads$ii2 && "none" !== getViewTransitionClassName(prevOffscreenSubtreeIsHidden.default, prevOffscreenSubtreeIsHidden.update);
            recursivelyTraverseMutationEffects(root, finishedWork, lanes);
            commitReconciliationEffects(finishedWork);
            _eventPayloads$ii2 && null !== current && viewTransitionMutationContext && (finishedWork.flags |= 4);
            inUpdateViewTransition = ii;
            viewTransitionMutationContext = flags;
            break;
        case 21:
            break;
        case 7:
            flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return)), current && null !== current.stateNode && (current.stateNode._fragmentFiber = finishedWork);
        default:
            recursivelyTraverseMutationEffects(root, finishedWork, lanes), commitReconciliationEffects(finishedWork);
    }
}
function commitReconciliationEffects(finishedWork) {
    var flags = finishedWork.flags;
    if (flags & 2) {
        try {
            for(var hostParentFiber, parentFiber = finishedWork.return; null !== parentFiber;){
                if (isHostParent(parentFiber)) {
                    hostParentFiber = parentFiber;
                    break;
                }
                parentFiber = parentFiber.return;
            }
            parentFiber = null;
            for(var parent = finishedWork.return; null !== parent;){
                if (isFragmentInstanceParent(parent)) {
                    var fragmentInstance = parent.stateNode;
                    null === parentFiber ? parentFiber = [
                        fragmentInstance
                    ] : parentFiber.push(fragmentInstance);
                }
                if (isFragmentInstanceHostBoundary(parent)) break;
                parent = parent.return;
            }
            var JSCompiler_inline_result = parentFiber;
            if (null == hostParentFiber) throw Error(formatProdErrorMessage(160));
            switch(hostParentFiber.tag){
                case 27:
                    var parent$jscomp$0 = hostParentFiber.stateNode, before = getHostSibling(finishedWork);
                    insertOrAppendPlacementNode(finishedWork, before, parent$jscomp$0, JSCompiler_inline_result);
                    break;
                case 5:
                    var parent$149 = hostParentFiber.stateNode;
                    hostParentFiber.flags & 32 && (setTextContent(parent$149, ""), hostParentFiber.flags &= -33);
                    var before$150 = getHostSibling(finishedWork);
                    insertOrAppendPlacementNode(finishedWork, before$150, parent$149, JSCompiler_inline_result);
                    break;
                case 3:
                case 4:
                    var parent$151 = hostParentFiber.stateNode.containerInfo, before$152 = getHostSibling(finishedWork);
                    insertOrAppendPlacementNodeIntoContainer(finishedWork, before$152, parent$151, JSCompiler_inline_result);
                    break;
                default:
                    throw Error(formatProdErrorMessage(161));
            }
        } catch (error) {
            captureCommitPhaseError(finishedWork, finishedWork.return, error);
        }
        finishedWork.flags &= -3;
    }
    flags & 4096 && (finishedWork.flags &= -4097);
}
function recursivelyResetForms(parentFiber) {
    if (parentFiber.subtreeFlags & 1024) for(parentFiber = parentFiber.child; null !== parentFiber;){
        var fiber = parentFiber;
        recursivelyResetForms(fiber);
        5 === fiber.tag && fiber.flags & 1024 && (fiber = fiber.stateNode, _enabled = !0, fiber.reset(), _enabled = !1);
        parentFiber = parentFiber.sibling;
    }
}
function recursivelyTraverseAfterMutationEffects(root, parentFiber) {
    if (parentFiber.subtreeFlags & 9270) for(parentFiber = parentFiber.child; null !== parentFiber;)commitAfterMutationEffectsOnFiber(parentFiber, root), parentFiber = parentFiber.sibling;
    else measureNestedViewTransitions(parentFiber, !1);
}
function commitAfterMutationEffectsOnFiber(finishedWork, root) {
    var current = finishedWork.alternate;
    if (null === current) commitEnterViewTransitions(finishedWork, !1);
    else switch(finishedWork.tag){
        case 3:
            rootViewTransitionNameCanceled = viewTransitionContextChanged = !1;
            pushViewTransitionCancelableScope();
            recursivelyTraverseAfterMutationEffects(root, finishedWork);
            if (!viewTransitionContextChanged && !rootViewTransitionAffected) {
                finishedWork = viewTransitionCancelableChildren;
                if (null !== finishedWork) for(var i = 0; i < finishedWork.length; i += 3){
                    current = finishedWork[i];
                    var oldName = finishedWork[i + 1];
                    restoreViewTransitionName(current, finishedWork[i + 2]);
                    current = current.ownerDocument.documentElement;
                    null !== current && current.animate({
                        opacity: [
                            0,
                            0
                        ],
                        pointerEvents: [
                            "none",
                            "none"
                        ]
                    }, {
                        duration: 0,
                        fill: "forwards",
                        pseudoElement: "::view-transition-group(" + oldName + ")"
                    });
                }
                finishedWork = root.containerInfo;
                finishedWork = 9 === finishedWork.nodeType ? finishedWork.documentElement : finishedWork.ownerDocument.documentElement;
                null !== finishedWork && "" === finishedWork.style.viewTransitionName && (finishedWork.style.viewTransitionName = "none", finishedWork.animate({
                    opacity: [
                        0,
                        0
                    ],
                    pointerEvents: [
                        "none",
                        "none"
                    ]
                }, {
                    duration: 0,
                    fill: "forwards",
                    pseudoElement: "::view-transition-group(root)"
                }), finishedWork.animate({
                    width: [
                        0,
                        0
                    ],
                    height: [
                        0,
                        0
                    ]
                }, {
                    duration: 0,
                    fill: "forwards",
                    pseudoElement: "::view-transition"
                }));
                rootViewTransitionNameCanceled = !0;
            }
            viewTransitionCancelableChildren = null;
            break;
        case 5:
            recursivelyTraverseAfterMutationEffects(root, finishedWork);
            break;
        case 4:
            i = viewTransitionContextChanged;
            viewTransitionContextChanged = !1;
            recursivelyTraverseAfterMutationEffects(root, finishedWork);
            viewTransitionContextChanged && (rootViewTransitionAffected = !0);
            viewTransitionContextChanged = i;
            break;
        case 22:
            null === finishedWork.memoizedState && (null !== current.memoizedState ? commitEnterViewTransitions(finishedWork, !1) : recursivelyTraverseAfterMutationEffects(root, finishedWork));
            break;
        case 30:
            i = viewTransitionContextChanged;
            oldName = pushViewTransitionCancelableScope();
            viewTransitionContextChanged = !1;
            recursivelyTraverseAfterMutationEffects(root, finishedWork);
            viewTransitionContextChanged && (finishedWork.flags |= 4);
            var props = finishedWork.memoizedProps, state = finishedWork.stateNode;
            root = getViewTransitionName(props, state);
            state = getViewTransitionName(current.memoizedProps, state);
            var className = getViewTransitionClassName(props.default, props.update);
            "none" === className ? root = !1 : (props = current.memoizedState, current.memoizedState = null, current = finishedWork.child, viewTransitionHostInstanceIdx = 0, root = measureViewTransitionHostInstancesRecursive(finishedWork, current, root, state, className, props, !0), viewTransitionHostInstanceIdx !== (null === props ? 0 : props.length) && (finishedWork.flags |= 32));
            0 !== (finishedWork.flags & 4) && root ? (scheduleViewTransitionEvent(finishedWork, finishedWork.memoizedProps.onUpdate), viewTransitionCancelableChildren = oldName) : null !== oldName && (oldName.push.apply(oldName, viewTransitionCancelableChildren), viewTransitionCancelableChildren = oldName);
            viewTransitionContextChanged = 0 !== (finishedWork.flags & 32) ? !0 : i;
            break;
        default:
            recursivelyTraverseAfterMutationEffects(root, finishedWork);
    }
}
function recursivelyTraverseLayoutEffects(root, parentFiber) {
    if (parentFiber.subtreeFlags & 8772) for(parentFiber = parentFiber.child; null !== parentFiber;)commitLayoutEffectOnFiber(root, parentFiber.alternate, parentFiber), parentFiber = parentFiber.sibling;
}
function recursivelyTraverseDisappearLayoutEffects(parentFiber, layoutEffectTraversalFlags$jscomp$0) {
    for(parentFiber = parentFiber.child; null !== parentFiber;){
        var finishedWork = parentFiber, layoutEffectTraversalFlags = layoutEffectTraversalFlags$jscomp$0;
        switch(finishedWork.tag){
            case 0:
            case 11:
            case 14:
            case 15:
                commitHookEffectListUnmount(4, finishedWork, finishedWork.return);
                recursivelyTraverseDisappearLayoutEffects(finishedWork, layoutEffectTraversalFlags);
                break;
            case 1:
                safelyDetachRef(finishedWork, finishedWork.return);
                var instance = finishedWork.stateNode;
                "function" === typeof instance.componentWillUnmount && safelyCallComponentWillUnmount(finishedWork, finishedWork.return, instance);
                recursivelyTraverseDisappearLayoutEffects(finishedWork, layoutEffectTraversalFlags);
                break;
            case 27:
                0 !== (layoutEffectTraversalFlags & 2) && releaseSingletonInstance(finishedWork.stateNode, finishedWork.type, finishedWork.memoizedProps);
            case 5:
                safelyDetachRef(finishedWork, finishedWork.return);
                5 !== finishedWork.tag && 27 !== finishedWork.tag || commitFragmentInstanceDeletionEffects(finishedWork);
                recursivelyTraverseDisappearLayoutEffects(finishedWork, layoutEffectTraversalFlags);
                break;
            case 6:
                commitFragmentInstanceDeletionEffects(finishedWork);
                break;
            case 26:
                safelyDetachRef(finishedWork, finishedWork.return);
                instance = finishedWork.stateNode;
                null !== finishedWork.memoizedState || null === instance || offscreenSubtreeWasHidden || instance.parentNode.removeChild(instance);
                recursivelyTraverseDisappearLayoutEffects(finishedWork, layoutEffectTraversalFlags);
                break;
            case 22:
                null === finishedWork.memoizedState && recursivelyTraverseDisappearLayoutEffects(finishedWork, layoutEffectTraversalFlags);
                break;
            case 30:
                safelyDetachRef(finishedWork, finishedWork.return);
                recursivelyTraverseDisappearLayoutEffects(finishedWork, layoutEffectTraversalFlags);
                break;
            case 7:
                safelyDetachRef(finishedWork, finishedWork.return);
            default:
                recursivelyTraverseDisappearLayoutEffects(finishedWork, layoutEffectTraversalFlags);
        }
        parentFiber = parentFiber.sibling;
    }
}
function recursivelyTraverseReappearLayoutEffects(finishedRoot$jscomp$0, parentFiber, layoutEffectTraversalFlags) {
    layoutEffectTraversalFlags = 0 !== (parentFiber.subtreeFlags & 8772) ? layoutEffectTraversalFlags : layoutEffectTraversalFlags & -2;
    for(parentFiber = parentFiber.child; null !== parentFiber;){
        var current = parentFiber.alternate, finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, flags = finishedWork.flags, includeWorkInProgressEffects = 0 !== (layoutEffectTraversalFlags & 1);
        switch(finishedWork.tag){
            case 0:
            case 11:
            case 15:
                recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, layoutEffectTraversalFlags);
                commitHookEffectListMount(4, finishedWork);
                break;
            case 1:
                recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, layoutEffectTraversalFlags);
                current = finishedWork;
                finishedRoot = current.stateNode;
                if ("function" === typeof finishedRoot.componentDidMount) try {
                    finishedRoot.componentDidMount();
                } catch (error) {
                    captureCommitPhaseError(current, current.return, error);
                }
                current = finishedWork;
                finishedRoot = current.updateQueue;
                if (null !== finishedRoot) {
                    var instance = current.stateNode;
                    try {
                        var hiddenCallbacks = finishedRoot.shared.hiddenCallbacks;
                        if (null !== hiddenCallbacks) for(finishedRoot.shared.hiddenCallbacks = null, finishedRoot = 0; finishedRoot < hiddenCallbacks.length; finishedRoot++)callCallback(hiddenCallbacks[finishedRoot], instance);
                    } catch (error) {
                        captureCommitPhaseError(current, current.return, error);
                    }
                }
                includeWorkInProgressEffects && flags & 64 && commitClassCallbacks(finishedWork);
                safelyAttachRef(finishedWork, finishedWork.return);
                break;
            case 27:
                0 !== (layoutEffectTraversalFlags & 2) && commitHostSingletonAcquisition(finishedWork);
            case 5:
                5 !== finishedWork.tag && 27 !== finishedWork.tag || commitFragmentInstanceInsertionEffects(finishedWork);
                recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, layoutEffectTraversalFlags);
                includeWorkInProgressEffects && null === current && flags & 4 && commitHostMount(finishedWork);
                safelyAttachRef(finishedWork, finishedWork.return);
                break;
            case 6:
                commitFragmentInstanceInsertionEffects(finishedWork);
                break;
            case 26:
                instance = finishedWork.stateNode;
                null !== finishedWork.memoizedState || null === instance || offscreenSubtreeIsHidden || mountHoistable(getHoistableRoot(instance.ownerDocument), finishedWork.type, instance);
                recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, layoutEffectTraversalFlags);
                includeWorkInProgressEffects && null === current && flags & 4 && commitHostMount(finishedWork);
                safelyAttachRef(finishedWork, finishedWork.return);
                break;
            case 12:
                recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, layoutEffectTraversalFlags);
                break;
            case 31:
                recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, layoutEffectTraversalFlags);
                includeWorkInProgressEffects && flags & 4 && commitActivityHydrationCallbacks(finishedRoot, finishedWork);
                break;
            case 13:
                recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, layoutEffectTraversalFlags);
                includeWorkInProgressEffects && flags & 4 && commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
                break;
            case 22:
                null === finishedWork.memoizedState && recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, layoutEffectTraversalFlags);
                safelyAttachRef(finishedWork, finishedWork.return);
                break;
            case 30:
                recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, layoutEffectTraversalFlags);
                safelyAttachRef(finishedWork, finishedWork.return);
                break;
            case 7:
                safelyAttachRef(finishedWork, finishedWork.return);
            default:
                recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, layoutEffectTraversalFlags);
        }
        parentFiber = parentFiber.sibling;
    }
}
function commitOffscreenPassiveMountEffects(current, finishedWork) {
    var previousCache = null;
    null !== current && null !== current.memoizedState && null !== current.memoizedState.cachePool && (previousCache = current.memoizedState.cachePool.pool);
    current = null;
    null !== finishedWork.memoizedState && null !== finishedWork.memoizedState.cachePool && (current = finishedWork.memoizedState.cachePool.pool);
    current !== previousCache && (null != current && current.refCount++, null != previousCache && releaseCache(previousCache));
}
function commitCachePassiveMountEffect(current, finishedWork) {
    current = null;
    null !== finishedWork.alternate && (current = finishedWork.alternate.memoizedState.cache);
    finishedWork = finishedWork.memoizedState.cache;
    finishedWork !== current && (finishedWork.refCount++, null != current && releaseCache(current));
}
function recursivelyTraversePassiveMountEffects(root, parentFiber, committedLanes, committedTransitions) {
    var isViewTransitionEligible = (committedLanes & 335544064) === committedLanes;
    if (parentFiber.subtreeFlags & (isViewTransitionEligible ? 10262 : 10256)) for(parentFiber = parentFiber.child; null !== parentFiber;)commitPassiveMountOnFiber(root, parentFiber, committedLanes, committedTransitions), parentFiber = parentFiber.sibling;
    else isViewTransitionEligible && restoreNestedViewTransitions(parentFiber);
}
function commitPassiveMountOnFiber(finishedRoot, finishedWork, committedLanes, committedTransitions) {
    var isViewTransitionEligible = (committedLanes & 335544064) === committedLanes;
    isViewTransitionEligible && null === finishedWork.alternate && null !== finishedWork.return && null !== finishedWork.return.alternate && restoreEnterOrExitViewTransitions(finishedWork);
    var flags = finishedWork.flags;
    switch(finishedWork.tag){
        case 0:
        case 11:
        case 15:
            recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
            flags & 2048 && commitHookEffectListMount(9, finishedWork);
            break;
        case 1:
            recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
            break;
        case 3:
            recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
            isViewTransitionEligible && rootViewTransitionNameCanceled && (finishedRoot = finishedRoot.containerInfo, finishedRoot = 9 === finishedRoot.nodeType ? finishedRoot.body : "HTML" === finishedRoot.nodeName ? finishedRoot.ownerDocument.body : finishedRoot, "root" === finishedRoot.style.viewTransitionName && (finishedRoot.style.viewTransitionName = ""), finishedRoot = finishedRoot.ownerDocument.documentElement, null !== finishedRoot && "none" === finishedRoot.style.viewTransitionName && (finishedRoot.style.viewTransitionName = ""));
            flags & 2048 && (flags = null, null !== finishedWork.alternate && (flags = finishedWork.alternate.memoizedState.cache), finishedWork = finishedWork.memoizedState.cache, finishedWork !== flags && (finishedWork.refCount++, null != flags && releaseCache(flags)));
            break;
        case 12:
            if (flags & 2048) {
                recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
                flags = finishedWork.stateNode;
                try {
                    var _finishedWork$memoize2 = finishedWork.memoizedProps, id = _finishedWork$memoize2.id, onPostCommit = _finishedWork$memoize2.onPostCommit;
                    "function" === typeof onPostCommit && onPostCommit(id, null === finishedWork.alternate ? "mount" : "update", flags.passiveEffectDuration, -0);
                } catch (error) {
                    captureCommitPhaseError(finishedWork, finishedWork.return, error);
                }
            } else recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
            break;
        case 31:
            recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
            break;
        case 13:
            recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
            break;
        case 23:
            break;
        case 22:
            _finishedWork$memoize2 = finishedWork.stateNode;
            id = finishedWork.alternate;
            null !== finishedWork.memoizedState ? (isViewTransitionEligible && null !== id && null === id.memoizedState && restoreEnterOrExitViewTransitions(id), _finishedWork$memoize2._visibility & 2 ? recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions) : recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork)) : (isViewTransitionEligible && null !== id && null !== id.memoizedState && restoreEnterOrExitViewTransitions(finishedWork), _finishedWork$memoize2._visibility & 2 ? recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions) : (_finishedWork$memoize2._visibility |= 2, recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, 0 !== (finishedWork.subtreeFlags & 10256) || !1)));
            flags & 2048 && commitOffscreenPassiveMountEffects(id, finishedWork);
            break;
        case 24:
            recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
            flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
            break;
        case 30:
            isViewTransitionEligible && (flags = finishedWork.alternate, null !== flags && (restoreViewTransitionOnHostInstances(flags.child, !0), restoreViewTransitionOnHostInstances(finishedWork.child, !0)));
            recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
            break;
        default:
            recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
    }
}
function recursivelyTraverseReconnectPassiveEffects(finishedRoot$jscomp$0, parentFiber, committedLanes$jscomp$0, committedTransitions$jscomp$0, includeWorkInProgressEffects) {
    includeWorkInProgressEffects = includeWorkInProgressEffects && (0 !== (parentFiber.subtreeFlags & 10256) || !1);
    for(parentFiber = parentFiber.child; null !== parentFiber;){
        var finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, committedLanes = committedLanes$jscomp$0, committedTransitions = committedTransitions$jscomp$0, flags = finishedWork.flags;
        switch(finishedWork.tag){
            case 0:
            case 11:
            case 15:
                recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects);
                commitHookEffectListMount(8, finishedWork);
                break;
            case 23:
                break;
            case 22:
                var instance = finishedWork.stateNode;
                null !== finishedWork.memoizedState ? instance._visibility & 2 ? recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects) : recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork) : (instance._visibility |= 2, recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects));
                includeWorkInProgressEffects && flags & 2048 && commitOffscreenPassiveMountEffects(finishedWork.alternate, finishedWork);
                break;
            case 24:
                recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects);
                includeWorkInProgressEffects && flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
                break;
            default:
                recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects);
        }
        parentFiber = parentFiber.sibling;
    }
}
function recursivelyTraverseAtomicPassiveEffects(finishedRoot$jscomp$0, parentFiber) {
    if (parentFiber.subtreeFlags & 10256) for(parentFiber = parentFiber.child; null !== parentFiber;){
        var finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, flags = finishedWork.flags;
        switch(finishedWork.tag){
            case 22:
                recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
                flags & 2048 && commitOffscreenPassiveMountEffects(finishedWork.alternate, finishedWork);
                break;
            case 24:
                recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
                flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
                break;
            default:
                recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
        }
        parentFiber = parentFiber.sibling;
    }
}
var suspenseyCommitFlag = 8192;
function recursivelyAccumulateSuspenseyCommit(parentFiber, committedLanes, suspendedState) {
    if (parentFiber.subtreeFlags & suspenseyCommitFlag) for(parentFiber = parentFiber.child; null !== parentFiber;)accumulateSuspenseyCommitOnFiber(parentFiber, committedLanes, suspendedState), parentFiber = parentFiber.sibling;
}
function accumulateSuspenseyCommitOnFiber(fiber, committedLanes, suspendedState) {
    switch(fiber.tag){
        case 26:
            recursivelyAccumulateSuspenseyCommit(fiber, committedLanes, suspendedState);
            fiber.flags & suspenseyCommitFlag && (null !== fiber.memoizedState ? suspendResource(suspendedState, currentHoistableRoot, fiber.memoizedState, fiber.memoizedProps) : (fiber = fiber.stateNode, (committedLanes & 335544128) === committedLanes && suspendInstance(suspendedState, fiber)));
            break;
        case 5:
            recursivelyAccumulateSuspenseyCommit(fiber, committedLanes, suspendedState);
            fiber.flags & suspenseyCommitFlag && (fiber = fiber.stateNode, (committedLanes & 335544128) === committedLanes && suspendInstance(suspendedState, fiber));
            break;
        case 3:
        case 4:
            var previousHoistableRoot = currentHoistableRoot;
            currentHoistableRoot = getHoistableRoot(fiber.stateNode.containerInfo);
            recursivelyAccumulateSuspenseyCommit(fiber, committedLanes, suspendedState);
            currentHoistableRoot = previousHoistableRoot;
            break;
        case 22:
            null === fiber.memoizedState && (previousHoistableRoot = fiber.alternate, null !== previousHoistableRoot && null !== previousHoistableRoot.memoizedState ? (previousHoistableRoot = suspenseyCommitFlag, suspenseyCommitFlag = 16777216, recursivelyAccumulateSuspenseyCommit(fiber, committedLanes, suspendedState), suspenseyCommitFlag = previousHoistableRoot) : recursivelyAccumulateSuspenseyCommit(fiber, committedLanes, suspendedState));
            break;
        case 30:
            if (0 !== (fiber.flags & suspenseyCommitFlag) && (previousHoistableRoot = fiber.memoizedProps.name, null != previousHoistableRoot && "auto" !== previousHoistableRoot)) {
                var state = fiber.stateNode;
                state.paired = null;
                null === appearingViewTransitions && (appearingViewTransitions = new Map());
                appearingViewTransitions.set(previousHoistableRoot, state);
            }
            recursivelyAccumulateSuspenseyCommit(fiber, committedLanes, suspendedState);
            break;
        default:
            recursivelyAccumulateSuspenseyCommit(fiber, committedLanes, suspendedState);
    }
}
function detachAlternateSiblings(parentFiber) {
    var previousFiber = parentFiber.alternate;
    if (null !== previousFiber && (parentFiber = previousFiber.child, null !== parentFiber)) {
        previousFiber.child = null;
        do previousFiber = parentFiber.sibling, parentFiber.sibling = null, parentFiber = previousFiber;
        while (null !== parentFiber)
    }
}
function recursivelyTraversePassiveUnmountEffects(parentFiber) {
    var deletions = parentFiber.deletions;
    if (0 !== (parentFiber.flags & 16)) {
        if (null !== deletions) for(var i = 0; i < deletions.length; i++){
            var childToDelete = deletions[i];
            nextEffect = childToDelete;
            commitPassiveUnmountEffectsInsideOfDeletedTree_begin(childToDelete, parentFiber);
        }
        detachAlternateSiblings(parentFiber);
    }
    if (parentFiber.subtreeFlags & 10256) for(parentFiber = parentFiber.child; null !== parentFiber;)commitPassiveUnmountOnFiber(parentFiber), parentFiber = parentFiber.sibling;
}
function commitPassiveUnmountOnFiber(finishedWork) {
    switch(finishedWork.tag){
        case 0:
        case 11:
        case 15:
            recursivelyTraversePassiveUnmountEffects(finishedWork);
            finishedWork.flags & 2048 && commitHookEffectListUnmount(9, finishedWork, finishedWork.return);
            break;
        case 3:
            recursivelyTraversePassiveUnmountEffects(finishedWork);
            break;
        case 12:
            recursivelyTraversePassiveUnmountEffects(finishedWork);
            break;
        case 22:
            var instance = finishedWork.stateNode;
            null !== finishedWork.memoizedState && instance._visibility & 2 && (null === finishedWork.return || 13 !== finishedWork.return.tag) ? (instance._visibility &= -3, recursivelyTraverseDisconnectPassiveEffects(finishedWork)) : recursivelyTraversePassiveUnmountEffects(finishedWork);
            break;
        default:
            recursivelyTraversePassiveUnmountEffects(finishedWork);
    }
}
function recursivelyTraverseDisconnectPassiveEffects(parentFiber) {
    var deletions = parentFiber.deletions;
    if (0 !== (parentFiber.flags & 16)) {
        if (null !== deletions) for(var i = 0; i < deletions.length; i++){
            var childToDelete = deletions[i];
            nextEffect = childToDelete;
            commitPassiveUnmountEffectsInsideOfDeletedTree_begin(childToDelete, parentFiber);
        }
        detachAlternateSiblings(parentFiber);
    }
    for(parentFiber = parentFiber.child; null !== parentFiber;){
        deletions = parentFiber;
        switch(deletions.tag){
            case 0:
            case 11:
            case 15:
                commitHookEffectListUnmount(8, deletions, deletions.return);
                recursivelyTraverseDisconnectPassiveEffects(deletions);
                break;
            case 22:
                i = deletions.stateNode;
                i._visibility & 2 && (i._visibility &= -3, recursivelyTraverseDisconnectPassiveEffects(deletions));
                break;
            default:
                recursivelyTraverseDisconnectPassiveEffects(deletions);
        }
        parentFiber = parentFiber.sibling;
    }
}
function commitPassiveUnmountEffectsInsideOfDeletedTree_begin(deletedSubtreeRoot, nearestMountedAncestor) {
    for(; null !== nextEffect;){
        var fiber = nextEffect;
        switch(fiber.tag){
            case 0:
            case 11:
            case 15:
                commitHookEffectListUnmount(8, fiber, nearestMountedAncestor);
                break;
            case 23:
            case 22:
                if (null !== fiber.memoizedState && null !== fiber.memoizedState.cachePool) {
                    var cache = fiber.memoizedState.cachePool.pool;
                    null != cache && cache.refCount++;
                }
                break;
            case 24:
                releaseCache(fiber.memoizedState.cache);
        }
        cache = fiber.child;
        if (null !== cache) cache.return = fiber, nextEffect = cache;
        else a: for(fiber = deletedSubtreeRoot; null !== nextEffect;){
            cache = nextEffect;
            var sibling = cache.sibling, returnFiber = cache.return;
            detachFiberAfterEffects(cache);
            if (cache === fiber) {
                nextEffect = null;
                break a;
            }
            if (null !== sibling) {
                sibling.return = returnFiber;
                nextEffect = sibling;
                break a;
            }
            nextEffect = returnFiber;
        }
    }
}
var DefaultAsyncDispatcher = {
    getCacheForType: function(resourceType) {
        var cache = readContext(CacheContext), cacheForType = cache.data.get(resourceType);
        void 0 === cacheForType && (cacheForType = resourceType(), cache.data.set(resourceType, cacheForType));
        return cacheForType;
    },
    cacheSignal: function() {
        return readContext(CacheContext).controller.signal;
    }
}, PossiblyWeakMap = "function" === typeof WeakMap ? WeakMap : Map, executionContext = 0, workInProgressRoot = null, workInProgress = null, workInProgressRootRenderLanes = 0, workInProgressSuspendedReason = 0, workInProgressThrownValue = null, workInProgressRootDidSkipSuspendedSiblings = !1, workInProgressRootIsPrerendering = !1, workInProgressRootDidAttachPingListener = !1, entangledRenderLanes = 0, workInProgressRootExitStatus = 0, workInProgressRootSkippedLanes = 0, workInProgressRootInterleavedUpdatedLanes = 0, workInProgressRootPingedLanes = 0, workInProgressDeferredLane = 0, workInProgressSuspendedRetryLanes = 0, workInProgressRootConcurrentErrors = null, workInProgressRootRecoverableErrors = null, workInProgressRootDidIncludeRecursiveRenderUpdate = !1, globalMostRecentFallbackTime = 0, globalMostRecentTransitionTime = 0, workInProgressRootRenderTargetTime = Infinity, workInProgressTransitions = null, legacyErrorBoundariesThatAlreadyFailed = null, pendingEffectsStatus = 0, pendingEffectsRoot = null, pendingFinishedWork = null, pendingEffectsLanes = 0, pendingEffectsRemainingLanes = 0, pendingPassiveTransitions = null, pendingRecoverableErrors = null, pendingViewTransition = null, pendingViewTransitionEvents = null, pendingTransitionTypes = null, nestedUpdateCount = 0, rootWithNestedUpdates = null;
function requestUpdateLane() {
    return 0 !== (executionContext & 2) && 0 !== workInProgressRootRenderLanes ? workInProgressRootRenderLanes & -workInProgressRootRenderLanes : null !== ReactSharedInternals.T ? requestTransitionLane() : resolveUpdatePriority();
}
function requestDeferredLane() {
    if (0 === workInProgressDeferredLane) if (0 === (workInProgressRootRenderLanes & 536870912) || isHydrating) {
        var lane = nextTransitionDeferredLane;
        nextTransitionDeferredLane <<= 1;
        0 === (nextTransitionDeferredLane & 3932160) && (nextTransitionDeferredLane = 262144);
        workInProgressDeferredLane = lane;
    } else workInProgressDeferredLane = 536870912;
    lane = suspenseHandlerStackCursor.current;
    null !== lane && (lane.flags |= 32);
    return workInProgressDeferredLane;
}
function scheduleViewTransitionEvent(fiber, callback) {
    if (null != callback) {
        var state = fiber.stateNode, instance = state.ref;
        null === instance && (instance = state.ref = createViewTransitionInstance(getViewTransitionName(fiber.memoizedProps, state)));
        null === pendingViewTransitionEvents && (pendingViewTransitionEvents = []);
        pendingViewTransitionEvents.push(callback.bind(null, instance));
    }
}
function scheduleUpdateOnFiber(root, fiber, lane) {
    if (root === workInProgressRoot && (2 === workInProgressSuspendedReason || 9 === workInProgressSuspendedReason) || null !== root.cancelPendingCommit) prepareFreshStack(root, 0), markRootSuspended(root, workInProgressRootRenderLanes, workInProgressDeferredLane, !1);
    markRootUpdated$1(root, lane);
    if (0 === (executionContext & 2) || root !== workInProgressRoot) root === workInProgressRoot && (0 === (executionContext & 2) && (workInProgressRootInterleavedUpdatedLanes |= lane), 4 === workInProgressRootExitStatus && markRootSuspended(root, workInProgressRootRenderLanes, workInProgressDeferredLane, !1)), ensureRootIsScheduled(root);
}
function performWorkOnRoot(root$jscomp$0, lanes, forceSync) {
    if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(327));
    var shouldTimeSlice = !forceSync && 0 === (lanes & 127) && 0 === (lanes & root$jscomp$0.expiredLanes) || checkIfRootIsPrerendering(root$jscomp$0, lanes), exitStatus = shouldTimeSlice ? renderRootConcurrent(root$jscomp$0, lanes) : renderRootSync(root$jscomp$0, lanes, !0), renderWasConcurrent = shouldTimeSlice;
    do {
        if (0 === exitStatus) {
            workInProgressRootIsPrerendering && !shouldTimeSlice && markRootSuspended(root$jscomp$0, lanes, 0, !1);
            break;
        } else {
            forceSync = root$jscomp$0.current.alternate;
            if (renderWasConcurrent && !isRenderConsistentWithExternalStores(forceSync)) {
                exitStatus = renderRootSync(root$jscomp$0, lanes, !1);
                renderWasConcurrent = !1;
                continue;
            }
            if (2 === exitStatus) {
                renderWasConcurrent = lanes;
                if (root$jscomp$0.errorRecoveryDisabledLanes & renderWasConcurrent) var JSCompiler_inline_result = 0;
                else JSCompiler_inline_result = root$jscomp$0.pendingLanes & -536870913, JSCompiler_inline_result = 0 !== JSCompiler_inline_result ? JSCompiler_inline_result : JSCompiler_inline_result & 536870912 ? 536870912 : 0;
                if (0 !== JSCompiler_inline_result) {
                    lanes = JSCompiler_inline_result;
                    a: {
                        var root = root$jscomp$0;
                        exitStatus = workInProgressRootConcurrentErrors;
                        var wasRootDehydrated = root.current.memoizedState.isDehydrated;
                        wasRootDehydrated && (prepareFreshStack(root, JSCompiler_inline_result).flags |= 256);
                        JSCompiler_inline_result = renderRootSync(root, JSCompiler_inline_result, !1);
                        if (2 !== JSCompiler_inline_result && 6 !== JSCompiler_inline_result) {
                            if (workInProgressRootDidAttachPingListener && !wasRootDehydrated) {
                                root.errorRecoveryDisabledLanes |= renderWasConcurrent;
                                workInProgressRootInterleavedUpdatedLanes |= renderWasConcurrent;
                                exitStatus = 4;
                                break a;
                            }
                            renderWasConcurrent = workInProgressRootRecoverableErrors;
                            workInProgressRootRecoverableErrors = exitStatus;
                            null !== renderWasConcurrent && (null === workInProgressRootRecoverableErrors ? workInProgressRootRecoverableErrors = renderWasConcurrent : workInProgressRootRecoverableErrors.push.apply(workInProgressRootRecoverableErrors, renderWasConcurrent));
                        }
                        exitStatus = JSCompiler_inline_result;
                    }
                    renderWasConcurrent = !1;
                    if (2 !== exitStatus) continue;
                }
            }
            if (1 === exitStatus) {
                prepareFreshStack(root$jscomp$0, 0);
                markRootSuspended(root$jscomp$0, lanes, 0, !0);
                break;
            }
            a: {
                shouldTimeSlice = root$jscomp$0;
                renderWasConcurrent = exitStatus;
                switch(renderWasConcurrent){
                    case 0:
                    case 1:
                        throw Error(formatProdErrorMessage(345));
                    case 4:
                        if ((lanes & 4194048) !== lanes && (lanes & 62914560) !== lanes) break;
                    case 6:
                        markRootSuspended(shouldTimeSlice, lanes, workInProgressDeferredLane, !workInProgressRootDidSkipSuspendedSiblings);
                        break a;
                    case 2:
                        workInProgressRootRecoverableErrors = null;
                        break;
                    case 3:
                    case 5:
                        break;
                    default:
                        throw Error(formatProdErrorMessage(329));
                }
                if ((lanes & 62914560) === lanes && (exitStatus = globalMostRecentFallbackTime + 300 - now(), 10 < exitStatus)) {
                    markRootSuspended(shouldTimeSlice, lanes, workInProgressDeferredLane, !workInProgressRootDidSkipSuspendedSiblings);
                    if (0 !== getNextLanes(shouldTimeSlice, 0, !0)) break a;
                    pendingEffectsLanes = lanes;
                    shouldTimeSlice.timeoutHandle = scheduleTimeout(completeRootWhenReady.bind(null, shouldTimeSlice, forceSync, workInProgressRootRecoverableErrors, workInProgressTransitions, workInProgressRootDidIncludeRecursiveRenderUpdate, lanes, workInProgressDeferredLane, workInProgressRootInterleavedUpdatedLanes, workInProgressSuspendedRetryLanes, workInProgressRootDidSkipSuspendedSiblings, renderWasConcurrent, "Throttled", -0, 0), exitStatus);
                    break a;
                }
                completeRootWhenReady(shouldTimeSlice, forceSync, workInProgressRootRecoverableErrors, workInProgressTransitions, workInProgressRootDidIncludeRecursiveRenderUpdate, lanes, workInProgressDeferredLane, workInProgressRootInterleavedUpdatedLanes, workInProgressSuspendedRetryLanes, workInProgressRootDidSkipSuspendedSiblings, renderWasConcurrent, null, -0, 0);
            }
        }
        break;
    }while (1)
    ensureRootIsScheduled(root$jscomp$0);
}
function completeRootWhenReady(root, finishedWork, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, lanes, spawnedLane, updatedLanes, suspendedRetryLanes, didSkipSuspendedSiblings, exitStatus, suspendedCommitReason, completedRenderStartTime, completedRenderEndTime) {
    root.timeoutHandle = -1;
    var subtreeFlags = finishedWork.subtreeFlags, isViewTransitionEligible = (lanes & 335544064) === lanes;
    suspendedCommitReason = null;
    if (isViewTransitionEligible || subtreeFlags & 8192 || 16785408 === (subtreeFlags & 16785408)) {
        if (suspendedCommitReason = {
            stylesheets: null,
            count: 0,
            imgCount: 0,
            imgBytes: 0,
            suspenseyImages: [],
            waitingForImages: !0,
            waitingForViewTransition: !1,
            unsuspend: noop$1
        }, appearingViewTransitions = null, accumulateSuspenseyCommitOnFiber(finishedWork, lanes, suspendedCommitReason), isViewTransitionEligible && (subtreeFlags = suspendedCommitReason, isViewTransitionEligible = root.containerInfo, isViewTransitionEligible = (9 === isViewTransitionEligible.nodeType ? isViewTransitionEligible : isViewTransitionEligible.ownerDocument).__reactViewTransition, null != isViewTransitionEligible && (subtreeFlags.count++, subtreeFlags.waitingForViewTransition = !0, subtreeFlags = onUnsuspend.bind(subtreeFlags), isViewTransitionEligible.finished.then(subtreeFlags, subtreeFlags))), subtreeFlags = (lanes & 62914560) === lanes ? globalMostRecentFallbackTime - now() : (lanes & 4194048) === lanes ? globalMostRecentTransitionTime - now() : 0, subtreeFlags = waitForCommitToBeReady(suspendedCommitReason, subtreeFlags), null !== subtreeFlags) {
            pendingEffectsLanes = lanes;
            root.cancelPendingCommit = subtreeFlags(completeRoot.bind(null, root, finishedWork, lanes, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes, didSkipSuspendedSiblings, exitStatus, suspendedCommitReason, null, completedRenderStartTime, completedRenderEndTime));
            markRootSuspended(root, lanes, spawnedLane, !didSkipSuspendedSiblings);
            return;
        }
    }
    completeRoot(root, finishedWork, lanes, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes, didSkipSuspendedSiblings, exitStatus, suspendedCommitReason);
}
function isRenderConsistentWithExternalStores(finishedWork) {
    for(var node = finishedWork;;){
        var tag = node.tag;
        if ((0 === tag || 11 === tag || 15 === tag) && node.flags & 16384 && (tag = node.updateQueue, null !== tag && (tag = tag.stores, null !== tag))) for(var i = 0; i < tag.length; i++){
            var check = tag[i], getSnapshot = check.getSnapshot;
            check = check.value;
            try {
                if (!objectIs(getSnapshot(), check)) return !1;
            } catch (error) {
                return !1;
            }
        }
        tag = node.child;
        if (node.subtreeFlags & 16384 && null !== tag) tag.return = node, node = tag;
        else {
            if (node === finishedWork) break;
            for(; null === node.sibling;){
                if (null === node.return || node.return === finishedWork) return !0;
                node = node.return;
            }
            node.sibling.return = node.return;
            node = node.sibling;
        }
    }
    return !0;
}
function markRootSuspended(root, suspendedLanes, spawnedLane, didAttemptEntireTree) {
    suspendedLanes = getEntangledLanes(root, suspendedLanes);
    suspendedLanes &= ~workInProgressRootPingedLanes;
    suspendedLanes &= ~workInProgressRootInterleavedUpdatedLanes;
    root.suspendedLanes |= suspendedLanes;
    root.pingedLanes &= ~suspendedLanes;
    didAttemptEntireTree && (root.warmLanes |= suspendedLanes);
    didAttemptEntireTree = root.expirationTimes;
    for(var lanes = suspendedLanes; 0 < lanes;){
        var index$6 = 31 - clz32(lanes), lane = 1 << index$6;
        didAttemptEntireTree[index$6] = -1;
        lanes &= ~lane;
    }
    0 !== spawnedLane && markSpawnedDeferredLane(root, spawnedLane, suspendedLanes);
}
function flushSyncWork$1() {
    return 0 === (executionContext & 6) ? (flushSyncWorkAcrossRoots_impl(0, !1), !1) : !0;
}
function resetWorkInProgressStack() {
    if (null !== workInProgress) {
        if (0 === workInProgressSuspendedReason) var interruptedWork = workInProgress.return;
        else interruptedWork = workInProgress, lastContextDependency = currentlyRenderingFiber$1 = null, resetHooksOnUnwind(interruptedWork), thenableState$1 = null, thenableIndexCounter$1 = 0, interruptedWork = workInProgress;
        for(; null !== interruptedWork;)unwindInterruptedWork(interruptedWork.alternate, interruptedWork), interruptedWork = interruptedWork.return;
        workInProgress = null;
    }
}
function prepareFreshStack(root, lanes) {
    var timeoutHandle = root.timeoutHandle;
    -1 !== timeoutHandle && (root.timeoutHandle = -1, cancelTimeout(timeoutHandle));
    timeoutHandle = root.cancelPendingCommit;
    null !== timeoutHandle && (root.cancelPendingCommit = null, timeoutHandle());
    pendingEffectsLanes = 0;
    resetWorkInProgressStack();
    workInProgressRoot = root;
    workInProgress = timeoutHandle = createWorkInProgress(root.current, null);
    workInProgressRootRenderLanes = lanes;
    workInProgressSuspendedReason = 0;
    workInProgressThrownValue = null;
    workInProgressRootDidSkipSuspendedSiblings = !1;
    workInProgressRootIsPrerendering = checkIfRootIsPrerendering(root, lanes);
    workInProgressRootDidAttachPingListener = !1;
    workInProgressSuspendedRetryLanes = workInProgressDeferredLane = workInProgressRootPingedLanes = workInProgressRootInterleavedUpdatedLanes = workInProgressRootSkippedLanes = workInProgressRootExitStatus = 0;
    workInProgressRootRecoverableErrors = workInProgressRootConcurrentErrors = null;
    workInProgressRootDidIncludeRecursiveRenderUpdate = !1;
    entangledRenderLanes = getEntangledLanes(root, lanes);
    finishQueueingConcurrentUpdates();
    return timeoutHandle;
}
function handleThrow(root, thrownValue) {
    currentlyRenderingFiber = null;
    ReactSharedInternals.H = ContextOnlyDispatcher;
    thrownValue === SuspenseException || thrownValue === SuspenseActionException ? (thrownValue = getSuspendedThenable(), workInProgressSuspendedReason = 3) : thrownValue === SuspenseyCommitException ? (thrownValue = getSuspendedThenable(), workInProgressSuspendedReason = 4) : workInProgressSuspendedReason = thrownValue === SelectiveHydrationException ? 8 : null !== thrownValue && "object" === typeof thrownValue && "function" === typeof thrownValue.then ? 6 : 1;
    workInProgressThrownValue = thrownValue;
    null === workInProgress && (workInProgressRootExitStatus = 1, logUncaughtError(root, createCapturedValueAtFiber(thrownValue, root.current)));
}
function shouldRemainOnPreviousScreen() {
    var handler = suspenseHandlerStackCursor.current;
    return null === handler ? !0 : (workInProgressRootRenderLanes & 4194048) === workInProgressRootRenderLanes ? null === shellBoundary ? !0 : !1 : (workInProgressRootRenderLanes & 62914560) === workInProgressRootRenderLanes || 0 !== (workInProgressRootRenderLanes & 536870912) ? handler === shellBoundary : !1;
}
function pushDispatcher() {
    var prevDispatcher = ReactSharedInternals.H;
    ReactSharedInternals.H = ContextOnlyDispatcher;
    return null === prevDispatcher ? ContextOnlyDispatcher : prevDispatcher;
}
function pushAsyncDispatcher() {
    var prevAsyncDispatcher = ReactSharedInternals.A;
    ReactSharedInternals.A = DefaultAsyncDispatcher;
    return prevAsyncDispatcher;
}
function renderDidSuspendDelayIfPossible() {
    workInProgressRootExitStatus = 4;
    workInProgressRootDidSkipSuspendedSiblings || (workInProgressRootRenderLanes & 4194048) !== workInProgressRootRenderLanes && null !== suspenseHandlerStackCursor.current || (workInProgressRootIsPrerendering = !0);
    0 === (workInProgressRootSkippedLanes & 134217727) && 0 === (workInProgressRootInterleavedUpdatedLanes & 134217727) || null === workInProgressRoot || markRootSuspended(workInProgressRoot, workInProgressRootRenderLanes, workInProgressDeferredLane, !1);
}
function renderRootSync(root, lanes, shouldYieldForPrerendering) {
    var prevExecutionContext = executionContext;
    executionContext |= 2;
    var prevDispatcher = pushDispatcher(), prevAsyncDispatcher = pushAsyncDispatcher();
    if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) workInProgressTransitions = null, prepareFreshStack(root, lanes);
    lanes = !1;
    var exitStatus = workInProgressRootExitStatus;
    a: do try {
        if (0 !== workInProgressSuspendedReason && null !== workInProgress) {
            var unitOfWork = workInProgress, thrownValue = workInProgressThrownValue;
            switch(workInProgressSuspendedReason){
                case 8:
                    resetWorkInProgressStack();
                    exitStatus = 6;
                    break a;
                case 3:
                case 2:
                case 9:
                case 6:
                    null === suspenseHandlerStackCursor.current && (lanes = !0);
                    var reason = workInProgressSuspendedReason;
                    workInProgressSuspendedReason = 0;
                    workInProgressThrownValue = null;
                    throwAndUnwindWorkLoop(root, unitOfWork, thrownValue, reason);
                    if (shouldYieldForPrerendering && workInProgressRootIsPrerendering) {
                        exitStatus = 0;
                        break a;
                    }
                    break;
                default:
                    reason = workInProgressSuspendedReason, workInProgressSuspendedReason = 0, workInProgressThrownValue = null, throwAndUnwindWorkLoop(root, unitOfWork, thrownValue, reason);
            }
        }
        workLoopSync();
        exitStatus = workInProgressRootExitStatus;
        break;
    } catch (thrownValue$184) {
        handleThrow(root, thrownValue$184);
    }
    while (1)
    lanes && root.shellSuspendCounter++;
    lastContextDependency = currentlyRenderingFiber$1 = null;
    executionContext = prevExecutionContext;
    ReactSharedInternals.H = prevDispatcher;
    ReactSharedInternals.A = prevAsyncDispatcher;
    null === workInProgress && (workInProgressRoot = null, workInProgressRootRenderLanes = 0, finishQueueingConcurrentUpdates());
    return exitStatus;
}
function workLoopSync() {
    for(; null !== workInProgress;)performUnitOfWork(workInProgress);
}
function renderRootConcurrent(root, lanes) {
    var prevExecutionContext = executionContext;
    executionContext |= 2;
    var prevDispatcher = pushDispatcher(), prevAsyncDispatcher = pushAsyncDispatcher();
    workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes ? (workInProgressTransitions = null, workInProgressRootRenderTargetTime = now() + 500, prepareFreshStack(root, lanes)) : workInProgressRootIsPrerendering = checkIfRootIsPrerendering(root, lanes);
    a: do try {
        if (0 !== workInProgressSuspendedReason && null !== workInProgress) {
            lanes = workInProgress;
            var thrownValue = workInProgressThrownValue;
            b: switch(workInProgressSuspendedReason){
                case 1:
                    workInProgressSuspendedReason = 0;
                    workInProgressThrownValue = null;
                    throwAndUnwindWorkLoop(root, lanes, thrownValue, 1);
                    break;
                case 2:
                case 9:
                    if (isThenableResolved(thrownValue)) {
                        workInProgressSuspendedReason = 0;
                        workInProgressThrownValue = null;
                        replaySuspendedUnitOfWork(lanes);
                        break;
                    }
                    lanes = function() {
                        2 !== workInProgressSuspendedReason && 9 !== workInProgressSuspendedReason || workInProgressRoot !== root || (workInProgressSuspendedReason = 7);
                        ensureRootIsScheduled(root);
                    };
                    thrownValue.then(lanes, lanes);
                    break a;
                case 3:
                    workInProgressSuspendedReason = 7;
                    break a;
                case 4:
                    workInProgressSuspendedReason = 5;
                    break a;
                case 7:
                    isThenableResolved(thrownValue) ? (workInProgressSuspendedReason = 0, workInProgressThrownValue = null, replaySuspendedUnitOfWork(lanes)) : (workInProgressSuspendedReason = 0, workInProgressThrownValue = null, throwAndUnwindWorkLoop(root, lanes, thrownValue, 7));
                    break;
                case 5:
                    var resource = null;
                    switch(workInProgress.tag){
                        case 26:
                            resource = workInProgress.memoizedState;
                        case 5:
                        case 27:
                            var hostFiber = workInProgress;
                            if (resource ? preloadResource(resource) : hostFiber.stateNode.complete) {
                                workInProgressSuspendedReason = 0;
                                workInProgressThrownValue = null;
                                var sibling = hostFiber.sibling;
                                if (null !== sibling) workInProgress = sibling;
                                else {
                                    var returnFiber = hostFiber.return;
                                    null !== returnFiber ? (workInProgress = returnFiber, completeUnitOfWork(returnFiber)) : workInProgress = null;
                                }
                                break b;
                            }
                    }
                    workInProgressSuspendedReason = 0;
                    workInProgressThrownValue = null;
                    throwAndUnwindWorkLoop(root, lanes, thrownValue, 5);
                    break;
                case 6:
                    workInProgressSuspendedReason = 0;
                    workInProgressThrownValue = null;
                    throwAndUnwindWorkLoop(root, lanes, thrownValue, 6);
                    break;
                case 8:
                    resetWorkInProgressStack();
                    workInProgressRootExitStatus = 6;
                    break a;
                default:
                    throw Error(formatProdErrorMessage(462));
            }
        }
        workLoopConcurrentByScheduler();
        break;
    } catch (thrownValue$186) {
        handleThrow(root, thrownValue$186);
    }
    while (1)
    lastContextDependency = currentlyRenderingFiber$1 = null;
    ReactSharedInternals.H = prevDispatcher;
    ReactSharedInternals.A = prevAsyncDispatcher;
    executionContext = prevExecutionContext;
    if (null !== workInProgress) return 0;
    workInProgressRoot = null;
    workInProgressRootRenderLanes = 0;
    finishQueueingConcurrentUpdates();
    return workInProgressRootExitStatus;
}
function workLoopConcurrentByScheduler() {
    for(; null !== workInProgress && !shouldYield();)performUnitOfWork(workInProgress);
}
function performUnitOfWork(unitOfWork) {
    var next = beginWork(unitOfWork.alternate, unitOfWork, entangledRenderLanes);
    unitOfWork.memoizedProps = unitOfWork.pendingProps;
    null === next ? completeUnitOfWork(unitOfWork) : workInProgress = next;
}
function replaySuspendedUnitOfWork(unitOfWork) {
    var next = unitOfWork;
    var current = next.alternate;
    switch(next.tag){
        case 15:
        case 0:
            next = replayFunctionComponent(current, next, next.pendingProps, next.type, void 0, workInProgressRootRenderLanes);
            break;
        case 11:
            next = replayFunctionComponent(current, next, next.pendingProps, next.type.render, next.ref, workInProgressRootRenderLanes);
            break;
        case 5:
            resetHooksOnUnwind(next);
            var fiber = next;
            fiber === hydrationParentFiber && (isHydrating ? (popToNextHostParent(fiber), 5 === fiber.tag && null != fiber.stateNode && (nextHydratableInstance = fiber.stateNode)) : (popToNextHostParent(fiber), isHydrating = !0));
        default:
            unwindInterruptedWork(current, next), next = workInProgress = resetWorkInProgress(next, entangledRenderLanes), next = beginWork(current, next, entangledRenderLanes);
    }
    unitOfWork.memoizedProps = unitOfWork.pendingProps;
    null === next ? completeUnitOfWork(unitOfWork) : workInProgress = next;
}
function throwAndUnwindWorkLoop(root, unitOfWork, thrownValue, suspendedReason) {
    lastContextDependency = currentlyRenderingFiber$1 = null;
    resetHooksOnUnwind(unitOfWork);
    thenableState$1 = null;
    thenableIndexCounter$1 = 0;
    var returnFiber = unitOfWork.return;
    try {
        if (throwException(root, returnFiber, unitOfWork, thrownValue, workInProgressRootRenderLanes)) {
            workInProgressRootExitStatus = 1;
            logUncaughtError(root, createCapturedValueAtFiber(thrownValue, root.current));
            workInProgress = null;
            return;
        }
    } catch (error) {
        if (null !== returnFiber) throw workInProgress = returnFiber, error;
        workInProgressRootExitStatus = 1;
        logUncaughtError(root, createCapturedValueAtFiber(thrownValue, root.current));
        workInProgress = null;
        return;
    }
    if (unitOfWork.flags & 32768) {
        if (isHydrating || 1 === suspendedReason) root = !0;
        else if (workInProgressRootIsPrerendering || 0 !== (workInProgressRootRenderLanes & 536870912)) root = !1;
        else if (workInProgressRootDidSkipSuspendedSiblings = root = !0, 2 === suspendedReason || 9 === suspendedReason || 3 === suspendedReason || 6 === suspendedReason) suspendedReason = suspenseHandlerStackCursor.current, null !== suspendedReason && 13 === suspendedReason.tag && (suspendedReason.flags |= 16384);
        unwindUnitOfWork(unitOfWork, root);
    } else completeUnitOfWork(unitOfWork);
}
function completeUnitOfWork(unitOfWork) {
    var completedWork = unitOfWork;
    do {
        if (0 !== (completedWork.flags & 32768)) {
            unwindUnitOfWork(completedWork, workInProgressRootDidSkipSuspendedSiblings);
            return;
        }
        unitOfWork = completedWork.return;
        var next = completeWork(completedWork.alternate, completedWork, entangledRenderLanes);
        if (null !== next) {
            workInProgress = next;
            return;
        }
        completedWork = completedWork.sibling;
        if (null !== completedWork) {
            workInProgress = completedWork;
            return;
        }
        workInProgress = completedWork = unitOfWork;
    }while (null !== completedWork)
    0 === workInProgressRootExitStatus && (workInProgressRootExitStatus = 5);
}
function unwindUnitOfWork(unitOfWork, skipSiblings) {
    do {
        var next = unwindWork(unitOfWork.alternate, unitOfWork);
        if (null !== next) {
            next.flags &= 32767;
            workInProgress = next;
            return;
        }
        next = unitOfWork.return;
        null !== next && (next.flags |= 32768, next.subtreeFlags = 0, next.deletions = null);
        if (!skipSiblings && (unitOfWork = unitOfWork.sibling, null !== unitOfWork)) {
            workInProgress = unitOfWork;
            return;
        }
        workInProgress = unitOfWork = next;
    }while (null !== unitOfWork)
    workInProgressRootExitStatus = 6;
    workInProgress = null;
}
function completeRoot(root, finishedWork, lanes, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes, didSkipSuspendedSiblings, exitStatus, suspendedState) {
    root.cancelPendingCommit = null;
    do flushPendingEffects();
    while (0 !== pendingEffectsStatus)
    if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(327));
    if (null !== finishedWork) {
        if (finishedWork === root.current) throw Error(formatProdErrorMessage(177));
        root === workInProgressRoot && (workInProgress = workInProgressRoot = null, workInProgressRootRenderLanes = 0);
        pendingFinishedWork = finishedWork;
        pendingEffectsRoot = root;
        pendingEffectsLanes = lanes;
        pendingPassiveTransitions = transitions;
        pendingRecoverableErrors = recoverableErrors;
        commitRoot(root, finishedWork, lanes, spawnedLane, updatedLanes, suspendedRetryLanes, suspendedState);
    }
}
function commitRoot(root, finishedWork, lanes, spawnedLane, updatedLanes, suspendedRetryLanes, suspendedState) {
    var remainingLanes = finishedWork.lanes | finishedWork.childLanes;
    pendingEffectsRemainingLanes = remainingLanes;
    remainingLanes |= concurrentlyUpdatedLanes;
    markRootFinished(root, lanes, remainingLanes, spawnedLane, updatedLanes, suspendedRetryLanes);
    pendingViewTransitionEvents = null;
    (lanes & 335544064) === lanes ? (pendingTransitionTypes = claimQueuedTransitionTypes(root), spawnedLane = 10262) : (pendingTransitionTypes = null, spawnedLane = 10256);
    0 !== (finishedWork.subtreeFlags & spawnedLane) || 0 !== (finishedWork.flags & spawnedLane) ? (root.callbackNode = null, root.callbackPriority = 0, scheduleCallback$1(NormalPriority$1, function() {
        flushPassiveEffects();
        return null;
    })) : (root.callbackNode = null, root.callbackPriority = 0);
    shouldStartViewTransition = !1;
    spawnedLane = 0 !== (finishedWork.flags & 13878);
    if (0 !== (finishedWork.subtreeFlags & 13878) || spawnedLane) {
        spawnedLane = ReactSharedInternals.T;
        ReactSharedInternals.T = null;
        updatedLanes = ReactDOMSharedInternals.p;
        ReactDOMSharedInternals.p = 2;
        suspendedRetryLanes = executionContext;
        executionContext |= 4;
        try {
            commitBeforeMutationEffects(root, finishedWork, lanes);
        } finally{
            executionContext = suspendedRetryLanes, ReactDOMSharedInternals.p = updatedLanes, ReactSharedInternals.T = spawnedLane;
        }
    }
    pendingEffectsStatus = 1;
    shouldStartViewTransition ? pendingViewTransition = startViewTransition(suspendedState, root.containerInfo, pendingTransitionTypes, flushMutationEffects, flushLayoutEffects, flushAfterMutationEffects, flushSpawnedWork, flushPassiveEffects, reportViewTransitionError, null, null) : (flushMutationEffects(), flushLayoutEffects(), flushSpawnedWork());
}
function reportViewTransitionError(error) {
    if (0 !== pendingEffectsStatus) {
        var onRecoverableError = pendingEffectsRoot.onRecoverableError;
        onRecoverableError(error, {
            componentStack: null
        });
    }
}
function flushAfterMutationEffects() {
    3 === pendingEffectsStatus && (pendingEffectsStatus = 0, commitAfterMutationEffectsOnFiber(pendingFinishedWork, pendingEffectsRoot), pendingEffectsStatus = 4);
}
function flushMutationEffects() {
    if (1 === pendingEffectsStatus) {
        pendingEffectsStatus = 0;
        var root = pendingEffectsRoot, finishedWork = pendingFinishedWork, lanes = pendingEffectsLanes, rootMutationHasEffect = 0 !== (finishedWork.flags & 13878);
        if (0 !== (finishedWork.subtreeFlags & 13878) || rootMutationHasEffect) {
            rootMutationHasEffect = ReactSharedInternals.T;
            ReactSharedInternals.T = null;
            var previousPriority = ReactDOMSharedInternals.p;
            ReactDOMSharedInternals.p = 2;
            var prevExecutionContext = executionContext;
            executionContext |= 4;
            try {
                inUpdateViewTransition = rootViewTransitionAffected = !1;
                commitMutationEffectsOnFiber(finishedWork, root, lanes);
                lanes = selectionInformation;
                var curFocusedElem = getActiveElementDeep(root.containerInfo), priorFocusedElem = lanes.focusedElem, priorSelectionRange = lanes.selectionRange;
                if (curFocusedElem !== priorFocusedElem && priorFocusedElem && priorFocusedElem.ownerDocument && containsNode(priorFocusedElem.ownerDocument.documentElement, priorFocusedElem)) {
                    if (null !== priorSelectionRange && hasSelectionCapabilities(priorFocusedElem)) {
                        var start = priorSelectionRange.start, end = priorSelectionRange.end;
                        void 0 === end && (end = start);
                        if ("selectionStart" in priorFocusedElem) priorFocusedElem.selectionStart = start, priorFocusedElem.selectionEnd = Math.min(end, priorFocusedElem.value.length);
                        else {
                            var doc = priorFocusedElem.ownerDocument || document, win = doc && doc.defaultView || window;
                            if (win.getSelection) {
                                var selection = win.getSelection(), length = priorFocusedElem.textContent.length, start$jscomp$0 = Math.min(priorSelectionRange.start, length), end$jscomp$0 = void 0 === priorSelectionRange.end ? start$jscomp$0 : Math.min(priorSelectionRange.end, length);
                                !selection.extend && start$jscomp$0 > end$jscomp$0 && (curFocusedElem = end$jscomp$0, end$jscomp$0 = start$jscomp$0, start$jscomp$0 = curFocusedElem);
                                var startMarker = getNodeForCharacterOffset(priorFocusedElem, start$jscomp$0), endMarker = getNodeForCharacterOffset(priorFocusedElem, end$jscomp$0);
                                if (startMarker && endMarker && (1 !== selection.rangeCount || selection.anchorNode !== startMarker.node || selection.anchorOffset !== startMarker.offset || selection.focusNode !== endMarker.node || selection.focusOffset !== endMarker.offset)) {
                                    var range = doc.createRange();
                                    range.setStart(startMarker.node, startMarker.offset);
                                    selection.removeAllRanges();
                                    start$jscomp$0 > end$jscomp$0 ? (selection.addRange(range), selection.extend(endMarker.node, endMarker.offset)) : (range.setEnd(endMarker.node, endMarker.offset), selection.addRange(range));
                                }
                            }
                        }
                    }
                    doc = [];
                    for(selection = priorFocusedElem; selection = selection.parentNode;)1 === selection.nodeType && doc.push({
                        element: selection,
                        left: selection.scrollLeft,
                        top: selection.scrollTop
                    });
                    "function" === typeof priorFocusedElem.focus && priorFocusedElem.focus();
                    for(priorFocusedElem = 0; priorFocusedElem < doc.length; priorFocusedElem++){
                        var info = doc[priorFocusedElem];
                        info.element.scrollLeft = info.left;
                        info.element.scrollTop = info.top;
                    }
                }
                _enabled = !!eventsEnabled;
                selectionInformation = eventsEnabled = null;
            } finally{
                executionContext = prevExecutionContext, ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = rootMutationHasEffect;
            }
        }
        root.current = finishedWork;
        pendingEffectsStatus = 2;
    }
}
function flushLayoutEffects() {
    if (2 === pendingEffectsStatus) {
        pendingEffectsStatus = 0;
        var root = pendingEffectsRoot, finishedWork = pendingFinishedWork, rootHasLayoutEffect = 0 !== (finishedWork.flags & 8772);
        if (0 !== (finishedWork.subtreeFlags & 8772) || rootHasLayoutEffect) {
            rootHasLayoutEffect = ReactSharedInternals.T;
            ReactSharedInternals.T = null;
            var previousPriority = ReactDOMSharedInternals.p;
            ReactDOMSharedInternals.p = 2;
            var prevExecutionContext = executionContext;
            executionContext |= 4;
            try {
                commitLayoutEffectOnFiber(root, finishedWork.alternate, finishedWork);
            } finally{
                executionContext = prevExecutionContext, ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = rootHasLayoutEffect;
            }
        }
        pendingEffectsStatus = 3;
    }
}
function flushSpawnedWork() {
    if (4 === pendingEffectsStatus || 3 === pendingEffectsStatus) {
        pendingEffectsStatus = 0;
        var committedViewTransition = pendingViewTransition;
        pendingViewTransition = null;
        requestPaint();
        var root = pendingEffectsRoot, finishedWork = pendingFinishedWork, lanes = pendingEffectsLanes, recoverableErrors = pendingRecoverableErrors, passiveSubtreeMask = (lanes & 335544064) === lanes ? 10262 : 10256;
        0 !== (finishedWork.subtreeFlags & passiveSubtreeMask) || 0 !== (finishedWork.flags & passiveSubtreeMask) ? pendingEffectsStatus = 5 : (pendingEffectsStatus = 0, pendingFinishedWork = pendingEffectsRoot = null, releaseRootPooledCache(root, root.pendingLanes));
        passiveSubtreeMask = root.pendingLanes;
        0 === passiveSubtreeMask && (legacyErrorBoundariesThatAlreadyFailed = null);
        lanesToEventPriority(lanes);
        finishedWork = finishedWork.stateNode;
        if (injectedHook && "function" === typeof injectedHook.onCommitFiberRoot) try {
            injectedHook.onCommitFiberRoot(rendererID, finishedWork, void 0, 128 === (finishedWork.current.flags & 128));
        } catch (err) {}
        if (null !== recoverableErrors) {
            finishedWork = ReactSharedInternals.T;
            passiveSubtreeMask = ReactDOMSharedInternals.p;
            ReactDOMSharedInternals.p = 2;
            ReactSharedInternals.T = null;
            try {
                for(var onRecoverableError = root.onRecoverableError, i = 0; i < recoverableErrors.length; i++){
                    var recoverableError = recoverableErrors[i];
                    onRecoverableError(recoverableError.value, {
                        componentStack: recoverableError.stack
                    });
                }
            } finally{
                ReactSharedInternals.T = finishedWork, ReactDOMSharedInternals.p = passiveSubtreeMask;
            }
        }
        recoverableErrors = pendingViewTransitionEvents;
        onRecoverableError = pendingTransitionTypes;
        pendingTransitionTypes = null;
        if (null !== recoverableErrors && (pendingViewTransitionEvents = null, null === onRecoverableError && (onRecoverableError = []), null !== committedViewTransition)) for(recoverableError = 0; recoverableError < recoverableErrors.length; recoverableError++)finishedWork = (0, recoverableErrors[recoverableError])(onRecoverableError), void 0 !== finishedWork && committedViewTransition.finished.finally(finishedWork);
        0 !== (pendingEffectsLanes & 3) && flushPendingEffects();
        ensureRootIsScheduled(root);
        passiveSubtreeMask = root.pendingLanes;
        0 !== (lanes & 261930) && 0 !== (passiveSubtreeMask & 42) ? root === rootWithNestedUpdates ? nestedUpdateCount++ : (nestedUpdateCount = 0, rootWithNestedUpdates = root) : (nestedUpdateCount = 0, rootWithNestedUpdates = null);
        flushSyncWorkAcrossRoots_impl(0, !1);
    }
}
function releaseRootPooledCache(root, remainingLanes) {
    0 === (root.pooledCacheLanes &= remainingLanes) && (remainingLanes = root.pooledCache, null != remainingLanes && (root.pooledCache = null, releaseCache(remainingLanes)));
}
function flushPendingEffects() {
    null !== pendingViewTransition && (pendingViewTransition.skipTransition(), pendingViewTransition = null);
    flushMutationEffects();
    flushLayoutEffects();
    flushSpawnedWork();
    return flushPassiveEffects();
}
function flushPassiveEffects() {
    if (5 !== pendingEffectsStatus) return !1;
    var root = pendingEffectsRoot, remainingLanes = pendingEffectsRemainingLanes;
    pendingEffectsRemainingLanes = 0;
    var renderPriority = lanesToEventPriority(pendingEffectsLanes), prevTransition = ReactSharedInternals.T, previousPriority = ReactDOMSharedInternals.p;
    try {
        ReactDOMSharedInternals.p = 32 > renderPriority ? 32 : renderPriority;
        ReactSharedInternals.T = null;
        renderPriority = pendingPassiveTransitions;
        pendingPassiveTransitions = null;
        var root$jscomp$0 = pendingEffectsRoot, lanes = pendingEffectsLanes;
        pendingEffectsStatus = 0;
        pendingFinishedWork = pendingEffectsRoot = null;
        pendingEffectsLanes = 0;
        if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(331));
        var prevExecutionContext = executionContext;
        executionContext |= 4;
        commitPassiveUnmountOnFiber(root$jscomp$0.current);
        commitPassiveMountOnFiber(root$jscomp$0, root$jscomp$0.current, lanes, renderPriority);
        executionContext = prevExecutionContext;
        flushSyncWorkAcrossRoots_impl(0, !1);
        if (injectedHook && "function" === typeof injectedHook.onPostCommitFiberRoot) try {
            injectedHook.onPostCommitFiberRoot(rendererID, root$jscomp$0);
        } catch (err) {}
        return !0;
    } finally{
        ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition, releaseRootPooledCache(root, remainingLanes);
    }
}
function captureCommitPhaseErrorOnRoot(rootFiber, sourceFiber, error) {
    sourceFiber = createCapturedValueAtFiber(error, sourceFiber);
    sourceFiber = createRootErrorUpdate(rootFiber.stateNode, sourceFiber, 2);
    rootFiber = enqueueUpdate(rootFiber, sourceFiber, 2);
    null !== rootFiber && (markRootUpdated$1(rootFiber, 2), ensureRootIsScheduled(rootFiber));
}
function captureCommitPhaseError(sourceFiber, nearestMountedAncestor, error) {
    if (3 === sourceFiber.tag) captureCommitPhaseErrorOnRoot(sourceFiber, sourceFiber, error);
    else for(; null !== nearestMountedAncestor;){
        if (3 === nearestMountedAncestor.tag) {
            captureCommitPhaseErrorOnRoot(nearestMountedAncestor, sourceFiber, error);
            break;
        } else if (1 === nearestMountedAncestor.tag) {
            var instance = nearestMountedAncestor.stateNode;
            if ("function" === typeof nearestMountedAncestor.type.getDerivedStateFromError || "function" === typeof instance.componentDidCatch && (null === legacyErrorBoundariesThatAlreadyFailed || !legacyErrorBoundariesThatAlreadyFailed.has(instance))) {
                sourceFiber = createCapturedValueAtFiber(error, sourceFiber);
                error = createClassErrorUpdate(2);
                instance = enqueueUpdate(nearestMountedAncestor, error, 2);
                null !== instance && (initializeClassErrorUpdate(error, instance, nearestMountedAncestor, sourceFiber), markRootUpdated$1(instance, 2), ensureRootIsScheduled(instance));
                break;
            }
        }
        nearestMountedAncestor = nearestMountedAncestor.return;
    }
}
function attachPingListener(root, wakeable, lanes) {
    var pingCache = root.pingCache;
    if (null === pingCache) {
        pingCache = root.pingCache = new PossiblyWeakMap();
        var threadIDs = new Set();
        pingCache.set(wakeable, threadIDs);
    } else threadIDs = pingCache.get(wakeable), void 0 === threadIDs && (threadIDs = new Set(), pingCache.set(wakeable, threadIDs));
    threadIDs.has(lanes) || (workInProgressRootDidAttachPingListener = !0, threadIDs.add(lanes), root = pingSuspendedRoot.bind(null, root, wakeable, lanes), wakeable.then(root, root));
}
function pingSuspendedRoot(root, wakeable, pingedLanes) {
    var pingCache = root.pingCache;
    null !== pingCache && pingCache.delete(wakeable);
    root.pingedLanes |= root.suspendedLanes & pingedLanes;
    root.warmLanes &= ~pingedLanes;
    workInProgressRoot === root && (workInProgressRootRenderLanes & pingedLanes) === pingedLanes && (4 === workInProgressRootExitStatus || 3 === workInProgressRootExitStatus && (workInProgressRootRenderLanes & 62914560) === workInProgressRootRenderLanes && 300 > now() - globalMostRecentFallbackTime ? 0 === (executionContext & 2) ? prepareFreshStack(root, 0) : workInProgressRootPingedLanes |= pingedLanes : workInProgressRootPingedLanes |= pingedLanes, workInProgressSuspendedRetryLanes === workInProgressRootRenderLanes && (workInProgressSuspendedRetryLanes = 0));
    ensureRootIsScheduled(root);
}
function retryTimedOutBoundary(boundaryFiber, retryLane) {
    0 === retryLane && (retryLane = claimNextRetryLane());
    boundaryFiber = enqueueConcurrentRenderForLane(boundaryFiber, retryLane);
    null !== boundaryFiber && (markRootUpdated$1(boundaryFiber, retryLane), ensureRootIsScheduled(boundaryFiber));
}
function retryDehydratedSuspenseBoundary(boundaryFiber) {
    var suspenseState = boundaryFiber.memoizedState, retryLane = 0;
    null !== suspenseState && (retryLane = suspenseState.retryLane);
    retryTimedOutBoundary(boundaryFiber, retryLane);
}
function resolveRetryWakeable(boundaryFiber, wakeable) {
    var retryLane = 0;
    switch(boundaryFiber.tag){
        case 31:
        case 13:
            var retryCache = boundaryFiber.stateNode;
            var suspenseState = boundaryFiber.memoizedState;
            null !== suspenseState && (retryLane = suspenseState.retryLane);
            break;
        case 19:
            retryCache = boundaryFiber.stateNode;
            break;
        case 22:
            retryCache = boundaryFiber.stateNode._retryCache;
            break;
        default:
            throw Error(formatProdErrorMessage(314));
    }
    null !== retryCache && retryCache.delete(wakeable);
    retryTimedOutBoundary(boundaryFiber, retryLane);
}
function scheduleCallback$1(priorityLevel, callback) {
    return scheduleCallback$3(priorityLevel, callback);
}
var firstScheduledRoot = null, lastScheduledRoot = null, didScheduleMicrotask = !1, mightHavePendingSyncWork = !1, isFlushingWork = !1, currentEventTransitionLane = 0;
function ensureRootIsScheduled(root) {
    root !== lastScheduledRoot && null === root.next && (null === lastScheduledRoot ? firstScheduledRoot = lastScheduledRoot = root : lastScheduledRoot = lastScheduledRoot.next = root);
    mightHavePendingSyncWork = !0;
    didScheduleMicrotask || (didScheduleMicrotask = !0, scheduleImmediateRootScheduleTask());
}
function flushSyncWorkAcrossRoots_impl(syncTransitionLanes, onlyLegacy) {
    if (!isFlushingWork && mightHavePendingSyncWork) {
        isFlushingWork = !0;
        do {
            var didPerformSomeWork = !1;
            for(var root$190 = firstScheduledRoot; null !== root$190;){
                if (!onlyLegacy) if (0 !== syncTransitionLanes) {
                    var pendingLanes = root$190.pendingLanes;
                    if (0 === pendingLanes) var JSCompiler_inline_result = 0;
                    else {
                        var suspendedLanes = root$190.suspendedLanes, pingedLanes = root$190.pingedLanes;
                        JSCompiler_inline_result = (1 << 31 - clz32(42 | syncTransitionLanes) + 1) - 1;
                        JSCompiler_inline_result &= pendingLanes & ~(suspendedLanes & ~pingedLanes);
                        JSCompiler_inline_result = JSCompiler_inline_result & 201326741 ? JSCompiler_inline_result & 201326741 | 1 : JSCompiler_inline_result ? JSCompiler_inline_result | 2 : 0;
                    }
                    0 !== JSCompiler_inline_result && (didPerformSomeWork = !0, performSyncWorkOnRoot(root$190, JSCompiler_inline_result));
                } else JSCompiler_inline_result = workInProgressRootRenderLanes, JSCompiler_inline_result = getNextLanes(root$190, root$190 === workInProgressRoot ? JSCompiler_inline_result : 0, null !== root$190.cancelPendingCommit || -1 !== root$190.timeoutHandle), 0 === (JSCompiler_inline_result & 3) || checkIfRootIsPrerendering(root$190, JSCompiler_inline_result) || (didPerformSomeWork = !0, performSyncWorkOnRoot(root$190, JSCompiler_inline_result));
                root$190 = root$190.next;
            }
        }while (didPerformSomeWork)
        isFlushingWork = !1;
    }
}
function processRootScheduleInImmediateTask() {
    processRootScheduleInMicrotask();
}
function processRootScheduleInMicrotask() {
    mightHavePendingSyncWork = didScheduleMicrotask = !1;
    var syncTransitionLanes = 0;
    0 !== currentEventTransitionLane && shouldAttemptEagerTransition() && (syncTransitionLanes = currentEventTransitionLane);
    for(var currentTime = now(), prev = null, root = firstScheduledRoot; null !== root;){
        var next = root.next, nextLanes = scheduleTaskForRootDuringMicrotask(root, currentTime);
        if (0 === nextLanes) root.next = null, null === prev ? firstScheduledRoot = next : prev.next = next, null === next && (lastScheduledRoot = prev);
        else if (prev = root, 0 !== syncTransitionLanes || 0 !== (nextLanes & 3)) mightHavePendingSyncWork = !0;
        root = next;
    }
    0 !== pendingEffectsStatus && 5 !== pendingEffectsStatus || flushSyncWorkAcrossRoots_impl(syncTransitionLanes, !1);
    0 !== currentEventTransitionLane && (currentEventTransitionLane = 0);
}
function scheduleTaskForRootDuringMicrotask(root, currentTime) {
    for(var suspendedLanes = root.suspendedLanes, pingedLanes = root.pingedLanes, expirationTimes = root.expirationTimes, lanes = root.pendingLanes & -62914561; 0 < lanes;){
        var index$5 = 31 - clz32(lanes), lane = 1 << index$5, expirationTime = expirationTimes[index$5];
        if (-1 === expirationTime) {
            if (0 === (lane & suspendedLanes) || 0 !== (lane & pingedLanes)) expirationTimes[index$5] = computeExpirationTime(lane, currentTime);
        } else expirationTime <= currentTime && (root.expiredLanes |= lane);
        lanes &= ~lane;
    }
    currentTime = workInProgressRoot;
    suspendedLanes = workInProgressRootRenderLanes;
    suspendedLanes = getNextLanes(root, root === currentTime ? suspendedLanes : 0, null !== root.cancelPendingCommit || -1 !== root.timeoutHandle);
    pingedLanes = root.callbackNode;
    if (0 === suspendedLanes || root === currentTime && (2 === workInProgressSuspendedReason || 9 === workInProgressSuspendedReason) || null !== root.cancelPendingCommit) return null !== pingedLanes && null !== pingedLanes && cancelCallback$1(pingedLanes), root.callbackNode = null, root.callbackPriority = 0;
    if (0 === (suspendedLanes & 3) || checkIfRootIsPrerendering(root, suspendedLanes)) {
        currentTime = suspendedLanes & -suspendedLanes;
        if (currentTime === root.callbackPriority) return currentTime;
        null !== pingedLanes && cancelCallback$1(pingedLanes);
        switch(lanesToEventPriority(suspendedLanes)){
            case 2:
            case 8:
                suspendedLanes = UserBlockingPriority;
                break;
            case 32:
                suspendedLanes = NormalPriority$1;
                break;
            case 268435456:
                suspendedLanes = IdlePriority;
                break;
            default:
                suspendedLanes = NormalPriority$1;
        }
        pingedLanes = performWorkOnRootViaSchedulerTask.bind(null, root);
        suspendedLanes = scheduleCallback$3(suspendedLanes, pingedLanes);
        root.callbackPriority = currentTime;
        root.callbackNode = suspendedLanes;
        return currentTime;
    }
    null !== pingedLanes && null !== pingedLanes && cancelCallback$1(pingedLanes);
    root.callbackPriority = 2;
    root.callbackNode = null;
    return 2;
}
function performWorkOnRootViaSchedulerTask(root, didTimeout) {
    if (0 !== pendingEffectsStatus && 5 !== pendingEffectsStatus) return root.callbackNode = null, root.callbackPriority = 0, null;
    var originalCallbackNode = root.callbackNode;
    if (flushPendingEffects() && root.callbackNode !== originalCallbackNode) return null;
    var workInProgressRootRenderLanes$jscomp$0 = workInProgressRootRenderLanes;
    workInProgressRootRenderLanes$jscomp$0 = getNextLanes(root, root === workInProgressRoot ? workInProgressRootRenderLanes$jscomp$0 : 0, null !== root.cancelPendingCommit || -1 !== root.timeoutHandle);
    if (0 === workInProgressRootRenderLanes$jscomp$0) return null;
    performWorkOnRoot(root, workInProgressRootRenderLanes$jscomp$0, didTimeout);
    scheduleTaskForRootDuringMicrotask(root, now());
    return null != root.callbackNode && root.callbackNode === originalCallbackNode ? performWorkOnRootViaSchedulerTask.bind(null, root) : null;
}
function performSyncWorkOnRoot(root, lanes) {
    if (flushPendingEffects()) return null;
    performWorkOnRoot(root, lanes, !0);
}
function scheduleImmediateRootScheduleTask() {
    scheduleMicrotask(function() {
        0 !== (executionContext & 6) ? scheduleCallback$3(ImmediatePriority, processRootScheduleInImmediateTask) : processRootScheduleInMicrotask();
    });
}
function requestTransitionLane() {
    if (0 === currentEventTransitionLane) {
        var actionScopeLane = currentEntangledLane;
        0 === actionScopeLane && (actionScopeLane = nextTransitionUpdateLane, nextTransitionUpdateLane <<= 1, 0 === (nextTransitionUpdateLane & 261888) && (nextTransitionUpdateLane = 256));
        currentEventTransitionLane = actionScopeLane;
    }
    return currentEventTransitionLane;
}
function coerceFormActionProp(actionProp) {
    return null == actionProp || "symbol" === typeof actionProp || "boolean" === typeof actionProp ? null : "function" === typeof actionProp ? actionProp : sanitizeURL(actionProp);
}
function extractEvents$1(dispatchQueue, domEventName, maybeTargetInst, nativeEvent, nativeEventTarget) {
    if ("submit" === domEventName && maybeTargetInst && maybeTargetInst.stateNode === nativeEventTarget) {
        var action = coerceFormActionProp((nativeEventTarget[internalPropsKey] || null).action), submitter = nativeEvent.submitter;
        submitter && (domEventName = (domEventName = submitter[internalPropsKey] || null) ? coerceFormActionProp(domEventName.formAction) : submitter.getAttribute("formAction"), null !== domEventName && (action = domEventName, submitter = null));
        var event = new SyntheticEvent("action", "action", null, nativeEvent, nativeEventTarget);
        dispatchQueue.push({
            event: event,
            listeners: [
                {
                    instance: null,
                    listener: function() {
                        if (nativeEvent.defaultPrevented) {
                            if (0 !== currentEventTransitionLane) {
                                var formData = new FormData(nativeEventTarget, submitter);
                                startHostTransition(maybeTargetInst, {
                                    pending: !0,
                                    data: formData,
                                    method: nativeEventTarget.method,
                                    action: action
                                }, null, formData);
                            }
                        } else "function" === typeof action && (event.preventDefault(), formData = new FormData(nativeEventTarget, submitter), startHostTransition(maybeTargetInst, {
                            pending: !0,
                            data: formData,
                            method: nativeEventTarget.method,
                            action: action
                        }, action, formData));
                    },
                    currentTarget: nativeEventTarget
                }
            ]
        });
    }
}
for(var i$jscomp$inline_1667 = 0; i$jscomp$inline_1667 < simpleEventPluginEvents.length; i$jscomp$inline_1667++){
    var eventName$jscomp$inline_1668 = simpleEventPluginEvents[i$jscomp$inline_1667], domEventName$jscomp$inline_1669 = eventName$jscomp$inline_1668.toLowerCase(), capitalizedEvent$jscomp$inline_1670 = eventName$jscomp$inline_1668[0].toUpperCase() + eventName$jscomp$inline_1668.slice(1);
    registerSimpleEvent(domEventName$jscomp$inline_1669, "on" + capitalizedEvent$jscomp$inline_1670);
}
registerSimpleEvent(ANIMATION_END, "onAnimationEnd");
registerSimpleEvent(ANIMATION_ITERATION, "onAnimationIteration");
registerSimpleEvent(ANIMATION_START, "onAnimationStart");
registerSimpleEvent("dblclick", "onDoubleClick");
registerSimpleEvent("focusin", "onFocus");
registerSimpleEvent("focusout", "onBlur");
registerSimpleEvent(TRANSITION_RUN, "onTransitionRun");
registerSimpleEvent(TRANSITION_START, "onTransitionStart");
registerSimpleEvent(TRANSITION_CANCEL, "onTransitionCancel");
registerSimpleEvent(TRANSITION_END, "onTransitionEnd");
registerDirectEvent("onMouseEnter", [
    "mouseout",
    "mouseover"
]);
registerDirectEvent("onMouseLeave", [
    "mouseout",
    "mouseover"
]);
registerDirectEvent("onPointerEnter", [
    "pointerout",
    "pointerover"
]);
registerDirectEvent("onPointerLeave", [
    "pointerout",
    "pointerover"
]);
registerTwoPhaseEvent("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
registerTwoPhaseEvent("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
registerTwoPhaseEvent("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
]);
registerTwoPhaseEvent("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
registerTwoPhaseEvent("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
registerTwoPhaseEvent("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var mediaEventTypes = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), nonDelegatedEvents = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(mediaEventTypes));
function processDispatchQueue(dispatchQueue, eventSystemFlags) {
    eventSystemFlags = 0 !== (eventSystemFlags & 4);
    for(var i = 0; i < dispatchQueue.length; i++){
        var _dispatchQueue$i = dispatchQueue[i], event = _dispatchQueue$i.event;
        _dispatchQueue$i = _dispatchQueue$i.listeners;
        a: {
            var previousInstance = void 0;
            if (eventSystemFlags) for(var i$jscomp$0 = _dispatchQueue$i.length - 1; 0 <= i$jscomp$0; i$jscomp$0--){
                var _dispatchListeners$i = _dispatchQueue$i[i$jscomp$0], instance = _dispatchListeners$i.instance, currentTarget = _dispatchListeners$i.currentTarget;
                _dispatchListeners$i = _dispatchListeners$i.listener;
                if (instance !== previousInstance && event.isPropagationStopped()) break a;
                previousInstance = _dispatchListeners$i;
                event.currentTarget = currentTarget;
                try {
                    previousInstance(event);
                } catch (error) {
                    reportGlobalError(error);
                }
                event.currentTarget = null;
                previousInstance = instance;
            }
            else for(i$jscomp$0 = 0; i$jscomp$0 < _dispatchQueue$i.length; i$jscomp$0++){
                _dispatchListeners$i = _dispatchQueue$i[i$jscomp$0];
                instance = _dispatchListeners$i.instance;
                currentTarget = _dispatchListeners$i.currentTarget;
                _dispatchListeners$i = _dispatchListeners$i.listener;
                if (instance !== previousInstance && event.isPropagationStopped()) break a;
                previousInstance = _dispatchListeners$i;
                event.currentTarget = currentTarget;
                try {
                    previousInstance(event);
                } catch (error) {
                    reportGlobalError(error);
                }
                event.currentTarget = null;
                previousInstance = instance;
            }
        }
    }
}
function listenToNonDelegatedEvent(domEventName, targetElement) {
    var JSCompiler_inline_result = targetElement[internalEventHandlersKey];
    void 0 === JSCompiler_inline_result && (JSCompiler_inline_result = targetElement[internalEventHandlersKey] = new Set());
    var listenerSetKey = domEventName + "__bubble";
    JSCompiler_inline_result.has(listenerSetKey) || (addTrappedEventListener(targetElement, domEventName, 2, !1), JSCompiler_inline_result.add(listenerSetKey));
}
function listenToNativeEvent(domEventName, isCapturePhaseListener, target) {
    var eventSystemFlags = 0;
    isCapturePhaseListener && (eventSystemFlags |= 4);
    addTrappedEventListener(target, domEventName, eventSystemFlags, isCapturePhaseListener);
}
var listeningMarker = "_reactListening" + Math.random().toString(36).slice(2);
function listenToAllSupportedEvents(rootContainerElement) {
    if (!rootContainerElement[listeningMarker]) {
        rootContainerElement[listeningMarker] = !0;
        allNativeEvents.forEach(function(domEventName) {
            "selectionchange" !== domEventName && (nonDelegatedEvents.has(domEventName) || listenToNativeEvent(domEventName, !1, rootContainerElement), listenToNativeEvent(domEventName, !0, rootContainerElement));
        });
        var ownerDocument = 9 === rootContainerElement.nodeType ? rootContainerElement : rootContainerElement.ownerDocument;
        null === ownerDocument || ownerDocument[listeningMarker] || (ownerDocument[listeningMarker] = !0, listenToNativeEvent("selectionchange", !1, ownerDocument));
    }
}
function addTrappedEventListener(targetContainer, domEventName, eventSystemFlags, isCapturePhaseListener) {
    switch(getEventPriority(domEventName)){
        case 2:
            var listenerWrapper = dispatchDiscreteEvent;
            break;
        case 8:
            listenerWrapper = dispatchContinuousEvent;
            break;
        default:
            listenerWrapper = dispatchEvent;
    }
    eventSystemFlags = listenerWrapper.bind(null, domEventName, eventSystemFlags, targetContainer);
    listenerWrapper = void 0;
    !passiveBrowserEventsSupported || "touchstart" !== domEventName && "touchmove" !== domEventName && "wheel" !== domEventName || (listenerWrapper = !0);
    isCapturePhaseListener ? void 0 !== listenerWrapper ? targetContainer.addEventListener(domEventName, eventSystemFlags, {
        capture: !0,
        passive: listenerWrapper
    }) : targetContainer.addEventListener(domEventName, eventSystemFlags, !0) : void 0 !== listenerWrapper ? targetContainer.addEventListener(domEventName, eventSystemFlags, {
        passive: listenerWrapper
    }) : targetContainer.addEventListener(domEventName, eventSystemFlags, !1);
}
function dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, targetInst$jscomp$0, targetContainer) {
    var ancestorInst = targetInst$jscomp$0;
    if (0 === (eventSystemFlags & 1) && 0 === (eventSystemFlags & 2) && null !== targetInst$jscomp$0) a: for(;;){
        if (null === targetInst$jscomp$0) return;
        var nodeTag = targetInst$jscomp$0.tag;
        if (3 === nodeTag || 4 === nodeTag) {
            var container = targetInst$jscomp$0.stateNode.containerInfo;
            if (container === targetContainer) break;
            if (4 === nodeTag) for(nodeTag = targetInst$jscomp$0.return; null !== nodeTag;){
                var grandTag = nodeTag.tag;
                if ((3 === grandTag || 4 === grandTag) && nodeTag.stateNode.containerInfo === targetContainer) return;
                nodeTag = nodeTag.return;
            }
            for(; null !== container;){
                nodeTag = getClosestInstanceFromNode(container);
                if (null === nodeTag) return;
                grandTag = nodeTag.tag;
                if (5 === grandTag || 6 === grandTag || 26 === grandTag || 27 === grandTag) {
                    targetInst$jscomp$0 = ancestorInst = nodeTag;
                    continue a;
                }
                container = container.parentNode;
            }
        }
        targetInst$jscomp$0 = targetInst$jscomp$0.return;
    }
    batchedUpdates$1(function() {
        var targetInst = ancestorInst, nativeEventTarget = getEventTarget(nativeEvent), dispatchQueue = [];
        a: {
            var reactName = topLevelEventsToReactNames.get(domEventName);
            if (void 0 !== reactName) {
                var SyntheticEventCtor = SyntheticEvent, reactEventType = domEventName;
                switch(domEventName){
                    case "keypress":
                        if (0 === getEventCharCode(nativeEvent)) break a;
                    case "keydown":
                    case "keyup":
                        SyntheticEventCtor = SyntheticKeyboardEvent;
                        break;
                    case "focusin":
                        reactEventType = "focus";
                        SyntheticEventCtor = SyntheticFocusEvent;
                        break;
                    case "focusout":
                        reactEventType = "blur";
                        SyntheticEventCtor = SyntheticFocusEvent;
                        break;
                    case "beforeblur":
                    case "afterblur":
                        SyntheticEventCtor = SyntheticFocusEvent;
                        break;
                    case "click":
                        if (2 === nativeEvent.button) break a;
                    case "auxclick":
                    case "dblclick":
                    case "mousedown":
                    case "mousemove":
                    case "mouseup":
                    case "mouseout":
                    case "mouseover":
                    case "contextmenu":
                        SyntheticEventCtor = SyntheticMouseEvent;
                        break;
                    case "drag":
                    case "dragend":
                    case "dragenter":
                    case "dragexit":
                    case "dragleave":
                    case "dragover":
                    case "dragstart":
                    case "drop":
                        SyntheticEventCtor = SyntheticDragEvent;
                        break;
                    case "touchcancel":
                    case "touchend":
                    case "touchmove":
                    case "touchstart":
                        SyntheticEventCtor = SyntheticTouchEvent;
                        break;
                    case ANIMATION_END:
                    case ANIMATION_ITERATION:
                    case ANIMATION_START:
                        SyntheticEventCtor = SyntheticAnimationEvent;
                        break;
                    case TRANSITION_END:
                        SyntheticEventCtor = SyntheticTransitionEvent;
                        break;
                    case "scroll":
                    case "scrollend":
                        SyntheticEventCtor = SyntheticUIEvent;
                        break;
                    case "wheel":
                        SyntheticEventCtor = SyntheticWheelEvent;
                        break;
                    case "copy":
                    case "cut":
                    case "paste":
                        SyntheticEventCtor = SyntheticClipboardEvent;
                        break;
                    case "gotpointercapture":
                    case "lostpointercapture":
                    case "pointercancel":
                    case "pointerdown":
                    case "pointermove":
                    case "pointerout":
                    case "pointerover":
                    case "pointerup":
                        SyntheticEventCtor = SyntheticPointerEvent;
                        break;
                    case "submit":
                        SyntheticEventCtor = SyntheticSubmitEvent;
                        break;
                    case "toggle":
                    case "beforetoggle":
                        SyntheticEventCtor = SyntheticToggleEvent;
                }
                var inCapturePhase = 0 !== (eventSystemFlags & 4), accumulateTargetOnly = !inCapturePhase && ("scroll" === domEventName || "scrollend" === domEventName), reactEventName = inCapturePhase ? null !== reactName ? reactName + "Capture" : null : reactName;
                inCapturePhase = [];
                for(var instance = targetInst, lastHostComponent; null !== instance;){
                    var _instance = instance;
                    lastHostComponent = _instance.stateNode;
                    _instance = _instance.tag;
                    5 !== _instance && 26 !== _instance && 27 !== _instance || null === lastHostComponent || null === reactEventName || (_instance = getListener(instance, reactEventName), null != _instance && inCapturePhase.push(createDispatchListener(instance, _instance, lastHostComponent)));
                    if (accumulateTargetOnly) break;
                    instance = instance.return;
                }
                0 < inCapturePhase.length && (reactName = new SyntheticEventCtor(reactName, reactEventType, null, nativeEvent, nativeEventTarget), dispatchQueue.push({
                    event: reactName,
                    listeners: inCapturePhase
                }));
            }
        }
        if (0 === (eventSystemFlags & 7)) {
            a: {
                SyntheticEventCtor = "mouseover" === domEventName || "pointerover" === domEventName;
                reactName = "mouseout" === domEventName || "pointerout" === domEventName;
                if (SyntheticEventCtor && nativeEvent !== currentReplayingEvent && (reactEventType = nativeEvent.relatedTarget || nativeEvent.fromElement) && (getClosestInstanceFromNode(reactEventType) || reactEventType[internalContainerInstanceKey])) break a;
                if (reactName || SyntheticEventCtor) {
                    reactEventType = nativeEventTarget.window === nativeEventTarget ? nativeEventTarget : (SyntheticEventCtor = nativeEventTarget.ownerDocument) ? SyntheticEventCtor.defaultView || SyntheticEventCtor.parentWindow : window;
                    if (reactName) {
                        if (SyntheticEventCtor = nativeEvent.relatedTarget || nativeEvent.toElement, reactName = targetInst, SyntheticEventCtor = SyntheticEventCtor ? getClosestInstanceFromNode(SyntheticEventCtor) : null, null !== SyntheticEventCtor && (accumulateTargetOnly = getNearestMountedFiber(SyntheticEventCtor), inCapturePhase = SyntheticEventCtor.tag, SyntheticEventCtor !== accumulateTargetOnly || 5 !== inCapturePhase && 27 !== inCapturePhase && 6 !== inCapturePhase)) SyntheticEventCtor = null;
                    } else reactName = null, SyntheticEventCtor = targetInst;
                    if (reactName !== SyntheticEventCtor) {
                        inCapturePhase = SyntheticMouseEvent;
                        _instance = "onMouseLeave";
                        reactEventName = "onMouseEnter";
                        instance = "mouse";
                        if ("pointerout" === domEventName || "pointerover" === domEventName) inCapturePhase = SyntheticPointerEvent, _instance = "onPointerLeave", reactEventName = "onPointerEnter", instance = "pointer";
                        accumulateTargetOnly = null == reactName ? reactEventType : getNodeFromInstance(reactName);
                        lastHostComponent = null == SyntheticEventCtor ? reactEventType : getNodeFromInstance(SyntheticEventCtor);
                        reactEventType = new inCapturePhase(_instance, instance + "leave", reactName, nativeEvent, nativeEventTarget);
                        reactEventType.target = accumulateTargetOnly;
                        reactEventType.relatedTarget = lastHostComponent;
                        _instance = null;
                        getClosestInstanceFromNode(nativeEventTarget) === targetInst && (inCapturePhase = new inCapturePhase(reactEventName, instance + "enter", SyntheticEventCtor, nativeEvent, nativeEventTarget), inCapturePhase.target = lastHostComponent, inCapturePhase.relatedTarget = accumulateTargetOnly, _instance = inCapturePhase);
                        accumulateTargetOnly = _instance;
                        inCapturePhase = reactName && SyntheticEventCtor ? getLowestCommonAncestor(reactName, SyntheticEventCtor, getParent) : null;
                        null !== reactName && accumulateEnterLeaveListenersForEvent(dispatchQueue, reactEventType, reactName, inCapturePhase, !1);
                        null !== SyntheticEventCtor && null !== accumulateTargetOnly && accumulateEnterLeaveListenersForEvent(dispatchQueue, accumulateTargetOnly, SyntheticEventCtor, inCapturePhase, !0);
                    }
                }
            }
            a: {
                reactName = targetInst ? getNodeFromInstance(targetInst) : window;
                SyntheticEventCtor = reactName.nodeName && reactName.nodeName.toLowerCase();
                if ("select" === SyntheticEventCtor || "input" === SyntheticEventCtor && "file" === reactName.type) var getTargetInstFunc = getTargetInstForChangeEvent;
                else if (isTextInputElement(reactName)) if (isInputEventSupported) getTargetInstFunc = getTargetInstForInputOrChangeEvent;
                else {
                    getTargetInstFunc = getTargetInstForInputEventPolyfill;
                    var handleEventFunc = handleEventsForInputEventPolyfill;
                }
                else SyntheticEventCtor = reactName.nodeName, !SyntheticEventCtor || "input" !== SyntheticEventCtor.toLowerCase() || "checkbox" !== reactName.type && "radio" !== reactName.type ? targetInst && isCustomElement(targetInst.elementType) && (getTargetInstFunc = getTargetInstForChangeEvent) : getTargetInstFunc = getTargetInstForClickEvent;
                if (getTargetInstFunc && (getTargetInstFunc = getTargetInstFunc(domEventName, targetInst))) {
                    createAndAccumulateChangeEvent(dispatchQueue, getTargetInstFunc, nativeEvent, nativeEventTarget);
                    break a;
                }
                handleEventFunc && handleEventFunc(domEventName, reactName, targetInst);
            }
            handleEventFunc = targetInst ? getNodeFromInstance(targetInst) : window;
            switch(domEventName){
                case "focusin":
                    if (isTextInputElement(handleEventFunc) || "true" === handleEventFunc.contentEditable) activeElement = handleEventFunc, activeElementInst = targetInst, lastSelection = null;
                    break;
                case "focusout":
                    lastSelection = activeElementInst = activeElement = null;
                    break;
                case "mousedown":
                    mouseDown = !0;
                    break;
                case "contextmenu":
                case "mouseup":
                case "dragend":
                    mouseDown = !1;
                    constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
                    break;
                case "selectionchange":
                    if (skipSelectionChangeEvent) break;
                case "keydown":
                case "keyup":
                    constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
            }
            var fallbackData;
            if (canUseCompositionEvent) b: {
                switch(domEventName){
                    case "compositionstart":
                        var eventType = "onCompositionStart";
                        break b;
                    case "compositionend":
                        eventType = "onCompositionEnd";
                        break b;
                    case "compositionupdate":
                        eventType = "onCompositionUpdate";
                        break b;
                }
                eventType = void 0;
            }
            else isComposing ? isFallbackCompositionEnd(domEventName, nativeEvent) && (eventType = "onCompositionEnd") : "keydown" === domEventName && 229 === nativeEvent.keyCode && (eventType = "onCompositionStart");
            eventType && (useFallbackCompositionData && "ko" !== nativeEvent.locale && (isComposing || "onCompositionStart" !== eventType ? "onCompositionEnd" === eventType && isComposing && (fallbackData = getData()) : (root = nativeEventTarget, startText = "value" in root ? root.value : root.textContent, isComposing = !0)), handleEventFunc = accumulateTwoPhaseListeners(targetInst, eventType), 0 < handleEventFunc.length && (eventType = new SyntheticCompositionEvent(eventType, domEventName, null, nativeEvent, nativeEventTarget), dispatchQueue.push({
                event: eventType,
                listeners: handleEventFunc
            }), fallbackData ? eventType.data = fallbackData : (fallbackData = getDataFromCustomEvent(nativeEvent), null !== fallbackData && (eventType.data = fallbackData))));
            if (fallbackData = canUseTextInputEvent ? getNativeBeforeInputChars(domEventName, nativeEvent) : getFallbackBeforeInputChars(domEventName, nativeEvent)) eventType = accumulateTwoPhaseListeners(targetInst, "onBeforeInput"), 0 < eventType.length && (handleEventFunc = new SyntheticCompositionEvent("onBeforeInput", "beforeinput", null, nativeEvent, nativeEventTarget), dispatchQueue.push({
                event: handleEventFunc,
                listeners: eventType
            }), handleEventFunc.data = fallbackData);
            extractEvents$1(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget);
        }
        processDispatchQueue(dispatchQueue, eventSystemFlags);
    });
}
function createDispatchListener(instance, listener, currentTarget) {
    return {
        instance: instance,
        listener: listener,
        currentTarget: currentTarget
    };
}
function accumulateTwoPhaseListeners(targetFiber, reactName) {
    for(var captureName = reactName + "Capture", listeners = []; null !== targetFiber;){
        var _instance2 = targetFiber, stateNode = _instance2.stateNode;
        _instance2 = _instance2.tag;
        5 !== _instance2 && 26 !== _instance2 && 27 !== _instance2 || null === stateNode || (_instance2 = getListener(targetFiber, captureName), null != _instance2 && listeners.unshift(createDispatchListener(targetFiber, _instance2, stateNode)), _instance2 = getListener(targetFiber, reactName), null != _instance2 && listeners.push(createDispatchListener(targetFiber, _instance2, stateNode)));
        if (3 === targetFiber.tag) return listeners;
        targetFiber = targetFiber.return;
    }
    return [];
}
function getParent(inst) {
    if (null === inst) return null;
    do inst = inst.return;
    while (inst && 5 !== inst.tag && 27 !== inst.tag)
    return inst ? inst : null;
}
function accumulateEnterLeaveListenersForEvent(dispatchQueue, event, target, common, inCapturePhase) {
    for(var registrationName = event._reactName, listeners = []; null !== target && target !== common;){
        var _instance3 = target, alternate = _instance3.alternate, stateNode = _instance3.stateNode;
        _instance3 = _instance3.tag;
        if (null !== alternate && alternate === common) break;
        5 !== _instance3 && 26 !== _instance3 && 27 !== _instance3 || null === stateNode || (alternate = stateNode, inCapturePhase ? (stateNode = getListener(target, registrationName), null != stateNode && listeners.unshift(createDispatchListener(target, stateNode, alternate))) : inCapturePhase || (stateNode = getListener(target, registrationName), null != stateNode && listeners.push(createDispatchListener(target, stateNode, alternate))));
        target = target.return;
    }
    0 !== listeners.length && dispatchQueue.push({
        event: event,
        listeners: listeners
    });
}
var NORMALIZE_NEWLINES_REGEX = /\r\n?/g, NORMALIZE_NULL_AND_REPLACEMENT_REGEX = /\u0000|\uFFFD/g;
function normalizeMarkupForTextOrAttribute(markup) {
    return ("string" === typeof markup ? markup : "" + markup).replace(NORMALIZE_NEWLINES_REGEX, "\n").replace(NORMALIZE_NULL_AND_REPLACEMENT_REGEX, "");
}
function checkForUnmatchedText(serverText, clientText) {
    clientText = normalizeMarkupForTextOrAttribute(clientText);
    return normalizeMarkupForTextOrAttribute(serverText) === clientText ? !0 : !1;
}
function setProp(domElement, tag, key, value, props, prevValue) {
    switch(key){
        case "children":
            if ("string" === typeof value) "body" === tag || "textarea" === tag && "" === value || setTextContent(domElement, value);
            else if ("number" === typeof value || "bigint" === typeof value) "body" !== tag && setTextContent(domElement, "" + value);
            else return;
            break;
        case "className":
            setValueForKnownAttribute(domElement, "class", value);
            break;
        case "tabIndex":
            setValueForKnownAttribute(domElement, "tabindex", value);
            break;
        case "dir":
        case "role":
        case "viewBox":
        case "width":
        case "height":
            setValueForKnownAttribute(domElement, key, value);
            break;
        case "style":
            setValueForStyles(domElement, value, prevValue);
            return;
        case "data":
            if ("object" !== tag) {
                setValueForKnownAttribute(domElement, "data", value);
                break;
            }
        case "src":
        case "href":
            if ("" === value && ("a" !== tag || "href" !== key)) {
                domElement.removeAttribute(key);
                break;
            }
            if (null == value || "function" === typeof value || "symbol" === typeof value || "boolean" === typeof value) {
                domElement.removeAttribute(key);
                break;
            }
            value = sanitizeURL(value);
            domElement.setAttribute(key, value);
            break;
        case "action":
        case "formAction":
            if ("function" === typeof value) {
                domElement.setAttribute(key, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
                break;
            } else "function" === typeof prevValue && ("formAction" === key ? ("input" !== tag && setProp(domElement, tag, "name", props.name, props, null), setProp(domElement, tag, "formEncType", props.formEncType, props, null), setProp(domElement, tag, "formMethod", props.formMethod, props, null), setProp(domElement, tag, "formTarget", props.formTarget, props, null)) : (setProp(domElement, tag, "encType", props.encType, props, null), setProp(domElement, tag, "method", props.method, props, null), setProp(domElement, tag, "target", props.target, props, null)));
            if (null == value || "symbol" === typeof value || "boolean" === typeof value) {
                domElement.removeAttribute(key);
                break;
            }
            value = sanitizeURL(value);
            domElement.setAttribute(key, value);
            break;
        case "onClick":
            null != value && (domElement.onclick = noop$1);
            return;
        case "onScroll":
            null != value && listenToNonDelegatedEvent("scroll", domElement);
            return;
        case "onScrollEnd":
            null != value && listenToNonDelegatedEvent("scrollend", domElement);
            return;
        case "dangerouslySetInnerHTML":
            if (null != value) {
                if ("object" !== typeof value || !("__html" in value)) throw Error(formatProdErrorMessage(61));
                key = value.__html;
                if (null != key) {
                    if (null != props.children) throw Error(formatProdErrorMessage(60));
                    (null != prevValue ? prevValue.__html : void 0) !== key && (domElement.innerHTML = key);
                }
            }
            break;
        case "multiple":
            domElement.multiple = value && "function" !== typeof value && "symbol" !== typeof value;
            break;
        case "muted":
            domElement.muted = value && "function" !== typeof value && "symbol" !== typeof value;
            break;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "defaultValue":
        case "defaultChecked":
        case "innerHTML":
        case "ref":
            break;
        case "autoFocus":
            break;
        case "xlinkHref":
            if (null == value || "function" === typeof value || "boolean" === typeof value || "symbol" === typeof value) {
                domElement.removeAttribute("xlink:href");
                break;
            }
            key = sanitizeURL(value);
            domElement.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", key);
            break;
        case "contentEditable":
        case "spellCheck":
        case "draggable":
        case "value":
        case "autoReverse":
        case "externalResourcesRequired":
        case "focusable":
        case "preserveAlpha":
            null != value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, value) : domElement.removeAttribute(key);
            break;
        case "inert":
        case "allowFullScreen":
        case "async":
        case "autoPlay":
        case "controls":
        case "credentialless":
        case "default":
        case "defer":
        case "disabled":
        case "disablePictureInPicture":
        case "disableRemotePlayback":
        case "formNoValidate":
        case "hidden":
        case "loop":
        case "noModule":
        case "noValidate":
        case "open":
        case "playsInline":
        case "readOnly":
        case "required":
        case "reversed":
        case "scoped":
        case "seamless":
        case "itemScope":
            value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, "") : domElement.removeAttribute(key);
            break;
        case "capture":
        case "download":
            !0 === value ? domElement.setAttribute(key, "") : !1 !== value && null != value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, value) : domElement.removeAttribute(key);
            break;
        case "cols":
        case "rows":
        case "size":
        case "span":
            null != value && "function" !== typeof value && "symbol" !== typeof value && !isNaN(value) && 1 <= value ? domElement.setAttribute(key, value) : domElement.removeAttribute(key);
            break;
        case "rowSpan":
        case "start":
            null == value || "function" === typeof value || "symbol" === typeof value || isNaN(value) ? domElement.removeAttribute(key) : domElement.setAttribute(key, value);
            break;
        case "popover":
            listenToNonDelegatedEvent("beforetoggle", domElement);
            listenToNonDelegatedEvent("toggle", domElement);
            setValueForAttribute(domElement, "popover", value);
            break;
        case "xlinkActuate":
            setValueForNamespacedAttribute(domElement, "http://www.w3.org/1999/xlink", "xlink:actuate", value);
            break;
        case "xlinkArcrole":
            setValueForNamespacedAttribute(domElement, "http://www.w3.org/1999/xlink", "xlink:arcrole", value);
            break;
        case "xlinkRole":
            setValueForNamespacedAttribute(domElement, "http://www.w3.org/1999/xlink", "xlink:role", value);
            break;
        case "xlinkShow":
            setValueForNamespacedAttribute(domElement, "http://www.w3.org/1999/xlink", "xlink:show", value);
            break;
        case "xlinkTitle":
            setValueForNamespacedAttribute(domElement, "http://www.w3.org/1999/xlink", "xlink:title", value);
            break;
        case "xlinkType":
            setValueForNamespacedAttribute(domElement, "http://www.w3.org/1999/xlink", "xlink:type", value);
            break;
        case "xmlBase":
            setValueForNamespacedAttribute(domElement, "http://www.w3.org/XML/1998/namespace", "xml:base", value);
            break;
        case "xmlLang":
            setValueForNamespacedAttribute(domElement, "http://www.w3.org/XML/1998/namespace", "xml:lang", value);
            break;
        case "xmlSpace":
            setValueForNamespacedAttribute(domElement, "http://www.w3.org/XML/1998/namespace", "xml:space", value);
            break;
        case "is":
            setValueForAttribute(domElement, "is", value);
            break;
        case "innerText":
        case "textContent":
            return;
        default:
            if (!(2 < key.length) || "o" !== key[0] && "O" !== key[0] || "n" !== key[1] && "N" !== key[1]) key = aliases.get(key) || key, setValueForAttribute(domElement, key, value);
            else return;
    }
    viewTransitionMutationContext = !0;
}
function setPropOnCustomElement(domElement, tag, key, value, props, prevValue) {
    switch(key){
        case "style":
            setValueForStyles(domElement, value, prevValue);
            return;
        case "dangerouslySetInnerHTML":
            if (null != value) {
                if ("object" !== typeof value || !("__html" in value)) throw Error(formatProdErrorMessage(61));
                key = value.__html;
                if (null != key) {
                    if (null != props.children) throw Error(formatProdErrorMessage(60));
                    (null != prevValue ? prevValue.__html : void 0) !== key && (domElement.innerHTML = key);
                }
            }
            break;
        case "children":
            if ("string" === typeof value) setTextContent(domElement, value);
            else if ("number" === typeof value || "bigint" === typeof value) setTextContent(domElement, "" + value);
            else return;
            break;
        case "onScroll":
            null != value && listenToNonDelegatedEvent("scroll", domElement);
            return;
        case "onScrollEnd":
            null != value && listenToNonDelegatedEvent("scrollend", domElement);
            return;
        case "onClick":
            null != value && (domElement.onclick = noop$1);
            return;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "innerHTML":
        case "ref":
            return;
        case "innerText":
        case "textContent":
            return;
        default:
            if (!registrationNameDependencies.hasOwnProperty(key)) a: {
                if ("o" === key[0] && "n" === key[1] && (props = key.endsWith("Capture"), prevValue = key.slice(2, props ? key.length - 7 : void 0), tag = domElement[internalPropsKey] || null, tag = null != tag ? tag[key] : null, "function" === typeof tag && domElement.removeEventListener(prevValue, tag, props), "function" === typeof value)) {
                    "function" !== typeof tag && null !== tag && (key in domElement ? domElement[key] = null : domElement.hasAttribute(key) && domElement.removeAttribute(key));
                    domElement.addEventListener(prevValue, value, props);
                    break a;
                }
                viewTransitionMutationContext = !0;
                key in domElement ? domElement[key] = value : !0 === value ? domElement.setAttribute(key, "") : setValueForAttribute(domElement, key, value);
            }
            return;
    }
    viewTransitionMutationContext = !0;
}
function setInitialProperties(domElement, tag, props) {
    switch(tag){
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
            break;
        case "img":
            listenToNonDelegatedEvent("error", domElement);
            listenToNonDelegatedEvent("load", domElement);
            var hasSrc = !1, hasSrcSet = !1, propKey;
            for(propKey in props)if (props.hasOwnProperty(propKey)) {
                var propValue = props[propKey];
                if (null != propValue) switch(propKey){
                    case "src":
                        hasSrc = !0;
                        break;
                    case "srcSet":
                        hasSrcSet = !0;
                        break;
                    case "children":
                    case "dangerouslySetInnerHTML":
                        throw Error(formatProdErrorMessage(137, tag));
                    default:
                        setProp(domElement, tag, propKey, propValue, props, null);
                }
            }
            hasSrcSet && setProp(domElement, tag, "srcSet", props.srcSet, props, null);
            hasSrc && setProp(domElement, tag, "src", props.src, props, null);
            return;
        case "input":
            listenToNonDelegatedEvent("invalid", domElement);
            var defaultValue = propKey = propValue = hasSrcSet = null, checked = null, defaultChecked = null;
            for(hasSrc in props)if (props.hasOwnProperty(hasSrc)) {
                var propValue$204 = props[hasSrc];
                if (null != propValue$204) switch(hasSrc){
                    case "name":
                        hasSrcSet = propValue$204;
                        break;
                    case "type":
                        propValue = propValue$204;
                        break;
                    case "checked":
                        checked = propValue$204;
                        break;
                    case "defaultChecked":
                        defaultChecked = propValue$204;
                        break;
                    case "value":
                        propKey = propValue$204;
                        break;
                    case "defaultValue":
                        defaultValue = propValue$204;
                        break;
                    case "children":
                    case "dangerouslySetInnerHTML":
                        if (null != propValue$204) throw Error(formatProdErrorMessage(137, tag));
                        break;
                    default:
                        setProp(domElement, tag, hasSrc, propValue$204, props, null);
                }
            }
            initInput(domElement, propKey, defaultValue, checked, defaultChecked, propValue, hasSrcSet, !1);
            return;
        case "select":
            listenToNonDelegatedEvent("invalid", domElement);
            hasSrc = propValue = propKey = null;
            for(hasSrcSet in props)if (props.hasOwnProperty(hasSrcSet) && (defaultValue = props[hasSrcSet], null != defaultValue)) switch(hasSrcSet){
                case "value":
                    propKey = defaultValue;
                    break;
                case "defaultValue":
                    propValue = defaultValue;
                    break;
                case "multiple":
                    hasSrc = defaultValue;
                default:
                    setProp(domElement, tag, hasSrcSet, defaultValue, props, null);
            }
            tag = propKey;
            props = propValue;
            domElement.multiple = !!hasSrc;
            null != tag ? updateOptions(domElement, !!hasSrc, tag, !1) : null != props && updateOptions(domElement, !!hasSrc, props, !0);
            return;
        case "textarea":
            listenToNonDelegatedEvent("invalid", domElement);
            propKey = hasSrcSet = hasSrc = null;
            for(propValue in props)if (props.hasOwnProperty(propValue) && (defaultValue = props[propValue], null != defaultValue)) switch(propValue){
                case "value":
                    hasSrc = defaultValue;
                    break;
                case "defaultValue":
                    hasSrcSet = defaultValue;
                    break;
                case "children":
                    propKey = defaultValue;
                    break;
                case "dangerouslySetInnerHTML":
                    if (null != defaultValue) throw Error(formatProdErrorMessage(91));
                    break;
                default:
                    setProp(domElement, tag, propValue, defaultValue, props, null);
            }
            initTextarea(domElement, hasSrc, hasSrcSet, propKey);
            return;
        case "option":
            for(checked in props)if (props.hasOwnProperty(checked) && (hasSrc = props[checked], null != hasSrc)) switch(checked){
                case "selected":
                    domElement.selected = hasSrc && "function" !== typeof hasSrc && "symbol" !== typeof hasSrc;
                    break;
                default:
                    setProp(domElement, tag, checked, hasSrc, props, null);
            }
            return;
        case "dialog":
            listenToNonDelegatedEvent("beforetoggle", domElement);
            listenToNonDelegatedEvent("toggle", domElement);
            listenToNonDelegatedEvent("cancel", domElement);
            listenToNonDelegatedEvent("close", domElement);
            break;
        case "iframe":
        case "object":
            listenToNonDelegatedEvent("load", domElement);
            break;
        case "video":
        case "audio":
            for(hasSrc = 0; hasSrc < mediaEventTypes.length; hasSrc++)listenToNonDelegatedEvent(mediaEventTypes[hasSrc], domElement);
            break;
        case "image":
            listenToNonDelegatedEvent("error", domElement);
            listenToNonDelegatedEvent("load", domElement);
            break;
        case "details":
            listenToNonDelegatedEvent("toggle", domElement);
            break;
        case "embed":
        case "source":
        case "link":
            listenToNonDelegatedEvent("error", domElement), listenToNonDelegatedEvent("load", domElement);
        case "area":
        case "base":
        case "br":
        case "col":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "track":
        case "wbr":
        case "menuitem":
            for(defaultChecked in props)if (props.hasOwnProperty(defaultChecked) && (hasSrc = props[defaultChecked], null != hasSrc)) switch(defaultChecked){
                case "children":
                case "dangerouslySetInnerHTML":
                    throw Error(formatProdErrorMessage(137, tag));
                default:
                    setProp(domElement, tag, defaultChecked, hasSrc, props, null);
            }
            return;
        default:
            if (isCustomElement(tag)) {
                for(propValue$204 in props)props.hasOwnProperty(propValue$204) && (hasSrc = props[propValue$204], void 0 !== hasSrc && setPropOnCustomElement(domElement, tag, propValue$204, hasSrc, props, void 0));
                return;
            }
    }
    for(defaultValue in props)props.hasOwnProperty(defaultValue) && (hasSrc = props[defaultValue], null != hasSrc && setProp(domElement, tag, defaultValue, hasSrc, props, null));
}
var emptyProps = {};
function updateProperties(domElement, tag, lastProps, nextProps) {
    switch(tag){
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
            break;
        case "input":
            var name = null, type = null, value = null, defaultValue = null, lastDefaultValue = null, checked = null, defaultChecked = null;
            for(propKey in lastProps){
                var lastProp = lastProps[propKey];
                if (lastProps.hasOwnProperty(propKey) && null != lastProp) switch(propKey){
                    case "checked":
                        break;
                    case "value":
                        break;
                    case "defaultValue":
                        lastDefaultValue = lastProp;
                    default:
                        nextProps.hasOwnProperty(propKey) || setProp(domElement, tag, propKey, null, nextProps, lastProp);
                }
            }
            for(var propKey$221 in nextProps){
                var propKey = nextProps[propKey$221];
                lastProp = lastProps[propKey$221];
                if (nextProps.hasOwnProperty(propKey$221) && (null != propKey || null != lastProp)) switch(propKey$221){
                    case "type":
                        propKey !== lastProp && (viewTransitionMutationContext = !0);
                        type = propKey;
                        break;
                    case "name":
                        propKey !== lastProp && (viewTransitionMutationContext = !0);
                        name = propKey;
                        break;
                    case "checked":
                        propKey !== lastProp && (viewTransitionMutationContext = !0);
                        checked = propKey;
                        break;
                    case "defaultChecked":
                        propKey !== lastProp && (viewTransitionMutationContext = !0);
                        defaultChecked = propKey;
                        break;
                    case "value":
                        propKey !== lastProp && (viewTransitionMutationContext = !0);
                        value = propKey;
                        break;
                    case "defaultValue":
                        propKey !== lastProp && (viewTransitionMutationContext = !0);
                        defaultValue = propKey;
                        break;
                    case "children":
                    case "dangerouslySetInnerHTML":
                        if (null != propKey) throw Error(formatProdErrorMessage(137, tag));
                        break;
                    default:
                        propKey !== lastProp && setProp(domElement, tag, propKey$221, propKey, nextProps, lastProp);
                }
            }
            updateInput(domElement, value, defaultValue, lastDefaultValue, checked, defaultChecked, type, name);
            return;
        case "select":
            propKey = value = defaultValue = propKey$221 = null;
            for(type in lastProps)if (lastDefaultValue = lastProps[type], lastProps.hasOwnProperty(type) && null != lastDefaultValue) switch(type){
                case "value":
                    break;
                case "multiple":
                    propKey = lastDefaultValue;
                default:
                    nextProps.hasOwnProperty(type) || setProp(domElement, tag, type, null, nextProps, lastDefaultValue);
            }
            for(name in nextProps)if (type = nextProps[name], lastDefaultValue = lastProps[name], nextProps.hasOwnProperty(name) && (null != type || null != lastDefaultValue)) switch(name){
                case "value":
                    type !== lastDefaultValue && (viewTransitionMutationContext = !0);
                    propKey$221 = type;
                    break;
                case "defaultValue":
                    type !== lastDefaultValue && (viewTransitionMutationContext = !0);
                    defaultValue = type;
                    break;
                case "multiple":
                    type !== lastDefaultValue && (viewTransitionMutationContext = !0), value = type;
                default:
                    type !== lastDefaultValue && setProp(domElement, tag, name, type, nextProps, lastDefaultValue);
            }
            tag = defaultValue;
            lastProps = value;
            nextProps = propKey;
            null != propKey$221 ? updateOptions(domElement, !!lastProps, propKey$221, !1) : !!nextProps !== !!lastProps && (null != tag ? updateOptions(domElement, !!lastProps, tag, !0) : updateOptions(domElement, !!lastProps, lastProps ? [] : "", !1));
            return;
        case "textarea":
            propKey = propKey$221 = null;
            for(defaultValue in lastProps)if (name = lastProps[defaultValue], lastProps.hasOwnProperty(defaultValue) && null != name && !nextProps.hasOwnProperty(defaultValue)) switch(defaultValue){
                case "value":
                    break;
                case "children":
                    break;
                default:
                    setProp(domElement, tag, defaultValue, null, nextProps, name);
            }
            for(value in nextProps)if (name = nextProps[value], type = lastProps[value], nextProps.hasOwnProperty(value) && (null != name || null != type)) switch(value){
                case "value":
                    name !== type && (viewTransitionMutationContext = !0);
                    propKey$221 = name;
                    break;
                case "defaultValue":
                    name !== type && (viewTransitionMutationContext = !0);
                    propKey = name;
                    break;
                case "children":
                    break;
                case "dangerouslySetInnerHTML":
                    if (null != name) throw Error(formatProdErrorMessage(91));
                    break;
                default:
                    name !== type && setProp(domElement, tag, value, name, nextProps, type);
            }
            updateTextarea(domElement, propKey$221, propKey);
            return;
        case "option":
            for(var propKey$237 in lastProps)if (propKey$221 = lastProps[propKey$237], lastProps.hasOwnProperty(propKey$237) && null != propKey$221 && !nextProps.hasOwnProperty(propKey$237)) switch(propKey$237){
                case "selected":
                    domElement.selected = !1;
                    break;
                default:
                    setProp(domElement, tag, propKey$237, null, nextProps, propKey$221);
            }
            for(lastDefaultValue in nextProps)if (propKey$221 = nextProps[lastDefaultValue], propKey = lastProps[lastDefaultValue], nextProps.hasOwnProperty(lastDefaultValue) && propKey$221 !== propKey && (null != propKey$221 || null != propKey)) switch(lastDefaultValue){
                case "selected":
                    propKey$221 !== propKey && (viewTransitionMutationContext = !0);
                    domElement.selected = propKey$221 && "function" !== typeof propKey$221 && "symbol" !== typeof propKey$221;
                    break;
                default:
                    setProp(domElement, tag, lastDefaultValue, propKey$221, nextProps, propKey);
            }
            return;
        case "img":
        case "link":
        case "area":
        case "base":
        case "br":
        case "col":
        case "embed":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "source":
        case "track":
        case "wbr":
        case "menuitem":
            for(var propKey$242 in lastProps)propKey$221 = lastProps[propKey$242], lastProps.hasOwnProperty(propKey$242) && null != propKey$221 && !nextProps.hasOwnProperty(propKey$242) && setProp(domElement, tag, propKey$242, null, nextProps, propKey$221);
            for(checked in nextProps)if (propKey$221 = nextProps[checked], propKey = lastProps[checked], nextProps.hasOwnProperty(checked) && propKey$221 !== propKey && (null != propKey$221 || null != propKey)) switch(checked){
                case "children":
                case "dangerouslySetInnerHTML":
                    if (null != propKey$221) throw Error(formatProdErrorMessage(137, tag));
                    break;
                default:
                    setProp(domElement, tag, checked, propKey$221, nextProps, propKey);
            }
            return;
        default:
            if (isCustomElement(tag)) {
                for(var propKey$247 in lastProps)propKey$221 = lastProps[propKey$247], lastProps.hasOwnProperty(propKey$247) && void 0 !== propKey$221 && !nextProps.hasOwnProperty(propKey$247) && setPropOnCustomElement(domElement, tag, propKey$247, void 0, nextProps, propKey$221);
                for(defaultChecked in nextProps)propKey$221 = nextProps[defaultChecked], propKey = lastProps[defaultChecked], !nextProps.hasOwnProperty(defaultChecked) || propKey$221 === propKey || void 0 === propKey$221 && void 0 === propKey || setPropOnCustomElement(domElement, tag, defaultChecked, propKey$221, nextProps, propKey);
                return;
            }
    }
    for(var propKey$252 in lastProps)propKey$221 = lastProps[propKey$252], lastProps.hasOwnProperty(propKey$252) && null != propKey$221 && !nextProps.hasOwnProperty(propKey$252) && setProp(domElement, tag, propKey$252, null, nextProps, propKey$221);
    for(lastProp in nextProps)propKey$221 = nextProps[lastProp], propKey = lastProps[lastProp], !nextProps.hasOwnProperty(lastProp) || propKey$221 === propKey || null == propKey$221 && null == propKey || setProp(domElement, tag, lastProp, propKey$221, nextProps, propKey);
}
function isLikelyStaticResource(initiatorType) {
    switch(initiatorType){
        case "css":
        case "script":
        case "font":
        case "img":
        case "image":
        case "input":
        case "link":
            return !0;
        default:
            return !1;
    }
}
function estimateBandwidth() {
    if ("function" === typeof performance.getEntriesByType) {
        for(var count = 0, bits = 0, resourceEntries = performance.getEntriesByType("resource"), i = 0; i < resourceEntries.length; i++){
            var entry = resourceEntries[i], transferSize = entry.transferSize, initiatorType = entry.initiatorType, duration = entry.duration;
            if (transferSize && duration && isLikelyStaticResource(initiatorType)) {
                initiatorType = 0;
                duration = entry.responseEnd;
                for(i += 1; i < resourceEntries.length; i++){
                    var overlapEntry = resourceEntries[i], overlapStartTime = overlapEntry.startTime;
                    if (overlapStartTime > duration) break;
                    var overlapTransferSize = overlapEntry.transferSize, overlapInitiatorType = overlapEntry.initiatorType;
                    overlapTransferSize && isLikelyStaticResource(overlapInitiatorType) && (overlapEntry = overlapEntry.responseEnd, initiatorType += overlapTransferSize * (overlapEntry < duration ? 1 : (duration - overlapStartTime) / (overlapEntry - overlapStartTime)));
                }
                --i;
                bits += 8 * (transferSize + initiatorType) / (entry.duration / 1e3);
                count++;
                if (10 < count) break;
            }
        }
        if (0 < count) return bits / count / 1e6;
    }
    return navigator.connection && (count = navigator.connection.downlink, "number" === typeof count) ? count : 5;
}
var eventsEnabled = null, selectionInformation = null;
function getOwnerDocumentFromRootContainer(rootContainerElement) {
    return 9 === rootContainerElement.nodeType ? rootContainerElement : rootContainerElement.ownerDocument;
}
function getOwnHostContext(namespaceURI) {
    switch(namespaceURI){
        case "http://www.w3.org/2000/svg":
            return 1;
        case "http://www.w3.org/1998/Math/MathML":
            return 2;
        default:
            return 0;
    }
}
function getChildHostContextProd(parentNamespace, type) {
    if (0 === parentNamespace) switch(type){
        case "svg":
            return 1;
        case "math":
            return 2;
        default:
            return 0;
    }
    return 1 === parentNamespace && "foreignObject" === type ? 0 : parentNamespace;
}
function createHoistableInstance(type, props, rootContainerInstance, internalInstanceHandle) {
    rootContainerInstance = getOwnerDocumentFromRootContainer(rootContainerInstance).createElement(type);
    rootContainerInstance[internalInstanceKey] = internalInstanceHandle;
    rootContainerInstance[internalPropsKey] = props;
    setInitialProperties(rootContainerInstance, type, props);
    markNodeAsHoistable(rootContainerInstance);
    return rootContainerInstance;
}
function shouldSetTextContent(type, props) {
    return "textarea" === type || "noscript" === type || "string" === typeof props.children || "number" === typeof props.children || "bigint" === typeof props.children || "object" === typeof props.dangerouslySetInnerHTML && null !== props.dangerouslySetInnerHTML && null != props.dangerouslySetInnerHTML.__html;
}
var currentPopstateTransitionEvent = null;
function shouldAttemptEagerTransition() {
    var event = window.event;
    if (event && "popstate" === event.type) {
        if (event === currentPopstateTransitionEvent) return !1;
        currentPopstateTransitionEvent = event;
        return !0;
    }
    currentPopstateTransitionEvent = null;
    return !1;
}
var scheduleTimeout = "function" === typeof setTimeout ? setTimeout : void 0, cancelTimeout = "function" === typeof clearTimeout ? clearTimeout : void 0, localPromise = "function" === typeof Promise ? Promise : void 0, localRequestAnimationFrame = "function" === typeof requestAnimationFrame ? requestAnimationFrame : scheduleTimeout, scheduleMicrotask = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof localPromise ? function(callback) {
    return localPromise.resolve(null).then(callback).catch(handleErrorInNextTick);
} : scheduleTimeout;
function handleErrorInNextTick(error) {
    setTimeout(function() {
        throw error;
    });
}
function isSingletonScope(type) {
    return "head" === type;
}
function clearHydrationBoundary(parentInstance, hydrationInstance) {
    var node = hydrationInstance, depth = 0;
    do {
        var nextNode = node.nextSibling;
        parentInstance.removeChild(node);
        if (nextNode && 8 === nextNode.nodeType) if (node = nextNode.data, "/$" === node || "/&" === node) {
            if (0 === depth) {
                parentInstance.removeChild(nextNode);
                retryIfBlockedOn(hydrationInstance);
                return;
            }
            depth--;
        } else if ("$" === node || "$?" === node || "$~" === node || "$!" === node || "&" === node) depth++;
        else if ("html" === node) clearSingletonPreambleContribution(parentInstance.ownerDocument.documentElement);
        else if ("head" === node) {
            node = parentInstance.ownerDocument.head;
            clearSingletonPreambleContribution(node);
            for(var node$jscomp$0 = node.firstChild; node$jscomp$0;){
                var nextNode$jscomp$0 = node$jscomp$0.nextSibling, nodeName = node$jscomp$0.nodeName;
                node$jscomp$0[internalHoistableMarker] || "SCRIPT" === nodeName || "STYLE" === nodeName || "LINK" === nodeName && "stylesheet" === node$jscomp$0.rel.toLowerCase() || node.removeChild(node$jscomp$0);
                node$jscomp$0 = nextNode$jscomp$0;
            }
        } else "body" === node && clearSingletonPreambleContribution(parentInstance.ownerDocument.body);
        node = nextNode;
    }while (node)
    retryIfBlockedOn(hydrationInstance);
}
function hideOrUnhideDehydratedBoundary(suspenseInstance, isHidden) {
    var node = suspenseInstance;
    suspenseInstance = 0;
    do {
        var nextNode = node.nextSibling;
        1 === node.nodeType ? isHidden ? (node._stashedDisplay = node.style.display, node.style.display = "none") : (node.style.display = node._stashedDisplay || "", "" === node.getAttribute("style") && node.removeAttribute("style")) : 3 === node.nodeType && (isHidden ? (node._stashedText = node.nodeValue, node.nodeValue = "") : node.nodeValue = node._stashedText || "");
        if (nextNode && 8 === nextNode.nodeType) if (node = nextNode.data, "/$" === node) if (0 === suspenseInstance) break;
        else suspenseInstance--;
        else "$" !== node && "$?" !== node && "$~" !== node && "$!" !== node || suspenseInstance++;
        node = nextNode;
    }while (node)
}
function applyViewTransitionName(instance, name, className) {
    name = CSS.escape(name) !== name ? "r-" + btoa(name).replace(/=/g, "") : name;
    instance.style.viewTransitionName = name;
    null != className && (instance.style.viewTransitionClass = className);
    className = getComputedStyle(instance);
    if ("inline" === className.display) {
        name = instance.getClientRects();
        if (1 === name.length) var JSCompiler_inline_result = 1;
        else for(var i = JSCompiler_inline_result = 0; i < name.length; i++){
            var rect = name[i];
            0 < rect.width && 0 < rect.height && JSCompiler_inline_result++;
        }
        1 === JSCompiler_inline_result && (instance = instance.style, instance.display = 1 === name.length ? "inline-block" : "block", instance.marginTop = "-" + className.paddingTop, instance.marginBottom = "-" + className.paddingBottom);
    }
}
function restoreViewTransitionName(instance, props) {
    instance = instance.style;
    props = props.style;
    var viewTransitionName = null != props ? props.hasOwnProperty("viewTransitionName") ? props.viewTransitionName : props.hasOwnProperty("view-transition-name") ? props["view-transition-name"] : null : null;
    instance.viewTransitionName = null == viewTransitionName || "boolean" === typeof viewTransitionName ? "" : ("" + viewTransitionName).trim();
    viewTransitionName = null != props ? props.hasOwnProperty("viewTransitionClass") ? props.viewTransitionClass : props.hasOwnProperty("view-transition-class") ? props["view-transition-class"] : null : null;
    instance.viewTransitionClass = null == viewTransitionName || "boolean" === typeof viewTransitionName ? "" : ("" + viewTransitionName).trim();
    "inline-block" === instance.display && (null == props ? instance.display = instance.margin = "" : (viewTransitionName = props.display, instance.display = null == viewTransitionName || "boolean" === typeof viewTransitionName ? "" : viewTransitionName, viewTransitionName = props.margin, null != viewTransitionName ? instance.margin = viewTransitionName : (viewTransitionName = props.hasOwnProperty("marginTop") ? props.marginTop : props["margin-top"], instance.marginTop = null == viewTransitionName || "boolean" === typeof viewTransitionName ? "" : viewTransitionName, props = props.hasOwnProperty("marginBottom") ? props.marginBottom : props["margin-bottom"], instance.marginBottom = null == props || "boolean" === typeof props ? "" : props)));
}
function createMeasurement(rect, computedStyle, element) {
    element = element.ownerDocument.defaultView;
    return {
        rect: rect,
        abs: "absolute" === computedStyle.position || "fixed" === computedStyle.position,
        clip: "none" !== computedStyle.clipPath || "visible" !== computedStyle.overflow || "none" !== computedStyle.filter || "none" !== computedStyle.mask || "none" !== computedStyle.mask || "0px" !== computedStyle.borderRadius,
        view: 0 <= rect.bottom && 0 <= rect.right && rect.top <= element.innerHeight && rect.left <= element.innerWidth
    };
}
function measureInstance(instance) {
    var rect = instance.getBoundingClientRect(), computedStyle = getComputedStyle(instance);
    return createMeasurement(rect, computedStyle, instance);
}
function measureClonedInstance(instance) {
    var measuredRect = instance.getBoundingClientRect();
    measuredRect = new DOMRect(measuredRect.x + 2e4, measuredRect.y + 2e4, measuredRect.width, measuredRect.height);
    var computedStyle = getComputedStyle(instance);
    return createMeasurement(measuredRect, computedStyle, instance);
}
function forceLayout(ownerDocument) {
    return ownerDocument.documentElement.clientHeight;
}
function waitForImageToLoad(resolve) {
    this.addEventListener("load", resolve);
    this.addEventListener("error", resolve);
}
function startViewTransition(suspendedState, rootContainer, transitionTypes, mutationCallback, layoutCallback, afterMutationCallback, spawnedWorkCallback, passiveCallback, errorCallback) {
    var ownerDocument = 9 === rootContainer.nodeType ? rootContainer : rootContainer.ownerDocument;
    try {
        var transition = ownerDocument.startViewTransition({
            update: function() {
                var ownerWindow = ownerDocument.defaultView, pendingNavigation = ownerWindow.navigation && ownerWindow.navigation.transition, previousFontLoadingStatus = ownerDocument.fonts.status;
                mutationCallback();
                var blockingPromises = [];
                "loaded" === previousFontLoadingStatus && (forceLayout(ownerDocument), "loading" === ownerDocument.fonts.status && blockingPromises.push(ownerDocument.fonts.ready));
                previousFontLoadingStatus = blockingPromises.length;
                if (null !== suspendedState) for(var suspenseyImages = suspendedState.suspenseyImages, imgBytes = 0, i = 0; i < suspenseyImages.length; i++){
                    var suspenseyImage = suspenseyImages[i];
                    if (!suspenseyImage.complete) {
                        var rect = suspenseyImage.getBoundingClientRect();
                        if (0 < rect.bottom && 0 < rect.right && rect.top < ownerWindow.innerHeight && rect.left < ownerWindow.innerWidth) {
                            imgBytes += estimateImageBytes(suspenseyImage);
                            if (imgBytes > estimatedBytesWithinLimit) {
                                blockingPromises.length = previousFontLoadingStatus;
                                break;
                            }
                            suspenseyImage = new Promise(waitForImageToLoad.bind(suspenseyImage));
                            blockingPromises.push(suspenseyImage);
                        }
                    }
                }
                if (0 < blockingPromises.length) return ownerWindow = Promise.race([
                    Promise.all(blockingPromises),
                    new Promise(function(resolve) {
                        return setTimeout(resolve, 500);
                    })
                ]).then(layoutCallback, layoutCallback), (pendingNavigation ? Promise.allSettled([
                    pendingNavigation.finished,
                    ownerWindow
                ]) : ownerWindow).then(afterMutationCallback, afterMutationCallback);
                layoutCallback();
                if (pendingNavigation) return pendingNavigation.finished.then(afterMutationCallback, afterMutationCallback);
                afterMutationCallback();
            },
            types: transitionTypes
        });
        ownerDocument.__reactViewTransition = transition;
        var viewTransitionAnimations = [];
        transition.ready.then(function() {
            for(var animations = ownerDocument.documentElement.getAnimations({
                subtree: !0
            }), i = 0; i < animations.length; i++){
                var animation = animations[i], effect = animation.effect, pseudoElement = effect.pseudoElement;
                if (null != pseudoElement && pseudoElement.startsWith("::view-transition")) {
                    viewTransitionAnimations.push(animation);
                    animation = effect.getKeyframes();
                    for(var height = pseudoElement = void 0, unchangedDimensions = !0, j = 0; j < animation.length; j++){
                        var keyframe = animation[j], w = keyframe.width;
                        if (void 0 === pseudoElement) pseudoElement = w;
                        else if (pseudoElement !== w) {
                            unchangedDimensions = !1;
                            break;
                        }
                        w = keyframe.height;
                        if (void 0 === height) height = w;
                        else if (height !== w) {
                            unchangedDimensions = !1;
                            break;
                        }
                        delete keyframe.width;
                        delete keyframe.height;
                        "none" === keyframe.transform && delete keyframe.transform;
                    }
                    unchangedDimensions && void 0 !== pseudoElement && void 0 !== height && (effect.setKeyframes(animation), unchangedDimensions = getComputedStyle(effect.target, effect.pseudoElement), unchangedDimensions.width !== pseudoElement || unchangedDimensions.height !== height) && (unchangedDimensions = animation[0], unchangedDimensions.width = pseudoElement, unchangedDimensions.height = height, unchangedDimensions = animation[animation.length - 1], unchangedDimensions.width = pseudoElement, unchangedDimensions.height = height, effect.setKeyframes(animation));
                }
            }
            spawnedWorkCallback();
        }, function(error) {
            ownerDocument.__reactViewTransition === transition && (ownerDocument.__reactViewTransition = null);
            try {
                if ("object" === typeof error && null !== error) switch(error.name){
                    case "InvalidStateError":
                        if ("View transition was skipped because document visibility state is hidden." === error.message || "Skipping view transition because document visibility state has become hidden." === error.message || "Skipping view transition because viewport size changed." === error.message || "Transition was aborted because of invalid state" === error.message) error = null;
                }
                null !== error && errorCallback(error);
            } finally{
                mutationCallback(), layoutCallback(), spawnedWorkCallback();
            }
        });
        transition.finished.finally(function() {
            for(var i = 0; i < viewTransitionAnimations.length; i++)viewTransitionAnimations[i].cancel();
            ownerDocument.__reactViewTransition === transition && (ownerDocument.__reactViewTransition = null);
            passiveCallback();
        });
        return transition;
    } catch (x) {
        return mutationCallback(), layoutCallback(), spawnedWorkCallback(), null;
    }
}
function ViewTransitionPseudoElement(pseudo, name) {
    this._scope = document.documentElement;
    this._selector = "::view-transition-" + pseudo + "(" + name + ")";
}
ViewTransitionPseudoElement.prototype.animate = function(keyframes, options) {
    options = "number" === typeof options ? {
        duration: options
    } : assign({}, options);
    options.pseudoElement = this._selector;
    return this._scope.animate(keyframes, options);
};
ViewTransitionPseudoElement.prototype.getAnimations = function() {
    for(var scope = this._scope, selector = this._selector, animations = scope.getAnimations({
        subtree: !0
    }), result = [], i = 0; i < animations.length; i++){
        var effect = animations[i].effect;
        null !== effect && effect.target === scope && effect.pseudoElement === selector && result.push(animations[i]);
    }
    return result;
};
ViewTransitionPseudoElement.prototype.getComputedStyle = function() {
    return getComputedStyle(this._scope, this._selector);
};
function createViewTransitionInstance(name) {
    return {
        name: name,
        group: new ViewTransitionPseudoElement("group", name),
        imagePair: new ViewTransitionPseudoElement("image-pair", name),
        old: new ViewTransitionPseudoElement("old", name),
        new: new ViewTransitionPseudoElement("new", name)
    };
}
function FragmentInstance(fragmentFiber) {
    this._fragmentFiber = fragmentFiber;
    this._observers = this._eventListeners = null;
}
FragmentInstance.prototype.addEventListener = function(type, listener, optionsOrUseCapture) {
    var signal = null, cleanup = null;
    if (null != optionsOrUseCapture && "boolean" !== typeof optionsOrUseCapture && (signal = optionsOrUseCapture.signal || null, null !== signal && signal.aborted)) return;
    null === this._eventListeners && (this._eventListeners = []);
    var listeners = this._eventListeners;
    if (-1 === indexOfEventListener(listeners, type, listener, optionsOrUseCapture)) {
        var fragmentInstance = this, attachedListener = listener;
        null != optionsOrUseCapture && "boolean" !== typeof optionsOrUseCapture && !0 === optionsOrUseCapture.once && (attachedListener = function(event) {
            fragmentInstance.removeEventListener(type, listener, optionsOrUseCapture);
            "function" === typeof listener ? listener.call(this, event) : listener.handleEvent(event);
        });
        null !== signal && (cleanup = fragmentInstance.removeEventListener.bind(fragmentInstance, type, listener, optionsOrUseCapture), signal.addEventListener("abort", cleanup, {
            once: !0
        }), cleanup = signal.removeEventListener.bind(signal, "abort", cleanup));
        signal = getAttachOptions(optionsOrUseCapture);
        listeners.push({
            type: type,
            listener: listener,
            optionsOrUseCapture: optionsOrUseCapture,
            attachedListener: attachedListener,
            cleanup: cleanup
        });
        traverseVisibleInstancesAndTextInstances(this._fragmentFiber.child, !1, addEventListenerToChild, type, attachedListener, signal);
    }
    this._eventListeners = listeners;
};
function addEventListenerToChild(child, type, listener, optionsOrUseCapture) {
    getInstanceFromHostFiber(child).addEventListener(type, listener, optionsOrUseCapture);
    return !1;
}
FragmentInstance.prototype.removeEventListener = function(type, listener, optionsOrUseCapture) {
    var listeners = this._eventListeners;
    if (null !== listeners && (listener = indexOfEventListener(listeners, type, listener, optionsOrUseCapture), -1 !== listener)) {
        var _listeners$index = listeners[listener];
        optionsOrUseCapture = _listeners$index.attachedListener;
        var cleanup = _listeners$index.cleanup;
        _listeners$index = getAttachOptions(_listeners$index.optionsOrUseCapture);
        traverseVisibleInstancesAndTextInstances(this._fragmentFiber.child, !1, removeEventListenerFromChild, type, optionsOrUseCapture, _listeners$index);
        listeners.splice(listener, 1);
        null !== cleanup && cleanup();
    }
};
function removeEventListenerFromChild(child, type, listener, optionsOrUseCapture) {
    getInstanceFromHostFiber(child).removeEventListener(type, listener, optionsOrUseCapture);
    return !1;
}
function getAttachOptions(opts) {
    return null != opts && "boolean" !== typeof opts && (!0 === opts.once || opts.signal instanceof AbortSignal) ? {
        capture: opts.capture,
        passive: opts.passive
    } : opts;
}
function normalizeListenerOptions(opts) {
    return null == opts ? "c=0" : "boolean" === typeof opts ? "c=" + (opts ? "1" : "0") : "c=" + (opts.capture ? "1" : "0");
}
function indexOfEventListener(eventListeners, type, listener, optionsOrUseCapture) {
    if (0 === eventListeners.length) return -1;
    optionsOrUseCapture = normalizeListenerOptions(optionsOrUseCapture);
    for(var i = 0; i < eventListeners.length; i++){
        var item = eventListeners[i];
        if (item.type === type && item.listener === listener && normalizeListenerOptions(item.optionsOrUseCapture) === optionsOrUseCapture) return i;
    }
    return -1;
}
FragmentInstance.prototype.dispatchEvent = function(event) {
    var parentHostFiber = getFragmentParentInstanceOrContainerFiber(this._fragmentFiber);
    if (null === parentHostFiber) return !0;
    parentHostFiber = getInstanceFromHostFiber(parentHostFiber);
    var eventListeners = this._eventListeners;
    if (null !== eventListeners && 0 < eventListeners.length || !event.bubbles) {
        var temp = 9 === parentHostFiber.nodeType ? parentHostFiber.createComment("") : document.createTextNode("");
        if (eventListeners) for(var i = 0; i < eventListeners.length; i++){
            var _eventListeners$i = eventListeners[i];
            temp.addEventListener(_eventListeners$i.type, _eventListeners$i.attachedListener, getAttachOptions(_eventListeners$i.optionsOrUseCapture));
        }
        parentHostFiber.appendChild(temp);
        event = temp.dispatchEvent(event);
        if (eventListeners) for(i = 0; i < eventListeners.length; i++)_eventListeners$i = eventListeners[i], temp.removeEventListener(_eventListeners$i.type, _eventListeners$i.attachedListener, getAttachOptions(_eventListeners$i.optionsOrUseCapture));
        parentHostFiber.removeChild(temp);
        return event;
    }
    return parentHostFiber.dispatchEvent(event);
};
FragmentInstance.prototype.focus = function(focusOptions) {
    traverseVisibleInstancesAndTextInstances(this._fragmentFiber.child, !0, setFocusOnFiberIfFocusable, focusOptions, void 0, void 0);
};
function setFocusOnFiberIfFocusable(fiber, focusOptions) {
    if (6 === fiber.tag) return !1;
    fiber = getInstanceFromHostFiber(fiber);
    return setFocusIfFocusable(fiber, focusOptions);
}
FragmentInstance.prototype.focusLast = function(focusOptions) {
    var children = [];
    traverseVisibleInstancesAndTextInstances(this._fragmentFiber.child, !0, collectChildren, children, void 0, void 0);
    for(var i = children.length - 1; 0 <= i && !setFocusOnFiberIfFocusable(children[i], focusOptions); i--);
};
function collectChildren(child, collection) {
    collection.push(child);
    return !1;
}
FragmentInstance.prototype.blur = function() {
    var parentHostFiber = getFragmentParentInstanceOrContainerFiber(this._fragmentFiber);
    null !== parentHostFiber && (parentHostFiber = getInstanceFromHostFiber(parentHostFiber), parentHostFiber = getOwnerDocumentFromRootContainer(parentHostFiber).activeElement, null !== parentHostFiber && traverseVisibleInstancesAndTextInstances(this._fragmentFiber.child, !1, blurActiveElementWithinFragment, parentHostFiber, void 0, void 0));
};
function blurActiveElementWithinFragment(child, activeElement) {
    if (6 === child.tag) return !1;
    child = getInstanceFromHostFiber(child);
    return child === activeElement || child.contains(activeElement) ? (activeElement.blur(), !0) : !1;
}
FragmentInstance.prototype.observeUsing = function(observer) {
    null === this._observers && (this._observers = new Set());
    this._observers.add(observer);
    traverseVisibleInstancesAndTextInstances(this._fragmentFiber.child, !1, observeChild, observer, void 0, void 0);
};
function observeChild(child, observer) {
    if (6 === child.tag) return !1;
    child = getInstanceFromHostFiber(child);
    observer.observe(child);
    return !1;
}
FragmentInstance.prototype.unobserveUsing = function(observer) {
    var observers = this._observers;
    if (null !== observers && observers.has(observer)) {
        observers.delete(observer);
        traverseVisibleInstancesAndTextInstances(this._fragmentFiber.child, !1, unobserveChild, observer, void 0, void 0);
        for(var i = observers = 0; i < pendingIntersectionUnobserves.length; i++){
            var pending = pendingIntersectionUnobserves[i];
            pending.fragmentInstance === this && pending.observer === observer ? observer.unobserve(pending.instance) : pendingIntersectionUnobserves[observers++] = pending;
        }
        pendingIntersectionUnobserves.length = observers;
    }
};
function unobserveChild(child, observer) {
    if (6 === child.tag) return !1;
    child = getInstanceFromHostFiber(child);
    observer.unobserve(child);
    return !1;
}
var pendingIntersectionUnobserves = [], intersectionUnobserveScheduled = !1;
function schedulePendingIntersectionUnobserve(fragmentInstance, observer, instance) {
    pendingIntersectionUnobserves.push({
        fragmentInstance: fragmentInstance,
        observer: observer,
        instance: instance
    });
    intersectionUnobserveScheduled || (intersectionUnobserveScheduled = !0, requestPostPaintCallback(function() {
        intersectionUnobserveScheduled = !1;
        var pending = pendingIntersectionUnobserves;
        pendingIntersectionUnobserves = [];
        for(var i = 0; i < pending.length; i++){
            var item = pending[i];
            item.observer.unobserve(item.instance);
        }
    }));
}
FragmentInstance.prototype.getClientRects = function() {
    var rects = [];
    traverseVisibleInstancesAndTextInstances(this._fragmentFiber.child, !1, collectClientRects, rects, void 0, void 0);
    return rects;
};
function collectClientRects(child, rects) {
    if (6 === child.tag) {
        child = child.stateNode;
        var range = child.ownerDocument.createRange();
        range.selectNodeContents(child);
        rects.push.apply(rects, range.getClientRects());
    } else child = getInstanceFromHostFiber(child), rects.push.apply(rects, child.getClientRects());
    return !1;
}
FragmentInstance.prototype.getRootNode = function(getRootNodeOptions) {
    var parentHostFiber = getFragmentParentInstanceOrContainerFiber(this._fragmentFiber);
    return null === parentHostFiber ? this : getInstanceFromHostFiber(parentHostFiber).getRootNode(getRootNodeOptions);
};
FragmentInstance.prototype.compareDocumentPosition = function(otherNode) {
    var parentHostFiber = getFragmentParentInstanceOrContainerFiber(this._fragmentFiber);
    if (null === parentHostFiber) return Node.DOCUMENT_POSITION_DISCONNECTED;
    var children = [];
    traverseVisibleInstancesAndTextInstances(this._fragmentFiber.child, !1, collectChildren, children, void 0, void 0);
    var parentHostInstance = getInstanceFromHostFiber(parentHostFiber);
    if (0 === children.length) {
        children = parentHostInstance;
        if (fiberIsPortaledIntoHost(this._fragmentFiber)) {
            a: {
                for(parentHostFiber = this._fragmentFiber.return; null !== parentHostFiber;){
                    if (4 === parentHostFiber.tag) {
                        parentHostFiber = parentHostFiber.stateNode.containerInfo;
                        break a;
                    }
                    if (3 === parentHostFiber.tag || 5 === parentHostFiber.tag || 27 === parentHostFiber.tag) break;
                    parentHostFiber = parentHostFiber.return;
                }
                parentHostFiber = null;
            }
            null != parentHostFiber && (children = parentHostFiber);
        }
        parentHostFiber = this._fragmentFiber;
        var result = parentHostInstance = children.compareDocumentPosition(otherNode);
        children === otherNode ? result = Node.DOCUMENT_POSITION_CONTAINS : parentHostInstance & Node.DOCUMENT_POSITION_CONTAINED_BY && (children = getFragmentInstanceOrTextInstanceSiblings(parentHostFiber)[1], null === children ? result = Node.DOCUMENT_POSITION_PRECEDING : (otherNode = getInstanceFromHostFiber(children).compareDocumentPosition(otherNode), result = 0 === otherNode || otherNode & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING));
        return result |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
    }
    parentHostFiber = getInstanceFromHostFiber(children[0]);
    result = getInstanceFromHostFiber(children[children.length - 1]);
    var parentHostInstanceFromDOM = fiberIsPortaledIntoHost(this._fragmentFiber) ? parentHostFiber.parentElement : parentHostInstance;
    if (null == parentHostInstanceFromDOM) return Node.DOCUMENT_POSITION_DISCONNECTED;
    parentHostInstance = parentHostInstanceFromDOM.compareDocumentPosition(parentHostFiber) & Node.DOCUMENT_POSITION_CONTAINED_BY;
    parentHostInstanceFromDOM = parentHostInstanceFromDOM.compareDocumentPosition(result) & Node.DOCUMENT_POSITION_CONTAINED_BY;
    var firstResult = parentHostFiber.compareDocumentPosition(otherNode), lastResult = result.compareDocumentPosition(otherNode), otherNodeIsWithinFirstOrLastChild = firstResult & Node.DOCUMENT_POSITION_CONTAINED_BY || lastResult & Node.DOCUMENT_POSITION_CONTAINED_BY;
    lastResult = parentHostInstance && parentHostInstanceFromDOM && firstResult & Node.DOCUMENT_POSITION_FOLLOWING && lastResult & Node.DOCUMENT_POSITION_PRECEDING;
    parentHostFiber = parentHostInstance && parentHostFiber === otherNode || parentHostInstanceFromDOM && result === otherNode || otherNodeIsWithinFirstOrLastChild || lastResult ? Node.DOCUMENT_POSITION_CONTAINED_BY : !parentHostInstance && parentHostFiber === otherNode || !parentHostInstanceFromDOM && result === otherNode ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : firstResult;
    return parentHostFiber & Node.DOCUMENT_POSITION_DISCONNECTED || parentHostFiber & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || validateDocumentPositionWithFiberTree(parentHostFiber, this._fragmentFiber, children[0], children[children.length - 1], otherNode) ? parentHostFiber : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
};
function validateDocumentPositionWithFiberTree(documentPosition, fragmentFiber, precedingBoundaryFiber, followingBoundaryFiber, otherNode) {
    var otherFiber = getClosestInstanceFromNode(otherNode);
    if (documentPosition & Node.DOCUMENT_POSITION_CONTAINED_BY) {
        if (precedingBoundaryFiber = !!otherFiber) a: {
            for(; null !== otherFiber;){
                if (7 === otherFiber.tag && (otherFiber === fragmentFiber || otherFiber.alternate === fragmentFiber)) {
                    precedingBoundaryFiber = !0;
                    break a;
                }
                otherFiber = otherFiber.return;
            }
            precedingBoundaryFiber = !1;
        }
        return precedingBoundaryFiber;
    }
    if (documentPosition & Node.DOCUMENT_POSITION_CONTAINS) {
        if (null === otherFiber) return otherFiber = otherNode.ownerDocument, otherNode === otherFiber || otherNode === otherFiber.documentElement || otherNode === otherFiber.body;
        a: {
            otherFiber = fragmentFiber;
            for(fragmentFiber = getFragmentParentInstanceOrContainerFiber(fragmentFiber); null !== otherFiber;){
                if (!(5 !== otherFiber.tag && 3 !== otherFiber.tag && 27 !== otherFiber.tag || otherFiber !== fragmentFiber && otherFiber.alternate !== fragmentFiber)) {
                    otherFiber = !0;
                    break a;
                }
                otherFiber = otherFiber.return;
            }
            otherFiber = !1;
        }
        return otherFiber;
    }
    return documentPosition & Node.DOCUMENT_POSITION_PRECEDING ? ((fragmentFiber = !!otherFiber) && !(fragmentFiber = otherFiber === precedingBoundaryFiber) && (fragmentFiber = getLowestCommonAncestor(precedingBoundaryFiber, otherFiber, getParentForFragmentAncestors), null === fragmentFiber ? fragmentFiber = !1 : (traverseVisibleInstancesAndTextInstances(fragmentFiber, !0, isFiberPrecedingCheck, otherFiber, precedingBoundaryFiber), otherFiber = searchTarget, searchTarget = null, fragmentFiber = null !== otherFiber)), fragmentFiber) : documentPosition & Node.DOCUMENT_POSITION_FOLLOWING ? ((fragmentFiber = !!otherFiber) && !(fragmentFiber = otherFiber === followingBoundaryFiber) && (fragmentFiber = getLowestCommonAncestor(followingBoundaryFiber, otherFiber, getParentForFragmentAncestors), null === fragmentFiber ? fragmentFiber = !1 : (traverseVisibleInstancesAndTextInstances(fragmentFiber, !0, isFiberFollowingCheck, otherFiber, followingBoundaryFiber), otherFiber = searchTarget, searchBoundary = searchTarget = null, fragmentFiber = null !== otherFiber)), fragmentFiber) : !1;
}
function scrollTextNodeIntoView(textNode, resolvedAlignToTop) {
    var range = textNode.ownerDocument.createRange();
    range.selectNodeContents(textNode);
    textNode = range.getBoundingClientRect();
    window.scrollTo(window.scrollX + textNode.left, resolvedAlignToTop ? window.scrollY + textNode.top : window.scrollY + textNode.bottom - window.innerHeight);
}
FragmentInstance.prototype.scrollIntoView = function(alignToTop) {
    if ("object" === typeof alignToTop) throw Error(formatProdErrorMessage(566));
    var children = [];
    traverseVisibleInstancesAndTextInstances(this._fragmentFiber.child, !1, collectChildren, children, void 0, void 0);
    var resolvedAlignToTop = !1 !== alignToTop;
    if (0 === children.length) {
        var hostSiblings = getFragmentInstanceOrTextInstanceSiblings(this._fragmentFiber);
        hostSiblings = resolvedAlignToTop ? hostSiblings[1] || hostSiblings[0] || getFragmentParentInstanceOrContainerFiber(this._fragmentFiber) : hostSiblings[0] || hostSiblings[1];
        if (null === hostSiblings) return;
        if (6 === hostSiblings.tag) {
            alignToTop = getInstanceFromHostFiber(hostSiblings);
            scrollTextNodeIntoView(alignToTop, resolvedAlignToTop);
            return;
        }
        hostSiblings = getInstanceFromHostFiber(hostSiblings);
        if (9 !== hostSiblings.nodeType) {
            if (11 === hostSiblings.nodeType) {
                resolvedAlignToTop = "host" in hostSiblings ? hostSiblings.host : null;
                null !== resolvedAlignToTop && resolvedAlignToTop.scrollIntoView(alignToTop);
                return;
            }
            hostSiblings.scrollIntoView(alignToTop);
        }
    }
    for(hostSiblings = resolvedAlignToTop ? children.length - 1 : 0; hostSiblings !== (resolvedAlignToTop ? -1 : children.length);){
        var child = children[hostSiblings];
        6 === child.tag ? (child = getInstanceFromHostFiber(child), scrollTextNodeIntoView(child, resolvedAlignToTop)) : getInstanceFromHostFiber(child).scrollIntoView(alignToTop);
        hostSiblings += resolvedAlignToTop ? -1 : 1;
    }
};
function addFragmentHandleToFiber(child, fragmentInstance) {
    child = getInstanceFromHostFiber(child);
    addFragmentHandleToInstance(child, fragmentInstance);
    return !1;
}
function addFragmentHandleToInstance(instance, fragmentInstance) {
    null == instance.reactFragments && (instance.reactFragments = new Set());
    instance.reactFragments.add(fragmentInstance);
}
function commitNewChildToFragmentInstance(childInstance, fragmentInstance) {
    var eventListeners = fragmentInstance._eventListeners;
    if (null !== eventListeners) for(var i$jscomp$0 = 0; i$jscomp$0 < eventListeners.length; i$jscomp$0++){
        var _eventListeners$i3 = eventListeners[i$jscomp$0];
        childInstance.addEventListener(_eventListeners$i3.type, _eventListeners$i3.attachedListener, getAttachOptions(_eventListeners$i3.optionsOrUseCapture));
    }
    3 !== childInstance.nodeType && (eventListeners = fragmentInstance._observers, null !== eventListeners && eventListeners.forEach(function(observer) {
        for(var writeIdx = 0, i = 0; i < pendingIntersectionUnobserves.length; i++){
            var pending = pendingIntersectionUnobserves[i];
            if (pending.fragmentInstance !== fragmentInstance || pending.observer !== observer || pending.instance !== childInstance) pendingIntersectionUnobserves[writeIdx++] = pending;
        }
        pendingIntersectionUnobserves.length = writeIdx;
        observer.observe(childInstance);
    }), addFragmentHandleToInstance(childInstance, fragmentInstance));
}
function deleteChildFromFragmentInstance(childInstance, fragmentInstance) {
    var eventListeners = fragmentInstance._eventListeners;
    if (null !== eventListeners) for(var i = 0; i < eventListeners.length; i++){
        var _eventListeners$i4 = eventListeners[i];
        childInstance.removeEventListener(_eventListeners$i4.type, _eventListeners$i4.attachedListener, getAttachOptions(_eventListeners$i4.optionsOrUseCapture));
    }
    3 !== childInstance.nodeType && (eventListeners = fragmentInstance._observers, null !== eventListeners && eventListeners.forEach(function(observer) {
        "string" === typeof observer.rootMargin ? schedulePendingIntersectionUnobserve(fragmentInstance, observer, childInstance) : observer.unobserve(childInstance);
    }), null != childInstance.reactFragments && childInstance.reactFragments.delete(fragmentInstance));
}
function clearContainerSparingly(container) {
    var nextNode = container.firstChild;
    nextNode && 10 === nextNode.nodeType && (nextNode = nextNode.nextSibling);
    for(; nextNode;){
        var node = nextNode;
        nextNode = nextNode.nextSibling;
        switch(node.nodeName){
            case "HTML":
            case "HEAD":
            case "BODY":
                clearContainerSparingly(node);
                detachDeletedInstance(node);
                continue;
            case "SCRIPT":
            case "STYLE":
                continue;
            case "LINK":
                if ("stylesheet" === node.rel.toLowerCase()) continue;
        }
        container.removeChild(node);
    }
}
function canHydrateInstance(instance, type, props, inRootOrSingleton) {
    for(; 1 === instance.nodeType;){
        var anyProps = props;
        if (instance.nodeName.toLowerCase() !== type.toLowerCase()) {
            if (!inRootOrSingleton && ("INPUT" !== instance.nodeName || "hidden" !== instance.type)) break;
        } else if (!inRootOrSingleton) if ("input" === type && "hidden" === instance.type) {
            var name = null == anyProps.name ? null : "" + anyProps.name;
            if ("hidden" === anyProps.type && instance.getAttribute("name") === name) return instance;
        } else return instance;
        else if (!instance[internalHoistableMarker]) switch(type){
            case "meta":
                if (!instance.hasAttribute("itemprop")) break;
                return instance;
            case "link":
                name = instance.getAttribute("rel");
                if ("stylesheet" === name && instance.hasAttribute("data-precedence")) break;
                else if (name !== anyProps.rel || instance.getAttribute("href") !== (null == anyProps.href || "" === anyProps.href ? null : anyProps.href) || instance.getAttribute("crossorigin") !== (null == anyProps.crossOrigin ? null : anyProps.crossOrigin) || instance.getAttribute("title") !== (null == anyProps.title ? null : anyProps.title)) break;
                return instance;
            case "style":
                if (instance.hasAttribute("data-precedence")) break;
                return instance;
            case "script":
                name = instance.getAttribute("src");
                if ((name !== (null == anyProps.src ? null : anyProps.src) || instance.getAttribute("type") !== (null == anyProps.type ? null : anyProps.type) || instance.getAttribute("crossorigin") !== (null == anyProps.crossOrigin ? null : anyProps.crossOrigin)) && name && instance.hasAttribute("async") && !instance.hasAttribute("itemprop")) break;
                return instance;
            default:
                return instance;
        }
        instance = getNextHydratable(instance.nextSibling);
        if (null === instance) break;
    }
    return null;
}
function canHydrateTextInstance(instance, text, inRootOrSingleton) {
    if ("" === text) return null;
    for(; 3 !== instance.nodeType;){
        if ((1 !== instance.nodeType || "INPUT" !== instance.nodeName || "hidden" !== instance.type) && !inRootOrSingleton) return null;
        instance = getNextHydratable(instance.nextSibling);
        if (null === instance) return null;
    }
    return instance;
}
function canHydrateHydrationBoundary(instance, inRootOrSingleton) {
    for(; 8 !== instance.nodeType;){
        if ((1 !== instance.nodeType || "INPUT" !== instance.nodeName || "hidden" !== instance.type) && !inRootOrSingleton) return null;
        instance = getNextHydratable(instance.nextSibling);
        if (null === instance) return null;
    }
    return instance;
}
function isSuspenseInstancePending(instance) {
    return "$?" === instance.data || "$~" === instance.data;
}
function isSuspenseInstanceFallback(instance) {
    return "$!" === instance.data || "$?" === instance.data && "loading" !== instance.ownerDocument.readyState;
}
function registerSuspenseInstanceRetry(instance, callback) {
    var ownerDocument = instance.ownerDocument;
    if ("$~" === instance.data) instance._reactRetry = callback;
    else if ("$?" !== instance.data || "loading" !== ownerDocument.readyState) callback();
    else {
        var listener = function() {
            callback();
            ownerDocument.removeEventListener("DOMContentLoaded", listener);
        };
        ownerDocument.addEventListener("DOMContentLoaded", listener);
        instance._reactRetry = listener;
    }
}
function getNextHydratable(node) {
    for(; null != node; node = node.nextSibling){
        var nodeType = node.nodeType;
        if (1 === nodeType || 3 === nodeType) break;
        if (8 === nodeType) {
            nodeType = node.data;
            if ("$" === nodeType || "$!" === nodeType || "$?" === nodeType || "$~" === nodeType || "&" === nodeType || "F!" === nodeType || "F" === nodeType) break;
            if ("/$" === nodeType || "/&" === nodeType) return null;
        }
    }
    return node;
}
var previousHydratableOnEnteringScopedSingleton = null;
function getNextHydratableInstanceAfterHydrationBoundary(hydrationInstance) {
    hydrationInstance = hydrationInstance.nextSibling;
    for(var depth = 0; hydrationInstance;){
        if (8 === hydrationInstance.nodeType) {
            var data = hydrationInstance.data;
            if ("/$" === data || "/&" === data) {
                if (0 === depth) return getNextHydratable(hydrationInstance.nextSibling);
                depth--;
            } else "$" !== data && "$!" !== data && "$?" !== data && "$~" !== data && "&" !== data || depth++;
        }
        hydrationInstance = hydrationInstance.nextSibling;
    }
    return null;
}
function getParentHydrationBoundary(targetInstance) {
    targetInstance = targetInstance.previousSibling;
    for(var depth = 0; targetInstance;){
        if (8 === targetInstance.nodeType) {
            var data = targetInstance.data;
            if ("$" === data || "$!" === data || "$?" === data || "$~" === data || "&" === data) {
                if (0 === depth) return targetInstance;
                depth--;
            } else "/$" !== data && "/&" !== data || depth++;
        }
        targetInstance = targetInstance.previousSibling;
    }
    return null;
}
function setFocusIfFocusable(node, focusOptions) {
    function handleFocus() {
        didFocus = !0;
    }
    if (node.ownerDocument.activeElement === node) return !0;
    var didFocus = !1;
    try {
        node.ownerDocument.addEventListener("focus", handleFocus, !0), (node.focus || HTMLElement.prototype.focus).call(node, focusOptions);
    } finally{
        node.ownerDocument.removeEventListener("focus", handleFocus, !0);
    }
    return didFocus;
}
function requestPostPaintCallback(callback) {
    localRequestAnimationFrame(function() {
        localRequestAnimationFrame(function(time) {
            return callback(time);
        });
    });
}
function resolveSingletonInstance(type, props, rootContainerInstance) {
    props = getOwnerDocumentFromRootContainer(rootContainerInstance);
    switch(type){
        case "html":
            type = props.documentElement;
            if (!type) throw Error(formatProdErrorMessage(452));
            return type;
        case "head":
            type = props.head;
            if (!type) throw Error(formatProdErrorMessage(453));
            return type;
        case "body":
            type = props.body;
            if (!type) throw Error(formatProdErrorMessage(454));
            return type;
        default:
            throw Error(formatProdErrorMessage(451));
    }
}
function releaseSingletonInstance(instance, type, props) {
    for(var propKey in props){
        var propValue = props[propKey];
        props.hasOwnProperty(propKey) && null != propValue && setProp(instance, type, propKey, null, emptyProps, propValue);
    }
    null != props.dangerouslySetInnerHTML && (instance.textContent = "");
    instance.onclick === noop$1 && (instance.onclick = null);
    detachDeletedInstance(instance);
}
function clearSingletonPreambleContribution(instance) {
    for(var attributes = instance.attributes; attributes.length;)instance.removeAttributeNode(attributes[0]);
    detachDeletedInstance(instance);
}
var preloadPropsMap = new Map(), preconnectsSet = new Set();
function getHoistableRoot(container) {
    if ("function" === typeof container.getRootNode) {
        var rootNode = container.getRootNode();
        if (9 === rootNode.nodeType || 11 === rootNode.nodeType) return rootNode;
    }
    return 9 === container.nodeType ? container : container.ownerDocument;
}
var previousDispatcher = ReactDOMSharedInternals.d;
ReactDOMSharedInternals.d = {
    f: flushSyncWork,
    r: requestFormReset,
    D: prefetchDNS,
    C: preconnect,
    L: preload,
    m: preloadModule,
    X: preinitScript,
    S: preinitStyle,
    M: preinitModuleScript
};
function flushSyncWork() {
    var previousWasRendering = previousDispatcher.f(), wasRendering = flushSyncWork$1();
    return previousWasRendering || wasRendering;
}
function requestFormReset(form) {
    var formInst = getInstanceFromNode(form);
    null !== formInst && 5 === formInst.tag && "form" === formInst.type ? requestFormReset$1(formInst) : previousDispatcher.r(form);
}
var globalDocument = "undefined" === typeof document ? null : document;
function preconnectAs(rel, href, crossOrigin) {
    var ownerDocument = globalDocument;
    if (ownerDocument && "string" === typeof href && href) {
        var limitedEscapedHref = escapeSelectorAttributeValueInsideDoubleQuotes(href);
        limitedEscapedHref = 'link[rel="' + rel + '"][href="' + limitedEscapedHref + '"]';
        "string" === typeof crossOrigin && (limitedEscapedHref += '[crossorigin="' + crossOrigin + '"]');
        preconnectsSet.has(limitedEscapedHref) || (preconnectsSet.add(limitedEscapedHref), rel = {
            rel: rel,
            crossOrigin: crossOrigin,
            href: href
        }, null === ownerDocument.querySelector(limitedEscapedHref) && (href = ownerDocument.createElement("link"), setInitialProperties(href, "link", rel), markNodeAsHoistable(href), ownerDocument.head.appendChild(href)));
    }
}
function prefetchDNS(href) {
    previousDispatcher.D(href);
    preconnectAs("dns-prefetch", href, null);
}
function preconnect(href, crossOrigin) {
    previousDispatcher.C(href, crossOrigin);
    preconnectAs("preconnect", href, crossOrigin);
}
function preload(href, as, options) {
    previousDispatcher.L(href, as, options);
    var ownerDocument = globalDocument;
    if (ownerDocument && href && as) {
        var preloadSelector = 'link[rel="preload"][as="' + escapeSelectorAttributeValueInsideDoubleQuotes(as) + '"]';
        "image" === as ? options && options.imageSrcSet ? (preloadSelector += '[imagesrcset="' + escapeSelectorAttributeValueInsideDoubleQuotes(options.imageSrcSet) + '"]', "string" === typeof options.imageSizes && (preloadSelector += '[imagesizes="' + escapeSelectorAttributeValueInsideDoubleQuotes(options.imageSizes) + '"]')) : preloadSelector += '[href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"]' : preloadSelector += '[href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"]';
        var key = preloadSelector;
        switch(as){
            case "style":
                key = getStyleKey(href);
                break;
            case "script":
                key = getScriptKey(href);
        }
        if (!(preloadPropsMap.has(key) || (href = assign({
            rel: "preload",
            href: "image" === as && options && options.imageSrcSet ? void 0 : href,
            as: as
        }, options), preloadPropsMap.set(key, href), null !== ownerDocument.querySelector(preloadSelector) || "style" === as && ownerDocument.querySelector(getStylesheetSelectorFromKey(key)) || "script" === as && ownerDocument.querySelector(getScriptSelectorFromKey(key))))) {
            var instance = ownerDocument.createElement("link");
            setInitialProperties(instance, "link", href);
            "style" === as && (instance[internalLoadPendingKey] = !0, instance.onload = instance.onerror = function() {
                clearPendingLoadOnNode(instance);
            });
            markNodeAsHoistable(instance);
            ownerDocument.head.appendChild(instance);
        }
    }
}
function preloadModule(href, options) {
    previousDispatcher.m(href, options);
    var ownerDocument = globalDocument;
    if (ownerDocument && href) {
        var as = options && "string" === typeof options.as ? options.as : "script", preloadSelector = 'link[rel="modulepreload"][as="' + escapeSelectorAttributeValueInsideDoubleQuotes(as) + '"][href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"]', key = preloadSelector;
        switch(as){
            case "audioworklet":
            case "paintworklet":
            case "serviceworker":
            case "sharedworker":
            case "worker":
            case "script":
                key = getScriptKey(href);
        }
        if (!preloadPropsMap.has(key) && (href = assign({
            rel: "modulepreload",
            href: href
        }, options), preloadPropsMap.set(key, href), null === ownerDocument.querySelector(preloadSelector))) {
            switch(as){
                case "audioworklet":
                case "paintworklet":
                case "serviceworker":
                case "sharedworker":
                case "worker":
                case "script":
                    if (ownerDocument.querySelector(getScriptSelectorFromKey(key))) return;
            }
            as = ownerDocument.createElement("link");
            setInitialProperties(as, "link", href);
            markNodeAsHoistable(as);
            ownerDocument.head.appendChild(as);
        }
    }
}
function preinitStyle(href, precedence, options) {
    previousDispatcher.S(href, precedence, options);
    var ownerDocument = globalDocument;
    if (ownerDocument && href) {
        var styles = getResourcesFromRoot(ownerDocument).hoistableStyles, key = getStyleKey(href);
        precedence = precedence || "default";
        var resource = styles.get(key);
        if (!resource) {
            var state = {
                loading: 0,
                preload: null
            };
            if (resource = ownerDocument.querySelector(getStylesheetSelectorFromKey(key))) state.loading = 5;
            else {
                href = assign({
                    rel: "stylesheet",
                    href: href,
                    "data-precedence": precedence
                }, options);
                (options = preloadPropsMap.get(key)) && adoptPreloadPropsForStylesheet(href, options);
                var link = resource = ownerDocument.createElement("link");
                markNodeAsHoistable(link);
                setInitialProperties(link, "link", href);
                link._p = new Promise(function(resolve, reject) {
                    link.onload = resolve;
                    link.onerror = reject;
                });
                link.addEventListener("load", function() {
                    state.loading |= 1;
                });
                link.addEventListener("error", function() {
                    state.loading |= 2;
                });
                state.loading |= 4;
                insertStylesheet(resource, precedence, ownerDocument);
            }
            resource = {
                type: "stylesheet",
                instance: resource,
                count: 1,
                state: state
            };
            styles.set(key, resource);
        }
    }
}
function preinitScript(src, options) {
    previousDispatcher.X(src, options);
    var ownerDocument = globalDocument;
    if (ownerDocument && src) {
        var scripts = getResourcesFromRoot(ownerDocument).hoistableScripts, key = getScriptKey(src), resource = scripts.get(key);
        resource || (resource = ownerDocument.querySelector(getScriptSelectorFromKey(key)), resource || (src = assign({
            src: src,
            async: !0
        }, options), (options = preloadPropsMap.get(key)) && adoptPreloadPropsForScript(src, options), resource = ownerDocument.createElement("script"), markNodeAsHoistable(resource), setInitialProperties(resource, "link", src), ownerDocument.head.appendChild(resource)), resource = {
            type: "script",
            instance: resource,
            count: 1,
            state: null
        }, scripts.set(key, resource));
    }
}
function preinitModuleScript(src, options) {
    previousDispatcher.M(src, options);
    var ownerDocument = globalDocument;
    if (ownerDocument && src) {
        var scripts = getResourcesFromRoot(ownerDocument).hoistableScripts, key = getScriptKey(src), resource = scripts.get(key);
        resource || (resource = ownerDocument.querySelector(getScriptSelectorFromKey(key)), resource || (src = assign({
            src: src,
            async: !0,
            type: "module"
        }, options), (options = preloadPropsMap.get(key)) && adoptPreloadPropsForScript(src, options), resource = ownerDocument.createElement("script"), markNodeAsHoistable(resource), setInitialProperties(resource, "link", src), ownerDocument.head.appendChild(resource)), resource = {
            type: "script",
            instance: resource,
            count: 1,
            state: null
        }, scripts.set(key, resource));
    }
}
function getResource(type, currentProps, pendingProps, currentResource) {
    var JSCompiler_inline_result = (JSCompiler_inline_result = rootInstanceStackCursor.current) ? getHoistableRoot(JSCompiler_inline_result) : null;
    if (!JSCompiler_inline_result) throw Error(formatProdErrorMessage(446));
    switch(type){
        case "meta":
        case "title":
            return null;
        case "style":
            return "string" === typeof pendingProps.precedence && "string" === typeof pendingProps.href ? (pendingProps = getStyleKey(pendingProps.href), currentProps = getResourcesFromRoot(JSCompiler_inline_result).hoistableStyles, currentResource = currentProps.get(pendingProps), currentResource || (currentResource = {
                type: "style",
                instance: null,
                count: 0,
                state: null
            }, currentProps.set(pendingProps, currentResource)), currentResource) : {
                type: "void",
                instance: null,
                count: 0,
                state: null
            };
        case "link":
            if ("stylesheet" === pendingProps.rel && "string" === typeof pendingProps.href && "string" === typeof pendingProps.precedence) {
                type = getStyleKey(pendingProps.href);
                var styles$268 = getResourcesFromRoot(JSCompiler_inline_result).hoistableStyles, resource$269 = styles$268.get(type);
                resource$269 || (JSCompiler_inline_result = JSCompiler_inline_result.ownerDocument || JSCompiler_inline_result, resource$269 = {
                    type: "stylesheet",
                    instance: null,
                    count: 0,
                    state: {
                        loading: 0,
                        preload: null
                    }
                }, styles$268.set(type, resource$269), (styles$268 = JSCompiler_inline_result.querySelector(getStylesheetSelectorFromKey(type))) ? styles$268._p || (resource$269.instance = styles$268, resource$269.state.loading = 5) : (styles$268 = preloadPropsMap.get(type), styles$268 || (styles$268 = {
                    rel: "preload",
                    as: "style",
                    href: pendingProps.href,
                    crossOrigin: pendingProps.crossOrigin,
                    integrity: pendingProps.integrity,
                    media: pendingProps.media,
                    hrefLang: pendingProps.hrefLang,
                    referrerPolicy: pendingProps.referrerPolicy
                }, preloadPropsMap.set(type, styles$268)), preloadStylesheet(JSCompiler_inline_result, type, styles$268, resource$269.state)));
                if (currentProps && null === currentResource) throw Error(formatProdErrorMessage(528, ""));
                return resource$269;
            }
            if (currentProps && null !== currentResource) throw Error(formatProdErrorMessage(529, ""));
            return null;
        case "script":
            return currentProps = pendingProps.async, pendingProps = pendingProps.src, "string" === typeof pendingProps && currentProps && "function" !== typeof currentProps && "symbol" !== typeof currentProps ? (pendingProps = getScriptKey(pendingProps), currentProps = getResourcesFromRoot(JSCompiler_inline_result).hoistableScripts, currentResource = currentProps.get(pendingProps), currentResource || (currentResource = {
                type: "script",
                instance: null,
                count: 0,
                state: null
            }, currentProps.set(pendingProps, currentResource)), currentResource) : {
                type: "void",
                instance: null,
                count: 0,
                state: null
            };
        default:
            throw Error(formatProdErrorMessage(444, type));
    }
}
function getStyleKey(href) {
    return 'href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"';
}
function getStylesheetSelectorFromKey(key) {
    return 'link[rel="stylesheet"][' + key + "]";
}
function stylesheetPropsFromRawProps(rawProps) {
    return assign({}, rawProps, {
        "data-precedence": rawProps.precedence,
        precedence: null
    });
}
function preloadStylesheet(ownerDocument, key, preloadProps, state) {
    if (key = ownerDocument.querySelector('link[rel="preload"][as="style"][' + key + "]")) {
        if (!0 !== key[internalLoadPendingKey]) {
            state.loading = 1;
            return;
        }
    } else key = ownerDocument.createElement("link"), key[internalLoadPendingKey] = !0, key.onload = key.onerror = clearPendingLoadOnNode.bind(null, key), setInitialProperties(key, "link", preloadProps), markNodeAsHoistable(key), ownerDocument.head.appendChild(key);
    state.preload = key;
    key.addEventListener("load", function() {
        return state.loading |= 1;
    });
    key.addEventListener("error", function() {
        return state.loading |= 2;
    });
}
function getScriptKey(src) {
    return '[src="' + escapeSelectorAttributeValueInsideDoubleQuotes(src) + '"]';
}
function getScriptSelectorFromKey(key) {
    return "script[async]" + key;
}
function acquireResource(hoistableRoot, resource, props) {
    resource.count++;
    if (null === resource.instance) switch(resource.type){
        case "style":
            var instance = hoistableRoot.querySelector('style[data-href~="' + escapeSelectorAttributeValueInsideDoubleQuotes(props.href) + '"]');
            if (instance) return resource.instance = instance, markNodeAsHoistable(instance), instance;
            var styleProps = assign({}, props, {
                "data-href": props.href,
                "data-precedence": props.precedence,
                href: null,
                precedence: null
            });
            instance = (hoistableRoot.ownerDocument || hoistableRoot).createElement("style");
            markNodeAsHoistable(instance);
            setInitialProperties(instance, "style", styleProps);
            insertStylesheet(instance, props.precedence, hoistableRoot);
            return resource.instance = instance;
        case "stylesheet":
            styleProps = getStyleKey(props.href);
            var instance$274 = hoistableRoot.querySelector(getStylesheetSelectorFromKey(styleProps));
            if (instance$274) return resource.state.loading |= 4, resource.instance = instance$274, markNodeAsHoistable(instance$274), instance$274;
            instance = stylesheetPropsFromRawProps(props);
            (styleProps = preloadPropsMap.get(styleProps)) && adoptPreloadPropsForStylesheet(instance, styleProps);
            instance$274 = (hoistableRoot.ownerDocument || hoistableRoot).createElement("link");
            markNodeAsHoistable(instance$274);
            var linkInstance = instance$274;
            linkInstance._p = new Promise(function(resolve, reject) {
                linkInstance.onload = resolve;
                linkInstance.onerror = reject;
            });
            setInitialProperties(instance$274, "link", instance);
            resource.state.loading |= 4;
            insertStylesheet(instance$274, props.precedence, hoistableRoot);
            return resource.instance = instance$274;
        case "script":
            instance$274 = getScriptKey(props.src);
            if (styleProps = hoistableRoot.querySelector(getScriptSelectorFromKey(instance$274))) return resource.instance = styleProps, markNodeAsHoistable(styleProps), styleProps;
            instance = props;
            if (styleProps = preloadPropsMap.get(instance$274)) instance = assign({}, props), adoptPreloadPropsForScript(instance, styleProps);
            hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
            styleProps = hoistableRoot.createElement("script");
            markNodeAsHoistable(styleProps);
            setInitialProperties(styleProps, "link", instance);
            hoistableRoot.head.appendChild(styleProps);
            return resource.instance = styleProps;
        case "void":
            return null;
        default:
            throw Error(formatProdErrorMessage(443, resource.type));
    }
    else "stylesheet" === resource.type && 0 === (resource.state.loading & 4) && (instance = resource.instance, resource.state.loading |= 4, insertStylesheet(instance, props.precedence, hoistableRoot));
    return resource.instance;
}
function insertStylesheet(instance, precedence, root) {
    for(var nodes = root.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'), last = nodes.length ? nodes[nodes.length - 1] : null, prior = last, i = 0; i < nodes.length; i++){
        var node = nodes[i];
        if (node.dataset.precedence === precedence) prior = node;
        else if (prior !== last) break;
    }
    prior ? prior.parentNode.insertBefore(instance, prior.nextSibling) : (precedence = 9 === root.nodeType ? root.head : root, precedence.insertBefore(instance, precedence.firstChild));
}
function adoptPreloadPropsForStylesheet(stylesheetProps, preloadProps) {
    null == stylesheetProps.crossOrigin && (stylesheetProps.crossOrigin = preloadProps.crossOrigin);
    null == stylesheetProps.referrerPolicy && (stylesheetProps.referrerPolicy = preloadProps.referrerPolicy);
    null == stylesheetProps.title && (stylesheetProps.title = preloadProps.title);
}
function adoptPreloadPropsForScript(scriptProps, preloadProps) {
    null == scriptProps.crossOrigin && (scriptProps.crossOrigin = preloadProps.crossOrigin);
    null == scriptProps.referrerPolicy && (scriptProps.referrerPolicy = preloadProps.referrerPolicy);
    null == scriptProps.integrity && (scriptProps.integrity = preloadProps.integrity);
}
var tagCaches = null;
function getHydratableHoistableCache(type, keyAttribute, ownerDocument) {
    if (null === tagCaches) {
        var cache = new Map();
        var caches = tagCaches = new Map();
        caches.set(ownerDocument, cache);
    } else caches = tagCaches, cache = caches.get(ownerDocument), cache || (cache = new Map(), caches.set(ownerDocument, cache));
    if (cache.has(type)) return cache;
    cache.set(type, null);
    ownerDocument = ownerDocument.getElementsByTagName(type);
    for(caches = 0; caches < ownerDocument.length; caches++){
        var node = ownerDocument[caches];
        if (!(node[internalHoistableMarker] || node[internalInstanceKey] || "link" === type && "stylesheet" === node.getAttribute("rel")) && "http://www.w3.org/2000/svg" !== node.namespaceURI) {
            var nodeKey = node.getAttribute(keyAttribute) || "";
            nodeKey = type + nodeKey;
            var existing = cache.get(nodeKey);
            existing ? existing.push(node) : cache.set(nodeKey, [
                node
            ]);
        }
    }
    return cache;
}
function mountHoistable(hoistableRoot, type, instance) {
    hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
    hoistableRoot.head.insertBefore(instance, "title" === type ? hoistableRoot.querySelector("head > title") : null);
}
function isHostHoistableType(type, props, hostContext) {
    if (1 === hostContext || null != props.itemProp) return !1;
    switch(type){
        case "meta":
        case "title":
            return !0;
        case "style":
            if ("string" !== typeof props.precedence || "string" !== typeof props.href || "" === props.href) break;
            return !0;
        case "link":
            if ("string" !== typeof props.rel || "string" !== typeof props.href || "" === props.href || props.onLoad || props.onError) break;
            switch(props.rel){
                case "stylesheet":
                    return type = props.disabled, "string" === typeof props.precedence && null == type;
                default:
                    return !0;
            }
        case "script":
            if (props.async && "function" !== typeof props.async && "symbol" !== typeof props.async && !props.onLoad && !props.onError && props.src && "string" === typeof props.src) return !0;
    }
    return !1;
}
function maySuspendCommit(type, props) {
    return "img" === type && null != props.src && "" !== props.src && null == props.onLoad && "lazy" !== props.loading;
}
function preloadResource(resource) {
    return "stylesheet" === resource.type && 0 === (resource.state.loading & 3) ? !1 : !0;
}
function estimateImageBytes(instance) {
    return (instance.width || 100) * (instance.height || 100) * ("number" === typeof devicePixelRatio ? devicePixelRatio : 1) * 0.25;
}
function suspendInstance(state, instance) {
    "function" === typeof instance.decode && (state.imgCount++, instance.complete || (state.imgBytes += estimateImageBytes(instance), state.suspenseyImages.push(instance)), state = onUnsuspendImg.bind(state), instance.decode().then(state, state));
}
function suspendResource(state, hoistableRoot, resource, props) {
    if ("stylesheet" === resource.type && ("string" !== typeof props.media || !1 !== matchMedia(props.media).matches) && 0 === (resource.state.loading & 4)) {
        if (null === resource.instance) {
            var key = getStyleKey(props.href), instance = hoistableRoot.querySelector(getStylesheetSelectorFromKey(key));
            if (instance) {
                hoistableRoot = instance._p;
                null !== hoistableRoot && "object" === typeof hoistableRoot && "function" === typeof hoistableRoot.then && (state.count++, state = onUnsuspend.bind(state), hoistableRoot.then(state, state));
                resource.state.loading |= 4;
                resource.instance = instance;
                markNodeAsHoistable(instance);
                return;
            }
            instance = hoistableRoot.ownerDocument || hoistableRoot;
            props = stylesheetPropsFromRawProps(props);
            (key = preloadPropsMap.get(key)) && adoptPreloadPropsForStylesheet(props, key);
            instance = instance.createElement("link");
            markNodeAsHoistable(instance);
            var linkInstance = instance;
            linkInstance._p = new Promise(function(resolve, reject) {
                linkInstance.onload = resolve;
                linkInstance.onerror = reject;
            });
            setInitialProperties(instance, "link", props);
            resource.instance = instance;
        }
        null === state.stylesheets && (state.stylesheets = new Map());
        state.stylesheets.set(resource, hoistableRoot);
        (hoistableRoot = resource.state.preload) && 0 === (resource.state.loading & 3) && (state.count++, resource = onUnsuspend.bind(state), hoistableRoot.addEventListener("load", resource), hoistableRoot.addEventListener("error", resource));
    }
}
var estimatedBytesWithinLimit = 0;
function waitForCommitToBeReady(state, timeoutOffset) {
    state.stylesheets && 0 === state.count && insertSuspendedStylesheets(state, state.stylesheets);
    return 0 < state.count || 0 < state.imgCount ? function(commit) {
        var stylesheetTimer = setTimeout(function() {
            state.stylesheets && insertSuspendedStylesheets(state, state.stylesheets);
            if (state.unsuspend) {
                var unsuspend = state.unsuspend;
                state.unsuspend = null;
                unsuspend();
            }
        }, 6e4 + timeoutOffset);
        0 < state.imgBytes && 0 === estimatedBytesWithinLimit && (estimatedBytesWithinLimit = 62500 * estimateBandwidth());
        var imgTimer = setTimeout(function() {
            state.waitingForImages = !1;
            if (0 === state.count && (state.stylesheets && insertSuspendedStylesheets(state, state.stylesheets), state.unsuspend)) {
                var unsuspend = state.unsuspend;
                state.unsuspend = null;
                unsuspend();
            }
        }, (state.imgBytes > estimatedBytesWithinLimit ? 50 : 800) + timeoutOffset);
        state.unsuspend = commit;
        return function() {
            state.unsuspend = null;
            clearTimeout(stylesheetTimer);
            clearTimeout(imgTimer);
        };
    } : null;
}
function checkIfFullyUnsuspended(state) {
    if (0 === state.count && (0 === state.imgCount || !state.waitingForImages)) {
        if (state.stylesheets) insertSuspendedStylesheets(state, state.stylesheets);
        else if (state.unsuspend) {
            var unsuspend = state.unsuspend;
            state.unsuspend = null;
            unsuspend();
        }
    }
}
function onUnsuspend() {
    this.count--;
    checkIfFullyUnsuspended(this);
}
function onUnsuspendImg() {
    this.imgCount--;
    checkIfFullyUnsuspended(this);
}
var precedencesByRoot = null;
function insertSuspendedStylesheets(state, resources) {
    state.stylesheets = null;
    null !== state.unsuspend && (state.count++, precedencesByRoot = new Map(), resources.forEach(insertStylesheetIntoRoot, state), precedencesByRoot = null, onUnsuspend.call(state));
}
function insertStylesheetIntoRoot(root, resource) {
    if (!(resource.state.loading & 4)) {
        var precedences = precedencesByRoot.get(root);
        if (precedences) var last = precedences.get(null);
        else {
            precedences = new Map();
            precedencesByRoot.set(root, precedences);
            for(var nodes = root.querySelectorAll("link[data-precedence],style[data-precedence]"), i = 0; i < nodes.length; i++){
                var node = nodes[i];
                if ("LINK" === node.nodeName || "not all" !== node.getAttribute("media")) precedences.set(node.dataset.precedence, node), last = node;
            }
            last && precedences.set(null, last);
        }
        nodes = resource.instance;
        node = nodes.getAttribute("data-precedence");
        i = precedences.get(node) || last;
        i === last && precedences.set(null, nodes);
        precedences.set(node, nodes);
        this.count++;
        last = onUnsuspend.bind(this);
        nodes.addEventListener("load", last);
        nodes.addEventListener("error", last);
        i ? i.parentNode.insertBefore(nodes, i.nextSibling) : (root = 9 === root.nodeType ? root.head : root, root.insertBefore(nodes, root.firstChild));
        resource.state.loading |= 4;
    }
}
var HostTransitionContext = {
    $$typeof: REACT_CONTEXT_TYPE,
    Provider: null,
    Consumer: null,
    _currentValue: sharedNotPendingObject,
    _currentValue2: sharedNotPendingObject,
    _threadCount: 0
};
function FiberRootNode(containerInfo, tag, hydrate, identifierPrefix, onUncaughtError, onCaughtError, onRecoverableError, onDefaultTransitionIndicator, formState) {
    this.tag = 1;
    this.containerInfo = containerInfo;
    this.pingCache = this.current = this.pendingChildren = null;
    this.timeoutHandle = -1;
    this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null;
    this.callbackPriority = 0;
    this.expirationTimes = createLaneMap(-1);
    this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
    this.entanglements = createLaneMap(0);
    this.hiddenUpdates = createLaneMap(null);
    this.identifierPrefix = identifierPrefix;
    this.onUncaughtError = onUncaughtError;
    this.onCaughtError = onCaughtError;
    this.onRecoverableError = onRecoverableError;
    this.pooledCache = null;
    this.pooledCacheLanes = 0;
    this.formState = formState;
    this.transitionTypes = null;
    this.incompleteTransitions = new Map();
}
function createFiberRoot(containerInfo, tag, hydrate, initialChildren, hydrationCallbacks, isStrictMode, identifierPrefix, formState, onUncaughtError, onCaughtError, onRecoverableError, onDefaultTransitionIndicator) {
    containerInfo = new FiberRootNode(containerInfo, tag, hydrate, identifierPrefix, onUncaughtError, onCaughtError, onRecoverableError, onDefaultTransitionIndicator, formState);
    tag = 1;
    !0 === isStrictMode && (tag |= 24);
    isStrictMode = createFiberImplClass(3, null, null, tag);
    containerInfo.current = isStrictMode;
    isStrictMode.stateNode = containerInfo;
    tag = createCache();
    tag.refCount++;
    containerInfo.pooledCache = tag;
    tag.refCount++;
    isStrictMode.memoizedState = {
        element: initialChildren,
        isDehydrated: hydrate,
        cache: tag
    };
    initializeUpdateQueue(isStrictMode);
    return containerInfo;
}
function getContextForSubtree(parentComponent) {
    if (!parentComponent) return emptyContextObject;
    parentComponent = emptyContextObject;
    return parentComponent;
}
function updateContainerImpl(rootFiber, lane, element, container, parentComponent, callback) {
    parentComponent = getContextForSubtree(parentComponent);
    null === container.context ? container.context = parentComponent : container.pendingContext = parentComponent;
    container = createUpdate(lane);
    container.payload = {
        element: element
    };
    callback = void 0 === callback ? null : callback;
    null !== callback && (container.callback = callback);
    element = enqueueUpdate(rootFiber, container, lane);
    null !== element && (scheduleUpdateOnFiber(element, rootFiber, lane), entangleTransitions(element, rootFiber, lane));
}
function markRetryLaneImpl(fiber, retryLane) {
    fiber = fiber.memoizedState;
    if (null !== fiber && null !== fiber.dehydrated) {
        var a = fiber.retryLane;
        fiber.retryLane = 0 !== a && a < retryLane ? a : retryLane;
    }
}
function markRetryLaneIfNotHydrated(fiber, retryLane) {
    markRetryLaneImpl(fiber, retryLane);
    (fiber = fiber.alternate) && markRetryLaneImpl(fiber, retryLane);
}
function attemptContinuousHydration(fiber) {
    if (13 === fiber.tag || 31 === fiber.tag) {
        var root = enqueueConcurrentRenderForLane(fiber, 67108864);
        null !== root && scheduleUpdateOnFiber(root, fiber, 67108864);
        markRetryLaneIfNotHydrated(fiber, 67108864);
    }
}
function attemptHydrationAtCurrentPriority(fiber) {
    if (13 === fiber.tag || 31 === fiber.tag) {
        var lane = requestUpdateLane();
        lane = getBumpedLaneForHydrationByLane(lane);
        var root = enqueueConcurrentRenderForLane(fiber, lane);
        null !== root && scheduleUpdateOnFiber(root, fiber, lane);
        markRetryLaneIfNotHydrated(fiber, lane);
    }
}
var _enabled = !0;
function dispatchDiscreteEvent(domEventName, eventSystemFlags, container, nativeEvent) {
    var prevTransition = ReactSharedInternals.T;
    ReactSharedInternals.T = null;
    var previousPriority = ReactDOMSharedInternals.p;
    try {
        ReactDOMSharedInternals.p = 2, dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
    } finally{
        ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition;
    }
}
function dispatchContinuousEvent(domEventName, eventSystemFlags, container, nativeEvent) {
    var prevTransition = ReactSharedInternals.T;
    ReactSharedInternals.T = null;
    var previousPriority = ReactDOMSharedInternals.p;
    try {
        ReactDOMSharedInternals.p = 8, dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
    } finally{
        ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition;
    }
}
function dispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent) {
    if (_enabled) {
        var blockedOn = findInstanceBlockingEvent(nativeEvent);
        if (null === blockedOn) dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, return_targetInst, targetContainer), clearIfContinuousEvent(domEventName, nativeEvent);
        else if (queueIfContinuousEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent)) nativeEvent.stopPropagation();
        else if (clearIfContinuousEvent(domEventName, nativeEvent), eventSystemFlags & 4 && -1 < discreteReplayableEvents.indexOf(domEventName)) {
            for(; null !== blockedOn;){
                var fiber = getInstanceFromNode(blockedOn);
                if (null !== fiber) switch(fiber.tag){
                    case 3:
                        fiber = fiber.stateNode;
                        if (fiber.current.memoizedState.isDehydrated) {
                            var lanes = getHighestPriorityLanes(fiber.pendingLanes);
                            if (0 !== lanes) {
                                var root = fiber;
                                root.pendingLanes |= 2;
                                for(root.entangledLanes |= 2; lanes;){
                                    var lane = 1 << 31 - clz32(lanes);
                                    root.entanglements[1] |= lane;
                                    lanes &= ~lane;
                                }
                                ensureRootIsScheduled(fiber);
                                0 === (executionContext & 6) && (workInProgressRootRenderTargetTime = now() + 500, flushSyncWorkAcrossRoots_impl(0, !1));
                            }
                        }
                        break;
                    case 31:
                    case 13:
                        root = enqueueConcurrentRenderForLane(fiber, 2), null !== root && scheduleUpdateOnFiber(root, fiber, 2), flushSyncWork$1(), markRetryLaneIfNotHydrated(fiber, 2);
                }
                fiber = findInstanceBlockingEvent(nativeEvent);
                null === fiber && dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, return_targetInst, targetContainer);
                if (fiber === blockedOn) break;
                blockedOn = fiber;
            }
            null !== blockedOn && nativeEvent.stopPropagation();
        } else dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, null, targetContainer);
    }
}
function findInstanceBlockingEvent(nativeEvent) {
    nativeEvent = getEventTarget(nativeEvent);
    return findInstanceBlockingTarget(nativeEvent);
}
var return_targetInst = null;
function findInstanceBlockingTarget(targetNode) {
    return_targetInst = null;
    targetNode = getClosestInstanceFromNode(targetNode);
    if (null !== targetNode) {
        var nearestMounted = getNearestMountedFiber(targetNode);
        if (null === nearestMounted) targetNode = null;
        else {
            var tag = nearestMounted.tag;
            if (13 === tag) {
                targetNode = getSuspenseInstanceFromFiber(nearestMounted);
                if (null !== targetNode) return targetNode;
                targetNode = null;
            } else if (31 === tag) {
                targetNode = getActivityInstanceFromFiber(nearestMounted);
                if (null !== targetNode) return targetNode;
                targetNode = null;
            } else if (3 === tag) {
                if (nearestMounted.stateNode.current.memoizedState.isDehydrated) return 3 === nearestMounted.tag ? nearestMounted.stateNode.containerInfo : null;
                targetNode = null;
            } else nearestMounted !== targetNode && (targetNode = null);
        }
    }
    return_targetInst = targetNode;
    return null;
}
function getEventPriority(domEventName) {
    switch(domEventName){
        case "beforetoggle":
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "seeked":
        case "submit":
        case "toggle":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "fullscreenerror":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
            return 2;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "resize":
        case "scroll":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
            return 8;
        case "message":
            switch(getCurrentPriorityLevel()){
                case ImmediatePriority:
                    return 2;
                case UserBlockingPriority:
                    return 8;
                case NormalPriority$1:
                case LowPriority:
                    return 32;
                case IdlePriority:
                    return 268435456;
                default:
                    return 32;
            }
        default:
            return 32;
    }
}
var hasScheduledReplayAttempt = !1, queuedFocus = null, queuedDrag = null, queuedMouse = null, queuedPointers = new Map(), queuedPointerCaptures = new Map(), queuedExplicitHydrationTargets = [], discreteReplayableEvents = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
function clearIfContinuousEvent(domEventName, nativeEvent) {
    switch(domEventName){
        case "focusin":
        case "focusout":
            queuedFocus = null;
            break;
        case "dragenter":
        case "dragleave":
            queuedDrag = null;
            break;
        case "mouseover":
        case "mouseout":
            queuedMouse = null;
            break;
        case "pointerover":
        case "pointerout":
            queuedPointers.delete(nativeEvent.pointerId);
            break;
        case "gotpointercapture":
        case "lostpointercapture":
            queuedPointerCaptures.delete(nativeEvent.pointerId);
    }
}
function accumulateOrCreateContinuousQueuedReplayableEvent(existingQueuedEvent, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
    if (null === existingQueuedEvent || existingQueuedEvent.nativeEvent !== nativeEvent) return existingQueuedEvent = {
        blockedOn: blockedOn,
        domEventName: domEventName,
        eventSystemFlags: eventSystemFlags,
        nativeEvent: nativeEvent,
        targetContainers: [
            targetContainer
        ]
    }, null !== blockedOn && (blockedOn = getInstanceFromNode(blockedOn), null !== blockedOn && attemptContinuousHydration(blockedOn)), existingQueuedEvent;
    existingQueuedEvent.eventSystemFlags |= eventSystemFlags;
    blockedOn = existingQueuedEvent.targetContainers;
    null !== targetContainer && -1 === blockedOn.indexOf(targetContainer) && blockedOn.push(targetContainer);
    return existingQueuedEvent;
}
function queueIfContinuousEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
    switch(domEventName){
        case "focusin":
            return queuedFocus = accumulateOrCreateContinuousQueuedReplayableEvent(queuedFocus, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent), !0;
        case "dragenter":
            return queuedDrag = accumulateOrCreateContinuousQueuedReplayableEvent(queuedDrag, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent), !0;
        case "mouseover":
            return queuedMouse = accumulateOrCreateContinuousQueuedReplayableEvent(queuedMouse, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent), !0;
        case "pointerover":
            var pointerId = nativeEvent.pointerId;
            queuedPointers.set(pointerId, accumulateOrCreateContinuousQueuedReplayableEvent(queuedPointers.get(pointerId) || null, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent));
            return !0;
        case "gotpointercapture":
            return pointerId = nativeEvent.pointerId, queuedPointerCaptures.set(pointerId, accumulateOrCreateContinuousQueuedReplayableEvent(queuedPointerCaptures.get(pointerId) || null, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent)), !0;
    }
    return !1;
}
function attemptExplicitHydrationTarget(queuedTarget) {
    var targetInst = getClosestInstanceFromNode(queuedTarget.target);
    if (null !== targetInst) {
        var nearestMounted = getNearestMountedFiber(targetInst);
        if (null !== nearestMounted) {
            if (targetInst = nearestMounted.tag, 13 === targetInst) {
                if (targetInst = getSuspenseInstanceFromFiber(nearestMounted), null !== targetInst) {
                    queuedTarget.blockedOn = targetInst;
                    runWithPriority(queuedTarget.priority, function() {
                        attemptHydrationAtCurrentPriority(nearestMounted);
                    });
                    return;
                }
            } else if (31 === targetInst) {
                if (targetInst = getActivityInstanceFromFiber(nearestMounted), null !== targetInst) {
                    queuedTarget.blockedOn = targetInst;
                    runWithPriority(queuedTarget.priority, function() {
                        attemptHydrationAtCurrentPriority(nearestMounted);
                    });
                    return;
                }
            } else if (3 === targetInst && nearestMounted.stateNode.current.memoizedState.isDehydrated) {
                queuedTarget.blockedOn = 3 === nearestMounted.tag ? nearestMounted.stateNode.containerInfo : null;
                return;
            }
        }
    }
    queuedTarget.blockedOn = null;
}
function attemptReplayContinuousQueuedEvent(queuedEvent) {
    if (null !== queuedEvent.blockedOn) return !1;
    for(var targetContainers = queuedEvent.targetContainers; 0 < targetContainers.length;){
        var nextBlockedOn = findInstanceBlockingEvent(queuedEvent.nativeEvent);
        if (null === nextBlockedOn) {
            nextBlockedOn = queuedEvent.nativeEvent;
            var nativeEventClone = new nextBlockedOn.constructor(nextBlockedOn.type, nextBlockedOn);
            currentReplayingEvent = nativeEventClone;
            nextBlockedOn.target.dispatchEvent(nativeEventClone);
            currentReplayingEvent = null;
        } else return targetContainers = getInstanceFromNode(nextBlockedOn), null !== targetContainers && attemptContinuousHydration(targetContainers), queuedEvent.blockedOn = nextBlockedOn, !1;
        targetContainers.shift();
    }
    return !0;
}
function attemptReplayContinuousQueuedEventInMap(queuedEvent, key, map) {
    attemptReplayContinuousQueuedEvent(queuedEvent) && map.delete(key);
}
function replayUnblockedEvents() {
    hasScheduledReplayAttempt = !1;
    null !== queuedFocus && attemptReplayContinuousQueuedEvent(queuedFocus) && (queuedFocus = null);
    null !== queuedDrag && attemptReplayContinuousQueuedEvent(queuedDrag) && (queuedDrag = null);
    null !== queuedMouse && attemptReplayContinuousQueuedEvent(queuedMouse) && (queuedMouse = null);
    queuedPointers.forEach(attemptReplayContinuousQueuedEventInMap);
    queuedPointerCaptures.forEach(attemptReplayContinuousQueuedEventInMap);
}
function scheduleCallbackIfUnblocked(queuedEvent, unblocked) {
    queuedEvent.blockedOn === unblocked && (queuedEvent.blockedOn = null, hasScheduledReplayAttempt || (hasScheduledReplayAttempt = !0, Scheduler.unstable_scheduleCallback(Scheduler.unstable_NormalPriority, replayUnblockedEvents)));
}
var lastScheduledReplayQueue = null;
function scheduleReplayQueueIfNeeded(formReplayingQueue) {
    lastScheduledReplayQueue !== formReplayingQueue && (lastScheduledReplayQueue = formReplayingQueue, Scheduler.unstable_scheduleCallback(Scheduler.unstable_NormalPriority, function() {
        lastScheduledReplayQueue === formReplayingQueue && (lastScheduledReplayQueue = null);
        for(var i = 0; i < formReplayingQueue.length; i += 3){
            var form = formReplayingQueue[i], submitterOrAction = formReplayingQueue[i + 1], formData = formReplayingQueue[i + 2];
            if ("function" !== typeof submitterOrAction) if (null === findInstanceBlockingTarget(submitterOrAction || form)) continue;
            else break;
            var formInst = getInstanceFromNode(form);
            null !== formInst && (formReplayingQueue.splice(i, 3), i -= 3, startHostTransition(formInst, {
                pending: !0,
                data: formData,
                method: form.method,
                action: submitterOrAction
            }, submitterOrAction, formData));
        }
    }));
}
function retryIfBlockedOn(unblocked) {
    function unblock(queuedEvent) {
        return scheduleCallbackIfUnblocked(queuedEvent, unblocked);
    }
    null !== queuedFocus && scheduleCallbackIfUnblocked(queuedFocus, unblocked);
    null !== queuedDrag && scheduleCallbackIfUnblocked(queuedDrag, unblocked);
    null !== queuedMouse && scheduleCallbackIfUnblocked(queuedMouse, unblocked);
    queuedPointers.forEach(unblock);
    queuedPointerCaptures.forEach(unblock);
    for(var i = 0; i < queuedExplicitHydrationTargets.length; i++){
        var queuedTarget = queuedExplicitHydrationTargets[i];
        queuedTarget.blockedOn === unblocked && (queuedTarget.blockedOn = null);
    }
    for(; 0 < queuedExplicitHydrationTargets.length && (i = queuedExplicitHydrationTargets[0], null === i.blockedOn);)attemptExplicitHydrationTarget(i), null === i.blockedOn && queuedExplicitHydrationTargets.shift();
    i = (unblocked.ownerDocument || unblocked).$$reactFormReplay;
    if (null != i) for(queuedTarget = 0; queuedTarget < i.length; queuedTarget += 3){
        var form = i[queuedTarget], submitterOrAction = i[queuedTarget + 1], formProps = form[internalPropsKey] || null;
        if ("function" === typeof submitterOrAction) formProps || scheduleReplayQueueIfNeeded(i);
        else if (formProps) {
            var action = null;
            if (submitterOrAction && submitterOrAction.hasAttribute("formAction")) if (form = submitterOrAction, formProps = submitterOrAction[internalPropsKey] || null) action = formProps.formAction;
            else {
                if (null !== findInstanceBlockingTarget(form)) continue;
            }
            else action = formProps.action;
            "function" === typeof action ? i[queuedTarget + 1] = action : (i.splice(queuedTarget, 3), queuedTarget -= 3);
            scheduleReplayQueueIfNeeded(i);
        }
    }
}
function defaultOnDefaultTransitionIndicator() {
    function handleNavigate(event) {
        event.canIntercept && "react-transition" === event.info && event.intercept({
            handler: function() {
                return new Promise(function(resolve) {
                    return pendingResolve = resolve;
                });
            },
            focusReset: "manual",
            scroll: "manual"
        });
    }
    function handleNavigateComplete() {
        null !== pendingResolve && (pendingResolve(), pendingResolve = null);
        isCancelled || setTimeout(startFakeNavigation, 20);
    }
    function startFakeNavigation() {
        if (!isCancelled && !navigation.transition) {
            var currentEntry = navigation.currentEntry;
            currentEntry && null != currentEntry.url && navigation.navigate(currentEntry.url, {
                state: currentEntry.getState(),
                info: "react-transition",
                history: "replace"
            });
        }
    }
    if ("object" === typeof navigation) {
        var isCancelled = !1, pendingResolve = null;
        navigation.addEventListener("navigate", handleNavigate);
        navigation.addEventListener("navigatesuccess", handleNavigateComplete);
        navigation.addEventListener("navigateerror", handleNavigateComplete);
        setTimeout(startFakeNavigation, 100);
        return function() {
            isCancelled = !0;
            navigation.removeEventListener("navigate", handleNavigate);
            navigation.removeEventListener("navigatesuccess", handleNavigateComplete);
            navigation.removeEventListener("navigateerror", handleNavigateComplete);
            null !== pendingResolve && (pendingResolve(), pendingResolve = null);
        };
    }
}
function ReactDOMRoot(internalRoot) {
    this._internalRoot = internalRoot;
}
ReactDOMHydrationRoot.prototype.render = ReactDOMRoot.prototype.render = function(children) {
    var root = this._internalRoot;
    if (null === root) throw Error(formatProdErrorMessage(409));
    var current = root.current, lane = requestUpdateLane();
    updateContainerImpl(current, lane, children, root, null, null);
};
ReactDOMHydrationRoot.prototype.unmount = ReactDOMRoot.prototype.unmount = function() {
    var root = this._internalRoot;
    if (null !== root) {
        this._internalRoot = null;
        var container = root.containerInfo;
        updateContainerImpl(root.current, 2, null, root, null, null);
        flushSyncWork$1();
        container[internalContainerInstanceKey] = null;
    }
};
function ReactDOMHydrationRoot(internalRoot) {
    this._internalRoot = internalRoot;
}
ReactDOMHydrationRoot.prototype.unstable_scheduleHydration = function(target) {
    if (target) {
        var updatePriority = resolveUpdatePriority();
        target = {
            blockedOn: null,
            target: target,
            priority: updatePriority
        };
        for(var i = 0; i < queuedExplicitHydrationTargets.length && 0 !== updatePriority && updatePriority < queuedExplicitHydrationTargets[i].priority; i++);
        queuedExplicitHydrationTargets.splice(i, 0, target);
        0 === i && attemptExplicitHydrationTarget(target);
    }
};
var isomorphicReactPackageVersion$jscomp$inline_2043 = React.version;
if ("19.3.0" !== isomorphicReactPackageVersion$jscomp$inline_2043) throw Error(formatProdErrorMessage(527, isomorphicReactPackageVersion$jscomp$inline_2043, "19.3.0"));
ReactDOMSharedInternals.findDOMNode = function(componentOrElement) {
    var fiber = componentOrElement._reactInternals;
    if (void 0 === fiber) {
        if ("function" === typeof componentOrElement.render) throw Error(formatProdErrorMessage(188));
        componentOrElement = Object.keys(componentOrElement).join(",");
        throw Error(formatProdErrorMessage(268, componentOrElement));
    }
    componentOrElement = findCurrentFiberUsingSlowPath(fiber);
    componentOrElement = null !== componentOrElement ? findCurrentHostFiberImpl(componentOrElement) : null;
    componentOrElement = null === componentOrElement ? null : componentOrElement.stateNode;
    return componentOrElement;
};
var internals$jscomp$inline_2586 = {
    bundleType: 0,
    version: "19.3.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: ReactSharedInternals,
    reconcilerVersion: "19.3.0"
};
if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
    var hook$jscomp$inline_2587 = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!hook$jscomp$inline_2587.isDisabled && hook$jscomp$inline_2587.supportsFiber) try {
        rendererID = hook$jscomp$inline_2587.inject(internals$jscomp$inline_2586), injectedHook = hook$jscomp$inline_2587;
    } catch (err) {}
}
exports.createRoot = function(container, options) {
    if (!isValidContainer(container)) throw Error(formatProdErrorMessage(299));
    var isStrictMode = !1, identifierPrefix = "", onUncaughtError = defaultOnUncaughtError, onCaughtError = defaultOnCaughtError, onRecoverableError = defaultOnRecoverableError;
    null !== options && void 0 !== options && (!0 === options.unstable_strictMode && (isStrictMode = !0), void 0 !== options.identifierPrefix && (identifierPrefix = options.identifierPrefix), void 0 !== options.onUncaughtError && (onUncaughtError = options.onUncaughtError), void 0 !== options.onCaughtError && (onCaughtError = options.onCaughtError), void 0 !== options.onRecoverableError && (onRecoverableError = options.onRecoverableError));
    options = createFiberRoot(container, 1, !1, null, null, isStrictMode, identifierPrefix, null, onUncaughtError, onCaughtError, onRecoverableError, defaultOnDefaultTransitionIndicator);
    container[internalContainerInstanceKey] = options.current;
    listenToAllSupportedEvents(container);
    return new ReactDOMRoot(options);
};
exports.hydrateRoot = function(container, initialChildren, options) {
    if (!isValidContainer(container)) throw Error(formatProdErrorMessage(299));
    var isStrictMode = !1, identifierPrefix = "", onUncaughtError = defaultOnUncaughtError, onCaughtError = defaultOnCaughtError, onRecoverableError = defaultOnRecoverableError, formState = null;
    null !== options && void 0 !== options && (!0 === options.unstable_strictMode && (isStrictMode = !0), void 0 !== options.identifierPrefix && (identifierPrefix = options.identifierPrefix), void 0 !== options.onUncaughtError && (onUncaughtError = options.onUncaughtError), void 0 !== options.onCaughtError && (onCaughtError = options.onCaughtError), void 0 !== options.onRecoverableError && (onRecoverableError = options.onRecoverableError), void 0 !== options.formState && (formState = options.formState));
    initialChildren = createFiberRoot(container, 1, !0, initialChildren, null != options ? options : null, isStrictMode, identifierPrefix, formState, onUncaughtError, onCaughtError, onRecoverableError, defaultOnDefaultTransitionIndicator);
    initialChildren.context = getContextForSubtree(null);
    options = initialChildren.current;
    isStrictMode = requestUpdateLane();
    isStrictMode = getBumpedLaneForHydrationByLane(isStrictMode);
    identifierPrefix = createUpdate(isStrictMode);
    identifierPrefix.callback = null;
    enqueueUpdate(options, identifierPrefix, isStrictMode);
    options = isStrictMode;
    initialChildren.current.lanes = options;
    markRootUpdated$1(initialChildren, options);
    ensureRootIsScheduled(initialChildren);
    container[internalContainerInstanceKey] = initialChildren.current;
    listenToAllSupportedEvents(container);
    return new ReactDOMHydrationRoot(initialChildren);
};
exports.version = "19.3.0";
}),
1912, ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__461__ = /*#__PURE__*/ __turbopack_context__.i(461);
'use strict';
function checkDCE() {
    /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */ if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined' || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== 'function') {
        return;
    }
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        // Verify that the code above has been dead code eliminated (DCE'd).
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
    } catch (err) {
        // DevTools shouldn't crash React, no matter what.
        // We should still report in case we break this code.
        console.error(err);
    }
}
if ("TURBOPACK compile-time truthy", 1) {
    // DCE check should happen before ReactDOM bundle executes so that
    // DevTools can report bad minification during injection.
    checkDCE();
    module.exports = __turbopack_context__.r(7647);
} else //TURBOPACK unreachable
;
}),
]);

//# sourceMappingURL=27kxoksqkkipb.js.map