import { Socket } from "net";
import { ServerResponse, IncomingMessage, Server } from "http";
import { read } from "fs";

const http = require('http');
const redis = require('http');
const {MsgDB, TopicsDB} = require('../utils/redis-messages');

const hostname = "127.0.0.1";
const port = 5000;

interface Message {
    topic: string,
    email?: string,
    text?: string
}

interface Query {
    topic: string,
    count?: number,
    page?: number
}

interface Action {
    module: string,
    type: string,
    fields?: Message,
    query?: Query
}

const PHMessage:Message = {
    topic: "",
    email: "",
    text:""
};

const PHQuery:Query = {topic:"", count:0, page:0};

const PHCommand:Action = {
    module:"", 
    type:"", 
    fields:PHMessage,
    query:PHQuery
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
const postMessage = (req:IncomingMessage, res: ServerResponse, message:Message)=>{
    let {topic, email, text} = message;

    MsgDB.set(topic, email, text)
    .then((result:string)=>{
        let status = result ? result[0] : null;
        console.log(result);
        if(status === "OK"){
            // res.writeHead(200, { 'Content-Type' : 'application/json'});
            // res.write("Message added.");            
            //res.end();   
        } else {
            throw new Error("I'm afraid shite has happened.");
        }
    })
    .catch((err:Error)=>{
        console.log(err);
        res.statusCode = 500;
        res.write(err);            
        res.end();  
    });
}

const postTopic = (req:IncomingMessage, res: ServerResponse, topic:string)=>{

    TopicsDB.set(topic)
    .then((result:(string | boolean))=>{
        // let status = result ? result[0] : null;
        let status = result;

        console.log(result);
        if(status === "OK" || status == true){
            res.statusCode = 200;
            res.write("Message added.");            
            res.end();   
        } else if (status == false){
            res.statusCode = 400;
            res.write("Topic already exists.");            
            res.end();   
        } 
        else {
            res.statusCode = 500;
            throw new Error("I'm afraid shite has happened.");
        }
    })
    .catch((err:Error)=>{
        console.log(err);
        res.statusCode = 500;
        res.write(err);            
        res.end();  
    });
}

//GET handlers
const getMessages = (req:IncomingMessage, res:ServerResponse, params:Query)=>{
    let {topic, count, page} = params;
    MsgDB.get(topic, count, page)
    .then((result:[])=>{
        console.log(result);
        if(result){
            let jObj = JSON.stringify(result.filter(val=>(val !== null)));
            res.writeHead(200, { 'Content-Type' : 'application/json'});
            res.write(jObj);            
            res.end();   
        } else {
            throw new Error("I'm afraid shite has happened.");
        }
    },(reason:string)=>{
        throw new Error(reason)
    })
    .catch((err:Error)=>{
        console.log(err);
        res.statusCode = 500;
        res.write(err);            
        res.end();  
    });
}

const getTopics = (req:IncomingMessage, res:ServerResponse, params:Query)=>{
    let {count, page} = params;
    TopicsDB.get(count, page)
    .then((result:[])=>{
        console.log(result);
        if(result){
            let jObj = JSON.stringify(result.filter(val=>(val !== null)));
            res.writeHead(200, { 'Content-Type' : 'application/json'});
            res.write(jObj);            
            res.end();   
        } else {
            throw new Error("I'm afraid shite has happened.");
        }
    },(reason:string)=>{
        throw new Error(reason)
    })
    .catch((err:Error)=>{
        console.log(err);
        res.statusCode = 500;
        res.write(err);            
        res.end();  
    });
}

//Http handlers
const server = http.createServer((req:IncomingMessage, res:ServerResponse) => {
    console.log();
    let socket = req.socket;
    console.log("Client connected");
    let ss = server;
    let buffer = "";
    let payload:(Action | null) = PHCommand;

    // let body = [];
    req.on('end', ()=>{
        let message = socket.read();
        console.log(message);

        try{
            let dec = buffer.toString() || "";
            // let pattern = /(\{"action":.+\}\})/;
            // // let params = dec.split("\n")[5];
            // let M = dec.match(pattern) || [];
            // let jsonStr = M.length > 1 ? M[1] : "";
            payload = JSON.parse(dec);
            
        } catch(err) {
            console.log(err);
            throw err;
        }

        if(payload){
            //API router
            let url = req.url;
            console.log("Request received: " + url);
            let method = req.method || "add";
            let reqDummy = new IncomingMessage(new Socket());
            console.log();
            // let {topic, email, text} = {topic:"Movie", email:"zxc@asd.com", text:"I like Indinana Jones."};  

            switch(url){
                case "/messages":
                    if(method === "GET"){
                        if(payload.query)
                        getMessages(req, res, payload.query);
                    }
                    else if(method === "POST"){
                        if(payload.fields)
                        postMessage(req, res, payload.fields);
                    }
                    break;
                case "/topics":
                    if(method === "GET"){
                        if(payload.query)
                        getTopics(req, res, payload.query);
                    }
                    else if(method === "POST"){
                        if(payload.fields)
                        postTopic(req, res, payload.fields.topic);
                    }
                    break;
                default:
                    break;
            }
        }

        console.log("I'll take that thankyou pretty much");
    });

    //cloSocket streams request data for queries to DB
    req.on('data', (chunk:string = "")=>{
        buffer+=chunk;
    })
    .on('close', ()=>{

    })
    
    res.writeHead(200, {'content-type': 'text/plain'});
    res.end("Bye~\n");
    return;
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
.listen(port, hostname, () => {
    console.log(`Listening to port ${port} on ${hostname}`);
});
                      