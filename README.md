# simple-url-cache [![Build Status](https://travis-ci.org/a-lucas/simple-url-cache.svg?branch=master)](https://travis-ci.org/a-lucas/simple-url-cache)  [![Coverage Status](https://coveralls.io/repos/github/a-lucas/simple-cache/badge.svg?branch=master)](https://coveralls.io/github/a-lucas/simple-cache?branch=master)  ![Coverage Status](https://img.shields.io/badge/typescript-1.8-yellowgreen.svg)


This is a cache library used to cache URL and HTML, that supports : 

- File system storage
- Written in typescript (1.8), compiled with webpack
- Redis storage
- Cache rules definitions (regexes)
- TTL per URLs (regexes)



# API documentation

You can find it under the folder `docs/index.html`, and it's been generated with `typedoc` https://github.com/TypeStrong/typedoc.


# Installation

```bash
npm install --save simple-cache
```

# Usage

So far, we support two storage engines : file system, and redis.

The usage across both storage engines is the same, only the storage config file differs.


```javascript

var simpleCache = require('simple-cache');
var storageConfig = require('./config'); // get your config file
var cacheRules = require('./cacheRules'); //get your cache rule definition file

var cacheEngine = new simpleCache(storageConfig, cacheRules);

var url = '/someURL.html';
var html = '<b>I ama content</b>';

var cacheUrl = cacheEngine.url(url);

// is Cached?

cacheUrl.isCached().then(function(res) {
    console.log(res); // -> false
});

// cache it

cacheUrl.cache(html).then(function(res) {
    console.log(res); // -> true
});

// is Cached?

cacheUrl.isCached().then(function(res) {
    console.log(res); // -> true
});

// Get content

cacheUrl.getUrl().then(function(res) {
    console.log(res); // -> <b>I ama content</b>
});

// remove it

cacheUrl.removeUrl().then(function(res) {
    console.log(res); // -> true
});


```

# Config Files

## Regex Rules

This is an object describing which URL will be cached, which URLs won't be cached, and which ones will have a ttl expiration.

This is the same object, independently of the storage engine used.

An example worth 1000 words : 

```javascript

exports.cacheConfig = {
    // Will cache all URL starting with /posts/ and ending with html for 24 hours
    cacheMaxAge: [ 
        {
            regex: /posts\/.*html$/,  
            maxAge: 3600
        }
    ],
    // Will cache about-us.html, contact-us.html and /prices.html indefinitively
    cacheAlways: [  
        {
            regex: /about-us.html$/, 
            regex: /contact-us.html$/,
            regex: /prices.html$/
        }
    ],
    // will never cache the url /sitemaps.html
    cacheNever: [ 
        {
            regex: /sitemaps.html$/
        }
    ], 
    // If no URL is matched against these rules, then the default is to never cache it. can be 'never' or 'always'
    default: 'never' 
};

```

## FileStorage config

The simplest config file out there.

```javascript

export.fileStorageCOnfig = {
    type: 'file', 
    dir: '/var/cache'
}

```

## Redis Stoarge config

A bit more complex. The library node_redis is used here, so a valid redis node config file is needed. You can see more about it here : https://github.com/NodeRedis/node_redis 

As an example : 

```javascript

export.redisStorageConfig = {
    type: 'redis',
    host: '127.0.0.1',
    port: 6379,
    socket_keepalive: true
}

```


## Adding Storages

It is easy with typescript.

###     Define a new storage file, for example `mongoStorage.ts`

```typescript

export default class RedisStorage extends CacheCategory implements CacheStorage{
    // define all required methods from the CacheStorage interface 
}

```

And compile it with : `npm run build`

###     Add a test file `mongooStorage.spec.js`
 
```javascript

var simpleCache = require('./../dist/simple-cache.min');
var common = require('./helper/common');
var cacheRules = require('./helper/cacheRules');

describe('The fileStorage', function() {

    var storageConfig = {
        type: 'mongo',
        ... other config values here
    };

    var mongoCache = new simpleCache(storageConfig, cacheRules);

    common(mongoCache);

});
```

and make sure the test passes with 

`npm test`

If you need to debug, you can use `debug` extensivly with: 

```bash
DEBUG=simple-url-cache-FS,simple-url-cache-REDIS npm test
```

###     Do the same with `mongoStorageWeirdUrl.js`

###     Send me your Pull Request