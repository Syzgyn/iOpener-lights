var util = require('util');
var Pattern = require(patternRoot + 'single/rain');
var colorUtils = require(appRoot + 'libs/color_utils');

var Rain = function()
{
	Rain.super_.call(this);

	this.channel_offset = 0.1;
}

util.inherits(Rain, Pattern);

Rain.prototype.init = function()
{
	this.hue = this.hue + (this.channel * this.channel_offset) % 1;
}

Rain.prototype.update = function()
{
    this.offset += 0.002;
    this.hue += 0.0001;
}

Rain.prototype.shader = function(coords, led_num, tent_coords, channel)
{
	var x = coords.point[0] + tent_coords.point[0] + 10;
	var y = coords.point[1] + tent_coords.point[1] + 10;
	var z = coords.point[2] + tent_coords.point[2] + 10;

    //var output = 1 - (((y * 0.03 + x * 0.4) * ((x * 0.61) % 1) + this.offset) % 1) * 7.0;
    var output = 1 - (((y * 0.03 + x * 0.4 + z * 0.5) * ((x * 0.61) % 1) * ((z * 0.04) % 1) + this.offset) % 1) * 7.0;

    return colorUtils.hsv(this.hue, 1, output);
}

module.exports = Rain;

