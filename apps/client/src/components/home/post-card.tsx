import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface PostCardProps {
  avatar: string;
  name: string;
  time: string;
  content: string;
  image?: string;
}

export function PostCard({
  avatar,
  name,
  time,
  content,
  image,
}: PostCardProps) {
  return (
    <div className="group p-6 space-y-4 transition-colors hover:bg-accent/5">
      <div className="flex items-start gap-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={avatar} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium">{name}</span>
            <span className="text-sm text-muted-foreground">{time}</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{content}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
      {image && (
        <div className="relative rounded-lg overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt="Post content"
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}
    </div>
  );
}
