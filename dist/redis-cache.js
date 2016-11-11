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
	module.exports = {
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
	var debug = dbug('redis-url-cache');
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
	var debug = __webpack_require__(5)('redis-url-cache');
	var Helpers = (function () {
	    function Helpers() {
	    }
	    Helpers.unserializeRegex = function (input) {
	        console.log('GOing to unserialize regex', input);
	        var match = input.match(new RegExp('^/(.*?)/([gimy]*)$'));
	        console.log(match[0], match[1], match[2]);
	        if (match.length === 3 && typeof match[1] === 'string' && typeof match[2] === 'string') {
	            return new RegExp(match[1], match[2]);
	        }
	        throw new Error('The regex string is not a valid regex: ' + input);
	    };
	    Helpers.unserializeCacheRules = function (rules) {
	        var index, ruleIndex, domain, regex;
	        var types = ['always', 'never', 'maxAge'];
	        types.forEach(function (type) {
	            for (index in rules[type]) {
	                rules[type][index].domain = Helpers.unserializeRegex(rules[type][index].domain);
	                for (ruleIndex in rules[type][index].rules) {
	                    regex = Helpers.unserializeRegex(rules[type][index].rules[ruleIndex].regex);
	                    rules[type][index].rules[ruleIndex].regex = regex;
	                }
	            }
	        });
	        return rules;
	    };
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
	var debug = __webpack_require__(5)('redis-url-cache');
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
	var debug = __webpack_require__(5)('redis-url-cache');
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
	        validateCacheConfig: helpers_1.default.validateCacheConfig,
	        unserializeRegex: helpers_1.default.unserializeRegex,
	        unserializeCacheRules: helpers_1.default.unserializeCacheRules
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
	var debug = debg('redis-url-cache-REDIS');
	var RedisStoragePromise = (function (_super) {
	    __extends(RedisStoragePromise, _super);
	    function RedisStoragePromise(instance) {
	        _super.call(this);
	        this.instance = instance;
	        this.hashKey = 'redis-url-cache:' + instance.getInstanceName();
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
	var debug = debg('redis-url-cache-REDIS');
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
	var debug = dbug('redis-url-cache-REDIS');
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
	var debug = dbug('redis-url-cache');
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
	var debug = __webpack_require__(5)('redis-url-cache');
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
	var debug = __webpack_require__(5)('redis-url-cache');
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
	var debug = __webpack_require__(5)('redis-url-cache');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNmU4Yzk4NTg3NjE5ZTI2YzYyNWUiLCJ3ZWJwYWNrOi8vLy4vdHMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vdHMvY2FjaGVFbmdpbmUvY2FjaGVFbmdpbmVQcm9taXNlLnRzIiwid2VicGFjazovLy9leHRlcm5hbCBcImVzNi1wcm9taXNlXCIiLCJ3ZWJwYWNrOi8vLy4vdHMvaGVscGVycy50cyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1cmxcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJkZWJ1Z1wiIiwid2VicGFjazovLy8uL3RzL2NhY2hlRW5naW5lL2NhY2hlLnRzIiwid2VicGFjazovLy8uL3RzL2NhY2hlRW5naW5lL0NhY2hlRW5naW5lLnRzIiwid2VicGFjazovLy8uL3RzL3JlZGlzL2luc3RhbmNlUHJvbWlzZS50cyIsIndlYnBhY2s6Ly8vLi90cy9yZWRpcy9pbnN0YW5jZUNCLnRzIiwid2VicGFjazovLy8uL3RzL3JlZGlzL3Bvb2wudHMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicmVkaXNcIiIsIndlYnBhY2s6Ly8vLi90cy9hYnN0cmFjdC9zdG9yYWdlLnRzIiwid2VicGFjazovLy8uL3RzL2NhY2hlRW5naW5lL2NhY2hlRW5naW5lQ0IudHMiLCJ3ZWJwYWNrOi8vLy4vdHMvaW5zdGFuY2UudHMiLCJ3ZWJwYWNrOi8vLy4vdHMvcnVsZXMvQ2FjaGVSdWxlTWFuYWdlci50cyIsIndlYnBhY2s6Ly8vLi90cy9ydWxlcy9DYWNoZVJ1bGVzQ3JlYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ1ZBO0FBQ0E7QUFDQTtBQUNBLG9CQUFtQixzQkFBc0I7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0EsY0FBYTtBQUNiLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQSxjQUFhO0FBQ2IsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBLGNBQWE7QUFDYixVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQSxjQUFhO0FBQ2IsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDO0FBQ0QsK0NBQThDLGNBQWM7QUFDNUQ7Ozs7Ozs7QUMvRUEseUM7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBd0IsdUJBQXVCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTJCLGtCQUFrQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7QUFDRCwrQ0FBOEMsY0FBYztBQUM1RDs7Ozs7OztBQzNMQSxpQzs7Ozs7O0FDQUEsbUM7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBLG9CQUFtQixzQkFBc0I7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUIsNEJBQTRCO0FBQ2pEO0FBQ0EsNEJBQTJCLHFDQUFxQztBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCLDRCQUE0QjtBQUNqRDtBQUNBLDRCQUEyQixxQ0FBcUM7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUIsMkJBQTJCO0FBQ2hEO0FBQ0EsNEJBQTJCLG9DQUFvQztBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNEOzs7Ozs7O0FDaEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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LDRCQUEyQix1Q0FBdUM7QUFDbEU7QUFDQSx1Q0FBc0MsdURBQXVEO0FBQzdGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBMkIsdUNBQXVDO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNELCtDQUE4QyxjQUFjO0FBQzVEOzs7Ozs7O0FDcElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiLFVBQVM7QUFDVDtBQUNBO0FBQ0EsRUFBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2IsVUFBUztBQUNUO0FBQ0E7QUFDQSxFQUFDO0FBQ0QsK0NBQThDLGNBQWM7QUFDNUQiLCJmaWxlIjoiZGlzdC9yZWRpcy1jYWNoZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDZlOGM5ODU4NzYxOWUyNmM2MjVlIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgY2FjaGVFbmdpbmVQcm9taXNlXzEgPSByZXF1aXJlKCcuL2NhY2hlRW5naW5lL2NhY2hlRW5naW5lUHJvbWlzZScpO1xudmFyIGNhY2hlRW5naW5lQ0JfMSA9IHJlcXVpcmUoJy4vY2FjaGVFbmdpbmUvY2FjaGVFbmdpbmVDQicpO1xudmFyIGluc3RhbmNlXzEgPSByZXF1aXJlKCcuL2luc3RhbmNlJyk7XG52YXIgQ2FjaGVSdWxlc0NyZWF0b3JfMSA9IHJlcXVpcmUoJy4vcnVsZXMvQ2FjaGVSdWxlc0NyZWF0b3InKTtcbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIENhY2hlRW5naW5lUHJvbWlzZTogY2FjaGVFbmdpbmVQcm9taXNlXzEuZGVmYXVsdCxcbiAgICBDYWNoZUVuZ2luZUNCOiBjYWNoZUVuZ2luZUNCXzEuZGVmYXVsdCxcbiAgICBJbnN0YW5jZTogaW5zdGFuY2VfMS5kZWZhdWx0LFxuICAgIENhY2hlQ3JlYXRvcjogQ2FjaGVSdWxlc0NyZWF0b3JfMS5kZWZhdWx0XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi90cy9pbmRleC50c1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIGVzNl9wcm9taXNlXzEgPSByZXF1aXJlKCdlczYtcHJvbWlzZScpO1xudmFyIGhlbHBlcnNfMSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMnKTtcbnZhciBkYnVnID0gcmVxdWlyZSgnZGVidWcnKTtcbnZhciBjYWNoZV8xID0gcmVxdWlyZSgnLi9jYWNoZScpO1xudmFyIENhY2hlRW5naW5lXzEgPSByZXF1aXJlKFwiLi9DYWNoZUVuZ2luZVwiKTtcbnZhciBpbnN0YW5jZVByb21pc2VfMSA9IHJlcXVpcmUoXCIuLi9yZWRpcy9pbnN0YW5jZVByb21pc2VcIik7XG52YXIgZGVidWcgPSBkYnVnKCdyZWRpcy11cmwtY2FjaGUnKTtcbnZhciBDYWNoZUVuZ2luZVByb21pc2UgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhDYWNoZUVuZ2luZVByb21pc2UsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQ2FjaGVFbmdpbmVQcm9taXNlKGRlZmF1bHREb21haW4sIGluc3RhbmNlKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIGRlZmF1bHREb21haW4sIGluc3RhbmNlKTtcbiAgICAgICAgdGhpcy5zdG9yYWdlSW5zdGFuY2UgPSBuZXcgaW5zdGFuY2VQcm9taXNlXzEuZGVmYXVsdChpbnN0YW5jZSk7XG4gICAgfVxuICAgIENhY2hlRW5naW5lUHJvbWlzZS5wcm90b3R5cGUuY2xlYXJEb21haW4gPSBmdW5jdGlvbiAoZG9tYWluKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICh0eXBlb2YgZG9tYWluID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgZG9tYWluID0gdGhpcy5kZWZhdWx0RG9tYWluO1xuICAgICAgICB9XG4gICAgICAgIGhlbHBlcnNfMS5kZWZhdWx0LmlzU3RyaW5nRGVmaW5lZChkb21haW4pO1xuICAgICAgICByZXR1cm4gbmV3IGVzNl9wcm9taXNlXzEuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBfdGhpcy5zdG9yYWdlSW5zdGFuY2UuY2xlYXJEb21haW4oZG9tYWluKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgQ2FjaGVFbmdpbmVQcm9taXNlLnByb3RvdHlwZS5jbGVhckluc3RhbmNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IGVzNl9wcm9taXNlXzEuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBfdGhpcy5zdG9yYWdlSW5zdGFuY2UuY2xlYXJDYWNoZSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBDYWNoZUVuZ2luZVByb21pc2UucHJvdG90eXBlLmdldFN0b3JlZEhvc3RuYW1lcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBlczZfcHJvbWlzZV8xLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgX3RoaXMuc3RvcmFnZUluc3RhbmNlLmdldENhY2hlZERvbWFpbnMoKS50aGVuKGZ1bmN0aW9uIChkb21haW5zKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkb21haW5zKTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIENhY2hlRW5naW5lUHJvbWlzZS5wcm90b3R5cGUuZ2V0U3RvcmVkVVJMcyA9IGZ1bmN0aW9uIChkb21haW4pIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHR5cGVvZiBkb21haW4gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBkb21haW4gPSB0aGlzLmRlZmF1bHREb21haW47XG4gICAgICAgIH1cbiAgICAgICAgaGVscGVyc18xLmRlZmF1bHQuaXNTdHJpbmdEZWZpbmVkKGRvbWFpbik7XG4gICAgICAgIHJldHVybiBuZXcgZXM2X3Byb21pc2VfMS5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIF90aGlzLnN0b3JhZ2VJbnN0YW5jZS5nZXRDYWNoZWRVUkxzKGRvbWFpbikudGhlbihmdW5jdGlvbiAodXJscykge1xuICAgICAgICAgICAgICAgIHJlc29sdmUodXJscyk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBDYWNoZUVuZ2luZVByb21pc2UucHJvdG90eXBlLnVybCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgdmFyIHBhcnNlZFVSTCA9IGhlbHBlcnNfMS5kZWZhdWx0LnBhcnNlVVJMKHVybCk7XG4gICAgICAgIGlmIChwYXJzZWRVUkwuZG9tYWluLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcGFyc2VkVVJMLmRvbWFpbiA9IHRoaXMuZGVmYXVsdERvbWFpbjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY2FjaGUgPSBuZXcgY2FjaGVfMS5VcmxQcm9taXNlKHBhcnNlZFVSTC5kb21haW4sIHRoaXMuc3RvcmFnZUluc3RhbmNlLCB0aGlzLmluc3RhbmNlTmFtZSwgcGFyc2VkVVJMLnJlbGF0aXZlVVJMKTtcbiAgICAgICAgdGhpcy5hZGRVcmwoY2FjaGUpO1xuICAgICAgICByZXR1cm4gY2FjaGU7XG4gICAgfTtcbiAgICByZXR1cm4gQ2FjaGVFbmdpbmVQcm9taXNlO1xufShDYWNoZUVuZ2luZV8xLmRlZmF1bHQpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IENhY2hlRW5naW5lUHJvbWlzZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdHMvY2FjaGVFbmdpbmUvY2FjaGVFbmdpbmVQcm9taXNlLnRzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVzNi1wcm9taXNlXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiZXM2LXByb21pc2VcIlxuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBub2RldXJsID0gcmVxdWlyZSgndXJsJyk7XG52YXIgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdyZWRpcy11cmwtY2FjaGUnKTtcbnZhciBIZWxwZXJzID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBIZWxwZXJzKCkge1xuICAgIH1cbiAgICBIZWxwZXJzLnVuc2VyaWFsaXplUmVnZXggPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0dPaW5nIHRvIHVuc2VyaWFsaXplIHJlZ2V4JywgaW5wdXQpO1xuICAgICAgICB2YXIgbWF0Y2ggPSBpbnB1dC5tYXRjaChuZXcgUmVnRXhwKCdeLyguKj8pLyhbZ2lteV0qKSQnKSk7XG4gICAgICAgIGNvbnNvbGUubG9nKG1hdGNoWzBdLCBtYXRjaFsxXSwgbWF0Y2hbMl0pO1xuICAgICAgICBpZiAobWF0Y2gubGVuZ3RoID09PSAzICYmIHR5cGVvZiBtYXRjaFsxXSA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIG1hdGNoWzJdID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAobWF0Y2hbMV0sIG1hdGNoWzJdKTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSByZWdleCBzdHJpbmcgaXMgbm90IGEgdmFsaWQgcmVnZXg6ICcgKyBpbnB1dCk7XG4gICAgfTtcbiAgICBIZWxwZXJzLnVuc2VyaWFsaXplQ2FjaGVSdWxlcyA9IGZ1bmN0aW9uIChydWxlcykge1xuICAgICAgICB2YXIgaW5kZXgsIHJ1bGVJbmRleCwgZG9tYWluLCByZWdleDtcbiAgICAgICAgdmFyIHR5cGVzID0gWydhbHdheXMnLCAnbmV2ZXInLCAnbWF4QWdlJ107XG4gICAgICAgIHR5cGVzLmZvckVhY2goZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgICAgICAgIGZvciAoaW5kZXggaW4gcnVsZXNbdHlwZV0pIHtcbiAgICAgICAgICAgICAgICBydWxlc1t0eXBlXVtpbmRleF0uZG9tYWluID0gSGVscGVycy51bnNlcmlhbGl6ZVJlZ2V4KHJ1bGVzW3R5cGVdW2luZGV4XS5kb21haW4pO1xuICAgICAgICAgICAgICAgIGZvciAocnVsZUluZGV4IGluIHJ1bGVzW3R5cGVdW2luZGV4XS5ydWxlcykge1xuICAgICAgICAgICAgICAgICAgICByZWdleCA9IEhlbHBlcnMudW5zZXJpYWxpemVSZWdleChydWxlc1t0eXBlXVtpbmRleF0ucnVsZXNbcnVsZUluZGV4XS5yZWdleCk7XG4gICAgICAgICAgICAgICAgICAgIHJ1bGVzW3R5cGVdW2luZGV4XS5ydWxlc1tydWxlSW5kZXhdLnJlZ2V4ID0gcmVnZXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJ1bGVzO1xuICAgIH07XG4gICAgSGVscGVycy5pc1JlZGlzID0gZnVuY3Rpb24gKHN0b3JhZ2VDb25maWcpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBzdG9yYWdlQ29uZmlnLmhvc3QgIT09ICd1bmRlZmluZWQnO1xuICAgIH07XG4gICAgSGVscGVycy5pc1N0cmluZ0RlZmluZWQgPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycgfHwgaW5wdXQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBIZWxwZXJzLmludmFsaWRQYXJhbWV0ZXJFcnJvcigndGhpcyBzaG91bGQgYmUgYSBub24gZW1wdHkgc3RyaW5nJywgaW5wdXQpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBIZWxwZXJzLmlzU3RyaW5nSW4gPSBmdW5jdGlvbiAoaW5wdXQsIHZhbHVlcykge1xuICAgICAgICBpZiAodHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciB2YWxpZCA9IGZhbHNlO1xuICAgICAgICB2YWx1ZXMuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gaW5wdXQpIHtcbiAgICAgICAgICAgICAgICB2YWxpZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIXZhbGlkKSB7XG4gICAgICAgICAgICBIZWxwZXJzLmludmFsaWRQYXJhbWV0ZXJFcnJvcignVGhpcyBzdHJpbmcgc2hvdWxkIGNvbnRhaW4gb25seSB0aGVzZSB2YWx1ZXMgOiAnICsgdmFsdWVzLmpvaW4oJywgJyksIGlucHV0KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgSGVscGVycy5wYXJzZVVSTCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgSGVscGVycy5pc1N0cmluZ0RlZmluZWQodXJsKTtcbiAgICAgICAgdmFyIHBhcnNlZFVSTCA9IG5vZGV1cmwucGFyc2UodXJsKTtcbiAgICAgICAgdmFyIHJlbGF0aXZlVVJMID0gcGFyc2VkVVJMLnBhdGg7XG4gICAgICAgIGlmICghL1xcLy8udGVzdChyZWxhdGl2ZVVSTCkpIHtcbiAgICAgICAgICAgIHJlbGF0aXZlVVJMID0gJy8nICsgcmVsYXRpdmVVUkw7XG4gICAgICAgIH1cbiAgICAgICAgcGFyc2VkVVJMLnBhdGhuYW1lID0gbnVsbDtcbiAgICAgICAgcGFyc2VkVVJMLnBhdGggPSBudWxsO1xuICAgICAgICBwYXJzZWRVUkwuaGFzaCA9IG51bGw7XG4gICAgICAgIHBhcnNlZFVSTC5xdWVyeSA9IG51bGw7XG4gICAgICAgIHBhcnNlZFVSTC5zZWFyY2ggPSBudWxsO1xuICAgICAgICB2YXIgZG9tYWluID0gbm9kZXVybC5mb3JtYXQocGFyc2VkVVJMKTtcbiAgICAgICAgZGVidWcoJ3BhcnNlVVJMIHJlc3VsdDogJywgZG9tYWluLCByZWxhdGl2ZVVSTCk7XG4gICAgICAgIGlmIChkb21haW4gPT09IHJlbGF0aXZlVVJMKSB7XG4gICAgICAgICAgICBIZWxwZXJzLmludmFsaWRQYXJhbWV0ZXJFcnJvcignaW52YWxpZCBVUkwgJywgdXJsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZG9tYWluOiBkb21haW4sXG4gICAgICAgICAgICByZWxhdGl2ZVVSTDogcmVsYXRpdmVVUkxcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIEhlbHBlcnMuaXNOb3RVbmRlZmluZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpbnB1dCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgaW5wdXRbX2kgLSAwXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlucHV0Lmxlbmd0aCA9IDApIHtcbiAgICAgICAgICAgIEhlbHBlcnMuaW52YWxpZFBhcmFtZXRlckVycm9yKCdObyBwYXJhbWV0ZXJzIHJlcXVpcmVkJywgaW5wdXQpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgaW4gaW5wdXQpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgSGVscGVycy5pbnZhbGlkUGFyYW1ldGVyRXJyb3IoJ1VuZGVmaW5lZCBwYXJhbWV0ZXIgcHJvdmlkZWQgYXQgaW5kZXggJywgaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEhlbHBlcnMuaXNBcnJheSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGlmICgoZGF0YSBpbnN0YW5jZW9mIEFycmF5KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIEhlbHBlcnMuaW52YWxpZFBhcmFtZXRlckVycm9yKCdUaGlzIHNob3VsZCBiZSBhbiBhcnJheScsIGRhdGEpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBIZWxwZXJzLmhhc01heEFnZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZGF0YS5tYXhBZ2UgIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBIZWxwZXJzLmludmFsaWRQYXJhbWV0ZXJFcnJvcignVGhpcyBydWxlIG1pc3NlcyBhIG1heEFnZSBwcm9wZXJ0eScsIGRhdGEpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBIZWxwZXJzLmlzQm9vbGVhbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZGF0YSAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICBIZWxwZXJzLmludmFsaWRQYXJhbWV0ZXJFcnJvcignVGhpcyBpcyBub3QgYSBib29sZWFuIHByb2JhYmx5IHRoZSBmb3JjZSBwYXJhbSBtaXNzaW5nJywgZGF0YSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEhlbHBlcnMuaXNPcHRpb25hbEJvb2xlYW4gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBpZiAodHlwZW9mIGRhdGEgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBkYXRhICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIEhlbHBlcnMuaW52YWxpZFBhcmFtZXRlckVycm9yKCdZb3UgcHJvdmlkZWQgYW4gb3B0aW9uYWwgYm9vbGVhbiBidXQgdGhpcyBpcyBub3QgYSBib29sZWFuJywgZGF0YSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEhlbHBlcnMuU2FtZVJlZ2V4ID0gZnVuY3Rpb24gKHIxLCByMikge1xuICAgICAgICBpZiAocjEgaW5zdGFuY2VvZiBSZWdFeHAgJiYgcjIgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICAgIHZhciBwcm9wcyA9IFtcImdsb2JhbFwiLCBcIm11bHRpbGluZVwiLCBcImlnbm9yZUNhc2VcIiwgXCJzb3VyY2VcIl07XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHByb3AgPSBwcm9wc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAocjFbcHJvcF0gIT09IHIyW3Byb3BdKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICBIZWxwZXJzLmlzTWF4QWdlUmVnZXhSdWxlID0gZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICAgICAgSGVscGVycy5pc0NvbmZpZ1JlZ2V4UnVsZShydWxlKTtcbiAgICAgICAgaWYgKHR5cGVvZiBydWxlLm1heEFnZSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIEhlbHBlcnMuaW52YWxpZFBhcmFtZXRlckVycm9yKCdUaGlzIGlzbnQgYSB2YWxpZCBNYXhBZ2UgUmVnZXhSdWxlIC0gb25lIG9mIHRoZSBydWxlIG1pc3NlcyBtYXhBZ2UgcHJvcCcsIHJ1bGUpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBIZWxwZXJzLmlzQ29uZmlnUmVnZXhSdWxlID0gZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICAgICAgaWYgKChydWxlLnJlZ2V4IGluc3RhbmNlb2YgUmVnRXhwKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIEhlbHBlcnMuaW52YWxpZFBhcmFtZXRlckVycm9yKCdUaGlzIGlzbnQgYSB2YWxpZCBSZWdleFJ1bGUgLSB0aGUgcnVsZSBpcyBub3QgYSByZWdleCcsIHJ1bGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgcnVsZS5pZ25vcmVRdWVyeSAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICBIZWxwZXJzLmludmFsaWRQYXJhbWV0ZXJFcnJvcignVGhpcyBpc250IGEgdmFsaWQgUmVnZXhSdWxlIC0gdGhlIHJ1bGUgbWlzc2VzIGlnbm9yZVF1ZXJ5IHByb3AnLCBydWxlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgSGVscGVycy52YWxpZGF0ZUNhY2hlQ29uZmlnID0gZnVuY3Rpb24gKGNhY2hlUnVsZXMpIHtcbiAgICAgICAgSGVscGVycy5pc1N0cmluZ0luKGNhY2hlUnVsZXMuZGVmYXVsdCwgWydhbHdheXMnLCAnbmV2ZXInXSk7XG4gICAgICAgIEhlbHBlcnMuaXNOb3RVbmRlZmluZWQoY2FjaGVSdWxlcy5tYXhBZ2UsIGNhY2hlUnVsZXMuYWx3YXlzLCBjYWNoZVJ1bGVzLm5ldmVyKTtcbiAgICAgICAgWydhbHdheXMnLCAnbmV2ZXInLCAnbWF4QWdlJ10uZm9yRWFjaChmdW5jdGlvbiAodHlwZSkge1xuICAgICAgICAgICAgSGVscGVycy5pc0FycmF5KGNhY2hlUnVsZXNbdHlwZV0pO1xuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGNhY2hlUnVsZXNbdHlwZV0pIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhY2hlUnVsZXNbdHlwZV1ba2V5XS5kb21haW4gIT09ICdzdHJpbmcnICYmIChjYWNoZVJ1bGVzW3R5cGVdW2tleV0uZG9tYWluIGluc3RhbmNlb2YgUmVnRXhwKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgSGVscGVycy5pbnZhbGlkUGFyYW1ldGVyRXJyb3IoJ0RvbWFpbiBtdXN0IGJlIGVpdGhlciBhIHJlZ2V4IG9yIGEgc3RyaW5nJywgY2FjaGVSdWxlc1t0eXBlXVtrZXldLmRvbWFpbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIEhlbHBlcnMuaXNBcnJheShjYWNoZVJ1bGVzW3R5cGVdW2tleV0ucnVsZXMpO1xuICAgICAgICAgICAgICAgIGNhY2hlUnVsZXNbdHlwZV1ba2V5XS5ydWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSAnbWF4QWdlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgSGVscGVycy5pc01heEFnZVJlZ2V4UnVsZShydWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEhlbHBlcnMuaXNDb25maWdSZWdleFJ1bGUocnVsZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBIZWxwZXJzLkpTT05SZWdFeHBSZXBsYWNlciA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAgICAgcmV0dXJuIChcIl9fUkVHRVhQIFwiICsgdmFsdWUudG9TdHJpbmcoKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEhlbHBlcnMuSlNPTlJlZ0V4cFJldml2ZXIgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUudG9TdHJpbmcoKS5pbmRleE9mKFwiX19SRUdFWFAgXCIpID09IDApIHtcbiAgICAgICAgICAgIHZhciBtID0gdmFsdWUuc3BsaXQoXCJfX1JFR0VYUCBcIilbMV0ubWF0Y2goL1xcLyguKilcXC8oLiopPy8pO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAobVsxXSwgbVsyXSB8fCBcIlwiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgSGVscGVycy5nZXRDb25maWdLZXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAndXJsLWNhY2hlOnJ1bGVjb25maWcnO1xuICAgIH07XG4gICAgSGVscGVycy52YWxpZGF0ZVJlZGlzU3RvcmFnZUNvbmZpZyA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIEhlbHBlcnMuaW52YWxpZFBhcmFtZXRlckVycm9yID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgcGFyYW1ldGVyOiAnICsgbmFtZSArICcuIFZhbHVlIHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcbiAgICB9O1xuICAgIEhlbHBlcnMuUmVkaXNFcnJvciA9IGZ1bmN0aW9uIChkZXNjcmlwdGlvbiwgbXNnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignUmVkaXM6ICcgKyBkZXNjcmlwdGlvbiArICcuIEVycm9yIHJlY2VpdmVkOiAnICsgbXNnKTtcbiAgICB9O1xuICAgIHJldHVybiBIZWxwZXJzO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IEhlbHBlcnM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3RzL2hlbHBlcnMudHNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXJsXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwidXJsXCJcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZGVidWdcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJkZWJ1Z1wiXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgaGVscGVyc18xID0gcmVxdWlyZSgnLi4vaGVscGVycycpO1xudmFyIGRlYnVnID0gcmVxdWlyZSgnZGVidWcnKSgncmVkaXMtdXJsLWNhY2hlJyk7XG52YXIgVXJsQ29tbW9uID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBVcmxDb21tb24oX2RvbWFpbiwgX3N0b3JhZ2VJbnN0YW5jZSwgX2luc3RhbmNlTmFtZSwgX3VybCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLl9kb21haW4gPSBfZG9tYWluO1xuICAgICAgICB0aGlzLl9pbnN0YW5jZU5hbWUgPSBfaW5zdGFuY2VOYW1lO1xuICAgICAgICB0aGlzLl91cmwgPSBfdXJsO1xuICAgICAgICB0aGlzLl9jYXRlZ29yeSA9ICcnO1xuICAgICAgICB0aGlzLl9tYXhBZ2UgPSAwO1xuICAgICAgICB0aGlzLmdldFJlZ2V4VGVzdCA9IGZ1bmN0aW9uICh1KSB7XG4gICAgICAgICAgICByZXR1cm4gdS5yZWdleC50ZXN0KF90aGlzLl91cmwpO1xuICAgICAgICB9O1xuICAgICAgICBpZiAodGhpcy5oYXNQcm9taXNlKF9zdG9yYWdlSW5zdGFuY2UpKSB7XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlUHJvbWlzZSA9IF9zdG9yYWdlSW5zdGFuY2U7XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlID0gX3N0b3JhZ2VJbnN0YW5jZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2VDQiA9IF9zdG9yYWdlSW5zdGFuY2U7XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlID0gX3N0b3JhZ2VJbnN0YW5jZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldENhY2hlQ2F0ZWdvcnkoKTtcbiAgICB9XG4gICAgVXJsQ29tbW9uLnByb3RvdHlwZS5oYXNQcm9taXNlID0gZnVuY3Rpb24gKHN0b3JhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHN0b3JhZ2UuZ2V0TWV0aG9kKCkgPT09ICdwcm9taXNlJztcbiAgICB9O1xuICAgIFVybENvbW1vbi5wcm90b3R5cGUuZ2V0RG9tYWluID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZG9tYWluO1xuICAgIH07XG4gICAgVXJsQ29tbW9uLnByb3RvdHlwZS5nZXRDYXRlZ29yeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhdGVnb3J5O1xuICAgIH07XG4gICAgVXJsQ29tbW9uLnByb3RvdHlwZS5nZXRJbnN0YW5jZU5hbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnN0YW5jZU5hbWU7XG4gICAgfTtcbiAgICBVcmxDb21tb24ucHJvdG90eXBlLmdldFVybCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VybDtcbiAgICB9O1xuICAgIFVybENvbW1vbi5wcm90b3R5cGUuZ2V0VFRMID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWF4QWdlO1xuICAgIH07XG4gICAgVXJsQ29tbW9uLnByb3RvdHlwZS5jaGVja0RvbWFpbiA9IGZ1bmN0aW9uIChzdG9yZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzdG9yZWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZG9tYWluLmluZGV4T2Yoc3RvcmVkKSAhPT0gLTE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gc3RvcmVkLnRlc3QodGhpcy5fZG9tYWluKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVXJsQ29tbW9uLnByb3RvdHlwZS5zZXRDYWNoZUNhdGVnb3J5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIga2V5LCBkb21haW4sIGk7XG4gICAgICAgIHZhciBjb25maWcgPSB0aGlzLl9zdG9yYWdlLmdldENhY2hlUnVsZXMoKTtcbiAgICAgICAgZGVidWcoJ2NvbmZpZyBsb2FkZWQ6ICcsIGNvbmZpZyk7XG4gICAgICAgIGZvciAoa2V5ID0gMDsga2V5IDwgY29uZmlnLm1heEFnZS5sZW5ndGg7IGtleSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0RvbWFpbihjb25maWcubWF4QWdlW2tleV0uZG9tYWluKSkge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb25maWcubWF4QWdlW2tleV0ucnVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0UmVnZXhUZXN0KGNvbmZpZy5tYXhBZ2Vba2V5XS5ydWxlc1tpXSkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhdGVnb3J5ID0gJ21heEFnZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tYXhBZ2UgPSBjb25maWcubWF4QWdlW2tleV0ucnVsZXNbaV0ubWF4QWdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoa2V5ID0gMDsga2V5IDwgY29uZmlnLmFsd2F5cy5sZW5ndGg7IGtleSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0RvbWFpbihjb25maWcuYWx3YXlzW2tleV0uZG9tYWluKSkge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb25maWcuYWx3YXlzW2tleV0ucnVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0UmVnZXhUZXN0KGNvbmZpZy5hbHdheXNba2V5XS5ydWxlc1tpXSkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhdGVnb3J5ID0gJ2Fsd2F5cyc7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChrZXkgPSAwOyBrZXkgPCBjb25maWcubmV2ZXIubGVuZ3RoOyBrZXkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tEb21haW4oY29uZmlnLm5ldmVyW2tleV0uZG9tYWluKSkge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb25maWcubmV2ZXJba2V5XS5ydWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRSZWdleFRlc3QoY29uZmlnLm5ldmVyW2tleV0ucnVsZXNbaV0pID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYXRlZ29yeSA9ICduZXZlcic7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY2F0ZWdvcnkgPSBjb25maWcuZGVmYXVsdDtcbiAgICB9O1xuICAgIDtcbiAgICByZXR1cm4gVXJsQ29tbW9uO1xufSgpKTtcbmV4cG9ydHMuVXJsQ29tbW9uID0gVXJsQ29tbW9uO1xudmFyIFVybFByb21pc2UgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhVcmxQcm9taXNlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFVybFByb21pc2UoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB0aGlzLmRlbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5fc3RvcmFnZVByb21pc2UuZGVsZXRlKF90aGlzLmdldERvbWFpbigpLCBfdGhpcy5nZXRVcmwoKSwgX3RoaXMuZ2V0Q2F0ZWdvcnkoKSwgX3RoaXMuZ2V0VFRMKCkpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5fc3RvcmFnZVByb21pc2UuZ2V0KF90aGlzLmdldERvbWFpbigpLCBfdGhpcy5nZXRVcmwoKSwgX3RoaXMuZ2V0Q2F0ZWdvcnkoKSwgX3RoaXMuZ2V0VFRMKCkpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmhhcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5fc3RvcmFnZVByb21pc2UuaGFzKF90aGlzLmdldERvbWFpbigpLCBfdGhpcy5nZXRVcmwoKSwgX3RoaXMuZ2V0Q2F0ZWdvcnkoKSwgX3RoaXMuZ2V0VFRMKCkpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNldCA9IGZ1bmN0aW9uIChjb250ZW50LCBleHRyYSwgZm9yY2UpIHtcbiAgICAgICAgICAgIGhlbHBlcnNfMS5kZWZhdWx0LmlzU3RyaW5nRGVmaW5lZChjb250ZW50KTtcbiAgICAgICAgICAgIGhlbHBlcnNfMS5kZWZhdWx0LmlzT3B0aW9uYWxCb29sZWFuKGZvcmNlKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZm9yY2UgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgZm9yY2UgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5fc3RvcmFnZVByb21pc2Uuc2V0KF90aGlzLmdldERvbWFpbigpLCBfdGhpcy5nZXRVcmwoKSwgY29udGVudCwgZXh0cmEsIF90aGlzLmdldENhdGVnb3J5KCksIF90aGlzLmdldFRUTCgpLCBmb3JjZSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBVcmxQcm9taXNlO1xufShVcmxDb21tb24pKTtcbmV4cG9ydHMuVXJsUHJvbWlzZSA9IFVybFByb21pc2U7XG52YXIgVXJsQ0IgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhVcmxDQiwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBVcmxDQigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMuZGVsZXRlID0gZnVuY3Rpb24gKGNiKSB7XG4gICAgICAgICAgICBfdGhpcy5fc3RvcmFnZUNCLmRlbGV0ZShfdGhpcy5nZXREb21haW4oKSwgX3RoaXMuZ2V0VXJsKCksIF90aGlzLmdldENhdGVnb3J5KCksIF90aGlzLmdldFRUTCgpLCBjYik7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0ID0gZnVuY3Rpb24gKGNiKSB7XG4gICAgICAgICAgICBfdGhpcy5fc3RvcmFnZUNCLmdldChfdGhpcy5nZXREb21haW4oKSwgX3RoaXMuZ2V0VXJsKCksIF90aGlzLmdldENhdGVnb3J5KCksIF90aGlzLmdldFRUTCgpLCBjYik7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaGFzID0gZnVuY3Rpb24gKGNiKSB7XG4gICAgICAgICAgICBfdGhpcy5fc3RvcmFnZUNCLmhhcyhfdGhpcy5nZXREb21haW4oKSwgX3RoaXMuZ2V0VXJsKCksIF90aGlzLmdldENhdGVnb3J5KCksIF90aGlzLmdldFRUTCgpLCBjYik7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2V0ID0gZnVuY3Rpb24gKGNvbnRlbnQsIGV4dHJhLCBmb3JjZSwgY2IpIHtcbiAgICAgICAgICAgIGhlbHBlcnNfMS5kZWZhdWx0LmlzU3RyaW5nRGVmaW5lZChjb250ZW50KTtcbiAgICAgICAgICAgIGhlbHBlcnNfMS5kZWZhdWx0LmlzQm9vbGVhbihmb3JjZSk7XG4gICAgICAgICAgICBfdGhpcy5fc3RvcmFnZUNCLnNldChfdGhpcy5nZXREb21haW4oKSwgX3RoaXMuZ2V0VXJsKCksIGNvbnRlbnQsIGV4dHJhLCBfdGhpcy5nZXRDYXRlZ29yeSgpLCBfdGhpcy5nZXRUVEwoKSwgZm9yY2UsIGNiKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIFVybENCO1xufShVcmxDb21tb24pKTtcbmV4cG9ydHMuVXJsQ0IgPSBVcmxDQjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdHMvY2FjaGVFbmdpbmUvY2FjaGUudHNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgaGVscGVyc18xID0gcmVxdWlyZShcIi4uL2hlbHBlcnNcIik7XG52YXIgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdyZWRpcy11cmwtY2FjaGUnKTtcbnZhciBDYWNoZUVuZ2luZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2FjaGVFbmdpbmUoZGVmYXVsdERvbWFpbiwgaW5zdGFuY2VEZWZpbml0aW9uKSB7XG4gICAgICAgIHRoaXMuZGVmYXVsdERvbWFpbiA9IGRlZmF1bHREb21haW47XG4gICAgICAgIHRoaXMuaW5zdGFuY2VEZWZpbml0aW9uID0gaW5zdGFuY2VEZWZpbml0aW9uO1xuICAgICAgICBoZWxwZXJzXzEuZGVmYXVsdC5pc05vdFVuZGVmaW5lZChkZWZhdWx0RG9tYWluLCBpbnN0YW5jZURlZmluaXRpb24pO1xuICAgICAgICBoZWxwZXJzXzEuZGVmYXVsdC5pc1N0cmluZ0RlZmluZWQoZGVmYXVsdERvbWFpbik7XG4gICAgICAgIGlmIChpbnN0YW5jZURlZmluaXRpb24uaXNJbnN0YW5jaWF0ZWQoKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHZhciBlcnJvck1zZyA9ICdUaGlzIGluc3RhbmNlIGhhc25cXCd0IGluaXRpYXRlZCBjb3JyZWN0bHk6ICcgKyBpbnN0YW5jZURlZmluaXRpb24uZ2V0SW5zdGFuY2VOYW1lKCk7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yTXNnKTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvck1zZyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbnN0YW5jZU5hbWUgPSBpbnN0YW5jZURlZmluaXRpb24uZ2V0SW5zdGFuY2VOYW1lKCk7XG4gICAgICAgIGlmIChpbnN0YW5jZURlZmluaXRpb24uZ2V0Q29uZmlnKCkub25fcHVibGlzaF91cGRhdGUgPT09IHRydWUgJiYgdHlwZW9mIENhY2hlRW5naW5lLnVybHNbdGhpcy5pbnN0YW5jZU5hbWVdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgQ2FjaGVFbmdpbmUudXJsc1t0aGlzLmluc3RhbmNlTmFtZV0gPSB7fTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBDYWNoZUVuZ2luZS51cGRhdGVBbGxVcmxDYXRlZ29yeSA9IGZ1bmN0aW9uIChpbnN0YW5jZU5hbWUpIHtcbiAgICAgICAgaGVscGVyc18xLmRlZmF1bHQuaXNTdHJpbmdEZWZpbmVkKGluc3RhbmNlTmFtZSk7XG4gICAgICAgIGlmICh0eXBlb2YgQ2FjaGVFbmdpbmUudXJsc1tpbnN0YW5jZU5hbWVdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdmFyIGtleSA9IHZvaWQgMDtcbiAgICAgICAgICAgIGZvciAoa2V5IGluIENhY2hlRW5naW5lLnVybHNbaW5zdGFuY2VOYW1lXSkge1xuICAgICAgICAgICAgICAgIENhY2hlRW5naW5lLnVybHNbaW5zdGFuY2VOYW1lXVtrZXldLnNldENhY2hlQ2F0ZWdvcnkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgQ2FjaGVFbmdpbmUucHJvdG90eXBlLmdldEluc3RhbmNlTmFtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2VOYW1lO1xuICAgIH07XG4gICAgQ2FjaGVFbmdpbmUucHJvdG90eXBlLmFkZFVybCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBDYWNoZUVuZ2luZS51cmxzW3RoaXMuaW5zdGFuY2VOYW1lXSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIENhY2hlRW5naW5lLnVybHNbdGhpcy5pbnN0YW5jZU5hbWVdW3RoaXMuYnVpbGRVUkxJbmRleCh1cmwpXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIENhY2hlRW5naW5lLnVybHNbdGhpcy5pbnN0YW5jZU5hbWVdW3RoaXMuYnVpbGRVUkxJbmRleCh1cmwpXSA9IHVybDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgQ2FjaGVFbmdpbmUucHJvdG90eXBlLmJ1aWxkVVJMSW5kZXggPSBmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlTmFtZSArICdfJyArIHVybC5nZXREb21haW4oKSArICdfJyArIHVybC5nZXRVcmwoKTtcbiAgICB9O1xuICAgIENhY2hlRW5naW5lLnVybHMgPSB7fTtcbiAgICBDYWNoZUVuZ2luZS5oZWxwZXJzID0ge1xuICAgICAgICB2YWxpZGF0ZVJlZGlzU3RvcmFnZUNvbmZpZzogaGVscGVyc18xLmRlZmF1bHQudmFsaWRhdGVSZWRpc1N0b3JhZ2VDb25maWcsXG4gICAgICAgIHZhbGlkYXRlQ2FjaGVDb25maWc6IGhlbHBlcnNfMS5kZWZhdWx0LnZhbGlkYXRlQ2FjaGVDb25maWcsXG4gICAgICAgIHVuc2VyaWFsaXplUmVnZXg6IGhlbHBlcnNfMS5kZWZhdWx0LnVuc2VyaWFsaXplUmVnZXgsXG4gICAgICAgIHVuc2VyaWFsaXplQ2FjaGVSdWxlczogaGVscGVyc18xLmRlZmF1bHQudW5zZXJpYWxpemVDYWNoZVJ1bGVzXG4gICAgfTtcbiAgICBDYWNoZUVuZ2luZS5oYXNoS2V5ID0gJ3VybC1jYWNoZTonO1xuICAgIHJldHVybiBDYWNoZUVuZ2luZTtcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDYWNoZUVuZ2luZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdHMvY2FjaGVFbmdpbmUvQ2FjaGVFbmdpbmUudHNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBkZWJnID0gcmVxdWlyZSgnZGVidWcnKTtcbnZhciBlczZfcHJvbWlzZV8xID0gcmVxdWlyZSgnZXM2LXByb21pc2UnKTtcbnZhciBpbnN0YW5jZUNCXzEgPSByZXF1aXJlKFwiLi9pbnN0YW5jZUNCXCIpO1xudmFyIHN0b3JhZ2VfMSA9IHJlcXVpcmUoXCIuLi9hYnN0cmFjdC9zdG9yYWdlXCIpO1xudmFyIGRlYnVnID0gZGViZygncmVkaXMtdXJsLWNhY2hlLVJFRElTJyk7XG52YXIgUmVkaXNTdG9yYWdlUHJvbWlzZSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFJlZGlzU3RvcmFnZVByb21pc2UsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gUmVkaXNTdG9yYWdlUHJvbWlzZShpbnN0YW5jZSkge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgdGhpcy5pbnN0YW5jZSA9IGluc3RhbmNlO1xuICAgICAgICB0aGlzLmhhc2hLZXkgPSAncmVkaXMtdXJsLWNhY2hlOicgKyBpbnN0YW5jZS5nZXRJbnN0YW5jZU5hbWUoKTtcbiAgICAgICAgdGhpcy5jYkluc3RhbmNlID0gbmV3IGluc3RhbmNlQ0JfMS5kZWZhdWx0KGluc3RhbmNlKTtcbiAgICAgICAgdGhpcy5tZXRob2QgPSAncHJvbWlzZSc7XG4gICAgfVxuICAgIFJlZGlzU3RvcmFnZVByb21pc2UucHJvdG90eXBlLmdldENhY2hlUnVsZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlLmdldE1hbmFnZXIoKS5nZXRSdWxlcygpO1xuICAgIH07XG4gICAgUmVkaXNTdG9yYWdlUHJvbWlzZS5wcm90b3R5cGUuY2xlYXJDYWNoZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBlczZfcHJvbWlzZV8xLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgX3RoaXMuY2JJbnN0YW5jZS5jbGVhckNhY2hlKGZ1bmN0aW9uIChlcnIsIHJlc3VsdHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlYnVnKGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBSZWRpc1N0b3JhZ2VQcm9taXNlLnByb3RvdHlwZS5jbGVhckRvbWFpbiA9IGZ1bmN0aW9uIChkb21haW4pIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBlczZfcHJvbWlzZV8xLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgX3RoaXMuY2JJbnN0YW5jZS5jbGVhckRvbWFpbihkb21haW4sIGZ1bmN0aW9uIChlcnIsIHJlc3VsdHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlYnVnKGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBSZWRpc1N0b3JhZ2VQcm9taXNlLnByb3RvdHlwZS5nZXRDYWNoZWREb21haW5zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IGVzNl9wcm9taXNlXzEuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBfdGhpcy5jYkluc3RhbmNlLmdldENhY2hlZERvbWFpbnMoZnVuY3Rpb24gKGVyciwgcmVzdWx0cykge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFJlZGlzU3RvcmFnZVByb21pc2UucHJvdG90eXBlLmdldENhY2hlZFVSTHMgPSBmdW5jdGlvbiAoZG9tYWluKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgZXM2X3Byb21pc2VfMS5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIF90aGlzLmNiSW5zdGFuY2UuZ2V0Q2FjaGVkVVJMcyhkb21haW4sIGZ1bmN0aW9uIChlcnIsIHJlc3VsdHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlYnVnKGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBSZWRpc1N0b3JhZ2VQcm9taXNlLnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbiAoZG9tYWluLCB1cmwsIGNhdGVnb3J5LCB0dGwpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBlczZfcHJvbWlzZV8xLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgX3RoaXMuY2JJbnN0YW5jZS5kZWxldGUoZG9tYWluLCB1cmwsIGNhdGVnb3J5LCB0dGwsIGZ1bmN0aW9uIChlcnIsIHJlc3VsdHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBSZWRpc1N0b3JhZ2VQcm9taXNlLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNiSW5zdGFuY2UuZGVzdHJveSgpO1xuICAgIH07XG4gICAgUmVkaXNTdG9yYWdlUHJvbWlzZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGRvbWFpbiwgdXJsLCBjYXRlZ29yeSwgdHRsKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgZXM2X3Byb21pc2VfMS5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIF90aGlzLmNiSW5zdGFuY2UuZ2V0KGRvbWFpbiwgdXJsLCBjYXRlZ29yeSwgdHRsLCBmdW5jdGlvbiAoZXJyLCByZXN1bHRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICBkZWJ1ZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgUmVkaXNTdG9yYWdlUHJvbWlzZS5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gKGRvbWFpbiwgdXJsLCBjYXRlZ29yeSwgdHRsKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgZXM2X3Byb21pc2VfMS5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIF90aGlzLmNiSW5zdGFuY2UuaGFzKGRvbWFpbiwgdXJsLCBjYXRlZ29yeSwgdHRsLCBmdW5jdGlvbiAoZXJyLCByZXN1bHRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICBkZWJ1ZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgUmVkaXNTdG9yYWdlUHJvbWlzZS5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGRvbWFpbiwgdXJsLCB2YWx1ZSwgZXh0cmEsIGNhdGVnb3J5LCB0dGwsIGZvcmNlKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgZXM2X3Byb21pc2VfMS5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIF90aGlzLmNiSW5zdGFuY2Uuc2V0KGRvbWFpbiwgdXJsLCB2YWx1ZSwgZXh0cmEsIGNhdGVnb3J5LCB0dGwsIGZvcmNlLCBmdW5jdGlvbiAoZXJyLCByZXN1bHRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICBkZWJ1ZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIFJlZGlzU3RvcmFnZVByb21pc2U7XG59KHN0b3JhZ2VfMS5TdG9yYWdlUHJvbWlzZSkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gUmVkaXNTdG9yYWdlUHJvbWlzZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdHMvcmVkaXMvaW5zdGFuY2VQcm9taXNlLnRzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgcG9vbF8xID0gcmVxdWlyZSgnLi9wb29sJyk7XG52YXIgZGViZyA9IHJlcXVpcmUoJ2RlYnVnJyk7XG52YXIgQ2FjaGVFbmdpbmVfMSA9IHJlcXVpcmUoXCIuLi9jYWNoZUVuZ2luZS9DYWNoZUVuZ2luZVwiKTtcbnZhciBzdG9yYWdlXzEgPSByZXF1aXJlKFwiLi4vYWJzdHJhY3Qvc3RvcmFnZVwiKTtcbnZhciBkZWJ1ZyA9IGRlYmcoJ3JlZGlzLXVybC1jYWNoZS1SRURJUycpO1xudmFyIFJlZGlzU3RvcmFnZUNCID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoUmVkaXNTdG9yYWdlQ0IsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gUmVkaXNTdG9yYWdlQ0IoaW5zdGFuY2UpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgIHRoaXMuaW5zdGFuY2UgPSBpbnN0YW5jZTtcbiAgICAgICAgdGhpcy5fY29ubiA9IHBvb2xfMS5SZWRpc1Bvb2wuZ2V0Q29ubmVjdGlvbihpbnN0YW5jZS5nZXRJbnN0YW5jZU5hbWUoKSk7XG4gICAgICAgIHRoaXMuaGFzaEtleSA9IENhY2hlRW5naW5lXzEuZGVmYXVsdC5oYXNoS2V5ICsgdGhpcy5pbnN0YW5jZS5nZXRJbnN0YW5jZU5hbWUoKTtcbiAgICAgICAgdGhpcy5tZXRob2QgPSAnY2FsbGJhY2snO1xuICAgIH1cbiAgICBSZWRpc1N0b3JhZ2VDQi5wcm90b3R5cGUuY2xlYXJDYWNoZSA9IGZ1bmN0aW9uIChjYikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgYmF0Y2ggPSB0aGlzLl9jb25uLmJhdGNoKCk7XG4gICAgICAgIHRoaXMuX2Nvbm4uaGtleXModGhpcy5oYXNoS2V5LCBmdW5jdGlvbiAoZXJyLCBkb21haW5zKSB7XG4gICAgICAgICAgICBkZWJ1ZyhlcnIpO1xuICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgIGlmIChkb21haW5zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYihudWxsLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBuYiA9IDA7XG4gICAgICAgICAgICBkb21haW5zLmZvckVhY2goZnVuY3Rpb24gKGRvbWFpbikge1xuICAgICAgICAgICAgICAgIGJhdGNoLmRlbChfdGhpcy5nZXREb21haW5IYXNoS2V5KGRvbWFpbikpO1xuICAgICAgICAgICAgICAgIGJhdGNoLmhkZWwoX3RoaXMuaGFzaEtleSwgZG9tYWluKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5fY29ubi5oa2V5cyhfdGhpcy5nZXREb21haW5IYXNoS2V5KGRvbWFpbiksIGZ1bmN0aW9uIChlcnIsIGtleXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoJ2tleXMgPSAnLCBrZXlzKTtcbiAgICAgICAgICAgICAgICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhdGNoLmRlbChfdGhpcy5nZXRVcmxLZXkoZG9tYWluLCBrZXkpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIG5iKys7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuYiA9PT0gZG9tYWlucy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhdGNoLmV4ZWMoZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFJlZGlzU3RvcmFnZUNCLnByb3RvdHlwZS5jbGVhckRvbWFpbiA9IGZ1bmN0aW9uIChkb21haW4sIGNiKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuX2Nvbm4uaGRlbCh0aGlzLmhhc2hLZXksIGRvbWFpbiwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgIF90aGlzLl9jb25uLmhrZXlzKF90aGlzLmdldERvbWFpbkhhc2hLZXkoZG9tYWluKSwgZnVuY3Rpb24gKGVyciwgdXJscykge1xuICAgICAgICAgICAgICAgIGlmICh1cmxzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBuYiA9IDA7XG4gICAgICAgICAgICAgICAgdXJscy5mb3JFYWNoKGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZGVsZXRlKGRvbWFpbiwgdXJsLCBudWxsLCBudWxsLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmIrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuYiA9PT0gdXJscy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYihudWxsLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBSZWRpc1N0b3JhZ2VDQi5wcm90b3R5cGUuZ2V0Q2FjaGVkRG9tYWlucyA9IGZ1bmN0aW9uIChjYikge1xuICAgICAgICB0aGlzLl9jb25uLmhrZXlzKHRoaXMuaGFzaEtleSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0cykge1xuICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgIHJldHVybiBjYihudWxsLCByZXN1bHRzKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBSZWRpc1N0b3JhZ2VDQi5wcm90b3R5cGUuZ2V0Q2FjaGVkVVJMcyA9IGZ1bmN0aW9uIChkb21haW4sIGNiKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBjYWNoZWRVcmxzID0gW107XG4gICAgICAgIHRoaXMuX2Nvbm4uaGtleXModGhpcy5nZXREb21haW5IYXNoS2V5KGRvbWFpbiksIGZ1bmN0aW9uIChlcnIsIHVybHMpIHtcbiAgICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICBpZiAodXJscy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgY2FjaGVkVXJscyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbmIgPSAwO1xuICAgICAgICAgICAgdXJscy5mb3JFYWNoKGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5fY29ubi5nZXQoX3RoaXMuZ2V0VXJsS2V5KGRvbWFpbiwgdXJsKSwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZWRVcmxzLnB1c2godXJsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5iKys7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmIgPT09IHVybHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwsIGNhY2hlZFVybHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2Nvbm4uaGRlbChfdGhpcy5nZXREb21haW5IYXNoS2V5KGRvbWFpbiksIHVybCwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5iKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5iID09PSB1cmxzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgY2FjaGVkVXJscyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFJlZGlzU3RvcmFnZUNCLnByb3RvdHlwZS5nZXRDYWNoZVJ1bGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZS5nZXRNYW5hZ2VyKCkuZ2V0UnVsZXMoKTtcbiAgICB9O1xuICAgIFJlZGlzU3RvcmFnZUNCLnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbiAoZG9tYWluLCB1cmwsIGNhdGVnb3J5LCB0dGwsIGNiKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuaGFzKGRvbWFpbiwgdXJsLCBjYXRlZ29yeSwgdHRsLCBmdW5jdGlvbiAoZXJyLCBpc0NhY2hlZCkge1xuICAgICAgICAgICAgaWYgKCFpc0NhY2hlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYigndXJsIGlzIG5vdCBjYWNoZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIF90aGlzLl9jb25uLmRlbChfdGhpcy5nZXRVcmxLZXkoZG9tYWluLCB1cmwpLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9jb25uLmhkZWwoX3RoaXMuZ2V0RG9tYWluSGFzaEtleShkb21haW4pLCB1cmwsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihudWxsLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgUmVkaXNTdG9yYWdlQ0IucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHBvb2xfMS5SZWRpc1Bvb2wua2lsbCh0aGlzLmluc3RhbmNlLmdldEluc3RhbmNlTmFtZSgpKTtcbiAgICB9O1xuICAgIFJlZGlzU3RvcmFnZUNCLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoZG9tYWluLCB1cmwsIGNhdGVnb3J5LCB0dGwsIGNiKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuX2Nvbm4uaGdldCh0aGlzLmdldERvbWFpbkhhc2hLZXkoZG9tYWluKSwgdXJsLCBmdW5jdGlvbiAoZXJyLCBjb250ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXJyKVxuICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgaWYgKGNvbnRlbnQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IoJ3VybCBub3QgY2FjaGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy5fY29ubi5nZXQoX3RoaXMuZ2V0VXJsS2V5KGRvbWFpbiwgdXJsKSwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9jb25uLmhkZWwoX3RoaXMuZ2V0RG9tYWluSGFzaEtleShkb21haW4pLCBfdGhpcy5nZXRVcmxLZXkoZG9tYWluLCB1cmwpLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKCd1cmwgbm90IGNhY2hlZCAtIGNsZWFuaW5nIHRpbWVzdGFtcCBpbmZvcm1hdGlvbnMnKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGVzZXJpYWxpemVkQ29udGVudCA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihudWxsLCB7IGNvbnRlbnQ6IGNvbnRlbnQsIGNyZWF0ZWRPbjogZGVzZXJpYWxpemVkQ29udGVudC50aW1lc3RhbXAsIGV4dHJhOiBkZXNlcmlhbGl6ZWRDb250ZW50LmV4dHJhIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFJlZGlzU3RvcmFnZUNCLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiAoZG9tYWluLCB1cmwsIGNhdGVnb3J5LCB0dGwsIGNiKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuX2Nvbm4uZ2V0KHRoaXMuZ2V0VXJsS2V5KGRvbWFpbiwgdXJsKSwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGRlYnVnKCdFcnJvciB3aGlsZSBxdWVyeWluZyBpcyBjYWNoZWQgb24gcmVkaXM6ICcsIGRvbWFpbiwgdXJsLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGlzQ2FjaGVkID0gZGF0YSAhPT0gbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAoIWlzQ2FjaGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9jb25uLmhkZWwoX3RoaXMuZ2V0RG9tYWluSGFzaEtleShkb21haW4pLCB1cmwsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihudWxsLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgUmVkaXNTdG9yYWdlQ0IucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChkb21haW4sIHVybCwgdmFsdWUsIGV4dHJhLCBjYXRlZ29yeSwgdHRsLCBmb3JjZSwgY2IpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKGZvcmNlID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlKGRvbWFpbiwgdXJsLCB2YWx1ZSwgZXh0cmEsIHR0bCwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwsIHJlc3VsdCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjYXRlZ29yeSA9PT0gJ25ldmVyJykge1xuICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaGFzKGRvbWFpbiwgdXJsLCBjYXRlZ29yeSwgdHRsLCBmdW5jdGlvbiAoZXJyLCBoYXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgICAgICBpZiAoaGFzID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihudWxsLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5zdG9yZShkb21haW4sIHVybCwgdmFsdWUsIGV4dHJhLCB0dGwsIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihudWxsLCByZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgO1xuICAgIFJlZGlzU3RvcmFnZUNCLnByb3RvdHlwZS5nZXREb21haW5IYXNoS2V5ID0gZnVuY3Rpb24gKGRvbWFpbikge1xuICAgICAgICByZXR1cm4gdGhpcy5oYXNoS2V5ICsgJzonICsgZG9tYWluO1xuICAgIH07XG4gICAgUmVkaXNTdG9yYWdlQ0IucHJvdG90eXBlLnN0b3JlID0gZnVuY3Rpb24gKGRvbWFpbiwgdXJsLCB2YWx1ZSwgZXh0cmEsIHR0bCwgY2IpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5fY29ubi5oc2V0KHRoaXMuaGFzaEtleSwgZG9tYWluLCBkb21haW4sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIF90aGlzLl9jb25uLmhzZXQoX3RoaXMuZ2V0RG9tYWluSGFzaEtleShkb21haW4pLCB1cmwsIHZhbHVlLCBmdW5jdGlvbiAoZXJyLCBleGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2Nvbm4uc2V0KF90aGlzLmdldFVybEtleShkb21haW4sIHVybCksIEpTT04uc3RyaW5naWZ5KHsgdGltZXN0YW1wOiBEYXRlLm5vdygpLCBleHRyYTogZXh0cmEgfSksIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHRsID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9jb25uLmV4cGlyZShfdGhpcy5nZXRVcmxLZXkoZG9tYWluLCB1cmwpLCB0dGwsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFJlZGlzU3RvcmFnZUNCLnByb3RvdHlwZS5nZXRVcmxLZXkgPSBmdW5jdGlvbiAoZG9tYWluLCB1cmwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RG9tYWluSGFzaEtleShkb21haW4pICsgJzonICsgdXJsO1xuICAgIH07XG4gICAgcmV0dXJuIFJlZGlzU3RvcmFnZUNCO1xufShzdG9yYWdlXzEuU3RvcmFnZUNCKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBSZWRpc1N0b3JhZ2VDQjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdHMvcmVkaXMvaW5zdGFuY2VDQi50c1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciByZWRpcyA9IHJlcXVpcmUoJ3JlZGlzJyk7XG52YXIgZGJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJyk7XG52YXIgZGVidWcgPSBkYnVnKCdyZWRpcy11cmwtY2FjaGUtUkVESVMnKTtcbnZhciBSZWRpc1Bvb2wgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFJlZGlzUG9vbCgpIHtcbiAgICB9XG4gICAgUmVkaXNQb29sLmNvbm5lY3QgPSBmdW5jdGlvbiAoaW5zdGFuY2VOYW1lLCBjb25maWcsIGNiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgUmVkaXNQb29sLl9wb29sW2luc3RhbmNlTmFtZV0gPT09ICd1bmRlZmluZWQnIHx8XG4gICAgICAgICAgICBSZWRpc1Bvb2wuX3Bvb2xbaW5zdGFuY2VOYW1lXSA9PT0gbnVsbCB8fFxuICAgICAgICAgICAgdHlwZW9mIFJlZGlzUG9vbC5fc3ViW2luc3RhbmNlTmFtZV0gPT09ICd1bmRlZmluZWQnIHx8XG4gICAgICAgICAgICBSZWRpc1Bvb2wuX3N1YltpbnN0YW5jZU5hbWVdID09PSBudWxsKSB7XG4gICAgICAgICAgICBkZWJ1ZygnVGhpcyByZWRpcyBjb25uZWN0aW9uIGhhcyBuZXZlciBiZWVuIGluc3RhbmNpYXRlZCBiZWZvcmUnLCBpbnN0YW5jZU5hbWUpO1xuICAgICAgICAgICAgUmVkaXNQb29sLl9zdGF0dXNbaW5zdGFuY2VOYW1lXSA9IHtcbiAgICAgICAgICAgICAgICBvbmxpbmU6IHtcbiAgICAgICAgICAgICAgICAgICAgcG9vbDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHN1YjogZmFsc2VcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGxhc3RFcnJvcjogbnVsbCxcbiAgICAgICAgICAgICAgICB3YXJuaW5nczogW11cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBSZWRpc1Bvb2wuX3Bvb2xbaW5zdGFuY2VOYW1lXSA9IHJlZGlzLmNyZWF0ZUNsaWVudChjb25maWcpO1xuICAgICAgICAgICAgUmVkaXNQb29sLl9zdWJbaW5zdGFuY2VOYW1lXSA9IHJlZGlzLmNyZWF0ZUNsaWVudChjb25maWcpO1xuICAgICAgICAgICAgdmFyIG5iID0gMDtcbiAgICAgICAgICAgIHZhciBuYkVycm9ycyA9IDA7XG4gICAgICAgICAgICBSZWRpc1Bvb2wuX3Bvb2xbaW5zdGFuY2VOYW1lXS5vbignY29ubmVjdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBSZWRpc1Bvb2wuX3N0YXR1c1tpbnN0YW5jZU5hbWVdLm9ubGluZS5wb29sID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBkZWJ1ZygncG9vbCByZWRpcyBjb25uZWN0ZWQnKTtcbiAgICAgICAgICAgICAgICBuYisrO1xuICAgICAgICAgICAgICAgIGlmIChuYiA9PT0gMikge1xuICAgICAgICAgICAgICAgICAgICBkZWJ1ZygnUE9PTCBDT05ORUNURUQgMiBjb25ucycpO1xuICAgICAgICAgICAgICAgICAgICBjYihudWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFJlZGlzUG9vbC5fc3ViW2luc3RhbmNlTmFtZV0ub24oJ2Nvbm5lY3QnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgUmVkaXNQb29sLl9zdGF0dXNbaW5zdGFuY2VOYW1lXS5vbmxpbmUuc3ViID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBkZWJ1ZygncmVkaXMgY29ubmVjdGVkJyk7XG4gICAgICAgICAgICAgICAgbmIrKztcbiAgICAgICAgICAgICAgICBpZiAobmIgPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoJ1BPT0wgQ09OTkVDVEVEIDIgY29ubnMnKTtcbiAgICAgICAgICAgICAgICAgICAgY2IobnVsbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBSZWRpc1Bvb2wuX3Bvb2xbaW5zdGFuY2VOYW1lXS5vbignZXJyb3InLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIFJlZGlzUG9vbC5fc3RhdHVzW2luc3RhbmNlTmFtZV0ubGFzdEVycm9yID0gZTtcbiAgICAgICAgICAgICAgICBuYkVycm9ycysrO1xuICAgICAgICAgICAgICAgIGRlYnVnKG5iRXJyb3JzLCBlKTtcbiAgICAgICAgICAgICAgICBpZiAobmJFcnJvcnMgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY2IoZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBSZWRpc1Bvb2wuX3Bvb2xbaW5zdGFuY2VOYW1lXS5vbignZW5kJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIFJlZGlzUG9vbC5fcG9vbFtpbnN0YW5jZU5hbWVdID0gbnVsbDtcbiAgICAgICAgICAgICAgICBSZWRpc1Bvb2wuX3N0YXR1c1tpbnN0YW5jZU5hbWVdLm9ubGluZS5wb29sID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgUmVkaXNQb29sLmtpbGwoaW5zdGFuY2VOYW1lKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ1JlZGlzIENvbm5lY3Rpb24gY2xvc2VkIGZvciBpbnN0YW5jZSAnICsgaW5zdGFuY2VOYW1lKTtcbiAgICAgICAgICAgICAgICBkZWJ1ZygnQ29ubmVjdGlvbiBjbG9zZWQnLCBpbnN0YW5jZU5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBSZWRpc1Bvb2wuX3Bvb2xbaW5zdGFuY2VOYW1lXS5vbignd2FybmluZycsIGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ1JlZGlzIHdhcm5pbmcgZm9yIGluc3RhbmNlICcgKyBpbnN0YW5jZU5hbWUgKyAnLiBNU0cgPSAnLCBtc2cpO1xuICAgICAgICAgICAgICAgIFJlZGlzUG9vbC5fc3RhdHVzW2luc3RhbmNlTmFtZV0ud2FybmluZ3MucHVzaChtc2cpO1xuICAgICAgICAgICAgICAgIGRlYnVnKCdXYXJuaW5nIGNhbGxlZDogJywgaW5zdGFuY2VOYW1lLCBtc2cpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBSZWRpc1Bvb2wuX3N1YltpbnN0YW5jZU5hbWVdLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgUmVkaXNQb29sLl9zdGF0dXNbaW5zdGFuY2VOYW1lXS5sYXN0RXJyb3IgPSBlO1xuICAgICAgICAgICAgICAgIG5iRXJyb3JzKys7XG4gICAgICAgICAgICAgICAgZGVidWcobmJFcnJvcnMsIGUpO1xuICAgICAgICAgICAgICAgIGlmIChuYkVycm9ycyA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBjYihlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFJlZGlzUG9vbC5fc3ViW2luc3RhbmNlTmFtZV0ub24oJ2VuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBSZWRpc1Bvb2wuX3N1YltpbnN0YW5jZU5hbWVdID0gbnVsbDtcbiAgICAgICAgICAgICAgICBSZWRpc1Bvb2wuX3N0YXR1c1tpbnN0YW5jZU5hbWVdLm9ubGluZS5zdWIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBSZWRpc1Bvb2wua2lsbChpbnN0YW5jZU5hbWUpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignUmVkaXMgQ29ubmVjdGlvbiBjbG9zZWQgZm9yIGluc3RhbmNlICcgKyBpbnN0YW5jZU5hbWUpO1xuICAgICAgICAgICAgICAgIGRlYnVnKCdDb25uZWN0aW9uIGNsb3NlZCcsIGluc3RhbmNlTmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFJlZGlzUG9vbC5fc3ViW2luc3RhbmNlTmFtZV0ub24oJ3dhcm5pbmcnLCBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdSZWRpcyB3YXJuaW5nIGZvciBpbnN0YW5jZSAnICsgaW5zdGFuY2VOYW1lICsgJy4gTVNHID0gJywgbXNnKTtcbiAgICAgICAgICAgICAgICBSZWRpc1Bvb2wuX3N0YXR1c1tpbnN0YW5jZU5hbWVdLndhcm5pbmdzLnB1c2gobXNnKTtcbiAgICAgICAgICAgICAgICBkZWJ1ZygnV2FybmluZyBjYWxsZWQ6ICcsIGluc3RhbmNlTmFtZSwgbXNnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2IobnVsbCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFJlZGlzUG9vbC5raWxsID0gZnVuY3Rpb24gKGluc3RhbmNlTmFtZSkge1xuICAgICAgICBpZiAoUmVkaXNQb29sLl9zdGF0dXNbaW5zdGFuY2VOYW1lXS5vbmxpbmUuc3ViID09PSB0cnVlKSB7XG4gICAgICAgICAgICBSZWRpc1Bvb2wuX3N1YltpbnN0YW5jZU5hbWVdLmVuZCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChSZWRpc1Bvb2wuX3N0YXR1c1tpbnN0YW5jZU5hbWVdLm9ubGluZS5wb29sID09PSB0cnVlKSB7XG4gICAgICAgICAgICBSZWRpc1Bvb2wuX3Bvb2xbaW5zdGFuY2VOYW1lXS5lbmQoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUmVkaXNQb29sLmdldENvbm5lY3Rpb24gPSBmdW5jdGlvbiAoaW5zdGFuY2VOYW1lKSB7XG4gICAgICAgIGlmIChSZWRpc1Bvb2wuX3N0YXR1c1tpbnN0YW5jZU5hbWVdLm9ubGluZSkge1xuICAgICAgICAgICAgcmV0dXJuIFJlZGlzUG9vbC5fcG9vbFtpbnN0YW5jZU5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIGRlYnVnKCdSZWRpcyBQb29sIGlzblxcJ3Qgb25saW5lIHlldCcpO1xuICAgIH07XG4gICAgUmVkaXNQb29sLmdldFN1YnNjcmliZXJDb25uZWN0aW9uID0gZnVuY3Rpb24gKGluc3RhbmNlTmFtZSkge1xuICAgICAgICBpZiAoUmVkaXNQb29sLl9zdGF0dXNbaW5zdGFuY2VOYW1lXS5vbmxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiBSZWRpc1Bvb2wuX3N1YltpbnN0YW5jZU5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIGRlYnVnKCdSZWRpcyBQb29sIGlzblxcJ3Qgb25saW5lIHlldCcpO1xuICAgIH07XG4gICAgUmVkaXNQb29sLl9wb29sID0ge307XG4gICAgUmVkaXNQb29sLl9zdWIgPSB7fTtcbiAgICBSZWRpc1Bvb2wuX3N0YXR1cyA9IHt9O1xuICAgIHJldHVybiBSZWRpc1Bvb2w7XG59KCkpO1xuZXhwb3J0cy5SZWRpc1Bvb2wgPSBSZWRpc1Bvb2w7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3RzL3JlZGlzL3Bvb2wudHNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlZGlzXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwicmVkaXNcIlxuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBTdG9yYWdlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTdG9yYWdlKCkge1xuICAgIH1cbiAgICBTdG9yYWdlLnByb3RvdHlwZS5nZXRNZXRob2QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1ldGhvZDtcbiAgICB9O1xuICAgIHJldHVybiBTdG9yYWdlO1xufSgpKTtcbnZhciBTdG9yYWdlUHJvbWlzZSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFN0b3JhZ2VQcm9taXNlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFN0b3JhZ2VQcm9taXNlKCkge1xuICAgICAgICBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgcmV0dXJuIFN0b3JhZ2VQcm9taXNlO1xufShTdG9yYWdlKSk7XG5leHBvcnRzLlN0b3JhZ2VQcm9taXNlID0gU3RvcmFnZVByb21pc2U7XG52YXIgU3RvcmFnZUNCID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU3RvcmFnZUNCLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFN0b3JhZ2VDQigpIHtcbiAgICAgICAgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIHJldHVybiBTdG9yYWdlQ0I7XG59KFN0b3JhZ2UpKTtcbmV4cG9ydHMuU3RvcmFnZUNCID0gU3RvcmFnZUNCO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi90cy9hYnN0cmFjdC9zdG9yYWdlLnRzXG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIGluc3RhbmNlQ0JfMSA9IHJlcXVpcmUoXCIuLi9yZWRpcy9pbnN0YW5jZUNCXCIpO1xudmFyIGhlbHBlcnNfMSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMnKTtcbnZhciBjYWNoZV8xID0gcmVxdWlyZSgnLi9jYWNoZScpO1xudmFyIENhY2hlRW5naW5lXzEgPSByZXF1aXJlKFwiLi9DYWNoZUVuZ2luZVwiKTtcbnZhciBkYnVnID0gcmVxdWlyZSgnZGVidWcnKTtcbnZhciBkZWJ1ZyA9IGRidWcoJ3JlZGlzLXVybC1jYWNoZScpO1xudmFyIENhY2hlRW5naW5lQ0IgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhDYWNoZUVuZ2luZUNCLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIENhY2hlRW5naW5lQ0IoZGVmYXVsdERvbWFpbiwgaW5zdGFuY2UpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgZGVmYXVsdERvbWFpbiwgaW5zdGFuY2UpO1xuICAgICAgICB0aGlzLnN0b3JhZ2VJbnN0YW5jZSA9IG5ldyBpbnN0YW5jZUNCXzEuZGVmYXVsdChpbnN0YW5jZSk7XG4gICAgfVxuICAgIENhY2hlRW5naW5lQ0IucHJvdG90eXBlLmNsZWFyRG9tYWluID0gZnVuY3Rpb24gKGRvbWFpbiwgY2IpIHtcbiAgICAgICAgaGVscGVyc18xLmRlZmF1bHQuaXNTdHJpbmdEZWZpbmVkKGRvbWFpbik7XG4gICAgICAgIHRoaXMuc3RvcmFnZUluc3RhbmNlLmNsZWFyRG9tYWluKGRvbWFpbiwgY2IpO1xuICAgIH07XG4gICAgQ2FjaGVFbmdpbmVDQi5wcm90b3R5cGUuY2xlYXJJbnN0YW5jZSA9IGZ1bmN0aW9uIChjYikge1xuICAgICAgICB0aGlzLnN0b3JhZ2VJbnN0YW5jZS5jbGVhckNhY2hlKGNiKTtcbiAgICB9O1xuICAgIENhY2hlRW5naW5lQ0IucHJvdG90eXBlLmdldFN0b3JlZEhvc3RuYW1lcyA9IGZ1bmN0aW9uIChjYikge1xuICAgICAgICB0aGlzLnN0b3JhZ2VJbnN0YW5jZS5nZXRDYWNoZWREb21haW5zKGNiKTtcbiAgICB9O1xuICAgIENhY2hlRW5naW5lQ0IucHJvdG90eXBlLmdldFN0b3JlZFVSTHMgPSBmdW5jdGlvbiAoZG9tYWluLCBjYikge1xuICAgICAgICBoZWxwZXJzXzEuZGVmYXVsdC5pc1N0cmluZ0RlZmluZWQoZG9tYWluKTtcbiAgICAgICAgdGhpcy5zdG9yYWdlSW5zdGFuY2UuZ2V0Q2FjaGVkVVJMcyhkb21haW4sIGNiKTtcbiAgICB9O1xuICAgIENhY2hlRW5naW5lQ0IucHJvdG90eXBlLnVybCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgdmFyIHBhcnNlZFVSTCA9IGhlbHBlcnNfMS5kZWZhdWx0LnBhcnNlVVJMKHVybCk7XG4gICAgICAgIGlmIChwYXJzZWRVUkwuZG9tYWluLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcGFyc2VkVVJMLmRvbWFpbiA9IHRoaXMuZGVmYXVsdERvbWFpbjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY2FjaGUgPSBuZXcgY2FjaGVfMS5VcmxDQihwYXJzZWRVUkwuZG9tYWluLCB0aGlzLnN0b3JhZ2VJbnN0YW5jZSwgdGhpcy5pbnN0YW5jZU5hbWUsIHBhcnNlZFVSTC5yZWxhdGl2ZVVSTCk7XG4gICAgICAgIHRoaXMuYWRkVXJsKGNhY2hlKTtcbiAgICAgICAgcmV0dXJuIGNhY2hlO1xuICAgIH07XG4gICAgcmV0dXJuIENhY2hlRW5naW5lQ0I7XG59KENhY2hlRW5naW5lXzEuZGVmYXVsdCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ2FjaGVFbmdpbmVDQjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdHMvY2FjaGVFbmdpbmUvY2FjaGVFbmdpbmVDQi50c1xuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgaGVscGVyc18xID0gcmVxdWlyZShcIi4vaGVscGVyc1wiKTtcbnZhciBwb29sXzEgPSByZXF1aXJlKFwiLi9yZWRpcy9wb29sXCIpO1xudmFyIENhY2hlRW5naW5lXzEgPSByZXF1aXJlKCcuL2NhY2hlRW5naW5lL0NhY2hlRW5naW5lJyk7XG52YXIgQ2FjaGVSdWxlTWFuYWdlcl8xID0gcmVxdWlyZSgnLi9ydWxlcy9DYWNoZVJ1bGVNYW5hZ2VyJyk7XG52YXIgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdyZWRpcy11cmwtY2FjaGUnKTtcbnZhciBJbnN0YW5jZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gSW5zdGFuY2UoaW5zdGFuY2VOYW1lLCByZWRpc0NvbmZpZywgY29uZmlnLCBjYikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoY29uZmlnID09PSB2b2lkIDApIHsgY29uZmlnID0geyBvbl9leGlzdGluZ19yZWdleDogJ3JlcGxhY2UnLCBvbl9wdWJsaXNoX3VwZGF0ZTogZmFsc2UgfTsgfVxuICAgICAgICB0aGlzLmluc3RhbmNlTmFtZSA9IGluc3RhbmNlTmFtZTtcbiAgICAgICAgdGhpcy5yZWRpc0NvbmZpZyA9IHJlZGlzQ29uZmlnO1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgdGhpcy5pbnN0YW5jaWF0ZWQgPSBmYWxzZTtcbiAgICAgICAgaGVscGVyc18xLmRlZmF1bHQuaXNOb3RVbmRlZmluZWQoaW5zdGFuY2VOYW1lLCByZWRpc0NvbmZpZywgY29uZmlnLCBjYik7XG4gICAgICAgIHRoaXMuY29uZmlnID0gT2JqZWN0LmFzc2lnbih7IG9uX2V4aXN0aW5nX3JlZ2V4OiAncmVwbGFjZScsIG9uX3B1Ymxpc2hfdXBkYXRlOiBmYWxzZSB9LCBjb25maWcpO1xuICAgICAgICBwb29sXzEuUmVkaXNQb29sLmNvbm5lY3QoaW5zdGFuY2VOYW1lLCByZWRpc0NvbmZpZywgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IoJ0Vycm9yIGNvbm5lY3RpbmcgdG8gUkVESVM6ICcgKyBlcnIpO1xuICAgICAgICAgICAgdmFyIHJlZGlzQ29ubiA9IHBvb2xfMS5SZWRpc1Bvb2wuZ2V0Q29ubmVjdGlvbihpbnN0YW5jZU5hbWUpO1xuICAgICAgICAgICAgcmVkaXNDb25uLmhnZXQoaGVscGVyc18xLmRlZmF1bHQuZ2V0Q29uZmlnS2V5KCksIF90aGlzLmluc3RhbmNlTmFtZSwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYignUmVkaXMgZXJyb3IgLSByZXRyaWV2aW5nICcgKyBoZWxwZXJzXzEuZGVmYXVsdC5nZXRDb25maWdLZXkoKSArICcgLT4gJyArIGVycik7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKCdObyBDYWNoZVJ1bGUgZGVmaW5lZCBmb3IgdGhpcyBpbnN0YW5jZSAnICsgX3RoaXMuaW5zdGFuY2VOYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmluc3RhbmNpYXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJzZWREYXRhID0gSlNPTi5wYXJzZShkYXRhLCBoZWxwZXJzXzEuZGVmYXVsdC5KU09OUmVnRXhwUmV2aXZlcik7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm1hbmFnZXIgPSBuZXcgQ2FjaGVSdWxlTWFuYWdlcl8xLmRlZmF1bHQocGFyc2VkRGF0YSwgY29uZmlnLm9uX2V4aXN0aW5nX3JlZ2V4KTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubGF1bmNoU3Vic2NyaWJlcigpO1xuICAgICAgICAgICAgICAgICAgICBjYihudWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIEluc3RhbmNlLnByb3RvdHlwZS5sYXVuY2hTdWJzY3JpYmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgc3Vic2NyaWJlciA9IHBvb2xfMS5SZWRpc1Bvb2wuZ2V0U3Vic2NyaWJlckNvbm5lY3Rpb24odGhpcy5pbnN0YW5jZU5hbWUpO1xuICAgICAgICBzdWJzY3JpYmVyLnN1YnNjcmliZSh0aGlzLmdldENoYW5uZWwoKSk7XG4gICAgICAgIHN1YnNjcmliZXIub24oJ21lc3NhZ2UnLCBmdW5jdGlvbiAoY2hhbm5lbCwgbWVzc2FnZSkge1xuICAgICAgICAgICAgaWYgKG1lc3NhZ2UgPT09ICdQVVNIRUQnKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMub25QdWJsaXNoKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgSW5zdGFuY2UucHJvdG90eXBlLmdldENoYW5uZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBoZWxwZXJzXzEuZGVmYXVsdC5nZXRDb25maWdLZXkoKSArIHRoaXMuaW5zdGFuY2VOYW1lO1xuICAgIH07XG4gICAgSW5zdGFuY2UucHJvdG90eXBlLnB1Ymxpc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIENhY2hlRW5naW5lXzEuZGVmYXVsdC51cGRhdGVBbGxVcmxDYXRlZ29yeSh0aGlzLmluc3RhbmNlTmFtZSk7XG4gICAgICAgIHZhciByZWRpc0Nvbm4gPSBwb29sXzEuUmVkaXNQb29sLmdldENvbm5lY3Rpb24odGhpcy5pbnN0YW5jZU5hbWUpO1xuICAgICAgICB2YXIgc3RyaW5naWZpZWQgPSBKU09OLnN0cmluZ2lmeSh0aGlzLm1hbmFnZXIuZ2V0UnVsZXMoKSwgaGVscGVyc18xLmRlZmF1bHQuSlNPTlJlZ0V4cFJlcGxhY2VyLCAyKTtcbiAgICAgICAgcmVkaXNDb25uLmhzZXQoaGVscGVyc18xLmRlZmF1bHQuZ2V0Q29uZmlnS2V5KCksIHRoaXMuaW5zdGFuY2VOYW1lLCBzdHJpbmdpZmllZCwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICBoZWxwZXJzXzEuZGVmYXVsdC5SZWRpc0Vycm9yKCd3aGlsZSBwdWJsaXNoaW5nIGNvbmZpZyAnICsgc3RyaW5naWZpZWQsIGVycik7XG4gICAgICAgICAgICByZWRpc0Nvbm4ucHVibGlzaChfdGhpcy5nZXRDaGFubmVsKCksICdQVVNIRUQnKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBJbnN0YW5jZS5wcm90b3R5cGUub25QdWJsaXNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgcmVkaXNDb25uID0gcG9vbF8xLlJlZGlzUG9vbC5nZXRDb25uZWN0aW9uKHRoaXMuaW5zdGFuY2VOYW1lKTtcbiAgICAgICAgcmVkaXNDb25uLmhnZXQoaGVscGVyc18xLmRlZmF1bHQuZ2V0Q29uZmlnS2V5KCksIHRoaXMuaW5zdGFuY2VOYW1lLCBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gICAgICAgICAgICBpZiAoZXJyKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUmVkaXMgZXJyb3IgLSByZXRyaWV2aW5nICcgKyBoZWxwZXJzXzEuZGVmYXVsdC5nZXRDb25maWdLZXkoKSk7XG4gICAgICAgICAgICBpZiAoZGF0YSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQmlnIG1lc3MnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBwYXJzZWREYXRhID0gSlNPTi5wYXJzZShkYXRhLCBoZWxwZXJzXzEuZGVmYXVsdC5KU09OUmVnRXhwUmV2aXZlcik7XG4gICAgICAgICAgICBfdGhpcy5tYW5hZ2VyLnVwZGF0ZVJ1bGVzKHBhcnNlZERhdGEpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIEluc3RhbmNlLnByb3RvdHlwZS5nZXRNYW5hZ2VyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tYW5hZ2VyO1xuICAgIH07XG4gICAgSW5zdGFuY2UucHJvdG90eXBlLmdldENvbmZpZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnO1xuICAgIH07XG4gICAgSW5zdGFuY2UucHJvdG90eXBlLmdldEluc3RhbmNlTmFtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2VOYW1lO1xuICAgIH07XG4gICAgSW5zdGFuY2UucHJvdG90eXBlLmdldFJlZGlzQ29uZmlnID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWRpc0NvbmZpZztcbiAgICB9O1xuICAgIEluc3RhbmNlLnByb3RvdHlwZS5pc0luc3RhbmNpYXRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2lhdGVkO1xuICAgIH07XG4gICAgSW5zdGFuY2UucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHBvb2xfMS5SZWRpc1Bvb2wua2lsbCh0aGlzLmluc3RhbmNlTmFtZSk7XG4gICAgICAgIHRoaXMuaW5zdGFuY2lhdGVkID0gZmFsc2U7XG4gICAgfTtcbiAgICByZXR1cm4gSW5zdGFuY2U7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gSW5zdGFuY2U7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3RzL2luc3RhbmNlLnRzXG4vLyBtb2R1bGUgaWQgPSAxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBoZWxwZXJzXzEgPSByZXF1aXJlKFwiLi4vaGVscGVyc1wiKTtcbnZhciBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ3JlZGlzLXVybC1jYWNoZScpO1xudmFyIENhY2hlUnVsZU1hbmFnZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENhY2hlUnVsZU1hbmFnZXIoY2FjaGVSdWxlcywgb25fZXhpc3RpbmdfcmVnZXgpIHtcbiAgICAgICAgdGhpcy5jYWNoZVJ1bGVzID0gY2FjaGVSdWxlcztcbiAgICAgICAgdGhpcy5vbl9leGlzdGluZ19yZWdleCA9IG9uX2V4aXN0aW5nX3JlZ2V4O1xuICAgIH1cbiAgICBDYWNoZVJ1bGVNYW5hZ2VyLnByb3RvdHlwZS5hZGRNYXhBZ2VSdWxlID0gZnVuY3Rpb24gKGRvbWFpbiwgcmVnZXgsIG1heEFnZSwgaWdub3JlUXVlcnkpIHtcbiAgICAgICAgaGVscGVyc18xLmRlZmF1bHQuaXNOb3RVbmRlZmluZWQoZG9tYWluLCByZWdleCwgbWF4QWdlKTtcbiAgICAgICAgdmFyIHJlZ2V4UnVsZSA9IHsgcmVnZXg6IHJlZ2V4LCBtYXhBZ2U6IG1heEFnZSwgaWdub3JlUXVlcnk6IGlnbm9yZVF1ZXJ5ID8gaWdub3JlUXVlcnkgOiBmYWxzZSB9O1xuICAgICAgICBoZWxwZXJzXzEuZGVmYXVsdC5pc01heEFnZVJlZ2V4UnVsZShyZWdleFJ1bGUpO1xuICAgICAgICB2YXIgZm91bmQgPSB0aGlzLmZpbmRSZWdleChkb21haW4sIHJlZ2V4UnVsZSk7XG4gICAgICAgIHRoaXMuYWRkKGRvbWFpbiwgcmVnZXhSdWxlLCAnbWF4QWdlJywgZm91bmQpO1xuICAgIH07XG4gICAgQ2FjaGVSdWxlTWFuYWdlci5wcm90b3R5cGUuYWRkTmV2ZXJSdWxlID0gZnVuY3Rpb24gKGRvbWFpbiwgcmVnZXgsIGlnbm9yZVF1ZXJ5KSB7XG4gICAgICAgIGhlbHBlcnNfMS5kZWZhdWx0LmlzTm90VW5kZWZpbmVkKHJlZ2V4KTtcbiAgICAgICAgdmFyIHJlZ2V4UnVsZSA9IHsgcmVnZXg6IHJlZ2V4LCBpZ25vcmVRdWVyeTogaWdub3JlUXVlcnkgPyBpZ25vcmVRdWVyeSA6IGZhbHNlIH07XG4gICAgICAgIGhlbHBlcnNfMS5kZWZhdWx0LmlzQ29uZmlnUmVnZXhSdWxlKHJlZ2V4UnVsZSk7XG4gICAgICAgIHZhciBmb3VuZCA9IHRoaXMuZmluZFJlZ2V4KGRvbWFpbiwgcmVnZXhSdWxlKTtcbiAgICAgICAgdGhpcy5hZGQoZG9tYWluLCByZWdleFJ1bGUsICduZXZlcicsIGZvdW5kKTtcbiAgICB9O1xuICAgIENhY2hlUnVsZU1hbmFnZXIucHJvdG90eXBlLmFkZEFsd2F5c1J1bGUgPSBmdW5jdGlvbiAoZG9tYWluLCByZWdleCwgaWdub3JlUXVlcnkpIHtcbiAgICAgICAgaGVscGVyc18xLmRlZmF1bHQuaXNOb3RVbmRlZmluZWQocmVnZXgpO1xuICAgICAgICB2YXIgcmVnZXhSdWxlID0geyByZWdleDogcmVnZXgsIGlnbm9yZVF1ZXJ5OiBpZ25vcmVRdWVyeSA/IGlnbm9yZVF1ZXJ5IDogZmFsc2UgfTtcbiAgICAgICAgaGVscGVyc18xLmRlZmF1bHQuaXNDb25maWdSZWdleFJ1bGUocmVnZXhSdWxlKTtcbiAgICAgICAgdmFyIGZvdW5kID0gdGhpcy5maW5kUmVnZXgoZG9tYWluLCByZWdleFJ1bGUpO1xuICAgICAgICB0aGlzLmFkZChkb21haW4sIHJlZ2V4UnVsZSwgJ2Fsd2F5cycsIGZvdW5kKTtcbiAgICB9O1xuICAgIENhY2hlUnVsZU1hbmFnZXIucHJvdG90eXBlLmdldFJ1bGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZVJ1bGVzO1xuICAgIH07XG4gICAgQ2FjaGVSdWxlTWFuYWdlci5wcm90b3R5cGUuc2V0RGVmYXVsdCA9IGZ1bmN0aW9uIChzdHJhdGVneSkge1xuICAgICAgICBoZWxwZXJzXzEuZGVmYXVsdC5pc1N0cmluZ0luKHN0cmF0ZWd5LCBbJ2Fsd2F5cycsICduZXZlciddKTtcbiAgICAgICAgdGhpcy5jYWNoZVJ1bGVzLmRlZmF1bHQgPSBzdHJhdGVneTtcbiAgICB9O1xuICAgIENhY2hlUnVsZU1hbmFnZXIucHJvdG90eXBlLnJlbW92ZVJ1bGUgPSBmdW5jdGlvbiAoZG9tYWluLCBydWxlKSB7XG4gICAgICAgIGhlbHBlcnNfMS5kZWZhdWx0LmlzTm90VW5kZWZpbmVkKHJ1bGUpO1xuICAgICAgICBoZWxwZXJzXzEuZGVmYXVsdC5pc0NvbmZpZ1JlZ2V4UnVsZShydWxlKTtcbiAgICAgICAgdmFyIGZvdW5kID0gdGhpcy5maW5kUmVnZXgoZG9tYWluLCBydWxlKTtcbiAgICAgICAgaWYgKGZvdW5kICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmNhY2hlUnVsZXNbZm91bmQudHlwZV1bZm91bmQuaW5kZXhdLnJ1bGVzLnNwbGljZShmb3VuZC5zdWJJbmRleCwgMSk7XG4gICAgICAgICAgICBpZiAodGhpcy5jYWNoZVJ1bGVzW2ZvdW5kLnR5cGVdW2ZvdW5kLmluZGV4XS5ydWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhY2hlUnVsZXNbZm91bmQudHlwZV0uc3BsaWNlKGZvdW5kLmluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgQ2FjaGVSdWxlTWFuYWdlci5wcm90b3R5cGUucmVtb3ZlQWxsTWF4QWdlUnVsZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY2FjaGVSdWxlcy5tYXhBZ2UgPSBbXTtcbiAgICB9O1xuICAgIENhY2hlUnVsZU1hbmFnZXIucHJvdG90eXBlLnJlbW92ZUFsbE5ldmVyUnVsZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY2FjaGVSdWxlcy5uZXZlciA9IFtdO1xuICAgIH07XG4gICAgQ2FjaGVSdWxlTWFuYWdlci5wcm90b3R5cGUucmVtb3ZlQWxsQWx3YXlzUnVsZXMgPSBmdW5jdGlvbiAoZG9tYWluKSB7XG4gICAgICAgIHRoaXMuY2FjaGVSdWxlcy5hbHdheXMgPSBbXTtcbiAgICB9O1xuICAgIENhY2hlUnVsZU1hbmFnZXIucHJvdG90eXBlLnVwZGF0ZVJ1bGVzID0gZnVuY3Rpb24gKGNhY2hlUnVsZXMpIHtcbiAgICAgICAgdGhpcy5jYWNoZVJ1bGVzID0gY2FjaGVSdWxlcztcbiAgICB9O1xuICAgIENhY2hlUnVsZU1hbmFnZXIucHJvdG90eXBlLmNoZWNrRG9tYWluTWF0Y2ggPSBmdW5jdGlvbiAoc3RvcmVkLCBpbnB1dCkge1xuICAgICAgICBpZiAodHlwZW9mIHN0b3JlZCA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIHN0b3JlZCA9PT0gaW5wdXQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc3RvcmVkIGluc3RhbmNlb2YgUmVnRXhwICYmIGlucHV0IGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgICAgICByZXR1cm4gaGVscGVyc18xLmRlZmF1bHQuU2FtZVJlZ2V4KHN0b3JlZCwgaW5wdXQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBDYWNoZVJ1bGVNYW5hZ2VyLnByb3RvdHlwZS5maW5kUmVnZXggPSBmdW5jdGlvbiAoZG9tYWluLCBydWxlKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBpbmZvID0gbnVsbCwgaW5kZXgsIHN1YkluZGV4O1xuICAgICAgICBbJ2Fsd2F5cycsICduZXZlcicsICdtYXhBZ2UnXS5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICAgICAgICBmb3IgKGluZGV4ID0gMDsgaW5kZXggPCBfdGhpcy5jYWNoZVJ1bGVzW3R5cGVdLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5jaGVja0RvbWFpbk1hdGNoKF90aGlzLmNhY2hlUnVsZXNbdHlwZV1baW5kZXhdLmRvbWFpbiwgZG9tYWluKSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHN1YkluZGV4ID0gMDsgc3ViSW5kZXggPCBfdGhpcy5jYWNoZVJ1bGVzW3R5cGVdW2luZGV4XS5ydWxlcy5sZW5ndGg7IHN1YkluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoZWxwZXJzXzEuZGVmYXVsdC5TYW1lUmVnZXgocnVsZS5yZWdleCwgX3RoaXMuY2FjaGVSdWxlc1t0eXBlXVtpbmRleF0ucnVsZXNbc3ViSW5kZXhdLnJlZ2V4KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZm8gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ViSW5kZXg6IHN1YkluZGV4XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBpbmZvO1xuICAgIH07XG4gICAgQ2FjaGVSdWxlTWFuYWdlci5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGRvbWFpbiwgcnVsZSwgd2hlcmUsIGZvdW5kKSB7XG4gICAgICAgIGRlYnVnKCdhZGRpbmcgcnVsZSAnLCBkb21haW4sIHJ1bGUsIHdoZXJlLCBmb3VuZCk7XG4gICAgICAgIGRlYnVnKCdiZWZvcmU6ICcsIHRoaXMuY2FjaGVSdWxlcyk7XG4gICAgICAgIGlmIChmb3VuZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgc3dpdGNoICh0aGlzLm9uX2V4aXN0aW5nX3JlZ2V4KSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnaWdub3JlJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3JlcGxhY2UnOlxuICAgICAgICAgICAgICAgICAgICBkZWJ1ZygncmVwbGFjaW5nOiAnLCB0aGlzLmNhY2hlUnVsZXNbZm91bmQudHlwZV1bZm91bmQuaW5kZXhdLnJ1bGVzLCBmb3VuZC5zdWJJbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FjaGVSdWxlc1tmb3VuZC50eXBlXVtmb3VuZC5pbmRleF0ucnVsZXMuc3BsaWNlKGZvdW5kLnN1YkluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnZXJyb3InOlxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FkZGluZyBhIG1heEFnZSByZWdleCB0aGF0IGlzIGFscmVhZHkgZGVmaW5lZCBoZXJlOiAnICsgSlNPTi5wYXJzZShmb3VuZCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChmb3VuZCAhPT0gbnVsbCAmJiBmb3VuZC50eXBlID09PSB3aGVyZSkge1xuICAgICAgICAgICAgdGhpcy5jYWNoZVJ1bGVzW3doZXJlXVtmb3VuZC5pbmRleF0ucnVsZXMucHVzaChydWxlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBpbmRleDJ1cGRhdGUgPSB2b2lkIDAsIGluZGV4ID0gdm9pZCAwO1xuICAgICAgICAgICAgZm9yIChpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5jYWNoZVJ1bGVzW3doZXJlXS5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGVja0RvbWFpbk1hdGNoKHRoaXMuY2FjaGVSdWxlc1t3aGVyZV1baW5kZXhdLmRvbWFpbiwgZG9tYWluKSkge1xuICAgICAgICAgICAgICAgICAgICBpbmRleDJ1cGRhdGUgPSBpbmRleDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIGluZGV4MnVwZGF0ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICBkZWJ1ZygnQSBkb21haW4gYWxyZWFkeSBleGlzdHMsIHNvIHB1c2luZyBydWxlcyBhdCBpbmRleCAnLCBpbmRleDJ1cGRhdGUsIHRoaXMuY2FjaGVSdWxlc1t3aGVyZV1baW5kZXgydXBkYXRlXSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZVJ1bGVzW3doZXJlXVtpbmRleDJ1cGRhdGVdLnJ1bGVzLnB1c2gocnVsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhY2hlUnVsZXNbd2hlcmVdLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBkb21haW46IGRvbWFpbixcbiAgICAgICAgICAgICAgICAgICAgcnVsZXM6IFtydWxlXVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9O1xuICAgIHJldHVybiBDYWNoZVJ1bGVNYW5hZ2VyO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IENhY2hlUnVsZU1hbmFnZXI7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3RzL3J1bGVzL0NhY2hlUnVsZU1hbmFnZXIudHNcbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlwidXNlIHN0cmljdFwiO1xudmFyIHBvb2xfMSA9IHJlcXVpcmUoXCIuLi9yZWRpcy9wb29sXCIpO1xudmFyIGhlbHBlcnNfMSA9IHJlcXVpcmUoXCIuLi9oZWxwZXJzXCIpO1xudmFyIGRlYnVnID0gcmVxdWlyZSgnZGVidWcnKSgncmVkaXMtdXJsLWNhY2hlJyk7XG52YXIgQ2FjaGVSdWxlc0NyZWF0b3IgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENhY2hlUnVsZXNDcmVhdG9yKGluc3RhbmNlTmFtZSwgcmVkaXNDb25maWcsIGNiKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuaW5zdGFuY2VOYW1lID0gaW5zdGFuY2VOYW1lO1xuICAgICAgICB0aGlzLnJlZGlzQ29uZmlnID0gcmVkaXNDb25maWc7XG4gICAgICAgIGhlbHBlcnNfMS5kZWZhdWx0LmlzTm90VW5kZWZpbmVkKGluc3RhbmNlTmFtZSwgcmVkaXNDb25maWcsIGNiKTtcbiAgICAgICAgZGVidWcoJ2Nvbm5lY3RpbmcgdG8gcmVkaXMnKTtcbiAgICAgICAgcG9vbF8xLlJlZGlzUG9vbC5jb25uZWN0KGluc3RhbmNlTmFtZSwgcmVkaXNDb25maWcsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKCdFcnJvciBjb25uZWN0aW5nIHRvIFJFRElTJyk7XG4gICAgICAgICAgICBfdGhpcy5fY29ubiA9IHBvb2xfMS5SZWRpc1Bvb2wuZ2V0Q29ubmVjdGlvbihpbnN0YW5jZU5hbWUpO1xuICAgICAgICAgICAgY2IobnVsbCwgX3RoaXMpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgQ2FjaGVSdWxlc0NyZWF0b3IucHJvdG90eXBlLmltcG9ydFJ1bGVzID0gZnVuY3Rpb24gKHJ1bGVzLCBvdmVyd3JpdGUsIGNiKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGhlbHBlcnNfMS5kZWZhdWx0LmlzTm90VW5kZWZpbmVkKHJ1bGVzLCBjYik7XG4gICAgICAgIGhlbHBlcnNfMS5kZWZhdWx0LnZhbGlkYXRlQ2FjaGVDb25maWcocnVsZXMpO1xuICAgICAgICB0aGlzLl9jb25uLmhnZXQoaGVscGVyc18xLmRlZmF1bHQuZ2V0Q29uZmlnS2V5KCksIHRoaXMuaW5zdGFuY2VOYW1lLCBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gICAgICAgICAgICBpZiAoZXJyKVxuICAgICAgICAgICAgICAgIHJldHVybiBjYignUmVkaXMgZXJyb3IgLSByZXRyaWV2aW5nICcgKyBoZWxwZXJzXzEuZGVmYXVsdC5nZXRDb25maWdLZXkoKSArICc6ICcgKyBlcnIpO1xuICAgICAgICAgICAgaWYgKGRhdGEgIT09IG51bGwgJiYgIW92ZXJ3cml0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYignQSBDYWNoZVJ1bGUgZGVmaW5pdGlvbiBhbHJlYWR5IGV4aXN0cyBmb3IgdGhpcyBpbnN0YW5jZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHN0cmluZ2lmaWVkID0gSlNPTi5zdHJpbmdpZnkocnVsZXMsIGhlbHBlcnNfMS5kZWZhdWx0LkpTT05SZWdFeHBSZXBsYWNlciwgMik7XG4gICAgICAgICAgICBfdGhpcy5fY29ubi5oc2V0KGhlbHBlcnNfMS5kZWZhdWx0LmdldENvbmZpZ0tleSgpLCBfdGhpcy5pbnN0YW5jZU5hbWUsIHN0cmluZ2lmaWVkLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICAgICAgY2IoZXJyKTtcbiAgICAgICAgICAgICAgICBjYihudWxsKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIHJldHVybiBDYWNoZVJ1bGVzQ3JlYXRvcjtcbn0oKSk7XG52YXIgQ2FjaGVDcmVhdG9yID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDYWNoZUNyZWF0b3IoKSB7XG4gICAgfVxuICAgIENhY2hlQ3JlYXRvci5jcmVhdGVDYWNoZSA9IGZ1bmN0aW9uIChpbnN0YW5jZU5hbWUsIGZvcmNlLCByZWRpc0NvbmZpZywgcnVsZXMsIGNiKSB7XG4gICAgICAgIGhlbHBlcnNfMS5kZWZhdWx0LmlzTm90VW5kZWZpbmVkKGluc3RhbmNlTmFtZSwgZm9yY2UsIHJlZGlzQ29uZmlnLCBydWxlcywgY2IpO1xuICAgICAgICBuZXcgQ2FjaGVSdWxlc0NyZWF0b3IoaW5zdGFuY2VOYW1lLCByZWRpc0NvbmZpZywgZnVuY3Rpb24gKGVyciwgY3JlYXRvcikge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3JlYXRvci5pbXBvcnRSdWxlcyhydWxlcywgZm9yY2UsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYihudWxsKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIHJldHVybiBDYWNoZUNyZWF0b3I7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ2FjaGVDcmVhdG9yO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi90cy9ydWxlcy9DYWNoZVJ1bGVzQ3JlYXRvci50c1xuLy8gbW9kdWxlIGlkID0gMTZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==