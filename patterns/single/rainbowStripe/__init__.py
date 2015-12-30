import random
import pattern
from utils.color_utils import hsvToRGB
from math import cos

from ..shader import rainbowStripe

from patterns.single import registerPattern 

class RainbowStripe(pattern.Pattern):
	def __init__(self, channel=0):
		pattern.Pattern.__init__(self, channel)

		self.speed = float(random.randint(10, 60))
		self.direction = random.randint(0, 2)
		self.width = random.randint(20, 80)

		self.offset = 0;

	def update(self):
		self.offset += self.speed / 100.0 

	def shader(self, coords):
		return rainbowStripe(coords, self.offset, self.direction, self.width)


registerPattern(RainbowStripe, "Rainbow Stripe")
