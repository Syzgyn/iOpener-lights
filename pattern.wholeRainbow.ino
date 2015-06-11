void patternWholeRainbow(Light* light)
{
	uint8_t duration = 100;
	for(int16_t j = 0; j < 256 * duration; j++)
	{
		for( byte y = 0; y < kMatrixHeight; y++)
		{   
			for( byte x = 0; x < kMatrixWidth; x++)
		 	{
		 		light->leds[XY(x,y)] = CHSV(j & 255, 255, 255);
		 	}
	  	}

	  	FastLED.show();
	  	FastLED.delay(100);
	}
}