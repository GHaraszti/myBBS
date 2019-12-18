const {promisify} = require('util');
const http = require('http');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

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
}

function loadLogin(){

}

function loadRegister(){

}

function sendFile(req, res, fName){
    //let isAuth = bcrypt.hashSync(secret, 10);

    //Patterns for getting the file name from url and its extension
    // let permited = /\/(.+[(.html)|(.js)]$)/;
    // let file = url.match(permited)[1];
    let ext = fName.match(/\..+$/)[0];
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

    asyncReadFile("./static/templates/" + subFolder + fName, {encoding: 'utf8'}).then( (file)=>{
        res.writeHead(200, { 'Content-Type': contentType });
        res.write(file, 'utf8', ()=>{
            console.log(`File: ${fName} sent.`);
        });
        res.end();
    });
}

function authenticate (req, res){
    // let auth = req.getHeader("Authorization");
    let cookies = req.headers.cookie || "";
    let tokenPattern = /auth_token=(.+);?/ 
    let token = (cookies.match(tokenPattern) || undefined)[1];

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
});

server.on('request', (req, res)=>{
    let url = req.url;
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
            loadHomePage(req, res);
        } else {
            //Patterns for getting the file name from url and its extension
            let permited = /\/(.+[(.html)|(.js)]$)/;
            let files = url.match(permited);
            if(files){
                sendFile(req, res, files[1]);
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