#ifndef HEADER_UTIL_TASK
#define HEADER_UTIL_TASK
class Task
{
public:
	virtual bool canRun(uint32_t now = 0);
	virtual void run(uint32_t now = 0);
};

class TimedTask : public Task {
public:
	inline TimedTask(uint32_t when) {
		runTime = when;
	}
	virtual bool canRun(uint32_t now);
	inline void setRunTime(uint32_t when) {
		runTime = when;
	}
	inline void incRunTime(uint32_t inc) {
		runTime += inc;
	}
	inline uint32_t getRunTime() {
		return runTime;
	}
protected:
	uint32_t runTime;
};
#endif