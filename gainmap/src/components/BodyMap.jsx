import Body from "react-muscle-highlighter"
import { useState } from 'react';

function BodyMap({ workouts = [] }) {
    const [side, setSide] = useState("front")
    const [selectedPart, setSelectedPart] = useState(null);
    const [workoutData, setWorkoutData] = useState({});


    // transform workoutData → array format for <Body>
    const bodyData = Object.entries(workoutData).map(([slug, intensity]) => ({
        slug,
        intensity: Math.min(intensity, 3)
    }))


    const handlePartClick = (part) => {
        setSelectedPart(part)
        if(part.slug){
            setWorkoutData((prev)=>({
                ...prev,
                [part.slug]: (prev[part.slug] || 0) + 1
            }));
        }
        };
        console.log("current workoutData:", workoutData)


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
          onBodyPartPress={handlePartClick}
        />

        </div>

  );
}

export default BodyMap;