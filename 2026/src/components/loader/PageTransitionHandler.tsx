import React from "react";
import DimensionalDriftLoader from "./DimensionalDriftLoader";
import { usePageLoader } from "../../hooks/usePageLoader";
import { useLocation } from "react-router-dom";
import { TARGET_DATE } from "../../config";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { useTask } from "../../hooks/useTask";
import WormholeLoader from "../wormholeloader/WormholeLoader";
import { useAuth } from "../../hooks/useAuth";

interface TaskStatusResponse {
    status: 'LOCKED' | 'ACTIVE' | 'COOLDOWN' | 'COMPLETED_ALL';
    task?: {
        id: string;
        key: string;
    };
}

interface PageTransitionHandlerProps {
    children: React.ReactNode;
}

const PageTransitionHandler: React.FC<PageTransitionHandlerProps> = ({ children }) => {
    const { loading, handleLoaderComplete, loaderType } = usePageLoader();
    const location = useLocation();
    const { completeTask } = useTask();

    const WORMHOLE_DURATION_MS = 2800;

    const { user } = useAuth();

    const { data: taskStatus } = useQuery<TaskStatusResponse>({
        queryKey: ['taskStatus'],
        queryFn: async () => {
            const { data } = await apiClient.get('/tasks/status');
            return data;
        },
        retry: false,
        staleTime: 5 * 60 * 1000, // Cache for 5 mins
        enabled: !!user?.pid
    });

    // Strictly disable loader if we are in the countdown phase (before target date)
    // or if we are explicitly on the countdown page
    const isCountdownPhase = Date.now() < TARGET_DATE.getTime();
    const isCountdownPage = location.pathname === "/countdown";

    const shouldShowLoader = loading && !isCountdownPhase && !isCountdownPage;

    const onLoaderComplete = React.useCallback(() => {
        handleLoaderComplete();
        if (taskStatus?.status === 'ACTIVE' && taskStatus?.task?.key === 'q5r7t1w4') {
            completeTask(taskStatus.task.id);
        }
    }, [handleLoaderComplete, taskStatus, completeTask]);

    React.useEffect(() => {
        if (loading && loaderType === "wormhole") {
            void import("../../pages/HomePage.tsx");

            const timer = window.setTimeout(() => {
                onLoaderComplete();
            }, WORMHOLE_DURATION_MS);

            return () => window.clearTimeout(timer);
        }
        return undefined;
    }, [loading, loaderType, onLoaderComplete]);

    return (
        <>
            {shouldShowLoader && loaderType === "wormhole" && <WormholeLoader />}
            {shouldShowLoader && loaderType !== "wormhole" && (
                <DimensionalDriftLoader onComplete={onLoaderComplete} />
            )}
            {children}
        </>
    );
};

export default PageTransitionHandler;
