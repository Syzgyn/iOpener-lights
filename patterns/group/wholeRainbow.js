var util = require('util');
var Pattern = require('../wholeRainbow');

var Rainbow = function()
{
	Rainbow.super_.call(this);

	this.channel_offset = 0.1;
}

util.inherits(Rainbow, Pattern);

Rainbow.prototype.init = function()
{
	this.hue = this.hue + (this.channel * this.channel_offset) % 1;
}

module.exports = Rainbow;

