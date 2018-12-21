(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.setDigitalvalue = function() {
        // Code that gets executed when the block is run
    };
    ext.setDigitalonoff = function() {
        // Code that gets executed when the block is run
    };
    ext.getDigitalvalue = function() {
        // Code that gets executed when the block is run
    };
    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            [' ', 'set %m.digital value to %n', 'setDigitalvalue','Red LED',255],
            [' ', 'set %m.digital value to %m.on', 'setDigitalonoff','Red LED','on'],
            ['b', 'get %m.digital value','getDigitalvalue','Red Switch'],
            ['r', 'get %m.analog value', 'getAnalogvalue', 'Red VR'],
            [' ', 'analog %m.analog value from %n ~ %n to %n to %n','Red Vr',0,1023,0,255]
        ],
        menus:{
            digital:["Speaker","Red LED","Green LED","Blue LED","Moter1 left","Moter1 right","Moter2 left","Moter2 right",
                     "Red FND","Green FND","Blue FND","Red Matrix","Green Matrix","Blue Matrix"
        ],
        on:["on","off"],
        digitalInput:["Red Switch","Green Switch","Blue Switch"],
        analogInput:["Red VR","Blue VR","Green VR","CDS","Temperature","Humanity","Microphone","Ultrasonic"]
        }
    };

    // Register the extension
    ScratchExtensions.register('Creamo block ', descriptor, ext);
})({});