import { FiHeart, FiTrash2 } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import {useState} from "react";

import { useRef } from "react";
import { CiFilter } from "react-icons/ci";

import { exercises as availableExercises } from "../data/exercises";



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
        setVisibleCount(prev => prev + 1);

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

    let filteredWorkouts = getFilteredWorkouts();
    let visibleWorkouts = filteredWorkouts.slice(0, visibleCount);

    const getAllMuscles = () => {
        const muscleSet = new Set();
        availableExercises.forEach(ex => ex.muscles.forEach(m => muscleSet.add(m)));
        return Array.from(muscleSet);
    }

    const allMuscles = getAllMuscles();

    return (
        <div >
            <div className="flex items-center justify-between">
                <h2 className="text-lg text-stone-800 dark:text-stone-200 mb-2">Recent Workouts</h2>
                <button className="rounded-lg hover:bg-stone-200 dark:hover:bg-stone-600 p-2 transition-colors"
                    onClick={()=>setIsFilterOpen(prev => !prev)}>
                    <CiFilter className="text-stone-500 "/>
                </button>
            </div>

            {isFilterOpen && (
                <div className="">
                    <div className="flex gap-4 mb-4">
                        <button
                            onClick = {()=>handleFiltering("all")}
                            className={`mb-2 p-2 rounded-full text-sm transition-colors
                                ${filter === "all"
                                    ? "bg-brand text-white"
                                    : "bg-stone-100 dark:bg-stone-700 dark:text-white"}
                            `}
                        >All</button>
                        <button onClick = {()=>handleFiltering("liked")}
                            className={`mb-2 p-2 rounded-full text-sm transition-colors flex items-center gap-1
                                ${filter === "liked"
                                    ? "bg-brand text-white"
                                    : "bg-stone-100 dark:bg-stone-700 dark:text-white"}
                            `}>
                        <FiHeart/>Liked </button>
                    </div>
                    <p className="text-sm mb-2">Filter by muscle:</p>
                    <div className="flex flex-wrap gap-1 mb-2 ">
                        {allMuscles.map(muscle=>(
                            <button key={muscle} 
                            onClick = {()=>handleFiltering(muscle)}
                            className={`mb-2 p-2 rounded-full text-sm transition-colors flex items-center gap-1
                                ${filter === muscle
                                    ? "bg-brand text-white"
                                    : "bg-stone-100 dark:bg-stone-700 dark:text-white"}
                            `}>
                                {muscle}
                            </button>
                        ))}
                    </div>
                </div>
            )}

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