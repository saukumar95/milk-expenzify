"use client"

import { useMemo } from "react"
import { useMilkData } from "@/components/milk-data-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, format } from "date-fns"

export function DashboardStats() {
  const { entries, milkPrice, getEntriesByDateRange } = useMilkData()

  const today = new Date()
  const startOfCurrentMonth = startOfMonth(today)
  const endOfCurrentMonth = endOfMonth(today)
  const startOfCurrentWeek = startOfWeek(today)
  const endOfCurrentWeek = endOfWeek(today)

  const monthlyEntries = useMemo(
    () => getEntriesByDateRange(startOfCurrentMonth, endOfCurrentMonth),
    [getEntriesByDateRange, startOfCurrentMonth, endOfCurrentMonth],
  )

  const weeklyEntries = useMemo(
    () => getEntriesByDateRange(startOfCurrentWeek, endOfCurrentWeek),
    [getEntriesByDateRange, startOfCurrentWeek, endOfCurrentWeek],
  )

  const totalMonthlyQuantity = useMemo(
    () => monthlyEntries.reduce((sum, entry) => sum + entry.quantity, 0),
    [monthlyEntries],
  )

  const totalMonthlyExpense = useMemo(
    () => monthlyEntries.reduce((sum, entry) => sum + entry.total, 0),
    [monthlyEntries],
  )

  const totalWeeklyQuantity = useMemo(
    () => weeklyEntries.reduce((sum, entry) => sum + entry.quantity, 0),
    [weeklyEntries],
  )

  const totalWeeklyExpense = useMemo(() => weeklyEntries.reduce((sum, entry) => sum + entry.total, 0), [weeklyEntries])

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Price</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{milkPrice.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Per liter</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{totalMonthlyExpense.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {format(startOfCurrentMonth, "MMM yyyy")} • {totalMonthlyQuantity.toFixed(1)} liters
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{totalWeeklyExpense.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">This week • {totalWeeklyQuantity.toFixed(1)} liters</p>
        </CardContent>
      </Card>
    </>
  )
}
