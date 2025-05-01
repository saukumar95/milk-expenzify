"use client"

import { useState } from "react"
import { useMilkData } from "@/components/milk-data-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export function VendorSettings() {
  const { vendorName, vendorContact, vendorAddress, setVendorInfo } = useMilkData()
  const { toast } = useToast()
  const [name, setName] = useState(vendorName)
  const [contact, setContact] = useState(vendorContact)
  const [address, setAddress] = useState(vendorAddress)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Invalid name",
        description: "Please enter a valid vendor name",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await setVendorInfo({
        name,
        contact,
        address,
      })
      toast({
        title: "Vendor updated",
        description: "Vendor information has been updated successfully",
      })
    } catch (error) {
      console.error("Error saving vendor info:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vendor-name">Vendor Name</Label>
            <Input id="vendor-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor-contact">Contact Number (Optional)</Label>
            <Input id="vendor-contact" value={contact} onChange={(e) => setContact(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor-address">Address (Optional)</Label>
            <Textarea id="vendor-address" value={address} onChange={(e) => setAddress(e.target.value)} rows={3} />
          </div>

          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Vendor Info"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
