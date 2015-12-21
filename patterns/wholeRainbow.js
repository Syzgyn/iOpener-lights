var colorUtils = require('../libs/color_utils');
var util = require('util');
var Pattern = require('./pattern');

var Rainbow = function(settings)
{
	Rainbow.super_.call(this, settings);

	this.FPS = 60;
	this.hue = 0;
	this.speed = Math.randomInt(1,100);

	this.web_settings = {
		name: "Solid Rainbow",
		controls: [
			{
				type: 'slider',
				property: 'speed',
				value: this.speed,
				label: 'Speed',
				settings: {
					min: 1,
					max: 100,
				},
			},
		],
	};

}

util.inherits(Rainbow, Pattern);

Rainbow.prototype.update = function()
{
	this.hue = this.hue + this.speed / 10000 % 1;
}

Rainbow.prototype.shader = function(coords, led_num)
{
	return colorUtils.hsv(this.hue, 1, 1);
}

module.exports = Rainbow;
