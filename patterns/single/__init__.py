import random
import pkgutil
import logging

logger = logging.getLogger('iopener')
patterns = {}
__path__ = pkgutil.extend_path(__path__, __name__)

def loadPatterns(): 
	for importer, modname, ispkg in pkgutil.walk_packages(path=__path__, prefix=__name__+'.'):
		__import__(modname)


def registerPattern(pattern_obj, pattern_name):
	patterns[pattern_name] = pattern_obj
	logger.debug("Pattern Registered: %s" % pattern_name)

def randomPattern():
	name = random.choice(patterns.keys())
	return (patterns[name], name)
