var colorUtils = require('../libs/color_utils');
var util = require('util');
var Pattern = require('./pattern');

var Stripe = function(settings)
{
	Stripe.super_.call(this, settings);

	this.speed = Math.randomInt(10,60);
	this.direction = Math.randomInt(0,2);
	this.width = Math.randomInt(20, 80);

	this.offset = 0;

	this.web_settings = {
		name: "Rainbow Stripe",
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
				property: 'width',
				value: this.width,
				label: 'Color Width',
				settings: {
					min: 15,
					max: 90,
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
	var bigHue = (((1.0 + dir_var) * this.width) + (this.offset / 1.0)) % 255;
	var smallHue = colorUtils.remap(bigHue, 0, 255, 0, 1);

	return colorUtils.hsv(smallHue, 1, 1);
}

module.exports = Stripe;
