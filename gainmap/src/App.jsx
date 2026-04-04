import {useState, useEffect } from "react"
import Navbar from "./components/Navbar"
import BodyMap from "./components/BodyMap"

function App() {

  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

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
        </div>

      </main>
    </div>
  )
}

export default App