import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SiteHeader } from "@/components/dashboard/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/providers/theme-provider"
import {
  BriefcaseBusinessIcon,
  Building2Icon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  UserRoundIcon,
  UsersIcon,
} from "lucide-react"

const hrMenuItems = [
  {
    title: "Dashboard",
    url: "/hr",
    icon: <LayoutDashboardIcon />,
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
]

export default function HRLayout({
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
        brandName="HR Portal"
        items={hrMenuItems}
        rootUrl="/hr"
        variant="inset"
      />
      <SidebarInset>
        <SiteHeader actions={<ThemeToggle />} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
