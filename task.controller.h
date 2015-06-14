#ifndef HEADER_TASK_CONTROLLER
#define HEADER_TASK_CONTROLLER

#include <task.light.h>
#include <util.task.h>
#include <FastLED.h>

class LightController : public TimedTask {
public:
	LightController(Light *_lights);
	virtual void run(uint32_t now);
private:
	Light *lights; //The lights
	uint32_t lastUpdate; //millis() of the last time new patterns started
	uint8_t groupCountdown; //counter to the next group pattern
	bool fadingLights[];  //Lights that are currently fading to black
};
#endif