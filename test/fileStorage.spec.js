var simpleCache = require('./../dist/simple-cache.min');
var instances = require('./helper/instances');
var instance = require('./helper/instance');

var cacheRules = require('./helper/cacheRules');
var path = require('path');

describe('The fileStorage', function() {

    var storageConfig = {
        dir: path.resolve(__dirname + '/../cache')
    };

    var fs1,
        fs2,
        fs3,
        fs4;
    
    describe.only('One instance', function() {
        fs1 = new simpleCache('COMMON_DOMAIN', 'INSTANCE',  storageConfig, cacheRules);
        instance(fs1);
    });

    describe('Two common instance, one separate instance', function() {
        fs2 = new simpleCache('DOMAIN1', 'INSTANCE1',  storageConfig, cacheRules);
        fs3 = new simpleCache('DOMAIN2', 'INSTANCE1',  storageConfig, cacheRules);
        fs4 = new simpleCache('DOMAIN3', 'INSTANCE2',  storageConfig, cacheRules);
        instances(fs2, fs3, fs4);
    });

});
