import VideoPlayer from "@/components/video_player/video-player";

export default function Home() {
  return (
    // <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-900 to-black">
    //   <h1 className="text-4xl font-bold mb-8 text-white text-center">Ultimate Video Player</h1>
      <VideoPlayer src="http://localhost:4000/api/fileupload/input.mp4"/>
    // </main>
  )
}

