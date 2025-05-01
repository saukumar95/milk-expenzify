"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Milk, History, BarChart3, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMilkData } from "@/components/milk-data-provider"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const pathname = usePathname()
  const { signOut, user, isLoading } = useMilkData()

  const navItems = [
    { href: "/", label: "Dashboard", icon: Milk },
    { href: "/history", label: "History", icon: History },
    { href: "/reports", label: "Reports", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Milk className="h-6 w-6" />
          <span className="text-xl font-bold">Milk Expenzify</span>
        </div>

        <nav className="flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            )
          })}

          {user && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => signOut()}
              className="gap-2"
              disabled={isLoading}
            >
              <LogOut className={cn("h-4 w-4", isLoading && "animate-spin")} />
              <span className="hidden md:inline">
                {isLoading ? "Signing out..." : "Sign Out"}
              </span>
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
