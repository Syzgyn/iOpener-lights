var fs = require('fs');
var pathLib = require("path");
var patterns = [];
var names = [];
var singlePatterns = [];
var singleNames = [];

var getFiles = function(path, pArr, nArr, recursive){
    if(!recursive)
    {
        path = pathLib.join(__dirname, path);
    }
    fs.readdirSync(path).forEach(function(file)
    {
        var subpath = pathLib.join(path, file);
        if(fs.lstatSync(subpath).isDirectory())
        {
            getFiles(subpath, pArr, nArr, true);
        } else if(pathLib.extname(file) == ".js") {
            var p = require(subpath);
            var instance = new p();
            var data = instance.getWebSettings();
            pArr.push(p);
            nArr.push(data.name);
        }
    });     
}

//Get all single patterns
getFiles('./single', singlePatterns, singleNames);

module.exports.single = {
    patterns: singlePatterns,
    names: singleNames,
}

//Get all group patterns
getFiles('./group', patterns, names);

module.exports.group = {
    patterns: patterns,
    names: names,
}

for(var i in names)
{
    console.log(i, names[i]);
}
