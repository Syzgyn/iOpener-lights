var express = require('express');

var www = function(settings)
{
	var port = settings.port || 3000;
	this.emitter = settings.emitter;
	this.patterns = require('./patterns').names;

	this.app = express();
	this.server = require('http').createServer(this.app);
	this.io = require('socket.io').listen(this.server);

	this.server.listen(port);
	this.app.use(express.static('www')); 

	//Events that pass from event emitter to socket
	this.emitter_events = [
		'updateWeb',
		'patternNames',
	];

	//Events that pass from socket to event emitter
	//value is whether or not it should be re-emitted by the socket to other connections
	this.socket_events = {
		'controllerChangePattern': true,
		'propertyChange': true,
		'newConnection': false,
	};

	var self = this;

	this.io.on('connection', function(socket){
		var keys = Object.keys(self.socket_events);
		for(var k in keys)
		{
			var key = keys[k];

			(function(key){
				socket.on(key, function(data){
					if(self.socket_events[key])
					{
						self.io.sockets.emit(key, data);
					}

					console.debug(key, data);

					self.emitter.emit(key, data);
				});
			})(key);
		}
	});

	for(var i in this.emitter_events)
	{
		var evt = this.emitter_events[i];
		
		(function(ref, evt){
			self.emitter.on(evt, function(data){
				console.debug(evt, data);
				self.io.sockets.emit(evt, data);
			});
		})(this, evt);
	}
}

module.exports = www;
