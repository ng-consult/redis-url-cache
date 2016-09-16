/**
 * Created by antoine on 15/09/16.
 */

var simpleCache = require('./../dist/simple-cache.min').CacheEngine;
var weirdUrls = require('./helper/weirdUrls');

var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var expect = chai.expect;

describe('The fileStorage - weirdURLs', function() {

    var storageConfig = {
        type: 'file',
        dir: './cache'
    };

    var cacheRules = {
        cacheMaxAge: [],
        cacheAlways: [
            {
                regex: /.*/
            }
        ],
        cacheNever: [],
        default: 'never'
    };

    var fileCache = new simpleCache(storageConfig, cacheRules);

    weirdUrls.valid.forEach(function(weirdUrl) {
        var url = fileCache.url(weirdUrl);

        after(function() {
            url.removeUrl();
        });

        it('Should cache ' + weirdUrl, function() {
            return expect(url.cache('contents')).to.eventually.equal(true);
        });

    });

    weirdUrls.invalid.forEach(function(weirdUrl) {
        var url = fileCache.url(weirdUrl);

        after(function() {
            url.removeUrl();
        });

        it('Should not cache ' + weirdUrl, function() {
            return expect(url.cache('contents')).to.be.rejectedWith('invalid URL');
        });

    });

});