import { useState } from "react";
import { exercises as availableExercises } from "../data/exercises";
import CustomExerciseForm from "./CustomExerciseForm";

function AddWorkoutModal({isOpen, onClose, onSave, onSaveCustomExercise, customExercises}) {
    const [date, setDate] = useState(
        new Date().toISOString().slice(0,16) // format for datetime-local input
    );

    const [exercises, setExercises] = useState([]);
    const [targetExercise, setTargetExercise] = useState("");

    const [showCustomForm, setShowCustomForm] = useState(null);
    
    const toggleExercise = (ex) => {
        const isSelected = exercises.some(e => e.exerciseId === ex.id);
        if(isSelected){
            setExercises(prev => prev.filter(e => e.exerciseId !== ex.id));
        }
        else{
            setExercises(prev=>[...prev, 
                {exerciseId: ex.id, exerciseName:ex.name, muscles:ex.muscles, sets: 1, reps: 1}] );
        }
    }

    const updateExercise = (exId, field, value) => {
        setExercises(prev => prev.map(e =>
            e.exerciseId === exId
            ?   {...e, [field]: value}
            : e
        ))
    }

    const handleSave = () => {
        if(exercises.length === 0) return


        const invalid = exercises.some(e=> e.sets<1 || e.reps<1 || !e.sets|| !e.reps);
        if(invalid) {
            alert("Please enter valid sets and reps for all exercises.");
            return
        }
        const workout = {
            id: Date.now().toString(),
            date: date,
            liked: false,
            exercises: exercises
        }
        onSave(workout);
        setExercises([]);
        setTargetExercise("");
        onClose();
    }

    

    const allExercises = [...availableExercises, ...customExercises];



    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 ">
            <div className="bg-white dark:bg-stone-800 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-4 px-6 py-4 border-b border-stone-100 dark:border-stone-700">
                    <h1 className="text-lg font-medium text-stone-800 dark:text-stone-100 ">Add Workout</h1>
                    <button onClick={onClose}
                        className = "text-stone-800 hover:text-stone-600 dark:hover:text-stone-200 text-xl transition-colors hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg w-8 h-8 flex items-center justify-center"
                    >✕</button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                {/*Select date and time */}
                <div className="flex flex-col gap-1.5 mb-4">
                    <label className = "text-sm text-stone-500 dark:text-stone-400">Date & Time</label>
                    <input type="datetime-local" value={date} onChange={(e)=>setDate(e.target.value)}
                    className="w-full border border-stone-200 dark:border-stone-600 rounded-lg px-3 py-2 bg-stone-50 dark:bg-stone-700 text-stone-800 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                    ></input>
                </div>

                <div className="flex gap-3 mb-4">
                    <button className="border border-stone-200 dark:border-stone-600 rounded-lg px-3 py-2 bg-stone-50 dark:bg-stone-700 text-stone-800 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-colors placeholder:text-stone-400">
                        Templates
                    </button>
                    <button className="border border-stone-200 dark:border-stone-600 rounded-lg px-3 py-2 bg-stone-50 dark:bg-stone-700 text-stone-800 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-colors placeholder:text-stone-400"
                        onClick={()=>setShowCustomForm(prev=>!prev)}>
                        Custom Workout
                    </button>
                </div>

                {showCustomForm && <CustomExerciseForm  onSave={onSaveCustomExercise} onCloseForm={()=>setShowCustomForm(false)}/>}

                
            
                {/*Select exercises */}
                <div className="flex flex-col gap-1.5 mb-4">
                    <label className = "text-sm text-stone-500 dark:text-stone-400">Select Exercises</label>
                    <input type="text" placeholder="e.g., pull-ups, lunges..." onChange={(e)=>setTargetExercise(e.target.value)} value={targetExercise}
                    className="w-full border border-stone-200 dark:border-stone-600 rounded-lg px-3 py-2 bg-stone-50 dark:bg-stone-700 text-stone-800 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-colors placeholder:text-stone-400"
                    ></input>
                </div>

            {/*Available exercises */}
                <div className="flex flex-col gap-1.5">
                    <label className = "text-sm text-stone-500 dark:text-stone-400">Available Exercises</label>
                    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto px-3 py-2 border border-stone-200 dark:border-stone-600 rounded-lg  dark:text-stone-100">
                        {allExercises
                            .filter(ex => ex.name.toLowerCase().includes(targetExercise.toLowerCase()))
                            .map(ex => {
                                const selected = exercises.find(e => e.exerciseId === ex.id)
                                const isSelected = !!selected

                                return (
                                <div key={ex.id} className="flex flex-col gap-1 rounded-lg">
                                    <div  
                                    className="flex items-center gap-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg cursor-pointer px-2 py-1 transition-colors"
                                    
                                    >
                                        <input type="checkbox" name={ex.name} 
                                        checked={isSelected} 
                                        onChange={()=>toggleExercise(ex)}
                                        className="accent-brand w-4 h-4"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-stone-700 dark:text-stone-200">{ex.name}</p>
                                            <p className="text-xs text-stone-400 dark:text-stone-500">{ex.muscles.join(", ")}</p>
                                        </div>
                                    </div>

                                    {isSelected && (
                                        <div className="flex  rounded-lg px-3 py-2 gap-4 border border-stone-200 dark:border-stone-600">
                                            <div className="flex-1 flex flex-col gap-1">
                                                <label className="text-xs text-stone-400">Sets</label>
                                                <input type="number" min="1" name="sets" placeholder="Sets" value={selected.sets} onChange={(e)=>updateExercise(ex.id, "sets", parseInt(e.target.value))}
                                                className="w-full px-2 py-1.5 rounded-lg border border-stone-200 dark:border-stone-600 bg-stone-100 dark:bg-stone-700 text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand"
                                                ></input>
                                            </div>
                                            <div className="flex-1 flex flex-col gap-1">
                                                <label className="text-xs text-stone-400">Reps</label>
                                                <input type="number" min="1" name="reps" placeholder="Reps" value={selected.reps} onChange={(e)=>updateExercise(ex.id, "reps", parseInt(e.target.value))}
                                                    className="w-full px-2 py-1.5 rounded-lg border border-stone-200 dark:border-stone-600 bg-stone-100 dark:bg-stone-700 text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand"
                                                ></input>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                )})}
                    </div>
                </div>

                </div>
                {/* Footer */}
                <div className="flex items-center justify-end gap-4 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 rounded-lg border border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 text-sm hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={exercises.length === 0}
                        className="flex-1 px-4 py-2 rounded-lg bg-brand text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
                        Save Workout
                    </button>
                </div>
            </div>
    
        </div>

    );
}

export default AddWorkoutModal;