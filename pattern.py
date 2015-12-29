import time
import numpy

class Pattern(object):
	def __init__(self, channel=0):
		self.FPS = 30.0
		self.time = 0.0 
		self.last_run = 0
		self.use_gradient = False
		self.channel = channel

		self.controls = {}

	def tick(self, dt):
		self.time += dt

		if self.time > 1 / self.FPS:
		#while self.time > 1 / self.FPS:
			print("%s %s / %s" % (self.channel, self.time, 1 / self.FPS))
			self.update()
			self.time -= 1 / self.FPS

	def update(self):
		pass
	
	def shader(self, coords, led_num):
		return (0,0,0)
