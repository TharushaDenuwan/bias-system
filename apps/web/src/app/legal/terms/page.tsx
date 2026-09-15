// app/legal/terms/page.tsx (App Router)
// or pages/legal/terms.tsx (Pages Router)

import { Footer } from "@/modules/layouts/footer";
import { Navbar } from "@/modules/layouts/navbar";
import PageLayout from "../../../components/pagelayout_legal/pagelayout";

export default function TermsOfUse() {
  return (
    <div>
      <Navbar />
      <PageLayout title="Terms of Use">
        <section className="space-y-8 text-sm leading-relaxed text-gray-700">
          <p>
            <strong>Last Updated:</strong> August 2025
          </p>

          <p>
            These Terms of Use ("Terms") govern your access to and use of
            BLOONSOO’s website, applications, and services. By accessing or
            using our services, you agree to comply with these Terms.
          </p>

          <div>
            <h2 className="text-lg font-semibold text-black mb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              By using BLOONSOO, you acknowledge that you have read, understood,
              and agree to be bound by these Terms and our Privacy Policy.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-black mb-2">
              2. Eligibility
            </h2>
            <p>
              You must be at least 13 years old (or the age of majority in your
              jurisdiction) to use our services. If you are under this age, you
              may only use BLOONSOO with the consent of a parent or guardian.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-black mb-2">
              3. User Responsibilities
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Provide accurate and up-to-date information during registration
              </li>
              <li>Maintain the security of your account credentials</li>
              <li>Not engage in unlawful, harmful, or abusive activities</li>
              <li>
                Respect intellectual property rights of BLOONSOO and others
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-black mb-2">
              4. Prohibited Activities
            </h2>
            <p>
              You agree not to misuse our services, including attempting to gain
              unauthorized access, distributing malware, or engaging in
              fraudulent transactions.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-black mb-2">
              5. Intellectual Property
            </h2>
            <p>
              All content, trademarks, and data on BLOONSOO are owned by or
              licensed to BLOONSOO. You may not use, copy, or distribute them
              without prior written permission.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-black mb-2">
              6. Limitation of Liability
            </h2>
            <p>
              BLOONSOO will not be held liable for any damages arising from your
              use of our services, except where required by applicable law.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-black mb-2">
              7. Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate your access if you
              violate these Terms or engage in harmful behavior.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-black mb-2">
              8. Changes to Terms
            </h2>
            <p>
              We may update these Terms from time to time. Changes will be
              posted on our website with the updated “Last Updated” date.
            </p>
          </div>

          <p>
            For any questions regarding these Terms, please contact us via the{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Help Center
            </a>
            .
          </p>
        </section>
      </PageLayout>
      <Footer />
    </div>
  );
}
