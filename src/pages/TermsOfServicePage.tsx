import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

const LAST_UPDATED = 'March 21, 2025';
const SITE_NAME = 'ToolsNoCode';
const CONTACT_EMAIL = 'legal@toolsnocode.com';
const SITE_URL = 'toolsnocode.com';

export default function TermsOfServicePage() {
  useSEO({
    title: 'Terms of Service',
    description: 'Read the ToolsNoCode terms of service. Understand the rules and conditions for using our platform.',
    url: '/legal/terms',
  });

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
            <FileText className="w-5 h-5 text-brand-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
        </div>
        <p className="text-sm text-surface-500 mb-10">Last updated: {LAST_UPDATED}</p>

        <div>

          <Section title="1. Acceptance of Terms">
            <p>
              By accessing or using <strong>{SITE_NAME}</strong> ({SITE_URL}), you agree to be bound by these Terms of Service and our{' '}
              <Link to="/legal/privacy" className="text-brand-400 hover:text-brand-300">Privacy Policy</Link>.
              If you do not agree with any part of these terms, you may not use the service.
            </p>
          </Section>

          <Section title="2. Description of Service">
            <p>
              {SITE_NAME} is a discovery platform that allows users to find, explore, and share AI and no-code tools, tutorials, projects, and experts in the field. The service is provided free of charge, with additional features available for registered users.
            </p>
          </Section>

          <Section title="3. Account Registration">
            <p>Some features (saving favorites, publishing content) require creating an account. By doing so, you agree to:</p>
            <ul>
              <li>Provide accurate, truthful, and up-to-date information.</li>
              <li>Keep your login credentials confidential.</li>
              <li>Notify us immediately of any unauthorized use of your account.</li>
              <li>Be responsible for all activities carried out under your account.</li>
            </ul>
            <p>We reserve the right to suspend or delete accounts that violate these terms.</p>
          </Section>

          <Section title="4. User-Generated Content">
            <p>
              By publishing tools, projects, tutorials, or any other content on {SITE_NAME}, you represent that:
            </p>
            <ul>
              <li>You own the content or have the necessary rights to publish it.</li>
              <li>The content does not infringe any third-party rights (intellectual property, privacy, etc.).</li>
              <li>The content is not illegal, offensive, misleading, or spam.</li>
            </ul>
            <p>
              You grant us a worldwide, non-exclusive, royalty-free license to display and distribute such content within the platform. You retain ownership of the content.
            </p>
          </Section>

          <Section title="5. Prohibited Conduct">
            <p>The following is expressly prohibited:</p>
            <ul>
              <li>Using the service for illegal or fraudulent activities.</li>
              <li>Publishing false, misleading, or spam content.</li>
              <li>Attempting unauthorized access to systems or other users' data.</li>
              <li>Using scrapers, bots, or other automated means to extract data from the platform without express authorization.</li>
              <li>Impersonating other individuals or entities.</li>
              <li>Interfering with the proper functioning of the platform.</li>
            </ul>
          </Section>

          <Section title="6. Intellectual Property">
            <p>
              The {SITE_NAME} brand, design, code, and original content are the property of their creators and are protected by intellectual property laws. Reproduction, distribution, or modification without prior written authorization is prohibited.
            </p>
            <p>
              Third-party tool names, logos, and trademarks mentioned on the platform are the property of their respective owners and are used for informational purposes only.
            </p>
          </Section>

          <Section title="7. Disclaimer of Warranties">
            <p>
              {SITE_NAME} acts as a directory of third-party tools and resources. We do not guarantee the accuracy, availability, security, or suitability of the tools listed, nor are we liable for any damages resulting from their use.
            </p>
            <p>
              The service is provided "as is" without warranties of any kind, express or implied, including uninterrupted availability or freedom from errors.
            </p>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>
              To the maximum extent permitted by applicable law, {SITE_NAME} and its contributors shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from the use of or inability to use the service.
            </p>
          </Section>

          <Section title="9. Modifications to the Service">
            <p>
              We reserve the right to modify, suspend, or discontinue the service (or any part of it) at any time, with or without notice. We will not be liable to you or any third party for such modifications or interruptions.
            </p>
          </Section>

          <Section title="10. Modifications to These Terms">
            <p>
              We may update these Terms of Service at any time. The date of the last update is indicated at the top of this document. Continued use of the service after changes are published constitutes acceptance of the new terms.
            </p>
          </Section>

          <Section title="11. Governing Law">
            <p>
              These terms are governed by applicable law. For users in the European Union, mandatory consumer protection regulations of your country of residence apply. For any disputes, the parties submit to the competent courts of the applicable jurisdiction.
            </p>
          </Section>

          <Section title="12. Contact">
            <p>
              For any questions about these Terms of Service, you can contact us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </Section>

        </div>

        <div className="mt-12 pt-8 border-t border-surface-800/50 flex flex-wrap gap-4 text-sm text-surface-500">
          <Link to="/legal/privacy" className="hover:text-brand-400 transition-colors">Privacy Policy</Link>
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
      <div className="space-y-3 text-surface-300 text-sm leading-relaxed [&_strong]:text-surface-200 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:text-brand-400 [&_a:hover]:text-brand-300 [&_em]:text-surface-300">
        {children}
      </div>
    </section>
  );
}
