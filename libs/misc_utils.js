var config = require('../config');

//Random seed function
//From http://stackoverflow.com/questions/521295/javascript-random-seeds
Math.seed = function(s) {
    return function() {
		s = Math.sin(s) * 10000; return s - Math.floor(s);
	};
};

var one = Math.seed(Date.now());
var two = Math.seed(one());
Math.random = Math.seed(two());

//Get a random int between min and max, inclusive
Math.randomInt = function(min, max) {
	return Math.floor(Math.seed(two())() * (max - min + 1)) + min;
}

Math.randomRange = function(min, max) {
	return Math.seed(two())() * (max - min + 1) + min;
}

//Debugging output
console.debug = function()
{
	if(!config.debug.enabled)
	{
		return;
	}

	var args = new Array(arguments.length);
    for(var i = 0; i < args.length; ++i) {
                //i is always valid index in the arguments object
        args[i] = arguments[i];
    }

	console.log.apply(console, args);
}
