import { FiHeart, FiTrash2 } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import {useState} from "react";

import { useRef } from "react";


function RecentWorkouts({ workouts = [], onDelete, toggleLike, onSelectingWorkout }){
    const sortedWorkouts = [...workouts].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,5);

    const [visibleCount, setVisibleCount] = useState(2);

    let visibleWorkouts = sortedWorkouts.slice(0, visibleCount);

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
        setVisibleCount(prev => prev + 1);

        setTimeout(() => {
            lastItemRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    }
    return (
        <div >
            <h2 className="text-lg text-stone-800 dark:text-stone-200 mb-4">Recent Workouts</h2>

            {visibleWorkouts.map((workout,index) =>(
                        <div key={workout.id} ref={index === visibleWorkouts.length - 1 ? lastItemRef : null}
                        onClick={()=>onSelectingWorkout(workout)}
                        className=" p-4 rounded-lg hover:bg-stone-100 hover:border-stone-300 dark:hover:bg-stone-700 dark:hover:border-stone-600 transition-colors cursor-pointer">
                           <div className="flex">
                                <p className="text-sm text-stone-500 dark:text-stone-400 mb-2">{new Date(workout.date).toLocaleDateString()}</p>
                                <div className="ml-auto flex gap-2">
                                    <button className="rounded-lg hover:bg-stone-200 dark:hover:bg-stone-600 p-2 transition-colors"
                                        onClick = {(e)=>{e.stopPropagation(); handleLike(workout)}}>
                                        {workout.liked ? (
                                            <FaHeart className="text-red-500"/> ): (
                                            <FiHeart className="text-stone-500"/>
                                        )}
                                    </button>
                                    <button className="p-2 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-600 transition"
                                        onClick = {(e)=> {e.stopPropagation(); handleDelete(workout.id)}}>
                                        <FiTrash2 className="text-stone-500 hover:text-red-500" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-row gap-2">
                                {workout.exercises.map(ex => (
                                    <div key={ex.exerciseId} className="mb-2 p-2 rounded-lg  bg-stone-100 dark:bg-stone-700">
                                        <p className="text-sm text-stone-800 dark:text-stone-200">{ex.exerciseName}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                }

            
                <div className="flex justify-center">
                {visibleCount < workouts.length && (
                    <button
                        onClick={handleShowMore}
                        className="mt-4 rounded-lg px-4 py-2 hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors"
                    >Show more
                    </button>
                )}

                {visibleCount >= workouts.length && (
                    <button
                        onClick={() => setVisibleCount(2)}
                        className="mt-4 rounded-lg px-4 py-2 hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors"
                    >Show less  
                    </button>
                )}

                </div>
            
            {workouts.length === 0 && (
                <p className="text-stone-400 dark:text-stone-500">No workouts yet. 
                </p>
            )}
        </div>
    );
}

export default RecentWorkouts;