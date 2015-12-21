define([
	'backbone',
	'collections/controls',
	'models/controls/dropdown',
], function(Backbone, Controls, DropdownControl){
	return Backbone.Model.extend({
		defaults: {
			current_pattern: 'Unknown Pattern',
			available_patterns: [],
		},

		initialize: function(){
			this.controls = new Controls();
			this.pattern_select = new DropdownControl({
				value: this.get('current_pattern'),
				settings: {options: this.get('available_patterns')},
			});

			this.controls.bind('change', this.onControlChange, this);
			this.controls.bind('reset', this.onControlReset, this);

			this.pattern_select.bind('change:value', this.onPatternSelectChange, this);
			this.pattern_select.bind('change:options', this.onPatternSelectListUpdate, this);
		},

		updateControls: function(data){
			this.set('current_pattern', data.name);
			this.pattern_select.set('value', data.name);
			console.log('light %s update', this.id, this.get('current_pattern'));
			this.controls.setControls(data.controls);
		},

		updateNames: function(data){
			this.set('available_patterns', data);
			this.pattern_select.set('options', data);
		},

		onControlChange: function(control)
		{
			var data = {
				channel: this.get('id'), 
				property: control.get('property'),
				value: control.get('value')
			}
			window.socket.emit('propertyChange', data);
		},

		onControlReset: function(controls){
			this.trigger('controlsUpdated');
		},

		onPatternSelectChange: function(control){
			this.trigger('namesUpdated');
			var patterns = control.get('options');
			var index = patterns.indexOf(control.get('value'));

			if(index > -1)
			{
				var data = {
					channel: this.get('id'), 
					pattern: index,
				}
				window.socket.emit('controllerChangePattern', data);
			}
		},

		onPatternSelectListUpdate: function(){
			this.trigger('namesUpdated');
		},
	});
});
