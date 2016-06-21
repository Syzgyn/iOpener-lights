/**
* Base class for all light patterns
*/

var utils = require('../libs/color_utils');
var util = require('util');
var EventEmitter = require('events');

var Pattern = function(){
	this.FPS = 100;					//How often the pattern should be rendered, per second
	this.start_time = Date.now();	//Used to track how often to render the pattern
	this.last_run = 0;				//Last time the pattern was rendered
	this.use_gradient = false;		//If the pattern wants pixel transitions to be smooth
	this.requested_pixel = [0,0,0]; //The latest requested pixel via getCurrentColor(num)

	this.channel = 0;

	this.web_settings = {};

	this.settings = { 
		fps: 30,
	};

	//Assign the requested pixel's rgb value
	this.on('pixelValue', function(data){
		this.requested_pixel = data;
	});

	this.on('propertyChange', function(data){
		if(this.hasOwnProperty(data.property))
		{
			console.log("changing %s to %s", data.property, data.value);
			this[data.property] = data.value;

			for(var i in this.web_settings.controls)
			{
				if(this.web_settings.controls[i].property == data.property)
				{
					this.web_settings.controls[i].value = data.value;
					break;
				}
			}
		}
	});

	EventEmitter.call(this);
}

util.inherits(Pattern, EventEmitter);

/**
* Should be called by the lantern after being assigned.
* Used to init anything necessary after any variables are
* assigned externally.
*/
Pattern.prototype.init = function()
{
}

/**
* Called every loop of the main app, checks if we should 
* render the pattern based on elapsed time and it's FPS.
* You shouldn't need to override or touch this at all
*/
Pattern.prototype.tick = function()
{
	var elapsed_time = Date.now() - this.last_run;
	if(this.FPS == false || elapsed_time > 1000 / this.FPS)
	{
		this.update();
		this.last_run = Date.now();
	}
	
	this.emit('render');
}

/**
* update() is called when the pattern should be changed, before it is rendered.
* Override this with any calculations that are used to control the pattern from tick to tick
*/
Pattern.prototype.update = function()
{
}

/**
* Called by the lantern's mapPixels() method
* coords - Array - [x, y, z] of spatial values for the LED currently being rendered
* led_num - Integer - The current LED, from 0 to the total number of LEDs on the lantern
* LED's are called incrementally, starting with 0 and increasing
*/
Pattern.prototype.shader = function(coords, led_num)
{
	return [0,0,0];
}

/**
* Queries the existing color for LED i from the lantern
*/
Pattern.prototype.getCurrentColor = function(i)
{
	this.emit('getColor', i);
}

Pattern.prototype.getWebSettings = function()
{
	var settings = this.web_settings;
	settings.name = settings.name || "Unnamed Pattern";
	settings.controls = settings.controls || [];

	return settings;
}

Pattern.ledToXY = function(i)
{
	return [i % 6, Math.floor(i / 6)];
}

Pattern.XYToLed = function(x, y)
{
	if(y % 2 == 1)
	{
		return y * 6 + 5 - x;
	}
	else
	{
		return y * 6 + x; 
	}
}

Pattern.coordsToSpherical = function(x, y, z) {
    if(Array.isArray(x))
    {
        y = x[1];
        z = x[2];
        x = x[0];
    }

    return [1,
            Math.acos(z),
            Math.atan2(y, x)];
}

module.exports = Pattern;
