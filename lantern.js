var util = require('util');
var EventEmitter = require('events');
var fs = require('fs');
var colorUtils = require('./libs/color_utils');
var Pattern = require('./patterns/pattern')

var Lantern = function(settings)
{
	//Optional arguments
	/*
	var args = [];
	for(var i = 0; i < arguments.length; ++i)
	{
		args[i] = arguments[i];
	}
	*/

	this.opc_client = settings.opc;
	this.channel = settings.channel;
	this.emitter = settings.emitter;
	this.patternEmitter = new EventEmitter();

	this.model = JSON.parse(fs.readFileSync('layouts/sphere.json'));
	this.currentPattern = null; 
	this.num_leds = 36;
	this.pixelBuffer = null;

	this.initBuffer();
	this.initEvents();

	//EventEmitter.call(this);
}

//util.inherits(Lantern, EventEmitter);

Lantern.prototype.initBuffer = function()
{
	this.pixelBuffer = new Buffer(4 + this.num_leds * 3);
    this.pixelBuffer.writeUInt8(this.channel, 0);   	    // Channel
    this.pixelBuffer.writeUInt8(0, 1);          	  		// Command
    this.pixelBuffer.writeUInt16BE(this.num_leds * 3, 2); 	// Length

	//Fill with Black
	for(var i = 4; i < this.pixelBuffer.length; i++)
	{
		this.pixelBuffer.writeUInt8(0, i);
	}

	this.writePixels();
}

Lantern.prototype.initEvents = function()
{
	var self = this;
	this.emitter.on('lightChangePattern', function(channel, pattern){
		if(channel == self.channel)
		{
			self.setPattern(pattern);
		}
	});

	this.emitter.on('propertyChange', function(data){
		if(self.currentPattern instanceof Pattern &&
			data.channel === self.channel)
		{
			self.currentPattern.emit('propertyChange', data);
		}
	});

	this.emitter.on('newConnection', function(){
		self.sendWebData();
	});
}

Lantern.prototype.tick = function()
{
	if(this.currentPattern instanceof Pattern)
	{
		this.currentPattern.tick();
	}
}

Lantern.prototype.sendWebData = function()
{
	if(!this.currentPattern instanceof Pattern)
	{
		return;
	}

	var web_settings = this.currentPattern.getWebSettings();
	web_settings.channel = this.channel;
	this.emitter.emit('updateWeb', web_settings);
}

Lantern.prototype.setPattern = function(pattern)
{
	var self = this;
	this.currentPattern = new pattern();
	this.currentPattern.on('render', this.mapPixels.bind(this));
	this.currentPattern.on('getColor', function(i){
		self.currentPattern.emit('pixelValue', self.getPixelValue(i));
	});

	this.sendWebData();
}

Lantern.prototype.writePixels = function()
{
	this.opc_client.writePixels(this.pixelBuffer);
}

Lantern.prototype.mapPixels = function()
{
	var shader = this.currentPattern.shader.bind(this.currentPattern);
    // Set all pixels, by mapping each element of "model" through "fn" and setting the
    // corresponding pixel value. The function returns a tuple of three 8-bit RGB values.
    // Implies 'writePixels' as well. Has no effect if the OPC client is disconnected.

    if (!this.opc_client.socket) {
        this.opc_client._reconnect();
    }
    if (!this.opc_client.connected) {
        return;
    }

    var offset = 4;
    var unused = [0, 0, 0];     // Color for unused channels (null model)

    for (var i = 0; i < this.model.length; i++) {
        var led = this.model[i];
        var rgb = led ? shader(led, i) : unused;

		//Give the option to pass false through the shader to not set a color for this pixel, keeping it the same as what it was previously 
		if(rgb !== false)
		{
			//Do pixel shading here if the pattern wants, rather than
			//implementing it in each pattern separately
			if(this.currentPattern.use_gradient === true)
			{
				var old_rgb = [
					this.pixelBuffer[offset],
					this.pixelBuffer[offset + 1],
					this.pixelBuffer[offset + 2]
				];

				rgb = colorUtils.gradient(old_rgb, rgb, parseFloat(this.currentPattern.FPS) / 170); 
			}

			this.pixelBuffer.writeUInt8(Math.max(0, Math.min(255, rgb[0] | 0)), offset);
			this.pixelBuffer.writeUInt8(Math.max(0, Math.min(255, rgb[1] | 0)), offset + 1);
			this.pixelBuffer.writeUInt8(Math.max(0, Math.min(255, rgb[2] | 0)), offset + 2);
		}
        offset += 3;
    }

    this.writePixels();
}

Lantern.prototype.getPixelValue = function(i)
{
	var offset = i * 3 + 4;
	return [this.pixelBuffer[offset], this.pixelBuffer[offset+1], this.pixelBuffer[offset+2]];
}

module.exports = Lantern;
