// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"uTT0":[function(require,module,exports) {
'use strict';

var toStr = Object.prototype.toString;

module.exports = function isArguments(value) {
  var str = toStr.call(value);
  var isArgs = str === '[object Arguments]';

  if (!isArgs) {
    isArgs = str !== '[object Array]' && value !== null && typeof value === 'object' && typeof value.length === 'number' && value.length >= 0 && toStr.call(value.callee) === '[object Function]';
  }

  return isArgs;
};
},{}],"orz8":[function(require,module,exports) {
'use strict';

var keysShim;

if (!Object.keys) {
  // modified from https://github.com/es-shims/es5-shim
  var has = Object.prototype.hasOwnProperty;
  var toStr = Object.prototype.toString;

  var isArgs = require('./isArguments'); // eslint-disable-line global-require


  var isEnumerable = Object.prototype.propertyIsEnumerable;
  var hasDontEnumBug = !isEnumerable.call({
    toString: null
  }, 'toString');
  var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
  var dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];

  var equalsConstructorPrototype = function (o) {
    var ctor = o.constructor;
    return ctor && ctor.prototype === o;
  };

  var excludedKeys = {
    $applicationCache: true,
    $console: true,
    $external: true,
    $frame: true,
    $frameElement: true,
    $frames: true,
    $innerHeight: true,
    $innerWidth: true,
    $onmozfullscreenchange: true,
    $onmozfullscreenerror: true,
    $outerHeight: true,
    $outerWidth: true,
    $pageXOffset: true,
    $pageYOffset: true,
    $parent: true,
    $scrollLeft: true,
    $scrollTop: true,
    $scrollX: true,
    $scrollY: true,
    $self: true,
    $webkitIndexedDB: true,
    $webkitStorageInfo: true,
    $window: true
  };

  var hasAutomationEqualityBug = function () {
    /* global window */
    if (typeof window === 'undefined') {
      return false;
    }

    for (var k in window) {
      try {
        if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
          try {
            equalsConstructorPrototype(window[k]);
          } catch (e) {
            return true;
          }
        }
      } catch (e) {
        return true;
      }
    }

    return false;
  }();

  var equalsConstructorPrototypeIfNotBuggy = function (o) {
    /* global window */
    if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
      return equalsConstructorPrototype(o);
    }

    try {
      return equalsConstructorPrototype(o);
    } catch (e) {
      return false;
    }
  };

  keysShim = function keys(object) {
    var isObject = object !== null && typeof object === 'object';
    var isFunction = toStr.call(object) === '[object Function]';
    var isArguments = isArgs(object);
    var isString = isObject && toStr.call(object) === '[object String]';
    var theKeys = [];

    if (!isObject && !isFunction && !isArguments) {
      throw new TypeError('Object.keys called on a non-object');
    }

    var skipProto = hasProtoEnumBug && isFunction;

    if (isString && object.length > 0 && !has.call(object, 0)) {
      for (var i = 0; i < object.length; ++i) {
        theKeys.push(String(i));
      }
    }

    if (isArguments && object.length > 0) {
      for (var j = 0; j < object.length; ++j) {
        theKeys.push(String(j));
      }
    } else {
      for (var name in object) {
        if (!(skipProto && name === 'prototype') && has.call(object, name)) {
          theKeys.push(String(name));
        }
      }
    }

    if (hasDontEnumBug) {
      var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

      for (var k = 0; k < dontEnums.length; ++k) {
        if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
          theKeys.push(dontEnums[k]);
        }
      }
    }

    return theKeys;
  };
}

module.exports = keysShim;
},{"./isArguments":"uTT0"}],"ywQn":[function(require,module,exports) {
'use strict';

var slice = Array.prototype.slice;

var isArgs = require('./isArguments');

var origKeys = Object.keys;
var keysShim = origKeys ? function keys(o) {
  return origKeys(o);
} : require('./implementation');
var originalKeys = Object.keys;

keysShim.shim = function shimObjectKeys() {
  if (Object.keys) {
    var keysWorksWithArguments = function () {
      // Safari 5.0 bug
      var args = Object.keys(arguments);
      return args && args.length === arguments.length;
    }(1, 2);

    if (!keysWorksWithArguments) {
      Object.keys = function keys(object) {
        // eslint-disable-line func-name-matching
        if (isArgs(object)) {
          return originalKeys(slice.call(object));
        }

        return originalKeys(object);
      };
    }
  } else {
    Object.keys = keysShim;
  }

  return Object.keys || keysShim;
};

module.exports = keysShim;
},{"./isArguments":"uTT0","./implementation":"orz8"}],"VxKF":[function(require,module,exports) {
'use strict';

var keys = require('object-keys');

var hasSymbols = typeof Symbol === 'function' && typeof Symbol('foo') === 'symbol';
var toStr = Object.prototype.toString;
var concat = Array.prototype.concat;
var origDefineProperty = Object.defineProperty;

var isFunction = function (fn) {
  return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
};

var arePropertyDescriptorsSupported = function () {
  var obj = {};

  try {
    origDefineProperty(obj, 'x', {
      enumerable: false,
      value: obj
    }); // eslint-disable-next-line no-unused-vars, no-restricted-syntax

    for (var _ in obj) {
      // jscs:ignore disallowUnusedVariables
      return false;
    }

    return obj.x === obj;
  } catch (e) {
    /* this is IE 8. */
    return false;
  }
};

var supportsDescriptors = origDefineProperty && arePropertyDescriptorsSupported();

var defineProperty = function (object, name, value, predicate) {
  if (name in object && (!isFunction(predicate) || !predicate())) {
    return;
  }

  if (supportsDescriptors) {
    origDefineProperty(object, name, {
      configurable: true,
      enumerable: false,
      value: value,
      writable: true
    });
  } else {
    object[name] = value;
  }
};

var defineProperties = function (object, map) {
  var predicates = arguments.length > 2 ? arguments[2] : {};
  var props = keys(map);

  if (hasSymbols) {
    props = concat.call(props, Object.getOwnPropertySymbols(map));
  }

  for (var i = 0; i < props.length; i += 1) {
    defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
  }
};

defineProperties.supportsDescriptors = !!supportsDescriptors;
module.exports = defineProperties;
},{"object-keys":"ywQn"}],"jYt2":[function(require,module,exports) {
'use strict';
/* eslint complexity: [2, 18], max-statements: [2, 33] */

module.exports = function hasSymbols() {
  if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') {
    return false;
  }

  if (typeof Symbol.iterator === 'symbol') {
    return true;
  }

  var obj = {};
  var sym = Symbol('test');
  var symObj = Object(sym);

  if (typeof sym === 'string') {
    return false;
  }

  if (Object.prototype.toString.call(sym) !== '[object Symbol]') {
    return false;
  }

  if (Object.prototype.toString.call(symObj) !== '[object Symbol]') {
    return false;
  } // temp disabled per https://github.com/ljharb/object.assign/issues/17
  // if (sym instanceof Symbol) { return false; }
  // temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
  // if (!(symObj instanceof Symbol)) { return false; }
  // if (typeof Symbol.prototype.toString !== 'function') { return false; }
  // if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }


  var symVal = 42;
  obj[sym] = symVal;

  for (sym in obj) {
    return false;
  } // eslint-disable-line no-restricted-syntax


  if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) {
    return false;
  }

  if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) {
    return false;
  }

  var syms = Object.getOwnPropertySymbols(obj);

  if (syms.length !== 1 || syms[0] !== sym) {
    return false;
  }

  if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
    return false;
  }

  if (typeof Object.getOwnPropertyDescriptor === 'function') {
    var descriptor = Object.getOwnPropertyDescriptor(obj, sym);

    if (descriptor.value !== symVal || descriptor.enumerable !== true) {
      return false;
    }
  }

  return true;
};
},{}],"NS5K":[function(require,module,exports) {
var global = arguments[3];
'use strict';

var origSymbol = global.Symbol;

var hasSymbolSham = require('./shams');

module.exports = function hasNativeSymbols() {
  if (typeof origSymbol !== 'function') {
    return false;
  }

  if (typeof Symbol !== 'function') {
    return false;
  }

  if (typeof origSymbol('foo') !== 'symbol') {
    return false;
  }

  if (typeof Symbol('bar') !== 'symbol') {
    return false;
  }

  return hasSymbolSham();
};
},{"./shams":"jYt2"}],"B6OE":[function(require,module,exports) {
'use strict';

/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

},{}],"TiwC":[function(require,module,exports) {
'use strict';

var implementation = require('./implementation');

module.exports = Function.prototype.bind || implementation;

},{"./implementation":"B6OE"}],"LENn":[function(require,module,exports) {
'use strict';
/* globals
	Atomics,
	SharedArrayBuffer,
*/

var undefined;
var $TypeError = TypeError;
var $gOPD = Object.getOwnPropertyDescriptor;

if ($gOPD) {
  try {
    $gOPD({}, '');
  } catch (e) {
    $gOPD = null; // this is IE 8, which has a broken gOPD
  }
}

var throwTypeError = function () {
  throw new $TypeError();
};

var ThrowTypeError = $gOPD ? function () {
  try {
    // eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
    arguments.callee; // IE 8 does not throw here

    return throwTypeError;
  } catch (calleeThrows) {
    try {
      // IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
      return $gOPD(arguments, 'callee').get;
    } catch (gOPDthrows) {
      return throwTypeError;
    }
  }
}() : throwTypeError;

var hasSymbols = require('has-symbols')();

var getProto = Object.getPrototypeOf || function (x) {
  return x.__proto__;
}; // eslint-disable-line no-proto


var generator; // = function * () {};

var generatorFunction = generator ? getProto(generator) : undefined;
var asyncFn; // async function() {};

var asyncFunction = asyncFn ? asyncFn.constructor : undefined;
var asyncGen; // async function * () {};

var asyncGenFunction = asyncGen ? getProto(asyncGen) : undefined;
var asyncGenIterator = asyncGen ? asyncGen() : undefined;
var TypedArray = typeof Uint8Array === 'undefined' ? undefined : getProto(Uint8Array);
var INTRINSICS = {
  '%Array%': Array,
  '%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
  '%ArrayBufferPrototype%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer.prototype,
  '%ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined,
  '%ArrayPrototype%': Array.prototype,
  '%ArrayProto_entries%': Array.prototype.entries,
  '%ArrayProto_forEach%': Array.prototype.forEach,
  '%ArrayProto_keys%': Array.prototype.keys,
  '%ArrayProto_values%': Array.prototype.values,
  '%AsyncFromSyncIteratorPrototype%': undefined,
  '%AsyncFunction%': asyncFunction,
  '%AsyncFunctionPrototype%': asyncFunction ? asyncFunction.prototype : undefined,
  '%AsyncGenerator%': asyncGen ? getProto(asyncGenIterator) : undefined,
  '%AsyncGeneratorFunction%': asyncGenFunction,
  '%AsyncGeneratorPrototype%': asyncGenFunction ? asyncGenFunction.prototype : undefined,
  '%AsyncIteratorPrototype%': asyncGenIterator && hasSymbols && Symbol.asyncIterator ? asyncGenIterator[Symbol.asyncIterator]() : undefined,
  '%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
  '%Boolean%': Boolean,
  '%BooleanPrototype%': Boolean.prototype,
  '%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
  '%DataViewPrototype%': typeof DataView === 'undefined' ? undefined : DataView.prototype,
  '%Date%': Date,
  '%DatePrototype%': Date.prototype,
  '%decodeURI%': decodeURI,
  '%decodeURIComponent%': decodeURIComponent,
  '%encodeURI%': encodeURI,
  '%encodeURIComponent%': encodeURIComponent,
  '%Error%': Error,
  '%ErrorPrototype%': Error.prototype,
  '%eval%': eval,
  // eslint-disable-line no-eval
  '%EvalError%': EvalError,
  '%EvalErrorPrototype%': EvalError.prototype,
  '%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
  '%Float32ArrayPrototype%': typeof Float32Array === 'undefined' ? undefined : Float32Array.prototype,
  '%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
  '%Float64ArrayPrototype%': typeof Float64Array === 'undefined' ? undefined : Float64Array.prototype,
  '%Function%': Function,
  '%FunctionPrototype%': Function.prototype,
  '%Generator%': generator ? getProto(generator()) : undefined,
  '%GeneratorFunction%': generatorFunction,
  '%GeneratorPrototype%': generatorFunction ? generatorFunction.prototype : undefined,
  '%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
  '%Int8ArrayPrototype%': typeof Int8Array === 'undefined' ? undefined : Int8Array.prototype,
  '%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
  '%Int16ArrayPrototype%': typeof Int16Array === 'undefined' ? undefined : Int8Array.prototype,
  '%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
  '%Int32ArrayPrototype%': typeof Int32Array === 'undefined' ? undefined : Int32Array.prototype,
  '%isFinite%': isFinite,
  '%isNaN%': isNaN,
  '%IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,
  '%JSON%': typeof JSON === 'object' ? JSON : undefined,
  '%JSONParse%': typeof JSON === 'object' ? JSON.parse : undefined,
  '%Map%': typeof Map === 'undefined' ? undefined : Map,
  '%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),
  '%MapPrototype%': typeof Map === 'undefined' ? undefined : Map.prototype,
  '%Math%': Math,
  '%Number%': Number,
  '%NumberPrototype%': Number.prototype,
  '%Object%': Object,
  '%ObjectPrototype%': Object.prototype,
  '%ObjProto_toString%': Object.prototype.toString,
  '%ObjProto_valueOf%': Object.prototype.valueOf,
  '%parseFloat%': parseFloat,
  '%parseInt%': parseInt,
  '%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
  '%PromisePrototype%': typeof Promise === 'undefined' ? undefined : Promise.prototype,
  '%PromiseProto_then%': typeof Promise === 'undefined' ? undefined : Promise.prototype.then,
  '%Promise_all%': typeof Promise === 'undefined' ? undefined : Promise.all,
  '%Promise_reject%': typeof Promise === 'undefined' ? undefined : Promise.reject,
  '%Promise_resolve%': typeof Promise === 'undefined' ? undefined : Promise.resolve,
  '%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
  '%RangeError%': RangeError,
  '%RangeErrorPrototype%': RangeError.prototype,
  '%ReferenceError%': ReferenceError,
  '%ReferenceErrorPrototype%': ReferenceError.prototype,
  '%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
  '%RegExp%': RegExp,
  '%RegExpPrototype%': RegExp.prototype,
  '%Set%': typeof Set === 'undefined' ? undefined : Set,
  '%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),
  '%SetPrototype%': typeof Set === 'undefined' ? undefined : Set.prototype,
  '%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
  '%SharedArrayBufferPrototype%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer.prototype,
  '%String%': String,
  '%StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined,
  '%StringPrototype%': String.prototype,
  '%Symbol%': hasSymbols ? Symbol : undefined,
  '%SymbolPrototype%': hasSymbols ? Symbol.prototype : undefined,
  '%SyntaxError%': SyntaxError,
  '%SyntaxErrorPrototype%': SyntaxError.prototype,
  '%ThrowTypeError%': ThrowTypeError,
  '%TypedArray%': TypedArray,
  '%TypedArrayPrototype%': TypedArray ? TypedArray.prototype : undefined,
  '%TypeError%': $TypeError,
  '%TypeErrorPrototype%': $TypeError.prototype,
  '%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
  '%Uint8ArrayPrototype%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array.prototype,
  '%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
  '%Uint8ClampedArrayPrototype%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray.prototype,
  '%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
  '%Uint16ArrayPrototype%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array.prototype,
  '%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
  '%Uint32ArrayPrototype%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array.prototype,
  '%URIError%': URIError,
  '%URIErrorPrototype%': URIError.prototype,
  '%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
  '%WeakMapPrototype%': typeof WeakMap === 'undefined' ? undefined : WeakMap.prototype,
  '%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet,
  '%WeakSetPrototype%': typeof WeakSet === 'undefined' ? undefined : WeakSet.prototype
};

var bind = require('function-bind');

var $replace = bind.call(Function.call, String.prototype.replace);
/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */

var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g;
/** Used to match backslashes in property paths. */

var stringToPath = function stringToPath(string) {
  var result = [];
  $replace(string, rePropName, function (match, number, quote, subString) {
    result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
  });
  return result;
};
/* end adaptation */


var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
  if (!(name in INTRINSICS)) {
    throw new SyntaxError('intrinsic ' + name + ' does not exist!');
  } // istanbul ignore if // hopefully this is impossible to test :-)


  if (typeof INTRINSICS[name] === 'undefined' && !allowMissing) {
    throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
  }

  return INTRINSICS[name];
};

module.exports = function GetIntrinsic(name, allowMissing) {
  if (typeof name !== 'string' || name.length === 0) {
    throw new TypeError('intrinsic name must be a non-empty string');
  }

  if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
    throw new TypeError('"allowMissing" argument must be a boolean');
  }

  var parts = stringToPath(name);
  var value = getBaseIntrinsic('%' + (parts.length > 0 ? parts[0] : '') + '%', allowMissing);

  for (var i = 1; i < parts.length; i += 1) {
    if (value != null) {
      if ($gOPD && i + 1 >= parts.length) {
        var desc = $gOPD(value, parts[i]);

        if (!allowMissing && !(parts[i] in value)) {
          throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
        } // By convention, when a data property is converted to an accessor
        // property to emulate a data property that does not suffer from
        // the override mistake, that accessor's getter is marked with
        // an `originalValue` property. Here, when we detect this, we
        // uphold the illusion by pretending to see that original data
        // property, i.e., returning the value rather than the getter
        // itself.


        value = desc && 'get' in desc && !('originalValue' in desc.get) ? desc.get : value[parts[i]];
      } else {
        value = value[parts[i]];
      }
    }
  }

  return value;
};
},{"has-symbols":"NS5K","function-bind":"TiwC"}],"ITpX":[function(require,module,exports) {
'use strict';

var bind = require('function-bind');

var GetIntrinsic = require('../GetIntrinsic');

var $apply = GetIntrinsic('%Function.prototype.apply%');
var $call = GetIntrinsic('%Function.prototype.call%');
var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);
var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);

