var colorUtils = require(appRoot + 'libs/color_utils');
var util = require('util');
var Pattern = require(patternRoot + 'pattern');
var pattern_lib = require(patternRoot);

var ColumnSine = function()
{
	ColumnSine.super_.call(this);

    this.bounds = this.appConfig.coordBounds[1];
    this.numColumns = 4;
    this.offset = 0;
    this.columns = [];
    this.hue = Math.random();

    this.speed = 0.01 + Math.randomRange(0, 0.01);

	this.web_settings = {
		name: "ColumnSine",
    }

    for(var i = 0; i < this.numColumns; i++)
    {
        this.columns[i] = {
            speed: (i+1) * this.speed,
            position: this.bounds.min,
            direction: 1,
        };
    }
}

util.inherits(ColumnSine, Pattern);

ColumnSine.prototype.getColumn = function(x)
{
    return (x + 4.5) / 3;
}

ColumnSine.prototype.update = function()
{
    for(var i = 0; i < this.numColumns; i++)
    {
        var col = this.columns[i];
        col.position += col.speed * col.direction;
        if(col.position > this.bounds.max)
        {
    //        col.direction *= -1;
            col.position = this.bounds.min;
        }
        else if(col.position < this.bounds.min)
        {
            col.direction *= -1;
            col.position = this.bounds.min;
        }

        this.columns[i] = col;
    }
}

ColumnSine.prototype.shader = function(coords, led_num, tent_coords, lantern_num)
{
	var y = coords.point[1] + tent_coords.point[1];

    var colNum = this.getColumn(tent_coords.point[0]);
    var colPos = this.columns[colNum].position;
    
    var closest = Math.min(
        Math.abs(y - colPos), 
        Math.abs(y - (colPos + this.bounds.max * 2)),
        Math.abs(y - (colPos - this.bounds.max * 2))
    );
    //var closest = Math.min(Math.abs(y - colPos), Math.abs(y - (colPos + this.bounds.max * 2)), Math.abs(y - (colPos - this.bounds.max * 2)));
    var dist = 2 - Math.sqrt(Math.abs(closest));

    dist = Math.max(Math.min(1, dist), 0);

    dist += 0.2;

    return colorUtils.hsv(this.hue, 1, dist);
}

module.exports = ColumnSine;
