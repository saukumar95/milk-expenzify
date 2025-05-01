import { Suspense } from "react"
import { MilkEntryForm } from "@/components/milk-entry-form"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentEntries } from "@/components/recent-entries"
import { PageHeader } from "@/components/page-header"

export default function Dashboard() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <PageHeader title="Dashboard" description="Track your daily milk expenses and view summary statistics." />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<div className="h-[120px] rounded-lg bg-muted animate-pulse" />}>
          <DashboardStats />
        </Suspense>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Add Today's Entry</h2>
          <MilkEntryForm />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Entries</h2>
          <RecentEntries />
        </div>
      </div>
    </div>
  )
}
