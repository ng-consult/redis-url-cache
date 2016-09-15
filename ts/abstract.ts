import {CacheRules, RegexRule} from './interfaces';


export abstract class CacheCategory {

    protected _currentCategory:string;
    protected _currentMaxAge:number;

    constructor(protected currentUrl: string, protected _config: CacheRules) {
        this.getCacheCategory();
    }

    private getRegexTest = (u: RegexRule) => {
        return u.regex.test(this.currentUrl);
    };

    //return always|never|maxAge|timestamp|default
    private getCacheCategory = () => {
        var i;
        for (i in this._config.cacheNever) {
            if (this.getRegexTest (this._config.cacheNever[i]) === true) {
                this._currentCategory = 'never';
                return;
            }
        }

        for (i in this._config.cacheAlways) {
            if (this.getRegexTest (this._config.cacheAlways[i]) === true) {
                this._currentCategory = 'always';
                return true;
            }
        }

        for (i in this._config.cacheMaxAge) {
            if (this.getRegexTest (this._config.cacheMaxAge[i]) === true) {
                this._currentCategory = 'maxAge';
                this._currentMaxAge = this._config.cacheMaxAge[i].maxAge;
                return true;
            }
        }

        this._currentCategory = this._config.default;
    };

    public getCategory() {
        return this._currentCategory;
    }

    public getCurrentUrl() {
        return this.currentUrl;
    }

}

