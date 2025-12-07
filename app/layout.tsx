import type React from "react"
import type { Metadata } from "next"
import { Rajdhani } from "next/font/google"
import "./globals.css"

const _rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
})

export const metadata: Metadata = {
  title: "Aigarth DataLabel",
  description: "Train AI. Earn Qubic. Shape the Future.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark cursor-none" suppressHydrationWarning>
      <body className={`${_rajdhani.className} antialiased cursor-none`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}

