import {StorageInstance, CacheRules, RedisStorageConfig} from "./../interfaces";

import {RedisPool} from './pool'
import * as debg from 'debug';
const debug = debg('simple-url-cache-REDIS');
import {Promise} from 'es6-promise';
import Helpers from "../Helpers";

export default class RedisStorageInstance implements StorageInstance {

    private _conn:RedisPool;
    private hashKey;
    private domainHashKey;

    constructor(private domain:string, private instanceName, private config:RedisStorageConfig, private rules:CacheRules) {
        Helpers.CheckType(domain, 'string');
        Helpers.CheckType(instanceName, 'string');
        this._conn = new RedisPool(config);
        this.hashKey = 'simple-url-cache:' + this.instanceName;
        this.domainHashKey = this.domain + ':' + this.instanceName;
    }

    private getKey(key:string):string {
        return this.domainHashKey + ':' + key;
    }

    getCacheRules():CacheRules {
        return this.rules;
    }

    clearAllCache():Promise<boolean> {
        return new Promise((resolve, reject) => {
            const client = this._conn.getConnection();
            debug('Clear all cache called');

            client.hdel(this.hashKey, this.domain, (err) => {
                if(err) reject(err);
                client.hkeys(this.domainHashKey, (err, keys) => {
                    debug('getting keys for ', this.domainHashKey, keys);
                    let nb = 0;
                    if(keys.length === 0) {
                        resolve(true);
                    }
                    
                    keys.forEach( key => {
                        debug('Deleting key ', this.getKey(key));

                        client.del(this.getKey(key), err => {
                            if(err) reject(err);
                            debug('deleting hash key for ', this.domainHashKey, key);
                            client.hdel(this.domainHashKey, key, (err) => {
                                if(err) reject(err);
                                if(++nb === keys.length) {
                                    resolve(true);
                                }
                            });
                        });
                    });
                });
            });
        });
    }

    getAllCachedDomains(): Promise<string[]> {
        return new Promise((resolve, reject)=> {
            debug('getAllCachedDomains called');
            this._conn.getConnection().hkeys(this.hashKey, (err, results) => {
                if(err) reject(err);
                debug('hkeys() ', this.hashKey, results);
                resolve(results);
            })
        })
    }


    getCachedURLs(): Promise<string[]> {
        return new Promise((resolve, reject)=> {
            const client = this._conn.getConnection();
            var urls = [];

            client.hkeys(this.domainHashKey, (err, results) => {
                if(err) reject(err);
                var nb = 0;
                if(results.length ===0) {
                    resolve([]);
                }
                results.forEach( url => {
                    client.get(this.getKey(url), (err, data) => {
                        if(err) reject(err);
                        if(data !== null) {
                            urls.push(url);
                            nb++;
                            if( nb === results.length) {
                                resolve(urls);
                            }
                        } else {
                            client.hdel(this.domainHashKey, url, err => {
                                if(err) reject(err);
                                nb++;
                                if( nb === results.length) {
                                    resolve(urls);
                                }
                            });
                        }
                    });
                });
            });
        });
    }


    /**
     *
     * DEL domain:instance:key
     * HMDEL domain:instance key
     *
     * @param key
     * @returns {Promise|Promise<T>}
     */
    delete(key):Promise<boolean> {
        debug('removing url cache: ', key);
        const client = this._conn.getConnection();

        return new Promise((resolve, reject) => {
            debug('Deleting KEY ', this.getKey(key));

            client.del(this.getKey(key), (err) => {
                if(err) {
                    debug('REDIS ERROR, ', err);
                    reject(err);
                }
                debug('DELETING HASH ', this.domainHashKey);

                client.hdel(this.domainHashKey, key, (err) => {
                    if(err) {
                        debug('REDIS ERROR', err);
                        reject(err);
                    }
                    resolve(true);
                })
            });

        });
    }

    /**
     * This is how internally stuff are trieved in REDIS
     *
     * HMGET domain:instance key
     * -> if not set, not cached
     * -> if set
     *      GET domain:instance:key
     *      -> if set, cached
     *      -> if not set, not cached
     *          HMDEL domain:instance key
     * @param key
     * @returns {Promise|Promise<T>}
     */
    get(key):Promise<string> {
        debug('Retrieving url cache: ', key);
        return new Promise((resolve, reject) => {
            const client = this._conn.getConnection();

            client.hget(this.domainHashKey, key, (err, content) => {
                if (err) reject(err);
                if (content === null) {
                    reject(null);
                }
                client.get(this.getKey(key), (err, timestamp) => {
                    if (err) reject(err);
                    if (timestamp === null) {
                        //todo->delete
                        client.hdel(this.domainHashKey, this.getKey(key), (err) => {
                            if (err) reject(err);
                            reject(null);
                        });
                    } else {
                        resolve(content);
                    }
                })
            });


        });
    }

    /**
     * GET domain:instance:key
     *  -> if not set
 *      HDEL domain:instance key
     * @param key
     * @returns {Promise|Promise<T>}
     */
    has(key):Promise<boolean> {
        return new Promise((resolve, reject) => {
            const client = this._conn.getConnection();
            client.get(this.getKey(key), (err, data) => {
                if (err) {
                    debug('Error while querying is cached on redis: ', key, err);
                    reject(err);
                } else {
                    let isCached = data !== null;
                    debug('HAS, key ', this.getKey(key), 'is cached? ', isCached);
                    if(!isCached) {
                        client.hdel(this.domainHashKey, key, (err) => {
                            debug('hdel executed', this.domainHashKey, key);
                            if(err) {
                                reject(err);
                            }
                            resolve(false)
                        });
                    } else {
                        resolve(true);
                    }
                }
            });
        });
    }

    /**
     * HMSET simple-url-cache:instance domain "domain:instance"
     * HMSET domain:instance key value
     * -> if 0, then resolve(true)
     *      HGET domain:instance:key
     *      -> if set, don't update the ttl neither the creation time
     *      -> if not set
     *          HSET domain:instance:key timestamp
     *          if (ttl)
     *          HEXPIRE domain:instance:key ttl
     *
     * @param key
     * @param value
     * @param ttl
     * @returns {Promise|Promise<T>}
     */
    set(key, value, ttl):Promise<boolean> {
        return new Promise((resolve, reject) => {
            const client = this._conn.getConnection();

            client.hset(this.hashKey, this.domain, this.domain, (err, result) => {
                if (err) {
                    reject(err)
                } else{
                    client.hset(this.domainHashKey, key, value, (err, exists) => {
                        if (err) {
                            reject(err);
                        }
                        if(exists === 0) {
                            debug('Already set ');
                            resolve(true);
                            return;
                        }else {
                            client.get(this.getKey(key), (err, result) => {
                                if (err) {reject(err);return;}
                                if (result === null) {
                                    debug('REDIS timestamp not set');
                                    client.set(this.getKey(key), Date.now(), (err) => {
                                        if (err) {reject(err);return;}
                                        if (ttl > 0) {
                                            client.expire(this.getKey(key), ttl, (err) => {
                                                if (err) reject(err);
                                                resolve(true);
                                            });
                                        } else{
                                            resolve(true);
                                        }
                                    })
                                } else {
                                    if (ttl > 0) {
                                        client.expire(this.getKey(key), ttl, (err) => {
                                            if (err) reject(err);
                                            resolve(true);
                                        });
                                    } else {
                                        resolve(true);
                                    }
                                }

                            });
                        }

                    });
                }
                
            });
        });
    }

    destroy() {
        this._conn.kill();
    }
}
