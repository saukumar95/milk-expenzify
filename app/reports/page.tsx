import { PageHeader } from "@/components/page-header"
import { ReportGenerator } from "@/components/report-generator"
import { ReportViewer } from "@/components/report-viewer"

export default function ReportsPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <PageHeader title="Expense Reports" description="Generate detailed reports of your milk expenses." />

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Generate Report</h2>
          <ReportGenerator />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Report Preview</h2>
          <ReportViewer />
        </div>
      </div>
    </div>
  )
}
