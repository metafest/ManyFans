import VideoGallery from '@/components/home/videoCard'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react'

async function fetchdata() {
    const videos = await fetch(`${process.env.NEXT_PUBLIC_SERVER_LINK}/api/fileupload`);
    const RawData = await videos.json();
    return RawData;
}

async function page() {
    const data = await fetchdata();
  return (
    <div>
        <nav className="flex justify-between items-center p-4  mr-16 mt-3">
                <h1 className="text-xl font-bold">Video Gallery</h1>
                <div className="space-x-4">
                    <Link href="/">
                        <Button variant="outline">Home</Button>
                    </Link>
                    <Link href="/upload">
                        <Button className="bg-blue-500 hover:bg-blue-600">Upload Video</Button>
                    </Link>
                </div>
            </nav>
        <VideoGallery videos={data} />
    </div>
  )
}

export default page