import random
import pattern
from utils.color_utils import hsvToRGB
from math import cos

from ..shader import hueStripe

from patterns.single import registerPattern 

class HueStripe(pattern.Pattern):
	def __init__(self, channel=0):
		pattern.Pattern.__init__(self, channel)

		self.hue = random.randint(0, 359);
		self.speed = float(random.randint(10, 60))
		self.direction = random.randint(0, 2)

		self.range = 60
		self.swing = self.range / 2.0

		self.offset = 0;

	def update(self):
		self.offset += self.speed / 500.0 

	def shader(self, coords):
		return hueStripe(coords, self.hue, self.offset, self.direction, self.swing, self.range)


registerPattern(HueStripe, "Hue Stripe")
