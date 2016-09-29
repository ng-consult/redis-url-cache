import * as  redis from 'redis';
import {RedisStorageConfig} from './../interfaces';

import * as dbug from 'debug';
let debug = dbug('simple-url-cache-REDIS');

export class RedisPool {

    static _pool = {};

    static _isOnline = {}

    private db;

    static connect(config: RedisStorageConfig): redis.RedisClient {
        if (typeof RedisPool._pool[config.db] === 'undefined' || RedisPool._pool[config.db] === null || !RedisPool._isOnline[config.db]) {
            debug('This redis connection has never been instanciated before', config.db);
            RedisPool._isOnline[config.db] = false;

            RedisPool._pool[config.db] = redis.createClient(config);

            RedisPool._pool[config.db].on('connect', () => {
                RedisPool._isOnline[config.db] = true;
                debug('redis connected');
            });

            RedisPool._pool[config.db].on('error', (e) => {
                debug(e);
                RedisPool._isOnline[config.db] = false;
                RedisPool._pool[config.db] = null;
                throw new Error(e);
            });

            RedisPool._pool[config.db].on('end', () => {
                RedisPool._pool[config.db] = null;
                RedisPool._isOnline[config.db] = false;
                debug('Connection closed');
            });

            RedisPool._pool[config.db].on('warning', (msg) => {
                debug('Warning called: ', msg);
            });
        }
        return RedisPool._pool[config.db];
    }

    static isOnline(db): boolean {
        return RedisPool._isOnline[db];
    }

    static kill(db){
        if (RedisPool._isOnline[db] === true) {
            RedisPool._pool[db].end();
        }
    }

    constructor(config: RedisStorageConfig) {
        RedisPool.connect(config);
        this.db = config.db;
    }

    getConnection(): redis.RedisClient {
        return RedisPool._pool[this.db];
    }

    isOnline():boolean {
        return RedisPool._isOnline[this.db];
    }

    kill() {
        if (RedisPool._isOnline[this.db] === true) {
            RedisPool._pool[this.db].end();
        }
    }
}
