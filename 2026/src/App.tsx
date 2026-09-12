import { useMemo, useState, useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.tsx";

import { SocketProvider } from "./context/SocketContext";

import TargetCursor from "./components/TargetCursor.tsx";
import WormholeLoader from "./components/wormholeloader/WormholeLoader.tsx";
import PageTransitionHandler from "./components/loader/PageTransitionHandler.tsx";
import NavigationMetrics from "./components/NavigationMetrics";
import SessionHeartbeat from "./components/SessionHeartbeat";

import GoogleAnalytics from "./components/GoogleAnalytics";
import { TARGET_DATE } from "./config";
import ArchiveBanner from "./archive/ArchiveBanner";
import { isArchiveMode, isWaybackDirectory } from "./archive/archive";
import WaybackDirectory from "./archive/WaybackDirectory";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  if (isWaybackDirectory) {
    return <WaybackDirectory />;
  }

  const [isLoading, setIsLoading] = useState(() => {
    if (isArchiveMode) return false;
    const isHome = window.location.pathname === "/";
    const isTargetDate = Date.now() >= TARGET_DATE.getTime();
    const hasShown = sessionStorage.getItem("initialLoaderShown");
    return isHome && isTargetDate && !hasShown;
  });

  useEffect(() => {
    if (isLoading) {
      sessionStorage.setItem("initialLoaderShown", "true");
    }
  }, [isLoading]);

  useEffect(() => {
    // Disable browser's automatic scroll restoration
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    // Show loader for the duration of the wormhole animation (7 seconds)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3900);

    return () => clearTimeout(timer);
  }, []);

  const backgroundStyle = useMemo(() => {
    const blobs = Array.from({ length: 5 })
      .map(() => {
        const x = Math.floor(Math.random() * 100);
        const y = Math.floor(Math.random() * 100);
        const size = 20 + Math.floor(Math.random() * 40);
        const colors = [
          "#000000",
          "#000000",
          "#000000",
          "#000000",
          "#1e0b24",
          "#030202",
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        return `radial-gradient(circle at ${x}% ${y}%, ${color} 0%, transparent ${size}%)`;
      })
      .join(", ");

    return {
      backgroundColor: "#000000",
      backgroundImage: blobs,
    };
  }, []);

  // Preload DimensionalDriftLoader assets
  useEffect(() => {
    const assetsToPreload = [
      "/loader/bg-loader.webp",
      "/loader/bg-fg.webp",
      "/loader/character/1.png",
      "/loader/character/2.png",
      "/loader/character/3.png",
      "/loader/character/4.png",
      "/loader/character/5.png",
      "/loader/character/6.png",
      "/loader/character/7.png",
      "/loader/character/8.png",
      "/loader/character/9.png",
    ];

    assetsToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  if (isLoading) {
    return <WormholeLoader />;
  }
  return (
    <BrowserRouter>
      <div
        className="fixed inset-0 w-screen h-screen flex items-center justify-center -z-50 pointer-events-none overflow-hidden"
        style={{ transform: "translateZ(0)" }}
      >
        <div
          style={{
            ...backgroundStyle,
            width: "200vmax",
            height: "200vmax",
          }}
          className="animate-slow-spin transition-all duration-1000"
        />
      </div>
      <SocketProvider>
        <TargetCursor spinDuration={2.8} hoverDuration={0.7} />
        {!isArchiveMode && <NavigationMetrics />}
        {!isArchiveMode && <SessionHeartbeat />}
        <PageTransitionHandler>
          {!isArchiveMode && <GoogleAnalytics />}
          <ScrollToTop />
          <ArchiveBanner />
          <AppRoutes />
        </PageTransitionHandler>
      </SocketProvider>
    </BrowserRouter>
  );
}

export default App;
