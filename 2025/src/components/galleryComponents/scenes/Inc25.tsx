import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import Modal from "../gallery-modal";
import PreviewComponent from "../previewComponent/preview-component";
import Link from "next/link";
import Image from "next/image";
import { CONSTANT } from "~/constants";

const Inc25 = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeModal, setActiveModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const isVisibleRef = useRef(true);

  const afterMovies = useMemo(
    () => [
      [
        CONSTANT.ASSETS.GALLERY.THUMBNAIL18,
        "https://www.youtube.com/embed/GqqK4c2rDhM?autoplay=1&playsinline=1&rel=0&fs=1&controls=1&mute=1",
      ],
      [
        CONSTANT.ASSETS.GALLERY.THUMBNAIL19,
        "https://www.youtube.com/embed/gmF72fu1w6A?autoplay=1&playsinline=1&rel=0&fs=1&controls=1&mute=1",
      ],
      [
        CONSTANT.ASSETS.GALLERY.THUMBNAIL20,
        "https://www.youtube.com/embed/w0phDNAnUgA?autoplay=1&playsinline=1&rel=0&fs=1&controls=1&mute=1",
      ],
      [
        CONSTANT.ASSETS.GALLERY.THUMBNAIL22,
        "https://www.youtube.com/embed/JHgT5PzLc4Q?autoplay=1&playsinline=1&rel=0&fs=1&controls=1&mute=1",
      ],
      [
        CONSTANT.ASSETS.GALLERY.THUMBNAIL23,
        "https://www.youtube.com/embed/8Veb3u0xEoE?autoplay=1&playsinline=1&rel=0&fs=1&controls=1&mute=1",
      ],
      [
        CONSTANT.ASSETS.GALLERY.THUMBNAIL24,
        "https://www.youtube.com/embed/YoWeuaSMytk?autoplay=1&playsinline=1&rel=0&fs=1&controls=1&mute=1",
      ],
    ],
    [],
  );

  // Use ResizeObserver for more efficient window size detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    const resizeObserver = new ResizeObserver(checkMobile);
    checkMobile();
    resizeObserver.observe(document.body);
    return () => resizeObserver.disconnect();
  }, []);

  const updateOpacity = useCallback(() => {
    if (!containerRef.current || !isVisibleRef.current) return;

    const elements = Array.from(containerRef.current.children) as HTMLElement[];
    const rotationY = Number(
      gsap.getProperty(containerRef.current, "rotationY"),
    );

    requestAnimationFrame(() => {
      elements.forEach((element, i) => {
        const elementRotationY = (rotationY + i * 60) % 360;
        const opacity = Math.max(
          0.3,
          Math.cos((elementRotationY * Math.PI) / 180),
        );
        element.style.opacity = opacity.toString();
      });
    });
  }, []);

  // Handle visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === "visible";

      if (animationRef.current) {
        if (isVisibleRef.current) {
          animationRef.current.resume();
        } else {
          animationRef.current.pause();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      if (containerRef.current) {
        animationRef.current = gsap.timeline({
          repeat: -1,
          onUpdate: updateOpacity,
        });

        animationRef.current.to(containerRef.current, {
          rotationY: "+=360",
          duration: isMobile ? 45 : 35,
          ease: "linear",
        });

        // Initial pause if page is not visible
        if (!isVisibleRef.current) {
          animationRef.current.pause();
        }
      }
    };

    animate();
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [updateOpacity, isMobile]);

  const handleClick = useCallback((index: number) => {
    setActiveModal(true);
    setActiveIndex(index);
  }, []);

  const containerStyle = useMemo(
    () => ({
      transform: `rotateX(${isMobile ? -30 : -20}deg)`,
      transformStyle: "preserve-3d" as const,
    }),
    [isMobile],
  );

  return (
    <div className="flex items-center justify-center h-screen">
      <style>{`
        @keyframes rotate {
          from { transform: perspective(1000px) rotateY(0deg); }
          to { transform: perspective(1000px) rotateY(360deg); }
        }
      `}</style>
      <GlowingStars numStars={isMobile ? 150 : 300} />{" "}
      {/* Reduce stars on mobile */}
      <div
        className="absolute top-[50%] sm:top-[33%] perspective-1000"
        style={containerStyle}
      >
        <div className="absolute md:top-[45%] top-[15%] flex flex-col space-y-2 items-center justify-center w-full">
          <p className="text-white text-lg text-center">
            Time to make great memories
          </p>
          <Link
            target="_blank"
            href="https://capture.incridea.in"
            className="px-6 text-lg rounded-full text-white flex justify-center items-center font-semibold cursor-pointer"
          >
            Visit&nbsp;&nbsp;
            <Image
              src={CONSTANT.ASSETS.GALLERY.CAPTURELOGO}
              alt="Capture"
              width={80}
              height={24}
              className="h-6 cursor-pointer"
              priority
            />
          </Link>
        </div>

        <div
          ref={containerRef}
          className="md:w-[400px] w-[200px] md:h-[200px] h-[100px]"
          style={{
            transformStyle: "preserve-3d",
            animation: `rotate ${isMobile ? 45 : 35}s linear infinite`,
          }}
        >
          {afterMovies.map((src, i) => (
            <span
              key={i}
              onClick={() => handleClick(i)}
              className="absolute w-full h-full"
              style={{
                transform: `rotateY(${i * 60}deg) translateZ(${isMobile ? 200 : 400}px)`,
                transformStyle: "preserve-3d",
              }}
            >
              <div className="absolute top-0 left-0 w-full h-full z-50 cursor-pointer" />
              <Image
                src={src[0] ?? ""}
                alt="Incridea"
                layout="fill"
                objectFit="cover"
                className="z-10 object-cover"
                priority
              />
            </span>
          ))}
        </div>
      </div>
      <Modal
        showModal={activeModal}
        title="Gallery"
        onClose={() => setActiveModal(false)}
      >
        <PreviewComponent afterMovieLinks={afterMovies} index={activeIndex} />
      </Modal>
    </div>
  );
};

// Optimized GlowingStars component
const GlowingStars = ({ numStars }: { numStars: number }) => {
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!starsRef.current) return;

    gsap.to(starsRef.current.children, {
      opacity: 1,
      scale: 1.5,
      duration: 0.2,
      repeat: -1,
      yoyo: true,
      stagger: {
        amount: 3,
        from: "random",
      },
    });
  }, []);

  const stars = useMemo(() => {
    return Array.from({ length: numStars }, (_, i) => {
      const size = Math.random() * 2;
      return (
        <span
          key={i}
          className="star absolute rounded-full bg-blue-300"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random(),
          }}
        />
      );
    });
  }, [numStars]);

  return (
    <div ref={starsRef} className="absolute w-full h-full">
      {stars}
    </div>
  );
};

export default Inc25;
