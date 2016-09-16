/// <reference path="typings/globals/redis/index.d.ts" />


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

export interface StorageConfig {
    type: string
}

export interface FileStorageConfig extends StorageConfig{
    dir: string;
}

export interface RedisStorageConfig  extends StorageConfig{
    host: string;
    port: number;
    path: string;
    url?: string;
    socket_keepalive: boolean;
    password?: string;
    db?: string;
}


export interface CacheStorage {
    isCached(): Promise<boolean>;
    removeUrl(): Promise<boolean>;
    getUrl(): Promise<string>;
    cache(html:string, force: boolean): Promise<boolean>;
}

export abstract class CacheCategory {
    constructor(currentUrl: string, _config: CacheRules) ;
    private getRegexTest(u: RegexRule): boolean;
    private getCacheCategory(): string;
    public getCategory():string;
    public getCurrentUrl(): string;
}

export module RedisPool {
    export function connect (config:RedisStorageConfig): redis.RedisClient;
    export function isOnline():boolean;
    export function kill():void;
}

export class FileStorage extends CacheCategory implements CacheStorage{
    constructor( _url: string, _storageConfig: FileStorageConfig, _regexRules: CacheRules);
    isCached(): Promise<boolean>;
    removeUrl(): Promise<boolean>;
    getUrl(): Promise<string>;
    cache(html:string, force: boolean): Promise<boolean>;
}

export class RedisStorage extends CacheCategory implements CacheStorage{
    constructor( _url: string, _storageConfig: RedisStorageConfig, _regexRules: CacheRules);
    isCached(): Promise<boolean>;
    removeUrl(): Promise<boolean>;
    getUrl(): Promise<string>;
    cache(html:string, force: boolean): Promise<boolean>;
}