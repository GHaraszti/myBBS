const redis = require('redis');
const {promisify} = require('util');

const DB = redis.createClient(6379, "127.0.0.1");

//Promisify by wrapping a function like:
//const promFunc = promisify(myFunc);
// const pSet = promisify(DB.set).bind(DB);
// const pGet = promisify(DB.get).bind(DB);
// const pHSet = promisify(DB.hset).bind(DB);
// const pHGet = promisify(DB.hget).bind(DB);
// const pMulti = promisify(DB.multi).bind(DB);
// const pHMSet = promisify(DB.hmset).bind(DB);
const pMGet = promisify(DB.mget).bind(DB);
//const pExec = promisify(DB.exec).bind(DB);
const pScan = promisify(DB.scan).bind(DB);
const pSScan = promisify(DB.sscan).bind(DB);

//Redis events
DB.on('connect', ()=>{
    console.log('Redis client connected');
});

DB.on('error', (err)=>{
    console.log(err);
});

const msgScanner = (pattern, cursor, buffer, count, page)=>{
    let params = [cursor, "match", pattern];
    if(count) params.push("count", count);
    return pScan(params).then((result)=>{
        cursor = result[0];
        let keys = result[1];
        keys.forEach((element) => {
            buffer.push(element);
        });

        return [pattern, cursor, buffer];
    })
    .then((result)=>{
        return result[1] === "0" ? result[2] : msgScanner(pattern, cursor, buffer, count, page);
    });
}

const topicScanner = (cursor, buffer, count, page)=>{
    let params = [cursor];
    if(count) params.push("count", count);
    return pSScan("topics:all-topics", cursor).then((result)=>{
        cursor = result[0];
        let keys = result[1];
        keys.forEach((element) => {
            buffer.push(element);
        });

        return [cursor, buffer];
    })
    .then((result)=>{
        return result[0] === "0" ? result[1] : topicScanner(cursor, buffer, count, page);
    });
}

const MsgDB = {
    prefix : "messages:",
    set : (topic, email, text)=>{
        let dt = Date.now();
        let key = `messages:${dt}:${topic}:${email}`;
        let message = JSON.stringify({topic, email, text, dateTime:dt});

        let promise = new Promise((resolve, reject)=>{
            return DB.MULTI()
            .SET(
                key,message
            )
            .SADD("all-messages", key)
            .EXEC((err, result)=>{
                if(!err){
                    console.log("SUCCESS");
                    resolve(result);
                } else throw Error("Could not add message.");
            });
        })
        .catch((err)=>{
            console.log(err);
            throw err;
        })
        return promise;
    },
    get : (topic, count, page)=>{
        let pattern = `messages:*:${topic}:qwe@asd.com`;
        let list = [];

        let promise = msgScanner(pattern, 0, list, count, page)
        .then((result)=>{
            return pMGet(result);
        })
        .catch((err)=>{
            console.log(err);
            throw err;
        })
        return promise;
    }
}

const TopicsDB = {
    prefix: "topics:",
    set: (topic)=>{
        let promise = new Promise((resolve, reject)=>{
            return DB.SADD("topics:all-topics", topic, (err, result)=>{
                resolve(result);
            });

        })
        .catch((err)=>{
            console.log(err);
            throw err;
        })
        return promise;
    },
    get: (count, page)=>{
        let list = [];

        let promise = topicScanner(0, list, count, page);
        // .then((result)=>{
        //     console.log(result);
        // });

        return promise;
    }
}

module.exports = {
    MsgDB,
    TopicsDB
};