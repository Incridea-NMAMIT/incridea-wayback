import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { AnimatePresence } from "framer-motion";
import "../components/pronite/Pronite.css";
import Starfield from "../components/pronite/Starfield";
import ProniteCard from "../components/pronite/ProniteCard";
import FinalReveal from "../components/pronite/FinalReveal";
import type { FinalRevealRef } from "../components/pronite/FinalReveal";
import { useZScroll } from "../hooks/useZScroll";
import { clamp } from "../utils/pronite";
import { useNavigate } from "react-router-dom";
import LiquidGlassCard from "../components/liquidglass/LiquidGlassCard";
import SEO from "../components/SEO";

import armaanSong from "../assets/pronite/audios/pehla_pyar_armaan_malik.mp3";
import nikhitaSong from "../assets/pronite/audios/jugnu_nikitha_gandhi.mp3";
import aloSong from "../assets/pronite/audios/saibo_alo.mp3";
import anthemSong from "../assets/pronite/audios/incredia_24_anthem.mp3";

import armaanVideo from "../assets/pronite/videos/armaan_malik.webm";
import aloVideo from "../assets/pronite/videos/alo.webm";
import nikhitaVideo from "../assets/pronite/videos/nikhita.webm";

// --- Layer Configuration ---
interface ArtistData {
    id: string;
    name: string;
    date: string;
    image: string;
    profileImage: string;
    accent: string;
    song: string;
}

const ARTISTS: Record<string, ArtistData> = {
    artist1: {
        id: "a1",
        name: "Armaan Malik",
        date: "",
        image: "pronite/artist1-right.jpg",
        profileImage: "pronite/Armaan_Malik_Profile.jpg",
        accent: "#D84D7D",
        song: armaanSong,
    },
    artist2: {
        id: "a2",
        name: "Nikhita Gandhi",
        date: "",
        image: "pronite/nikhita_gandhi.jpg", // Fixed path
        profileImage: "pronite/Nikhita_Gandhi_profile.jpg",
        accent: "#4DA6D8",
        song: nikhitaSong,
    },
    artist3: {
        id: "a3",
        name: "ALO",
        date: "",
        image: "pronite/alo.png", // Fixed path
        profileImage: "pronite/The_alo_band_profile.jpg",
        accent: "#D84D7D",
        song: aloSong,
    },
};

const SCROLL_STOPS = [
    { id: "hero", z: -100, label: "EXPLORE LINEUP" },
    { id: "about-1", z: -900, label: "ABOUT" },
    { id: "about-2", z: -1900, label: "ABOUT" },
    { id: "artist1", z: -3500, label: "NEXT ARTIST" },
    { id: "artist2", z: -11000, label: "NEXT ARTIST" },
    { id: "artist3", z: -18500, label: "REVEAL FULL LINEUP" },
    { id: "final-reveal", z: -27500, label: "BACK TO TOP" },
];

// These values represent the Z-depth where things look "Perfect"
// You can tweak these numbers to hit the exact center of your images
// Target phase for artist SVG viewing (0.15 = SVG fully revealed, centered, not sliding down yet)

