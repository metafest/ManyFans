"use client";

import React, { useState, useRef } from "react";
import { FileVideo, Clock, HardDrive } from "lucide-react";
import { Card, CardContent } from "../ui/card";

// Utility functions
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export interface Video {
  pathname?: string;
  contentType?: string;
  size: number;
  httpEtag?: string;
  uploadedAt: string;
  httpMetadata?: { contentType: string };
  customMetadata?: {};
  userAvatar?: string;
  description?: string;
}

const GalleryCard = ({ video }: { video: Video }) => {
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const title = video.pathname?.split(".").slice(0, -1).join(".") || "Untitled";

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current) {
      videoRef.current
        .play()
        .catch((err) => console.log("Video play failed:", err));
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 h-full rounded-md">
      <CardContent className="p-3 space-y-3 flex flex-col h-full">
        {/* Video Preview Section */}
        <div
          className="aspect-video bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {isHovering ? (
            <video
              ref={videoRef}
              poster="true"
              controls
              className="w-full h-full object-cover"
            >
              <source
                src={`${process.env.NEXT_PUBLIC_SERVER_LINK}/api/fileupload/${video.pathname}`}
                type={video.httpMetadata?.contentType}
              />
              Download the
              <a
                href={`${process.env.NEXT_PUBLIC_SERVER_LINK}/api/fileupload/${video.pathname}`}
              >
                video
              </a>
            </video>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <FileVideo className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Title */}
        <div className="space-y-2 flex-grow">
          <h3 className="font-medium line-clamp-2 text-base">{title}</h3>
        </div>

        {/* Metadata Section */}
        <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t mt-auto">
          <div className="flex items-center gap-1">
            <HardDrive className="w-4 h-4" />
            <span className="text-sm text-gray-500 ">
              {formatFileSize(video.size)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {/* <Clock className="w-4 h-4" />
            <span>{video.contentType}</span> */}
            <p className="text-xs text-gray-500 ml-auto">
              {formatDate(video.uploadedAt)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GalleryCard;
