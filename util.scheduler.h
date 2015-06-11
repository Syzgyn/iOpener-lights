#include <util.task.h>

class TaskScheduler : public Task {
public:
	TaskScheduler(Task **task, uint8_t numTasks);
	void run();
private:
	Task **tasks;
	uint8_t numTasks;
};