import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/providers/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils";
import { StoreProvider } from "@/providers/store-provider";
import { QueryProvider } from "@/providers/query-provider";
import { LoginModal } from "@/components/auth/login-modal";
import { RegisterModal } from "@/components/auth/register-modal";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="vi"
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body>
        <StoreProvider>
          <QueryProvider>
            <ThemeProvider>
              <TooltipProvider>
                {children}
                <LoginModal />
                <RegisterModal />
              </TooltipProvider>
            </ThemeProvider>
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
