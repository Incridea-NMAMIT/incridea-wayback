import Glass from "./Glass";
import { useEffect, useState } from "react";

const TABS = ["quiz", "leaderboard", "task", "treasure"] as const;
type Tab = (typeof TABS)[number];
//Slider component for switching between quiz, leaderboard and task views
interface SliderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  quizNextAttempt?: Date | null;
  taskTargetDate?: Date | null;
  showTreasureHunt?: boolean;
}

export default function Slider({ activeTab, setActiveTab, quizNextAttempt, taskTargetDate, showTreasureHunt = false }: SliderProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [taskTimeLeft, setTaskTimeLeft] = useState<string>("");

  const quizTargetTime = quizNextAttempt?.getTime();
  const taskTargetTime = taskTargetDate?.getTime();

  useEffect(() => {
    if (!quizTargetTime) {
      setTimeLeft("");
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const diff = quizTargetTime - now.getTime();

      if (diff <= 0) {
        setTimeLeft("");
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [quizTargetTime]);

  useEffect(() => {
    if (!taskTargetTime) {
      setTaskTimeLeft("");
      return;
    }

    const updateTaskTimer = () => {
      const now = new Date();
      const diff = taskTargetTime - now.getTime();

      if (diff <= 0) {
        setTaskTimeLeft("");
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTaskTimeLeft(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }
    };

    updateTaskTimer();
    const interval = setInterval(updateTaskTimer, 1000);

    return () => clearInterval(interval);
  }, [taskTargetTime]);

  return (
    <div className="flex justify-center">
      <Glass
        className={`
          relative w-full ${showTreasureHunt ? 'max-w-[800px]' : 'max-w-[600px]'}
          px-2 py-2
          rounded-full
          border border-white/15
          bg-black/40
          backdrop-blur-xl
        `}
      >
        <div
          className={`
            absolute top-1 bottom-1
            ${showTreasureHunt ? 'w-1/4' : 'w-1/3'}
            rounded-full
            bg-white
            shadow-[0_8px_24px_rgba(0,0,0,0.35)]
            transition-transform duration-500
            ease-[cubic-bezier(0.22,0.61,0.36,1)]
          `}
          style={{
            transform:
              activeTab === "quiz"
                ? "translateX(0%)"
                : activeTab === "leaderboard"
                  ? "translateX(100%)"
                  : activeTab === "task"
                    ? "translateX(200%)"
                    : showTreasureHunt && activeTab === "treasure"
                      ? "translateX(300%)"
                      : "translateX(0%)",
          }}
        >
          {/* subtle highlight */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
        </div>

        <div className="relative z-10 flex">
          {TABS.filter((tab) => showTreasureHunt || tab !== "treasure").map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex-1
                py-1.5 sm:py-0
                min-h-[2.5rem] sm:min-h-[2.5rem]
                flex items-center justify-center
                font-semibold
                text-[10px] sm:text-xs md:text-sm
                transition-colors duration-300
                ${activeTab === tab
                  ? "text-black"
                  : "text-gray-400 hover:text-white"
                }
              `}
            >
              {tab === "quiz" && timeLeft ? (
                <div className="flex flex-col md:flex-row items-center gap-0.5 md:gap-2 leading-tight">
                  <span className="whitespace-nowrap">QUIZ</span>
                  <span className="font-mono text-[8.5px] sm:text-[10px] md:text-xs opacity-80 whitespace-nowrap">({timeLeft})</span>
                </div>
              ) : tab === "task" && taskTimeLeft ? (
                <div className="flex flex-col md:flex-row items-center gap-0.5 md:gap-2 leading-tight">
                  <span className="whitespace-nowrap">TASK</span>
                  <span className="font-mono text-[8.5px] sm:text-[10px] md:text-xs opacity-80 whitespace-nowrap">({taskTimeLeft})</span>
                </div>
              ) : (
                <span className="whitespace-nowrap">{tab.toUpperCase()}</span>
              )}
            </button>
          ))}
        </div>
      </Glass >
    </div >
  );
}
