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


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	var Converters = (function () {
	    function Converters() {
	    }
	    Converters.base64toUint8Array = function (data) {
	        var asStr = atob(data);
	        return Uint8Array.from(Array.prototype.map.call(asStr, function (x) { return x.charCodeAt(0); }));
	    };
	    Converters.Uint8ArraytoBase64 = function (data) {
	        var binstr = Array.prototype.map.call(data, function (x) {
	            return String.fromCharCode(x);
	        }).join('');
	        return btoa(binstr);
	    };
	    return Converters;
	}());
	exports.Converters = Converters;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var base64_ts_1 = __webpack_require__(1);
	var Decryptor = (function () {
	    function Decryptor() {
	    }
	    Decryptor.generateKey = function () {
	        var outKey = {
	            pubKey: undefined,
	            privKey: undefined
	        };
	        return crypto.subtle.generateKey({
	            name: "ECDH",
	            namedCurve: "P-256"
	        }, true, []).then(function (key) {
	            return crypto.subtle.exportKey("pkcs8", key.privateKey)
	                .then(function (privRaw) {
	                outKey.privKey = base64_ts_1.Converters.Uint8ArraytoBase64(privRaw);
	                return crypto.subtle.exportKey("raw", key.publicKey)
	                    .then(function (pubRaw) {
	                    outKey.pubKey = base64_ts_1.Converters.Uint8ArraytoBase64(pubRaw);
	                    return outKey;
	                });
	            });
	        });
	    };
	    Decryptor.prototype.importKey = function (privKey) {
	        var that = this;
	        var privRaw = base64_ts_1.Converters.base64toUint8Array(privKey);
	        return crypto.subtle.importKey('pkcs8', privRaw, {
	            name: "ECDH",
	            namedCurve: "P-256"
	        }, false, ['deriveKey', 'deriveBits']).then(function (privateKey) {
	            that.privKey = privateKey;
	            return;
	        });
	    };
	    Decryptor.prototype.decryptString = function (data) {
	        return "something";
	    };
	    return Decryptor;
	}());
	exports.Decryptor = Decryptor;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var base64_ts_1 = __webpack_require__(1);
	var Encryptor = (function () {
	    function Encryptor(formPubKey) {
	        this.formKey = crypto.subtle.importKey("raw", base64_ts_1.Converters.base64toUint8Array(formPubKey), {
	            "name": "ECDH",
	            "namedCurve": "P-256"
	        }, false, ['deriveKey']);
	    }
	    Encryptor.prototype.encryptString = function (data) {
	        return crypto.subtle.generateKey({
	            "name": "ECDH",
	            "namedCurve": "P-256"
	        }, false, ["deriveKey"])
	            .then(function (privKey) {
	            return crypto.subtle.deriveKey({
	                "name": "ECDH",
	                "namedCurve": "P-256",
	                "public": this.formKey
	            }, privKey, {
	                "name": 'AES-CBC',
	                "length": 256
	            }, false, ["encrypt"])
	                .then(function (encryptor) {
	            });
	        });
	    };
	    Encryptor.prototype.encryptStringCB = function (data, success, fail) {
	        this.encryptString(data).then(success, fail);
	    };
	    return Encryptor;
	}());
	exports.Encryptor = Encryptor;


/***/ }
/******/ ]);