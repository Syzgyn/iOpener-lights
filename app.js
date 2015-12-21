var IS_DEBUGGING = 1;

//Class declarations
var Lantern = require('./lantern');
var PatternController = require('./pattern-controller');
var EventEmitter = require('events');
var WebServer = require('./web.js');

//Libraries
var OPC = require('./libs/opc');
var client = new OPC('localhost', 7890);

//local vars
var NUM_LANTERNS = 2;
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
	lanterns[i] = new Lantern({opc: client, emitter: emitter, channel: i + IS_DEBUGGING});
	//lanterns[i].setPattern(pattern);
}

//Create pattern controller
var controller = new PatternController({emitter: emitter, lanterns: lanterns});

//Create web front end
var www = new WebServer({emitter: emitter});

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

setInterval(lantern_loop, 5);
setInterval(controller_loop, 1000);
