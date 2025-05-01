"use client"

import type React from "react"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useMilkData } from "@/components/milk-data-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function MilkEntryForm() {
  const { toast } = useToast()
  const { addEntry, milkPrice } = useMilkData()
  const [date, setDate] = useState<Date>(new Date())
  const [quantity, setQuantity] = useState<string>("1")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const quantityNum = Number.parseFloat(quantity)
    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast({
        title: "Invalid quantity",
        description: "Please enter a valid quantity greater than 0",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await addEntry({
        date: date.toISOString(),
        quantity: quantityNum,
        price: milkPrice,
        total: quantityNum * milkPrice,
      })

      toast({
        title: "Entry added",
        description: `Added ${quantityNum} liters for ${format(date, "PPP")}`,
      })

      // Reset form
      setDate(new Date())
      setQuantity("1")
    } catch (error) {
      console.error("Error adding entry:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity (liters)</Label>
            <Input
              id="quantity"
              type="number"
              step="0.1"
              min="0.1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Price per liter</Label>
            <div className="text-lg font-medium">₹{milkPrice.toFixed(2)}</div>
          </div>

          <div className="space-y-2">
            <Label>Total Amount</Label>
            <div className="text-lg font-bold">₹{(Number.parseFloat(quantity) * milkPrice).toFixed(2)}</div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Entry"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
