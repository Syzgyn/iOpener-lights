void patternRainbowBlob(uint8_t duration)
{
  uint16_t i = duration * 1000;

  while(i > 0)
  {
    uint32_t ms = millis();
    int32_t yHueDelta32 = ((int32_t)cos16( ms * (27/15) ) * (350 / kMatrixWidth));
    int32_t xHueDelta32 = ((int32_t)cos16( ms * (39/15) ) * (310 / kMatrixHeight));
    helperRainbowBlob( ms / 65536, yHueDelta32 / 32768, xHueDelta32 / 32768);  

    FastLED.show();
    FastLED.delay(20);
    i--;
  }
}

void helperRainbowBlob( byte startHue8, int8_t yHueDelta8, int8_t xHueDelta8)
{
  byte lineStartHue = startHue8;
  for( byte y = 0; y < kMatrixHeight; y++) {
    lineStartHue += yHueDelta8;
    byte pixelHue = lineStartHue;      
    for( byte x = 0; x < kMatrixWidth; x++) {
      pixelHue += xHueDelta8;
      leds[ XY(x, y)] = CHSV( pixelHue, 255, 255);
    }
  }
}