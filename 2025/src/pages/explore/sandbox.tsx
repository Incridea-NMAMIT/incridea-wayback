import { useEffect, useRef, useState } from "react";

import AudioPlayer from "~/components/explore/audioPlayer";
import ExploreNav from "~/components/explore/exploreNav";
import { Experience } from "~/components/explore_2025/Medieval_Component";
import { CONSTANT } from "~/constants";

function Medieval() {
  const [isMuted, setIsMuted] = useState(() => {
    const savedState =
      typeof window !== "undefined" ? localStorage.getItem("isMuted") : null;
    return savedState !== null ? (JSON.parse(savedState) as never) : true;
  });
  const mainThemeAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    localStorage.setItem("isMuted", JSON.stringify(isMuted));
  }, [isMuted]);

  useEffect(() => {
    if (mainThemeAudioRef.current) {
      if (isMuted) {
        mainThemeAudioRef.current.pause();
      } else {
        void mainThemeAudioRef.current.play();
      }
    }
  }, [isMuted]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <AudioPlayer
        mainThemeAudioRef={mainThemeAudioRef}
        mainTheme={CONSTANT.ASSETS.AUDIO.LEVEL2}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      ></AudioPlayer>
      <ExploreNav />
      <Experience />
    </div>
  );
}

export default Medieval;
