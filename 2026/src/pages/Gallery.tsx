import React, { useState, useMemo, useRef, useEffect } from "react";

import { HorizontalTimeline } from "@/components/gallery/HorizontalTimeline";
import { Box } from "@mui/material";
import Carousel from "../components/gallery/Carousel";
import MasonryGrid from "../components/gallery/MasonryGrid";
import { ChevronDown } from "lucide-react";
import SEO from "../components/SEO";
import { galleryImages } from "@/data/galleryImages";

const timelineItems = ["2022", "2023", "2024", "2025"];

const Gallery: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTimelineVisible, setIsTimelineVisible] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(true);

  // REFERENCES
  const carouselSectionRef = useRef<HTMLDivElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);

  const gallerySections = useMemo(
    () =>
      timelineItems.map((year) => {
        const images = [...(galleryImages[year] || [])];
        // Fisher-Yates shuffle
        for (let i = images.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [images[i], images[j]] = [images[j], images[i]];
        }
        return {
          year,
          images,
        };
      }),
    []
  );

  const getNavbarHeight = () => (typeof window !== "undefined" && window.innerWidth < 768 ? 72 : 112);
  const TIMELINE_HEIGHT = 80;
  const getSyncLine = () => getNavbarHeight() + TIMELINE_HEIGHT;

  // SCROLL HANDLER
  useEffect(() => {
    const handleGlobalScroll = () => {
      const galleryElement = galleryRef.current;
      if (!galleryElement) return;

      if (carouselSectionRef.current) {
        const rect = carouselSectionRef.current.getBoundingClientRect();
        setIsTimelineVisible(rect.top > getSyncLine() + 20);
        // Hide scroll button when carousel is in view (top of viewport)
        setShowScrollButton(rect.top > window.innerHeight * 0.3);
      }

      const sections = galleryElement.querySelectorAll("section");
      const step = 1 / (timelineItems.length - 1);

      let activeIdx = 0;
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= getSyncLine() + 150) {
          activeIdx = index;
        }
      });

      setActiveIndex(activeIdx);

      const currentSection = sections[activeIdx];
      const nextSection = sections[activeIdx + 1];

      if (currentSection && nextSection) {
        const currRect = currentSection.getBoundingClientRect();
        const nextRect = nextSection.getBoundingClientRect();
        const totalDistance = nextRect.top - currRect.top;
        const progressToNext = (getSyncLine() - currRect.top) / totalDistance;
        const clamped = Math.max(0, Math.min(1, progressToNext));
        setScrollProgress((activeIdx + clamped) * step);
      } else {
        setScrollProgress(activeIdx * step);
      }
    };

    window.addEventListener("scroll", handleGlobalScroll, { passive: true });
    window.addEventListener("resize", handleGlobalScroll, { passive: true });
    handleGlobalScroll();
    return () => {
      window.removeEventListener("scroll", handleGlobalScroll);
      window.removeEventListener("resize", handleGlobalScroll);
    };
  }, []);

  const handleTimelineClick = (index: number) => {
    const galleryElement = galleryRef.current;
    if (!galleryElement) return;

    const sections = galleryElement.querySelectorAll("section");
    const targetSection = sections[index] as HTMLElement;

    if (targetSection) {
      const currentScroll = window.scrollY;
      const sectionRectTop = targetSection.getBoundingClientRect().top;
      const targetScrollTop = currentScroll + (sectionRectTop - getSyncLine()) + 40;
      window.scrollTo({ top: targetScrollTop, behavior: "smooth" });
    }
  };

  const scrollToCarousel = () => {
    if (carouselSectionRef.current) {
      carouselSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  /* 🔥 ROTATION REMOVED */
  const rotation = 0;

  return (
    <div
      ref={galleryRef}
      className="relative w-full min-h-screen bg-transparent selection:bg-cyan-500/30"
    >
      <SEO
        title="Gallery"
        description="Explore the memories of Incridea through our gallery."
        url="/gallery"
      />
      <style>{`
        html, body {
          overflow-x: hidden !important;
          overflow-y: auto !important;
        }
        ::-webkit-scrollbar:horizontal {
          display: none;
        }
      `}</style>



      {/* TIMELINE */}
      <header
        className="fixed top-[72px] md:top-[112px] left-0 z-50 w-full transition-all duration-500"
        style={{
          transform: isTimelineVisible ? "translateY(0)" : "translateY(-200%)",
          opacity: isTimelineVisible ? 1 : 0,
        }}
      >
        <div className="pointer-events-auto">
          <HorizontalTimeline
            items={timelineItems}
            activeIndex={activeIndex}
            onItemClick={handleTimelineClick}
            scrollProgress={scrollProgress}
          />
        </div>
      </header>

      {/* SCROLL DOWN BUTTON */}
      <button
        onClick={scrollToCarousel}
        className={`fixed bottom-8 right-8 z-50 cursor-target p-4 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-full backdrop-blur-md transition-all duration-500 hover:scale-110 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] group ${showScrollButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        aria-label="Scroll to carousel"
      >
        <ChevronDown className="w-6 h-6 text-cyan-400 animate-bounce group-hover:animate-none" />
      </button>

      {/* MASONRY */}
      <div>
        <MasonryGrid sections={gallerySections} rotation={rotation} />
      </div>

      {/* CAROUSEL */}
      <section
        ref={carouselSectionRef}
        className="relative z-10 min-h-screen py-24 border-t border-white/5"
      >
        <div className="text-center">
          <h2 className="font-moco text-xl text-cyan-400 tracking-[0.4em] uppercase">
            Memories in Motion
          </h2>
          <div className="h-[2px] w-24 bg-cyan-500 mx-auto mt-2 rounded-full shadow-[0_0_15px_#06b6d4]" />
        </div>
        <Box sx={{ width: "100%", overflow: "hidden" }}>
          <Carousel />
        </Box>
      </section>

    </div>
  );
};

export default Gallery;