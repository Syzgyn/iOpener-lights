var utils = require(appRoot + 'libs/color_utils');
var util = require('util');
var Pattern = require(patternRoot + 'pattern');

var Snake = function(options)
{
	Snake.super_.call(this, options);
	this.name = "Snake";
	this.use_gradient = true;

	this.current_led = -1;
	this.hue = Math.random();
	this.brightness = 0.0;
	this.base_hue = Math.random();

	this.speed = Math.randomInt(5, 10);
	this.last_update = 100;

	this.color_speed = Math.randomInt(2,3);
	
	this.snakes = [];
	this.num_snakes = 5;

	this.displayed_snakes = 3;

	this.web_settings = {
		name: "Snake",
		controls: [
			{
				type: 'slider',
				property: 'speed',
				value: this.speed,
				label: 'Snake Speed',
				settings: {
					min: 5,
					max: 15,
				},
			},
			{
				type: 'slider',
				property: 'color_speed',
				value: this.color_speed,
				label: 'Color Speed',
				settings: {
					min: 1,
					max: 5,
					step: 0.1,
				},
			},
			{
				type: 'slider',
				property: 'displayed_snakes',
				value: this.displayed_snakes,
				label: 'Number of Snakes',
				settings: {
					min: 1,
					max: 5,
				},
			},
		],
	};
	
	this.initSnakes();
}

util.inherits(Snake, Pattern);

Snake.prototype.initSnakes = function()
{
	var pattern_this = this;

	var snake = function(hue){
		var self = this;
		this.x = Math.randomInt(0,5);
		this.y = Math.randomInt(0,5);
		this.hue = hue;
		this.body = [0,0,0,0,0,0];  //Keep body as a list of LED numbers, rather than X,Y coords
									//To make it easier to check what should be illumnated

		this.move = function()
		{
			var direction = Math.randomInt(0,4);
			switch(direction)
			{
				//instead of using a bunch of if statements, just add 6 and then +/- 1 to the right coord, then modulus
				case 0: //up
					self.y = (self.y + 5) % 6;
					break;
				case 1: //right
					self.x = (self.x + 1) % 6;
					break;
				case 2: //down
					self.y = (self.y + 1) % 6;
					break;
				case 3: //left
					self.x = (self.x + 5) % 6;
					break;
			}

			self.body.unshift(Pattern.XYToLed(self.x, self.y)); // Add new coords to the front of the array
			self.body.pop(); //remove old coords from the end
			this.updateHue();
		}

		this.updateHue = function()
		{
			this.hue = (this.hue + (1.0 / 255 * pattern_this.color_speed)) % 1;
		}
	};

	for(var i = 0; i < this.num_snakes; i++)
	{
		var hue = (this.hue + ((0.4 / this.num_snakes) * (i + 1))) % 1;
		this.snakes.push(new snake(hue));
	}
}

Snake.prototype.update = function()
{

	this.last_update++;
	
	if(this.last_update >=  20 - this.speed)
	{
		this.last_update = 0;

		for(var i in this.snakes)
		{
			this.snakes[i].move();
		}
		//this.base_hue = (1 + this.base_hue - (1.0 / 255)) % 1;
	}
}

Snake.prototype.shader = function(coords, led_num)
{
	for(var i = 0; i < this.displayed_snakes; i++) 
	{
		if(this.snakes[i].body.indexOf(led_num) > -1)
		{
			return utils.hsv(this.snakes[i].hue, 1, 1);
		}
	}

	//return [0,0,0];
	return utils.hsv(this.base_hue, 1, 1);
}

module.exports = Snake;
