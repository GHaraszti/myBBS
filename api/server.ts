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
    module?: string,
    type?: string,
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
            res.writeHead(200, { 'Content-Type' : 'text/plain'});
            res.write("Message added.");            
            res.end();   
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
    if(topic){
        topic = topic.toLowerCase();
    }
    
    TopicsDB.set(topic)
    .then((result:(string | boolean | number))=>{
        // let status = result ? result[0] : null;
        let status = result;

        console.log(result);
        if(status){
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
    .catch((err:Error)=>{
        console.log(err);
        res.statusCode = 500;
        res.write(err);            
        res.end();  
    });
}

//GET handlers
const getMessages = (req:IncomingMessage, res:ServerResponse, params:Query)=>{
    let {topic="*", count=10, page=1} = params;
    topic = topic.toLowerCase();
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
        //No results but things are OK from this side
        //throw new Error(reason);
        res.statusCode = 200;
        res.end();   
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
    let payload:(Action);
    // let payload:(Query | Message | string | null);

    // let body = [];
    req.on('end', ()=>{
        let message = socket.read();
        console.log(message);

        if(buffer !== ""){
            //Formating data
            let dataObj:(Query | Message | null) = null;
            let q:(Query | null) = null;
            let m:(Message | null) = null;

            try{
                let dec = buffer.toString() || "";
                // let pattern = /(\{"action":.+\}\})/;
                // // let params = dec.split("\n")[5];
                // let M = dec.match(pattern) || [];
                // let jsonStr = M.length > 1 ? M[1] : "";
                dataObj = JSON.parse(dec);
            } catch(err) {
                console.log(err);
                //throw err;
                console.log("Shite has happened.");
            }
            //API router
            let url = req.url;
            console.log("Request received: " + url);
            let method = req.method || "add";
            let reqDummy = new IncomingMessage(new Socket());
            console.log();
            // let {topic, email, text} = {topic:"Movie", email:"zxc@asd.com", text:"I like Indinana Jones."};  
            if(method == "GET"){
                q = dataObj;
            } else {
                m = dataObj;
            }

            switch(dataObj && url){
                case "/messages":
                    if(method === "GET"){
                        if(q)
                        getMessages(req, res, q);
                    }
                    else if(method === "POST"){
                        if(m)
                        postMessage(req, res, m);
                    }
                    break;
                case "/topics":
                    if(method === "GET"){
                        if(q)
                        getTopics(req, res, q);
                    }
                    else if(method === "POST"){
                        if(m)
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
    req.on('data', (chunk:string = "")=>{
        buffer+=chunk;
    })
    .on('close', ()=>{
        console.log("Closing connection.");
    })
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
                      