//Libraries
#include <FastLED.h>

//Utilities
#include "util.xy.h"
#include "util.random.h"

//Patterns
#include "pattern.colorWipe.h"
#include "pattern.rainbowBlob.h"
#include "pattern.rainbowStripe.h"
#include "pattern.snake.h"
#include "pattern.hueStripe.h"
#include "pattern.fire.h"


#define LED_PIN 13
#define CHIPSET NEOPIXEL
#define BRIGHTNESS 128
#define NUM_PATTERNS 5
#define MAX_DURATION 3

#define COUNT(A) (sizeof(A) / sizeof((A)[0]))

// Params for width and height
const uint8_t kMatrixWidth = 6;
const uint8_t kMatrixHeight = 6;

#define NUM_LEDS (kMatrixWidth * kMatrixHeight)
CRGB leds_plus_safety_pixel[ NUM_LEDS + 1];
CRGB* leds( leds_plus_safety_pixel + 1);

// Param for different pixel layouts
const bool kMatrixSerpentineLayout = true;



//Declare pointer array
typedef void (*functionArray[])(uint8_t duration);

//Pattern declarations
functionArray patterns = {
  patternRainbowBlob,   //0
  patternColorWipe,     //1
  patternRainbowStripe, //2
  patternSnake,         //3
  patternHueStripe,    //4
  patternFire,          //5
};

//Should total to 100
uint8_t patternWeights[] = {
  10,
  10,
  10,
  30,
  40,
  100,
};

void setup() {
  delay(1000); //Sanity Delay
  randomSeed(createTrulyRandomSeed());
  random16_add_entropy(random());

  FastLED.addLeds<CHIPSET, LED_PIN>(leds, NUM_LEDS).setCorrection(TypicalSMD5050);
  FastLED.setBrightness(BRIGHTNESS);

  Serial.begin(9600);
  Serial.println(random8());
}

void loop()
{
  random16_add_entropy(millis());

  //Pick a random pattern to use, and the duration it should go for
  uint8_t index = weightedRandom();
  uint8_t duration = random8(1, MAX_DURATION + 1);
  Serial.println(index);
  index = 1;

  Serial.println("New pattern: index " + String(index) + ", duration " + String(duration));

  duration = 1;
  utilFadeToBlack();
  patterns[index](duration);
}

void utilFadeToBlack()
{
  for(uint8_t i = 50; i > 0; i--)
  {
    fadeToBlackBy(leds, NUM_LEDS, 10);
    FastLED.delay(40);
  }
  FastLED.setBrightness(BRIGHTNESS);
}

