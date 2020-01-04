const {promisify} = require('util');
const http = require('http');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const pdfkit = require('pdfkit');
const hbs = require('handlebars');

const asyncReadFile = promisify(fs.readFile);

//For tests only
const secret = "pizza";
const hash = "$2b$10$ypb9Qu8vovoZCTLaTONUYujEkBaA4zSt55r2X/Vz8.hO5QzFRCEYO";

const postData = JSON.stringify({
    'msg': 'Hello World!'
});

const apiOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/messages',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
};

const testLatest = {
    latest:[
        {text:"I like pizza", email:"hi@there.com", topic:"Food"},
        {text:"Great game last night", email:"zup@there.com", topic:"Sports"},
        {text:"That new disc was sick!!!", email:"yo@there.com", topic:"Music"},
        {text:"I like pasta", email:"ey@there.com", topic:"Food"},
        {text:"Did you see that ludicrous display?", email:"epa@there.com", topic:"Sports"}
    ]
};

const testMessages = {
    messages:[
        {text:"I like pizza", email:"hi@there.com", topic:"Food"},
        {text:"I like tacos", email:"zup@there.com", topic:"Food"},
        {text:"I like sushi", email:"yo@there.com", topic:"Food"},
        {text:"I like pasta", email:"ey@there.com", topic:"Food"},
        {text:"I like humus", email:"epa@there.com", topic:"Food"}
    ]
};

const testTopics = {
    topics:[
        "Food",
        "Sports",
        "Music"
    ]
};

function hydrate(hbsFile, params){
    let template = hbs.compile(hbsFile);
    // let data = {
    //     latest: "LE title...",
    //     messages: "Mah body..."
    // }
    let html = template(params);
    return html;
}

function loadHTML(req, res, file, module, args){
    //If the ext is a template, do a query first, else just send the file
    let ext = file.split(".")[1];

    if(ext === "hbs"){
        let queryArgs = JSON.stringify(args);

        //request options
        const apiReqOptions = {
            hostname: 'localhost',
            port: 5000,
            path: `/${module}`,
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(queryArgs)
            }
        };
        let results, parsed;

        const apiReq = http.request(apiReqOptions, (socket) => {
            let buffer = '';
            console.log(`STATUS: ${socket.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(socket.headers)}`);
            socket.setEncoding('utf8');
            socket.on('data', (chunk) => {
                console.log(`BODY: ${chunk}`);
                buffer+=chunk;
            });
            socket.on('end', () => {
                if(buffer !== ""){
                    console.log(buffer);
                    let results, parsed;
                    try{
                        results = JSON.parse(buffer);
    
                        parsed = results.map((elem)=>{
                            let jsonMsg;
                            try {
                                jsonMsg = JSON.parse(elem);
                            } catch(err){
                                return elem;
                            }
         
                            if(jsonMsg){
                                return jsonMsg;
                            }
                        })
                    }
                    catch(err){
                        //if parsing fails return the whole json as an epty string
                        console.log(err);
                    }
    
                    let container;
                    if(parsed){
                        container = {};
                        container[module] = parsed;
                    }
                    sendFile(req, res, `${file}`, container || parsed || "");
    
                } else {
                    sendFile(req, res, `${file}`, "");
                }
            });
    });
        
        apiReq.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
        });
        
        // Write data to request body
        //   apiReq.write(postData);
        apiReq.end(queryArgs);
        //

    } else {
        //
        console.log();
        sendFile(req, res, file, {});
    }
}

function sendFile(req, res, fName, params){
    //let isAuth = bcrypt.hashSync(secret, 10);

    //Patterns for getting the file name from url and its extension
    // let permited = /\/(.+[(.html)|(.js)]$)/;
    // let file = url.match(permited)[1];
    let ext = fName.match(/\..+$/)[0];
    let name = fName.match(/^([a-zA-Z0-9]+)\..+$/)[1];
    let contentType = "";
    let subFolder = "";

    console.log(`File: ${fName} requested.`);
    switch(ext){
        case '.html':
            contentType = 'text/html';
            break;
        case '.hbs':
            contentType = 'text/html';
            break;
        case '.js':
            contentType = 'text/javascript';
            subFolder = "js/";
            break;
        default:
            contentType = 'text/html'
            break;
    }

    asyncReadFile("./templates/" + subFolder + fName, {encoding: 'utf8'}).then( (file)=>{
        res.writeHead(200, { 'Content-Type': contentType });
        let html;
        if(ext == ".hbs"){
            html = hydrate(file, params);
        }
        res.write(html ? html : file, 'utf8', ()=>{
            console.log(`File: ${fName} sent.`);
        });
        res.end();
    })
    .catch((err)=>{
        console.log(err);
    })
}

