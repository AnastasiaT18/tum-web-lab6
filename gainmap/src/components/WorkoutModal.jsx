import dayjs from 'dayjs';
import WorkoutBodyMap from './WorkoutBodyMap';
import { CiCalendar } from "react-icons/ci";
import { CiClock1 } from "react-icons/ci";
import {useState} from "react"


function WorkoutModal ({workout, isOpen, onClose, gender, handleGenderChange}) {

    const [side, setSide] = useState("front")

    if (!isOpen || !workout) return null;


    const date = dayjs(workout.date);

    function exerciseVolume(ex) {
        return ex.repsPerSet.reduce((a, b) => a + b, 0);
      }

    const totalSets = workout.exercises.reduce((sum, ex)=>
        sum + ex.repsPerSet.length, 0);
    const totalVolume = workout.exercises.reduce((sum, ex) => sum + exerciseVolume(ex), 0);


    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">            
            <div className="bg-white dark:bg-stone-900 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-5xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-stone-200/60 dark:border-stone-800">               
                {/* HEADER */}
                <div className="flex items-start justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-stone-100 dark:border-stone-800">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-base font-semibold text-stone-900 dark:text-white">Workout Details</h2>                        
                            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400 dark:text-stone-500">
                                <div className="flex items-center gap-1">
                                    <CiCalendar size={13} /> 
                                    <p>{date.format("dddd, MMMM D, YYYY")}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <CiClock1 size={13} />
                                    <span>{date.format("h:mm A")}</span>
                                </div>
                            </div>
                    </div>
                    <button onClick={onClose} 
                        className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg w-8 h-8 flex items-center justify-center text-lg flex-shrink-0"
                        >✕</button>                
                </div>


                    {/* Stats bar */}
                    {/* <div className="flex border-b border-stone-100 dark:border-stone-800 divide-x divide-stone-100 dark:divide-stone-800">
                    {[
                        { label: "Exercises", value: workout.exercises.length },
                        { label: "Total Sets", value: totalSets },
                        { label: "Total Reps", value: totalVolume },
                    ].map(({ label, value }) => (
                        <div key={label} className="flex-1 py-3 text-center">
                        <p className="text-lg font-bold text-stone-900 dark:text-white">{value}</p>
                        <p className="text-xs text-stone-400">{label}</p>
                        </div>
                    ))}
                    </div> */}

                {/* CONTENT */}
                <div className="flex flex-col md:flex-row flex-1 overflow-y-auto">
                   
                    {/* Left — exercises */}
                    <div className="w-full md:w-1/2 p-5 sm:p-6">
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">Exercises</h3>
                        <div className="flex flex-col gap-2">
                        {workout.exercises.map(ex => {
                            const usesPerSet = Array.isArray(ex.repsPerSet);
                            const sets = usesPerSet ? ex.repsPerSet.length : (ex.sets || 0);
                            const volume = exerciseVolume(ex);
            
                            return (
                            <div key={ex.exerciseId} className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700">
                                <div className="flex items-start justify-between mb-2">
                                <p className="text-sm font-semibold text-stone-900 dark:text-white">{ex.exerciseName}</p>
                                <span className="text-xs text-stone-400 font-medium ml-2 flex-shrink-0">
                                    {sets} sets · {volume} reps
                                </span>
                                </div>
            
                                {/* Per-set breakdown */}
                                {usesPerSet ? (
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                    {ex.repsPerSet.map((r, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <span className="text-[9px] text-stone-400 uppercase">S{i + 1}</span>
                                        <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded-lg px-2 py-1 min-w-[28px] text-center">
                                        {r}
                                        </span>
                                    </div>
                                    ))}
                                </div>
                                ) : (
                                <p className="text-xs text-stone-400 mb-2">{sets} × {ex.reps} reps</p>
                                )}
            
                                {/* Muscle tags */}
                                <div className="flex flex-wrap gap-1">
                                {ex.muscles.sort().map(m => (
                                    <span key={m} className="text-[10px] px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-600 text-stone-600 dark:text-stone-300">
                                    {m}
                                    </span>
                                ))}
                                </div>
                            </div>
                            );
                        })}
                        </div>
                    </div>

                    {/* RIGHT - BODY MAP */}
                    <div className="w-full md:w-1/2 p-5 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-400">Muscles Worked</h3>
                                <div className="flex">
                                    <button onClick={()=>handleGenderChange("female")}
                                        className={`px-3 rounded-l-lg text-sm font-medium border transition-colors
                                            ${gender === "female"
                                            ? "bg-brand text-white border-brand"
                                            : "border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"                    }`}
                                            >
                                            Female
                                    </button>

                                    <button onClick={()=>handleGenderChange("male")}
                                        className={`px-3 py-1.5 rounded-r-lg text-sm font-medium border transition-colors
                                            ${gender === "male"
                                            ? "bg-brand text-white border-brand"
                                            : "border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"                    }`}
                                            >
                                            Male
                                    </button>
                                </div>

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
                                        className={`px-3 py-1.5 rounded-r-lg text-sm font-medium border transition-colors
                                            ${side === "back"
                                            ? "bg-brand text-white border-brand"
                                            : "border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"                    }`}
                                            >
                                        Back
                                    </button>
                                </div>
                        </div>

                        <div className="flex justify-center ">
                            <WorkoutBodyMap side={side} workout={workout} gender={gender} />
                        </div>

                        <div className="mt-4 flex flex-wrap gap-3 text-xs text-stone-400 justify-center">
                            {[
                                { color: "bg-stone-200 dark:bg-stone-700", label: "Not worked" },
                                { color: "bg-yellow-400", label: "Light" },
                                { color: "bg-orange-400", label: "Moderate" },
                                { color: "bg-red-500", label: "Intense" },
                            ].map(({ color, label }) => (
                                <div key={label} className="flex items-center gap-1.5">
                                <div className={`w-2.5 h-2.5 rounded-sm ${color}`} />
                                <span>{label}</span>
                                </div>
                            ))}
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                );
}

export default WorkoutModal;