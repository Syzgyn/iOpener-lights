import random
import pattern
from utils.color_utils import hsvToRGB
from math import cos

from patterns.single import registerPattern 

class HueStripe(pattern.Pattern):
	def __init__(self, channel=0):
		pattern.Pattern.__init__(self, channel)

		self.hue = random.randint(0, 359);
		self.speed = float(random.randint(10, 60))
		self.direction = random.randint(0, 2)

		self.range = 40
		self.swing = self.range / 2.0

		self.offset = 0;

	def update(self):
		self.offset += self.speed / 100.0

	def shader(self, coords, led_num):
		dir_var = coords[self.direction]
		
		hue = (self.hue + ((cos(self.offset * 0.125 + dir_var) * self.swing) + self.range / 2)) % 360

		return map(lambda x: x * 255 % 256, hsvToRGB(hue, 1, 1))

registerPattern(HueStripe, "Hue Stripe")

