var utils = require(appRoot + 'libs/color_utils');
var util = require('util');
var Pattern = require(patternRoot + 'pattern');

var RainbowSparkle = function()
{
	RainbowSparkle.super_.call(this);
	this.name = "Rainbow + Sparkles";
	this.FPS = false;

	this.time_offset = 0;
	this.random_offset = Math.random() * 100000 + 30000;
	this.random_values = [];
	this.num_leds = 36;
	
	this.web_settings = {
		name: "Rainbow + Sparkles",
	};
	
	for(var i = 0; i < 36; i++)
	{
		this.random_values.push(Math.random());
	}
}

util.inherits(RainbowSparkle, Pattern);

RainbowSparkle.prototype.update = function()
{
	this.time_offset = (Date.now() - this.start_time) / 1000 + this.random_offset;	
};

RainbowSparkle.prototype.shader = function(coords, led_num)
{
//console.log(0, coords, led_num);
	var x = coords.point[0],
		y = coords.point[1],
		z = coords.point[2];

	y += utils.cos(x + 0.2*z, 0.0, 1.0, 0.0, 0.6);
	z += utils.cos(x, 0.0, 1.0, 0.0, 0.3);
	x += utils.cos(y + z, 0.0, 1.5, 0.0, 0.2);

//console.log(1,x,y,z);

	var x1 = x;
	x = y;
	y = z;
	z = x1;

	var r = utils.cos(x, this.time_offset / 4, 2.5, 0.0, 1.0),
		g = utils.cos(y, this.time_offset / 4, 2.5, 0.0, 1.0),
		b = utils.cos(z, this.time_offset / 4, 2.5, 0.0, 1.0);

//console.log(2, r, g, b);

	var contrasted = utils.contrast([r,g,b], 0.5, 1.4);
	r = contrasted[0];
	g = contrasted[1];
	b = contrasted[2];

//console.log(3, r, g, b);


	var clampdown = (r + g + b)/2;
	clampdown = utils.remap(clampdown, 0.4, 0.5, 0, 1);
	clampdown = utils.clamp(clampdown, 0.0, 1.0);
	clampdown *= 0.9;

	//r *= clampdown
	//g *= clampdown
	//b *= clampdown


	// black out regions
	var r2 = utils.cos(x, this.time_offset / 10 + 12.345, 4, 0.0, 1.0),
		g2 = utils.cos(y, this.time_offset / 10 + 24.536, 4, 0.0, 1.0),
		b2 = utils.cos(z, this.time_offset / 10 + 34.675, 4, 0.0, 1.0);
	
	clampdown = (r2 + g2 + b2)/2;
	clampdown = utils.remap(clampdown, 0.2, 0.3, 0, 1);
	clampdown = utils.clamp(clampdown, 0, 1);
	r *= clampdown;
	g *= clampdown;
	b *= clampdown;

//console.log(4, r, g, b, clampdown);

	//color scheme: fade towards blue-and-orange
	g = g * 0.6 + ((r+b) / 2) * 0.4;

	//fade behind twinkle
	var fade = Math.pow(utils.cos(this.time_offset - led_num / this.num_leds, 0.0, 7.0, 0.0, 1.0), 20);
	fade = 1 - fade*0.2
	r *= fade
	g *= fade
	b *= fade

//console.log(5, r, g, b);

	// twinkle occasional LEDs
	var twinkle_speed = 0.007,
		twinkle_density = 0.2;
	var twinkle = (this.random_values[led_num] * 7 + (Date.now() / 50) * twinkle_speed) % 1;
	twinkle = Math.abs(twinkle * 2 - 1);
	twinkle = utils.remap(twinkle, 0.0, 1.0, -1 / twinkle_density, 1.1);
	twinkle = utils.clamp(twinkle, -0.5, 1.1);
	twinkle = Math.pow(twinkle, 5);
	twinkle *= Math.pow(utils.cos(this.time_offset - led_num / this.num_leds, 0.0, 7.0, 0.0, 1.0), 20);
	twinkle = utils.clamp(twinkle, -0.3, 1.0);

	r += twinkle
	g += twinkle
	b += twinkle

//console.log(6, r, g, b);

	// apply gamma curve
	// only do this on live leds, not in the simulator
	//r, g, b = color_utils.gamma((r, g, b), 2.2)

//console.log('end', [r, g, b]);
//	throw new Error();
	return [r*256, g*256, b*256];
};


module.exports = RainbowSparkle;
