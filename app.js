//Load config file
try {
	var config = require('./config');
} catch (ex) {
	if(ex.code == 'MODULE_NOT_FOUND')
	{
		console.log("Config file not found.  Please copy default.config.js to config.js and make any changes");
		process.exit();
	}
	else
	{
		throw ex;
	}
};

//Class declarations
var Lantern = require('./lantern');
var PatternController = require('./pattern-controller');
var EventEmitter = require('events');
var WebServer = require('./web.js');

//Libraries
var OPC = require('./libs/opc');
var client = new OPC(config.opc.host, config.opc.port);

//local vars
var NUM_LANTERNS = config.num_lanterns;
var lanterns = [];

Math.seed = function(s) {
    return function() {
		s = Math.sin(s) * 10000; return s - Math.floor(s);
	};
};

var random1 = Math.seed(Date.now());
var random2 = Math.seed(random1());
Math.random = Math.seed(random2());
Math.randomInt = function(min, max){
	return Math.floor(Math.seed(random2())() * (max - min + 1)) + min;
}

//Create EventEmitter
var emitter = new EventEmitter();

//Create Lanterns
for(var i = 0; i < NUM_LANTERNS; i++)
{
	lanterns[i] = new Lantern({opc: client, emitter: emitter, channel: i + (config.debug == true ? 1 : 0)});
	//lanterns[i].setPattern(pattern);
}

//Create pattern controller
var controller = new PatternController({emitter: emitter, lanterns: lanterns});

//Create web front end
if(config.web.enabled)
{
	var www = new WebServer({emitter: emitter, port: config.web.port});
}

function lantern_loop()
{
	for(var i = 0; i < NUM_LANTERNS; i++)
	{
		lanterns[i].tick();
	}
}

function controller_loop()
{
	controller.tick();
}

setInterval(lantern_loop, config.lantern_loop_timer);
setInterval(controller_loop, config.controller_loop_timer);
