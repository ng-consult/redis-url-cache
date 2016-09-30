import { RegexRule, StorageInstance, StorageType} from './interfaces';
import Helpers from  './helpers';
import {Promise} from 'es6-promise';

export default class Cache {

    protected _category:string = '';
    protected _maxAge:number = 0;
    protected _config;

    constructor(protected _domain, protected _storageInstance: StorageInstance, protected _url: string) {
        this._config = this._storageInstance.getCacheRules();
        this.setCacheCategory();
    }

    delete = (): Promise<boolean> => {
        return this.getStorageInstance().delete(this._domain, this._url);
    };

    get = (): Promise<string> => {
        return this.getStorageInstance().get(this._domain, this._url, this._category, this._maxAge);
    };

    getDomain(): string {
        return this._domain;
    }

    getCategory(): string  {
        return this._category;
    }

    getInstanceName(): string {
        return this._storageInstance.getInstanceName();
    }

    getStorageType(): StorageType {
        return this._storageInstance.getStorageType();
    }

    getUrl(): string {
        return this._url;
    }

    has = (): Promise<boolean> => {
        return this.getStorageInstance().has(this._domain, this._url, this._category, this._maxAge);
    };

    set = (html : string, force?: boolean): Promise<boolean> => {
        Helpers.isStringDefined(html);
        Helpers.isOptionalBoolean(force);
        
        if(typeof force === 'undefined') {
            force = false;
        }
        return this.getStorageInstance().set(this._domain, this._url, html, this._category, this._maxAge, force);
    };

    private getRegexTest = (u: RegexRule): boolean => {
        return u.regex.test(this._url);
    };

    private setCacheCategory(): void  {
        let i;

        for (i in this._config.maxAge) {
            if (this.getRegexTest (this._config.maxAge[i]) === true) {
                this._category = 'maxAge';
                this._maxAge = this._config.maxAge[i].maxAge;
            }
        }

        for (i in this._config.always) {
            if (this.getRegexTest (this._config.always[i]) === true) {
                if(this._category.length > 0) {
                    console.warn('This url has already matched against a regex', this._url);
                }
                if(this._category !== 'always') {
                    console.error('And overriding maxAge with always');
                }
                this._category = 'always';
            }
        }

        for (i in this._config.never) {
            if (this.getRegexTest (this._config.never[i]) === true) {
                if(this._category.length > 0) {
                    console.warn('This url has already matched against a regex', this._url);
                }
                if(this._category !== 'always') {
                    console.error('And overriding maxAge/Always with mever');
                }
                this._category = 'never';
            }
        }
        if(this._category.length === 0) {
            this._category = this._config.default;
        }
    };

    protected getStorageInstance(): StorageInstance {
        return this._storageInstance;
    }

}
