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
  const [gender, setGender] = useState("female")


  const [workouts, setWorkouts] = useState(()=>{
    try { return JSON.parse( localStorage.getItem("workouts")) || [];}
    catch {return [];}
  })

  const [weeklyGoal, setWeeklyGoal] = useState(()=>{
    try{return JSON.parse(localStorage.getItem("weeklyGoal")) || 3;
    }catch {return 3;}
  })

  const [customExercises, setCustomExercises] = useState(()=>{
    try{return JSON.parse(localStorage.getItem("customExercises")) || [];
    }catch{return [];}
  });

  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }, [workouts])

  useEffect (() => {
    localStorage.setItem("weeklyGoal", JSON.stringify(weeklyGoal));
  }, [weeklyGoal])

  useEffect(() => {
    localStorage.setItem("customExercises", JSON.stringify(customExercises));
  }, [customExercises])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])


  const addWorkout = (workout) => {
    setWorkouts(prev => [...prev, workout]);
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
  }

  const handleGenderChange = (gender) => {
    setGender(gender);
  }

  const addCustomExercise = (exercise) => {
    setCustomExercises(prev => [...prev, exercise]);
  }

  


  return (
    <>
    <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '10px',
            background: darkMode ? '#292524' : '#fff',
            color: darkMode ? '#e7e5e4' : '#1c1917',
            border: darkMode ? '1px solid #44403c' : '1px solid #e7e5e4',
            fontSize: '14px',
          },
        }}
      />
    <div className="font-sans min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="max-w-full mx-auto px-4 sm:px-6 pb-8 grid lg:grid-cols-2 gap-4 sm:gap-6">

        {/* Left - body map */} 
        <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200/60 dark:border-stone-800 p-5 sm:p-6 flex flex-col">
          <BodyMap workouts={workouts} gender = {gender} handleGenderChange={handleGenderChange} />
            
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-stone-500 dark:text-stone-400 justify-center">
              {[
                { color: "bg-stone-300 dark:bg-stone-600", label: "No activity (>7 days)" },
                { color: "bg-yellow-400", label: "3–7 days ago" },
                { color: "bg-orange-400", label: "1–3 days ago" },
                { color: "bg-red-500", label: "≤1 day ago" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-sm ${color}`} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

        {/* Right - stats*/}
        <div className="flex flex-col gap-4">
          <div className="flex flex-row sm:flex-row gap-4">
            <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200/60 dark:border-stone-800 p-5 sm:p-6 flex-1">              
              <GoalDisplay weeklyGoal={weeklyGoal} workouts={workouts} onOpenSettings={()=>setIsGoalModalOpen(true)}/>
            </div>
            <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200/60 dark:border-stone-800 p-5 sm:p-6 flex-1">
              <ActivityCalendar workouts={workouts} />
            </div>
          </div>

        <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200/60 dark:border-stone-800 p-5 sm:p-6">
          <RecentWorkouts workouts={workouts} onDelete={deleteWorkout} toggleLike={toggleLike} 
            onSelectingWorkout={(workout)=>{setSelectedWorkout(workout); setIsWorkoutModalOpen(true)}}/>
          </div>

          <button onClick={() => setIsModalOpen(true)}
            className="w-full px-4 py-3 bg-brand text-white rounded-xl font-medium text-sm hover:bg-brand-light active:scale-[0.98] transition-all shadow-sm shadow-brand/30">
            + Add Workout
          </button>
        </div>
      </main>

      {/* Add Workout Modal */}
      <AddWorkoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addWorkout}
        onSaveCustomExercise={addCustomExercise}
        customExercises = {customExercises}
        workouts = {workouts}
      />

      <GoalSettingsModal 
        isModalOpen={isGoalModalOpen} 
        onClose={()=>setIsGoalModalOpen(false)} 
        onSave={updateWeeklyGoal} 
        weeklyGoal={weeklyGoal}
        onReset = {()=>{localStorage.clear(); setWorkouts([]); setWeeklyGoal(3); setCustomExercises([]);}}
      />

      <WorkoutModal 
      workout = {selectedWorkout}
      isOpen = {isWorkoutModalOpen}
      gender = {gender}
      handleGenderChange={handleGenderChange}
      onClose = {()=> setIsWorkoutModalOpen(false)}
      />

    </div>
    </>
  )
}

export default App