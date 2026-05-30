import Link from "next/link"
import { Salad } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy — NutriPlan",
  description: "How NutriPlan collects, uses, and protects your personal data.",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <header className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold text-xl w-fit">
            <Salad className="w-6 h-6" />
            NutriPlan
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: May 30, 2026</p>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Who We Are</h2>
            <p>
              NutriPlan ("<strong>we</strong>", "<strong>our</strong>", or "<strong>us</strong>") operates the website{" "}
              <strong>nutriplan.sbs</strong> and provides personalized meal planning services. This Privacy Policy
              explains how we collect, use, and protect your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong>Account data:</strong> email address and password when you create an account.</li>
              <li><strong>Health & body data:</strong> name, date of birth, biological sex, height, current weight, target weight, goal timeline, and physical activity information — used solely to generate your personalized meal plan.</li>
              <li><strong>Payment data:</strong> processed securely by Stripe. We never store your credit card details.</li>
              <li><strong>Usage data:</strong> pages visited, features used, and actions taken within the app (collected anonymously for product improvement).</li>
              <li><strong>Progress data:</strong> weekly weight check-ins you voluntarily log.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To generate and display your personalized meal plan, shopping list, and progress timeline.</li>
              <li>To send transactional emails (account confirmation, password reset).</li>
              <li>To manage your subscription and process payments via Stripe.</li>
              <li>To improve our product and fix bugs.</li>
              <li>To comply with legal obligations.</li>
            </ul>
            <p className="mt-3">We do <strong>not</strong> sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4. Third-Party Services</h2>
            <p>We use the following trusted third parties to operate our service:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong>Supabase</strong> — database and authentication hosting.</li>
              <li><strong>Stripe</strong> — payment processing and subscription management.</li>
              <li><strong>Resend</strong> — transactional email delivery.</li>
              <li><strong>Vercel</strong> — website hosting and infrastructure.</li>
            </ul>
            <p className="mt-3">Each provider has their own privacy policy and processes data in accordance with their terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5. Data Retention</h2>
            <p>
              We retain your personal data for as long as your account is active. If you request account deletion,
              we will delete your data within 30 days, except where retention is required by law (e.g., billing records).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your account and data.</li>
              <li>Export your data in a portable format.</li>
              <li>Withdraw consent at any time.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:hello@nutriplan.sbs" className="text-green-600 dark:text-green-400 hover:underline">
                hello@nutriplan.sbs
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">7. Cookies</h2>
            <p>
              NutriPlan uses only essential cookies required for authentication and session management.
              We do not use advertising or tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">8. Security</h2>
            <p>
              We use industry-standard security practices including encrypted connections (HTTPS), hashed passwords,
              and row-level security on our database. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">9. Children</h2>
            <p>
              NutriPlan is not intended for users under 16 years of age. We do not knowingly collect data from minors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. We will notify you of significant changes via email or
              a notice on the website. Continued use of the service after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">11. Contact</h2>
            <p>
              For any privacy-related questions, contact us at{" "}
              <a href="mailto:hello@nutriplan.sbs" className="text-green-600 dark:text-green-400 hover:underline">
                hello@nutriplan.sbs
              </a>.
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
          <Link href="/" className="text-sm text-green-600 dark:text-green-400 hover:underline">
            ← Back to NutriPlan
          </Link>
        </div>
      </div>
    </main>
  )
}
