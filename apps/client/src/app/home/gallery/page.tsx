"use client";
import React from "react";
import { FileVideo } from "lucide-react";
import GalleryCard, { Video } from "@/components/home/videoCard";
import { fetchUserObjects } from "@/utils";

const EmptyState = () => (
  <div className="w-full min-h-[400px] flex flex-col items-center justify-center bg-gray-50 rounded-lg">
    <FileVideo className="w-16 h-16 text-gray-400 mb-4" />
    <h3 className="text-xl font-medium text-gray-700 mb-2">No videos yet</h3>
    <p className="text-gray-500 text-center max-w-md">
      Upload your videos to see them displayed here
    </p>
  </div>
);

export default function Page() {
  const [data, setData] = React.useState<Video[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchUserObjects<Video[]>();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <main>
        <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-fr">
            {data && data.length > 0 ? (
              data.map((video, index) => (
                <GalleryCard key={video.httpEtag || index} video={video} />
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
