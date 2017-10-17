//https://www.shadertoy.com/view/4tsGDN
var colorUtils = require(appRoot + 'libs/color_utils');
var Vector = require(appRoot + 'libs/Vector');
var util = require('util');
var Pattern = require(patternRoot + 'pattern');

var ZigzagTunnel = function()
{
	ZigzagTunnel.super_.call(this);
    this.enabled = false;
	
    this.web_settings = {
		name: "Zigzag Tunnel"
    }

    this.offset = 0;
    this.cameraPos = Vector.vec3(0);
    this.cameraTar = Vector.vec3(0);


    this.hue = Math.random();
}

util.inherits(ZigzagTunnel, Pattern);

ZigzagTunnel.prototype.update = function()
{
    this.offset += 0.01;
    //this.hue = (this.hue + 0.0001) % 1;
}

ZigzagTunnel.prototype.shader = function(coords, led_num, tent_coords)
{
	var x = coords.point[0] + tent_coords.point[0] + 5.4808;
	var y = coords.point[1] + tent_coords.point[1] + 11.4808;
	var z = coords.point[2] + tent_coords.point[2] + 0.9808;

    var normalized = new Vector(Pattern.normalizeCoords(x, y, z));
    var resolution = new Vector(Pattern.resolution());
    var ratio = resolution.array[1] / resolution.array[0];

    var z = new Vector([x, y]);
    z.multiply(2).subtract(Vector.vec2(resolution)).multiply(8).divide(new Vector([resolution.array[0], resolution.array[0]]));

    var d = 1 / Vector.dot(z, z);

    var len = new Vector(z).multiply(d);

    //Color
    var f = new Vector([d * 12, 0.5, 0]);
    //Stripes
    f.multiply(Math.sin(Math.atan2(z.array[1], z.array[0]) * 10 + d * 99 + 4 * this.offset));
    //Rings
    f.multiply(Math.sin(len.length * 50 + 2 * this.offset));
    //Depth
    //f.multiply(Math.max(Vector.dot(z, z) * 0.4 - 0.4, 0));
    f.multiply(Vector.dot(z, z) * 0.3 - 2);

    f.multiply(255);

    var hsv = colorUtils.toHsv(f.array);
    hsv[0] = (hsv[0] + this.hue) % 1;

    var rgb = colorUtils.hsv(hsv[0], hsv[1], hsv[2]);

    return f.array;
}

module.exports = ZigzagTunnel;
