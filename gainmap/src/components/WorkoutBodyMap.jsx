import Body from "react-muscle-highlighter"
import { useState } from 'react';

function WorkoutBodyMap({ workout }) {
    const [side, setSide] = useState("front")

    const muscleMap = musclesToHighlight(workout)

    const bodyData = Object.entries(muscleMap).map(([slug, intensity]) => ({
        slug,
        intensity
    }))

    // console.log(bodyData)

    function musclesToHighlight(workout){
        const muscleMap = getIntensity(workout)

        const max = Math.max(...Object.values(muscleMap), 1);

        for (let muscle in muscleMap){
            const intensity = muscleMap[muscle]/max * 100

            if (intensity === 0) {muscleMap[muscle] = 0; }         
            else if (intensity < 33)  {muscleMap[muscle] = 1;   }        
            else if (intensity < 66) {muscleMap[muscle] = 2;    }        
            else{
                muscleMap[muscle] = 3;
            }                               
        }
        
        return muscleMap

    }

    function getIntensity(workout){
        const muscleMap = {};

        for(let exercise of workout.exercises){
            for(let muscle of exercise.muscles){
                const volume = exercise.reps * exercise.sets;
                muscleMap[muscle] = (muscleMap[muscle] || 0) + volume;
            }
        }
        return muscleMap
    }

    return (
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

        <Body
          data={bodyData}          
          side={side}
          gender="female"
          colors={["#ffd700", "#ffa500", " #ff6b6b"]}
          scale={1.5}
        />

        </div>

  );
}

export default WorkoutBodyMap;