import {CacheCategory} from './abstract';
import {FileStorageConfig, CacheRules, CacheStorage} from './interfaces';
import * as path from 'path';
import * as fs from 'fs';
import * as shell from 'shelljs';
import {polyfill} from 'es6-promise';
import * as dbug from 'debug';
let debug = dbug('simple-url-cache-FS');

polyfill();

export default class FileStorage extends CacheCategory implements CacheStorage{

    private _currentFilePath: string;
    public diff: number;
    private _validFile: boolean;
    constructor( private _url: string, private _storageConfig: FileStorageConfig, private _regexRules: CacheRules) {
        super( _url, _regexRules);
        shell.mkdir('-p', this._storageConfig.dir);
        let escaped = this.escape();
        this._validFile = this.validate(escaped);
        this._currentFilePath = path.join( this._storageConfig.dir, escaped );
        debug('FileStorage instanciated with url: '+ this._url);
        debug('_currentFilePath = ', this._currentFilePath);
    }

    private escape = (): string => {
        let escaped = this._url.replace(':', '%3A');
        escaped = escaped.replace('.', '%2E'); //http://stackoverflow.com/questions/3856693/a-url-resource-that-is-a-dot-2e
        escaped = escaped.replace('~', '%7E'); //http://www.w3schools.com/tags/ref_urlencode.asp
        escaped = encodeURIComponent(escaped);
        return escaped;
    };

    private validate = (str): boolean => {
        if (str.length === 0) { return false;}
        if (str.length > 255) { return false;}
        if (typeof str === 'undefined') { return false; }
        return true;
    };

    isCached = (): Promise<boolean> => {
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
                        debug('This url is expired.... removing the cache. ', this._url);
                        resolve(false);
                    } else {
                        debug('This url is cached.', this._url);
                        resolve(true);
                    }
                }
                debug('This url is cached ', this._url);
                resolve(true);
            } else {
                debug('This url is not cached ', this._url);
                resolve(false);
            }
        });
    };

    removeUrl = (): Promise<boolean> => {
        debug('removing url cache: ', this._url);
        return new Promise((resolve, reject) => {
            try {
                fs.unlinkSync( this._currentFilePath );
                resolve(true);
            } catch (e) {
                debug('Error while removing url: ', this._url , e);
                reject(false);
            }
        });
    };

    getUrl = (): Promise<string> => {
        debug('Retrieving url cache: ', this._url);
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

    cache = (html:string, force?: boolean): Promise<boolean> => {

        debug('Caching url ', this._url);
        return new Promise((resolve, reject) => {
            if (!this._validFile ) {
                debug('FILE -> ' + 'invalid REJECTED', this._url);
                reject('invalid URL');
                return;
            }
            else {
                if (force === true) {
                    fs.writeFile( this._currentFilePath, html, 'utf8' , (err) => {
                        if (err) {
                            debug('Error while writing cache.', this._url, err);
                            reject('invalid URL');
                        } else {
                            debug('URL cached sucessfully: ', this._url);
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
                            debug('Won\'t cache the url - category is never.', this._url)
                            resolve(false);
                            return;
                        }
                        fs.writeFile( this._currentFilePath, html, 'utf8', (err) => {
                            if (err) {
                                debug('Error while writing cache.', this._url, err);
                                reject('invalid URL');
                            } else {
                                debug('URL cached sucessfully: ', this._url);
                                resolve(true);
                            }
                        } );
                    }
                });
            }
        });
    };
}