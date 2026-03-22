import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

const LAST_UPDATED = 'March 21, 2025';
const SITE_NAME = 'ToolsNoCode';
const CONTACT_EMAIL = 'privacy@toolsnocode.com';

type CookieRow = { name: string; type: string; purpose: string; duration: string };

const cookieTable: CookieRow[] = [
  {
    name: 'sb-*-auth-token',
    type: 'Necessary',
    purpose: 'Manages authenticated user sessions (Supabase Auth)',
    duration: 'Session / 1 week',
  },
  {
    name: 'sb-*-refresh-token',
    type: 'Necessary',
    purpose: 'Automatically renews the access token',
    duration: '1 week',
  },
  {
    name: '__cf_bm',
    type: 'Necessary',
    purpose: 'Bot protection (Cloudflare)',
    duration: '30 minutes',
  },
  {
    name: '_vercel_no_cache',
    type: 'Necessary',
    purpose: 'Server cache control (Vercel)',
    duration: 'Session',
  },
];

export default function CookiePolicyPage() {
  useSEO({
    title: 'Cookie Policy',
    description: 'Learn about the cookies used on ToolsNoCode, how we use them, and how you can manage your preferences.',
    url: '/legal/cookies',
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
            <Cookie className="w-5 h-5 text-brand-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Cookie Policy</h1>
        </div>
        <p className="text-sm text-surface-500 mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="space-y-0">

          <Section title="1. What Are Cookies?">
            <p>
              Cookies are small text files that websites store on your device when you visit them. They allow the site to remember your actions and preferences over a period of time, so you don't have to re-enter them each time you return.
            </p>
          </Section>

          <Section title="2. Cookies We Use">
            <p>
              {SITE_NAME} uses exclusively <strong>technical and necessary cookies</strong> for the correct functioning of the service. We do not use advertising or third-party tracking cookies for commercial purposes.
            </p>

            <div className="overflow-x-auto mt-4 rounded-xl border border-surface-800/60">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-800/60 bg-surface-900/50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Purpose</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider whitespace-nowrap">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {cookieTable.map((row, i) => (
                    <tr key={i} className="border-b border-surface-800/40 last:border-0">
                      <td className="px-4 py-3 font-mono text-xs text-brand-300 whitespace-nowrap">{row.name}</td>
                      <td className="px-4 py-3 text-surface-300">
                        <span className="bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs px-2 py-0.5 rounded-full">
                          {row.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-surface-400 text-xs leading-relaxed">{row.purpose}</td>
                      <td className="px-4 py-3 text-surface-400 text-xs whitespace-nowrap">{row.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="3. Third-Party Cookies">
            <p>
              Some tutorials may include videos embedded from external platforms such as YouTube. When playing a video, these platforms may set their own cookies on your device, subject to their respective privacy policies:
            </p>
            <ul>
              <li>
                <strong>YouTube (Google LLC):</strong> we use YouTube's privacy-enhanced mode (<code className="text-brand-300 bg-surface-900 px-1.5 py-0.5 rounded text-xs">youtube-nocookie.com</code>) to minimize cookie usage. Cookies are only set when you click play.{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>.
              </li>
            </ul>
            <p>
              If you prefer to avoid these cookies, you can open videos directly on YouTube using the "Open on YouTube" link available on each tutorial.
            </p>
          </Section>

          <Section title="4. How to Manage Cookies">
            <p>
              You can configure your browser to block or delete cookies. Please note that blocking necessary cookies may prevent some site features (such as sign-in) from working correctly.
            </p>
            <p>Instructions for major browsers:</p>
            <ul>
              <li><strong>Google Chrome:</strong> Settings &gt; Privacy and security &gt; Cookies and other site data.</li>
              <li><strong>Mozilla Firefox:</strong> Preferences &gt; Privacy &amp; Security &gt; Cookies and Site Data.</li>
              <li><strong>Safari:</strong> Preferences &gt; Privacy &gt; Manage Website Data.</li>
              <li><strong>Microsoft Edge:</strong> Settings &gt; Cookies and site permissions &gt; Cookies and site data.</li>
            </ul>
          </Section>

          <Section title="5. Consent">
            <p>
              Strictly necessary cookies do not require your consent under applicable e-privacy regulations, as they are essential for delivering the service. We do not use cookies that require prior consent (advertising, behavioral tracking).
            </p>
            <p>
              For embedded third-party cookies (e.g., YouTube), these are only activated at the user's explicit request when clicking the player.
            </p>
          </Section>

          <Section title="6. Updates to This Policy">
            <p>
              We may update this Cookie Policy to reflect changes in the cookies we use. We recommend reviewing this page periodically. The date of the last update is indicated at the top of this document.
            </p>
          </Section>

          <Section title="7. Contact">
            <p>
              For any questions about our Cookie Policy, you can contact us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </Section>

        </div>

        <div className="mt-12 pt-8 border-t border-surface-800/50 flex flex-wrap gap-4 text-sm text-surface-500">
          <Link to="/legal/privacy" className="hover:text-brand-400 transition-colors">Privacy Policy</Link>
          <Link to="/legal/terms" className="hover:text-brand-400 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-surface-800/60">{title}</h2>
      <div className="space-y-3 text-surface-300 text-sm leading-relaxed [&_strong]:text-surface-200 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:text-brand-400 [&_a:hover]:text-brand-300 [&_code]:text-brand-300 [&_code]:bg-surface-900 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs">
        {children}
      </div>
    </section>
  );
}
