var tiForms =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(1));
	__export(__webpack_require__(2));
	__export(__webpack_require__(3));
	if (window.crypto && !window.crypto.subtle && window.crypto.webkitSubtle) {
	    window.crypto.subtle = window.crypto.webkitSubtle;
	}


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	var Converters = (function () {
	    function Converters() {
	    }
	    Converters.stringToUint8Array = function (data) {
	        return Uint8Array.from(Array.prototype.map.call(data, function (x) { return x.charCodeAt(0); }));
	    };
	    Converters.Uint8ArrayToString = function (data) {
	        return Array.prototype.map.call(data, function (x) {
	            return String.fromCharCode(x);
	        }).join('');
	    };
	    Converters.base64ToUint8Array = function (data) {
	        var asStr = atob(data);
	        return Converters.stringToUint8Array(asStr);
	    };
	    Converters.Uint8ArrayToBase64 = function (data) {
	        return btoa(Converters.Uint8ArrayToString(data));
	    };
	    Converters.base64ToBase64URL = function (data) {
	        return data.split('=')[0].replace('+', '-').replace('/', '_');
	    };
	    Converters.base64URLToBase64 = function (data) {
	        var d = data.replace('-', '+').replace('_', '/');
	        switch (d.length % 4) {
	            case 0: break;
	            case 2:
	                d = d + "==";
	                break;
	            case 3:
	                d = d + "=";
	                break;
	        }
	        return d;
	    };
	    Converters.jwkToString = function (key, pubOnly) {
	        if (key.kty !== "EC" || key.crv !== "P-256" || !key.x || !key.y)
	            throw new Error("Key type not supported");
	        if (key.d && !pubOnly)
	            return [key.x, key.y, key.d].join('|');
	        else
	            return [key.x, key.y].join('|');
	    };
	    Converters.stringToJwk = function (key) {
	        var arr = key.split('|');
	        if (arr.length < 2 || arr.length > 3)
	            throw new Error("Wrong string key representation");
	        var ret = {
	            kty: "EC", crv: "P-256", x: arr[0], y: arr[1],
	            key_ops: ['deriveKey']
	        };
	        if (arr[2]) {
	            ret.d = arr[2];
	        }
	        return ret;
	    };
	    return Converters;
	}());
	exports.Converters = Converters;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Converters_1 = __webpack_require__(1);
	var Decryptor = (function () {
	    function Decryptor(privKey) {
	        this.importKey(privKey);
	    }
	    Decryptor.generateKey = function () {
	        var outKey = {
	            pubKey: undefined,
	            privKey: undefined
	        };
	        return crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ['deriveKey']).then(function (key) {
	            return crypto.subtle.exportKey("jwk", key.privateKey)
	                .then(function (keyObj) {
	                return {
	                    pubKey: Converters_1.Converters.jwkToString(keyObj, true),
	                    privKey: Converters_1.Converters.jwkToString(keyObj),
	                };
	            });
	        });
	    };
	    Decryptor.prototype.importKey = function (privKey) {
	        var that = this;
	        this.keyPromise = crypto.subtle.importKey('jwk', Converters_1.Converters.stringToJwk(privKey), {
	            name: "ECDH",
	            namedCurve: "P-256"
	        }, false, ['deriveKey']).then(function (privateKey) {
	            that.privKey = privateKey;
	            return;
	        });
	    };
	    Decryptor.prototype.decryptString = function (data) {
	        var that = this;
	        var sData = Converters_1.Converters.base64ToUint8Array(data.payload);
	        return crypto.subtle.importKey("jwk", Converters_1.Converters.stringToJwk(data.pubKey), { name: "ECDH", namedCurve: "P-256" }, false, []).then(function (pubKey) {
	            return crypto.subtle.deriveKey({ name: "ECDH", namedCurve: "P-256", public: pubKey }, that.privKey, { name: 'AES-CBC', length: 256 }, false, ["decrypt"]).then(function (aesKey) {
	                return crypto.subtle.decrypt({ name: 'AES-CBC', iv: new Uint8Array(16) }, aesKey, sData).then(function (decrypted) {
	                    return Converters_1.Converters.Uint8ArrayToString(new Uint8Array(decrypted));
	                });
	            });
	        });
	    };
	    Decryptor.prototype.ready = function (cb) {
	        if (!cb)
	            return this.keyPromise;
	        else {
	            this.keyPromise.then(cb)
	                .catch(function () { throw "Ready function failed"; });
	            return;
	        }
	    };
	    return Decryptor;
	}());
	exports.Decryptor = Decryptor;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Converters_1 = __webpack_require__(1);
	var Encryptor = (function () {
	    function Encryptor(formPubKey) {
	        this.importKey(formPubKey);
	    }
	    Encryptor.prototype.encryptBinary = function (data) {
	        var that = this;
	        var encData = { pubKey: undefined, payload: undefined };
	        return crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, false, ["deriveKey"])
	            .then(function (key) {
	            return crypto.subtle.deriveKey({ name: "ECDH", namedCurve: "P-256", "public": that.formKey
	            }, key.privateKey, { name: 'AES-CBC', length: 256 }, false, ["encrypt"])
	                .then(function (aesKey) {
	                return crypto.subtle.encrypt({ name: 'AES-CBC', iv: new Uint8Array(16) }, aesKey, data).then(function (encrypted) {
	                    encData.payload = Converters_1.Converters.Uint8ArrayToBase64(new Uint8Array(encrypted));
	                    return crypto.subtle.exportKey('jwk', key.publicKey)
	                        .then(function (pubObj) {
	                        encData.pubKey = [pubObj.x, pubObj.y].join('|');
	                        return encData;
	                    });
	                });
	            });
	        });
	    };
	    Encryptor.prototype.encryptString = function (data) {
	        return this.encryptBinary(Converters_1.Converters.stringToUint8Array(data));
	    };
	    Encryptor.prototype.encryptStringCB = function (data, success, fail) {
	        this.encryptString(data).then(success, fail);
	    };
	    Encryptor.prototype.importKey = function (pubKey) {
	        var that = this;
	        this.keyPromise = crypto.subtle.importKey("jwk", Converters_1.Converters.stringToJwk(pubKey), { name: "ECDH", namedCurve: "P-256" }, false, []).then(function (key) {
	            that.formKey = key;
	        });
	    };
	    Encryptor.prototype.ready = function (cb) {
	        if (!cb)
	            return this.keyPromise;
	        else {
	            this.keyPromise.then(cb)
	                .catch(function () { throw "Ready function failed"; });
	            return;
	        }
	    };
	    return Encryptor;
	}());
	exports.Encryptor = Encryptor;


/***/ }
/******/ ]);