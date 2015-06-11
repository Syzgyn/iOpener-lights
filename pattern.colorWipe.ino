void patternColorWipe(Light* light)
{
  uint8_t duration = 100;
  helperColorWipe(light, duration, random8(2));     
}

void helperColorWipe(Light* light, uint8_t duration, uint8_t dir)
{
  uint8_t hue = random8();

  while(duration > 0)  //For every set duration
  {
    for(uint8_t i = 0; i < 3; i++) //Do three wipes
    {
      for( byte y = 0; y < kMatrixHeight; y++)
      {   
        for( byte x = 0; x < kMatrixWidth; x++)
        {
          if(dir == 0) //Horizontal
          {
            light->leds[ XY(x, y)] = CHSV( hue, 255, 255);
          }
          else if(dir == 1) //Vertical
          {
            light->leds[XY(y,x)] = CHSV(hue, 255, 255);
          }

          FastLED.show();
          FastLED.delay(100);
        }
      }
      int8_t variance = random8(60);
      variance -= 30;
      hue = ((hue + 80 + variance) % 255);
    }

    duration--;
  }
}