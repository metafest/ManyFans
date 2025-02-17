"use client";

import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Loader2,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { handleKeyboardControls, formatTime } from "./videoControls";

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quality, setQuality] = useState("720p");
  const [skipDuration, setSkipDuration] = useState(5);
  const [showSettings, setShowSettings] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);

  // ─── FIX 1: Force video reload when src changes ─────────────────────────────
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [src]);

  // ─── Video Event Listeners ─────────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const onLoadStart = () => {
      setIsLoading(true);
    };

    const onCanPlay = () => {
      setIsLoading(false);
    };

    const onPlaying = () => {
      setIsLoading(false);
      setIsBuffering(false);
    };

    const onWaiting = () => {
      setIsBuffering(true);
    };

    const onError = () => {
      setIsLoading(false);
      console.error("Video error occurred");
    };

    video.addEventListener("loadstart", onLoadStart);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("error", onError);

    return () => {
      video.removeEventListener("loadstart", onLoadStart);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("error", onError);
    };
  }, [src]);

  // ─── Other Effects (Click outside, Keyboard, Fullscreen, etc.) ────────────────
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showSettings &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [showSettings]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      handleKeyboardControls(
        e,
        { isPlaying, currentTime, duration, volume, isMuted, skipDuration },
        {
          togglePlay,
          handleSeek,
          handleVolumeChange,
          toggleMute,
          toggleFullscreen,
          skip,
          handlePlaybackRate,
        }
      );
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [skipDuration, volume, duration, isPlaying]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // ─── Auto-hide Controls When Video is Playing ───────────────────────────────
  useEffect(() => {
    if (isPlaying && !isBuffering) {
      const scheduleHideControls = () => {
        if (hideControlsTimeout.current) {
          clearTimeout(hideControlsTimeout.current);
        }
        hideControlsTimeout.current = setTimeout(() => {
          if (
            Date.now() - lastActivity > 3000 &&
            isPlaying &&
            !showSettings &&
            !isBuffering
          ) {
            setShowControls(false);
          }
        }, 3000);
      };

      scheduleHideControls();

      const handleMouseMove = () => {
        setLastActivity(Date.now());
        setShowControls(true);
        scheduleHideControls();
      };

      const container = containerRef.current;
      container?.addEventListener("mousemove", handleMouseMove);

      return () => {
        if (hideControlsTimeout.current) {
          clearTimeout(hideControlsTimeout.current);
        }
        container?.removeEventListener("mousemove", handleMouseMove);
      };
    } else {
      // Always show controls when not playing or buffering
      setShowControls(true);
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
    }
  }, [isPlaying, lastActivity, showSettings, isBuffering]);

  useEffect(() => {
    if (showSettings) {
      setShowControls(true);
    }
  }, [showSettings]);

  // ─── Video Action Handlers ─────────────────────────────────────────────────────
  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) =>
            console.error("Error attempting to play:", error)
          );
        }
      }
      setIsPlaying((prev) => !prev);
    }
  }, [isPlaying]);

  const handleSeek = (newTime: number) => {
    if (videoRef.current) {
      const clampedTime = Math.max(0, Math.min(newTime, duration));
      videoRef.current.currentTime = clampedTime;
      setCurrentTime(clampedTime);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (videoRef.current) {
      const clampedVolume = Math.max(0, Math.min(newVolume, 1));
      videoRef.current.volume = clampedVolume;
      setVolume(clampedVolume);
      setIsMuted(clampedVolume === 0);
      if (clampedVolume > 0) {
        setPreviousVolume(clampedVolume);
      }
    }
  };

  const handlePlaybackRate = (change: number) => {
    if (videoRef.current) {
      const newRate = Math.max(
        0.25,
        Math.min(videoRef.current.playbackRate + change, 2)
      );
      videoRef.current.playbackRate = newRate;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        handleVolumeChange(previousVolume);
      } else {
        setPreviousVolume(volume);
        handleVolumeChange(0);
      }
      setIsMuted((prev) => !prev);
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const skip = (amount: number) => {
    if (videoRef.current) {
      const newTime = Math.max(
        0,
        Math.min(videoRef.current.currentTime + amount, duration)
      );
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    // Toggle play only if clicking directly on the video or container
    if (e.target === e.currentTarget || e.target === videoRef.current) {
      togglePlay();
    }
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSettings((prev) => !prev);
  };

  const canPlayVideo = () =>
    videoRef.current &&
    videoRef.current.readyState >= 3 && // HAVE_FUTURE_DATA or HAVE_ENOUGH_DATA
    !isLoading;

  return (
    <TooltipProvider>
      <div
        ref={containerRef}
        className="relative w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-xl bg-black flex flex-col"
        onMouseEnter={() => setShowControls(true)}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}

        {/* Buffering Overlay */}
        {isBuffering && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-10">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}

        {/* Video Element */}
        <div className="relative flex-grow" onClick={handleVideoClick}>
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            className="w-full h-full object-contain"
            preload="metadata"
            playsInline
          />
          {/* Play Button Overlay (when paused) */}
          {!isPlaying && !isLoading && !isBuffering && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
              <Play className="w-16 h-16 text-white opacity-80" />
            </div>
          )}
        </div>

        {/* Controls Overlay */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              className={`${
                isFullscreen
                  ? "absolute inset-x-0 bottom-0 flex items-center justify-center pb-8"
                  : "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/90 to-transparent"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {isFullscreen ? (
                // ── Fullscreen Controls ─────────────────────────────
                <div className="flex flex-col items-center justify-center max-w-md bg-black/60 backdrop-blur-sm rounded-xl p-3 shadow-2xl">
                  <div className="flex items-center justify-between w-full mb-2">
                    <Slider
                      value={[currentTime]}
                      min={0}
                      max={duration || 1}
                      step={0.1}
                      onValueChange={([value]) => handleSeek(value)}
                      className="w-full h-2"
                      disabled={!canPlayVideo()}
                    />
                  </div>
                  <div className="flex items-center justify-between w-full space-x-1">
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={togglePlay}
                        className="text-white"
                        disabled={isLoading}
                      >
                        <motion.div whileTap={{ scale: 0.9 }}>
                          {isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </motion.div>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => skip(-skipDuration)}
                        className="text-white"
                        disabled={!canPlayVideo()}
                      >
                        <motion.div whileTap={{ scale: 0.9 }}>
                          <SkipBack className="h-4 w-4" />
                        </motion.div>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => skip(skipDuration)}
                        className="text-white"
                        disabled={!canPlayVideo()}
                      >
                        <motion.div whileTap={{ scale: 0.9 }}>
                          <SkipForward className="h-4 w-4" />
                        </motion.div>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleMute}
                        className="text-white"
                        disabled={isLoading}
                      >
                        {isMuted ? (
                          <VolumeX className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </Button>
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={([value]) => handleVolumeChange(value)}
                        className="w-16"
                        disabled={isLoading}
                      />
                      <span className="text-xs text-white ml-1">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Popover open={showSettings} onOpenChange={setShowSettings}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white"
                            disabled={isLoading}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="bg-black/80 backdrop-blur-sm text-white border-white/20 p-4 w-56"
                          sideOffset={5}
                          align="end"
                        >
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="quality" className="text-white">
                                Quality
                              </Label>
                              <Select value={quality} onValueChange={setQuality}>
                                <SelectTrigger className="w-[90px] bg-black text-white border-white/20">
                                  <SelectValue placeholder="Quality" />
                                </SelectTrigger>
                                <SelectContent className="bg-black text-white border-white/20">
                                  <SelectItem value="144p">144p</SelectItem>
                                  <SelectItem value="360p">360p</SelectItem>
                                  <SelectItem value="720p">720p</SelectItem>
                                  <SelectItem value="1080p">1080p</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="skip-duration" className="text-white">
                                Skip Duration
                              </Label>
                              <Select
                                value={skipDuration.toString()}
                                onValueChange={(value) =>
                                  setSkipDuration(Number.parseInt(value))
                                }
                              >
                                <SelectTrigger className="w-[90px] bg-black text-white border-white/20">
                                  <SelectValue placeholder="Skip" />
                                </SelectTrigger>
                                <SelectContent className="bg-black text-white border-white/20">
                                  <SelectItem value="5">5s</SelectItem>
                                  <SelectItem value="10">10s</SelectItem>
                                  <SelectItem value="15">15s</SelectItem>
                                  <SelectItem value="30">30s</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleFullscreen}
                        className="text-white"
                        disabled={isLoading}
                      >
                        <Minimize className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                // ── Normal Controls (Non-Fullscreen) ─────────────────────
                <div className="flex flex-col p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Slider
                      value={[currentTime]}
                      min={0}
                      max={duration || 1}
                      step={0.1}
                      onValueChange={([value]) => handleSeek(value)}
                      className="w-full h-2"
                      disabled={!canPlayVideo()}
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={togglePlay}
                            className="text-white"
                            disabled={isLoading}
                          >
                            <motion.div whileTap={{ scale: 0.9 }}>
                              {isPlaying ? (
                                <Pause className="h-6 w-6" />
                              ) : (
                                <Play className="h-6 w-6" />
                              )}
                            </motion.div>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isPlaying ? "Pause (Space)" : "Play (Space)"}</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => skip(-skipDuration)}
                            className="text-white"
                            disabled={!canPlayVideo()}
                          >
                            <motion.div whileTap={{ scale: 0.9 }}>
                              <SkipBack className="h-6 w-6" />
                            </motion.div>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Skip Back {skipDuration}s (←)</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => skip(skipDuration)}
                            className="text-white"
                            disabled={!canPlayVideo()}
                          >
                            <motion.div whileTap={{ scale: 0.9 }}>
                              <SkipForward className="h-6 w-6" />
                            </motion.div>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Skip Forward {skipDuration}s (→)</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleMute}
                            className="text-white"
                            disabled={isLoading}
                          >
                            {isMuted ? (
                              <VolumeX className="h-6 w-6" />
                            ) : (
                              <Volume2 className="h-6 w-6" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isMuted ? "Unmute (M)" : "Mute (M)"}</p>
                        </TooltipContent>
                      </Tooltip>
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={([value]) => handleVolumeChange(value)}
                        className="w-24"
                        disabled={isLoading}
                      />
                      <span className="text-sm text-white ml-1">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Popover open={showSettings} onOpenChange={setShowSettings}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white"
                            disabled={isLoading}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Settings className="h-6 w-6" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="bg-black/80 backdrop-blur-sm text-white border-white/20 p-4 w-64"
                          sideOffset={5}
                          align="end"
                        >
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="quality" className="text-white">
                                Quality
                              </Label>
                              <Select value={quality} onValueChange={setQuality}>
                                <SelectTrigger className="w-[100px] bg-black text-white border-white/20">
                                  <SelectValue placeholder="Quality" />
                                </SelectTrigger>
                                <SelectContent className="bg-black text-white border-white/20">
                                  <SelectItem value="144p">144p</SelectItem>
                                  <SelectItem value="360p">360p</SelectItem>
                                  <SelectItem value="720p">720p</SelectItem>
                                  <SelectItem value="1080p">1080p</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="skip-duration" className="text-white">
                                Skip Duration
                              </Label>
                              <Select
                                value={skipDuration.toString()}
                                onValueChange={(value) =>
                                  setSkipDuration(Number.parseInt(value))
                                }
                              >
                                <SelectTrigger className="w-[100px] bg-black text-white border-white/20">
                                  <SelectValue placeholder="Skip Duration" />
                                </SelectTrigger>
                                <SelectContent className="bg-black text-white border-white/20">
                                  <SelectItem value="5">5s</SelectItem>
                                  <SelectItem value="10">10s</SelectItem>
                                  <SelectItem value="15">15s</SelectItem>
                                  <SelectItem value="30">30s</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleFullscreen}
                            className="text-white"
                            disabled={isLoading}
                          >
                            <Maximize className="h-6 w-6" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter Fullscreen (F)</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
};

export default VideoPlayer;
