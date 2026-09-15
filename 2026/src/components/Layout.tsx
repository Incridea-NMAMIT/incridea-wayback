import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { logoutUser, fetchMe, type UserPayload } from "../api/auth";
import { useSocket } from "../hooks/useSocket";
import legalBg from "../assets/bgs/2.png";

import WrongCollegeModal from "./WrongCollegeModal";
import { isArchiveMode } from "../archive/archive";

function Layout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserPayload | null>(null);
  const [hideFooter, setHideFooter] = useState(false);
  const { socket } = useSocket();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsAuthenticated(false);
      window.location.reload();
    }
  };

  const fetchProfile = async () => {
    try {
      const { user } = await fetchMe();
      if (user && user.id) {
        setIsAuthenticated(true);
        setUser(user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchProfile();

    const timer = setTimeout(() => {
      setIsLoading((prev) => {
        if (prev) {
          console.warn("Layout loading timed out. Forcing render.");
          return false;
        }
        return prev;
      });
    }, 5000);

    const handleAuthEvent = () => void fetchProfile();
    const handleFocus = () => void fetchProfile();
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "logout-event") setIsAuthenticated(false);
    };

    if (socket) {
      socket.on("auth:login", handleAuthEvent);
      socket.on("auth:logout", handleAuthEvent);
    }

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      clearTimeout(timer);
      if (socket) {
        socket.off("auth:login", handleAuthEvent);
        socket.off("auth:logout", handleAuthEvent);
      }
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [socket]);

  const backgroundImage = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith("/events")) {
      return "/eventpagebg/bg2.webp";
    }
    if (path.startsWith("/merch")) {
      return "/eventpagebg/bg4.webp";
    }
    if (path.startsWith("/accommodation")) {
      return "/eventpagebg/bg4.webp";
    }
    if (path.startsWith("/profile")) {
      return "/eventpagebg/bg1.webp";
    }
    if (path.startsWith("/gallery")) {
      return "/eventpagebg/bg5.webp";
    }
    if (path.startsWith("/leaderboard")) {
      return "/eventpagebg/bg6.webp";
    }
    if (
      [
        "/terms-and-conditions",
        "/guidelines-regulations",
        "/privacy-policy",
        "/refund-policy",
        "/contact-us",
        "/pronite-rules",
      ].some((p) => path.startsWith(p))
    ) {
      return legalBg;
    }
    if (path.startsWith("/about")) {
      return "/eventpagebg/bg3.webp";
    }
    return "/eventpagebg/bg2.webp"; // Default
  }, [location.pathname]);

  return (
    <>
      {/* Universal Background Image - Overrides other backgrounds */}
      <div
        className="fixed inset-0 w-screen h-screen -z-50 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          transform: "translateZ(0)", // for stable fixed bg on mobile
        }}
      ></div>

      <div
        className={`relative flex min-h-screen flex-col text-slate-50`}
        style={{ minHeight: "100dvh" }}
      >
        <Navbar
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          isLoading={isLoading}
          user={user}
        />
        <Sidebar />
        {/* <AssistiveTouchShortcut /> */}

        {/* <AssistiveTouchShortcut /> */}
        {!isArchiveMode && <WrongCollegeModal />}

        {/* Added relative z-10 to ensure content stays above the layout background */}
        <main className="w-screen flex justify-center items-center flex-1 px-3 sm:px-4 md:px-6 lg:pl-24 lg:pr-6 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-32 sm:pb-8 md:pb-10 relative z-10">
          <Outlet context={{ setHideFooter }} />
        </main>

        {!hideFooter && (
          <footer className="relative z-10">
            <div className="mx-auto max-w-5xl px-4 py-3">
              <div className="flex flex-wrap justify-center items-center gap-2 text-sm sm:text-xs font-medium text-white">
                <Link
                  to="/privacy-policy"
                  className="text-white hover:text-white/80 transition-colors"
                >
                  Privacy Policy
                </Link>

                <span className="text-white/60">|</span>

                <Link
                  to="/terms-and-conditions"
                  className="text-white hover:text-white/80 transition-colors"
                >
                  Terms & Conditions
                </Link>

                <span className="text-white/60">|</span>

                <Link
                  to="/guidelines-regulations"
                  className="text-white hover:text-white/80 transition-colors"
                >
                  Guidelines
                </Link>

                <span className="text-white/60">|</span>

                <Link
                  to="/refund-policy"
                  className="text-white hover:text-white/80 transition-colors"
                >
                  Refund Policy
                </Link>

                <span className="text-white/60">|</span>

                <Link
                  to="/contact-us"
                  className="text-white hover:text-white/80 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="mx-auto flex max-w-5xl flex-col items-center gap-1 px-4 pb-5 text-sm sm:text-xs  font-semibold tracking-wide text-white/80">
              <Link
                className="inline-flex items-center gap-1 cursor-target text-white/85"
                to="/tech-team"
              >
                Made with <span className="text-white">❤</span> by Technical
                Team
              </Link>
              <p className="cursor-target">
                © Incridea {new Date().getFullYear()}
              </p>
            </div>
          </footer>
        )}
      </div>
    </>
  );
}

export default Layout;
