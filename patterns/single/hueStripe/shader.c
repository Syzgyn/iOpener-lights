/*
 * HUE STRIPE
 */
inline static void ALWAYS_INLINE render_hueStripe(ShaderArgs_t args, char *pixels)
{
    /*
     * Low-level rendering core. Uses parameters in 'args' (inlined), places results
     * in the provided pixel buffer.
     */

    while (args.pixelCount--) {
        float dir_coord;
		rgb output;
		hsv input;

		dir_coord = args.model[args.direction];
        args.model += 3;

		input.h = fmod(args.hue + ((cos(args.offset + dir_coord * 3) * args.swing) + args.range / 2), 360);
		input.s = 1.0;
		input.v = 1.0;

		output = hsv2rgb(input);

        pixels[0] = packChannel(output.r);
        pixels[1] = packChannel(output.g);
        pixels[2] = packChannel(output.b);
        pixels += 3;
    }
}

static PyObject* py_render_hueStripe(PyObject* self, PyObject* args)
{
	ShaderArgs_t sa;
	int modelBytes;
    Py_ssize_t tmp;
    char *pixels;
    PyObject *result = NULL;

	
    if (!PyArg_ParseTuple(args, "t#ffnff:render_hueStripe",
        &sa.model, &modelBytes, &sa.hue, &sa.offset, &sa.direction, &sa.swing, &sa.range)) {
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
        render_hueStripe(sa, pixels);
    }

    return result;
}

