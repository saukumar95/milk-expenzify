"use client"

import { useState } from "react"
import { useMilkData } from "@/components/milk-data-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function PriceSettings() {
  const { milkPrice, setMilkPrice } = useMilkData()
  const { toast } = useToast()
  const [price, setPrice] = useState(milkPrice.toString())
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSave = async () => {
    const newPrice = Number.parseFloat(price)
    if (isNaN(newPrice) || newPrice <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price greater than 0",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await setMilkPrice(newPrice)
      toast({
        title: "Price updated",
        description: `Milk price has been updated to ₹${newPrice.toFixed(2)}`,
      })
    } catch (error) {
      console.error("Error saving price:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="milk-price">Milk Price (₹ per liter)</Label>
            <Input
              id="milk-price"
              type="number"
              step="0.01"
              min="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Price"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
