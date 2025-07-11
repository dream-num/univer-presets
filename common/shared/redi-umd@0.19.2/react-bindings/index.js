(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ?  factory(exports, require('@wendellhu/redi'), require('react'), require('react/jsx-runtime'), require('rxjs')) :
  typeof define === 'function' && define.amd ? define(['exports', '@wendellhu/redi', 'react', 'react/jsx-runtime', 'rxjs'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global["@wendellhu/redi/react-bindings"] = {}), global.__wendellhu_redi,global.react,global.react_jsx_runtime,global.rxjs));
})(this, function(exports, __wendellhu_redi, react, react_jsx_runtime, rxjs) {
//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion
__wendellhu_redi = __toESM(__wendellhu_redi);
react = __toESM(react);
react_jsx_runtime = __toESM(react_jsx_runtime);
rxjs = __toESM(rxjs);

//#region src/react-bindings/reactContext.tsx
const __REDI_CONTEXT_LOCK__ = "REDI_CONTEXT_LOCK";
const isNode = typeof process !== "undefined" && process.versions != null && process.versions.node != null;
const globalObject = typeof globalThis !== "undefined" && globalThis || typeof window !== "undefined" && window || typeof global !== "undefined" && global;
if (!globalObject[__REDI_CONTEXT_LOCK__]) globalObject[__REDI_CONTEXT_LOCK__] = true;
else if (!isNode) console.error("[redi]: \"RediContext\" is already created. You may import \"RediContext\" from different paths. Use \"import { RediContext } from '@wendellhu/redi/react-bindings'; instead.\"");
const RediContext = (0, react.createContext)({ injector: null });
RediContext.displayName = "RediContext";
const RediProvider = RediContext.Provider;
const RediConsumer = RediContext.Consumer;

//#endregion
//#region src/react-bindings/reactComponent.tsx
function RediInjector(props) {
	const { children, dependencies } = props;
	const childInjectorRef = (0, react.useRef)(null);
	(0, react.useEffect)(() => () => childInjectorRef.current?.dispose(), []);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RediConsumer, { children: (context) => {
		let childInjector;
		if (childInjectorRef.current) childInjector = childInjectorRef.current;
		else {
			childInjector = context.injector ? context.injector.createChild(dependencies) : new __wendellhu_redi.Injector(dependencies);
			childInjectorRef.current = childInjector;
		}
		return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RediProvider, {
			value: { injector: childInjector },
			children
		});
	} });
}
/**
* @param Comp
* @param injector
* @returns A component type that can be rendered.
*/
function connectInjector(Comp, injector) {
	return function ComponentWithInjector(props) {
		return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RediProvider, {
			value: { injector },
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Comp, { ...props })
		});
	};
}
function connectDependencies(Comp, dependencies) {
	return function ComponentWithInjector(props) {
		return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RediInjector, {
			dependencies,
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Comp, { ...props })
		});
	};
}

//#endregion
//#region src/react-bindings/reactDecorators.ts
var ClassComponentNotInRediContextError = class extends __wendellhu_redi.RediError {
	constructor(component) {
		super(`You should make "RediContext" as ${component.constructor.name}'s default context type. If you want to use multiple context, please check this on React doc site. https://reactjs.org/docs/context.html#classcontexttype`);
	}
};
function WithDependency(id, quantity, lookUp) {
	return function() {
		return { get() {
			const thisComponent = this;
			const context = thisComponent.context;
			if (!context || !context.injector) throw new ClassComponentNotInRediContextError(thisComponent);
			const injector = context.injector;
			const thing = injector.get(id, quantity || __wendellhu_redi.Quantity.REQUIRED, lookUp);
			return thing;
		} };
	};
}

//#endregion
//#region src/react-bindings/reactHooks.tsx
var HooksNotInRediContextError = class extends __wendellhu_redi.RediError {
	constructor() {
		super("Using dependency injection outside of a RediContext.");
	}
};
function useInjector() {
	const injectionContext = (0, react.useContext)(RediContext);
	if (!injectionContext.injector) throw new HooksNotInRediContextError();
	return injectionContext.injector;
}
function useDependency(id, quantityOrLookUp, lookUp) {
	const injector = useInjector();
	return (0, react.useMemo)(() => injector.get(id, quantityOrLookUp, lookUp), [
		id,
		quantityOrLookUp,
		lookUp
	]);
}

