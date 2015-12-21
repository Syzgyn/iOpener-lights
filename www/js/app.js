define([
	'jquery',
	'underscore',
	'backbone',
	'socket',
	'collections/lights',
	'views/light',
	'views/light-list',
], function($, _, Backbone, Socket, Lights, LightView, LightList){
	return Backbone.View.extend({
		el: $('body'),

		initialize: function(){
			window.socket = Socket.connect();

			this.lights = new LightList();

			window.socket.emit('newConnection');
		},
		
		render: function(){
			this.$el.html(this.lights.render().el);

			return this;
		},
		
	});
});
