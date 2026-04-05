import {useState, useEffect } from "react"
import Navbar from "./components/Navbar"
import BodyMap from "./components/BodyMap"
import AddWorkoutModal from "./components/AddWorkoutModal"

function App() {

  const [darkMode, setDarkMode] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [workouts, setWorkouts] = useState(()=>{
    const saved = localStorage.getItem("workouts");
    const parsed = JSON.parse(saved);
    return parsed || [];
  })

  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }, [workouts])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])


  const addWorkout = (workout) => {
    setWorkouts(prev => [...prev, workout]);
    console.log(workouts);

  }

  return (
    <div className="font-sans min-h-screen bg-stone-50 dark:bg-stone-900 transition-colors duration-300">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="max-w-full mx-auto px-6  grid lg:grid-cols-2 gap-6">

        {/* left side-body map */} 
        <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-6">
          <BodyMap workouts={[]} />
        </div>

        {/* right side - stats*/}
        <div className="flex flex-col gap-4">
          <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-6">
            <p className="text-stone-400 dark:text-stone-500">Streak coming soon...</p>
          </div>
          <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-6">
            <p className="text-stone-400 dark:text-stone-500">Activity calendar coming soon...</p>
          </div>
          <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-6">
            <p className="text-stone-400 dark:text-stone-500">Recent workouts coming soon...</p>
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

    </div>
  )
}

export default App