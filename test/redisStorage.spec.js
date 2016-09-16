
var simpleCache = require('./../dist/simple-cache.min').CacheEngine;
var cacheRules = require('./helper/cacheRules');
var common = require('./helper/common');

var storageConfig = {
    type: 'redis',
    host: '127.0.0.1',
    port: 6379,
    socket_keepalive: true
};

var redisCache = new simpleCache(storageConfig, cacheRules);


describe('The redisStorage', function () {

    common(redisCache);

});
