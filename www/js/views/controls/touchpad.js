define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/controls/touchpad.html',
    'jqueryeventmove'
], function($, _, Backbone, Template){
	return Backbone.View.extend({
		template: _.template(Template),

		events: {
            'mousedown div.touchpad': 'move',
            'touchstart div.touchpad': 'move',
			'movestart div.touchpad': 'move',
			'move div.touchpad': 'move',

            'moveend div.touchpad': 'moveend',
            'mouseup div.touchpad': 'moveend',
            'touchstop div.touchpad': 'moveend'
		},

		render: function(){
			this.$el.html(this.template(this.model.attributes));
			return this;
		},

		move: function(e){
            var target = $(e.target);
            var x_pos = e.pageX - target.offset().left;
            var y_pos = e.pageY - target.offset().top;

            var element_x_max = target.width();
            var element_y_max = target.height();

            var control_x_min = this.model.attributes.x_min;
            var control_x_max = this.model.attributes.x_max;

            var control_y_min = this.model.attributes.y_min;
            var control_y_max = this.model.attributes.y_max;

            //Scale the x,y from the element size to the control bounds
            var converted_x = ((x_pos * (control_x_max - control_x_min)) / element_x_max) + control_x_min;
            var converted_y = ((y_pos * (control_y_max - control_y_min)) / element_y_max) + control_y_min;

            //Keep within range of the control bounds
            converted_x = Math.min(Math.max(control_x_min, converted_x), control_x_max);
            converted_y = Math.min(Math.max(control_y_min, converted_y), control_y_max);

            if(isNaN(converted_x) || isNaN(converted_y))
            {
                return;
            }

            var identifier = e.identifier || 0;

            var points = this.model.get('points');

            var point =  { 
                x: converted_x,
                y: converted_y,
            };

            points['i' + identifier] = point;
			
            this.model.set('points', points);
            this.model.set('value', JSON.stringify(points));
		},

        moveend: function(e){
            var points = this.model.get('points');
            delete points['i' + (e.identifier || 0)];

            this.model.set('points', points);
            this.model.set('value', JSON.stringify(points));
        },
	});
});


