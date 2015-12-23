define([
	'jquery',
	'underscore', 
	'backbone',
	'models/light',
	'text!config.json',
], function($, _, Backbone, LightModel, configJson){
	var lights = Backbone.Collection.extend({
		model: LightModel,

		initialize: function(){
			var config = JSON.parse(configJson)
			var offset = config.debug.enabled == true ? config.debug.channel_offset : 0;
			var num_lanterns = config.num_lanterns;

			for(var i = 0; i < num_lanterns; i++)
			{
				this.add({id: i + offset});
			}
		},
	});

	return lights;
});
