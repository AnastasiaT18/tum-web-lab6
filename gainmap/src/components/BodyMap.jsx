import Body from "react-muscle-highlighter"
import { useState, useEffect } from 'react';

function BodyMap({ workouts = [] }) {
    const [side, setSide] = useState("front")
    const [selectedPart, setSelectedPart] = useState(null)
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })


    const muscleMap = musclesToHighlight(workouts)

    const bodyData = Object.entries(muscleMap).map(([slug, intensity]) => ({
        slug,
        intensity
    }))

    console.log(bodyData)

    function musclesToHighlight(workouts){
        const sorted = [...workouts].sort((a,b) => new Date(b.date) - new Date(a.date));
        const muscleMap = {};

        for(let workout of sorted){
            for(let exercise of workout.exercises){
                for(let muscle of exercise.muscles){
                    const intensity = getIntensity(new Date(workout.date))
                    muscleMap[muscle] = Math.max(muscleMap[muscle] || 0, intensity)

                }
            }
        }
        
        return muscleMap

    }

    function getIntensity(workoutDate){
        const today = new Date()
        const diffMs = today - workoutDate // difference in milliseconds
        const daysDiff = diffMs / (1000 * 60 * 60 * 24) // convert to days

        if (daysDiff <=1) return 3
        else if(daysDiff <=3) return 2
        else if(daysDiff <=7) return 1
        else if (daysDiff > 7) return 0
    }

    function handleMuscleClick(part){
        setSelectedPart(part.slug);
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
          if (!e.target.closest('.body-map-container')) {
            setSelectedPart(null)
          }
        }
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
      }, [])

    return (
        <>
        <div className="flex flex-col items-center gap-4">

            {/* Front/Back Toggle*/}
            <div className="flex gap-4">
                <button onClick={() => setSide("front")}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors
                        ${side === "front"
                        ? "bg-brand text-white border-brand"
                        : "border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"                    }`}
                        >
                    Front
                </button>

                <button onClick={() => setSide("back")}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors
                        ${side === "back"
                        ? "bg-brand text-white border-brand"
                        : "border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"                    }`}
                        >
                    Back
                </button>
            </div>

            <div className = "relative body-map-container"
                onMouseMove = {(e)=> {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                }}
            >
                    <Body
                    data={bodyData}          
                    side={side}
                    gender="female"
                    colors={["#ffd700", "#ffa500", " #ff6b6b"]}
                    scale={1.5}
                    onBodyPartPress={handleMuscleClick}
                    />

                    {selectedPart && (
                                <div className=" absolute mt-2 p-4 bg-stone-50 dark:bg-stone-700 rounded-xl border border-stone-200 dark:border-stone-600 pointer-events-none"
                                style={{
                                    left: tooltipPos.x+10,
                                    top: tooltipPos.y + 10
                                }}>
                                    <h3>{selectedPart}</h3>
                                </div>

                            )}
            </div>

        </div>
        </>

  );
}

export default BodyMap;