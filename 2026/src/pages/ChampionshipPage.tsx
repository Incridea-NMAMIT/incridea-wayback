import { motion, AnimatePresence } from 'framer-motion';
import Glass from '../components/ui/Glass';
import SEO from '../components/SEO';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchRegistrationConfig, fetchChampionshipLeaderboard, type ChampionshipLeaderboardEntry } from '../api/public';
import { useEffect, useState } from 'react';
import { X, Trophy, Star } from 'lucide-react';

const ChampionshipPage = () => {
    const navigate = useNavigate();
    const [selectedCollege, setSelectedCollege] = useState<ChampionshipLeaderboardEntry | null>(null);

    const { data: config, isLoading: isConfigLoading } = useQuery({
        queryKey: ['registration-config'],
        queryFn: fetchRegistrationConfig,
    });

    const { data: leaderboardData, isLoading: isLeaderboardLoading } = useQuery({
        queryKey: ['championship-leaderboard'],
        queryFn: fetchChampionshipLeaderboard,
        refetchInterval: 30000, // Refresh every 30 seconds
    });

    useEffect(() => {
        if (!isConfigLoading && config && !config.showChampionship) {
            navigate("/");
        }
    }, [config, isConfigLoading, navigate]);

    if (isLeaderboardLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black/40 backdrop-blur-md">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                    <span className="text-purple-400 font-black uppercase tracking-widest text-xs">Loading Live Standings...</span>
                </div>
            </div>
        );
    }

    const leaderboard = leaderboardData?.leaderboard || [];

    // Filter for eligible colleges (3 TECH, 2 NON-TECH)
    const eligibleColleges = leaderboard.filter(c => c.eligible);

    // Get 1st and 2nd eligible colleges
    const firstEligible = eligibleColleges[0];
    const secondEligible = eligibleColleges[1];

    // Helper to get rank and medals
    const getRankInfo = (collegeId: number) => {
        // Find absolute rank in the full list
        const absoluteRank = leaderboard.findIndex(c => c.id === collegeId) + 1;

        if (firstEligible && collegeId === firstEligible.id) {
            return { rank: 1, isTopEligible: true };
        }
        if (secondEligible && collegeId === secondEligible.id) {
            return { rank: 2, isTopEligible: true };
        }
        return { rank: absoluteRank, isTopEligible: false };
    };

    const getTierColor = (tier: string) => {
        switch (tier.toUpperCase()) {
            case 'DIAMOND': return 'text-cyan-400';
            case 'GOLD': return 'text-yellow-400';
            case 'SILVER': return 'text-gray-300';
            case 'BRONZE': return 'text-orange-400';
            default: return 'text-purple-400';
        }
    };

    return (
        <div className="min-h-screen w-full relative overflow-x-hidden pt-7 pb-12 px-1 pl-3 sm:px-6 md:px-8 font-sans selection:bg-purple-500/30 text-white">
            <SEO
                title="Championship"
                description="View the current standings of the Incridea'26 Championship."
                url="/championship"
            />
            <div className="fixed inset-0 -z-10 bg-black/40" />

            <div className="max-w-6xl mx-auto relative z-10 w-full">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-3xl sm:text-2xl md:text-4xl lg:text-5xl font-black mb-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Incridea Championship
                    </h1>
                </motion.div>

                <div className="hidden xl:block w-full">
                    <div className="flex w-full mb-4 text-black font-bold text-xs md:text-sm uppercase tracking-wider items-stretch gap-3 lg:gap-4">
                        <div className="w-[48%] md:w-[49%] lg:w-[52%] xl:w-[54%] flex shrink-0">
                            <span className="relative z-10 pl-70 text-white text-sm">Details</span>
                        </div>
                        <span className="relative z-10 pl-10 text-white text-[10px] lg:text-xs xl:text-sm">Tech Events</span>
                        <span className="relative z-10 pl-12 text-white text-[10px] lg:text-xs xl:text-sm">Non-Tech Events</span>
                        <span className="relative z-10 pl-13 text-white text-sm">Total</span>
                    </div>
                </div>

                <div className="hidden xl:block space-y-3 w-full">
                    {leaderboard.map((item, index) => {
                        const { rank, isTopEligible } = getRankInfo(item.id);
                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + (index * 0.05) }}
                                className="w-full"
                                onClick={() => setSelectedCollege(item)}
                            >
                                <Glass
                                    className={`rounded-xl relative overflow-hidden group transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:brightness-110 hover:scale-[1.005] h-16 w-full flex flex-row items-stretch p-0 cursor-pointer backdrop-blur-xl border ${isTopEligible ? 'border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'border-white/20'}`}
                                    hoverEffect={true}
                                >
                                    <div className="flex w-full gap-3 lg:gap-4 h-full">
                                        <div className="w-[48%] md:w-[49%] lg:w-[52%] xl:w-[54%] shrink-0 h-full">
                                            <div className="w-155.5 backdrop-blur-[1px] relative flex flex-row items-center px-2 lg:px-6 h-full rounded-xl border-r border-white/20"
                                                style={{
                                                    background: isTopEligible ?
                                                        `linear-gradient(to top, rgba(234, 179, 8, 0.2), transparent 70%), rgba(234, 179, 8, 0.05)` :
                                                        `linear-gradient(to top, rgba(0, 0, 0, 0.55), transparent 60%), rgba(139, 92, 246, 0.20)`,
                                                    boxShadow: `inset 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.22)`,
                                                    backdropFilter: "brightness(1.1) blur(1px)",
                                                    WebkitBackdropFilter: "brightness(1.1) blur(1px)",
                                                }}>
                                                <div className="flex flex-row items-center gap-1.5 lg:gap-3 w-full h-full min-w-0">
                                                    <div className="shrink-0 w-7 lg:w-8 flex items-center justify-center">
                                                        {rank === 1 && <img src="/leaderboard/gold-medal.png" alt="1st" className="w-6 lg:w-7 object-contain drop-shadow-md" />}
                                                        {rank === 2 && <img src="/leaderboard/silver-medal.png" alt="2nd" className="w-6 lg:w-7 object-contain drop-shadow-md" />}
                                                        {rank === 3 && <img src="/leaderboard/bronze-medal.png" alt="3rd" className="w-6 lg:w-7 object-contain drop-shadow-md" />}
                                                        {rank > 3 && (
                                                            <div className="w-7 lg:w-8 h-7 lg:h-8 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center border border-white/20 text-white font-bold text-sm lg:text-base">
                                                                {rank}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0 flex flex-col justify-center h-full py-1">
                                                        <h3 className="text-[10px] lg:text-xs xl:text-sm font-bold text-white leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                                                            {item.college}
                                                        </h3>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 flex pl-19 flex-row items-center h-full gap-30 lg:gap-4 min-w-0">
                                            <div className="flex-1 flex pl-7 justify-center items-center h-full">
                                                <span className="text-base md:text-lg font-bold text-white/90">{item.techEvents}</span>
                                            </div>
                                            <div className="flex-1 flex pl-32 justify-center items-center h-full">
                                                <span className="text-base md:text-lg font-bold text-white/90">{item.nonTechEvents}</span>
                                            </div>
                                            <div className="w-24 lg:w-36 pl-31 flex justify-center items-center gap-1.5 shrink-0 h-full">
                                                <span className={`text-sm lg:text-base xl:text-lg font-black drop-shadow-md ${isTopEligible ? 'text-yellow-400' : 'text-white'}`}>{item.total}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Glass>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="xl:hidden space-y-2 sm:space-y-3 w-full">
                    {leaderboard.map((item, index) => {
                        const { rank, isTopEligible } = getRankInfo(item.id);
                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.08 }}
                                className="w-full"
                                onClick={() => setSelectedCollege(item)}
                            >
                                <div
                                    className={`relative overflow-hidden backdrop-blur-xl border rounded-xl sm:rounded-2xl shadow-[0_4px_16px_0_rgba(139,92,246,0.1)] transition-all duration-300 active:scale-[0.98] ${isTopEligible ? 'border-yellow-500/50 bg-yellow-400/5' : 'border-white/20 bg-black/20'}`}
                                    style={{
                                        backdropFilter: "blur(16px) saturate(180%)",
                                        WebkitBackdropFilter: "blur(16px) saturate(180%)",
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-purple-500/5 opacity-40"></div>
                                    <div className="relative z-10 p-2 sm:p-2.5 md:p-3">
                                        <div className="flex items-center justify-between gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                                            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                                <div className="relative flex-shrink-0">
                                                    {rank === 1 && (
                                                        <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center relative">
                                                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-yellow-600/30 rounded-full blur-md animate-pulse"></div>
                                                            <img src="/leaderboard/gold-medal.png" alt="1st" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 object-contain drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] relative z-10" />
                                                        </div>
                                                    )}
                                                    {rank === 2 && (
                                                        <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center relative">
                                                            <div className="absolute inset-0 bg-gradient-to-br from-gray-300/30 to-gray-500/30 rounded-full blur-md animate-pulse"></div>
                                                            <img src="/leaderboard/silver-medal.png" alt="2nd" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 object-contain drop-shadow-[0_0_8px_rgba(192,192,192,0.8)] relative z-10" />
                                                        </div>
                                                    )}
                                                    {rank === 3 && (
                                                        <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center relative">
                                                            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 to-orange-600/30 rounded-full blur-md animate-pulse"></div>
                                                            <img src="/leaderboard/bronze-medal.png" alt="3rd" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 object-contain drop-shadow-[0_0_8px_rgba(205,127,50,0.8)] relative z-10" />
                                                        </div>
                                                    )}
                                                    {rank > 3 && (
                                                        <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 shadow-lg">
                                                            <span className="font-black text-white text-sm sm:text-base md:text-lg drop-shadow-md">{rank}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-white text-xs sm:text-[11px] md:text-xs leading-snug drop-shadow-md line-clamp-2">
                                                        {item.college}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-1.5 sm:pt-2 border-t border-white/20">
                                            <div className="relative overflow-hidden rounded-md sm:rounded-lg p-1.5 sm:p-2 border border-purple-400/30 bg-black/10 backdrop-blur-md">
                                                <div className="relative z-10 flex items-center justify-between gap-2">
                                                    <div className="flex-1 text-center">
                                                        <p className="text-base sm:text-lg md:text-xl font-black text-white drop-shadow-md mb-0.5">{item.techEvents}</p>
                                                        <p className="text-[9px] sm:text-[8px] md:text-[9px] text-purple-300/80 uppercase tracking-wider font-semibold">Tech</p>
                                                    </div>
                                                    <div className="w-px h-6 sm:h-8 md:h-10 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
                                                    <div className="flex-1 text-center">
                                                        <p className="text-base sm:text-lg md:text-xl font-black text-white drop-shadow-md mb-0.5">{item.nonTechEvents}</p>
                                                        <p className="text-[9px] sm:text-[8px] md:text-[9px] text-blue-300/80 uppercase tracking-wider font-semibold">Non-Tech</p>
                                                    </div>
                                                    <div className="w-px h-6 sm:h-8 md:h-10 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
                                                    <div className="flex-1 text-center">
                                                        <p className="text-base sm:text-lg md:text-xl font-black text-white drop-shadow-md mb-0.5">{item.total}</p>
                                                        <p className="text-[9px] sm:text-[8px] md:text-[9px] text-cyan-300/90 uppercase tracking-wider font-semibold">Total</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Winner Details Modal */}
            <AnimatePresence>
                {selectedCollege && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCollege(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl overflow-hidden"
                        >
                            <Glass className="rounded-2xl border border-white/20 shadow-2xl overflow-hidden min-h-[400px] flex flex-col">
                                {/* Modal Header */}
                                <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/40">
                                            <Trophy className="w-5 h-5 text-purple-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-lg sm:text-xl font-black text-white leading-tight line-clamp-1">{selectedCollege.college}</h2>
                                            <p className="text-xs text-purple-300/70 font-bold uppercase tracking-widest">Victory Log</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedCollege(null)}
                                        className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Modal Body */}
                                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 custom-scrollbar max-h-[60vh]">
                                    {selectedCollege.wonEvents.length > 0 ? (
                                        selectedCollege.wonEvents.map((event, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="group relative p-3 sm:p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                                            >
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${getTierColor(event.tier)} border-current bg-black/20`}>
                                                                {event.tier}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-white/50 uppercase tracking-tighter">
                                                                {event.type.replace('_', ' ')}
                                                            </span>
                                                        </div>
                                                        <h4 className="text-sm sm:text-base font-bold text-white leading-snug truncate">
                                                            {event.eventName}
                                                        </h4>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg sm:text-xl font-black text-purple-400">+{event.points}</p>
                                                        <p className="text-[8px] sm:text-[10px] text-white/30 font-bold uppercase">Points</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                                            <Star className="w-12 h-12 text-white/10 mb-4 animate-pulse" />
                                            <p className="text-white/40 font-bold">No registered wins found yet.</p>
                                            <p className="text-white/20 text-xs">Points may be from participation only.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Modal Footer */}
                                <div className="p-4 sm:p-6 border-t border-white/10 bg-black/40 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Accumulated Points</span>
                                        <span className="text-2xl font-black text-white">{selectedCollege.total}</span>
                                    </div>
                                    <button
                                        onClick={() => setSelectedCollege(null)}
                                        className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-sm shadow-lg hover:shadow-purple-500/20 active:scale-95 transition-all"
                                    >
                                        Close
                                    </button>
                                </div>
                            </Glass>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChampionshipPage;
