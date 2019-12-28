const {promisify} = require('util');
const http = require('http');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
<<<<<<< HEAD
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

function loadHomePage(req, res, args){
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

          sendFile(req, res, "index.html", args);
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

function loadLatest(){
    //DB tasks
    //
    sendFile(req, res, "index.html", args);
=======

const asyncReadFile = promisify(fs.readFile);

const secret = "pizza";
const hash = "$2b$10$ypb9Qu8vovoZCTLaTONUYujEkBaA4zSt55r2X/Vz8.hO5QzFRCEYO";

function loadHomePage(req, res){
    let isAuth = bcrypt.hashSync(secret, 10);
    let fName = "";
    if(isAuth){
        fName = "index.html";
    } else {
        fName = "login.html"
    }

    // asyncReadFile("./static/templates/" + fName, {encoding: 'utf8'}).then( (html)=>{
    //     res.writeHead(200, { 'Content-Type': 'text/html' });
    //     res.write(html, 'utf8', ()=>{
    //         console.log("Main page sent");
    //     });
    //     res.end();
    // });
    sendFile(req, res, fName);
>>>>>>> 6fc5a7d4f35593d56ae0b909e8ac79ef9f72bef8
}

function loadLogin(){

}

function loadRegister(){

}

<<<<<<< HEAD
function sendFile(req, res, fName, params){
=======
function sendFile(req, res, fName){
>>>>>>> 6fc5a7d4f35593d56ae0b909e8ac79ef9f72bef8
    //let isAuth = bcrypt.hashSync(secret, 10);

    //Patterns for getting the file name from url and its extension
    // let permited = /\/(.+[(.html)|(.js)]$)/;
    // let file = url.match(permited)[1];
    let ext = fName.match(/\..+$/)[0];
<<<<<<< HEAD
    let name = fName.match(/^([a-zA-Z0-9]+)\..+$/)[1];
=======
>>>>>>> 6fc5a7d4f35593d56ae0b909e8ac79ef9f72bef8
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
<<<<<<< HEAD
            contentType = 'text/html'
            break;
    }

    asyncReadFile("./templates/" + subFolder + fName, {encoding: 'utf8'}).then( (file)=>{
        res.writeHead(200, { 'Content-Type': contentType });
        // let html = hydrate(file, params);
=======
                contentType = 'text/html'
            break;
    }

    asyncReadFile("./static/templates/" + subFolder + fName, {encoding: 'utf8'}).then( (file)=>{
        res.writeHead(200, { 'Content-Type': contentType });
>>>>>>> 6fc5a7d4f35593d56ae0b909e8ac79ef9f72bef8
        res.write(file, 'utf8', ()=>{
            console.log(`File: ${fName} sent.`);
        });
        res.end();
<<<<<<< HEAD
    })
    .catch((err)=>{
        console.log(err);
    })
=======
    });
>>>>>>> 6fc5a7d4f35593d56ae0b909e8ac79ef9f72bef8
}

function authenticate (req, res){
    // let auth = req.getHeader("Authorization");
    let cookies = req.headers.cookie || "";
    let tokenPattern = /auth_token=(.+);?/ 
<<<<<<< HEAD
    // let token = (cookies.match(tokenPattern) || undefined)[1];
    let token = hash;
=======
    let token = (cookies.match(tokenPattern) || undefined)[1];
>>>>>>> 6fc5a7d4f35593d56ae0b909e8ac79ef9f72bef8

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
<<<<<<< HEAD
=======
    // server.on('data', (chunk)=>{
    //     let route = req.url;
    
    //     switch(route){
    //         case "/":
    //             loadHomePage();
    //             break;
    //     }
    // })
    // cltSocket.on('data', (req)=>{
    //     console.log(req);
    // });
>>>>>>> 6fc5a7d4f35593d56ae0b909e8ac79ef9f72bef8
});

server.on('request', (req, res)=>{
    let url = req.url;
<<<<<<< HEAD
    let [, path, params] = url.match(/(.+)\??(.+)?/);
    let args = {};
    if(params){
        params.split('&').forEach(pair => {
            let [key,value] = pair.split('=');
            args[key] = value;
        });
    }
=======
>>>>>>> 6fc5a7d4f35593d56ae0b909e8ac79ef9f72bef8
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
        if(url == "/"){
<<<<<<< HEAD
            loadHomePage(req, res, args);
        }
        if(url == "/home"){
            loadLatest(req, res, args);
        }
        if(url == "/messages"){
            loadTopics(req, res, args);
        }
        if(url == "/topics"){
            loadMessages(req, res, args);
        } 
        else {
=======
            loadHomePage(req, res);
        } else {
>>>>>>> 6fc5a7d4f35593d56ae0b909e8ac79ef9f72bef8
            //Patterns for getting the file name from url and its extension
            let permited = /\/(.+[(.html)|(.js)]$)/;
            let files = url.match(permited);
            if(files){
<<<<<<< HEAD
                sendFile(req, res, files[1], {});
=======
                sendFile(req, res, files[1]);
>>>>>>> 6fc5a7d4f35593d56ae0b909e8ac79ef9f72bef8
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