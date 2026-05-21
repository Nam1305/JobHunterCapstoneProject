import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/providers/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils";
import { StoreProvider } from "@/providers/store-provider";
import { QueryProvider } from "@/providers/query-provider";

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
    >
      <body>
        <StoreProvider>
          <QueryProvider>
            <ThemeProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </ThemeProvider>
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
