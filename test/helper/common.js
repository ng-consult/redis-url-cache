var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var debug = require('debug')('simple-url-cache-test');
var expect = chai.expect;


function HAS_URLS(urlArray) {
    var results = [],
        count = 0;
    urlArray.forEach(function(url){
        HAS_URL(url);
    });
}


function HAS_URL (url) {
    it('Should have the url cached ' + url.getCurrentUrl(), function(done) {
        url.has().then(function(res) {
            expect(res).eql(true);
            done();
        }, function(res) {
            done('err' +res);
        }).catch(function(res) {
            done('err' +res);
        });
    });
}

function WAIT_HAS_NOT_URL (url, time) {
    it('Waits ' + time +' and shouldn\'t have the url cached ' + url.getCurrentUrl(), function(done) {
        setTimeout(function() {
            url.has().then(function(res) {
                expect(res).eql(false);
                done();
            }, function(res) {
                done('err' +res);
            }).catch(function(res) {
                done('err' +res);
            });
        }, time);
    });
    DELETE_URL_REJECTED(url);
    URL_GET_REJECTED(url);
}

function HAS_NOT_URL (url) {
    it('Shouldn\'t have the url cached ' + url.getCurrentUrl(), function(done) {
        url.has().then(function(res) {
            expect(res).eql(false);
            done();
        }, function(res) {
            done('err' +res);
        }).catch(function(res) {
            done('err' +res);
        });
    });
    DELETE_URL_REJECTED(url);

}


function HAS_NOT_URLS(urlArray) {
    urlArray.forEach(function(url) {
        HAS_NOT_URL(url);
    });
}

function SET_URL(url, html) {
    it('cache the url '+ url.getCurrentUrl() + ' resolve(true)', function(done){
        url.set(html).then(function(res) {
            expect(res).eql(true);
            done();
        }, function(res) {
            done('err' +res);
        }).catch(function(res) {
            done('err' +res);
        });
    });
}

function SET_URL_FALSE(url, html) {
    it('cache the url '+ url.getCurrentUrl() + ' resolve(false)', function(done){
        url.set(html).then(function(res) {
            expect(res).eql(false);
            done();
        }, function(res) {
            done('err' +res);
        }).catch(function(res) {
            done('err' +res);
        });
    });

}

function SET_URLS(urlArray, html) {
    var results = [],
        count = 0;

    urlArray.forEach(function(url) {
        SET_URL(url, html);
    });
}


function HAS_DOMAIN(domain, instance) {
    it('domain should be set ' + domain, function(done) {
        instance.getCachedDomains().then(function(domains) {
            expect(domains).to.include(domain);
            done();
        }, function(err) {
            debug(done);
            done(err);
        });

    });
    /*
    return;


    it('Should contain the domain ', domain, function(done) {

        instance.getCachedDomains().then(function(domains) {
            expect(domains).to.include(domain);
            done();
        }, function(res) {
            done('err' +res);
        }).catch(function(res) {
            done('err' +res);
        });
    });*/
}

function HAS_NOT_DOMAIN(domain, instance) {
    it('Should\'t have the domain ' + domain, function(done) {
        instance.getCachedDomains().then(function(domains) {
            expect(domains).to.not.include(domain);
            done();
        }, function(res) {
            done('err' +res);
        }).catch(function(res) {
            done('err' +res);
        });
    });
}

function DELETE_DOMAIN(domain, instance) {

    it('Should delete the domain without error ' + domain, function () {
        instance.clearDomain(domain).then(function (result) {
            expect(result).eql(true);
            done();
        }, function (res) {
            done('err' +res);
        }).catch(function (res) {
            done('err' +res);
        });
    });

    HAS_NOT_DOMAIN(domain, instance);

}



function DELETE_ALL(instance) {

    it('should run clearAllDomains without errors', function(done) {

        instance.clearAllDomains().then(function(res){
            expect(res).eql(true);
            done();
        }, function(err){
            done('err' +err);
        }).catch(function(res) {
            done('err' +res);
        });

    });

    it('shouldn\'t have any domain', function(done) {
        instance.getCachedDomains().then(function(domains) {
            expect(domains.length).eql(0);
            done();
        }, function(res) {
            done('err' +res);
        }).catch(function(res) {
            done('err' +res);
        });
    })
}

function DELETE_DOMAIN_NOT_SET(defaultDomain, instance) {
    HAS_DOMAIN(defaultDomain, instance);
    it('Should delete the domain not set without error', function () {
        instance.clearDomain().then(function (result) {
            expect(result).eql(true);
            done();
        }, function (res) {
            done('err' +res);
        }).catch(function (res) {
            done('err' +res);
        });
    });
    HAS_NOT_DOMAIN(defaultDomain, instance);
}

