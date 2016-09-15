/**
 * Created by antoine on 14/09/16.
 */
var simpleCache = require('./../dist/simple-cache.min');

var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var expect = chai.expect;

describe('The fileStorage', function() {

    var config = {
        type: 'file',
        dir: './cache'
    };

    var cacheMaxAgeURL = '/maxAge.html';
    var cacheAlwaysURL = '/always.html';
    var cacheNeverURL = '/never.html';
    var notMatchedURL = '/unmatched.html';

    var html = '<b>Some HTML</b>';

    var urlCache1, urlCache2, urlCache3, urlCache4;

    var urlConfig = {
        cacheMaxAge: [
            {
                regex: /maxAge.html$/,
                maxAge: 1
            }
        ],
        cacheAlways: [
            {
                regex: /always.html$/
            }
        ],
        cacheNever: [
            {
                regex: /never.html$/
            }
        ],
        default: 'never'
    };

    var fileCache = new simpleCache(config, urlConfig);


    describe('cacheMaxAge', function() {

        urlCache1 = fileCache.url(cacheMaxAgeURL);

        after(function() {
            urlCache1.removeUrl();
        });

        it('The url shouldn\'t be cached', function() {
             return expect(urlCache1.isCached()).to.eventually.equal(false);
        });

        it('We cache the URL', function() {
            return expect(urlCache1.cache(html)).to.eventually.equal(true);
        });

        it('We cache the URL a second time', function() {
            return expect(urlCache1.cache(html)).to.eventually.equal(false);
        });

        it('The url should be cached', function() {
            return expect(urlCache1.isCached()).to.eventually.equal(true);
        });

        it('The html should be set', function() {
            return expect(urlCache1.getUrl()).to.eventually.equal(html);
        });

        it('it waits 1.1 seconds - the cache should be deleted', function(done) {
            setTimeout(function() {
                expect(urlCache1.isCached()).to.eventually.equal(false).notify(done);
            }, 1100);
        });

        it('We cache the URL', function() {
            return expect(urlCache1.cache(html)).to.eventually.equal(true);
        });

        it('We remove the cache', function() {
            return expect(urlCache1.removeUrl()).to.eventually.equal(true);
        });

        it('The url shouldn\'t be cached', function() {
            return expect(urlCache1.isCached()).to.eventually.equal(false);
        });

        it('The html should throw an error', function() {
            return expect(urlCache1.getUrl()).to.be.rejectedWith('This url is not cached: ' + cacheMaxAgeURL);
        });
        
    });


    describe('cacheNever', function() {

        urlCache2 = fileCache.url(cacheNeverURL);

        after(function() {
            urlCache2.removeUrl();
        });

        it('The url shoud be /never.html', function() {
             expect(urlCache2.getCurrentUrl()).to.eql(cacheNeverURL);
        });

        it('The url category shoud be never', function() {
            expect(urlCache2.getCategory()).to.eql('never');
        });

        it('The url shouldn\'t be cached', function() {
            return expect(urlCache2.isCached()).to.eventually.equal(false);
        });

        it('We cache the URL', function() {
            return expect(urlCache2.cache(html)).to.eventually.equal(false);
        });

        it('The url shouldn\'t be cached', function() {
            return expect(urlCache2.isCached()).to.eventually.equal(false);
        });

        it('We force the cache for the URL', function() {
            return expect(urlCache2.cache(html, true)).to.eventually.equal(true);
        });

        it('The url should be cached', function() {
            return expect(urlCache2.isCached()).to.eventually.equal(true);
        });

        it('The html should be set', function() {
            return expect(urlCache2.getUrl()).to.eventually.equal(html);
        });

        it('We remove the cache', function() {
            return expect(urlCache2.removeUrl()).to.eventually.equal(true);
        });

        it('The url shouldn\'t be cached', function() {
            return expect(urlCache2.isCached()).to.eventually.equal(false);
        });

        it('The html should trhow an error', function() {
            return expect( urlCache2.getUrl() ).to.be.rejectedWith('This url is not cached: ' + cacheNeverURL);
        });

    });


    describe('unMatchedURL', function() {
        urlCache3 = fileCache.url(notMatchedURL);

        after(function() {
            urlCache3.removeUrl();
        });

        it('The url shouldn\'t be cached', function() {
            return expect(urlCache3.isCached()).to.eventually.equal(false);
        });

        it('We cache the URL', function() {
            return expect(urlCache3.cache(html)).to.eventually.equal(false);
        });

        it('The url shouldn\'t be cached', function() {
            return expect(urlCache3.isCached()).to.eventually.equal(false);
        });

        it('We force the cache for the URL', function() {
            return expect(urlCache3.cache(html, true)).to.eventually.equal(true);
        });

        it('The url should be cached', function() {
            return expect(urlCache3.isCached()).to.eventually.equal(true);
        });

        it('The html should be set', function() {
            return expect(urlCache3.getUrl()).to.eventually.equal(html);
        });

        it('We remove the cache', function() {
            return expect(urlCache3.removeUrl()).to.eventually.equal(true);
        });

        it('The url shouldn\'t be cached', function() {
            return expect(urlCache3.isCached()).to.eventually.equal(false);
        });

        it('The html should trhow an error', function() {
            return expect( urlCache3.getUrl() ).to.be.rejectedWith('This url is not cached: ' + notMatchedURL);
        });
    });

    describe('cacheAlways', function() {

        urlCache4 = fileCache.url(cacheAlwaysURL);

        it('The category should be always', function() {
            expect(urlCache4.getCategory()).to.eql('always');
        });

        it('We cache the URL', function() {
            return expect(urlCache4.cache(html)).to.eventually.equal(true);
        });

        it('We cache the URL a second time', function() {
            return expect(urlCache4.cache(html)).to.eventually.equal(false);
        });

        it('The url should be cached', function() {
            return expect(urlCache4.isCached()).to.eventually.equal(true);
        });

        it('The html should be set', function() {
            return expect(urlCache4.getUrl()).to.eventually.equal(html);
        });

        it('We remove the cache', function() {
            return expect(urlCache4.removeUrl()).to.eventually.equal(true);
        });

        it('The url shouldn\'t be cached', function() {
            return expect(urlCache4.isCached()).to.eventually.equal(false);
        });

        it('The html should trhow an error', function() {
            return expect( urlCache4.getUrl() ).to.be.rejectedWith('This url is not cached: ' + cacheAlwaysURL);
        });
        
    });


});
