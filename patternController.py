import time
import random
import logging

import patterns

logger = logging.getLogger('iopener')

class patternController(object):
	def __init__(self, lanterns = []):
		self.time = 0 

		self.lanterns = lanterns

		self.timers = [0 for l in self.lanterns]
		
		self.group_timer = 100

		random.seed()
	
	def tick(self, dt):
		self.time += dt
		if(self.time >= 1):
			self.update()
			self.time -= 1.0
		

	def update(self):
		for i, timer in enumerate(self.timers):
			self.timers[i] -= 1

			if self.timers[i] <= 0:
				self.changePattern(i)

	def changePattern(self, i):
		pattern_class, pattern_name = patterns.randomPattern()
		pattern = pattern_class(channel = self.lanterns[i].channel)
		duration = random.randint(20, 40)

		self.lanterns[i].setPattern(pattern)
		self.timers[i] = duration 

		logger.debug("change pattern for lantern %s to pattern %s for %s" % (self.lanterns[i].channel, pattern_name, duration))
