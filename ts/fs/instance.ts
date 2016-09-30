import {Promise} from 'es6-promise';
import {StorageInstance, CacheRules, FileStorageConfig} from "./../interfaces";
import * as fs from 'fs-extra';
import * as path from 'path';
import * as debg from 'debug';
import Helpers from './../helpers';
const debug = debg('simple-url-cache-FS');

export default class FileStorageInstance extends StorageInstance {

    private baseDir;
    static filePaths = {};

    constructor(instanceName:string, private config:FileStorageConfig, private rules:CacheRules) {
        super(instanceName, config);
        debug('Creating a new FileStorage Instance with instancename ', instanceName);
        this.validateStorageConfig();
    }

    clearCache():Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                if (!fs.existsSync(this.baseDir)) {
                    resolve(true);
                }
                try{
                    fs.removeSync(this.baseDir);
                    resolve(true);
                } catch(e) {
                    reject(e);
                }
            } catch (e) {
                debug('error while emptying directory', this.baseDir, e);
                reject(e);
            }
        });
    }

    getCachedDomains():Promise<string[]> {
        return new Promise((resolve, reject) => {
            try {
                if (!fs.existsSync(this.baseDir)) {
                    resolve([]);
                }
                const list = fs.readdirSync(path.resolve(path.join(this.config.dir, Helpers.escapeURL(this.instanceName))));
                if (list.length === 0) {
                    ;
                    resolve([]);
                }
                const results = [];
                list.forEach((dir) => {
                    results.push(Helpers.unescapeURL(dir));
                });
                resolve(results);
            } catch (e) {
                debug('Error while reading dir', this.config.dir);
                reject(e);
            }
        });
    }

    getCacheRules():CacheRules {
        return this.rules;
    }

    getCachedURLs(domain: string):Promise<string[]> {
        return new Promise((resolve, reject) => {
            try {
                if (!fs.existsSync(this.getFileDir(domain))) {
                    resolve([]);
                }
                let list = fs.readdirSync(this.getFileDir(domain));
                for (var i in list) {
                    list[i] = Helpers.unescapeURL(list[i]);
                }
                resolve(list);
            } catch (e) {
                debug('Error while reading dir', this.baseDir);
                reject(e);
            }
        });
    }

    delete(domain:string, url:string):Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                fs.unlinkSync(this.getFilePath(domain, url));
                resolve(true);
            } catch (e) {
                reject(e);
            }
        });
    }

    clearDomain(domain: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                if (fs.existsSync( this.getFileDir(domain))) {

                    try {
                        fs.removeSync( this.getFileDir(domain));
                        resolve(true);
                    } catch(e) {
                        reject(e);
                    }
                } else {
                    resolve(true);
                }
            } catch(e) {
                debug('error checing existing, but rsolving true', e);
                resolve(true);
            }
        })
    }

    destroy() {}

    get(domain:string, url:string, category, ttl):Promise<string> {
        return new Promise((resolve, reject) => {
            this.has(domain, url, category, ttl).then((isCached) => {
                if (!isCached) {
                    reject();
                } else {
                    resolve(fs.readFileSync(this.getFilePath(domain, url), 'utf8'));
                }
            });
        });
    };

    has(domain:string, url:string, category:string, ttl:number):Promise<boolean> {
        return new Promise((resolve, reject) => {
            const filePath = this.getFilePath(domain, url);
            try {
                if (!fs.existsSync(this.baseDir)) {
                    resolve(false);
                }
                if (!fs.existsSync(this.getFileDir(domain))) {
                    resolve(false);
                }
                const exist = fs.existsSync(filePath);
                if (exist) {
                    if (category === 'maxAge') {
                        var stats = fs.statSync(filePath);
                        var nowTimestamp = new Date().getTime();
                        var modificationTime = stats.mtime.getTime();
                        var expiration = modificationTime + ttl * 1000;
                        var diff = (nowTimestamp - expiration);

                        if (diff > 0) {
                            //the file is expired, remove it, then return false;
                            debug('This url is expired.... removing the cache. ', filePath);
                            this.delete(domain, url).then(ok => {
                                resolve(false);
                            }, err => {
                                reject(err);
                            });
                        } else {
                            resolve(true);
                        }
                    } else {
                        resolve(true);
                    }
                } else {
                    resolve(false);
                }
            } catch (e) {
                debug(e);
                reject(e);
            }
        });
    }

    set(domain:string, url:string, value:string, category:string, ttl:number, force:boolean):Promise<boolean> {
        const filePath = this.getFilePath(domain, url);
        return new Promise((resolve, reject) => {
            if (force === true) {
                try {
                    fs.ensureDirSync(this.getFileDir(domain));
                    this.has(domain, url, category, ttl).then(has => {
                        try {
                            if (has) {
                                fs.removeSync(filePath);
                            }
                            fs.writeFileSync(filePath, value, 'utf-8');
                            resolve(true);
                        } catch (e) {
                            reject(e);
                        }
                    }, err => {
                        reject(err);
                    });

                } catch (e) {
                    debug(e);
                    reject(e);
                }
                return;
            }
            if (category === 'never') {
                debug('this url should never been stored');
                resolve(false);
                return;
            }
            this.has(domain, url, category, ttl).then(has => {
                if (has) {
                    resolve(false)
                }
                try {
                    fs.ensureDirSync(this.getFileDir(domain));
                    fs.writeFileSync(filePath, value, 'utf-8');
                    resolve(true);
                } catch (e) {
                    debug(e);
                    reject(e);
                }
            }, err => {
                reject(err);
            });
        });
    }

    private getFileDir(domain:string):string {
        return path.join(this.baseDir, Helpers.escapeURL(domain));
    }

    private getFilePath(domain:string, url:string):string {
        const file = Helpers.escapeURL(url);
        if (Helpers.validateURL(file)) {
            return path.join(this.getFileDir(domain), file);
        } else {
            throw new Error('Invalid file');
        }
    }

    private validateStorageConfig() {
        Helpers.validateFileStorageConfig(this.config);
        this.baseDir = path.resolve(path.join(this.config.dir, Helpers.escapeURL(this.instanceName)));
        fs.ensureDirSync(this.baseDir);
    }
}
