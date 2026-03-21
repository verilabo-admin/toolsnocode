import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Loader2, ArrowLeft, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Tool } from '../types';

export default function ExpertFormPage() {
  const { slug } = useParams();
  const isEdit = Boolean(slug);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [expertId, setExpertId] = useState('');
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: '',
    bio: '',
    avatar_url: '',
    country: '',
    languages: '',
    hourly_rate: '',
    portfolio_url: '',
  });

  useEffect(() => {
    supabase.from('tools').select('id, name').order('name').then(({ data }) => {
      setAllTools((data as Tool[]) ?? []);
    });
  }, []);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    supabase
      .from('experts')
      .select('*, expert_tools(tool_id)')
      .eq('slug', slug)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) { navigate('/experts'); return; }
        if (data.user_id !== user?.id) { navigate(`/experts/${slug}`); return; }
        setExpertId(data.id);
        setForm({
          name: data.name,
          bio: data.bio ?? '',
          avatar_url: data.avatar_url ?? '',
          country: data.country ?? '',
          languages: (data.languages ?? []).join(', '),
          hourly_rate: data.hourly_rate?.toString() ?? '',
          portfolio_url: data.portfolio_url ?? '',
        });
        const toolIds = ((data.expert_tools as { tool_id: string }[]) ?? []).map((et) => et.tool_id);
        setSelectedToolIds(toolIds);
        setLoading(false);
      });
  }, [slug, user, navigate]);

  if (!user) { navigate('/auth'); return null; }

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const toggleTool = (toolId: string) => {
    setSelectedToolIds((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const langs = form.languages.split(',').map((l) => l.trim()).filter(Boolean);
    const newSlug = generateSlug(form.name);

    const payload = {
      name: form.name,
      slug: newSlug,
      bio: form.bio,
      avatar_url: form.avatar_url,
      country: form.country,
      languages: langs,
      hourly_rate: parseFloat(form.hourly_rate) || 0,
      portfolio_url: form.portfolio_url,
      user_id: user.id,
    };

    let eid = expertId;

    if (isEdit) {
      const { error: err } = await supabase.from('experts').update(payload).eq('id', expertId);
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      const { data, error: err } = await supabase.from('experts').insert(payload).select('id').maybeSingle();
      if (err || !data) { setError(err?.message ?? 'Error creating profile'); setSaving(false); return; }
      eid = data.id;
    }

    await supabase.from('expert_tools').delete().eq('expert_id', eid);
    if (selectedToolIds.length > 0) {
      await supabase.from('expert_tools').insert(
        selectedToolIds.map((tool_id) => ({ expert_id: eid, tool_id }))
      );
    }

    setSaving(false);
    navigate(`/experts/${newSlug}`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this expert profile?')) return;
    setDeleting(true);
    await supabase.from('expert_tools').delete().eq('expert_id', expertId);
    await supabase.from('experts').delete().eq('id', expertId);
    navigate('/experts');
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24">
        <div className="glass-card p-8 animate-pulse">
          <div className="h-8 bg-surface-800 rounded w-1/3 mb-6" />
          <div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-surface-800 rounded" />)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-surface-400 hover:text-surface-200 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="glass-card p-6 sm:p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">
            {isEdit ? 'Edit Expert' : 'New Expert Profile'}
          </h1>
          {isEdit && (
            <button onClick={handleDelete} disabled={deleting} className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors">
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-field" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Country</label>
              <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input-field" placeholder="e.g. United States" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4} className="input-field resize-none" placeholder="Tell us about your experience..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Avatar URL</label>
              <input value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} className="input-field" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Portfolio URL</label>
              <input value={form.portfolio_url} onChange={(e) => setForm({ ...form, portfolio_url: e.target.value })} className="input-field" placeholder="https://..." />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Hourly Rate ($)</label>
              <input type="number" value={form.hourly_rate} onChange={(e) => setForm({ ...form, hourly_rate: e.target.value })} className="input-field" placeholder="50" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Languages (comma separated)</label>
              <input value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} className="input-field" placeholder="English, Spanish" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Tools & Skills</label>
            <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-surface-900/80 border border-surface-700/50 max-h-48 overflow-y-auto">
              {allTools.map((tool) => {
                const selected = selectedToolIds.includes(tool.id);
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => toggleTool(tool.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selected
                        ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                        : 'bg-surface-800 text-surface-400 border border-surface-700 hover:text-surface-200'
                    }`}
                  >
                    {tool.name}
                  </button>
                );
              })}
              {allTools.length === 0 && (
                <span className="text-surface-500 text-sm">No tools available</span>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">{error}</div>
          )}

          <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> {isEdit ? 'Save Changes' : 'Publish Profile'}</>}
          </button>
        </form>
      </div>
    </div>
  );
}
