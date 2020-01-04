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
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.write("Message added.");
            res.end();
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
    if (topic) {
        topic = topic.toLowerCase();
    }
    TopicsDB.set(topic)
        .then(function (result) {
        // let status = result ? result[0] : null;
        var status = result;
        console.log(result);
        if (status) {
            res.statusCode = 200;
            res.write("Topic added.");
            res.end();
        }
        else {
            res.statusCode = 400;
            res.write("Topic already exists.");
            res.end();
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
    var _a = params.topic, topic = _a === void 0 ? "*" : _a, _b = params.count, count = _b === void 0 ? 10 : _b, _c = params.page, page = _c === void 0 ? 1 : _c;
    topic = topic.toLowerCase();
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
        //No results but things are OK from this side
        //throw new Error(reason);
        res.statusCode = 200;
        res.end();
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
    console.log("Client connected");
    var ss = server;
    var buffer = "";
    var payload;
    // let payload:(Query | Message | string | null);
    // let body = [];
    req.on('end', function () {
        var message = socket.read();
        console.log(message);
        if (buffer !== "") {
            //Formating data
            var dataObj = null;
            var q = null;
            var m = null;
            try {
                var dec = buffer.toString() || "";
                // let pattern = /(\{"action":.+\}\})/;
                // // let params = dec.split("\n")[5];
                // let M = dec.match(pattern) || [];
                // let jsonStr = M.length > 1 ? M[1] : "";
                dataObj = JSON.parse(dec);
            }
            catch (err) {
                console.log(err);
                //throw err;
                console.log("Shite has happened.");
            }
            //API router
            var url = req.url;
            console.log("Request received: " + url);
            var method = req.method || "add";
            var reqDummy = new http_1.IncomingMessage(new net_1.Socket());
            console.log();
            // let {topic, email, text} = {topic:"Movie", email:"zxc@asd.com", text:"I like Indinana Jones."};  
            if (method == "GET") {
                q = dataObj;
            }
            else {
                m = dataObj;
            }
            switch (dataObj && url) {
                case "/messages":
                    if (method === "GET") {
                        if (q)
                            getMessages(req, res, q);
                    }
                    else if (method === "POST") {
                        if (m)
                            postMessage(req, res, m);
                    }
                    break;
                case "/topics":
                    if (method === "GET") {
                        if (q)
                            getTopics(req, res, q);
                    }
                    else if (method === "POST") {
                        if (m)
                            postTopic(req, res, m.topic);
                    }
                    break;
                default:
                    res.writeHead(400, "Route isn't found.");
                    res.write("Sorry, the requested page doesn't exist.");
                    res.end();
                    break;
            }
        }
        console.log("I'll take that thankyou pretty much");
    });
    //cloSocket streams request data for queries to DB
    req.on('data', function (chunk) {
        if (chunk === void 0) { chunk = ""; }
        buffer += chunk;
    })
        .on('close', function () {
        console.log("Closing connection.");
    });
})
    // .on('connection', (cltSocket:any)=>{
    //     console.log("Client connected");
    //     let ss = server;
    //     let buffer = "";
    //     //cloSocket streams request data for queries to DB
    //     cltSocket.on('data', (chunk:string = "")=>{
    //         buffer+=chunk;
    //     })
    //     .on('close', ()=>{
    //         let action:(Action | null) = PHCommand;
    //         let ss = server;
    //         let rsym = Symbol.for('IncomingMessage');
    //         // let req = ss[rsym];
    //         let req = ss[Object.getOwnPropertySymbols(ss)[0]]
    //         let res = ss[Object.getOwnPropertySymbols(ss)[1]]
    //         // let res = ss[Symbol('ServerResponse')]; 
    //         try{
    //             let dec = buffer.toString() || "";
    //             let pattern = /(\{"action":.+\}\})/;
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
    // //This is for multiple request per connection
    // .on('request', (req:IncomingMessage, res:ServerResponse)=>{
    //     //Since IncomeMessage doesn't have a body property, we use a global one to append data to it.
    //     console.log("On: rquest\n");
    //     let body = [];
    //     req.on('data', (chunk:any)=>{
    //         console.log();
    //     })
    // })
    .listen(port, hostname, function () {
    console.log("Listening to port " + port + " on " + hostname);
});
//# sourceMappingURL=server.js.map