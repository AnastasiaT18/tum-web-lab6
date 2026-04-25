import { FiHeart, FiTrash2, FiFilter } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import {useState} from "react";
import { useRef } from "react";
import dayjs from "dayjs";
import { exercises as availableExercises } from "../data/exercises";


export function getAllMuscles(){
    const muscleSet = new Set();
    availableExercises.forEach(ex => ex.muscles.forEach(m => muscleSet.add(m)));
    return Array.from(muscleSet).sort();
}


function RecentWorkouts({ workouts = [], onDelete, toggleLike, onSelectingWorkout }){
    
    const sortedWorkouts = [...workouts].sort((a,b) => new Date(b.date) - new Date(a.date));
    const [visibleCount, setVisibleCount] = useState(3);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filter, setFilter] = useState("all");
    const lastItemRef = useRef(null);



    const handleDelete = (id) => {
        if(window.confirm("Are you sure you want to delete this workout?")){
            onDelete(id);
            toast.success("Workout deleted");
        }
    }

    const handleLike = (workout) => {
        toggleLike(workout.id);
        toast(workout.liked ? "Workout unliked 👎" : "Workout liked ❤️");
    }

    const handleShowMore = () => {
        setVisibleCount(prev => prev + 3);

        setTimeout(() => {
            lastItemRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    }

    const handleFiltering = (option) => {
        setFilter(option);
    }

    
    const getFilteredWorkouts = () => {
        switch(filter){
            case "liked":
                return sortedWorkouts.filter(w => w.liked);
            case "all":
                return sortedWorkouts;
            default:
                return sortedWorkouts.filter(w => w.exercises.some(ex => ex.muscles.includes(filter)));
        }

    }

    const filteredWorkouts = getFilteredWorkouts();
    const visibleWorkouts = filteredWorkouts.slice(0, visibleCount);
    const allMuscles = getAllMuscles();

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-800 dark:text-stone-500">
                    Recent Workouts
                </h2>                
            
                <button 
                    onClick={()=>setIsFilterOpen(prev => !prev)}
                    className={`p-1.5 rounded-lg transition-colors ${isFilterOpen ? "bg-brand text-white" : "hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400"}`}
                    >
                    <FiFilter size={14} />
                </button>
            </div>

            {isFilterOpen && (
                <div className="mb-4 p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-100 dark:border-stone-700">
                    <div className="flex flex-wrap gap-2 mb-2">
                        <button
                            onClick = {()=>handleFiltering("all")}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-2xl text-xs font-medium transition-all border
                                ${filter === "all"
                                    ? "bg-brand text-white border-brand shadow-sm shadow-brand/20"
                                    : "bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600"}
                            `}
                        >All</button>

                        <button onClick = {()=>handleFiltering("liked")}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-2xl text-xs font-medium transition-all border
                                ${filter === "liked"
                                    ? "bg-brand text-white border-brand shadow-sm shadow-brand/20"
                                    : "bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600"}
                            `}>
                        <FiHeart size={10}/>Liked </button>
                    </div>

                    <p className="text-[10px] uppercase font-semibold tracking-wider text-stone-400 mb-2">By muscle</p>
                    
                    <div className="flex flex-wrap gap-1.5">
                        {allMuscles.map(muscle=>(
                            <button key={muscle} 
                            onClick = {()=>handleFiltering(muscle)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-2xl text-xs font-medium transition-all border
                                ${filter === muscle
                                    ? "bg-brand text-white border-brand shadow-sm shadow-brand/20"
                                    : "bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600"}
                            `}>
                                {muscle}
                            </button>
                        ))}
                    </div>
                </div>
            )}


        <div className="flex flex-col divide-y divide-stone-100 dark:divide-stone-800">
            {visibleWorkouts.map((workout,index) =>(
                        <div key={workout.id} 
                            ref={index === visibleWorkouts.length - 1 ? lastItemRef : null}
                            onClick={()=>onSelectingWorkout(workout)}
                            className="hover:bg-stone-50 dark:hover:bg-stone-800/50 rounded-xl p-3 -mx-2 transition-colors cursor-pointer group mb-2" >
                           
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="text-sm font-medium text-stone-800 dark:text-stone-200">                                
                                        {dayjs(workout.date).format("ddd, D MMM YYYY")}
                                    </p>
                                    <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                                        {dayjs(workout.date).format("h:mm A")} · {workout.exercises.length} exercise{workout.exercises.length !== 1 ? "s" : ""}
                                    </p>
                                </div>

                                <div className="flex gap-1">
                                    <button className="p-3 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                                        onClick = {(e)=>{e.stopPropagation(); handleLike(workout)}}>
                                        {workout.liked ? (
                                            <FaHeart className="text-red-500" size={13}/> ): (
                                            <FiHeart className="text-stone-400" size={13}/>
                                        )}
                                    </button>

                                    <button className="p-1.5 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                                        onClick = {(e)=> {e.stopPropagation(); handleDelete(workout.id)}}>
                                        <FiTrash2 className="text-stone-400 hover:text-red-500 transition-colors" size={13} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                                {workout.exercises.map(ex => (
                                    <span 
                                        key={ex.exerciseId} 
                                        className="text-xs px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200/60 dark:border-stone-700">
                                            {ex.exerciseName} 
                                            <span className="text-stone-400 dark:text-stone-500 ml-1">
                                                · {Array.isArray(ex.repsPerSet)
                                                ? `${ex.repsPerSet.length} sets`
                                                : `${ex.sets}×${ex.reps}`
                                                }
                                            </span> 
                                    </span>
                                ))}
                            </div>
                        </div>
                ))}
                </div>


                {(filteredWorkouts.length > visibleCount || visibleCount > 3) && (
                    <div className="flex justify-center  mt-3 gap-2">
                        {visibleCount < filteredWorkouts.length && (
                            <button
                                onClick={handleShowMore}
                                className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 px-4 py-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                            >Show more
                            </button>
                        )}

                        {visibleCount > 3 && (
                            <button
                            onClick={() => setVisibleCount(3)}
                            className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 px-4 py-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                            >
                            Show less
                            </button>
                        )}
                    </div>
                )}
            
            
            {workouts.length === 0 && (
                <div className="py-10 text-center">
                    <p className="text-stone-300 dark:text-stone-600 text-sm">No workouts yet — add your first one!</p>
                </div>
            )}
        </div>
    );
}

export default RecentWorkouts;