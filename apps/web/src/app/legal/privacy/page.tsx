// app/legal/privacy/page.tsx (if using App Router)
// or pages/legal/privacy.tsx (if using Pages Router)

import { Footer } from "@/modules/layouts/footer";
import { Navbar } from "@/modules/layouts/navbar";
import PageLayout from "../../../components/pagelayout_legal/pagelayout";

export default function PrivacyPolicy() {
  return (
    <div>
      <Navbar />
      <PageLayout title="Privacy Policy">
        <section className="space-y-8 text-sm leading-relaxed text-gray-700">
          <p>
            <strong>Last Updated:</strong> August 2025
          </p>

          <p>
            At BLOONSOO, your privacy is important to us. This Privacy Policy
            explains how we collect, use, disclose, and protect your personal
            information when you use our website and services.
          </p>

          <div>
            <h2 className="text-lg font-semibold text-black mb-2">
              1. Information We Collect
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Personal information (name, email, phone number)</li>
              <li>Account information (username, password)</li>
              <li>Payment details (only for billing purposes)</li>
              <li>Usage data (pages visited, interactions, IP address)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-black mb-2">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Provide and improve our services</li>
              <li>Process payments and transactions</li>
              <li>Communicate with you via email or messages</li>
              <li>Personalize your experience</li>
              <li>Send updates, promotions, or service alerts</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-black mb-2">
              3. Sharing of Information
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Trusted third-party service providers (e.g., payment gateways)
              </li>
              <li>Law enforcement or legal obligations</li>
              <li>
                Partners who support BLOONSOO’s operations under confidentiality
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-black mb-2">
              4. Cookies & Tracking
            </h2>
            <p>
              BLOONSOO uses cookies and similar technologies to improve user
              experience, remember preferences, and analyze website traffic. You
              can disable cookies in your browser settings.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-black mb-2">
              5. Data Security
            </h2>
            <p>
              We implement industry-standard security measures to protect your
              personal data. However, no online transmission is 100% secure, and
              we encourage you to take precautions.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-black mb-2">
              6. Your Rights
            </h2>
            <p>
              Depending on your region, you may have the right to access,
              correct, or delete your personal information. You can make such
              requests by contacting our support team.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-black mb-2">
              7. Children's Privacy
            </h2>
            <p>
              BLOONSOO does not knowingly collect personal data from children
              under the age of 13. If we learn that we have unintentionally
              collected data from a child, we will delete it promptly.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-black mb-2">
              8. Changes to This Policy
            </h2>
            <p>
              We may update this policy from time to time. When we do, we will
              revise the "Last Updated" date and notify users via email or
              website announcement.
            </p>
          </div>

          <p>
            For any questions about this Privacy Policy, please contact us via
            the{" "}
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
