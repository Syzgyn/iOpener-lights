//https://www.shadertoy.com/view/MsXSzM#
var colorUtils = require(appRoot + 'libs/color_utils');
var util = require('util');
var Pattern = require(patternRoot + 'pattern');
var pattern_lib = require(patternRoot);

var Blinky = function()
{
	Blinky.super_.call(this);

    this.decay = 0.995;
    this.trigger = 0.006;
    this.minTrigger = 0.15;

    this.numLanterns = this.appConfig.num_lanterns;
    this.lastRun = 0;
    this.lanterns = [];
    this.hue = Math.random();

	this.web_settings = {
		name: "Blinky",
    }

    for(var i = 0; i < this.numLanterns; i++)
    {
        this.lanterns[i] = [this.hue, 0];
    }
}

util.inherits(Blinky, Pattern);

Blinky.prototype.update = function()
{
    this.hue = (this.hue + 0.001) % 1;

    for(var i in this.lanterns)
    {
        this.lanterns[i][1] *= this.decay;

        if(this.lanterns[i][1] < this.minTrigger && Math.random() < this.trigger)
        {
            this.lanterns[i] = [this.hue, 1];
        }
    }
}

Blinky.prototype.shader = function(coords, led_num, tent_coords, lantern_num)
{
    if(!this.lanterns[lantern_num])
    {
        return [0,0,0];
    }

    return colorUtils.hsv(this.lanterns[lantern_num][0], 1, this.lanterns[lantern_num][1]);
}

module.exports = Blinky;
