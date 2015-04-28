#include <avr/interrupt.h>
#include <avr/wdt.h>
#include <util/atomic.h>

volatile uint32_t seed;  // These two variables can be reused in your program after the
volatile int8_t nrot;    // function CreateTrulyRandomSeed()executes in the setup() 
                         // function.
uint32_t createTrulyRandomSeed()
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

  return seed;
}
 
ISR(WDT_vect)
{
  nrot--;
  seed = seed << 8;
  seed = seed ^ TCNT1L;
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