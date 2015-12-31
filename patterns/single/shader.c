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
	const int current_led;
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

//Include all the single pattern shader files
#include "colorWipe/shader.c"
#include "rainbowStripe/shader.c"
#include "hueStripe/shader.c"
#include "solidRainbow/shader.c"

static PyMethodDef pattern_functions[] = {
	{"solidRainbow", py_render_solidRainbow, METH_VARARGS, "Render solidRainbow"},
	{"hueStripe", py_render_hueStripe, METH_VARARGS, "Render HueStripe"},
	{"rainbowStripe", py_render_rainbowStripe, METH_VARARGS, "Render rainbowStripe"},
	{"colorWipe", py_render_colorWipe, METH_VARARGS, "Render colorWipe"},
	{NULL}
};

void initshader(void)
{
	Py_InitModule("shader", pattern_functions);
}
