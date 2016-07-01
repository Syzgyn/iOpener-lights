define([
	'backbone',
	'models/control',
	'views/controls/touchpad',
], function(Backbone, Control, TouchpadView){
	return Control.extend({
		touchpad_defaults: {
			x_min: 1,
			x_max: 100,
			y_min: 1,
            y_max: 100,
		},

		template: TouchpadView,

		initialize: function(){
			Control.prototype.initialize.apply(this);

			var settings = this.get('settings');
			this.set({
				x_min: settings.x_min || this.touchpad_defaults.x_min,
				x_max: settings.x_max || this.touchpad_defaults.x_max,
				y_min: settings.y_min || this.touchpad_defaults.y_min,
				y_max: settings.y_max || this.touchpad_defaults.y_max,
                points: {},
			});
		},

	});
});


