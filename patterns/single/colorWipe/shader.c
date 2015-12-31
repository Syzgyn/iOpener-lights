/*
 * COLOR WIPE
 */
inline static void ALWAYS_INLINE render_colorWipe(ShaderArgs_t args, char *pixels)
{

	for(int pixel = 0; pixel < args.pixelCount; pixel++)
	{
		int x, y, i;
		//Reverse from node.js version, takes converted number, outputs pixel number
		//A bit of a clusterfuck, maybe worth refactoring later
		if(args.direction == 1)
		{
			x = pixel % 6;
			y = floor(pixel/ 6);

			if(y % 2 == 1)
			{
				x = 5 - x;
			}
		}
		else if(args.direction == 2 || args.direction == 3)
		{
			y = pixel % 6;
			x = floor(pixel / 6);

			if(x % 2 == 1)
			{
				y = 5 - y;
			}
		}

		if(args.direction == 0)
		{
			i = pixel;
		}
		else 
		{
			i = y * 6 + x;
		}

		if(args.direction == 3 && fmod(i / 6, 2) == 1)
		{
			x = i % 6;
			i = i - x + 5 - x;
		}

		rgb output;
		hsv input;

		input.h = args.hue;
		input.s = 1.0;
		input.v = 1.0;

		if(i <= args.current_led)
		{
			input.h = args.hue + 130;
		}
		
		output = hsv2rgb(input);

		pixels[0] = packChannel(output.r);
		pixels[1] = packChannel(output.g);
		pixels[2] = packChannel(output.b);
        pixels += 3;
    }
}

static PyObject* py_render_colorWipe(PyObject* self, PyObject* args)
{
	ShaderArgs_t sa;
	int modelBytes;
    Py_ssize_t tmp;
    char *pixels;
    PyObject *result = NULL;

	
    if (!PyArg_ParseTuple(args, "t#fnn:render_colorWipe",
        &sa.model, &modelBytes, &sa.hue, &sa.direction, &sa.current_led)){
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
        render_colorWipe(sa, pixels);
    }

    return result;
}

