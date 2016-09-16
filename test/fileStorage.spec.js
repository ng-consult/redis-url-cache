var simpleCache = require('./../dist/simple-cache.min').CacheEngine;
var common = require('./helper/common');
var cacheRules = require('./helper/cacheRules');

describe('The fileStorage', function() {

    var storageConfig = {
        type: 'file',
        dir: './cache'
    };

    var fileCache = new simpleCache(storageConfig, cacheRules);

    common(fileCache);

});
