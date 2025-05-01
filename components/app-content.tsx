"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useMilkData } from "@/components/milk-data-provider"
import { Navbar } from "@/components/navbar"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Toaster } from "@/components/ui/toaster"

export function AppContent({ children }: { children: React.ReactNode }) {
  const { isLoading, user } = useMilkData()
  const pathname = usePathname()
  const isAuthPage = pathname.startsWith('/auth')

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && user && <Navbar />}
      <main className="flex-1 relative">
        {isLoading && !isAuthPage && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-50">
            <LoadingSpinner />
          </div>
        )}
        <div className="container mx-auto px-4">
          <div className={cn("max-w-4xl mx-auto", isLoading && !isAuthPage && "opacity-50 pointer-events-none")}>
            {children}
          </div>
        </div>
      </main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Milk Expenzify. All rights reserved.
      </footer>
      <Toaster />
    </div>
  )
}
