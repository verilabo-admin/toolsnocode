import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface ClaimButtonProps {
  itemType: 'tools' | 'experts';
  itemId: string;
  onClaimed: () => void;
}

export default function ClaimButton({ itemType, itemId, onClaimed }: ClaimButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState('');
  const [claimed, setClaimed] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (claimed) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium">
        <ShieldCheck className="w-4 h-4" />
        Listing claimed successfully
      </div>
    );
  }

  const handleConfirm = async () => {
    if (!user) return;
    setClaiming(true);
    setError('');
    setShowConfirm(false);

    const { error: updateErr } = await supabase
      .from(itemType)
      .update({ user_id: user.id })
      .eq('id', itemId)
      .is('user_id', null);

    if (updateErr) {
      setError('Claim failed. This listing may already have an owner.');
      setClaiming(false);
      return;
    }

    await supabase.from('claims').insert({
      item_type: itemType,
      item_id: itemId,
      claimed_by: user.id,
    });

    setClaiming(false);
    setClaimed(true);
    onClaimed();
  };

  const handleClick = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setShowConfirm(true);
  };

  return (
    <div className="flex flex-col gap-2">
      {showConfirm ? (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <div className="flex-1">
            <p className="text-sm text-amber-300 font-medium">Claim this listing?</p>
            <p className="text-xs text-surface-400 mt-0.5">You will become the owner and can edit it.</p>
          </div>
          <div className="flex items-center gap-2 ml-2 shrink-0">
            <button
              onClick={() => setShowConfirm(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-surface-400 hover:text-surface-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={claiming}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-medium transition-all duration-200 disabled:opacity-50"
            >
              {claiming ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />}
              {claiming ? 'Claiming...' : 'Confirm'}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleClick}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/15 text-amber-400 border border-amber-500/20 hover:border-amber-500/30 text-sm font-medium transition-all duration-200"
        >
          <ShieldCheck className="w-4 h-4" />
          Claim this listing
        </button>
      )}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
