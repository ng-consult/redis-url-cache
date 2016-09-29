import {Promise} from 'es6-promise';
import {CacheRules, StorageInstance, RedisStorageConfig, StorageType} from './interfaces';
import RedisStorageInstance from "./redis/instance";
import Helpers from './helpers';
import * as nodeurl from 'url';
import * as dbug from 'debug';
import Cache from './cache';

const debug = dbug('simple-url-cache');

class CacheEngine {

    static pool:any = {};

    static locks:any = {};

    static helpers = {
        validateRedisStorageConfig: Helpers.validateRedisStorageConfig,
        validateCacheConfig: Helpers.validateCacheConfig
    };

    private type:StorageType;

    /**
     *
     * @param defaultDomain This is the default domain when the url doesn't contain any host information.
     * It can be of any form, usually http:   // user:pass @ host.com : 8080
     * @param instanceName: This allows you to fine tune caching instances when running many servers instances on the same machine
     *
     * example :
     *
     * c1 = new cacheEngine('http://a.com', 'I1', {type: 'file', dir: '/cache/simple-url-cache'}, cacheRules};
     * c2 = new cacheEngine('http://b.com', 'I1', {type: 'file', dir: '/cache/simple-url-cache'}, cacheRules};
     * c3 = new cacheEngine('http://c.com', 'I2', {type: 'file', dir: '/cache/simple-url-cache'}, cacheRules};
     *
     * c1 & c2 will share the same instance of cached URLs, c3 will be independant
     *
     * c1.url('//cdn.com/jquery.js').set();
     * -> resolve(true) never cached before
     *
     * c2.url('//cdn.com/jquery.js').set();
     * -> resolve(false) because it is already cached
     *
     * c3.url('//cdn.com/jquery.js').set();
     * -> resolve(true)
     *
     * For FS storage the resulting folder structure will be
     * /cache/simple-url-cache/I1/cdn.com/jquery.js
     * /cache/simple-url-cache/I2/cdn.com/jquery.js
     *
     * @param storageConfig: Either a FileStorageConfig or a RedisStorageConfig
     * @param cacheRules
     */
    constructor(private defaultDomain:string, private instanceName:string, private storageConfig:RedisStorageConfig, private cacheRules:CacheRules) {

        Helpers.isStringDefined(defaultDomain);
        Helpers.isStringDefined(instanceName);
        Helpers.validateCacheConfig(cacheRules);

        if (Helpers.isRedis(storageConfig)) {
            this.type = 'file';
        } else {
            throw new Error('Only Redis is supported');
        }

        if (typeof CacheEngine.pool[this.type] === 'undefined') {
            CacheEngine.pool[this.type] = {};
            CacheEngine.locks[this.type] = {};
        }
        if (typeof CacheEngine.pool[this.type][instanceName] === 'undefined') {
            CacheEngine.pool[this.type][instanceName] = {};
            CacheEngine.locks[this.type][instanceName] = false;
        }

    }

    clearDomain(domain:string):Promise<boolean> {
        if (typeof domain === 'undefined') {
            domain = this.defaultDomain;
        }
        Helpers.isStringDefined(domain);
        return new Promise((resolve, reject) => {
            const instance = this.getInstance();
            instance.clearDomain(domain).then(() => {
                resolve(true);
            }, err => {
                reject(err);
            });
        });
    }

    clearInstance():Promise<boolean> {
        return new Promise((resolve, reject) => {
            const instance = this.getInstance();
            instance.clearCache().then( () => {
                //delete CacheEngine.pool[storageType][instanceName];
                resolve(true);
            }, err => {
                reject(err);
            });
        });
    }

    getStoredHostnames():Promise<string[]> {
        return new Promise((resolve, reject) => {
            const instance = this.getInstance();
            instance.getCachedDomains().then(domains => {
                resolve(domains);
            }, err => {
                reject(err);
            });
        });
    }

    getStoredURLs(domain:string):Promise<string[]> {
        if (typeof domain === 'undefined') {
            domain = this.defaultDomain;
        }
        Helpers.isStringDefined(domain);

        return new Promise((resolve, reject) => {
            const instance = this.getInstance();
            instance.getCachedURLs(domain).then(urls => {
                resolve(urls)
            }, err => {
                reject(err)
            });
        });
    }

    /**
     *
     * @param url Takes the URL, and split it in two, left side is http:   // user:pass @ host.com : 8080, right side is the relative path. Prepend forward slash is missing to the relatve path
     * The left side is used to create a subdirectory for File storage, or a collection for Redis. The Redis collection naming convention is [db_]domain if any db parameter is provided. If no db is provided, then the default domain is used to store url without hostnames.
     * @returns {CacheStorage}
     */
    url(url:string):Cache {

        Helpers.isStringDefined(url);

        let instance:StorageInstance;

        const parsedURL = nodeurl.parse(url);
        let relativeURL = parsedURL.path;
        if (!/\//.test(relativeURL)) {
            relativeURL = '/' + relativeURL;
        }

        parsedURL.pathname = null;
        parsedURL.path = null;
        parsedURL.hash = null;
        parsedURL.query = null;
        parsedURL.search = null;

        let domain = nodeurl.format(parsedURL);

        if (domain === relativeURL) {
            throw new Error('The url ' + url + ' is not valid');
        }

        if (domain.length === 0) {
            debug('This url', url, ' has no domain, using defaultDomain = ', this.defaultDomain);
            domain = this.defaultDomain;
        } else {
            debug('This URL ', url, ' has a domain: ', domain);
        }
        instance = this.getInstance();

        return new Cache(domain, instance, relativeURL);
    }

    private getInstance(): RedisStorageInstance{

        if (typeof CacheEngine.pool[this.type][this.instanceName] === 'undefined') {
            CacheEngine.pool[this.type][this.instanceName] = {};
            CacheEngine.locks[this.type][this.instanceName] = {};
        }

        if (Helpers.isRedis(this.storageConfig)) {
            CacheEngine.pool[this.type][this.instanceName] = new RedisStorageInstance(this.instanceName, this.storageConfig, this.cacheRules);
        }

        return CacheEngine.pool[this.type][this.instanceName];
    }

}

export default CacheEngine;

module.exports = CacheEngine;