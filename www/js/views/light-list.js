define([
	'jquery',
	'underscore',
	'backbone',
	'collections/lights',
	'views/light',
], function($, _, Backbone, LightsCollection, LightView){
	return Backbone.View.extend({
		tagName: 'div',
		className: 'lights',

		initialize: function(){
			this.collection = new LightsCollection();
			this.listenTo(this.collection, 'add', this.renderLight);

			_.bindAll(this, 'onSocketWebData', 'onSocketPatternNames', 'onSocketPropertyChange');

			window.socket.on('updateWeb', this.onSocketWebData);
			window.socket.on('patternNames', this.onSocketPatternNames);
			//window.socket.on('propertyChange', this.onSocketPropertyChange);

		},

		render: function(){
			this.$el.empty();
			this.collection.each(function(light){
				this.renderLight(light);
			}, this);
			return this;
		},
		
		renderLight: function(light){
			var view = new LightView({model: light});
			this.$el.append(view.render().el);
		},

		onSocketWebData: function(data){
			console.log('onSocketWebData', data);
			console.log(this);
			var light = this.collection.get(data.channel);
			light.updateControls(data);
		},

		onSocketPatternNames: function(data){
			console.log('onSocketPatternNames');
			this.collection.each(function(light){
				light.updateNames(data);
			});
		},

		onSocketPropertyChange: function(data){
			var light = this.collection.get(data.channel);
			light.updateControlProperty(data);
		},
	});
});

