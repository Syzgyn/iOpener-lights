define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/light.html',
	'views/controls/dropdown',
], function($, _, Backbone, Template, DropdownView){
	return Backbone.View.extend({
		tagName: 'div',
		className: 'light-container',

		template: _.template(Template),

		events: {
			'click input.ping': 'pingClick',
		},

		initialize: function()
		{
			this.listenTo(this.model, 'controlsUpdated', this.render);
			this.listenTo(this.model, 'namesUpdated', this.render);
		},

		render: function(){
			if(this.model.get('current_pattern') === 'Unknown Pattern')
			{
				this.$el.addClass('hide');
			}
			else
			{
				this.$el.removeClass('hide');
			}

			this.el.id = 'light-' + this.model.id;
			var dropdown = new DropdownView({model: this.model.pattern_select});
			this.$el.html(this.template(this.model.attributes));
			dropdown.setElement('#light-' + this.model.id + ' .pattern_select').render();
			
			this.model.controls.each(function(control){
				var view = new control.template({model: control});
				this.$el.append(view.render().el);
			}, this);

			return this;
		},

		pingClick: function(e){
			this.model.ping();
		},
	});
});
