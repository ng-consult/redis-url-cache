// Type definitions for simple-url-cache
// Project: https://github.com/a-lucas/simple-url-cache
// Definitions by: Antoine LUCAS <https://github.com/a-lucas>

export class CacheEngine {
    constructor(storageConfig:FileStorageConfig, cacheRules:CacheRules);
    constructor(storageConfig:RedisStorageConfig, cacheRules:CacheRules);

    clearAllCache(): Promise<boolean>
    url(url:string):FileStorage;
    url(url:string):RedisStorage;
}


export class FileStorage implements CacheStorage {
    constructor(_url:string, _storageConfig:FileStorageConfig, _regexRules:CacheRules);

    isCached():Promise<boolean>;

    removeUrl():Promise<boolean>;

    getUrl():Promise<string>;

    cache(html:string):Promise<boolean>
    cache(html:string, force:boolean):Promise<boolean>;

    destroy():void;

    getCategory():string;

    getCurrentUrl():string;
}

export class RedisStorage implements CacheStorage {
    constructor(_url:string, _storageConfig:RedisStorageConfig, _regexRules:CacheRules);

    isCached():Promise<boolean>;

    removeUrl():Promise<boolean>;

    getUrl():Promise<string>;

    cache(html:string):Promise<boolean>;
    cache(html:string, force:boolean):Promise<boolean>;

    destroy():void;

    getCategory():string;

    getCurrentUrl():string;
}

export interface CacheRules {
    cacheMaxAge:MaxAgeRegexRule[],
    cacheAlways:RegexRule[],
    cacheNever:RegexRule[],
    default:string
}

export interface FileStorageConfig extends StorageConfig {
    dir:string;
}

export interface RedisStorageConfig extends StorageConfig {
    host:string;
    port:number;
    path?:string;
    url?:string;
    socket_keepalive?:boolean;
    password?:string;
    db?:string;
}

interface StorageConfig {
    type:string
}

interface CacheStorage {
    isCached():Promise<boolean>;
    removeUrl():Promise<boolean>;
    getUrl():Promise<string>;
    cache(html:string):Promise<boolean>;
    cache(html:string, force:boolean):Promise<boolean>;
    destroy():void;
}

interface RegexRule {
    regex:RegExp
}

interface MaxAgeRegexRule extends RegexRule {
    maxAge:number
}