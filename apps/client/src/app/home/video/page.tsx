import VideoGallery from '@/components/home/videoCard'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react'

function page() {
  return (
    <div>
        <nav className="flex justify-between items-center p-4 ">
                <h1 className="text-xl font-bold">Video Gallery</h1>
            </nav>
        <VideoGallery/>
    </div>
  )
}

export default page