require.config({
    shim: {
        bootstrap: {
            deps: ['jquery'],
        },
    },
	paths: {
		backbone: 'libs/backbone/backbone',
		jquery: 'libs/jquery/jquery-1.11.3',
		underscore: 'libs/underscore/underscore',
		socket: '../socket.io/socket.io',
		text: 'libs/require/text',
		config: 'libs/config',
        bootstrap: 'libs/bootstrap/bootstrap',
        jqueryeventmove: 'libs/jquery/jquery.event.move',
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
