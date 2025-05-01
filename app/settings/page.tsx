import { PageHeader } from "@/components/page-header"
import { PriceSettings } from "@/components/price-settings"
import { VendorSettings } from "@/components/vendor-settings"

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <PageHeader title="Settings" description="Configure your milk expense tracking preferences." />

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Milk Price Settings</h2>
          <PriceSettings />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Vendor Information</h2>
          <VendorSettings />
        </div>
      </div>
    </div>
  )
}
