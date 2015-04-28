#include <FastLED.h>
#include <avr/interrupt.h>
#include <avr/wdt.h>
#include <util/atomic.h>

//Include the patterns
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

uint16_t XYbase( uint8_t x, uint8_t y)
{
  uint16_t i;

  if( kMatrixSerpentineLayout == false)
  {
    i = (y * kMatrixWidth) + x;
  }

  if( kMatrixSerpentineLayout == true)
  {
    if( y & 0x01)
    {
      // Odd rows run backwards
      uint8_t reverseX = (kMatrixWidth - 1) - x;
      i = (y * kMatrixWidth) + reverseX;
    }
    else
    {
      // Even rows run forwards
      i = (y * kMatrixWidth) + x;
    }
  }

  return i;
}

uint16_t XY( uint8_t x, uint8_t y)
{
  if( x >= kMatrixWidth) return -1;
  if( y >= kMatrixHeight) return -1;
  return XYbase(x,y);
}

volatile uint32_t seed;  // These two variables can be reused in your program after the
volatile int8_t nrot;    // function CreateTrulyRandomSeed()executes in the setup() 
                         // function.
 
void createTrulyRandomSeed()
{
  seed = 0;
  nrot = 32; // Must be at least 4, but more increased the uniformity of the produced 
             // seeds entropy.
  
  // The following five lines of code turn on the watch dog timer interrupt to create
  // the seed value
  cli();                                             
  MCUSR = 0;                                         
  _WD_CONTROL_REG |= (1<<_WD_CHANGE_BIT) | (1<<WDE); 
  _WD_CONTROL_REG = (1<<WDIE);                       
  sei();                                             
 
  while (nrot > 0);  // wait here until seed is created
 
  // The following five lines turn off the watch dog timer interrupt
  cli();                                             
  MCUSR = 0;                                         
  _WD_CONTROL_REG |= (1<<_WD_CHANGE_BIT) | (0<<WDE); 
  _WD_CONTROL_REG = (0<< WDIE);                      
  sei();                                             
}
 
ISR(WDT_vect)
{
  nrot--;
  seed = seed << 8;
  seed = seed ^ TCNT1L;
}

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
  createTrulyRandomSeed();
  randomSeed(seed);
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

uint8_t weightedRandom()
{
  uint8_t totals[NUM_PATTERNS];
  uint8_t runningTotal = 0;

  for(uint8_t i = 0; i < NUM_PATTERNS; i++)
  {
    runningTotal += patternWeights[i];
    totals[i] = runningTotal;
  }

  uint16_t rnd = random8(100) * runningTotal / 100;
   for(uint8_t i = 0; i < COUNT(totals); i++)
  {
    if(rnd < totals[i])
    {
      return i;
    }
  }

  return 0; //Should never hit this
}