function DELETE_URL(url) {
    it('Should delete the url' + url.getCurrentUrl(), function(done) {

        url.delete().then(function(res) {
            expect(res).eql(true);
            done();
        }, function(err) {
            done('err' + err);
        })
    });
    HAS_NOT_URL(url);
}

function URL_HAS_CONTENT(url, html) {
    it('The URL should have the correct content ' + url.getCurrentUrl(), function(done) {

        url.get().then(function(res) {
            expect(res).eql(html);
            done();
        }, function(err) {
            done('error' + err);
        })
    })
}

function URL_GET_REJECTED(url) {
    it('The url.get() should reject() ' + url.getCurrentUrl(), function(done) {

        url.get().then(function(res) {
            done('err');
        }, function(err) {
            expect(err).to.be.defined;
            done();
        })
    })
}

function DELETE_URLS_REJECTED(urls) {
    urls.forEach(function(url) {
        DELETE_URL_REJECTED(url);
    });
}

function DELETE_URL_REJECTED(url) {
    it('Should reject the deletion of '+ url.getCurrentUrl(), function(done) {
        url.delete().then(function() {
            done('err')
        }, function(err) {
            expect(err).to.be.defined;
            done();
        });
    })
}

function URL_CATEGORY_IS(url, name) {
    it('The url category should be ' + name, function() {
        expect(url.getCategory()).eql(name);
    })
}

function SET_FORCE(url, html) {
    it('The url is forcefully cached' + url.getCurrentUrl(), function(done) {
        url.set(html, true).then(function(res) {
            expect(res).eql(true);
            done();
        }, function(err) {
            done('err = ' + err);
        });
    });
    HAS_URL(url);
    URL_HAS_CONTENT(url, html);
}

function URL_NAME_IS(url, name) {
    it('The url name should be ' + name, function() {
        expect(url.getCurrentUrl()).eql(name);
    })
}

function GET_ALL_URLS(instance, urls) {
    var allUrls = {};
    it('Should get all the urls witouth errors', function(done) {
        instance.getAllCachedURLs().then(function(result) {
            allUrls = result;
            done();
        }, function(err) {
            done('err = '+ err);
        })
    });

    it('Should retrun the correct urls', function () {
        expect(allUrls).eql(urls);
    })
}

function GET_URLS(instance, domain, urls) {
    var allUrls = {};
    if(domain === null) {
        it('Should get the urls witouth errors when no domain is set', function(done) {
            instance.getCachedURLs().then(function(result) {
                allUrls = result;
                done();
            }, function(err) {
                done('err = '+ err);
            });
        });
    } else {
        it('Should get the urls witouth errors for the domain '+ domain, function(done) {
            instance.getCachedURLs(domain).then(function(result) {
                allUrls = result;
                done();
            }, function(err) {
                done('err = '+ err);
            });
        });
    }


    it('Should retrun the correct urls', function () {
        expect(allUrls).eql(urls);
    });
}
module.exports.SET_FORCE = SET_FORCE;
module.exports.GET_URLS = GET_URLS;

module.exports.GET_ALL_URLS = GET_ALL_URLS;
module.exports.URL_CATEGORY_IS = URL_CATEGORY_IS;
module.exports.URL_GET_REJECTED = URL_GET_REJECTED;
module.exports.URL_HAS_CONTENT = URL_HAS_CONTENT;
module.exports.DELETE_URL = DELETE_URL;
module.exports.DELETE_URL_REJECTED = DELETE_URL_REJECTED;
module.exports.DELETE_URLS_REJECTED = DELETE_URL_REJECTED;
module.exports.DELETE_DOMAIN = DELETE_DOMAIN;
module.exports.HAS_NOT_DOMAIN = HAS_NOT_DOMAIN;
module.exports.HAS_DOMAIN = HAS_DOMAIN;
module.exports.SET_URLS = SET_URLS;
module.exports.SET_URL = SET_URL;
module.exports.SET_URL_FALSE = SET_URL_FALSE;
module.exports.HAS_NOT_URLS = HAS_NOT_URLS;
module.exports.HAS_NOT_URL = HAS_NOT_URL;
module.exports.WAIT_HAS_NOT_URL = WAIT_HAS_NOT_URL;
module.exports.URL_NAME_IS = URL_NAME_IS;
module.exports.DELETE_DOMAIN_NOT_SET = DELETE_DOMAIN_NOT_SET;
module.exports.HAS_URL = HAS_URL;
module.exports.HAS_URLS = HAS_URLS;
module.exports.DELETE_ALL = DELETE_ALL;