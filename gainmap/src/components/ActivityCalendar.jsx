import dayjs from 'dayjs';
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";


function ActivityCalendar ({workouts = []}) {

    function buildActivityData(workouts) {
        const data = [];
        const weeks = [];

        const today = dayjs();
        const year = today.year();
        const month = today.month(); // 0–11
      
        const daysInMonth = today.daysInMonth();

        const firstDay = dayjs(new Date(year, month, 1));
        let weekdayIndex = firstDay.day(); //sunday 0, monday 1, ... saturday 6

        for (let i=0; i<(weekdayIndex+6)%7; i++){
            data.push(null);
            }

        for(let i=1; i<=daysInMonth; i++){
            const date = dayjs(new Date(year, month, i)).format('YYYY-MM-DD');
            const workoutDone = workouts.some(w => dayjs(w.date).isSame(date, 'day'));
            data.push({ date, workoutDone });
        }

        const lastDay = firstDay.endOf('month'); 
        weekdayIndex = lastDay.day(); 

        for (let i=weekdayIndex; i<=6; i++){
            data.push(null);
            }

        for(let i=0;i < data.length; i+=7){
            weeks.push(data.slice(i, i+7));
        }

        return weeks;
    }

    const activityData = buildActivityData(workouts);

    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];


  return (
    <div className="flex flex-col  ">
        <h2 className="text-lg text-stone-800 dark:text-stone-200 mb-4 ">
            Activity
        </h2>
            <div className="gap-1 mb-1 flex flex-row items-center justify-center">  
                {days.map((day, index) => (
                    <span key={index} className="text-xs  text-stone-500 dark:text-stone-400 w-6 h-6 inline-flex items-center justify-center">
                        {day}
                    </span>
                ))}
            </div>
            <div className="flex flex-col gap-1 items-center">
                {activityData.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex gap-1">
                        {week.map((day, dayIndex) =>(
                            <div key={dayIndex} data-tooltip-id="calendar-tooltip"
                            data-tooltip-content={
                                day
                                  ? `${dayjs(day.date).format("DD/MM/YYYY")}: ${day.workoutDone ? "Workout done" : "No workout"}`
                                  : ""
                              }
                            className={`w-6 h-6 flex text-xs rounded-full transition-all duration-150 justify-center items-center ${
                                day
                                ? day.workoutDone
                                    ? "bg-green-500"
                                    : "bg-gray-300 dark:bg-gray-600"
                                : "bg-transparent"
                            }  ${day && dayjs(day.date).isSame(dayjs(), 'day')? "ring-2 ring-brand" : ""} hover:scale-110`}>
                                {day ? dayjs(day.date).date() : ""}
                            </div>
                        ) )}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 mt-4 text-xs text-stone-500 dark:text-stone-400">
                <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded" />
                <span>Workout</span>
                </div>
                <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded" />
                <span>No workout</span>
                </div>
            </div>
        <Tooltip id="calendar-tooltip" />
        </div>
  );
}

export default ActivityCalendar;