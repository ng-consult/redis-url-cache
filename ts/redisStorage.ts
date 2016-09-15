import {CacheCategory} from './abstract';
import {RedisStorageConfig, CacheRules, CacheStorage} from './interfaces';
import {redis_connection} from './redisPool';
import {polyfill} from 'es6-promise';
polyfill();

export default class RedisStorage extends CacheCategory implements CacheStorage{

    private _redisConnection: any;
    private _redisOnline: boolean;

    constructor( private _url: string, private _storageConfig: RedisStorageConfig, private _regexRules: CacheRules) {
        super(_url, _regexRules);
        this._redisOnline = false;
        this._redisConnection = redis_connection('CACHE', this._storageConfig);
        this._redisConnection.on('connect', () => {
            this._redisOnline = true;
            console.log('REDIS CONNECTED');
        });
        console.log('RedisStorage called ONCE');

    }

    isRedisOnline = () => {
        return this._redisOnline;
    };

    isCached = () => {
        return new Promise((resolve, reject) =>{
           this._redisConnection.get(this._url, (err, data) => {
               if (err) {
                   console.error(err);
                   reject(err);
               } else {
                   let isCached = data !== null;
                   resolve(isCached);
               }

           });
        });
    };

    removeUrl = () => {
        return new Promise((resolve, reject) =>{
            this._redisConnection.del(this._url, (err, data) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(true);
            });
        });
    };

    getUrl = () => {
        return new Promise((resolve, reject) =>{
            this._redisConnection.get(this._url, (err, data) => {
                if(err) {
                    console.error(err);
                    reject(err);
                }
                if (data === null) {
                    reject('This url is not cached: ' + this._url);
                } else {
                    resolve(data);
                }
            });
        });
    };

    cache = (html, force) => {
        return new Promise((resolve, reject) =>{
            if (force === true) {
                this._redisConnection.set(this._url, html, (err, result) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    }
                    if( this._currentCategory === 'maxAge') {
                        this._redisConnection.expires(this._url, this._currentMaxAge, function(err) {
                            if (err) {
                                console.error(err);
                                reject(err);
                            }
                            else {
                                resolve(true);
                            }
                        });
                    } else {
                        resolve(true);
                    }

                });
            }
            else{
                this.isCached().then((isCached) =>{
                    if(isCached === true) {
                        resolve(false);
                    }
                    else if (this._currentCategory === 'never') {
                        resolve(false);
                    }
                    else{
                        this._redisConnection.set(this._url, html, (err, result) => {
                            if (err) {
                                console.error(err);
                                reject(err);
                            }
                            if( this._currentCategory === 'maxAge') {
                                this._redisConnection.expire(this._url, this._currentMaxAge, function(err) {
                                    if (err) {
                                        console.error(err);
                                        reject(err);
                                    }
                                    else {
                                        resolve(true);
                                    }
                                });
                            } else {
                                resolve(true);
                            }

                        });
                    }
                });
            }
        });
    };
}