"use client"

import { useMemo } from "react"
import { useMilkData } from "@/components/milk-data-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"

export function ReportViewer() {
  const { entries } = useMilkData()

  const reportData = useMemo(() => {
    if (entries.length === 0) return null

    const totalQuantity = entries.reduce((sum, entry) => sum + entry.quantity, 0)
    const totalAmount = entries.reduce((sum, entry) => sum + entry.total, 0)
    const averagePrice = totalAmount / totalQuantity

    return {
      totalEntries: entries.length,
      totalQuantity,
      totalAmount,
      averagePrice,
    }
  }, [entries])

  if (!reportData) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">No report data available. Generate a report first.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Milk Expense Report</h3>
            <p className="text-sm text-muted-foreground">Summary of milk expenses</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Entries</p>
                <p className="text-lg font-medium">{reportData.totalEntries}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Quantity</p>
                <p className="text-lg font-medium">{reportData.totalQuantity.toFixed(1)} liters</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Average Price</p>
                <p className="text-lg font-medium">₹{reportData.averagePrice.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-lg font-bold">₹{reportData.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="w-full" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" className="w-full" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
