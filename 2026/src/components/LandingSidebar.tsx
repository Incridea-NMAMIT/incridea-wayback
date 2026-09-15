import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRegistrationConfig } from "../api/public";
import { fetchMe } from "../api/auth";
import { NavLink } from "react-router-dom";
import { ChevronRight, Music, Image, Trophy, Package, Award, BedDouble, Info } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

interface LandingSidebarProps {
    biomeIndex: number;
}

// Biome themes matching the 6 background videos (from FantasyButton.tsx)
const biomeThemes = [
    // 0: Dimensional Rift (Purple Galaxy Portal)
    {
        name: "purple",
        bg: "rgba(91, 61, 184, 0.15)",
        border: "#A78BFA",
        shadow: "0 0 20px rgba(167, 139, 250, 0.2)",
        text: "#EDE9FE",
        accent: "#8B5CF6"
    },
    // 1: Electromagnetic Storm (Lightning + Aurora)
    {
        name: "blue",
        bg: "rgba(46, 75, 143, 0.15)",
        border: "#60A5FA",
        shadow: "0 0 20px rgba(96, 165, 250, 0.2)",
        text: "#E0F2FE",
        accent: "#3B82F6"
    },
    // 2: Gravity Anomaly (Floating City, Blue Void)
    {
        name: "sky",
        bg: "rgba(59, 130, 246, 0.15)",
        border: "#93C5FD",
        shadow: "0 0 20px rgba(147, 197, 253, 0.2)",
        text: "#F8FAFC",
        accent: "#0EA5E9"
    },
    // 3: Reclaimed Nature City (Green Overgrown)
    {
        name: "green",
        bg: "rgba(21, 128, 61, 0.15)",
        border: "#4ADE80",
        shadow: "0 0 20px rgba(74, 222, 128, 0.2)",
        text: "#ECFDF5",
        accent: "#22C55E"
    },
    // 4: Time Collapse (Sand, Ruins, Gears)
    {
        name: "amber",
        bg: "rgba(180, 83, 9, 0.15)",
        border: "#FBBF24",
        shadow: "0 0 20px rgba(251, 191, 36, 0.2)",
        text: "#FFF7ED",
        accent: "#F59E0B"
    },
    // 5: Volcanic Rift (Lava + Magma Storm)
    {
        name: "orange",
        bg: "rgba(154, 52, 18, 0.15)",
        border: "#FB923C",
        shadow: "0 0 20px rgba(251, 146, 60, 0.2)",
        text: "#FFF7ED",
        accent: "#EA580C"
    },
];

const LandingSidebar = ({ biomeIndex }: LandingSidebarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const theme = biomeThemes[biomeIndex % biomeThemes.length];

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
        { icon: Music, path: "/pronite", label: "Pronite" },
        { icon: Image, path: "/gallery", label: "Gallery" },
        ...(showLeaderboard ? [{ icon: Trophy, path: "/leaderboard", label: "Leaderboard" }] : []),
        { icon: Package, path: "/merch", label: "Merch" },
        ...(showChampionship ? [{ icon: Award, path: "/championship", label: "Championship" }] : []),
        ...(showAccommodation ? [{ icon: BedDouble, path: "/accommodation", label: "Accommodation" }] : []),
        { icon: Info, path: "/about", label: "About Us" },
    ];

    // Auto-close logic
    // const closeMenu = useCallback(() => setIsOpen(false), []); // Removed unused callback
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    const handleMouseLeave = () => {
        timerRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 3000); // 5 seconds
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const sidebarVariants: Variants = {
        closed: {
            x: -100,
            opacity: 0,
            pointerEvents: "none",
        },
        open: {
            x: 0,
            opacity: 1,
            pointerEvents: "auto",
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 20
            }
        }
    };

    return (
        <>
            {/* Toggle Button (Visible when closed) */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                        onClick={toggleMenu}
                        onMouseEnter={() => setIsOpen(true)}
                        className="hidden lg:block fixed left-0 top-1/2 -translate-y-1/2 z-[120] py-6 pl-3 pr-4 rounded-r-2xl backdrop-blur-xl transition-all duration-300 group hover:pl-6 border-y border-r"
                        style={{
                            backgroundColor: "rgba(0,0,0,0.6)",
                            borderColor: theme.border,
                            boxShadow: `0 0 20px ${theme.accent}60`,
                            color: theme.border
                        }}
                        aria-label="Open Menu"
                    >
                        <ChevronRight
                            className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300"
                            style={{ filter: `drop-shadow(0 0 8px ${theme.accent})` }}
                        />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Sidebar Content (Floating Strip) */}
            <motion.div
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                variants={sidebarVariants}
                className="hidden lg:block fixed left-5 top-1/2 -translate-y-1/2 z-[120]"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="flex flex-col items-center gap-4 p-3 rounded-2xl backdrop-blur-md transition-colors duration-500"
                    style={{
                        backgroundColor: "rgba(0,0,0,0.6)",
                        boxShadow: theme.shadow
                    }}
                >

                    {links.map(({ icon: Icon, path, label }) => (
                        <NavLink
                            key={path}
                            to={path}
                            onClick={toggleMenu}
                            className={`
                                group relative
                                w-11 h-11
                                rounded-xl
                                flex items-center justify-center
                                transition-all duration-300
                                cursor-pointer
                            `}
                            style={({ isActive }) => isActive ? {
                                background: theme.accent, // Fallback
                                backgroundImage: `linear-gradient(to bottom, ${theme.accent}, ${theme.border})`,
                                color: "#ffffff",
                                boxShadow: `0 0 15px ${theme.accent}80`
                            } : {
                                backgroundColor: "rgba(255,255,255,0.05)",
                                color: theme.border,
                            }}
                        >
                            <div className="relative z-10">
                                <Icon className="w-5 h-5" />
                            </div>

                            {/* Hover Effect for Inactive */}
                            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                style={{
                                    backgroundColor: `${theme.accent}30`,
                                    boxShadow: `0 0 10px ${theme.accent}40`
                                }}
                            />

                            {/* Tooltip */}
                            <span className="
                                absolute left-full ml-3
                                px-3 py-1.5 rounded-lg
                                text-xs font-medium whitespace-nowrap
                                opacity-0 group-hover:opacity-100
                                -translate-x-2 group-hover:translate-x-0
                                transition-all duration-200
                                pointer-events-none
                                shadow-lg
                                z-50
                            "
                                style={{
                                    backgroundColor: "rgba(0,0,0,0.9)",
                                    color: theme.text,
                                    border: `1px solid ${theme.border}40`
                                }}
                            >
                                {label}
                            </span>
                        </NavLink>
                    ))}
                </div>
            </motion.div>
        </>
    );
};

export default LandingSidebar;
