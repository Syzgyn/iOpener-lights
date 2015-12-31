import random
import pattern
import numpy as np

from ..shader import rainbowSparkle

from patterns.single import registerPattern 

class RainbowSparkle(pattern.Pattern):
	def __init__(self, channel=0):
		pattern.Pattern.__init__(self, channel)

		self.offset = random.randint(100000, 400000)
		self.random_values = np.array([random.random() for x in range(36)]).astype(np.float32).tostring()

	def update(self):
		self.offset += 60/1.0

	def shader(self, coords):
		return rainbowSparkle(coords, self.offset, self.random_values)

registerPattern(RainbowSparkle, "Rainbow + Sparkle")
