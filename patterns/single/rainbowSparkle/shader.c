#include <stdio.h>
/*
 * RAINBOW SPARKLE
 */
inline static rgb contrast(rgb color, float center, float mult)
{
	rgb output;

	output.r = (color.r - center) * mult + center;
	output.g = (color.g - center) * mult + center;
	output.b = (color.b - center) * mult + center;

	return output;
}

inline static void ALWAYS_INLINE render_rainbowSparkle(ShaderArgs_t args, float *randomValues, char *pixels)
{
    /*
     * Low-level rendering core. Uses parameters in 'args' (inlined), places results
     * in the provided pixel buffer.
     */

	rgb output;
	hsv input;

	input.h = args.hue;
	input.s = 1.0;
	input.v = 1.0;

	output = hsv2rgb(input);

    while (args.pixelCount--) {
		float x, y, z, x1, clamped, fade, random_val, twinkle;
		float twinkle_speed = 0.007;
		float twinkle_density = 0.2;
		rgb output, contrasted, clampdown;

		x = args.model[0];
		y = args.model[1];
		z = args.model[2];
		args.model += 3;


		y += (cos((x + 0.2*z) * 6.28) / 2 + 0.5) * 0.6;
		z += (cos((x) * 6.28) / 2 + 0.5) * 0.3;
		x += (cos((y + z / 1.5) * 6.28) / 2 + 0.5) * 0.2;

		x1 = x;
		x = y;
		y = z;
		z = x1;

		output.r = cos((x / 2.5 - args.offset / 4) * 6.28) / 2 + 0.5;
		output.g = cos((y / 2.5 - args.offset / 4) * 6.28) / 2 + 0.5;
		output.b = cos((z / 2.5 - args.offset / 4) * 6.28) / 2 + 0.5;

		contrasted = contrast(output, 0.5, 1.4);

/*
//This is all causing flickering, and the sparkles aren't working currently
		clampdown.r = cos((x / 4 - (args.offset / 10 + 12.345)) * 6.28) / 2 + 0.5;
		clampdown.g = cos((y / 4 - (args.offset / 10 + 24.536)) * 6.28) / 2 + 0.5;
		clampdown.b = cos((z / 4 - (args.offset / 10 + 34.675)) * 6.28) / 2 + 0.5;

		clamped = (clampdown.r + clampdown.g + clampdown.b) / 2.0;
		clamped = fmax(fmin((clamped - 0.2) / 0.1, 1), 0);

	//	contrasted.r *= clamped;
	//	contrasted.g *= clamped;
	//	contrasted.b *= clamped;

		contrasted.g = contrasted.g * 0.6 + ((contrasted.r + contrasted.b) / 2) * 0.4;

		fade = pow(cos(((args.offset - args.pixelCount / 36) / 7) * 6.28) / 2 + 0.5, 20);
		fade = 1 - fade * 0.2;

	//	contrasted.r *= fade;
	//	contrasted.g *= fade;
	//	contrasted.b *= fade;

		random_val = randomValues[args.pixelCount - 1];
		
		twinkle = fmod(random_val * 7 + (time(0) / 50) * twinkle_speed, 1);
		twinkle = fabs(twinkle * 2 - 1);
		twinkle = twinkle * (1.1 - (-1 / twinkle_density)) + (-1 / twinkle_density);
		twinkle = fmax(fmin(twinkle, 1.1), -0.5);
		twinkle = pow(twinkle, 5);
		twinkle = pow(cos(((args.offset - args.pixelCount / 36) / 7) * 6.28) / 2 + 0.5, 20);
		twinkle = fmax(fmin(twinkle, 1), -0.3);

	//	contrasted.r += twinkle;
	//	contrasted.g += twinkle;
	//	contrasted.b += twinkle;

*/

        pixels[0] = packChannel(contrasted.r);
        pixels[1] = packChannel(contrasted.g);
        pixels[2] = packChannel(contrasted.b);
        pixels += 3;
    }
}

static PyObject* py_render_rainbowSparkle(PyObject* self, PyObject* args)
{
	ShaderArgs_t sa;
	int modelBytes;
	int randomBytes;
    Py_ssize_t tmp;
    char *pixels;
	float *randomValues;
    PyObject *result = NULL;

	
    if (!PyArg_ParseTuple(args, "t#ft#:render",
        &sa.model, &modelBytes, &sa.offset, &randomValues, &randomBytes)) {
        return NULL;
    }

    if (modelBytes % 12) {
        PyErr_SetString(PyExc_ValueError, "Model string is not a multiple of 12 bytes long");
        return NULL;
    }
    sa.pixelCount = modelBytes / 12;

    result = PyBuffer_New(sa.pixelCount * 3);
    if (result) {
        PyObject_AsWriteBuffer(result, (void**) &pixels, &tmp);
        render_rainbowSparkle(sa, randomValues, pixels);
    }

    return result;
}
