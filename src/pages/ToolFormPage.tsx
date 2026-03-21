import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Loader2, ArrowLeft, Trash2, Plus, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Category } from '../types';

export default function ToolFormPage() {
  const { slug } = useParams();
  const isEdit = Boolean(slug);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [toolId, setToolId] = useState('');
  const [screenshotUrls, setScreenshotUrls] = useState<string[]>(['']);

  const [form, setForm] = useState({
    name: '',
    tagline: '',
    description: '',
    website: '',
    logo_url: '',
    category_id: '',
    pricing: 'free' as string,
    pricing_details: '',
    tags: '',
    difficulty_level: 'beginner' as string,
  });

  useEffect(() => {
    supabase.from('categories').select('*').order('name').then(({ data }) => {
      setCategories(data ?? []);
    });
  }, []);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    supabase
      .from('tools')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) {
          navigate('/tools');
          return;
        }
        if (data.user_id !== user?.id) {
          navigate(`/tools/${slug}`);
          return;
        }
        setToolId(data.id);
        setForm({
          name: data.name,
          tagline: data.tagline ?? '',
          description: data.description ?? '',
          website: data.website ?? '',
          logo_url: data.logo_url ?? '',
          category_id: data.category_id ?? '',
          pricing: data.pricing ?? 'free',
          pricing_details: data.pricing_details ?? '',
          tags: (data.tags ?? []).join(', '),
          difficulty_level: data.difficulty_level ?? 'beginner',
        });
        const urls: string[] = (data.screenshot_urls ?? []);
        setScreenshotUrls(urls.length > 0 ? urls : ['']);
        setLoading(false);
      });
  }, [slug, user, navigate]);

  if (!user) {
    navigate('/auth');
    return null;
  }

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const tagsArr = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const newSlug = generateSlug(form.name);
    const screenshots = screenshotUrls.map((u) => u.trim()).filter(Boolean);

    const payload = {
      name: form.name,
      slug: newSlug,
      tagline: form.tagline,
      description: form.description,
      website: form.website,
      logo_url: form.logo_url,
      screenshot_urls: screenshots,
      category_id: form.category_id || null,
      pricing: form.pricing,
      pricing_details: form.pricing_details,
      tags: tagsArr,
      difficulty_level: form.difficulty_level,
      user_id: user.id,
    };

    if (isEdit) {
      const { error: err } = await supabase
        .from('tools')
        .update(payload)
        .eq('id', toolId);
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      const { error: err } = await supabase.from('tools').insert(payload);
      if (err) { setError(err.message); setSaving(false); return; }
    }

    setSaving(false);
    navigate(`/tools/${newSlug}`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this tool?')) return;
    setDeleting(true);
    await supabase.from('tools').delete().eq('id', toolId);
    navigate('/tools');
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24">
        <div className="glass-card p-8 animate-pulse">
          <div className="h-8 bg-surface-800 rounded w-1/3 mb-6" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-surface-800 rounded" />
            ))}
          </div>
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
            {isEdit ? 'Edit Tool' : 'New Tool'}
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
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-field" placeholder="e.g. ChatGPT" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Tagline</label>
              <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="input-field" placeholder="Short description" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="input-field resize-none" placeholder="Detailed description of the tool..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Website</label>
              <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="input-field" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Logo URL</label>
              <input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} className="input-field" placeholder="https://..." />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-surface-300">Screenshots (URLs)</label>
              <button
                type="button"
                onClick={() => setScreenshotUrls((prev) => [...prev, ''])}
                className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-colors"
              >
                <Plus className="w-3 h-3" /> Add URL
              </button>
            </div>
            <div className="space-y-2">
              {screenshotUrls.map((url, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={url}
                    onChange={(e) => {
                      const next = [...screenshotUrls];
                      next[i] = e.target.value;
                      setScreenshotUrls(next);
                    }}
                    className="input-field flex-1"
                    placeholder={`https://... (screenshot ${i + 1})`}
                  />
                  {screenshotUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setScreenshotUrls((prev) => prev.filter((_, j) => j !== i))}
                      className="p-2 text-surface-500 hover:text-rose-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Category</label>
              <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="input-field">
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Pricing</label>
              <select value={form.pricing} onChange={(e) => setForm({ ...form, pricing: e.target.value })} className="input-field">
                <option value="free">Free</option>
                <option value="freemium">Freemium</option>
                <option value="paid">Paid</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Difficulty</label>
              <select value={form.difficulty_level} onChange={(e) => setForm({ ...form, difficulty_level: e.target.value })} className="input-field">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Pricing Details</label>
            <input value={form.pricing_details} onChange={(e) => setForm({ ...form, pricing_details: e.target.value })} className="input-field" placeholder="e.g. From $20/mo" />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Tags (comma separated)</label>
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="input-field" placeholder="ai, chatbot, productivity" />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">{error}</div>
          )}

          <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> {isEdit ? 'Save Changes' : 'Publish Tool'}</>}
          </button>
        </form>
      </div>
    </div>
  );
}
