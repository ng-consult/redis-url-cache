import {CacheCategory} from './abstract';
import {FileStorageConfig, CacheRules, CacheStorage} from './interfaces';
import * as path from 'path';
import * as fs from 'fs';
import * as shell from 'shelljs';
import {polyfill} from 'es6-promise';
polyfill();

export default class FileStorage extends CacheCategory implements CacheStorage{

    private _currentFilePath: string;
    public diff: number;
    constructor( private _url: string, private _storageConfig: FileStorageConfig, private _regexRules: CacheRules) {
        super( _url, _regexRules);
        shell.mkdir('-p', this._storageConfig.dir);
        this._currentFilePath = path.join( this._storageConfig.dir, this._url );
    }

    isCached = () => {
        return new Promise( (resolve, reject) => {
            if (fs.existsSync(this._currentFilePath)) {
                if (this._currentCategory === 'maxAge') {
                    var stats = fs.statSync(this._currentFilePath);
                    var nowTimestamp = new Date().getTime();
                    var modificationTime = stats.mtime.getTime();
                    var expiration = modificationTime + this._currentMaxAge * 1000;
                    var diff = (nowTimestamp - expiration);
                    this.diff = diff;
                    if (diff > 0) {
                        //the file is expired, remove it, then return false;
                        this.removeUrl();
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                }
                resolve(true);
            } else {
                resolve(false);
            }
        });
    };

    removeUrl = () => {
        return new Promise((resolve, reject) => {
            try {
                fs.unlinkSync( this._currentFilePath );
                resolve(true);
            } catch (e) {
                reject(false);
            }
        });
    };

    getUrl() {
        return new Promise((resolve, reject) => {
            this.isCached().then((isCached) => {
                if(!isCached) {
                    reject('This url is not cached: ' + this._url);
                } else{
                    resolve( fs.readFileSync(this._currentFilePath, 'utf8') );
                }
            });
        });
    }

    cache = (html, force) => {

        return new Promise((resolve, reject) => {
            if (force === true) {
                fs.writeFile( this._currentFilePath, html, 'utf8' , function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(true);
                    }
                });
                return;
            }

            this.isCached().then((isCached) => {
                if(isCached) {
                    resolve(false);
                } else{
                    if (this._currentCategory === 'never') {
                        resolve(false);
                        return;
                    }
                    fs.writeFile( this._currentFilePath, html, 'utf8', function(err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(true);
                        }
                    } );
                }
            });


        });
    };
}