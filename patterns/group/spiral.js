//https://www.shadertoy.com/view/XdyXD3
var colorUtils = require(appRoot + 'libs/color_utils');
var Vector = require(appRoot + 'libs/Vector');
var util = require('util');
var Pattern = require(patternRoot + 'pattern');

var Spiral = function()
{
	Spiral.super_.call(this);

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
		name: "Spiral Rainbow",
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

util.inherits(Spiral, Pattern);

Spiral.prototype.update = function()
{
	this.offset += 0.05;
    this.hue += 0.0001;
}

Spiral.prototype.shader = function(coords, led_num, tent_coords, lantern_num)
{
	var x = coords.point[0] + tent_coords.point[0];
	var y = coords.point[1] + tent_coords.point[1];
	var z = coords.point[2] + tent_coords.point[2];

    var normalized = Pattern.normalizeCoords(x, y, z);
    var resolution = Pattern.resolution();
    var ratio = resolution[1] / resolution[0];

    normalized[1] *= ratio;

    var point = new Vector([normalized[0], normalized[1]]);
    var z = new Vector(point);
    z.subtract([-1, 0]);
    point.subtract([0.5, 1.5]);

    var dot = Vector.dot(point, point);
    var matrix = [[z.array[0] / dot, z.array[1] * -1 / dot], [z.array[1] / dot, z.array[0] / dot]];

    //Matrix multiplication, kinda weird and not automated
    point.array = [
        point.array[0] * matrix[0][0] + point.array[1] * matrix[0][1],
        point.array[0] * matrix[1][0] + point.array[1] * matrix[1][1]
    ];

    point.add(0.5);

    //Not sure what the first number changes
    //Change the second number to adjust the zoom. Default is 0.5.  Negative spins the other direction
    var spiral = new Vector([0.5, 0.5]);
    spiral.multiply(Math.log(point.length)).add(this.offset / 8);

    var mult = new Vector([5, 1]);
    mult.multiply(Math.atan2(point.array[1], point.array[0]) / 6.3);

    spiral.add(mult);

    //Change these to change the color.  [0, 2.1, -2.1] is a full rainbow
    var output = new Vector([0, 1.1, -1.1]);
    for(var i in output.array)
    {
        output.array[i] = 0.5 + 0.5 * Math.sin(6 * Math.PI * spiral.array[1] + output.array[i]);
    }

    output.multiply(255);

    // return output.array;

    //Add hue shifting
    var hsv = colorUtils.toHsv(output.array);
    return colorUtils.hsv(hsv[0] + this.hue, hsv[1], hsv[2]);
}

module.exports = Spiral;

