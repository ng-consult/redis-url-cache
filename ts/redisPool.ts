import * as  redis from 'redis';


let CON = {}; // store redis connections as Object

const new_connection = (config: any) => {
    var redis_con = redis.createClient(config);
    redis_con.auth(config.auth);

    redis_con.on('error', (e) => {
        console.error(e);
        throw new Error(e);
    });
    return redis_con;
};

export const redis_connection= (type, config) => {
    type = type || 'DEFAULT'; // allow infinite types of connections

    if(!CON[type] || !CON[type].connected){
        CON[type] = new_connection(config);
    }
    return CON[type];
};

export const kill = (type) => {
    type = type || 'DEFAULT'; // kill specific connection or default one
    CON[type].end();
    delete CON[type];
};

export const killall = () => {
    var keys = Object.keys(CON);
    keys.forEach(function(k){
        CON[k].end();
        delete CON[k];
    })
};