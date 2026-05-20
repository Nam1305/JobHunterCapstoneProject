import Link from "next/link"
import { BriefcaseBusiness, FileText, Home, UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/", label: "Trang chủ", icon: Home },
  { href: "/viec-lam", label: "Việc làm", icon: BriefcaseBusiness },
  { href: "/ho-so", label: "Hồ sơ", icon: FileText },
]

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              JH
            </span>
            <span>JobHunter</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Button key={item.href} variant="ghost" asChild>
                <Link href={item.href}>
                  <item.icon />
                  {item.label}
                </Link>
              </Button>
            ))}
          </div>

          <Button asChild>
            <Link href="/dang-nhap">
              <UserRound />
              Đăng nhập
            </Link>
          </Button>
        </nav>
      </header>

      <main>{children}</main>
    </div>
  )
}
