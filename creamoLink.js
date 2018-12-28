var serialport = require("serialport");
var http = require('http');
var UrlParser = require('url');
var Speaker='2'<<1;
var RedLED='3'<<1;
var GreenLED='4'<<1;
var BlueLED='5'<<1;
var Motor1Left='6'<<1;
var Motor1Right='7'<<1;
var Motor2Left='8'<<1;
var Motor2Right='9'<<1;
var RedFND='10'<<1;
var GreenFND='11'<<1;
var BlueFND='12'<<1;
var RedMatrix='13'<<1;
var GreenMatrix='14'<<1;
var BlueMatrix='15'<<1;
var digital='32';
var output='64';
var port='128';
var on=1;
var off=0;
var blockId;
var portName="COM1"
var allPorts=[]
var toScratch = new Buffer(2);
function getSerialPort(callback){
    serialport.list(function(err,ports){
        var _allPorts=[];
        ports.forEach(function(port){
            if(port.manufacturer.indexOf('rduino')!=-1){
                _allPorts.push(port.comName)
            }
        })
        console.log(_allPorts[0])
        var serialPort= new serialport(_allPorts[0],{
            baudRate:57600
        })
       
        callback(serialPort);
        return _allPorts[0]
    })
}

getSerialPort(function (serialPort){
    serialPort.on("open",function() {
        console.log("open success")
        serialPort.on('data',function(data){
            
          data.forEach(function(a){
            toScratch[0]=data[0];
            toScratch[1]=data[1];
    
          })
        })
       
       }); 
       http.createServer(function (req, res) {
        var result = UrlParser.parse(req.url,true);
        var afterUrls = result.pathname.split('/');
       if(toScratch[0].toString(2).substr(0,5)=='11000'){
           var temp=(toScratch[0].toString(2).substr(5,3)<<7)
           var temp2=temp+toScratch[1];
           
           res.writeHead(200, {'Content-Type': 'text/plain'});
           res.end("getAnalogvalue/RedVR "+temp2+"\n");
       
       }
       if(toScratch[0].toString(2).substr(0,5)=='11001'){
           var temp=(toScratch[0].toString(2).substr(5,3)<<7)
           var temp2=temp+toScratch[1];
           
           res.writeHead(200, {'Content-Type': 'text/plain'});
           res.end("getAnalogvalue/GreenVR "+temp2+"\n");
       
       }
       if(toScratch[0].toString(2).substr(0,5)=='11010'){
           var temp=(toScratch[0].toString(2).substr(5,3)<<7)
           var temp2=temp+toScratch[1];
           
           res.writeHead(200, {'Content-Type': 'text/plain'});
           res.end("getAnalogvalue/BlueVR "+temp2+"\n");
       
       }
       if(toScratch[0].toString(2).substr(0,5)=='11011'){
           var temp=(toScratch[0].toString(2).substr(5,3)<<7)
           var temp2=temp+toScratch[1];
           
           res.writeHead(200, {'Content-Type': 'text/plain'});
           res.end("getAnalogvalue/CDS "+temp2+"\n");
       
       }
       if(toScratch[0].toString(2).substr(0,5)=='11100'){
           var temp=(toScratch[0].toString(2).substr(5,3)<<7)
           var temp2=temp+toScratch[1];
           
           res.writeHead(200, {'Content-Type': 'text/plain'});
           res.end("getAnalogvalue/Temperature "+temp2+"\n");
       
       }
       if(toScratch[0].toString(2).substr(0,5)=='11101'){
           var temp=(toScratch[0].toString(2).substr(5,3)<<7)
           var temp2=temp+toScratch[1];
           
           res.writeHead(200, {'Content-Type': 'text/plain'});
           res.end("getAnalogvalue/Humanity "+temp2+"\n");
       
       }
       if(toScratch[0].toString(2).substr(0,5)=='11110'){
           var temp=(toScratch[0].toString(2).substr(5,3)<<7)
           var temp2=temp+toScratch[1];
           
           res.writeHead(200, {'Content-Type': 'text/plain'});
           res.end("getAnalogvalue/Microphone "+temp2+"\n");
       
       }
       if(toScratch[0].toString(2).substr(0,5)=='11111'){
           var temp=(toScratch[0].toString(2).substr(5,3)<<7)
           var temp2=temp+toScratch[1];
           
           res.writeHead(200, {'Content-Type': 'text/plain'});
           res.end("getAnalogvalue/Ultrasonic "+temp2+"\n");
       
       }
       if(toScratch[0].toString(2)=='10000001'){
           res.writeHead(200, {'Content-Type': 'text/plain'});
           res.end("getDigitalvalue/RedSwitch true\n");
       }
       if(toScratch[0].toString(2)=='10000000'){
           res.writeHead(200, {'Content-Type': 'text/plain'});
           res.end("getDigitalvalue/RedSwitch false\n");
       }
       if(toScratch[0].toString(2)=='10001001'){
           res.writeHead(200, {'Content-Type': 'text/plain'});
           res.end("getDigitalvalue/GreenSwitch true\n");
       }
       if(toScratch[0].toString(2)=='10001000'){
           res.writeHead(200, {'Content-Type': 'text/plain'});
           res.end("getDigitalvalue/GreenSwitch false\n");
       }
       if(toScratch[0].toString(2)=='10001101'){
           res.writeHead(200, {'Content-Type': 'text/plain'});
           res.end("getDigitalvalue/BlueSwitch true\n");
       }
       if(toScratch[0].toString(2)=='10001100'){
           res.writeHead(200, {'Content-Type': 'text/plain'});
           res.end("getDigitalvalue/BlueSwitch false\n");
       }
       if(afterUrls[1]!='poll'){
           switch (afterUrls[2]){
               case 'Speaker':
                   blockId=Speaker;
                   break;
               case 'RedLED':
                 blockId=RedLED;
                   break;       
               case 'GreenLED':
                   blockId=GreenLED;
                   break;
               case 'BlueLED':
                 blockId=BlueLED;
                   break;
               case 'Motor1Left':
                   blockId=Motor1Left;
                   break;
               case 'Motor1Right':
                 blockId=Motor1Right;
                   break;       
               case 'Motor2Left':
                   blockId=Motor2Left;
                   break;
               case 'Motor2Right':
                 blockId=Motor2Right;
                   break;
               case 'RedFND':
                   blockId=RedFND;
                   break;
               case 'GreenFND':
                 blockId=GreenFND;
                   break;       
               case 'BlueFND':
                   blockId=BlueFND;
                   break;
               case 'RedMatrix':
                 blockId=RedMatrix;
                   break;
               case 'GreenMatrix':
                   blockId=GreenMatrix;
                   break;
               case 'BlueMatrix':
                 blockId=BlueMatrix;
                   break;              
           }
       }
        if(afterUrls[1]=='setChanel'){
           var temp=Number(afterUrls[2])
           var bf= new Buffer(2);
           bf[0]=0xc0;
           bf[1]=temp;
           serialPort.write(bf,function() {
             });
        }
        if(afterUrls[1]=='setDigitalonoff'){
           var temp=Number(port)+Number(output)+Number(digital)+Number(blockId);
           if(afterUrls[3]=='on'){
               temp=temp+Number(on)
           }
           var bf= new Buffer(1);
           bf[0]=temp;
           serialPort.write(bf,function() {
           });
        }
        if(afterUrls[1]=='setDigitalvalue'){
           var temp=Number(port)+Number(output)+Number(blockId);
           
           var value=Number(afterUrls[3])
           var value2;
           if(value>=128){
               temp=temp+1;
               value2=value&0b01111111;
           }else if(value<=127){
               temp=temp;
               value2=value;
           }
       
           var bf= new Buffer(2);
           bf[0]=temp;
           bf[1]=value2;
           serialPort.write(bf,function() {
               
           });
        }
       
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello Creamo\n');
        
       }).listen(1337);
       console.log('Server running at 1337');
})
