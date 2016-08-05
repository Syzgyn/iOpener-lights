var colorUtils = require(appRoot + 'libs/color_utils');
var util = require('util');
var Pattern = require(patternRoot + 'pattern');

var Bounce = function()
{
	Bounce.super_.call(this);

    this.numBalls = 10;

    this.x_range = this.appConfig.coordBounds[0].max;
    this.y_range = this.appConfig.coordBounds[1].max;

    this.balls = [];

    this.hue = Math.random();
    this.speed = 1;
    this.decay = 1;

	this.web_settings = {
		name: "Bounce",
    }

    this.initBalls();
}

util.inherits(Bounce, Pattern);

Bounce.prototype.initBalls = function()
{
    var pattern_this = this;

    var ball = function(hue)
    {
        var self = this;
        this.x = Math.randomInt(-4, 4);
        this.y = Math.randomInt(-10, 10);
        this.hue = hue; 

        this.dx = Math.randomRange(-1, 1);
        this.dy = Math.randomRange(-1, 1);

        this.directionTimer = 0; 

        this.move = function()
        {
            var speed = pattern_this.speed / 20;
            self.x += self.dx * speed;
            self.y += self.dy * speed;

            if(self.x > pattern_this.x_range)
            {
                self.x = pattern_this.x_range;
                self.dx = self.dx * -1;
            }
            else if(self.x < pattern_this.x_range * -1)
            {
                self.x = pattern_this.x_range * -1;
                self.dx = self.dx * -1;
            }

            if(self.y > pattern_this.y_range)
            {
                self.y = pattern_this.y_range;
                self.dy = self.dy * -1;
            }
            else if(self.y < pattern_this.y_range * -1)
            {
                self.y = pattern_this.y_range * -1;
                self.dy = self.dy * -1;
            }

            self.directionTimer--;

            if(self.directionTimer < 0)
            {
                self.changeDirection();
            }

        }

        this.changeDirection = function()
        {
            self.dx = Math.randomRange(-1, 1);
            self.dy = Math.randomRange(-1, 1);
            self.directionTimer = Math.randomInt(2000, 4000);
        }
        
    }

    for(var i = 0; i < this.numBalls; i++)
    {
		var hue = (this.hue + ((1.0 / this.numBalls) * (i + 1))) % 1;
        this.balls.push(new ball(hue));
    }
}

Bounce.prototype.update = function()
{
    for(var i in this.balls)
    {
        this.balls[i].move();
    }

    this.hue += 0.0001;
}

Bounce.prototype.shader = function(coords, led_num, tent_coords)
{
	var x = coords.point[0] + tent_coords.point[0];
	var y = coords.point[1] + tent_coords.point[1];
	var z = coords.point[2] + tent_coords.point[2];

    var min_dist = 1000;
    var closest_hue = null;

    for(var i in this.balls)
    {
        var ball = this.balls[i];
        var x_dist = x - ball.x 
        var y_dist = y - ball.y;

        var dist = Math.sqrt(x_dist * x_dist + y_dist * y_dist);

        if(!dist || dist < min_dist)
        {
            min_dist = dist;
            closest_hue = ball.hue;
        }
    }

    if(min_dist < 1)
    {
        return colorUtils.hsv(closest_hue + this.hue, 1, 1);
    }

    return this.decay * -1.0;
}

module.exports = Bounce;
