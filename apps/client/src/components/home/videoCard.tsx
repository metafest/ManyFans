"use client";
import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileVideo, Clock, HardDrive, Calendar } from 'lucide-react';

// Utility function to format file size
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Utility function to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

interface Video {
  pathname?: string;
  contentType?: string;
  size: number;
  httpEtag?: string;
  uploadedAt: string;
  httpMetadata?: { contentType: string };
  customMetadata?: {};
  // Added fields for user info
  userName?: string;
  userAvatar?: string;
  description?: string;
}

const VideoCard = ({ video }: { video: Video }) => {
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const title = video.pathname?.split('.').slice(0, -1).join('.') || 'Untitled';

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current) {
      videoRef.current.play().catch(err => console.log('Video play failed:', err));
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
    <Card className="group hover:shadow-lg transition-all duration-300 h-full">
      <CardContent className="p-3 space-y-3">
        {/* User Info Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
            {video.userAvatar ? (
              <img
                src={video.userAvatar}
                alt={video.userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500 font-medium">
                {(video.userName || 'U')[0].toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-medium text-sm">{video.userName || 'Anonymous User'}</h4>
            <p className="text-xs text-gray-500">{formatDate(video.uploadedAt)}</p>
          </div>
        </div>

        {/* Video Preview Section */}
        <div
          className="aspect-video bg-gray-100 rounded-lg overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {isHovering ? (
            <video ref={videoRef} poster='true' controls className="w-full h-full object-cover">
              <source src={`${process.env.NEXT_PUBLIC_SERVER_LINK}/api/fileupload/${video.pathname}`} type={video.httpMetadata?.contentType} />

              <source src={`${process.env.NEXT_PUBLIC_SERVER_LINK}/api/fileupload/${video.pathname}`} type={video.httpMetadata?.contentType} />

              Download the
              <a href={`${process.env.NEXT_PUBLIC_SERVER_LINK}/api/fileupload/${video.pathname}`}>WEBM</a>
              or
              <a href={`${process.env.NEXT_PUBLIC_SERVER_LINK}/api/fileupload/${video.pathname}`}>MP4</a>
              video.
            </video>

          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <FileVideo className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Title and Description */}
        <div className="space-y-2">
          <h3 className="font-medium line-clamp-2 text-base">
            {title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {video.description || 'No description available'}
          </p>
        </div>

        {/* Metadata Section */}
        <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t">
          <div className="flex items-center gap-1">
            <HardDrive className="w-4 h-4" />
            <span>{formatFileSize(video.size)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{video.contentType}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EmptyState = () => (
  <div className="w-full min-h-[400px] flex flex-col items-center justify-center bg-gray-50 rounded-lg">
    <FileVideo className="w-16 h-16 text-gray-400 mb-4" />
    <h3 className="text-xl font-medium text-gray-700 mb-2">No videos yet</h3>
    <p className="text-gray-500 text-center max-w-md">
      Upload your videos to see them displayed here
    </p>
  </div>
);

const VideoGallery = ({ videos }: { videos: Video[] }) => {
  if (!videos || videos.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-fr">
        {videos.map((video, index) => (
          <VideoCard
            key={video.httpEtag || index}
            video={video}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoGallery;