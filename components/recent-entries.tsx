"use client"

import { useMemo } from "react"
import { useMilkData } from "@/components/milk-data-provider"
import { Card, CardContent } from "@/components/ui/card"
import { format, parseISO } from "date-fns"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import Link from "next/link"

export function RecentEntries() {
  const { entries, deleteEntry } = useMilkData()

  const recentEntries = useMemo(() => {
    return [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
  }, [entries])

  if (recentEntries.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">No entries yet. Add your first milk purchase!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {recentEntries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between border-b pb-3 last:border-0">
              <div>
                <p className="font-medium">{format(parseISO(entry.date), "MMM dd, yyyy")}</p>
                <p className="text-sm text-muted-foreground">
                  {entry.quantity} liters × ₹{entry.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-bold">₹{entry.total.toFixed(2)}</p>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => deleteEntry(entry.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <Link href="/history">
            <Button variant="outline">View All Entries</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
