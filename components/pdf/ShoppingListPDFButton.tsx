"use client"

import { PDFDownloadLink } from "@react-pdf/renderer"
import { Download } from "lucide-react"
import ShoppingListPDF from "./ShoppingListPDF"
import type { ShoppingCategory, ShoppingItem } from "@/lib/mealDatabase"

interface ShoppingListPDFButtonProps {
  list: Record<ShoppingCategory, ShoppingItem[]>
  period: "weekly" | "monthly"
  unitPref: "metric" | "imperial"
  userName: string
}

export default function ShoppingListPDFButton({
  list,
  period,
  unitPref,
  userName,
}: ShoppingListPDFButtonProps) {
  const doc = <ShoppingListPDF list={list} period={period} userName={userName} />

  return (
    <PDFDownloadLink
      document={doc}
      fileName={`shopping-list-${period}-${userName.toLowerCase().replace(/\s+/g, "-")}.pdf`}
    >
      {({ loading }) => (
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-green-600 text-green-700 dark:text-green-400 text-sm font-medium hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
          disabled={loading}
        >
          <Download className="w-4 h-4" />
          {loading ? "Preparing PDF…" : `Download ${period === "monthly" ? "Monthly" : "Weekly"} Shopping List PDF`}
        </button>
      )}
    </PDFDownloadLink>
  )
}
