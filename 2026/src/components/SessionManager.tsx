import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTask } from '../hooks/useTask';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTaskStatus } from '../api/task';

const S_KEY = 'p8s3j2l9';
const T_LIMIT = 10000;

const SessionManager = () => {
    const { user } = useAuth();
    const { completeTask } = useTask();
    const location = useLocation();
    const lastActivity = useRef(Date.now());

    const { data: statusData } = useQuery({
        queryKey: ['sessionStatus', user?.id],
        queryFn: getTaskStatus,
        enabled: !!user?.pid,
        retry: false,
    });

    const isSessionValid = user?.completedTasks?.some(t => t.taskKey === S_KEY);

    const isSessionActive = statusData?.status === 'ACTIVE' && statusData?.task?.key === S_KEY;

    const handleSessionEnd = useCallback(() => {
        if (isSessionActive && statusData?.task?.id) {
            completeTask(statusData.task.id);
        }
    }, [isSessionActive, statusData, completeTask]);

    useEffect(() => {
        if (location.pathname !== '/' || !user?.pid || isSessionValid || !isSessionActive) return;

        lastActivity.current = Date.now();

        let checkInterval: ReturnType<typeof setInterval>;

        const updateActivity = () => {
            lastActivity.current = Date.now();
        };

        const checkIdle = () => {
            const now = Date.now();
            const elapsed = now - lastActivity.current;

            if (elapsed >= T_LIMIT) {
                completeTask(S_KEY);
                cleanup();
            }
        };

        const cleanup = () => {
            if (checkInterval) clearInterval(checkInterval);
            window.removeEventListener('mousemove', updateActivity);
            window.removeEventListener('keydown', updateActivity);
            window.removeEventListener('touchstart', updateActivity);
            window.removeEventListener('scroll', updateActivity);
        };

        window.addEventListener('mousemove', updateActivity);
        window.addEventListener('keydown', updateActivity);
        window.addEventListener('touchstart', updateActivity, { passive: true });
        window.addEventListener('scroll', updateActivity, { passive: true });

        checkInterval = setInterval(checkIdle, 1000);

        return cleanup;
    }, [location.pathname, user?.pid, isSessionValid, isSessionActive, handleSessionEnd]);

    return null;
};

export default SessionManager;
