//https://www.shadertoy.com/view/MdXGDH
//http://codingstudents.info/njmcode/oldskool-demoscene-plasma-fx-aOZpRO

var colorUtils = require(appRoot + 'libs/color_utils');
var util = require('util');
var Pattern = require(patternRoot + 'pattern');

var Plasma = function()
{
	Plasma.super_.call(this);

	this.hue = Math.random();
	this.speed = Math.randomInt(10,60);
	this.intensity = 15;//Math.randomInt(10,30);
	this.falloff = 45;

	this.xoff = 20;
	this.yoff = 4;

	this.offset = Math.randomInt(0, 100);

	this.web_settings = {
		name: "Plasma",
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

util.inherits(Plasma, Pattern);

Plasma.prototype.update = function()
{
	this.offset += (this.speed / 10000.0);
}

Plasma.prototype.shader = function(coords, led_num, tent_coords, channel)
{
	var x = coords.point[0] + tent_coords.point[0];
	var y = coords.point[1] + tent_coords.point[1];
	var z = coords.point[2] + tent_coords.point[2];

    var vec = [Math.sin(this.offset * 3.0), Math.cos(this.offset * 3.0)];

    // 0.2 is the size multiplier
    var color1 = (Math.sin((vec[0] * x + vec[1] * y) * 0.2 + this.offset * 3.0) + 1.0) / 2.0;

    var resolution = Pattern.resolution();
    var center = [
        resolution[0] / 4.0 + (resolution[0] / 4.0 * Math.sin(this.offset * -3.0)),
        resolution[1] / 4.0 + (resolution[1] / 4.0 * Math.cos(this.offset * -3.0))
    ];

    // 0.4 is the size multiplier
    var color2 = (Math.cos(Math.sqrt(Math.pow(x - center[0], 2) + Math.pow(y - center[1], 2)) * 0.4) + 1.0) / 2.0;

    var color = (color1 + color2) / 2.0;

    var red   = (Math.cos(Math.PI * color / 0.5 + this.offset * 3.0) + 1.0) / 2.0;
    var green = (Math.sin(Math.PI * color / 0.5 + this.offset * 3.0) + 1.0) / 2.0;
    var blue  = (Math.sin(this.offset * 3.0) + 1.0) / 2.0;


    var output = [
        red * 255 % 255,
        green * 255 % 255,
        blue * 255 % 255
    ];
    if(led_num == 1) {
        //console.log(channel, color1, center, color2, color, red, green, blue);
    }

    return output;

    /*
    float time = iTime *0.2;

    float color1, color2, color;
    
    color1 = (sin(dot(fragCoord.xy,vec2(sin(time*3.0),cos(time*3.0)))*0.02+time*3.0)+1.0)/2.0;
    
    vec2 center = vec2(640.0/2.0, 360.0/2.0) + vec2(640.0/2.0*sin(-time*3.0),360.0/2.0*cos(-time*3.0));
    
    color2 = (cos(length(fragCoord.xy - center)*0.03)+1.0)/2.0;
    
    color = (color1+ color2)/2.0;

    float red   = (cos(PI*color/0.5+time*3.0)+1.0)/2.0;
    float green = (sin(PI*color/0.5+time*3.0)+1.0)/2.0;
    float blue  = (sin(+time*3.0)+1.0)/2.0;
    
    fragColor = vec4(red, green, blue, 1.0);
    */
}

module.exports = Plasma;

