//Slightly modified from https://www.shadertoy.com/view/ldX3zr

var colorUtils = require(appRoot + 'libs/color_utils');
var util = require('util');
var Pattern = require(patternRoot + 'pattern');

var HypnoRipple = function()
{
	HypnoRipple.super_.call(this);

	this.hue = Math.random();
	this.speed = Math.randomInt(10,60);
	this.intensity = 15;//Math.randomInt(10,30);
	this.falloff = 45;

	this.xoff = 20;
	this.yoff = 4;

    this.xCenter = Math.randomRange(-4.5, 4.5);
    this.yCenter = Math.randomRange(-10.5, 10.5);

	this.offset = 0;

	this.web_settings = {
		name: "HypnoRipple",
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

util.inherits(HypnoRipple, Pattern);

HypnoRipple.prototype.update = function()
{
	this.offset += (this.speed / 10000.0);
    this.hue += 0.0001;
}

HypnoRipple.prototype.shader = function(coords, led_num, tent_coords)
{
	var x = coords.point[0] + tent_coords.point[0];
	var y = coords.point[1] + tent_coords.point[1];
	var z = coords.point[2] + tent_coords.point[2];

    var normalized = Pattern.normalizeCoords(x, y, z);
    var center = [0.5, 0.5];
    var resolution = Pattern.resolution();
    var ratio = resolution[1] / resolution[0];

    var col = [normalized[0], normalized[1], 0.5 + 0.5 * Math.sin(this.offset)];
    var xC = center[0] - normalized[0];
    var yC = (center[1] - normalized[1]) * ratio;

    var r = (xC * xC + yC * yC) * -1.0;
    var zC = (0.5 + 0.5 * Math.sin((r + this.offset) / 0.1)) * 255;

    return [ col[0] * zC, col[1] * zC, col[2] * zC];
}

module.exports = HypnoRipple;
