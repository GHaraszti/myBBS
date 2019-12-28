const http = require('http');
const bcrypt = require('bcrypt');
const redis = require('redis');
const jwt = require('jsonwebtoken');
//const client = redis.createClient("127.0.0.1","6379");

//Users DB
const Users = require('./utils/redis-users.js');

const secret1 = "pizza";


//Http handlers
const server = http.createServer((req, res) => {
    res.on('data', (chunk)=>{
        console.log(chunk);
    });
});

const login = (req, res)=>{
    req.on('data', d=>{
        let {email, password} = JSON.parse(d.toString('utf8'));
        //Get user if exists
        Users.get(email).then((user)=>{
            if(user){
                console.log(user);
                let parsed = JSON.parse(user);
                return bcrypt.compare(password, parsed.hash);
            } else {
                throw new Error("User not found");
            }
        })
        .then((result)=>{
            if(result){
                //return bcrypt.hash(secret1, 10);
                return jwt.sign({
                    email
                }, secret1);
            } else {
                throw new Error("Authentication failed.");
            }
        })
        .then((token)=>{
            if(token){
                // res.writeHead(200, { 'Content-Type' : "text/plain"});
                // res.write(token, 'utf8', ()=>{
                //     console.log(`Token sent: ${fName}`);
                // });
                            //Send Set-Cookie and Cookie headers with token
                res.writeHead(301, { 
                    'Set-Cookie' : `auth_token=${token}`,
                    'Location' : "/"
                });
            } else {
                res.writeHead(401, { 'WWW-Authenticate' : 'Bearer ream="Access to HomePage"'});
                res.write("GTFO");
            }

            res.end();
            //return new Promise();
        })
        .catch((e)=>{
            console.log(e.message);
            res.statusCode = 500;
            res.write(e.message);
            res.end();
        });
    });

}

const register = (req, res) => {
    req.on('data', d=>{
        let {email, password} = JSON.parse(d.toString('utf8'));
        //Get user if exists
        Users.get(email).then((user)=>{
            console.log(user);
            if(!user){
                return bcrypt.hash(password, 10);
            } else {
                throw new Error("User already exists.");        
            }
        })
        .then((hash)=>{
            if(hash){
                return Users.add(email, JSON.stringify({hash: hash}))
            } else throw Error("Hashing incomplete.");
        })
        .then((result)=>{
            if(result){
                res.statusCode = 201;
                res.write("User registered.");
                res.end();
            } else throw Error("User could not be created.");
        })
        .catch((e)=>{
            console.log(e.message);
            res.statusCode = 500;
            res.write(e.message);
            res.end();
        });
    });
}

server.on('connection', (req, cltSocket, head)=>{
    console.log("Client connected");
    // cltSocket.on('data', (chunk)=>{
    //     console.log("I'll take that thankyou pretty much");
    // })
});

server.on('request', (req, res)=>{
    let url = req.url;
    let body = req.body;
    console.log("Request received: " + url);

    if(url == "/login"){
        login(req, res);
        // .then((result)=>{
        //     console.log(result);
        // });
    } else {
        //Register
        register(req, res);
    }
})


// Now that proxy is running
server.listen(7000, '127.0.0.1', () => {
    console.log("Running at localhost:7000");
});