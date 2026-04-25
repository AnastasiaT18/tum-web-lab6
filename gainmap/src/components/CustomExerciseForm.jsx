import { exercises as availableExercises } from "../data/exercises";
import {useState} from "react";
import { getAllMuscles } from "./RecentWorkouts";

function CustomExerciseForm ({ onSave, onCloseForm, allExercises }){

    const [customExerciseName, setCustomExerciseName] = useState("");
    const [customExerciseMuscles, setCustomExerciseMuscles] = useState([]);


    // const getAllMuscles = () => {
    //     const muscleSet = new Set();
    //     availableExercises.forEach(ex => ex.muscles.forEach(m => muscleSet.add(m)));
    //     return Array.from(muscleSet);
    // }

    const toggleMuscle = (muscle) =>{
        setCustomExerciseMuscles(prev => 
            prev.includes(muscle) ? prev.filter(m => m !== muscle) : [...prev, muscle]
        );
    }

    const handleSaveCustomExercise = () => {
        if(!customExerciseName.trim()){
            alert("Please enter an exercise name.");
            return;
        }

        if (allExercises.some(ex => ex.name.toLowerCase() === customExerciseName.toLowerCase())) {
            alert("An exercise with this name already exists. Please choose a different name.");
            return;
        }

        if(customExerciseMuscles.length === 0){
            alert("Please select at least one muscle.");
            return;
        }

        const newCustomExercise = {
            id: "custom-" + customExerciseName.toLowerCase() + Date.now(),
            name: customExerciseName,
            muscles: customExerciseMuscles
        }

        onSave(newCustomExercise);
        setCustomExerciseName("");
        setCustomExerciseMuscles([]);
        onCloseForm();
    }

    const allMuscles = getAllMuscles(); 
    
    
    return (
        <div className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-4 flex flex-col gap-3">  
            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold tracking-wider uppercase  text-stone-400">Exercise Name</label>
                    <input type="text" 
                    placeholder="e.g., Handstand, Pilates ..." onChange={(e)=>setCustomExerciseName(e.target.value)} value={customExerciseName}
                    className="w-full border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand transition placeholder:text-stone-300 dark:placeholder:text-stone-600">  
                    </input>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Muscles
                </label>                    
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                    {allMuscles.map(muscle => (                       
                            <button
                                key={muscle}
                                type="button"
                                onClick={() => toggleMuscle(muscle)}
                                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all
                                    ${customExerciseMuscles.includes(muscle)
                                      ? "bg-brand text-white border-brand shadow-sm shadow-brand/20"
                                      : "bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-300"
                                    }`}
                                >
                                    {muscle}
                            </button>
                        ))}
                </div>
            </div>

            <div className="flex gap-2">
                <button
                onClick = {onCloseForm}
                className="flex-1 px-3 py-2 rounded-xl text-sm border border-stone-200 dark:border-stone-700 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">
                    Cancel
                </button>  

                <button
                    onClick={handleSaveCustomExercise}
                    className="flex-1 px-3 py-2 bg-brand text-white text-sm rounded-xl hover:bg-brand-light transition font-medium"
                    >
                    Save Custom Exercise
                </button>
            </div>
        </div>
    );
    }
 

export default CustomExerciseForm;