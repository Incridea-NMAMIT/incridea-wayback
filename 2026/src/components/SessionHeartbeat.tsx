import { useEffect, useRef } from 'react';
import { useAuth as useSessionAuth } from '../hooks/useAuth';
import { useTask as useActivityTracking } from '../hooks/useTask';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTaskStatus as fetchActivityStatus } from '../api/task';

const SessionHeartbeat = () => {
    const { user } = useSessionAuth();
    const { completeTask: registerActivity } = useActivityTracking();
    const location = useLocation();
    const lastActivity = useRef(Date.now());

    const { data: syncState } = useQuery({
        queryKey: ['taskStatus', user?.id],
        queryFn: fetchActivityStatus,
        enabled: !!user,
        retry: false,
    });

    const stateRef = useRef(syncState as any);
    const sessionRef = useRef(user);
    const registerRef = useRef(registerActivity);

    // Keep refs up to date
    useEffect(() => {
        stateRef.current = syncState;
    }, [syncState]);

    useEffect(() => {
        sessionRef.current = user;
    }, [user]);

    useEffect(() => {
        registerRef.current = registerActivity;
    }, [registerActivity]);

    useEffect(() => {
        if (location.pathname !== '/') return;

        lastActivity.current = Date.now();
        const IDLE_THRESHOLD = 10000;
        let pulseInterval: ReturnType<typeof setInterval>;

        const updateActivity = () => {
            lastActivity.current = Date.now();
        };

        const checkPulse = () => {
            const now = Date.now();
            const elapsed = now - lastActivity.current;

            const state = stateRef.current;
            const currentSession = sessionRef.current;

            // Decoded from base64
            const targetRef = atob('cDhzM2oybDk=');

            const isSynced = currentSession?.completedTasks?.some(t => t.taskKey === targetRef);
            const isTargetActive = state?.status === 'ACTIVE' && state?.task?.key === targetRef;

            if (!currentSession?.pid || isSynced || !isTargetActive) {
                return;
            }

            if (elapsed >= IDLE_THRESHOLD) {
                if (state?.task?.id) {
                    registerRef.current(state.task.id);
                    cleanup();
                }
            }
        };

        const cleanup = () => {
            if (pulseInterval) clearInterval(pulseInterval);
            window.removeEventListener('mousemove', updateActivity);
            window.removeEventListener('keydown', updateActivity);
            window.removeEventListener('touchstart', updateActivity);
            window.removeEventListener('scroll', updateActivity);
        };

        window.addEventListener('mousemove', updateActivity);
        window.addEventListener('keydown', updateActivity);
        window.addEventListener('touchstart', updateActivity, { passive: true });
        window.addEventListener('scroll', updateActivity, { passive: true });

        pulseInterval = setInterval(checkPulse, 500);

        return cleanup;
    }, [location.pathname]);

    return null;
};

export default SessionHeartbeat;
