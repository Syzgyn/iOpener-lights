var utils = require(appRoot + 'libs/color_utils');
var util = require('util');
var Pattern = require(patternRoot + 'pattern');

var colorWipe = function(settings){
	colorWipe.super_.call(this, settings);
	this.use_gradient = true;

	this.speed = Math.randomInt(5,10); 
	this.last_update = 100;
	this.current_led = -1;
	this.hue = Math.random();
	this.direction = Math.randomInt(0, 3);

	this.web_settings = {
		name: "Color Wipe",
		controls: [
			{
				type: 'slider',
				property: 'speed',
				value: this.speed,
				label: 'Speed',
				settings: {
					min: 5,
					max: 15,
				},
			},
		],
	};
}

util.inherits(colorWipe, Pattern);

colorWipe.prototype.update = function()
{
	this.last_update++;
	
	if(this.last_update >= this.speed)
	{
		this.last_update = 0;
		this.current_led++;
		if(this.current_led >= 36)
		{
			this.current_led = 0;
			this.hue = (this.hue + Math.random() * 0.3 + 0.1) % 1;
		}
	}


	//this.hue = (this.hue + (1.0 / 255 * 2)) % 1;
}

colorWipe.prototype.shader = function(coords, led_num)
{
	if(led_num == this.convert(this.current_led))
	{
		return utils.hsv(this.hue, 1, 1);
	}
	
	//return [0,0,0];
	return false;
}

//Switches iteration between horizontal and vertical
colorWipe.prototype.convert = function(i)
{
	//0 = vertical bouncing
	//1 = vertical not bouncing
	//2 = horizontal bouncing
	//3 = horizontal not bouncing
	if(this.direction == 0)
	{
		return i;
	}

	if(this.direction == 1)
	{
		var x = i % 6;
		var y = Math.floor(i / 6);
	}

	if(this.direction == 2 || this.direction == 3)
	{
		var y = i % 6;
		var x = Math.floor(i / 6);
	}

	if(this.direction == 3 && x % 2 == 1)
	{
		y = 5 - y;
	}

	if(y % 2 == 1)
	{
		return y * 6 + 5 - x;
	}
	else
	{
		return y * 6 + x; 
	}
}

module.exports = colorWipe; 