if ($defineProperty) {
  try {
    $defineProperty({}, 'a', {
      value: 1
    });
  } catch (e) {
    // IE 8 has a broken defineProperty
    $defineProperty = null;
  }
}

module.exports = function callBind() {
  return $reflectApply(bind, $call, arguments);
};

var applyBind = function applyBind() {
  return $reflectApply(bind, $apply, arguments);
};

if ($defineProperty) {
  $defineProperty(module.exports, 'apply', {
    value: applyBind
  });
} else {
  module.exports.apply = applyBind;
}
},{"function-bind":"TiwC","../GetIntrinsic":"LENn"}],"rAXm":[function(require,module,exports) {
'use strict';

var GetIntrinsic = require('../GetIntrinsic');

var callBind = require('./callBind');

var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

module.exports = function callBoundIntrinsic(name, allowMissing) {
  var intrinsic = GetIntrinsic(name, !!allowMissing);

  if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.')) {
    return callBind(intrinsic);
  }

  return intrinsic;
};
},{"../GetIntrinsic":"LENn","./callBind":"ITpX"}],"pbtM":[function(require,module,exports) {
'use strict';

var GetIntrinsic = require('../GetIntrinsic');

var callBound = require('../helpers/callBound');

var $apply = GetIntrinsic('%Reflect.apply%', true) || callBound('%Function.prototype.apply%'); // https://www.ecma-international.org/ecma-262/6.0/#sec-call

module.exports = function Call(F, V) {
  var args = arguments.length > 2 ? arguments[2] : [];
  return $apply(F, V, args);
};
},{"../GetIntrinsic":"LENn","../helpers/callBound":"rAXm"}],"qut1":[function(require,module,exports) {
'use strict';

var GetIntrinsic = require('../GetIntrinsic');

var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);

if ($defineProperty) {
  try {
    $defineProperty({}, 'a', {
      value: 1
    });
  } catch (e) {
    // IE 8 has a broken defineProperty
    $defineProperty = null;
  }
}

var callBound = require('../helpers/callBound');

var $isEnumerable = callBound('Object.prototype.propertyIsEnumerable'); // eslint-disable-next-line max-params

module.exports = function DefineOwnProperty(IsDataDescriptor, SameValue, FromPropertyDescriptor, O, P, desc) {
  if (!$defineProperty) {
    if (!IsDataDescriptor(desc)) {
      // ES3 does not support getters/setters
      return false;
    }

    if (!desc['[[Configurable]]'] || !desc['[[Writable]]']) {
      return false;
    } // fallback for ES3


    if (P in O && $isEnumerable(O, P) !== !!desc['[[Enumerable]]']) {
      // a non-enumerable existing property
      return false;
    } // property does not exist at all, or exists but is enumerable


    var V = desc['[[Value]]']; // eslint-disable-next-line no-param-reassign

    O[P] = V; // will use [[Define]]

    return SameValue(O[P], V);
  }

  $defineProperty(O, P, FromPropertyDescriptor(desc));
  return true;
};
},{"../GetIntrinsic":"LENn","../helpers/callBound":"rAXm"}],"ar57":[function(require,module,exports) {
'use strict';

var bind = require('function-bind');

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);
},{"function-bind":"TiwC"}],"mBar":[function(require,module,exports) {
'use strict';

var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');
var $SyntaxError = GetIntrinsic('%SyntaxError%');

var has = require('has');

var predicates = {
  // https://ecma-international.org/ecma-262/6.0/#sec-property-descriptor-specification-type
  'Property Descriptor': function isPropertyDescriptor(Type, Desc) {
    if (Type(Desc) !== 'Object') {
      return false;
    }

    var allowed = {
      '[[Configurable]]': true,
      '[[Enumerable]]': true,
      '[[Get]]': true,
      '[[Set]]': true,
      '[[Value]]': true,
      '[[Writable]]': true
    };

    for (var key in Desc) {
      // eslint-disable-line
      if (has(Desc, key) && !allowed[key]) {
        return false;
      }
    }

    var isData = has(Desc, '[[Value]]');
    var IsAccessor = has(Desc, '[[Get]]') || has(Desc, '[[Set]]');

    if (isData && IsAccessor) {
      throw new $TypeError('Property Descriptors may not be both accessor and data descriptors');
    }

    return true;
  }
};

module.exports = function assertRecord(Type, recordType, argumentName, value) {
  var predicate = predicates[recordType];

  if (typeof predicate !== 'function') {
    throw new $SyntaxError('unknown record type: ' + recordType);
  }

  if (!predicate(Type, value)) {
    throw new $TypeError(argumentName + ' must be a ' + recordType);
  }
};
},{"../GetIntrinsic":"LENn","has":"ar57"}],"P2le":[function(require,module,exports) {
'use strict'; // https://www.ecma-international.org/ecma-262/5.1/#sec-8

module.exports = function Type(x) {
  if (x === null) {
    return 'Null';
  }

  if (typeof x === 'undefined') {
    return 'Undefined';
  }

  if (typeof x === 'function' || typeof x === 'object') {
    return 'Object';
  }

  if (typeof x === 'number') {
    return 'Number';
  }

  if (typeof x === 'boolean') {
    return 'Boolean';
  }

  if (typeof x === 'string') {
    return 'String';
  }
};
},{}],"QalR":[function(require,module,exports) {
'use strict';

var ES5Type = require('../5/Type'); // https://ecma-international.org/ecma-262/6.0/#sec-ecmascript-data-types-and-values


module.exports = function Type(x) {
  if (typeof x === 'symbol') {
    return 'Symbol';
  }

  return ES5Type(x);
};
},{"../5/Type":"P2le"}],"k6iA":[function(require,module,exports) {
'use strict';

var assertRecord = require('../helpers/assertRecord');

var Type = require('./Type'); // https://www.ecma-international.org/ecma-262/6.0/#sec-frompropertydescriptor


module.exports = function FromPropertyDescriptor(Desc) {
  if (typeof Desc === 'undefined') {
    return Desc;
  }

  assertRecord(Type, 'Property Descriptor', 'Desc', Desc);
  var obj = {};

  if ('[[Value]]' in Desc) {
    obj.value = Desc['[[Value]]'];
  }

  if ('[[Writable]]' in Desc) {
    obj.writable = Desc['[[Writable]]'];
  }

  if ('[[Get]]' in Desc) {
    obj.get = Desc['[[Get]]'];
  }

  if ('[[Set]]' in Desc) {
    obj.set = Desc['[[Set]]'];
  }

  if ('[[Enumerable]]' in Desc) {
    obj.enumerable = Desc['[[Enumerable]]'];
  }

  if ('[[Configurable]]' in Desc) {
    obj.configurable = Desc['[[Configurable]]'];
  }

  return obj;
};
},{"../helpers/assertRecord":"mBar","./Type":"QalR"}],"H5HI":[function(require,module,exports) {
'use strict';

var GetIntrinsic = require('../GetIntrinsic');

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%');

if ($gOPD) {
  try {
    $gOPD([], 'length');
  } catch (e) {
    // IE 8 has a broken gOPD
    $gOPD = null;
  }
}

module.exports = $gOPD;
},{"../GetIntrinsic":"LENn"}],"jFZi":[function(require,module,exports) {
'use strict';

var GetIntrinsic = require('../GetIntrinsic');

var $Array = GetIntrinsic('%Array%'); // eslint-disable-next-line global-require

var toStr = !$Array.isArray && require('../helpers/callBound')('Object.prototype.toString'); // https://www.ecma-international.org/ecma-262/6.0/#sec-isarray


module.exports = $Array.isArray || function IsArray(argument) {
  return toStr(argument) === '[object Array]';
};
},{"../GetIntrinsic":"LENn","../helpers/callBound":"rAXm"}],"mmlB":[function(require,module,exports) {
'use strict'; // https://www.ecma-international.org/ecma-262/6.0/#sec-ispropertykey

module.exports = function IsPropertyKey(argument) {
  return typeof argument === 'string' || typeof argument === 'symbol';
};
},{}],"DhUb":[function(require,module,exports) {
'use strict';

var hasSymbols = require('has-symbols')();

var hasToStringTag = hasSymbols && typeof Symbol.toStringTag === 'symbol';
var hasOwnProperty;
var regexExec;
var isRegexMarker;
var badStringifier;

if (hasToStringTag) {
  hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
  regexExec = Function.call.bind(RegExp.prototype.exec);
  isRegexMarker = {};

  var throwRegexMarker = function () {
    throw isRegexMarker;
  };

  badStringifier = {
    toString: throwRegexMarker,
    valueOf: throwRegexMarker
  };

  if (typeof Symbol.toPrimitive === 'symbol') {
    badStringifier[Symbol.toPrimitive] = throwRegexMarker;
  }
}

var toStr = Object.prototype.toString;
var gOPD = Object.getOwnPropertyDescriptor;
var regexClass = '[object RegExp]';
module.exports = hasToStringTag // eslint-disable-next-line consistent-return
? function isRegex(value) {
  if (!value || typeof value !== 'object') {
    return false;
  }

  var descriptor = gOPD(value, 'lastIndex');
  var hasLastIndexDataProperty = descriptor && hasOwnProperty(descriptor, 'value');

  if (!hasLastIndexDataProperty) {
    return false;
  }

  try {
    regexExec(value, badStringifier);
  } catch (e) {
    return e === isRegexMarker;
  }
} : function isRegex(value) {
  // In older browsers, typeof regex incorrectly returns 'function'
  if (!value || typeof value !== 'object' && typeof value !== 'function') {
    return false;
  }

  return toStr.call(value) === regexClass;
};
},{"has-symbols":"NS5K"}],"Kfog":[function(require,module,exports) {
'use strict'; // http://www.ecma-international.org/ecma-262/5.1/#sec-9.2

module.exports = function ToBoolean(value) {
  return !!value;
};
},{}],"xUda":[function(require,module,exports) {
'use strict';

var GetIntrinsic = require('../GetIntrinsic');

var $match = GetIntrinsic('%Symbol.match%', true);

var hasRegExpMatcher = require('is-regex');

var ToBoolean = require('./ToBoolean'); // https://ecma-international.org/ecma-262/6.0/#sec-isregexp


module.exports = function IsRegExp(argument) {
  if (!argument || typeof argument !== 'object') {
    return false;
  }

  if ($match) {
    var isRegExp = argument[$match];

    if (typeof isRegExp !== 'undefined') {
      return ToBoolean(isRegExp);
    }
  }

  return hasRegExpMatcher(argument);
};
},{"../GetIntrinsic":"LENn","is-regex":"DhUb","./ToBoolean":"Kfog"}],"b4C7":[function(require,module,exports) {
'use strict';

var fnToStr = Function.prototype.toString;
var reflectApply = typeof Reflect === 'object' && Reflect !== null && Reflect.apply;
var badArrayLike;
var isCallableMarker;

if (typeof reflectApply === 'function' && typeof Object.defineProperty === 'function') {
  try {
    badArrayLike = Object.defineProperty({}, 'length', {
      get: function () {
        throw isCallableMarker;
      }
    });
    isCallableMarker = {}; // eslint-disable-next-line no-throw-literal

    reflectApply(function () {
      throw 42;
    }, null, badArrayLike);
  } catch (_) {
    if (_ !== isCallableMarker) {
      reflectApply = null;
    }
  }
} else {
  reflectApply = null;
}

var constructorRegex = /^\s*class\b/;

var isES6ClassFn = function isES6ClassFunction(value) {
  try {
    var fnStr = fnToStr.call(value);
    return constructorRegex.test(fnStr);
  } catch (e) {
    return false; // not a function
  }
};

var tryFunctionObject = function tryFunctionToStr(value) {
  try {
    if (isES6ClassFn(value)) {
      return false;
    }

    fnToStr.call(value);
    return true;
  } catch (e) {
    return false;
  }
};

var toStr = Object.prototype.toString;
var fnClass = '[object Function]';
var genClass = '[object GeneratorFunction]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
module.exports = reflectApply ? function isCallable(value) {
  if (!value) {
    return false;
  }

  if (typeof value !== 'function' && typeof value !== 'object') {
    return false;
  }

  if (typeof value === 'function' && !value.prototype) {
    return true;
  }

  try {
    reflectApply(value, null, badArrayLike);
  } catch (e) {
    if (e !== isCallableMarker) {
      return false;
    }
  }

  return !isES6ClassFn(value);
} : function isCallable(value) {
  if (!value) {
    return false;
  }

  if (typeof value !== 'function' && typeof value !== 'object') {
    return false;
  }

  if (typeof value === 'function' && !value.prototype) {
    return true;
  }

  if (hasToStringTag) {
    return tryFunctionObject(value);
  }

  if (isES6ClassFn(value)) {
    return false;
  }

  var strClass = toStr.call(value);
  return strClass === fnClass || strClass === genClass;
};
},{}],"kdXM":[function(require,module,exports) {
'use strict'; // http://www.ecma-international.org/ecma-262/5.1/#sec-9.11

module.exports = require('is-callable');
},{"is-callable":"b4C7"}],"M3Zt":[function(require,module,exports) {
'use strict';

var has = require('has');

var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Type = require('./Type');

var ToBoolean = require('./ToBoolean');

var IsCallable = require('./IsCallable'); // https://ecma-international.org/ecma-262/5.1/#sec-8.10.5


module.exports = function ToPropertyDescriptor(Obj) {
  if (Type(Obj) !== 'Object') {
    throw new $TypeError('ToPropertyDescriptor requires an object');
  }

  var desc = {};

  if (has(Obj, 'enumerable')) {
    desc['[[Enumerable]]'] = ToBoolean(Obj.enumerable);
  }

  if (has(Obj, 'configurable')) {
    desc['[[Configurable]]'] = ToBoolean(Obj.configurable);
  }

  if (has(Obj, 'value')) {
    desc['[[Value]]'] = Obj.value;
  }

  if (has(Obj, 'writable')) {
    desc['[[Writable]]'] = ToBoolean(Obj.writable);
  }

  if (has(Obj, 'get')) {
    var getter = Obj.get;

    if (typeof getter !== 'undefined' && !IsCallable(getter)) {
      throw new $TypeError('getter must be a function');
    }

    desc['[[Get]]'] = getter;
  }

  if (has(Obj, 'set')) {
    var setter = Obj.set;

    if (typeof setter !== 'undefined' && !IsCallable(setter)) {
      throw new $TypeError('setter must be a function');
    }

    desc['[[Set]]'] = setter;
  }

  if ((has(desc, '[[Get]]') || has(desc, '[[Set]]')) && (has(desc, '[[Value]]') || has(desc, '[[Writable]]'))) {
    throw new $TypeError('Invalid property descriptor. Cannot both specify accessors and a value or writable attribute');
  }

  return desc;
};
},{"has":"ar57","../GetIntrinsic":"LENn","./Type":"QalR","./ToBoolean":"Kfog","./IsCallable":"kdXM"}],"HKIH":[function(require,module,exports) {
'use strict';

var GetIntrinsic = require('../GetIntrinsic');

var $gOPD = require('../helpers/getOwnPropertyDescriptor');

var $TypeError = GetIntrinsic('%TypeError%');

var callBound = require('../helpers/callBound');

var $isEnumerable = callBound('Object.prototype.propertyIsEnumerable');

var has = require('has');

var IsArray = require('./IsArray');

var IsPropertyKey = require('./IsPropertyKey');

var IsRegExp = require('./IsRegExp');

var ToPropertyDescriptor = require('./ToPropertyDescriptor');

var Type = require('./Type'); // https://www.ecma-international.org/ecma-262/6.0/#sec-ordinarygetownproperty


module.exports = function OrdinaryGetOwnProperty(O, P) {
  if (Type(O) !== 'Object') {
    throw new $TypeError('Assertion failed: O must be an Object');
  }

  if (!IsPropertyKey(P)) {
    throw new $TypeError('Assertion failed: P must be a Property Key');
  }

  if (!has(O, P)) {
    return void 0;
  }

  if (!$gOPD) {
    // ES3 / IE 8 fallback
    var arrayLength = IsArray(O) && P === 'length';
    var regexLastIndex = IsRegExp(O) && P === 'lastIndex';
    return {
      '[[Configurable]]': !(arrayLength || regexLastIndex),
      '[[Enumerable]]': $isEnumerable(O, P),
      '[[Value]]': O[P],
      '[[Writable]]': true
    };
  }

  return ToPropertyDescriptor($gOPD(O, P));
};
},{"../GetIntrinsic":"LENn","../helpers/getOwnPropertyDescriptor":"H5HI","../helpers/callBound":"rAXm","has":"ar57","./IsArray":"jFZi","./IsPropertyKey":"mmlB","./IsRegExp":"xUda","./ToPropertyDescriptor":"M3Zt","./Type":"QalR"}],"Ragd":[function(require,module,exports) {
'use strict';

var has = require('has');

var assertRecord = require('../helpers/assertRecord');

var Type = require('./Type'); // https://www.ecma-international.org/ecma-262/6.0/#sec-isdatadescriptor


module.exports = function IsDataDescriptor(Desc) {
  if (typeof Desc === 'undefined') {
    return false;
  }

  assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

  if (!has(Desc, '[[Value]]') && !has(Desc, '[[Writable]]')) {
    return false;
  }

  return true;
};
},{"has":"ar57","../helpers/assertRecord":"mBar","./Type":"QalR"}],"T9JR":[function(require,module,exports) {
'use strict';

module.exports = function isPrimitive(value) {
  return value === null || typeof value !== 'function' && typeof value !== 'object';
};
},{}],"qFre":[function(require,module,exports) {
'use strict';

var GetIntrinsic = require('../GetIntrinsic');

var $Object = GetIntrinsic('%Object%');

var isPrimitive = require('../helpers/isPrimitive');

var $preventExtensions = $Object.preventExtensions;
var $isExtensible = $Object.isExtensible; // https://www.ecma-international.org/ecma-262/6.0/#sec-isextensible-o

module.exports = $preventExtensions ? function IsExtensible(obj) {
  return !isPrimitive(obj) && $isExtensible(obj);
} : function IsExtensible(obj) {
  return !isPrimitive(obj);
};
},{"../GetIntrinsic":"LENn","../helpers/isPrimitive":"T9JR"}],"TD7O":[function(require,module,exports) {
'use strict';

module.exports = Number.isNaN || function isNaN(a) {
  return a !== a;
};
},{}],"ZH9I":[function(require,module,exports) {
'use strict';

var $isNaN = require('../helpers/isNaN'); // http://www.ecma-international.org/ecma-262/5.1/#sec-9.12


module.exports = function SameValue(x, y) {
  if (x === y) {
    // 0 === -0, but they are not identical.
    if (x === 0) {
      return 1 / x === 1 / y;
    }

    return true;
  }

  return $isNaN(x) && $isNaN(y);
};
},{"../helpers/isNaN":"TD7O"}],"dFpr":[function(require,module,exports) {
'use strict';

var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var DefineOwnProperty = require('../helpers/DefineOwnProperty');

var FromPropertyDescriptor = require('./FromPropertyDescriptor');

var OrdinaryGetOwnProperty = require('./OrdinaryGetOwnProperty');

var IsDataDescriptor = require('./IsDataDescriptor');

var IsExtensible = require('./IsExtensible');

var IsPropertyKey = require('./IsPropertyKey');

var SameValue = require('./SameValue');

var Type = require('./Type'); // https://www.ecma-international.org/ecma-262/6.0/#sec-createdataproperty


module.exports = function CreateDataProperty(O, P, V) {
  if (Type(O) !== 'Object') {
    throw new $TypeError('Assertion failed: Type(O) is not Object');
  }

  if (!IsPropertyKey(P)) {
    throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
  }

  var oldDesc = OrdinaryGetOwnProperty(O, P);
  var extensible = !oldDesc || IsExtensible(O);
  var immutable = oldDesc && (!oldDesc['[[Writable]]'] || !oldDesc['[[Configurable]]']);

  if (immutable || !extensible) {
    return false;
  }

  return DefineOwnProperty(IsDataDescriptor, SameValue, FromPropertyDescriptor, O, P, {
    '[[Configurable]]': true,
    '[[Enumerable]]': true,
    '[[Value]]': V,
    '[[Writable]]': true
  });
};
},{"../GetIntrinsic":"LENn","../helpers/DefineOwnProperty":"qut1","./FromPropertyDescriptor":"k6iA","./OrdinaryGetOwnProperty":"HKIH","./IsDataDescriptor":"Ragd","./IsExtensible":"qFre","./IsPropertyKey":"mmlB","./SameValue":"ZH9I","./Type":"QalR"}],"muFB":[function(require,module,exports) {
'use strict';

var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var CreateDataProperty = require('./CreateDataProperty');

var IsPropertyKey = require('./IsPropertyKey');

var Type = require('./Type'); // // https://ecma-international.org/ecma-262/6.0/#sec-createdatapropertyorthrow


module.exports = function CreateDataPropertyOrThrow(O, P, V) {
  if (Type(O) !== 'Object') {
    throw new $TypeError('Assertion failed: Type(O) is not Object');
  }

  if (!IsPropertyKey(P)) {
    throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
  }

  var success = CreateDataProperty(O, P, V);

  if (!success) {
    throw new $TypeError('unable to create data property');
  }

  return success;
};
},{"../GetIntrinsic":"LENn","./CreateDataProperty":"dFpr","./IsPropertyKey":"mmlB","./Type":"QalR"}],"rDCW":[function(require,module,exports) {

},{}],"d9qy":[function(require,module,exports) {
var hasMap = typeof Map === 'function' && Map.prototype;
var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;
var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null;
var mapForEach = hasMap && Map.prototype.forEach;
var hasSet = typeof Set === 'function' && Set.prototype;
var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;
var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null;
var setForEach = hasSet && Set.prototype.forEach;
var hasWeakMap = typeof WeakMap === 'function' && WeakMap.prototype;
var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
var hasWeakSet = typeof WeakSet === 'function' && WeakSet.prototype;
var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
var booleanValueOf = Boolean.prototype.valueOf;
var objectToString = Object.prototype.toString;
var functionToString = Function.prototype.toString;
var match = String.prototype.match;
var bigIntValueOf = typeof BigInt === 'function' ? BigInt.prototype.valueOf : null;
var gOPS = Object.getOwnPropertySymbols;
var symToString = typeof Symbol === 'function' ? Symbol.prototype.toString : null;
var isEnumerable = Object.prototype.propertyIsEnumerable;

var inspectCustom = require('./util.inspect').custom;
var inspectSymbol = inspectCustom && isSymbol(inspectCustom) ? inspectCustom : null;

module.exports = function inspect_(obj, options, depth, seen) {
    var opts = options || {};

    if (has(opts, 'quoteStyle') && (opts.quoteStyle !== 'single' && opts.quoteStyle !== 'double')) {
        throw new TypeError('option "quoteStyle" must be "single" or "double"');
    }
    if (
        has(opts, 'maxStringLength') && (typeof opts.maxStringLength === 'number'
            ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity
            : opts.maxStringLength !== null
        )
    ) {
        throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
    }
    var customInspect = has(opts, 'customInspect') ? opts.customInspect : true;
    if (typeof customInspect !== 'boolean') {
        throw new TypeError('option "customInspect", if provided, must be `true` or `false`');
    }

    if (
        has(opts, 'indent')
        && opts.indent !== null
        && opts.indent !== '\t'
        && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)
    ) {
        throw new TypeError('options "indent" must be "\\t", an integer > 0, or `null`');
    }

    if (typeof obj === 'undefined') {
        return 'undefined';
    }
    if (obj === null) {
        return 'null';
    }
    if (typeof obj === 'boolean') {
        return obj ? 'true' : 'false';
    }

    if (typeof obj === 'string') {
        return inspectString(obj, opts);
    }
    if (typeof obj === 'number') {
        if (obj === 0) {
            return Infinity / obj > 0 ? '0' : '-0';
        }
        return String(obj);
    }
    if (typeof obj === 'bigint') {
        return String(obj) + 'n';
    }

    var maxDepth = typeof opts.depth === 'undefined' ? 5 : opts.depth;
    if (typeof depth === 'undefined') { depth = 0; }
    if (depth >= maxDepth && maxDepth > 0 && typeof obj === 'object') {
        return isArray(obj) ? '[Array]' : '[Object]';
    }

    var indent = getIndent(opts, depth);

    if (typeof seen === 'undefined') {
        seen = [];
    } else if (indexOf(seen, obj) >= 0) {
        return '[Circular]';
    }

    function inspect(value, from, noIndent) {
        if (from) {
            seen = seen.slice();
            seen.push(from);
        }
        if (noIndent) {
            var newOpts = {
                depth: opts.depth
            };
            if (has(opts, 'quoteStyle')) {
                newOpts.quoteStyle = opts.quoteStyle;
            }
            return inspect_(value, newOpts, depth + 1, seen);
        }
        return inspect_(value, opts, depth + 1, seen);
    }

    if (typeof obj === 'function') {
        var name = nameOf(obj);
        var keys = arrObjKeys(obj, inspect);
        return '[Function' + (name ? ': ' + name : ' (anonymous)') + ']' + (keys.length > 0 ? ' { ' + keys.join(', ') + ' }' : '');
    }
    if (isSymbol(obj)) {
        var symString = symToString.call(obj);
        return typeof obj === 'object' ? markBoxed(symString) : symString;
    }
    if (isElement(obj)) {
        var s = '<' + String(obj.nodeName).toLowerCase();
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
            s += ' ' + attrs[i].name + '=' + wrapQuotes(quote(attrs[i].value), 'double', opts);
        }
        s += '>';
        if (obj.childNodes && obj.childNodes.length) { s += '...'; }
        s += '</' + String(obj.nodeName).toLowerCase() + '>';
        return s;
    }
    if (isArray(obj)) {
        if (obj.length === 0) { return '[]'; }
        var xs = arrObjKeys(obj, inspect);
        if (indent && !singleLineValues(xs)) {
            return '[' + indentedJoin(xs, indent) + ']';
        }
        return '[ ' + xs.join(', ') + ' ]';
    }
    if (isError(obj)) {
        var parts = arrObjKeys(obj, inspect);
        if (parts.length === 0) { return '[' + String(obj) + ']'; }
        return '{ [' + String(obj) + '] ' + parts.join(', ') + ' }';
    }
    if (typeof obj === 'object' && customInspect) {
        if (inspectSymbol && typeof obj[inspectSymbol] === 'function') {
            return obj[inspectSymbol]();
        } else if (typeof obj.inspect === 'function') {
            return obj.inspect();
        }
    }
    if (isMap(obj)) {
        var mapParts = [];
        mapForEach.call(obj, function (value, key) {
            mapParts.push(inspect(key, obj, true) + ' => ' + inspect(value, obj));
        });
        return collectionOf('Map', mapSize.call(obj), mapParts, indent);
    }
    if (isSet(obj)) {
        var setParts = [];
        setForEach.call(obj, function (value) {
            setParts.push(inspect(value, obj));
        });
        return collectionOf('Set', setSize.call(obj), setParts, indent);
    }
    if (isWeakMap(obj)) {
        return weakCollectionOf('WeakMap');
    }
    if (isWeakSet(obj)) {
        return weakCollectionOf('WeakSet');
    }
    if (isNumber(obj)) {
        return markBoxed(inspect(Number(obj)));
    }
    if (isBigInt(obj)) {
        return markBoxed(inspect(bigIntValueOf.call(obj)));
    }
    if (isBoolean(obj)) {
        return markBoxed(booleanValueOf.call(obj));
    }
    if (isString(obj)) {
        return markBoxed(inspect(String(obj)));
    }
    if (!isDate(obj) && !isRegExp(obj)) {
        var ys = arrObjKeys(obj, inspect);
        if (ys.length === 0) { return '{}'; }
        if (indent) {
            return '{' + indentedJoin(ys, indent) + '}';
        }
        return '{ ' + ys.join(', ') + ' }';
    }
    return String(obj);
};

