void patternSnake(uint8_t duration)
{
  //This defines the pixels that make up the snake
  uint8_t snakes[3][7][2] = {
    {{random8(6),random8(6)},{0,0},{0,0},{0,0},{0,0},{0,0},{0,0}},
    {{random8(6),random8(6)},{0,0},{0,0},{0,0},{0,0},{0,0},{0,0}},
    {{random8(6),random8(6)},{0,0},{0,0},{0,0},{0,0},{0,0},{0,0}}
  };

  uint8_t len = COUNT(snakes[0]);
  uint8_t hue = random8();

  //Clear the LEDs
  fill_solid(leds, NUM_LEDS, CHSV(hue, 255, 255));

  uint16_t dur = duration * 500;

  while(dur > 0)
  {
    for(uint8_t snake = 0; snake < COUNT(snakes); snake++)
    {
      //Black out the end of the snake
      leds[XY(snakes[snake][len - 1][0], snakes[snake][len - 1][1])] = CHSV(hue, 255, 255);

      //Move each segment of the snake back one
      for(uint8_t i = len - 1; i > 0; i--)
      {
        snakes[snake][i][0] = snakes[snake][i - 1][0];
        snakes[snake][i][1] = snakes[snake][i - 1][1];
      }

      uint8_t newDir = random8(4);
      //Pick a random direction for the front of the snake to go in
      switch(newDir)
      {
        case 0: //up
          if(snakes[snake][0][0] == 0)
          {
            snakes[snake][0][0] = 6;
          }
          else
          {
            snakes[snake][0][0]--;
          }
          break;
        case 1: //down
          if(snakes[snake][0][0] == 6)
          {
            snakes[snake][0][0] = 0;
          }
          else
          {
            snakes[snake][0][0]++;
          }
          break;
        case 2: //left
          if(snakes[snake][0][1] == 0)
          {
            snakes[snake][0][1] = 6;
          }
          else
          {
            snakes[snake][0][1]--;
          }
          break;
        case 3: //right
          if(snakes[snake][0][1] == 6)
          {
            snakes[snake][0][1] = 0;
          }
          else
          {
            snakes[snake][0][1]++;
          }
          break;
      }

      //Display the snake
      for(uint8_t i = 0; i < len; i++)
      {
        //Range of 40 hue across all the snakes
        leds[XY(snakes[snake][i][0], snakes[snake][i][1])] = CHSV((hue + ((40/(COUNT(snakes)-1))*(snake+1))) % 255, 255, 255);
      }
    }

    FastLED.show();
    FastLED.delay(200);

    dur--;
  }
}