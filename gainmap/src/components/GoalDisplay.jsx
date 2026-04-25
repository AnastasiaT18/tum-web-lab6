import { IoSettingsOutline } from "react-icons/io5";
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
import { SiTicktick } from "react-icons/si";




function GoalDisplay({weeklyGoal = 0, workouts= [], onOpenSettings}) {

    function getCompletedDays(){
        let completedDays = 0;
        const today = dayjs();
        // Convert Sunday=0 to Monday=0 week start
        const weekdayIndex = (today.day()+6)%7;  
        let startOfWeek = today.subtract(weekdayIndex, 'day');
        let endOfWeek = today.add(6-weekdayIndex, 'day');    
        const workoutsThisWeek = workouts.filter(w=>(dayjs(w.date).isBetween(startOfWeek, endOfWeek, 'day', '[]')));

        completedDays = (new Set(workoutsThisWeek.map(w=>dayjs(w.date).format('YYYY-MM-DD')))).size;
                
        return completedDays;
    }

    const completedDays = getCompletedDays() ;
    const progress = weeklyGoal === 0 ? 0 : Math.min(1, completedDays / weeklyGoal);
    const done = completedDays >= weeklyGoal;


    return (
        <div>
            <div className="flex items-center justify-between mb-4 ">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-800 dark:text-stone-500">                    
                    Weekly Goal
                </h2>
                <button
                    onClick={onOpenSettings}
                    className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"                    >
                    <IoSettingsOutline className="w-4 h-4 text-stone-800 dark:text-white" />
                </button>
            </div>

                    <div className="flex items-end gap-1 mb-3">
                        <span className="text-4xl font-bold text-stone-900 dark:text-white leading-none">{completedDays}</span>
                        <span className="text-lg text-stone-400 dark:text-stone-500 mb-0.5">/ {weeklyGoal}</span>
                    </div>

                    <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden mb-3">
                        <div
                        className={`h-full rounded-full transition-all duration-500 ${done ? "bg-emerald-500" : "bg-brand"}`}
                        style={{ width: `${progress * 100}%` }}
                        />
                    </div>
                    
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                        {done
                        ? <span className="text-emerald-500 font-medium">✓ Goal reached this week!</span>
                        : <>{weeklyGoal - completedDays} more day{weeklyGoal - completedDays !== 1 ? "s" : ""} to hit your goal</>
                        }
                    </p>
                
        </div>
    );
}

export default GoalDisplay;