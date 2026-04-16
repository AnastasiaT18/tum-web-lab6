import { IoSettingsOutline } from "react-icons/io5";
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
import { SiTicktick } from "react-icons/si";





function GoalDisplay({weeklyGoal = 0, workouts= []}) {

    function getCompletedDays(){
        let completedDays = 0;
        //get current week range

        const today = dayjs();
        const weekdayIndex = (today.day()+6)%7; //sunday 6, monday 0, ... saturday 5
        let startOfWeek = today.subtract(weekdayIndex, 'day');
        let endOfWeek = today.add(6-weekdayIndex, 'day');    

        //calc hwo many dates in workouts are in this week, dine
        const workoutsThisWeek = workouts.filter(w=>(dayjs(w.date).isBetween(startOfWeek, endOfWeek, 'day', '[]')));

        completedDays = (new Set(workoutsThisWeek.map(w=>dayjs(w.date).format('YYYY-MM-DD')))).size;
                
        return completedDays;
    }

    const completedDays = getCompletedDays() ;
    const progress = weeklyGoal === 0 ? 0 : getCompletedDays() / weeklyGoal;

    return (
        <div>
            <div className="flex items-center justify-between mb-4 ">
                <h2 className="text-lg text-stone-800 dark:text-stone-200 ">Weekly Goal</h2>
                <IoSettingsOutline className="dark:text-white" />
            </div>
            <div>
                <div>
                    <p className="text-xl text-stone-800 dark:text-stone-200">
                        {completedDays} / {weeklyGoal} <span className="text-sm text-stone-400 dark:text-stone-500">active days this week</span>
                    </p>
                    <div className="w-full h-3 mt-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                        <div className="h-full bg-brand transition-all duration-300"
                            style={{ width: `${progress * 100}%` }} />
                    </div>
                    <p className="text-sm mt-2">
                        {(weeklyGoal - completedDays) === 0
                        ? (<span className = "text-green-500 flex gap-1"><SiTicktick className="mt-1" />Goal reached! Great Work!</span>)
                        :(<span>{weeklyGoal-completedDays} to reach your goal</span>)
                        }</p>
                </div>
            </div>
        </div>
    );
}

export default GoalDisplay;