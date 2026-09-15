import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Clock3, X, Loader2, CheckCircle, XCircle } from "lucide-react";
import LiquidGlassCard from "../liquidglass/LiquidGlassCard";
import { getDailyQuestion, submitDailyQuizAnswer, type QuizQuestion } from "../../api/leaderboardQuiz";
import { toast } from "react-toastify";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuizModal({ isOpen, onClose }: QuizModalProps) {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; isCorrect: boolean; points: number } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const totalTime = 10;
  const timerRef = useRef<number | null>(null);
  const hasAutoSubmitted = useRef(false);

  const fetchQuestion = async () => {
    try {
      setIsLoading(true);
      const data = await getDailyQuestion();
      setQuestion(data.question);
      setTimeLeft(10);
      setResult(null);
      setSelectedOption(null);
      hasAutoSubmitted.current = false;
    } catch (error: any) {
      console.error("Failed to fetch question", error);
      if (error?.response?.status === 403) {
        toast.error("Cooldown active or invalid attempt.");
      } else {
        toast.error("Failed to load quiz question.");
      }
      onClose();
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchQuestion();
    } else {
      setQuestion(null);
      setResult(null);
    }
  }, [isOpen]);


  const handleSubmit = useCallback(async (optionId: string | null = null) => {
    if (!question || isSubmitting || result) return;

    setIsSubmitting(true);
    if (timerRef.current) window.clearInterval(timerRef.current);

    try {
      const res = await submitDailyQuizAnswer(question.id, optionId);
      setResult(res);
      if (res.isCorrect) {
        toast.success(`Correct! +${res.points} XP`);
      } else {
        toast.error("Incorrect/Time's up!");
      }
    } catch (error) {
      toast.error("Failed to submit answer");
    } finally {
      setIsSubmitting(false);
    }
  }, [question, isSubmitting, result]);

  useEffect(() => {
    if (!isOpen || !question || result || isSubmitting) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      return;
    }

    if (videoRef.current) {
      videoRef.current.playbackRate = 1.2;
    }

    timerRef.current = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 0) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          if (!hasAutoSubmitted.current) {
            hasAutoSubmitted.current = true;
            // If an option is selected but submit button not clicked, submit that option?
            // The prompt says "if quiz is not attempted in 10 seconds, the selected answer (if exists) gets auto submitted."
            // "Not attempted" usually means not submitted.
            // So if selectedOption is not null, we submit that id.
            let optId = null;
            if (selectedOption !== null && question.options[selectedOption]) {
              optId = question.options[selectedOption].id;
            }
            handleSubmit(optId);
          }
          return 0;
        }
        return Math.max(0, previous - 1);
      });
    }, 1000);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isOpen, question, result, isSubmitting, selectedOption, handleSubmit]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <button
        type="button"
        onClick={onClose}
        title="Close quiz modal"
        className="cursor-target fixed right-3 top-3 z-[10000] inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/55 text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:right-5 sm:top-5"
      >
        <X size={20} />
      </button>

      <div className="relative w-full max-w-[34rem]">
        <LiquidGlassCard
          className="h-[min(90svh,43rem)] rounded-[34px] border border-white/10 px-4 pb-4 pt-4 sm:px-5 sm:pb-5 sm:pt-4 md:px-6 md:pb-5 md:pt-4 overflow-hidden"
        >
          {isLoading || !question ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-white" />
            </div>
          ) : result ? (
            <div className="flex h-full flex-col items-center justify-center text-center p-6">
              {result.isCorrect ? (
                <CheckCircle className="w-24 h-24 text-green-500 mb-6 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
              ) : (
                <XCircle className="w-24 h-24 text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]" />
              )}
              <h2 className="text-3xl font-black text-white mb-2">
                {result.isCorrect ? "Correct!" : "Oops!"}
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                {result.isCorrect ? `You earned ${result.points} XP!` : "Better luck next time!"}
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between">
                <div className="inline-flex h-10 items-center gap-2 rounded-full border border-rose-300/30 bg-black/45 px-3">
                  <Clock3 className={`h-4 w-4 ${timeLeft <= 3 ? "text-rose-400" : "text-white/75"}`} />
                  <span className={`text-sm font-black ${timeLeft <= 3 ? "text-rose-400" : "text-white"}`}>
                    {timeLeft}s
                  </span>
                </div>

                <div className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-black/45 px-4">
                  <img
                    src="/leaderboard/diamond-removebg-preview.png"
                    alt="XP"
                    className="h-4 w-4 object-contain"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  <span className="text-lg font-black tracking-wide text-amber-400">
                    +50
                  </span>
                </div>
              </div>

              <div className="pointer-events-none mt-2.5 flex justify-center">
                <div className="relative aspect-[4/5] w-24 overflow-hidden rounded-2xl border border-white/15 bg-black/40 shadow-[0_12px_35px_rgba(0,0,0,0.45)] sm:w-28">
                  <video
                    ref={videoRef}
                    src="/character.webm"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                </div>
              </div>

              <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-purple-500/90 transition-all duration-500 ease-linear"
                  style={{ width: `${(timeLeft / totalTime) * 100}%` }}
                />
              </div>

              <h3 className="mt-3 text-center text-[clamp(1.15rem,2.4vw,1.75rem)] font-semibold leading-[1.2] tracking-tight text-white mb-4">
                {question.question}
              </h3>

              <div className="mt-auto flex-1 overflow-y-auto custom-scrollbar">
                <div className="grid content-start gap-2.5 pb-2">
                  {question.options.map((option, index) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedOption(index)}
                      disabled={isSubmitting}
                      className={`cursor-pointer min-h-[54px] w-full rounded-[20px] border px-4 py-2.5 text-left backdrop-blur-[12px] transition-all duration-200 ${selectedOption === index
                        ? "border-white/50 bg-white/20 shadow-[0_8px_25px_-5px_rgba(255,255,255,0.15)]"
                        : "border-white/8 bg-white/5 hover:border-white/20 hover:bg-white/10"
                        }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[0.98rem] font-medium leading-tight text-gray-100">
                          {option.option}
                        </span>
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center">
                          {selectedOption === index && (
                            <img
                              src="/incridea-logo.png"
                              alt="Selected"
                              className="h-full w-full object-contain opacity-85 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                              draggable={false}
                              onContextMenu={(e) => e.preventDefault()}
                            />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => handleSubmit(selectedOption !== null ? question.options[selectedOption].id : null)}
                  disabled={isSubmitting || selectedOption === null}
                  className="cursor-pointer min-h-[56px] w-full rounded-[20px] border border-[#6d28d9]/70 bg-[#5b21b6] px-5 py-3 text-center text-[1.02rem] font-bold text-white transition-all duration-300 hover:bg-[#4c1d95] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : "Submit"}
                </button>
              </div>
            </div>
          )}
        </LiquidGlassCard>
      </div>
    </div>,
    document.body,
  );
}
