import { SiteHeader } from "@/components/dashboard/site-header"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  Building2Icon,
  LayoutDashboardIcon,
  UserRoundIcon,
  UsersIcon,
} from "lucide-react"

const adminMenuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: <LayoutDashboardIcon />,
  },
  {
    title: "Quản lí tài khoản",
    url: "/admin/quan-li-tai-khoan",
    icon: <UsersIcon />,
  },
  {
    title: "Quản lí công ty",
    url: "/admin/quan-li-cong-ty",
    icon: <Building2Icon />,
  },
  {
    title: "Tài khoản của tôi",
    url: "/admin/tai-khoan-cua-toi",
    icon: <UserRoundIcon />,
  },
]

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        brandName="Admin Portal"
        items={adminMenuItems}
        rootUrl="/admin"
        variant="inset"
      />
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
