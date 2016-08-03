var utils = require(appRoot + 'libs/color_utils');
var util = require('util');
var Pattern = require(patternRoot + 'pattern');

var Rain = function(settings){
	Rain.super_.call(this, settings);
	this.use_gradient = true;

    this.offset = 0;
	this.speed = Math.randomInt(5,10); 
	this.hue = Math.random();

    this.drop_chance = 0.02;
    this.drop_speed = 0.01;
    this.drops = [];

    this.lightning_chance = 0.0001;
    this.lightning_brightness = 0.0;

	this.web_settings = {
		name: "Rain",
		controls: [
			{
				type: 'slider',
				property: 'speed',
				value: this.speed,
				label: 'Speed',
				settings: {
					min: 0.0,
					max: 15,
				},
			},
		],
	};
}

util.inherits(Rain, Pattern);

Rain.prototype.update = function()
{
    this.offset += 0.02;
    
    if(Math.random() < this.drop_chance)// && this.drops.length == 0)
    {
        this.drops.push({
            point: [Math.random() * 2 - 1, Math.random()* 2 - 1, 1.5],
            speed: this.drop_speed + (Math.random() * 0.008),
        });
    }

    if(Math.random() < this.lightning_chance)
    {
        this.lightning_brightness = 255;
    }

    for(var i in this.drops)
    {
        this.drops[i].point[2] -= this.drops[i].speed;
        if(this.drops[i].point[2] < -1.5)
        {
            this.drops.splice(i, 1);
        }
    }

    if(this.lightning_brightness > 0)
    {  
        this.lightning_brightness -= 1;
    }
}

Rain.prototype.shader = function(coords, led_num)
{
    //Set the top of the lantern as the cloud
    if(coords.point[2] >= 0.75)
    {
        var s1 = utils.cos(coords.point[0], this.offset / 10 + 12.345, 4, 0, 1)
        var s2 = utils.cos(coords.point[1], this.offset / 10 + 24.536, 4, 0, 1)
        var clampdown = (s1 + s2)/2
        clampdown = utils.remap(clampdown, 0,1, 100, 200)
        clampdown = utils.clamp(clampdown, 0, 255)
        return [clampdown, clampdown, clampdown];
    }

    var r = g = b = this.lightning_brightness;
    var rgb = utils.hsv(this.hue, 1, 1);

    for(var i in this.drops)
    {
        var drop = this.drops[i].point;

        var dx = (coords.point[0] - drop[0]) || 0;
        var dy = (coords.point[1] - drop[1]) || 0;
        var dz = (coords.point[2] - drop[2]) || 0;
        var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        var intensity = Math.cos(3 * Math.min(dist, 1));
        
        if(intensity > 0) 
        {
            r += (rgb[0] * intensity);
            g += (rgb[1] * intensity);
            b += (rgb[2] * intensity);
        }
    }

    return [r, g, b];
}

module.exports = Rain; 
