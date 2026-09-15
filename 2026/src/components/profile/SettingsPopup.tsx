
import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, LogOut, Smartphone, Laptop, Monitor } from 'lucide-react';
import LiquidGlassCard from '../liquidglass/LiquidGlassCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { changePassword, getSessions, revokeSession, type ChangePasswordPayload, type Session } from '../../api/auth';
import { useForm } from 'react-hook-form';
import { showToast } from '../../utils/toast';

interface SettingsPopupProps {
    onClose: () => void;
}

type Tab = 'password' | 'sessions';

const SettingsPopup = ({ onClose }: SettingsPopupProps) => {
    const [activeTab, setActiveTab] = useState<Tab>('password');
    const [sessionToRevoke, setSessionToRevoke] = useState<string | null>(null);
    const queryClient = useQueryClient();

    // --- Change Password Logic ---
    const form = useForm<ChangePasswordPayload>({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    const changePasswordMutation = useMutation({
        mutationFn: changePassword,
        onSuccess: () => {
            form.reset();
            showToast("Password updated successfully", "success");
            onClose();
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to update password", "error");
        }
    });

    const onSubmitPassword = form.handleSubmit((values) =>
        changePasswordMutation.mutate(values),
    );

    // --- Sessions Logic ---
    const sessionsQuery = useQuery({
        queryKey: ['sessions'],
        queryFn: getSessions,
        enabled: activeTab === 'sessions',
    });

    const revokeSessionMutation = useMutation({
        mutationFn: revokeSession,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            showToast("Session signed out", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to sign out session", "error");
        }
    });

    const handleRevokeSession = (sessionId: string) => {
        setSessionToRevoke(sessionId);
    };

    const confirmRevokeSession = () => {
        if (sessionToRevoke) {
            revokeSessionMutation.mutate(sessionToRevoke);
            setSessionToRevoke(null);
        }
    };

    const getDeviceIcon = (deviceString?: string | null) => {
        if (!deviceString) return <Monitor className="w-5 h-5" />;
        const lower = deviceString.toLowerCase();
        if (lower.includes('mobile') || lower.includes('android') || lower.includes('iphone')) return <Smartphone className="w-5 h-5" />;
        if (lower.includes('mac') || lower.includes('windows') || lower.includes('linux')) return <Laptop className="w-5 h-5" />;
        return <Monitor className="w-5 h-5" />;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />
            <LiquidGlassCard
                as={motion.div}
                initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
                animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
                className="!fixed !top-1/2 !left-1/2 !w-[80vw] !h-[70vh] md:!w-[55vw] md:!h-[75vh] z-[101] !overflow-hidden !p-0 !m-0"
                colorScheme="dark"
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 md:p-6 border-b border-white/10 shrink-0 flex justify-between items-center bg-white/5">
                        <h3 className="text-white font-moco text-xl sm:text-lg md:text-xl tracking-wider">Settings</h3>
                        <button
                            onClick={onClose}
                            className="text-white/70 hover:text-white transition-colors p-1"
                        >
                            <X className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                        {/* Sidebar (Tabs) */}
                        <div className="w-full md:w-1/4 flex flex-row md:flex-col border-b md:border-b-0 md:border-r border-white/10 bg-white/5 p-2 gap-2 overflow-x-auto shrink-0 scrollbar-hide">
                            <button
                                onClick={() => setActiveTab('password')}
                                className={`flex-1 md:flex-none text-center md:text-left px-3 py-2 md:px-4 md:py-3 rounded-lg transition-all font-medium text-sm sm:text-xs md:text-sm whitespace-nowrap ${activeTab === 'password' ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                            >
                                Change Password
                            </button>
                            <button
                                onClick={() => setActiveTab('sessions')}
                                className={`flex-1 md:flex-none text-center md:text-left px-3 py-2 md:px-4 md:py-3 rounded-lg transition-all font-medium text-sm sm:text-xs md:text-sm whitespace-nowrap ${activeTab === 'sessions' ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                            >
                                Sessions
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-black/20">
                            {activeTab === 'password' && (
                                <form onSubmit={(e) => void onSubmitPassword(e)} className="space-y-5 max-w-md mx-auto mt-1 md:mt-2">
                                    <div className="space-y-1.5">
                                        <label className="text-base sm:text-sm text-slate-300 font-bold block ml-1">Current Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2 text-base sm:text-smbg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                                            {...form.register("currentPassword", { required: "Required" })}
                                            placeholder="Current Password"
                                        />
                                        {form.formState.errors.currentPassword && <p className="text-xs text-rose-400">{form.formState.errors.currentPassword.message}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-base sm:text-smtext-slate-300 font-bold block ml-1">New Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2 text-base sm:text-smbg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                                            {...form.register("newPassword", { required: "Required", minLength: { value: 8, message: "Min 8 chars" } })}
                                            placeholder="New Password"
                                        />
                                        {form.formState.errors.newPassword && <p className="text-xs text-rose-400">{form.formState.errors.newPassword.message}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-base sm:text-sm text-slate-300 font-bold block ml-1">Confirm Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2 text-base sm:text-smbg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                                            {...form.register("confirmNewPassword", {
                                                required: "Required",
                                                validate: (val) => val === form.watch("newPassword") || "Passwords do not match"
                                            })}
                                            placeholder="Confirm Password"
                                        />
                                        {form.formState.errors.confirmNewPassword && <p className="text-xs text-rose-400">{form.formState.errors.confirmNewPassword.message}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full text-base sm:text-sm bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-lg transition-all shadow-lg hover:shadow-amber-500/20 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={changePasswordMutation.isPending}
                                    >
                                        {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
                                    </button>
                                </form>
                            )}

                            {activeTab === 'sessions' && (
                                <div className="space-y-4">
                                    <h4 className="text-white font-moco text-xl sm:text-lg mb-4">Active Sessions</h4>
                                    {sessionsQuery.isLoading ? (
                                        <div className="text-white/50 text-center py-10">Loading sessions...</div>
                                    ) : sessionsQuery.error ? (
                                        <div className="text-rose-400 text-center py-10">Failed to load sessions</div>
                                    ) : (
                                        <div className="space-y-3">
                                            {sessionsQuery.data?.sessions.map((session: Session) => {
                                                const isCurrent = session.id === sessionsQuery.data.currentSessionId;
                                                return (
                                                    <div
                                                        key={session.id}
                                                        className={`p-5 md:p-6 rounded-xl border flex items-center justify-between gap-3 md:gap-4 transition-all ${isCurrent ? 'bg-amber-500/10 border-amber-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                                    >
                                                        <div className="flex items-center gap-3 md:gap-4">
                                                            <div className={`p-1.5 md:p-2 rounded-lg ${isCurrent ? 'bg-amber-500/20 text-amber-300' : 'bg-white/10 text-slate-300'}`}>
                                                                {getDeviceIcon(session.device)}
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <p className={`font-bold text-base sm:text-sm md:text-base ${isCurrent ? 'text-amber-200' : 'text-white'}`}>
                                                                        {session.device || 'Unknown Device'}
                                                                    </p>
                                                                    {isCurrent && <span className="text-[9px] md:text-[10px] bg-amber-500 text-black px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">Current</span>}
                                                                </div>
                                                                <div className="text-sm sm:text-xs md:text-xs text-slate-400 mt-0.5 md:mt-1 space-y-0.5">
                                                                    <p>Last active: {formatDate(session.updatedAt)}</p>
                                                                    <p>Login: {formatDate(session.createdAt)}</p>
                                                                    <p className="font-mono text-white/20 text-xs sm:text-[10px] md:text-[10px]">{session.ip}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {!isCurrent && (
                                                            <button
                                                                onClick={() => handleRevokeSession(session.id)}
                                                                className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors group"
                                                                title="Sign out session"
                                                                disabled={revokeSessionMutation.isPending}
                                                            >
                                                                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </LiquidGlassCard>

            {/* Confirmation Modal */}
            {sessionToRevoke && (
                <div className="fixed inset-0 z-[105] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSessionToRevoke(null)}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative bg-[#1a1a1a] border border-white/10 p-6 rounded-xl shadow-2xl max-w-sm w-full z-10"
                    >
                       <h4 className="text-xl sm:text-xl font-bold">Sign out session?</h4>
                        <p className="text-base sm:text-sm text-slate-400 mb-6">Are you sure you want to sign out from this device? This action cannot be undone.</p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setSessionToRevoke(null)}
                                className="px-4 py-2 rounded-lg text-slate-300 hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmRevokeSession}
                                className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-semibold transition-colors shadow-lg hover:shadow-rose-500/20"
                            >
                                Sign Out
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
};

export default SettingsPopup;
