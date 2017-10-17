var colorUtils = require(appRoot + 'libs/color_utils');
var util = require('util');
var Pattern = require(patternRoot + 'pattern');

var Marquee = function()
{
	Marquee.super_.call(this);

	this.hue = 0;//Math.random();
    this.outerHue = Math.random();
    this.innerHue = Math.random();
	this.speed = 10;//Math.randomInt(10,60);
	this.intensity = 15;//Math.randomInt(10,30);
	this.falloff = 45;
	this.channel_offset = this.appConfig.debug.enabled ? this.appConfig.debug.channel_offset : 0;

	this.xoff = 20;
	this.yoff = 4;

	this.offset = 0;

	this.web_settings = {
		name: "Marquee",
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

util.inherits(Marquee, Pattern);

Marquee.prototype.update = function()
{
	this.offset += (this.speed / 100.0);
    this.hue += 0.01;
}

Marquee.prototype.isOuterRing = function(channel)
{
    var c = channel - this.channel_offset + 1;

    if (c < 9)  { return true; }
    if (c > 24) { return true; }
    if (c == 9 || c == 16 || c == 17 || c == 24) { return true; }

    return false;

}

Marquee.prototype.shader = function(coords, led_num, tent_coords, lantern_num)
{
    var num = lantern_num - 1;
    var hue = this.hue + ((Math.floor(num / 8) + num) % 4 * 0.5);

    //hue = hue % 255 * 255;
    hue = colorUtils.remap(hue % 1, 0, 1, -1, 1);

    if (this.isOuterRing(lantern_num))
    {
        var rgb = [
            colorUtils.remap(Math.sin(Math.PI * hue / 32), -1, 1, 0, 255),
            colorUtils.remap(Math.sin(Math.PI * hue / 64), -1, 1, 0, 255),
            colorUtils.remap(Math.sin(Math.PI * hue / 128), -1, 1, 0, 255),
        ];
        var rgb = colorUtils.hsv(this.outerHue, 1, hue); 
    } else {
        var rgb = [
            0,
            colorUtils.remap(Math.cos(Math.PI * hue / 128), -1, 1, 0, 255),
            colorUtils.remap(Math.sin(Math.PI * hue / 128), -1, 1, 0, 255),
        ];
        var rgb = colorUtils.hsv(this.innerHue, 1, hue); 
    }



    return rgb;

	return [
		hsv[0] * intensity,
		hsv[1] * intensity,
		hsv[2] * intensity
	];
}

module.exports = Marquee;

