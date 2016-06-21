var colorUtils = require('../libs/color_utils');
var util = require('util');
var Pattern = require('./pattern');

var Stripe = function(settings)
{
	Stripe.super_.call(this, settings);

	this.hue = Math.random();
	this.speed = Math.randomInt(10,60);

	this.range = 10;
	this.swing = 40; 

	this.offset = 0;

	this.web_settings = {
		name: "Rotating Stripe",
		controls: [
			{
				type: 'slider',
				property: 'speed',
				value: this.speed,
				label: 'Speed',
				settings: {
					min: 10,
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
    var spherical = Pattern.coordsToSpherical(coords.point);
	var brightness = Math.cos(this.offset * 0.125 + spherical[2]); 

	return colorUtils.hsv(this.hue, 1, brightness);
}

module.exports = Stripe;
