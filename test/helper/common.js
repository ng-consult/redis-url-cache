var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var expect = chai.expect;

module.exports = function(cacheEngine) {

    var cacheMaxAgeURL = '/maxAge.html';
    var cacheAlwaysURL = '/always.html';
    var cacheNeverURL = '/never.html';
    var notMatchedURL = '/unmatched.html';

    var html = '<b>Some HTML</b>';

    var urlCache1, urlCache2, urlCache3, urlCache4;


    describe('cacheMaxAge', function() {

        beforeEach(function() {
            urlCache1 = cacheEngine.url(cacheMaxAgeURL);
        });


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
                urlCache1.isCached().then(function(result) {
                    expect(result).eql(false);
                    done();
                }, function(err) {
                    done(err);
                }).catch(function(err) {
                    done(err);
                });
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

        urlCache2 = cacheEngine.url(cacheNeverURL);

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
        urlCache3 = cacheEngine.url(notMatchedURL);

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

        urlCache4 = cacheEngine.url(cacheAlwaysURL);

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

    describe('clearAllCache()', function() {


        var i,
            urlCaches = [];

        it('Stores 5 urls', function(done) {
            var count = 0;

            for(i=0; i<5; i++){
                urlCaches.push(cacheEngine.url( i + 'always.html'));
                urlCaches[i].cache('<some content').then(function(res) {
                    //expect(res).to.eql(true);
                    count++;
                    if(count === 5) {
                        done()
                    }
                }, function(res) {
                    done(res);
                }).catch(function(res) {
                    done(res);
                });
            }



        });

        it('These URLs should be cached', function(done) {
            var count = 0;
            for(i=0; i<5; i++){
                urlCaches[i].isCached().then(function(res) {
                    count++;
                    if(count === 5) {
                        done()
                    }
                }, function(err) {
                    done(err);
                })
            }
        });

        it('clears all the caches', function(done) {
            cacheEngine.clearAllCache().then(function(res){
                expect(res).eql(true);
                done();
            }, function(err){
                done(err);
            })
        });

        it('All caches should be cleared', function(done) {
            var count = 0;
            for(i=0; i<5; i++){
                urlCaches[i].isCached().then(function(res) {
                    expect(res).equal(false);
                    count++;
                    if(count === 5) {
                        done()
                    }
                })
            }
        });

    })

};