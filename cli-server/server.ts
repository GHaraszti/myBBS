import { ServerResponse, IncomingMessage } from "http";
import { Socket } from "net";
import { Server } from "https";

const http = require("http");
const stream = require("stream");
const repl = require("repl");
const net = require("net");
const logo = String.raw`
        ____    ____   _____
       / __ )  / __ ) / ___/
      / __  | / __  | \__ \ 
     / /_/ / / /_/ / ___/ / 
    /_____(_)_____(_)____/                      
`;

const menu = `\n
        A) Get latest messages
        B) Get list of topics
        C) Get list of messages from specific topic
\n`;

// const agent = new http.agent({
//     keepAlive: true,
//     maxSockets: 1,
//     keepAliveMsec: 3000
// });

// const options = {
//     agent: agent
// }

// http.request(options, ()=>{
//     console.log();
// })

// const server = new http.Server();
// Create an HTTP tunneling proxy
// const server = http.createServer((request:any, socket:any) => {
//     repl.start({
//         prompt: ">> ",
//         input: socket.socket,
//         output: socket.socket,
//         // terminal: true,
//       });
// });
  
//   server.on("request", (request:any, socket:any) => {
// //  console.log(request.url);
// //  http.request({
// //  host: 'www.example.org',
// //  method: 'GET',
// //  path: "/",
// //  port: 80,
// //  keepAlive: true,
// //  keepAliveMsec: 3000
// //  }, (response:any) => response.pipe(socket))
// //  .end();
// });
// server.listen(3000, () => console.log('Proxy server listening on localhost:8080'));

net.createServer((socket:any) => {
    repl.start({
      prompt: 'Node.js via Unix socket> ',
      input: socket,
      output: socket
    }).on('exit', () => {
      socket.end();
    });
  }).listen(3000);