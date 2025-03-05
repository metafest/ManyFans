'use client'
import { VideoPlayer } from "@metafest/pushyplayer";
import "@metafest/pushyplayer/dist/index.css";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <VideoPlayer
      src={`https://manyfans.nuxt.dev/api/files/${slug}`}
    />
  );
}