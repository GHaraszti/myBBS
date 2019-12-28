"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
<<<<<<< HEAD
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
=======
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var stream = require("stream");
var logo = String.raw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        ____    ____   _____\n       / __ )  / __ ) / ___/\n      / __  | / __  | __  \n     / /_/ / / /_/ / ___/ / \n    /_____(_)_____(_)____/                      \n"], ["\n        ____    ____   _____\n       / __ )  / __ ) / ___/\n      / __  | / __  | \\__ \\ \n     / /_/ / / /_/ / ___/ / \n    /_____(_)_____(_)____/                      \n"])));
var menu = "\n\n        A) Get latest messages\n        B) Get list of topics\n        C) Get list of messages from specific topic\n\n";
// const spawn = require('child_process').spawn;
//    let ls = spawn('ls', ['-lh', '.']);
//    ls.stdout.on('readable', function(this:any) {
//        let d = this.read();
//        d && console.log(d.toString());
//    });
//    ls.on('close', (code:string) => {
//        console.log(`child process exited with code: ${code}`);
// });
var MyDuplex = /** @class */ (function (_super) {
    __extends(MyDuplex, _super);
    function MyDuplex(name, options) {
        var _this = _super.call(this, options) || this;
        _this.name = name;
        return _this;
    }
    MyDuplex.prototype._transform = function (chunk, encoding, callback) {
        this.push(chunk);
        console.log(this.name + ' writes: ' + chunk + '\n');
        callback();
    };
    MyDuplex.prototype._read = function (chunk) {
        console.log();
    };
    MyDuplex.prototype._write = function (a, b) {
        console.log();
    };
    return MyDuplex;
}(stream.Transform));
// let aStream = new MyDuplex('A');
// let bStream = new MyDuplex('B');
// aStream.pipe(bStream).pipe(aStream);
// aStream.on('end', (chunk:string) => {
//     console.log('A read: ' + chunk + '\n');
// })
// aStream.write('Hello B some bytes more!');
// aStream.resume();
// bStream.on('end', (chunk:string) => {
//     console.log('B read: ' + chunk + '\n');
// });
// bStream.write('Hello A!');
// var HTTP = require("http");
// HTTP.createServer(function(request:IncomingMessage, response:ServerResponse) {
// 	var body = "";
// 	let respond:(Function | null) = function (status:any) {
// 		response.writeHead(status, { "Content-Type": "text/plain" });
// 		response.end(body);
// 		respond = null;
// 	}
// 	function addListeners() {
// 		request.on("data", function(data) {
// 			body += data.toString();
// 		});
// 		request.on("end", function() {
// 			respond(200);
// 		});
// 		setTimeout(function() {
// 			respond && respond(500);
// 		}, 1000);
// 		console.log("handlers registered");
// 	}
// 	console.log("=== " + request.url + " ===");
// 	if (request.url === "/1") {
// 		console.log("case 1: immediately add event listeners");
// 		addListeners();
// 	} else if (request.url === "/2") {
// 		console.log("case 2: defer adding event listeners");
// 		process.nextTick(addListeners);
// 	} else {
// 		respond(404);
// 	}
// 	console.log("returning from request listener");
// }).listen(8081);
// var spawn = require('child_process').spawn;
// var cmd  = spawn('ruby', ['testRuby.rb']);
// var counter = 0;
// cmd.stdout.on('data', function(data:string) {
//     counter ++;
//   console.log('stdout: ' + data);
// });
// cmd.stderr.on('data', function(data:string) {
//   console.log('stderr: ' + data);
// });
// cmd.on('exit', function(code:string) {
//   console.log('exit code: ' + code);
//   console.log(counter);
// });
// http.createServer(onRequest).listen(3000);
// function onRequest(client_req:IncomingMessage, client_res:ServerResponse) {
//   console.log('serve: ' + client_req.url);
//   var options = {
//     hostname: 'localhost',
//     port: 3000,
//     path: client_req.url,
//     method: client_req.method,
//     headers: client_req.headers
//   };
//   var proxy = http.request(options, function (proxy_res:any) {
//     client_res.writeHead(proxy_res.statusCode, proxy_res.headers)
//     client_res.write("Hey listen!!");
//     proxy_res.pipe(client_res, {
//       end: false
//     });
//   });
//     proxy.on('request', ()=>{
//         console.log();
//     });
//     proxy.on('data', ()=>{
//         console.log();
//     });
//   client_req.pipe(proxy, {
//     end: false
//   });
// }
http.createServer(function (request, response) {
    // //Client request handlers
    // request.on('data',function(message:string){
    //     console.log();
    //     // proxy.write(`{"topic":"Food"}`);
    //     // proxy.end();   
    // })
    // .on('error',function(err:any){
    //     console.log(err);
    // })
    // .on('end',function(){
    //     console.log();
    //     response.end();
    // });
    // response.write(logo + "\n" + menu);
    //Options for making request to API service
    var options = {
        hostname: 'localhost',
        port: 5000,
        path: "/messages",
        method: "GET",
        headers: { "Content-Type": "application/json" },
    };
    //New request to API service
    var proxy = http.request(options, function (proxy_res) {
        // proxy_res.pipe(response, {
        // end: false
        // });
        proxy_res.setEncoding('utf8');
        proxy_res.on('data', function (chunk) {
            console.log("body: " + chunk);
        });
        response.on('end', function () {
            proxy_res.send("ok");
        });
    })
        .on('error', function (err) {
        console.log();
    });
    var payload = {
        action: {
            type: "add",
            module: "messages",
            fields: {
                text: "Me gusta la pizza.",
                topic: "Food",
                email: "qwe@asd.com"
            },
        }
    };
    proxy.write(JSON.stringify(payload));
    proxy.end();
    //     return http.get(options, function(response:ServerResponse) {
    //         // Continuously update stream with data
    //         var body = '';
    //         response.on('data', function(d) {
    //             body += d;
    //         });
    //         response.on('end', function() {
    // // Data received, let us parse it using JSON!
    //             var parsed = JSON.parse(body);
    //             // callback({
    //             //     userDetail: parsed.name,
    //             //     userId: parsed.Id
    //             // });
    //         });
    //     });
}).listen(3000, "localhost", function () {
    console.log("Listening to port " + 3000 + " on " + "localhost");
});
>>>>>>> 6fc5a7d4f35593d56ae0b909e8ac79ef9f72bef8
var templateObject_1;
//# sourceMappingURL=server.js.map