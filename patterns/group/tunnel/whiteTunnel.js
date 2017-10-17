//https://www.shadertoy.com/view/MstGWH
var colorUtils = require(appRoot + 'libs/color_utils');
var vector = require(appRoot + 'libs/vector_utils');
var Vector = require(appRoot + 'libs/Vector');
var util = require('util');
var Pattern = require(patternRoot + 'pattern');

var WhiteTunnel = function()
{
	WhiteTunnel.super_.call(this);
	
    this.web_settings = {
		name: "WhiteTunnel"
    }

    this.offset = 0;
    this.hue = Math.random();
}

util.inherits(WhiteTunnel, Pattern);

WhiteTunnel.prototype.update = function()
{
    this.offset += 0.01;
    this.hue = (this.hue + 0.00005) % 1;
}

WhiteTunnel.prototype.shader = function(coords, led_num, tent_coords)
{
	var x = coords.point[0] + tent_coords.point[0];
	var y = coords.point[1] + tent_coords.point[1];
	var z = coords.point[2] + tent_coords.point[2];

    var normalized = Pattern.normalizeCoords(x, y, z);
    var resolution = Pattern.resolution();
    var ratio = resolution[1] / resolution[0];

    var point = new Vector([x, y]);
    //point.subtract(new Vector([resolution[0], resolution[1]]).divide(2.0));

    var output = new Vector([0.5, 1, 1]);
    output = new Vector(colorUtils.hsv(this.hue, 1, 1));
    output.divide(255.0);
    //output = Vector.vec3(1);

    var w = resolution[1] / 5.0 / point.length;
    var sin1 = Math.sin(Math.atan2(point.array[1], point.array[0]) / 0.1);
    var sin2 = Math.sin(5 * w + this.offset);
    var mult = sin1 * sin2 - 1 + w;
    output.multiply(mult);
    //output.preSubtract(1); //Invert colors
    output.multiply(255);
    return output.array;
}

module.exports = WhiteTunnel;

