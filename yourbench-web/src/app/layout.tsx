import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "YourBench",
  description: "Dynamic Benchmark Generation Framework",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <div className="flex-1 flex">
            <Sidebar className="hidden md:block" />
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
        </div>
        <Toaster richColors closeButton position="top-right" />
      </body>
    </html>
  )
}
