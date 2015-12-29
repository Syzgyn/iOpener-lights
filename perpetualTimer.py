from threading import Timer

class perpetualTimer():

   def __init__(self,t,hFunction):
	  self.t=t
	  self.hFunction = hFunction
	  self.thread = Timer(self.t,self.handle_function)
	  self.thread.daemon = True

   def handle_function(self):
	  self.hFunction()
	  self.thread = Timer(self.t,self.handle_function)
	  self.thread.daemon = True
	  self.thread.start()

   def start(self):
	  self.thread.start()

   def cancel(self):
	  self.thread.cancel()
