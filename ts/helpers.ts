import {FileStorageConfig, RedisStorageConfig} from './interfaces';

export default class Helpers {

    static isFS(storageConfig:RedisStorageConfig | FileStorageConfig): storageConfig is FileStorageConfig {
        return typeof (<FileStorageConfig>storageConfig).dir !== 'undefined';
    }

    static escapeURL(key: string): string {
        let escaped = key.replace(':', '%3A');
        escaped = escaped.replace('.', '%2E'); //http://stackoverflow.com/questions/3856693/a-url-resource-that-is-a-dot-2e
        escaped = escaped.replace('~', '%7E'); //http://www.w3schools.com/tags/ref_urlencode.asp
        escaped = encodeURIComponent(escaped);
        return escaped;
    };

    static unescapeURL(key: string): string {
        let unescaped = decodeURIComponent(key);
        unescaped = unescaped.replace('%3A', ':');
        unescaped = unescaped.replace('%2E', '.');
        unescaped = unescaped.replace('%7E', '~');
        return unescaped;
    }

    static validateURL(key: string): boolean {
        if (key.length === 0) { return false;}
        if (key.length > 255) { return false;}
        if (typeof key === 'undefined') { return false; }
        return true;
    };

    static isStringDefined(input: string) {
        if(typeof input !== 'string' || input.length === 0) {
            Helpers.invalidParameterError('this should be a non empty string', input);
        }
    }

    static isStringIn(input: string, values: string[]) {
        if(typeof input !== 'string') {
            return false;
        }
        let valid = false
        values.forEach(value=> {
            if (value === input) {
                valid = true;
            }
        });
        if(!valid) {
            Helpers.invalidParameterError('This string should contain only these values : ' + values.join(', '), input);
        }
    }

    static isArray(data:any) {
        if((data instanceof Array) === false) {
            Helpers.invalidParameterError('This should be an array', data);
        }
    }

    static isRegexRule(data:any) {
        if ((data.regex instanceof RegExp) === false) {
            Helpers.invalidParameterError('This should be a Regexp', data);
        }
    }

    static hasMaxAge(data:any) {
        if (typeof data.maxAge !== 'number'){
            Helpers.invalidParameterError('This rule misses a maxAge property', data);
        }
    }

    static isOptionalBoolean(data: any) {
        if (typeof data !== 'undefined' && typeof data !== 'boolean') {
            Helpers.invalidParameterError('You provided an optional boolean but this is not a boolean', data);
        }
    }

    static validateCacheConfig(cacheRules) {
        Helpers.isStringIn(cacheRules.default, ['always', 'never']);
        ['always', 'never', 'maxAge'].forEach((type) => {
            Helpers.isArray(cacheRules[type]);

            cacheRules[type].forEach(rule => {
                Helpers.isRegexRule(rule);
                if (type === 'maxAge') {
                    Helpers.hasMaxAge(rule);
                }
            });
        });
    }

    static validateFileStorageConfig(data: any) {
        Helpers.isStringDefined(data.dir);
    }

    static validateRedisStorageConfig(data: any) {
        //todo
    }

    static invalidParameterError(name, value) {
        throw new TypeError('Invalid parameter: ' + name + '. Value received: ' + JSON.stringify(value));
    }
}
