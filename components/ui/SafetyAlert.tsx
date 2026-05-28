import { AlertTriangle, XCircle, Info } from "lucide-react"

interface SafetyAlertProps {
  type: "warning" | "error" | "info"
  message: string
  className?: string
}

export default function SafetyAlert({ type, message, className = "" }: SafetyAlertProps) {
  const styles = {
    warning: "bg-amber-50 dark:bg-amber-900/20 border-amber-400 text-amber-800 dark:text-amber-300",
    error: "bg-red-50 dark:bg-red-900/20 border-red-400 text-red-800 dark:text-red-300",
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-400 text-blue-800 dark:text-blue-300",
  }
  const icons = {
    warning: AlertTriangle,
    error: XCircle,
    info: Info,
  }
  const Icon = icons[type]

  return (
    <div className={`flex items-start gap-3 border-l-4 rounded-r-lg p-4 ${styles[type]} ${className}`}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p className="text-sm leading-relaxed">{message}</p>
    </div>
  )
}
