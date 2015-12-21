define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/controls/slider.html'
], function($, _, Backbone, Template){
	return Backbone.View.extend({
		template: _.template(Template),

		events: {
			'change': 'change',
			'input input': 'change',
		},

		render: function(){
			this.$el.html(this.template(this.model.attributes));
			return this;
		},

		change: function(e){
			var val = e.originalEvent.target.value;
			this.model.set('value', val);
		},
	});
});