function wrapQuotes(s, defaultStyle, opts) {
    var quoteChar = (opts.quoteStyle || defaultStyle) === 'double' ? '"' : "'";
    return quoteChar + s + quoteChar;
}

function quote(s) {
    return String(s).replace(/"/g, '&quot;');
}

function isArray(obj) { return toStr(obj) === '[object Array]'; }
function isDate(obj) { return toStr(obj) === '[object Date]'; }
function isRegExp(obj) { return toStr(obj) === '[object RegExp]'; }
function isError(obj) { return toStr(obj) === '[object Error]'; }
function isSymbol(obj) { return toStr(obj) === '[object Symbol]'; }
function isString(obj) { return toStr(obj) === '[object String]'; }
function isNumber(obj) { return toStr(obj) === '[object Number]'; }
function isBigInt(obj) { return toStr(obj) === '[object BigInt]'; }
function isBoolean(obj) { return toStr(obj) === '[object Boolean]'; }

var hasOwn = Object.prototype.hasOwnProperty || function (key) { return key in this; };
function has(obj, key) {
    return hasOwn.call(obj, key);
}

function toStr(obj) {
    return objectToString.call(obj);
}

function nameOf(f) {
    if (f.name) { return f.name; }
    var m = match.call(functionToString.call(f), /^function\s*([\w$]+)/);
    if (m) { return m[1]; }
    return null;
}

function indexOf(xs, x) {
    if (xs.indexOf) { return xs.indexOf(x); }
    for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) { return i; }
    }
    return -1;
}

