var patterns = [];
var names = [];

//Add all patterns here
patterns.push(require('./hueStripe'));
patterns.push(require('./wholeRainbow'));
patterns.push(require('./sine'));
patterns.push(require('./draw'));

//Generate the pattern names
for(var i in patterns)
{
	var p = new patterns[i]();
	var data = p.getWebSettings();

	names[i] = data.name;
}

module.exports.patterns = patterns;
module.exports.names = names;
