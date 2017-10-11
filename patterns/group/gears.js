var colorUtils = require(appRoot + 'libs/color_utils');
var util = require('util');
var Pattern = require(patternRoot + 'pattern');

var Stripe = function(settings)
{
	Stripe.super_.call(this, settings);

	this.hue = Math.random();
	this.speed = 10;//Math.randomInt(10,30);

	this.range = 10;
	this.swing = 40; 

	this.offset = 0;

    this.variation = Math.randomInt(0,3);

    this.variations = [
        [0, 8],
        [4, 4],
        [0, 0],
        [4, 8],
    ];

	this.web_settings = {
		name: "Gears",
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

Stripe.prototype.shader = function(coords, led_num, tent_coords, channel)
{
    var offset = this.offset;
    if(channel % 2 == 0) {
        offset *= -1;
        offset += Math.PI * this.variations[this.variation][0];
    }

    if(Math.floor(channel / 8) % 2 == 0) {
        offset *= -1;
        offset += Math.PI * this.variations[this.variation][1];
    }
    var spherical = Pattern.coordsToSpherical(coords.point);
	var brightness = Math.cos(offset * 0.125 + spherical[2]); 

	return colorUtils.hsv(this.hue, 1, brightness);
}

module.exports = Stripe;
