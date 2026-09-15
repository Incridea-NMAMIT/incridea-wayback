// src/components/pronite/Starfield.tsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface StarfieldProps {
    speedRef?: React.MutableRefObject<number>;
    isMobile?: boolean; // Add isMobile prop
}

const Starfield: React.FC<StarfieldProps> = ({ speedRef, isMobile = false }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // 1. Scene Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            alpha: true, // Transparent background
            antialias: !isMobile // Disable antialias on mobile for performance
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        // Optimize pixel ratio for mobile - lower = better performance
        renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));

        // 2. Create Stars - Reduce count on mobile for better performance
        const starsGeometry = new THREE.BufferGeometry();
        // Drastically reduce stars on mobile: 300 vs 3000
        const starsCount = isMobile ? 300 : 3000;
        const posArray = new Float32Array(starsCount * 3);

        for (let i = 0; i < starsCount * 3; i++) {
            // Spread stars in a wide area
            posArray[i] = (Math.random() - 0.5) * 15;
        }

        starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const material = new THREE.PointsMaterial({
            size: 0.008,
            color: 0xffffff,
            transparent: true,
            opacity: 1.0,
            sizeAttenuation: true
        });

        const starMesh = new THREE.Points(starsGeometry, material);
        scene.add(starMesh);
        camera.position.z = 2;


        // 4. Resize Handler - Debounced for performance
        let resizeTimeout: number;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
                // Update pixel ratio on resize (in case of device rotation)
                const isMobileNow = window.innerWidth < 768;
                renderer.setPixelRatio(isMobileNow ? 1 : Math.min(window.devicePixelRatio, 2));
            }, 150); // Debounce resize events
        };

        window.addEventListener('resize', handleResize, { passive: true });



        // Animation Loop
        let animationId: number;


        const animate = () => {
            animationId = requestAnimationFrame(animate);

            // Rotate the entire star system slowly
            const currentSpeed = speedRef ? speedRef.current : 1;
            starMesh.rotation.y += 0.0003 * currentSpeed;
            starMesh.rotation.x += 0.0001 * currentSpeed;



            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
            // Cleanup Three.js resources
            starsGeometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            id="bg-canvas"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none'
            }}
        />
    );
};

export default Starfield;