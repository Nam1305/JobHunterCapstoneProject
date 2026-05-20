"use client"

import * as React from "react"

import { NavMain } from "@/components/hr/nav-main"
import { NavUser } from "@/components/hr/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  BriefcaseBusinessIcon,
  Building2Icon,
  CommandIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  SparklesIcon,
  UserRoundIcon,
  UsersIcon,
} from "lucide-react"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/hr",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Tìm ứng viên tiềm năng",
      url: "/hr/tim-ung-vien-tiem-nang",
      icon: <SparklesIcon />,
    },
    {
      title: "Quản lí ứng viên",
      url: "/hr/quan-li-ung-vien",
      icon: <UsersIcon />,
    },
    {
      title: "Đăng tin tuyển dụng",
      url: "/hr/dang-tin-tuyen-dung",
      icon: <BriefcaseBusinessIcon />,
    },
    {
      title: "Thông tin công ty",
      url: "/hr/thong-tin-cong-ty",
      icon: <Building2Icon />,
    },
    {
      title: "Chat",
      url: "/hr/chat",
      icon: <MessageSquareIcon />,
    },
    {
      title: "Tài khoản của tôi",
      url: "/hr/tai-khoan-cua-toi",
      icon: <UserRoundIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
