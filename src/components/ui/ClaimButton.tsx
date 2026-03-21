import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Loader2, AlertCircle, Clock, XCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { ClaimRequest } from '../../types';

interface ClaimButtonProps {
  itemType: 'tools' | 'experts';
  itemId: string;
  itemName: string;
  onClaimed: () => void;
}

export default function ClaimButton({ itemType, itemId, itemName, onClaimed }: ClaimButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [existingRequest, setExistingRequest] = useState<ClaimRequest | null>(null);
  const [checkingRequest, setCheckingRequest] = useState(true);
  const [justification, setJustification] = useState('');
  const [contactProof, setContactProof] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!user) {
      setCheckingRequest(false);
      return;
    }
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

  const handleClick = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setShowForm((v) => !v);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (justification.trim().length < 30) {
      setError('Please provide at least 30 characters explaining your connection to this listing.');
      return;
    }
    setLoading(true);
    setError('');

    const { error: insertErr } = await supabase.from('claim_requests').insert({
      item_type: itemType,
      item_id: itemId,
      user_id: user.id,
      justification: justification.trim(),
      contact_proof: contactProof.trim(),
    });

    setLoading(false);

    if (insertErr) {
      if (insertErr.code === '23505') {
        setError('You already have a pending request for this listing.');
      } else {
        setError('Failed to submit request. Please try again.');
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
        {showForm ? <ChevronUp className="w-3.5 h-3.5 ml-auto" /> : <ChevronDown className="w-3.5 h-3.5 ml-auto" />}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-4 rounded-xl bg-surface-900/80 border border-surface-700/50 space-y-3 animate-fade-in"
        >
          <div>
            <p className="text-sm font-medium text-surface-200 mb-0.5">Request ownership of "{itemName}"</p>
            <p className="text-xs text-surface-500">
              Tell us how you are connected to this listing. Your request will be manually reviewed before ownership is granted.
            </p>
          </div>

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

          {error && (
            <div className="flex items-start gap-1.5 text-xs text-rose-400">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => { setShowForm(false); setError(''); }}
              className="px-3 py-1.5 rounded-lg text-xs text-surface-400 hover:text-surface-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-medium transition-all duration-200 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />}
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
