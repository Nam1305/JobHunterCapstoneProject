import Link from "next/link"
import { BriefcaseBusiness, FileText, Home } from "lucide-react"

import { Button } from "@/components/ui/button"
import { LoginModalButton } from "@/components/auth/login-modal-button"
import { UserContainer } from "@/components/user/user-container"
import { ThemeToggle } from "@/providers/theme-provider"

const navItems = [
  { href: "/", label: "Trang chủ", icon: Home },
  { href: "/cong-viec", label: "Việc làm", icon: BriefcaseBusiness },
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
        <UserContainer
          as="nav"
          className="flex h-16 items-center justify-between"
        >
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

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LoginModalButton />
          </div>
        </UserContainer>
      </header>

      <main>{children}</main>
    </div>
  )
}
