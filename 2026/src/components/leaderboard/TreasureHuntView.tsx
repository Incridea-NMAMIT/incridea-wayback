import { useState, useCallback } from 'react';
import Glass from '../ui/Glass';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { Loader2, Sparkles, CheckCircle2, HelpCircle, Trophy, LogIn } from 'lucide-react';
import { showToast } from '../../utils/toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import QrScanner from '../ui/QrScanner';
import { ScanLine } from 'lucide-react';

interface Treasure {
    id: string;
    riddle: string;
    hint?: string;
    isSolved: boolean;
    isHintRevealed: boolean;
    solvedByMe: boolean;
    solvedAt?: string | null;
}

const RiddleCard = ({ treasure, onOpenScanner, onRevealHint, user }: { treasure: Treasure, onOpenScanner: () => void, onRevealHint: () => void, user: any }) => {
    const [showHint, setShowHint] = useState(treasure.isHintRevealed);
    const navigate = useNavigate();

    return (
        <Glass className={`p-6 rounded-3xl border-purple-500/20 relative overflow-hidden transition-all duration-300 `}>
            {treasure.solvedByMe && (
                <div className="absolute top-0 right-0 p-4 text-green-500/20">
                    <Trophy size={80} />
                </div>
            )}

            <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${treasure.solvedByMe ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>
                            {treasure.solvedByMe ? <CheckCircle2 size={18} /> : <Sparkles size={18} />}
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Riddle</span>
                    </div>
                    {treasure.solvedByMe && (
                        <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-bold uppercase tracking-tighter">Solved By You</span>
                    )}
                    {treasure.isSolved && !treasure.solvedByMe && (
                        <span className="text-[10px] bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full font-bold uppercase tracking-tighter">Claimed</span>
                    )}
                </div>

                <p className="text-lg text-gray-100 font-medium italic leading-relaxed">
                    "{treasure.riddle}"
                </p>

                {!treasure.solvedByMe && (
                    <div className="pt-2 space-y-4">
                        {treasure.hint && (
                            <div>
                                <button
                                    onClick={() => {
                                        if (!showHint && !treasure.isHintRevealed) {
                                            onRevealHint();
                                        }
                                        setShowHint(!showHint);
                                    }}
                                    className={`${treasure.isHintRevealed ? 'text-purple-400' : 'text-gray-400'} text-xs hover:text-purple-300 transition-colors flex items-center gap-1.5`}
                                >
                                    <HelpCircle size={14} />
                                    {showHint ? "Hide Hint" : (treasure.isHintRevealed ? "View Hint" : "Need a hint?")}
                                </button>
                                {showHint && (
                                    <div className="mt-2 p-3 rounded-xl bg-purple-900/20 border border-purple-500/10 text-purple-200 text-xs animate-in fade-in slide-in-from-top-1 duration-300">
                                        <span className="font-bold mr-1">Hint:</span>
                                        {treasure.hint}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => {
                                    if (!user) {
                                        navigate('/login');
                                    } else {
                                        onOpenScanner();
                                    }
                                }}
                                disabled={(treasure.isSolved && !treasure.solvedByMe)}
                                className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold py-3 rounded-2xl transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 group"
                            >
                                {user ? (
                                    <>
                                        <ScanLine size={18} className="group-hover:scale-110 transition-transform" />
                                        Scan Code to Solve
                                    </>
                                ) : (
                                    <>
                                        <LogIn size={18} />
                                        Login to Solve
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {treasure.solvedByMe && (
                    <div className="pt-2">
                        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-between">
                            <span className="text-green-400 text-xs font-bold">Points Earned</span>
                            <span className="text-green-400 text-sm font-black">+150 XP</span>
                        </div>
                    </div>
                )}
            </div>
        </Glass>
    );
};

const TreasureHuntView = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [showScanner, setShowScanner] = useState(false);

    const { data: treasures, isLoading } = useQuery<Treasure[]>({
        queryKey: ['treasure-hunt'],
        queryFn: async () => {
            const { data } = await apiClient.get('/treasure-hunt');
            return data;
        }
    });

    const revealHintMutation = useMutation({
        mutationFn: async (id: string) => {
            const { data } = await apiClient.patch(`/treasure-hunt/reveal-hint/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['treasure-hunt'] });
        }
    });

    const mutation = useMutation({
        mutationFn: async (code: string) => {
            const { data } = await apiClient.post('/treasure-hunt/submit', { code });
            return data;
        },
        onSuccess: (data) => {
            showToast(data.message || "Treasure found!", "success");
            queryClient.invalidateQueries({ queryKey: ['treasure-hunt'] });
            queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
        },
        onError: (error: any) => {
            showToast(error.response?.data?.message || "Invalid code or already claimed", "error");
        }
    });

    const handleScan = useCallback((code: string) => {
        mutation.mutate(code);
        setShowScanner(false);
    }, [mutation]);

    const handleCloseScanner = useCallback(() => {
        setShowScanner(false);
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (!treasures || treasures.length === 0) {
        return (
            <div className="max-w-2xl mx-auto mt-10 px-4">
                <Glass className="p-10 text-center rounded-3xl border-purple-500/20">
                    <HelpCircle className="w-16 h-16 mx-auto mb-4 text-gray-500 opacity-50" />
                    <h2 className="text-2xl font-moco mb-2 uppercase tracking-widest">No Active Riddles</h2>
                    <p className="text-gray-400">The treasure hunters haven't hidden anything yet. Check back soon!</p>
                </Glass>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto mt-4 px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                            <Sparkles size={24} />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-moco tracking-wider uppercase">Treasure Hunt</h2>
                    </div>
                    <p className="text-gray-400 text-sm max-w-md">
                        Find hidden codes around the campus or website to claim your XP reward!
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-center">
                        <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Solved</div>
                        <div className="text-xl font-moco text-purple-400">
                            {treasures.filter(t => t.solvedByMe).length}/{treasures.length}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                {treasures.map((treasure) => (
                    <RiddleCard
                        key={treasure.id}
                        treasure={treasure}
                        onOpenScanner={() => setShowScanner(true)}
                        onRevealHint={() => revealHintMutation.mutate(treasure.id)}
                        user={user}
                    />
                ))}
            </div>

            {showScanner && (
                <QrScanner
                    title="Scan Treasure Code"
                    description="Place the code within the frame to solve the riddle"
                    onScan={handleScan}
                    onClose={handleCloseScanner}
                />
            )}
        </div>
    );
};

export default TreasureHuntView;
