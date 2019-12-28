"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var net_1 = require("net");
var http_1 = require("http");
var http = require('http');
var redis = require('http');
var _a = require('../utils/redis-messages'), MsgDB = _a.MsgDB, TopicsDB = _a.TopicsDB;
var hostname = "127.0.0.1";
var port = 5000;
var PHMessage = {
    topic: "",
    email: "",
    text: ""
};
var PHQuery = { topic: "", count: 0, page: 0 };
var PHCommand = {
    module: "",
    type: "",
    fields: PHMessage,
    query: PHQuery
};
// MsgDB.set("Food", "qwe@asd.com","I like pizza")
// .then((result:string)=>{
//     console.log(result);
//     let messages =  MsgDB.get("Food",1,0);
//     return messages;
// })
// .then((messages:[])=>{
//     console.log(messages);
// })
// .catch((err:Error)=>{
//     console.log(err.message);
// })
//POST handlers
var postMessage = function (req, res, message) {
    var topic = message.topic, email = message.email, text = message.text;
    MsgDB.set(topic, email, text)
        .then(function (result) {
        var status = result ? result[0] : null;
        console.log(result);
        if (status === "OK") {
            // res.writeHead(200, { 'Content-Type' : 'application/json'});
            // res.write("Message added.");            
            //res.end();   
        }
        else {
            throw new Error("I'm afraid shite has happened.");
        }
    })
        .catch(function (err) {
        console.log(err);
        res.statusCode = 500;
        res.write(err);
        res.end();
    });
};
var postTopic = function (req, res, topic) {
    TopicsDB.set(topic)
        .then(function (result) {
        // let status = result ? result[0] : null;
        var status = result;
        console.log(result);
        if (status === "OK" || status == true) {
            res.statusCode = 200;
            res.write("Message added.");
            res.end();
        }
        else if (status == false) {
            res.statusCode = 400;
            res.write("Topic already exists.");
            res.end();
        }
        else {
            res.statusCode = 500;
            throw new Error("I'm afraid shite has happened.");
        }
    })
        .catch(function (err) {
        console.log(err);
        res.statusCode = 500;
        res.write(err);
        res.end();
    });
};
//GET handlers
var getMessages = function (req, res, params) {
    var topic = params.topic, count = params.count, page = params.page;
    MsgDB.get(topic, count, page)
        .then(function (result) {
        console.log(result);
        if (result) {
            var jObj = JSON.stringify(result.filter(function (val) { return (val !== null); }));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(jObj);
            res.end();
        }
        else {
            throw new Error("I'm afraid shite has happened.");
        }
    }, function (reason) {
        throw new Error(reason);
    })
        .catch(function (err) {
        console.log(err);
        res.statusCode = 500;
        res.write(err);
        res.end();
    });
};
var getTopics = function (req, res, params) {
    var count = params.count, page = params.page;
    TopicsDB.get(count, page)
        .then(function (result) {
        console.log(result);
        if (result) {
            var jObj = JSON.stringify(result.filter(function (val) { return (val !== null); }));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(jObj);
            res.end();
        }
        else {
            throw new Error("I'm afraid shite has happened.");
        }
    }, function (reason) {
        throw new Error(reason);
    })
        .catch(function (err) {
        console.log(err);
        res.statusCode = 500;
        res.write(err);
        res.end();
    });
};
//Http handlers
var server = http.createServer(function (req, res) {
    console.log();
    var socket = req.socket;
    var method = req.method;
    var buffer = "";
    req.on('data', function (chunk) {
        var rr = req;
        buffer += chunk;
        console.log();
    });
    // let body = [];
    req.on('end', function () {
        var message = socket.read();
        var action = PHCommand;
        var payload;
        var url = req.url;
        console.log(message);
        try {
            var dec = buffer.toString() || "";
            var pattern = /(\{\s{0,}"action":[\s\S]+})/;
            // let params = dec.split("\n")[5];
            var M = dec.match(pattern) || [];
            var jsonStr = M.length > 1 ? M[1] : "";
            payload = JSON.parse(jsonStr);
            action = payload.action;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
        if (action) {
            //API router
            var url_1 = req.url;
            console.log("Request received: " + url_1);
            var method_1 = action.type || "add";
            var reqDummy = new http_1.IncomingMessage(new net_1.Socket());
            console.log();
            // let {topic, email, text} = {topic:"Movie", email:"zxc@asd.com", text:"I like Indinana Jones."};  
            switch (url_1) {
                case "/messages":
                    console.log("cosa");
                    if (method_1 === "get") {
                        if (action.query)
                            getMessages(req, res, action.query);
                    }
                    else if (method_1 === "add") {
                        if (payload.message)
                            postMessage(req, res, payload.message);
                    }
                    break;
                case "/topics":
                    if (method_1 === "get") {
                        if (action.query)
                            getTopics(req, res, action.query);
                    }
                    else if (method_1 === "add") {
                        if (action.fields)
                            postTopic(req, res, action.fields.topic);
                    }
                    break;
                default:
                    break;
            }
        }
        console.log("I'll take that thankyou pretty much");
        res.end("Bye~\n");
    });
    // res.writeHead(200, {'content-type': 'text/plain'});
    // res.end("Bye~\n");
    // return;
})
    // .on('connection', (cltSocket:any)=>{
    //     console.log("Client connected");
    //     let ss = server;
    //     let buffer = "";
    //     //cloSocket streams request data for queries to DB
    //     cltSocket.on('data', (chunk:string = "")=>{
    //         buffer+=chunk;
    //     })
    //     .on('close', (req:IncomingMessage, socket:Stream, head:Buffer)=>{
    //         let action:(Action | null) = PHCommand;
    //         // let ss = server;
    //         // let rsym = Symbol.for('IncomingMessage');
    //         // // let req = ss[rsym];
    //         // let req = ss[Object.getOwnPropertySymbols(ss)[0]]
    //         // let res = ss[Object.getOwnPropertySymbols(ss)[1]]
    //         // let res = ss[Symbol('ServerResponse')]; 
    //         try{
    //             let dec = buffer.toString() || "";
    //             let pattern = /(\{\s{0,}"action":[\s\S]+})/;
    //             // let params = dec.split("\n")[5];
    //             let M = dec.match(pattern) || [];
    //             let jsonStr = M.length > 1 ? M[1] : "";
    //             action = JSON.parse(jsonStr).action;
    //         } catch(err) {
    //             console.log(err);
    //             throw err;
    //         }
    //         if(action){
    //             //API router
    //             let url = `/${action.module}`;
    //             console.log("Request received: " + url);
    //             let method = action.type || "add";
    //             let reqDummy = new IncomingMessage(new Socket());
    //             console.log();
    //             // let {topic, email, text} = {topic:"Movie", email:"zxc@asd.com", text:"I like Indinana Jones."};  
    //             let req = ss[Symbol('IncomingMessage')];
    //             let res = ss[Symbol('ServerResponse')];  
    //             switch(url){
    //                 case "/messages":
    //                     if(method === "get"){
    //                         if(action.query)
    //                         getMessages(req, res, action.query);
    //                     }
    //                     else if(method === "add"){
    //                         if(action.fields)
    //                         postMessage(req, cltSocket, action.fields);
    //                     }
    //                     break;
    //                 case "/topics":
    //                     if(method === "get"){
    //                         if(action.query)
    //                         getTopics(req, res, action.query);
    //                     }
    //                     else if(method === "add"){
    //                         if(action.fields)
    //                         postTopic(req, res, action.fields.topic);
    //                     }
    //                     break;
    //                 default:
    //                     break;
    //             }
    //         }
    //         console.log("I'll take that thankyou pretty much");
    //     })
    // })
    .listen(port, hostname, function () {
    console.log("Listening to port " + port + " on " + hostname);
});
//# sourceMappingURL=server.js.map