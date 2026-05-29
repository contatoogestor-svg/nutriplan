"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { LogOut, User, ChevronDown } from "lucide-react"
import Link from "next/link"

interface UserMenuProps {
  email: string
  planId?: string
}

export default function UserMenu({ email, planId }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const initial = email[0].toUpperCase()

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-full focus:outline-none"
        aria-label="User menu"
      >
        <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-sm select-none">
          {initial}
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
            {/* Email header */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-400 dark:text-gray-500">Signed in as</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate mt-0.5">{email}</p>
            </div>

            {/* Links */}
            {planId && (
              <Link
                href={`/plan/${planId}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <User className="w-4 h-4 text-gray-400" />
                My Plan
              </Link>
            )}

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left border-t border-gray-100 dark:border-gray-700"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  )
}
