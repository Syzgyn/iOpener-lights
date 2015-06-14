bool Task::canRun(uint32_t now)
{
	return true;
}

void Task::run(uint32_t now)
{

}

bool TimedTask::canRun(uint32_t now)
{
	return now >= runTime;
}