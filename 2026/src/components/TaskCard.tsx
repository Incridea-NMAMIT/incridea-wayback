import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock } from 'lucide-react';
import LiquidGlassCard from './liquidglass/LiquidGlassCard';
import ConfirmHintModal from './leaderboard/ConfirmHintModal';
import { createPortal } from 'react-dom';

interface TaskCardProps {
    taskId: string;
    title: string;
    description: string;
    xp: number;
    isCompleted: boolean;
    actionUrl: string;
    hasHint?: boolean;
    hintTaken?: boolean;
    hint?: string;
    onRevealHint?: () => void;
    isRevealingHint?: boolean;
}

const TaskCard = ({ taskId, title, description, xp, isCompleted, hasHint, hintTaken, hint, onRevealHint, isRevealingHint }: TaskCardProps) => {
    const [showRiddle, setShowRiddle] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);


    const handleRiddleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowRiddle(!showRiddle);
    };

    const handleHintClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowConfirmModal(true);
    };

    const handleConfirmReveal = () => {
        if (onRevealHint) onRevealHint();
        setShowConfirmModal(false);
    };

    return (
        <>
            <LiquidGlassCard
                data-task-id={taskId}
                onClick={handleRiddleToggle}
                className={`w-full transition-all duration-300 ${!isCompleted ? 'cursor-pointer group' : ''}`}
            >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full px-4 sm:px-6 py-4 gap-4">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-xl font-semibold text-fuchsia-300 flex items-center gap-2 flex-wrap">
                            {title}
                            {isCompleted && <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full">Completed</span>}
                        </h3>

                        <div className="mt-1 space-y-2">
                            {showRiddle ? (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="cursor-text"
                                >
                                    <p className="text-gray-400 text-sm mt-2">{description}</p>


                                </motion.div>
                            ) : (
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={handleRiddleToggle}
                                        className="
                                            px-4 py-1.5 rounded-md
                                            bg-[#5b21b6] hover:bg-[#4c1d95]
                                            text-white font-bold tracking-wider text-xs
                                            uppercase
                                            transition-all duration-300
                                            skew-x-[-10deg]
                                            cursor-pointer
                                        "
                                    >
                                        <span className="block skew-x-10">Show Riddle</span>
                                    </button>
                                </div>
                            )}

                            {/* HINT UI */}
                            {!isCompleted && hasHint && (
                                <div className="mt-2">
                                    {hintTaken ? (
                                        <div
                                            onClick={(e) => e.stopPropagation()}
                                            className="text-xs text-yellow-500/80 bg-yellow-500/10 border border-yellow-500/20 p-2 rounded-md cursor-text"
                                        >
                                            <span className="font-bold">Hint:</span> {hint}
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleHintClick}
                                            disabled={isRevealingHint}
                                            className="text-xs text-yellow-500 hover:text-yellow-400 underline decoration-yellow-500/50 hover:decoration-yellow-400"
                                        >
                                            {isRevealingHint ? "Revealing..." : "Need a Hint? (-25 gem)"}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                            <img
                                src="/leaderboard/diamond-removebg-preview.png"
                                alt="XP"
                                className="w-4 h-4"
                                draggable={false}
                                onContextMenu={(e) => e.preventDefault()}
                            />
                            <span className={isCompleted ? "text-gray-400" : "text-cyan-400 font-bold"}>
                                {xp} XP
                            </span>
                        </div>
                    </div>

                    {isCompleted ? (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex flex-col items-center justify-center text-green-400 flex-shrink-0"
                        >
                            <CheckCircle2 size={28} className="sm:w-8 sm:h-8" />
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex flex-col items-center justify-center text-yellow-500/50 group-hover:text-yellow-400 transition-colors flex-shrink-0"
                            title="Pending"
                        >
                            <Clock size={28} className="sm:w-8 sm:h-8" />
                        </motion.div>
                    )}
                </div>
            </LiquidGlassCard>

            {/* Portal the modal to body to ensure it breaks out of any containers */}
            {createPortal(
                <ConfirmHintModal
                    isOpen={showConfirmModal}
                    onClose={() => setShowConfirmModal(false)}
                    onConfirm={handleConfirmReveal}
                    isLoading={isRevealingHint}
                />,
                document.body
            )}
        </>
    );
};

export default TaskCard;
