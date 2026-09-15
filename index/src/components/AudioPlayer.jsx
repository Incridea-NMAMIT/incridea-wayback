import { useState, useRef, useEffect, useCallback } from 'react';
import { ANTHEMS } from '../data/anthems';
import './AudioPlayer.css';

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function AudioPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const initialStartTime = ANTHEMS[0]?.startTime || 0;
  const [currentTime, setCurrentTime] = useState(initialStartTime);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.65);
  const [prevVolume, setPrevVolume] = useState(0.65);
  const [isMuted, setIsMuted] = useState(false);
  // Repeat mode: 'off' | 'all' | 'one'
  const [repeatMode, setRepeatMode] = useState('all');
  const [isShuffle, setIsShuffle] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(initialStartTime);

  const audioRef = useRef(null);
  const isFirstLoad = useRef(true);
  const currentTrack = ANTHEMS[currentTrackIndex] || ANTHEMS[0];

  // Sync audio element volume & muted state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Load and play track when currentTrackIndex changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = currentTrack.src;
    audio.load();

    const startAt = (isFirstLoad.current && currentTrack.startTime) ? currentTrack.startTime : 0;
    setCurrentTime(startAt);
    setSeekValue(startAt);

    const onMetadata = () => {
      if (startAt > 0) {
        audio.currentTime = startAt;
      }
    };
    audio.addEventListener('loadedmetadata', onMetadata, { once: true });

    if (isPlaying) {
      audio.play().then(() => {
        if (startAt > 0 && Math.abs(audio.currentTime - startAt) > 1.5) {
          audio.currentTime = startAt;
        }
      }).catch((err) => {
        console.warn('Audio auto-play on track change blocked:', err);
        setIsPlaying(false);
      });
    }

    isFirstLoad.current = false;
  }, [currentTrackIndex]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (!isSeeking) {
        setCurrentTime(audio.currentTime);
        setSeekValue(audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      if (isFirstLoad.current && currentTrack.startTime) {
        audio.currentTime = currentTrack.startTime;
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else if (repeatMode === 'all') {
        handleNextTrack(true);
      } else {
        // 'off'
        if (currentTrackIndex < ANTHEMS.length - 1) {
          handleNextTrack(true);
        } else {
          setIsPlaying(false);
          audio.currentTime = 0;
          setCurrentTime(0);
        }
      }
    };

    const handleError = () => {
      // fall back to fallbackSrc if configured and different from current src
      if (currentTrack.fallbackSrc && !audio.src.endsWith(currentTrack.fallbackSrc)) {
        console.info(`Audio track ${currentTrack.title} using fallback source.`);
        audio.src = currentTrack.fallbackSrc;
        audio.load();
        if (isPlaying) {
          audio.play().catch(() => {});
        }
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [isSeeking, repeatMode, currentTrackIndex, currentTrack, isPlaying]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      if (audio.currentTime < 1 && currentTrack.startTime) {
        audio.currentTime = currentTrack.startTime;
        setCurrentTime(currentTrack.startTime);
        setSeekValue(currentTrack.startTime);
      }
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Playback error or user gesture needed:', err);
      });
    }
  }, [isPlaying, currentTrack]);

  const handleNextTrack = useCallback((autoTriggered = false) => {
    let nextIndex;
    if (isShuffle && ANTHEMS.length > 1) {
      const candidates = ANTHEMS.map((_, i) => i).filter((i) => i !== currentTrackIndex);
      nextIndex = candidates[Math.floor(Math.random() * candidates.length)];
    } else {
      nextIndex = (currentTrackIndex + 1) % ANTHEMS.length;
    }
    setCurrentTrackIndex(nextIndex);
    if (!autoTriggered) {
      setIsPlaying(true);
    }
  }, [currentTrackIndex, isShuffle]);

  const handlePrevTrack = useCallback(() => {
    const audio = audioRef.current;
    const startPoint = currentTrack.startTime || 0;
    if (audio && audio.currentTime > startPoint + 3) {
      audio.currentTime = startPoint;
      setCurrentTime(startPoint);
      setSeekValue(startPoint);
      return;
    }

    let prevIndex;
    if (isShuffle && ANTHEMS.length > 1) {
      const candidates = ANTHEMS.map((_, i) => i).filter((i) => i !== currentTrackIndex);
      prevIndex = candidates[Math.floor(Math.random() * candidates.length)];
    } else {
      prevIndex = (currentTrackIndex - 1 + ANTHEMS.length) % ANTHEMS.length;
    }
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(true);
  }, [currentTrackIndex, isShuffle, currentTrack]);

  const toggleRepeat = () => {
    if (repeatMode === 'off') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('off');
  };

  const toggleShuffle = () => {
    setIsShuffle((prev) => !prev);
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekChange = (e) => {
    const val = parseFloat(e.target.value);
    setSeekValue(val);
    setCurrentTime(val);
  };

  const handleSeekEnd = (e) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
    setIsSeeking(false);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(prevVolume > 0 ? prevVolume : 0.5);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
    }
  };

  const selectTrack = (index) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  // Progress percentage for background fill
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePercent = isMuted ? 0 : volume * 100;

  return (
    <div className="audio-player-widget" role="region" aria-label="Incridea Audio Player">
      {/* Hidden native audio element */}
      <audio ref={audioRef} preload="metadata" />

      {/* Player Header Bar */}
      <div className="ap-header">
        <div className="ap-brand">
          <span className="ap-brand-text">FEST ANTHEMS</span>
        </div>

        {/* Anthem Switcher Pills */}
        <div className="ap-edition-pills" role="tablist" aria-label="Anthem editions">
          {ANTHEMS.map((track, idx) => (
            <button
              key={track.id}
              type="button"
              role="tab"
              aria-selected={idx === currentTrackIndex}
              className={`ap-edition-pill ${idx === currentTrackIndex ? 'is-active' : ''}`}
              onClick={() => selectTrack(idx)}
              title={`${track.title} (${track.edition})`}
            >
              {track.edition}
            </button>
          ))}

          {/* Playlist drawer toggle button */}
          <button
            type="button"
            className={`ap-playlist-toggle-btn ${isPlaylistOpen ? 'is-active' : ''}`}
            onClick={() => setIsPlaylistOpen((prev) => !prev)}
            aria-label="Toggle anthem tracklist drawer"
            title="View all 3 anthems"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4zm14 0v6l5-3z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Track Lockup*/}
      <div className="ap-track-lockup">
        <div className="ap-track-meta">
          <div className="ap-meta-headline">
            <h3 className="ap-track-title" title={currentTrack.title}>
              {currentTrack.title}
            </h3>
          </div>
          <div className="ap-meta-subline">
            <span className="ap-artist-name" title={currentTrack.artist}>{currentTrack.artist}</span>
          </div>
        </div>
      </div>

      {/* Seeking Progress Timeline */}
      <div className="ap-timeline-container">
        <span className="ap-time-text ap-time-curr">{formatTime(currentTime)}</span>
        <div className="ap-seek-bar-wrapper">
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={seekValue}
            onMouseDown={handleSeekStart}
            onTouchStart={handleSeekStart}
            onChange={handleSeekChange}
            onMouseUp={handleSeekEnd}
            onTouchEnd={handleSeekEnd}
            onKeyUp={handleSeekEnd}
            className="ap-seek-range"
            aria-label="Track progress slider"
            style={{
              background: `linear-gradient(to right, #eccb8a 0%, #eccb8a ${progressPercent}%, rgba(255, 255, 255, 0.12) ${progressPercent}%, rgba(255, 255, 255, 0.12) 100%)`
            }}
          />
        </div>
        <span className="ap-time-text ap-time-dur">
          {duration > 0 ? formatTime(duration) : currentTrack.durationEstimate || '0:00'}
        </span>
      </div>

      {/* Control Buttons & Volume Dock */}
      <div className="ap-controls-dock">
        {/* Playback Transport Controls */}
        <div className="ap-playback-controls">
          {/* Shuffle Button */}
          <button
            type="button"
            className={`ap-btn ap-btn-secondary ${isShuffle ? 'is-active' : ''}`}
            onClick={toggleShuffle}
            aria-label={isShuffle ? "Disable shuffle" : "Enable shuffle"}
            title={isShuffle ? "Shuffle on" : "Shuffle off"}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
            </svg>
          </button>

          {/* Previous Track Button */}
          <button
            type="button"
            className="ap-btn ap-btn-secondary"
            onClick={handlePrevTrack}
            aria-label="Previous anthem"
            title="Previous anthem"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          {/* Play/Pause Button */}
          <button
            type="button"
            className="ap-btn ap-btn-play"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause anthem" : "Play anthem"}
            title={isPlaying ? "Pause anthem" : "Play anthem"}
          >
            {isPlaying ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ transform: 'translateX(1px)' }}>
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Next Track Button */}
          <button
            type="button"
            className="ap-btn ap-btn-secondary"
            onClick={() => handleNextTrack(false)}
            aria-label="Next anthem"
            title="Next anthem"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>

          {/* Repeat Mode Button */}
          <button
            type="button"
            className={`ap-btn ap-btn-secondary ${repeatMode !== 'off' ? 'is-active' : ''}`}
            onClick={toggleRepeat}
            aria-label={`Repeat mode: ${repeatMode}`}
            title={`Repeat: ${repeatMode === 'one' ? 'Repeat current song' : repeatMode === 'all' ? 'Repeat all' : 'Off'}`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
            </svg>
            {repeatMode === 'one' && <span className="ap-repeat-one-badge">1</span>}
          </button>
        </div>

        {/* Volume Control Dock */}
        <div className="ap-volume-control" title={`Volume: ${Math.round(volumePercent)}%`}>
          <button
            type="button"
            className="ap-volume-btn"
            onClick={toggleMute}
            aria-label={isMuted || volume === 0 ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            ) : volume < 0.5 ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.02"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="ap-volume-range"
            aria-label="Volume slider"
            style={{
              background: `linear-gradient(to right, #eccb8a 0%, #eccb8a ${volumePercent}%, rgba(255, 255, 255, 0.14) ${volumePercent}%, rgba(255, 255, 255, 0.14) 100%)`
            }}
          />
        </div>
      </div>

      {/* Anthem Tracklist Dropdown Drawer */}
      {isPlaylistOpen && (
        <div className="ap-playlist-drawer" role="listbox" aria-label="Available Anthems">
          <div className="ap-playlist-header">
            <span>Preserved Anthems (3)</span>
            <button
              type="button"
              className="ap-drawer-close-btn"
              onClick={() => setIsPlaylistOpen(false)}
              aria-label="Close track list"
            >
              &times;
            </button>
          </div>
          <div className="ap-playlist-items">
            {ANTHEMS.map((track, idx) => {
              const isCurrent = idx === currentTrackIndex;
              return (
                <div
                  key={track.id}
                  className={`ap-playlist-item ${isCurrent ? 'is-active' : ''}`}
                  onClick={() => selectTrack(idx)}
                  role="option"
                  aria-selected={isCurrent}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      selectTrack(idx);
                    }
                  }}
                >
                  <div className="ap-pli-left">
                    <span className="ap-pli-num">{isCurrent && isPlaying ? '▶' : idx + 1}</span>
                    <div className="ap-pli-info">
                      <span className="ap-pli-title">{track.title}</span>
                      <span className="ap-pli-artist">{track.artist} &middot; {track.edition}</span>
                    </div>
                  </div>
                  <span className="ap-pli-duration">{track.durationEstimate || '3:30'}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
