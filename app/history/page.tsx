import { PageHeader } from "@/components/page-header"
import { MilkHistoryTable } from "@/components/milk-history-table"
import { MilkHistoryFilter } from "@/components/milk-history-filter"

export default function HistoryPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader title="Purchase History" description="View and manage your milk purchase history." />

      <MilkHistoryFilter />

      <MilkHistoryTable />
    </div>
  )
}
