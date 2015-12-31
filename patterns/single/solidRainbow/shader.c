/*
 * SOLID RAINBOW
 */
inline static void ALWAYS_INLINE render_solidRainbow(ShaderArgs_t args, char *pixels)
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
        pixels[0] = packChannel(output.r);
        pixels[1] = packChannel(output.g);
        pixels[2] = packChannel(output.b);
        pixels += 3;
    }
}

static PyObject* py_render_solidRainbow(PyObject* self, PyObject* args)
{
	ShaderArgs_t sa;
	int modelBytes;
    Py_ssize_t tmp;
    char *pixels;
    PyObject *result = NULL;

	
    if (!PyArg_ParseTuple(args, "t#f:render",
        &sa.model, &modelBytes, &sa.hue)) {
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
        render_solidRainbow(sa, pixels);
    }

    return result;
}
