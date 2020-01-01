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

const apiOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/',
    method: 'GET',
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded',
    //   'Content-Length': Buffer.byteLength(postData)
    // }
  };

function hydrate(hbsFile, params){
    let template = hbs.compile(hbsFile);
    let data = {
        latest: "LE title...",
        messages: "Mah body..."
    }
    let html = template(data);
    return html;
}

function loadHTML(req, res, route, args){
    //DB tasks
    const apiReq = http.request(apiOptions, (socket) => {
        let buffer = '';
        console.log(`STATUS: ${socket.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(socket.headers)}`);
        socket.setEncoding('utf8');
        socket.on('data', (chunk) => {
          console.log(`BODY: ${chunk}`);
          buffer+=chunk;
        });
        socket.on('end', () => {
          console.log(buffer);

          sendFile(req, res, `${route}.html`, args);
        });
      });
      
      apiReq.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
      });
      
      // Write data to request body
    //   apiReq.write(postData);
      apiReq.end();
    //
}

function loadHomePage(){
    //DB tasks
    //
    sendFile(req, res, "home.html", args);
}

function loadLatest(){
    //DB tasks
    //
    sendFile(req, res, "latest.html", args);
}

function loadTopics(){
    //DB tasks
    //
    sendFile(req, res, "topics.html", args);
}

function loadMessages(){
    //DB tasks
    //
    sendFile(req, res, "messages.html", args);
}

function loadLogin(){

}

function loadRegister(){

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
        // let html = hydrate(file, params);
        res.write(file, 'utf8', ()=>{
            console.log(`File: ${fName} sent.`);
        });
        res.end();
    })
    .catch((err)=>{
        console.log(err);
    })
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
    let url = req.url;

    //path is defined when params exist, npPath is defined otherwise
    let [xxx, path, params, npPath] = url.match(/(?:(\/\w+)\?(.*))|(?:(\/\w+)\??$)/);
    let args = {};
    if(params){
        params.split('&').forEach(pair => {
            let [key,value] = pair.split('=');
            args[key] = value;
        });
    }

    //If url contains no params, path is taken from npPath
    if(!path) path=npPath;

    console.log("Request received: " + url);

    // (err, payload)=>{
    //     if(payload){
    //         return payload;
    //     } else {
    //         res.writeHead(301, {'Location': "/login"});
    //         throw new Error(err);
    //     }
    // }

    let payload = authenticate(req, res)
    .then((payload)=>{
        if(path == "/"){
            loadHTML(req, res, "index", args);
        }
        if(path == "/home"){
            loadHTML(req, res, "home", args);
        }
        if(url == "/latest"){
            loadHTML(req, res, "latest", args);
        }
        if(path == "/messages"){
            loadHTML(req, res, "messages", args);
        }
        if(path == "/topics"){
            loadHTML(req, res, "topics", args);
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


// Now that proxy is running
server.listen(3000, '127.0.0.1', () => {
    console.log("Running at localhost:3000");
});