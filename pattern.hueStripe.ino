void patternHueStripe(uint8_t duration)
{
  uint8_t dir = random8(3);

  helperHueStripe(duration, 2);
}

void helperHueStripe(uint8_t duration, uint8_t dir)
{
  const uint8_t range = 40;
  const uint8_t swing = range / 2;
  uint8_t baseHue = random8();

  for(uint16_t j = 0; j < duration * 500; j++)
  {
    for( byte y = 0; y < kMatrixHeight; y++)
    {   
      for( byte x = 0; x < kMatrixWidth; x++)
      {
        uint8_t hue = 0;
        if(dir == 0) //Horizontal
        {
          hue = (uint8_t)(baseHue + ((cos((j * .125) + x) * swing) + range/2)) & 255;
        }
        else if(dir == 1) //Vertical
        {
          hue = (uint8_t)(baseHue + ((cos(j * 0.125 + y) * swing) + range/2)) & 255;
        }
        else if(dir == 2) //Diagonal
        {
          hue = (uint8_t)(baseHue + ((cos(j * 0.125 + x + y) * swing) + range/2)) & 255;
        }

        leds[ XY(x, y)] = CHSV(hue, 255, 255);
      }
    }

    FastLED.show();
    FastLED.delay(50);
  }
}