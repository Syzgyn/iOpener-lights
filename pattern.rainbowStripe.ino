void patternRainbowStripe(Light light)
{
  helperRainbowDirection(light, random8(3));
}

void helperRainbowDirection(Light light, uint8_t dir)
{
  uint8_t duration = 100;
  for(uint16_t j=0; j<256 * duration; j++)
  {
    for( byte y = 0; y < kMatrixHeight; y++)
    {   
      for( byte x = 0; x < kMatrixWidth; x++)
      {
        uint8_t hue = 0;
        if(dir == 0) //Horizontal
        {
          hue = ((y * 128 / kMatrixWidth) + (j/1)) & 255;
        }
        else if(dir == 1) //Vertical
        {
          hue = ((x * 128 / kMatrixWidth) + (j/1)) & 255;
        }
        else if(dir == 2) //Diagonal
        {
          hue = (((x + y) * 128 / kMatrixWidth) + (j/1)) & 255;
        }

        light.leds[ XY(x, y)] = CHSV(hue, 255, 255);
      }
    }

    FastLED.show();
    FastLED.delay(50);
  }
}