import { IoMdCheckmark } from "react-icons/io";
import {useState } from "react"

function GoalSettingsModal ({ isModalOpen, onClose, onSave, weeklyGoal}){

    if (!isModalOpen) return null;

    const [goal, setGoal] = useState(String(weeklyGoal));
   
    const buildExampleWeek = (goal) => {
        const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
        return days.map((day, index) => ({
            day, 
            active: index < goal
        }));
    }

    const exampleWeekData = buildExampleWeek(goal)

    return (
        <div>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="bg-white dark:bg-stone-800 rounded-2xl w-full max-w-lg p-6">
                    <div className="flex items-center justify-between mb-4 px-6 py-4 border-b border-stone-100 dark:border-stone-700">
                        <h1 className="text-lg font-medium text-stone-800 dark:text-stone-100 ">Weekly Goal</h1>
                        <button onClick={onClose}
                            className = "text-stone-800 hover:text-stone-600 dark:hover:text-stone-200 text-xl transition-colors hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg w-8 h-8 flex items-center justify-center"
                        >✕</button>
                    </div>

                    <p className="text-sm text-stone-400 dark:text-stone-500 pt-2 pb-4">Set your weekly workout goal. Your streak will track consecutive weeks where you hit this goal. Rest days won't break your streak!</p>

                    <div className="flex flex-col gap-1.5 mb-4">
                        <label className = "text-sm text-stone-900 dark:text-stone-400">Workouts per week</label>
                        <input type="number" min="1" max="7" value={goal} onChange={(e)=>setGoal(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-stone-200 dark:border-stone-600 bg-stone-100 dark:bg-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand" ></input>
                        <p className="text-sm text-stone-400 dark:text-stone-500">Recommended: 3-5 workouts per week with rest days</p>

                    </div>


                    {/*example week*/}
                    <div className="p-2 border border-stone-200 dark:border-stone-700 rounded-lg">
                        <p className="text-sm text-stone-900 dark:text-stone-400 pb-3"> Example week:</p>
                        <div className="flex flex-row gap-3 mt-2 justify-center">
                            {exampleWeekData.map(({day, active})=>(
                                <div key={day} className="flex flex-col items-center justify-center" >
                                        <div className="w-10 h-10 flex items-center justify-center">
                                            {active 
                                            ?   (<div className="w-full h-full bg-brand rounded-lg flex items-center justify-center"><IoMdCheckmark className="text-white "/></div>)
                                            : (<div className="w-full h-full bg-stone-200 dark:bg-stone-700 rounded-lg flex items-center justify-center ">-</div>)}
                                        </div>
                                    <p className="text-xs text-stone-500">{day}</p>
                                </div>

                            ))}
                        </div>
                        <p className="pt-4 text-center text-sm text-stone-400 dark:text-stone-500">{goal} workout day/days, {7-goal} rest day/days</p>

                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-4 mt-6">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-lg border border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 text-sm hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={()=>{
                                const num = Math.max(1, Math.min(7, parseInt(goal) || 1))
                                onSave(num);
                                onClose();
                            }}
                            className="flex-1 px-4 py-2 rounded-lg bg-brand text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
                            Save Goal
                        </button>
                    </div>
                
                </div>
            </div>

            
        </div>
    );
}

export default GoalSettingsModal;