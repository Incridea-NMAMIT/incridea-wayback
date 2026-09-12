import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTask as useActivityTracking } from '../hooks/useTask';
import { useAuth as useSessionAuth } from '../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { getTaskStatus as fetchActivityStatus } from '../api/task';
import { showToast } from '../utils/toast';

const d = (s: string) => atob(s);

const NavigationMetrics = () => {
    const location = useLocation();
    const { completeTask: registerActivity } = useActivityTracking();
    const { user } = useSessionAuth();

    // Fetch active task status
    const { data: syncState } = useQuery({
        queryKey: ['taskStatus', user?.id],
        queryFn: fetchActivityStatus,
        enabled: !!user?.pid,
        retry: false,
    });

    const currentCampaign = syncState?.status === 'ACTIVE' ? (syncState as any).task?.key : null;

    // Refs to track state without re-renders
    const timeRef = useRef<number>(0);
    const processingSet = useRef(new Set<string>());

    // Helper to check if task is already completed
    const hasHistory = (refId: string) => {
        return user?.completedTasks?.some(t => t.taskKey === refId || t.taskId === refId);
    };

    const recordMetric = (refId: string) => {
        // Double check active status before attempting
        if (currentCampaign !== refId) return;
        if (processingSet.current.has(refId)) return;

        processingSet.current.add(refId);
        registerActivity(refId).finally(() => {
            setTimeout(() => {
                processingSet.current.delete(refId);
            }, 5000);
        });
    };

    // 1. Route-based Analytics
    useEffect(() => {
        if (!currentCampaign) return;

        // The Fivefold Trace (Speed Run) -> n1v6p8k5
        const c1 = d('bjF2NnA4azU=');
        if (currentCampaign === c1) {
            const processNavFlow = async () => {
                if (hasHistory(c1)) return;

                const now = Date.now();
                const requiredPages = [d('Lw=='), d('L2V2ZW50cw=='), d('L2dhbGxlcnk='), d('L2Fib3V0'), d('L2NvbnRhY3QtdXM=')];

                let currentPath = location.pathname.endsWith('/') && location.pathname !== '/'
                    ? location.pathname.slice(0, -1)
                    : location.pathname;

                if (currentPath === '/contact') currentPath = d('L2NvbnRhY3QtdXM=');

                if (!requiredPages.includes(currentPath)) return;

                const s1 = d('bjF2NnA4azVfc3RhcnQ=');
                const s2 = d('bjF2NnA4azVfdmlzaXRlZA==');

                const storedStart = sessionStorage.getItem(s1);
                const visitedRaw = sessionStorage.getItem(s2);
                let visited: string[] = visitedRaw ? JSON.parse(visitedRaw) : [];

                // Start or reset if timeout
                if (!storedStart) {
                    sessionStorage.setItem(s1, now.toString());
                    visited = [currentPath];
                } else {
                    const startTime = parseInt(storedStart);
                    const elapsed = now - startTime;

                    if (elapsed > 30000) {
                        // Reset if > 30s
                        sessionStorage.setItem(s1, now.toString());
                        visited = [currentPath];
                    } else {
                        if (!visited.includes(currentPath)) {
                            visited.push(currentPath);
                        }
                    }
                }

                sessionStorage.setItem(s2, JSON.stringify(visited));

                if (visited.length === requiredPages.length) {
                    await recordMetric(c1);
                    sessionStorage.removeItem(s1);
                    sessionStorage.removeItem(s2);
                }
            };
            processNavFlow();
        }

        // The Threefold Passage (Sequence) -> m9c4b7q2
        const c2 = d('bTljNGI3cTI=');
        if (currentCampaign === c2) {
            const processSequence = async () => {
                if (hasHistory(c2)) return;

                const sequence = [d('L2V2ZW50cw=='), d('L3Byb2ZpbGU='), d('L3Byb25pdGU=')];
                const currentPath = location.pathname;

                if (!sequence.includes(currentPath)) return;

                const s3 = d('dHJpbml0eV9zZXF1ZW5jZQ==');
                const storedSequenceRaw = sessionStorage.getItem(s3);
                let storedSequence: string[] = storedSequenceRaw ? JSON.parse(storedSequenceRaw) : [];

                if (currentPath === sequence[0]) {
                    storedSequence = [sequence[0]];
                } else if (storedSequence.length > 0) {
                    const lastVisited = storedSequence[storedSequence.length - 1];
                    const nextExpectedIndex = sequence.indexOf(lastVisited) + 1;

                    if (sequence[nextExpectedIndex] === currentPath) {
                        storedSequence.push(currentPath);
                    } else if (!storedSequence.includes(currentPath)) {
                        storedSequence = [];
                    }
                }

                sessionStorage.setItem(s3, JSON.stringify(storedSequence));

                if (storedSequence.length === 3 && storedSequence[2] === sequence[2]) {
                    await recordMetric(c2);
                    sessionStorage.removeItem(s3);
                }
            };
            processSequence();
        }

    }, [location.pathname, currentCampaign, user]);


    // 2. Duration-based Analytics
    useEffect(() => {
        if (!currentCampaign) return;

        let timer: ReturnType<typeof setInterval>;
        timeRef.current = 0;

        const startTimer = (refId: string, duration: number) => {
            if (currentCampaign !== refId || hasHistory(refId)) return;

            timer = setInterval(() => {
                timeRef.current += 1;
                if (timeRef.current >= duration) {
                    recordMetric(refId);
                    clearInterval(timer);
                }
            }, 1000);
        };

        const c3 = d('ZjVxMWw4Yjc='); // f5q1l8b7
        const c4 = d('aDZ0OW01YzE='); // h6t9m5c1
        const c5 = d('cTVyN3QxdzQ='); // q5r7t1w4

        if (location.pathname === d('L3Byb25pdGU=') && currentCampaign === c3) {
            startTimer(c3, 30);
        } else if (location.pathname === d('L2Fib3V0') && currentCampaign === c4) {
            startTimer(c4, 15);
        } else if (location.pathname === d('Lw==') && currentCampaign === c5) {
            startTimer(c5, 15);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [location.pathname, currentCampaign, user]);


    // 3. Scroll Depth Analytics
    useEffect(() => {
        if (!currentCampaign) return;

        const handleScroll = () => {
            const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
            if (bottom) {
                const c6 = d('YjR0OGwyeDk='); // b4t8l2x9
                const c7 = d('ZzhrM3IyeDQ='); // g8k3r2x4
                const c8 = d('YTdmMms5cTE='); // a7f2k9q1

                if (location.pathname === d('L2dhbGxlcnk=') && currentCampaign === c6 && !hasHistory(c6)) {
                    recordMetric(c6);
                }
                if (location.pathname === d('L21lcmNo') && currentCampaign === c7 && !hasHistory(c7)) {
                    recordMetric(c7);
                }
                if (location.pathname === d('L3Rlcm1zLWFuZC1jb25kaXRpb25z') && currentCampaign === c8 && !hasHistory(c8)) {
                    recordMetric(c8);
                }
            }
        };

        const relevantPaths = [d('L2dhbGxlcnk='), d('L21lcmNo'), d('L3Rlcm1zLWFuZC1jb25kaXRpb25z')];
        if (relevantPaths.includes(location.pathname)) {
            window.addEventListener('scroll', handleScroll, { passive: true });
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname, currentCampaign, user]);


    // 4. External Outbound Analytics
    useEffect(() => {
        if (!currentCampaign) return;

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');

            if (link && user?.pid) {
                const href = link.href.toLowerCase();
                let metricToRecord: string | null = null;

                const c9 = d('ajNwOHYybjc='); // j3p8v2n7
                const c10 = d('azdsMWY5czY='); // k7l1f9s6

                if (href.includes(d('aW5zdGFncmFtLmNvbQ==')) && currentCampaign === c9) {
                    if (!hasHistory(c9)) metricToRecord = c9;
                } else if ((href.includes(d('eW91dHViZS5jb20=')) || href.includes(d('eW91dHUuYmU='))) && currentCampaign === c10) {
                    if (!hasHistory(c10)) metricToRecord = c10;
                }

                if (metricToRecord) {
                    if (processingSet.current.has(metricToRecord)) return;
                    processingSet.current.add(metricToRecord);

                    // Use fetch with keepalive to ensure request survives navigation
                    const baseUrl = import.meta.env.VITE_API_URL || '/api';
                    const url = `${baseUrl.replace(/\/+$/, '')}${d('L2FwaS90YXNrcy9jb21wbGV0ZQ==')}`;

                    fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ taskId: metricToRecord }),
                        keepalive: true,
                        credentials: 'include',
                    }).then(res => {
                        if (res.ok) showToast("Task Completed: +100 XP!", "success");
                    }).finally(() => {
                        setTimeout(() => {
                            if (metricToRecord) processingSet.current.delete(metricToRecord);
                        }, 5000);
                    });
                }
            }
        };

        window.addEventListener('click', handleClick, true);
        return () => window.removeEventListener('click', handleClick, true);
    }, [user, currentCampaign]);

    return null;
};

export default NavigationMetrics;
