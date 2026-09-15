import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Slider from '../components/ui/Slider';
import Glass from '../components/ui/Glass';
import QuizModal from '../components/leaderboard/QuizModal';
import QuizView from '../components/leaderboard/QuizView';
import TaskView from '../components/leaderboard/TaskView';
import Crown from '../components/leaderboard/Crown';
import CountdownTimer from '../components/leaderboard/CountdownTimer';
import { useQuery } from '@tanstack/react-query';
import { fetchLeaderboard } from '../api/leaderboard';
import { getDailyQuizStatus } from '../api/leaderboardQuiz';
import { getTaskStatus } from '../api/task';
import { fetchRegistrationConfig } from '../api/public';
import { useAuth } from '../hooks/useAuth';
import { Loader2, Info } from 'lucide-react';
import RulesModal from '../components/leaderboard/RulesModal';
import SEO from '../components/SEO';
import LiquidGlassCard from '../components/liquidglass/LiquidGlassCard';
import TreasureHuntView from '@/components/leaderboard/TreasureHuntView';

const TABS = ["quiz", "leaderboard", "task", "treasure"] as const;
type Tab = (typeof TABS)[number];

const Leaderboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const tabFromState = (location.state as { tab?: Tab } | null)?.tab;
    return tabFromState && TABS.includes(tabFromState) ? tabFromState : 'leaderboard';
  });
  const [showQuiz, setShowQuiz] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const { user } = useAuth();


  const { data: config, isLoading: isConfigLoading } = useQuery({
    queryKey: ['registration-config'],
    queryFn: fetchRegistrationConfig,
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboard,
    retry: false,
    enabled: !!config?.showLeaderboard,
  });

  useEffect(() => {
    if (!isConfigLoading && config && !config.showLeaderboard) {
      navigate("/");
    }
  }, [config, isConfigLoading, navigate]);

  useEffect(() => {
    if (isError) {
      navigate("/login");
    }
  }, [isError, navigate]);

  useEffect(() => {
    const tabFromState = (location.state as { tab?: Tab } | null)?.tab;
    if (tabFromState && TABS.includes(tabFromState)) {
      setActiveTab(tabFromState);
    }
  }, [location.state]);

  const leaderboardData = data?.leaderboard || [];
  const currentUser = data?.currentUser;

  const rank1 = leaderboardData.find(u => u.rank === 1);
  const rank2 = leaderboardData.find(u => u.rank === 2);
  const rank3 = leaderboardData.find(u => u.rank === 3);

  const hasPodium = !!(rank1 || rank2 || rank3);

  // Get users for list (only ranks 4-10)
  const listUsers = leaderboardData.filter(u => u.rank > 3 && u.rank <= 10);

  const glassCardStyle = {
    borderRadius: "1.75rem",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    background: `
      linear-gradient(to top, rgba(0, 0, 0, 0.20), transparent 60%),
      rgba(21, 21, 21, 0.30)
    `,
    boxShadow: `
      inset 0 0 0 1px rgba(255, 255, 255, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.22)
    `,
    backdropFilter: "brightness(1.1) blur(1px)",
    WebkitBackdropFilter: "brightness(1.1) blur(1px)",
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'leaderboard') {
      refetch();
    }
  };

  const { data: quizStatus } = useQuery({
    queryKey: ['quiz-status'],
    queryFn: getDailyQuizStatus,
    enabled: !!currentUser, // Only fetch if user is logged in
    refetchInterval: 1000 * 60 // Refetch every minute
  });


  const { data: taskStatus, refetch: refetchTaskStatus, isLoading: isTaskLoading } = useQuery({
    queryKey: ['taskStatus', user?.id],
    queryFn: getTaskStatus,
    enabled: !!user?.pid,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return false;
      if (data.status === 'ACTIVE' || data.status === 'COOLDOWN') return 10000;
      return false;
    }
  });

  const nextAttemptTime = quizStatus?.nextAttemptTime ? new Date(quizStatus.nextAttemptTime) : null;
  const canAttempt = quizStatus?.canAttempt ?? false;

  let taskTargetDate: Date | null = null;
  if (taskStatus?.status === 'ACTIVE' && taskStatus.task.expiresAt) {
    taskTargetDate = new Date(taskStatus.task.expiresAt);
  } else if (taskStatus?.status === 'COOLDOWN') {
    taskTargetDate = new Date(taskStatus.cooldownEnds);
  }

  const closeQuiz = () => {
    setShowQuiz(false);
  };

  return (
    <>
      <SEO
        title="Leaderboard"
        description="Check out the leaderboard for Incridea'26."
        url="/leaderboard"
      />
      <style>{`
        @keyframes drop {
          0% { transform: translateY(-800px); opacity: 0; }
          60% { transform: translateY(20px); opacity: 1; }
          80% { transform: translateY(-10px); }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes cloudAppear {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes smokeBurst {
          0% { transform: scale(0.1) translate(0, 0); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: scale(5) translate(0, -400px); opacity: 0; }
        }
        @keyframes smokeLeft {
          0% { transform: scale(0.1) translate(0, 0); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: scale(4) translate(-400px, -300px); opacity: 0; }
        }
        @keyframes smokeRight {
          0% { transform: scale(0.1) translate(0, 0); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: scale(4) translate(400px, -300px); opacity: 0; }
        }
        @keyframes smokeBottomLeft {
          0% { transform: scale(0.1) translate(0, 0); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: scale(3.5) translate(-350px, 100px); opacity: 0; }
        }
        @keyframes smokeBottomRight {
          0% { transform: scale(0.1) translate(0, 0); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: scale(3.5) translate(350px, 100px); opacity: 0; }
        }
        /* ✅ Character float animation */
        @keyframes floaty {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>

      {/* Background Image */}


      {/* Main Container */}
      <LiquidGlassCard className="w-full text-white p-2 sm:p-3 md:p-6 font-sans selection:bg-transparent min-h-[100svh] relative overflow-x-hidden">

        {/* Render Quiz Modal */}
        <QuizModal isOpen={showQuiz} onClose={closeQuiz} />

        {/* Render Rules Modal */}
        <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />

        <div className={`transition-all duration-300 ${showQuiz || showRules ? 'blur-md brightness-[0.4] pointer-events-none' : ''}`}>
          <div className={`max-w-[1700px] mx-auto ${activeTab === 'leaderboard' ? (hasPodium ? '-mb-35' : 'mb-4') : 'mb-8'} sm:mb-24 md:mb-32 lg:mb-40 px-2 sm:px-4 md:px-0`}>
            <div className="flex justify-center mb-4 sm:mb-5 md:mb-6">
              <div className="relative inline-flex items-center">
                <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-moco text-white mb-2 bg-clip-text text-transparent px-8 sm:px-0">
                  LEADERBOARD
                </h1>
                <button
                  onClick={() => setShowRules(true)}
                  className="absolute right-0 sm:-right-12 lg:-right-16 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-all"
                  title="Rules & Regulations"
                >
                  <Info size={18} className="sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            <CountdownTimer />

            <Slider
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              quizNextAttempt={nextAttemptTime}
              taskTargetDate={taskTargetDate}
              showTreasureHunt={config?.showTreasureHunt}
            />
          </div>

          {/* Tab Content */}
          {activeTab === 'quiz' && <QuizView onStart={() => setShowQuiz(true)} canAttempt={canAttempt} nextAttemptTime={nextAttemptTime} user={user} />}
          {activeTab === 'task' && <TaskView taskStatus={taskStatus} isLoading={isTaskLoading} refetch={refetchTaskStatus} />}
          {config?.showTreasureHunt && activeTab === 'treasure' && <TreasureHuntView />}

          {/* Leaderboard Content - Podium, Stats, and Top Performers */}
          {activeTab === 'leaderboard' && (
            <>
              {isLoading ? (
                <div className="flex justify-center items-center h-96">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="max-w-[1850px] mx-auto mb-4 sm:mb-6 md:mb-9 px-6 sm:px-8 md:px-20 lg:px-32">
                    <div className="flex justify-center items-end gap-6 sm:gap-10 md:gap-16 lg:gap-24 relative scale-[0.5] sm:scale-[0.65] md:scale-100 origin-bottom my-2 sm:my-0 md:my-0" style={{ perspective: '1200px' }}>

                      {/* Rank 2 */}
                      {rank2 && (
                        <div className="flex flex-col items-center animate-[drop_0.7s_ease-out_both]" style={{ transform: 'translateZ(-20px)', transformStyle: 'preserve-3d' }}>
                          <div className="relative mb-2 sm:mb-3 md:mb-4 group cursor-pointer">
                            <img src={rank2.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${rank2.name}`} alt={rank2.name} className="relative w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full border-3 md:border-4 border-gray-400/50 object-cover" draggable={false} onContextMenu={(e) => e.preventDefault()} />
                          </div>
                          <h3 className="font-bold text-sm sm:text-base mb-1 sm:mb-2">{rank2.name}{currentUser && rank2.rank === currentUser.rank && ' (You)'}</h3>

                          <div className="relative w-40 h-49 bg-gradient-to-b from-gray-400/50 to-gray-700/50 border-t-4 border-x-2 border-gray-300/70 rounded-t-2xl backdrop-blur-xl"
                            style={{ transform: 'translateZ(15px) rotateY(-3deg) scaleX(0.95)', transformOrigin: 'bottom', transformStyle: 'preserve-3d' }}>
                            <div className="absolute -right-2 top-0 bottom-0 w-6 bg-gradient-to-b from-gray-500/90 to-gray-800/90 rounded-tr-2xl" style={{ transform: 'rotateY(12deg) translateX(1px)', transformOrigin: 'left', clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 0% 100%)' }}></div>
                            <div className="absolute -left-2 top-0 bottom-0 w-6 bg-gradient-to-b from-gray-400/80 to-gray-700/80 rounded-tl-2xl" style={{ transform: 'rotateY(-12deg) translateX(-1px)', transformOrigin: 'right', clipPath: 'polygon(0% 0%, 50% 0%, 100% 100%, 0% 100%)' }}></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/40 rounded-t-2xl"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-t-2xl"></div>
                            <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/10 to-transparent rounded-t-2xl"></div>
                            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/50 to-transparent"></div>
                            <div className="relative flex flex-col items-center justify-center h-full" style={{ transform: 'translateZ(30px)' }}>
                              <div className="text-6xl font-black text-gray-200/60 mb-3">2</div>
                              <div className="flex items-center gap-2">
                                <img src="/leaderboard/diamond-removebg-preview.png" alt="crystal" className="w-12 h-12 object-contain transition-all duration-300 hover:brightness-110 hover:scale-110 cursor-pointer" draggable={false} onContextMenu={(e) => e.preventDefault()} />
                                <span className="text-xl font-black text-white">{rank2.points.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Rank 1 */}
                      {rank1 && (
                        <div className="flex flex-col items-center -mt-8 sm:-mt-10 md:-mt-12 animate-[drop_0.7s_ease-out_both]" style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}>
                          <div className="absolute -top-8 sm:-top-9 md:-top-10 z-20">
                            <Crown className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" />
                          </div>

                          <div className="relative mb-2 sm:mb-3 md:mb-4 group cursor-pointer">
                            <img src={rank1.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${rank1.name}`} alt={rank1.name} className="relative w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 rounded-full border-3 md:border-4 border-yellow-400/60 object-cover" draggable={false} onContextMenu={(e) => e.preventDefault()} />
                          </div>
                          <h3 className="font-black text-base sm:text-lg mb-1 sm:mb-2 bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent">{rank1.name}{currentUser && rank1.rank === currentUser.rank && ' (You)'}</h3>

                          <div className="relative w-43 h-73 bg-gradient-to-b from-yellow-400/50 to-amber-700/50 border-t-4 border-x-2 border-yellow-300/80 rounded-t-2xl backdrop-blur-xl"
                            style={{ transform: 'translateZ(35px) scaleX(0.95)', transformOrigin: 'bottom', transformStyle: 'preserve-3d' }}>
                            <div className="absolute -right-2.5 top-0 bottom-0 w-7 bg-gradient-to-b from-amber-500/90 to-amber-900/90 rounded-tr-2xl" style={{ transform: 'rotateY(8deg) translateX(1px)', transformOrigin: 'left', clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 0% 100%)' }}></div>
                            <div className="absolute -left-2.5 top-0 bottom-0 w-7 bg-gradient-to-b from-yellow-400/80 to-amber-700/80 rounded-tl-2xl" style={{ transform: 'rotateY(-8deg) translateX(-1px)', transformOrigin: 'right', clipPath: 'polygon(0% 0%, 50% 0%, 100% 100%, 0% 100%)' }}></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/40 via-transparent to-amber-900/40 rounded-t-2xl"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-t-2xl"></div>
                            <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-yellow-300/15 to-transparent rounded-t-2xl"></div>
                            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent"></div>
                            <div className="relative flex flex-col items-center justify-center h-full" style={{ transform: 'translateZ(40px)' }}>
                              <div className="text-7xl font-black text-yellow-200/70 mb-4">1</div>
                              <div className="flex items-center gap-2.5">
                                <img src="/leaderboard/diamond-removebg-preview.png" alt="crystal" className="w-14 h-14 object-contain transition-all duration-300 hover:brightness-110 hover:scale-110 cursor-pointer" draggable={false} onContextMenu={(e) => e.preventDefault()} />
                                <span className="text-xl font-black bg-gradient-to-r from-yellow-200 to-amber-300 bg-clip-text text-transparent">{rank1.points.toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center">

                            </div>
                          </div>
                        </div>
                      )}

                      {/* Rank 3 */}
                      {rank3 && (
                        <div className="flex flex-col items-center animate-[drop_0.7s_ease-out_both]" style={{ transform: 'translateZ(-20px)', transformStyle: 'preserve-3d' }}>
                          <div className="relative mb-2 sm:mb-3 md:mb-4 group cursor-pointer">
                            <img src={rank3.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${rank3.name}`} alt={rank3.name} className="relative w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full border-3 md:border-4 border-orange-400/50 object-cover" draggable={false} onContextMenu={(e) => e.preventDefault()} />
                          </div>
                          <h3 className="font-bold text-sm sm:text-base mb-1 sm:mb-2">{rank3.name}{currentUser && rank3.rank === currentUser.rank && ' (You)'}</h3>

                          <div className="relative w-38 h-39 bg-gradient-to-b from-orange-400/50 to-amber-700/50 border-t-4 border-x-2 border-orange-300/70 rounded-t-2xl backdrop-blur-xl"
                            style={{ transform: 'translateZ(15px) rotateY(3deg) scaleX(0.95)', transformOrigin: 'bottom', transformStyle: 'preserve-3d' }}>
                            <div className="absolute -right-2 top-0 bottom-0 w-6 bg-gradient-to-b from-orange-600/90 to-amber-900/90 rounded-tr-2xl" style={{ transform: 'rotateY(12deg) translateX(1px)', transformOrigin: 'left', clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 0% 100%)' }}></div>
                            <div className="absolute -left-2 top-0 bottom-0 w-6 bg-gradient-to-b from-orange-400/80 to-amber-700/80 rounded-tl-2xl" style={{ transform: 'rotateY(-12deg) translateX(-1px)', transformOrigin: 'right', clipPath: 'polygon(0% 0%, 50% 0%, 100% 100%, 0% 100%)' }}></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-200/30 via-transparent to-amber-900/40 rounded-t-2xl"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-t-2xl"></div>
                            <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-orange-300/10 to-transparent rounded-t-2xl"></div>
                            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/50 to-transparent"></div>
                            <div className="relative flex flex-col items-center justify-center h-full" style={{ transform: 'translateZ(30px)' }}>
                              <div className="text-6xl font-black text-orange-200/60 mb-3">3</div>
                              <div className="flex items-center gap-2">
                                <img src="/leaderboard/diamond-removebg-preview.png" alt="crystal" className="w-12 h-12 object-contain transition-all duration-300 hover:brightness-110 hover:scale-110 cursor-pointer" draggable={false} onContextMenu={(e) => e.preventDefault()} />
                                <span className="text-xl font-black text-white">{rank3.points.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* User Stats Card */}
                  {currentUser && (
                    <div className="max-w-[1200px] mx-auto -mt-4 sm:-mt-8 md:-mt-10 lg:-mt-9 relative z-30 px-4 sm:px-6 md:px-6 lg:px-8">
                      <Glass
                        style={glassCardStyle}
                        hoverEffect={false}
                        className="rounded-xl p-3 sm:p-3.5 md:p-4 transition-all shadow-[0_0_28px_rgba(168,85,247,0.25)]"
                      >
                        <div className="flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-2.5 md:gap-3">
                          <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-md opacity-50"></div>
                              <img src={currentUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.name}`} className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border-2 border-purple-500/40" alt="You" draggable={false} onContextMenu={(e) => e.preventDefault()} />
                            </div>
                            <div className="text-left">
                              <p className="text-xs sm:text-sm font-bold text-white">Your Progress</p>
                              <p className="text-[10px] sm:text-xs text-gray-400">Keep going!</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between w-full md:w-auto md:gap-4 bg-white/5 md:bg-transparent p-2 md:p-0 rounded-lg">
                            <div className="text-center flex-1 md:flex-none">
                              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Today</p>
                              <div className="flex items-center justify-center gap-1">
                                <img src="/leaderboard/diamond-removebg-preview.png" alt="crystal" className="w-7 h-7 md:w-9 md:h-9 object-contain drop-shadow-[0_0_12px_rgba(168,85,247,0.8)] transition-all duration-300 hover:brightness-110 hover:scale-110 cursor-pointer" draggable={false} onContextMenu={(e) => e.preventDefault()} />
                                <span className="text-base font-black text-white">{currentUser.todayPoints.toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="h-8 w-px bg-white/20"></div>
                            <div className="text-center flex-1 md:flex-none">
                              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Total</p>
                              <div className="flex items-center justify-center gap-1">
                                <img src="/leaderboard/diamond-removebg-preview.png" alt="crystal" className="w-7 h-7 md:w-9 md:h-9 object-contain drop-shadow-[0_0_12px_rgba(168,85,247,0.8)] transition-all duration-300 hover:brightness-110 hover:scale-110 cursor-pointer" draggable={false} onContextMenu={(e) => e.preventDefault()} />
                                <span className="text-sm font-bold text-white">{currentUser.points.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Glass>
                    </div>
                  )}

                  {/* Top Performers List */}
                  {listUsers.length > 0 && (
                    <div className="mt-8 sm:mt-10 md:mt-12 pb-6 sm:pb-8 md:pb-10 px-3 sm:px-4 md:px-6 lg:px-8">
                      <Glass
                        style={glassCardStyle}
                        hoverEffect={false}
                        className="w-full max-w-[1200px] mx-auto rounded-2xl p-4 sm:p-5 md:p-6"
                      >
                        <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
                          <h2 className="text-lg sm:text-xl md:text-2xl font-moco text-white">Top Performers</h2>
                        </div>

                        <div className="hidden md:grid grid-cols-12 px-6 mb-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          <div className="col-span-1">Rank</div>
                          <div className="col-span-8">User</div>
                          <div className="col-span-3 text-right">XP</div>
                        </div>

                        <div className="space-y-2 sm:space-y-2.5 md:space-y-2">
                          {listUsers.map((user, index) => {
                            const isCurrentUser = currentUser && user.rank === currentUser.rank;
                            const currentUserStyle = isCurrentUser ? {
                              ...glassCardStyle,
                              border: "2px solid rgba(168, 85, 247, 0.6)",
                              background: `
                                linear-gradient(to top, rgba(168, 85, 247, 0.15), transparent 60%),
                                rgba(168, 85, 247, 0.1)
                              `,
                              boxShadow: `
                                0 0 20px rgba(168, 85, 247, 0.3),
                                inset 0 0 0 1px rgba(168, 85, 247, 0.2),
                                inset 0 1px 0 rgba(168, 85, 247, 0.3)
                              `,
                            } : glassCardStyle;
                            return (
                              <Glass
                                key={user.rank}
                                style={currentUserStyle}
                                hoverEffect={false}
                                className="rounded-xl p-2.5 sm:p-3 md:p-4 transition-all duration-300 group"
                              >
                                <div className="flex items-center justify-between gap-2 sm:gap-2.5 md:gap-3">
                                  <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 flex-1 min-w-0">
                                    <div className="flex items-center justify-center w-7 sm:w-8 md:w-10">
                                      <span className="font-black text-base sm:text-lg md:text-xl text-gray-400 group-hover:text-white group-hover:scale-110 transition-all">{user.rank}</span>
                                    </div>
                                    <div className="relative flex-shrink-0">
                                      <div className={`absolute inset-0 rounded-full blur-sm opacity-50 ${index === 0 ? 'bg-blue-500/40' : index === 1 ? 'bg-purple-500/40' : 'bg-pink-500/40'}`}></div>
                                      <img src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`} className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-all" alt={user.name} draggable={false} onContextMenu={(e) => e.preventDefault()} />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-bold text-xs sm:text-sm md:text-base text-white truncate">{user.name}{isCurrentUser && ' (You)'}</p>
                                      <p className="text-[10px] sm:text-xs md:text-sm text-gray-400 truncate">#{user.pid}</p>
                                    </div>
                                  </div>
                                  <div className="flex-shrink-0">
                                    <div className={`border border-white/10 rounded-lg px-1.5 sm:px-2 md:px-4 py-1 sm:py-1.5 backdrop-blur-md bg-white/5 flex flex-row items-center justify-center gap-0.5 sm:gap-1 md:gap-2 hover:scale-105 transition-all w-auto min-w-[80px] sm:min-w-[90px] md:min-w-[100px] lg:w-[150px] ${index === 0 ? 'border-blue-400/40' : index === 1 ? 'border-purple-400/40' : 'border-pink-400/40'}`}>
                                      <img src="/leaderboard/diamond-removebg-preview.png" alt="crystal" className="w-5 h-5 sm:w-6 sm:h-6 md:w-9 md:h-9 object-contain flex-shrink-0 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] transition-all duration-300 hover:brightness-110 hover:scale-110 cursor-pointer" draggable={false} onContextMenu={(e) => e.preventDefault()} />
                                      <span className="text-xs sm:text-sm md:text-lg font-black text-white whitespace-nowrap">{user.points.toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>
                              </Glass>
                            );
                          })}

                          {/* Separator - only show if current user rank > 10 */}
                          {currentUser && currentUser.rank > 10 && (
                            <div className="flex justify-center py-1 sm:py-2">
                              <span className="text-white text-3xl sm:text-4xl font-black tracking-[0.2em] sm:tracking-[0.5em] animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">...</span>
                            </div>
                          )}

                          {/* Current User Row - only show if rank > 10 */}
                          {currentUser && currentUser.rank > 10 && (
                            <Glass
                              style={glassCardStyle}
                              hoverEffect={false}
                              className="rounded-xl p-2.5 sm:p-3 md:p-4 transition-all duration-300 group border border-purple-500/30 bg-purple-500/5 mt-2"
                            >
                              <div className="flex items-center justify-between gap-2 sm:gap-2.5 md:gap-3">
                                <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 flex-1 min-w-0">
                                  <div className="flex items-center justify-center w-7 sm:w-8 md:w-10">
                                    <span className="font-black text-base sm:text-lg md:text-xl text-white group-hover:scale-110 transition-all">{currentUser.rank}</span>
                                  </div>
                                  <div className="relative flex-shrink-0">
                                    <div className="absolute inset-0 rounded-full blur-sm opacity-50 bg-purple-500/40"></div>
                                    <img src={currentUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.name}`} className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-all" alt="You" draggable={false} onContextMenu={(e) => e.preventDefault()} />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-bold text-xs sm:text-sm md:text-base text-white truncate">You</p>
                                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-400 truncate">#{currentUser.pid}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                                  {/* Today's XP */}
                                  <div className="flex flex-col items-end mr-2 sm:mr-0">
                                    <span className="text-[8px] sm:text-[10px] text-gray-400 uppercase tracking-wider">Today</span>
                                    <div className="flex items-center gap-1">
                                      <img src="/leaderboard/diamond-removebg-preview.png" alt="crystal" className="w-3 h-3 sm:w-4 sm:h-4 object-contain" draggable={false} onContextMenu={(e) => e.preventDefault()} />
                                      <span className="text-xs sm:text-sm font-bold text-white">{currentUser.todayPoints.toLocaleString()}</span>
                                    </div>
                                  </div>

                                  {/* Total XP */}
                                  <div className="border border-purple-400/40 rounded-lg px-1.5 sm:px-2 md:px-4 py-1 sm:py-1.5 backdrop-blur-md bg-purple-500/10 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 md:gap-2 hover:scale-105 transition-all w-auto min-w-[60px] sm:min-w-[90px] md:min-w-[100px] lg:w-[150px]">
                                    <div className="text-[8px] sm:text-[10px] text-gray-400 uppercase tracking-wider">Total</div>
                                    <div className="flex items-center gap-1">
                                      <img src="/leaderboard/diamond-removebg-preview.png" alt="crystal" className="w-5 h-5 sm:w-6 sm:h-6 md:w-9 md:h-9 object-contain flex-shrink-0 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] transition-all duration-300 hover:brightness-110 hover:scale-110 cursor-pointer" draggable={false} onContextMenu={(e) => e.preventDefault()} />
                                      <span className="text-xs sm:text-sm md:text-lg font-black text-white whitespace-nowrap">{currentUser.points.toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Glass>
                          )}

                        </div>
                      </Glass>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </LiquidGlassCard>
    </>
  );
};

export default Leaderboard;
