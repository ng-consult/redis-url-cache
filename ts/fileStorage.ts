import {CacheCategory} from './abstract';
import {FileStorageConfig, CacheRules, CacheStorage} from './interfaces';
import * as path from 'path';
import * as fs from 'fs-extra';
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
        try{
            fs.mkdirsSync(this._storageConfig.dir);
        } catch(e) {
            debug("Error creating dir", e);
            throw new Error('Erro while creating dir ' + this._storageConfig.dir + 'err=' + e);
        }

        this._validFile = this.validate(this.escape());
        this._currentFilePath = path.join( this._storageConfig.dir, this.escape() );
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

    private validate = (str: string): boolean => {
        if (str.length === 0) { return false;}
        if (str.length > 255) { return false;}
        if (typeof str === 'undefined') { return false; }
        return true;
    };

    isCached = (): Promise<boolean|string> => {

        return new Promise( (resolve, reject) => {
            try {
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
                            debug('This url is expired.... removing the cache. ', this._url);
                            this.removeUrl().then((result) =>{
                                resolve(false);
                            }, function(err) {
                                reject(err);
                            });
                        } else {
                            debug('This url is cached.', this._url);
                            resolve(true);
                        }
                    } else {
                        debug('This url is cached ', this._url);
                        resolve(true);
                    }
                } else {
                    debug('This url is not cached ', this._url);
                    resolve(false);
                }
            } catch(e) {
                debug('Error while fs.existSync', e );
                reject(e);
            }
        });
    };

    removeUrl = (): Promise<boolean|string> => {
        debug('removing url cache: ', this._url);
        return new Promise((resolve, reject) => {
            try {
                fs.unlinkSync( this._currentFilePath );
                debug('seems like removed ok');
                resolve(true);
            } catch (e) {
                debug('Error while removing url: ', this._url , e);
                reject(e);
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

    cache = (html:string, force?: boolean): Promise<boolean|string> => {

        debug('Caching url ', this._url);
        return new Promise((resolve, reject) => {
            if (!this._validFile ) {
                debug('FILE -> ' + 'invalid REJECTED', this._url);
                reject('invalid URL3: ' + this.escape()+ this.validate(this.escape()));
                return;
            }
            else {
                if (force === true) {
                    fs.writeFile( this._currentFilePath, html, 'utf8' , (err) => {
                        if (err) {
                            debug('Error while writing cache.', this._url, err);
                            reject('invalid URL2: ' + this.escape()+ this.validate(this.escape()));
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
                                reject('Error while writing cache.' +  this._currentFilePath + ', err = ' + err);
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


    destroy = ():void => {}
}