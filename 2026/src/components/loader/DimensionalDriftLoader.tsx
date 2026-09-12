import React, { useEffect, useState, useMemo } from 'react';
import { useImagePreload } from '../wormholeloader/useImagePreload';
import './DimensionalDriftLoader.css';

interface DimensionalDriftLoaderProps {
    onComplete?: () => void;
}

const DimensionalDriftLoader: React.FC<DimensionalDriftLoaderProps> = ({ onComplete }) => {
    const [activeCharIndex, setActiveCharIndex] = useState(0);

    // Phases
    const [intensifyPortal, setIntensifyPortal] = useState(false);
    const [characterHover, setCharacterHover] = useState(false);
    const [characterJump, setCharacterJump] = useState(false);
    const [exit, setExit] = useState(false);


    // Assets
    const bgSrc = '/loader/bg-loader.webp';
    const portalSrc = '/loader/bg-fg.webp';

    // All available character images
    const allCharacters = [
        '/loader/character/1.webp',
        '/loader/character/2.webp',
        '/loader/character/3.webp',
        '/loader/character/4.webp',
        '/loader/character/5.webp',
        '/loader/character/6.webp',
        '/loader/character/7.webp',
        '/loader/character/8.webp',
        '/loader/character/9.webp',
    ];

    // Randomly select 6 characters each time the component mounts
    const charSrcs = useMemo(() => {
        const shuffled = [...allCharacters].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 6);
    }, []);

    const { imagesLoaded } = useImagePreload([bgSrc, portalSrc, ...charSrcs]);

    // Main Animation Sequence
    useEffect(() => {
        if (!imagesLoaded) return;

        // Phase 1: Intro

        // Slideshow Loop
        const totalSlideshowDuration = 1500;
        const stepDuration = totalSlideshowDuration / charSrcs.length;

        const slideshowInterval = setInterval(() => {
            setActiveCharIndex((prev) => (prev + 1) % charSrcs.length);
        }, stepDuration);


        // Phase 2: Approach
        const t1 = setTimeout(() => {
            clearInterval(slideshowInterval); // Stop cycling
            setActiveCharIndex(charSrcs.length - 1); // Ensure last image is active

            setIntensifyPortal(true);
            setCharacterHover(true);
        }, 1500);

        // Phase 3: Jump
        const t2 = setTimeout(() => {
            setCharacterJump(true);
        }, 2200);

        // Phase 4: Exit
        const t3 = setTimeout(() => {
            setExit(true);
        }, 2400);

        // Complete
        const t4 = setTimeout(() => {
            onComplete && onComplete();
        }, 3000);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
            clearInterval(slideshowInterval);
        };

    }, [imagesLoaded, onComplete]);

    // Hide sidebar during page transition
    useEffect(() => {
        // Find and hide all fixed left-positioned elements (sidebar)
        const sidebarElements = document.querySelectorAll('[class*="fixed"][class*="left-"]');
        sidebarElements.forEach(el => {
            (el as HTMLElement).style.display = 'none';
        });

        // Cleanup: show sidebar when component unmounts
        return () => {
            sidebarElements.forEach(el => {
                (el as HTMLElement).style.display = '';
            });
        };
    }, []);

    // Show sidebar immediately when exit animation starts
    useEffect(() => {
        if (exit) {
            const sidebarElements = document.querySelectorAll('[class*="fixed"][class*="left-"]');
            sidebarElements.forEach(el => {
                (el as HTMLElement).style.display = '';
            });
        }
    }, [exit]);


    return (
        <div className={`dimensional-loader-container ${exit ? 'exit' : ''}`}>
            <img
                src={bgSrc}
                className={`loader-background ${exit ? 'exit' : ''}`}
                alt="Cosmic Background"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
            />

            <img
                src={portalSrc}
                className={`loader-portal ${intensifyPortal ? 'intensify' : ''} ${exit ? 'exit' : ''}`}
                alt="Dimensional Portal"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
            />

            <div className={`character-container ${characterHover ? 'hover' : ''} ${characterJump ? 'jump' : ''} ${exit ? 'exit' : ''}`}>
                {charSrcs.map((src, index) => (
                    <img
                        key={src}
                        src={src}
                        className={`character-img ${index === activeCharIndex ? 'active' : ''}`}
                        alt={`Character Emotion ${index + 1}`}
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                    />
                ))}
            </div>
        </div>
    );
};

export default DimensionalDriftLoader;
