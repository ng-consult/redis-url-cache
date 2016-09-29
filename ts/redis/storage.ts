import Cache from './../cache';
import {CacheStorage} from './../interfaces';
import {Promise} from 'es6-promise';
import * as dbug from 'debug';
import RedisStorageInstance from "./instance";

let debug = dbug('simple-url-cache-REDIS');

class RedisStorage extends Cache implements CacheStorage{


    constructor( private _url: string, storageInstance: RedisStorageInstance) {
        super( storageInstance, _url);
        debug('RedisStorage instanciated with url: '+ this._url);
    }

    delete = (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            this.has().then(isCached => {
                if (!isCached) {
                    reject();
                } else {
                    this.getStorageInstance().delete(this._url).then(() => {
                        resolve(true);
                    }, err=> {
                        reject(err);
                    })
                }
            }, err => {
                reject(err);
            })
        });
    };

    has = ():Promise<boolean> => {
        return this.getStorageInstance().has(this._url);
    };

    get = (): Promise<string> => {
        return this.getStorageInstance().get(this._url);
    };

    set = (html: string, force?: boolean): Promise<boolean> => {
        debug('Caching url ', this._url);
        return new Promise((resolve, reject) => {
            if (force === true) {
                let ttl = 0;
                if (this._currentCategory === 'maxAge') {
                    ttl = this._currentMaxAge;
                }
                this.getStorageInstance().set(this._url, html, ttl).then(result => {
                    resolve(result);
                }, err => {
                    reject(err);
                });
                return;
            }
            debug('REDIS FORCE 2');
            if(this._currentCategory === 'never') {
                debug('this url should never been stored');
                resolve(false);
                return;
            }
            this.getStorageInstance().has(this._url).then( has => {
                if(has === true) {
                    debug('This url is already cached - not storing it: ', this._url);
                    resolve(false);
                } else {
                    let ttl = 0;
                    if (this._currentCategory === 'maxAge') {
                        ttl = this._currentMaxAge;
                    }
                    this.getStorageInstance().set(this._url, html, ttl).then(result => {
                        resolve(result);
                    }, err => {
                        reject(err);
                    });
                }
            }, err => {
                reject(err);
            });
        });
    };
}

export default RedisStorage;