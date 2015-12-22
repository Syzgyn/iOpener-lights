var colorUtils = require('../libs/color_utils');
var util = require('util');
var Pattern = require('./pattern');

var Stripe = function(settings)
{
	Stripe.super_.call(this, settings);

	this.hue = Math.random();
	this.speed = Math.randomInt(10,60);
	this.direction = Math.randomInt(0,2);

	this.range = 40;
	this.swing = this.range / 3;

	this.offset = 0;

	this.web_settings = {
		name: "Hue Stripe",
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
				type: 'dropdown',
				property: 'direction',
				value: this.direction,
				label: 'Direction',
				settings: {
					options: ['Forwards', 'Sideways', 'Vertical'],
				},
			},
		],
	};
}

util.inherits(Stripe, Pattern);

Stripe.prototype.update = function()
{
	this.offset += (this.speed / 100.0);
}

Stripe.prototype.shader = function(coords, led_num)
{
	var dir_var = coords.point[this.direction];

	var remappedHue = colorUtils.remap(this.hue, 0, 1, 0, 255);
	var bigHue = (remappedHue + ((Math.cos(this.offset * 0.125 + (1.0 + dir_var)) * this.swing) + this.range / 2)) % 255; 
	var smallHue = colorUtils.remap(bigHue, 0, 255, 0, 1);
	return colorUtils.hsv(smallHue, 1, 1);
}

module.exports = Stripe;
