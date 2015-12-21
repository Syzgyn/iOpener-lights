define([
	'backbone',
	'underscore',
], function(Backbone, _){
	return Backbone.Model.extend({
		defaults: {
			property: '',
			value: 0,
			label: 'Label',
			settings: {},
		},

		tagName: 'li',

		initialize: function(){
		},
	});
});

