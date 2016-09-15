
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