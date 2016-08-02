var colorUtils = require('../../libs/color_utils');
var vector = require('../../libs/vector_utils');
var Vector = require('../../libs/Vector');
var util = require('util');
var Pattern = require('../pattern');

var Tunnel = function()
{
	Tunnel.super_.call(this);
	
    this.web_settings = {
		name: "Tunnel"
    }

    this.offset = 0;
    this.hue = Math.random();
}

util.inherits(Tunnel, Pattern);

Tunnel.prototype.update = function()
{
    this.offset += 0.01;
    this.hue = (this.hue + 0.0001) % 1;
}

Tunnel.prototype._gradient = function(f)
{
    f = f % 1.5;
    var out = [];
    for(var i = 0; i < 3; i++)
    {
        //out[i] = Math.pow(0.5 + 0.5 * Math.sin(2 * (f + 0.2 * i)), 10) * 255;
        out[i] = (0.5 + 0.5 * Math.sin(2 * (f + 0.2 * i))) * 255;
    }
    
    return out;
}

Tunnel.prototype._offset = function(i)
{
    return 0.5 * Math.sin(25 * i) * Math.sin(this.offset);
}

Tunnel.prototype._tunnel = function(i, r)
{
    return this._gradient(this._offset(i + 0.25 * this.offset) + 3 * Math.log(3 * r) - this.offset);
}

Tunnel.prototype.shader = function(coords, led_num, tent_coords)
{
	var x = coords.point[0] + tent_coords.point[0];
	var y = coords.point[1] + tent_coords.point[1];
	var z = coords.point[2] + tent_coords.point[2];

    var normalized = Pattern.normalizeCoords(x, y, z);
    var resolution = Pattern.resolution();
    var ratio = resolution[1] / resolution[0];

    normalized[1] *= ratio;

    var norm = Vector.vec2(normalized).subtract(0.5);

    var dist = norm.distanceFrom([0, 0.5]);
    var depth = 1.0 / dist

    var rotation = Math.atan(norm.array[1], norm.array[0]) / Math.PI + Math.sin(this.offset / 4.0) + depth * Math.cos(this.offset * 0.3) * 0.2;

    var centerBlack = (1.0 - Math.cos(dist * Math.PI * 2)) * 0.1;

    x = (depth + this.offset * 8) % (Math.PI * 2);
    y = rotation;

    var r = (25 + (Math.sin(x - 0.5) + Math.sin(y * Math.PI) * 18) - Math.sin(x * Math.PI) * 19) * 0.3;
    var g = 1 + (Math.sin(x + 0.6) * Math.sin(y * Math.PI));
    var b = 5 + (Math.sin(x * 0.7) + Math.sin(y * Math.PI) * 5);

    //var textColor = vector.divide(vector.multiply([r, b / 3.0, b], [b, r, g]), [5.0, 5.0, 5.0]);
    //var output = vector.multiply(textColor, [centerBlack, centerBlack, centerBlack]);

    var output = new Vector([r, b / 3.0, b]).multiply([b, r, g]).divide(5.0).multiply(centerBlack);

    var clamped = [
        Math.min(output.array[0], 1),
        Math.min(output.array[1], 1),
        Math.min(output.array[2], 1)
    ];


    var hsv = colorUtils.toHsv(clamped[0], clamped[1], clamped[2]);
    var ret = colorUtils.hsv(hsv[0] + this.hue, hsv[1], hsv[2]);

    //return vector.multiply(output, [255,255,255]);

    //output = vector.multiply(output, [255,255,255]);//colorUtils.hsv(this.hue, 1, 1));
    return ret;
/*
    x = -1.0 + 2.0 * normalized[0] * ratio;
    y = -1.0 + 2.0 * normalized[1];
    var length = Math.sqrt(x * x + y * y);

    var out = this._tunnel(Math.atan(x, y), 2.0 * length); 
    if(led_num == 1)
    {
        console.log(out);
    }
    return out;
*/
}

module.exports = Tunnel;

