var colorUtils = require(appRoot + 'libs/color_utils');
var util = require('util');
var Pattern = require(patternRoot + 'pattern');

var Setup = function(settings)
{
	Setup.super_.call(this, settings);

    this.offset = 0;
	this.speed = 10;//Math.randomInt(10,30);
    this.count = 0;
this.enabled = this.appConfig.debug.enabled;

	this.web_settings = {
		name: "!! Setup Pattern",
		controls: [
			{
				type: 'slider',
				property: 'speed',
				value: this.speed,
				label: 'Speed',
				settings: {
					min: 10,
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
		],
	};
}

util.inherits(Setup, Pattern);

Setup.prototype.update = function()
{
	this.offset += (this.speed / 100.0);
    if (this.offset > 1) {
        this.count++;
        this.offset = 0;
    }

    if (this.count > this.appConfig.num_lanterns) {
        this.count = 0;
    }
}

Setup.prototype.shader = function(coords, led_num, tent_coords, channel)
{
    if (this.count == channel) {
        return [255,255,255];
    }

    return [0,0,0];
}

module.exports = Setup;

