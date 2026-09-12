import Image from "next/image";
import { useRouter } from "next/router";
import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

import Button from "~/components/button";
import Modal from "~/components/modal";

import styles from "./audioPlayer.module.css";
import { cn } from "~/lib/utils";
import { Volume, Volume3 } from "~/components/explore_2025/UI";

type AudioPlayerProps = {
  mainTheme: string;
  isMuted: boolean;
  setIsMuted: Dispatch<SetStateAction<boolean>>;
  mainThemeAudioRef: React.MutableRefObject<HTMLAudioElement | null>;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  mainThemeAudioRef,
  mainTheme,
  isMuted,
  setIsMuted,
}) => {
  // const mainThemeAudioRef = useRef<HTMLAudioElement | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [modal, setModal] = useState<boolean>(true);
  const isMutedRef = useRef(isMuted);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);
  const handleTogglePlayback = () => {
    if (mainThemeAudioRef.current) {
      if (!hasInteracted) {
        setHasInteracted(true);
      }
      mainThemeAudioRef.current.muted = !isMutedRef.current;
      setIsMuted(!isMutedRef.current);
    }
  };

  function handleYes() {
    if (mainThemeAudioRef.current) {
      if (!hasInteracted) {
        setHasInteracted(true);
      }
      mainThemeAudioRef.current.muted = false;
      setIsMuted(false);
      setModal(false);
    }
  }

  function handleNo() {
    if (mainThemeAudioRef.current) {
      if (!hasInteracted) {
        setHasInteracted(true);
      }
      mainThemeAudioRef.current.muted = true;
      setIsMuted(true);
      setModal(false);
    }
  }

  const [volume, setVolume] = useState(60);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(event.target.value);
    setVolume(newVolume);

    if (mainThemeAudioRef.current) {
      mainThemeAudioRef.current.volume = newVolume / 100;
    }
  };

  useEffect(() => {
    if (mainThemeAudioRef.current && hasInteracted) {
      void mainThemeAudioRef.current.play();
      mainThemeAudioRef.current.volume = volume / 100;
    }
  }, [hasInteracted, mainThemeAudioRef, volume]);

  const router = useRouter();

  return (
    <div className={"sticky top-20 z-[60] h-0"}>
      <audio ref={mainThemeAudioRef} loop muted={isMuted} autoPlay playsInline>
        <source src={mainTheme} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

      <button
        onClick={handleTogglePlayback}
        className={styles["audio-player-button"]}
      >
        {isMuted && (
          <Volume3 className="h-10 w-10 mx-4 transition-colors duration-150 scale-[150%]" />
        )}
        {!isMuted && (
          <Volume className="h-10 w-10 mx-4 transition-colors duration-150 scale-[150%]" />
        )}
      </button>
      <div className={cn(styles["audio-player-volume"], "hidden")}>
        <label htmlFor="volumeSlider" />
        <input
          id="volumeSlider"
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="w-28"
        />
      </div>
      {router.pathname === "/explore/level1" && (
        <Modal
          size="md"
          title="Do you want audio?"
          showModal={modal}
          onClose={() => setModal(false)}
        >
          <div className="flex flex-col justify-center">
            <div className="mb-5 mt-5 flex justify-center gap-x-4 lg:mb-0">
              <Button
                size={"medium"}
                onClick={() => {
                  handleYes();
                }}
                className="!px-5"
              >
                Yes
              </Button>

              <Button
                className="!px-5"
                size={"medium"}
                onClick={() => handleNo()}
              >
                No
              </Button>
            </div>
            <div className="m-2 hidden rounded-xl border border-secondary-400/40 bg-primary-300/30 p-2 lg:m-5 lg:block lg:p-5">
              <p className="text-center font-bold">How to Play?</p>
              <Image
                src={"/assets/png/toolTip.png"}
                alt="toolTip"
                width={500}
                height={500}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
    // </div>
  );
};

export default AudioPlayer;
