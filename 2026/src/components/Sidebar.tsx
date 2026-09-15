import {
  Home,
  Image,
  Trophy,
  Package,
  Award,
  BedDouble,
  Info,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";



import { useQuery } from "@tanstack/react-query";
import { fetchRegistrationConfig } from "../api/public";
import { fetchMe } from "../api/auth";

const Sidebar = () => {
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

  const items = [
    { icon: Home, path: "/", label: "Home" },
    { icon: Image, path: "/gallery", label: "Gallery" },
    ...(showLeaderboard ? [{ icon: Trophy, path: "/leaderboard", label: "Leaderboard" }] : []),
    { icon: Package, path: "/merch", label: "Merch" },
    ...(showChampionship ? [{ icon: Award, path: "/championship", label: "Championship" }] : []),
    ...(showAccommodation ? [{ icon: BedDouble, path: "/accommodation", label: "Accommodation" }] : []),
    { icon: Info, path: "/about", label: "About Us" },
  ];

  return (
    <>
      {/* Desktop Sidebar — vertical, left side */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.3 }}
        className="hidden lg:block fixed left-5 top-1/2 -translate-y-1/2 z-[9999]"
      >
        <div
          className="flex flex-col items-center p-5 gap-6"
        >
          {items.map(({ icon: Icon, path, label }, i) => (
            <motion.div
              key={path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.06, type: "spring", stiffness: 300, damping: 20 }}
            >
              <NavLink
                to={path}
                title={label}
                className={({ isActive }) => `
                  group relative
                  w-11 h-11
                  rounded-xl
                  flex items-center justify-center
                  transition-all duration-300
                  cursor-target
                  ${isActive
                    ? "bg-gradient-to-b from-purple-500 to-purple-700 text-white shadow-[0_0_22px_rgba(168,85,247,0.5)]"
                    : "bg-white/10 text-purple-200 hover:bg-purple-500/30 hover:shadow-[0_0_14px_rgba(168,85,247,0.5)] hover:text-white"
                  }
                `}
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                {/* Tooltip */}
                <span className="
                  absolute left-full ml-3
                  px-3 py-1.5 rounded-lg
                  bg-black/80 text-white text-xs font-medium whitespace-nowrap
                  opacity-0 group-hover:opacity-100
                  -translate-x-2 group-hover:translate-x-0
                  transition-all duration-200
                  pointer-events-none
                  shadow-lg
                ">
                  {label}
                </span>
              </NavLink>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
