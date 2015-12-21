var config = {};

config.opc = {};
config.web = {};

config.num_lanterns = 12;

//Used with OpenPixelControl's gl_server, since it starts channels at 1 instead of 0
//https://github.com/zestyping/openpixelcontrol
config.debug = false;

//time in ms between each lantern update
config.lantern_loop_timer = 5;

//time in ms between each pattern controller update
config.controller_loop_timer = 1000;

config.opc.host = 'localhost';
config.opc.port = 7890;

config.web.enabled = true;
config.web.port = 3000;

module.exports = config;
