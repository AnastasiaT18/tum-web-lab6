import Body from "react-muscle-highlighter"
import { useState } from 'react';

function WorkoutBodyMap({ side, workout, gender }) {
    
    const muscleMap = musclesToHighlight(workout)

    const bodyData = Object.entries(muscleMap).map(([slug, intensity]) => ({
        slug,
        intensity
    }))

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
        <div className="flex flex-col items-center ">

        <Body
          data={bodyData}          
          side={side}
          gender={gender}
          colors={["#ffd700", "#ffa500", " #ff6b6b"]}
          scale={1}
        />

        </div>

  );
}

export default WorkoutBodyMap;