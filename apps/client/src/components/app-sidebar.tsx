import * as React from "react";
import { Map, PersonStandingIcon, File } from "lucide-react";

import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { FanHandler } from "./common/FanHandler";
import { useUser } from "@clerk/nextjs";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  const data = {
    projects: [
      {
        name: "File Upload",
        url: "/home/upload",
        icon: File,
      },
      {
        name: "p2p Sharing",
        url: "/home",
        icon: PersonStandingIcon,
      },
      {
        name: "Video Streaming",
        url: "/home/gallery",
        icon: Map,
      },
    ],
    // TODO: v2
    // teams: [
    //   {
    //     name: "Acme Inc",
    //     logo: GalleryVerticalEnd,
    //     plan: "Enterprise",
    //   },
    //   {
    //     name: "Acme Corp.",
    //     logo: AudioWaveform,
    //     plan: "Startup",
    //   },
    //   {
    //     name: "Evil Corp.",
    //     logo: Command,
    //     plan: "Free",
    //   },
    // ],

    // navMain: [
    //   {
    //     title: "Playground",
    //     url: "/",
    //     icon: Settings2,

    //     isActive: true,
    //     items: [
    //       {
    //         title: "History",
    //         url: "#",
    //       },
    //       {
    //         title: "Starred",
    //         url: "#",
    //       },
    //       {
    //         title: "Settings",
    //         url: "#",
    //       },
    //     ],
    //   },
    // ],
    user: {
      name: user?.fullName ?? "Guest User",
      email: user?.primaryEmailAddress?.emailAddress ?? "",
      avatar: user?.imageUrl ?? "",
      guest: user ? false : true,
    },
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <FanHandler />
        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        {/* Comming Soon */}
        {/* <NavMain items={data.navMain} /> */}
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
