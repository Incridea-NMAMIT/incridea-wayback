import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { FiClock, FiCheck, FiAlertCircle, FiChevronRight, FiChevronLeft, FiInfo, FiActivity, FiLock } from 'react-icons/fi'
import { showToast } from '@/utils/toast'
import { getPublicQuiz, submitQuizAnswer, finishQuiz, startQuiz, lockQuiz, verifyPin, type PublicQuizQuestion } from '@/api/quiz'
import { useServerTime } from '@/hooks/useServerTime'
import LiquidGlassCard from '@/components/liquidglass/LiquidGlassCard'
import QuizBackground from '@/components/quiz/QuizBackground'

export default function QuizPage() {
    const { quizId } = useParams<{ quizId: string }>()
    const navigate = useNavigate()
    const { now: serverTime } = useServerTime()
    const [hasStarted, setHasStarted] = useState(false)
    const [stopwatch, setStopwatch] = useState('00:00:00')
    const [attemptStartTime, setAttemptStartTime] = useState<Date | null>(null)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
    const [timeLeft, setTimeLeft] = useState<string>('')
    const [isFinished, setIsFinished] = useState(false)
    const [timeTaken, setTimeTaken] = useState<number | null>(null)
    const [showPinModal, setShowPinModal] = useState(false)
    const [pin, setPin] = useState('')
    const [isLocked, setIsLocked] = useState(false)
    const [showWarning, setShowWarning] = useState(false)
    const [showSubmitModal, setShowSubmitModal] = useState(false)
    const [isLateEntry, setIsLateEntry] = useState(false)
    const hasHandledReload = useRef(false)


    const { data, isLoading, error } = useQuery({
        queryKey: ['public-quiz', quizId],
        queryFn: () => getPublicQuiz(quizId!),
        enabled: !!quizId,
        retry: false
    })

    const quiz = data?.quiz
    const warningKey = `warningGiven_${quizId}`

    useEffect(() => {
        if (quiz?.attemptStartTime) {
            setHasStarted(true)
            const start = new Date(quiz.attemptStartTime)
            setAttemptStartTime(start)

            // If resuming an attempt that started after the official end time
            if (quiz.endTime && start > new Date(quiz.endTime)) {
                setIsLateEntry(true)
            }
        }
        if (quiz?.isLocked) {
            setIsLocked(true)
        }
    }, [quiz])


    useEffect(() => {
        if (!quiz) return

        const updateTimers = () => {
            const now = serverTime ?? new Date().getTime()
            const end = new Date(quiz.endTime).getTime()
            const distance = end - now

            if (distance < 0) {
                setTimeLeft('Expired')
                // Only auto-finish if NOT a late-start authorized attempt
                // If it's late, we rely on the countdown or master control
                if (!isFinished && !finishQuizMutation.isPending && !isLateEntry) {
                    showToast('Quiz time is over! Auto-submitting...', 'error')
                    finishQuizMutation.mutate()
                }

            } else {
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
                const seconds = Math.floor((distance % (1000 * 60)) / 1000)
                const hh = hours.toString().padStart(2, '0')
                const mm = minutes.toString().padStart(2, '0')
                const ss = seconds.toString().padStart(2, '0')
                setTimeLeft(`${hh}:${mm}:${ss}`)
            }

            if (hasStarted && attemptStartTime) {
                const diff = now - attemptStartTime.getTime()
                if (diff >= 0) {
                    const swHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                    const swMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
                    const swSeconds = Math.floor((diff % (1000 * 60)) / 1000)
                    setStopwatch(`${swHours.toString().padStart(2, "0")}:${swMinutes.toString().padStart(2, "0")}:${swSeconds.toString().padStart(2, "0")}`)
                }
            }
        }

        updateTimers()
        const interval = setInterval(updateTimers, 1000)

        return () => clearInterval(interval)
    }, [quiz, hasStarted, attemptStartTime, isFinished, serverTime])

    const startQuizMutation = useMutation({
        mutationFn: (variables: { pin?: string }) => startQuiz(quizId!, { teamId: quiz?.teamId!, pin: variables.pin }),
        onSuccess: (data) => {
            showToast('Quiz started!', 'success')
            setAttemptStartTime(new Date(data.attemptStartTime))
            setHasStarted(true)
            setShowPinModal(false)
            setIsLocked(false)
            setPin('')
            if (quiz?.isLate) setIsLateEntry(true)
        },

        onError: (err: any) => {
            showToast(err.response?.data?.message || 'Failed to start quiz', 'error')
        }
    })

    const [pendingSaves, setPendingSaves] = useState<Set<string>>(new Set())

    const submitAnswerMutation = useMutation({
        mutationFn: (variables: { questionId: string, optionId: string }) =>
            submitQuizAnswer(quizId!, { optionId: variables.optionId, teamId: quiz?.teamId! }),
        onMutate: (variables) => {
            setPendingSaves(prev => new Set(prev).add(variables.questionId))
        },
        onSuccess: (_data, variables) => {
            setPendingSaves(prev => {
                const next = new Set(prev)
                next.delete(variables.questionId)
                return next
            })
        },
        onError: (err: any, variables) => {
            setPendingSaves(prev => {
                const next = new Set(prev)
                next.delete(variables.questionId)
                return next
            })
            showToast(err.response?.data?.message || 'Failed to save answer. Please try again.', 'error')
            // Revert local state if needed? For now, we keep the user's selection but warn them.
        }
    })

    const finishQuizMutation = useMutation({
        mutationFn: () => finishQuiz(quizId!, { teamId: quiz?.teamId! }),
        onSuccess: (data) => {
            showToast('Quiz submitted successfully', 'success')
            setTimeTaken(data.timeTaken)
            setIsFinished(true)
            setShowSubmitModal(false)
        },
        onError: (err: any) => {
            showToast(err.response?.data?.message || 'Failed to submit quiz', 'error')
            if (err.response?.status === 400 && err.response?.data?.message?.includes('already')) {
                setTimeTaken(err.response?.data?.timeTaken ?? null)
                setIsFinished(true)
            }
        }
    })

    const lockQuizMutation = useMutation({
        mutationFn: (variables: { type: string }) => lockQuiz(quizId!, { teamId: quiz?.teamId!, type: variables.type }),
        onSuccess: (data) => {
            if (data.isLocked) {
                setIsLocked(true)
                setShowPinModal(true) // Ensure PIN modal shows for lockout
                setShowWarning(false) // Close warning if it was open
                showToast('Quiz locked due to repeated tab changes', 'error')
            } else {
                setShowWarning(true)
            }
        },
        onError: (err: any) => {
            showToast(err.response?.data?.message || 'Security system error. Please contact admin.', 'error')
        }
    })

    useEffect(() => {
        if (quiz?.userSubmissions && Object.keys(selectedOptions).length === 0) {
            setSelectedOptions(quiz.userSubmissions)
        }
    }, [quiz, selectedOptions])

    useEffect(() => {
        if (!hasStarted || isFinished || !quiz?.teamId || isLocked || lockQuizMutation.isPending) return

        const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[]
        if (navEntries.length > 0 && navEntries[0].type === "reload" && !hasHandledReload.current) {
            hasHandledReload.current = true
            lockQuizMutation.mutate({ type: 'refresh_or_new_tab' })
        }

        return () => {
        }
    }, [hasStarted, isFinished, quizId, quiz?.teamId, lockQuizMutation, isLocked])

    const verifyPinMutation = useMutation({
        mutationFn: (variables: { pin: string }) => verifyPin(quizId!, { teamId: quiz?.teamId!, pin: variables.pin }),
        onSuccess: (data) => {
            if (data.valid) {
                showToast('Quiz unlocked!', 'success')
                setIsLocked(false)
                setShowPinModal(false)
                setPin('')
            } else {
                showToast('Invalid Master PIN', 'error')
            }
        },
        onError: (err: any) => {
            showToast(err.response?.data?.message || 'Failed to verify PIN', 'error')
        }
    })

    const handleOptionSelect = (questionId: string, optionId: string) => {
        if (!quiz?.teamId) return showToast('Team ID missing, cannot submit', 'error')

        // Optimistic update
        setSelectedOptions(prev => ({ ...prev, [questionId]: optionId }))

        submitAnswerMutation.mutate({ questionId, optionId })
    }

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (!hasStarted || isFinished) return

            if (e.key === 'ArrowLeft') {
                setCurrentQuestionIndex(prev => Math.max(0, prev - 1))
            } else if (e.key === 'ArrowRight') {
                if (currentQuestionIndex < (quiz?.questions.length ?? 0) - 1) {
                    setCurrentQuestionIndex(prev => prev + 1)
                }
            } else if (['1', '2', '3', '4'].includes(e.key)) {
                const currentQuestion = quiz?.questions[currentQuestionIndex]
                if (currentQuestion) {
                    const optionIndex = parseInt(e.key) - 1
                    const option = currentQuestion.options[optionIndex]
                    if (option) {
                        handleOptionSelect(currentQuestion.id, option.id)
                    }
                }
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [hasStarted, isFinished, currentQuestionIndex, quiz])

    useEffect(() => {
        if (!hasStarted || isFinished || isLocked || showWarning || !quiz?.teamId || lockQuizMutation.isPending) return

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' && !isLocked && !lockQuizMutation.isPending) {
                const warningGiven = localStorage.getItem(warningKey) === 'true'
                if (!warningGiven) {
                    setShowWarning(true)
                    localStorage.setItem(warningKey, 'true')
                } else {
                    lockQuizMutation.mutate({ type: 'tab_switch' })
                }
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [hasStarted, isFinished, isLocked, lockQuizMutation, warningKey, showWarning, quiz?.teamId])

    if (isLoading) return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-4">
            <QuizBackground />
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm font-medium animate-pulse">Initializing Session...</p>
        </div>
    )

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
                <QuizBackground />
                <LiquidGlassCard colorScheme="dark" className="max-w-md w-full p-6 text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                        <FiAlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-xl font-bold font-moco">Access Denied</h1>
                        <p className="text-slate-400 text-sm">{(error as any).response?.data?.message || 'Something went wrong.'}</p>
                    </div>
                    <button onClick={() => navigate('/profile')} className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-semibold transition">
                        Return to Profile
                    </button>
                </LiquidGlassCard>
            </div>
        )
    }

    if (!quiz) return null

    const Modals = () => (
        <>
            {/* PIN Entry Modal Overlay (For Quiz Start) */}
            {showPinModal && !hasStarted && !isLocked && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowPinModal(false)} />
                    <div className="relative w-full max-w-sm animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                        <LiquidGlassCard colorScheme="dark" className="p-0.5" contentClassName="p-8">
                            <div className="space-y-6">
                                <div className="text-center space-y-2">
                                    <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                                        <FiLock className="text-blue-500 w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white font-moco tracking-tight">Enter PIN</h3>
                                    <p className="text-slate-400 text-sm">
                                        Please provide the access PIN shared by the event coordinator.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="relative">
                                        <input
                                            type="password"
                                            value={pin}
                                            onChange={(e) => setPin(e.target.value)}
                                            placeholder="••••••"
                                            autoFocus
                                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center text-2xl font-black tracking-[0.5em] text-white focus:outline-none focus:border-blue-500 transition-all"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && pin) startQuizMutation.mutate({ pin })
                                            }}
                                        />
                                    </div>

                                    <button
                                        onClick={() => startQuizMutation.mutate({ pin })}
                                        disabled={startQuizMutation.isPending || !pin}
                                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {startQuizMutation.isPending ? 'Verifying...' : 'Unlock & Start'}
                                    </button>
                                </div>
                            </div>
                        </LiquidGlassCard>
                    </div>
                </div>
            )}

            {/* Warning Modal (Security Alert) */}
            {showWarning && !isLocked && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" />
                    <div className="relative w-full max-w-sm animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                        <LiquidGlassCard colorScheme="dark" className="border-orange-500/50" contentClassName="p-8 text-center space-y-6">
                            <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto border border-orange-500/30">
                                <FiAlertCircle className="text-orange-500 w-8 h-8" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-white font-moco">Security Alert</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Switching tabs or minimizing the browser is strictly prohibited.
                                    <span className="block mt-2 font-bold text-orange-400">Next violation will lock your quiz permanently.</span>
                                </p>
                            </div>
                            <button
                                onClick={() => setShowWarning(false)}
                                className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-black transition-all active:scale-95"
                            >
                                I Understand
                            </button>
                        </LiquidGlassCard>
                    </div>
                </div>
            )}
        </>
    )

    if (isFinished) {
        const formatTimeTaken = (seconds: number) => {
            const h = Math.floor(seconds / 3600)
            const m = Math.floor((seconds % 3600) / 60)
            const s = Math.floor(seconds % 60)
            return `${h > 0 ? `${h}h ` : ''}${m}m ${s}s`
        }

        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 text-center">
                <QuizBackground />
                <div className="max-w-2xl w-full space-y-5 animate-in fade-in zoom-in-95 duration-700">
                    <div className="space-y-2">
                        <div className="relative mx-auto w-20 h-20 md:w-28 md:h-28">
                            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                            <div className="relative bg-slate-900/50 backdrop-blur-2xl border border-white/15 rounded-3xl w-full h-full flex items-center justify-center overflow-hidden">
                                <FiCheck className="w-10 h-10 md:w-14 md:h-14 text-blue-500 animate-in zoom-in-50 duration-500" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-3xl md:text-5xl font-black font-moco tracking-tighter bg-gradient-to-b from-white via-white to-slate-500 bg-clip-text text-transparent">
                                Mission Accomplished
                            </h2>
                            <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                                Performance synchronized. Your results are logged.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-center max-w-lg mx-auto w-full">
                        <LiquidGlassCard colorScheme="dark" className="p-0.5 w-full sm:w-64" contentClassName="p-4 md:p-6 space-y-1">
                            <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest text-center">Time Taken</p>
                            <div className="flex items-baseline justify-center">
                                <span className="text-2xl md:text-3xl font-black text-white font-moco leading-tight">
                                    {timeTaken !== null ? formatTimeTaken(timeTaken) : '??'}
                                </span>
                            </div>
                        </LiquidGlassCard>
                    </div>

                    <div className="bg-slate-900/30 backdrop-blur-sm border border-white/5 p-4 md:p-6 rounded-2xl space-y-3 max-w-lg mx-auto w-full">
                        <p className="text-[12px] text-slate-400 leading-relaxed px-2">
                            Mission successful. Your results have been recorded and sent for validation.
                        </p>
                        <button onClick={() => navigate('/profile')} className="w-full py-3 bg-white text-slate-950 rounded-xl font-black text-sm transition-all active:scale-[0.98] hover:bg-slate-100">
                            Terminate Session
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (!hasStarted) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
                <QuizBackground />
                <div className="max-w-2xl w-full animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="text-center mb-4 md:mb-6 space-y-2">
                        <h1 className="text-3xl md:text-5xl font-black font-moco bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent px-2">
                            {quiz.name}
                        </h1>
                        <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto leading-relaxed px-4">
                            {quiz.description || 'Challenge your knowledge and prove your skills in this competitive event.'}
                        </p>
                    </div>

                    <LiquidGlassCard colorScheme="dark" className="p-0.5 max-w-lg mx-auto">
                        <div className="p-4 md:p-6 space-y-5 md:space-y-6">
                            <div className="grid grid-cols-3 gap-2 bg-slate-950/20 p-1.5 rounded-2xl border border-white/5">
                                <div className="flex flex-col items-center justify-center p-2 md:p-3 bg-slate-900/40 rounded-xl border border-slate-800/30">
                                    <FiActivity className="text-blue-400 w-4 h-4 mb-1" />
                                    <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-0.5">Ques</span>
                                    <span className="text-lg md:text-xl font-moco font-black text-white">{quiz.questions.length}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-2 md:p-3 bg-slate-900/40 rounded-xl border border-slate-800/30">
                                    <FiInfo className="text-purple-400 w-4 h-4 mb-1" />
                                    <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-0.5">Try</span>
                                    <span className="text-sm md:text-base font-moco font-black text-white">{quiz.allowAttempts ? '∞' : '1'}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-2 md:p-3 bg-slate-900/40 rounded-xl border border-slate-800/30">
                                    <FiClock className="text-orange-400 w-4 h-4 mb-1" />
                                    <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-0.5">Status</span>
                                    <span className={`text-[10px] md:text-sm font-mono font-black ${quiz.isLate ? 'text-red-400' : 'text-orange-400'} leading-none`}>
                                        {quiz.isLate ? 'CLOSED' : timeLeft.split(':').slice(0, 2).join(':')}
                                    </span>
                                </div>
                            </div>

                            {quiz.isLate && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl mb-4">
                                    <p className="text-[10px] md:text-xs text-red-400 font-medium text-center">
                                        The official window has closed. Use Master PIN to proceed.
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={async () => {
                                    if (isLocked || quiz.isLate || (quiz && quiz.hasPassword)) {
                                        setShowPinModal(true)
                                    } else {
                                        startQuizMutation.mutate({})
                                    }
                                }}
                                disabled={startQuizMutation.isPending}
                                className="w-full py-3.5 md:py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-base md:text-lg transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {startQuizMutation.isPending ? 'Preparing...' : 'Join Challenge'}
                            </button>
                        </div>
                    </LiquidGlassCard>
                </div>
                <Modals />
            </div>
        )
    }

    const currentQuestion = quiz.questions[currentQuestionIndex] as PublicQuizQuestion | undefined
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100

    if (isLocked) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
                <QuizBackground />
                <div className="relative w-full max-w-sm animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                    <LiquidGlassCard colorScheme="dark" className="p-0.5" contentClassName="p-8">
                        <div className="space-y-6">
                            <div className="text-center space-y-2">
                                <div className="w-16 h-16 bg-red-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                                    <FiLock className="text-red-500 w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black text-white font-moco tracking-tight">Quiz Locked</h3>
                                <p className="text-slate-400 text-sm">
                                    Anti-cheat triggered. Please provide the Master PIN to resume the quiz.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value)}
                                        placeholder="••••••"
                                        autoFocus
                                        className="w-full bg-slate-900 border border-red-500/50 rounded-2xl p-4 text-center text-2xl font-black tracking-[0.5em] text-white focus:outline-none focus:border-red-500 transition-all"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && pin) verifyPinMutation.mutate({ pin })
                                        }}
                                    />
                                </div>

                                <button
                                    onClick={() => verifyPinMutation.mutate({ pin })}
                                    disabled={verifyPinMutation.isPending || !pin}
                                    className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {verifyPinMutation.isPending ? 'Verifying...' : 'Unlock & Resume'}
                                </button>
                                <p className="text-[10px] text-slate-500 text-center uppercase font-bold tracking-[0.1em]">
                                    Coordinate with event Organisers for Master PIN
                                </p>
                            </div>
                        </div>
                    </LiquidGlassCard>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans overflow-hidden">
            <QuizBackground />
            <Modals />

            {/* Compact Header */}
            <header className="bg-slate-950/40 backdrop-blur-xl border-b border-white/5 p-2.5 md:p-3 sticky top-0 z-50">
                <div className="container mx-auto max-w-5xl flex justify-between items-center gap-3">
                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                        <div className="flex-shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-500/10">
                            <FiActivity className="text-blue-500 text-sm md:text-base" />
                        </div>
                        <h1 className="font-bold text-sm md:text-lg font-moco truncate leading-tight">
                            {quiz.name}
                        </h1>
                    </div>

                    <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0 ml-auto bg-slate-900/60 p-0.5 rounded-xl border border-white/5">
                        {pendingSaves.size > 0 ? (
                            <div className="flex items-center gap-1 text-[8px] text-blue-500 font-bold uppercase tracking-widest px-2 animate-pulse">
                                <div className="w-2 h-2 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-0.5" /> Saving ({pendingSaves.size})
                            </div>
                        ) : Object.keys(selectedOptions).length > 0 && (
                            <div className="flex items-center gap-1 text-[8px] text-emerald-500 font-bold uppercase tracking-widest px-2">
                                <FiCheck className="w-2.5 h-2.5" /> All Saved
                            </div>
                        )}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/10">
                            <span className="font-mono text-[10px] md:text-xs text-orange-400 font-bold leading-none">{timeLeft}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600/10 border border-blue-500/10">
                            <FiClock className="text-blue-400 w-3 h-3" />
                            <span className="font-mono text-[10px] md:text-sm text-blue-400 font-black leading-none">{stopwatch}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content - Compact */}
            <main className="flex-1 container mx-auto p-3 md:p-5 max-w-4xl flex flex-col">
                {/* Compact Progress */}
                <div className="w-full space-y-1.5 mb-4 md:mb-6">
                    <div className="flex justify-between items-end px-1">
                        <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Q {currentQuestionIndex + 1} / {quiz.questions.length}</span>
                        <span className="text-[9px] font-black text-blue-500">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 md:h-2 rounded-full relative overflow-hidden">
                        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-700" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                {currentQuestion ? (
                    <div className="flex-1 flex flex-col space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <LiquidGlassCard colorScheme="dark" className="p-0.5" contentClassName="p-4 md:p-8">
                            <div className="space-y-5 md:space-y-8">
                                <div className="space-y-2">
                                    <h3 className="text-lg md:text-3xl font-black leading-tight tracking-tight text-white">
                                        {currentQuestion.question}
                                    </h3>
                                </div>

                                {currentQuestion.isCode && (
                                    <div className="relative">
                                        <div className="p-4 md:p-6 bg-slate-950/80 rounded-xl md:rounded-2xl border border-white/5 font-mono text-[11px] md:text-sm overflow-x-auto max-h-[300px] md:max-h-[450px]">
                                            <pre className="text-blue-300 leading-relaxed">{currentQuestion.description}</pre>
                                        </div>
                                    </div>
                                )}

                                {currentQuestion.image && (
                                    <div className="relative rounded-xl border border-white/5 overflow-hidden bg-slate-950/30 p-1.5">
                                        <img src={currentQuestion.image} alt="Q-Context" className="max-h-[180px] md:max-h-[250px] w-full object-contain mx-auto rounded-lg" />
                                    </div>
                                )}

                                <div className="grid gap-2 md:grid-cols-1">
                                    {currentQuestion.options.map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleOptionSelect(currentQuestion.id, opt.id)}
                                            className={`group relative w-full p-3.5 md:p-5 rounded-xl md:rounded-2xl border-2 text-left transition-all flex items-center justify-between active:scale-[0.99] ${selectedOptions[currentQuestion.id] === opt.id
                                                ? 'bg-blue-600/10 border-blue-500 ring-1 ring-blue-500/10'
                                                : 'bg-slate-900/40 border-white/5 hover:border-white/20 hover:bg-slate-900/60'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 md:gap-4">
                                                <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center transition-all ${selectedOptions[currentQuestion.id] === opt.id
                                                    ? 'bg-blue-600 border-blue-400 scale-105'
                                                    : 'border-white/5 bg-slate-950'
                                                    }`}>
                                                    {selectedOptions[currentQuestion.id] === opt.id && <FiCheck className="text-white w-3.5 h-3.5 md:w-4 md:h-4" />}
                                                </div>
                                                <span className={`text-sm md:text-lg transition-colors ${selectedOptions[currentQuestion.id] === opt.id ? 'text-white font-black' : 'text-slate-400 font-medium'}`}>
                                                    {opt.value}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </LiquidGlassCard>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center animate-pulse">
                        <p className="text-slate-500 text-sm">Syncing Data...</p>
                    </div>
                )}
            </main>

            {/* Compact Footer */}
            <footer className="bg-slate-950/40 backdrop-blur-xl border-t border-white/5 p-3 md:p-5 sticky bottom-0 z-50">
                <div className="container mx-auto max-w-4xl flex items-center justify-between gap-3">
                    <button
                        onClick={async () => {
                            setCurrentQuestionIndex(prev => Math.max(0, prev - 1))
                        }}
                        disabled={currentQuestionIndex === 0}
                        className="flex-shrink-0 flex items-center justify-center gap-2 px-4 md:px-6 py-3 rounded-xl bg-slate-950 border border-white/5 text-slate-500 font-bold hover:bg-slate-900 hover:text-slate-300 transition-all disabled:opacity-0"
                    >
                        <FiChevronLeft className="w-5 h-5" /> <span className="hidden sm:inline text-sm">Prev</span>
                    </button>

                    <div className="flex-1 flex justify-end items-center gap-2.5">
                        {currentQuestionIndex < quiz.questions.length - 1 ? (
                            <button
                                onClick={async () => {
                                    setCurrentQuestionIndex(prev => prev + 1)
                                }}
                                className="group w-full sm:w-auto min-w-[120px] md:min-w-[180px] flex items-center justify-center gap-2 px-6 py-3.5 md:py-4 bg-white text-slate-950 font-black rounded-xl md:rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                            >
                                <span className="text-sm md:text-base">Next</span>
                                <FiChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        ) : (
                            <button
                                onClick={async () => {
                                    setShowSubmitModal(true)
                                }}
                                disabled={finishQuizMutation.isPending}
                                className="w-full sm:w-auto min-w-[120px] md:min-w-[200px] flex items-center justify-center gap-2 px-6 py-3.5 md:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-xl md:rounded-2xl transition-all active:scale-95 disabled:opacity-50"
                            >
                                <span className="text-sm md:text-base">{finishQuizMutation.isPending ? 'Syncing...' : 'Submit'}</span>
                                <FiCheck className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </footer>

            {/* Submit Confirmation Modal */}
            {showSubmitModal && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" />
                    <div className="relative w-full max-w-sm animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                        <LiquidGlassCard colorScheme="dark" className="border-blue-500/30" contentClassName="p-8 text-center space-y-6">
                            <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/30">
                                <FiCheck className="text-blue-500 w-8 h-8" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-white font-moco">Finish Quiz?</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    You have answered <span className="text-white font-bold">{Object.keys(selectedOptions).length}</span> out of <span className="text-white font-bold">{quiz.questions.length}</span> questions.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setShowSubmitModal(false)}
                                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-xl font-bold transition-all active:scale-95"
                                >
                                    Review
                                </button>
                                <button
                                    onClick={() => finishQuizMutation.mutate()}
                                    disabled={finishQuizMutation.isPending}
                                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {finishQuizMutation.isPending ? 'Submitting...' : 'Confirm'}
                                </button>
                            </div>
                        </LiquidGlassCard>
                    </div>
                </div>
            )}
        </div>
    )
}
