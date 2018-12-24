<script src="/socket.io/socket.io.js"></script>
new (function() {
    var ext = this;

    var nullPort = "nothing connected";
    var availablePorts = [nullPort];
    var socket;

    var currentPort = availablePorts[0];
    var currentBaud = 9600;
    var lastMessageReceived = "";
    var lastMessageSent = "";
    var lastError = "";
    var connected = false;
    var socketConnected = false;

    var messageReceivedEvent = false;
    var portConnectedEvent = false;
    var portDisonnectedEvent = false;
    var errorThrownEvent = false;

    var descriptor = {
        blocks: [
            ['', 'refresh ports', 'refreshPorts'],
            ['r', "serial port: %m.availablePorts", 'setPort', currentPort],
            ['r', "baud rate: %m.baudRates", 'setBaud', currentBaud],
            ['', 'connect to %s at %s', 'setupSerial', currentPort, currentBaud],
            ['', 'send serial message: %s', 'sendMessage'],
            ['h', 'when serial message received', 'dataIn'],
            ['h', 'when serial port connected', 'portConnected'],
            ['h', 'when serial port disconnected', 'portDisconnected'],
            ['h', 'when serial error thrown', 'errorThrown'],
            ['b', 'port is connected', 'checkConnection'],
            ['r', 'get port name', 'getPortName'],
            ['r', 'get baud rate', 'getBaudRate'],
            ['r', 'get last incoming message', 'getLastMessageReceived'],
            ['r', 'get last outgoing message', 'getLastMessageSent'],
            ['r', 'get last error', 'getLastError'],
            ['', 'flush serial port', 'flush']
        ],
        menus: {
            availablePorts: availablePorts,
            baudRates: [9600, 19200, 38400, 57600, 74880, 115200, 230400, 250000]
        },
        url: 'https://github.com/amandaghassaei/ScratchSerialExtension'
    };

    attemptToConnectToSocket();

    function attemptToConnectToSocket(callback){

        if (socketConnected) return;
        if (socket){
            socket.disconnect();
            socket = null;
        }

        socket = io.connect('http://localhost:8080', {'forceNew':true});

        socket.on("connect_error", function(){
            socket.disconnect();
            socket = null;
            socketConnected = false;
            lastError = "node server connection error";
            connected = false;
            errorThrownEvent = true;
        });

        socket.on("socketConnected", function(){
            socketConnected = true;
            if (callback) callback();
        });

        //bind events
        socket.on('connected', function(data){

            if (data.portName) currentPort = data.portName;
            if (data.baudRate) currentBaud = data.baudRate;

            var oldPorts = availablePorts.slice();//copy array

            availablePorts.splice(0, availablePorts.length);
            if (data.availablePorts && data.availablePorts.length>0){
                for (var i=0;i<data.availablePorts.length;i++){
                    availablePorts.push(data.availablePorts[i]);
                }
            } else {
                availablePorts.push(nullPort);
                currentPort = availablePorts[0];
            }

            //check if availablePorts has changed
            if (compareArrays(availablePorts, oldPorts)){
                //this is so hacky!  I know I'm terrible, but this was the only way to update my menus
                Scratch.FlashApp.ASobj.ASloadExtension({
                    extensionName: "Serial Port",
                    blockSpecs: descriptor.blocks,
                    url: descriptor.url,
                    menus: descriptor.menus
                });
            }
        });

        socket.on("dataIn", function(data){//oncoming serial data
            lastMessageReceived = data;
            messageReceivedEvent = true;
        });

        socket.on('portConnected', function(data){
            currentPort = data.portName;
            currentBaud = data.baudRate;
            connected = true;
            portConnectedEvent = true;
        });

        socket.on('portDisconnected', function(data){
            currentPort = nullPort;
            connected = false;
            portDisonnectedEvent = true;
        });

        socket.on("errorMsg", function(data){
            if (data.error) lastError = data.error;
            else lastError = data;
            connected = false;
            errorThrownEvent = true;
        });

        socket.on("error", function(error){
            lastError = error;
            connected = false;
            errorThrownEvent = true;
        });
    }

    function compareArrays(arr1, arr2){
        if (arr1.length != arr2.length) return true;
        for (var i=0;i<arr1.length;i++){
            var match = false;
            for (var j=0;j<arr2.length;j++){
                if (arr1[i] === arr2[j]) {
                    match = true;
                    break;
                }
            }
            if (!match) return true;
        }
        return false;
    }


    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {
        if (socket) socket.disconnect();
        socket = null;
        io = null;
    };

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.refreshPorts = function(){
        if (socket) socket.emit("refreshPorts");
    };

    ext.setPort = function(portName){
        return portName;
    };
    ext.setBaud = function(baudRate){
        return baudRate;
    };

    function _setupSerial(portName, baudRate, retry){

        if (!socketConnected){
            if (retry) {
                attemptToConnectToSocket(function(){
                    _setupSerial(portName, baudRate, false);
                });
            }
            return;
        }

        if (portName === nullPort){
            if (socket) socket.emit("disconnectPort");
            return;
        }
        if (socket) socket.emit("initPort", {baudRate:baudRate, portName:portName});
    }

    ext.setupSerial = function(portName, baudRate){
        _setupSerial(portName, baudRate, true);
    };

    ext.sendMessage = function(message){
        lastMessageSent = message;
        if (socket) socket.emit("dataOut", message);
    };

    ext.dataIn = function(){
        if (messageReceivedEvent === true){
            messageReceivedEvent = false;
            return true;
        }
        return false;
    };

    ext.portConnected = function(){
        if (portConnectedEvent === true){
            portConnectedEvent = false;
            return true;
        }
        return false;
    };

    ext.portDisconnected = function(){
        if (portDisonnectedEvent === true){
            portDisonnectedEvent = false;
            return true;
        }
        return false;
    };

    ext.errorThrown = function(){
        if (errorThrownEvent === true){
            errorThrownEvent = false;
            return true;
        }
        return false;
    };

    ext.checkConnection = function(){
        return connected;
    };

    ext.getPortName = function(){
        return currentPort;
    };
    ext.getBaudRate = function(){
        return currentBaud;
    };

    ext.getLastMessageReceived = function(){
        return lastMessageReceived;
    };
    ext.getLastMessageSent = function(){
        return lastMessageSent;
    };

    ext.getLastError = function(){
        return lastError;
    };

    ext.flush = function(){
        if (socket) socket.emit("flush");
    };

    ScratchExtensions.register('Serial Port', descriptor, ext);
})();