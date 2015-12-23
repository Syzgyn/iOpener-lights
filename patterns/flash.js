var colorUtils = require('../libs/color_utils');
var util = require('util');
var Pattern = require('./pattern');

var Flash = function(settings)
{
	Flash.super_.call(this, settings);

	this.speed = Math.randomInt(10,60);

	this.offset = 200; //Set high so we do nothing by default

	this.offset_limit = 105;

	this.web_settings = {
		name: 'Flash',
	};
}

util.inherits(Flash, Pattern);

Flash.prototype.update = function()
{
	//Limited to two flashes
	if(this.offset < this.offset_limit)
	{
		this.offset += 1;
	}
}

Flash.prototype.shader = function(coords, led_num)
{
	var dir_var = coords.point[2]; //vertical
	//cos((x + (pos * scale)) / time) * amplitude + offset (height)
	var val = ((Math.cos((this.offset + 15) * 0.125 + (1.0 + dir_var)) * 200) + 40) % 255; 

	//Don't go negative so we don't darken any pixels
	val = Math.max(val, 0);

	return [val, val, val];
}

Flash.prototype.reset = function()
{
	this.offset = 0;
}

Flash.prototype.isActive = function()
{
	return this.offset < this.offset_limit;
}

module.exports = Flash;

