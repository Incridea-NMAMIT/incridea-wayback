import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import styles from "./loader.module.css";
import { CONSTANT } from "~/constants";

// Images in public folder for faster loading
const hourglass = CONSTANT.ASSETS.LOADER.HOURGLASS;
const logo = CONSTANT.ASSETS.LOADER.EOELOGO;

const LoadingScreen = () => {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const hourglassRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const logo = logoRef.current;
    const hourglass = hourglassRef.current;

    // Fade in animation for the container
    gsap.fromTo(
      container,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.4,
        ease: "power2.inOut",
      },
    );

    gsap.to(logo, {
      scale: 1.25,
      duration: 1.25,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    return () => {
      gsap.killTweensOf([container, logo, hourglass]);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.loadingScreen}>
      <div className="relative h-screen w-screen flex flex-col items-center justify-center">
        <div className={styles.background}>
          <div className={styles.particlesContainer}></div>
        </div>
        <div ref={hourglassRef} className={styles.hourglass}>
          <Image src={hourglass} width={150} height={150} alt="" />
        </div>
        <div
          ref={logoRef}
          className="absolute bottom-[32%] md:bottom-[20%] xl:-translate-2/3"
        >
          <Image
            src={logo}
            width={300}
            height={300}
            alt="Echoes of Eternity Logo"
            className="md:scale-100 scale-50"
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
