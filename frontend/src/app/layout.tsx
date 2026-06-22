import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import "yet-another-react-lightbox/styles.css"
import "yet-another-react-lightbox/plugins/counter.css"
import "yet-another-react-lightbox/plugins/thumbnails.css"
import { ThemeProvider } from "@/providers/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils";
import { StoreProvider } from "@/providers/store-provider";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { GoogleOAuthProvider } from '@react-oauth/google'

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
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
              <ThemeProvider>
                <TooltipProvider>
                  {children}
                  <Toaster position="bottom-right" richColors />
                </TooltipProvider>
              </ThemeProvider>
            </GoogleOAuthProvider>
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  )
}


