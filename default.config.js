var config = {};

config.opc = {};
config.web = {};
config.debug = {};
config.patterns = {};
config.patterns.group = {};

config.num_lanterns = 1;
config.tent_layout_file = 'layouts/tent32_small.json';
config.lantern_layout_file = 'layouts/64_sphere.json';

//Display debug messages, and use other debug settings
config.debug.enabled = false;

//Used when testing with OpenPixelControl's gl_server, since it starts channels at 1 instead of 0
//https://github.com/zestyping/openpixelcontrol
config.debug.channel_offset = 1;

//For testing a pattern, forces the pattern controller to only use this index
config.debug.restrict_group_pattern = false;

//time in ms between each lantern update
config.lantern_loop_timer = 5;

//time in ms between each pattern controller update
config.controller_loop_timer = 1000;

/**
* Pattern variables
* All times are in number of controller_loop_timer ticks
*/
//min and max duration for patterns 
config.patterns.min = 100;
config.patterns.max = 200;

//time till first group pattern
config.patterns.group.start_time = 100;

//min and max time between group patterns
config.patterns.group.min = 100;
config.patterns.group.max = 200;

config.opc.host = 'localhost';
config.opc.port = 7890;

config.web.enabled = true;
config.web.port = 3000;

module.exports = config;

