import {CacheRules, CallBackGetResultsParam, CallBackBooleanParam, CallBackStringArrayParam, CallBackStringParam} from "./../interfaces";
import {RedisPool} from './pool';
import * as redis from 'redis';
import * as debg from 'debug';
import Instance from "../instance";
import CacheEngine from "../cacheEngine/CacheEngine";
import {StorageCB} from "../abstract/storage";
const debug = debg('redis-url-cache-REDIS');

export default class RedisStorageCB extends StorageCB {

    private _conn: redis.RedisClient;
    private hashKey;

    constructor(public instance: Instance) {
        super();
        this._conn = RedisPool.getConnection(instance.getInstanceName());
        this.hashKey = CacheEngine.hashKey + this.instance.getInstanceName();
        this.method = 'callback';
    }

    clearCache(cb:Function):void {
        const batch = this._conn.batch();

        this._conn.hkeys(this.hashKey, (err, domains) => {
            debug(err);
            if (err) return cb(err);

            if (domains.length === 0) {
                return cb(null, true);
            }
            var nb = 0;

            domains.forEach(domain => {
                batch.del(this.getDomainHashKey(domain));
                batch.hdel(this.hashKey, domain);
                this._conn.hkeys(this.getDomainHashKey(domain), (err, keys) => {
                    debug('keys = ', keys);
                    keys.forEach(key => {
                        batch.del(this.getUrlKey(domain, key));
                    });
                    nb++;
                    if (nb === domains.length) {
                        batch.exec(err => {
                            debug(err);
                            if (err) return cb(err);
                            return cb(null, true);
                        });
                    }
                });
            });
        });

    }

    clearDomain(domain:string, cb:Function):void {

        //debug('Clear all cache called');

        this._conn.hdel(this.hashKey, domain, (err) => {
            if (err) return cb(err);
            this._conn.hkeys(this.getDomainHashKey(domain), (err, urls) => {
                //debug('getting keys for ', this.getDomainHashKey(domain), urls);
                if (urls.length === 0) {
                    return cb(null, true);
                }

                let nb = 0;
                urls.forEach(url => {
                    //debug('Deleting key ', this.getUrlKey(domain, url));

                    this.delete(domain, url, null, null, (err) => {
                        if (err) return cb(err);
                        nb++;
                        if (nb === urls.length) {
                            cb(null, true);
                        }
                    });
                });
            });
        });

    }

    getCachedDomains(cb:CallBackStringArrayParam):void {
        //debug('getAllCachedDomains called');
        this._conn.hkeys(this.hashKey, (err, results) => {
            if (err) return cb(err);
            //debug('hkeys() ', this.hashKey, results);
            return cb(null, results);
        });
    }

    getCachedURLs(domain:string, cb:CallBackStringArrayParam): void {
        var cachedUrls = [];

        this._conn.hkeys(this.getDomainHashKey(domain), (err, urls) => {
            if (err) return cb(err);
            if (urls.length === 0) {
                return cb(null, cachedUrls);
            }

            //debug('found these urls in ', this.getDomainHashKey(domain), urls);
            let nb = 0;

            urls.forEach(url => {
                this._conn.get(this.getUrlKey(domain, url), (err, data) => {
                    if (err) return cb(err);
                    //debug('for url, got content ', url, data);
                    if (data !== null) {
                        cachedUrls.push(url);
                        nb++;
                        if (nb === urls.length) {
                            return cb(null, cachedUrls);
                        }
                    } else {
                        this._conn.hdel(this.getDomainHashKey(domain), url, err => {
                            if (err) return cb(err);
                            nb++;
                            if (nb === urls.length) {
                                return cb(null, cachedUrls);
                            }
                        });
                    }
                });

            });
        });
    }

    getCacheRules(): CacheRules {
        return this.instance.getManager().getRules();
    }

