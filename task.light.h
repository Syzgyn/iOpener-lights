#ifndef HEADER_TASK_LIGHT
#define HEADER_TASK_LIGHT

#include <util.task.h>
#include <FastLED.h>

class Light : public TimedTask {
	typedef void (*funcPointer)(Light* light);
public:
	Light(); //Constructor used during array creation
	Light(CRGB _leds[]); //Regular constructor
	CRGB *leds; //LED strip
	virtual void run(uint32_t now); //task runner
	virtual void updatePattern(funcPointer); //assign a new pattern to the light
private:
	boolean newPattern; //trigger for new pattern functions to assign their starting vars
	funcPointer currentFunction; //current pattern function
};
#endif