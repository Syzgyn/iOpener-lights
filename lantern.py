import time
import os
import sys
import numpy as np
import json
import math
import random
import logging

import patterns

logger = logging.getLogger('iopener')

class Model(object):
	"""A model of the physical sculpture. Holds information about the position of the LEDs.
	   In the animation code, LEDs are represented as zero-based indices which match the
	   indices used by the OPC server.
	   """

	def __init__(self, filename):
		# Raw graph data
		self.graphData = json.load(open(filename))

		# Points, as a NumPy array
		self.points = np.array([x['point'] for x in self.graphData])

		# Axis-aligned bounding box
		self.pointMin = np.min(self.points, axis=0)
		self.pointMax = np.max(self.points, axis=0)

		# Packed buffer, ready to pass to our native code
		self.packed = self.points.astype(np.float32).tostring()

class Lantern(object):
	
	def __init__(self, opc, layout="layout/sphere.json", channel=0):
		self.opc = opc
		self.layout = Model(layout)
		self.channel = channel

		num_pixels = len(self.layout.points)
		self.pixel_buffer = np.zeros(num_pixels * 3, dtype=int).reshape((num_pixels, 3))
		self.writePixels()

		self.current_pattern = None
	
	def writePixels(self):
		self.opc.putPixels(self.channel, self.pixel_buffer)

	def tick(self, dt):
		if self.current_pattern:
			self.current_pattern.tick(dt)
		#Render
		self.render()

	def setPattern(self, pattern):
		self.current_pattern = pattern

	def render(self):
		#logger.debug("Rendering channel %s" % self.channel)
		if self.current_pattern is None:
			return

		self.pixel_buffer = self.current_pattern.shader(self.layout.packed);
		self.writePixels()

