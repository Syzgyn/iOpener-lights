const args = process.argv;
var fs = require('fs');

//Load config file
try {
	var config = require('./config');
} catch (ex) {
	if(ex.code == 'MODULE_NOT_FOUND')
	{
		console.log("Config file not found.  Please copy default.config.js to config.js and make any changes");
		process.exit();
	}
	else
	{
		throw ex;
	}
};

//Don't edit below this line without knowing what you're doing!
//-------------------------------------------------------------
//Calculating min and max coordinate range for each pixel dimension
var models = [
    JSON.parse(fs.readFileSync(config.lantern_layout_file)),
    JSON.parse(fs.readFileSync(config.tent_layout_file))
];

var bounds = [];

for(var i in models)
{
    var model = models[i];
    bounds[i] = [];
    for(var b = 0; b < 3; b++)
    {
        bounds[i][b] = {min:100000, max:0};
    }

    for(var j in model)
    {
        var coord = model[j].point; 
        for(var c in coord)
        {
            bounds[i][c].min = Math.min(bounds[i][c].min, coord[c]);
            bounds[i][c].max = Math.max(bounds[i][c].max, coord[c]);
        }
    }
}

config.coordBounds = [
];

for(var i = 0; i < 3; i++)
{
    config.coordBounds[i] = {
        min: bounds[0][i].min + bounds[1][i].min,
        max: bounds[0][i].max + bounds[1][i].max,
    };
}

//Set pattern based on command line arguments, if any
if(args[2] && !isNaN(args[2]))
{
    config.debug.restrict_group_pattern = args[2];
}
module.exports = config;