//#endregion
//#region src/react-bindings/reactRx.tsx
/**
* unwrap an observable value, return it to the component for rendering, and
* trigger re-render when value changes
*
* **IMPORTANT**. Parent and child components better not subscribe to the same
* observable, otherwise unnecessary re-render would be triggered. Instead, the
* top-most component should subscribe and pass value of the observable to
* its offspring, by props or context. Please consider using `useDependencyContext` and
* `useDependencyContextValue` in this case.
*
* @deprecated Please use `useObservable` instead.
*/
function useDependencyValue(depValue$, defaultValue) {
	const firstValue = depValue$ instanceof rxjs.BehaviorSubject && typeof defaultValue === "undefined" ? depValue$.getValue() : defaultValue;
	const [value, setValue] = (0, react.useState)(firstValue);
	(0, react.useEffect)(() => {
		const subscription = depValue$.subscribe((val) => setValue(val));
		return () => subscription.unsubscribe();
	}, [depValue$]);
	return value;
}
function unwrap(o) {
	if (typeof o === "function") return o();
	return o;
}
/**
* Subscribe to an observable and return its value. The component will re-render when the observable emits a new value.
*
* @param observable An observable or a function that returns an observable
* @param defaultValue The default value of the observable. It the `observable` can omit an initial value, this value will be neglected.
* @param shouldHaveSyncValue If the observable should have a sync value. If it does not have a sync value, an error will be thrown.
* @param deps A dependency array to decide if we should re-subscribe when the `observable` is a function.
* @returns Value or null.
*/
function useObservable(observable, defaultValue, shouldHaveSyncValue, deps) {
	if (typeof observable === "function" && !deps) throw new __wendellhu_redi.RediError("Expected deps to be provided when observable is a function!");
	const observableRef = (0, react.useRef)(null);
	const initializedRef = (0, react.useRef)(false);
	const destObservable = (0, react.useMemo)(() => observable, [...typeof deps !== "undefined" ? deps : [observable]]);
	const [_, setRenderCounter] = (0, react.useState)(0);
	const valueRef = (0, react.useRef)((() => {
		let innerDefaultValue;
		if (destObservable) {
			const sub = unwrap(destObservable).subscribe((value) => {
				initializedRef.current = true;
				innerDefaultValue = value;
			});
			sub.unsubscribe();
		}
		return innerDefaultValue ?? defaultValue;
	})());
	(0, react.useEffect)(() => {
		let subscription = null;
		if (destObservable) {
			observableRef.current = unwrap(destObservable);
			subscription = observableRef.current.subscribe((value) => {
				valueRef.current = value;
				setRenderCounter((prev) => prev + 1);
			});
		}
		return () => subscription?.unsubscribe();
	}, [destObservable]);
	if (shouldHaveSyncValue && !initializedRef.current) throw new Error("Expect `shouldHaveSyncValue` but not getting a sync value!");
	return valueRef.current;
}
/**
* subscribe to a signal that emits whenever data updates and re-render
*
* @param update$ a signal that the data the functional component depends has updated
*/
function useUpdateBinder(update$) {
	const [, dumpSet] = (0, react.useState)(0);
	(0, react.useEffect)(() => {
		const subscription = update$.subscribe(() => dumpSet((prev) => prev + 1));
		return () => subscription.unsubscribe();
	}, []);
}
const DepValueMapProvider = /* @__PURE__ */ new WeakMap();
/**
* subscribe to an observable value from a service, creating a context for it so
* it child component won't have to subscribe again and cause unnecessary
*/
function useDependencyContext(depValue$, defaultValue) {
	const depRef = (0, react.useRef)(void 0);
	const value = useObservable(depValue$, defaultValue);
	const Context = (0, react.useMemo)(() => (0, react.createContext)(value), [depValue$]);
	const Provider = (0, react.useCallback)((props) => {
		return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Context.Provider, {
			value,
			children: props.children
		});
	}, [depValue$, value]);
	if (depRef.current !== depValue$) {
		if (depRef.current) DepValueMapProvider.delete(depRef.current);
		depRef.current = depValue$;
		DepValueMapProvider.set(depValue$, Context);
	}
	return {
		Provider,
		value
	};
}
function useDependencyContextValue(depValue$) {
	const context = DepValueMapProvider.get(depValue$);
	if (!context) throw new __wendellhu_redi.RediError(`try to read context value but no ancestor component subscribed it.`);
	return (0, react.useContext)(context);
}

//#endregion
exports.RediConsumer = RediConsumer;
exports.RediContext = RediContext;
exports.RediProvider = RediProvider;
exports.WithDependency = WithDependency;
exports.connectDependencies = connectDependencies;
exports.connectInjector = connectInjector;
exports.useDependency = useDependency;
exports.useDependencyContext = useDependencyContext;
exports.useDependencyContextValue = useDependencyContextValue;
exports.useDependencyValue = useDependencyValue;
exports.useInjector = useInjector;
exports.useObservable = useObservable;
exports.useUpdateBinder = useUpdateBinder;
});
//# sourceMappingURL=index.js.map