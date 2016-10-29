# Redis Url Cache [![Build Status](https://travis-ci.org/a-lucas/redis-url-cache.svg?branch=master)](https://travis-ci.org/a-lucas/redis-url-cache)  [![codecov](https://codecov.io/gh/a-lucas/redis-url-cache/branch/master/graph/badge.svg)](https://codecov.io/gh/a-lucas/redis-url-cache)


Conditionally cache your URL's content on REDIS with RegExp. Supports ocnfig change propagation, cache instance sharing and isolation.


**Official website:**   https://ng-consult.github.io/redis-url-cache/




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
DEBUG=redis-url-cache-FS,redis-url-cache-REDIS npm test
```

###     Do the same with `mongoStorageWeirdUrl.js`

##      Update te index.d.ts to file include your new typing definitions

###     Send me your Pull Request

-->