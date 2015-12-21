define([
	'backbone',
	'models/control',
	'views/controls/slider',
], function(Backbone, Control, SliderView){
	return Control.extend({
		slider_defaults: {
			min: 1,
			max: 100,
			step: 1
		},

		template: SliderView,

		initialize: function(){
			Control.prototype.initialize.apply(this);

			var settings = this.get('settings');
			this.set({
				min: settings.min || this.slider_defaults.min,
				max: settings.max || this.slider_defaults.max,
				step: settings.step || this.slider_defaults.step,
			});
		},

	});
});

