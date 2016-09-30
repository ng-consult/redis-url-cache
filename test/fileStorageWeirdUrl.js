var path = require('path');
var simpleCache = require('./../dist/simple-cache.min');
var weirdUrls = require('./helper/weirdUrls');

var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var expect = chai.expect;

var SET_URL = require('./helper/common').SET_URL;
var SET_URL_FALSE = require('./helper/common').SET_URL_FALSE;
var HAS_NOT_URL = require('./helper/common').HAS_NOT_URL;
var DELETE_URL = require('./helper/common').DELETE_URL;
var URL_HAS_CONTENT = require('./helper/common').URL_HAS_CONTENT;

describe('The fileStorage - weirdURLs', function() {

    var storageConfig = {
        type: 'file',
        dir: path.resolve(__dirname + '/../cache')
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

    var html = '<b>hello</b>';

    var fileCache = new simpleCache('COMMON_DOMAIN', 'WEIRD', storageConfig, cacheRules);

    describe('Should pass', function() {
        weirdUrls.valid.forEach(function(weirdUrl) {
            var url = fileCache.url(weirdUrl);

            describe('URL ' + weirdUrl + 'resolved to ' + url.getUrl(), function() {

                HAS_NOT_URL(url);

                SET_URL(url, html);

                URL_HAS_CONTENT(url, html);

                DELETE_URL(url);
            });

        });
    });

    describe('Should not pass', function() {
        weirdUrls.invalid.forEach(function(weirdUrl) {
            var url = fileCache.url(weirdUrl);

            HAS_NOT_URL(url);

            SET_URL_FALSE(url, html);
        });
    })

});