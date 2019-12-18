import { ServerResponse, IncomingMessage } from "http";
import { Socket } from "net";
import { Server } from "https";

const http = require("http");
const stream = require("stream");
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

// const spawn = require('child_process').spawn;
//    let ls = spawn('ls', ['-lh', '.']);
//    ls.stdout.on('readable', function(this:any) {
//        let d = this.read();
//        d && console.log(d.toString());
//    });
//    ls.on('close', (code:string) => {
//        console.log(`child process exited with code: ${code}`);
// });

class MyDuplex extends stream.Transform {
    constructor(name:string, options?:{}) {
        super(options);
        this.name = name;
    }


    _transform(chunk:string, encoding:string, callback:Function) {
        this.push(chunk);
        console.log(this.name + ' writes: ' + chunk + '\n');
        callback();
    }

    _read(chunk:string){
        console.log();
    }

    _write(a:any, b:any){
        console.log();
    }
}

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

http.createServer(function(request:any,response:any){
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
        // body: "asdasdasdasdasdasdsad",
        // form: {
        //     cosa: "asdasd"
        // }
    };

    //New request to API service
    var proxy = http.request(options, function (proxy_res:any) { 
        // proxy_res.pipe(response, {
        // end: false
        // });
        proxy_res.setEncoding('utf8');
        proxy_res.on('data', function (chunk:string) {
          console.log("body: " + chunk);
        });
        response.on('end', function() {
            proxy_res.send("ok");
        });
    })
    .on('error', (err:Error)=>{
        console.log();
    });

    let payload = {
        action : {
            type: "add",
            module: "messages",
            fields: {
                text: "Me gusta la pizza.",
                topic: "Food",
                email: "qwe@asd.com"
            },

        }
    }
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

}).listen(3000, "localhost", ()=>{
    console.log(`Listening to port ${3000} on ${"localhost"}`);
});