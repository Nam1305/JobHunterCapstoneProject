import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/providers/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils";
import { StoreProvider } from "@/providers/store-provider";
import { QueryProvider } from "@/providers/query-provider";
import { AuthModalRoot } from "@/components/auth/auth-modal-root";
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
                  <AuthModalRoot />
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
