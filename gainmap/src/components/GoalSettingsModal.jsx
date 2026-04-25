import { IoMdCheckmark } from "react-icons/io";
import {useState } from "react"

function GoalSettingsModal ({ isModalOpen, onClose, onSave, weeklyGoal, onReset}){

    const [goal, setGoal] = useState(String(weeklyGoal));
   
    const buildExampleWeek = (goal) => {
        const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
        return days.map((day, index) => ({
            day, 
            active: index < goal
        }));
    }

    const exampleWeekData = buildExampleWeek(goal)

    if (!isModalOpen) return null;


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">                
            <div className="bg-white dark:bg-stone-900 rounded-2xl w-full max-w-md shadow-2xl border border-stone-200/60 dark:border-stone-800">                
                <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-stone-800">
                    <h1 className="text-base font-semibold text-stone-900 dark:text-white">Weekly Goal</h1>
                    <button onClick={onClose}
                        className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg w-8 h-8 flex items-center justify-center text-lg"                        
                    >✕</button>
                </div>

                <div className="px-6 py-5 flex flex-col gap-5">
                    <p className="text-sm text-stone-400 dark:text-stone-500">
                            Set your weekly workout goal. Your streak will track consecutive weeks where you hit this goal. Rest days won't break your streak!
                    </p>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-stone-400">Workouts per week</label>
                        <input type="number" min="1" max="7" value={goal} 
                            onChange={(e)=>setGoal(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand transition" >
                        </input>
                        <p className="text-xs text-stone-400">Recommended: 3–5 days with rest days in between</p>
                    </div>


                    {/*example week*/}
                    <div className="rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">Preview</p>
                            <div className="flex gap-2 justify-center">
                                {exampleWeekData.map(({day, active})=>(
                                    <div key={day} className="flex flex-col items-center gap-1" >
                                            <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all">
                                                {active 
                                                ? (<div className="flex w-full h-full rounded-xl justify-center items-center bg-brand text-white shadow-sm shadow-brand/30"><IoMdCheckmark size={14}/></div>)
                                                : (<div className="flex w-full h-full rounded-xl justify-center items-center bg-stone-200 dark:bg-stone-700 text-stone-400 text-xl">-</div>)}
                                            </div>
                                            <span className="text-[10px] text-stone-400">{day}</span>
                                    </div>
                                ))}
                        </div>

                        <p className="text-center text-xs text-stone-400 mt-3">
                            {goal} workout{parseInt(goal) !== 1 ? "s" : ""} · {7 - goal} rest day{7 - goal !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>



                    {/* Footer */}
                    <div className="flex flex-col gap-3 px-6 pb-5">

                        <div className="flex flex-row gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 text-sm hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
                                Cancel
                            </button>
                            <button
                                onClick={()=>{
                                    const num = Math.max(1, Math.min(7, parseInt(goal) || 1))
                                    onSave(num);
                                    onClose();
                                }}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-brand text-white text-sm font-medium hover:bg-brand-light transition-colors shadow-sm shadow-brand/30">
                                Save Goal
                            </button>
                        </div>
                        <div className="border-t border-stone-100 dark:border-stone-800 pt-4 mt-2">
                            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">Danger Zone</p>
                            <button
                                onClick={() => { if (window.confirm("Reset all data? This cannot be undone.")) { onReset(); onClose(); } }}
                                className="w-full px-4 py-2 rounded-xl border border-red-200 dark:border-red-900 text-red-500 text-sm hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                            >
                                Reset all data
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default GoalSettingsModal;