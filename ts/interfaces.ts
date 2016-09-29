import {Promise} from 'es6-promise';

export interface RegexRule {
    regex: RegExp
}

export interface MaxAgeRegexRule extends RegexRule{
    maxAge: number
}

export interface CacheRules{
    cacheMaxAge: MaxAgeRegexRule[],
    cacheAlways: RegexRule[],
    cacheNever: RegexRule[],
    default: string
}

export interface FileStorageConfig{
    dir: string;
}

export interface RedisStorageConfig{
    host: string;
    port: number;
    path?: string;
    url?: string;
    socket_keepalive?: boolean;
    password?: string;
    db?: string;
}

export interface CacheStorage {
    has(): Promise<boolean>;
    delete(): Promise<boolean>;
    get(): Promise<string>;
    set(html:string, force: boolean): Promise<boolean>;
}

export interface StorageInstance {
    get(key: string): Promise<string>;
    has(key: string): Promise<boolean>;
    set(key: string, value: string, ttl?: number): Promise<boolean>;
    delete(key: string): Promise<boolean>;
    clearAllCache(): Promise<boolean>;
    destroy(): void;
    getCacheRules(): CacheRules;
    getCachedURLs(): Promise <string[]>;
    getAllCachedDomains(): Promise <string[]>;
}
