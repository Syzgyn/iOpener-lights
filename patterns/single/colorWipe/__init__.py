import random
import pattern

from ..shader import colorWipe

from patterns.single import registerPattern 

class ColorWipe(pattern.Pattern):
	def __init__(self, channel=0):
		pattern.Pattern.__init__(self, channel)

		self.hue = random.randint(0, 359);
		self.speed = random.randint(5, 10)
		self.direction = random.randint(0, 3) 

		self.last_update = 100
		self.current_led = -1

	def update(self):
		self.last_update += 1

		if self.last_update >= 15 - self.speed:
			self.last_update = 0
			self.current_led += 1

			if self.current_led >= 36:
				self.current_led = 0
				self.hue = (self.hue + 130) % 360

	def shader(self, coords):
		return colorWipe(coords, self.hue, self.direction, self.current_led)


registerPattern(ColorWipe, "Color Wipe")
