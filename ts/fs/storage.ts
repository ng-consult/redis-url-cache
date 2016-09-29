import Cache from './../cache';
import {CacheStorage} from './../interfaces';
import * as fs from 'fs-extra';
import {Promise} from 'es6-promise';
import * as dbug from 'debug';
import FileStorageInstance from "./instance";
let debug = dbug('simple-url-cache-FS');

export default class FileStorage extends Cache implements CacheStorage{

    public diff: number;

    private _currentFilePath;

    constructor( private _url: string, storageInstance: FileStorageInstance) {
        super( storageInstance, _url);
        this._currentFilePath = storageInstance.getFilePath(this._url);
    }

    delete = (): Promise<boolean> => {
        return this.getStorageInstance().delete(this._currentFilePath);
    };

    get = (): Promise<string> => {
        return this.getStorageInstance().get(this._currentFilePath);
    };

    has = (): Promise<boolean> => {

        return new Promise( (resolve, reject) => {
            this.getStorageInstance().has(this._currentFilePath).then(exists => {
                if(exists) {
                    if (this._currentCategory === 'maxAge') {
                        var stats = fs.statSync(this._currentFilePath);
                        var nowTimestamp = new Date().getTime();
                        var modificationTime = stats.mtime.getTime();
                        var expiration = modificationTime + this._currentMaxAge * 1000;
                        var diff = (nowTimestamp - expiration);
                        this.diff = diff;
                        if (diff > 0) {
                            //the file is expired, remove it, then return false;
                            debug('This url is expired.... removing the cache. ', this._currentFilePath);
                            this.getStorageInstance().delete(this._currentFilePath).then( ok =>{
                                resolve(false);
                            }, err => {
                                reject(err);
                            } );
                        } else {
                            debug('This url is cached.', this._currentFilePath);
                            resolve(true);
                        }
                    } else {
                        debug('This url is cached ', this._currentFilePath);
                        resolve(true);
                    }
                } else {
                    resolve(false);
                }
            }, e => {
                reject(e);
            });
        });
    };

    set = (html:string, force?: boolean): Promise<boolean> => {

        return new Promise((resolve, reject) => {

            if (force === true) {
                this.getStorageInstance().set(this._currentFilePath, html).then(()=> {
                    resolve(true);
                }, err => {
                    reject(err);
                });
                return;
            }
            if(this._currentCategory === 'never') {
                debug('this url should never been stored');
                resolve(false);
                return;
            }
            this.getStorageInstance().has(this._currentFilePath).then( has => {
                if (has) {
                    resolve(false)
                }
                this.getStorageInstance().set(this._currentFilePath, html).then(result=> {
                    resolve(result);
                }, err => {
                    reject(err);
                });
            }, err => {
                reject(err);
            });
        });
    };

}