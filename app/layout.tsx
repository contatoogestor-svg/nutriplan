import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { FlaskConical } from "lucide-react"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })

export const metadata: Metadata = {
  title: "NutriPlan — Personalized Meal Plans",
  description: "Science-based personalized meal plans, shopping lists, and weight-loss tracking powered by evidence-based nutrition formulas.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100" suppressHydrationWarning>
        <div className="flex flex-col flex-1">
          {children}
        </div>

        {/* Global Footer */}
        <footer className="border-t dark:border-gray-800 bg-white dark:bg-gray-900 py-4 px-4 mt-auto">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400 dark:text-gray-500">
            <p>
              © {new Date().getFullYear()} NutriPlan · Not a substitute for professional medical advice.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                Terms of Use
              </Link>
              <Link
                href="/science"
                className="flex items-center gap-1 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                Scientific Basis
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
