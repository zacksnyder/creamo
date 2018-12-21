var serialport = require("serialport");
var http = require('http');
var UrlParser = require('url');
var serialPort = new serialport( "COM14", { baudRate : 9600});
serialPort.on("open",function() {
 console.log("open success")
});
http.createServer(function (req, res) {
 var result = UrlParser.parse(req.url,true);
 if(result.pathname == '/on') {
 serialPort.write("L",function() { });
 }
 else if(result.pathname == '/off') {
 serialPort.write("0",function() { });
 }
 res.writeHead(200, {'Content-Type': 'text/plain'});
 res.end('Hello Arduino\n');
}).listen(1337);
console.log('Server running at 1337');