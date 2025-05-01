"use client"

import { useState, useMemo } from "react"
import { useMilkData } from "@/components/milk-data-provider"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format, parseISO } from "date-fns"
import { Pencil, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function MilkHistoryTable() {
  const { entries, updateEntry, deleteEntry } = useMilkData()
  const [editingEntry, setEditingEntry] = useState<string | null>(null)
  const [editQuantity, setEditQuantity] = useState<string>("")

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [entries])

  const handleEdit = (entry: any) => {
    setEditingEntry(entry.id)
    setEditQuantity(entry.quantity.toString())
  }

  const handleSaveEdit = () => {
    if (!editingEntry) return

    const quantity = Number.parseFloat(editQuantity)
    if (isNaN(quantity) || quantity <= 0) return

    const entry = entries.find((e) => e.id === editingEntry)
    if (!entry) return

    updateEntry(editingEntry, {
      quantity,
      total: quantity * entry.price,
    })

    setEditingEntry(null)
  }

  const handleCancelEdit = () => {
    setEditingEntry(null)
  }

  if (sortedEntries.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">No entries found. Add your first milk purchase!</p>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Quantity (liters)</TableHead>
                <TableHead>Price per liter</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{format(parseISO(entry.date), "MMM dd, yyyy")}</TableCell>
                  <TableCell>{entry.quantity.toFixed(1)}</TableCell>
                  <TableCell>₹{entry.price.toFixed(2)}</TableCell>
                  <TableCell className="font-medium">₹{entry.total.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(entry)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => deleteEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={editingEntry !== null} onOpenChange={(open) => !open && handleCancelEdit()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Milk Entry</DialogTitle>
            <DialogDescription>Update the quantity of milk for this entry.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (liters)</Label>
              <Input
                id="quantity"
                type="number"
                step="0.1"
                min="0.1"
                value={editQuantity}
                onChange={(e) => setEditQuantity(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
