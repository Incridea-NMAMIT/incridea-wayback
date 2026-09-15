import { NavLink } from "react-router-dom";
import { type UserPayload } from "../api/auth";

import MobileMenu from "./MobileMenu";
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { getNotifications, markNotificationAsRead, deleteNotification } from "../utils/notification";


import NotificationPopup from "./NotificationPopup";

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  isLoading: boolean;
  user: UserPayload | null;
}

const Navbar = ({ isAuthenticated, onLogout, isLoading, user }: NavbarProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<{ id: string; title: string; message: string; createdAt: string; read: boolean; type: 'PERSONAL' | 'BROADCAST' }[]>([]);


  useEffect(() => {
    if (isAuthenticated) {
      // Initial fetch
      getNotifications().then(res => {
        setNotifications(res.data.notifications);
      }).catch(err => console.error(err));

      // Poll every 30 seconds
      const interval = setInterval(() => {
        getNotifications().then(res => {
          setNotifications(res.data.notifications);
        }).catch(err => console.error(err));
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const unreadCount = notifications.filter(n => !n.read).length;



  return (
    <div className="fixed top-0 left-0 w-full z-50 px-3 sm:px-4 md:px-8 lg:px-14 pt-4 sm:pt-5 md:pt-6 lg:pt-8 pb-2 md:pb-4 flex justify-between items-center lg:grid lg:grid-cols-3 lg:items-start transition-all duration-300">
      {/* Background with Fade Mask */}
      <div
        className="absolute top-0 left-0 h-[150%] w-full z-[-1] bg-gradient-to-b from-black/80 via-black/65 to-transparent backdrop-blur-[2px] transition-all duration-300 pointer-events-none"
        style={{
          maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)"
        }}
      />
      {/* Logo */}
      <NavLink to="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:static lg:translate-x-0 lg:translate-y-0 lg:-mt-1 inline-flex items-center lg:-ml-3">
        <img src="/landingpage/incridea.webp" alt="Incridea" className="h-8 sm:h-9 md:h-12 lg:h-14 mt-2 md:mt-2 w-auto" draggable={false} onContextMenu={(e) => e.preventDefault()} />
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden lg:flex justify-center items-center lg:mt-5">
        <div className="hidden lg:flex gap-12">
          <NavLink
            to="/events"
            className={({ isActive }) =>
              `font-moco text-xl md:text-3xl tracking-wide md:tracking-widest font-bold uppercase transition-colors duration-300 cursor-target ${isActive ? "text-purple-400" : "text-white hover:text-purple-300"
              }`
            }
          >
            Events
          </NavLink>
          <NavLink
            to={user?.pid ? "/profile" : "/register"}
            className={({ isActive }) =>
              `font-moco text-xl md:text-3xl tracking-wide md:tracking-widest font-bold uppercase transition-colors duration-300 cursor-target ${isActive ? "text-purple-400" : "text-white hover:text-purple-300"
              }`
            }
          >
            {user?.pid ? "Profile" : "Register"}
          </NavLink>
          <NavLink
            to="/pronite"
            className={({ isActive }) =>
              `font-moco text-xl md:text-3xl tracking-wide md:tracking-widest font-bold uppercase transition-colors duration-300 cursor-target ${isActive ? "text-purple-400" : "text-white hover:text-purple-300"
              }`
            }
          >
            Pronite
          </NavLink>
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 ml-auto justify-end lg:mt-5">
        {isAuthenticated && (
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-white hover:text-purple-300 transition-colors p-2 relative"
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <NotificationPopup
                notifications={notifications}
                onMarkAsRead={async (id) => {
                  try {
                    await markNotificationAsRead(id);
                    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
                  } catch (error) {
                    console.error("Failed to mark as read", error);
                  }
                }}
                onDelete={async (id) => {
                  try {
                    await deleteNotification(id);
                    setNotifications(prev => prev.filter(n => n.id !== id));
                  } catch (error) {
                    console.error("Failed to delete notification", error);
                  }
                }}
                onClose={() => setShowNotifications(false)}
              />

            )}
          </div>
        )}

        {isAuthenticated ? (
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={onLogout}
              className="
                hidden lg:block
                px-4 py-1.5 md:px-6 md:py-2 rounded-md
                bg-[#5b21b6] hover:bg-[#4c1d95]
                text-white font-moco font-bold tracking-wider text-sm md:text-sm
                uppercase
                transition-all duration-300
                skew-x-[-10deg]
                cursor-target
              "
              title="Logout"
            >
              <span className="block skew-x-10">Logout</span>
            </button>
          </div>
        ) : (
          !isLoading && (
            <NavLink
              to="/login"
              className="
                hidden lg:block
                px-4 py-1.5 md:px-6 md:py-2 rounded-md
                bg-[#5b21b6] hover:bg-[#4c1d95]
                text-white font-moco font-bold tracking-wider text-sm md:text-sm
                uppercase
                transition-all duration-300
                skew-x-[-10deg]
                cursor-target
                -mt-1
              "
            >
              <span className="block skew-x-10 whitespace-nowrap">Sign In</span>
            </NavLink>
          )
        )}
        <MobileMenu onLogout={onLogout} isAuthenticated={isAuthenticated} />
      </div>
    </div>
  );
};

export default Navbar;
