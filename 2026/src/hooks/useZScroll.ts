import { useEffect, useRef, type RefObject } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { lerp, clamp } from '@/utils/pronite';

// Event-driven Z-Scroll Hook
type ScrollEventCallback = (element: HTMLElement) => void;
type ScrollProgressCallback = (element: HTMLElement, phase: number) => void;

interface UseZScrollOptions {
    onUpdate?: (cameraZ: number) => void;
    onLayerEnter?: ScrollEventCallback;
    onLayerExit?: ScrollEventCallback;
    onLayerScrollProgress?: ScrollProgressCallback;
}

export const useZScroll = (containerRef: RefObject<HTMLDivElement | null>, options?: UseZScrollOptions) => {
    const { onUpdate, onLayerEnter, onLayerExit, onLayerScrollProgress } = options || {};
    const lenisRef = useRef<Lenis | null>(null);
    const currentZRef = useRef(0);
    const targetZRef = useRef(0);
    const enteredLayers = useRef<Set<HTMLElement>>(new Set());
    const totalDistanceRef = useRef(0);

    const FADE_DISTANCE = 4000;

    useEffect(() => {
        if (!containerRef.current) return;

        const layers = containerRef.current.querySelectorAll<HTMLElement>('.z-layer');
        const rocketWrapper = document.querySelector<HTMLElement>('.logo-bottom-wrapper');

        // Parse depths & Init
        const layerData = Array.from(layers).map(layer => {
            layer.style.willChange = 'transform, opacity, filter';

            // Force initial centered state to override any CSS transforms (like translateY(40px))
            gsap.set(layer, { x: 0, y: 0, z: 0, overwrite: 'auto' });

            return {
                element: layer,
                depth: parseFloat(layer.dataset.z || '0'),
                persistDist: layer.dataset.persist ? parseFloat(layer.dataset.persist) : 1500,
                fadeExp: layer.dataset.fadeExp ? parseFloat(layer.dataset.fadeExp) : 1.5,
                isPinnable: layer.dataset.pin === "true",
                isArtist: !!layer.dataset.artistId,
                isArtistImage: !!layer.dataset.artistImage,  // NEW: skip in update loop
                artistRange: parseFloat(layer.dataset.artistRange || '5000'),
            };
        });

        const furthestZ = Math.min(...layerData.map(l => l.depth));
        const totalDistance = Math.abs(furthestZ);
        totalDistanceRef.current = totalDistance;

        // Scroll track
        const scrollTrack = document.createElement('div');
        Object.assign(scrollTrack.style, {
            position: 'absolute', top: '0', left: '0',
            width: '1px', height: `${totalDistance}px`,
            pointerEvents: 'none', visibility: 'hidden'
        });
        document.body.appendChild(scrollTrack);

        // Detect mobile for performance optimization
        const isMobile = typeof window !== 'undefined' && (
            window.innerWidth < 768 ||
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        );

        const lenis = new Lenis({
            // Faster, more responsive on mobile
            duration: isMobile ? 0.8 : 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            // Disable smooth wheel on mobile for better performance
            smoothWheel: !isMobile,
            // Mobile-specific optimizations
            touchMultiplier: isMobile ? 1.5 : 2,
            wheelMultiplier: isMobile ? 0.8 : 1,
        });
        lenisRef.current = lenis;

        // Initialize elements
        if (rocketWrapper) gsap.set(rocketWrapper, { bottom: '0%' });

        lenis.on('scroll', ({ progress }: { progress: number }) => {
            targetZRef.current = -progress * totalDistance;

            // Sync Scroll Progress Bar
            const p = Math.max(0, Math.min(1, progress));

            if (rocketWrapper) {
                rocketWrapper.style.bottom = `${p * 100}%`;
            }
        });

        // ============================================================
        // DRAGGABLE SCROLL TRACK
        // Smooth drag handling that integrates with Lenis scroll system
        // ============================================================
        const scrollContainer = document.querySelector<HTMLElement>('.scroll-progress-container');
        const scrollTrackEl = document.querySelector<HTMLElement>('.scroll-track');
        const rocketImg = document.querySelector<HTMLElement>('.progress-logo-bottom');

        // Prevent native browser image drag on the rocket
        if (rocketImg) {
            rocketImg.setAttribute('draggable', 'false');
            rocketImg.style.userSelect = 'none';
            (rocketImg.style as unknown as Record<string, string>).webkitUserDrag = 'none';
        }

        let isDragging = false;
        let dragStartY = 0;
        let dragStartScroll = 0;

        const getClientY = (e: MouseEvent | TouchEvent): number => {
            if ('touches' in e && e.touches.length > 0) {
                return e.touches[0].clientY;
            }
            return (e as MouseEvent).clientY;
        };

        const onDragStart = (e: MouseEvent | TouchEvent) => {
            if (!scrollTrackEl) return;

            // CRITICAL FIX: Only start drag if the event target is the scroll track or its children
            // This prevents the drag from interfering with normal page scrolling on mobile
            const target = e.target as HTMLElement;
            if (!target.closest('.scroll-track') && target !== scrollTrackEl) {
                return;
            }

            isDragging = true;
            dragStartY = getClientY(e);
            dragStartScroll = lenis.scroll;

            // Prevent native drag/selection
            if (e.cancelable) e.preventDefault();
            document.body.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        };

        const onDragMove = (e: MouseEvent | TouchEvent) => {
            if (!isDragging || !scrollTrackEl) return;

            // Safety: if mouse button released outside window
            if ('buttons' in e && (e as MouseEvent).buttons === 0) {
                isDragging = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
                return;
            }

            if (e.cancelable) e.preventDefault();

            const clientY = getClientY(e);
            const deltaY = clientY - dragStartY;
            const trackRect = scrollTrackEl.getBoundingClientRect();
            const trackHeight = trackRect.height || 1;
            const maxScroll = lenis.limit || totalDistance || 1;

            // Calculate new scroll position
            const sensitivity = 1.2;
            const scrollDelta = -(deltaY / trackHeight) * maxScroll * sensitivity;
            const targetScroll = clamp(dragStartScroll + scrollDelta, 0, maxScroll);

            // Update Lenis scroll immediately without animation
            lenis.scrollTo(targetScroll, { immediate: true, force: true });
        };

        const onDragEnd = () => {
            if (!isDragging) return;
            isDragging = false;

            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };

        if (scrollContainer) {
            scrollContainer.addEventListener('mousedown', onDragStart);
            scrollContainer.addEventListener('touchstart', onDragStart, { passive: false });
        }

        window.addEventListener('mousemove', onDragMove, { passive: false });
        window.addEventListener('mouseup', onDragEnd);
        window.addEventListener('touchmove', onDragMove, { passive: false });
        window.addEventListener('touchend', onDragEnd);

        // Loop
        const update = (time: number) => {
            lenis.raf(time * 1000);

            // Get the current scroll progress to calculate camera Z
            const maxScroll = lenis.limit || totalDistance || 1;
            const scrollProgress = maxScroll > 0 ? lenis.scroll / maxScroll : 0;
            const newTargetZ = -scrollProgress * totalDistance;

            // Update target Z position based on current scroll
            targetZRef.current = newTargetZ;

            // During drag, use the new Z directly without lerp for responsiveness
            // When not dragging, apply smooth lerp (faster on mobile for less lag)
            if (isDragging) {
                currentZRef.current = newTargetZ;
            } else {
                // Mobile: 0.15 (faster, more responsive), Desktop: 0.08 (smoother)
                const lerpFactor = isMobile ? 0.15 : 0.08;
                currentZRef.current = lerp(currentZRef.current, newTargetZ, lerpFactor);
            }
            const currentZ = currentZRef.current;

            if (onUpdate) onUpdate(currentZ);

            layerData.forEach(({ element, depth, persistDist, fadeExp, isPinnable, isArtist, isArtistImage, artistRange }) => {
                const relativeZ = depth - currentZ;

                // ======================================================
                // ARTIST IMAGE LAYERS: fully managed by onArtistScrollProgress
                // Skip here to prevent the hook from fighting with applyImageDepth()
                // ======================================================
                if (isArtistImage) return;

                // ======================================================
                // ARTIST LAYERS: Phase-driven system (replaces enter/exit)
                // ======================================================
                if (isArtist) {
                    // Phase: 0 = artist just appeared, 1 = artist fully exited
                    // relativeZ goes from some negative to some positive value
                    // When relativeZ = 0, camera is exactly at artist depth
                    // Artist active range: relativeZ from -200 (slight pre-reveal) to artistRange
                    const phaseStart = -200;    // slight anticipation before depth
                    const phaseEnd = artistRange; // full range
                    const totalPhaseRange = phaseEnd - phaseStart;

                    const rawPhase = (relativeZ - phaseStart) / totalPhaseRange;
                    const phase = clamp(rawPhase, 0, 1);

                    // Visibility: only visible while in phase range (with buffer)
                    const isInRange = relativeZ >= phaseStart - 500 && relativeZ <= phaseEnd + 500;

                    let opacity = 0;
                    if (relativeZ < phaseStart - 500) {
                        opacity = 0; // too far in front
                    } else if (relativeZ < phaseStart) {
                        // Fade in as approaching
                        const fadeProgress = 1 - Math.abs(relativeZ - phaseStart) / 500;
                        opacity = clamp(fadeProgress, 0, 1);
                    } else if (relativeZ <= phaseEnd) {
                        opacity = 1; // fully active
                    } else if (relativeZ <= phaseEnd + 500) {
                        // Fade out exiting
                        const fadeProgress = (relativeZ - phaseEnd) / 500;
                        opacity = clamp(1 - fadeProgress, 0, 1);
                    }

                    // PIN the artist layer while in active range
                    let zPos = relativeZ;
                    if (relativeZ >= 0 && relativeZ < artistRange) {
                        zPos = 0; // pinned
                    }

                    gsap.set(element, {
                        x: 0,
                        y: 0,
                        z: zPos,
                        scale: 1,
                        autoAlpha: opacity,
                        overwrite: 'auto'
                    });

                    // Fire scroll progress callback
                    if (onLayerScrollProgress && isInRange) {
                        onLayerScrollProgress(element, phase);
                    }

                    // Active class
                    if (opacity > 0.1) {
                        element.classList.add('active');
                    } else {
                        element.classList.remove('active');
                    }

                    return; // skip generic logic below
                }

                // ======================================================
                // NON-ARTIST LAYERS: Original enter/exit event system
                // ======================================================

                // --- VISIBILITY & EVENTS ---
                const isFarGone = relativeZ < -FADE_DISTANCE || relativeZ > 2000;

                // Opacity Logic
                let opacity = 0;

                if (relativeZ < -FADE_DISTANCE) {
                    opacity = 0;
                } else if (relativeZ < 0) {
                    const linearProgress = 1 - (Math.abs(relativeZ) / FADE_DISTANCE);
                    opacity = Math.pow(linearProgress, fadeExp);
                } else {
                    if (isPinnable && relativeZ < persistDist) {
                        opacity = 1;
                    } else {
                        const exitProgress = (relativeZ - persistDist) / 500;
                        opacity = clamp(1 - exitProgress, 0, 1);
                    }
                }

                // --- EVENT TRIGGERING (non-artist only) ---
                if (opacity > 0.01) {
                    if (relativeZ >= -10 && !enteredLayers.current.has(element)) {
                        enteredLayers.current.add(element);
                        if (onLayerEnter) onLayerEnter(element);
                    }

                    const exitPoint = persistDist - 800;
                    const isExiting = relativeZ >= exitPoint;

                    if (onLayerExit && isExiting && element.dataset.exited !== "true") {
                        element.dataset.exited = "true";
                        onLayerExit(element);
                    }
                    else if (onLayerExit && !isExiting && element.dataset.exited === "true") {
                        element.dataset.exited = "false";
                        if (onLayerEnter) onLayerEnter(element);
                    }

                } else {
                    if (isFarGone && enteredLayers.current.has(element)) {
                        enteredLayers.current.delete(element);
                        element.dataset.exited = "false";
                    }
                }

                // --- TRANSFORM ---
                let zPos = relativeZ;
                let scale = 1;

                if (isPinnable && relativeZ >= 0 && relativeZ < persistDist) {
                    zPos = 0; // PIN
                } else if (!isPinnable && relativeZ <= 0) {
                    scale = clamp(1 + (relativeZ / 2000), 0.5, 1);
                }

                // Apply
                gsap.set(element, {
                    x: 0,
                    y: 0,
                    z: zPos,
                    scale: scale,
                    autoAlpha: opacity,
                    overwrite: 'auto'
                });

                // Active State
                const effectiveDistance = (isPinnable && relativeZ >= 0 && relativeZ < persistDist) ? 0 : Math.abs(relativeZ);
                if (effectiveDistance < 300 || opacity > 0.1) {
                    element.classList.add('active');
                } else {
                    element.classList.remove('active');
                }
            });
        };

        gsap.ticker.add(update);

        return () => {
            gsap.ticker.remove(update);
            lenis.destroy();
            scrollTrack.remove();

            // Clean up drag listeners
            if (scrollContainer) {
                scrollContainer.removeEventListener('mousedown', onDragStart);
                scrollContainer.removeEventListener('touchstart', onDragStart);
            }
            window.removeEventListener('mousemove', onDragMove);
            window.removeEventListener('mouseup', onDragEnd);
            window.removeEventListener('touchmove', onDragMove);
            window.removeEventListener('touchend', onDragEnd);
        };
    }, [containerRef, onUpdate, onLayerEnter, onLayerExit, onLayerScrollProgress]);

    return { lenisRef, totalDistanceRef, currentZRef };
};