import dayjs from 'dayjs';
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import localeData from 'dayjs/plugin/localeData'
dayjs.extend(localeData);

import {useState} from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";




function ActivityCalendar ({workouts = []}) {

    const today = dayjs();

    const [currentMonth, setCurrentMonth] = useState(today.month());
    const [currentYear, setCurrentYear] = useState(today.year());

    function buildActivityData(workouts, year, month) {
        const data = [];
        const weeks = [];
      
        const daysInMonth = dayjs(new Date(year, month)).daysInMonth();

        const firstDay = dayjs(new Date(year, month, 1));
        let weekdayIndex = firstDay.day(); //sunday 0, monday 1, ... saturday 6

        for (let i=0; i<(weekdayIndex+6)%7; i++){
            data.push(null);
            }

        for(let i=1; i<=daysInMonth; i++){
            const date = dayjs(new Date(year, month, i)).format('YYYY-MM-DD');
            const workoutDone = workouts.some(w => dayjs(w.date).isSame(dayjs(date), 'day'));
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

    function goToPrevMonth() {
        if (currentMonth === 0 ){
            setCurrentMonth(11);
            setCurrentYear(prev => prev - 1);
        }
        else{
            setCurrentMonth(prev => prev - 1);
        }
    }

    function goToNextMonth() {
        if (currentMonth === 11 ){
            setCurrentMonth(0);
            setCurrentYear(prev => prev + 1);
        }
        else{
            setCurrentMonth(prev => prev + 1);
        }
    }

    const activityData = buildActivityData(workouts, currentYear, currentMonth);

    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const months = dayjs.months();


  return (
    <div className="flex flex-col  ">
            <div className="flex flex-row justify-between items-start mb-4 ">
                <h2 className="text-lg text-stone-800 dark:text-stone-200 mb-4 ">
                    Activity
                </h2>
                <div className="flex gap-2 mt-1">
                    <button onClick={goToPrevMonth} 
                        className="text-sm p-1.5 items-center rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"> 
                        <IoIosArrowBack/>
                    </button>
                    <p className="mt-0.5 text-sm">{months[currentMonth]} {currentYear}</p>
                    <button onClick={goToNextMonth}
                        disabled={currentMonth === today.month() && currentYear === today.year()}
                        className="text-sm p-1.5 items-center rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 disabled: transition-colors disabled:opacity-30 disabled:hover:bg-transparent">
                        <IoIosArrowForward  />
                    </button>
                </div>
            </div>
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
                            className={`w-8 h-8 flex text-xs rounded-full transition-all duration-150 justify-center items-center ${
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