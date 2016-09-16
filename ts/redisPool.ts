import * as  redis from 'redis';
import * as dbug from 'debug';
let debug = dbug('simple-url-cache-REDIS');
import {RedisStorageConfig} from './interfaces';

let pool = null;

export module RedisPool {

    let _isOnline:boolean = false;

    export const connect = (config:RedisStorageConfig):redis.RedisClient => {
        if (pool === null) {
            debug('This redis connection has never been instanciated before');
            pool = redis.createClient(config);

            pool.on('connect', () => {
                _isOnline = true;
                console.log('redis connected');
            });

            pool.on('error', (e) => {
                console.error(e);
                _isOnline = true;
                pool = null;
                throw new Error(e);
            });

            pool.on('end', () => {
                pool = null;
                _isOnline = false;
                console.error('Connection closed');
            });

            pool.on('warning', (msg) => {
                console.error('Warning called: ', msg);
            });
        }
        return pool;
    };

    export const isOnline = ():boolean => {
        return pool !== null && _isOnline === true;
    };

    export const kill = ():void => {
        if (_isOnline === true) {
            pool.end();
        }
    };
}
