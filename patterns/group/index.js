var patterns = [];
var names = [];

//Add all patterns here
patterns.push(require('./hueStripe'));
patterns.push(require('./wholeRainbow'));
patterns.push(require('./sine'));
patterns.push(require('./draw'));
patterns.push(require('./ripple'));
patterns.push(require('./waves'));
patterns.push(require('./rings'));
patterns.push(require('./bounce'));
patterns.push(require('./singlePatterns'));
patterns.push(require('./ripple2'));
patterns.push(require('./tunnel')); //10
patterns.push(require('./ring_tunnel'));
patterns.push(require('./zigzagTunnel'));
patterns.push(require('./blinky'));
patterns.push(require('./columnSine'));
patterns.push(require('./rowWave'));
patterns.push(require('./whiteTunnel'));

//Generate the pattern names
for(var i in patterns)
{
	var p = new patterns[i]();
	var data = p.getWebSettings();

	names[i] = data.name;
}

module.exports.patterns = patterns;
module.exports.names = names;
