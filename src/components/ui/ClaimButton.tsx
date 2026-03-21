import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Loader2, AlertCircle, Clock, XCircle, CheckCircle2,
  ChevronDown, ChevronUp, Globe, FileText, Copy, Check, RefreshCw, ExternalLink
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { ClaimRequest } from '../../types';

interface ClaimButtonProps {
  itemType: 'tools' | 'experts';
  itemId: string;
  itemName: string;
  itemWebsite?: string;
  onClaimed: () => void;
}

type ClaimMethod = 'dns' | 'manual';

export default function ClaimButton({ itemType, itemId, itemName, itemWebsite, onClaimed }: ClaimButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [method, setMethod] = useState<ClaimMethod>('dns');
  const [existingRequest, setExistingRequest] = useState<ClaimRequest | null>(null);
  const [checkingRequest, setCheckingRequest] = useState(true);

  const [justification, setJustification] = useState('');
  const [contactProof, setContactProof] = useState('');
  const [manualLoading, setManualLoading] = useState(false);
  const [manualError, setManualError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [dnsToken, setDnsToken] = useState<string | null>(null);
  const [dnsTokenLoading, setDnsTokenLoading] = useState(false);
  const [dnsVerifying, setDnsVerifying] = useState(false);
  const [dnsCopied, setDnsCopied] = useState(false);
  const [dnsError, setDnsError] = useState('');
  const [dnsSuccess, setDnsSuccess] = useState(false);

  const hasDnsOption = itemType === 'tools' && !!itemWebsite;

  let domain = '';
  if (itemWebsite) {
    try {
      const url = new URL(itemWebsite.startsWith('http') ? itemWebsite : `https://${itemWebsite}`);
      domain = url.hostname.replace(/^www\./, '');
    } catch {
      domain = itemWebsite;
    }
  }

  useEffect(() => {
    if (!user) { setCheckingRequest(false); return; }
    const check = async () => {
      setCheckingRequest(true);
      const { data } = await supabase
        .from('claim_requests')
        .select('*')
        .eq('item_type', itemType)
        .eq('item_id', itemId)
        .eq('user_id', user.id)
        .maybeSingle();
      setExistingRequest(data);
      setCheckingRequest(false);
    };
    check();
  }, [user, itemType, itemId]);

  useEffect(() => {
    if (!hasDnsOption) setMethod('manual');
  }, [hasDnsOption]);

  const handleClick = () => {
    if (!user) { navigate('/auth'); return; }
    setShowForm((v) => !v);
    setManualError('');
    setDnsError('');
  };

  const getFnUrl = () => `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-tool-dns`;

  const getAuthHeaders = async () => {
    const { data } = await supabase.auth.getSession();
    return {
      Authorization: `Bearer ${data.session?.access_token}`,
      'Content-Type': 'application/json',
    };
  };

  const handleGenerateDnsToken = async () => {
    setDnsTokenLoading(true);
    setDnsError('');
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(getFnUrl(), {
        method: 'POST',
        headers,
        body: JSON.stringify({ tool_id: itemId, action: 'generate_token' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate token');
      setDnsToken(data.token);
    } catch (e) {
      setDnsError(e instanceof Error ? e.message : 'Failed to generate token');
    }
    setDnsTokenLoading(false);
  };

  const handleDnsVerify = async () => {
    setDnsVerifying(true);
    setDnsError('');
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(getFnUrl(), {
        method: 'POST',
        headers,
        body: JSON.stringify({ tool_id: itemId, action: 'verify' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');
      if (data.success) {
        setDnsSuccess(true);
        setShowForm(false);
        onClaimed();
      } else {
        setDnsError(data.error || `Token not found in DNS records for ${data.domain}`);
      }
    } catch (e) {
      setDnsError(e instanceof Error ? e.message : 'Verification failed');
    }
    setDnsVerifying(false);
  };

  const handleDnsCopy = () => {
    if (!dnsToken) return;
    navigator.clipboard.writeText(dnsToken);
    setDnsCopied(true);
    setTimeout(() => setDnsCopied(false), 2000);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (justification.trim().length < 30) {
      setManualError('Please provide at least 30 characters explaining your connection.');
      return;
    }
    setManualLoading(true);
    setManualError('');
    const { error: insertErr } = await supabase.from('claim_requests').insert({
      item_type: itemType,
      item_id: itemId,
      user_id: user.id,
      justification: justification.trim(),
      contact_proof: contactProof.trim(),
    });
    setManualLoading(false);
    if (insertErr) {
      if (insertErr.code === '23505') {
        setManualError('You already have a pending request for this listing.');
      } else {
        setManualError('Failed to submit request. Please try again.');
      }
      return;
    }
    setSubmitted(true);
    setShowForm(false);
    const { data } = await supabase
      .from('claim_requests')
      .select('*')
      .eq('item_type', itemType)
      .eq('item_id', itemId)
      .eq('user_id', user.id)
      .maybeSingle();
    setExistingRequest(data);
    onClaimed();
  };

  if (checkingRequest) return null;

  if (dnsSuccess) {
    return (
      <div className="inline-flex items-start gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
        <div>
          <p className="text-sm font-medium text-emerald-400">Ownership verified</p>
          <p className="text-xs text-surface-400 mt-0.5">DNS verification successful. You are now the owner.</p>
        </div>
      </div>
    );
  }

  if (existingRequest) {
    const statusConfig = {
      pending: {
        icon: <Clock className="w-4 h-4" />,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/20',
        label: 'Claim request pending review',
        note: 'We will review your request and notify you by email.',
      },
      approved: {
        icon: <CheckCircle2 className="w-4 h-4" />,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/20',
        label: 'Claim approved',
        note: 'You are now the owner of this listing.',
      },
      rejected: {
        icon: <XCircle className="w-4 h-4" />,
        color: 'text-rose-400',
        bg: 'bg-rose-500/10 border-rose-500/20',
        label: 'Claim request rejected',
        note: existingRequest.admin_note || 'Your claim request was not approved.',
      },
    };
    const cfg = statusConfig[existingRequest.status];
    return (
      <div className={`inline-flex items-start gap-2.5 px-4 py-3 rounded-xl border ${cfg.bg}`}>
        <span className={`mt-0.5 shrink-0 ${cfg.color}`}>{cfg.icon}</span>
        <div>
          <p className={`text-sm font-medium ${cfg.color}`}>{cfg.label}</p>
          <p className="text-xs text-surface-400 mt-0.5">{cfg.note}</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="inline-flex items-start gap-2.5 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <Clock className="w-4 h-4 mt-0.5 shrink-0 text-amber-400" />
        <div>
          <p className="text-sm font-medium text-amber-400">Request submitted</p>
          <p className="text-xs text-surface-400 mt-0.5">We will review your claim and contact you by email.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/15 text-amber-400 border border-amber-500/20 hover:border-amber-500/30 text-sm font-medium transition-all duration-200"
      >
        <ShieldCheck className="w-4 h-4" />
        Claim this listing
        {showForm ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
      </button>

      {showForm && (
        <div className="rounded-xl bg-surface-900/80 border border-surface-700/50 overflow-hidden animate-fade-in">
          <div className="px-4 pt-4 pb-3 border-b border-surface-700/50">
            <p className="text-sm font-medium text-surface-200">Claim ownership of "{itemName}"</p>
            <p className="text-xs text-surface-500 mt-0.5">
              Choose how you want to prove you own this listing.
            </p>
          </div>

          {hasDnsOption && (
            <div className="flex border-b border-surface-700/50">
              <button
                onClick={() => { setMethod('dns'); setManualError(''); setDnsError(''); }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors ${
                  method === 'dns'
                    ? 'text-sky-400 bg-sky-500/10 border-b-2 border-sky-500'
                    : 'text-surface-400 hover:text-surface-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                DNS Verification
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/15 text-emerald-400 font-medium">Instant</span>
              </button>
              <button
                onClick={() => { setMethod('manual'); setManualError(''); setDnsError(''); }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors ${
                  method === 'manual'
                    ? 'text-amber-400 bg-amber-500/10 border-b-2 border-amber-500'
                    : 'text-surface-400 hover:text-surface-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Manual Review
              </button>
            </div>
          )}

          {method === 'dns' && hasDnsOption && (
            <div className="p-4 space-y-4">
              <p className="text-xs text-surface-500">
                Prove you control <span className="text-surface-300 font-medium">{domain}</span> by adding a DNS TXT record — no code changes needed. Ownership is granted instantly upon verification.
              </p>

              {!dnsToken ? (
                <button
                  onClick={handleGenerateDnsToken}
                  disabled={dnsTokenLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/25 text-sm font-medium transition-all disabled:opacity-50"
                >
                  {dnsTokenLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                  {dnsTokenLoading ? 'Generating...' : 'Generate verification token'}
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
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
                          <span className="text-xs font-mono text-surface-300 truncate flex-1">{dnsToken}</span>
                          <button
                            onClick={handleDnsCopy}
                            className="shrink-0 p-1 rounded hover:bg-surface-700 text-surface-500 hover:text-surface-200 transition-colors"
                            title="Copy"
                          >
                            {dnsCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
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
                      onClick={handleDnsVerify}
                      disabled={dnsVerifying}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/25 text-sm font-medium transition-all disabled:opacity-50"
                    >
                      {dnsVerifying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                      {dnsVerifying ? 'Checking DNS...' : 'Verify now'}
                    </button>
                  </div>
                </div>
              )}

              {dnsError && (
                <div className="flex items-start gap-1.5 text-xs text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{dnsError}</span>
                </div>
              )}

              <div className="pt-1 border-t border-surface-700/50 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setDnsError(''); }}
                  className="px-3 py-1.5 rounded-lg text-xs text-surface-400 hover:text-surface-200 transition-colors"
                >
                  Cancel
                </button>
                {hasDnsOption && (
                  <button
                    type="button"
                    onClick={() => setMethod('manual')}
                    className="text-xs text-surface-500 hover:text-surface-300 transition-colors"
                  >
                    Can't add DNS? Use manual review
                  </button>
                )}
              </div>
            </div>
          )}

          {method === 'manual' && (
            <form onSubmit={handleManualSubmit} className="p-4 space-y-3">
              <p className="text-xs text-surface-500">
                Tell us how you are connected to this listing. Your request will be manually reviewed before ownership is granted.
              </p>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-surface-400">
                  Why should you own this listing? <span className="text-rose-400">*</span>
                </label>
                <textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  rows={3}
                  placeholder={`e.g. "I am the founder of ${itemName}. Our website is example.com and I can verify my identity via..."`}
                  className="w-full px-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-surface-200 text-sm placeholder-surface-500 focus:outline-none focus:border-brand-500/60 resize-none transition-colors"
                  required
                />
                <p className="text-xs text-surface-600">{justification.length}/30 characters minimum</p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-surface-400">
                  Proof of ownership (optional)
                </label>
                <input
                  type="text"
                  value={contactProof}
                  onChange={(e) => setContactProof(e.target.value)}
                  placeholder="Website URL, LinkedIn, Twitter, or other verifiable link"
                  className="w-full px-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-surface-200 text-sm placeholder-surface-500 focus:outline-none focus:border-brand-500/60 transition-colors"
                />
              </div>

              {manualError && (
                <div className="flex items-start gap-1.5 text-xs text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  {manualError}
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setManualError(''); }}
                  className="px-3 py-1.5 rounded-lg text-xs text-surface-400 hover:text-surface-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={manualLoading}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-medium transition-all duration-200 disabled:opacity-50"
                >
                  {manualLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />}
                  {manualLoading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
