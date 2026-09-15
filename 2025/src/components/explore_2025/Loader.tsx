import { useProgress } from "@react-three/drei";
import { gsap } from "gsap";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const LoadingScreen = ({ images }: { images: string[] }) => {
  const { progress } = useProgress();
  // Refs for the image layers and progress bar
  const bgRef = useRef<HTMLDivElement | null>(null);
  const fgRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  // Determine if we're in portrait mode.
  const [isPortrait, setIsPortrait] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerWidth < window.innerHeight);
    };
    // Call it initially.
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set up parallax animations for the image layers (run once).
  useEffect(() => {
    if (bgRef.current) {
      gsap.to(bgRef.current, {
        x: 20, // moves 40px to the right
        rotation: 1, // rotates by 3 degrees
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
    if (fgRef.current) {
      gsap.to(fgRef.current, {
        x: -40, // moves 80px to the left
        rotation: -3, // rotates by -3 degrees
        duration: 12,
        scale: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }, []);

  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${progress}%`,
        duration: 6,
        ease: "power1.out",
      });
    }
  }, [progress]);

  return (
    <div style={styles.loadingScreen} className="z-50">
      {/* Background Image Layer */}
      <div
        style={styles.bgImageContainer}
        ref={bgRef}
        // Using a slight scale-up to ensure coverage.
        className="relative scale-[120%]"
      >
        <Image
          src={images[0]!}
          alt="Background Layer"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      {/* Foreground Image Layer */}
      <div
        style={{
          ...styles.fgImageContainer,
          ...(isPortrait ? styles.fgImageContainerPortrait : {}),
        }}
        ref={fgRef}
        className="relative"
      >
        <Image
          src={images[1]!}
          alt="Foreground Layer"
          layout="fill"
          objectFit="cover"
        />
      </div>

      {/* Dark overlay for a cinematic effect */}
      <div style={styles.overlay} />

      {/* Loading content */}
      <div style={styles.loadingContent}>
        <p style={styles.loadingText}>LOADING</p>
        <div style={styles.progressBarContainer}>
          <div ref={progressBarRef} style={styles.progressBar} />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

const styles = {
  loadingScreen: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: 9999,
    backgroundColor: "#000",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  // Background container always fills the viewport.
  bgImageContainer: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  // Adjusted foreground container styles to reduce clipping:
  fgImageContainer: {
    position: "absolute" as const,
    // Reduced negative offsets so more of the image remains visible:
    bottom: "-330px", // was -350px
    left: "-50px", // was -100px
    // Increase the container size so shifts won't cut off the image:
    width: "100%",
    height: "160%",
    transform: "translate(-2.1px, -2px)",
  },
  // For portrait mode, adjust to fill the viewport.
  fgImageContainerPortrait: {
    bottom: "-200",
    left: "0",
    width: "120%",
    height: "120%",
  },
  overlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  loadingContent: {
    width: "90%",
    position: "absolute" as const,
    bottom: 0,
    zIndex: 2,
    textAlign: "right" as const,
    color: "#fff",
  },
  progressBarContainer: {
    width: "100%",
    height: "10px",
    border: "2px solid rgba(221,221,221,0.64)",
    margin: "0 auto",
    marginBottom: "10px",
    position: "relative" as const,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "rgba(221,221,221,0.47)",
    width: "0%", // start at 0%
  },
  loadingText: {
    fontFamily: "sans-serif",
    fontSize: "1.5rem",
    letterSpacing: "1px",
    textTransform: "uppercase" as const,
    textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
  },
};
