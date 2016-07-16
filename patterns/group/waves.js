var colorUtils = require('../../libs/color_utils');
var util = require('util');
var Pattern = require('../pattern');

var Waves = function()
{
	Waves.super_.call(this);

	this.hue = Math.random();
	this.speed = 40;//Math.randomInt(10,60);
	this.intensity = 15;//Math.randomInt(10,30);
	this.falloff = 45;

	this.xoff = 20;
	this.yoff = 4;

    this.xCenter = Math.randomRange(-4.5, 4.5);
    this.yCenter = Math.randomRange(-10.5, 10.5);

	this.offset = 0;

	this.web_settings = {
		name: "Waves",
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

util.inherits(Waves, Pattern);

Waves.prototype.update = function()
{
	this.offset += (this.speed / 1000.0);
    this.hue += 0.1;
}

Waves.prototype.shader = function(coords, led_num, tent_coords)
{
	var x = coords.point[0] + tent_coords.point[0];
	var y = coords.point[1] + tent_coords.point[1];
	var z = coords.point[2] + tent_coords.point[2];

    var waveOne = (Math.sin((y - this.offset) / 3) * 5);
    var waveTwo = (Math.sin((y - this.offset * 0.8) / 3) * 5);
//    waveTwo = waveOne * -1;

    var xOffOne = x - waveOne;
    var distOne = Math.sqrt(xOffOne * xOffOne);

    var xOffTwo = x - waveTwo;
    var distTwo = Math.sqrt(xOffTwo * xOffTwo);

    var hue = ((y * 2) + this.hue) % 256.0 / 256.0;
    var hue2 = ((y * 2) + this.hue + 60) % 256.0 / 256.0;

    if(distOne < 0.1)
    {
        return colorUtils.hsv(hue, 1, 1);
    }
    else if(distTwo < 0.1)
    {
        return colorUtils.hsv(hue2, 1, 1);
    }

    return -2.0;
    return Math.random() - 0.7;
}

module.exports = Waves;

