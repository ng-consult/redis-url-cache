/**
 * Created by antoine on 14/09/16.
 */
var simpleCache = require('./../dist/simple-cache.min');
var common = require('./helper/common');

describe('The fileStorage', function() {

    var config = {
        type: 'file',
        dir: './cache'
    };

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

    common(fileCache);



});
