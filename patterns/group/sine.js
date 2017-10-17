var colorUtils = require(appRoot + 'libs/color_utils');
var util = require('util');
var Pattern = require(patternRoot + 'pattern');

var Sine = function()
{
	Sine.super_.call(this);

	this.hue = Math.random();
	this.speed = Math.randomInt(10,20);
	this.intensity = 15;//Math.randomInt(10,30);
	this.falloff = 45;

	this.xoff = 20;
	this.yoff = 4;

	this.offset = 0;

	this.web_settings = {
		name: "Sine Wave",
		controls: [
			{
				type: 'slider',
				property: 'speed',
				value: this.speed,
				label: 'Speed',
				settings: {
					min: 1,
					max: 90,
				},
			},
			{
				type: 'slider',
				property: 'hue',
				value: this.hue,
				label: 'Color',
				settings: {
					min: "0",
					max: 1,
					step: 0.001,
				},
			},
			{
				type: 'slider',
				property: 'xoff',
				value: this.xoff,
				label: 'xoff',
				settings: {
					min: 5,
					max: 50,
				},
			},
			{
				type: 'slider',
				property: 'yoff',
				value: this.yoff,
				label: 'yoff',
				settings: {
					min: 5,
					max: 50,
				},
			},
		],
	};
}

util.inherits(Sine, Pattern);

Sine.prototype.update = function()
{
	this.offset += (this.speed / 100.0);
}

Sine.prototype.shader = function(coords, led_num, tent_coords)
{
	var x = coords.point[0] + tent_coords.point[0];
	var y = coords.point[1] + tent_coords.point[1];
	var z = coords.point[2] + tent_coords.point[2];

	var z_sin = Math.sin(this.offset / 10 + x / this.xoff + y / this.yoff);
	var dist = Math.abs(z_sin - z);
	var intensity = this.intensity / (1 + this.falloff * dist);

	var hsv = colorUtils.hsv(this.hue, 1, 1);

	return [
		hsv[0] * intensity,
		hsv[1] * intensity,
		hsv[2] * intensity
	];
}

module.exports = Sine;

