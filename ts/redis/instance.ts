import {StorageInstance, CacheRules, RedisStorageConfig} from "./../interfaces";
import {RedisPool} from './pool'
import * as debg from 'debug';
const debug = debg('simple-url-cache-REDIS');
import {Promise} from 'es6-promise';

export default class RedisStorageInstance extends StorageInstance {

    private _conn:RedisPool;
    private hashKey;

    constructor(instanceName, private config:RedisStorageConfig, private rules:CacheRules) {
        super(instanceName, config);
        this.validateStorageConfig();
        this.hashKey = 'simple-url-cache:' + this.instanceName;
    }

    clearCache():Promise<boolean> {
        return new Promise((resolve, reject) => {
            const client = this._conn.getConnection();
            const batch = client.batch();

            client.hkeys(this.hashKey, (err, domains) => {
                debug(err);
                if(err) reject(err);
                debug('Domains found = ', domains);
                if(domains.length === 0) {
                    resolve(true);
                }
                var nb = 0;

                domains.forEach( domain => {
                    batch.del(this.getDomainHashKey(domain));
                    batch.hdel(this.hashKey, domain);
                    client.hkeys(this.getDomainHashKey(domain), (err, keys) => {
                        debug('keys = ', keys);
                        keys.forEach(key => {
                            batch.del(this.getUrlKey(domain, key));
                        });
                        nb++;
                        if(nb === domains.length) {
                            batch.exec(err => {
                                debug(err);
                                if(err) reject(err);
                                resolve(true);
                            });
                        }
                    });
                });
            });
        });
    }

