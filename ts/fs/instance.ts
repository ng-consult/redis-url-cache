import {Promise} from 'es6-promise';
import {StorageInstance, CacheRules, FileStorageConfig} from "./../interfaces";
import * as fs from 'fs-extra';
import * as path from 'path';
import * as debg from 'debug';
import Helpers from "../Helpers";
const debug = debg('simple-url-cache-FS');

export default class FileStorageInstance implements StorageInstance {

    private baseDir;
    constructor(private domain: string, private instanceName: string, private config: FileStorageConfig, private rules: CacheRules) {
        debug('Creating a new FileStorage Instance with domain, instancename and path ', domain, instanceName);
        Helpers.CheckType(domain, 'string');
        Helpers.CheckType(instanceName, 'string');
        this.baseDir = path.resolve(path.join(this.config.dir , this.escape(this.instanceName), this.escape(this.domain)));
        debug(this.baseDir);
        fs.ensureDirSync( this.baseDir );
    }

    private escape(key: string): string {
        let escaped = key.replace(':', '%3A');
        escaped = escaped.replace('.', '%2E'); //http://stackoverflow.com/questions/3856693/a-url-resource-that-is-a-dot-2e
        escaped = escaped.replace('~', '%7E'); //http://www.w3schools.com/tags/ref_urlencode.asp
        escaped = encodeURIComponent(escaped);
        return escaped;
    };

    private unescape(key: string): string {
        let unescaped = decodeURIComponent(key);
        unescaped = unescaped.replace('%3A', ':');
        unescaped = unescaped.replace('%2E', '.');
        unescaped = unescaped.replace('%7E', '~');
        return unescaped;
    }

    private validate(key: string): boolean {
        if (key.length === 0) { return false;}
        if (key.length > 255) { return false;}
        if (typeof key === 'undefined') { return false; }
        return true;
    };

    clearAllCache():Promise<boolean> {
        return new Promise((resolve, reject) => {
            try{
                fs.removeSync( this.baseDir);
                resolve(true);
            } catch(e) {
                debug('error while emptying directory', this.baseDir, e);
                reject(e);
            }
        });
    }

    delete(key): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try{
                fs.unlinkSync(key);
                resolve(true);
            } catch(e) {
                reject(e);
            }
        });
    }

    destroy() {}

    get(key):Promise<string> {
        return new Promise((resolve, reject) => {
            this.has(key).then((isCached) => {
                if(!isCached) {
                    reject();
                } else{
                    resolve( fs.readFileSync(key, 'utf8') );
                }
            });
        });
    };

    getAllCachedDomains():Promise<string[]> {
        return new Promise((resolve, reject) => {
            try {
                debug('starting scann');
                const list = fs.readdirSync(path.resolve(path.join(this.config.dir, this.escape(this.instanceName))));
                debug('list = ', list);
                const results = [];
                list.forEach((dir) =>{
                    if(dir!=='.' && dir!='..') {
                        results.push(this.unescape(dir));
                    }
                });
                resolve(results);
            } catch(e) {
                debug('Error while reading dir', this.config.dir);
                reject(e);
            }
        });
    }

    getCachedURLs(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            try {
                const list = fs.readdirSync(this.baseDir);
                const results = [];
                list.forEach((file) =>{
                    if(file!=='.' && file!='..') {
                        results.push(this.unescape(file));
                    }
                });
                resolve(results);
            } catch(e) {
                debug('Error while reading dir', this.baseDir);
                reject(e);
            }
        });
    }

    getFilePath(url):string {
        const file = this.escape(url);
        if (this.validate(file)) {
            return path.join(this.baseDir, file);
        }
        throw new Error('Invalid file');
    }

    getCacheRules(): CacheRules {
        return this.rules;
    }

    has(key):Promise<boolean>  {
        return new Promise((resolve, reject) => {
            try{
                const exist = fs.existsSync(key);
                resolve(exist);
            } catch(e) {
                debug(e);
                reject(e);
            }
        });
    }

    set(key, value):Promise<boolean> {
        return new Promise((resolve, reject) => {
            try{
                fs.writeFileSync(key, value, 'utf-8');
                resolve(true);
            } catch(e) {
                debug(e);
                reject(e);
            }
        });
    }
}
