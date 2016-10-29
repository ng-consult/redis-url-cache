module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var cacheEnginePromise_1 = __webpack_require__(1);
	var cacheEngineCB_1 = __webpack_require__(13);
	var instance_1 = __webpack_require__(14);
	var CacheRulesCreator_1 = __webpack_require__(16);
	module.exports.RedisUrlCache = {
	    CacheEnginePromise: cacheEnginePromise_1.default,
	    CacheEngineCB: cacheEngineCB_1.default,
	    Instance: instance_1.default,
	    CacheCreator: CacheRulesCreator_1.default
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var es6_promise_1 = __webpack_require__(2);
	var helpers_1 = __webpack_require__(3);
	var dbug = __webpack_require__(5);
	var cache_1 = __webpack_require__(6);
	var CacheEngine_1 = __webpack_require__(7);
	var instancePromise_1 = __webpack_require__(8);
	var debug = dbug('simple-url-cache');
	var CacheEnginePromise = (function (_super) {
	    __extends(CacheEnginePromise, _super);
	    function CacheEnginePromise(defaultDomain, instance) {
	        _super.call(this, defaultDomain, instance);
	        this.storageInstance = new instancePromise_1.default(instance);
	    }
	    CacheEnginePromise.prototype.clearDomain = function (domain) {
	        var _this = this;
	        if (typeof domain === 'undefined') {
	            domain = this.defaultDomain;
	        }
	        helpers_1.default.isStringDefined(domain);
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            _this.storageInstance.clearDomain(domain).then(function () {
	                resolve(true);
	            }, function (err) {
	                reject(err);
	            });
	        });
	    };
	    CacheEnginePromise.prototype.clearInstance = function () {
	        var _this = this;
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            _this.storageInstance.clearCache().then(function () {
	                resolve(true);
	            }, function (err) {
	                reject(err);
	            });
	        });
	    };
	    CacheEnginePromise.prototype.getStoredHostnames = function () {
	        var _this = this;
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            _this.storageInstance.getCachedDomains().then(function (domains) {
	                resolve(domains);
	            }, function (err) {
	                reject(err);
	            });
	        });
	    };
	    CacheEnginePromise.prototype.getStoredURLs = function (domain) {
	        var _this = this;
	        if (typeof domain === 'undefined') {
	            domain = this.defaultDomain;
	        }
	        helpers_1.default.isStringDefined(domain);
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            _this.storageInstance.getCachedURLs(domain).then(function (urls) {
	                resolve(urls);
	            }, function (err) {
	                reject(err);
	            });
	        });
	    };
	    CacheEnginePromise.prototype.url = function (url) {
	        var parsedURL = helpers_1.default.parseURL(url);
	        if (parsedURL.domain.length === 0) {
	            parsedURL.domain = this.defaultDomain;
	        }
	        var cache = new cache_1.UrlPromise(parsedURL.domain, this.storageInstance, this.instanceName, parsedURL.relativeURL);
	        this.addUrl(cache);
	        return cache;
	    };
	    return CacheEnginePromise;
	}(CacheEngine_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = CacheEnginePromise;


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("es6-promise");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var nodeurl = __webpack_require__(4);
	var debug = __webpack_require__(5)('simple-url-cache');
	var Helpers = (function () {
	    function Helpers() {
	    }
	    Helpers.isRedis = function (storageConfig) {
	        return typeof storageConfig.host !== 'undefined';
	    };
	    Helpers.isStringDefined = function (input) {
	        if (typeof input !== 'string' || input.length === 0) {
	            Helpers.invalidParameterError('this should be a non empty string', input);
	        }
	    };
	    Helpers.isStringIn = function (input, values) {
	        if (typeof input !== 'string') {
	            return false;
	        }
	        var valid = false;
	        values.forEach(function (value) {
	            if (value === input) {
	                valid = true;
	            }
	        });
	        if (!valid) {
	            Helpers.invalidParameterError('This string should contain only these values : ' + values.join(', '), input);
	        }
	    };
	    Helpers.parseURL = function (url) {
	        Helpers.isStringDefined(url);
	        var parsedURL = nodeurl.parse(url);
	        var relativeURL = parsedURL.path;
	        if (!/\//.test(relativeURL)) {
	            relativeURL = '/' + relativeURL;
	        }
	        parsedURL.pathname = null;
	        parsedURL.path = null;
	        parsedURL.hash = null;
	        parsedURL.query = null;
	        parsedURL.search = null;
	        var domain = nodeurl.format(parsedURL);
	        debug('parseURL result: ', domain, relativeURL);
	        if (domain === relativeURL) {
	            Helpers.invalidParameterError('invalid URL ', url);
	        }
	        return {
	            domain: domain,
	            relativeURL: relativeURL
	        };
	    };
	    Helpers.isNotUndefined = function () {
	        var input = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            input[_i - 0] = arguments[_i];
	        }
	        if (input.length = 0) {
	            Helpers.invalidParameterError('No parameters required', input);
	        }
	        for (var i in input) {
	            if (typeof input === 'undefined') {
	                Helpers.invalidParameterError('Undefined parameter provided at index ', i);
	            }
	        }
	    };
	    Helpers.isArray = function (data) {
	        if ((data instanceof Array) === false) {
	            Helpers.invalidParameterError('This should be an array', data);
	        }
	    };
	    Helpers.hasMaxAge = function (data) {
	        if (typeof data.maxAge !== 'number') {
	            Helpers.invalidParameterError('This rule misses a maxAge property', data);
	        }
	    };
	    Helpers.isBoolean = function (data) {
	        if (typeof data !== 'boolean') {
	            Helpers.invalidParameterError('This is not a boolean probably the force param missing', data);
	        }
	    };
	    Helpers.isOptionalBoolean = function (data) {
	        if (typeof data !== 'undefined' && typeof data !== 'boolean') {
	            Helpers.invalidParameterError('You provided an optional boolean but this is not a boolean', data);
	        }
	    };
	    Helpers.SameRegex = function (r1, r2) {
	        if (r1 instanceof RegExp && r2 instanceof RegExp) {
	            var props = ["global", "multiline", "ignoreCase", "source"];
	            for (var i = 0; i < props.length; i++) {
	                var prop = props[i];
	                if (r1[prop] !== r2[prop]) {
	                    return false;
	                }
	            }
	            return true;
	        }
	        return false;
	    };
	    Helpers.isMaxAgeRegexRule = function (rule) {
	        Helpers.isConfigRegexRule(rule);
	        if (typeof rule.maxAge !== 'number') {
	            Helpers.invalidParameterError('This isnt a valid MaxAge RegexRule - one of the rule misses maxAge prop', rule);
	        }
	    };
	    Helpers.isConfigRegexRule = function (rule) {
	        if ((rule.regex instanceof RegExp) === false) {
	            Helpers.invalidParameterError('This isnt a valid RegexRule - the rule is not a regex', rule);
	        }
	        if (typeof rule.ignoreQuery !== 'boolean') {
	            Helpers.invalidParameterError('This isnt a valid RegexRule - the rule misses ignoreQuery prop', rule);
	        }
	    };
	    Helpers.validateCacheConfig = function (cacheRules) {
	        Helpers.isStringIn(cacheRules.default, ['always', 'never']);
	        Helpers.isNotUndefined(cacheRules.maxAge, cacheRules.always, cacheRules.never);
	        ['always', 'never', 'maxAge'].forEach(function (type) {
	            Helpers.isArray(cacheRules[type]);
	            for (var key in cacheRules[type]) {
	                if (typeof cacheRules[type][key].domain !== 'string' && (cacheRules[type][key].domain instanceof RegExp) === false) {
	                    Helpers.invalidParameterError('Domain must be either a regex or a string', cacheRules[type][key].domain);
	                }
	                Helpers.isArray(cacheRules[type][key].rules);
	                cacheRules[type][key].rules.forEach(function (rule) {
	                    if (type === 'maxAge') {
	                        Helpers.isMaxAgeRegexRule(rule);
	                    }
	                    else {
	                        Helpers.isConfigRegexRule(rule);
	                    }
	                });
	            }
	        });
	    };
	    Helpers.JSONRegExpReplacer = function (key, value) {
	        if (value instanceof RegExp) {
	            return ("__REGEXP " + value.toString());
	        }
	        else {
	            return value;
	        }
	    };
	    Helpers.JSONRegExpReviver = function (key, value) {
	        if (value.toString().indexOf("__REGEXP ") == 0) {
	            var m = value.split("__REGEXP ")[1].match(/\/(.*)\/(.*)?/);
	            return new RegExp(m[1], m[2] || "");
	        }
	        else {
	            return value;
	        }
	    };
	    Helpers.getConfigKey = function () {
	        return 'url-cache:ruleconfig';
	    };
	    Helpers.validateRedisStorageConfig = function (data) {
	        return false;
	    };
	    Helpers.invalidParameterError = function (name, value) {
	        throw new TypeError('Invalid parameter: ' + name + '. Value received: ' + JSON.stringify(value));
	    };
	    Helpers.RedisError = function (description, msg) {
	        throw new Error('Redis: ' + description + '. Error received: ' + msg);
	    };
	    return Helpers;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Helpers;


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("url");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("debug");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var helpers_1 = __webpack_require__(3);
	var debug = __webpack_require__(5)('simple-url-cache');
	var UrlCommon = (function () {
	    function UrlCommon(_domain, _storageInstance, _instanceName, _url) {
	        var _this = this;
	        this._domain = _domain;
	        this._instanceName = _instanceName;
	        this._url = _url;
	        this._category = '';
	        this._maxAge = 0;
	        this.getRegexTest = function (u) {
	            return u.regex.test(_this._url);
	        };
	        if (this.hasPromise(_storageInstance)) {
	            this._storagePromise = _storageInstance;
	            this._storage = _storageInstance;
	        }
	        else {
	            this._storageCB = _storageInstance;
	            this._storage = _storageInstance;
	        }
	        this.setCacheCategory();
	    }
	    UrlCommon.prototype.hasPromise = function (storage) {
	        return storage.getMethod() === 'promise';
	    };
	    UrlCommon.prototype.getDomain = function () {
	        return this._domain;
	    };
	    UrlCommon.prototype.getCategory = function () {
	        return this._category;
	    };
	    UrlCommon.prototype.getInstanceName = function () {
	        return this._instanceName;
	    };
	    UrlCommon.prototype.getUrl = function () {
	        return this._url;
	    };
	    UrlCommon.prototype.getTTL = function () {
	        return this._maxAge;
	    };
	    UrlCommon.prototype.checkDomain = function (stored) {
	        if (typeof stored === 'string') {
	            return this._domain.indexOf(stored) !== -1;
	        }
	        else {
	            return stored.test(this._domain);
	        }
	    };
	    UrlCommon.prototype.setCacheCategory = function () {
	        var key, domain, i;
	        var config = this._storage.getCacheRules();
	        debug('config loaded: ', config);
	        for (key = 0; key < config.maxAge.length; key++) {
	            if (this.checkDomain(config.maxAge[key].domain)) {
	                for (i = 0; i < config.maxAge[key].rules.length; i++) {
	                    if (this.getRegexTest(config.maxAge[key].rules[i]) === true) {
	                        this._category = 'maxAge';
	                        this._maxAge = config.maxAge[key].rules[i].maxAge;
	                        return;
	                    }
	                }
	            }
	        }
	        for (key = 0; key < config.always.length; key++) {
	            if (this.checkDomain(config.always[key].domain)) {
	                for (i = 0; i < config.always[key].rules.length; i++) {
	                    if (this.getRegexTest(config.always[key].rules[i]) === true) {
	                        this._category = 'always';
	                        return;
	                    }
	                }
	            }
	        }
	        for (key = 0; key < config.never.length; key++) {
	            if (this.checkDomain(config.never[key].domain)) {
	                for (i = 0; i < config.never[key].rules.length; i++) {
	                    if (this.getRegexTest(config.never[key].rules[i]) === true) {
	                        this._category = 'never';
	                        return;
	                    }
	                }
	            }
	        }
	        this._category = config.default;
	    };
	    ;
	    return UrlCommon;
	}());
	exports.UrlCommon = UrlCommon;
	var UrlPromise = (function (_super) {
	    __extends(UrlPromise, _super);
	    function UrlPromise() {
	        var _this = this;
	        _super.apply(this, arguments);
	        this.delete = function () {
	            return _this._storagePromise.delete(_this.getDomain(), _this.getUrl(), _this.getCategory(), _this.getTTL());
	        };
	        this.get = function () {
	            return _this._storagePromise.get(_this.getDomain(), _this.getUrl(), _this.getCategory(), _this.getTTL());
	        };
	        this.has = function () {
	            return _this._storagePromise.has(_this.getDomain(), _this.getUrl(), _this.getCategory(), _this.getTTL());
	        };
	        this.set = function (content, extra, force) {
	            helpers_1.default.isStringDefined(content);
	            helpers_1.default.isOptionalBoolean(force);
	            if (typeof force === 'undefined') {
	                force = false;
	            }
	            return _this._storagePromise.set(_this.getDomain(), _this.getUrl(), content, extra, _this.getCategory(), _this.getTTL(), force);
	        };
	    }
	    return UrlPromise;
	}(UrlCommon));
	exports.UrlPromise = UrlPromise;
	var UrlCB = (function (_super) {
	    __extends(UrlCB, _super);
	    function UrlCB() {
	        var _this = this;
	        _super.apply(this, arguments);
	        this.delete = function (cb) {
	            _this._storageCB.delete(_this.getDomain(), _this.getUrl(), _this.getCategory(), _this.getTTL(), cb);
	        };
	        this.get = function (cb) {
	            _this._storageCB.get(_this.getDomain(), _this.getUrl(), _this.getCategory(), _this.getTTL(), cb);
	        };
	        this.has = function (cb) {
	            _this._storageCB.has(_this.getDomain(), _this.getUrl(), _this.getCategory(), _this.getTTL(), cb);
	        };
	        this.set = function (content, extra, force, cb) {
	            helpers_1.default.isStringDefined(content);
	            helpers_1.default.isBoolean(force);
	            _this._storageCB.set(_this.getDomain(), _this.getUrl(), content, extra, _this.getCategory(), _this.getTTL(), force, cb);
	        };
	    }
	    return UrlCB;
	}(UrlCommon));
	exports.UrlCB = UrlCB;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var helpers_1 = __webpack_require__(3);
	var debug = __webpack_require__(5)('simple-url-cache');
	var CacheEngine = (function () {
	    function CacheEngine(defaultDomain, instanceDefinition) {
	        this.defaultDomain = defaultDomain;
	        this.instanceDefinition = instanceDefinition;
	        helpers_1.default.isNotUndefined(defaultDomain, instanceDefinition);
	        helpers_1.default.isStringDefined(defaultDomain);
	        if (instanceDefinition.isInstanciated() === false) {
	            var errorMsg = 'This instance hasn\'t initiated correctly: ' + instanceDefinition.getInstanceName();
	            console.error(errorMsg);
	            throw new Error(errorMsg);
	        }
	        this.instanceName = instanceDefinition.getInstanceName();
	        if (instanceDefinition.getConfig().on_publish_update === true && typeof CacheEngine.urls[this.instanceName] === 'undefined') {
	            CacheEngine.urls[this.instanceName] = {};
	        }
	    }
	    CacheEngine.updateAllUrlCategory = function (instanceName) {
	        helpers_1.default.isStringDefined(instanceName);
	        if (typeof CacheEngine.urls[instanceName] !== 'undefined') {
	            var key = void 0;
	            for (key in CacheEngine.urls[instanceName]) {
	                CacheEngine.urls[instanceName][key].setCacheCategory();
	            }
	        }
	    };
	    CacheEngine.prototype.getInstanceName = function () {
	        return this.instanceName;
	    };
	    CacheEngine.prototype.addUrl = function (url) {
	        if (typeof CacheEngine.urls[this.instanceName] !== 'undefined' && typeof CacheEngine.urls[this.instanceName][this.buildURLIndex(url)] === 'undefined') {
	            CacheEngine.urls[this.instanceName][this.buildURLIndex(url)] = url;
	        }
	    };
	    CacheEngine.prototype.buildURLIndex = function (url) {
	        return this.instanceName + '_' + url.getDomain() + '_' + url.getUrl();
	    };
	    CacheEngine.urls = {};
	    CacheEngine.helpers = {
	        validateRedisStorageConfig: helpers_1.default.validateRedisStorageConfig,
	        validateCacheConfig: helpers_1.default.validateCacheConfig
	    };
	    CacheEngine.hashKey = 'url-cache:';
	    return CacheEngine;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = CacheEngine;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var debg = __webpack_require__(5);
	var es6_promise_1 = __webpack_require__(2);
	var instanceCB_1 = __webpack_require__(9);
	var storage_1 = __webpack_require__(12);
	var debug = debg('simple-url-cache-REDIS');
	var RedisStoragePromise = (function (_super) {
	    __extends(RedisStoragePromise, _super);
	    function RedisStoragePromise(instance) {
	        _super.call(this);
	        this.instance = instance;
	        this.hashKey = 'simple-url-cache:' + instance.getInstanceName();
	        this.cbInstance = new instanceCB_1.default(instance);
	        this.method = 'promise';
	    }
	    RedisStoragePromise.prototype.getCacheRules = function () {
	        return this.instance.getManager().getRules();
	    };
	    RedisStoragePromise.prototype.clearCache = function () {
	        var _this = this;
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            _this.cbInstance.clearCache(function (err, results) {
	                if (err) {
	                    debug(err);
	                    reject(err);
	                }
	                else {
	                    resolve(results);
	                }
	            });
	        });
	    };
	    RedisStoragePromise.prototype.clearDomain = function (domain) {
	        var _this = this;
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            _this.cbInstance.clearDomain(domain, function (err, results) {
	                if (err) {
	                    debug(err);
	                    reject(err);
	                }
	                else {
	                    resolve(results);
	                }
	            });
	        });
	    };
	    RedisStoragePromise.prototype.getCachedDomains = function () {
	        var _this = this;
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            _this.cbInstance.getCachedDomains(function (err, results) {
	                if (err) {
	                    debug(err);
	                    reject(err);
	                }
	                else {
	                    resolve(results);
	                }
	            });
	        });
	    };
	    RedisStoragePromise.prototype.getCachedURLs = function (domain) {
	        var _this = this;
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            _this.cbInstance.getCachedURLs(domain, function (err, results) {
	                if (err) {
	                    debug(err);
	                    reject(err);
	                }
	                else {
	                    resolve(results);
	                }
	            });
	        });
	    };
	    RedisStoragePromise.prototype.delete = function (domain, url, category, ttl) {
	        var _this = this;
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            _this.cbInstance.delete(domain, url, category, ttl, function (err, results) {
	                if (err) {
	                    reject(err);
	                }
	                else {
	                    resolve(results);
	                }
	            });
	        });
	    };
	    RedisStoragePromise.prototype.destroy = function () {
	        this.cbInstance.destroy();
	    };
	    RedisStoragePromise.prototype.get = function (domain, url, category, ttl) {
	        var _this = this;
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            _this.cbInstance.get(domain, url, category, ttl, function (err, results) {
	                if (err) {
	                    debug(err);
	                    reject(err);
	                }
	                else {
	                    resolve(results);
	                }
	            });
	        });
	    };
	    RedisStoragePromise.prototype.has = function (domain, url, category, ttl) {
	        var _this = this;
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            _this.cbInstance.has(domain, url, category, ttl, function (err, results) {
	                if (err) {
	                    debug(err);
	                    reject(err);
	                }
	                else {
	                    resolve(results);
	                }
	            });
	        });
	    };
	    RedisStoragePromise.prototype.set = function (domain, url, value, extra, category, ttl, force) {
	        var _this = this;
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            _this.cbInstance.set(domain, url, value, extra, category, ttl, force, function (err, results) {
	                if (err) {
	                    debug(err);
	                    reject(err);
	                }
	                else {
	                    resolve(results);
	                }
	            });
	        });
	    };
	    return RedisStoragePromise;
	}(storage_1.StoragePromise));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = RedisStoragePromise;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var pool_1 = __webpack_require__(10);
	var debg = __webpack_require__(5);
	var CacheEngine_1 = __webpack_require__(7);
	var storage_1 = __webpack_require__(12);
	var debug = debg('simple-url-cache-REDIS');
	var RedisStorageCB = (function (_super) {
	    __extends(RedisStorageCB, _super);
	    function RedisStorageCB(instance) {
	        _super.call(this);
	        this.instance = instance;
	        this._conn = pool_1.RedisPool.getConnection(instance.getInstanceName());
	        this.hashKey = CacheEngine_1.default.hashKey + this.instance.getInstanceName();
	        this.method = 'callback';
	    }
	    RedisStorageCB.prototype.clearCache = function (cb) {
	        var _this = this;
	        var batch = this._conn.batch();
	        this._conn.hkeys(this.hashKey, function (err, domains) {
	            debug(err);
	            if (err)
	                return cb(err);
	            if (domains.length === 0) {
	                return cb(null, true);
	            }
	            var nb = 0;
	            domains.forEach(function (domain) {
	                batch.del(_this.getDomainHashKey(domain));
	                batch.hdel(_this.hashKey, domain);
	                _this._conn.hkeys(_this.getDomainHashKey(domain), function (err, keys) {
	                    debug('keys = ', keys);
	                    keys.forEach(function (key) {
	                        batch.del(_this.getUrlKey(domain, key));
	                    });
	                    nb++;
	                    if (nb === domains.length) {
	                        batch.exec(function (err) {
	                            debug(err);
	                            if (err)
	                                return cb(err);
	                            return cb(null, true);
	                        });
	                    }
	                });
	            });
	        });
	    };
	    RedisStorageCB.prototype.clearDomain = function (domain, cb) {
	        var _this = this;
	        this._conn.hdel(this.hashKey, domain, function (err) {
	            if (err)
	                return cb(err);
	            _this._conn.hkeys(_this.getDomainHashKey(domain), function (err, urls) {
	                if (urls.length === 0) {
	                    return cb(null, true);
	                }
	                var nb = 0;
	                urls.forEach(function (url) {
	                    _this.delete(domain, url, null, null, function (err) {
	                        if (err)
	                            return cb(err);
	                        nb++;
	                        if (nb === urls.length) {
	                            cb(null, true);
	                        }
	                    });
	                });
	            });
	        });
	    };
	    RedisStorageCB.prototype.getCachedDomains = function (cb) {
	        this._conn.hkeys(this.hashKey, function (err, results) {
	            if (err)
	                return cb(err);
	            return cb(null, results);
	        });
	    };
	    RedisStorageCB.prototype.getCachedURLs = function (domain, cb) {
	        var _this = this;
	        var cachedUrls = [];
	        this._conn.hkeys(this.getDomainHashKey(domain), function (err, urls) {
	            if (err)
	                return cb(err);
	            if (urls.length === 0) {
	                return cb(null, cachedUrls);
	            }
	            var nb = 0;
	            urls.forEach(function (url) {
	                _this._conn.get(_this.getUrlKey(domain, url), function (err, data) {
	                    if (err)
	                        return cb(err);
	                    if (data !== null) {
	                        cachedUrls.push(url);
	                        nb++;
	                        if (nb === urls.length) {
	                            return cb(null, cachedUrls);
	                        }
	                    }
	                    else {
	                        _this._conn.hdel(_this.getDomainHashKey(domain), url, function (err) {
	                            if (err)
	                                return cb(err);
	                            nb++;
	                            if (nb === urls.length) {
	                                return cb(null, cachedUrls);
	                            }
	                        });
	                    }
	                });
	            });
	        });
	    };
	    RedisStorageCB.prototype.getCacheRules = function () {
	        return this.instance.getManager().getRules();
	    };
	    RedisStorageCB.prototype.delete = function (domain, url, category, ttl, cb) {
	        var _this = this;
	        this.has(domain, url, category, ttl, function (err, isCached) {
	            if (!isCached) {
	                return cb('url is not cached');
	            }
	            else {
	                _this._conn.del(_this.getUrlKey(domain, url), function (err) {
	                    if (err) {
	                        return cb(err);
	                    }
	                    _this._conn.hdel(_this.getDomainHashKey(domain), url, function (err) {
	                        if (err) {
	                            return cb(err);
	                        }
	                        return cb(null, true);
	                    });
	                });
	            }
	        });
	    };
	    RedisStorageCB.prototype.destroy = function () {
	        pool_1.RedisPool.kill(this.instance.getInstanceName());
	    };
	    RedisStorageCB.prototype.get = function (domain, url, category, ttl, cb) {
	        var _this = this;
	        this._conn.hget(this.getDomainHashKey(domain), url, function (err, content) {
	            if (err)
	                return cb(err);
	            if (content === null) {
	                return cb('url not cached');
	            }
	            _this._conn.get(_this.getUrlKey(domain, url), function (err, data) {
	                if (err)
	                    return cb(err);
	                if (data === null) {
	                    _this._conn.hdel(_this.getDomainHashKey(domain), _this.getUrlKey(domain, url), function (err) {
	                        if (err)
	                            return cb(err);
	                        return cb('url not cached - cleaning timestamp informations');
	                    });
	                }
	                else {
	                    var deserializedContent = JSON.parse(data);
	                    return cb(null, { content: content, createdOn: deserializedContent.timestamp, extra: deserializedContent.extra });
	                }
	            });
	        });
	    };
	    RedisStorageCB.prototype.has = function (domain, url, category, ttl, cb) {
	        var _this = this;
	        this._conn.get(this.getUrlKey(domain, url), function (err, data) {
	            if (err) {
	                debug('Error while querying is cached on redis: ', domain, url, err);
	                return cb(err);
	            }
	            else {
	                var isCached = data !== null;
	                if (!isCached) {
	                    _this._conn.hdel(_this.getDomainHashKey(domain), url, function (err) {
	                        if (err)
	                            return cb(err);
	                        return cb(null, false);
	                    });
	                }
	                else {
	                    return cb(null, true);
	                }
	            }
	        });
	    };
	    RedisStorageCB.prototype.set = function (domain, url, value, extra, category, ttl, force, cb) {
	        var _this = this;
	        if (force === true) {
	            this.store(domain, url, value, extra, ttl, function (err, result) {
	                if (err)
	                    return cb(err);
	                return cb(null, result);
	            });
	        }
	        else if (category === 'never') {
	            return cb(null, false);
	        }
	        else {
	            this.has(domain, url, category, ttl, function (err, has) {
	                if (err)
	                    return cb(err);
	                if (has === true) {
	                    return cb(null, false);
	                }
	                else {
	                    _this.store(domain, url, value, extra, ttl, function (err, result) {
	                        if (err)
	                            return cb(err);
	                        return cb(null, result);
	                    });
	                }
	            });
	        }
	    };
	    ;
	    RedisStorageCB.prototype.getDomainHashKey = function (domain) {
	        return this.hashKey + ':' + domain;
	    };
	    RedisStorageCB.prototype.store = function (domain, url, value, extra, ttl, cb) {
	        var _this = this;
	        this._conn.hset(this.hashKey, domain, domain, function (err) {
	            if (err) {
	                return cb(err);
	            }
	            else {
	                _this._conn.hset(_this.getDomainHashKey(domain), url, value, function (err, exists) {
	                    if (err) {
	                        return cb(err);
	                    }
	                    _this._conn.set(_this.getUrlKey(domain, url), JSON.stringify({ timestamp: Date.now(), extra: extra }), function (err) {
	                        if (err)
	                            return cb(err);
	                        if (ttl > 0) {
	                            _this._conn.expire(_this.getUrlKey(domain, url), ttl, function (err) {
	                                if (err)
	                                    return cb(err);
	                                return cb(null, true);
	                            });
	                        }
	                        else {
	                            return cb(null, true);
	                        }
	                    });
	                });
	            }
	        });
	    };
	    RedisStorageCB.prototype.getUrlKey = function (domain, url) {
	        return this.getDomainHashKey(domain) + ':' + url;
	    };
	    return RedisStorageCB;
	}(storage_1.StorageCB));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = RedisStorageCB;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var redis = __webpack_require__(11);
	var dbug = __webpack_require__(5);
	var debug = dbug('simple-url-cache-REDIS');
	var RedisPool = (function () {
	    function RedisPool() {
	    }
	    RedisPool.connect = function (instanceName, config, cb) {
	        if (typeof RedisPool._pool[instanceName] === 'undefined' ||
	            RedisPool._pool[instanceName] === null ||
	            typeof RedisPool._sub[instanceName] === 'undefined' ||
	            RedisPool._sub[instanceName] === null) {
	            debug('This redis connection has never been instanciated before', instanceName);
	            RedisPool._status[instanceName] = {
	                online: {
	                    pool: false,
	                    sub: false
	                },
	                lastError: null,
	                warnings: []
	            };
	            RedisPool._pool[instanceName] = redis.createClient(config);
	            RedisPool._sub[instanceName] = redis.createClient(config);
	            var nb = 0;
	            var nbErrors = 0;
	            RedisPool._pool[instanceName].on('connect', function () {
	                RedisPool._status[instanceName].online.pool = true;
	                debug('pool redis connected');
	                nb++;
	                if (nb === 2) {
	                    debug('POOL CONNECTED 2 conns');
	                    cb(null);
	                }
	            });
	            RedisPool._sub[instanceName].on('connect', function () {
	                RedisPool._status[instanceName].online.sub = true;
	                debug('redis connected');
	                nb++;
	                if (nb === 2) {
	                    debug('POOL CONNECTED 2 conns');
	                    cb(null);
	                }
	            });
	            RedisPool._pool[instanceName].on('error', function (e) {
	                RedisPool._status[instanceName].lastError = e;
	                nbErrors++;
	                debug(nbErrors, e);
	                if (nbErrors === 1) {
	                    cb(e);
	                }
	            });
	            RedisPool._pool[instanceName].on('end', function () {
	                RedisPool._pool[instanceName] = null;
	                RedisPool._status[instanceName].online.pool = false;
	                RedisPool.kill(instanceName);
	                console.warn('Redis Connection closed for instance ' + instanceName);
	                debug('Connection closed', instanceName);
	            });
	            RedisPool._pool[instanceName].on('warning', function (msg) {
	                console.warn('Redis warning for instance ' + instanceName + '. MSG = ', msg);
	                RedisPool._status[instanceName].warnings.push(msg);
	                debug('Warning called: ', instanceName, msg);
	            });
	            RedisPool._sub[instanceName].on('error', function (e) {
	                RedisPool._status[instanceName].lastError = e;
	                nbErrors++;
	                debug(nbErrors, e);
	                if (nbErrors === 1) {
	                    cb(e);
	                }
	            });
	            RedisPool._sub[instanceName].on('end', function () {
	                RedisPool._sub[instanceName] = null;
	                RedisPool._status[instanceName].online.sub = false;
	                RedisPool.kill(instanceName);
	                console.warn('Redis Connection closed for instance ' + instanceName);
	                debug('Connection closed', instanceName);
	            });
	            RedisPool._sub[instanceName].on('warning', function (msg) {
	                console.warn('Redis warning for instance ' + instanceName + '. MSG = ', msg);
	                RedisPool._status[instanceName].warnings.push(msg);
	                debug('Warning called: ', instanceName, msg);
	            });
	        }
	        else {
	            cb(null);
	        }
	    };
	    RedisPool.kill = function (instanceName) {
	        if (RedisPool._status[instanceName].online.sub === true) {
	            RedisPool._sub[instanceName].end();
	        }
	        if (RedisPool._status[instanceName].online.pool === true) {
	            RedisPool._pool[instanceName].end();
	        }
	    };
	    RedisPool.getConnection = function (instanceName) {
	        if (RedisPool._status[instanceName].online) {
	            return RedisPool._pool[instanceName];
	        }
	        debug('Redis Pool isn\'t online yet');
	    };
	    RedisPool.getSubscriberConnection = function (instanceName) {
	        if (RedisPool._status[instanceName].online) {
	            return RedisPool._sub[instanceName];
	        }
	        debug('Redis Pool isn\'t online yet');
	    };
	    RedisPool._pool = {};
	    RedisPool._sub = {};
	    RedisPool._status = {};
	    return RedisPool;
	}());
	exports.RedisPool = RedisPool;


