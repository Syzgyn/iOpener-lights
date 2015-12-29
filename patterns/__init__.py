import time
import os
import sys
import numpy
import json
import math
import random

import single
import group

single.loadPatterns()
group.loadPatterns()

def randomPattern(group = False):
	if(group):
		return group.randomPattern()
	else:
		return single.randomPattern()
