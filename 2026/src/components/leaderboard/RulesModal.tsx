import { createPortal } from "react-dom";
import { X } from "lucide-react";
import Glass from "../ui/Glass";

interface RulesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RulesModal({ isOpen, onClose }: RulesModalProps) {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 md:p-5">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={onClose}
            />

            <div className="relative w-full max-w-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all border border-white/5"
                >
                    <X size={20} />
                </button>
                <Glass
                    className="max-h-[85vh] overflow-y-auto rounded-[2rem] border border-white/10 p-6 sm:p-8 custom-scrollbar"
                    hoverEffect={false}
                >
                    <div className="text-center mb-8">
                        <h2 className="text-2xl sm:text-3xl font-moco text-white mb-2">
                            How It Works
                        </h2>
                        <p className="text-gray-400 text-sm sm:text-base">
                            Earn XP, climb ranks, and win rewards!
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* 1. Prizes */}
                        <h3 className="text-lg font-bold text-white mb-2">Prizes</h3>
                        <p className="text-gray-400 text-sm mb-3">
                            The ultimate battle for glory! Top 5 players will win Amazon Vouchers worth:
                        </p>

                        <div className="space-y-2 text-sm text-gray-300 bg-black/20 p-4 rounded-lg border border-white/5 mb-8">
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2"><span className="font-bold text-lg text-yellow-400">1st</span> Place</span>
                                <span className="font-bold text-green-400 text-lg">₹3000</span>
                            </div>
                            <div className="h-px bg-white/5 w-full"></div>
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2"><span className="font-bold text-gray-300">2nd</span> Place</span>
                                <span className="font-bold text-green-400">₹2000</span>
                            </div>
                            <div className="h-px bg-white/5 w-full"></div>
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2"><span className="font-bold text-orange-400">3rd</span> Place</span>
                                <span className="font-bold text-green-400">₹1000</span>
                            </div>
                            <div className="h-px bg-white/5 w-full"></div>
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2"><span className="font-bold text-white/70">4th</span> Place</span>
                                <span className="font-bold text-green-400">₹600</span>
                            </div>
                            <div className="h-px bg-white/5 w-full"></div>
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2"><span className="font-bold text-white/50">5th</span> Place</span>
                                <span className="font-bold text-green-400">₹400</span>
                            </div>
                        </div>

                        {/* 1. Daily Quiz */}

                        <h3 className="text-lg font-bold text-white mb-2">Quiz</h3>
                        <p className="text-gray-400 text-sm mb-3">
                            Test your knowledge with quick quizzes.
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-300 marker:text-blue-400">
                            <li><strong>50 XP</strong> per correct answer</li>
                            <li><strong>3 Hour</strong> cooldown between attempts</li>
                        </ul>
                        {/* 2. Tasks */}

                        <h3 className="text-lg font-bold text-white mb-2">Tasks</h3>
                        <p className="text-gray-400 text-sm mb-3">
                            Complete challenges to earn XP.
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-300 marker:text-purple-400">
                            <li><strong>100 XP max points</strong> if completed immediately without hint</li>
                            <li>Points drop linearly over the <strong>30-minute</strong> limit</li>
                            <li>Taking a hint reduces your max points to <strong>75%</strong></li>
                            <li>Minimum <strong>10 XP</strong> guaranteed for completing before expiry</li>
                            <li><strong>6 Hour</strong> cooldown after completion</li>
                            <li className="text-yellow-400 font-semibold mt-2"><strong>Tip:</strong> Keep an eye out for physical tasks on campus during Incridea to gain massive XP boosts! <strong>(Coming soon)</strong></li>
                        </ul>
                        {/* 3. Events */}

                        <h3 className="text-lg font-bold text-white mb-2">Events</h3>
                        <p className="text-gray-400 text-sm mb-3">
                            Participate effectively in Incridea events.
                        </p>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-black/20 p-2 rounded-lg text-center border border-white/5">
                                <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Register*</div>
                                <div className="font-bold text-white text-lg">+10 XP</div>
                            </div>
                            <div className="bg-black/20 p-2 rounded-lg text-center border border-white/5">
                                <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Attend</div>
                                <div className="font-bold text-white text-lg">+20 XP</div>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-300 bg-black/20 p-3 rounded-lg border border-white/5">
                            <div className="flex justify-between items-center">
                                <span>Winner</span>
                                <span className="font-bold text-yellow-400">+30 XP</span>
                            </div>
                            <div className="h-px bg-white/5 w-full"></div>
                            <div className="flex justify-between items-center">
                                <span>Runner Up</span>
                                <span className="font-bold text-gray-300">+20 XP</span>
                            </div>
                            <div className="h-px bg-white/5 w-full"></div>
                            <div className="flex justify-between items-center">
                                <span>2nd Runner Up</span>
                                <span className="font-bold text-orange-400">+10 XP</span>
                            </div>
                        </div>

                        <p className="text-xs text-yellow-500/80 mt-3 text-center font-semibold bg-yellow-500/10 p-2 rounded-lg border border-yellow-500/20 mb-6">
                            *Registration XP is removed if you do not attend by the time the event winner is announced.<br></br> Therefore don't register just to gain XP.
                        </p>



                        <div className="text-center pt-4">
                            <button
                                onClick={onClose}
                                className="px-8 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/10"
                            >
                                Got it!
                            </button>
                        </div>

                    </div>
                </Glass>
            </div>
        </div>,
        document.body
    );
}
