(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ?  factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global["@wendellhu/redi"] = {})));
})(this, function(exports) {

//#region src/dependencyIdentifier.ts
const IdentifierDecoratorSymbol = Symbol("$$IDENTIFIER_DECORATOR");
function isIdentifierDecorator(thing) {
	return thing && thing[IdentifierDecoratorSymbol] === true;
}

//#endregion
//#region src/dependencyItem.ts
function isCtor(thing) {
	return typeof thing === "function";
}
function isClassDependencyItem(thing) {
	if (thing && typeof thing.useClass !== "undefined") return true;
	return false;
}
function isFactoryDependencyItem(thing) {
	if (thing && typeof thing.useFactory !== "undefined") return true;
	return false;
}
function isValueDependencyItem(thing) {
	if (thing && typeof thing.useValue !== "undefined") return true;
	return false;
}
function isExistingDependencyItem(thing) {
	if (thing && typeof thing.useExisting !== "undefined") return true;
	return false;
}
function isAsyncDependencyItem(thing) {
	if (thing && typeof thing.useAsync !== "undefined") return true;
	return false;
}
const AsyncHookSymbol = Symbol("AsyncHook");
function isAsyncHook(thing) {
	if (thing && thing.__symbol === AsyncHookSymbol) return true;
	return false;
}
function prettyPrintIdentifier(id) {
	if (typeof id === "undefined") return "undefined";
	return isCtor(id) && !id[IdentifierDecoratorSymbol] ? id.name : id.toString();
}

//#endregion
//#region src/error.ts
var RediError = class extends Error {
	constructor(message) {
		super(`[redi]: ${message}`);
	}
};

//#endregion
//#region src/types.ts
let Quantity = /* @__PURE__ */ function(Quantity$1) {
	Quantity$1["MANY"] = "many";
	Quantity$1["OPTIONAL"] = "optional";
	Quantity$1["REQUIRED"] = "required";
	return Quantity$1;
}({});
let LookUp = /* @__PURE__ */ function(LookUp$1) {
	LookUp$1["SELF"] = "self";
	LookUp$1["SKIP_SELF"] = "skipSelf";
	return LookUp$1;
}({});

//#endregion
//#region src/decorators.ts
const TARGET = Symbol("$$TARGET");
const DEPENDENCIES = Symbol("$$DEPENDENCIES");
var DependencyDescriptorNotFoundError = class extends RediError {
	constructor(index, target) {
		const msg = `Could not find dependency registered on the ${index} (indexed) parameter of the constructor of "${prettyPrintIdentifier(target)}".`;
		super(msg);
	}
};
var IdentifierUndefinedError = class extends RediError {
	constructor(target, index) {
		const msg = `It seems that you register "undefined" as dependency on the ${index + 1} parameter of "${prettyPrintIdentifier(target)}". Please make sure that there is not cyclic dependency among your TypeScript files, or consider using "forwardRef". For more info please visit our website https://redi.wendell.fun/docs/debug#could-not-find-dependency-registered-on`;
		super(msg);
	}
};
/**
* @internal
*/
function getDependencies(registerTarget) {
	const target = registerTarget;
	return target[DEPENDENCIES] || [];
}
/**
* @internal
*/
function getDependencyByIndex(registerTarget, index) {
	const allDependencies = getDependencies(registerTarget);
	const dep = allDependencies.find((descriptor) => descriptor.paramIndex === index);
	if (!dep) throw new DependencyDescriptorNotFoundError(index, registerTarget);
	return dep;
}
/**
* @internal
*/
function setDependency(registerTarget, identifier, paramIndex, quantity = Quantity.REQUIRED, lookUp) {
	const descriptor = {
		paramIndex,
		identifier,
		quantity,
		lookUp,
		withNew: false
	};
	if (typeof identifier === "undefined") throw new IdentifierUndefinedError(registerTarget, paramIndex);
	const target = registerTarget;
	if (target[TARGET] === target) target[DEPENDENCIES].push(descriptor);
	else {
		target[DEPENDENCIES] = [descriptor];
		target[TARGET] = target;
	}
}
const knownIdentifiers = /* @__PURE__ */ new Set();
const cachedIdentifiers = /* @__PURE__ */ new Map();
/**
* Create a dependency identifier
*
* @param id name of the identifier
* @returns Identifier that could also be used as a decorator
*/
function createIdentifier(id) {
	if (knownIdentifiers.has(id)) {
		console.error(`Identifier "${id}" already exists. Returning the cached identifier decorator.`);
		return cachedIdentifiers.get(id);
	}
	const decorator = function(registerTarget, _key, index) {
		setDependency(registerTarget, decorator, index);
	};
	decorator.decoratorName = id;
	decorator.toString = () => decorator.decoratorName;
	decorator[IdentifierDecoratorSymbol] = true;
	knownIdentifiers.add(id);
	cachedIdentifiers.set(id, decorator);
	return decorator;
}

//#endregion
//#region src/dependencyLookUp.ts
function changeLookup(target, index, lookUp) {
	const descriptor = getDependencyByIndex(target, index);
	descriptor.lookUp = lookUp;
}
function lookupDecoratorFactoryProducer(lookUp) {
	return function DecoratorFactory() {
		if (this instanceof DecoratorFactory) return this;
		return function(target, _key, index) {
			changeLookup(target, index, lookUp);
		};
	};
}
/**
* when resolving this dependency, skip the current injector
*/
const SkipSelf = lookupDecoratorFactoryProducer(LookUp.SKIP_SELF);
/**
* when resolving this dependency, only search the current injector
*/
const Self = lookupDecoratorFactoryProducer(LookUp.SELF);

//#endregion
//#region src/dependencyQuantity.ts
function mapQuantityToNumber(quantity) {
	switch (quantity) {
		case Quantity.OPTIONAL: return "0 or 1";
		case Quantity.REQUIRED: return "1";
		case Quantity.MANY: return "0 or more";
	}
}
var QuantityCheckError = class extends RediError {
	constructor(id, quantity, actual) {
		let msg = `Expect ${mapQuantityToNumber(quantity)} dependency item(s) for id "${prettyPrintIdentifier(id)}" but get ${actual}.`;
		if (actual === 0) msg += " Did you forget to register it?";
		if (actual > 1) msg += " You register it more than once.";
		super(msg);
		this.quantity = quantity;
		this.actual = actual;
	}
};
function checkQuantity(id, quantity, length) {
	if (quantity === Quantity.OPTIONAL && length > 1 || quantity === Quantity.REQUIRED && length !== 1) throw new QuantityCheckError(id, quantity, length);
}
function retrieveQuantity(quantity, arr) {
	if (quantity === Quantity.MANY) return arr;
	else return arr[0];
}
function changeQuantity(target, index, quantity) {
	const descriptor = getDependencyByIndex(target, index);
	descriptor.quantity = quantity;
}
function quantifyDecoratorFactoryProducer(quantity) {
	return function decoratorFactory(id) {
		if (this instanceof decoratorFactory) return this;
		return function(registerTarget, _key, index) {
			if (id) setDependency(registerTarget, id, index, quantity);
			else {
				if (quantity === Quantity.REQUIRED) throw new IdentifierUndefinedError(registerTarget, index);
				changeQuantity(registerTarget, index, quantity);
			}
		};
	};
}
const Many = quantifyDecoratorFactoryProducer(Quantity.MANY);
const Optional = quantifyDecoratorFactoryProducer(Quantity.OPTIONAL);
const Inject = quantifyDecoratorFactoryProducer(Quantity.REQUIRED);

//#endregion
//#region src/dependencyWithNew.ts
function changeToSelf(target, index, withNew) {
	const descriptor = getDependencyByIndex(target, index);
	descriptor.withNew = withNew;
}
function withNewDecoratorFactoryProducer(withNew) {
	return function DecoratorFactory() {
		if (this instanceof DecoratorFactory) return this;
		return function(target, _key, index) {
			changeToSelf(target, index, withNew);
		};
	};
}
/**
* Always initialize a new instance of that dependency instead of getting the
* cached instance from the injector.
*/
const WithNew = withNewDecoratorFactoryProducer(true);

//#endregion
//#region src/dependencyDescriptor.ts
function normalizeFactoryDeps(deps, startIndex = 0) {
	if (!deps) return [];
	return deps.map((dep, index) => {
		index += startIndex;
		if (!Array.isArray(dep)) return {
			paramIndex: index,
			identifier: dep,
			quantity: Quantity.REQUIRED,
			withNew: false
		};
		const modifiers = dep.slice(0, dep.length - 1);
		const identifier = dep[dep.length - 1];
		let lookUp;
		let quantity = Quantity.REQUIRED;
		let withNew = false;
		modifiers.forEach((modifier) => {
			if (modifier instanceof Self) lookUp = LookUp.SELF;
			else if (modifier instanceof SkipSelf) lookUp = LookUp.SKIP_SELF;
			else if (modifier instanceof Optional) quantity = Quantity.OPTIONAL;
			else if (modifier instanceof Many) quantity = Quantity.MANY;
			else if (modifier instanceof WithNew) withNew = true;
		});
		return {
			paramIndex: index,
			identifier,
			quantity,
			lookUp,
			withNew
		};
	});
}

//#endregion
//#region src/dependencyDeclare.ts
/**
* Register dependencies on a class.
*
* @param registerTarget The target constructor
* @param deps Dependencies
* @param startIndex The start index of the dependencies. Default is 0. When you want to set dependencies on a class
* that has custom parameters, you should set `startIndex` to the count of these custom parameters.
*/
function setDependencies(registerTarget, deps, startIndex = 0) {
	const normalizedDescriptors = normalizeFactoryDeps(deps, startIndex);
	normalizedDescriptors.forEach((descriptor) => {
		setDependency(registerTarget, descriptor.identifier, descriptor.paramIndex, descriptor.quantity, descriptor.lookUp);
	});
}

//#endregion
//#region src/dependencyForwardRef.ts
function forwardRef(wrapper) {
	return { unwrap: wrapper };
}
function isForwardRef(thing) {
	return !!thing && typeof thing.unwrap === "function";
}
function normalizeForwardRef(id) {
	if (isForwardRef(id)) return id.unwrap();
	return id;
}

//#endregion
//#region src/dispose.ts
function isDisposable(thing) {
	return !!thing && typeof thing.dispose === "function";
}

//#endregion
//#region src/dependencyCollection.ts
function isBareClassDependency(thing) {
	return thing.length === 1;
}
const ResolvingStack = [];
function pushResolvingStack(id) {
	ResolvingStack.push(id);
}
function popupResolvingStack() {
	ResolvingStack.pop();
}
function clearResolvingStack() {
	ResolvingStack.length = 0;
}
var DependencyNotFoundForModuleError = class extends RediError {
	constructor(toInstantiate, id, index) {
		const msg = `Cannot find "${prettyPrintIdentifier(id)}" registered by any injector. It is the ${index}th param of "${isIdentifierDecorator(toInstantiate) ? prettyPrintIdentifier(toInstantiate) : toInstantiate.name}".`;
		super(msg);
	}
};
var DependencyNotFoundError = class extends RediError {
	constructor(id) {
		const msg = `Cannot find "${prettyPrintIdentifier(id)}" registered by any injector. The stack of dependencies is: "${ResolvingStack.map((id$1) => prettyPrintIdentifier(id$1)).join(" -> ")}".`;
		super(msg);
		clearResolvingStack();
	}
};
/**
* Store unresolved dependencies in an injector.
*
* @internal
*/
var DependencyCollection = class {
	dependencyMap = /* @__PURE__ */ new Map();
	constructor(dependencies) {
		this.normalizeDependencies(dependencies).map((pair) => this.add(pair[0], pair[1]));
	}
	add(ctorOrId, val) {
		if (typeof val === "undefined") val = {
			useClass: ctorOrId,
			lazy: false
		};
		let arr = this.dependencyMap.get(ctorOrId);
		if (typeof arr === "undefined") {
			arr = [];
			this.dependencyMap.set(ctorOrId, arr);
		}
		arr.push(val);
	}
	delete(id) {
		this.dependencyMap.delete(id);
	}
	get(id, quantity = Quantity.REQUIRED) {
		const ret = this.dependencyMap.get(id);
		checkQuantity(id, quantity, ret.length);
		return retrieveQuantity(quantity, ret);
	}
	has(id) {
		return this.dependencyMap.has(id);
	}
	append(dependencies) {
		this.normalizeDependencies(dependencies).forEach((pair) => this.add(pair[0], pair[1]));
	}
	dispose() {
		this.dependencyMap.clear();
	}
	/**
	* normalize dependencies to `DependencyItem`
	*/
	normalizeDependencies(dependencies) {
		return dependencies.map((dependency) => {
			const id = dependency[0];
			let val;
			if (isBareClassDependency(dependency)) val = {
				useClass: dependency[0],
				lazy: false
			};
			else val = dependency[1];
			return [id, val];
		});
	}
};
/**
* Store resolved dependencies.
*
* @internal
*/
var ResolvedDependencyCollection = class {
	resolvedDependencies = /* @__PURE__ */ new Map();
	add(id, val) {
		let arr = this.resolvedDependencies.get(id);
		if (typeof arr === "undefined") {
			arr = [];
			this.resolvedDependencies.set(id, arr);
		}
		arr.push(val);
	}
	has(id) {
		return this.resolvedDependencies.has(id);
	}
	delete(id) {
		if (this.resolvedDependencies.has(id)) {
			const things = this.resolvedDependencies.get(id);
			things.forEach((t) => isDisposable(t) ? t.dispose() : void 0);
			this.resolvedDependencies.delete(id);
		}
	}
	get(id, quantity = Quantity.REQUIRED) {
		const ret = this.resolvedDependencies.get(id);
		if (!ret) throw new DependencyNotFoundError(id);
		checkQuantity(id, quantity, ret.length);
		if (quantity === Quantity.MANY) return ret;
		else return ret[0];
	}
	dispose() {
		Array.from(this.resolvedDependencies.values()).forEach((items) => {
			items.forEach((item) => isDisposable(item) ? item.dispose() : void 0);
		});
		this.resolvedDependencies.clear();
	}
};

//#endregion
//#region src/idleValue.ts
/**
* this run the callback when CPU is idle. Will fallback to setTimeout if
* the browser doesn't support requestIdleCallback
*/
let runWhenIdle;
(function() {
	if (typeof requestIdleCallback !== "undefined" && typeof cancelIdleCallback !== "undefined") runWhenIdle = (runner, timeout) => {
		const handle = requestIdleCallback(runner, typeof timeout === "number" ? { timeout } : void 0);
		let disposed = false;
		return () => {
			if (disposed) return;
			disposed = true;
			cancelIdleCallback(handle);
		};
	};
	else {
		const dummyIdle = Object.freeze({
			didTimeout: true,
			timeRemaining() {
				return 15;
			}
		});
		runWhenIdle = (runner) => {
			const handle = setTimeout(() => runner(dummyIdle));
			let disposed = false;
			return () => {
				if (disposed) return;
				disposed = true;
				clearTimeout(handle);
			};
		};
	}
})();
/**
* a wrapper of a executor so it can be evaluated when it's necessary or the CPU is idle
*
* the type of the returned value of the executor would be T
*/
var IdleValue = class {
	selfExecutor;
	disposeCallback;
	didRun = false;
	value;
	error;
	constructor(executor) {
		this.selfExecutor = () => {
			try {
				this.value = executor();
			} catch (err) {
				this.error = err;
			} finally {
				this.didRun = true;
			}
		};
		this.disposeCallback = runWhenIdle(() => this.selfExecutor());
	}
	hasRun() {
		return this.didRun;
	}
	dispose() {
		this.disposeCallback();
	}
	getValue() {
		if (!this.didRun) {
			this.dispose();
			this.selfExecutor();
		}
		if (this.error) throw this.error;
		return this.value;
	}
};

//#endregion
//#region src/injector.ts
const MAX_RESOLUTIONS_QUEUED = 300;
const NotInstantiatedSymbol = Symbol("$$NOT_INSTANTIATED_SYMBOL");
var CircularDependencyError = class extends RediError {
	constructor(id) {
		super(`Detecting cyclic dependency. The last identifier is "${prettyPrintIdentifier(id)}".`);
	}
};
var InjectorAlreadyDisposedError = class extends RediError {
	constructor() {
		super("Injector cannot be accessed after it was disposed.");
	}
};
var AsyncItemReturnAsyncItemError = class extends RediError {
	constructor(id) {
		super(`Async item "${prettyPrintIdentifier(id)}" returns another async item.`);
	}
};
var GetAsyncItemFromSyncApiError = class extends RediError {
	constructor(id) {
		super(`Cannot get async item "${prettyPrintIdentifier(id)}" from sync api.`);
	}
};
var AddDependencyAfterResolutionError = class extends RediError {
	constructor(id) {
		super(`Cannot add dependency "${prettyPrintIdentifier(id)}" after it is already resolved.`);
	}
};
var DeleteDependencyAfterResolutionError = class extends RediError {
	constructor(id) {
		super(`Cannot dependency dependency "${prettyPrintIdentifier(id)}" after it is already resolved.`);
	}
};
var Injector = class Injector {
	dependencyCollection;
	resolvedDependencyCollection;
	children = [];
	resolutionOngoing = 0;
	disposingCallbacks = /* @__PURE__ */ new Set();
	disposed = false;
	/**
	* Create a new `Injector` instance
	* @param dependencies Dependencies that should be resolved by this injector instance.
	* @param parent Optional parent injector.
	*/
	constructor(dependencies, parent = null) {
		this.parent = parent;
		this.dependencyCollection = new DependencyCollection(dependencies || []);
		this.resolvedDependencyCollection = new ResolvedDependencyCollection();
		if (parent) parent.children.push(this);
	}
	/**
	* Add a callback function that will be triggered when the Injector is disposed.
	* Please note that when you callback is invoked, the injector is already disposed and
	* you will not be able to interact with this Injector any more.
	*
	* @param {() => void} callback The callback function that will be invoked when
	* the Injector is disposed.
	* @returns A disposable that will remove the callback.
	*/
	onDispose(callback) {
		this.disposingCallbacks.add(callback);
		return { dispose: () => this.disposingCallbacks.delete(callback) };
	}
	/**
	* Create a child inject with a set of dependencies.
	* @param dependencies Dependencies that should be resolved by the newly created child injector.
	* @returns The child injector.
	*/
	createChild(dependencies) {
		this._ensureInjectorNotDisposed();
		return new Injector(dependencies, this);
	}
	/**
	* Dispose the injector and all dependencies held by this injector. Note that its child injectors will dispose first.
	*/
	dispose() {
		this.children.forEach((c) => c.dispose());
		this.children.length = 0;
		this.dependencyCollection.dispose();
		this.resolvedDependencyCollection.dispose();
		this.deleteSelfFromParent();
		this.disposed = true;
		this.disposingCallbacks.forEach((callback) => callback());
		this.disposingCallbacks.clear();
	}
	deleteSelfFromParent() {
		if (this.parent) {
			const index = this.parent.children.indexOf(this);
			if (index > -1) this.parent.children.splice(index, 1);
		}
	}
	/**
	* Add a dependency or its instance into injector. It would throw an error if the dependency
	* has already been instantiated.
	*
	* @param dependency The dependency or an instance that would be add in the injector.
	*/
	add(dependency) {
		this._ensureInjectorNotDisposed();
		const identifierOrCtor = dependency[0];
		const item = dependency[1];
		if (this.resolvedDependencyCollection.has(identifierOrCtor)) throw new AddDependencyAfterResolutionError(identifierOrCtor);
		if (typeof item === "undefined") this.dependencyCollection.add(identifierOrCtor);
		else if (isAsyncDependencyItem(item) || isClassDependencyItem(item) || isValueDependencyItem(item) || isFactoryDependencyItem(item)) this.dependencyCollection.add(identifierOrCtor, item);
		else this.resolvedDependencyCollection.add(identifierOrCtor, item);
	}
	/**
	* Replace an injection mapping for interface-based injection. It would throw an error if the dependency
	* has already been instantiated.
	*
	* @param dependency The dependency that will replace the already existed dependency.
	*/
	replace(dependency) {
		this._ensureInjectorNotDisposed();
		const identifier = dependency[0];
		if (this.resolvedDependencyCollection.has(identifier)) throw new AddDependencyAfterResolutionError(identifier);
		this.dependencyCollection.delete(identifier);
		if (dependency.length === 1) this.dependencyCollection.add(identifier);
		else this.dependencyCollection.add(identifier, dependency[1]);
	}
	/**
	* Delete a dependency from an injector. It would throw an error when the deleted dependency
	* has already been instantiated.
	*
	* @param identifier The identifier of the dependency that is supposed to be deleted.
	*/
	delete(identifier) {
		this._ensureInjectorNotDisposed();
		if (this.resolvedDependencyCollection.has(identifier)) throw new DeleteDependencyAfterResolutionError(identifier);
		this.dependencyCollection.delete(identifier);
	}
	/**
	* Invoke a function with dependencies injected. The function could only get dependency from the injector
	* and other methods are not accessible for the function.
	*
	* @param cb the function to be executed
	* @param args arguments to be passed into the function
	* @returns the return value of the function
	*/
	invoke(cb, ...args) {
		this._ensureInjectorNotDisposed();
		const accessor = {
			get: (id, quantityOrLookup, lookUp) => {
				return this._get(id, quantityOrLookup, lookUp);
			},
			has: (id) => {
				return this.has(id);
			}
		};
		return cb(accessor, ...args);
	}
	/**
	* Check if the injector could initialize a dependency.
	*
	* @param id Identifier of the dependency
	*/
	has(id) {
		return this.dependencyCollection.has(id) || this.parent?.has(id) || false;
	}
	/**
	* Get dependency instance(s).
	*
	* @param id Identifier of the dependency
	* @param quantityOrLookup @link{Quantity} or @link{LookUp}
	* @param lookUp @link{LookUp}
	*/
	get(id, quantityOrLookup, lookUp) {
		this._ensureInjectorNotDisposed();
		const newResult = this._get(id, quantityOrLookup, lookUp);
		if (Array.isArray(newResult) && newResult.some((r) => isAsyncHook(r)) || isAsyncHook(newResult)) throw new GetAsyncItemFromSyncApiError(id);
		return newResult;
	}
	_get(id, quantityOrLookup, lookUp, withNew) {
		let quantity = Quantity.REQUIRED;
		if (quantityOrLookup === Quantity.REQUIRED || quantityOrLookup === Quantity.OPTIONAL || quantityOrLookup === Quantity.MANY) quantity = quantityOrLookup;
		else lookUp = quantityOrLookup;
		if (!withNew) {
			const cachedResult = this.getValue(id, quantity, lookUp);
			if (cachedResult !== NotInstantiatedSymbol) return cachedResult;
		}
		const shouldCache = !withNew;
		return this.createDependency(id, quantity, lookUp, shouldCache);
	}
	/**
	* Get a dependency in the async way.
	*/
	getAsync(id) {
		this._ensureInjectorNotDisposed();
		const cachedResult = this.getValue(id, Quantity.REQUIRED);
		if (cachedResult !== NotInstantiatedSymbol) return Promise.resolve(cachedResult);
		const newResult = this.createDependency(id, Quantity.REQUIRED);
		if (!isAsyncHook(newResult)) return Promise.resolve(newResult);
		return newResult.whenReady();
	}
	/**
	* Instantiate a class. The created instance would not be held by the injector.
	*/
	createInstance(ctor, ...customArgs) {
		this._ensureInjectorNotDisposed();
		return this._resolveClassImpl({ useClass: ctor }, ...customArgs);
	}
	_resolveDependency(id, item, shouldCache = true) {
		let result;
		pushResolvingStack(id);
		try {
			if (isValueDependencyItem(item)) result = this._resolveValueDependency(id, item);
			else if (isFactoryDependencyItem(item)) result = this._resolveFactory(id, item, shouldCache);
			else if (isClassDependencyItem(item)) result = this._resolveClass(id, item, shouldCache);
			else if (isExistingDependencyItem(item)) result = this._resolveExisting(id, item);
			else result = this._resolveAsync(id, item);
			popupResolvingStack();
		} catch (e) {
			popupResolvingStack();
			throw e;
		}
		return result;
	}
	_resolveExisting(id, item) {
		const thing = this.get(item.useExisting);
		this.resolvedDependencyCollection.add(id, thing);
		return thing;
	}
	_resolveValueDependency(id, item) {
		const thing = item.useValue;
		this.resolvedDependencyCollection.add(id, thing);
		return thing;
	}
	_resolveClass(id, item, shouldCache = true) {
		let thing;
		if (item.lazy) {
			const idle = new IdleValue(() => {
				this._ensureInjectorNotDisposed();
				return this._resolveClassImpl(item);
			});
			thing = new Proxy(Object.create(null), {
				get(target, key) {
					if (key in target) return target[key];
					if (key === "whenReady") return void 0;
					const thing$1 = idle.getValue();
					let property = thing$1[key];
					if (typeof property !== "function") return property;
					property = property.bind(thing$1);
					target[key] = property;
					return property;
				},
				set(_target, key, value) {
					idle.getValue()[key] = value;
					return true;
				}
			});
		} else thing = this._resolveClassImpl(item);
		if (id && shouldCache) this.resolvedDependencyCollection.add(id, thing);
		return thing;
	}
	_resolveClassImpl(item, ...extraParams) {
		const Ctor = item.useClass;
		this.markNewResolution(Ctor);
		const declaredDependencies = getDependencies(Ctor).sort((a, b) => a.paramIndex - b.paramIndex).map((descriptor) => ({
			...descriptor,
			identifier: normalizeForwardRef(descriptor.identifier)
		}));
		const resolvedArgs = [];
		for (const dep of declaredDependencies) try {
			const thing$1 = this._get(dep.identifier, dep.quantity, dep.lookUp, dep.withNew);
			resolvedArgs.push(thing$1);
		} catch (error) {
			if (error instanceof DependencyNotFoundError || error instanceof QuantityCheckError && error.actual === 0) throw new DependencyNotFoundForModuleError(Ctor, dep.identifier, dep.paramIndex);
			throw error;
		}
		let args = [...extraParams];
		const firstDependencyArgIndex = declaredDependencies.length > 0 ? declaredDependencies[0].paramIndex : args.length;
		if (args.length !== firstDependencyArgIndex) {
			console.warn(`[redi]: Expect ${firstDependencyArgIndex} custom parameter(s) of ${prettyPrintIdentifier(Ctor)} but get ${args.length}.`);
			const delta = firstDependencyArgIndex - args.length;
			if (delta > 0) args = [...args, ...Array.from({ length: delta }).fill(void 0)];
			else args = args.slice(0, firstDependencyArgIndex);
		}
		const thing = new Ctor(...args, ...resolvedArgs);
		item?.onInstantiation?.(thing);
		this.markResolutionCompleted();
		return thing;
	}
	_resolveFactory(id, item, shouldCache) {
		this.markNewResolution(id);
		const declaredDependencies = normalizeFactoryDeps(item.deps);
		const resolvedArgs = [];
		for (const dep of declaredDependencies) try {
			const thing$1 = this._get(dep.identifier, dep.quantity, dep.lookUp, dep.withNew);
			resolvedArgs.push(thing$1);
		} catch (error) {
			if (error instanceof DependencyNotFoundError || error instanceof QuantityCheckError && error.actual === 0) throw new DependencyNotFoundForModuleError(id, dep.identifier, dep.paramIndex);
			throw error;
		}
		const thing = item.useFactory.apply(null, resolvedArgs);
		if (shouldCache) this.resolvedDependencyCollection.add(id, thing);
		this.markResolutionCompleted();
		item?.onInstantiation?.(thing);
		return thing;
	}
	_resolveAsync(id, item) {
		const asyncLoader = {
			__symbol: AsyncHookSymbol,
			whenReady: () => this._resolveAsyncImpl(id, item)
		};
		return asyncLoader;
	}
	_resolveAsyncImpl(id, item) {
		return item.useAsync().then((thing) => {
			const resolvedCheck = this.getValue(id);
			if (resolvedCheck !== NotInstantiatedSymbol) return resolvedCheck;
			let ret;
			if (Array.isArray(thing)) {
				const item$1 = thing[1];
				if (isAsyncDependencyItem(item$1)) throw new AsyncItemReturnAsyncItemError(id);
				else ret = this._resolveDependency(id, item$1);
			} else if (isCtor(thing)) ret = this._resolveClassImpl({
				useClass: thing,
				onInstantiation: item.onInstantiation
			});
			else ret = thing;
			this.resolvedDependencyCollection.add(id, ret);
			return ret;
		});
	}
	getValue(id, quantity = Quantity.REQUIRED, lookUp) {
		const onSelf = () => {
			if (this.dependencyCollection.has(id) && !this.resolvedDependencyCollection.has(id)) return NotInstantiatedSymbol;
			return this.resolvedDependencyCollection.get(id, quantity);
		};
		const onParent = () => {
			if (this.parent) return this.parent.getValue(id, quantity);
			else {
				checkQuantity(id, quantity, 0);
				if (quantity === Quantity.MANY) return [];
				else return null;
			}
		};
		if (lookUp === LookUp.SKIP_SELF) return onParent();
		if (id === Injector) return this;
		if (lookUp === LookUp.SELF) return onSelf();
		if (this.resolvedDependencyCollection.has(id) || this.dependencyCollection.has(id)) return onSelf();
		return onParent();
	}
	createDependency(id, quantity = Quantity.REQUIRED, lookUp, shouldCache = true) {
		const onSelf = () => {
			const registrations = this.dependencyCollection.get(id, quantity);
			let ret = null;
			if (Array.isArray(registrations)) ret = registrations.map((dependencyItem) => this._resolveDependency(id, dependencyItem, shouldCache));
			else if (registrations) ret = this._resolveDependency(id, registrations, shouldCache);
			return ret;
		};
		const onParent = () => {
			if (this.parent) return this.parent.createDependency(id, quantity, void 0, shouldCache);
			else {
				if (quantity === Quantity.OPTIONAL) return null;
				pushResolvingStack(id);
				throw new DependencyNotFoundError(id);
			}
		};
		if (lookUp === LookUp.SKIP_SELF) return onParent();
		if (this.dependencyCollection.has(id)) return onSelf();
		return onParent();
	}
	markNewResolution(id) {
		this.resolutionOngoing += 1;
		if (this.resolutionOngoing >= MAX_RESOLUTIONS_QUEUED) throw new CircularDependencyError(id);
	}
	markResolutionCompleted() {
		this.resolutionOngoing -= 1;
	}
	_ensureInjectorNotDisposed() {
		if (this.disposed) throw new InjectorAlreadyDisposedError();
	}
};

//#endregion
//#region src/publicApi.ts
const globalObject = typeof globalThis !== "undefined" && globalThis || typeof window !== "undefined" && window || typeof global !== "undefined" && global;
const __REDI_GLOBAL_LOCK__ = "REDI_GLOBAL_LOCK";
const isNode = typeof process !== "undefined" && process.versions != null && process.versions.node != null;
if (globalObject[__REDI_GLOBAL_LOCK__]) {
	if (!isNode) console.error(`[redi]: You are loading scripts of redi more than once! This may cause undesired behavior in your application.
Maybe your dependencies added redi as its dependency and bundled redi to its dist files. Or you import different versions of redi.
For more info please visit our website: https://redi.wendell.fun/en-US/docs/debug#import-scripts-of-redi-more-than-once`);
} else globalObject[__REDI_GLOBAL_LOCK__] = true;

//#endregion
exports.Inject = Inject;
exports.Injector = Injector;
exports.LookUp = LookUp;
exports.Many = Many;
exports.Optional = Optional;
exports.Quantity = Quantity;
exports.RediError = RediError;
exports.Self = Self;
exports.SkipSelf = SkipSelf;
exports.WithNew = WithNew;
exports.createIdentifier = createIdentifier;
exports.forwardRef = forwardRef;
exports.isAsyncDependencyItem = isAsyncDependencyItem;
exports.isAsyncHook = isAsyncHook;
exports.isClassDependencyItem = isClassDependencyItem;
exports.isCtor = isCtor;
exports.isDisposable = isDisposable;
exports.isFactoryDependencyItem = isFactoryDependencyItem;
exports.isValueDependencyItem = isValueDependencyItem;
exports.setDependencies = setDependencies;
});
//# sourceMappingURL=index.js.map