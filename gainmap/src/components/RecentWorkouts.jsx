


function RecentWorkouts({ workouts = [] }){
    const sortedWorkouts = [...workouts].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,5);

    return (
        <div >
            <h2 className="text-lg text-stone-800 dark:text-stone-200 mb-4">Recent Workouts</h2>

            {sortedWorkouts.map(workout =>(
                        <div key={workout.id} className=" p-4 rounded-lg hover:bg-stone-100 hover:border-stone-300 dark:hover:bg-stone-700 dark:hover:border-stone-600 transition-colors">
                            <p className="text-sm text-stone-500 dark:text-stone-400 mb-2">{new Date(workout.date).toLocaleDateString()}</p>
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
            {workouts.length === 0 && (
                <p className="text-stone-400 dark:text-stone-500">No workouts yet. 
                </p>
            )}
        </div>
    );
}

export default RecentWorkouts;