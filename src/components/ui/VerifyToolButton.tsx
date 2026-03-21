import { useState } from 'react';
import {
  ShieldCheck, Loader2, Copy, Check, AlertCircle,
  CheckCircle2, RefreshCw, ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface VerifyToolButtonProps {
  toolId: string;
  toolName: string;
  toolWebsite: string;
  initialToken: string | null | undefined;
  initialVerified: boolean;
  onVerified: () => void;
}

export default function VerifyToolButton({
  toolId,
  toolName,
  toolWebsite,
  initialToken,
  initialVerified,
  onVerified,
}: VerifyToolButtonProps) {
  const [expanded, setExpanded] = useState(false);
  const [token, setToken] = useState<string | null>(initialToken ?? null);
  const [isVerified, setIsVerified] = useState(initialVerified);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [verifyResult, setVerifyResult] = useState<{ success: boolean; domain?: string } | null>(null);

  const getFnUrl = () =>
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-tool-dns`;

  const getAuthHeaders = async () => {
    const { data } = await supabase.auth.getSession();
    return {
      Authorization: `Bearer ${data.session?.access_token}`,
      'Content-Type': 'application/json',
    };
  };

  const handleGenerateToken = async () => {
    setLoading(true);
    setError('');
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(getFnUrl(), {
        method: 'POST',
        headers,
        body: JSON.stringify({ tool_id: toolId, action: 'generate_token' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate token');
      setToken(data.token);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate token');
    }
    setLoading(false);
  };

  const handleVerify = async () => {
    setVerifying(true);
    setError('');
    setVerifyResult(null);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(getFnUrl(), {
        method: 'POST',
        headers,
        body: JSON.stringify({ tool_id: toolId, action: 'verify' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');
      setVerifyResult({ success: data.success, domain: data.domain });
      if (data.success) {
        setIsVerified(true);
        onVerified();
      } else {
        setError(data.error || `Token not found in DNS records for ${data.domain}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Verification failed');
    }
    setVerifying(false);
  };

  const handleCopy = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  let domain = '';
  try {
    const url = new URL(toolWebsite.startsWith('http') ? toolWebsite : `https://${toolWebsite}`);
    domain = url.hostname.replace(/^www\./, '');
  } catch {
    domain = toolWebsite;
  }

  if (isVerified) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
        <ShieldCheck className="w-4 h-4" />
        Verified
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => { setExpanded((v) => !v); setError(''); }}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/15 text-sky-400 border border-sky-500/20 hover:border-sky-500/30 text-sm font-medium transition-all duration-200"
      >
        <ShieldCheck className="w-4 h-4" />
        Verify ownership
        {expanded ? <ChevronUp className="w-3.5 h-3.5 ml-auto" /> : <ChevronDown className="w-3.5 h-3.5 ml-auto" />}
      </button>

      {expanded && (
        <div className="p-5 rounded-xl bg-surface-900/80 border border-surface-700/50 space-y-4">
          <div>
            <p className="text-sm font-semibold text-surface-200 mb-1">Verify ownership of "{toolName}"</p>
            <p className="text-xs text-surface-500">
              Prove you control <span className="text-surface-300 font-medium">{domain}</span> by adding a DNS TXT record.
              This works like Google Search Console — no code changes needed.
            </p>
          </div>

          {!token ? (
            <button
              onClick={handleGenerateToken}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/25 text-sm font-medium transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              {loading ? 'Generating...' : 'Generate verification token'}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
                  Step 1 — Add this TXT record to your DNS
                </p>
                <div className="rounded-lg border border-surface-700 overflow-hidden">
                  <div className="grid grid-cols-3 px-3 py-1.5 bg-surface-800/80 border-b border-surface-700">
                    <span className="text-xs text-surface-500 font-medium">Type</span>
                    <span className="text-xs text-surface-500 font-medium">Name / Host</span>
                    <span className="text-xs text-surface-500 font-medium">Value</span>
                  </div>
                  <div className="grid grid-cols-3 px-3 py-3 bg-surface-900/50 items-center gap-2">
                    <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded w-fit">TXT</span>
                    <span className="text-xs font-mono text-surface-300">@</span>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-xs font-mono text-surface-300 truncate flex-1">{token}</span>
                      <button
                        onClick={handleCopy}
                        className="shrink-0 p-1 rounded hover:bg-surface-700 text-surface-500 hover:text-surface-200 transition-colors"
                        title="Copy"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-800/50 rounded-lg px-3 py-2.5 space-y-1.5">
                  <p className="text-xs text-surface-400 font-medium">Where to add it:</p>
                  <ul className="text-xs text-surface-500 space-y-1 list-disc list-inside">
                    <li>Log in to your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.)</li>
                    <li>Navigate to DNS Management or Zone Editor</li>
                    <li>Add a new TXT record with Host <span className="text-surface-400 font-mono">@</span> and the value above</li>
                    <li>Save and wait 1–5 minutes for propagation</li>
                  </ul>
                  <a
                    href={`https://dnschecker.org/#TXT/${domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 mt-1 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Check DNS propagation for {domain}
                  </a>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
                  Step 2 — Click verify
                </p>
                <button
                  onClick={handleVerify}
                  disabled={verifying}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/25 text-sm font-medium transition-all disabled:opacity-50"
                >
                  {verifying
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <RefreshCw className="w-3.5 h-3.5" />}
                  {verifying ? 'Checking DNS...' : 'Verify now'}
                </button>
              </div>

              {verifyResult?.success && (
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  DNS record verified for <span className="font-medium">{verifyResult.domain}</span>. Ownership confirmed!
                </div>
              )}

              {error && (
                <div className="flex items-start gap-1.5 text-xs text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
