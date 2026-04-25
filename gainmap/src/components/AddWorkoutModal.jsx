import { useState } from "react";
import { exercises as availableExercises } from "../data/exercises";
import CustomExerciseForm from "./CustomExerciseForm";
import dayjs from "dayjs";

function AddWorkoutModal({isOpen, onClose, onSave, onSaveCustomExercise, customExercises, workouts}) {
    
    const [date, setDate] = useState(
        new Date().toISOString().slice(0,16) // format for datetime-local input
    );
    const [exercises, setExercises] = useState([]);
    const [targetExercise, setTargetExercise] = useState("");
    const [showCustomForm, setShowCustomForm] = useState(null);
    const [showTemplates, setShowTemplates] = useState(false);

    const allExercises = [...availableExercises, ...customExercises];
    const sortedWorkouts = [...workouts].sort((a,b)=> new Date(b.date) - new Date(a.date));
    const recentWorkouts = sortedWorkouts.slice(0,3);
    
    const toggleExercise = (ex) => {
        const isSelected = exercises.some(e => e.exerciseId === ex.id);
        if(isSelected){
            setExercises(prev => prev.filter(e => e.exerciseId !== ex.id));
        }
        else{
            setExercises(prev=>[...prev, 
                {exerciseId: ex.id, 
                exerciseName:ex.name, 
                muscles:ex.muscles, 
                repsPerSet: [10, 10, 10],
            }] );
        }
    }

    const updateSets = (exId, newSetCount) => {
        const count = Math.max(1, Math.min(20, newSetCount || 1));
        setExercises(prev => prev.map(e => {
          if (e.exerciseId !== exId) return e;
          const current = e.repsPerSet;
          if (count > current.length) {
            const last = current[current.length - 1] || 10;
            return { ...e, repsPerSet: [...current, ...Array(count - current.length).fill(last)] };
          }
          return { ...e, repsPerSet: current.slice(0, count) };
        }));
      }

    const updateRepsForSet = (exId, setIndex, value) => {
        const reps = Math.max(1, parseInt(value) || 1);
        setExercises(prev => prev.map(e => {
          if (e.exerciseId !== exId) return e;
          const newReps = [...e.repsPerSet];
          newReps[setIndex] = reps;
          return { ...e, repsPerSet: newReps };
        }));
      }


    const fillAllSets = (exId, value) => {
        const reps = Math.max(1, parseInt(value) || 1);
        setExercises(prev => prev.map(e => {
            if (e.exerciseId !== exId) return e;
            return {...e, repsPerSet:e.repsPerSet.map(()=> reps) }
        }))
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

        const invalid = exercises.some(e => !e.repsPerSet || e.repsPerSet.length === 0 || e.repsPerSet.some(r => r < 1));
        
        if(invalid) {
            alert("Please set valid reps for all sets.");
            return;
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

    const handleUseTemplate = (workout) => {
        const clonedExercises = workout.exercises.map(ex => ({
            exerciseId: ex.exerciseId,
            exerciseName: ex.exerciseName,
            muscles: ex.muscles,
            repsPerSet:[...ex.repsPerSet]
        }));
    
        setExercises(clonedExercises);
        setShowTemplates(false);

    }

    

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">            
            <div className="bg-white dark:bg-stone-900 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-xl max-h-[92vh] flex flex-col shadow-2xl border border-stone-200/60 dark:border-stone-800">
                
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 dark:border-stone-800">
                    <h1 className="text-base font-semibold text-stone-900 dark:text-white">
                        Add Workout
                    </h1>
                    <button onClick={onClose}
                        className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg w-8 h-8 flex items-center justify-center"
                    >✕</button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
                    
                {/*Select date and time */}
                <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-400">Date & Time</label>
                <input type="datetime-local" 
                    value={date} 
                    onChange={(e)=>setDate(e.target.value)}
                    className="w-full border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand transition"
                ></input>
                </div>

                {/* Templates / Custom buttons */}
                <div className="flex gap-2">
                    {[
                    { label: "Templates", active: showTemplates, toggle: () => { setShowTemplates(p => !p); setShowCustomForm(false); } },
                    { label: "Custom Exercise", active: showCustomForm, toggle: () => { setShowCustomForm(p => !p); setShowTemplates(false); } },
                    ].map(({ label, active, toggle }) => (
                    <button key={label} onClick={toggle}
                        className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium border transition-all
                        ${active
                            ? "bg-brand text-white border-brand shadow-sm"
                            : "border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
                        }`}
                    >{label}</button>
                    ))}
                </div>

                {/* Custom form */}
                {showCustomForm && 
                <CustomExerciseForm  onSave={onSaveCustomExercise} onCloseForm={()=>setShowCustomForm(false)} allExercises={allExercises}/>}

                {/* Templates */}
                {showTemplates && (
                    <div className="flex flex-col gap-2">
                        {recentWorkouts.length > 0 ? (
                            recentWorkouts.map(workout => (
                            <button
                                key={workout.id}
                                className="text-left border border-stone-200 dark:border-stone-700 rounded-xl p-4 hover:border-brand/50 hover:bg-stone-50 dark:hover:bg-stone-800 transition-all"
                                onClick={() => handleUseTemplate(workout)}
                            >

                                
                                <div className="flex items-start justify-between mb-2">
                                    <p className="text-sm font-medium text-stone-800 dark:text-stone-200">{dayjs(workout.date).format("D MMM YYYY")}</p>
                                    <span className="text-xs text-stone-400">{workout.exercises.length} exercises</span>
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                                    {workout.exercises.map(ex => (
                                        <span key={ex.exerciseId}
                                        className="text-xs px-2 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500"
                                        >
                                        {ex.exerciseName} · {Array.isArray(ex.repsPerSet) ? `${ex.repsPerSet.length} sets` : `${ex.sets}×${ex.reps}`}
                                        </span>
                                    ))}
                                </div>

                                {/* CTA */}
                                <p className="mt-2 text-xs text-brand font-medium">Tap to use →</p>
                            </button>
                        ))) : (
                                <p className="text-sm text-stone-400 text-center py-4">No past workouts yet</p>                        )}
                   </div>
                )}
                
            
                {/*Select exercises */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-400">Search Exercises</label>
                    <input type="text" placeholder="e.g., pull-ups, lunges..." onChange={(e)=>setTargetExercise(e.target.value)} value={targetExercise}
                     className="w-full border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand transition placeholder:text-stone-300 dark:placeholder:text-stone-600"
                    ></input>
                </div>

                {/* Exercise list */}
                <div className="flex flex-col gap-1 max-h-64 overflow-y-auto rounded-xl border border-stone-200 dark:border-stone-700 divide-y divide-stone-100 dark:divide-stone-800">
                    {allExercises.sort((a,b)=> a.name.localeCompare(b.name))
                        .filter(ex => ex.name.toLowerCase().includes(targetExercise.toLowerCase()))
                        .map(ex => {
                            const selected = exercises.find(e => e.exerciseId === ex.id)
                            const isSelected = !!selected

                                return (
                                <div key={ex.id} className="flex flex-col">
                                    {/* Row */}
                                    <label className="flex items-center gap-3 px-3 py-2.5 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer transition-colors">
                                        <input type="checkbox" name={ex.name} 
                                        checked={isSelected} 
                                        onChange={()=>toggleExercise(ex)}
                                        className="accent-brand w-4 h-4 flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-stone-800 dark:text-stone-200 truncate">{ex.name}</p>
                                            <p className="text-xs text-stone-400 truncate">{ex.muscles.sort().join(", ")}</p>
                                        </div>

                                        {isSelected && (
                                            <span className="text-xs text-brand font-medium flex-shrink-0">
                                            {selected.repsPerSet.length} sets · {selected.repsPerSet.reduce((a, b) => a + b, 0)} reps
                                            </span>
                                        )}
                                    </label>
 
                    {/* Per-set editor */}
                    {isSelected && (
                      <div className="px-3 pb-3 bg-stone-50 dark:bg-stone-800/60 ">

                        {/* Set count control */}
                        <div className="flex items-center justify-between mb-2.5 pt-1">
                          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Sets</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateSets(ex.id, selected.repsPerSet.length - 1)}
                              className="w-6 h-6 rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 flex items-center justify-center text-sm font-bold hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
                            >−</button>
                            <span className="text-sm font-semibold text-stone-800 dark:text-stone-200 w-4 text-center">
                              {selected.repsPerSet.length}
                            </span>
                            <button
                              onClick={() => updateSets(ex.id, selected.repsPerSet.length + 1)}
                              className="w-6 h-6 rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 flex items-center justify-center text-sm font-bold hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
                            >+</button>
                          </div>
                        </div>
 
                        {/* Reps per set */}
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Reps per set</span>
                            {/* "Fill all" shortcut */}
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-stone-400">Fill all:</span>
                              <input
                                type="number" min="1"
                                placeholder="—"
                                onChange={(e) => e.target.value && fillAllSets(ex.id, e.target.value)}
                                className="w-12 px-1.5 py-1 rounded-lg border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-700 text-xs text-center focus:outline-none focus:ring-2 focus:ring-brand text-stone-800 dark:text-stone-200"
                              />
                            </div>
                          </div>
 
                          <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
                            {selected.repsPerSet.map((reps, i) => (
                              <div key={i} className="flex flex-col items-center gap-0.5">
                                <span className="text-[10px] text-stone-400">S{i + 1}</span>
                                <input
                                  type="number" min="1" value={reps}
                                  onChange={(e) => updateRepsForSet(ex.id, i, e.target.value)}
                                  className="w-full px-1 py-1.5 rounded-lg border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-700 text-sm text-center font-medium text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand transition"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
 
        </div>
                {/* Footer */}
                <div className="flex gap-3 px-5 py-4 border-t border-stone-100 dark:border-stone-800">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 text-sm hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={exercises.length === 0}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-brand text-white text-sm font-medium hover:bg-brand-light transition-colors shadow-sm shadow-brand/30 disabled:opacity-40 disabled:cursor-not-allowed">
                        Save Workout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddWorkoutModal;