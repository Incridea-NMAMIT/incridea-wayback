import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Trash2 } from 'lucide-react';

import LiquidGlassCard from './liquidglass/LiquidGlassCard';

interface Notification {
    id: string;
    title: string;
    message: string;
    createdAt: string;
    read: boolean;
    type: 'PERSONAL' | 'BROADCAST';
}

interface NotificationPopupProps {
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    onDelete: (id: string) => void;
    onClose: () => void;
    isLoading?: boolean;
}


const NotificationPopup = ({ notifications, onMarkAsRead, onDelete, onClose }: NotificationPopupProps) => {

    const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);



    const handleNotificationClick = (notif: Notification) => {
        if (window.innerWidth < 1024) {
            // Mobile: Toggle expansion
            setSelectedNotificationId(prev => prev === notif.id ? null : notif.id);
        } else {
            // Desktop: Select
            setSelectedNotificationId(notif.id);
        }

        if (!notif.read) {
            onMarkAsRead(notif.id);
        }
    };

    const selectedNotification = notifications.find(n => n.id === selectedNotificationId);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
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
                className="!fixed !top-1/2 !left-1/2 !w-[90vw] !h-[80vh] md:!w-[75vw] md:!h-[75vh] z-[101] !overflow-hidden !p-0 !m-0"
                colorScheme="dark"
            >
                <div className="flex flex-col h-full p-6">
                    {/* Header */}
                    <div className="p-4 md:p-6 border-b border-white/10 shrink-0 flex justify-between items-center">
                        <h3 className="text-white font-moco text-xl sm:text-lg md:text-xl tracking-wider">Notifications</h3>
                        <button
                            onClick={onClose}
                            className="text-white/70 hover:text-white transition-colors p-1"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex flex-1 overflow-hidden">
                        {/* Left Side (List) */}
                        <div className={`
              flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent
              ${selectedNotificationId && window.innerWidth >= 1024 ? 'lg:w-1/3 lg:flex-none lg:border-r lg:border-white/10' : 'w-full'}
            `}>
                            {notifications.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-white/50">
                                    No notifications
                                </div>
                            ) : (
                                notifications.map(notif => (
                                    <div
                                        key={notif.id}
                                        onClick={() => handleNotificationClick(notif)}
                                        className={`
                                        p-4 mb-2 rounded-lg cursor-pointer transition-all duration-200 group relative
                                        ${selectedNotificationId === notif.id ? 'bg-white/10' : 'hover:bg-white/5'}
                                        ${!notif.read ? 'border-l-4 border-blue-500 pl-3' : 'border-l-4 border-transparent pl-3'}
                                        `}
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex-1 min-w-0">
                                                <div className={`font-bold text-sm tracking-wide truncate ${!notif.read ? 'text-white' : 'text-white/70'}`}>
                                                    {notif.title}
                                                </div>
                                                <div className="text-xs text-white/40 mt-1">
                                                    {formatDate(notif.createdAt)}
                                                </div>
                                            </div>
                                            {!notif.read && (
                                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                            )}
                                            {notif.type === 'PERSONAL' && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDelete(notif.id);
                                                    }}
                                                    className="p-1 text-white/30 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>


                                        {/* Mobile Accordion Content */}
                                        <div className="lg:hidden">
                                            <AnimatePresence>
                                                {selectedNotificationId === notif.id && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                        animate={{ height: 'auto', opacity: 1, marginTop: 8 }}
                                                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="text-base sm:text-sm text-white/80 border-t border-white/10 pt-2">
                                                            <p className="whitespace-pre-wrap">{notif.message}</p>
                                                            {notif.message.includes('http') && (
                                                                <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                                                                    <p className="text-sm text-white/60 mb-2">Links detected:</p>
                                                                    {notif.message.match(/https?:\/\/[^\s]+/g)?.map((rawLink, i) => {
                                                                        const link = rawLink.replace(/[.,;:"')]+$/, '');
                                                                        return (
                                                                            <a
                                                                                key={i}
                                                                                href={link}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                onClick={(e) => e.stopPropagation()}
                                                                                className="text-blue-400 hover:text-blue-300 underline break-all block"
                                                                            >
                                                                                {link}
                                                                            </a>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Right Side (Details - Desktop Only) */}
                        <div className="hidden lg:flex lg:flex-[2] flex-col p-8 overflow-y-auto bg-black/20">
                            {selectedNotification ? (
                                <div className="animate-fadeIn">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-3xl sm:text-2xl font-bold text-white font-moco tracking-wide">
                                            {selectedNotification.title}
                                        </h2>
                                        <span className="text-base sm:text-sm text-white/40 font-mono">
                                            {formatDate(selectedNotification.createdAt)}
                                        </span>
                                    </div>

                                    <div className="w-full">
                                        <p className="text-lg sm:text-base text-white/90 leading-relaxed whitespace-pre-wrap">
                                            {selectedNotification.message || "No content"}
                                        </p>
                                    </div>

                                    {selectedNotification.message.includes('http') && (
                                        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                                            <p className="text-base sm:text-sm text-white/60 mb-2">Links detected:</p>
                                            {selectedNotification.message.match(/https?:\/\/[^\s]+/g)?.map((rawLink, i) => {
                                                const link = rawLink.replace(/[.,;:"')]+$/, '');
                                                return (
                                                    <a
                                                        key={i}
                                                        href={link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="text-blue-400 hover:text-blue-300 underline break-all block"
                                                    >
                                                        {link}
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    )}

                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-white/30">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                        <Check className="w-8 h-8 opacity-50" />
                                    </div>
                                    <p>Please open a notification to view the content</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </LiquidGlassCard>
        </>
    );
};

export default NotificationPopup;
