var colorUtils = require(appRoot + 'libs/color_utils');
var util = require('util');
var Pattern = require(patternRoot + 'pattern');

var Ripple = function()
{
	Ripple.super_.call(this);

	this.hue = Math.random();
	this.speed = 10;//Math.randomInt(10,60);
	this.intensity = 15;//Math.randomInt(10,30);
	this.falloff = 45;

	this.xoff = 20;
	this.yoff = 4;

    this.xCenter = Math.randomRange(-4.5, 4.5);
    this.yCenter = Math.randomRange(-10.5, 10.5);

	this.offset = 0;

	this.web_settings = {
		name: "Ripple Wave",
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

util.inherits(Ripple, Pattern);

Ripple.prototype.update = function()
{
	this.offset += (this.speed / 100.0);
    this.hue += 0.0001;
}

Ripple.prototype.shader = function(coords, led_num, tent_coords)
{
	var x = coords.point[0] + tent_coords.point[0];
	var y = coords.point[1] + tent_coords.point[1];
	var z = coords.point[2] + tent_coords.point[2];

    var x_dist = x + this.xCenter;
    var y_dist = y + this.yCenter;

    var d = Math.sqrt(x_dist * x_dist + y_dist * y_dist);
    
    var hue = this.hue + Math.sin(d  - this.offset / 10) / 7 - d/40; // / (d*2)

    return colorUtils.hsv(
        hue,
        1,
        Math.sin(d - this.offset / 10)
    );
}

module.exports = Ripple;

