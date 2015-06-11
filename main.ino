//Libraries
#include <FastLED.h>

//Utilities
#include "util.xy.h"
#include "util.random.h"
#include "util.scheduler.h"

//Tasks
#include "task.light.h"
#include "task.controller.h"

//Patterns
#include "pattern.colorWipe.h"
#include "pattern.rainbowBlob.h"
#include "pattern.rainbowStripe.h"
#include "pattern.snake.h"
#include "pattern.hueStripe.h"
#include "pattern.fire.h"
#include "pattern.wholeRainbow.h"


#define LED_PIN 13
#define CHIPSET NEOPIXEL
#define BRIGHTNESS 128
#define MAX_DURATION 3

#define BPM 120


#define COUNT(A) (sizeof(A) / sizeof((A)[0]))

// Params for width and height
const uint8_t kMatrixWidth = 6;
const uint8_t kMatrixHeight = 6;

#define NUM_LEDS (kMatrixWidth * kMatrixHeight)
#define NUM_LIGHTS 10

CRGB leds[NUM_LIGHTS][ NUM_LEDS];

// Param for different pixel layouts
const bool kMatrixSerpentineLayout = true;

//Declare pointer array
typedef void (*functionArray[])(Light* light);

//Pattern declarations
functionArray patterns = {
  patternRainbowBlob,   //0
  patternColorWipe,     //1
  //patternRainbowStripe, //2
  //patternSnake,         //3
  patternHueStripe,     //4
  //patternFire,          //5
  patternWholeRainbow,  //6
};

//Should total to 100
uint8_t patternWeights[] = {
  10,
  10,
  10,
  25,

  //25,
  //25,
};

Light lights[NUM_LIGHTS];


#define NUM_PATTERNS COUNT(patterns)

void setup() {
  delay(1000); //Sanity Delay 
  randomSeed(createTrulyRandomSeed());
  random16_add_entropy(random());

  //Cant do this in a loop, stupid.
  FastLED.addLeds<CHIPSET, 3>(leds[0], NUM_LEDS).setCorrection(TypicalSMD5050);
  //FastLED.addLeds<CHIPSET, 4>(leds[1], NUM_LEDS).setCorrection(TypicalSMD5050);
  //FastLED.addLeds<CHIPSET, 5>(leds[2], NUM_LEDS).setCorrection(TypicalSMD5050);
  //FastLED.addLeds<CHIPSET, 6>(leds[3], NUM_LEDS).setCorrection(TypicalSMD5050);
  //FastLED.addLeds<CHIPSET, 7>(leds[4], NUM_LEDS).setCorrection(TypicalSMD5050);
  //FastLED.addLeds<CHIPSET, 8>(leds[5], NUM_LEDS).setCorrection(TypicalSMD5050);
  //FastLED.addLeds<CHIPSET, 9>(leds[6], NUM_LEDS).setCorrection(TypicalSMD5050);
  //FastLED.addLeds<CHIPSET, 10>(leds[7], NUM_LEDS).setCorrection(TypicalSMD5050);
  //FastLED.addLeds<CHIPSET, 11>(leds[8], NUM_LEDS).setCorrection(TypicalSMD5050);
  //FastLED.addLeds<CHIPSET, 12>(leds[9], NUM_LEDS).setCorrection(TypicalSMD5050);

  for(uint8_t i = 0; i < NUM_LIGHTS; i++)
  {
    lights[i] = Light(leds[i]);
    lights[i].updatePattern(patterns[random(NUM_PATTERNS)]);
  }
  
  FastLED.setBrightness(BRIGHTNESS);

  Serial.begin(9600);
}

void loop()
{
  random16_add_entropy(millis());

  //Pick a random pattern to use, and the duration it should go for
  uint8_t index = random(NUM_PATTERNS);//weightedRandom();
  uint8_t duration = random8(1, MAX_DURATION + 1);

  Serial.println("New pattern: index " + String(index) + ", duration " + String(duration));

  //utilFadeToBlack();
  //patterns[index](duration);
}

void patternFadeToBlack(Light *light)
{
  for(uint8_t i = 50; i > 0; i--)
  {
    fadeToBlackBy(light->leds, NUM_LEDS, 10);
    FastLED.delay(40);
  }
  FastLED.setBrightness(BRIGHTNESS);
}