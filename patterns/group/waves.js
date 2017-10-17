var colorUtils = require(appRoot + 'libs/color_utils');
var util = require('util');
var Pattern = require(patternRoot + 'pattern');

var Waves = function()
{
	Waves.super_.call(this);

	this.hue = 200;
    this.hue_speed = 0.1;
	this.speed = 30;//Math.randomInt(10,60);
	this.intensity = 15;//Math.randomInt(10,30);
	this.falloff = 15;

    this.xCenter = Math.randomRange(-4.5, 4.5);
    this.yCenter = Math.randomRange(-10.5, 10.5);

	this.offset = 0;
    this.hue_offset = 0.0;

	this.web_settings = {
		name: "Waves",
		controls: [
			{
				type: 'slider',
				property: 'hue',
				value: this.hue,
				label: 'Color',
				settings: {
					min: 1,
					max: 256,
					step: 1,
				},
			},
			{
				type: 'slider',
				property: 'hue_speed',
				value: this.hue_speed,
				label: 'Color Speed',
				settings: {
					min: 0.1,
					max: 1.0,
					step: 0.1,
				},
			},
		],
	};
}

util.inherits(Waves, Pattern);

Waves.prototype.update = function()
{
	this.offset += (this.speed / 1000.0);
    this.hue_offset += (this.hue_speed * 1.0);
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

    this.hue = this.hue * 1.0;

    var hue = ((y * 2) + this.hue + this.hue_offset) % 256.0 / 256.0;
    var hue2 = ((y * 2) + this.hue + 60 + this.hue_offset) % 256.0 / 256.0;

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

