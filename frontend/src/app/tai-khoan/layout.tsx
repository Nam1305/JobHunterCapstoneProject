import {
  BriefcaseBusinessIcon,
  FileTextIcon,
  UserRoundIcon,
} from "lucide-react"

import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SiteHeader } from "@/components/dashboard/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/providers/theme-provider"

const accountMenuItems = [
  {
    title: "Quản lý CV",
    url: "/tai-khoan/quan-ly-cv",
    icon: <FileTextIcon />,
  },
  {
    title: "Quản lý công việc",
    url: "/tai-khoan/quan-ly-cong-viec",
    icon: <BriefcaseBusinessIcon />,
  },
  {
    title: "Trang của tôi",
    url: "/tai-khoan/trang-cua-toi",
    icon: <UserRoundIcon />,
  },
]

export default function AccountLayout({
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
        brandName="Tài khoản"
        items={accountMenuItems}
        rootUrl="/tai-khoan"
        variant="inset"
      />
      <SidebarInset>
        <SiteHeader actions={<ThemeToggle />} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
