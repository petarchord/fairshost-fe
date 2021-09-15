import React, { useState, useRef } from "react";
import styles from "./VideoElement.module.scss";

// Icons imports
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { BsFillVolumeUpFill } from "react-icons/bs";
import { BsFillVolumeMuteFill } from "react-icons/bs";
import { BsArrowsFullscreen } from "react-icons/bs";
import { BsFillVolumeDownFill } from "react-icons/bs";

const VideoElement = ({ video }) => {
  // Video controls state
  const [volume1, setVolume] = useState(0);
  const [paused, setPaused] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);

  // Video controls refs
  const player = useRef();
  const playButton = useRef();
  const volumeIcon = useRef();
  const pauseButton = useRef();
  //const progressRange = useRef();
  //const progressBar = useRef();
  const volumeRange = useRef();
  const volumeBar = useRef();
  const currentTime = useRef();
  const fullScreenButton = useRef();
  const muteIcon = useRef();

  // Video controls functions:

  // Toggle play/pause ------------------------------- //
  const togglePlay = () => {
    if (video.current.paused) {
      video.current.play();
      setPaused(true);
    } else {
      video.current.pause();
      setPaused(false);
      video.current.currentTime = 0;
    }
  };

  // Show time ------------------------------- //
  const showTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    minutes = minutes > 10 ? minutes : `0${minutes}`;
    seconds = seconds > 9 ? seconds : `0${seconds}`;
    return `${minutes}:${seconds}`;
  };

  const updateProgress = () => {
    currentTime.current.textContent = `${showTime(video.current.currentTime)}`;
  };

  // Volume ------------------------------- //
  let volume = 0;

  const changeVolume = (e) => {
    volume = e.nativeEvent.offsetX / volumeRange.current.offsetWidth;

    // Rounding volume up or down
    if (volume < 0.1) {
      volume = 0;
    }

    if (volume > 0.9) {
      volume = 1;
    }

    volumeBar.current.style.width = `${volume * 100}%`;
    video.current.volume = volume;
    setVolume(volume);
  };

  // Fullscreen ------------------------------- //
  // Open full screen:
  function openFullscreen(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      /* Firefox */
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      /* IE/Edge */
      element.msRequestFullscreen();
    }
  }

  /* Close fullscreen */
  const closeFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      /* Firefox */
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      /* IE/Edge */
      document.msExitFullscreen();
    }
  };

  //let fullscreen = false;

  // Toggle fullscreen
  const toggleFullscreen = () => {
    var videoPlayer = player.current;
    if (!fullScreen) {
      openFullscreen(videoPlayer);
      setFullScreen(true);
    } else {
      closeFullscreen();
      setFullScreen(false);
    }
  };

  // Show correct volume icon
  const showVolumeIcon = () => {
    if (volume1 > 0.7) {
      return <BsFillVolumeUpFill ref={volumeIcon.current} />;
    } else if (volume1 < 0.7 && volume1 > 0) {
      return <BsFillVolumeDownFill ref={volumeIcon.current} />;
    } else if (volume === 0) {
      return <BsFillVolumeMuteFill ref={volumeIcon.current} />;
    }
  };

  // Create functions for mute/unmute video
  const toggleMuteUnmute = () => {
    if (video.current.muted) {
      video.current.muted = false;
      setVolume(1);
    } else if (!video.current.muted) {
      video.current.muted = true;
      setVolume(0);
    }
  };

  // Finished video controls functions

  return (
    <div ref={player} className={styles.player}>
      <video
        onEnded={() => setPaused(false)}
        onClick={togglePlay}
        onTimeUpdate={updateProgress}
        onCanPlay={updateProgress}
        playsInline
        muted
        ref={video}
        loop
      />
      {/* Video controls component */}
      <div className={styles.showControls}>
        <div className={styles.controlsContainer}>
          {/*<div ref={progressRange} className={styles.progressRange} title="Seek">
									<div ref={progressBar} className={styles.progressBar}></div>
								</div>*/}
          <div className={styles.controlGroup}>
            <div className={styles.controlsLeft}>
              <div className={styles.playControls}>
                {paused ? (
                  <FaPause onClick={togglePlay} ref={pauseButton.current} />
                ) : (
                  <FaPlay onClick={togglePlay} ref={playButton.current} />
                )}
              </div>
              <div className={styles.volume}>
                <div
                  ref={muteIcon}
                  onClick={toggleMuteUnmute}
                  className={styles.volumeIcon}
                  title="Mute"
                >
                  {showVolumeIcon()}
                </div>
                <div
                  onClick={changeVolume}
                  ref={volumeRange}
                  className={styles.volumeRange}
                  title="Change volume"
                >
                  <div ref={volumeBar} className={styles.volumeBar}></div>
                </div>
              </div>
            </div>

            <div className={styles.controlsRight}>
              <div className={styles.time}>
                <span ref={currentTime} className={styles.timeElappsed}>
                  00:00
                </span>
                {/*<span ref={duration} className={styles.timeDuration}>2:29</span>*/}
              </div>
              <div
                onClick={toggleFullscreen}
                ref={fullScreenButton}
                className={styles.fullscreen}
              >
                <BsArrowsFullscreen />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoElement;
