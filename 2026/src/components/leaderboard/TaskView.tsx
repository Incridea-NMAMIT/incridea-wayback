import { useMutation, useQueryClient } from '@tanstack/react-query';
import TaskCard from '../TaskCard';
import { type TaskStatusResponse, startTask } from '../../api/task';
import { useAuth } from '../../hooks/useAuth';
import { useRevealHint } from '../../hooks/useTask';
import LiquidGlassCard from '../liquidglass/LiquidGlassCard';
import { Loader2, Lock, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';


interface TaskViewProps {
  taskStatus: TaskStatusResponse | undefined;
  isLoading: boolean;
  refetch: () => void;
}

export default function TaskView({ taskStatus, isLoading, refetch }: TaskViewProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { revealHint, isLoading: isRevealingHint } = useRevealHint();
  const [timeLeft, setTimeLeft] = useState<string>('');

  /* const { data: taskStatus, isLoading } = useQuery({
    queryKey: ['taskStatus', user?.id],
    queryFn: getTaskStatus,
    enabled: !!user?.pid,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return false;
      // Refetch if in cooldown or active to keep timer/status sync
      if (data.status === 'ACTIVE' || data.status === 'COOLDOWN') return 10000;
      return false;
    }
  }); */

  const startMutation = useMutation({
    mutationFn: startTask,
    onSuccess: (data) => {
      queryClient.setQueryData(['taskStatus', user?.id], data);
      toast.success("Task Started! You have 30 minutes.");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to start task");
    }
  });

  // Countdown Timer Logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (!taskStatus) return;

      let targetDate: Date | null = null;
      if (taskStatus.status === 'ACTIVE' && taskStatus.task.expiresAt) {
        targetDate = new Date(taskStatus.task.expiresAt);
      } else if (taskStatus.status === 'COOLDOWN') {
        targetDate = new Date(taskStatus.cooldownEnds);
      }

      if (targetDate) {
        const now = new Date();
        const diff = targetDate.getTime() - now.getTime();

        if (diff <= 0) {
          setTimeLeft('00:00:00');
          // Invalidate query to refresh state (e.g. Active -> Expired -> Cooldown)
          if (diff > -1000 && diff < 1000) refetch();
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [taskStatus, queryClient]);


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  // If user is not registered (no PID), show registration prompt
  if (user && !user.pid) {
    return (
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white mb-2">Quests</h2>
          <p className="text-gray-400">Complete tasks to earn XP. Strict 30m limit!</p>
        </div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <LiquidGlassCard
              className="text-center p-10 w-full"
              colorScheme="dark"
            >
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
                  <Lock className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Complete Registration</h3>
                <p className="text-center text-gray-400 mb-6">
                  You need to complete your registration to participate in Quests.
                </p>

                <Link
                  to="/register"
                  className="inline-block px-8 py-3 rounded-full font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-purple-500/25 transition-all hover:scale-105"
                >
                  Register for Incridea
                </Link>
              </div>
            </LiquidGlassCard>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-white mb-2">Quests</h2>
        <p className="text-gray-400">Complete tasks to earn XP. Strict 30m limit!</p>
      </div>

      <div className="flex justify-center">
        <AnimatePresence mode="wait">
          {taskStatus?.status === 'LOCKED' && (
            <motion.div
              key="locked"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md"
            >
              <LiquidGlassCard
                className="text-center p-10 w-full"
                colorScheme="dark"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500/20  rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                    <Lock className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Ready for a new task?</h3>
                  <p className="text-gray-400 mb-6">
                    You will have <span className="text-purple-400 font-bold">30 minutes</span> to complete the task once you start.
                  </p>

                  {taskStatus.task && (
                    <div className="mb-6 p-4 bg-black/30 rounded-lg border border-white/5 text-left max-h-48 overflow-y-auto custom-scrollbar">
                      <h4 className="text-sm font-semibold text-fuchsia-400 mb-2 uppercase tracking-wider">Mission Briefing</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{taskStatus.task.description}</p>
                    </div>
                  )}

                  <button
                    onClick={() => startMutation.mutate()}
                    disabled={startMutation.isPending}
                    className="px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-purple-500/25 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 w-full sm:w-auto"
                  >

                    {startMutation.isPending ? <Loader2 className="animate-spin" /> : "Start Task"}
                  </button></div>
              </LiquidGlassCard>
            </motion.div>
          )}

          {taskStatus?.status === 'ACTIVE' && taskStatus.task && (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl"
            >
              <div className="mb-4 flex justify-between items-center bg-black/40 px-4 py-2 rounded-lg border border-white/10">
                <span className="text-gray-400 text-sm">Time Remaining</span>
                <div className="flex items-center gap-2 text-rose-400 font-mono text-xl font-bold">
                  <Timer className="w-5 h-5" />
                  {timeLeft}
                </div>
              </div>


              <TaskCard
                taskId={taskStatus.task.id}
                title={taskStatus.task.title}
                description={taskStatus.task.description}
                xp={taskStatus.task.xp}
                isCompleted={false}
                actionUrl={taskStatus.task.actionUrl}
                hasHint={taskStatus.task.hasHint}
                hintTaken={taskStatus.task.hintTaken}
                hint={taskStatus.task.hint}
                onRevealHint={() => revealHint()}
                isRevealingHint={isRevealingHint}
              />
            </motion.div>
          )}

          {taskStatus?.status === 'COOLDOWN' && (
            <motion.div
              key="cooldown"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md mx-auto"
            >
              <LiquidGlassCard
                className="border border-gray-500/30 rounded-2xl p-8 text-center opacity-70 cursor-not-allowed w-full"
                colorScheme="dark"
              >
                <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-gray-500/20 text-gray-300 text-xs font-bold border border-gray-500/30">
                  Quests
                </span>

                <h2 className="text-3xl md:text-3xl font-black mb-4 text-gray-400">
                  Cooldown Active
                </h2>

                <p className="text-gray-500 max-w-xl mx-auto mb-8">
                  You have already attempted the task. Please check the countdown in the tab above.
                </p>

                <button
                  disabled
                  className="px-10 py-3 rounded-full font-bold bg-gray-700/50 text-gray-400 cursor-not-allowed"
                >
                  Come Back Later
                </button>
              </LiquidGlassCard>
            </motion.div>
          )}

          {taskStatus?.status === 'COMPLETED_ALL' && (
            <motion.div
              key="done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-md"
            >
              <LiquidGlassCard
                className="text-center p-10 w-full"
                colorScheme="dark"
              >
                <h3 className="text-2xl font-bold text-green-400 mb-2">All Caught Up!</h3>
                <p className="text-gray-400">You've completed all available tasks.</p>
              </LiquidGlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