function postRequest(req, res, module, args){
    console.log();
    let postArgs = JSON.stringify(args);

    //request options
    const apiReqOptions = {
        hostname: 'localhost',
        port: 5000,
        path: `/${module}`,
        method: req.method,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postArgs)
        }
    };

    const apiReq = http.request(apiReqOptions, (socket) => {
        let buffer = "";

        socket.setEncoding('utf8');
        socket.on("data", (chunk)=>{
            console.log(chunk);
            buffer+=chunk;
        });
        socket.on('end', () => {
            if(socket.statusCode == 200){
                console.log(`So far so good.`);
                res.statusCode = 200;
                res.end("OK");
            } else {
                console.log(`Ooops.`);
                res.statusCode = 400;
                res.end("That topic already exists.");
            }
        });
    })

    apiReq.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });
    apiReq.end(postArgs);
}

function authenticate (req, res){
    // let auth = req.getHeader("Authorization");
    let cookies = req.headers.cookie || "";
    let tokenPattern = /auth_token=(.+);?/ 
    // let token = (cookies.match(tokenPattern) || undefined)[1];
    let token = hash;

    //Either wrap the verification inside a promise or promisify it
    return new Promise(function(resolve, reject){
        resolve(
            jwt.verify(token, secret, (err, payload)=>{
                if(!payload){
                    return payload;
                } throw Error(err || "Problems at the verification stage.");
            })
        );
    })
}

const server = http.createServer((req, res) => {
    //res.writeHead(200, { 'Content-Type': 'text/plain' });
    // res.end('okay');
});

server.on('connection', (req, cltSocket, head)=>{
    console.log("Client connected");
});

server.on('request', (req, res)=>{
    let buffer = "";

    req.setEncoding('utf8');
    req.on("data", (chunk)=>{
        console.log();
        if(chunk){
            buffer+=chunk;
        }
    })

    req.on("end", ()=>{
        let url = req.url;
        console.log("Request received: " + url);
        let bodyData;
    
        //path is defined when params exist, npPath is defined otherwise
        // let [xxx, path, params, npPath] = url.match(/(?:(\/\w*)\?(.*))|(?:(\/\w*)\??$)/);
        let [xxx, path, params, npPath] = url.match(/(?:(\/[A-Za-z0-9\.]*)\??(.*))/);
        let args = {};
        if(params){
            params.split('&').forEach(pair => {
                let [key,value] = pair.split('=');
                args[key] = value;
            });
        }

        if(buffer !== ""){
            bodyData = JSON.parse(buffer);
        }
    
        //If url contains no params, path is taken from npPath
        if(!path) path=npPath;
    
        let payload = authenticate(req, res)
        .then((payload)=>{
            if(path == "/"){
                loadHTML(req, res, "index.html", null, args);
            }
            else if(path == "/home"){
                loadHTML(req, res, "home.html", null, args);
            }
            else if(path == "/latest"){
                loadHTML(req, res, "latest.hbs", "messages", args);
            }
            else if(path == "/messages"){
                if(req.method === "GET")
                loadHTML(req, res, "messages.hbs", "messages", args);
                else postRequest(req, res, "messages", bodyData);
            }
            else if(path == "/topics"){
                if(req.method === "GET")
                loadHTML(req, res, "topics.hbs", "topics", args);
                else postRequest(req, res, "topics", bodyData);
            } 
            else {
                //Patterns for getting the file name from url and its extension
                let permited = /\/(.+[(.html)|(.js)]$)/;
                let files = url.match(permited);
                if(files){
                    sendFile(req, res, files[1], {});
                }
            }
        })
        .catch((err)=>{
            console.log(err);
            res.writeHead(301, {'Location': "http://127.0.0.1:7000/login"});
            res.end();
        });
        //console.log(payload);
    
    })
})


// Now that proxy is running
server.listen(3000, '127.0.0.1', () => {
    console.log("Running at localhost:3000");
});