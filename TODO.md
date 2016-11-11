### Bugs


#### todo

- implement ignore query param 

Some conflicts may arise when `ignoreQuery=false`

for example : 

/aaa?key1=value matches /aaa/ with ignoreQuery=false and will store the key /aaa?key1=value
/aaa?key2=value matches /aaa/ with ignoreQuery=false and will store the key /aaa?key2=value

In scenario where cache is canceled with 
/aaa?key=1&timestamp=12345 , the url will be cached many times blowing up storage

Solution: {
    ignoreQuery: *, //same as ignoreQuery = false
    ignoreQuery: [timestamp, expire] // ignoreQuery = false, but will ignorethese two parameter names 
}
todo: Order the query param name a->z & upperCase -> lowerCase when url()

#### publish

Must go trough all existing cached URL and clear the urls that shouldnt be cached anymore otherwise, get() & has() will return the wrong result

#### testing

- Test the redis pool
- test the redis call back errors

- coverage
    - cacheEngine 
        - constructor, not instanciated exception
        - getInstanceName
    - RedisSToragePromise
        - clearCache calback err
        - clearDomain callback error
        - getCachedDomains callback error
        - getCachedURLs callback error
        - destroy()
        - has cb error
        - set cb error
        - delete cb error
        - get
            - connection error
            - timestamp verification
    - RedisStorageCB
        - store
    - Redis pool
        - onError
        - onEnd
        - onWarning
        - kill
    - Instance
        - default config value
        - redis cb error
        - publish cb werror
        - getRedisConfig
    - CacheRuleManager
        - AddMaxAgeRule
        - removeRule
        - remove all(MaxAge/never/always)Rules
        - add (When config value is invalid)
    - CacheRule Creator
        - Redis cb error
        - import rule: redis cb error
        







