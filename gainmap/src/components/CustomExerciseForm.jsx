import { exercises as availableExercises } from "../data/exercises";
import {useState} from "react";

function CustomExerciseForm ({ onSave, onCloseForm, allExercises }){

    const [customExerciseName, setCustomExerciseName] = useState("");
    const [customExerciseMuscles, setCustomExerciseMuscles] = useState([]);


    const getAllMuscles = () => {
        const muscleSet = new Set();
        availableExercises.forEach(ex => ex.muscles.forEach(m => muscleSet.add(m)));
        return Array.from(muscleSet);
    }

    const toggleMuscle = (muscle) =>{
        const muscleIsSelected = customExerciseMuscles.includes(muscle);

        if(muscleIsSelected){
            setCustomExerciseMuscles(prev => prev.filter(m => m !== muscle));
        }
        else{
            setCustomExerciseMuscles(prev => [...prev, muscle]);
        }
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
            <div className="w-full border bg-stone-50 dark:bg-stone-700 border-stone-200 dark:border-stone-600 rounded-lg px-3 py-2 mb-4">
                <div>
                    <label className = "text-sm text-stone-500 dark:text-stone-400">Exercise Name</label>
                    <input type="text" placeholder="e.g., Handstand, Pilates ..." onChange={(e)=>setCustomExerciseName(e.target.value)} value={customExerciseName}
                    className="w-full border border-stone-200 dark:border-stone-600 rounded-lg px-3 py-2 bg-stone-50 dark:bg-stone-700 text-stone-800 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-colors placeholder:text-stone-400"
                    ></input>
                </div>
                <div>
                    <label className = "text-sm text-stone-500 dark:text-stone-400">Muscles</label>
                    <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                    {allMuscles.map(muscle => {
                        const muscleIsSelected = !!customExerciseMuscles.find(m => m === muscle)
                        
                        return (
                            <div key={muscle} className="flex items-center gap-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg cursor-pointer px-2 py-1 transition-colors">
                                <button
                                    key={muscle}
                                    type="button"
                                    onClick={() => toggleMuscle(muscle)}
                                    className={`
                                        px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                                        ${muscleIsSelected
                                        ? "bg-brand text-white border-brand scale-105"
                                        : "bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 border-stone-300 dark:border-stone-600 hover:bg-stone-200 dark:hover:bg-stone-600"}
                                    `}
                                    >
                                    {muscle}
                                    </button>
                            </div>
                        )
                    }
                    )}
                    </div>
                </div>

                <button
                    onClick={handleSaveCustomExercise}
                    className="mt-3 px-3 py-2 bg-brand text-white text-sm rounded-lg hover:opacity-90 transition"
                    >
                    Save Custom Exercise
                    </button>


            </div>
    );
    }
 

export default CustomExerciseForm;