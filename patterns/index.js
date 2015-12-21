var patterns = [];
var names = [];
patterns.push(require('./colorWipe.js'));
patterns.push(require('./snake.js'));
patterns.push(require('./rainbowSparkle.js'));
patterns.push(require('./wholeRainbow.js'));

for(var i in patterns)
{
	var p = new patterns[i]();
	var data = p.getWebSettings();

	names[i] = data.name;
}

module.exports.patterns = patterns;
module.exports.names = names;
