import time
import numpy

class Pattern(object):
	def __init__(self, channel=0):
		self.FPS = 30
		self.start_time = time.time()
		self.last_run = 0
		self.use_gradient = False
		self.channel = channel

		self.controls = {}

	def tick(self):
		elapsed = time.time() - self.last_run
		if(self.FPS == False or elapsed > 1 / self.FPS):
			self.update()
			self.last_run = time.time()

	def update(self):
		pass
	
	def shader(self, coords, led_num):
		return (0,0,0)
