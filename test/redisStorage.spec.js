/**
 * Created by antoine on 14/09/16.
 */
/**
 * Created by antoine on 14/09/16.
 */
var simpleCache = require('./../dist/simple-cache.min');

var common = require('./helper/common');

var config = {
    type: 'redis',
    host: '127.0.0.1',
    port: 6379,
    socket_keepalive: true
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

var redisCache = new simpleCache(config, urlConfig);


describe('The redisStorage', function () {

    common(redisCache);

});
