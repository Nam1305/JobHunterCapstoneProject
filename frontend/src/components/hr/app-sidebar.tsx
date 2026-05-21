"use client"

import * as React from "react"

import { NavMain } from "@/components/hr/nav-main"
import { NavUser } from "@/components/auth/nav-user"
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
  CommandIcon,
} from "lucide-react"

type SidebarUser = {
  name: string
  email: string
  avatar: string
}

type SidebarItem = {
  title: string
  url: string
  icon?: React.ReactNode
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  brandName: string
  items: SidebarItem[]
  rootUrl: string
  user: SidebarUser
}

export function AppSidebar({
  brandName,
  items,
  rootUrl,
  user,
  ...props
}: AppSidebarProps) {
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
                <span className="text-base font-semibold">{brandName}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} rootUrl={rootUrl} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