/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("redis");

/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Storage = (function () {
	    function Storage() {
	    }
	    Storage.prototype.getMethod = function () {
	        return this.method;
	    };
	    return Storage;
	}());
	var StoragePromise = (function (_super) {
	    __extends(StoragePromise, _super);
	    function StoragePromise() {
	        _super.apply(this, arguments);
	    }
	    return StoragePromise;
	}(Storage));
	exports.StoragePromise = StoragePromise;
	var StorageCB = (function (_super) {
	    __extends(StorageCB, _super);
	    function StorageCB() {
	        _super.apply(this, arguments);
	    }
	    return StorageCB;
	}(Storage));
	exports.StorageCB = StorageCB;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var instanceCB_1 = __webpack_require__(9);
	var helpers_1 = __webpack_require__(3);
	var cache_1 = __webpack_require__(6);
	var CacheEngine_1 = __webpack_require__(7);
	var dbug = __webpack_require__(5);
	var debug = dbug('simple-url-cache');
	var CacheEngineCB = (function (_super) {
	    __extends(CacheEngineCB, _super);
	    function CacheEngineCB(defaultDomain, instance) {
	        _super.call(this, defaultDomain, instance);
	        this.storageInstance = new instanceCB_1.default(instance);
	    }
	    CacheEngineCB.prototype.clearDomain = function (domain, cb) {
	        helpers_1.default.isStringDefined(domain);
	        this.storageInstance.clearDomain(domain, cb);
	    };
	    CacheEngineCB.prototype.clearInstance = function (cb) {
	        this.storageInstance.clearCache(cb);
	    };
	    CacheEngineCB.prototype.getStoredHostnames = function (cb) {
	        this.storageInstance.getCachedDomains(cb);
	    };
	    CacheEngineCB.prototype.getStoredURLs = function (domain, cb) {
	        helpers_1.default.isStringDefined(domain);
	        this.storageInstance.getCachedURLs(domain, cb);
	    };
	    CacheEngineCB.prototype.url = function (url) {
	        var parsedURL = helpers_1.default.parseURL(url);
	        if (parsedURL.domain.length === 0) {
	            parsedURL.domain = this.defaultDomain;
	        }
	        var cache = new cache_1.UrlCB(parsedURL.domain, this.storageInstance, this.instanceName, parsedURL.relativeURL);
	        this.addUrl(cache);
	        return cache;
	    };
	    return CacheEngineCB;
	}(CacheEngine_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = CacheEngineCB;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var helpers_1 = __webpack_require__(3);
	var pool_1 = __webpack_require__(10);
	var CacheEngine_1 = __webpack_require__(7);
	var CacheRuleManager_1 = __webpack_require__(15);
	var debug = __webpack_require__(5)('simple-url-cache');
	var Instance = (function () {
	    function Instance(instanceName, redisConfig, config, cb) {
	        var _this = this;
	        if (config === void 0) { config = { on_existing_regex: 'replace', on_publish_update: false }; }
	        this.instanceName = instanceName;
	        this.redisConfig = redisConfig;
	        this.config = config;
	        this.instanciated = false;
	        helpers_1.default.isNotUndefined(instanceName, redisConfig, config, cb);
	        this.config = Object.assign({ on_existing_regex: 'replace', on_publish_update: false }, config);
	        pool_1.RedisPool.connect(instanceName, redisConfig, function (err) {
	            if (err)
	                return cb('Error connecting to REDIS: ' + err);
	            var redisConn = pool_1.RedisPool.getConnection(instanceName);
	            redisConn.hget(helpers_1.default.getConfigKey(), _this.instanceName, function (err, data) {
	                if (err)
	                    return cb('Redis error - retrieving ' + helpers_1.default.getConfigKey() + ' -> ' + err);
	                if (data === null) {
	                    return cb('No CacheRule defined for this instance ' + _this.instanceName);
	                }
	                else {
	                    _this.instanciated = true;
	                    var parsedData = JSON.parse(data, helpers_1.default.JSONRegExpReviver);
	                    _this.manager = new CacheRuleManager_1.default(parsedData, config.on_existing_regex);
	                    _this.launchSubscriber();
	                    cb(null);
	                }
	            });
	        });
	    }
	    Instance.prototype.launchSubscriber = function () {
	        var _this = this;
	        var subscriber = pool_1.RedisPool.getSubscriberConnection(this.instanceName);
	        subscriber.subscribe(this.getChannel());
	        subscriber.on('message', function (channel, message) {
	            if (message === 'PUSHED') {
	                _this.onPublish();
	            }
	        });
	    };
	    Instance.prototype.getChannel = function () {
	        return helpers_1.default.getConfigKey() + this.instanceName;
	    };
	    Instance.prototype.publish = function () {
	        var _this = this;
	        CacheEngine_1.default.updateAllUrlCategory(this.instanceName);
	        var redisConn = pool_1.RedisPool.getConnection(this.instanceName);
	        var stringified = JSON.stringify(this.manager.getRules(), helpers_1.default.JSONRegExpReplacer, 2);
	        redisConn.hset(helpers_1.default.getConfigKey(), this.instanceName, stringified, function (err) {
	            if (err)
	                helpers_1.default.RedisError('while publishing config ' + stringified, err);
	            redisConn.publish(_this.getChannel(), 'PUSHED');
	        });
	    };
	    Instance.prototype.onPublish = function () {
	        var _this = this;
	        var redisConn = pool_1.RedisPool.getConnection(this.instanceName);
	        redisConn.hget(helpers_1.default.getConfigKey(), this.instanceName, function (err, data) {
	            if (err)
	                throw new Error('Redis error - retrieving ' + helpers_1.default.getConfigKey());
	            if (data === null) {
	                throw new Error('Big mess');
	            }
	            var parsedData = JSON.parse(data, helpers_1.default.JSONRegExpReviver);
	            _this.manager.updateRules(parsedData);
	        });
	    };
	    Instance.prototype.getManager = function () {
	        return this.manager;
	    };
	    Instance.prototype.getConfig = function () {
	        return this.config;
	    };
	    Instance.prototype.getInstanceName = function () {
	        return this.instanceName;
	    };
	    Instance.prototype.getRedisConfig = function () {
	        return this.redisConfig;
	    };
	    Instance.prototype.isInstanciated = function () {
	        return this.instanciated;
	    };
	    Instance.prototype.destroy = function () {
	        pool_1.RedisPool.kill(this.instanceName);
	        this.instanciated = false;
	    };
	    return Instance;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Instance;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var helpers_1 = __webpack_require__(3);
	var debug = __webpack_require__(5)('simple-url-cache');
	var CacheRuleManager = (function () {
	    function CacheRuleManager(cacheRules, on_existing_regex) {
	        this.cacheRules = cacheRules;
	        this.on_existing_regex = on_existing_regex;
	    }
	    CacheRuleManager.prototype.addMaxAgeRule = function (domain, regex, maxAge, ignoreQuery) {
	        helpers_1.default.isNotUndefined(domain, regex, maxAge);
	        var regexRule = { regex: regex, maxAge: maxAge, ignoreQuery: ignoreQuery ? ignoreQuery : false };
	        helpers_1.default.isMaxAgeRegexRule(regexRule);
	        var found = this.findRegex(domain, regexRule);
	        this.add(domain, regexRule, 'maxAge', found);
	    };
	    CacheRuleManager.prototype.addNeverRule = function (domain, regex, ignoreQuery) {
	        helpers_1.default.isNotUndefined(regex);
	        var regexRule = { regex: regex, ignoreQuery: ignoreQuery ? ignoreQuery : false };
	        helpers_1.default.isConfigRegexRule(regexRule);
	        var found = this.findRegex(domain, regexRule);
	        this.add(domain, regexRule, 'never', found);
	    };
	    CacheRuleManager.prototype.addAlwaysRule = function (domain, regex, ignoreQuery) {
	        helpers_1.default.isNotUndefined(regex);
	        var regexRule = { regex: regex, ignoreQuery: ignoreQuery ? ignoreQuery : false };
	        helpers_1.default.isConfigRegexRule(regexRule);
	        var found = this.findRegex(domain, regexRule);
	        this.add(domain, regexRule, 'always', found);
	    };
	    CacheRuleManager.prototype.getRules = function () {
	        return this.cacheRules;
	    };
	    CacheRuleManager.prototype.setDefault = function (strategy) {
	        helpers_1.default.isStringIn(strategy, ['always', 'never']);
	        this.cacheRules.default = strategy;
	    };
	    CacheRuleManager.prototype.removeRule = function (domain, rule) {
	        helpers_1.default.isNotUndefined(rule);
	        helpers_1.default.isConfigRegexRule(rule);
	        var found = this.findRegex(domain, rule);
	        if (found !== null) {
	            this.cacheRules[found.type][found.index].rules.splice(found.subIndex, 1);
	            if (this.cacheRules[found.type][found.index].rules.length === 0) {
	                this.cacheRules[found.type].splice(found.index, 1);
	            }
	        }
	    };
	    CacheRuleManager.prototype.removeAllMaxAgeRules = function () {
	        this.cacheRules.maxAge = [];
	    };
	    CacheRuleManager.prototype.removeAllNeverRules = function () {
	        this.cacheRules.never = [];
	    };
	    CacheRuleManager.prototype.removeAllAlwaysRules = function (domain) {
	        this.cacheRules.always = [];
	    };
	    CacheRuleManager.prototype.updateRules = function (cacheRules) {
	        this.cacheRules = cacheRules;
	    };
	    CacheRuleManager.prototype.checkDomainMatch = function (stored, input) {
	        if (typeof stored === 'string' && typeof input === 'string') {
	            return stored === input;
	        }
	        else if (stored instanceof RegExp && input instanceof RegExp) {
	            return helpers_1.default.SameRegex(stored, input);
	        }
	        else {
	            return false;
	        }
	    };
	    CacheRuleManager.prototype.findRegex = function (domain, rule) {
	        var _this = this;
	        var info = null, index, subIndex;
	        ['always', 'never', 'maxAge'].forEach(function (type) {
	            for (index = 0; index < _this.cacheRules[type].length; index++) {
	                if (_this.checkDomainMatch(_this.cacheRules[type][index].domain, domain)) {
	                    for (subIndex = 0; subIndex < _this.cacheRules[type][index].rules.length; subIndex++) {
	                        if (helpers_1.default.SameRegex(rule.regex, _this.cacheRules[type][index].rules[subIndex].regex)) {
	                            info = {
	                                type: type,
	                                index: index,
	                                subIndex: subIndex
	                            };
	                            break;
	                        }
	                    }
	                }
	            }
	        });
	        return info;
	    };
	    CacheRuleManager.prototype.add = function (domain, rule, where, found) {
	        debug('adding rule ', domain, rule, where, found);
	        debug('before: ', this.cacheRules);
	        if (found !== null) {
	            switch (this.on_existing_regex) {
	                case 'ignore':
	                    return;
	                case 'replace':
	                    debug('replacing: ', this.cacheRules[found.type][found.index].rules, found.subIndex);
	                    this.cacheRules[found.type][found.index].rules.splice(found.subIndex, 1);
	                    break;
	                case 'error':
	                    throw new Error('Adding a maxAge regex that is already defined here: ' + JSON.parse(found));
	            }
	        }
	        if (found !== null && found.type === where) {
	            this.cacheRules[where][found.index].rules.push(rule);
	        }
	        else {
	            var index2update = void 0, index = void 0;
	            for (index = 0; index < this.cacheRules[where].length; index++) {
	                if (this.checkDomainMatch(this.cacheRules[where][index].domain, domain)) {
	                    index2update = index;
	                }
	            }
	            if (typeof index2update === 'number') {
	                debug('A domain already exists, so pusing rules at index ', index2update, this.cacheRules[where][index2update]);
	                this.cacheRules[where][index2update].rules.push(rule);
	            }
	            else {
	                this.cacheRules[where].push({
	                    domain: domain,
	                    rules: [rule]
	                });
	            }
	        }
	        return;
	    };
	    return CacheRuleManager;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = CacheRuleManager;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var pool_1 = __webpack_require__(10);
	var helpers_1 = __webpack_require__(3);
	var debug = __webpack_require__(5)('simple-url-cache');
	var CacheRulesCreator = (function () {
	    function CacheRulesCreator(instanceName, redisConfig, cb) {
	        var _this = this;
	        this.instanceName = instanceName;
	        this.redisConfig = redisConfig;
	        helpers_1.default.isNotUndefined(instanceName, redisConfig, cb);
	        debug('connecting to redis');
	        pool_1.RedisPool.connect(instanceName, redisConfig, function (err) {
	            if (err)
	                return cb('Error connecting to REDIS');
	            _this._conn = pool_1.RedisPool.getConnection(instanceName);
	            cb(null, _this);
	        });
	    }
	    CacheRulesCreator.prototype.importRules = function (rules, overwrite, cb) {
	        var _this = this;
	        helpers_1.default.isNotUndefined(rules, cb);
	        helpers_1.default.validateCacheConfig(rules);
	        this._conn.hget(helpers_1.default.getConfigKey(), this.instanceName, function (err, data) {
	            if (err)
	                return cb('Redis error - retrieving ' + helpers_1.default.getConfigKey() + ': ' + err);
	            if (data !== null && !overwrite) {
	                return cb('A CacheRule definition already exists for this instance');
	            }
	            var stringified = JSON.stringify(rules, helpers_1.default.JSONRegExpReplacer, 2);
	            _this._conn.hset(helpers_1.default.getConfigKey(), _this.instanceName, stringified, function (err) {
	                if (err)
	                    cb(err);
	                cb(null);
	            });
	        });
	    };
	    return CacheRulesCreator;
	}());
	var CacheCreator = (function () {
	    function CacheCreator() {
	    }
	    CacheCreator.createCache = function (instanceName, force, redisConfig, rules, cb) {
	        helpers_1.default.isNotUndefined(instanceName, force, redisConfig, rules, cb);
	        new CacheRulesCreator(instanceName, redisConfig, function (err, creator) {
	            if (err) {
	                return cb(err);
	            }
	            creator.importRules(rules, force, function (err) {
	                if (err) {
	                    return cb(err);
	                }
	                cb(null);
	            });
	        });
	    };
	    return CacheCreator;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = CacheCreator;


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDhiMjBkMjkwYjg3NmY0ZDY4ODkiLCJ3ZWJwYWNrOi8vLy4vdHMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vdHMvY2FjaGVFbmdpbmUvY2FjaGVFbmdpbmVQcm9taXNlLnRzIiwid2VicGFjazovLy9leHRlcm5hbCBcImVzNi1wcm9taXNlXCIiLCJ3ZWJwYWNrOi8vLy4vdHMvaGVscGVycy50cyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1cmxcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJkZWJ1Z1wiIiwid2VicGFjazovLy8uL3RzL2NhY2hlRW5naW5lL2NhY2hlLnRzIiwid2VicGFjazovLy8uL3RzL2NhY2hlRW5naW5lL0NhY2hlRW5naW5lLnRzIiwid2VicGFjazovLy8uL3RzL3JlZGlzL2luc3RhbmNlUHJvbWlzZS50cyIsIndlYnBhY2s6Ly8vLi90cy9yZWRpcy9pbnN0YW5jZUNCLnRzIiwid2VicGFjazovLy8uL3RzL3JlZGlzL3Bvb2wudHMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicmVkaXNcIiIsIndlYnBhY2s6Ly8vLi90cy9hYnN0cmFjdC9zdG9yYWdlLnRzIiwid2VicGFjazovLy8uL3RzL2NhY2hlRW5naW5lL2NhY2hlRW5naW5lQ0IudHMiLCJ3ZWJwYWNrOi8vLy4vdHMvaW5zdGFuY2UudHMiLCJ3ZWJwYWNrOi8vLy4vdHMvcnVsZXMvQ2FjaGVSdWxlTWFuYWdlci50cyIsIndlYnBhY2s6Ly8vLi90cy9ydWxlcy9DYWNoZVJ1bGVzQ3JlYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ1ZBO0FBQ0E7QUFDQTtBQUNBLG9CQUFtQixzQkFBc0I7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0EsY0FBYTtBQUNiLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQSxjQUFhO0FBQ2IsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBLGNBQWE7QUFDYixVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQSxjQUFhO0FBQ2IsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDO0FBQ0QsK0NBQThDLGNBQWM7QUFDNUQ7Ozs7Ozs7QUMvRUEseUM7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBd0IsdUJBQXVCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTJCLGtCQUFrQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7QUFDRCwrQ0FBOEMsY0FBYztBQUM1RDs7Ozs7OztBQ3BLQSxpQzs7Ozs7O0FDQUEsbUM7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBLG9CQUFtQixzQkFBc0I7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUIsNEJBQTRCO0FBQ2pEO0FBQ0EsNEJBQTJCLHFDQUFxQztBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCLDRCQUE0QjtBQUNqRDtBQUNBLDRCQUEyQixxQ0FBcUM7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUIsMkJBQTJCO0FBQ2hEO0FBQ0EsNEJBQTJCLG9DQUFvQztBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNEOzs7Ozs7O0FDaEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNELCtDQUE4QyxjQUFjO0FBQzVEOzs7Ozs7O0FDaERBO0FBQ0E7QUFDQTtBQUNBLG9CQUFtQixzQkFBc0I7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2IsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYixVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2IsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYixVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiLFVBQVM7QUFDVDtBQUNBO0FBQ0EsRUFBQztBQUNELCtDQUE4QyxjQUFjO0FBQzVEOzs7Ozs7O0FDNUlBO0FBQ0E7QUFDQTtBQUNBLG9CQUFtQixzQkFBc0I7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBeUI7QUFDekI7QUFDQSxrQkFBaUI7QUFDakIsY0FBYTtBQUNiLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQixrQkFBaUI7QUFDakIsY0FBYTtBQUNiLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQXlCO0FBQ3pCO0FBQ0Esa0JBQWlCO0FBQ2pCLGNBQWE7QUFDYixVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQixrQkFBaUI7QUFDakI7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxzQ0FBcUMsK0ZBQStGO0FBQ3BJO0FBQ0EsY0FBYTtBQUNiLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRkFBa0Ysc0NBQXNDO0FBQ3hIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCLGtCQUFpQjtBQUNqQjtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNELCtDQUE4QyxjQUFjO0FBQzVEOzs7Ozs7O0FDblFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNEOzs7Ozs7O0FDakhBLG1DOzs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQSxvQkFBbUIsc0JBQXNCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDO0FBQ0Q7Ozs7Ozs7QUM3QkE7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLHNCQUFzQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNELCtDQUE4QyxjQUFjO0FBQzVEOzs7Ozs7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFnQyxXQUFXLDBEQUEwRDtBQUNyRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXFDLHlEQUF5RDtBQUM5RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7QUFDRCwrQ0FBOEMsY0FBYztBQUM1RDs7Ozs7OztBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTJCLHVDQUF1QztBQUNsRTtBQUNBLHVDQUFzQyx1REFBdUQ7QUFDN0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUEyQix1Q0FBdUM7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDO0FBQ0QsK0NBQThDLGNBQWM7QUFDNUQ7Ozs7Ozs7QUNwSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2IsVUFBUztBQUNUO0FBQ0E7QUFDQSxFQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYixVQUFTO0FBQ1Q7QUFDQTtBQUNBLEVBQUM7QUFDRCwrQ0FBOEMsY0FBYztBQUM1RCIsImZpbGUiOiJkaXN0L3JlZGlzLWNhY2hlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZDhiMjBkMjkwYjg3NmY0ZDY4ODkiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBjYWNoZUVuZ2luZVByb21pc2VfMSA9IHJlcXVpcmUoJy4vY2FjaGVFbmdpbmUvY2FjaGVFbmdpbmVQcm9taXNlJyk7XG52YXIgY2FjaGVFbmdpbmVDQl8xID0gcmVxdWlyZSgnLi9jYWNoZUVuZ2luZS9jYWNoZUVuZ2luZUNCJyk7XG52YXIgaW5zdGFuY2VfMSA9IHJlcXVpcmUoJy4vaW5zdGFuY2UnKTtcbnZhciBDYWNoZVJ1bGVzQ3JlYXRvcl8xID0gcmVxdWlyZSgnLi9ydWxlcy9DYWNoZVJ1bGVzQ3JlYXRvcicpO1xubW9kdWxlLmV4cG9ydHMuUmVkaXNVcmxDYWNoZSA9IHtcbiAgICBDYWNoZUVuZ2luZVByb21pc2U6IGNhY2hlRW5naW5lUHJvbWlzZV8xLmRlZmF1bHQsXG4gICAgQ2FjaGVFbmdpbmVDQjogY2FjaGVFbmdpbmVDQl8xLmRlZmF1bHQsXG4gICAgSW5zdGFuY2U6IGluc3RhbmNlXzEuZGVmYXVsdCxcbiAgICBDYWNoZUNyZWF0b3I6IENhY2hlUnVsZXNDcmVhdG9yXzEuZGVmYXVsdFxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdHMvaW5kZXgudHNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBlczZfcHJvbWlzZV8xID0gcmVxdWlyZSgnZXM2LXByb21pc2UnKTtcbnZhciBoZWxwZXJzXzEgPSByZXF1aXJlKCcuLi9oZWxwZXJzJyk7XG52YXIgZGJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJyk7XG52YXIgY2FjaGVfMSA9IHJlcXVpcmUoJy4vY2FjaGUnKTtcbnZhciBDYWNoZUVuZ2luZV8xID0gcmVxdWlyZShcIi4vQ2FjaGVFbmdpbmVcIik7XG52YXIgaW5zdGFuY2VQcm9taXNlXzEgPSByZXF1aXJlKFwiLi4vcmVkaXMvaW5zdGFuY2VQcm9taXNlXCIpO1xudmFyIGRlYnVnID0gZGJ1Zygnc2ltcGxlLXVybC1jYWNoZScpO1xudmFyIENhY2hlRW5naW5lUHJvbWlzZSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKENhY2hlRW5naW5lUHJvbWlzZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBDYWNoZUVuZ2luZVByb21pc2UoZGVmYXVsdERvbWFpbiwgaW5zdGFuY2UpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgZGVmYXVsdERvbWFpbiwgaW5zdGFuY2UpO1xuICAgICAgICB0aGlzLnN0b3JhZ2VJbnN0YW5jZSA9IG5ldyBpbnN0YW5jZVByb21pc2VfMS5kZWZhdWx0KGluc3RhbmNlKTtcbiAgICB9XG4gICAgQ2FjaGVFbmdpbmVQcm9taXNlLnByb3RvdHlwZS5jbGVhckRvbWFpbiA9IGZ1bmN0aW9uIChkb21haW4pIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHR5cGVvZiBkb21haW4gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBkb21haW4gPSB0aGlzLmRlZmF1bHREb21haW47XG4gICAgICAgIH1cbiAgICAgICAgaGVscGVyc18xLmRlZmF1bHQuaXNTdHJpbmdEZWZpbmVkKGRvbWFpbik7XG4gICAgICAgIHJldHVybiBuZXcgZXM2X3Byb21pc2VfMS5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIF90aGlzLnN0b3JhZ2VJbnN0YW5jZS5jbGVhckRvbWFpbihkb21haW4pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBDYWNoZUVuZ2luZVByb21pc2UucHJvdG90eXBlLmNsZWFySW5zdGFuY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgZXM2X3Byb21pc2VfMS5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIF90aGlzLnN0b3JhZ2VJbnN0YW5jZS5jbGVhckNhY2hlKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIENhY2hlRW5naW5lUHJvbWlzZS5wcm90b3R5cGUuZ2V0U3RvcmVkSG9zdG5hbWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IGVzNl9wcm9taXNlXzEuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBfdGhpcy5zdG9yYWdlSW5zdGFuY2UuZ2V0Q2FjaGVkRG9tYWlucygpLnRoZW4oZnVuY3Rpb24gKGRvbWFpbnMpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRvbWFpbnMpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgQ2FjaGVFbmdpbmVQcm9taXNlLnByb3RvdHlwZS5nZXRTdG9yZWRVUkxzID0gZnVuY3Rpb24gKGRvbWFpbikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAodHlwZW9mIGRvbWFpbiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGRvbWFpbiA9IHRoaXMuZGVmYXVsdERvbWFpbjtcbiAgICAgICAgfVxuICAgICAgICBoZWxwZXJzXzEuZGVmYXVsdC5pc1N0cmluZ0RlZmluZWQoZG9tYWluKTtcbiAgICAgICAgcmV0dXJuIG5ldyBlczZfcHJvbWlzZV8xLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgX3RoaXMuc3RvcmFnZUluc3RhbmNlLmdldENhY2hlZFVSTHMoZG9tYWluKS50aGVuKGZ1bmN0aW9uICh1cmxzKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh1cmxzKTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIENhY2hlRW5naW5lUHJvbWlzZS5wcm90b3R5cGUudXJsID0gZnVuY3Rpb24gKHVybCkge1xuICAgICAgICB2YXIgcGFyc2VkVVJMID0gaGVscGVyc18xLmRlZmF1bHQucGFyc2VVUkwodXJsKTtcbiAgICAgICAgaWYgKHBhcnNlZFVSTC5kb21haW4ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBwYXJzZWRVUkwuZG9tYWluID0gdGhpcy5kZWZhdWx0RG9tYWluO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjYWNoZSA9IG5ldyBjYWNoZV8xLlVybFByb21pc2UocGFyc2VkVVJMLmRvbWFpbiwgdGhpcy5zdG9yYWdlSW5zdGFuY2UsIHRoaXMuaW5zdGFuY2VOYW1lLCBwYXJzZWRVUkwucmVsYXRpdmVVUkwpO1xuICAgICAgICB0aGlzLmFkZFVybChjYWNoZSk7XG4gICAgICAgIHJldHVybiBjYWNoZTtcbiAgICB9O1xuICAgIHJldHVybiBDYWNoZUVuZ2luZVByb21pc2U7XG59KENhY2hlRW5naW5lXzEuZGVmYXVsdCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ2FjaGVFbmdpbmVQcm9taXNlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi90cy9jYWNoZUVuZ2luZS9jYWNoZUVuZ2luZVByb21pc2UudHNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXM2LXByb21pc2VcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJlczYtcHJvbWlzZVwiXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlwidXNlIHN0cmljdFwiO1xudmFyIG5vZGV1cmwgPSByZXF1aXJlKCd1cmwnKTtcbnZhciBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ3NpbXBsZS11cmwtY2FjaGUnKTtcbnZhciBIZWxwZXJzID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBIZWxwZXJzKCkge1xuICAgIH1cbiAgICBIZWxwZXJzLmlzUmVkaXMgPSBmdW5jdGlvbiAoc3RvcmFnZUNvbmZpZykge1xuICAgICAgICByZXR1cm4gdHlwZW9mIHN0b3JhZ2VDb25maWcuaG9zdCAhPT0gJ3VuZGVmaW5lZCc7XG4gICAgfTtcbiAgICBIZWxwZXJzLmlzU3RyaW5nRGVmaW5lZCA9IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICBpZiAodHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJyB8fCBpbnB1dC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIEhlbHBlcnMuaW52YWxpZFBhcmFtZXRlckVycm9yKCd0aGlzIHNob3VsZCBiZSBhIG5vbiBlbXB0eSBzdHJpbmcnLCBpbnB1dCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEhlbHBlcnMuaXNTdHJpbmdJbiA9IGZ1bmN0aW9uIChpbnB1dCwgdmFsdWVzKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHZhbGlkID0gZmFsc2U7XG4gICAgICAgIHZhbHVlcy5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSBpbnB1dCkge1xuICAgICAgICAgICAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghdmFsaWQpIHtcbiAgICAgICAgICAgIEhlbHBlcnMuaW52YWxpZFBhcmFtZXRlckVycm9yKCdUaGlzIHN0cmluZyBzaG91bGQgY29udGFpbiBvbmx5IHRoZXNlIHZhbHVlcyA6ICcgKyB2YWx1ZXMuam9pbignLCAnKSwgaW5wdXQpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBIZWxwZXJzLnBhcnNlVVJMID0gZnVuY3Rpb24gKHVybCkge1xuICAgICAgICBIZWxwZXJzLmlzU3RyaW5nRGVmaW5lZCh1cmwpO1xuICAgICAgICB2YXIgcGFyc2VkVVJMID0gbm9kZXVybC5wYXJzZSh1cmwpO1xuICAgICAgICB2YXIgcmVsYXRpdmVVUkwgPSBwYXJzZWRVUkwucGF0aDtcbiAgICAgICAgaWYgKCEvXFwvLy50ZXN0KHJlbGF0aXZlVVJMKSkge1xuICAgICAgICAgICAgcmVsYXRpdmVVUkwgPSAnLycgKyByZWxhdGl2ZVVSTDtcbiAgICAgICAgfVxuICAgICAgICBwYXJzZWRVUkwucGF0aG5hbWUgPSBudWxsO1xuICAgICAgICBwYXJzZWRVUkwucGF0aCA9IG51bGw7XG4gICAgICAgIHBhcnNlZFVSTC5oYXNoID0gbnVsbDtcbiAgICAgICAgcGFyc2VkVVJMLnF1ZXJ5ID0gbnVsbDtcbiAgICAgICAgcGFyc2VkVVJMLnNlYXJjaCA9IG51bGw7XG4gICAgICAgIHZhciBkb21haW4gPSBub2RldXJsLmZvcm1hdChwYXJzZWRVUkwpO1xuICAgICAgICBkZWJ1ZygncGFyc2VVUkwgcmVzdWx0OiAnLCBkb21haW4sIHJlbGF0aXZlVVJMKTtcbiAgICAgICAgaWYgKGRvbWFpbiA9PT0gcmVsYXRpdmVVUkwpIHtcbiAgICAgICAgICAgIEhlbHBlcnMuaW52YWxpZFBhcmFtZXRlckVycm9yKCdpbnZhbGlkIFVSTCAnLCB1cmwpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkb21haW46IGRvbWFpbixcbiAgICAgICAgICAgIHJlbGF0aXZlVVJMOiByZWxhdGl2ZVVSTFxuICAgICAgICB9O1xuICAgIH07XG4gICAgSGVscGVycy5pc05vdFVuZGVmaW5lZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGlucHV0ID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICBpbnB1dFtfaSAtIDBdID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5wdXQubGVuZ3RoID0gMCkge1xuICAgICAgICAgICAgSGVscGVycy5pbnZhbGlkUGFyYW1ldGVyRXJyb3IoJ05vIHBhcmFtZXRlcnMgcmVxdWlyZWQnLCBpbnB1dCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSBpbiBpbnB1dCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBIZWxwZXJzLmludmFsaWRQYXJhbWV0ZXJFcnJvcignVW5kZWZpbmVkIHBhcmFtZXRlciBwcm92aWRlZCBhdCBpbmRleCAnLCBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgSGVscGVycy5pc0FycmF5ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgaWYgKChkYXRhIGluc3RhbmNlb2YgQXJyYXkpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgSGVscGVycy5pbnZhbGlkUGFyYW1ldGVyRXJyb3IoJ1RoaXMgc2hvdWxkIGJlIGFuIGFycmF5JywgZGF0YSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEhlbHBlcnMuaGFzTWF4QWdlID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBkYXRhLm1heEFnZSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIEhlbHBlcnMuaW52YWxpZFBhcmFtZXRlckVycm9yKCdUaGlzIHJ1bGUgbWlzc2VzIGEgbWF4QWdlIHByb3BlcnR5JywgZGF0YSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEhlbHBlcnMuaXNCb29sZWFuID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBkYXRhICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIEhlbHBlcnMuaW52YWxpZFBhcmFtZXRlckVycm9yKCdUaGlzIGlzIG5vdCBhIGJvb2xlYW4gcHJvYmFibHkgdGhlIGZvcmNlIHBhcmFtIG1pc3NpbmcnLCBkYXRhKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgSGVscGVycy5pc09wdGlvbmFsQm9vbGVhbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZGF0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRhdGEgIT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgSGVscGVycy5pbnZhbGlkUGFyYW1ldGVyRXJyb3IoJ1lvdSBwcm92aWRlZCBhbiBvcHRpb25hbCBib29sZWFuIGJ1dCB0aGlzIGlzIG5vdCBhIGJvb2xlYW4nLCBkYXRhKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgSGVscGVycy5TYW1lUmVnZXggPSBmdW5jdGlvbiAocjEsIHIyKSB7XG4gICAgICAgIGlmIChyMSBpbnN0YW5jZW9mIFJlZ0V4cCAmJiByMiBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAgICAgdmFyIHByb3BzID0gW1wiZ2xvYmFsXCIsIFwibXVsdGlsaW5lXCIsIFwiaWdub3JlQ2FzZVwiLCBcInNvdXJjZVwiXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgcHJvcCA9IHByb3BzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChyMVtwcm9wXSAhPT0gcjJbcHJvcF0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIEhlbHBlcnMuaXNNYXhBZ2VSZWdleFJ1bGUgPSBmdW5jdGlvbiAocnVsZSkge1xuICAgICAgICBIZWxwZXJzLmlzQ29uZmlnUmVnZXhSdWxlKHJ1bGUpO1xuICAgICAgICBpZiAodHlwZW9mIHJ1bGUubWF4QWdlICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgSGVscGVycy5pbnZhbGlkUGFyYW1ldGVyRXJyb3IoJ1RoaXMgaXNudCBhIHZhbGlkIE1heEFnZSBSZWdleFJ1bGUgLSBvbmUgb2YgdGhlIHJ1bGUgbWlzc2VzIG1heEFnZSBwcm9wJywgcnVsZSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEhlbHBlcnMuaXNDb25maWdSZWdleFJ1bGUgPSBmdW5jdGlvbiAocnVsZSkge1xuICAgICAgICBpZiAoKHJ1bGUucmVnZXggaW5zdGFuY2VvZiBSZWdFeHApID09PSBmYWxzZSkge1xuICAgICAgICAgICAgSGVscGVycy5pbnZhbGlkUGFyYW1ldGVyRXJyb3IoJ1RoaXMgaXNudCBhIHZhbGlkIFJlZ2V4UnVsZSAtIHRoZSBydWxlIGlzIG5vdCBhIHJlZ2V4JywgcnVsZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBydWxlLmlnbm9yZVF1ZXJ5ICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIEhlbHBlcnMuaW52YWxpZFBhcmFtZXRlckVycm9yKCdUaGlzIGlzbnQgYSB2YWxpZCBSZWdleFJ1bGUgLSB0aGUgcnVsZSBtaXNzZXMgaWdub3JlUXVlcnkgcHJvcCcsIHJ1bGUpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBIZWxwZXJzLnZhbGlkYXRlQ2FjaGVDb25maWcgPSBmdW5jdGlvbiAoY2FjaGVSdWxlcykge1xuICAgICAgICBIZWxwZXJzLmlzU3RyaW5nSW4oY2FjaGVSdWxlcy5kZWZhdWx0LCBbJ2Fsd2F5cycsICduZXZlciddKTtcbiAgICAgICAgSGVscGVycy5pc05vdFVuZGVmaW5lZChjYWNoZVJ1bGVzLm1heEFnZSwgY2FjaGVSdWxlcy5hbHdheXMsIGNhY2hlUnVsZXMubmV2ZXIpO1xuICAgICAgICBbJ2Fsd2F5cycsICduZXZlcicsICdtYXhBZ2UnXS5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICAgICAgICBIZWxwZXJzLmlzQXJyYXkoY2FjaGVSdWxlc1t0eXBlXSk7XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gY2FjaGVSdWxlc1t0eXBlXSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FjaGVSdWxlc1t0eXBlXVtrZXldLmRvbWFpbiAhPT0gJ3N0cmluZycgJiYgKGNhY2hlUnVsZXNbdHlwZV1ba2V5XS5kb21haW4gaW5zdGFuY2VvZiBSZWdFeHApID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBIZWxwZXJzLmludmFsaWRQYXJhbWV0ZXJFcnJvcignRG9tYWluIG11c3QgYmUgZWl0aGVyIGEgcmVnZXggb3IgYSBzdHJpbmcnLCBjYWNoZVJ1bGVzW3R5cGVdW2tleV0uZG9tYWluKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgSGVscGVycy5pc0FycmF5KGNhY2hlUnVsZXNbdHlwZV1ba2V5XS5ydWxlcyk7XG4gICAgICAgICAgICAgICAgY2FjaGVSdWxlc1t0eXBlXVtrZXldLnJ1bGVzLmZvckVhY2goZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdtYXhBZ2UnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBIZWxwZXJzLmlzTWF4QWdlUmVnZXhSdWxlKHJ1bGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgSGVscGVycy5pc0NvbmZpZ1JlZ2V4UnVsZShydWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIEhlbHBlcnMuSlNPTlJlZ0V4cFJlcGxhY2VyID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgICAgICByZXR1cm4gKFwiX19SRUdFWFAgXCIgKyB2YWx1ZS50b1N0cmluZygpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgSGVscGVycy5KU09OUmVnRXhwUmV2aXZlciA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZS50b1N0cmluZygpLmluZGV4T2YoXCJfX1JFR0VYUCBcIikgPT0gMCkge1xuICAgICAgICAgICAgdmFyIG0gPSB2YWx1ZS5zcGxpdChcIl9fUkVHRVhQIFwiKVsxXS5tYXRjaCgvXFwvKC4qKVxcLyguKik/Lyk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cChtWzFdLCBtWzJdIHx8IFwiXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBIZWxwZXJzLmdldENvbmZpZ0tleSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICd1cmwtY2FjaGU6cnVsZWNvbmZpZyc7XG4gICAgfTtcbiAgICBIZWxwZXJzLnZhbGlkYXRlUmVkaXNTdG9yYWdlQ29uZmlnID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgSGVscGVycy5pbnZhbGlkUGFyYW1ldGVyRXJyb3IgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBwYXJhbWV0ZXI6ICcgKyBuYW1lICsgJy4gVmFsdWUgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpO1xuICAgIH07XG4gICAgSGVscGVycy5SZWRpc0Vycm9yID0gZnVuY3Rpb24gKGRlc2NyaXB0aW9uLCBtc2cpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZWRpczogJyArIGRlc2NyaXB0aW9uICsgJy4gRXJyb3IgcmVjZWl2ZWQ6ICcgKyBtc2cpO1xuICAgIH07XG4gICAgcmV0dXJuIEhlbHBlcnM7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gSGVscGVycztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdHMvaGVscGVycy50c1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1cmxcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJ1cmxcIlxuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJkZWJ1Z1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImRlYnVnXCJcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBoZWxwZXJzXzEgPSByZXF1aXJlKCcuLi9oZWxwZXJzJyk7XG52YXIgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdzaW1wbGUtdXJsLWNhY2hlJyk7XG52YXIgVXJsQ29tbW9uID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBVcmxDb21tb24oX2RvbWFpbiwgX3N0b3JhZ2VJbnN0YW5jZSwgX2luc3RhbmNlTmFtZSwgX3VybCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLl9kb21haW4gPSBfZG9tYWluO1xuICAgICAgICB0aGlzLl9pbnN0YW5jZU5hbWUgPSBfaW5zdGFuY2VOYW1lO1xuICAgICAgICB0aGlzLl91cmwgPSBfdXJsO1xuICAgICAgICB0aGlzLl9jYXRlZ29yeSA9ICcnO1xuICAgICAgICB0aGlzLl9tYXhBZ2UgPSAwO1xuICAgICAgICB0aGlzLmdldFJlZ2V4VGVzdCA9IGZ1bmN0aW9uICh1KSB7XG4gICAgICAgICAgICByZXR1cm4gdS5yZWdleC50ZXN0KF90aGlzLl91cmwpO1xuICAgICAgICB9O1xuICAgICAgICBpZiAodGhpcy5oYXNQcm9taXNlKF9zdG9yYWdlSW5zdGFuY2UpKSB7XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlUHJvbWlzZSA9IF9zdG9yYWdlSW5zdGFuY2U7XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlID0gX3N0b3JhZ2VJbnN0YW5jZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2VDQiA9IF9zdG9yYWdlSW5zdGFuY2U7XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlID0gX3N0b3JhZ2VJbnN0YW5jZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldENhY2hlQ2F0ZWdvcnkoKTtcbiAgICB9XG4gICAgVXJsQ29tbW9uLnByb3RvdHlwZS5oYXNQcm9taXNlID0gZnVuY3Rpb24gKHN0b3JhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHN0b3JhZ2UuZ2V0TWV0aG9kKCkgPT09ICdwcm9taXNlJztcbiAgICB9O1xuICAgIFVybENvbW1vbi5wcm90b3R5cGUuZ2V0RG9tYWluID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZG9tYWluO1xuICAgIH07XG4gICAgVXJsQ29tbW9uLnByb3RvdHlwZS5nZXRDYXRlZ29yeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhdGVnb3J5O1xuICAgIH07XG4gICAgVXJsQ29tbW9uLnByb3RvdHlwZS5nZXRJbnN0YW5jZU5hbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnN0YW5jZU5hbWU7XG4gICAgfTtcbiAgICBVcmxDb21tb24ucHJvdG90eXBlLmdldFVybCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VybDtcbiAgICB9O1xuICAgIFVybENvbW1vbi5wcm90b3R5cGUuZ2V0VFRMID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWF4QWdlO1xuICAgIH07XG4gICAgVXJsQ29tbW9uLnByb3RvdHlwZS5jaGVja0RvbWFpbiA9IGZ1bmN0aW9uIChzdG9yZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzdG9yZWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZG9tYWluLmluZGV4T2Yoc3RvcmVkKSAhPT0gLTE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gc3RvcmVkLnRlc3QodGhpcy5fZG9tYWluKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVXJsQ29tbW9uLnByb3RvdHlwZS5zZXRDYWNoZUNhdGVnb3J5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIga2V5LCBkb21haW4sIGk7XG4gICAgICAgIHZhciBjb25maWcgPSB0aGlzLl9zdG9yYWdlLmdldENhY2hlUnVsZXMoKTtcbiAgICAgICAgZGVidWcoJ2NvbmZpZyBsb2FkZWQ6ICcsIGNvbmZpZyk7XG4gICAgICAgIGZvciAoa2V5ID0gMDsga2V5IDwgY29uZmlnLm1heEFnZS5sZW5ndGg7IGtleSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0RvbWFpbihjb25maWcubWF4QWdlW2tleV0uZG9tYWluKSkge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb25maWcubWF4QWdlW2tleV0ucnVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0UmVnZXhUZXN0KGNvbmZpZy5tYXhBZ2Vba2V5XS5ydWxlc1tpXSkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhdGVnb3J5ID0gJ21heEFnZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tYXhBZ2UgPSBjb25maWcubWF4QWdlW2tleV0ucnVsZXNbaV0ubWF4QWdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoa2V5ID0gMDsga2V5IDwgY29uZmlnLmFsd2F5cy5sZW5ndGg7IGtleSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0RvbWFpbihjb25maWcuYWx3YXlzW2tleV0uZG9tYWluKSkge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb25maWcuYWx3YXlzW2tleV0ucnVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0UmVnZXhUZXN0KGNvbmZpZy5hbHdheXNba2V5XS5ydWxlc1tpXSkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhdGVnb3J5ID0gJ2Fsd2F5cyc7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChrZXkgPSAwOyBrZXkgPCBjb25maWcubmV2ZXIubGVuZ3RoOyBrZXkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tEb21haW4oY29uZmlnLm5ldmVyW2tleV0uZG9tYWluKSkge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb25maWcubmV2ZXJba2V5XS5ydWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRSZWdleFRlc3QoY29uZmlnLm5ldmVyW2tleV0ucnVsZXNbaV0pID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYXRlZ29yeSA9ICduZXZlcic7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY2F0ZWdvcnkgPSBjb25maWcuZGVmYXVsdDtcbiAgICB9O1xuICAgIDtcbiAgICByZXR1cm4gVXJsQ29tbW9uO1xufSgpKTtcbmV4cG9ydHMuVXJsQ29tbW9uID0gVXJsQ29tbW9uO1xudmFyIFVybFByb21pc2UgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhVcmxQcm9taXNlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFVybFByb21pc2UoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB0aGlzLmRlbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5fc3RvcmFnZVByb21pc2UuZGVsZXRlKF90aGlzLmdldERvbWFpbigpLCBfdGhpcy5nZXRVcmwoKSwgX3RoaXMuZ2V0Q2F0ZWdvcnkoKSwgX3RoaXMuZ2V0VFRMKCkpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5fc3RvcmFnZVByb21pc2UuZ2V0KF90aGlzLmdldERvbWFpbigpLCBfdGhpcy5nZXRVcmwoKSwgX3RoaXMuZ2V0Q2F0ZWdvcnkoKSwgX3RoaXMuZ2V0VFRMKCkpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmhhcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5fc3RvcmFnZVByb21pc2UuaGFzKF90aGlzLmdldERvbWFpbigpLCBfdGhpcy5nZXRVcmwoKSwgX3RoaXMuZ2V0Q2F0ZWdvcnkoKSwgX3RoaXMuZ2V0VFRMKCkpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNldCA9IGZ1bmN0aW9uIChjb250ZW50LCBleHRyYSwgZm9yY2UpIHtcbiAgICAgICAgICAgIGhlbHBlcnNfMS5kZWZhdWx0LmlzU3RyaW5nRGVmaW5lZChjb250ZW50KTtcbiAgICAgICAgICAgIGhlbHBlcnNfMS5kZWZhdWx0LmlzT3B0aW9uYWxCb29sZWFuKGZvcmNlKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZm9yY2UgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgZm9yY2UgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5fc3RvcmFnZVByb21pc2Uuc2V0KF90aGlzLmdldERvbWFpbigpLCBfdGhpcy5nZXRVcmwoKSwgY29udGVudCwgZXh0cmEsIF90aGlzLmdldENhdGVnb3J5KCksIF90aGlzLmdldFRUTCgpLCBmb3JjZSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBVcmxQcm9taXNlO1xufShVcmxDb21tb24pKTtcbmV4cG9ydHMuVXJsUHJvbWlzZSA9IFVybFByb21pc2U7XG52YXIgVXJsQ0IgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhVcmxDQiwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBVcmxDQigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMuZGVsZXRlID0gZnVuY3Rpb24gKGNiKSB7XG4gICAgICAgICAgICBfdGhpcy5fc3RvcmFnZUNCLmRlbGV0ZShfdGhpcy5nZXREb21haW4oKSwgX3RoaXMuZ2V0VXJsKCksIF90aGlzLmdldENhdGVnb3J5KCksIF90aGlzLmdldFRUTCgpLCBjYik7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0ID0gZnVuY3Rpb24gKGNiKSB7XG4gICAgICAgICAgICBfdGhpcy5fc3RvcmFnZUNCLmdldChfdGhpcy5nZXREb21haW4oKSwgX3RoaXMuZ2V0VXJsKCksIF90aGlzLmdldENhdGVnb3J5KCksIF90aGlzLmdldFRUTCgpLCBjYik7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaGFzID0gZnVuY3Rpb24gKGNiKSB7XG4gICAgICAgICAgICBfdGhpcy5fc3RvcmFnZUNCLmhhcyhfdGhpcy5nZXREb21haW4oKSwgX3RoaXMuZ2V0VXJsKCksIF90aGlzLmdldENhdGVnb3J5KCksIF90aGlzLmdldFRUTCgpLCBjYik7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2V0ID0gZnVuY3Rpb24gKGNvbnRlbnQsIGV4dHJhLCBmb3JjZSwgY2IpIHtcbiAgICAgICAgICAgIGhlbHBlcnNfMS5kZWZhdWx0LmlzU3RyaW5nRGVmaW5lZChjb250ZW50KTtcbiAgICAgICAgICAgIGhlbHBlcnNfMS5kZWZhdWx0LmlzQm9vbGVhbihmb3JjZSk7XG4gICAgICAgICAgICBfdGhpcy5fc3RvcmFnZUNCLnNldChfdGhpcy5nZXREb21haW4oKSwgX3RoaXMuZ2V0VXJsKCksIGNvbnRlbnQsIGV4dHJhLCBfdGhpcy5nZXRDYXRlZ29yeSgpLCBfdGhpcy5nZXRUVEwoKSwgZm9yY2UsIGNiKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIFVybENCO1xufShVcmxDb21tb24pKTtcbmV4cG9ydHMuVXJsQ0IgPSBVcmxDQjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdHMvY2FjaGVFbmdpbmUvY2FjaGUudHNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgaGVscGVyc18xID0gcmVxdWlyZShcIi4uL2hlbHBlcnNcIik7XG52YXIgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdzaW1wbGUtdXJsLWNhY2hlJyk7XG52YXIgQ2FjaGVFbmdpbmUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENhY2hlRW5naW5lKGRlZmF1bHREb21haW4sIGluc3RhbmNlRGVmaW5pdGlvbikge1xuICAgICAgICB0aGlzLmRlZmF1bHREb21haW4gPSBkZWZhdWx0RG9tYWluO1xuICAgICAgICB0aGlzLmluc3RhbmNlRGVmaW5pdGlvbiA9IGluc3RhbmNlRGVmaW5pdGlvbjtcbiAgICAgICAgaGVscGVyc18xLmRlZmF1bHQuaXNOb3RVbmRlZmluZWQoZGVmYXVsdERvbWFpbiwgaW5zdGFuY2VEZWZpbml0aW9uKTtcbiAgICAgICAgaGVscGVyc18xLmRlZmF1bHQuaXNTdHJpbmdEZWZpbmVkKGRlZmF1bHREb21haW4pO1xuICAgICAgICBpZiAoaW5zdGFuY2VEZWZpbml0aW9uLmlzSW5zdGFuY2lhdGVkKCkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICB2YXIgZXJyb3JNc2cgPSAnVGhpcyBpbnN0YW5jZSBoYXNuXFwndCBpbml0aWF0ZWQgY29ycmVjdGx5OiAnICsgaW5zdGFuY2VEZWZpbml0aW9uLmdldEluc3RhbmNlTmFtZSgpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvck1zZyk7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JNc2cpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5zdGFuY2VOYW1lID0gaW5zdGFuY2VEZWZpbml0aW9uLmdldEluc3RhbmNlTmFtZSgpO1xuICAgICAgICBpZiAoaW5zdGFuY2VEZWZpbml0aW9uLmdldENvbmZpZygpLm9uX3B1Ymxpc2hfdXBkYXRlID09PSB0cnVlICYmIHR5cGVvZiBDYWNoZUVuZ2luZS51cmxzW3RoaXMuaW5zdGFuY2VOYW1lXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIENhY2hlRW5naW5lLnVybHNbdGhpcy5pbnN0YW5jZU5hbWVdID0ge307XG4gICAgICAgIH1cbiAgICB9XG4gICAgQ2FjaGVFbmdpbmUudXBkYXRlQWxsVXJsQ2F0ZWdvcnkgPSBmdW5jdGlvbiAoaW5zdGFuY2VOYW1lKSB7XG4gICAgICAgIGhlbHBlcnNfMS5kZWZhdWx0LmlzU3RyaW5nRGVmaW5lZChpbnN0YW5jZU5hbWUpO1xuICAgICAgICBpZiAodHlwZW9mIENhY2hlRW5naW5lLnVybHNbaW5zdGFuY2VOYW1lXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSB2b2lkIDA7XG4gICAgICAgICAgICBmb3IgKGtleSBpbiBDYWNoZUVuZ2luZS51cmxzW2luc3RhbmNlTmFtZV0pIHtcbiAgICAgICAgICAgICAgICBDYWNoZUVuZ2luZS51cmxzW2luc3RhbmNlTmFtZV1ba2V5XS5zZXRDYWNoZUNhdGVnb3J5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIENhY2hlRW5naW5lLnByb3RvdHlwZS5nZXRJbnN0YW5jZU5hbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlTmFtZTtcbiAgICB9O1xuICAgIENhY2hlRW5naW5lLnByb3RvdHlwZS5hZGRVcmwgPSBmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgIGlmICh0eXBlb2YgQ2FjaGVFbmdpbmUudXJsc1t0aGlzLmluc3RhbmNlTmFtZV0gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBDYWNoZUVuZ2luZS51cmxzW3RoaXMuaW5zdGFuY2VOYW1lXVt0aGlzLmJ1aWxkVVJMSW5kZXgodXJsKV0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBDYWNoZUVuZ2luZS51cmxzW3RoaXMuaW5zdGFuY2VOYW1lXVt0aGlzLmJ1aWxkVVJMSW5kZXgodXJsKV0gPSB1cmw7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIENhY2hlRW5naW5lLnByb3RvdHlwZS5idWlsZFVSTEluZGV4ID0gZnVuY3Rpb24gKHVybCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZU5hbWUgKyAnXycgKyB1cmwuZ2V0RG9tYWluKCkgKyAnXycgKyB1cmwuZ2V0VXJsKCk7XG4gICAgfTtcbiAgICBDYWNoZUVuZ2luZS51cmxzID0ge307XG4gICAgQ2FjaGVFbmdpbmUuaGVscGVycyA9IHtcbiAgICAgICAgdmFsaWRhdGVSZWRpc1N0b3JhZ2VDb25maWc6IGhlbHBlcnNfMS5kZWZhdWx0LnZhbGlkYXRlUmVkaXNTdG9yYWdlQ29uZmlnLFxuICAgICAgICB2YWxpZGF0ZUNhY2hlQ29uZmlnOiBoZWxwZXJzXzEuZGVmYXVsdC52YWxpZGF0ZUNhY2hlQ29uZmlnXG4gICAgfTtcbiAgICBDYWNoZUVuZ2luZS5oYXNoS2V5ID0gJ3VybC1jYWNoZTonO1xuICAgIHJldHVybiBDYWNoZUVuZ2luZTtcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDYWNoZUVuZ2luZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdHMvY2FjaGVFbmdpbmUvQ2FjaGVFbmdpbmUudHNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBkZWJnID0gcmVxdWlyZSgnZGVidWcnKTtcbnZhciBlczZfcHJvbWlzZV8xID0gcmVxdWlyZSgnZXM2LXByb21pc2UnKTtcbnZhciBpbnN0YW5jZUNCXzEgPSByZXF1aXJlKFwiLi9pbnN0YW5jZUNCXCIpO1xudmFyIHN0b3JhZ2VfMSA9IHJlcXVpcmUoXCIuLi9hYnN0cmFjdC9zdG9yYWdlXCIpO1xudmFyIGRlYnVnID0gZGViZygnc2ltcGxlLXVybC1jYWNoZS1SRURJUycpO1xudmFyIFJlZGlzU3RvcmFnZVByb21pc2UgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhSZWRpc1N0b3JhZ2VQcm9taXNlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFJlZGlzU3RvcmFnZVByb21pc2UoaW5zdGFuY2UpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgIHRoaXMuaW5zdGFuY2UgPSBpbnN0YW5jZTtcbiAgICAgICAgdGhpcy5oYXNoS2V5ID0gJ3NpbXBsZS11cmwtY2FjaGU6JyArIGluc3RhbmNlLmdldEluc3RhbmNlTmFtZSgpO1xuICAgICAgICB0aGlzLmNiSW5zdGFuY2UgPSBuZXcgaW5zdGFuY2VDQl8xLmRlZmF1bHQoaW5zdGFuY2UpO1xuICAgICAgICB0aGlzLm1ldGhvZCA9ICdwcm9taXNlJztcbiAgICB9XG4gICAgUmVkaXNTdG9yYWdlUHJvbWlzZS5wcm90b3R5cGUuZ2V0Q2FjaGVSdWxlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UuZ2V0TWFuYWdlcigpLmdldFJ1bGVzKCk7XG4gICAgfTtcbiAgICBSZWRpc1N0b3JhZ2VQcm9taXNlLnByb3RvdHlwZS5jbGVhckNhY2hlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IGVzNl9wcm9taXNlXzEuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBfdGhpcy5jYkluc3RhbmNlLmNsZWFyQ2FjaGUoZnVuY3Rpb24gKGVyciwgcmVzdWx0cykge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFJlZGlzU3RvcmFnZVByb21pc2UucHJvdG90eXBlLmNsZWFyRG9tYWluID0gZnVuY3Rpb24gKGRvbWFpbikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IGVzNl9wcm9taXNlXzEuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBfdGhpcy5jYkluc3RhbmNlLmNsZWFyRG9tYWluKGRvbWFpbiwgZnVuY3Rpb24gKGVyciwgcmVzdWx0cykge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFJlZGlzU3RvcmFnZVByb21pc2UucHJvdG90eXBlLmdldENhY2hlZERvbWFpbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgZXM2X3Byb21pc2VfMS5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIF90aGlzLmNiSW5zdGFuY2UuZ2V0Q2FjaGVkRG9tYWlucyhmdW5jdGlvbiAoZXJyLCByZXN1bHRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICBkZWJ1ZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgUmVkaXNTdG9yYWdlUHJvbWlzZS5wcm90b3R5cGUuZ2V0Q2FjaGVkVVJMcyA9IGZ1bmN0aW9uIChkb21haW4pIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBlczZfcHJvbWlzZV8xLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgX3RoaXMuY2JJbnN0YW5jZS5nZXRDYWNoZWRVUkxzKGRvbWFpbiwgZnVuY3Rpb24gKGVyciwgcmVzdWx0cykge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFJlZGlzU3RvcmFnZVByb21pc2UucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uIChkb21haW4sIHVybCwgY2F0ZWdvcnksIHR0bCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IGVzNl9wcm9taXNlXzEuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBfdGhpcy5jYkluc3RhbmNlLmRlbGV0ZShkb21haW4sIHVybCwgY2F0ZWdvcnksIHR0bCwgZnVuY3Rpb24gKGVyciwgcmVzdWx0cykge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFJlZGlzU3RvcmFnZVByb21pc2UucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY2JJbnN0YW5jZS5kZXN0cm95KCk7XG4gICAgfTtcbiAgICBSZWRpc1N0b3JhZ2VQcm9taXNlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoZG9tYWluLCB1cmwsIGNhdGVnb3J5LCB0dGwpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBlczZfcHJvbWlzZV8xLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgX3RoaXMuY2JJbnN0YW5jZS5nZXQoZG9tYWluLCB1cmwsIGNhdGVnb3J5LCB0dGwsIGZ1bmN0aW9uIChlcnIsIHJlc3VsdHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlYnVnKGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBSZWRpc1N0b3JhZ2VQcm9taXNlLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiAoZG9tYWluLCB1cmwsIGNhdGVnb3J5LCB0dGwpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBlczZfcHJvbWlzZV8xLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgX3RoaXMuY2JJbnN0YW5jZS5oYXMoZG9tYWluLCB1cmwsIGNhdGVnb3J5LCB0dGwsIGZ1bmN0aW9uIChlcnIsIHJlc3VsdHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlYnVnKGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBSZWRpc1N0b3JhZ2VQcm9taXNlLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoZG9tYWluLCB1cmwsIHZhbHVlLCBleHRyYSwgY2F0ZWdvcnksIHR0bCwgZm9yY2UpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBlczZfcHJvbWlzZV8xLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgX3RoaXMuY2JJbnN0YW5jZS5zZXQoZG9tYWluLCB1cmwsIHZhbHVlLCBleHRyYSwgY2F0ZWdvcnksIHR0bCwgZm9yY2UsIGZ1bmN0aW9uIChlcnIsIHJlc3VsdHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlYnVnKGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gUmVkaXNTdG9yYWdlUHJvbWlzZTtcbn0oc3RvcmFnZV8xLlN0b3JhZ2VQcm9taXNlKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBSZWRpc1N0b3JhZ2VQcm9taXNlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi90cy9yZWRpcy9pbnN0YW5jZVByb21pc2UudHNcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBwb29sXzEgPSByZXF1aXJlKCcuL3Bvb2wnKTtcbnZhciBkZWJnID0gcmVxdWlyZSgnZGVidWcnKTtcbnZhciBDYWNoZUVuZ2luZV8xID0gcmVxdWlyZShcIi4uL2NhY2hlRW5naW5lL0NhY2hlRW5naW5lXCIpO1xudmFyIHN0b3JhZ2VfMSA9IHJlcXVpcmUoXCIuLi9hYnN0cmFjdC9zdG9yYWdlXCIpO1xudmFyIGRlYnVnID0gZGViZygnc2ltcGxlLXVybC1jYWNoZS1SRURJUycpO1xudmFyIFJlZGlzU3RvcmFnZUNCID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoUmVkaXNTdG9yYWdlQ0IsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gUmVkaXNTdG9yYWdlQ0IoaW5zdGFuY2UpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgIHRoaXMuaW5zdGFuY2UgPSBpbnN0YW5jZTtcbiAgICAgICAgdGhpcy5fY29ubiA9IHBvb2xfMS5SZWRpc1Bvb2wuZ2V0Q29ubmVjdGlvbihpbnN0YW5jZS5nZXRJbnN0YW5jZU5hbWUoKSk7XG4gICAgICAgIHRoaXMuaGFzaEtleSA9IENhY2hlRW5naW5lXzEuZGVmYXVsdC5oYXNoS2V5ICsgdGhpcy5pbnN0YW5jZS5nZXRJbnN0YW5jZU5hbWUoKTtcbiAgICAgICAgdGhpcy5tZXRob2QgPSAnY2FsbGJhY2snO1xuICAgIH1cbiAgICBSZWRpc1N0b3JhZ2VDQi5wcm90b3R5cGUuY2xlYXJDYWNoZSA9IGZ1bmN0aW9uIChjYikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgYmF0Y2ggPSB0aGlzLl9jb25uLmJhdGNoKCk7XG4gICAgICAgIHRoaXMuX2Nvbm4uaGtleXModGhpcy5oYXNoS2V5LCBmdW5jdGlvbiAoZXJyLCBkb21haW5zKSB7XG4gICAgICAgICAgICBkZWJ1ZyhlcnIpO1xuICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgIGlmIChkb21haW5zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYihudWxsLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBuYiA9IDA7XG4gICAgICAgICAgICBkb21haW5zLmZvckVhY2goZnVuY3Rpb24gKGRvbWFpbikge1xuICAgICAgICAgICAgICAgIGJhdGNoLmRlbChfdGhpcy5nZXREb21haW5IYXNoS2V5KGRvbWFpbikpO1xuICAgICAgICAgICAgICAgIGJhdGNoLmhkZWwoX3RoaXMuaGFzaEtleSwgZG9tYWluKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5fY29ubi5oa2V5cyhfdGhpcy5nZXREb21haW5IYXNoS2V5KGRvbWFpbiksIGZ1bmN0aW9uIChlcnIsIGtleXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoJ2tleXMgPSAnLCBrZXlzKTtcbiAgICAgICAgICAgICAgICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhdGNoLmRlbChfdGhpcy5nZXRVcmxLZXkoZG9tYWluLCBrZXkpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIG5iKys7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuYiA9PT0gZG9tYWlucy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhdGNoLmV4ZWMoZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFJlZGlzU3RvcmFnZUNCLnByb3RvdHlwZS5jbGVhckRvbWFpbiA9IGZ1bmN0aW9uIChkb21haW4sIGNiKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuX2Nvbm4uaGRlbCh0aGlzLmhhc2hLZXksIGRvbWFpbiwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgIF90aGlzLl9jb25uLmhrZXlzKF90aGlzLmdldERvbWFpbkhhc2hLZXkoZG9tYWluKSwgZnVuY3Rpb24gKGVyciwgdXJscykge1xuICAgICAgICAgICAgICAgIGlmICh1cmxzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBuYiA9IDA7XG4gICAgICAgICAgICAgICAgdXJscy5mb3JFYWNoKGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZGVsZXRlKGRvbWFpbiwgdXJsLCBudWxsLCBudWxsLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmIrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuYiA9PT0gdXJscy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYihudWxsLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBSZWRpc1N0b3JhZ2VDQi5wcm90b3R5cGUuZ2V0Q2FjaGVkRG9tYWlucyA9IGZ1bmN0aW9uIChjYikge1xuICAgICAgICB0aGlzLl9jb25uLmhrZXlzKHRoaXMuaGFzaEtleSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0cykge1xuICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgIHJldHVybiBjYihudWxsLCByZXN1bHRzKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBSZWRpc1N0b3JhZ2VDQi5wcm90b3R5cGUuZ2V0Q2FjaGVkVVJMcyA9IGZ1bmN0aW9uIChkb21haW4sIGNiKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBjYWNoZWRVcmxzID0gW107XG4gICAgICAgIHRoaXMuX2Nvbm4uaGtleXModGhpcy5nZXREb21haW5IYXNoS2V5KGRvbWFpbiksIGZ1bmN0aW9uIChlcnIsIHVybHMpIHtcbiAgICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICBpZiAodXJscy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgY2FjaGVkVXJscyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbmIgPSAwO1xuICAgICAgICAgICAgdXJscy5mb3JFYWNoKGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5fY29ubi5nZXQoX3RoaXMuZ2V0VXJsS2V5KGRvbWFpbiwgdXJsKSwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZWRVcmxzLnB1c2godXJsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5iKys7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmIgPT09IHVybHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwsIGNhY2hlZFVybHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2Nvbm4uaGRlbChfdGhpcy5nZXREb21haW5IYXNoS2V5KGRvbWFpbiksIHVybCwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5iKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5iID09PSB1cmxzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgY2FjaGVkVXJscyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFJlZGlzU3RvcmFnZUNCLnByb3RvdHlwZS5nZXRDYWNoZVJ1bGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZS5nZXRNYW5hZ2VyKCkuZ2V0UnVsZXMoKTtcbiAgICB9O1xuICAgIFJlZGlzU3RvcmFnZUNCLnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbiAoZG9tYWluLCB1cmwsIGNhdGVnb3J5LCB0dGwsIGNiKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuaGFzKGRvbWFpbiwgdXJsLCBjYXRlZ29yeSwgdHRsLCBmdW5jdGlvbiAoZXJyLCBpc0NhY2hlZCkge1xuICAgICAgICAgICAgaWYgKCFpc0NhY2hlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYigndXJsIGlzIG5vdCBjYWNoZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIF90aGlzLl9jb25uLmRlbChfdGhpcy5nZXRVcmxLZXkoZG9tYWluLCB1cmwpLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9jb25uLmhkZWwoX3RoaXMuZ2V0RG9tYWluSGFzaEtleShkb21haW4pLCB1cmwsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihudWxsLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgUmVkaXNTdG9yYWdlQ0IucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHBvb2xfMS5SZWRpc1Bvb2wua2lsbCh0aGlzLmluc3RhbmNlLmdldEluc3RhbmNlTmFtZSgpKTtcbiAgICB9O1xuICAgIFJlZGlzU3RvcmFnZUNCLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoZG9tYWluLCB1cmwsIGNhdGVnb3J5LCB0dGwsIGNiKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuX2Nvbm4uaGdldCh0aGlzLmdldERvbWFpbkhhc2hLZXkoZG9tYWluKSwgdXJsLCBmdW5jdGlvbiAoZXJyLCBjb250ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXJyKVxuICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgaWYgKGNvbnRlbnQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IoJ3VybCBub3QgY2FjaGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy5fY29ubi5nZXQoX3RoaXMuZ2V0VXJsS2V5KGRvbWFpbiwgdXJsKSwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9jb25uLmhkZWwoX3RoaXMuZ2V0RG9tYWluSGFzaEtleShkb21haW4pLCBfdGhpcy5nZXRVcmxLZXkoZG9tYWluLCB1cmwpLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKCd1cmwgbm90IGNhY2hlZCAtIGNsZWFuaW5nIHRpbWVzdGFtcCBpbmZvcm1hdGlvbnMnKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGVzZXJpYWxpemVkQ29udGVudCA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihudWxsLCB7IGNvbnRlbnQ6IGNvbnRlbnQsIGNyZWF0ZWRPbjogZGVzZXJpYWxpemVkQ29udGVudC50aW1lc3RhbXAsIGV4dHJhOiBkZXNlcmlhbGl6ZWRDb250ZW50LmV4dHJhIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFJlZGlzU3RvcmFnZUNCLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiAoZG9tYWluLCB1cmwsIGNhdGVnb3J5LCB0dGwsIGNiKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuX2Nvbm4uZ2V0KHRoaXMuZ2V0VXJsS2V5KGRvbWFpbiwgdXJsKSwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGRlYnVnKCdFcnJvciB3aGlsZSBxdWVyeWluZyBpcyBjYWNoZWQgb24gcmVkaXM6ICcsIGRvbWFpbiwgdXJsLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGlzQ2FjaGVkID0gZGF0YSAhPT0gbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAoIWlzQ2FjaGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9jb25uLmhkZWwoX3RoaXMuZ2V0RG9tYWluSGFzaEtleShkb21haW4pLCB1cmwsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihudWxsLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgUmVkaXNTdG9yYWdlQ0IucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChkb21haW4sIHVybCwgdmFsdWUsIGV4dHJhLCBjYXRlZ29yeSwgdHRsLCBmb3JjZSwgY2IpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKGZvcmNlID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlKGRvbWFpbiwgdXJsLCB2YWx1ZSwgZXh0cmEsIHR0bCwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwsIHJlc3VsdCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjYXRlZ29yeSA9PT0gJ25ldmVyJykge1xuICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaGFzKGRvbWFpbiwgdXJsLCBjYXRlZ29yeSwgdHRsLCBmdW5jdGlvbiAoZXJyLCBoYXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgICAgICBpZiAoaGFzID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihudWxsLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5zdG9yZShkb21haW4sIHVybCwgdmFsdWUsIGV4dHJhLCB0dGwsIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihudWxsLCByZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgO1xuICAgIFJlZGlzU3RvcmFnZUNCLnByb3RvdHlwZS5nZXREb21haW5IYXNoS2V5ID0gZnVuY3Rpb24gKGRvbWFpbikge1xuICAgICAgICByZXR1cm4gdGhpcy5oYXNoS2V5ICsgJzonICsgZG9tYWluO1xuICAgIH07XG4gICAgUmVkaXNTdG9yYWdlQ0IucHJvdG90eXBlLnN0b3JlID0gZnVuY3Rpb24gKGRvbWFpbiwgdXJsLCB2YWx1ZSwgZXh0cmEsIHR0bCwgY2IpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5fY29ubi5oc2V0KHRoaXMuaGFzaEtleSwgZG9tYWluLCBkb21haW4sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIF90aGlzLl9jb25uLmhzZXQoX3RoaXMuZ2V0RG9tYWluSGFzaEtleShkb21haW4pLCB1cmwsIHZhbHVlLCBmdW5jdGlvbiAoZXJyLCBleGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2Nvbm4uc2V0KF90aGlzLmdldFVybEtleShkb21haW4sIHVybCksIEpTT04uc3RyaW5naWZ5KHsgdGltZXN0YW1wOiBEYXRlLm5vdygpLCBleHRyYTogZXh0cmEgfSksIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHRsID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9jb25uLmV4cGlyZShfdGhpcy5nZXRVcmxLZXkoZG9tYWluLCB1cmwpLCB0dGwsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFJlZGlzU3RvcmFnZUNCLnByb3RvdHlwZS5nZXRVcmxLZXkgPSBmdW5jdGlvbiAoZG9tYWluLCB1cmwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RG9tYWluSGFzaEtleShkb21haW4pICsgJzonICsgdXJsO1xuICAgIH07XG4gICAgcmV0dXJuIFJlZGlzU3RvcmFnZUNCO1xufShzdG9yYWdlXzEuU3RvcmFnZUNCKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBSZWRpc1N0b3JhZ2VDQjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdHMvcmVkaXMvaW5zdGFuY2VDQi50c1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciByZWRpcyA9IHJlcXVpcmUoJ3JlZGlzJyk7XG52YXIgZGJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJyk7XG52YXIgZGVidWcgPSBkYnVnKCdzaW1wbGUtdXJsLWNhY2hlLVJFRElTJyk7XG52YXIgUmVkaXNQb29sID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBSZWRpc1Bvb2woKSB7XG4gICAgfVxuICAgIFJlZGlzUG9vbC5jb25uZWN0ID0gZnVuY3Rpb24gKGluc3RhbmNlTmFtZSwgY29uZmlnLCBjYikge1xuICAgICAgICBpZiAodHlwZW9mIFJlZGlzUG9vbC5fcG9vbFtpbnN0YW5jZU5hbWVdID09PSAndW5kZWZpbmVkJyB8fFxuICAgICAgICAgICAgUmVkaXNQb29sLl9wb29sW2luc3RhbmNlTmFtZV0gPT09IG51bGwgfHxcbiAgICAgICAgICAgIHR5cGVvZiBSZWRpc1Bvb2wuX3N1YltpbnN0YW5jZU5hbWVdID09PSAndW5kZWZpbmVkJyB8fFxuICAgICAgICAgICAgUmVkaXNQb29sLl9zdWJbaW5zdGFuY2VOYW1lXSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgZGVidWcoJ1RoaXMgcmVkaXMgY29ubmVjdGlvbiBoYXMgbmV2ZXIgYmVlbiBpbnN0YW5jaWF0ZWQgYmVmb3JlJywgaW5zdGFuY2VOYW1lKTtcbiAgICAgICAgICAgIFJlZGlzUG9vbC5fc3RhdHVzW2luc3RhbmNlTmFtZV0gPSB7XG4gICAgICAgICAgICAgICAgb25saW5lOiB7XG4gICAgICAgICAgICAgICAgICAgIHBvb2w6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBzdWI6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBsYXN0RXJyb3I6IG51bGwsXG4gICAgICAgICAgICAgICAgd2FybmluZ3M6IFtdXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgUmVkaXNQb29sLl9wb29sW2luc3RhbmNlTmFtZV0gPSByZWRpcy5jcmVhdGVDbGllbnQoY29uZmlnKTtcbiAgICAgICAgICAgIFJlZGlzUG9vbC5fc3ViW2luc3RhbmNlTmFtZV0gPSByZWRpcy5jcmVhdGVDbGllbnQoY29uZmlnKTtcbiAgICAgICAgICAgIHZhciBuYiA9IDA7XG4gICAgICAgICAgICB2YXIgbmJFcnJvcnMgPSAwO1xuICAgICAgICAgICAgUmVkaXNQb29sLl9wb29sW2luc3RhbmNlTmFtZV0ub24oJ2Nvbm5lY3QnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgUmVkaXNQb29sLl9zdGF0dXNbaW5zdGFuY2VOYW1lXS5vbmxpbmUucG9vbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZGVidWcoJ3Bvb2wgcmVkaXMgY29ubmVjdGVkJyk7XG4gICAgICAgICAgICAgICAgbmIrKztcbiAgICAgICAgICAgICAgICBpZiAobmIgPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoJ1BPT0wgQ09OTkVDVEVEIDIgY29ubnMnKTtcbiAgICAgICAgICAgICAgICAgICAgY2IobnVsbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBSZWRpc1Bvb2wuX3N1YltpbnN0YW5jZU5hbWVdLm9uKCdjb25uZWN0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIFJlZGlzUG9vbC5fc3RhdHVzW2luc3RhbmNlTmFtZV0ub25saW5lLnN1YiA9IHRydWU7XG4gICAgICAgICAgICAgICAgZGVidWcoJ3JlZGlzIGNvbm5lY3RlZCcpO1xuICAgICAgICAgICAgICAgIG5iKys7XG4gICAgICAgICAgICAgICAgaWYgKG5iID09PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlYnVnKCdQT09MIENPTk5FQ1RFRCAyIGNvbm5zJyk7XG4gICAgICAgICAgICAgICAgICAgIGNiKG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgUmVkaXNQb29sLl9wb29sW2luc3RhbmNlTmFtZV0ub24oJ2Vycm9yJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBSZWRpc1Bvb2wuX3N0YXR1c1tpbnN0YW5jZU5hbWVdLmxhc3RFcnJvciA9IGU7XG4gICAgICAgICAgICAgICAgbmJFcnJvcnMrKztcbiAgICAgICAgICAgICAgICBkZWJ1ZyhuYkVycm9ycywgZSk7XG4gICAgICAgICAgICAgICAgaWYgKG5iRXJyb3JzID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNiKGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgUmVkaXNQb29sLl9wb29sW2luc3RhbmNlTmFtZV0ub24oJ2VuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBSZWRpc1Bvb2wuX3Bvb2xbaW5zdGFuY2VOYW1lXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgUmVkaXNQb29sLl9zdGF0dXNbaW5zdGFuY2VOYW1lXS5vbmxpbmUucG9vbCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIFJlZGlzUG9vbC5raWxsKGluc3RhbmNlTmFtZSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdSZWRpcyBDb25uZWN0aW9uIGNsb3NlZCBmb3IgaW5zdGFuY2UgJyArIGluc3RhbmNlTmFtZSk7XG4gICAgICAgICAgICAgICAgZGVidWcoJ0Nvbm5lY3Rpb24gY2xvc2VkJywgaW5zdGFuY2VOYW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgUmVkaXNQb29sLl9wb29sW2luc3RhbmNlTmFtZV0ub24oJ3dhcm5pbmcnLCBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdSZWRpcyB3YXJuaW5nIGZvciBpbnN0YW5jZSAnICsgaW5zdGFuY2VOYW1lICsgJy4gTVNHID0gJywgbXNnKTtcbiAgICAgICAgICAgICAgICBSZWRpc1Bvb2wuX3N0YXR1c1tpbnN0YW5jZU5hbWVdLndhcm5pbmdzLnB1c2gobXNnKTtcbiAgICAgICAgICAgICAgICBkZWJ1ZygnV2FybmluZyBjYWxsZWQ6ICcsIGluc3RhbmNlTmFtZSwgbXNnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgUmVkaXNQb29sLl9zdWJbaW5zdGFuY2VOYW1lXS5vbignZXJyb3InLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIFJlZGlzUG9vbC5fc3RhdHVzW2luc3RhbmNlTmFtZV0ubGFzdEVycm9yID0gZTtcbiAgICAgICAgICAgICAgICBuYkVycm9ycysrO1xuICAgICAgICAgICAgICAgIGRlYnVnKG5iRXJyb3JzLCBlKTtcbiAgICAgICAgICAgICAgICBpZiAobmJFcnJvcnMgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY2IoZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBSZWRpc1Bvb2wuX3N1YltpbnN0YW5jZU5hbWVdLm9uKCdlbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgUmVkaXNQb29sLl9zdWJbaW5zdGFuY2VOYW1lXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgUmVkaXNQb29sLl9zdGF0dXNbaW5zdGFuY2VOYW1lXS5vbmxpbmUuc3ViID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgUmVkaXNQb29sLmtpbGwoaW5zdGFuY2VOYW1lKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ1JlZGlzIENvbm5lY3Rpb24gY2xvc2VkIGZvciBpbnN0YW5jZSAnICsgaW5zdGFuY2VOYW1lKTtcbiAgICAgICAgICAgICAgICBkZWJ1ZygnQ29ubmVjdGlvbiBjbG9zZWQnLCBpbnN0YW5jZU5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBSZWRpc1Bvb2wuX3N1YltpbnN0YW5jZU5hbWVdLm9uKCd3YXJuaW5nJywgZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignUmVkaXMgd2FybmluZyBmb3IgaW5zdGFuY2UgJyArIGluc3RhbmNlTmFtZSArICcuIE1TRyA9ICcsIG1zZyk7XG4gICAgICAgICAgICAgICAgUmVkaXNQb29sLl9zdGF0dXNbaW5zdGFuY2VOYW1lXS53YXJuaW5ncy5wdXNoKG1zZyk7XG4gICAgICAgICAgICAgICAgZGVidWcoJ1dhcm5pbmcgY2FsbGVkOiAnLCBpbnN0YW5jZU5hbWUsIG1zZyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNiKG51bGwpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBSZWRpc1Bvb2wua2lsbCA9IGZ1bmN0aW9uIChpbnN0YW5jZU5hbWUpIHtcbiAgICAgICAgaWYgKFJlZGlzUG9vbC5fc3RhdHVzW2luc3RhbmNlTmFtZV0ub25saW5lLnN1YiA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgUmVkaXNQb29sLl9zdWJbaW5zdGFuY2VOYW1lXS5lbmQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoUmVkaXNQb29sLl9zdGF0dXNbaW5zdGFuY2VOYW1lXS5vbmxpbmUucG9vbCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgUmVkaXNQb29sLl9wb29sW2luc3RhbmNlTmFtZV0uZW5kKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFJlZGlzUG9vbC5nZXRDb25uZWN0aW9uID0gZnVuY3Rpb24gKGluc3RhbmNlTmFtZSkge1xuICAgICAgICBpZiAoUmVkaXNQb29sLl9zdGF0dXNbaW5zdGFuY2VOYW1lXS5vbmxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiBSZWRpc1Bvb2wuX3Bvb2xbaW5zdGFuY2VOYW1lXTtcbiAgICAgICAgfVxuICAgICAgICBkZWJ1ZygnUmVkaXMgUG9vbCBpc25cXCd0IG9ubGluZSB5ZXQnKTtcbiAgICB9O1xuICAgIFJlZGlzUG9vbC5nZXRTdWJzY3JpYmVyQ29ubmVjdGlvbiA9IGZ1bmN0aW9uIChpbnN0YW5jZU5hbWUpIHtcbiAgICAgICAgaWYgKFJlZGlzUG9vbC5fc3RhdHVzW2luc3RhbmNlTmFtZV0ub25saW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gUmVkaXNQb29sLl9zdWJbaW5zdGFuY2VOYW1lXTtcbiAgICAgICAgfVxuICAgICAgICBkZWJ1ZygnUmVkaXMgUG9vbCBpc25cXCd0IG9ubGluZSB5ZXQnKTtcbiAgICB9O1xuICAgIFJlZGlzUG9vbC5fcG9vbCA9IHt9O1xuICAgIFJlZGlzUG9vbC5fc3ViID0ge307XG4gICAgUmVkaXNQb29sLl9zdGF0dXMgPSB7fTtcbiAgICByZXR1cm4gUmVkaXNQb29sO1xufSgpKTtcbmV4cG9ydHMuUmVkaXNQb29sID0gUmVkaXNQb29sO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi90cy9yZWRpcy9wb29sLnRzXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWRpc1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInJlZGlzXCJcbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgU3RvcmFnZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU3RvcmFnZSgpIHtcbiAgICB9XG4gICAgU3RvcmFnZS5wcm90b3R5cGUuZ2V0TWV0aG9kID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tZXRob2Q7XG4gICAgfTtcbiAgICByZXR1cm4gU3RvcmFnZTtcbn0oKSk7XG52YXIgU3RvcmFnZVByb21pc2UgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhTdG9yYWdlUHJvbWlzZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTdG9yYWdlUHJvbWlzZSgpIHtcbiAgICAgICAgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIHJldHVybiBTdG9yYWdlUHJvbWlzZTtcbn0oU3RvcmFnZSkpO1xuZXhwb3J0cy5TdG9yYWdlUHJvbWlzZSA9IFN0b3JhZ2VQcm9taXNlO1xudmFyIFN0b3JhZ2VDQiA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFN0b3JhZ2VDQiwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTdG9yYWdlQ0IoKSB7XG4gICAgICAgIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICByZXR1cm4gU3RvcmFnZUNCO1xufShTdG9yYWdlKSk7XG5leHBvcnRzLlN0b3JhZ2VDQiA9IFN0b3JhZ2VDQjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdHMvYWJzdHJhY3Qvc3RvcmFnZS50c1xuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBpbnN0YW5jZUNCXzEgPSByZXF1aXJlKFwiLi4vcmVkaXMvaW5zdGFuY2VDQlwiKTtcbnZhciBoZWxwZXJzXzEgPSByZXF1aXJlKCcuLi9oZWxwZXJzJyk7XG52YXIgY2FjaGVfMSA9IHJlcXVpcmUoJy4vY2FjaGUnKTtcbnZhciBDYWNoZUVuZ2luZV8xID0gcmVxdWlyZShcIi4vQ2FjaGVFbmdpbmVcIik7XG52YXIgZGJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJyk7XG52YXIgZGVidWcgPSBkYnVnKCdzaW1wbGUtdXJsLWNhY2hlJyk7XG52YXIgQ2FjaGVFbmdpbmVDQiA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKENhY2hlRW5naW5lQ0IsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQ2FjaGVFbmdpbmVDQihkZWZhdWx0RG9tYWluLCBpbnN0YW5jZSkge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBkZWZhdWx0RG9tYWluLCBpbnN0YW5jZSk7XG4gICAgICAgIHRoaXMuc3RvcmFnZUluc3RhbmNlID0gbmV3IGluc3RhbmNlQ0JfMS5kZWZhdWx0KGluc3RhbmNlKTtcbiAgICB9XG4gICAgQ2FjaGVFbmdpbmVDQi5wcm90b3R5cGUuY2xlYXJEb21haW4gPSBmdW5jdGlvbiAoZG9tYWluLCBjYikge1xuICAgICAgICBoZWxwZXJzXzEuZGVmYXVsdC5pc1N0cmluZ0RlZmluZWQoZG9tYWluKTtcbiAgICAgICAgdGhpcy5zdG9yYWdlSW5zdGFuY2UuY2xlYXJEb21haW4oZG9tYWluLCBjYik7XG4gICAgfTtcbiAgICBDYWNoZUVuZ2luZUNCLnByb3RvdHlwZS5jbGVhckluc3RhbmNlID0gZnVuY3Rpb24gKGNiKSB7XG4gICAgICAgIHRoaXMuc3RvcmFnZUluc3RhbmNlLmNsZWFyQ2FjaGUoY2IpO1xuICAgIH07XG4gICAgQ2FjaGVFbmdpbmVDQi5wcm90b3R5cGUuZ2V0U3RvcmVkSG9zdG5hbWVzID0gZnVuY3Rpb24gKGNiKSB7XG4gICAgICAgIHRoaXMuc3RvcmFnZUluc3RhbmNlLmdldENhY2hlZERvbWFpbnMoY2IpO1xuICAgIH07XG4gICAgQ2FjaGVFbmdpbmVDQi5wcm90b3R5cGUuZ2V0U3RvcmVkVVJMcyA9IGZ1bmN0aW9uIChkb21haW4sIGNiKSB7XG4gICAgICAgIGhlbHBlcnNfMS5kZWZhdWx0LmlzU3RyaW5nRGVmaW5lZChkb21haW4pO1xuICAgICAgICB0aGlzLnN0b3JhZ2VJbnN0YW5jZS5nZXRDYWNoZWRVUkxzKGRvbWFpbiwgY2IpO1xuICAgIH07XG4gICAgQ2FjaGVFbmdpbmVDQi5wcm90b3R5cGUudXJsID0gZnVuY3Rpb24gKHVybCkge1xuICAgICAgICB2YXIgcGFyc2VkVVJMID0gaGVscGVyc18xLmRlZmF1bHQucGFyc2VVUkwodXJsKTtcbiAgICAgICAgaWYgKHBhcnNlZFVSTC5kb21haW4ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBwYXJzZWRVUkwuZG9tYWluID0gdGhpcy5kZWZhdWx0RG9tYWluO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjYWNoZSA9IG5ldyBjYWNoZV8xLlVybENCKHBhcnNlZFVSTC5kb21haW4sIHRoaXMuc3RvcmFnZUluc3RhbmNlLCB0aGlzLmluc3RhbmNlTmFtZSwgcGFyc2VkVVJMLnJlbGF0aXZlVVJMKTtcbiAgICAgICAgdGhpcy5hZGRVcmwoY2FjaGUpO1xuICAgICAgICByZXR1cm4gY2FjaGU7XG4gICAgfTtcbiAgICByZXR1cm4gQ2FjaGVFbmdpbmVDQjtcbn0oQ2FjaGVFbmdpbmVfMS5kZWZhdWx0KSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDYWNoZUVuZ2luZUNCO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi90cy9jYWNoZUVuZ2luZS9jYWNoZUVuZ2luZUNCLnRzXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBoZWxwZXJzXzEgPSByZXF1aXJlKFwiLi9oZWxwZXJzXCIpO1xudmFyIHBvb2xfMSA9IHJlcXVpcmUoXCIuL3JlZGlzL3Bvb2xcIik7XG52YXIgQ2FjaGVFbmdpbmVfMSA9IHJlcXVpcmUoJy4vY2FjaGVFbmdpbmUvQ2FjaGVFbmdpbmUnKTtcbnZhciBDYWNoZVJ1bGVNYW5hZ2VyXzEgPSByZXF1aXJlKCcuL3J1bGVzL0NhY2hlUnVsZU1hbmFnZXInKTtcbnZhciBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ3NpbXBsZS11cmwtY2FjaGUnKTtcbnZhciBJbnN0YW5jZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gSW5zdGFuY2UoaW5zdGFuY2VOYW1lLCByZWRpc0NvbmZpZywgY29uZmlnLCBjYikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoY29uZmlnID09PSB2b2lkIDApIHsgY29uZmlnID0geyBvbl9leGlzdGluZ19yZWdleDogJ3JlcGxhY2UnLCBvbl9wdWJsaXNoX3VwZGF0ZTogZmFsc2UgfTsgfVxuICAgICAgICB0aGlzLmluc3RhbmNlTmFtZSA9IGluc3RhbmNlTmFtZTtcbiAgICAgICAgdGhpcy5yZWRpc0NvbmZpZyA9IHJlZGlzQ29uZmlnO1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgdGhpcy5pbnN0YW5jaWF0ZWQgPSBmYWxzZTtcbiAgICAgICAgaGVscGVyc18xLmRlZmF1bHQuaXNOb3RVbmRlZmluZWQoaW5zdGFuY2VOYW1lLCByZWRpc0NvbmZpZywgY29uZmlnLCBjYik7XG4gICAgICAgIHRoaXMuY29uZmlnID0gT2JqZWN0LmFzc2lnbih7IG9uX2V4aXN0aW5nX3JlZ2V4OiAncmVwbGFjZScsIG9uX3B1Ymxpc2hfdXBkYXRlOiBmYWxzZSB9LCBjb25maWcpO1xuICAgICAgICBwb29sXzEuUmVkaXNQb29sLmNvbm5lY3QoaW5zdGFuY2VOYW1lLCByZWRpc0NvbmZpZywgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IoJ0Vycm9yIGNvbm5lY3RpbmcgdG8gUkVESVM6ICcgKyBlcnIpO1xuICAgICAgICAgICAgdmFyIHJlZGlzQ29ubiA9IHBvb2xfMS5SZWRpc1Bvb2wuZ2V0Q29ubmVjdGlvbihpbnN0YW5jZU5hbWUpO1xuICAgICAgICAgICAgcmVkaXNDb25uLmhnZXQoaGVscGVyc18xLmRlZmF1bHQuZ2V0Q29uZmlnS2V5KCksIF90aGlzLmluc3RhbmNlTmFtZSwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYignUmVkaXMgZXJyb3IgLSByZXRyaWV2aW5nICcgKyBoZWxwZXJzXzEuZGVmYXVsdC5nZXRDb25maWdLZXkoKSArICcgLT4gJyArIGVycik7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKCdObyBDYWNoZVJ1bGUgZGVmaW5lZCBmb3IgdGhpcyBpbnN0YW5jZSAnICsgX3RoaXMuaW5zdGFuY2VOYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmluc3RhbmNpYXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJzZWREYXRhID0gSlNPTi5wYXJzZShkYXRhLCBoZWxwZXJzXzEuZGVmYXVsdC5KU09OUmVnRXhwUmV2aXZlcik7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm1hbmFnZXIgPSBuZXcgQ2FjaGVSdWxlTWFuYWdlcl8xLmRlZmF1bHQocGFyc2VkRGF0YSwgY29uZmlnLm9uX2V4aXN0aW5nX3JlZ2V4KTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubGF1bmNoU3Vic2NyaWJlcigpO1xuICAgICAgICAgICAgICAgICAgICBjYihudWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIEluc3RhbmNlLnByb3RvdHlwZS5sYXVuY2hTdWJzY3JpYmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgc3Vic2NyaWJlciA9IHBvb2xfMS5SZWRpc1Bvb2wuZ2V0U3Vic2NyaWJlckNvbm5lY3Rpb24odGhpcy5pbnN0YW5jZU5hbWUpO1xuICAgICAgICBzdWJzY3JpYmVyLnN1YnNjcmliZSh0aGlzLmdldENoYW5uZWwoKSk7XG4gICAgICAgIHN1YnNjcmliZXIub24oJ21lc3NhZ2UnLCBmdW5jdGlvbiAoY2hhbm5lbCwgbWVzc2FnZSkge1xuICAgICAgICAgICAgaWYgKG1lc3NhZ2UgPT09ICdQVVNIRUQnKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMub25QdWJsaXNoKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgSW5zdGFuY2UucHJvdG90eXBlLmdldENoYW5uZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBoZWxwZXJzXzEuZGVmYXVsdC5nZXRDb25maWdLZXkoKSArIHRoaXMuaW5zdGFuY2VOYW1lO1xuICAgIH07XG4gICAgSW5zdGFuY2UucHJvdG90eXBlLnB1Ymxpc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIENhY2hlRW5naW5lXzEuZGVmYXVsdC51cGRhdGVBbGxVcmxDYXRlZ29yeSh0aGlzLmluc3RhbmNlTmFtZSk7XG4gICAgICAgIHZhciByZWRpc0Nvbm4gPSBwb29sXzEuUmVkaXNQb29sLmdldENvbm5lY3Rpb24odGhpcy5pbnN0YW5jZU5hbWUpO1xuICAgICAgICB2YXIgc3RyaW5naWZpZWQgPSBKU09OLnN0cmluZ2lmeSh0aGlzLm1hbmFnZXIuZ2V0UnVsZXMoKSwgaGVscGVyc18xLmRlZmF1bHQuSlNPTlJlZ0V4cFJlcGxhY2VyLCAyKTtcbiAgICAgICAgcmVkaXNDb25uLmhzZXQoaGVscGVyc18xLmRlZmF1bHQuZ2V0Q29uZmlnS2V5KCksIHRoaXMuaW5zdGFuY2VOYW1lLCBzdHJpbmdpZmllZCwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICBoZWxwZXJzXzEuZGVmYXVsdC5SZWRpc0Vycm9yKCd3aGlsZSBwdWJsaXNoaW5nIGNvbmZpZyAnICsgc3RyaW5naWZpZWQsIGVycik7XG4gICAgICAgICAgICByZWRpc0Nvbm4ucHVibGlzaChfdGhpcy5nZXRDaGFubmVsKCksICdQVVNIRUQnKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBJbnN0YW5jZS5wcm90b3R5cGUub25QdWJsaXNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgcmVkaXNDb25uID0gcG9vbF8xLlJlZGlzUG9vbC5nZXRDb25uZWN0aW9uKHRoaXMuaW5zdGFuY2VOYW1lKTtcbiAgICAgICAgcmVkaXNDb25uLmhnZXQoaGVscGVyc18xLmRlZmF1bHQuZ2V0Q29uZmlnS2V5KCksIHRoaXMuaW5zdGFuY2VOYW1lLCBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gICAgICAgICAgICBpZiAoZXJyKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUmVkaXMgZXJyb3IgLSByZXRyaWV2aW5nICcgKyBoZWxwZXJzXzEuZGVmYXVsdC5nZXRDb25maWdLZXkoKSk7XG4gICAgICAgICAgICBpZiAoZGF0YSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQmlnIG1lc3MnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBwYXJzZWREYXRhID0gSlNPTi5wYXJzZShkYXRhLCBoZWxwZXJzXzEuZGVmYXVsdC5KU09OUmVnRXhwUmV2aXZlcik7XG4gICAgICAgICAgICBfdGhpcy5tYW5hZ2VyLnVwZGF0ZVJ1bGVzKHBhcnNlZERhdGEpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIEluc3RhbmNlLnByb3RvdHlwZS5nZXRNYW5hZ2VyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tYW5hZ2VyO1xuICAgIH07XG4gICAgSW5zdGFuY2UucHJvdG90eXBlLmdldENvbmZpZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnO1xuICAgIH07XG4gICAgSW5zdGFuY2UucHJvdG90eXBlLmdldEluc3RhbmNlTmFtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2VOYW1lO1xuICAgIH07XG4gICAgSW5zdGFuY2UucHJvdG90eXBlLmdldFJlZGlzQ29uZmlnID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWRpc0NvbmZpZztcbiAgICB9O1xuICAgIEluc3RhbmNlLnByb3RvdHlwZS5pc0luc3RhbmNpYXRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2lhdGVkO1xuICAgIH07XG4gICAgSW5zdGFuY2UucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHBvb2xfMS5SZWRpc1Bvb2wua2lsbCh0aGlzLmluc3RhbmNlTmFtZSk7XG4gICAgICAgIHRoaXMuaW5zdGFuY2lhdGVkID0gZmFsc2U7XG4gICAgfTtcbiAgICByZXR1cm4gSW5zdGFuY2U7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gSW5zdGFuY2U7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3RzL2luc3RhbmNlLnRzXG4vLyBtb2R1bGUgaWQgPSAxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBoZWxwZXJzXzEgPSByZXF1aXJlKFwiLi4vaGVscGVyc1wiKTtcbnZhciBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ3NpbXBsZS11cmwtY2FjaGUnKTtcbnZhciBDYWNoZVJ1bGVNYW5hZ2VyID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDYWNoZVJ1bGVNYW5hZ2VyKGNhY2hlUnVsZXMsIG9uX2V4aXN0aW5nX3JlZ2V4KSB7XG4gICAgICAgIHRoaXMuY2FjaGVSdWxlcyA9IGNhY2hlUnVsZXM7XG4gICAgICAgIHRoaXMub25fZXhpc3RpbmdfcmVnZXggPSBvbl9leGlzdGluZ19yZWdleDtcbiAgICB9XG4gICAgQ2FjaGVSdWxlTWFuYWdlci5wcm90b3R5cGUuYWRkTWF4QWdlUnVsZSA9IGZ1bmN0aW9uIChkb21haW4sIHJlZ2V4LCBtYXhBZ2UsIGlnbm9yZVF1ZXJ5KSB7XG4gICAgICAgIGhlbHBlcnNfMS5kZWZhdWx0LmlzTm90VW5kZWZpbmVkKGRvbWFpbiwgcmVnZXgsIG1heEFnZSk7XG4gICAgICAgIHZhciByZWdleFJ1bGUgPSB7IHJlZ2V4OiByZWdleCwgbWF4QWdlOiBtYXhBZ2UsIGlnbm9yZVF1ZXJ5OiBpZ25vcmVRdWVyeSA/IGlnbm9yZVF1ZXJ5IDogZmFsc2UgfTtcbiAgICAgICAgaGVscGVyc18xLmRlZmF1bHQuaXNNYXhBZ2VSZWdleFJ1bGUocmVnZXhSdWxlKTtcbiAgICAgICAgdmFyIGZvdW5kID0gdGhpcy5maW5kUmVnZXgoZG9tYWluLCByZWdleFJ1bGUpO1xuICAgICAgICB0aGlzLmFkZChkb21haW4sIHJlZ2V4UnVsZSwgJ21heEFnZScsIGZvdW5kKTtcbiAgICB9O1xuICAgIENhY2hlUnVsZU1hbmFnZXIucHJvdG90eXBlLmFkZE5ldmVyUnVsZSA9IGZ1bmN0aW9uIChkb21haW4sIHJlZ2V4LCBpZ25vcmVRdWVyeSkge1xuICAgICAgICBoZWxwZXJzXzEuZGVmYXVsdC5pc05vdFVuZGVmaW5lZChyZWdleCk7XG4gICAgICAgIHZhciByZWdleFJ1bGUgPSB7IHJlZ2V4OiByZWdleCwgaWdub3JlUXVlcnk6IGlnbm9yZVF1ZXJ5ID8gaWdub3JlUXVlcnkgOiBmYWxzZSB9O1xuICAgICAgICBoZWxwZXJzXzEuZGVmYXVsdC5pc0NvbmZpZ1JlZ2V4UnVsZShyZWdleFJ1bGUpO1xuICAgICAgICB2YXIgZm91bmQgPSB0aGlzLmZpbmRSZWdleChkb21haW4sIHJlZ2V4UnVsZSk7XG4gICAgICAgIHRoaXMuYWRkKGRvbWFpbiwgcmVnZXhSdWxlLCAnbmV2ZXInLCBmb3VuZCk7XG4gICAgfTtcbiAgICBDYWNoZVJ1bGVNYW5hZ2VyLnByb3RvdHlwZS5hZGRBbHdheXNSdWxlID0gZnVuY3Rpb24gKGRvbWFpbiwgcmVnZXgsIGlnbm9yZVF1ZXJ5KSB7XG4gICAgICAgIGhlbHBlcnNfMS5kZWZhdWx0LmlzTm90VW5kZWZpbmVkKHJlZ2V4KTtcbiAgICAgICAgdmFyIHJlZ2V4UnVsZSA9IHsgcmVnZXg6IHJlZ2V4LCBpZ25vcmVRdWVyeTogaWdub3JlUXVlcnkgPyBpZ25vcmVRdWVyeSA6IGZhbHNlIH07XG4gICAgICAgIGhlbHBlcnNfMS5kZWZhdWx0LmlzQ29uZmlnUmVnZXhSdWxlKHJlZ2V4UnVsZSk7XG4gICAgICAgIHZhciBmb3VuZCA9IHRoaXMuZmluZFJlZ2V4KGRvbWFpbiwgcmVnZXhSdWxlKTtcbiAgICAgICAgdGhpcy5hZGQoZG9tYWluLCByZWdleFJ1bGUsICdhbHdheXMnLCBmb3VuZCk7XG4gICAgfTtcbiAgICBDYWNoZVJ1bGVNYW5hZ2VyLnByb3RvdHlwZS5nZXRSdWxlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVSdWxlcztcbiAgICB9O1xuICAgIENhY2hlUnVsZU1hbmFnZXIucHJvdG90eXBlLnNldERlZmF1bHQgPSBmdW5jdGlvbiAoc3RyYXRlZ3kpIHtcbiAgICAgICAgaGVscGVyc18xLmRlZmF1bHQuaXNTdHJpbmdJbihzdHJhdGVneSwgWydhbHdheXMnLCAnbmV2ZXInXSk7XG4gICAgICAgIHRoaXMuY2FjaGVSdWxlcy5kZWZhdWx0ID0gc3RyYXRlZ3k7XG4gICAgfTtcbiAgICBDYWNoZVJ1bGVNYW5hZ2VyLnByb3RvdHlwZS5yZW1vdmVSdWxlID0gZnVuY3Rpb24gKGRvbWFpbiwgcnVsZSkge1xuICAgICAgICBoZWxwZXJzXzEuZGVmYXVsdC5pc05vdFVuZGVmaW5lZChydWxlKTtcbiAgICAgICAgaGVscGVyc18xLmRlZmF1bHQuaXNDb25maWdSZWdleFJ1bGUocnVsZSk7XG4gICAgICAgIHZhciBmb3VuZCA9IHRoaXMuZmluZFJlZ2V4KGRvbWFpbiwgcnVsZSk7XG4gICAgICAgIGlmIChmb3VuZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5jYWNoZVJ1bGVzW2ZvdW5kLnR5cGVdW2ZvdW5kLmluZGV4XS5ydWxlcy5zcGxpY2UoZm91bmQuc3ViSW5kZXgsIDEpO1xuICAgICAgICAgICAgaWYgKHRoaXMuY2FjaGVSdWxlc1tmb3VuZC50eXBlXVtmb3VuZC5pbmRleF0ucnVsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZVJ1bGVzW2ZvdW5kLnR5cGVdLnNwbGljZShmb3VuZC5pbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIENhY2hlUnVsZU1hbmFnZXIucHJvdG90eXBlLnJlbW92ZUFsbE1heEFnZVJ1bGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNhY2hlUnVsZXMubWF4QWdlID0gW107XG4gICAgfTtcbiAgICBDYWNoZVJ1bGVNYW5hZ2VyLnByb3RvdHlwZS5yZW1vdmVBbGxOZXZlclJ1bGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNhY2hlUnVsZXMubmV2ZXIgPSBbXTtcbiAgICB9O1xuICAgIENhY2hlUnVsZU1hbmFnZXIucHJvdG90eXBlLnJlbW92ZUFsbEFsd2F5c1J1bGVzID0gZnVuY3Rpb24gKGRvbWFpbikge1xuICAgICAgICB0aGlzLmNhY2hlUnVsZXMuYWx3YXlzID0gW107XG4gICAgfTtcbiAgICBDYWNoZVJ1bGVNYW5hZ2VyLnByb3RvdHlwZS51cGRhdGVSdWxlcyA9IGZ1bmN0aW9uIChjYWNoZVJ1bGVzKSB7XG4gICAgICAgIHRoaXMuY2FjaGVSdWxlcyA9IGNhY2hlUnVsZXM7XG4gICAgfTtcbiAgICBDYWNoZVJ1bGVNYW5hZ2VyLnByb3RvdHlwZS5jaGVja0RvbWFpbk1hdGNoID0gZnVuY3Rpb24gKHN0b3JlZCwgaW5wdXQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzdG9yZWQgPT09ICdzdHJpbmcnICYmIHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiBzdG9yZWQgPT09IGlucHV0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHN0b3JlZCBpbnN0YW5jZW9mIFJlZ0V4cCAmJiBpbnB1dCBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAgICAgcmV0dXJuIGhlbHBlcnNfMS5kZWZhdWx0LlNhbWVSZWdleChzdG9yZWQsIGlucHV0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgQ2FjaGVSdWxlTWFuYWdlci5wcm90b3R5cGUuZmluZFJlZ2V4ID0gZnVuY3Rpb24gKGRvbWFpbiwgcnVsZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgaW5mbyA9IG51bGwsIGluZGV4LCBzdWJJbmRleDtcbiAgICAgICAgWydhbHdheXMnLCAnbmV2ZXInLCAnbWF4QWdlJ10uZm9yRWFjaChmdW5jdGlvbiAodHlwZSkge1xuICAgICAgICAgICAgZm9yIChpbmRleCA9IDA7IGluZGV4IDwgX3RoaXMuY2FjaGVSdWxlc1t0eXBlXS5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMuY2hlY2tEb21haW5NYXRjaChfdGhpcy5jYWNoZVJ1bGVzW3R5cGVdW2luZGV4XS5kb21haW4sIGRvbWFpbikpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChzdWJJbmRleCA9IDA7IHN1YkluZGV4IDwgX3RoaXMuY2FjaGVSdWxlc1t0eXBlXVtpbmRleF0ucnVsZXMubGVuZ3RoOyBzdWJJbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGVscGVyc18xLmRlZmF1bHQuU2FtZVJlZ2V4KHJ1bGUucmVnZXgsIF90aGlzLmNhY2hlUnVsZXNbdHlwZV1baW5kZXhdLnJ1bGVzW3N1YkluZGV4XS5yZWdleCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZvID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YkluZGV4OiBzdWJJbmRleFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gaW5mbztcbiAgICB9O1xuICAgIENhY2hlUnVsZU1hbmFnZXIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChkb21haW4sIHJ1bGUsIHdoZXJlLCBmb3VuZCkge1xuICAgICAgICBkZWJ1ZygnYWRkaW5nIHJ1bGUgJywgZG9tYWluLCBydWxlLCB3aGVyZSwgZm91bmQpO1xuICAgICAgICBkZWJ1ZygnYmVmb3JlOiAnLCB0aGlzLmNhY2hlUnVsZXMpO1xuICAgICAgICBpZiAoZm91bmQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5vbl9leGlzdGluZ19yZWdleCkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2lnbm9yZSc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICBjYXNlICdyZXBsYWNlJzpcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoJ3JlcGxhY2luZzogJywgdGhpcy5jYWNoZVJ1bGVzW2ZvdW5kLnR5cGVdW2ZvdW5kLmluZGV4XS5ydWxlcywgZm91bmQuc3ViSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhY2hlUnVsZXNbZm91bmQudHlwZV1bZm91bmQuaW5kZXhdLnJ1bGVzLnNwbGljZShmb3VuZC5zdWJJbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2Vycm9yJzpcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBZGRpbmcgYSBtYXhBZ2UgcmVnZXggdGhhdCBpcyBhbHJlYWR5IGRlZmluZWQgaGVyZTogJyArIEpTT04ucGFyc2UoZm91bmQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZm91bmQgIT09IG51bGwgJiYgZm91bmQudHlwZSA9PT0gd2hlcmUpIHtcbiAgICAgICAgICAgIHRoaXMuY2FjaGVSdWxlc1t3aGVyZV1bZm91bmQuaW5kZXhdLnJ1bGVzLnB1c2gocnVsZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgaW5kZXgydXBkYXRlID0gdm9pZCAwLCBpbmRleCA9IHZvaWQgMDtcbiAgICAgICAgICAgIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuY2FjaGVSdWxlc1t3aGVyZV0ubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tEb21haW5NYXRjaCh0aGlzLmNhY2hlUnVsZXNbd2hlcmVdW2luZGV4XS5kb21haW4sIGRvbWFpbikpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXgydXBkYXRlID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBpbmRleDJ1cGRhdGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgZGVidWcoJ0EgZG9tYWluIGFscmVhZHkgZXhpc3RzLCBzbyBwdXNpbmcgcnVsZXMgYXQgaW5kZXggJywgaW5kZXgydXBkYXRlLCB0aGlzLmNhY2hlUnVsZXNbd2hlcmVdW2luZGV4MnVwZGF0ZV0pO1xuICAgICAgICAgICAgICAgIHRoaXMuY2FjaGVSdWxlc1t3aGVyZV1baW5kZXgydXBkYXRlXS5ydWxlcy5wdXNoKHJ1bGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZVJ1bGVzW3doZXJlXS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgZG9tYWluOiBkb21haW4sXG4gICAgICAgICAgICAgICAgICAgIHJ1bGVzOiBbcnVsZV1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgfTtcbiAgICByZXR1cm4gQ2FjaGVSdWxlTWFuYWdlcjtcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDYWNoZVJ1bGVNYW5hZ2VyO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi90cy9ydWxlcy9DYWNoZVJ1bGVNYW5hZ2VyLnRzXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBwb29sXzEgPSByZXF1aXJlKFwiLi4vcmVkaXMvcG9vbFwiKTtcbnZhciBoZWxwZXJzXzEgPSByZXF1aXJlKFwiLi4vaGVscGVyc1wiKTtcbnZhciBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ3NpbXBsZS11cmwtY2FjaGUnKTtcbnZhciBDYWNoZVJ1bGVzQ3JlYXRvciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2FjaGVSdWxlc0NyZWF0b3IoaW5zdGFuY2VOYW1lLCByZWRpc0NvbmZpZywgY2IpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5pbnN0YW5jZU5hbWUgPSBpbnN0YW5jZU5hbWU7XG4gICAgICAgIHRoaXMucmVkaXNDb25maWcgPSByZWRpc0NvbmZpZztcbiAgICAgICAgaGVscGVyc18xLmRlZmF1bHQuaXNOb3RVbmRlZmluZWQoaW5zdGFuY2VOYW1lLCByZWRpc0NvbmZpZywgY2IpO1xuICAgICAgICBkZWJ1ZygnY29ubmVjdGluZyB0byByZWRpcycpO1xuICAgICAgICBwb29sXzEuUmVkaXNQb29sLmNvbm5lY3QoaW5zdGFuY2VOYW1lLCByZWRpc0NvbmZpZywgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IoJ0Vycm9yIGNvbm5lY3RpbmcgdG8gUkVESVMnKTtcbiAgICAgICAgICAgIF90aGlzLl9jb25uID0gcG9vbF8xLlJlZGlzUG9vbC5nZXRDb25uZWN0aW9uKGluc3RhbmNlTmFtZSk7XG4gICAgICAgICAgICBjYihudWxsLCBfdGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBDYWNoZVJ1bGVzQ3JlYXRvci5wcm90b3R5cGUuaW1wb3J0UnVsZXMgPSBmdW5jdGlvbiAocnVsZXMsIG92ZXJ3cml0ZSwgY2IpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaGVscGVyc18xLmRlZmF1bHQuaXNOb3RVbmRlZmluZWQocnVsZXMsIGNiKTtcbiAgICAgICAgaGVscGVyc18xLmRlZmF1bHQudmFsaWRhdGVDYWNoZUNvbmZpZyhydWxlcyk7XG4gICAgICAgIHRoaXMuX2Nvbm4uaGdldChoZWxwZXJzXzEuZGVmYXVsdC5nZXRDb25maWdLZXkoKSwgdGhpcy5pbnN0YW5jZU5hbWUsIGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKCdSZWRpcyBlcnJvciAtIHJldHJpZXZpbmcgJyArIGhlbHBlcnNfMS5kZWZhdWx0LmdldENvbmZpZ0tleSgpICsgJzogJyArIGVycik7XG4gICAgICAgICAgICBpZiAoZGF0YSAhPT0gbnVsbCAmJiAhb3ZlcndyaXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKCdBIENhY2hlUnVsZSBkZWZpbml0aW9uIGFscmVhZHkgZXhpc3RzIGZvciB0aGlzIGluc3RhbmNlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgc3RyaW5naWZpZWQgPSBKU09OLnN0cmluZ2lmeShydWxlcywgaGVscGVyc18xLmRlZmF1bHQuSlNPTlJlZ0V4cFJlcGxhY2VyLCAyKTtcbiAgICAgICAgICAgIF90aGlzLl9jb25uLmhzZXQoaGVscGVyc18xLmRlZmF1bHQuZ2V0Q29uZmlnS2V5KCksIF90aGlzLmluc3RhbmNlTmFtZSwgc3RyaW5naWZpZWQsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKVxuICAgICAgICAgICAgICAgICAgICBjYihlcnIpO1xuICAgICAgICAgICAgICAgIGNiKG51bGwpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIENhY2hlUnVsZXNDcmVhdG9yO1xufSgpKTtcbnZhciBDYWNoZUNyZWF0b3IgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENhY2hlQ3JlYXRvcigpIHtcbiAgICB9XG4gICAgQ2FjaGVDcmVhdG9yLmNyZWF0ZUNhY2hlID0gZnVuY3Rpb24gKGluc3RhbmNlTmFtZSwgZm9yY2UsIHJlZGlzQ29uZmlnLCBydWxlcywgY2IpIHtcbiAgICAgICAgaGVscGVyc18xLmRlZmF1bHQuaXNOb3RVbmRlZmluZWQoaW5zdGFuY2VOYW1lLCBmb3JjZSwgcmVkaXNDb25maWcsIHJ1bGVzLCBjYik7XG4gICAgICAgIG5ldyBDYWNoZVJ1bGVzQ3JlYXRvcihpbnN0YW5jZU5hbWUsIHJlZGlzQ29uZmlnLCBmdW5jdGlvbiAoZXJyLCBjcmVhdG9yKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjcmVhdG9yLmltcG9ydFJ1bGVzKHJ1bGVzLCBmb3JjZSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNiKG51bGwpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIENhY2hlQ3JlYXRvcjtcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDYWNoZUNyZWF0b3I7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3RzL3J1bGVzL0NhY2hlUnVsZXNDcmVhdG9yLnRzXG4vLyBtb2R1bGUgaWQgPSAxNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9