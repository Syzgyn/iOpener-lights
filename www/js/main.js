require.config({
	paths: {
		backbone: 'libs/backbone/backbone',
		jquery: 'libs/jquery/jquery-1.11.3',
		underscore: 'libs/underscore/underscore',
		socket: '../socket.io/socket.io',
		text: 'libs/require/text',
	},
});

require([
	'app',
	'backbone',
], function(App){
	window.app = new App();
	Backbone.trigger('app:initialized');
	window.app.render();
});
