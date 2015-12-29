#!/usr/bin/env python

"""iOpener lights server
"""

import logging
import math
import os
import platform
import socket
import subprocess
import sys
import time
import struct

import liblo #OSC server

import lantern
import patternController
import fastopc
import perpetualTimer

from ConfigParser import SafeConfigParser

parser = SafeConfigParser()
parser.read('config.ini')

try:
	with open('config.ini') as f:
		parser.readfp(f)
except IOError:
	raise Exception("No config file.  Copy default.config.ini to config.ini before running") 

def OnPi():
	uname_m = subprocess.check_output('uname -m', shell=True).strip()
	# Assume that an ARM processor means we're on the Pi
	return uname_m == 'armv6l'

BROADCAST_IP = '10.9.0.1'

CONSOLE_LOG_LEVEL = logging.DEBUG
FILE_LOG_LEVEL = logging.DEBUG
LOG_FILE = 'iopener.log'

# Setup logging
logger = logging.getLogger('iopener')
logger.setLevel(logging.DEBUG)
formatter = logging.Formatter(
	'%(asctime)s - %(name)s - %(levelname)s - %(message)s')

fh = logging.FileHandler('logs/iopener.log')
fh.setLevel(FILE_LOG_LEVEL)
fh.setFormatter(formatter)
logger.addHandler(fh)

ch = logging.StreamHandler()
ch.setLevel(CONSOLE_LOG_LEVEL)
ch.setFormatter(formatter)
logger.addHandler(ch)

class iOpenerServer(liblo.Server):

	def __init__(self, port, client_ip, client_port):
		liblo.Server.__init__(self, port)
		self.client = liblo.Address(client_ip, client_port)

		logger.info('action="init_server", port="%s", client_port="%s"',
					port, client_port)


		#Allow broadcast to clients
		self.socket = socket.fromfd(self.fileno(), socket.AF_INET, socket.SOCK_DGRAM)
		self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, True)

		#OPC
		opc = fastopc.FastOPC()

		#setup lanterns
		if parser.getboolean('debug', 'enabled'):
			channel_offset = parser.getint('debug', 'channel_offset') 
		else:
			channel_offset = 0

		self.lanterns = [lantern.Lantern(channel = count + channel_offset, opc=opc) 
			for count in xrange(parser.getint('app', 'num_lights'))]

		#pattern controller
		self.controller = patternController.patternController(lanterns=self.lanterns)

	def lanternLoop(self):
		for lantern in self.lanterns:
			lantern.tick()
			
	def controllerLoop(self):
		self.controller.tick()

	def start(self):
		perpetualTimer.perpetualTimer(
			parser.getfloat('app', 'lantern_loop_timer'), 
			self.lanternLoop).start()
		perpetualTimer.perpetualTimer(
			parser.getfloat('app', 'controller_loop_timer'),
			self.controllerLoop).start()

		while True:
			pass

if __name__ == "__main__":
	try:
		server = iOpenerServer(port=8000, client_ip=BROADCAST_IP, client_port=9000)
	except liblo.ServerError, err:
		print str(err)
		sys.exit()

	try:
		server.start()
	except KeyboardInterrupt:
		logger.info('action="manual_shutdown"')
	finally:
		logger.info('action="server_shutdown"')