function isMap(x) {
    if (!mapSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        mapSize.call(x);
        try {
            setSize.call(x);
        } catch (s) {
            return true;
        }
        return x instanceof Map; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakMap(x) {
    if (!weakMapHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakMapHas.call(x, weakMapHas);
        try {
            weakSetHas.call(x, weakSetHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakMap; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isSet(x) {
    if (!setSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        setSize.call(x);
        try {
            mapSize.call(x);
        } catch (m) {
            return true;
        }
        return x instanceof Set; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakSet(x) {
    if (!weakSetHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakSetHas.call(x, weakSetHas);
        try {
            weakMapHas.call(x, weakMapHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakSet; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isElement(x) {
    if (!x || typeof x !== 'object') { return false; }
    if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
        return true;
    }
    return typeof x.nodeName === 'string' && typeof x.getAttribute === 'function';
}

function inspectString(str, opts) {
    if (str.length > opts.maxStringLength) {
        var remaining = str.length - opts.maxStringLength;
        var trailer = '... ' + remaining + ' more character' + (remaining > 1 ? 's' : '');
        return inspectString(str.slice(0, opts.maxStringLength), opts) + trailer;
    }
    // eslint-disable-next-line no-control-regex
    var s = str.replace(/(['\\])/g, '\\$1').replace(/[\x00-\x1f]/g, lowbyte);
    return wrapQuotes(s, 'single', opts);
}

function lowbyte(c) {
    var n = c.charCodeAt(0);
    var x = {
        8: 'b',
        9: 't',
        10: 'n',
        12: 'f',
        13: 'r'
    }[n];
    if (x) { return '\\' + x; }
    return '\\x' + (n < 0x10 ? '0' : '') + n.toString(16).toUpperCase();
}

function markBoxed(str) {
    return 'Object(' + str + ')';
}

function weakCollectionOf(type) {
    return type + ' { ? }';
}

function collectionOf(type, size, entries, indent) {
    var joinedEntries = indent ? indentedJoin(entries, indent) : entries.join(', ');
    return type + ' (' + size + ') {' + joinedEntries + '}';
}

function singleLineValues(xs) {
    for (var i = 0; i < xs.length; i++) {
        if (indexOf(xs[i], '\n') >= 0) {
            return false;
        }
    }
    return true;
}

function getIndent(opts, depth) {
    var baseIndent;
    if (opts.indent === '\t') {
        baseIndent = '\t';
    } else if (typeof opts.indent === 'number' && opts.indent > 0) {
        baseIndent = Array(opts.indent + 1).join(' ');
    } else {
        return null;
    }
    return {
        base: baseIndent,
        prev: Array(depth + 1).join(baseIndent)
    };
}

function indentedJoin(xs, indent) {
    if (xs.length === 0) { return ''; }
    var lineJoiner = '\n' + indent.prev + indent.base;
    return lineJoiner + xs.join(',' + lineJoiner) + '\n' + indent.prev;
}

function arrObjKeys(obj, inspect) {
    var isArr = isArray(obj);
    var xs = [];
    if (isArr) {
        xs.length = obj.length;
        for (var i = 0; i < obj.length; i++) {
            xs[i] = has(obj, i) ? inspect(obj[i], obj) : '';
        }
    }
    for (var key in obj) { // eslint-disable-line no-restricted-syntax
        if (!has(obj, key)) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if (isArr && String(Number(key)) === key && key < obj.length) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if ((/[^\w$]/).test(key)) {
            xs.push(inspect(key, obj) + ': ' + inspect(obj[key], obj));
        } else {
            xs.push(key + ': ' + inspect(obj[key], obj));
        }
    }
    if (typeof gOPS === 'function') {
        var syms = gOPS(obj);
        for (var j = 0; j < syms.length; j++) {
            if (isEnumerable.call(obj, syms[j])) {
                xs.push('[' + inspect(syms[j]) + ']: ' + inspect(obj[syms[j]], obj));
            }
        }
    }
    return xs;
}

},{"./util.inspect":"rDCW"}],"ARLd":[function(require,module,exports) {
'use strict';

var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var inspect = require('object-inspect');

var IsPropertyKey = require('./IsPropertyKey');

var Type = require('./Type');
/**
 * 7.3.1 Get (O, P) - https://ecma-international.org/ecma-262/6.0/#sec-get-o-p
 * 1. Assert: Type(O) is Object.
 * 2. Assert: IsPropertyKey(P) is true.
 * 3. Return O.[[Get]](P, O).
 */


module.exports = function Get(O, P) {
  // 7.3.1.1
  if (Type(O) !== 'Object') {
    throw new $TypeError('Assertion failed: Type(O) is not Object');
  } // 7.3.1.2


  if (!IsPropertyKey(P)) {
    throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true, got ' + inspect(P));
  } // 7.3.1.3


  return O[P];
};
},{"../GetIntrinsic":"LENn","object-inspect":"d9qy","./IsPropertyKey":"mmlB","./Type":"QalR"}],"bplQ":[function(require,module,exports) {
'use strict';

var GetIntrinsic = require('../GetIntrinsic');

var has = require('has');

var $TypeError = GetIntrinsic('%TypeError%');

module.exports = function IsPropertyDescriptor(ES, Desc) {
  if (ES.Type(Desc) !== 'Object') {
    return false;
  }

  var allowed = {
    '[[Configurable]]': true,
    '[[Enumerable]]': true,
    '[[Get]]': true,
    '[[Set]]': true,
    '[[Value]]': true,
    '[[Writable]]': true
  };

  for (var key in Desc) {
    // eslint-disable-line no-restricted-syntax
    if (has(Desc, key) && !allowed[key]) {
      return false;
    }
  }

  if (ES.IsDataDescriptor(Desc) && ES.IsAccessorDescriptor(Desc)) {
    throw new $TypeError('Property Descriptors may not be both accessor and data descriptors');
  }

  return true;
};
},{"../GetIntrinsic":"LENn","has":"ar57"}],"kSEG":[function(require,module,exports) {
'use strict';

var has = require('has');

var assertRecord = require('../helpers/assertRecord');

var Type = require('./Type'); // https://www.ecma-international.org/ecma-262/6.0/#sec-isaccessordescriptor


module.exports = function IsAccessorDescriptor(Desc) {
  if (typeof Desc === 'undefined') {
    return false;
  }

  assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

  if (!has(Desc, '[[Get]]') && !has(Desc, '[[Set]]')) {
    return false;
  }

  return true;
};
},{"has":"ar57","../helpers/assertRecord":"mBar","./Type":"QalR"}],"nKbr":[function(require,module,exports) {
'use strict';

var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var isPropertyDescriptor = require('../helpers/isPropertyDescriptor');

var DefineOwnProperty = require('../helpers/DefineOwnProperty');

var FromPropertyDescriptor = require('./FromPropertyDescriptor');

var IsAccessorDescriptor = require('./IsAccessorDescriptor');

var IsDataDescriptor = require('./IsDataDescriptor');

var IsPropertyKey = require('./IsPropertyKey');

var SameValue = require('./SameValue');

var ToPropertyDescriptor = require('./ToPropertyDescriptor');

var Type = require('./Type'); // https://www.ecma-international.org/ecma-262/6.0/#sec-definepropertyorthrow


module.exports = function DefinePropertyOrThrow(O, P, desc) {
  if (Type(O) !== 'Object') {
    throw new $TypeError('Assertion failed: Type(O) is not Object');
  }

  if (!IsPropertyKey(P)) {
    throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
  }

  var Desc = isPropertyDescriptor({
    Type: Type,
    IsDataDescriptor: IsDataDescriptor,
    IsAccessorDescriptor: IsAccessorDescriptor
  }, desc) ? desc : ToPropertyDescriptor(desc);

  if (!isPropertyDescriptor({
    Type: Type,
    IsDataDescriptor: IsDataDescriptor,
    IsAccessorDescriptor: IsAccessorDescriptor
  }, Desc)) {
    throw new $TypeError('Assertion failed: Desc is not a valid Property Descriptor');
  }

  return DefineOwnProperty(IsDataDescriptor, SameValue, FromPropertyDescriptor, O, P, Desc);
};
},{"../GetIntrinsic":"LENn","../helpers/isPropertyDescriptor":"bplQ","../helpers/DefineOwnProperty":"qut1","./FromPropertyDescriptor":"k6iA","./IsAccessorDescriptor":"kSEG","./IsDataDescriptor":"Ragd","./IsPropertyKey":"mmlB","./SameValue":"ZH9I","./ToPropertyDescriptor":"M3Zt","./Type":"QalR"}],"FyO1":[function(require,module,exports) {
'use strict';

var GetIntrinsic = require('../GetIntrinsic.js');

var $construct = GetIntrinsic('%Reflect.construct%', true);

var DefinePropertyOrThrow = require('./DefinePropertyOrThrow');

try {
  DefinePropertyOrThrow({}, '', {
    '[[Get]]': function () {}
  });
} catch (e) {
  // Accessor properties aren't supported
  DefinePropertyOrThrow = null;
} // https://www.ecma-international.org/ecma-262/6.0/#sec-isconstructor


if (DefinePropertyOrThrow && $construct) {
  var isConstructorMarker = {};
  var badArrayLike = {};
  DefinePropertyOrThrow(badArrayLike, 'length', {
    '[[Get]]': function () {
      throw isConstructorMarker;
    },
    '[[Enumerable]]': true
  });

  module.exports = function IsConstructor(argument) {
    try {
      // `Reflect.construct` invokes `IsConstructor(target)` before `Get(args, 'length')`:
      $construct(argument, badArrayLike);
    } catch (err) {
      return err === isConstructorMarker;
    }
  };
} else {
  module.exports = function IsConstructor(argument) {
    // unfortunately there's no way to truly check this without try/catch `new argument` in old environments
    return typeof argument === 'function' && !!argument.prototype;
  };
}
},{"../GetIntrinsic.js":"LENn","./DefinePropertyOrThrow":"nKbr"}],"NaRt":[function(require,module,exports) {
'use strict';

var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%'); // http://www.ecma-international.org/ecma-262/5.1/#sec-9.10

module.exports = function CheckObjectCoercible(value, optMessage) {
  if (value == null) {
    throw new $TypeError(optMessage || 'Cannot call method on ' + value);
  }

  return value;
};
},{"../GetIntrinsic":"LENn"}],"Mk3Q":[function(require,module,exports) {
'use strict';

module.exports = require('../5/CheckObjectCoercible');
},{"../5/CheckObjectCoercible":"NaRt"}],"FwyB":[function(require,module,exports) {
'use strict';

var GetIntrinsic = require('../GetIntrinsic');

var $Object = GetIntrinsic('%Object%');

var RequireObjectCoercible = require('./RequireObjectCoercible'); // https://www.ecma-international.org/ecma-262/6.0/#sec-toobject


module.exports = function ToObject(value) {
  RequireObjectCoercible(value);
  return $Object(value);
};
},{"../GetIntrinsic":"LENn","./RequireObjectCoercible":"Mk3Q"}],"a6Kk":[function(require,module,exports) {
'use strict';

var GetIntrinsic = require('../GetIntrinsic');

var $Math = GetIntrinsic('%Math%');
var $Number = GetIntrinsic('%Number%');
module.exports = $Number.MAX_SAFE_INTEGER || $Math.pow(2, 53) - 1;
},{"../GetIntrinsic":"LENn"}],"xdEm":[function(require,module,exports) {
'use strict'; // http://www.ecma-international.org/ecma-262/5.1/#sec-9.3

module.exports = function ToNumber(value) {
  return +value; // eslint-disable-line no-implicit-coercion
};
},{}],"lJl4":[function(require,module,exports) {
'use strict';

var $isNaN = Number.isNaN || function (a) {
  return a !== a;
};

module.exports = Number.isFinite || function (x) {
  return typeof x === 'number' && !$isNaN(x) && x !== Infinity && x !== -Infinity;
};
},{}],"mhfJ":[function(require,module,exports) {
'use strict';

module.exports = function sign(number) {
  return number >= 0 ? 1 : -1;
};
},{}],"nBsr":[function(require,module,exports) {
'use strict';

var GetIntrinsic = require('../GetIntrinsic');

var $Math = GetIntrinsic('%Math%');

var ToNumber = require('./ToNumber');

var $isNaN = require('../helpers/isNaN');

var $isFinite = require('../helpers/isFinite');

var $sign = require('../helpers/sign');

var $floor = $Math.floor;
var $abs = $Math.abs; // http://www.ecma-international.org/ecma-262/5.1/#sec-9.4

module.exports = function ToInteger(value) {
  var number = ToNumber(value);

  if ($isNaN(number)) {
    return 0;
  }

  if (number === 0 || !$isFinite(number)) {
    return number;
  }

  return $sign(number) * $floor($abs(number));
};
},{"../GetIntrinsic":"LENn","./ToNumber":"xdEm","../helpers/isNaN":"TD7O","../helpers/isFinite":"lJl4","../helpers/sign":"mhfJ"}],"JTVQ":[function(require,module,exports) {
'use strict';

var GetIntrinsic = require('../GetIntrinsic');

var $test = GetIntrinsic('RegExp.prototype.test');

var callBind = require('./callBind');

module.exports = function regexTester(regex) {
  return callBind($test, regex);
};
},{"../GetIntrinsic":"LENn","./callBind":"ITpX"}],"NyUK":[function(require,module,exports) {
'use strict';

var getDay = Date.prototype.getDay;

var tryDateObject = function tryDateGetDayCall(value) {
  try {
    getDay.call(value);
    return true;
  } catch (e) {
    return false;
  }
};

var toStr = Object.prototype.toString;
var dateClass = '[object Date]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isDateObject(value) {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return hasToStringTag ? tryDateObject(value) : toStr.call(value) === dateClass;
};
},{}],"js02":[function(require,module,exports) {
'use strict';

var toStr = Object.prototype.toString;

var hasSymbols = require('has-symbols')();

if (hasSymbols) {
  var symToStr = Symbol.prototype.toString;
  var symStringRegex = /^Symbol\(.*\)$/;

  var isSymbolObject = function isRealSymbolObject(value) {
    if (typeof value.valueOf() !== 'symbol') {
      return false;
    }

    return symStringRegex.test(symToStr.call(value));
  };

  module.exports = function isSymbol(value) {
    if (typeof value === 'symbol') {
      return true;
    }

    if (toStr.call(value) !== '[object Symbol]') {
      return false;
    }

    try {
      return isSymbolObject(value);
    } catch (e) {
      return false;
    }
  };
} else {
  module.exports = function isSymbol(value) {
    // this environment does not support Symbols.
    return false && value;
  };
}
},{"has-symbols":"NS5K"}],"v1lv":[function(require,module,exports) {
'use strict';

var hasSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';

var isPrimitive = require('./helpers/isPrimitive');

var isCallable = require('is-callable');

var isDate = require('is-date-object');

var isSymbol = require('is-symbol');

var ordinaryToPrimitive = function OrdinaryToPrimitive(O, hint) {
  if (typeof O === 'undefined' || O === null) {
    throw new TypeError('Cannot call method on ' + O);
  }

  if (typeof hint !== 'string' || hint !== 'number' && hint !== 'string') {
    throw new TypeError('hint must be "string" or "number"');
  }

  var methodNames = hint === 'string' ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
  var method, result, i;

  for (i = 0; i < methodNames.length; ++i) {
    method = O[methodNames[i]];

    if (isCallable(method)) {
      result = method.call(O);

      if (isPrimitive(result)) {
        return result;
      }
    }
  }

  throw new TypeError('No default value');
};

var GetMethod = function GetMethod(O, P) {
  var func = O[P];

  if (func !== null && typeof func !== 'undefined') {
    if (!isCallable(func)) {
      throw new TypeError(func + ' returned for property ' + P + ' of object ' + O + ' is not a function');
    }

    return func;
  }

  return void 0;
}; // http://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive


module.exports = function ToPrimitive(input) {
  if (isPrimitive(input)) {
    return input;
  }

  var hint = 'default';

  if (arguments.length > 1) {
    if (arguments[1] === String) {
      hint = 'string';
    } else if (arguments[1] === Number) {
      hint = 'number';
    }
  }

  var exoticToPrim;

  if (hasSymbols) {
    if (Symbol.toPrimitive) {
      exoticToPrim = GetMethod(input, Symbol.toPrimitive);
    } else if (isSymbol(input)) {
      exoticToPrim = Symbol.prototype.valueOf;
    }
  }

  if (typeof exoticToPrim !== 'undefined') {
    var result = exoticToPrim.call(input, hint);

    if (isPrimitive(result)) {
      return result;
    }

    throw new TypeError('unable to convert exotic object to primitive');
  }

  if (hint === 'default' && (isDate(input) || isSymbol(input))) {
    hint = 'string';
  }

  return ordinaryToPrimitive(input, hint === 'default' ? 'number' : hint);
};
},{"./helpers/isPrimitive":"T9JR","is-callable":"b4C7","is-date-object":"NyUK","is-symbol":"js02"}],"BXKc":[function(require,module,exports) {
'use strict';

var toPrimitive = require('es-to-primitive/es2015'); // https://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive


module.exports = function ToPrimitive(input) {
  if (arguments.length > 1) {
    return toPrimitive(input, arguments[1]);
  }

  return toPrimitive(input);
};
},{"es-to-primitive/es2015":"v1lv"}],"VlLp":[function(require,module,exports) {
'use strict';

var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');
var $Number = GetIntrinsic('%Number%');
var $RegExp = GetIntrinsic('%RegExp%');
var $parseInteger = GetIntrinsic('%parseInt%');

var callBound = require('../helpers/callBound');

var regexTester = require('../helpers/regexTester');

var isPrimitive = require('../helpers/isPrimitive');

var $strSlice = callBound('String.prototype.slice');
var isBinary = regexTester(/^0b[01]+$/i);
var isOctal = regexTester(/^0o[0-7]+$/i);
var isInvalidHexLiteral = regexTester(/^[-+]0x[0-9a-f]+$/i);
var nonWS = ['\u0085', '\u200b', '\ufffe'].join('');
var nonWSregex = new $RegExp('[' + nonWS + ']', 'g');
var hasNonWS = regexTester(nonWSregex); // whitespace from: https://es5.github.io/#x15.5.4.20
// implementation from https://github.com/es-shims/es5-shim/blob/v3.4.0/es5-shim.js#L1304-L1324

var ws = ['\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003', '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028', '\u2029\uFEFF'].join('');
var trimRegex = new RegExp('(^[' + ws + ']+)|([' + ws + ']+$)', 'g');
var $replace = callBound('String.prototype.replace');

var $trim = function (value) {
  return $replace(value, trimRegex, '');
};

var ToPrimitive = require('./ToPrimitive'); // https://www.ecma-international.org/ecma-262/6.0/#sec-tonumber


module.exports = function ToNumber(argument) {
  var value = isPrimitive(argument) ? argument : ToPrimitive(argument, $Number);

  if (typeof value === 'symbol') {
    throw new $TypeError('Cannot convert a Symbol value to a number');
  }

  if (typeof value === 'string') {
    if (isBinary(value)) {
      return ToNumber($parseInteger($strSlice(value, 2), 2));
    } else if (isOctal(value)) {
      return ToNumber($parseInteger($strSlice(value, 2), 8));
    } else if (hasNonWS(value) || isInvalidHexLiteral(value)) {
      return NaN;
    } else {
      var trimmed = $trim(value);

      if (trimmed !== value) {
        return ToNumber(trimmed);
      }
    }
  }

  return $Number(value);
};
},{"../GetIntrinsic":"LENn","../helpers/callBound":"rAXm","../helpers/regexTester":"JTVQ","../helpers/isPrimitive":"T9JR","./ToPrimitive":"BXKc"}],"CebH":[function(require,module,exports) {
'use strict';

var ES5ToInteger = require('../5/ToInteger');

var ToNumber = require('./ToNumber'); // https://www.ecma-international.org/ecma-262/6.0/#sec-tointeger


module.exports = function ToInteger(value) {
  var number = ToNumber(value);
  return ES5ToInteger(number);
};
},{"../5/ToInteger":"nBsr","./ToNumber":"VlLp"}],"xCnm":[function(require,module,exports) {
'use strict';

var MAX_SAFE_INTEGER = require('../helpers/maxSafeInteger');

var ToInteger = require('./ToInteger');

module.exports = function ToLength(argument) {
  var len = ToInteger(argument);

  if (len <= 0) {
    return 0;
  } // includes converting -0 to +0


  if (len > MAX_SAFE_INTEGER) {
    return MAX_SAFE_INTEGER;
  }

  return len;
};
},{"../helpers/maxSafeInteger":"a6Kk","./ToInteger":"CebH"}],"DQdT":[function(require,module,exports) {
'use strict';

var GetIntrinsic = require('../GetIntrinsic');

var $String = GetIntrinsic('%String%');
var $TypeError = GetIntrinsic('%TypeError%'); // https://www.ecma-international.org/ecma-262/6.0/#sec-tostring

module.exports = function ToString(argument) {
  if (typeof argument === 'symbol') {
    throw new $TypeError('Cannot convert a Symbol value to a string');
  }

  return $String(argument);
};
},{"../GetIntrinsic":"LENn"}],"LiLl":[function(require,module,exports) {
'use strict';

/* globals
	AggregateError,
	Atomics,
	FinalizationRegistry,
	SharedArrayBuffer,
	WeakRef,
*/

var undefined;

var $SyntaxError = SyntaxError;
var $Function = Function;
var $TypeError = TypeError;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function (expressionSyntax) {
	try {
		// eslint-disable-next-line no-new-func
		return Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
	} catch (e) {}
};

var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
	try {
		$gOPD({}, '');
	} catch (e) {
		$gOPD = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () {
	throw new $TypeError();
};
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols = require('has-symbols')();

var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto

var asyncGenFunction = getEvalledConstructor('async function* () {}');
var asyncGenFunctionPrototype = asyncGenFunction ? asyncGenFunction.prototype : undefined;
var asyncGenPrototype = asyncGenFunctionPrototype ? asyncGenFunctionPrototype.prototype : undefined;

var TypedArray = typeof Uint8Array === 'undefined' ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'%ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined,
	'%AsyncFromSyncIteratorPrototype%': undefined,
	'%AsyncFunction%': getEvalledConstructor('async function () {}'),
	'%AsyncGenerator%': asyncGenFunctionPrototype,
	'%AsyncGeneratorFunction%': asyncGenFunction,
	'%AsyncIteratorPrototype%': asyncGenPrototype ? getProto(asyncGenPrototype) : undefined,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
	'%Boolean%': Boolean,
	'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'%Date%': Date,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': Error,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': EvalError,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
	'%Function%': $Function,
	'%GeneratorFunction%': getEvalledConstructor('function* () {}'),
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined,
	'%Map%': typeof Map === 'undefined' ? undefined : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),
	'%Math%': Math,
	'%Number%': Number,
	'%Object%': Object,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'%RangeError%': RangeError,
	'%ReferenceError%': ReferenceError,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'%RegExp%': RegExp,
	'%Set%': typeof Set === 'undefined' ? undefined : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined,
	'%Symbol%': hasSymbols ? Symbol : undefined,
	'%SyntaxError%': $SyntaxError,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypeError%': $TypeError,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'%URIError%': URIError,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
};

var LEGACY_ALIASES = {
	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
	'%ArrayPrototype%': ['Array', 'prototype'],
	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
	'%BooleanPrototype%': ['Boolean', 'prototype'],
	'%DataViewPrototype%': ['DataView', 'prototype'],
	'%DatePrototype%': ['Date', 'prototype'],
	'%ErrorPrototype%': ['Error', 'prototype'],
	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
	'%FunctionPrototype%': ['Function', 'prototype'],
	'%Generator%': ['GeneratorFunction', 'prototype'],
	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
	'%JSONParse%': ['JSON', 'parse'],
	'%JSONStringify%': ['JSON', 'stringify'],
	'%MapPrototype%': ['Map', 'prototype'],
	'%NumberPrototype%': ['Number', 'prototype'],
	'%ObjectPrototype%': ['Object', 'prototype'],
	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
	'%PromisePrototype%': ['Promise', 'prototype'],
	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
	'%Promise_all%': ['Promise', 'all'],
	'%Promise_reject%': ['Promise', 'reject'],
	'%Promise_resolve%': ['Promise', 'resolve'],
	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
	'%RegExpPrototype%': ['RegExp', 'prototype'],
	'%SetPrototype%': ['Set', 'prototype'],
	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
	'%StringPrototype%': ['String', 'prototype'],
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};

var bind = require('function-bind');
var hasOwn = require('has');
var $concat = bind.call(Function.call, Array.prototype.concat);
var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
var $replace = bind.call(Function.call, String.prototype.replace);
var $strSlice = bind.call(Function.call, String.prototype.slice);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var first = $strSlice(string, 0, 1);
	var last = $strSlice(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (hasOwn(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError('"allowMissing" argument must be a boolean');
	}

	var parts = stringToPath(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice(part, 0, 1);
		var last = $strSlice(part, -1);
		if (
			(
				(first === '"' || first === "'" || first === '`')
				|| (last === '"' || last === "'" || last === '`')
			)
			&& first !== last
		) {
			throw new $SyntaxError('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (hasOwn(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined;
			}
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = hasOwn(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};

},{"has-symbols":"NS5K","function-bind":"TiwC","has":"ar57"}],"y9YS":[function(require,module,exports) {
'use strict';

var bind = require('function-bind');
var GetIntrinsic = require('get-intrinsic');

var $apply = GetIntrinsic('%Function.prototype.apply%');
var $call = GetIntrinsic('%Function.prototype.call%');
var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
var $max = GetIntrinsic('%Math.max%');

if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = null;
	}
}

module.exports = function callBind(originalFunction) {
	var func = $reflectApply(bind, $call, arguments);
	if ($gOPD && $defineProperty) {
		var desc = $gOPD(func, 'length');
		if (desc.configurable) {
			// original length, plus the receiver, minus any additional arguments (after the receiver)
			$defineProperty(
				func,
				'length',
				{ value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
			);
		}
	}
	return func;
};

var applyBind = function applyBind() {
	return $reflectApply(bind, $apply, arguments);
};

if ($defineProperty) {
	$defineProperty(module.exports, 'apply', { value: applyBind });
} else {
	module.exports.apply = applyBind;
}

},{"function-bind":"TiwC","get-intrinsic":"LiLl"}],"tAiC":[function(require,module,exports) {
'use strict';

var GetIntrinsic = require('get-intrinsic');

var callBind = require('./');

var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

module.exports = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = GetIntrinsic(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
		return callBind(intrinsic);
	}
	return intrinsic;
};

},{"get-intrinsic":"LiLl","./":"y9YS"}],"ordk":[function(require,module,exports) {
'use strict';

var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

var callBound = require('call-bind/callBound');

var $toString = callBound('Object.prototype.toString');

var isStandardArguments = function isArguments(value) {
  if (hasToStringTag && value && typeof value === 'object' && Symbol.toStringTag in value) {
    return false;
  }

  return $toString(value) === '[object Arguments]';
};

var isLegacyArguments = function isArguments(value) {
  if (isStandardArguments(value)) {
    return true;
  }

  return value !== null && typeof value === 'object' && typeof value.length === 'number' && value.length >= 0 && $toString(value) !== '[object Array]' && $toString(value.callee) === '[object Function]';
};

var supportsStandardArguments = function () {
  return isStandardArguments(arguments);
}();

isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests

module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;
},{"call-bind/callBound":"tAiC"}],"REa7":[function(require,module,exports) {
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"VLVk":[function(require,module,exports) {
'use strict';

var strValue = String.prototype.valueOf;

var tryStringObject = function tryStringObject(value) {
  try {
    strValue.call(value);
    return true;
  } catch (e) {
    return false;
  }
};

var toStr = Object.prototype.toString;
var strClass = '[object String]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isString(value) {
  if (typeof value === 'string') {
    return true;
  }

  if (typeof value !== 'object') {
    return false;
  }

  return hasToStringTag ? tryStringObject(value) : toStr.call(value) === strClass;
};
},{}],"Qc2D":[function(require,module,exports) {
'use strict';

var $Map = typeof Map === 'function' && Map.prototype ? Map : null;
var $Set = typeof Set === 'function' && Set.prototype ? Set : null;

var exported;

if (!$Map) {
	// eslint-disable-next-line no-unused-vars
	exported = function isMap(x) {
		// `Map` is not present in this environment.
		return false;
	};
}

var $mapHas = $Map ? Map.prototype.has : null;
var $setHas = $Set ? Set.prototype.has : null;
if (!exported && !$mapHas) {
	// eslint-disable-next-line no-unused-vars
	exported = function isMap(x) {
		// `Map` does not have a `has` method
		return false;
	};
}

module.exports = exported || function isMap(x) {
	if (!x || typeof x !== 'object') {
		return false;
	}
	try {
		$mapHas.call(x);
		if ($setHas) {
			try {
				$setHas.call(x);
			} catch (e) {
				return true;
			}
		}
		return x instanceof $Map; // core-js workaround, pre-v2.5.0
	} catch (e) {}
	return false;
};

},{}],"OlG0":[function(require,module,exports) {
'use strict';

var $Map = typeof Map === 'function' && Map.prototype ? Map : null;
var $Set = typeof Set === 'function' && Set.prototype ? Set : null;

var exported;

if (!$Set) {
	// eslint-disable-next-line no-unused-vars
	exported = function isSet(x) {
		// `Set` is not present in this environment.
		return false;
	};
}

var $mapHas = $Map ? Map.prototype.has : null;
var $setHas = $Set ? Set.prototype.has : null;
if (!exported && !$setHas) {
	// eslint-disable-next-line no-unused-vars
	exported = function isSet(x) {
		// `Set` does not have a `has` method
		return false;
	};
}

module.exports = exported || function isSet(x) {
	if (!x || typeof x !== 'object') {
		return false;
	}
	try {
		$setHas.call(x);
		if ($mapHas) {
			try {
				$mapHas.call(x);
			} catch (e) {
				return true;
			}
		}
		return x instanceof $Set; // core-js workaround, pre-v2.5.0
	} catch (e) {}
	return false;
};

},{}],"pBGv":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"Lb2d":[function(require,module,exports) {
var process = require("process");
'use strict';

/* eslint global-require: 0 */
// the code is structured this way so that bundlers can
// alias out `has-symbols` to `() => true` or `() => false` if your target
// environments' Symbol capabilities are known, and then use
// dead code elimination on the rest of this module.
//
// Similarly, `isarray` can be aliased to `Array.isArray` if
// available in all target environments.

var isArguments = require('is-arguments');

if (require('has-symbols')() || require('has-symbols/shams')()) {
	var $iterator = Symbol.iterator;
	// Symbol is available natively or shammed
	// natively:
	//  - Chrome >= 38
	//  - Edge 12-14?, Edge >= 15 for sure
	//  - FF >= 36
	//  - Safari >= 9
	//  - node >= 0.12
	module.exports = function getIterator(iterable) {
		// alternatively, `iterable[$iterator]?.()`
		if (iterable != null && typeof iterable[$iterator] !== 'undefined') {
			return iterable[$iterator]();
		}
		if (isArguments(iterable)) {
			// arguments objects lack Symbol.iterator
			// - node 0.12
			return Array.prototype[$iterator].call(iterable);
		}
	};
} else {
	// Symbol is not available, native or shammed
	var isArray = require('isarray');
	var isString = require('is-string');
	var GetIntrinsic = require('get-intrinsic');
	var $Map = GetIntrinsic('%Map%', true);
	var $Set = GetIntrinsic('%Set%', true);
	var callBound = require('call-bind/callBound');
	var $arrayPush = callBound('Array.prototype.push');
	var $charCodeAt = callBound('String.prototype.charCodeAt');
	var $stringSlice = callBound('String.prototype.slice');

	var advanceStringIndex = function advanceStringIndex(S, index) {
		var length = S.length;
		if ((index + 1) >= length) {
			return index + 1;
		}

		var first = $charCodeAt(S, index);
		if (first < 0xD800 || first > 0xDBFF) {
			return index + 1;
		}

		var second = $charCodeAt(S, index + 1);
		if (second < 0xDC00 || second > 0xDFFF) {
			return index + 1;
		}

		return index + 2;
	};

	var getArrayIterator = function getArrayIterator(arraylike) {
		var i = 0;
		return {
			next: function next() {
				var done = i >= arraylike.length;
				var value;
				if (!done) {
					value = arraylike[i];
					i += 1;
				}
				return {
					done: done,
					value: value
				};
			}
		};
	};

	var getNonCollectionIterator = function getNonCollectionIterator(iterable, noPrimordialCollections) {
		if (isArray(iterable) || isArguments(iterable)) {
			return getArrayIterator(iterable);
		}
		if (isString(iterable)) {
			var i = 0;
			return {
				next: function next() {
					var nextIndex = advanceStringIndex(iterable, i);
					var value = $stringSlice(iterable, i, nextIndex);
					i = nextIndex;
					return {
						done: nextIndex > iterable.length,
						value: value
					};
				}
			};
		}

		// es6-shim and es-shims' es-map use a string "_es6-shim iterator_" property on different iterables, such as MapIterator.
		if (noPrimordialCollections && typeof iterable['_es6-shim iterator_'] !== 'undefined') {
			return iterable['_es6-shim iterator_']();
		}
	};

	if (!$Map && !$Set) {
		// the only language iterables are Array, String, arguments
		// - Safari <= 6.0
		// - Chrome < 38
		// - node < 0.12
		// - FF < 13
		// - IE < 11
		// - Edge < 11

		module.exports = function getIterator(iterable) {
			if (iterable != null) {
				return getNonCollectionIterator(iterable, true);
			}
		};
	} else {
		// either Map or Set are available, but Symbol is not
		// - es6-shim on an ES5 browser
		// - Safari 6.2 (maybe 6.1?)
		// - FF v[13, 36)
		// - IE 11
		// - Edge 11
		// - Safari v[6, 9)

		var isMap = require('is-map');
		var isSet = require('is-set');

		// Firefox >= 27, IE 11, Safari 6.2 - 9, Edge 11, es6-shim in older envs, all have forEach
		var $mapForEach = callBound('Map.prototype.forEach', true);
		var $setForEach = callBound('Set.prototype.forEach', true);
		if (typeof process === 'undefined' || !process.versions || !process.versions.node) { // "if is not node"

			// Firefox 17 - 26 has `.iterator()`, whose iterator `.next()` either
			// returns a value, or throws a StopIteration object. These browsers
			// do not have any other mechanism for iteration.
			var $mapIterator = callBound('Map.prototype.iterator', true);
			var $setIterator = callBound('Set.prototype.iterator', true);
			var getStopIterationIterator = function (iterator) {
				var done = false;
				return {
					next: function next() {
						try {
							return {
								done: done,
								value: done ? undefined : iterator.next()
							};
						} catch (e) {
							done = true;
							return {
								done: true,
								value: undefined
							};
						}
					}
				};
			};
		}
		// Firefox 27-35, and some older es6-shim versions, use a string "@@iterator" property
		// this returns a proper iterator object, so we should use it instead of forEach.
		// newer es6-shim versions use a string "_es6-shim iterator_" property.
		var $mapAtAtIterator = callBound('Map.prototype.@@iterator', true) || callBound('Map.prototype._es6-shim iterator_', true);
		var $setAtAtIterator = callBound('Set.prototype.@@iterator', true) || callBound('Set.prototype._es6-shim iterator_', true);

		var getCollectionIterator = function getCollectionIterator(iterable) {
			if (isMap(iterable)) {
				if ($mapIterator) {
					return getStopIterationIterator($mapIterator(iterable));
				}
				if ($mapAtAtIterator) {
					return $mapAtAtIterator(iterable);
				}
				if ($mapForEach) {
					var entries = [];
					$mapForEach(iterable, function (v, k) {
						$arrayPush(entries, [k, v]);
					});
					return getArrayIterator(entries);
				}
			}
			if (isSet(iterable)) {
				if ($setIterator) {
					return getStopIterationIterator($setIterator(iterable));
				}
				if ($setAtAtIterator) {
					return $setAtAtIterator(iterable);
				}
				if ($setForEach) {
					var values = [];
					$setForEach(iterable, function (v) {
						$arrayPush(values, v);
					});
					return getArrayIterator(values);
				}
			}
		};

		module.exports = function getIterator(iterable) {
			return getCollectionIterator(iterable) || getNonCollectionIterator(iterable);
		};
	}
}

},{"is-arguments":"ordk","has-symbols":"NS5K","has-symbols/shams":"jYt2","isarray":"REa7","is-string":"VLVk","get-intrinsic":"LiLl","call-bind/callBound":"tAiC","is-map":"Qc2D","is-set":"OlG0","process":"pBGv"}],"zFvq":[function(require,module,exports) {
'use strict';

var $TypeError = TypeError;

// eslint-disable-next-line consistent-return
module.exports = function iterateIterator(iterator) {
	if (!iterator || typeof iterator.next !== 'function') {
		throw new $TypeError('iterator must be an object with a `next` method');
	}
	if (arguments.length > 1) {
		var callback = arguments[1];
		if (typeof callback !== 'function') {
			throw new $TypeError('`callback`, if provided, must be a function');
		}
	}
	var values = callback || [];
	var result;
	while ((result = iterator.next()) && !result.done) {
		if (callback) {
			callback(result.value); // eslint-disable-line callback-return
		} else {
			values.push(result.value);
		}
	}
	if (!callback) {
		return values;
	}
};

},{}],"UJXx":[function(require,module,exports) {
'use strict';

var getIterator = require('es-get-iterator');
var $TypeError = TypeError;
var iterate = require('iterate-iterator');

module.exports = function iterateValue(iterable) {
	var iterator = getIterator(iterable);
	if (!iterator) {
		throw new $TypeError('non-iterable value provided');
	}
	if (arguments.length > 1) {
		return iterate(iterator, arguments[1]);
	}
	return iterate(iterator);
};

},{"es-get-iterator":"Lb2d","iterate-iterator":"zFvq"}],"LVsC":[function(require,module,exports) {
'use strict';

var Call = require('es-abstract/2019/Call');
var CreateDataPropertyOrThrow = require('es-abstract/2019/CreateDataPropertyOrThrow');
var Get = require('es-abstract/2019/Get');
var IsCallable = require('es-abstract/2019/IsCallable');
var IsConstructor = require('es-abstract/2019/IsConstructor');
var ToObject = require('es-abstract/2019/ToObject');
var ToLength = require('es-abstract/2019/ToLength');
var ToString = require('es-abstract/2019/ToString');
var iterate = require('iterate-value');

module.exports = function from(items) {
	var C = this;
	if (items === null || typeof items === 'undefined') {
		throw new TypeError('`Array.from` requires an array-like object, not `null` or `undefined`');
	}
	var mapFn, T;
	if (typeof arguments[1] !== 'undefined') {
		mapFn = arguments[1];
		if (!IsCallable(mapFn)) {
			throw new TypeError('When provided, the second argument to `Array.from` must be a function');
		}
		if (arguments.length > 2) {
			T = arguments[2];
		}
	}

	var values;
	try {
		values = iterate(items);
	} catch (e) {
		values = items;
	}

	var arrayLike = ToObject(values);
	var len = ToLength(arrayLike.length);
	var A = IsConstructor(C) ? ToObject(new C(len)) : new Array(len);
	var k = 0;
	var kValue, mappedValue;

	while (k < len) {
		var Pk = ToString(k);
		kValue = Get(arrayLike, Pk);
		if (mapFn) {
			mappedValue = typeof T === 'undefined' ? mapFn(kValue, k) : Call(mapFn, T, [kValue, k]);
		} else {
			mappedValue = kValue;
		}
		CreateDataPropertyOrThrow(A, Pk, mappedValue);
		k += 1;
	}
	A.length = len;
	return A;
};

},{"es-abstract/2019/Call":"pbtM","es-abstract/2019/CreateDataPropertyOrThrow":"muFB","es-abstract/2019/Get":"ARLd","es-abstract/2019/IsCallable":"kdXM","es-abstract/2019/IsConstructor":"FyO1","es-abstract/2019/ToObject":"FwyB","es-abstract/2019/ToLength":"xCnm","es-abstract/2019/ToString":"DQdT","iterate-value":"UJXx"}],"WY7i":[function(require,module,exports) {
'use strict';

var Call = require('es-abstract/2019/Call');
var IsArray = require('es-abstract/2019/IsArray');
var IsCallable = require('es-abstract/2019/IsCallable');
var implementation = require('./implementation');

var tryCall = function (fn) {
	try {
		return fn();
	} catch (e) {
		return false;
	}
};

module.exports = function getPolyfill() {
	if (IsCallable(Array.from)) {
		var handlesUndefMapper = tryCall(function () {
			// Microsoft Edge v0.11 throws if the mapFn argument is *provided* but undefined,
			// but the spec doesn't care if it's provided or not - undefined doesn't throw.
			return Array.from([0], undefined);
		});
		if (!handlesUndefMapper) {
			var origArrayFrom = Array.from;
			return function from(items) {
				/* eslint no-invalid-this: 0 */
				if (arguments.length > 1 && typeof arguments[1] !== 'undefined') {
					return Call(origArrayFrom, this, arguments);
				} else {
					return Call(origArrayFrom, this, [items]);
				}
			};
		}
		var implemented = tryCall(function () {
			// Detects a Firefox bug in v32
			// https://bugzilla.mozilla.org/show_bug.cgi?id=1063993
			return Array.from({ 'length': -1 }) === 0;
		})
		&& tryCall(function () {
			// Detects a bug in Webkit nightly r181886
			var arr = Array.from([0].entries());
			return arr.length === 1 && IsArray(arr[0]) && arr[0][0] === 0 && arr[0][1] === 0;
		})
		&& tryCall(function () {
			return Array.from({ 'length': -Infinity });
		});
		if (implemented) {
			return Array.from;
		}
	}

	return implementation;
};

},{"es-abstract/2019/Call":"pbtM","es-abstract/2019/IsArray":"jFZi","es-abstract/2019/IsCallable":"kdXM","./implementation":"LVsC"}],"kV1D":[function(require,module,exports) {

'use strict';

var define = require('define-properties');
var getPolyfill = require('./polyfill');

module.exports = function shimArrayFrom() {
	var polyfill = getPolyfill();

	define(Array, { 'from': polyfill }, {
		'from': function () {
			return Array.from !== polyfill;
		}
	});

	return polyfill;
};

},{"define-properties":"VxKF","./polyfill":"WY7i"}],"yaSe":[function(require,module,exports) {

'use strict';

var define = require('define-properties');

var implementation = require('./implementation');
var getPolyfill = require('./polyfill');
var shim = require('./shim');

var polyfill = getPolyfill();

// eslint-disable-next-line no-unused-vars
var boundFromShim = function from(items) {
	// eslint-disable-next-line no-invalid-this
	return polyfill.apply(this || Array, arguments);
};

define(boundFromShim, {
	'getPolyfill': getPolyfill,
	'implementation': implementation,
	'shim': shim
});

module.exports = boundFromShim;

},{"define-properties":"VxKF","./implementation":"LVsC","./polyfill":"WY7i","./shim":"kV1D"}],"iokg":[function(require,module,exports) {
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// XHook - v1.3.5 - https://github.com/jpillora/xhook
// Jaime Pillora <dev@jpillora.com> - MIT Copyright 2016
var AFTER,
    BEFORE,
    COMMON_EVENTS,
    EventEmitter,
    FIRE,
    FormData,
    NativeFormData,
    NativeXMLHttp,
    OFF,
    ON,
    READY_STATE,
    UPLOAD_EVENTS,
    XHookFormData,
    XHookHttpRequest,
    XMLHTTP,
    convertHeaders,
    depricatedProp,
    document,
    fakeEvent,
    mergeObjects,
    msie,
    proxyEvents,
    slice,
    xhook,
    _base,
    __indexOf = [].indexOf || function (item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (i in this && this[i] === item) return i;
  }

  return -1;
};

document = window.document;
BEFORE = "before";
AFTER = "after";
READY_STATE = "readyState";
ON = "addEventListener";
OFF = "removeEventListener";
FIRE = "dispatchEvent";
XMLHTTP = "XMLHttpRequest";
FormData = "FormData";
UPLOAD_EVENTS = ["load", "loadend", "loadstart"];
COMMON_EVENTS = ["progress", "abort", "error", "timeout"];
msie = parseInt((/msie (\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1]);

if (isNaN(msie)) {
  msie = parseInt((/trident\/.*; rv:(\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1]);
}

(_base = Array.prototype).indexOf || (_base.indexOf = function (item) {
  var i, x, _i, _len;

  for (i = _i = 0, _len = this.length; _i < _len; i = ++_i) {
    x = this[i];

    if (x === item) {
      return i;
    }
  }

  return -1;
});

slice = function slice(o, n) {
  return Array.prototype.slice.call(o, n);
};

depricatedProp = function depricatedProp(p) {
  return p === "returnValue" || p === "totalSize" || p === "position";
};

mergeObjects = function mergeObjects(src, dst) {
  var k, v;

  for (k in src) {
    v = src[k];

    if (depricatedProp(k)) {
      continue;
    }

    try {
      dst[k] = src[k];
    } catch (_error) {}
  }

  return dst;
};

proxyEvents = function proxyEvents(events, src, dst) {
  var event, p, _i, _len;

  p = function p(event) {
    return function (e) {
      var clone, k, val;
      clone = {};

      for (k in e) {
        if (depricatedProp(k)) {
          continue;
        }

        val = e[k];
        clone[k] = val === src ? dst : val;
      }

      return dst[FIRE](event, clone);
    };
  };

  for (_i = 0, _len = events.length; _i < _len; _i++) {
    event = events[_i];

    if (dst._has(event)) {
      src["on" + event] = p(event);
    }
  }
};

fakeEvent = function fakeEvent(type) {
  var msieEventObject;

  if (document.createEventObject != null) {
    msieEventObject = document.createEventObject();
    msieEventObject.type = type;
    return msieEventObject;
  } else {
    try {
      return new Event(type);
    } catch (_error) {
      return {
        type: type
      };
    }
  }
};

EventEmitter = function EventEmitter(nodeStyle) {
  var emitter, events, listeners;
  events = {};

  listeners = function listeners(event) {
    return events[event] || [];
  };

  emitter = {};

  emitter[ON] = function (event, callback, i) {
    events[event] = listeners(event);

    if (events[event].indexOf(callback) >= 0) {
      return;
    }

    i = i === undefined ? events[event].length : i;
    events[event].splice(i, 0, callback);
  };

  emitter[OFF] = function (event, callback) {
    var i;

    if (event === undefined) {
      events = {};
      return;
    }

    if (callback === undefined) {
      events[event] = [];
    }

    i = listeners(event).indexOf(callback);

    if (i === -1) {
      return;
    }

    listeners(event).splice(i, 1);
  };

  emitter[FIRE] = function () {
    var args, event, i, legacylistener, listener, _i, _len, _ref;

    args = slice(arguments);
    event = args.shift();

    if (!nodeStyle) {
      args[0] = mergeObjects(args[0], fakeEvent(event));
    }

    legacylistener = emitter["on" + event];

    if (legacylistener) {
      legacylistener.apply(emitter, args);
    }

    _ref = listeners(event).concat(listeners("*"));

    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      listener = _ref[i];
      listener.apply(emitter, args);
    }
  };

  emitter._has = function (event) {
    return !!(events[event] || emitter["on" + event]);
  };

  if (nodeStyle) {
    emitter.listeners = function (event) {
      return slice(listeners(event));
    };

    emitter.on = emitter[ON];
    emitter.off = emitter[OFF];
    emitter.fire = emitter[FIRE];

    emitter.once = function (e, fn) {
      var _fire;

      _fire = function fire() {
        emitter.off(e, _fire);
        return fn.apply(null, arguments);
      };

      return emitter.on(e, _fire);
    };

    emitter.destroy = function () {
      return events = {};
    };
  }

  return emitter;
};

xhook = EventEmitter(true);
xhook.EventEmitter = EventEmitter;

xhook[BEFORE] = function (handler, i) {
  if (handler.length < 1 || handler.length > 2) {
    throw "invalid hook";
  }

  return xhook[ON](BEFORE, handler, i);
};

xhook[AFTER] = function (handler, i) {
  if (handler.length < 2 || handler.length > 3) {
    throw "invalid hook";
  }

  return xhook[ON](AFTER, handler, i);
};

xhook.enable = function () {
  window[XMLHTTP] = XHookHttpRequest;

  if (NativeFormData) {
    window[FormData] = XHookFormData;
  }
};

xhook.disable = function () {
  window[XMLHTTP] = xhook[XMLHTTP];

  if (NativeFormData) {
    window[FormData] = NativeFormData;
  }
};

convertHeaders = xhook.headers = function (h, dest) {
  var header, headers, k, name, v, value, _i, _len, _ref;

  if (dest == null) {
    dest = {};
  }

  switch (_typeof(h)) {
    case "object":
      headers = [];

      for (k in h) {
        v = h[k];
        name = k.toLowerCase();
        headers.push("" + name + ":\t" + v);
      }

      return headers.join("\n");

    case "string":
      headers = h.split("\n");

      for (_i = 0, _len = headers.length; _i < _len; _i++) {
        header = headers[_i];

        if (/([^:]+):\s*(.+)/.test(header)) {
          name = (_ref = RegExp.$1) != null ? _ref.toLowerCase() : void 0;
          value = RegExp.$2;

          if (dest[name] == null) {
            dest[name] = value;
          }
        }
      }

      return dest;
  }
};

NativeFormData = window[FormData];

XHookFormData = function XHookFormData(form) {
  var entries;
  this.fd = form ? new NativeFormData(form) : new NativeFormData();
  this.form = form;
  entries = [];
  Object.defineProperty(this, "entries", {
    get: function get() {
      var fentries;
      fentries = !form ? [] : slice(form.querySelectorAll("input,select")).filter(function (e) {
        var _ref;

        return (_ref = e.type) !== "checkbox" && _ref !== "radio" || e.checked;
      }).map(function (e) {
        return [e.name, e.type === "file" ? e.files : e.value];
      });
      return fentries.concat(entries);
    }
  });

  this.append = function (_this) {
    return function () {
      var args;
      args = slice(arguments);
      entries.push(args);
      return _this.fd.append.apply(_this.fd, args);
    };
  }(this);
};

if (NativeFormData) {
  xhook[FormData] = NativeFormData;
  window[FormData] = XHookFormData;
}

NativeXMLHttp = window[XMLHTTP];
xhook[XMLHTTP] = NativeXMLHttp;

XHookHttpRequest = window[XMLHTTP] = function () {
  var ABORTED, currentState, emitFinal, emitReadyState, event, facade, hasError, hasErrorHandler, readBody, readHead, request, response, setReadyState, status, transiting, writeBody, writeHead, xhr, _i, _len, _ref;

  ABORTED = -1;
  xhr = new xhook[XMLHTTP]();
  request = {};
  status = null;
  hasError = void 0;
  transiting = void 0;
  response = void 0;

  readHead = function readHead() {
    var key, name, val, _ref;

    response.status = status || xhr.status;

    if (!(status === ABORTED && msie < 10)) {
      response.statusText = xhr.statusText;
    }

    if (status !== ABORTED) {
      _ref = convertHeaders(xhr.getAllResponseHeaders());

      for (key in _ref) {
        val = _ref[key];

        if (!response.headers[key]) {
          name = key.toLowerCase();
          response.headers[name] = val;
        }
      }
    }
  };

  readBody = function readBody() {
    if (!xhr.responseType || xhr.responseType === "text") {
      response.text = xhr.responseText;
      response.data = xhr.responseText;
    } else if (xhr.responseType === "document") {
      response.xml = xhr.responseXML;
      response.data = xhr.responseXML;
    } else {
      response.data = xhr.response;
    }

    if ("responseURL" in xhr) {
      response.finalUrl = xhr.responseURL;
    }
  };

  writeHead = function writeHead() {
    facade.status = response.status;
    facade.statusText = response.statusText;
  };

  writeBody = function writeBody() {
    if ("text" in response) {
      facade.responseText = response.text;
    }

    if ("xml" in response) {
      facade.responseXML = response.xml;
    }

    if ("data" in response) {
      facade.response = response.data;
    }

    if ("finalUrl" in response) {
      facade.responseURL = response.finalUrl;
    }
  };

  emitReadyState = function emitReadyState(n) {
    while (n > currentState && currentState < 4) {
      facade[READY_STATE] = ++currentState;

      if (currentState === 1) {
        facade[FIRE]("loadstart", {});
      }

      if (currentState === 2) {
        writeHead();
      }

      if (currentState === 4) {
        writeHead();
        writeBody();
      }

      facade[FIRE]("readystatechange", {});

      if (currentState === 4) {
        setTimeout(emitFinal, 0);
      }
    }
  };

  emitFinal = function emitFinal() {
    if (!hasError) {
      facade[FIRE]("load", {});
    }

    facade[FIRE]("loadend", {});

    if (hasError) {
      facade[READY_STATE] = 0;
    }
  };

  currentState = 0;

  setReadyState = function setReadyState(n) {
    var hooks, _process;

    if (n !== 4) {
      emitReadyState(n);
      return;
    }

    hooks = xhook.listeners(AFTER);

    _process = function process() {
      var hook;

      if (!hooks.length) {
        return emitReadyState(4);
      }

      hook = hooks.shift();

      if (hook.length === 2) {
        hook(request, response);
        return _process();
      } else if (hook.length === 3 && request.async) {
        return hook(request, response, _process);
      } else {
        return _process();
      }
    };

    _process();
  };

  facade = request.xhr = EventEmitter();

  xhr.onreadystatechange = function (event) {
    try {
      if (xhr[READY_STATE] === 2) {
        readHead();
      }
    } catch (_error) {}

    if (xhr[READY_STATE] === 4) {
      transiting = false;
      readHead();
      readBody();
    }

    setReadyState(xhr[READY_STATE]);
  };

  hasErrorHandler = function hasErrorHandler() {
    hasError = true;
  };

  facade[ON]("error", hasErrorHandler);
  facade[ON]("timeout", hasErrorHandler);
  facade[ON]("abort", hasErrorHandler);
  facade[ON]("progress", function () {
    if (currentState < 3) {
      setReadyState(3);
    } else {
      facade[FIRE]("readystatechange", {});
    }
  });

  if ("withCredentials" in xhr || xhook.addWithCredentials) {
    facade.withCredentials = false;
  }

  facade.status = 0;
  _ref = COMMON_EVENTS.concat(UPLOAD_EVENTS);

  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    event = _ref[_i];
    facade["on" + event] = null;
  }

  facade.open = function (method, url, async, user, pass) {
    currentState = 0;
    hasError = false;
    transiting = false;
    request.headers = {};
    request.headerNames = {};
    request.status = 0;
    response = {};
    response.headers = {};
    request.method = method;
    request.url = url;
    request.async = async !== false;
    request.user = user;
    request.pass = pass;
    setReadyState(1);
  };

  facade.send = function (body) {
    var hooks, k, modk, _process2, send, _j, _len1, _ref1;

    _ref1 = ["type", "timeout", "withCredentials"];

    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      k = _ref1[_j];
      modk = k === "type" ? "responseType" : k;

      if (modk in facade) {
        request[k] = facade[modk];
      }
    }

    request.body = body;

    send = function send() {
      var header, value, _k, _len2, _ref2, _ref3;

      proxyEvents(COMMON_EVENTS, xhr, facade);

      if (facade.upload) {
        proxyEvents(COMMON_EVENTS.concat(UPLOAD_EVENTS), xhr.upload, facade.upload);
      }

      transiting = true;
      xhr.open(request.method, request.url, request.async, request.user, request.pass);
      _ref2 = ["type", "timeout", "withCredentials"];

      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        k = _ref2[_k];
        modk = k === "type" ? "responseType" : k;

        if (k in request) {
          xhr[modk] = request[k];
        }
      }

      _ref3 = request.headers;

      for (header in _ref3) {
        value = _ref3[header];

        if (header) {
          xhr.setRequestHeader(header, value);
        }
      }

      if (request.body instanceof XHookFormData) {
        request.body = request.body.fd;
      }

      xhr.send(request.body);
    };

    hooks = xhook.listeners(BEFORE);

    _process2 = function process() {
      var done, hook;

      if (!hooks.length) {
        return send();
      }

      done = function done(userResponse) {
        if (_typeof(userResponse) === "object" && (typeof userResponse.status === "number" || typeof response.status === "number")) {
          mergeObjects(userResponse, response);

          if (__indexOf.call(userResponse, "data") < 0) {
            userResponse.data = userResponse.response || userResponse.text;
          }

          setReadyState(4);
          return;
        }

        _process2();
      };

      done.head = function (userResponse) {
        mergeObjects(userResponse, response);
        return setReadyState(2);
      };

      done.progress = function (userResponse) {
        mergeObjects(userResponse, response);
        return setReadyState(3);
      };

      hook = hooks.shift();

      if (hook.length === 1) {
        return done(hook(request));
      } else if (hook.length === 2 && request.async) {
        return hook(request, done);
      } else {
        return done();
      }
    };

    _process2();
  };

  facade.abort = function () {
    status = ABORTED;

    if (transiting) {
      xhr.abort();
    } else {
      facade[FIRE]("abort", {});
    }
  };

  facade.setRequestHeader = function (header, value) {
    var lName, name;
    lName = header != null ? header.toLowerCase() : void 0;
    name = request.headerNames[lName] = request.headerNames[lName] || header;

    if (request.headers[name]) {
      value = request.headers[name] + ", " + value;
    }

    request.headers[name] = value;
  };

  facade.getResponseHeader = function (header) {
    var name;
    name = header != null ? header.toLowerCase() : void 0;
    return response.headers[name];
  };

  facade.getAllResponseHeaders = function () {
    return convertHeaders(response.headers);
  };

  if (xhr.overrideMimeType) {
    facade.overrideMimeType = function () {
      return xhr.overrideMimeType.apply(xhr, arguments);
    };
  }

  if (xhr.upload) {
    facade.upload = request.upload = EventEmitter();
  }

  return facade;
};

module.exports = xhook;
},{}],"rZlJ":[function(require,module,exports) {
var config = function config(o) {
  if (o) {
    if (o.masters) {
      config.masters(o.masters);
    }

    if (o.slaves) {
      config.slaves(o.slaves);
    }
  }
}; //default config


config.debug = false;
config.timeout = 15e3;
config.cookies = {
  master: "Master-Cookie",
  slave: "Slave-Cookie"
}; //extras are also attached to config

module.exports = config;
},{}],"PesM":[function(require,module,exports) {
var global = arguments[3];
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var xhook = require("../vendor/xhook");

var config = require("./config");

exports.COMPAT_VERSION = "V1";
var _window = window,
    location = _window.location;
exports.currentOrigin = location.protocol + "//" + location.host;
config.origin = exports.currentOrigin; //emits 'warn' 'log' and 'timeout' events

exports.globalEmitter = xhook.EventEmitter(true);
exports.console = window.console || {};
var counter = 0;

exports.guid = function () {
  if (counter >= 1e6) counter = 0;
  var n = String(++counter);

  while (n.length < 6) {
    n = "0" + n;
  }

  return "xdomain-".concat(n);
};

exports.slice = function (o, n) {
  return Array.prototype.slice.call(o, n);
}; //create a logger of type


var newLogger = function newLogger(type) {
  return function (msg) {
    msg = "xdomain (".concat(exports.currentOrigin, "): ").concat(msg); //emit event

    exports.globalEmitter.fire(type, msg); //skip logs when debug isnt enabled

    if (type === "log" && !config.debug) {
      return;
    } //user provided log/warn functions


    if (type in config) {
      config[type](msg); //fallback console
    } else if (type in console) {
      console[type](msg); //fallbackback alert
    } else if (type === "warn") {
      alert(msg);
    }
  };
};

exports.log = newLogger("log");
exports.warn = newLogger("warn");

exports.instOf = function (obj, global) {
  return global in window && obj instanceof window[global];
}; //absolute url parser (relative urls aren't crossdomain)


exports.parseUrl = function (url) {
  if (/^((https?:)?\/\/[^\/\?]+)(\/.*)?/.test(url)) {
    return {
      origin: (RegExp.$2 ? "" : location.protocol) + RegExp.$1,
      path: RegExp.$3
    };
  } else {
    exports.log("failed to parse absolute url: ".concat(url));
    return null;
  }
};

config.parseUrl = exports.parseUrl;

exports.toRegExp = function (obj) {
  if (obj instanceof RegExp) {
    return obj;
  }

  var str = obj.toString().replace(/\W/g, function (str) {
    return "\\".concat(str);
  }).replace(/\\\*/g, ".*");
  return new RegExp("^".concat(str, "$"));
}; //strip functions and objects from an object


exports.strip = function (src) {
  var dst = {};

  for (var k in src) {
    if (k === "returnValue") {
      continue;
    }

    var v = src[k];

    var t = _typeof(v);

    if (t !== "function" && t !== "object") {
      dst[k] = v;
    }
  }

  return dst;
};
},{"../vendor/xhook":"iokg","./config":"rZlJ"}],"mtpH":[function(require,module,exports) {
var xhook = require("../vendor/xhook");

var config = require("./config");

var _require = require("./util"),
    log = _require.log,
    warn = _require.warn,
    toRegExp = _require.toRegExp,
    strip = _require.strip,
    parseUrl = _require.parseUrl,
    COMPAT_VERSION = _require.COMPAT_VERSION; //when you add masters, this node
//enables slave listeners


var enabled = false;
var masters = {};

exports.addMasters = function (config) {
  //validate iframe
  if (window === window.parent) {
    warn("slaves must be in an iframe");
    return;
  } //enable slave handler


  if (!enabled) {
    enabled = true;
    log("now handling incoming sockets...");
    window.parent.postMessage("XDPING_".concat(COMPAT_VERSION), "*");
  } //white-list the provided set of masters


  for (var origin in config) {
    var path = config[origin];

    if (origin === "file://" && path !== "*") {
      warn("file protocol only supports the * path");
      path = "*";
    }

    log("adding master: ".concat(origin));
    masters[origin] = path;
  }
};

config.masters = exports.addMasters;

exports.handleSocket = function (origin, socket) {
  if (!enabled) {
    return;
  } //null means no origin can be determined,
  //this is true for file:// and data:// URIs.
  //html data:// URI are now blocked, they can
  //only be copy-and-pasted into the URL bar.


  if (origin === "null" || origin === "file:") {
    origin = "file://";
  }

  log("handle socket for \"".concat(origin, "\""));
  var pathRegex = null;

  for (var master in masters) {
    var regex = masters[master];

    try {
      var masterRegex = toRegExp(master);

      if (masterRegex.test(origin)) {
        pathRegex = toRegExp(regex);
        break;
      }
    } catch (error) {}
  }

  if (!pathRegex) {
    warn("blocked request from: '".concat(origin, "'"));
    return;
  }

  socket.once("request", function (req) {
    log("request: ".concat(req.method, " ").concat(req.url));
    var p = parseUrl(req.url);

    if (!p || !pathRegex.test(p.path)) {
      warn("blocked request to path: '".concat(p.path, "' by regex: ").concat(pathRegex));
      socket.close();
      return;
    } //perform real XHR here!
    //pass results to the socket


    var xhr = new XMLHttpRequest();
    xhr.open(req.method, req.url);
    xhr.addEventListener("*", function (e) {
      return socket.emit("xhr-event", e.type, strip(e));
    });

    if (xhr.upload) {
      xhr.upload.addEventListener("*", function (e) {
        return socket.emit("xhr-upload-event", e.type, strip(e));
      });
    }

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) {
        return;
      } //extract properties


      var resp = {
        status: xhr.status,
        statusText: xhr.statusText,
        data: xhr.response,
        headers: xhook.headers(xhr.getAllResponseHeaders())
      };

      try {
        resp.text = xhr.responseText;
      } catch (error1) {} // XML over postMessage not supported
      // try resp.xml = xhr.responseXML


      return socket.emit("response", resp);
    }; //allow aborts from the facade


    socket.once("abort", function () {
      return xhr.abort();
    }); // document.cookie (Cookie header) can't be set inside an iframe
    // as many browsers have 3rd party cookies disabled. slaveCookie
    // contains the 'xdomain.cookie.slave' string set on the master.

    if (req.withCredentials) {
      xhr.withCredentials = true;

      if (req.slaveCookie) {
        req.headers[req.slaveCookie] = document.cookie;
      }
    }

    if (req.timeout) {
      xhr.timeout = req.timeout;
    }

    if (req.type) {
      xhr.responseType = req.type;
    }

    for (var k in req.headers) {
      var v = req.headers[k];
      xhr.setRequestHeader(k, v);
    } //deserialize FormData


    if (req.body instanceof Array && req.body[0] === "XD_FD") {
      var fd = new xhook.FormData();
      var entries = req.body[1];
      Array.from(entries).forEach(function (args) {
        //deserialize blobs from arraybuffs
        //[0:marker, 1:real-args, 2:arraybuffer, 3:type]
        if (args[0] === "XD_BLOB" && args.length === 4) {
          var blob = new Blob([args[2]], {
            type: args[3]
          });
          args = args[1];
          args[1] = blob;
        }

        fd.append.apply(fd, args);
      });
      req.body = fd;
    } //fire off request


    xhr.send(req.body || null);
  });
  log("slave listening for requests on socket: ".concat(socket.id));
};
},{"../vendor/xhook":"iokg","./config":"rZlJ","./util":"PesM"}],"myQy":[function(require,module,exports) {
var xhook = require("../vendor/xhook");

var config = require("./config");

var _require = require("./util"),
    globalEmitter = _require.globalEmitter,
    log = _require.log,
    warn = _require.warn,
    COMPAT_VERSION = _require.COMPAT_VERSION;

var _require2 = require("./slave"),
    handleSocket = _require2.handleSocket; //constants


var CHECK_STRING = "XD_CHECK";
var CHECK_INTERVAL = 100; //state

var sockets = {};
var jsonEncode = true; //a 'sock' is a two-way event-emitter,
//each side listens for messages with on()
//and the other side sends messages with emit()

exports.createSocket = function (id, frame) {
  var ready = false;
  var socket = xhook.EventEmitter(true);
  sockets[id] = socket;
  socket.id = id;
  socket.once("close", function () {
    socket.destroy();
    socket.close();
  });
  var pendingEmits = [];

  socket.emit = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var extra = typeof args[1] === "string" ? " -> ".concat(args[1]) : "";
    log("send socket: ".concat(id, ": ").concat(args[0]).concat(extra));
    args.unshift(id);

    if (ready) {
      emit(args);
    } else {
      pendingEmits.push(args);
    }
  };

  var emit = function emit(args) {
    //convert to string when necessary
    if (jsonEncode) {
      args = JSON.stringify(args);
    } //send!


    frame.postMessage(args, "*");
  };

  socket.close = function () {
    socket.emit("close");
    log("close socket: ".concat(id));
    sockets[id] = null;
  };

  socket.once(CHECK_STRING, function (obj) {
    jsonEncode = typeof obj === "string";
    ready = socket.ready = true;
    socket.emit("ready");
    log("ready socket: ".concat(id, " (emit #").concat(pendingEmits.length, " pending)"));

    while (pendingEmits.length) {
      emit(pendingEmits.shift());
    }
  }); //start checking connectivitiy

  var checks = 0;

  var check = function check() {
    // send test message NO ENCODING
    frame.postMessage([id, CHECK_STRING, {}], "*");

    if (ready) {
      return;
    }

    if (checks++ >= config.timeout / CHECK_INTERVAL) {
      warn("Timeout waiting on iframe socket");
      globalEmitter.fire("timeout");
      socket.fire("abort"); //self-emit "abort"
    } else {
      log("check again in ".concat(CHECK_INTERVAL, "ms..."));
      setTimeout(check, CHECK_INTERVAL);
    }
  };

  setTimeout(check);
  log("new socket: ".concat(id));
  return socket;
}; //ONE WINDOW LISTENER!
//double purpose:
//  creates new sockets by passing incoming events to the 'handler'
//  passes events to existing sockets (created by connect or by the server)


exports.initialise = function () {
  var handle = function handle(e) {
    var d = e.data; //return if not a json string

    if (typeof d === "string") {
      //only old versions of xdomain send XPINGs...
      if (/^XDPING(_(V\d+))?$/.test(d) && RegExp.$2 !== COMPAT_VERSION) {
        return warn("your master is not compatible with your slave, check your xdomain.js version"); //IE will "toString()" the array, this reverses that action
      } else if (/^xdomain-/.test(d)) {
        d = d.split(","); //this browser must json encode postmessages
      } else if (jsonEncode) {
        try {
          d = JSON.parse(d);
        } catch (error) {
          return;
        }
      }
    } //return if not an array


    if (!(d instanceof Array)) {
      return;
    } //return unless lead by an xdomain id


    var id = d.shift();

    if (!/^xdomain-/.test(id)) {
      return;
    } //finally, create/get socket


    var socket = sockets[id]; //closed

    if (socket === null) {
      return;
    } //needs creation


    if (socket === undefined) {
      //send unsolicited requests to the listening server
      if (!handleSocket) {
        return;
      }

      socket = exports.createSocket(id, e.source);
      handleSocket(e.origin, socket);
    }

    var extra = typeof d[1] === "string" ? " -> ".concat(d[1]) : "";
    log("receive socket: ".concat(id, ": ").concat(d[0]).concat(extra)); //emit data

    socket.fire.apply(socket, d);
  };

  if (document.addEventListener) {
    return window.addEventListener("message", handle);
  } else {
    return window.attachEvent("onmessage", handle);
  }
};
},{"../vendor/xhook":"iokg","./config":"rZlJ","./util":"PesM","./slave":"mtpH"}],"knsa":[function(require,module,exports) {
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var xhook = require("../vendor/xhook");

var config = require("./config");

var _require = require("./util"),
    currentOrigin = _require.currentOrigin,
    log = _require.log,
    warn = _require.warn,
    parseUrl = _require.parseUrl,
    guid = _require.guid,
    strip = _require.strip,
    instOf = _require.instOf;

var socketlib = require("./socket");

var createSocket = socketlib.createSocket; //when you add slaves, this node
//enables master listeners

var enabled = false;
var slaves = {};

exports.addSlaves = function (newSlaves) {
  //register master xhook handler
  if (!enabled) {
    enabled = true; //unless already set, add withCredentials to xhrs to trick jquery
    //in older browsers into thinking cors is allowed

    if (!("addWithCredentials" in xhook)) {
      xhook.addWithCredentials = true;
    } //hook XHR calls


    xhook.before(beforeXHR);
  } //include the provided set of slave


  for (var origin in newSlaves) {
    var path = newSlaves[origin];
    log("adding slave: ".concat(origin));
    slaves[origin] = path;
  }
};

config.slaves = exports.addSlaves;

var beforeXHR = function beforeXHR(request, callback) {
  //allow unless we have a slave domain
  var p = parseUrl(request.url);

  if (!p || p.origin === currentOrigin) {
    callback();
    return;
  }

  if (!slaves[p.origin]) {
    if (p) {
      log("no slave matching: '".concat(p.origin, "'"));
    }

    callback();
    return;
  }

  log("proxying request to slave: '".concat(p.origin, "'"));

  if (request.async === false) {
    warn("sync not supported because postmessage is async");
    callback();
    return;
  } //get or insert frame


  var frame = getFrame(p.origin, slaves[p.origin]); //connect to slave

  var socket = createSocket(guid(), frame); //queue callback

  socket.on("response", function (resp) {
    callback(resp);
    socket.close();
  }); //user wants to abort

  request.xhr.addEventListener("abort", function () {
    return socket.emit("abort");
  }); //kick off

  if (socket.ready) {
    handleRequest(request, socket);
  } else {
    socket.once("ready", function () {
      return handleRequest(request, socket);
    });
  }
};

var frames = {};

var getFrame = function getFrame(origin, proxyPath) {
  //cache origin
  if (frames[origin]) {
    return frames[origin];
  }

  var frame = document.createElement("iframe");
  frame.id = frame.name = guid();
  log("creating iframe ".concat(frame.id));
  frame.src = "".concat(origin).concat(proxyPath);
  frame.setAttribute("style", "display:none;");
  frame.setAttribute("sandbox", "allow-scripts allow-same-origin");
  document.body.appendChild(frame);
  return frames[origin] = frame.contentWindow;
};

var convertToArrayBuffer = function convertToArrayBuffer(args, done) {
  var _Array$from = Array.from(args),
      _Array$from2 = _slicedToArray(_Array$from, 2),
      name = _Array$from2[0],
      obj = _Array$from2[1];

  var isBlob = instOf(obj, "Blob");
  var isFile = instOf(obj, "File");

  if (!isBlob && !isFile) {
    return 0;
  }

  var reader = new FileReader();

  reader.onload = function () {
    // clear value
    args[1] = null; // formdata.append(name, value, **filename**)

    if (isFile) {
      args[2] = obj.name;
    }

    return done(["XD_BLOB", args, this.result, obj.type]);
  };

  reader.readAsArrayBuffer(obj);
  return 1;
}; //this FormData is actually XHooks custom FormData `fd`,
//which exposes all `entries` added, where each entry
//is the arguments object


var convertFormData = function convertFormData(entries, send) {
  //expand FileList -> [File, File, File]
  entries.forEach(function (args, i) {
    var _Array$from3 = Array.from(args),
        _Array$from4 = _slicedToArray(_Array$from3, 2),
        name = _Array$from4[0],
        value = _Array$from4[1];

    if (instOf(value, "FileList")) {
      entries.splice(i, 1);
      Array.from(value).forEach(function (file) {
        entries.splice(i, 0, [name, file]);
      });
    }
  }); //basically: async.parallel([filter:files], send)

  var c = 0;
  entries.forEach(function (args, i) {
    c += convertToArrayBuffer(args, function (newargs) {
      entries[i] = newargs;

      if (--c === 0) {
        send();
      }
    });
  });

  if (c === 0) {
    send();
  }
};

var handleRequest = function handleRequest(request, socket) {
  socket.on("xhr-event", function () {
    return request.xhr.dispatchEvent.apply(null, arguments);
  });
  socket.on("xhr-upload-event", function () {
    return request.xhr.upload.dispatchEvent.apply(null, arguments);
  });
  var obj = strip(request);
  obj.headers = request.headers; //add master cookie

  if (request.withCredentials) {
    if (config.cookies.master) {
      obj.headers[config.cookies.master] = document.cookie;
    }

    obj.slaveCookie = config.cookies.slave;
  }

  var send = function send() {
    return socket.emit("request", obj);
  };

  if (request.body) {
    obj.body = request.body; //async serialize formdata

    if (instOf(obj.body, "FormData")) {
      var entries = obj.body.entries;
      obj.body = ["XD_FD", entries];
      convertFormData(entries, send);
      return;
    }
  }

  send();
};
},{"../vendor/xhook":"iokg","./config":"rZlJ","./util":"PesM","./socket":"myQy"}],"FjW0":[function(require,module,exports) {
var config = require("./config");

var _require = require("./util"),
    parseUrl = _require.parseUrl;

var _require2 = require("./master"),
    addSlaves = _require2.addSlaves;

var _require3 = require("./slave"),
    addMasters = _require3.addMasters;

var _window = window,
    document = _window.document; //auto init using attributes

exports.initialise = function () {
  //attribute handlers
  var attrs = {
    debug: function debug(value) {
      config.debug = value !== "false";
    },
    slave: function slave(value) {
      var p = parseUrl(value);

      if (!p) {
        return;
      }

      var s = {};
      s[p.origin] = p.path;
      addSlaves(s);
    },
    master: function master(value) {
      var p;

      if (value === "*") {
        p = {
          origin: "*",
          path: "*"
        };
      } else if (value === "file://*") {
        p = {
          origin: "file://",
          path: "*"
        };
      } else {
        p = parseUrl(value);
      }

      if (!p) {
        return;
      }

      var m = {};
      m[p.origin] = p.path.replace(/^\//, "") ? p.path : "*";
      addMasters(m);
    }
  }; //find all script tags referencing 'xdomain' and then
  //find all attributes with handlers registered

  Array.from(document.getElementsByTagName("script")).forEach(function (script) {
    if (!/xdomain/.test(script.src)) {
      return;
    }

    ["", "data-"].forEach(function (prefix) {
      for (var k in attrs) {
        var value = script.getAttribute(prefix + k);

        if (value) {
          var fn = attrs[k];
          fn(value);
        }
      }
    });
  });
};
},{"./config":"rZlJ","./util":"PesM","./master":"knsa","./slave":"mtpH"}],"Focm":[function(require,module,exports) {
"use strict"; //feature detect

var _require = require("./lib/util"),
    warn = _require.warn;

["postMessage", "JSON"].forEach(function (feature) {
  if (!window[feature]) {
    warn("requires '".concat(feature, "' and this browser does not support it"));
  }
}); //init socket (post message mini-library)

var socket = require("./lib/socket");

socket.initialise(); //initialise script (load config from script tag)

var script = require("./lib/script");

script.initialise(); //public api

var initialise = require("./lib/config"); //config is also the primary intialise function


module.exports = initialise;
},{"./lib/util":"PesM","./lib/socket":"myQy","./lib/script":"FjW0","./lib/config":"rZlJ"}],"hpaf":[function(require,module,exports) {
if (!Array.from) {
  Array.from = require("array.from").getPolyfill();
}

var xhook = require("./vendor/xhook");

window.xhook = xhook;

var xdomain = require("./index");

window.xdomain = xdomain;
},{"array.from":"yaSe","./vendor/xhook":"iokg","./index":"Focm"}]},{},["hpaf"], null)
//# sourceMappingURL=xdomain.js.map