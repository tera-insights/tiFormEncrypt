module.exports =
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
	var crypto = __webpack_require__(3);
	if (!crypto.createECDH) {
	    throw Error("Cannot find ECDH on crypto");
	}
	function pubKeyToBuffer(pubKey) {
	    var keyParts = pubKey.split('|');
	    var head = new Buffer([0x04]);
	    var x = Buffer.from(keyParts[0], 'base64');
	    var y = Buffer.from(keyParts[1], 'base64');
	    return Buffer.concat([head, x, y], 65);
	}
	var Decryptor = (function () {
	    function Decryptor(privKey) {
	        this.iv = Buffer.alloc(16, 0);
	        this.importKey(privKey);
	    }
	    Decryptor.prototype.importKey = function (privKey) {
	        this.privKey = crypto.createECDH("prime256v1");
	        var keyParts = privKey.split('|');
	        var xB64 = Converters_1.Converters.base64URLToBase64(keyParts[0]);
	        var yB64 = Converters_1.Converters.base64URLToBase64(keyParts[1]);
	        this.privKey.setPrivateKey(Converters_1.Converters.base64URLToBase64(keyParts[2]), 'base64');
	    };
	    ;
	    Decryptor.prototype.decryptString = function (data) {
	        var secret = this.privKey.computeSecret(pubKeyToBuffer(data.pubKey));
	        var cypher = crypto.createDecipheriv('aes-256-cbc', secret, this.iv);
	        var decrypted = cypher.update(data.payload, 'base64', 'utf8');
	        decrypted += cypher.final('utf8');
	        return decrypted;
	    };
	    Decryptor.curve = "prime256v1";
	    return Decryptor;
	}());
	exports.Decryptor = Decryptor;


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("crypto");

/***/ }
/******/ ]);