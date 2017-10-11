var colorUtils = require(appRoot + 'libs/color_utils');
var util = require('util');
var Pattern = require(patternRoot + 'pattern');

var Draw = function()
{
	Draw.super_.call(this);

	this.hue = Math.random();
	this.intensity = 15;//Math.randomInt(10,30);
	this.falloff = 45;
    this.offset = 0;
    this.speed = Math.randomInt(10,50);
    this.touchdata = "{}";
    this.points = [];

	this.web_settings = {
		name: "Draw",
		controls: [
			{
				type: 'touchpad',
				property: 'touchdata',
				label: 'Draw here',
                settings: {
                    x_min: -5.5,
                    x_max: 5.5,
                    y_min: -5.5,
                    y_max: 5.5,
                },
			},
		],
	};
}

util.inherits(Draw, Pattern);

Draw.prototype.update = function()
{
    this.points = [];
    var data = JSON.parse(this.touchdata);
    for(var k in data)
    {
        this.points.push(data[k]);
    }

	this.offset += (this.speed / 100.0);
}

Draw.prototype.shader = function(coords, led_num, tent_coords)
{
    var r = 0, g = 0, b = 0;
	var hsv = colorUtils.hsv(this.hue, 1, 1);
    
    for (var i = 0; i < this.points.length; i++) {
        var point = this.points[i];

        // Particle to sample distance
        var dx = coords.point[0] - point.x + tent_coords.point[0];
        var dy = coords.point[1] - point.y + tent_coords.point[1];
        var dz = Math.sin(this.offset / 10) - coords.point[2] + tent_coords.point[2];
        var dist2 = Math.abs(dx * dx + dy * dy + dz * dz); 

        // Particle edge falloff
        var intensity = this.intensity / (1 + this.falloff * dist2);

        // Intensity scaling
        r += hsv[0] * intensity;
        g += hsv[1] * intensity;
        b += hsv[2] * intensity;

    }

    return [r, g, b];
}

module.exports = Draw;

