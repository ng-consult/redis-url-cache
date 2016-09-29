var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var debug = require('debug')('simple-url-cache-test');
var expect = chai.expect;


var DELETE_DOMAIN = require('./common').DELETE_DOMAIN;
var HAS_DOMAIN = require('./common').HAS_DOMAIN;
var SET_URL = require('./common').SET_URL;
var SET_URL_FALSE = require('./common').SET_URL_FALSE;
var HAS_NOT_URL = require('./common').HAS_NOT_URL;
var HAS_URL = require('./common').HAS_URL;
var DELETE_ALL = require('./common').DELETE_ALL;
var DELETE_URL = require('./common').DELETE_URL;
var URL_HAS_CONTENT = require('./common').URL_HAS_CONTENT;
var DELETE_URL_REJECTED = require('./common').DELETE_URL_REJECTED;
var URL_GET_REJECTED = require('./common').URL_GET_REJECTED;
var WAIT_HAS_NOT_URL = require('./common').WAIT_HAS_NOT_URL;
var URL_NAME_IS = require('./common').URL_NAME_IS;
var URL_CATEGORY_IS = require('./common').URL_CATEGORY_IS;
var SET_FORCE = require('./common').SET_FORCE;

module.exports = function(cacheEngine) {

    var cacheMaxAgeURL = '/maxAge.html';
    var cacheAlwaysURL = '/always.html';
    var cacheNeverURL = '/never.html';
    var notMatchedURL = '/unmatched.html';

    var html = '<b>Some HTML</b>';

    var urlCache1, urlCache2, urlCache3, urlCache4;


    describe('cacheMaxAge', function() {

        urlCache1 = cacheEngine.url(cacheMaxAgeURL);

        HAS_NOT_URL(urlCache1);
        SET_URL(urlCache1, html);
        URL_HAS_CONTENT(urlCache1, html);
        WAIT_HAS_NOT_URL(urlCache1, 1100);

        SET_URL(urlCache1, html);
        URL_HAS_CONTENT(urlCache1, html);
        DELETE_URL(urlCache1);
        URL_GET_REJECTED(urlCache1);

    });

    describe('cacheNever', function() {

        urlCache2 = cacheEngine.url(cacheNeverURL);

        URL_NAME_IS(urlCache2, cacheNeverURL);
        URL_CATEGORY_IS(urlCache2, 'never');
        HAS_NOT_URL(urlCache2);
        SET_URL_FALSE(urlCache2, html);
        HAS_NOT_URL(urlCache2);
        URL_GET_REJECTED(urlCache2);
        SET_FORCE(urlCache2, html);
        DELETE_URL(urlCache2);
        URL_GET_REJECTED(urlCache2);

    });

    describe('unMatchedURL', function() {
        urlCache3 = cacheEngine.url(notMatchedURL);

        URL_NAME_IS(urlCache3, notMatchedURL);
        URL_CATEGORY_IS(urlCache3, 'never');

        HAS_NOT_URL(urlCache3);
        DELETE_URL_REJECTED(urlCache3);

        SET_URL_FALSE(urlCache3, html);

        HAS_NOT_URL(urlCache3);

        URL_GET_REJECTED(urlCache3);

        SET_FORCE(urlCache3, html);

        DELETE_URL(urlCache3);

        URL_GET_REJECTED(urlCache3);
    });

    describe('cacheAlways', function() {

        urlCache4 = cacheEngine.url(cacheAlwaysURL);

        URL_NAME_IS(urlCache4, cacheAlwaysURL);
        URL_CATEGORY_IS(urlCache4, 'always');

        HAS_NOT_URL(urlCache4);
        DELETE_URL_REJECTED(urlCache4);

        SET_URL(urlCache4, html);

        SET_URL_FALSE(urlCache4, html);

        URL_HAS_CONTENT(urlCache4, html);

        DELETE_URL(urlCache4);

        URL_GET_REJECTED(urlCache4);

    });

    describe('multiple domains', function() {

        var urlCaches = [];

        urlCaches.push(cacheEngine.url('http://a.com/always.html'));
        urlCaches.push(cacheEngine.url('http://b.com/always.html'));
        urlCaches.push(cacheEngine.url('always.html'));



        SET_URL(urlCaches[0], html);
        SET_URL(urlCaches[1], html);
        SET_URL(urlCaches[2], html);

        HAS_URL(urlCaches[0]);
        HAS_URL(urlCaches[1]);
        HAS_URL(urlCaches[2]);

        URL_HAS_CONTENT(urlCaches[0], html);
        URL_HAS_CONTENT(urlCaches[1], html);
        URL_HAS_CONTENT(urlCaches[2], html);

        HAS_DOMAIN('COMMON_DOMAIN', cacheEngine);

        HAS_DOMAIN('http://a.com', cacheEngine);
        HAS_DOMAIN('http://b.com', cacheEngine);

        DELETE_DOMAIN('http://a.com', cacheEngine);

        HAS_DOMAIN('COMMON_DOMAIN', cacheEngine);
        HAS_DOMAIN('http://b.com', cacheEngine);

        DELETE_DOMAIN('http://whatever_should_silently_succeed', cacheEngine);
        DELETE_DOMAIN('http://b.com', cacheEngine)
        DELETE_DOMAIN('COMMON_DOMAIN', cacheEngine);

        HAS_NOT_URL(urlCaches[0]);
        HAS_NOT_URL(urlCaches[1]);
        HAS_NOT_URL(urlCaches[2]);

    });

    describe('clearAllCache()', function() {

        var i,
            urlCaches = [];

        for(i=0; i<3; i++) {
            urlCaches.push(cacheEngine.url('http://a' + i + '.com/always.html'));
        }

        SET_URL(urlCaches[0], html);
        SET_URL(urlCaches[1], html);
        SET_URL(urlCaches[2], html);

        HAS_URL(urlCaches[0]);
        HAS_URL(urlCaches[1]);
        HAS_URL(urlCaches[2]);

        URL_HAS_CONTENT(urlCaches[0], html);
        URL_HAS_CONTENT(urlCaches[1], html);
        URL_HAS_CONTENT(urlCaches[2], html);

        DELETE_ALL(cacheEngine);

        HAS_NOT_URL(urlCaches[0]);
        HAS_NOT_URL(urlCaches[1]);
        HAS_NOT_URL(urlCaches[2]);


    });

};