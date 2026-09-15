import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export const usePageLoader = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [loaderType, setLoaderType] = useState<"dimensional" | "wormhole" | null>(null);
    const prevPathRef = useRef<string | null>(null);

    useEffect(() => {
        const NO_LOADER_PATHS = [
            "/privacy-policy",
            "/about",
            "/guidelines-regulations",
            "/terms-and-conditions",
            "/contact-us",
            "/refund-policy",
            "/profile",
            "/register",
            "/accommodation",
            "/login"
        ];

        const currentPath = location.pathname;
        const prevPath = prevPathRef.current;

        // Only process if path has actually changed
        if (currentPath === prevPath) {
            return;
        }

        // Skip loader if navigating TO homepage
        const isToHomepage = currentPath === "/";
        const isCountdownToHome = prevPath === "/countdown" && currentPath === "/";

        // Skip loader if navigating TO a static page
        const isStaticPage = NO_LOADER_PATHS.includes(currentPath);

        // Skip loader if navigating between event pages (/events -> /events/slug)
        const isEventTransition = currentPath.startsWith("/events") && prevPath?.startsWith("/events");

        // Determine loader type based on navigation context
        if (isCountdownToHome) {
            setLoading(true);
            setLoaderType("wormhole");
        } else if (!isToHomepage && !isStaticPage && !isEventTransition) {
            setLoading(true);
            setLoaderType("dimensional");
        } else {
            setLoading(false);
            setLoaderType(null);
        }

        // Update ref after processing
        prevPathRef.current = currentPath;
    }, [location.pathname]);

    const handleLoaderComplete = () => {
        setLoading(false);
        setLoaderType(null);
    };

    return { loading, handleLoaderComplete, loaderType };
};