    clearDomain(domain: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const client = this._conn.getConnection();
            debug('Clear all cache called');

            client.hdel(this.hashKey, domain, (err) => {
                if(err) reject(err);
                client.hkeys(this.getDomainHashKey(domain), (err, urls) => {
                    debug('getting keys for ', this.getDomainHashKey(domain), urls);
                    let nb = 0;
                    if(urls.length === 0) {
                        resolve(true);
                    }
                    let promises = [];
                    urls.forEach( url => {
                        debug('Deleting key ', this.getUrlKey(domain, url));

                        promises.push(this.delete(domain, url));
                        Promise.all(promises).then(() => {
                            resolve(true);
                        }, err => {
                            reject(err);
                        });

                    });
                });
            });
        });
    }

    getCachedDomains(): Promise<string[]> {
        return new Promise((resolve, reject)=> {
            debug('getAllCachedDomains called');
            this._conn.getConnection().hkeys(this.hashKey, (err, results) => {
                if(err) reject(err);
                debug('hkeys() ', this.hashKey, results);
                resolve(results);
            })
        })
    }

    getCacheRules():CacheRules {
        return this.rules;
    }

    getCachedURLs(domain: string): Promise<string[]> {
        return new Promise((resolve, reject)=> {
            const client = this._conn.getConnection();
            var cachedUrls = [];
            var promises = [];
            client.hkeys(this.getDomainHashKey(domain), (err, urls) => {
                if(err) reject(err);
                if(urls.length ===0) {
                    resolve(cachedUrls);
                }

                debug('found these urls in ', this.getDomainHashKey(domain));
                urls.forEach( url => {

                    promises.push(client.get(this.getUrlKey(domain, url), (err, data) => {
                        if(err) reject(err);
                        debug('for url, got content ', url, data);
                        if(data !== null) {
                            cachedUrls.push(url);
                        } else {
                            client.hdel(this.getDomainHashKey(domain), url, err => {
                                if(err) reject(err);
                            });
                        }
                    }));

                    Promise.all(promises).then(() => {
                        resolve(cachedUrls);
                    }, err => {
                        reject(err);
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
     */
    delete(domain: string, url: string):Promise<boolean> {
        debug('removing url cache: ', domain, url);
        const client = this._conn.getConnection();
        return new Promise((resolve, reject) => {
            this.has(domain, url).then(isCached => {
                if (!isCached) {
                    reject();
                } else {
                    client.del(this.getUrlKey(domain, url), (err) => {
                        if(err) {
                            debug('REDIS ERROR, ', err);
                            reject(err);
                        }
                        debug('DELETING HASH ', this.getDomainHashKey(domain));

                        client.hdel(this.getDomainHashKey(domain), url, (err) => {
                            if(err) {
                                debug('REDIS ERROR', err);
                                reject(err);
                            }
                            resolve(true);
                        });
                    });
                }
            }, err => {
                reject(err);
            })
        });
    }

    destroy() {
        this._conn.kill();
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
     */
    get(domain: string, url:string):Promise<string> {
        debug('Retrieving url cache: ', domain, url);
        return new Promise((resolve, reject) => {
            const client = this._conn.getConnection();

            client.hget(this.getDomainHashKey(domain), url, (err, content) => {
                if (err) reject(err);
                if (content === null) {
                    reject(null);
                }
                client.get(this.getUrlKey(domain, url), (err, timestamp) => {
                    if (err) reject(err);
                    if (timestamp === null) {
                        //todo->delete
                        client.hdel(this.getDomainHashKey(domain), this.getUrlKey(domain, url), (err) => {
                            if (err) reject(err);
                            reject(null);
                        });
                    } else {
                        resolve(content);
                    }
                });
            });


        });
    }

    /**
     * GET domain:instance:key
     *  -> if not set
 *      HDEL domain:instance key
     */
    has(domain, url):Promise<boolean> {
        return new Promise((resolve, reject) => {
            const client = this._conn.getConnection();
            client.get(this.getUrlKey(domain, url), (err, data) => {
                if (err) {
                    debug('Error while querying is cached on redis: ', domain, url, err);
                    reject(err);
                } else {
                    let isCached = data !== null;
                    debug('HAS, key ', this.getUrlKey(domain, url), 'is cached? ', isCached);
                    if(!isCached) {
                        client.hdel(this.getDomainHashKey(domain), url, (err) => {
                            debug('hdel executed', this.getDomainHashKey(domain), url);
                            if(err) {
                                reject(err);
                            }
                            resolve(false);
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
     */
    set(domain, url, value, category, ttl, force):Promise<boolean> {
        const client = this._conn.getConnection();

        return new Promise((resolve, reject) => {
            if (force === true) {
                let ttl = 0;

                this.store(domain, url, value, ttl, force).then(result => {
                    resolve(result);
                }, err => {
                    reject(err);
                });
                return;
            }
            if(category === 'never') {
                debug('this url should never been stored');
                resolve(false);
                return;
            }
            this.has(domain, url).then( has => {
                if(has === true) {
                    debug('This url is already cached - not storing it: ', domain, url);
                    resolve(false);
                } else {

                    this.store(domain, url, value, ttl, force).then(result => {
                        resolve(result);
                    }, err => {
                        reject(err);
                    });
                }
            }, err => {
                reject(err);
            });
        });

    }

    private getDomainHashKey(domain): string {
        return this.hashKey + ':' + domain;
    }

    private store(domain: string, url: string, value: string, ttl: number, force: boolean) {
        const client = this._conn.getConnection();
        return new Promise((resolve, reject) => {
            client.hset(this.hashKey, domain, domain, (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    client.hset(this.getDomainHashKey(domain), url, value, (err, exists) => {
                        if (err) {
                            reject(err);
                        }
                        if (exists === 0) {
                            debug('Already set ');
                            resolve(true);
                            return;
                        } else {
                            client.get(this.getUrlKey(domain, url), (err, result) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                if (result === null) {
                                    debug('REDIS timestamp not set');
                                    client.set(this.getUrlKey(domain, url), Date.now(), (err) => {
                                        if (err) {
                                            reject(err);
                                            return;
                                        }
                                        if (ttl > 0) {
                                            client.expire(this.getUrlKey(domain, url), ttl, (err) => {
                                                if (err) reject(err);
                                                resolve(true);
                                            });
                                        } else {
                                            resolve(true);
                                        }
                                    })
                                } else if(force === true){
                                    if (ttl > 0) {
                                        client.expire(this.getUrlKey(domain, url), ttl, (err) => {
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

    private validateStorageConfig() {
        this._conn = new RedisPool(this.config);
    }

    private getUrlKey(domain: string, url:string):string {
        return this.getDomainHashKey(domain) + ':' + url;
    }


}
