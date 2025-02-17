"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, []);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (newTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(newTime, duration));
      setCurrentTime(newTime);
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
      const newRate = Math.max(0.25, Math.min(videoRef.current.playbackRate + change, 2));
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
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const skip = (amount: number) => {
    if (videoRef.current) {
      const newTime = Math.max(0, Math.min(videoRef.current.currentTime + amount, duration));
      videoRef.current.currentTime = newTime;
    }
  };

  return (
    <TooltipProvider>
      <div
        ref={containerRef}
        className="relative w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-xl bg-black"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
        <div className="relative cursor-pointer" onClick={togglePlay}>
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            className="w-full h-auto"
            preload="metadata"
            playsInline
          />
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
              <Play className="w-16 h-16 text-white opacity-80" />
            </div>
          )}
        </div>
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-2">
            <Slider
              value={[currentTime]}
              min={0}
              max={duration}
              step={0.1}
              onValueChange={([value]) => handleSeek(value)}
              className="w-full h-2"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white">
                    <motion.div whileTap={{ scale: 0.9 }}>
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
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
                    className="text-white "
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
                  <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white">
                    {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
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
              />
              <span className="text-sm text-white">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-white"
                  >
                    <Settings className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="text-white"
                  >
                    {isFullscreen ? (
                      <Minimize className="h-6 w-6" />
                    ) : (
                      <Maximize className="h-6 w-6" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFullscreen ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)"}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </motion.div>
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-20 right-4 p-4 rounded-lg shadow-lg bg-black"
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
                    onValueChange={(value) => setSkipDuration(Number.parseInt(value))}
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
};

export default VideoPlayer;
