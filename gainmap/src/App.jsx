import {useState, useEffect, useRef} from "react"
import Navbar from "./components/Navbar"
import BodyMap from "./components/BodyMap"
import AddWorkoutModal from "./components/AddWorkoutModal"
import RecentWorkouts from "./components/RecentWorkouts"
import { Toaster } from "react-hot-toast";
import ActivityCalendar from "./components/ActivityCalendar";
import GoalDisplay from "./components/GoalDisplay"
import GoalSettingsModal from "./components/GoalSettingsModal";
import WorkoutModal from "./components/WorkoutModal"
import dayjs from "dayjs";
import AuthPage from "./components/AuthPage";

import toast from "react-hot-toast";         

import { api, initAuth } from "./api"
import { CiTrophy } from "react-icons/ci"

function App() {

  const [darkMode, setDarkMode] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);

  const importRef = useRef(null);

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);



  useEffect(() => {
    initAuth()
      .then(data => {if (data) setIsLoggedin(true);})
      .finally(() => setAuthLoading(false));
  }, []);

  const handleSessionExpired = () => {
      setIsLoggedin(false);
      toast.error("Session expired. Please log in again.");
      setWorkouts([]);
    }

  const handleLogout = async () => {
    await api.logout();
    setIsLoggedin(false);
    toast.success("Logged out successfully");
    setWorkouts([]);
  }

  const [gender, setGender] = useState(() => {
    return localStorage.getItem("gender") || "female";
  })

  const [workouts, setWorkouts] = useState([]);

  const [weeklyGoal, setWeeklyGoal] = useState(()=>{
    try{return JSON.parse(localStorage.getItem("weeklyGoal")) || 3;
    }catch {return 3;}
  })

  const [allExercises, setAllExercises] = useState([]);

  const [muscles, setMuscles] = useState([]);

  useEffect(() => {

    if (!isLoggedin) return;

    api.getWorkouts()
      .then(res => setWorkouts(res.data))
      .catch(err => {
        console.error("Failed to fetch workouts:", err);
        toast.error("Failed to fetch workouts");
       });
  

    api.getExercises()
      .then(res => setAllExercises(res.data))
      .catch(err => {
        console.error("Failed to fetch exercises:", err);
        toast.error("Failed to fetch exercises");
       });

    api.getMuscles()
      .then(res => setMuscles(res.data))
      .catch(err => {
        console.error("Failed to fetch muscles:", err);
        toast.error("Failed to fetch muscles");
       });
  }, [isLoggedin]);

  useEffect (() => {
    localStorage.setItem("weeklyGoal", JSON.stringify(weeklyGoal));
  }, [weeklyGoal])

 
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem("gender", gender);
  }, [gender])


  const addWorkout = async (workout) => {
    try{
      const saved = await api.createWorkout({
        id: workout.id,
        date: workout.date,
        exercises: workout.exercises.map(ex=>({
          exerciseId: ex.exerciseId,
          repsPerSet: ex.repsPerSet
        }))
      });

      setWorkouts(prev => [...prev, saved]);
    }catch (err){
      if (err.message === 'SESSION_EXPIRED') { handleSessionExpired(); return; }
      console.error("Failed to save workout:", err);
      toast.error("Failed to save workout");
    }
  }

  const deleteWorkout = async (id) => {
    try{
      await api.deleteWorkout(id);
      setWorkouts(prev => prev.filter(w=> w.id !== id));
    }catch (err){
      if (err.message === 'SESSION_EXPIRED') { handleSessionExpired(); return; }
      console.error("Failed to delete workout:", err);
      toast.error("Failed to delete workout");
    }
  }


  const toggleLike = async (id) => {
    const workout = workouts.find(w => w.id === id);
    try{
      await api.updateWorkout(id, {
        liked: !workout.liked});
      setWorkouts(prev=>prev.map(w =>
        w.id === id ? {...w, liked: !w.liked} : w
      ));
    }catch (err){
      if (err.message === 'SESSION_EXPIRED') { handleSessionExpired(); return; }
      console.error("Failed to update workout:", err);
      toast.error("Failed to update workout");
      throw err;
    }
  }

  const updateWeeklyGoal = (newGoal) => {
    setWeeklyGoal(newGoal);
  }

  const handleGenderChange = (gender) => {
    setGender(gender);
  }

  const addCustomExercise = async (exercise) => {
    try{
      const saved = await api.createExercise(exercise);
      setAllExercises(prev => [...prev, saved]);
    }catch(err){
      if (err.message === 'SESSION_EXPIRED') { handleSessionExpired(); return; }
      console.error("Failed to save custom exercise:", err);
      toast.error("Failed to save custom exercise");
    }
    
  }

  const deleteExercise = async (id) => {
    try{
      await api.deleteExercise(id);
      setAllExercises(prev => prev.filter(e=> e.id !== id));
      toast.success("Exercise deleted");
    }catch(err){
      if (err.message === 'SESSION_EXPIRED') { handleSessionExpired(); return; }
      console.error("Failed to delete exercise:", err);
      toast.error("Failed to delete custom exercise");
    }
  }


  const toaster = (
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
  );

   if (authLoading) {
    return (
      <>
        {toaster}
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center">
          <span className="text-stone-400 text-sm">Loading…</span>
        </div>
      </>
    );
  }

  if (!isLoggedin) {
    return (
      <>
      {toaster}
        <AuthPage onAuthSuccess={() => setIsLoggedin(true)} />
      </>
    );
  }


  return (
    <>
    {toaster}
    <div className="font-sans min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} onOpenSettings={()=>setIsGoalModalOpen(true)} />
      <main className="max-w-full mx-auto px-4 sm:px-6 pb-8 grid lg:grid-cols-2 gap-4 sm:gap-6">

        {/* Left - body map */} 
        <div className=" bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200/60 dark:border-stone-800 p-5 sm:p-6 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-center">
            <BodyMap workouts={workouts} gender = {gender} side="front" />
            <BodyMap workouts={workouts} gender = {gender} side="back" />
          </div>
          
            
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
          <RecentWorkouts workouts={workouts} muscles={muscles} onDelete={deleteWorkout} toggleLike={toggleLike} 
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
        allExercises = {allExercises}
        workouts = {workouts}
        muscles = {muscles}
      />

      <GoalSettingsModal 
        isModalOpen={isGoalModalOpen} 
        onClose={()=>setIsGoalModalOpen(false)} 
        onSave={updateWeeklyGoal} 
        weeklyGoal={weeklyGoal}
        gender = {gender}
        handleGenderChange={setGender}
        customExercises = {allExercises.filter(ex => ex.id.startsWith("custom-"))}
        onDeleteExercise={deleteExercise}
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