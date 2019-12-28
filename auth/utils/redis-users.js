const redis = require('redis');
const {promisify} = require('util');

const client = redis.createClient(6379, "127.0.0.1");

//Promisify by wrapping a function like:
//const promFunc = promisify(myFunc);
const pSet = promisify(client.set).bind(client);
const pGet = promisify(client.get).bind(client);

//Redis events
client.on('connect', ()=>{
    console.log('Redis client connected');
});

client.on('error', (err)=>{
    console.log(err);
});

const add = (key, value) => {
    return pSet(key, value);
}

const get = (key, cb) => {
    return pGet(key);
}

// add("qwe@asd.com", JSON.stringify({hash:"qweasdzxc"})).then((result)=>{
//     console.log(result)
// },(err)=>{
//     console.log();
// });

module.exports = {
    add,
    get
};