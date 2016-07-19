var colorUtils = require('../../libs/color_utils');
var util = require('util');
var Pattern = require('../pattern');
var SimplexNoise = require('simplex-noise');

var Rings = function()
{
	Rings.super_.call(this);

    this.simplex = new SimplexNoise(Math.random);

    this.noiseScale = 0.02;
    this.speed = 0.002;
    this.wspeed = 0.01;
    this.scale = 0.15;
    this.ringScale = 3.0;
    this.wanderSpeed = 0.0005;

	this.hue = 200;
    this.hue_speed = 0.1;
	//this.speed = 40;//Math.randomInt(10,60);

    this.angle = 0.0;
    this.saturation = 0.0;
    this.spacing = 0.0;
    this.dx = 0.0;
    this.dy = 0.0
    this.dw = 0.0;

    this.centerx = 0.0;
    this.centery = 0.0;
    this.centerz = 0.0;

	this.offset = 0;
    this.hue_offset = 0.0;

	this.web_settings = {
		name: "Rings",
		controls: [
			{
				type: 'slider',
				property: 'hue',
				value: this.hue,
				label: 'Color',
				settings: {
					min: 1,
					max: 256,
					step: 1,
				},
			},
			{
				type: 'slider',
				property: 'hue_speed',
				value: this.hue_speed,
				label: 'Color Speed',
				settings: {
					min: 0.1,
					max: 1.0,
					step: 0.1,
				},
			},
		],
	};
}

util.inherits(Rings, Pattern);

Rings.prototype.update = function()
{
	this.offset += (this.speed * 1000.0);
    this.offset = new Date().getTime() * 1.0;
    this.hue_offset += (this.hue_speed * 1.0);

    this.angle = Math.sin(this.offset * 0.001);
    this.hue = this.offset;

    this.saturation = Math.min(Math.max(Math.pow(1.15 * this.noise(this.offset * 0.000122), 2.5), 0), 1);
    this.spacing = this.noise(this.offset * 0.000124) * this.ringScale;

    // Rotate movement in the XZ plane
    this.dx += Math.cos(this.angle) * this.speed;
    this.dy += Math.sin(this.angle) * this.speed;

    // Random wander along the W axis
    this.dw += (this.noise(this.offset * 0.00002) - 0.5) * this.wspeed;

    this.centerx = (this.noise(this.offset * this.wanderSpeed, 0.9) - 0.5) * 1.25;
    this.centery = (this.noise(this.offset * this.wanderSpeed, 1.4) - 0.5) * 1.25;
    this.centerz = (this.noise(this.offset * this.wanderSpeed, 1.7) - 0.5) * 1.25;

    console.debug(this.centerx, this.centery, this.centerz);
}

Rings.prototype.shader = function(coords, led_num, tent_coords)
{
	var x = coords.point[0] + tent_coords.point[0];
	var y = coords.point[1] + tent_coords.point[1];
	var z = coords.point[2] + tent_coords.point[2];

    var distx = x - this.centerx;
    var disty = y - this.centery;
    var distz = z - this.centerz;

    var dist = Math.sqrt(distx*distx + disty*disty + distz*distz);
    var pulse = (Math.sin(this.dy + dist * this.spacing) - 0.6) * 0.6;

    var n = this.fractalNoise(
        x * this.scale + this.dx + pulse,
        y * this.scale,
        z * this.scale + this.dy,
        this.dw
    ) - 0.95;

    var m = this.fractalNoise(
        x * this.scale + this.dx,
        y * this.scale,
        z * this.scale + this.dy,
        this.dw  + 10.0
    ) - 0.75;

    return colorUtils.hsv(
        this.hue + 0.2 * m,
        this.saturation,
        Math.min(Math.max(Math.pow(3.0 * n, 1.5), 0), 0.9)
    );
}

Rings.prototype.noise = function(x, spin)
{
    spin = spin || 0.01;
    return this.simplex.noise2D(x, x * spin) * 0.5 + 0.5;

}

Rings.prototype.fractalNoise = function(x, y, z, w)
{
    // 4D fractal noise (fractional brownian motion)

    var r = 0;
    var amp = 0.5;
//    console.debug("Before", r, amp, x, y, z, w);
    for (var octave = 0; octave < 4; octave++) {
        r += (this.simplex.noise4D(x, y, z, w) + 1) * amp;
        amp /= 2;
        x *= 2;
        y *= 2;
        z *= 2;
        w *= 2;
    }

//    console.debug("After", r, amp, x, y, z, w);
    return r;
}

module.exports = Rings;

