import dayjs from 'dayjs';


function ActivityCalendar ({workouts = []}) {

    function buildActivityData(workouts) {
        const data = [];
        const weeks = [];

        const today = dayjs();
        const year = today.year();
        const month = today.month(); // 0–11
      
        const daysInMonth = today.daysInMonth();

        const firstDay = dayjs(new Date(year, month, 1));
        const weekdayIndex = firstDay.day(); //sunday 0, monday 1, ... saturday 6

        for (let i=0; i<(weekdayIndex+6)%7; i++){
            data.push(null);
            }

        for(let i=1; i<=daysInMonth; i++){
            const date = dayjs(new Date(year, month, i)).format('YYYY-MM-DD');
            const workoutDone = workouts.some(w => dayjs(w.date).isSame(date, 'day'));
            data.push({ date, workoutDone });
        }


        for(let i=0;i < data.length; i+=7){
            weeks.push(data.slice(i, i+7));
        }

        return weeks;
    }

    const activityData = buildActivityData(workouts);

    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];


  return (
    <div>
        <h2 className="text-lg text-stone-800 dark:text-stone-200 mb-4">Activity Calendar</h2>
        <div>
            <div className="gap-1 mb-1 flex flex-row">  
                {days.map((day, index) => (
                    <span key={index} className="text-xs text-stone-500 dark:text-stone-400 w-4 h-4 inline-flex items-center justify-center">
                        {day}
                    </span>
                ))}
            </div>
            <div>
            {activityData.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-row gap-1 mb-1">
                    {week.map((day, dayIndex) =>(
                        <div key={dayIndex}
                        className={`w-4 h-4 rounded justify-center ${
                            day
                              ? day.workoutDone
                                ? "bg-green-500"
                                : "bg-gray-300"
                              : "bg-transparent"
                          }  ${day && dayjs(day.date).isSame(dayjs(), 'day')? "ring-2 ring-blue-500" : ""}`}>
                        
                        </div>
                    ) )}
                </div>
            ))}
            </div>
        </div>
    </div>
  );
}

export default ActivityCalendar;