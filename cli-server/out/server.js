"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var stream = require("stream");
var repl = require("repl");
var net = require("net");
var logo = String.raw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        ____    ____   _____\n       / __ )  / __ ) / ___/\n      / __  | / __  | __  \n     / /_/ / / /_/ / ___/ / \n    /_____(_)_____(_)____/                      \n"], ["\n        ____    ____   _____\n       / __ )  / __ ) / ___/\n      / __  | / __  | \\__ \\ \n     / /_/ / / /_/ / ___/ / \n    /_____(_)_____(_)____/                      \n"])));
var menu = "\n\n        A) Get latest messages\n        B) Get list of topics\n        C) Get list of messages from specific topic\n\n";
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
net.createServer(function (socket) {
    repl.start({
        prompt: 'Node.js via Unix socket> ',
        input: socket,
        output: socket
    }).on('exit', function () {
        socket.end();
    });
}).listen(3000);
var templateObject_1;
//# sourceMappingURL=server.js.map