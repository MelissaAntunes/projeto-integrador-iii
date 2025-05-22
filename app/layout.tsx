import NavBar from "./NavBar"
import "./globals.css"
import { Theme } from "@radix-ui/themes"
import '@radix-ui/themes/styles.css'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Theme>
          <NavBar />
          <main className="p-5">{children}</main>
        </Theme>
      </body>
    </html>
  )
}