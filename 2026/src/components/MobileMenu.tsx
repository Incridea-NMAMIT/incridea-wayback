import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRegistrationConfig } from "../api/public";
import { fetchMe } from "../api/auth";
import { NavLink } from "react-router-dom";
import { ChevronLeft, Home, CalendarDays, User, Music, Image, Info, Trophy, Package, Award, BedDouble, Menu } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

interface MobileMenuProps {
    onLogout: () => void;
    isAuthenticated: boolean;
}

const MobileMenu = ({ onLogout, isAuthenticated }: MobileMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(prev => !prev);

    const { data: config } = useQuery({
        queryKey: ['registration-config'],
        queryFn: fetchRegistrationConfig,
    });

    const { data: meData } = useQuery({
        queryKey: ['me'],
        queryFn: fetchMe,
        retry: false,
    });

    const user = meData?.user;
    const showLeaderboard = config?.showLeaderboard ?? false;
    const showChampionship = config?.showChampionship ?? false;
    const showAccommodation = user?.category === 'EXTERNAL';

    const links = [
        { icon: Home, path: "/", label: "Home" },
        { icon: CalendarDays, path: "/events", label: "Events" },
        { icon: User, path: "/profile", label: "Profile" },
        { icon: Music, path: "/pronite", label: "Pronite" },
        { icon: Image, path: "/gallery", label: "Gallery" },
        ...(showLeaderboard ? [{ icon: Trophy, path: "/leaderboard", label: "Leaderboard" }] : []),
        { icon: Package, path: "/merch", label: "Merch" },
        ...(showChampionship ? [{ icon: Award, path: "/championship", label: "Championship" }] : []),
        ...(showAccommodation ? [{ icon: BedDouble, path: "/accommodation", label: "Accommodation" }] : []),
        { icon: Info, path: "/about", label: "About Us" },
    ];

    const drawerVariants: Variants = {
        initial: { x: "100%" },
        animate: {
            x: 0,
            transition: {
                type: "spring",
                damping: 30,
                stiffness: 300
            }
        },
        exit: {
            x: "100%",
            transition: {
                type: "spring",
                damping: 30,
                stiffness: 300,
                when: "afterChildren"
            }
        }
    };

    const contentVariants: Variants = {
        initial: { opacity: 1 },
        animate: {
            opacity: 1,
            transition: {
                staggerChildren: 0.04,
                delayChildren: 0.02
            }
        },
        exit: {
            opacity: 1,
            transition: {
                staggerChildren: 0.02,
                staggerDirection: -1
            }
        }
    };

    const itemVariants: Variants = {
        initial: { opacity: 0, x: 50 },
        animate: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 20
            }
        },
        exit: {
            opacity: 0,
            x: 50,
            transition: {
                duration: 0.05,
                ease: "easeIn"
            }
        }
    };

    return (
        <div className="lg:hidden">
            <button
                onClick={toggleMenu}
                className="group relative z-50 p-2 md:p-3 rounded-xl text-white hover:opacity-80 transition-all overflow-hidden"
                aria-label="Toggle Menu"
            >
                <Menu className="w-7 h-7" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        { }
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/10 z-40"
                            onClick={toggleMenu}
                        />

                        { }
                        <motion.div
                            key="drawer"
                            variants={drawerVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="fixed inset-0 z-50 flex h-dvh"
                        >
                            <div className="w-full h-full" style={{
                                background: `linear-gradient(to top, rgba(0, 0, 0, 0.95), rgba(10, 10, 10, 0.90) 60%), rgba(10, 10, 10, 0.92)`,
                                backdropFilter: 'brightness(0.6) blur(20px)',
                                WebkitBackdropFilter: 'brightness(0.6) blur(20px)',
                            }}>
                                <motion.div
                                    variants={contentVariants}
                                    className="flex flex-col w-full h-full pt-4 pb-24 px-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]"
                                >
                                    { }
                                    <motion.div className="flex justify-start mb-4 relative">
                                        <svg width="0" height="0" className="absolute">
                                            <linearGradient id="back-arrow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#67e8f9" /> { }
                                                <stop offset="50%" stopColor="#a855f7" /> { }
                                                <stop offset="100%" stopColor="#67e8f9" /> { }
                                            </linearGradient>
                                        </svg>
                                        <button
                                            type="button"
                                            onClick={toggleMenu}
                                            aria-label="Close Menu"
                                            className="p-2 pl-2 mt-2 hover:bg-white/10 rounded-full transition-colors"
                                        >
                                            <ChevronLeft size={32} style={{ stroke: "url(#back-arrow-gradient)" }} />
                                        </button>
                                    </motion.div>

                                    { }
                                    <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-extrabold text-white mb-6 md:mb-10 pb-4 tracking-tight text-center w-full">Menu</motion.h1>

                                    { }
                                    <div className="flex flex-col gap-3 sm:gap-4 md:gap-8 w-full flex-grow items-center">
                                        {links.map(({ icon: Icon, path, label }) => (
                                            <motion.div
                                                key={path}
                                                variants={itemVariants}
                                                className="w-full flex justify-center"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.97 }}
                                            >
                                                <NavLink
                                                    to={path}
                                                    onClick={toggleMenu}
                                                    className={({ isActive }) =>
                                                        `flex items-center gap-3 sm:gap-4 text-xl sm:text-2xl md:text-3xl font-medium transition-all duration-300 px-6 py-2 rounded-xl ${isActive
                                                            ? "text-purple-300 bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                                                            : "text-white/80 hover:text-white hover:bg-white/5"
                                                        }`
                                                    }
                                                >
                                                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                                    {label}
                                                </NavLink>
                                            </motion.div>
                                        ))}
                                    </div>

                                    { }
                                    <div className="flex flex-col items-center w-full mt-16 mb-4 pt-4">
                                        {isAuthenticated ? (
                                            <motion.button
                                                variants={itemVariants}
                                                onClick={() => {
                                                    onLogout();
                                                    toggleMenu();
                                                }}
                                                className="text-2xl sm:text-3xl md:text-4xl font-bold text-white flex items-center gap-3 hover:opacity-70 transition-opacity"
                                            >
                                                Logout
                                            </motion.button>
                                        ) : (
                                            <motion.div variants={itemVariants}>
                                                <NavLink
                                                    to="/login"
                                                    onClick={toggleMenu}
                                                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-white flex items-center gap-3 hover:opacity-70 transition-opacity"
                                                >
                                                    Sign In
                                                </NavLink>
                                            </motion.div>
                                        )}
                                    </div>

                                    { }
                                    <div className="flex flex-col gap-3 md:gap-6 pt-4 items-center w-full">
                                        {[
                                            { path: "/privacy-policy", label: "Privacy Policy" },
                                            { path: "/terms-and-conditions", label: "Terms & Conditions" },
                                            { path: "/guidelines-regulations", label: "Guidelines" },
                                            { path: "/refund-policy", label: "Refund Policy" },
                                        ].map(({ path, label }) => (
                                            <motion.div key={path} variants={itemVariants}>
                                                <NavLink
                                                    to={path}
                                                    onClick={toggleMenu}
                                                    className="text-lg md:text-lg font-medium text-white/60 hover:text-white transition-colors"
                                                >
                                                    {label}
                                                </NavLink>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MobileMenu;
