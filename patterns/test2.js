var util = require('util');
var Pattern = require('./pattern');

var Test2 = function(){
	Test2.super_.call(this);
};

util.inherits(Test2, Pattern);

Test2.prototype.shader = function(coords, led_num)
{
	return [255,0,0];
}

module.exports = Test2; 
