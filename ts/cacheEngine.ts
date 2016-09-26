import FileStorage from './fileStorage';
import RedisStorage from './redisStorage';
import * as fs from 'fs-extra';
import {polyfill} from 'es6-promise';
polyfill();
import * as  redis from 'redis';
import {RedisPool} from './redisPool';
import * as dbug from 'debug';
let debug = dbug('simple-url-cache');

import {StorageConfig, CacheRules} from './interfaces';


export class CacheEngine {

    static _redisPool = RedisPool;
    private _conn: redis.RedisClient;


    constructor( private storageConfig: any, private cacheRules: CacheRules) {
        if(storageConfig.type === 'redis') {
            this._conn = RedisPool.connect(this.storageConfig);
        }
    }

    clearAllCache():Promise<boolean> {
        return new Promise((resolve, reject) => {
            switch(this.storageConfig.type) {
                case 'file':
                    try{
                        fs.emptyDirSync(this.storageConfig.dir);
                        resolve(true);
                    } catch(e) {
                        debug('error while emptying directory', this.storageConfig.dir, e);
                        reject(e);
                    }
                    break;
                case 'redis':
                    this._conn.keys('*',  (err, keys) => {
                        if (err) {
                            debug('error while retrieving keys', err);
                            reject(err);
                        }
                        this._conn.del(keys, (err) => {
                            debug('error while deleting keys', keys, err);
                            reject(err);
                        });
                        resolve(true);
                    });
                    break;
                default:
                    reject('unknown storage type ' + this.storageConfig.type);
                    break;
            }
        });
    }

    url(url: string): FileStorage|RedisStorage {
        switch(this.storageConfig.type) {
            case 'file':
                return new FileStorage(url, this.storageConfig, this.cacheRules);
            case 'redis':
                return new RedisStorage(url, this.storageConfig, this.cacheRules);
            default:
                throw new Error('Unknown Storage config type value. Only file|redis allowed');
        }
    }
};

