var util = require('util');
var Pattern = require(patternRoot + 'single/hueStripe');
var colorUtils = require(appRoot + 'libs/color_utils');

var Stripe = function()
{
	Stripe.super_.call(this);

	this.channel_offset = 1000;
}

util.inherits(Stripe, Pattern);

Stripe.prototype.init = function()
{
	this.offset = this.channel * this.channel_offset;
}

Stripe.prototype.shader = function(coords, led_num, tent_coords, lantern_num)
{
	var overall_coords = [
        coords.point[0] + tent_coords.point[0],
	    coords.point[1] + tent_coords.point[1],
	    coords.point[2] + tent_coords.point[2]
    ];

	var dir_var = overall_coords[this.direction];

	var remappedHue = colorUtils.remap(this.hue, 0, 1, 0, 255);
	var bigHue = (remappedHue + ((Math.cos(this.offset * 0.125 + (1.0 + dir_var)) * this.swing) + this.range / 2)) % 255; 
	var smallHue = colorUtils.remap(bigHue, 0, 255, 0, 1);
	return colorUtils.hsv(smallHue, 1, 1);
}

module.exports = Stripe;
