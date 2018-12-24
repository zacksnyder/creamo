var serialport = require("serialport");
var http = require('http');
var UrlParser = require('url');
var serialPort = new serialport( "COM14", { baudRate : 57600,autoOpen:false});
serialPort.on("open",function() {
 console.log("open success")
});
http.createServer(function (req, res) {
 var result = UrlParser.parse(req.url,true);
 

 if(result.pathname == '/on') {
var buffer = new Buffer(1);
    buffer[0]= 0xe7;
 serialPort.write(buffer,function() { 
     console.log(sizeof(buffer))
 });
 }
if(result.pathname == '/off') {
    var buffer2= new Buffer(1);
    buffer2[0] = 0xe6;
 serialPort.write(buffer2,function() { });
 console.log(buffer2)
 }
 res.writeHead(200, {'Content-Type': 'text/plain'});
 res.end('Hello Arduino\n');
}).listen(1337);
console.log('Server running at 1337');