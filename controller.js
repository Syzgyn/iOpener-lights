var config = require('./config');
var pattern_lib = require('./patterns');
var clone = require('clone');
var Pattern = require('./patterns/pattern');

var Controller = function(settings)
{
	var self = this;
	this.emitter = settings.emitter;
	this.lanterns = settings.lanterns;

	this.timer = 0;
    this.last_run = 0;
    this.current_pattern = null;

	this.emitter.on('newConnection', function(){
		self.sendPatternNames();
	});

	this.emitter.on('controllerChangePattern', function(data){
		var duration = Math.randomInt(config.patterns.min, config.patterns.max);
		var pattern = new pattern_lib.patterns[data.pattern]();
		self.setPattern(data.channel, pattern, duration);
	});
}

Controller.prototype.sendPatternNames = function(){
	var names = pattern_lib.group.names;
	this.emitter.emit('patternNames', names);
}

Controller.prototype.tick = function()
{
	if(this.current_pattern instanceof Pattern)
	{
		this.current_pattern.tick();
	}

	var elapsed_time = Date.now() - this.last_run;
	if(elapsed_time > 1000)
	{
		this.timer--;
		this.last_run = Date.now();
	}

	if(this.timer <= 0)
	{
		this.setGroupPattern();
	}
}

Controller.prototype.setGroupPattern = function()
{
    var self = this;
	var duration = Math.randomInt(config.patterns.min, config.patterns.max);
	var pattern_num  = Math.randomInt(0, pattern_lib.group.patterns.length - 1);

    if(config.debug.enabled && !isNaN(parseInt(config.debug.restrict_group_pattern)))
    {
        pattern_num = config.debug.restrict_group_pattern;
    }
	
	if(this.current_pattern)
	{
		this.current_pattern.removeAllListeners('render').removeAllListeners('getColor');
	}

	this.current_pattern = new pattern_lib.group.patterns[pattern_num]();
	
    this.current_pattern.init();

	this.current_pattern.on('render', this.render.bind(this));
	this.current_pattern.on('getColor', function(i){
		self.current_pattern.emit('pixelValue', self.getPixelValue(i));
	});

    this.timer = duration;

	this.emitter.emit('updateGroupPattern', true);
	console.debug('change pattern to %s for duration %s', pattern_lib.group.names[pattern_num], duration);
}

Controller.prototype.render = function()
{
    for(lantern in this.lanterns)
    {
        this.lanterns[lantern].mapPixels(this.current_pattern.shader.bind(this.current_pattern));
    }
}

module.exports = Controller;
