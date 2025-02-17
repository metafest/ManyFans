import {
  Home,
  MoreHorizontal,
  Search,
  Grid,
  Menu,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavLink } from "@/components/navbar/nav-link";
import { PostCard } from "@/components/home/post-card";
import FanIcon from "@/assests/icon/fan";

export default function Feed() {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header
      <header className="lg:hidden flex items-center h-14 px-4 border-b backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-medium">Feed</h1>
        </div>
      </header> */}

      <div className="flex">
        {/* Left Sidebar
        <aside className="hidden lg:flex flex-col w-64 border-r h-screen sticky top-0 pt-6">
          <div className="px-6 mb-6 flex items-center gap-2">
            <div className="w-8">
              <FanIcon speed="0.2s" />
            </div>
            <h1 className="font-semibold tracking-tight">Many Fans</h1>
          </div>
          <nav className="space-y-1 px-2">
            <NavLink href="#" icon={<Home className="w-4 h-4" />} active>
              Home
            </NavLink>
            <NavLink href="#" icon={<MoreHorizontal className="w-4 h-4" />}>
              More
            </NavLink>
          </nav>
        </aside> */}

        {/* Main Content */}
        <main className="flex-1 max-w-3xl border-r min-h-screen">
          <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm">
            <div className="p-6 border-b">
              <Button
                className="w-full bg-gradient-to-r from-primary to-primary/90 hover:to-primary"
                size="lg"
              >
                Subscribe for Free
              </Button>
            </div>

            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="w-full justify-start h-12 p-0 rounded-none border-b bg-transparent">
                <TabsTrigger
                  value="posts"
                  className="flex-1 h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  3,346 Posts
                </TabsTrigger>
                <TabsTrigger
                  value="media"
                  className="flex-1 h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  3,346 Media
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center justify-between p-4 border-b">
              <span className="text-sm font-medium">Recent</span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="hover:bg-accent">
                  <Search className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-accent">
                  <Grid className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-accent">
                  <Menu className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="divide-y">
            <PostCard
              avatar="http://localhost:4000/api/fileupload/Cat%20meme%20(1).jpg"
              name="Balaji Sriraman"
              time="5h ago"
              content="Just dropped some amazing new content! Check it out ✨"
              image="http://localhost:4000/api/fileupload/Cat%20meme%20(1).jpg"
            />
            <PostCard
              avatar="http://localhost:4000/api/fileupload/Cat%20meme%20(1).jpg"
              name="Creator Name"
              time="8h ago"
              content="Working on something special for you all!"
            />
          </div>
        </main>

        {/* Right Sidebar */}
        {/* <aside className="hidden lg:block w-80 p-6 sticky top-0 h-screen">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-sm font-medium">Subscription</h2>
              <Button
                className="w-full bg-gradient-to-r from-primary to-primary/90 hover:to-primary"
                size="lg"
              >
                Subscribe for Free
              </Button>
            </div>

            <footer className="text-sm text-muted-foreground">
              <nav className="flex gap-2">
                <a href="#" className="hover:text-foreground transition-colors">
                  Privacy
                </a>
                <span>·</span>
                <a href="#" className="hover:text-foreground transition-colors">
                  Cookie Notice
                </a>
                <span>·</span>
                <a href="#" className="hover:text-foreground transition-colors">
                  Terms
                </a>
              </nav>
            </footer>
          </div>
        </aside> */}
      </div>
    </div>
  );
}
