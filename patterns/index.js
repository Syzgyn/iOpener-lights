var patterns = [];
var names = [];

//Add all patterns here
patterns.push(require('./colorWipe'));
patterns.push(require('./snake'));
patterns.push(require('./rainbowSparkle'));
patterns.push(require('./wholeRainbow'));
patterns.push(require('./hueStripe'));


//Generate the pattern names
for(var i in patterns)
{
	var p = new patterns[i]();
	var data = p.getWebSettings();

	names[i] = data.name;
}

module.exports.patterns = patterns;
module.exports.names = names;
