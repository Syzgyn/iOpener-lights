#include "task.controller.h"
#include "task.light.h"

// uint8_t groupCountdown starts at 5, decrements every 32 beats
// at 1, trigger the start of a group pattern
// at 0, reset to 5, trigger individual patterns


LightController::LightController(Light **_lights)
: TimedTask(millis()),
lights(*_lights)
{
	lastUpdate = millis();
	groupCountdown = 5;

	for(uint8_t i = 0; i < NUM_LIGHTS; i++)
	{
		fadingLights[i] = false;
	}
}

void LightController::run(uint32_t now)
{
	uint16_t oneBar = 60000 / BPM * 4;
	if(now >= lastUpdate + (oneBar * 32))
	{
		//Go through the lights that were just faded out,
		//updating them with new patterns
		for(uint8_t i = 0; i < NUM_LIGHTS; i++)
		{
			if(fadingLights[i])
			{
				if(groupCountdown == 1)
				{
					//Group pattern
				}
				else
				{
					//Individual Patterns
					lights[i].updatePattern(patterns[random(NUM_PATTERNS)]);
				}
			}

			fadingLights[i] = false;
		}

		lastUpdate = now;
	}
	else if(now >= lastUpdate + (oneBar * 32) - (oneBar * 4))
	{
		//Begin the fade out for a few of the lights

		//manage the group countdown
		if(groupCountdown == 0)
		{
			groupCountdown = 5;
		}
		else
		{
			//Update some of the lights
			for(uint8_t i = 0; i < NUM_LIGHTS; i++)
			{
				//1 in 3 chance for a light to be skipped and continue it's existing pattern
				//ONLY if we're not about to go into a group pattern
				if(groupCountdown > 1 && random8(3) == 1)
				{
					continue;
				}

				lights[i].updatePattern(patterns[random(NUM_PATTERNS)]);
				fadingLights[i] = true;
			}
		}

		groupCountdown--;
	}
}