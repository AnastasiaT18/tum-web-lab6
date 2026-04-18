import dayjs from 'dayjs';
import WorkoutBodyMap from './WorkoutBodyMap';


function WorkoutModal ({workout, isOpen, onClose}) {

    if (!isOpen || !workout) return null;


    const date = dayjs(workout.date);


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white dark:bg-stone-800 rounded-2xl w-full  p-6">
                <div className="flex flex-row flex items-center justify-between mb-4 px-6 py-4 border-b border-stone-100 dark:border-stone-700">
                    <div className="flex flex-col gap-4">
                        <h2>Workout Details</h2>
                        <div className="flex flex-row">
                            <p>{date.format("dddd, MMMM D, YYYY")}</p>
                            <p>{date.format("hh:mm A")}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors">x</button>
                </div>

                <div className="flex flex-row">
                    <div>
                        <h2>Exercises</h2>
                        <div>
                            {workout.exercises.map(ex => (
                                <div key={ex.exerciseId} className="mb-2 p-2 rounded-lg  bg-stone-100 dark:bg-stone-700">
                                    <p className="text-sm text-stone-800 dark:text-stone-200">{ex.exerciseName}</p>
                                    <p className="text-sm text-stone-500 dark:text-stone-400">{ex.sets} sets • {ex.reps} reps • {ex.sets*ex.reps} total reps</p>
                                    <div>
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

                    <div>
                        <h2>Muscles Worked</h2>
                        <WorkoutBodyMap workout={workout}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WorkoutModal;