import dayjs from 'dayjs';
import WorkoutBodyMap from './WorkoutBodyMap';
import { CiCalendar } from "react-icons/ci";
import { CiClock1 } from "react-icons/ci";
import {useState} from "react"


function WorkoutModal ({workout, isOpen, onClose}) {

    const [side, setSide] = useState("front")

    if (!isOpen || !workout) return null;


    const date = dayjs(workout.date);


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white dark:bg-stone-800 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
               
                {/* HEADER */}
                <div className="flex items-start justify-between px-6 py-5 border-b border-stone-200 dark:border-stone-700">
                    
                    <div className="flex flex-col gap-2">
                        <h2 className="text-xl text-stone-900 dark:text-white">Workout Details</h2>
                        <div className="flex items-center gap-5 text-sm text-stone-500 dark:text-stone-300">
                            <div className="flex items-center gap-1">
                                <CiCalendar /> 
                                <p>{date.format("dddd, MMMM D, YYYY")}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <CiClock1 />
                                <p>{date.format("hh:mm A")}</p>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} 
                            className = "text-stone-800 hover:text-stone-600 dark:hover:text-stone-200 text-xl transition-colors hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg w-8 h-8 flex items-center justify-center"
                        >✕</button>                
                </div>

                {/* CONTENT */}
                <div className="flex flex-col md:flex-row flex-1 overflow-y-auto">

                    {/* LEFT - EXERCISES */}
                    <div className="w-full md:w-1/2 p-6">
                        <h3 className="text-stone-900 dark:text-white mb-4">Exercises ({workout.exercises.length})</h3>
                        <div className="space-y-3">
                            {workout.exercises.map(ex => (
                                <div key={ex.exerciseId} 
                                    className="p-3 rounded-lg bg-stone-100 dark:bg-stone-700">
                                    <p className="text-sm text-stone-800 dark:text-stone-100">{ex.exerciseName}</p>
                                    <p className="text-xs text-stone-500 dark:text-stone-300 mt-1">{ex.sets} sets • {ex.reps} reps • {ex.sets*ex.reps} total reps</p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {ex.muscles.map(m => (
                                            <span key={m} className="inline-block bg-stone-200 dark:bg-stone-600 text-stone-800 dark:text-stone-200 text-xs px-2 py-1 rounded-full mr-2 mt-2">
                                                {m}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                    </div>

                    {/* RIGHT - BODY MAP */}
                    <div className="w-full md:w-1/2 px-6 py-2 border-l border-stone-200 dark:border-stone-700 flex flex-col">
                        
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-stone-900 dark:text-white mb-4 pt-4">
                                Muscles Worked
                            </h3>

                            {/* Front/Back Toggle*/}
                            <div className="flex ">
                                <button onClick={() => setSide("front")}
                                    className={`px-3 rounded-l-lg text-sm font-medium border transition-colors
                                        ${side === "front"
                                        ? "bg-brand text-white border-brand"
                                        : "border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"                    }`}
                                        >
                                    Front
                                </button>

                                <button onClick={() => setSide("back")}
                                    className={`px-4 py-1.5 rounded-r-lg text-sm font-medium border transition-colors
                                        ${side === "back"
                                        ? "bg-brand text-white border-brand"
                                        : "border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"                    }`}
                                        >
                                    Back
                                </button>
                            </div>

                        </div>

                        <div className="flex justify-center flex-col">
                            <WorkoutBodyMap side={side} workout={workout} />
                            <div className="mt-4 mb-4 flex flex-wrap flex-row gap-4 text-xs text-stone-500 dark:text-stone-300 justify-center">
  
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded bg-stone-300 dark:bg-stone-600" />
                                    <span>Not worked</span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded bg-yellow-400" />
                                    <span>Light (1)</span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded bg-orange-400" />
                                    <span>Moderate (2)</span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded bg-red-500" />
                                    <span>Intense (3)</span>
                                </div>

                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WorkoutModal;