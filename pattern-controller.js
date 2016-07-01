var config = require('./config');
var pattern_lib = require('./patterns');
var clone = require('clone');

var Controller = function(settings)
{
	var self = this;
	this.emitter = settings.emitter;
	this.lanterns = settings.lanterns;

	this.group_timer = config.patterns.group.start_time;
    this.active_group_pattern = false;

	this.timers = [];

	for(var i in this.lanterns)
	{
		this.timers[this.lanterns[i].channel] = 0;
	}

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
	var names = pattern_lib.names;
	this.emitter.emit('patternNames', names);
}

Controller.prototype.tick = function()
{
	this.group_timer--;

	if(this.group_timer <= 0)
	{
		this.setGroupPattern();
		return;
	}

	for(var i in this.timers)
	{
		this.timers[i]--;
		
		if(this.timers[i] <= 0)
		{
            if(this.active_group_pattern == true)
            {
                this.active_group_pattern = false;
	            this.emitter.emit('updateGroupPattern', false);
            }

			var pattern_num = Math.randomInt(0, pattern_lib.patterns.length - 1);
			var duration = Math.randomInt(config.patterns.min, config.patterns.max);

			if(config.debug.enabled && !isNaN(parseInt(config.debug.restrict_pattern)))
			{
				pattern_num = config.debug.restrict_pattern;
			}

			var pattern = new pattern_lib.patterns[pattern_num]();

			this.setPattern(i, pattern, duration);
			console.debug('change pattern: light %s to %s for duration %s', i, pattern_lib.names[pattern_num], duration);
		}
	}
}

Controller.prototype.setPattern = function(light, pattern, duration)
{
	this.emitter.emit('lightChangePattern', light, pattern); 
	this.timers[light] = duration;
}

Controller.prototype.setGroupPattern = function()
{
	var duration = Math.randomInt(20,40);
	var pattern_num  = Math.randomInt(0, pattern_lib.group.patterns.length - 1);

    if(config.debug.enabled && !isNaN(parseInt(config.debug.restrict_group_pattern)))
    {
        pattern_num = config.debug.restrict_group_pattern;
    }

	var pattern = new pattern_lib.group.patterns[pattern_num]();

	for(var i in this.timers)
	{
		var p = clone(pattern);
		this.setPattern(i, p, duration);
	}

	this.group_timer = Math.randomInt(config.patterns.group.min, config.patterns.group.max);

    if(config.debug.enabled && !isNaN(parseInt(config.debug.restrict_group_pattern)))
    {
        this.group_timer = duration;
    }
    
    this.active_group_pattern = true;    
	this.emitter.emit('updateGroupPattern', true);
}

module.exports = Controller;
