#include "task.light.h"

Light::Light(CRGB _leds[])
: TimedTask(millis()),
leds(_leds),
newPattern(true)
{

}

//Only used in array declaration
Light::Light()
: TimedTask(millis()),
newPattern(true)
{

}

void Light::run(uint32_t now)
{
	currentFunction(this);
}

void Light::updatePattern(funcPointer pattern)
{
	newPattern = true;
	currentFunction = pattern;
}