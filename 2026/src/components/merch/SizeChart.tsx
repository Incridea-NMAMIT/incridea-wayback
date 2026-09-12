import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler } from "lucide-react";
import LiquidGlassCard from "../liquidglass/LiquidGlassCard";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";

const SizeChart = () => {
    const [isOpen, setIsOpen] = useState(false);
    useBodyScrollLock(isOpen);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="flex justify-start w-full mt-2 mb-2">
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-[#a78bfa] border border-[#a78bfa]/30 rounded-lg hover:bg-[#a78bfa]/10 transition-colors"
                type="button"
            >
                <Ruler className="w-4 h-4" />
                Size Chart
            </button>

            {mounted && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        >
                            <motion.div
                                className="w-full max-w-2xl sm:max-w-3xl relative mx-auto my-auto flex flex-col justify-center max-h-[100dvh]"
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <LiquidGlassCard className="p-4 sm:p-6 w-full relative max-h-[85vh] overflow-y-auto flex flex-col">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 hover:bg-white/10 rounded-lg transition-colors z-10 cursor-pointer"
                                        aria-label="Close size chart modal"
                                    >
                                        <X className="w-5 h-5 text-gray-400 hover:text-white" />
                                    </button>

                                    <div className="mb-4 pr-8">
                                        <h2 className="text-xl sm:text-2xl font-bold text-white uppercase font-mono tracking-tight flex items-center gap-2">
                                            <div className="w-2 h-2 bg-[#a78bfa] rotate-45" />
                                            Size Chart (Inches)
                                        </h2>
                                        <p className="text-gray-400 text-xs sm:text-sm mt-1">
                                            AOP Men's Round Neck HS T-Shirt
                                        </p>
                                    </div>

                                    <div className="w-full overflow-x-auto border border-slate-700/50 rounded-lg bg-black/40">
                                        <table className="w-full text-xs sm:text-sm text-left text-slate-300 border-collapse mx-auto">
                                            <thead className="text-xs text-white bg-slate-800/50 uppercase border-b border-slate-700/50">
                                                <tr>
                                                    <th scope="col" className="px-3 py-2 sm:px-4 sm:py-3 font-medium">Measurement</th>
                                                    <th scope="col" className="px-2 py-2 sm:px-3 sm:py-3 text-center">XS</th>
                                                    <th scope="col" className="px-2 py-2 sm:px-3 sm:py-3 text-center">S</th>
                                                    <th scope="col" className="px-2 py-2 sm:px-3 sm:py-3 text-center">M</th>
                                                    <th scope="col" className="px-2 py-2 sm:px-3 sm:py-3 text-center">L</th>
                                                    <th scope="col" className="px-2 py-2 sm:px-3 sm:py-3 text-center">XL</th>
                                                    <th scope="col" className="px-2 py-2 sm:px-3 sm:py-3 text-center">2XL</th>
                                                    <th scope="col" className="px-2 py-2 sm:px-3 sm:py-3 text-center">3XL</th>
                                                    <th scope="col" className="px-2 py-2 sm:px-3 sm:py-3 text-center">4XL</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                                                    <th scope="row" className="px-3 py-2 sm:px-4 sm:py-3 font-medium text-slate-200 whitespace-nowrap">Length</th>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">25</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">26</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">27</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">27</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">28</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">29</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">30</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">31</td>
                                                </tr>
                                                <tr className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                                                    <th scope="row" className="px-3 py-2 sm:px-4 sm:py-3 font-medium text-slate-200 whitespace-nowrap">Chest</th>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">36</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">38</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">40</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">42</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">44</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">46</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">48</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">50</td>
                                                </tr>
                                                <tr className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                                                    <th scope="row" className="px-3 py-2 sm:px-4 sm:py-3 font-medium text-slate-200 whitespace-nowrap">Shoulder</th>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">15</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">16</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">17</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">18</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">19</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">20</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">21</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">22</td>
                                                </tr>
                                                <tr className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                                                    <th scope="row" className="px-3 py-2 sm:px-4 sm:py-3 font-medium text-slate-200 whitespace-nowrap">Sleeve Open</th>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">5</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">5.5</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">6</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">6.5</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">7</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">7.5</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">8</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">8.5</td>
                                                </tr>
                                                <tr className="hover:bg-slate-800/30 transition-colors">
                                                    <th scope="row" className="px-3 py-2 sm:px-4 sm:py-3 font-medium text-slate-200 whitespace-nowrap">Sleeve Length</th>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">7</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">7.5</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">8</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">8</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">8.5</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">9</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">9.5</td>
                                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">10</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </LiquidGlassCard>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
                , document.body)}
        </div>
    );
};

export default SizeChart;
