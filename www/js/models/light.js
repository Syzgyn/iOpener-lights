define([
	'backbone',
	'collections/controls',
	'models/controls/dropdown',
], function(Backbone, Controls, DropdownControl){
	return Backbone.Model.extend({
		defaults: {
			current_pattern: 'Unknown Pattern',
		},

		initialize: function(){
			this.controls = new Controls();
			this.pattern_select = new DropdownControl({
				value: -1, 
				label: false,
			});

			this.controls.bind('change', this.onControlChange, this);
			this.controls.bind('reset', this.onControlReset, this);

			this.pattern_select.bind('change:value', this.onPatternSelectChange, this);
			this.pattern_select.bind('change:options', this.onPatternSelectListUpdate, this);
		},

		updateControls: function(data){
			var index = this.pattern_select.get('options').indexOf(data.name);

			this.set('current_pattern', data.name);
			this.pattern_select.set('value', index);

			console.log('Set Light %s to Pattern %s', this.id, data.name);

			this.controls.setControls(data.controls);
		},

		updateNames: function(data){
			var index = data.indexOf(this.get('current_pattern'));
			this.pattern_select.set('options', data);
			this.pattern_select.set('value', index, {silent: true});
			this.trigger('namesUpdated');
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
			var index = control.get('value');

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

		hasContent: function(){
			return this.get('current_pattern') !== 'Unknown Pattern';
		},
	});
});
