bool TimedTask::canRun(uint32_t now)
{
	return now >= runTime;
}