# simple-url-cache [![Build Status](https://travis-ci.org/a-lucas/simple-url-cache.svg?branch=master)](https://travis-ci.org/a-lucas/simple-url-cache)  [![codecov](https://codecov.io/gh/a-lucas/simple-url-cache/branch/master/graph/badge.svg)](https://codecov.io/gh/a-lucas/simple-url-cache)


Conditionally cache your URL's content on FS or REDIS. It supports cache instance sharing or isolation.


## API documentation


https://a-lucas.github.io/simple-url-cache

## Installation


```bash
npm install simple-url-cache
```

## Api

- CacheEngine
    - [constructor](#constructor)
    - [clearDomain()](#cleardomain)
    - [clearAllDomains()](#clearalldomains)
    - [getAllCachedURLs()](#getallcachedurls)
    - [getCachedURLs()](#getcachedurls)
    - [getCachedDomains()](#getcacheddomains)
    - [url()](#url)
- CacheStorage
    - [delete()](#delete)
    - [get()](#get)
    - [has()](#has)
    - [set()](#set)
- StorageConfigs
    - [Cache config](#cache-config)
    - [File storage config](#file-storage-config)
    - [Redis storage config](#redis-storage-config)
    

## Cache Engine


### constructor

```typescript
constructor( defaultDomain: string, instanceName: string, storageConfig, cacheRules)
```

**defaultDomain** Every URL that miss a hostname will get classified under this domain

**instanceName** The isolated instance where this cacheEngine will store urls.
If another cacheEngine has the same storage type and the same instance name, they will share the pool.

Example: 

```javascript

var engine1 = new CachEngine('http://localhost', 'I1', {type: 'file', dir: '/var/cache'}, cacheRules); 
var engine2 = new CachEngine('http://localhost', 'I1', {type: 'file', dir: '/var/cache'}, cacheRules);
var engine3 = new CachEngine('http://localhost', 'I2', {type: 'file', dir: '/var/cache'}, cacheRules);

// At this stage, engine1 and engine2 share the same pool.

engine1.url('http://a.com/index.html').set('some content'); 
// resolve(true)

engine2.url('http://b.com/index.html').set('some content');
// resolve(true)

engine1.url('http://b.com/index.html').set('some content'); 
// resolves(false) - already cached

engine3.url('http://a.com/index.html').set('some content');
// resolve(true)

engine1.url('http://b.com/index.html').get() 
//resolve(true) -> sahred pool with engine1 

engine3.url('http://b.com/index.html').set('some content');
// resolve(false) -> not set

```

The resulting folder structure is: 

```bash
# Instance 1
/var/cache/I1/htt[://a.com/index.html
/var/cache/I1/htt[://b.com/index.html

#instance 2
/var/cache/I2/htt[://a.com/index.html
```

### clearDomain

```typescript
clearDomain(domain?: string): Promise<boolean>
```

Removes all cached URLs under stored unde a domain

**domain** the domain to be cleared, if none is provided, the default domain will be cleared


### clearAllDomains

```typescript
clearAllDomains(): Promise<boolean>
```

Clears all the URLs stored within this instance

### getAllCachedURLs

```typescript
getAllCachedURL(): Promise<string[][]>
```

Return a list of all cached urls withiin the instance 

example: 

```javascript

{
    "http://www.domainA.com": [
                                "/index.html",
                                "about.html"
                            ],
    "http://www.domainB.com": [
                                "/index.html",
                                "about.html"
                            ],
        
}

```
### getCachedURLs

```typescript
getCachedURLs(domain?: string): Promise<string[]>
```

Get the array of cached URLs associated with this domain & instance

**domain** if none provided, then the default domain will be used

### getCachedDomains

```typescript
getCachedDomains(): Promise<string[]>
```

Returns a list of all cached domain names (including protocol, port and authentication)

### url

```typescript
url(url: string): CacheStorage
```

Create a new `CacheStorage` instance


## CacheStorage


### delete

```typescript
delete(): Promise<boolean>
```

Resolve to true if the url has been suppressed, false if the url wasn't cached
Reject an Error if any

### get

```typescript
get(): Promise<string>
```

Resolve to the url's content 
Reject if the url wasn't cached


### has

```typescript
has(): Promise<boolean>
```

Resolve to true if the url is cached, false if the file is not cached, rejected on error

### set

```typescript
set(content: string [, force: boolean]) : Promise<boolean>
```

Resolve to true if the url has been cached successfully, 
Rejects false if 
    - the url matches the `never` rule.
    - The url has already been cached
Rejects on Error

**html**: the content of the file to be cached, must be UTF8

**force**: 
    - ~~Actualize the TTL for maxAge already cached urls~~
    - Force the caching for url matching the `never` rule.
     
 
## Usage

Example with Fs storage

```javascript
var engine = new CachEngine('http://localhost', 'I1', {type: 'file', dir: '/var/cache'}, cacheRules); 

var content ='Hello !';

var urls = [
    'http://www.google.com/index.html',
    '/index.html',
    'http://www.google.com/about.html'
];

urls.forEach(function(url) {
    engine.url(url).set(content, true).then(function() {
        console.log('cached');
    }, function(err) {
        console.error(err);
    });
});
```

The resulting folder structure would be : 

```bash
#2 folders
/var/cache/I1/http://localhost/
#    -> /index.html
/var/cache/I2/http://www.google.com/
#    -> /index.html
#    -> /about.html
```

> For readability, the folder names are unescaped.

## Storage engines

The usage across both storage engines is the same, only the storage config file differs.

## Config Files

### Cache Config

This is an object describing which URL will be cached, which URLs won't be cached, and which ones will have a ttl expiration.

This is the same object, independently of the storage engine used.

An example worth 1000 words : 

```javascript

exports.cacheConfig = {
    // Will cache all URL starting with /posts/ and ending with html for 24 hours
    cacheMaxAge: [ 
        {
            regex: /^\/posts.*html$/,  
            maxAge: 3600
        }
    ],
    // Will cache about-us.html, contact-us.html and /prices.html indefinitively
    cacheAlways: [  
        {
            regex: /^about-us\.html$/, 
            regex: /^contact-us\.html$/,
            regex: /^prices\.html$/
        }
    ],
    // will never cache the url /sitemaps.html
    cacheNever: [ 
        {
            regex: /^sitemaps\.html$/
        }
    ], 
    // If no URL is matched against these rules, then the default is to never cache it. can be 'never' or 'always'
    default: 'never' 
};

```

### File storage config


The simplest config file out there.

```javascript

export.fileStorageCOnfig = {
    dir: '/var/cache'
}

```

### Redis storage config


A bit more complex. The library [noderedis](https://github.com/NodeRedis/node_redis ) is used here, so a valid redis node config file is needed. 

example : 

```javascript

export.redisStorageConfig = {
    host: '127.0.0.1',
    port: 6379,
    socket_keepalive: true
}

```


<!--
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

var simpleCache = require('./../dist/simple-cache.min').CacheEngine;
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

If you need to debug, you can use `debug` extensively with: 

```bash
DEBUG=simple-url-cache-FS,simple-url-cache-REDIS npm test
```

###     Do the same with `mongoStorageWeirdUrl.js`

##      Update te index.d.ts to file include your new typing definitions

###     Send me your Pull Request

-->