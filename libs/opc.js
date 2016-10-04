/*
 * Simple Open Pixel Control client for Node.js
 *
 * 2013-2014 Micah Elizabeth Scott
 * This file is released into the public domain.
 */

var net = require('net');
var fs = require('fs');


/********************************************************************************
 * Core OPC Client
 */

var OPC = function(host, port)
{
    this.host = host;
    this.port = port;
    this.pixelBuffer = null;
};

OPC.prototype._reconnect = function()
{
    var _this = this;

    this.socket = new net.Socket()
    this.connected = false;

    this.socket.onclose = function() {
        console.debug("Connection closed");
        _this.socket = null;
        _this.connected = false;
    }

    this.socket.on('error', function(e){
        if(e.code == 'ECONNREFUSED' || e.code == 'ECONNRESET') {
            _this.socket = null;
            _this.connected = false;
        }
    });

	this.socket.on('close', function(){
		_this.socket = null;
		_this.connected = false;
	});

    this.socket.connect(this.port, this.host, function() {
        console.debug("Connected to " + _this.socket.remoteAddress + ":" + _this.socket.remotePort);
        _this.connected = true;
        _this.socket.setNoDelay();
    });
}

OPC.prototype.writePixels = function(buffer)
{
    if (!this.socket) {
        this._reconnect();
    }
    if (!this.connected) {
        return;
    }

	this.socket.write(buffer);
}
    

module.exports = OPC;
