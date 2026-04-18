import {useState, useEffect } from "react"
import Navbar from "./components/Navbar"
import BodyMap from "./components/BodyMap"
import AddWorkoutModal from "./components/AddWorkoutModal"
import RecentWorkouts from "./components/RecentWorkouts"
import { Toaster } from "react-hot-toast";
import ActivityCalendar from "./components/ActivityCalendar";
import GoalDisplay from "./components/GoalDisplay"
import GoalSettingsModal from "./components/GoalSettingsModal";
import WorkoutModal from "./components/WorkoutModal"




function App() {

  const [darkMode, setDarkMode] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);


  const [workouts, setWorkouts] = useState(()=>{
    const saved = localStorage.getItem("workouts");
    const parsed = JSON.parse(saved);
    return parsed || [];
  })

  const [weeklyGoal, setWeeklyGoal] = useState(()=>{
    const saved = localStorage.getItem("weeklyGoal");
    const parsed = JSON.parse(saved);
    return parsed || 3;
  })

  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }, [workouts])

  useEffect (() => {
    localStorage.setItem("weeklyGoal", JSON.stringify(weeklyGoal));
  }, [weeklyGoal])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])


  const addWorkout = (workout) => {
    setWorkouts(prev => [...prev, workout]);
    console.log(workouts);
  }

  const deleteWorkout = (id) => {
    setWorkouts(prev=> prev.filter(w=> w.id !== id));
  }

  const toggleLike = (id) => {
    setWorkouts(prev => prev.map(w =>
      w.id === id ? {...w, liked: !w.liked} : w
    )
  );
  }

  const updateWeeklyGoal = (newGoal) => {
    setWeeklyGoal(newGoal);
    console.log("Updated weekly goal:", newGoal);
  }

  return (
    <>
    <Toaster/>
    <div className="font-sans min-h-screen bg-stone-50 dark:bg-stone-900 transition-colors duration-300">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="max-w-full mx-auto px-6  grid lg:grid-cols-2 gap-6">

        {/* left side-body map */} 
        <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-6">
          <BodyMap workouts={workouts} />
        </div>

        {/* right side - stats*/}
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4">
            <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-6 flex-1">
              <GoalDisplay weeklyGoal={weeklyGoal} workouts={workouts} onOpenSettings={()=>setIsGoalModalOpen(true)}/>
            </div>
            <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-6 flex-1">
              <ActivityCalendar workouts={workouts} />
            </div>
          </div>
          <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-6">
            <RecentWorkouts workouts={workouts} onDelete={deleteWorkout} toggleLike={toggleLike} 
              onSelectingWorkout={(workout)=>{setSelectedWorkout(workout); setIsWorkoutModalOpen(true)}}/>
          </div>

          <button onClick={() => setIsModalOpen(true)}
            className = "mt-auto px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors">
            Add Workout
          </button>
        </div>

      </main>

      {/* Add Workout Modal */}
      <AddWorkoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addWorkout}
      />

      <button onClick={()=>{
        localStorage.clear(); 
        setWorkouts([])}}> 
        Clear local storage</button>

      <GoalSettingsModal 
        isModalOpen={isGoalModalOpen} 
        onClose={()=>setIsGoalModalOpen(false)} 
        onSave={updateWeeklyGoal} 
        weeklyGoal={weeklyGoal}
      />

      <WorkoutModal 
      workout = {selectedWorkout}
      isOpen = {isWorkoutModalOpen}
      onClose = {()=> setIsWorkoutModalOpen(false)}
      />

    </div>
    </>
  )
}

export default App