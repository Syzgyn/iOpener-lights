//https://www.shadertoy.com/view/Xdc3R8
var colorUtils = require(appRoot + 'libs/color_utils');
var Vector = require(appRoot + 'libs/Vector');
var util = require('util');
var Pattern = require(patternRoot + 'pattern');

var MonoSpiral = function()
{
	MonoSpiral.super_.call(this);

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
		name: "Monochrome Spiral",
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

util.inherits(MonoSpiral, Pattern);

MonoSpiral.prototype.update = function()
{
	this.offset += 0.02;
    this.hue += 0.0001;
}

MonoSpiral.prototype.shader = function(coords, led_num, tent_coords, lantern_num)
{
	var x = coords.point[0] + tent_coords.point[0];
	var y = coords.point[1] + tent_coords.point[1];
	var z = coords.point[2] + tent_coords.point[2];

    var resolution = Pattern.resolution();

    var r = new Vector([resolution[0], resolution[1]]);
    var xy = new Vector([x, y]);
    r.multiply(0.1);
    xy.subtract(r).divide(resolution[1]);
    
    var s = 0.0;

    for (var i = 0; i < 10; i++) {
        var sin = new Vector([
            Math.sin(s - 3 * this.offset + 1.6),
            Math.sin(s - 3 * this.offset + 0)
        ]);
        var txy = new Vector(xy);
        txy.multiply(s).add(sin);
        s += txy.length - 1.5;
    }

    var result = new Vector([1,2,3]);//[256, 512, 768]);
    result.divide(s * s).multiply(500);
    result.clamp(0, 254);

    var hsv = colorUtils.toHsv(result.array);
    return colorUtils.hsv(hsv[0] + this.hue, hsv[1], hsv[2]);
}

module.exports = MonoSpiral;

