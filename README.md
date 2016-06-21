# iOpener Lights
Uses Node.js and [Fadecandy](https://github.com/scanlime/fadecandy) boards to control RGB LEDs through multiple patterns.  
Also provides a web interface using Backbone.js and Socket.io to control the lights remotely.

##Contents
* `app.js`: Creates the lanterns, pattern controller, and event loops
* `default.config.js`: common configuration options.  copy to `config.js` before running
* `lantern.js`: Defines one lantern 
* `pattern-controller.js`: Manages the patterns each lantern displays
* `web.js`: The front-end web interface, uses socket.io to stay in sync
* `/extras`: Miscellaneous files and scripts not needed to run the node.js app
* `/layouts`: .json files mapping the physical locations of each LED in a lantern
* `/libs`: Helper libraries
* `/patterns`: The LED patterns that get displayed on each lantern
* `/www`: Static files for the web front-end

##Expected Hardware
This was designed to run on a Raspberry Pi, along with two Fadecandy boards and a USB Wifi Adapter.  The Wifi Adapter is used as an access point, so clients can connect to the network and use the web server to interact with each light. 

Each lantern is designed with 64 LED's in a roughly spherical shape in mind.  Using a different shape or number of LEDs is absolutely possible, but would probably require modification to some or all of the patterns.  
