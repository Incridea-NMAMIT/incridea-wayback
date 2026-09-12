import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ExternalLink } from "lucide-react";
import { CONSTANT } from "~/constants";
import { type GetSponsorsQuery } from "~/generated/generated";

const SponsorGearCarousel = ({
  sponsors,
  isSoundEnabled,
  setIsSoundEnabled,
}: {
  sponsors: Extract<GetSponsorsQuery["getSponsors"], {
    __typename: "QueryGetSponsorsSuccess";
  }>["data"];
  isSoundEnabled: boolean;
  setIsSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const smallGearRef = useRef<HTMLDivElement>(null);
  const largeGearRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const isAnimating = useRef(false);

  useEffect(() => {
    audioRef.current = new Audio(CONSTANT.ASSETS.AUDIO.GEARCLOCK);
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
    }

    gsap.from([smallGearRef.current, largeGearRef.current], {
      rotation: 360,
      duration: 2,
      ease: "power2.inOut",
      stagger: 0.2,
    });

    gsap.to(".scroll-helper", {
      y: "-2px",
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });

    gsap.to(".audio-helper", {
      y: "-5px",
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    const handleScroll = () => {
      if (isAnimating.current || !scrollContainerRef.current) return;

      const currentScrollY = scrollContainerRef.current.scrollTop;
      const scrollingDown = currentScrollY > lastScrollY.current;

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        if (!isAnimating.current) {
          isAnimating.current = true;

          if (isSoundEnabled && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch((error) => {
              console.error("Failed to play audio:", error);
              setIsSoundEnabled(false);
            });
          }

          gsap.to(smallGearRef.current, {
            rotation: `+=${scrollingDown ? 30 : -30}`,
            duration: 1,
            ease: "elastic.out(1, 0.5)",
          });

          gsap.to(largeGearRef.current, {
            rotation: `+=${scrollingDown ? -30 : 30}`,
            duration: 1,
            ease: "elastic.out(1, 0.5)",
          });

          gsap
            .timeline()
            .to(cardRef.current, {
              opacity: 0,
              scale: scrollingDown ? 0.8 : 1.2,
              duration: 0.4,
              ease: "power2.inOut",
            })
            .call(() => {
              setCurrentIndex((prev) => {
                if (scrollingDown) {
                  return prev === sponsors.length - 1 ? 0 : prev + 1;
                } else {
                  return prev === 0 ? sponsors.length - 1 : prev - 1;
                }
              });
            })
            .to(cardRef.current, {
              opacity: 1,
              scale: 1,
              duration: 0.4,
              ease: "power2.out",
              onComplete: () => {
                isAnimating.current = false;
              },
            });
        }
      }, 100);

      lastScrollY.current = currentScrollY;
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [sponsors.length, isSoundEnabled]);

  return (
    <div
      ref={scrollContainerRef}
      className="relative w-full h-[calc(100dvh-12rem)] overflow-y-scroll scrollbar-hide overflow-x-clip"
    >
      <div ref={containerRef} className="relative w-full">
        <div className="sticky top-[calc(12rem+40px)] lg:top-[calc(14rem+50px)] -translate-y-1/2 w-full">
          <div
            ref={smallGearRef}
            className="absolute sm:left-[6%] sm:top-[50%] md:left-[13%] md:top-[60%] lg:left-[16%] lg:top-[55%] xl:left-[24%] xl:top-[60%] -translate-y-1/2"
          >
            <div className="size-72 sm:w-[301px] sm:h-[301px] md:w-72 md:h-72 lg:w-[291px] lg:h-[291px]">
              <img
                src={CONSTANT.ASSETS.PUBLIC.GEARCLOCK}
                alt="SmallGear"
                className="w-full h-full"
              />
            </div>
          </div>

          <div
            ref={largeGearRef}
            className="absolute left-[25%] top-[55%] md:left-[30%] md:top-[59%] lg:left-[28%] lg:top-[60%] xl:left-[33%] xl:top-[63%] -translate-y-1/2"
          >
            <div className="sm:w-[541px] sm:h-[541px] md:w-[581px] md:h-[581px] lg:w-[696px] lg:h-[696px]">
              <img
                src={CONSTANT.ASSETS.PUBLIC.GEARCLOCK}
                alt="LargerGear"
                className="w-full h-full"
              />
            </div>
          </div>

          <div
            ref={cardRef}
            className="sm:h-auto absolute mt-10 lg:mt-10 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] sm:w-[32rem] mx-auto lg:w-[36rem]"
          >
            <div className="bg-[#054432]/90 backdrop-blur-sm rounded-xl border-2 border-amber-500/50 shadow-lg p-10 hover:border-amber-500 transition-colors overflow-clip">
              <div className="flex flex-col items-center gap-4">
                {sponsors[currentIndex]?.title && (
                  <h3 className="text-center text-2xl text-amber-500 font-life-craft">
                    {sponsors[currentIndex].title}
                  </h3>
                )}
                <div className="relative size-32 md:size-40">
                  <img
                    src={`/2025/sponsors/${sponsors[currentIndex]?.imageUrl}`}
                    alt={sponsors[currentIndex]?.name ?? "Sponsor Logo"}
                    className="object-contain"
                  />
                </div>
                <div className="text-center">
                  {sponsors[currentIndex] && (
                    <>
                      <h3 className="text-2xl text-amber-500 mb-2 font-life-craft">
                        {sponsors[currentIndex].name}
                      </h3>
                      <p className="text-emerald-100/90 text-xs md:text-sm p-1 text-center md:text-center ">
                        {sponsors[currentIndex].description}
                      </p>
                    </>
                  )}
                </div>

                {sponsors[currentIndex]?.websiteUrl && (
                  <a
                    href={sponsors[currentIndex].websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm md:text-[1rem] bottom-0 translate-y-1/2 group flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 bg-amber-500 text-[#054432] hover:bg-amber-400 transition-all hover:scale-105 rounded-tl-2xl rounded-br-2xl rounded-tr-sm rounded-bl-sm"
                  >
                    Visit Website
                    <ExternalLink className="size-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Create space for scrolling */}
        <div style={{ height: `${sponsors.length * 100}vh` }} />
      </div>
    </div>
  );
};

export default SponsorGearCarousel;
