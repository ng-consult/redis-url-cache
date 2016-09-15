import FileStorage from './fileStorage';
import RedisStorage from './redisStorage';

import {StorageConfig, CacheRules} from './interfaces';

module.exports = class CacheEngine {

    constructor( private storageConfig: StorageConfig, private cacheRules: CacheRules) {}

    url(url: string) {
        switch(this.storageConfig.type) {
            case 'file':
                return new FileStorage(url, this.storageConfig, this.cacheRules);
            case 'redis':
                return new RedisStorage(url, this.storageConfig, this.cacheRules);
            default:
                throw new Error('Unknown Storage config type value. Only file|redis allowed');
        }
    }
}
