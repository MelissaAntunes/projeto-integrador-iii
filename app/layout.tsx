import NavBar from "./NavBar"
import "./globals.css"
import { Theme, ThemePanel } from "@radix-ui/themes"
import { Inter } from "next/font/google"
import '@radix-ui/themes/styles.css'
import './theme-config.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter", 
})
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Theme accentColor="jade">
          <NavBar />
          <main className="p-5">{children}</main>
          <ThemePanel />
        </Theme>
      </body>
    </html>
  )
}