import Body from "react-muscle-highlighter"
import { useState } from 'react';

function BodyMap({ workouts = [] }) {
    const [side, setSide] = useState("front")

    return (
        <div className="flex flex-col items-center gap-4">

        {/* Front/Back Toggle*/}
        <div classNam="flex gap-4">
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
          data={workouts}
          side={side}
          gender="female"
          colors={["#ff6b6b", "#ffa500", "#ffd700"]}
          scale={1.5}
        />

        </div>

  );
}

export default BodyMap;