// --- Easing helpers ---
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInCubic = (t: number) => t * t * t;
const easeInOutQuad = (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

const PronitePage: React.FC = () => {
    // Mobile detection for performance optimization
    const [isMobile] = useState(() => {
        return (
            typeof window !== "undefined" &&
            (window.innerWidth < 1025 ||
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                    navigator.userAgent,
                ))
        );
    });

    const navigate = useNavigate();

    const containerRef = useRef<HTMLDivElement>(null);
    const tiltRef = useRef<HTMLDivElement>(null);
    const [isGlobalMuted, setIsGlobalMuted] = useState(false);
    const [isGlobalPlaying, setIsGlobalPlaying] = useState(false);
    const [showRulesModal, setShowRulesModal] = useState(false);
    const [isFinalRevealVisible, setIsFinalRevealVisible] = useState(false);
    const userInteractedRef = useRef(false);
    const layerRefs = useRef<Record<string, HTMLElement | null>>({});
    const [activeArtist, setActiveArtist] = useState<ArtistData | null>(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const rafId = useRef<number | undefined>(undefined);
    const isHovering = useRef(false);
    const starSpeed = useRef(1);
    const [, setButtonLabel] = useState("EXPLORE LINEUP");
    const lastActiveArtistKey = useRef<string | null>(null);
    const finalRevealRef = useRef<FinalRevealRef>(null);
    const finalRevealAnimationTriggered = useRef(false);
    const anthemRef = useRef<HTMLAudioElement | null>(null);

    // Initialize anthem audio
    useEffect(() => {
        const audio = new Audio(anthemSong);
        audio.loop = true;
        audio.volume = 0; // Start silent
        anthemRef.current = audio;
        return () => {
            audio.pause();
            audio.src = "";
        };
    }, []);
    const handleArtistNavigation = (direction: "next" | "prev") => {
        if (!lenisRef.current || !totalDistanceRef.current) return;
        const artistKeys = Object.keys(ARTISTS);
        const currentIdKey = activeArtist
            ? Object.keys(ARTISTS).find((k) => ARTISTS[k].id === activeArtist.id)
            : "artist1";
        let currentIndex = artistKeys.indexOf(currentIdKey || "artist1");

        let nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
        if (nextIndex >= artistKeys.length) nextIndex = 0;
        if (nextIndex < 0) nextIndex = artistKeys.length - 1;

        const targetStop = SCROLL_STOPS.find((s) => s.id === artistKeys[nextIndex]);
        if (targetStop) {
            const maxScroll = totalDistanceRef.current - window.innerHeight;
            const targetScroll =
                (-targetStop.z * maxScroll) / totalDistanceRef.current;
            lenisRef.current.scrollTo(targetScroll, { duration: 2.5 });
        }
    };
    // --- Improved Scroll Tracking with Priority System ---
    const onUpdate = (currentZ: number) => {
        let foundArtistKey: string | null = null;
        let foundArtist: ArtistData | null = null;
        let maxPriority = -Infinity;

        const artistKeys = Object.keys(ARTISTS);
        for (const key of artistKeys) {
            const el = layerRefs.current[key];
            if (el) {
                const depth = parseFloat(el.dataset.z || "0");
                const persist = parseFloat(el.dataset.artistRange || "5000");
                const relativeZ = depth - currentZ;

                const entryStart = -600;
                const exitEnd = persist;

                if (relativeZ >= entryStart && relativeZ <= exitEnd) {
                    const priority = -Math.abs(relativeZ);
                    if (priority > maxPriority) {
                        maxPriority = priority;
                        foundArtistKey = key;
                        foundArtist = ARTISTS[key];
                    }
                }
            }
        }

        if (foundArtistKey !== lastActiveArtistKey.current) {
            lastActiveArtistKey.current = foundArtistKey;
            setActiveArtist(foundArtist);
        }

        // --- Final Reveal Animation ---
        const finalRevealLayer = layerRefs.current["final-reveal"];
        if (finalRevealLayer) {
            const finalZ = -27500;
            const dist = currentZ - finalZ;
            // Start fade at z=-26000 (when dist=1500), full opacity at z=-27500 (dist=0)
            const opacity = 1 - clamp((dist - 0) / 1500, 0, 1);
            const scale = 0.8 + 0.2 * opacity;

            gsap.set(finalRevealLayer, {
                opacity: opacity,
                scale: scale,
                visibility: opacity > 0 ? "visible" : "hidden",
                pointerEvents: opacity > 0.9 ? "auto" : "none",
            });

            // Update visibility state for rules button
            setIsFinalRevealVisible(opacity > 0.1);

            // Trigger GSAP animation when reaching z=-26000 (when section starts fading in)
            // Use opacity threshold to ensure cards animate as soon as section is visible
            if (opacity > 0.1) {
                if (!finalRevealAnimationTriggered.current) {
                    finalRevealAnimationTriggered.current = true;
                    // Immediate animation, no delay
                    finalRevealRef.current?.playAnimation();
                }

                // Play Anthem if globally playing and not muted
                if (
                    anthemRef.current &&
                    anthemRef.current.paused &&
                    isGlobalPlaying &&
                    !isGlobalMuted
                ) {
                    anthemRef.current.volume = 1;
                    anthemRef.current.play().catch(() => { });
                }
            }

            // Reset animation if scrolling back up past the trigger point
            if (opacity <= 0.05) {
                if (finalRevealAnimationTriggered.current) {
                    finalRevealAnimationTriggered.current = false;
                    finalRevealRef.current?.resetAnimation();
                }

                // Stop Anthem
                if (anthemRef.current && !anthemRef.current.paused) {
                    gsap.to(anthemRef.current, {
                        volume: 0,
                        duration: 1,
                        onComplete: () => {
                            anthemRef.current?.pause();
                        },
                    });
                }
            }
        }

        const currentStopIndex = SCROLL_STOPS.findIndex((s, i) => {
            const nextStop = SCROLL_STOPS[i + 1];
            if (!nextStop) return currentZ <= s.z + 1000;
            return currentZ <= s.z + 1000 && currentZ > nextStop.z + 1000;
        });

        if (currentStopIndex !== -1) {
            setButtonLabel(SCROLL_STOPS[currentStopIndex].label);
        }
    };
    const handleMuteToggle = () => {
        setIsGlobalMuted((prev) => !prev); // This flips the boolean
    };
    // --- 3D TILT EFFECT ---
    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            // Only enable tilt on desktop
            if (isMobile || !tiltRef.current) return;

            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            const xPos = (clientX / innerWidth - 0.5) * 2;
            const yPos = (clientY / innerHeight - 0.5) * 2;

            mousePos.current = { x: xPos, y: yPos };
            isHovering.current = true;
        },
        [isMobile],
    );

    const handleMouseLeave = useCallback(() => {
        // Only relevant on desktop
        if (isMobile) return;
        isHovering.current = false;
    }, [isMobile]);

    useEffect(() => {
        // Only run tilt animation on desktop
        if (isMobile) return;

        let currentX = 0;
        let currentY = 0;

        const animate = () => {
            if (tiltRef.current) {
                if (isHovering.current) {
                    const targetX = -mousePos.current.y * 8;
                    const targetY = mousePos.current.x * 8;

                    currentX += (targetX - currentX) * 0.08;
                    currentY += (targetY - currentY) * 0.08;
                } else {
                    currentX += (0 - currentX) * 0.05;
                    currentY += (0 - currentY) * 0.05;
                }

                tiltRef.current.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
            }

            rafId.current = requestAnimationFrame(animate);
        };

        rafId.current = requestAnimationFrame(animate);

        return () => {
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [isMobile]);

    // Sync Global Mute with Anthem
    useEffect(() => {
        if (anthemRef.current) {
            anthemRef.current.muted = isGlobalMuted;
        }
    }, [isGlobalMuted]);

    // Sync Global Play/Pause with Anthem
    useEffect(() => {
        if (anthemRef.current) {
            if (!isGlobalPlaying) {
                anthemRef.current.pause();
            } else {
                // If we are in Final Reveal, we might want to resume?
                // Checking if we are deep enough.
                const finalRevealLayer = layerRefs.current["final-reveal"];
                if (
                    finalRevealLayer &&
                    window.getComputedStyle(finalRevealLayer).visibility === "visible"
                ) {
                    anthemRef.current.play().catch(() => { });
                }
            }
        }
    }, [isGlobalPlaying]);

    // =====================================================
    // SCROLL-PHASE ANIMATION CALLBACK
    // =====================================================

    /**
     * Applies smooth depth-emergence to an artist image.
     * Uses CSS scale() to simulate perspective depth — identical visual
     * to how hero/about text layers emerge from the Z-axis.
     *
     * t: 0 → 1 (normalised sub-phase for this image)
     *
     * Visual timeline:
     *   t=0.00 : scale(0.05)  opacity(0)    — invisible speck deep in space
     *   t=0.08 : scale(0.10)  opacity(0.15) — faint dot materialising
     *   t=0.30 : scale(0.35)  opacity(0.70) — clearly approaching
     *   t=0.60 : scale(0.75)  opacity(1.00) — almost here
     *   t=0.75 : scale(1.00)  opacity(1.00) — at camera plane
     *   t=0.90 : scale(1.60)  opacity(0.40) — flying past, going large
     *   t=1.00 : scale(2.20)  opacity(0.00) — gone past viewer
     */
    const applyImageDepth = (
        imgEl: HTMLElement | null,
        layerEl: HTMLElement | null,
        t: number,
    ) => {
        if (!imgEl || !layerEl) return;

        const isVideo = imgEl.tagName.toLowerCase() === 'video';
        const videoEl = isVideo ? (imgEl as HTMLVideoElement) : null;

        if (t <= 0) {
            gsap.set(imgEl, { visibility: "hidden", opacity: 0 });
            gsap.set(layerEl, { autoAlpha: 0, pointerEvents: "none" });

            // Pause video if hidden
            if (videoEl && !videoEl.paused) {
                videoEl.pause();
            }
            return;
        }

        // Play video if visible and not playing
        if (videoEl && videoEl.paused && t > 0.05) {
            videoEl.play().catch(() => { });
        }

        // --- NEW FLATTENED SCALE LOGIC ---
        let imgScale: number;
        if (t < 0.7) {
            // Approaches from distance to full size
            imgScale = 0.05 + easeOutCubic(t / 0.7) * 0.95;
        } else if (t < 0.9) {
            // HOLDS at scale 1.0 (The plateau that stops the double zoom)
            imgScale = 1.0;
        } else {
            // Finally flies past the camera at the very end
            const exitT = (t - 0.9) / 0.1;
            imgScale = 1.0 + exitT * 1.5;
        }

        // --- Opacity logic ---
        let imgOpacity: number;
        if (t < 0.2) {
            imgOpacity = easeOutCubic(t / 0.2) * 0.5;
        } else if (t < 0.85) {
            imgOpacity = 1; // Stay fully visible while centered
        } else {
            imgOpacity = 1 - easeInCubic((t - 0.85) / 0.15); // Fade out quickly during exit
        }

        gsap.set(layerEl, { autoAlpha: 1, pointerEvents: "none" });
        gsap.set(imgEl, {
            visibility: "visible",
            opacity: clamp(imgOpacity, 0, 1),
            transform: `translate(-50%, -50%) scale(${imgScale})`,
        });
    };

    const onArtistScrollProgress = useCallback(
        (element: HTMLElement, phase: number) => {
            const artistKey = element.dataset.artistId;
            if (!artistKey) return;

            const nameInner = element.querySelector(
                ".artist-name-svg",
            ) as HTMLElement | null;
            const dateInner = element.querySelector(
                ".artist-date",
            ) as HTMLElement | null;
            const contentBlock = element.querySelector(
                ".artist-content",
            ) as HTMLElement | null;
            const sponsorRow = element.querySelector(
                ".sponsor-row",
            ) as HTMLElement | null;

            // Image refs
            const rightImgLayer = layerRefs.current[`${artistKey}_right`];
            const leftImgLayer = layerRefs.current[`${artistKey}_left`];
            const rightImg = rightImgLayer?.querySelector(
                ".artist-img",
            ) as HTMLElement | null;
            const leftImg = leftImgLayer?.querySelector(
                ".artist-img",
            ) as HTMLElement | null;

            // ==========================================================
            // TEXT ANIMATIONS (same phases as before, unchanged)
            // ==========================================================

            // --- Text Reveal: phase 0.00 – 0.20 ---
            if (phase <= 0.2) {
                const t = easeOutCubic(clamp(phase / 0.2, 0, 1));
                if (nameInner) {
                    gsap.set(nameInner, {
                        clipPath: `inset(0 0 ${(1 - t) * 100}% 0)`,
                        opacity: 1,
                        y: 0,
                    });
                }
                const dateT = easeOutCubic(clamp((phase - 0.05) / 0.15, 0, 1));
                if (dateInner) {
                    gsap.set(dateInner, {
                        clipPath: `inset(0 0 ${(1 - dateT) * 100}% 0)`,
                        opacity: 1,
                        y: 0,
                    });
                }
                if (contentBlock) gsap.set(contentBlock, { y: 0 });
                if (sponsorRow) {
                    gsap.set(sponsorRow, {
                        clipPath: `inset(0 0 ${(1 - t) * 100}% 0)`,
                        y: 0,
                    });
                }

                // --- Text Move Down: phase 0.20 – 0.40 ---
            } else if (phase <= 0.4) {
                const t = easeInOutQuad(clamp((phase - 0.2) / 0.2, 0, 1));
                if (nameInner)
                    gsap.set(nameInner, {
                        clipPath: "inset(0 0 0% 0)",
                        opacity: 1,
                        y: 0,
                    });
                if (dateInner)
                    gsap.set(dateInner, {
                        clipPath: "inset(0 0 0% 0)",
                        opacity: 1,
                        y: 0,
                    });
                if (contentBlock) gsap.set(contentBlock, { y: `${t * 30}vh` });
                if (sponsorRow)
                    gsap.set(sponsorRow, {
                        clipPath: "inset(0 0 0% 0)",
                        y: 0,
                    });

                // --- Text at bottom (images active): phase 0.40 – 0.80 ---
            } else if (phase <= 0.8) {
                if (nameInner)
                    gsap.set(nameInner, { clipPath: "inset(0 0 0% 0)", opacity: 1 });
                if (dateInner)
                    gsap.set(dateInner, { clipPath: "inset(0 0 0% 0)", opacity: 1 });
                if (contentBlock) gsap.set(contentBlock, { y: "30vh" });
                if (sponsorRow) gsap.set(sponsorRow, { clipPath: "inset(0 0 0% 0)" });

                // --- Text Exit: phase 0.80 – 1.0 ---
            } else {
                const t = easeInCubic(clamp((phase - 0.8) / 0.2, 0, 1));
                if (contentBlock) gsap.set(contentBlock, { y: "30vh" });
                if (nameInner)
                    gsap.set(nameInner, {
                        clipPath: `inset(0 0 ${t * 100}% 0)`,
                        opacity: 1,
                        y: 0,
                    });
                const dateT = easeInCubic(clamp((phase - 0.78) / 0.18, 0, 1));
                if (dateInner)
                    gsap.set(dateInner, {
                        clipPath: `inset(0 0 ${dateT * 100}% 0)`,
                        opacity: 1,
                        y: 0,
                    });

                // Sponsor exits last (top-to-bottom ripple: 0.82 -> 1.0)
                const sponsorExitT = easeInCubic(clamp((phase - 0.82) / 0.18, 0, 1));
                if (sponsorRow)
                    gsap.set(sponsorRow, {
                        clipPath: `inset(0 0 ${sponsorExitT * 100}% 0)`,
                        y: 0,
                    });
            }

            // ==========================================================
            // IMAGE ANIMATIONS — Smooth scale-based depth emergence
            // Same visual feel as hero/about layers emerging from Z-depth
            // ==========================================================

            // Right image: active during phase 0.25 → 0.55 (range = 0.30)
            // Generous range for slow, smooth emergence matching hero/about feel
            const rightT = clamp((phase - 0.25) / 0.3, 0, 1);

            // Left image: active during phase 0.55 → 0.85 (range = 0.30)
            // Starts exactly when right exits — same range = identical scroll sensitivity
            const leftT = clamp((phase - 0.55) / 0.3, 0, 1);

            // Apply depth emergence to both images
            applyImageDepth(rightImg, rightImgLayer, rightT);
            applyImageDepth(leftImg, leftImgLayer, leftT);
        },
        [],
    );

    // --- Event Handlers for NON-ARTIST layers only ---
    // --- Event Handlers for NON-ARTIST layers only ---
    const onLayerEnter = (el: HTMLElement) => {
        // Check if we entered the Final Reveal section
        if (el === layerRefs.current["final-reveal"]) {
            setIsFinalRevealVisible(true);
        }

        // Skip artist layers — they're handled by onArtistScrollProgress
        if (el.dataset.artistId) return;

        const texts = el.querySelectorAll(".text-mask > *");
        if (texts.length) {
            gsap.fromTo(
                texts,
                { y: "110%", opacity: 0 },
                {
                    y: "0%",
                    opacity: 1,
                    duration: 1.2,
                    ease: "power4.out",
                    stagger: 0.15,
                    overwrite: true,
                },
            );
        }
    };

    const onLayerExit = (el: HTMLElement) => {
        // Check if we exited the Final Reveal section
        if (el === layerRefs.current["final-reveal"]) {
            setIsFinalRevealVisible(false);
        }

        // Skip artist layers
        if (el.dataset.artistId) return;

        const texts = el.querySelectorAll(".text-mask > *");
        if (texts.length) {
            gsap.to(texts, {
                y: "-110%",
                opacity: 0,
                duration: 0.8,
                ease: "power3.in",
                stagger: 0.05,
                overwrite: true,
            });
        }
    };

    const { lenisRef, totalDistanceRef } = useZScroll(containerRef, {
        onLayerEnter,
        onLayerExit,
        onUpdate,
        onLayerScrollProgress: onArtistScrollProgress,
    });

    useEffect(() => {
        if (lenisRef.current) {
            if (showRulesModal) {
                lenisRef.current.stop();
            } else {
                lenisRef.current.start();
            }
        }
    }, [showRulesModal]);

    // --- Initial Setup & Cursor ---
    useEffect(() => {
        if ("scrollRestoration" in history) {
            history.scrollRestoration = "manual";
        }
        window.scrollTo(0, 0);

        // Hide all artist text initially via clip-path
        const allNameSvgs = document.querySelectorAll(".artist-name-svg");
        gsap.set(allNameSvgs, { clipPath: "inset(0 0 100% 0)", opacity: 1 });

        const allDates = document.querySelectorAll(".artist-date");
        gsap.set(allDates, { clipPath: "inset(0 0 100% 0)", opacity: 1 });

        // Hide all artist images initially
        const allArtistImages = document.querySelectorAll(".artist-img");
        gsap.set(allArtistImages, { visibility: "hidden", opacity: 0 });

        // Non-artist text masks (about layers etc)
        const nonArtistMaskedText = document.querySelectorAll(
            ".about-layer .text-mask > *",
        );
        gsap.set(nonArtistMaskedText, { y: "100%", opacity: 0 });

        // Only enable tilt effect on desktop
        if (!isMobile) {
            window.addEventListener("mousemove", handleMouseMove, { passive: true });
            document.body.addEventListener("mouseleave", handleMouseLeave);
        }

        // Enable audio playback on first user interaction
        const enableAudioOnInteraction = () => {
            if (!userInteractedRef.current) {
                userInteractedRef.current = true;
                setIsGlobalPlaying(true);
            }
        };



        window.addEventListener("click", enableAudioOnInteraction);
        window.addEventListener("touchstart", enableAudioOnInteraction, {
            passive: true,
        });

        return () => {
            // Only cleanup tilt listeners on desktop
            if (!isMobile) {
                window.removeEventListener("mousemove", handleMouseMove);
                document.body.removeEventListener("mouseleave", handleMouseLeave);
            }

            window.removeEventListener("click", enableAudioOnInteraction);
            window.removeEventListener("touchstart", enableAudioOnInteraction);
        };
    }, [handleMouseMove, handleMouseLeave, isMobile]);




    // =====================================================================
    // MOBILE/TABLET Z-AXIS NAVIGATION — Phase-Aware State Machine
    // =====================================================================
    // For non-artist regions: scroll exactly one viewport-height per click.
    // For artist layers: step through animation sub-phases on each click
    //   Forward:  Enter → Text Reveal → Text Shift Down → Images → Text Exit → Leave
    //   Backward: exact reverse order
    // =====================================================================


    // Sub-phase waypoints within an artist layer (phase 0→1)
    // Each click advances to the next stop. Both images get symmetric treatment.
    //
    // Right image range: phase 0.25 → 0.55  (rightT = (phase − 0.25) / 0.30)
    // Left  image range: phase 0.55 → 0.85  (leftT  = (phase − 0.55) / 0.30)
    //

    // Helper: convert a target Z-depth to a scroll position

    // Helper: convert a target artist phase to a cameraZ value
    // phase = (relativeZ - phaseStart) / totalPhaseRange
    // relativeZ = depth - cameraZ
    // so: cameraZ = depth - phaseStart - phase * totalPhaseRange

    // Helper: determine current artist phase (returns null if not inside an artist)


    /**
     * Artist Phase Waypoints (normalized 0→1 within artist section)
     * 
     * These correspond to key moments in the artist reveal animation:
     * - 0.10: Text content revealed (name/date clip-path animation completes)
     * - 0.30: Text shifts downward (content moves to bottom third)
     * - 0.49: Right image fully visible and stopped (t=0.8, scale=1.0, opacity=1.0)
     * - 0.79: Left image fully visible and stopped (t=0.8, scale=1.0, opacity=1.0)
     * 
     * Calculation reference:
     * - Right image range: phase 0.25 → 0.55 (rightT = (phase - 0.25) / 0.30)
     *   → rightT = 0.8 when phase = 0.25 + 0.24 = 0.49
     * - Left image range: phase 0.55 → 0.85 (leftT = (phase - 0.55) / 0.30)
     *   → leftT = 0.8 when phase = 0.55 + 0.24 = 0.79
     */


    /**
     * Get current artist context if camera is positioned within an artist section.
     * 
     * @param currentZ Current camera Z-position
     * @returns Artist metadata and phase information, or null if not in artist section
     */


    /**
     * Convert artist phase (0-1) to absolute Z-depth.
     * 
     * @param startZ Artist section start Z-position
     * @param range Artist section depth range
     * @param phase Target phase (0-1)
     * @returns Absolute Z-position
     */


    /**
     * Convert absolute Z-position to scroll pixels.
     * 
     * @param z Target Z-position
     * @returns Corresponding scroll value in pixels
     */


    /**
     * Execute smooth navigation to target Z-position with visual feedback.
     * 
     * @param targetZ Target Z-position
     * @param options Navigation options (duration, easing, speed boost)
     */


    /**
     * Main navigation handler for mobile/tablet Z-axis controls.
     * Implements context-aware navigation with phase stepping within artist sections.
     * 
     * @param direction Navigation direction ('forward' | 'backward')
     */


    return (
        <div className="pronite-page" ref={containerRef}>
            <SEO
                title="Pronite"
                description="Celebrate Pronite at Incridea'26 with powerhouse performances, live music, and a night you won’t forget."
                url="/pronite"
            />
            <Starfield />

            <nav className="nav">
                <div className="nav-left">
                    <button
                        className="exit-btn"
                        onClick={() => navigate("/")}
                        aria-label="Exit to Home"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </nav>
            {/*
            <button
                className={`explore-btn${activeArtist ? " card-active" : ""}`}
                onClick={handleExploreClick}
            >
                {buttonLabel}
            </button>
*/}
            <div className="scroll-progress-container">
                <div className="scroll-track">
                    <div className="logo-bottom-wrapper">
                        <img
                            src="/ryoku_emoji.png"
                            className="progress-logo-bottom"
                            alt="Ryoku"
                        />
                    </div>
                </div>
            </div>

            {/* Pronite Rules Info Button — Only visible during final reveal */}
            {isFinalRevealVisible && (
                <button
                    className="pronite-rules-btn"
                    onClick={() => setShowRulesModal(true)}
                    aria-label="Pronite Rules"
                >
                    <span>i</span>
                </button>
            )}



            <div id="z-space-container" ref={containerRef}>
                {/* Background Starfield */}
                <Starfield speedRef={starSpeed} isMobile={isMobile} />

                <div ref={tiltRef} className="tilt-layer">
                    <div className="z-content">
                        {/* HERO */}
                        <section
                            ref={(el) => {
                                layerRefs.current["hero"] = el;
                            }}
                            className="z-layer hero-layer"
                            data-z="-100"
                            data-persist="15000"
                        >
                            <div className="hero-partners-row">
                                <div className="hero-partner-item">
                                    <img
                                        src="pronite/nmamit.svg"
                                        alt="NMAMIT"
                                        className="nmamit-logo"
                                    />
                                </div>
                                <div className="hero-partner-divider"></div>
                                <div className="hero-partner-item">
                                    <img
                                        src="/incridea.png"
                                        alt="Incridea"
                                        className="incridea-logo"
                                    />
                                </div>
                            </div>
                            <h1 className="hero-title">
                                <img
                                    src="pronite/inc_chrome.svg"
                                    alt="Pronite"
                                    className="pronite-main-logo"
                                />
                            </h1>
                        </section>

                        {/* ABOUT */}
                        <section
                            ref={(el) => {
                                layerRefs.current["about"] = el;
                            }}
                            className="z-layer about-layer"
                            data-z="-900"
                            data-persist="15000"
                            data-fade-exp="25"
                        >
                            <div>
                                <h2 className="about-text">PRESENTING TO YOU</h2>
                            </div>
                        </section>

                        {/* ABOUT 2 */}
                        <section
                            ref={(el) => {
                                layerRefs.current["about2"] = el;
                            }}
                            className="z-layer about-layer"
                            data-z="-1900"
                            data-persist="15000"
                            data-fade-exp="25"
                        >
                            <div>
                                <h2 className="about-text">PRONITE ARTISTS</h2>
                            </div>
                        </section>

                        {/* ARMAAN MALIK (Artist 1) */}
                        <section
                            ref={(el) => {
                                layerRefs.current["artist1"] = el;
                            }}
                            className="z-layer artist-layer"
                            data-z="-3500"
                            data-pin="true"
                            data-persist="7000"
                            data-artist-id="artist1"
                            data-artist-range="7000"
                            data-fade-exp="25"
                        >
                            <div className="artist-content">
                                <div className="sponsor-row sponsor-row-3">

                                    <img
                                        src="pronite/nmamit _1.svg"
                                        alt="Sponsor 3"
                                        className="sponsor-logo nmamit-logo-small"
                                    />

                                    <div className="splogos">
                                        <img
                                            src="pronite/TribeVibe.svg"
                                            alt="Sponsor 1"
                                            className="sponsor-logo tribevibe-logo"
                                        />
                                        <img
                                            src="pronite/glamfest.png"
                                            alt="Sponsor 2"
                                            className="sponsor-logo glamfest-logo"
                                        />
                                    </div>

                                </div>
                                <div className="text-mask text-mask-name">
                                    <img
                                        src="pronite/ArmaanMalik.svg"
                                        alt="Armaan Malik"
                                        className="artist-name-svg"
                                    />
                                </div>
                                <div className="text-mask text-mask-date">
                                    {/* <p className="artist-date">5th Mar · 9:00 PM</p> */}
                                </div>
                            </div>
                        </section>

                        <section
                            ref={(el) => {
                                layerRefs.current["artist1_right"] = el;
                            }}
                            className="z-layer artist-image-layer"
                            data-z="-5200"
                            data-pin="false"
                            data-artist-image="true"
                        >
                            <div className="artist-img-wrapper">
                                <img
                                    src="pronite/armaan_malik.jpg"
                                    alt="Armaan Malik Right"
                                    className="artist-img right"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        </section>

                        <section
                            ref={(el) => {
                                layerRefs.current["artist1_left"] = el;
                            }}
                            className="z-layer artist-image-layer"
                            data-z="-5800"
                            data-pin="false"
                            data-artist-image="true"
                        >
                            <div className="artist-img-wrapper">
                                <video
                                    muted
                                    loop
                                    playsInline
                                    preload="none"
                                    className="artist-img left"
                                    style={{ filter: "none" }}
                                    // poster={ARTISTS.artist1.profileImage}
                                >
                                    <source src={armaanVideo} type="video/webm" />
                                </video>
                            </div>
                        </section>

                        {/* NIKHITA GANDHI (Artist 2) */}
                        <section
                            ref={(el) => {
                                layerRefs.current["artist2"] = el;
                            }}
                            className="z-layer artist-layer"
                            data-z="-11000"
                            data-pin="true"
                            data-persist="7000"
                            data-artist-id="artist2"
                            data-artist-range="7000"
                            data-fade-exp="25"
                        >
                            <div className="artist-content">
                                <div className="sponsor-row sponsor-row-2">
                                    <img
                                        src="pronite/nmamit _1.svg"
                                        alt="Sponsor 2"
                                        className="sponsor-logo nmamit-logo-small"
                                    />
                                    <img
                                        src="pronite/TribeVibe.svg"
                                        alt="Sponsor 1"
                                        className="sponsor-logo tribevibe-logo"
                                    />

                                </div>
                                <div className="text-mask text-mask-name">
                                    <img
                                        src="pronite/NikhitaGandhi.svg"
                                        alt="Nikhita Gandhi"
                                        className="artist-name-svg"
                                    />
                                </div>
                                <div className="text-mask text-mask-date">
                                    {/* <p className="artist-date">5th Mar · 11:30 PM</p> */}
                                </div>
                            </div>
                        </section>

                        <section
                            ref={(el) => {
                                layerRefs.current["artist2_right"] = el;
                            }}
                            className="z-layer artist-image-layer"
                            data-z="-13500"
                            data-pin="false"
                            data-artist-image="true"
                        >
                            <div className="artist-img-wrapper">
                                <img
                                    src="pronite/nikhita_gandhi.jpg"
                                    alt="Nikhita Gandhi Right"
                                    className="artist-img right"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        </section>

                        <section
                            ref={(el) => {
                                layerRefs.current["artist2_left"] = el;
                            }}
                            className="z-layer artist-image-layer"
                            data-z="-14500"
                            data-pin="false"
                            data-artist-image="true"
                        >
                            <div className="artist-img-wrapper">
                                <video
                                    muted
                                    loop
                                    playsInline
                                    preload="none"
                                    className="artist-img left"
                                    style={{ filter: "none" }}
                                    // poster={ARTISTS.artist2.profileImage}
                                >
                                    <source src={nikhitaVideo} type="video/webm" />
                                </video>
                            </div>
                        </section>

                        {/* ALO (Artist 3) */}
                        <section
                            ref={(el) => {
                                layerRefs.current["artist3"] = el;
                            }}
                            className="z-layer artist-layer"
                            data-z="-18500"
                            data-pin="true"
                            data-persist="7000"
                            data-artist-id="artist3"
                            data-artist-range="7000"
                            data-fade-exp="25"
                        >
                            <div className="artist-content">
                                <div className="sponsor-row sponsor-row-2">
                                    <img
                                        src="pronite/nmamit _1.svg"
                                        alt="Sponsor 2"
                                        className="sponsor-logo nmamit-logo-small"
                                    />
                                    <img
                                        src="pronite/TribeVibe.svg"
                                        alt="Sponsor 1"
                                        className="sponsor-logo tribevibe-logo"
                                    />

                                </div>
                                <div className="text-mask text-mask-name">
                                    <img
                                        src="pronite/ALO.svg"
                                        alt="ALO"
                                        className="artist-name-svg alo-svg"
                                    />
                                </div>
                                <div className="text-mask text-mask-date">
                                    {/* <p className="artist-date">6th Mar · 1:30 AM</p> */}
                                </div>
                            </div>
                        </section>

                        <section
                            ref={(el) => {
                                layerRefs.current["artist3_right"] = el;
                            }}
                            className="z-layer artist-image-layer"
                            data-z="-21000"
                            data-pin="false"
                            data-artist-image="true"
                        >
                            <div className="artist-img-wrapper">
                                <img
                                    src="pronite/alo.png"
                                    alt="ALO Right"
                                    className="artist-img right"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        </section>

                        <section
                            ref={(el) => {
                                layerRefs.current["artist3_left"] = el;
                            }}
                            className="z-layer artist-image-layer"
                            data-z="-22000"
                            data-pin="false"
                            data-artist-image="true"
                        >
                            <div className="artist-img-wrapper">
                                <video
                                    muted
                                    loop
                                    playsInline
                                    preload="none"
                                    className="artist-img left"
                                    style={{ filter: "none" }}
                                    // poster={ARTISTS.artist3.profileImage}
                                >
                                    <source src={aloVideo} type="video/webm" />
                                </video>
                            </div>
                        </section>

                        {/* FINAL REVEAL */}
                        <section
                            ref={(el) => {
                                layerRefs.current["final-reveal"] = el;
                            }}
                            className="z-layer"
                            data-z="-27500"
                            data-pin="true"
                            data-persist="5000"
                            style={{ opacity: 0, pointerEvents: "none" }}
                        >
                            <FinalReveal
                                ref={finalRevealRef}
                                artists={[
                                    {
                                        name: (
                                            <>
                                                NIKITHA
                                                <br />
                                                GANDHI
                                            </>
                                        ),
                                        role: "Special Guest",

                                        image: ARTISTS.artist2.profileImage,
                                        className: "md:col-span-4",
                                    },
                                    {
                                        name: "ARMAAN MALIK",
                                        role: "HEADLINER",

                                        image: ARTISTS.artist1.profileImage,
                                        isHeadliner: true,
                                        className: "md:col-span-6",
                                    },
                                    {
                                        name: (
                                            <>
                                                ALO
                                                <br />
                                                THE BAND
                                            </>
                                        ),
                                        role: "Encore Act",

                                        image: ARTISTS.artist3.profileImage,
                                        className: "md:col-span-3",
                                    },
                                ]}
                            />
                        </section>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeArtist && (
                    <ProniteCard
                        key={activeArtist.id}
                        artistName={activeArtist.name}
                        artistDate={activeArtist.date}
                        artistImage={activeArtist.profileImage}
                        accentColor={activeArtist.accent}
                        songUrl={activeArtist.song}
                        onNext={() => handleArtistNavigation("next")}
                        onPrev={() => handleArtistNavigation("prev")}
                        isMuted={isGlobalMuted}
                        onMuteToggle={handleMuteToggle}
                        isPlaying={isGlobalPlaying}
                        onPlayToggle={() => setIsGlobalPlaying(!isGlobalPlaying)}
                    />
                )}
            </AnimatePresence>

            {/* Pronite Rules Modal */}
            <AnimatePresence>
                {showRulesModal && (
                    <div
                        className="pronite-rules-modal-overlay"
                    >
                        <LiquidGlassCard
                            className="pronite-rules-modal"
                            colorScheme="dark"
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                            onWheel={(e) => e.stopPropagation()}
                        >
                            <div className="pronite-rules-header">
                                <h2>PRONITE RULES</h2>
                                <button
                                    className="pronite-rules-close"
                                    onClick={() => setShowRulesModal(false)}
                                    aria-label="Close Rules"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="pronite-rules-content">
                                <div className="rules-section">
                                    <h3>General Guidelines</h3>
                                    <ul>
                                        <li>All participants must register before entry</li>
                                        <li>Entry is restricted to Incridea ticket holders</li>
                                        <li>No smoking, drinking, or drugs allowed on premises</li>
                                    </ul>
                                </div>

                                <div className="rules-section">
                                    <h3>Code of Conduct</h3>
                                    <ul>
                                        <li>Respect all artists and fellow attendees</li>
                                        <li>No photography or recording during performances</li>
                                        <li>Follow all instructions from event staff</li>
                                        <li>Maintain hygiene and cleanliness</li>
                                    </ul>
                                </div>

                                <div className="rules-section">
                                    <h3>Safety & Security</h3>
                                    <ul>
                                        <li>Keep all valuable items secure</li>
                                        <li>Report any suspicious activity to staff immediately</li>
                                        <li>Follow emergency evacuation procedures</li>
                                        <li>Designated seating must be respected</li>
                                    </ul>
                                </div>

                                <div className="rules-section">
                                    <h3>Prohibited Items</h3>
                                    <ul>
                                        <li>Glass bottles and sharp objects</li>
                                        <li>Outside food and beverages</li>
                                        <li>Professional cameras with detachable lenses</li>
                                        <li>Any weapons or harmful materials</li>
                                    </ul>
                                </div>
                            </div>
                        </LiquidGlassCard>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PronitePage;