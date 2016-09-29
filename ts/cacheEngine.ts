import FileStorage from './fs/storage';
import RedisStorage from './redis/storage';

import {Promise} from 'es6-promise';
import {CacheRules, CacheStorage, StorageInstance, FileStorageConfig, RedisStorageConfig} from './interfaces';
import FileStorageInstance from "./fs/instance";
import RedisStorageInstance from "./redis/instance";
import * as nodeurl from 'url';
import Helper from './Helpers';

import * as dbug from 'debug';
let debug = dbug('simple-url-cache');



class CacheEngine {

    static pool:any = {};

    private type: string;
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
    constructor(private defaultDomain:string, private instanceName:string, private storageConfig:RedisStorageConfig | FileStorageConfig, private cacheRules:CacheRules) {

        Helper.CheckType(defaultDomain, 'string');
        Helper.CheckType(instanceName, 'string');

        try {
            Helper.IsSet('cacheRules', cacheRules);
            Helper.CheckType(cacheRules.default, 'string');
            Helper.CheckType(cacheRules.cacheAlways, Array);
            Helper.CheckType(cacheRules.cacheNever, Array);
            Helper.CheckType(cacheRules.cacheMaxAge, Array);
            cacheRules.cacheAlways.forEach(function (rule) {
                Helper.CheckType(rule.regex, RegExp);
            });
            cacheRules.cacheNever.forEach(function (rule) {
                Helper.CheckType(rule.regex, RegExp);
            });
            cacheRules.cacheMaxAge.forEach(function (rule) {
                Helper.CheckType(rule.regex, RegExp);
                Helper.CheckType(rule.maxAge, 'number');
            });
        } catch (e) {
            Helper.Error('The cacheRules is invalid', cacheRules);
        }

        if(this.isFS(storageConfig)) {
            this.type = 'file';
        } else {
            this.type = 'redis';
        }

        if(typeof CacheEngine.pool[this.type] === 'undefined') {
            CacheEngine.pool[this.type] = {};
        }
        if (typeof CacheEngine.pool[this.type][instanceName] === 'undefined') {
            CacheEngine.pool[this.type][instanceName] = {};
        }

    }

    private isFS(storageConfig:RedisStorageConfig | FileStorageConfig):storageConfig is FileStorageConfig {
        return typeof (<FileStorageConfig>storageConfig).dir !== 'undefined';
    }

    private getInstance(domain):RedisStorageInstance | FileStorageInstance {

        if (typeof CacheEngine.pool[this.type][this.instanceName][domain] === 'undefined') {

            if(this.isFS(this.storageConfig)) {
                CacheEngine.pool[this.type][this.instanceName][domain] = new FileStorageInstance(domain, this.instanceName, this.storageConfig, this.cacheRules);
            } else {
                CacheEngine.pool[this.type][this.instanceName][domain] = new RedisStorageInstance(domain, this.instanceName, this.storageConfig, this.cacheRules);
            }
        }

        return CacheEngine.pool[this.type][this.instanceName][domain];
    }

    /**
     * Delete all cached domains and associated URLs.
     * resolved to true when ok,
     * rejects an Error if any thrown
     * @returns {Promise|Promise<T>}
     */
    clearAllDomains():Promise<boolean> {
        const instance = this.getInstance(this.defaultDomain);
        var tmpInstance;

        return new Promise((resolve, reject) => {
            instance.getAllCachedDomains().then(domains=> {
                const nbDomains = domains.length;
                let nb = 0;
                domains.forEach(domain => {
                    tmpInstance = this.getInstance(domain);
                    tmpInstance.clearAllCache().then(()=> {
                        nb++;
                        if (nb === nbDomains) {
                            resolve(true);
                        }
                    }, err => {
                        reject(err);
                    });
                });
            }, err => {
                reject(err);
            })
        });
    }

    /**
     * Delete all cached URL associated with this domain
     * Resolve to true if ok,
     * Reject an error if any
     * @param domain
     * @returns {Promise<booleandelete>}
     */
    clearDomain(domain?:string):Promise<boolean> {
        if (typeof domain === 'undefined') {
            domain = this.defaultDomain;
        }
        return this.getInstance(domain).clearAllCache();
    }

    /**
     * resolve to an array of cached domains
     * reject an error if any
     * @returns {Promise<string[]delete>}
     */
    getCachedDomains():Promise<string[]> {
        const instance = this.getInstance(this.defaultDomain);
        return instance.getAllCachedDomains();
    }

    getCachedURLs(domain):Promise<string[]> {
        if (typeof domain === 'undefined') {
            domain = this.defaultDomain;
        }
        const instance = this.getInstance(domain);
        return instance.getCachedURLs();
    }

    /**
     * Enumerates all the stored URLs names,
     * results has the following format :
     * {
     *  'domain1': [ url1, url2, url3 ...],
     *  'domain2': [ url1, url2, url3 ...],
     *  ....
     * }
     * @returns {Promise|Promise<T>}
     */
    getAllCachedURLs():Promise<string[][]> {
        return new Promise((resolve, reject) => {
            var urls = {};
            this.getCachedDomains().then(domains => {
                let nb = 0;
                domains.forEach(domain => {
                    this.getCachedURLs(domain).then(result => {
                        urls[domain] = result;
                        if (++nb === domains.length) {
                            resolve(urls);
                        }
                    }, err => {
                        reject(err);
                    })
                })
            }, err => {
                reject(err);
            })
        });
    }


    /**
     *
     * @param url Takes the URL, and split it in two, left side is http:   // user:pass @ host.com : 8080, right side is the relative path. Prepend forward slash is missing to the relatve path
     * The left side is used to create a subdirectory for File storage, or a collection for Redis. The Redis collection naming convention is [db_]domain if any db parameter is provided. If no db is provided, then the default domain is used to store url without hostnames.
     * @returns {CacheStorage}
     */
    url(url:string):CacheStorage {

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

        const domain = nodeurl.format(parsedURL);

        if (domain === relativeURL) {
            throw new Error('The url ' + url + ' is not valid');
        }

        if (domain.length === 0) {
            debug('This url', url, ' has no domain, using defaultDomain = ', this.defaultDomain);
            instance = this.getInstance(this.defaultDomain);
        } else {
            debug('This URL ', url, ' has a domain: ', domain);
            instance = this.getInstance(domain);
        }

        if (instance instanceof FileStorageInstance) {
            return new FileStorage(relativeURL, instance);
        } else if (instance instanceof RedisStorageInstance) {
            return new RedisStorage(relativeURL, instance);
        }
    }
};

export default  CacheEngine;

module.exports = CacheEngine;