    /**
     *
     * DEL domain:instance:key
     * HMDEL domain:instance key
     *
     */
    delete(domain:string, url:string, category, ttl,  cb: CallBackBooleanParam):void {
        //debug('removing url cache: ', domain, url);
        this.has(domain, url, category, ttl, (err, isCached) => {
            if (!isCached) {
                return cb('url is not cached');
            } else {
                this._conn.del(this.getUrlKey(domain, url), (err) => {
                    if (err) {
                        //debug('REDIS ERROR, ', err);
                        return cb(err);
                    }
                    //debug('DELETING HASH ', this.getDomainHashKey(domain));

                    this._conn.hdel(this.getDomainHashKey(domain), url, (err) => {
                        if (err) {
                            //debug('REDIS ERROR', err);
                            return cb(err);
                        }
                        return cb(null, true);
                    });
                });
            }
        });
    }

    destroy() {
        RedisPool.kill(this.instance.getInstanceName());
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
    get(domain: string, url: string, category, ttl, cb:CallBackGetResultsParam):void {
        //debug('Retrieving url cache: ', domain, url);
        this._conn.hget(this.getDomainHashKey(domain), url, (err, content: string) => {
            if (err) return cb(err);
            if (content === null) {
                return cb('url not cached');
            }

            this._conn.get(this.getUrlKey(domain, url), (err, data: string) => {
                if (err) return cb(err);
                if (data === null) {
                    //todo->delete
                    this._conn.hdel(this.getDomainHashKey(domain), this.getUrlKey(domain, url), (err) => {
                        if (err) return cb(err);
                        return cb('url not cached - cleaning timestamp informations');
                    });
                } else {
                    const deserializedContent = JSON.parse(data);
                    return cb(null, { content: content, createdOn: deserializedContent.timestamp, extra: deserializedContent.extra });
                }
            });
        });
    }

    /**
     * GET domain:instance:key
     *  -> if not set
     *      HDEL domain:instance key
     */
    has(domain, url, category, ttl,  cb:Function):void {

        this._conn.get(this.getUrlKey(domain, url), (err, data) => {
            if (err) {
                debug('Error while querying is cached on redis: ', domain, url, err);
                return cb(err);
            } else {
                let isCached = data !== null;
                //debug('HAS, key ', this.getUrlKey(domain, url), 'is cached? ', isCached);
                if (!isCached) {
                    this._conn.hdel(this.getDomainHashKey(domain), url, (err) => {
                        //debug('hdel executed', this.getDomainHashKey(domain), url);
                        if (err) return cb(err);
                        return cb(null, false);
                    });
                } else {
                    return cb(null, true);
                }
            }
        });

    }

    /**
     * HMSET debug-url-cache:instance domain "domain:instance"
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
    set(domain, url, value, extra: Object, category, ttl, force, cb:CallBackBooleanParam):void {
        if (force === true) {
            this.store(domain, url, value, extra, ttl, (err, result) => {
                if (err) return cb(err);
                return cb(null, result);
            });
        }
        else if (category === 'never') {
            //debug('this url should never been stored');
            return cb(null, false);
        }
        else {
            this.has(domain, url, category, ttl, (err, has) => {
                if (err) return cb(err);
                if (has === true) {
                    //debug('This url is already cached - not storing it: ', domain, url);
                    return cb(null, false);
                } else {
                    this.store(domain, url, value, extra, ttl, (err, result) => {
                        if(err) return cb(err);
                        return cb(null, result);
                    });
                }
            });
        }
    };

    private getDomainHashKey(domain):string {
        return this.hashKey + ':' + domain;
    }

    private store(domain:string, url:string, value:string, extra: Object,  ttl:number, cb:CallBackBooleanParam) {

        this._conn.hset(this.hashKey, domain, domain, (err) => {
            if (err) {
                return cb(err)
            } else {
                this._conn.hset(this.getDomainHashKey(domain), url, value, (err, exists) => {
                    if (err) {
                        return cb(err);
                    }

                    this._conn.set(this.getUrlKey(domain, url), JSON.stringify({timestamp:Date.now(), extra: extra}), (err) => {
                        if (err) return cb(err);
                        if (ttl > 0) {
                            this._conn.expire(this.getUrlKey(domain, url), ttl, (err) => {
                                if (err) return cb(err);
                                return cb(null, true);
                            });
                        } else {
                            return cb(null, true);
                        }
                    });
                });
            }
        });
    }

    private getUrlKey(domain:string, url:string):string {
        return this.getDomainHashKey(domain) + ':' + url;
    }

}

