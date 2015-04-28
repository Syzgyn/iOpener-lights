void patternRainbowStripe(uint8_t duration)
{
  helperRainbowDirection(duration, random8(3));
}

void helperRainbowDirection(uint8_t duration, uint8_t dir)
{
  for(uint16_t j=0; j<256 * duration; j++)
  {
    for( byte y = 0; y < kMatrixHeight; y++)
    {   
      for( byte x = 0; x < kMatrixWidth; x++)
      {
        uint8_t hue = 0;
        if(dir == 0) //Horizontal
        {
          hue = ((y * 256 / kMatrixWidth) + j) & 255;
        }
        else if(dir == 1) //Vertical
        {
          hue = ((x * 256 / kMatrixWidth) + j) & 255;
        }
        else if(dir == 2) //Diagonal
        {
          hue = (((x + y) * 256 / kMatrixWidth) + j) & 255;
        }

        leds[ XY(x, y)] = CHSV(hue, 255, 255);
      }
    }

    FastLED.show();
    FastLED.delay(50);
  }
}