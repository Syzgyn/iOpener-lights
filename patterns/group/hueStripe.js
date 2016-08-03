var util = require('util');
var Pattern = require(patternRoot + 'single/hueStripe');

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

module.exports = Stripe;
