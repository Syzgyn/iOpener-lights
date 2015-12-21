#Lantern Patterns
Contains modules for each of the available patterns

* `index.js`: Called by other modules, add reference to new patterns here.
* `pattern.js`: The base class.  Handles most of the boring stuff, all other patterns extend this.

##Pattern Breakdown
Each pattern must inherit `pattern.js`, via Node's `util.inherits` method.  The pattern should then extend the following functions and attributes.

###Functions
`Pattern.prototype.update()` 
* called every certain number of ticks, as calculated by `1000 / Pattern.FPS`.
* It should contain whatever logic updates the patterns display.  Moving it one frame or step forward.

`Pattern.prototype.shader(coordinates, led_number)` 
* called for each pixel in the lantern, every tick of the event loop.
* `coordinates` is an array of `[x, y, z]` coordinates that denote the physical position of the LED in space.
* `led_number` is an integer denoting the number of the LED in the lantern's layout file, as it's being called for the current frame.
  * `Pattern.ledToXY(led_number)` can be used to get it's X,Y coordinates, based on the physical wiring of the lantern.
  * The X,Y coordinates can be converted back to the led_number with `Pattern.XYToLed(x, y)`


###Attributes
Some of the attributes that can be overwritten:
* `this.FPS`: The frames per second of the pattern, used to calculate when to call `update()`.
* `this.use_gradient`: Whether or not the pattern should have color changes fade between old and new values.  Only noticeable in slower moving patterns
* `this.web_settings`: The parameters that are passed to the web front-end for this pattern.  It has the following required attributes:
  * `name`: The forward facing name of the pattern.
  * `controls`: An array of Zero or more objects, each of which syncs to an attribute in the pattern.

Each Control must have the following attributes:
* `type`: The type of control to display.  Valid values are `slider` and `dropdown`.
* `property`: The name of the attribute this control is tied to.
* `value`: The starting value, usually the current value of the pattern attribute upon creation.
* `label`: The label to be displayed next to the control.
* `settings`: Any further settings unique to the specified `type`.  More info in the next section.

###Controls
Each control has the following unique properties that should be defined in `settings`.

*slider* - An `<input type="range">` control.
* `min`: The minimum value available.
* `max`: The maximum value available.
* `step`: The amount between each step on the slider.

*dropdown* - A `<select>` dropdown menu.
* `options`: An array of options for the dropdown menu.  The value is used as the display name and value
