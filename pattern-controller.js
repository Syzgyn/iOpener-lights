var Controller = function(settings)
{
	var self = this;
	this.emitter = settings.emitter;
	this.lanterns = settings.lanterns;

	this.patterns = require('./patterns').patterns;
	this.pattern_names = require('./patterns').names;

	this.timers = [];

	for(var i in this.lanterns)
	{
		this.timers[this.lanterns[i].channel] = 0;
	}

	this.emitter.on('newConnection', function(){
		self.sendPatternNames();
	});

	this.emitter.on('controllerChangePattern', function(data){
		var duration = Math.randomInt(20, 40);
		self.setPattern(data.channel, self.patterns[data.pattern], duration);
	});
}

Controller.prototype.sendPatternNames = function(){
	var names = this.pattern_names;
	this.emitter.emit('patternNames', names);
}

Controller.prototype.tick = function()
{
	for(var i in this.timers)
	{
		this.timers[i]--;
		
		if(this.timers[i] <= 0)
		{
			var pattern_num = Math.randomInt(0, this.patterns.length - 1);
			var duration = Math.randomInt(20,40);
			this.setPattern(i, this.patterns[pattern_num], duration);
			console.log('change pattern: light %s to %s for duration %s', i, this.pattern_names[pattern_num], duration);
		}
	}
}

Controller.prototype.setPattern = function(light, pattern, duration)
{
	this.emitter.emit('lightChangePattern', light, pattern); 
	this.timers[light] = duration;
}

module.exports = Controller;
