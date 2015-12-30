import random
import pattern
from utils.color_utils import hsvToRGB

from ..shader import solidRainbow

from patterns.single import registerPattern 

class Rainbow(pattern.Pattern):
	def __init__(self, channel=0):
		pattern.Pattern.__init__(self, channel)

		self.hue = 0.0;
		self.speed = float(random.randint(20, 100))

	def update(self):
		self.hue = (self.hue + self.speed / 100.0) % 360

	def shader(self, coords):
		return solidRainbow(coords, self.hue)

registerPattern(Rainbow, "Solid Rainbow")
