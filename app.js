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

//Libraries
require('./libs/misc_utils') 

//Class declarations
var Lantern = require('./lantern');
var PatternController = require('./pattern-controller');
var EventEmitter = require('events');
var WebServer = require('./web');
var OPC = require('./libs/opc');

//local vars
var NUM_LANTERNS = config.num_lanterns;
var lanterns = [];

//Create EventEmitter
var emitter = new EventEmitter();
emitter.setMaxListeners(NUM_LANTERNS + 2);

//OPC client
var client = new OPC(config.opc.host, config.opc.port);

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
