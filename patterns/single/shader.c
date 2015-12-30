#include <Python.h>
#include <math.h>

#define ALWAYS_INLINE __attribute__((always_inline))

typedef struct {
	const float *model;
	const float hue;
	const int direction;
	const int width;
	const float swing;
	const float range;
	const float offset;
	int pixelCount;
} ShaderArgs_t;

typedef struct {
    double r;       // percent
    double g;       // percent
    double b;       // percent
} rgb;

typedef struct {
    double h;       // angle in degrees
    double s;       // percent
    double v;       // percent
} hsv;

inline static char ALWAYS_INLINE packChannel(float c)
{
    /*
     * Clamp, scale, and pack a floating point channel value as an 8-bit integer.
     */

    int value = (int) ((c * 255.0f) + 0.5f);
    if (value < 0) value = 0;
    if (value > 255) value = 255;
    return value;
}

inline static rgb hsv2rgb(hsv in)
{
    double      hh, p, q, t, ff;
    long        i;
    rgb         out;

    if(in.s <= 0.0) {       // < is bogus, just shuts up warnings
        out.r = in.v;
        out.g = in.v;
        out.b = in.v;
        return out;
    }
    hh = in.h;
    if(hh >= 360.0) hh = 0.0;
    hh /= 60.0;
    i = (long)hh;
    ff = hh - i;
    p = in.v * (1.0 - in.s);
    q = in.v * (1.0 - (in.s * ff));
    t = in.v * (1.0 - (in.s * (1.0 - ff)));

    switch(i) {
    case 0:
        out.r = in.v;
        out.g = t;
        out.b = p;
        break;
    case 1:
        out.r = q;
        out.g = in.v;
        out.b = p;
        break;
    case 2:
        out.r = p;
        out.g = in.v;
        out.b = t;
        break;

    case 3:
        out.r = p;
        out.g = q;
        out.b = in.v;
        break;
    case 4:
        out.r = t;
        out.g = p;
        out.b = in.v;
        break;
    case 5:
    default:
        out.r = in.v;
        out.g = p;
        out.b = q;
        break;
    }
    return out;     
}

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

/*
 * RAINBOW STRIPE
 */
inline static void ALWAYS_INLINE render_rainbowStripe(ShaderArgs_t args, char *pixels)
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

		input.h = fmod(((1.0 + dir_coord) * args.width) + args.offset, 360);
		input.s = 1.0;
		input.v = 1.0;

		output = hsv2rgb(input);

        pixels[0] = packChannel(output.r);
        pixels[1] = packChannel(output.g);
        pixels[2] = packChannel(output.b);
        pixels += 3;
    }
}

static PyObject* py_render_rainbowStripe(PyObject* self, PyObject* args)
{
	ShaderArgs_t sa;
	int modelBytes;
    Py_ssize_t tmp;
    char *pixels;
    PyObject *result = NULL;

	
    if (!PyArg_ParseTuple(args, "t#fnn:render_rainbowStripe",
        &sa.model, &modelBytes, &sa.offset, &sa.direction, &sa.width)) {
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
        render_rainbowStripe(sa, pixels);
    }

    return result;
}

static PyMethodDef pattern_functions[] = {
	{"solidRainbow", py_render_solidRainbow, METH_VARARGS, "Render solidRainbow"},
	{"hueStripe", py_render_hueStripe, METH_VARARGS, "Render HueStripe"},
	{"rainbowStripe", py_render_rainbowStripe, METH_VARARGS, "Render rainbowStripe"},
	{NULL}
};

void initshader(void)
{
	Py_InitModule("shader", pattern_functions);
}
