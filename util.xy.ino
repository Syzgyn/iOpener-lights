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
  if( x >= kMatrixWidth) return 0;
  if( y >= kMatrixHeight) return 0;
  return XYbase(x,y);
}