import Link from "next/link"
import { BriefcaseBusiness, FileText, Home } from "lucide-react"

import { Button } from "@/components/ui/button"
import { LoginModalButton } from "@/components/auth/login-modal-button"
import { UserContainer } from "@/components/user/user-container"
import { ThemeToggle } from "@/providers/theme-provider"
import { AuthModalRoot } from "@/components/auth/auth-modal-root"
import { ApplicationModalRoot } from "@/components/application/application-modal-root"

const navItems = [
  { href: "/", label: "Trang chủ", icon: Home },
  { href: "/cong-viec", label: "Việc làm", icon: BriefcaseBusiness },
  { href: "/cong-ty", label: "Công ty", icon: FileText },
]

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col min-h-svh bg-background text-foreground">
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

      <main className="flex-1">
        {children}
        <AuthModalRoot />
        <ApplicationModalRoot />
      </main>

      <footer className="border-t bg-muted/30">
        <UserContainer className="flex flex-col gap-3 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© 2026 JobHunter. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
            <Link href="#">Contact</Link>
          </div>
        </UserContainer>
      </footer>
    </div>
  )
}
