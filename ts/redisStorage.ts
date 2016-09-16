import {CacheCategory} from './abstract';
import {RedisStorageConfig, CacheRules, CacheStorage} from './interfaces';
import {polyfill} from 'es6-promise';
import * as  redis from 'redis';
import * as dbug from 'debug';
import {RedisPool} from './redisPool';

polyfill();
let debug = dbug('simple-url-cache-REDIS');

class RedisStorage extends CacheCategory implements CacheStorage{

    static _redisPool = RedisPool;
    private _conn: redis.RedisClient;
    constructor( private _url: string, private _storageConfig: RedisStorageConfig, private _regexRules: CacheRules) {
        super(_url, _regexRules);
        this._conn = RedisPool.connect(this._storageConfig);
    }

    isRedisOnline = (): boolean => {
        return RedisPool.isOnline();
    };

    isCached = ():Promise<boolean> => {
        return new Promise((resolve, reject) =>{
           this._conn.get(this._url, (err, data) => {
               if (err) {
                   debug('Error while querying is cached on redis: ', this._url, err);
                   reject(err);
               } else {
                   let isCached = data !== null;
                   resolve(isCached);
               }

           });
        });
    };

    removeUrl = (): Promise<boolean> => {
        debug('removing url cache: ', this._url);
        return new Promise((resolve, reject) =>{
            this._conn.del(this._url, (err, data) => {
                if (err) {
                    debug('Error while removing url: ', this._url, err);
                    reject(err);
                }
                resolve(true);
            });
        });
    };

    getUrl = (): Promise<string> => {
        debug('Retrieving url cache: ', this._url);
        return new Promise((resolve, reject) =>{
            this._conn.get(this._url, (err, data) => {
                if(err) {
                    debug('Error while retrieving url: ', this._url, err);
                    reject(err);
                }
                if (data === null) {
                    debug('This url is not cached - and can\'t be retrieved: ', this._url);
                    reject('This url is not cached: ' + this._url);
                } else {
                    resolve(data);
                }
            });
        });
    };

    cache = (html: string, force?: boolean): Promise<boolean> => {
        debug('Caching url ', this._url);
        return new Promise((resolve, reject) =>{
            if (force === true) {
                this._conn.set(this._url, html, (err, result) => {
                    if (err) {
                        debug('Error while storing url in redis: ', this._url, err);
                        reject(err);
                    }
                    if( this._currentCategory === 'maxAge') {
                        this._conn.expire(this._url, this._currentMaxAge, (err) =>{
                            if (err) {
                                debug('Error while setting ttl in redis: ', this._url, err);
                                reject(err);
                            }
                            else {
                                debug('URL cached successfully with ttl = ', this._currentMaxAge, this._url);
                                resolve(true);
                            }
                        });
                    } else {
                        debug('URL cached sucessfully: ', this._url);
                        resolve(true);
                    }

                });
            }
            else{
                this.isCached().then((isCached) =>{
                    if(isCached === true) {
                        debug('This url is already cached - not storing it: ', this._url);
                        resolve(false);
                    }
                    else if (this._currentCategory === 'never') {
                        debug('Won\'t cache the url - category is never.', this._url)
                        resolve(false);
                    }
                    else{
                        this._conn.set(this._url, html, (err, result) => {
                            if (err) {
                                debug('Error while storing url in redis: ', this._url, err);                                reject(err);
                            }
                            if( this._currentCategory === 'maxAge') {
                                this._conn.expire(this._url, this._currentMaxAge, (err) => {
                                    if (err) {
                                        debug('Error while setting ttl in redis: ', this._url, err);
                                        reject(err);
                                    }
                                    else {
                                        debug('URL cached successfully with ttl = ', this._currentMaxAge, this._url);
                                        resolve(true);
                                    }
                                });
                            } else {
                                debug('URL cached sucessfully: ', this._url);
                                resolve(true);
                            }

                        });
                    }
                });
            }
        });
    };


    destroy = (): void => {
        RedisPool.kill();
    };
}

export default RedisStorage;