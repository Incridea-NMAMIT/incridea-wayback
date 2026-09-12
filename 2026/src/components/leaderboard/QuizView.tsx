import Glass from "../ui/Glass";
import { type QuizQuestion } from "../../api/leaderboardQuiz";
import { AnimatePresence, motion } from "framer-motion";
import LiquidGlassCard from "../liquidglass/LiquidGlassCard";
import { Link } from "react-router-dom";
interface QuizViewProps {
  onStart: () => void;
  canAttempt: boolean;
  nextAttemptTime: Date | null;
  user?: { pid?: string | null };
}

export default function QuizView({
  onStart,
  canAttempt,
  user
}: QuizViewProps & {
  setQuestion?: (q: QuizQuestion) => void,
}) {
  const glassCardStyle: React.CSSProperties = {
    borderRadius: "1rem",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    background: `
      linear-gradient(to top, rgba(0, 0, 0, 0.20), transparent 60%),
      rgba(21, 21, 21, 0.30)
    `,
    boxShadow: `
      inset 0 0 0 1px rgba(255, 255, 255, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.22)
    `,
    backdropFilter: "brightness(1.1) blur(6px)",
    WebkitBackdropFilter: "brightness(1.1) blur(6px)",
  };

  const handleStart = () => {
    if (canAttempt) {
      onStart();
    }
  }

  // If user is not registered (no PID), show registration prompt
  if (user && !user.pid) {
    return (
      <div className="max-w-5xl mx-auto mt-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto"
        >
          <LiquidGlassCard
            className="text-center p-10 w-full"
            colorScheme="dark"
          >
            <div className="w-full h-full flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold text-white mb-4">Complete Registration</h2>
              <p className="text-center text-gray-400 mb-8">
                You need to complete your registration to participate in the Daily Quiz.
              </p>
              <Link
                to="/register"
                className="inline-block px-8 py-3 rounded-full font-bold bg-gradient-to-r from-blue-600 to-purple-600 shadow-[0_0_25px_rgba(99,102,241,0.6)] hover:scale-105 transition text-white"
              >
                Register for Incridea
              </Link>
            </div>
          </LiquidGlassCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <AnimatePresence mode="wait">
        {!canAttempt ? (
          <motion.div
            key="cooldown"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md mx-auto"
          >
            <Glass style={glassCardStyle} className="border border-gray-500/30 rounded-2xl p-8 text-center opacity-70 cursor-not-allowed">
              <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-gray-500/20 text-gray-300 text-xs font-bold border border-gray-500/30">
                Quiz
              </span>

              <h2 className="text-3xl md:text-3xl font-black mb-4 text-gray-400">
                Cooldown Active
              </h2>

              <p className="text-gray-500 max-w-xl mx-auto mb-8">
                You have already attempted the quiz. Please check the countdown in the tab above.
              </p>

              <button
                disabled
                className="px-10 py-3 rounded-full font-bold bg-gray-700/50 text-gray-400 cursor-not-allowed"
              >
                Come Back Later
              </button>
            </Glass>
          </motion.div>
        ) : (
          <Glass style={glassCardStyle} className="border border-purple-500/30 rounded-2xl p-8 text-center">
            <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
              Quiz
            </span>

            <h2 className="text-3xl md:text-4xl font-moco font-white">
              Take Today’s Quiz
            </h2>

            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              Answer a short quiz and earn 50 XP to boost your leaderboard rank.
            </p>

            <button
              onClick={handleStart}
              className="px-10 py-3 rounded-full font-bold bg-gradient-to-r from-blue-600 to-purple-600 shadow-[0_0_25px_rgba(99,102,241,0.6)] hover:scale-105 transition"
            >
              Start Quiz
            </button>
          </Glass>
        )}
      </AnimatePresence>
    </div>
  );
}
