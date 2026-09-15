import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTaskStatus } from "../api/task";
import LiquidGlassCard from "./liquidglass/LiquidGlassCard";
import {
  ASSISTIVE_TOUCH_PREFERENCE_EVENT,
  ASSISTIVE_TOUCH_PREFERENCE_KEY,
  getAssistiveTouchPreference,
  setAssistiveTouchPreference,
} from "../utils/assistiveTouchPreference";
import { useAuth } from "../hooks/useAuth";

function AssistiveTouchShortcut() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEnabled, setIsEnabled] = useState(() =>
    getAssistiveTouchPreference(),
  );

  const { user } = useAuth();

  const { data: statusData, isLoading: isTasksLoading, isError: hasTaskError } = useQuery({
    queryKey: ["taskStatus"],
    queryFn: getTaskStatus,
    enabled: isEnabled && !!user?.pid,
    retry: false,
  });

  // Simplified view for single task system
  let statusLabel = "--";
  let progressPercentage = 0;

  if (statusData) {
    if (statusData.status === 'ACTIVE') {
      statusLabel = "Active Task";
      progressPercentage = 50; // In progress
    } else if (statusData.status === 'COOLDOWN') {
      statusLabel = "Cooling Down";
      progressPercentage = 100; // Done for now
    } else if (statusData.status === 'LOCKED') {
      statusLabel = "Ready to Start";
      progressPercentage = 0;
    } else if (statusData.status === 'COMPLETED_ALL') {
      statusLabel = "All Done";
      progressPercentage = 100;
    }
  }

  const progressLabel = isTasksLoading ? "..." : statusData ? statusLabel : "--";
  const completedLabel = ""; // Not showing count anymore as it's not a list

  const setEnabledState = (enabled: boolean) => {
    setIsEnabled(enabled);
    setAssistiveTouchPreference(enabled);
    if (!enabled) {
      setIsExpanded(false);
    }
  };

  const openTasksSection = async () => {
    await Promise.allSettled([
      queryClient.invalidateQueries({ queryKey: ["tasks"] }),
      queryClient.invalidateQueries({ queryKey: ["me"] }),
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] }),
    ]);

    void navigate("/leaderboard", { state: { tab: "task" } });
    setIsExpanded(false);
  };

  const fixedPositionClass =
    "fixed bottom-4 right-3 sm:bottom-5 sm:right-4 md:bottom-6 md:right-6 z-[60]";

  useEffect(() => {
    const syncPreference = () => {
      const enabled = getAssistiveTouchPreference();
      setIsEnabled(enabled);
      if (!enabled) {
        setIsExpanded(false);
      }
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === ASSISTIVE_TOUCH_PREFERENCE_KEY) {
        syncPreference();
      }
    };

    const handlePreferenceEvent = () => {
      syncPreference();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      ASSISTIVE_TOUCH_PREFERENCE_EVENT,
      handlePreferenceEvent,
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        ASSISTIVE_TOUCH_PREFERENCE_EVENT,
        handlePreferenceEvent,
      );
    };
  }, []);

  useEffect(() => {
    if (!isExpanded) {
      return undefined;
    }

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (containerRef.current && target && !containerRef.current.contains(target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isExpanded]);

  if (!isEnabled) {
    return null;
  }

  return (
    <div ref={containerRef} className={`${fixedPositionClass} flex flex-col items-end gap-2`}>
      {isExpanded && (
        <LiquidGlassCard className="w-[min(88vw,18rem)] rounded-2xl px-3 py-2.5 text-white">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-[10px] font-semibold uppercase tracking-wide text-slate-300">
                Task Progress
              </p>
              <p className="text-sm sm:text-xs font-semibold text-cyan-200">{progressLabel}</p>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-cyan-300/90 transition-all duration-300"
                style={{ width: `${hasTaskError ? 0 : progressPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-[11px] text-slate-300">Completed Tasks</p>
              <span className="rounded-md border border-white/20 bg-white/10 px-2 py-0.5 text-xs sm:text-[11px] font-semibold">
                {completedLabel}
              </span>
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => void openTasksSection()}
                className="cursor-target rounded-full border border-cyan-300/40 bg-cyan-500/20 px-3 py-1.5 text-sm sm:text-[11px] font-semibold text-cyan-100 backdrop-blur-md transition hover:bg-cyan-500/30"
              >
                Open Tasks
              </button>
              <button
                type="button"
                onClick={() => setEnabledState(false)}
                className="cursor-target rounded-full border border-rose-300/40 bg-rose-500/20 px-3 py-1.5 text-sm sm:text-[11px] font-semibold text-rose-100 backdrop-blur-md transition hover:bg-rose-500/30"
              >
                Disable
              </button>
            </div>
          </div>
        </LiquidGlassCard>
      )}

      <button
        type="button"
        onClick={() => setIsExpanded((previous) => !previous)}
        className="cursor-target flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/65 shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur-md transition hover:scale-105 hover:bg-black/80"
        aria-label="AssistiveTouch shortcut"
      >
        <span className="h-5 w-5 rounded-full border border-white/80 bg-white/20" />
      </button>
    </div>
  );
}

export default AssistiveTouchShortcut;
