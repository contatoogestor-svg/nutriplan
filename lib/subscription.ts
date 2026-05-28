/** Subscription helpers — safe to import in client components */
export function isProUser(status: string | null | undefined): boolean {
  return status === "active" || status === "trialing"
}
