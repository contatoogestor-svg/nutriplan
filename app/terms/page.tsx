import Link from "next/link"
import { Salad } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Use — NutriPlan",
  description: "Terms and conditions for using NutriPlan's meal planning service.",
}

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Terms of Use</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: May 30, 2026</p>

        <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using NutriPlan ("<strong>the Service</strong>") at <strong>nutriplan.sbs</strong>,
              you agree to be bound by these Terms of Use. If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. Description of Service</h2>
            <p>
              NutriPlan provides personalized meal plans, nutritional calculations, shopping lists, and
              weight-loss progress tracking based on scientifically validated formulas (Mifflin-St Jeor,
              Wishnofsky Rule, WHO BMI classification). The Service is informational in nature and does not
              constitute medical advice, diagnosis, or treatment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. Medical Disclaimer</h2>
            <p>
              <strong>NutriPlan is not a substitute for professional medical advice.</strong> Always consult
              a qualified healthcare provider before making significant changes to your diet, especially if
              you have any medical conditions, are pregnant, or are taking medications. Results may vary.
              Weight loss outcomes depend on many individual factors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4. Eligibility</h2>
            <p>
              You must be at least 16 years old to use NutriPlan. By using the Service, you confirm
              that you meet this requirement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5. Free Plan</h2>
            <p>
              NutriPlan offers a free tier that includes one personalized meal plan, a 6-meal daily structure,
              full dashboard access, progress timeline, and exercise recommendations. Free features may be
              modified or limited at our discretion with reasonable notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">6. Pro Subscription</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Pro is available as a monthly ($9.99/month) or annual ($59/year) subscription.</li>
              <li>A 7-day free trial is offered. You will not be charged until the trial ends.</li>
              <li>Subscriptions renew automatically. You may cancel at any time from your account settings.</li>
              <li>Payments are processed securely by Stripe. We do not store payment details.</li>
              <li>All prices are in USD.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">7. Refund Policy</h2>
            <p>
              Due to the digital nature of the Service, all sales are final. However, if you experience a
              technical issue that prevents you from accessing the Service, contact us at{" "}
              <a href="mailto:hello@nutriplan.sbs" className="text-green-600 dark:text-green-400 hover:underline">
                hello@nutriplan.sbs
              </a>{" "}
              within 7 days of your charge and we will review your case individually.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">8. User Responsibilities</h2>
            <p>You agree to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Provide accurate information when creating your profile.</li>
              <li>Keep your account credentials secure and not share your account.</li>
              <li>Not use the Service for any unlawful purpose.</li>
              <li>Not attempt to reverse-engineer, copy, or redistribute any part of the Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">9. Intellectual Property</h2>
            <p>
              All content, design, code, and branding associated with NutriPlan are our exclusive property.
              Your meal plan data belongs to you. We do not claim ownership over your personal health data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, NutriPlan is provided "as is" without warranties of
              any kind. We are not liable for any indirect, incidental, or consequential damages arising
              from your use of the Service, including but not limited to health outcomes, weight changes,
              or data loss.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">11. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account if you violate these Terms.
              You may delete your account at any time by contacting us at{" "}
              <a href="mailto:hello@nutriplan.sbs" className="text-green-600 dark:text-green-400 hover:underline">
                hello@nutriplan.sbs
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">12. Changes to Terms</h2>
            <p>
              We may update these Terms at any time. We will notify users of material changes via email
              or a notice on the website. Continued use of the Service after changes constitutes acceptance
              of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">13. Governing Law</h2>
            <p>
              These Terms are governed by applicable law. Any disputes shall be resolved through good-faith
              negotiation. For questions, contact us at{" "}
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
