import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const LAST_UPDATED = 'March 21, 2025';
const SITE_NAME = 'ToolsNoCode';
const CONTACT_EMAIL = 'privacy@toolsnocode.com';
const SITE_URL = 'toolsnocode.com';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-surface-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-brand-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-brand-500/15 rounded-xl flex items-center justify-center border border-brand-500/20">
            <Shield className="w-5 h-5 text-brand-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
        </div>
        <p className="text-sm text-surface-500 mb-10">Last updated: {LAST_UPDATED}</p>

        <div>

          <Section title="1. Data Controller">
            <p>
              The data controller for your personal data is <strong>{SITE_NAME}</strong>, accessible at{' '}
              <strong>{SITE_URL}</strong>. For any privacy-related queries, you can reach us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </Section>

          <Section title="2. Data We Collect">
            <p>We collect the following types of personal data:</p>
            <ul>
              <li><strong>Account data:</strong> email address and password (stored in encrypted form) when you create an account.</li>
              <li><strong>Usage data:</strong> information about how you interact with the platform, such as the tools you visit, the favorites you save, and the content you publish.</li>
              <li><strong>Technical data:</strong> IP address, browser type, operating system, pages visited, and session duration, collected automatically via cookies and similar technologies.</li>
            </ul>
            <p>We do not collect special category data (health, racial origin, religious beliefs, etc.).</p>
          </Section>

          <Section title="3. Purposes and Legal Basis for Processing">
            <table>
              <thead>
                <tr>
                  <th>Purpose</th>
                  <th>Legal basis</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Account management and platform access</td>
                  <td>Contract performance (Art. 6.1.b GDPR)</td>
                </tr>
                <tr>
                  <td>Saving favorites and user-generated content</td>
                  <td>Contract performance (Art. 6.1.b GDPR)</td>
                </tr>
                <tr>
                  <td>Service improvement and anonymous analytics</td>
                  <td>Legitimate interest (Art. 6.1.f GDPR)</td>
                </tr>
                <tr>
                  <td>Service communications (updates, incidents)</td>
                  <td>Contract performance (Art. 6.1.b GDPR)</td>
                </tr>
                <tr>
                  <td>Compliance with legal obligations</td>
                  <td>Legal obligation (Art. 6.1.c GDPR)</td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Section title="4. Data Retention">
            <p>
              We retain your data for as long as your account is active or as necessary to provide the service. If you delete your account, we will erase your personal data within a maximum of <strong>30 days</strong>, unless there is a legal obligation to retain it for a longer period.
            </p>
          </Section>

          <Section title="5. Recipients and International Transfers">
            <p>Your data may be shared with the following service providers acting as data processors:</p>
            <ul>
              <li><strong>Supabase Inc.</strong> — database infrastructure and authentication (USA, with adequate safeguards via Standard Contractual Clauses).</li>
              <li><strong>Vercel Inc.</strong> / hosting provider — web application hosting and delivery.</li>
            </ul>
            <p>We do not sell or share your data with third parties for commercial purposes.</p>
          </Section>

          <Section title="6. Your Rights">
            <p>Under the GDPR, you have the right to:</p>
            <ul>
              <li><strong>Access:</strong> obtain confirmation of whether we process your data and access it.</li>
              <li><strong>Rectification:</strong> request correction of inaccurate or incomplete data.</li>
              <li><strong>Erasure:</strong> request deletion of your data ("right to be forgotten").</li>
              <li><strong>Objection:</strong> object to processing based on legitimate interest.</li>
              <li><strong>Restriction:</strong> request restriction of processing in certain circumstances.</li>
              <li><strong>Portability:</strong> receive your data in a structured, machine-readable format.</li>
              <li><strong>Withdraw consent</strong> at any time when processing is based on consent.</li>
            </ul>
            <p>
              To exercise any of these rights, send an email to{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              You also have the right to lodge a complaint with your local supervisory authority. In the EU, you can find your authority at{' '}
              <a href="https://edpb.europa.eu/about-edpb/about-edpb/members_en" target="_blank" rel="noopener noreferrer">edpb.europa.eu</a>.
            </p>
          </Section>

          <Section title="7. Security">
            <p>
              We apply appropriate technical and organizational measures to protect your data against unauthorized access, loss, or destruction — including encryption in transit (TLS) and at rest, access controls, and periodic security audits.
            </p>
          </Section>

          <Section title="8. Minors">
            <p>
              This service is not directed at individuals under the age of 16. If you believe a minor has provided us with personal data, please contact us so we can delete it.
            </p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>
              We may update this Privacy Policy periodically. We will notify you of significant changes via a notice on the platform or by email. The updated version takes effect on the date of publication shown at the top of this document.
            </p>
          </Section>

        </div>

        <div className="mt-12 pt-8 border-t border-surface-800/50 flex flex-wrap gap-4 text-sm text-surface-500">
          <Link to="/legal/terms" className="hover:text-brand-400 transition-colors">Terms of Service</Link>
          <Link to="/legal/cookies" className="hover:text-brand-400 transition-colors">Cookie Policy</Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-surface-800/60">{title}</h2>
      <div className="space-y-3 text-surface-300 text-sm leading-relaxed [&_strong]:text-surface-200 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:text-brand-400 [&_a:hover]:text-brand-300 [&_table]:w-full [&_table]:border-collapse [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold [&_th]:text-surface-400 [&_th]:uppercase [&_th]:tracking-wider [&_th]:pb-2 [&_td]:py-2 [&_td]:pr-4 [&_td]:border-t [&_td]:border-surface-800/50 [&_td]:text-sm">
        {children}
      </div>
    </section>
  );
}
