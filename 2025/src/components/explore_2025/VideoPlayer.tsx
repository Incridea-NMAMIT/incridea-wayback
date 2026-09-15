import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { SlVolume2, SlVolumeOff } from "react-icons/sl";
import YouTube, { YouTubePlayer, YouTubeProps } from "react-youtube";

import Button from "~/components/button";
import { IoIosSkipForward } from "react-icons/io";
import { router } from "next/client";
import { CONSTANT } from "~/constants";

export const VideoPlayer = (props: { props: [string, string] }) => {
  const [clickThru, setClickThru] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const blackScreenRef = useRef<HTMLDivElement>(null);
  const YTPlayerRef = useRef<YouTubePlayer>(null);
  const skipRef = useRef<HTMLDivElement>(null);

  const onReady: YouTubeProps["onReady"] = (e) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    YTPlayerRef.current = e.target;
    (YTPlayerRef.current as YouTubePlayerPatch).playVideo();
  };

  const onPlay: YouTubeProps["onPlay"] = () => {
    if (blackScreenRef.current) blackScreenRef.current.style.display = "none";
    setClickThru(false);
  };

  const onPause: YouTubeProps["onPause"] = (e) => {
    (e.target as YouTubePlayerPatch).playVideo();
  };

  const onEnd: YouTubeProps["onEnd"] = () => {
    if (blackScreenRef.current)
      blackScreenRef.current.style.display = "initial";
    void router.push(props.props[1]);
  };

  const onError: YouTubeProps["onError"] = () => {
    if (blackScreenRef.current)
      blackScreenRef.current.style.display = "initial";
    void router.push(props.props[1]);
  };

  useEffect(() => {
    setTimeout(() => {
      if (skipRef.current) skipRef.current.style.transform = "translateX(0%)";
    }, 3000);
  }, []);

  return (
    <div className="absolute z-50 h-screen w-screen overflow-hidden bg-black">
      <div
        className={`absolute z-40 h-screen w-screen ${
          clickThru ? "pointer-events-none" : "pointer-events-auto"
        }`}
      ></div>
      <button
        onClick={() => {
          if (!YTPlayerRef.current) return;
          if ((YTPlayerRef.current as YouTubePlayerPatch).isMuted()) {
            (YTPlayerRef.current as YouTubePlayerPatch).unMute();
            setIsMuted(false);
          } else {
            setIsMuted(true);
            (YTPlayerRef.current as YouTubePlayerPatch).mute();
          }
        }}
        className="absolute right-[2vw] top-[3vh] z-50 cursor-pointer text-white"
      >
        {isMuted ? (
          <SlVolumeOff className="h-8 w-8 transition-colors duration-150" />
        ) : (
          <SlVolume2 className="h-8 w-8 transition-colors duration-150" />
        )}
      </button>
      <div
        ref={blackScreenRef}
        className="absolute z-40 flex h-screen w-screen items-center justify-center bg-black"
      >
        <Image
          src={CONSTANT.ASSETS.PUBLIC.LOGO_COMBINED}
          alt=""
          height={240}
          width={240}
          className="animate-pulse opacity-80"
        />
      </div>
      <div
        ref={skipRef}
        className="absolute -right-1 bottom-[10vh] z-50 translate-x-[110%] transition-all duration-500 ease-in hover:scale-110"
      >
        <Button
          onClick={async () => await router.push(props.props[1])}
          size={"large"}
        >
          Skip <IoIosSkipForward />
        </Button>
      </div>
      <YouTube
        videoId={`${props.props[0]}`}
        className="relative h-screen w-screen overflow-clip"
        iframeClassName="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 w-[115vw] h-[115vh]"
        title={"exploreIntro"}
        loading="eager"
        opts={{
          playerVars: {
            autoplay: 1,
            showinfo: 0,
            controls: 0,
            modestbranding: 0,
            disablekb: 1,
            fs: 0,
            loop: 0,
            playsinline: 0,
            rel: 0,
            mute: 1,
          },
        }}
        onReady={onReady}
        onPlay={onPlay}
        onPause={onPause}
        onEnd={onEnd}
        onError={onError}
      />
    </div>
  );
};
