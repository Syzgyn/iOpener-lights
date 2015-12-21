module.exports = {
	/** Remap the float val from the range oldmin - oldmax to the range newmin - newmax. */
	remap: function(val, oldmin, oldmax, newmin, newmax)
	{
		val = val * 1.0;
		var zero_to_one = (val - oldmin) / (oldmax - oldmin);
		return zero_to_one * (newmax - newmin) + newmin;
	},

	/** Clamp the value to be within min and max. */
	clamp: function(val, min, max)
	{
		return Math.max(min, Math.min(max, val));
	},

	/** A cosine curve scaled to fit in a 0-1 range and 0-1 domain by default.

		offset: how much to slide the curve across the domain (should be 0-1)
		period: the length of one wave
		minn, maxx: the output range
	*/
	cos: function(val, offset, period, min, max)
	{
		val = val * 1.0;
		offset = offset || 0.0;
		period = period || 1.0;
		min = min || 0.0;
		max = max || 1.0;

		var value = Math.cos((val / period - offset) * Math.PI * 2) / 2 + 0.5;
		return value * (max - min) + min;
	},

	/** Expand the color values by a factor of mult around the pivot value of center.

		color: an (r, g, b) array
		center: a float -- the fixed point
		mult: a float -- expand or contract the values around the center point

	*/
	contrast: function(color, center, mult)
	{
		var output = [];
		for(val in color)
		{
			output.push((color[val] - center) * mult + center);
		}

		return output;
	},

	/** If the color's luminance is less than threshold, replace it with black. */
	clip_black_by_luminance: function(color, threshold)
	{
		if(color[0] + color[1] + color[2] < threshold * 3)
		{
			return [0,0,0];
		}

		return color;
	},

	/** Replace any individual r, g, or b value less than threshold with 0. */
	clip_black_by_channels: function(color, threshold)
	{
		var output = [];
		for(val in color)
		{
			if(color[val] < threshold)
			{
				output.push(0);
				continue;
			}

			output.push(val);
		}
		
		return output;
	},


	/** Return the distance between floats a and b, modulo n. */
	mod_dist: function(a, b, n)
	{
		return Math.min((a - b) % n, (b - a) % n);
	},


	/** Apply a gamma curve to the color.  The color values should be in the range 0-1. */
	gamma: function(color, gamma)
	{
		var output = [];
		for(val in color)
		{
			output.push(Math.pow(Math.max(color[val], 0), gamma));
		}

		return output;
	},

	hsv: function(h, s, v)
	{
		/*
		 * Converts an HSV color value to RGB.
		 *
		 * Normal hsv range is in [0, 1], RGB range is [0, 255].
		 * Colors may extend outside these bounds. Hue values will wrap.
		 *
		 * Based on tinycolor:
		 * https://github.com/bgrins/TinyColor/blob/master/tinycolor.js
		 * 2013-08-10, Brian Grinstead, MIT License
		 */

		h = (h % 1) * 6;
		if (h < 0) h += 6;

		var i = h | 0,
			f = h - i,
			p = v * (1 - s),
			q = v * (1 - f * s),
			t = v * (1 - (1 - f) * s),
			r = [v, q, p, p, t, v][i],
			g = [t, v, v, q, p, p][i],
			b = [p, p, t, v, v, q][i];

		//console.log(h, s, v, r, g, b);

		return [ r * 255, g * 255, b * 255 ];
	},

	gradient: function(first, second, ratio)
	{
		return [
			Math.floor(second[0] * ratio  + first[0] * (1 - ratio)),
			Math.floor(second[1] * ratio + first[1] * (1 - ratio)),
			Math.floor(second[2] * ratio + first[2] * (1 - ratio)),
		];
	},
}
