define([
	'backbone',
	'models/control',
	'views/controls/dropdown',
], function(Backbone, Control, DropdownView){
	return Control.extend({
		dropdown_defaults: {
			options: [],
		},

		template: DropdownView,

		initialize: function(){
			Control.prototype.initialize.apply(this);

			var settings = this.get('settings');
			this.set({
				options: settings.options || this.dropdown_defaults.options,
			});
		},
	});
});


