import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Loader2, ArrowLeft, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Tool } from '../types';

export default function TutorialFormPage() {
  const { slug } = useParams();
  const isEdit = Boolean(slug);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [tools, setTools] = useState<Tool[]>([]);
  const [error, setError] = useState('');
  const [tutorialId, setTutorialId] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    tool_id: '',
    video_url: '',
    content_type: 'article' as string,
    duration_minutes: '',
    difficulty_level: 'beginner' as string,
    author_name: '',
    thumbnail_url: '',
  });

  useEffect(() => {
    supabase.from('tools').select('id, name').order('name').then(({ data }) => {
      setTools((data as Tool[]) ?? []);
    });
  }, []);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    supabase
      .from('tutorials')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) { navigate('/tutorials'); return; }
        if (data.user_id !== user?.id) { navigate(`/tutorials/${slug}`); return; }
        setTutorialId(data.id);
        setForm({
          title: data.title,
          description: data.description ?? '',
          tool_id: data.tool_id ?? '',
          video_url: data.video_url ?? '',
          content_type: data.content_type ?? 'article',
          duration_minutes: data.duration_minutes?.toString() ?? '',
          difficulty_level: data.difficulty_level ?? 'beginner',
          author_name: data.author_name ?? '',
          thumbnail_url: data.thumbnail_url ?? '',
        });
        setLoading(false);
      });
  }, [slug, user, navigate]);

  if (!user) { navigate('/auth'); return null; }

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const newSlug = generateSlug(form.title);

    const payload = {
      title: form.title,
      slug: newSlug,
      description: form.description,
      tool_id: form.tool_id || null,
      video_url: form.video_url,
      content_type: form.content_type,
      duration_minutes: parseInt(form.duration_minutes) || 0,
      difficulty_level: form.difficulty_level,
      author_name: form.author_name,
      thumbnail_url: form.thumbnail_url,
      user_id: user.id,
    };

    if (isEdit) {
      const { error: err } = await supabase.from('tutorials').update(payload).eq('id', tutorialId);
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      const { error: err } = await supabase.from('tutorials').insert(payload);
      if (err) { setError(err.message); setSaving(false); return; }
    }

    setSaving(false);
    navigate(`/tutorials/${newSlug}`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this tutorial?')) return;
    setDeleting(true);
    await supabase.from('tutorials').delete().eq('id', tutorialId);
    navigate('/tutorials');
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24">
        <div className="glass-card p-8 animate-pulse">
          <div className="h-8 bg-surface-800 rounded w-1/3 mb-6" />
          <div className="space-y-4">{[...Array(6)].map((_, i) => <div key={i} className="h-12 bg-surface-800 rounded" />)}</div>
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
            {isEdit ? 'Edit Tutorial' : 'New Tutorial'}
          </h1>
          {isEdit && (
            <button onClick={handleDelete} disabled={deleting} className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors">
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="input-field" placeholder="Tutorial title" />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="input-field resize-none" placeholder="What is this tutorial about..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Related Tool</label>
              <select value={form.tool_id} onChange={(e) => setForm({ ...form, tool_id: e.target.value })} className="input-field">
                <option value="">None</option>
                {tools.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Author</label>
              <input value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} className="input-field" placeholder="Author name" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Content Type</label>
              <select value={form.content_type} onChange={(e) => setForm({ ...form, content_type: e.target.value })} className="input-field">
                <option value="article">Article</option>
                <option value="video">Video</option>
                <option value="guide">Guide</option>
                <option value="course">Course</option>
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
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Duration (min)</label>
              <input type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} className="input-field" placeholder="30" min="0" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Video URL</label>
              <input value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} className="input-field" placeholder="https://youtube.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Thumbnail URL</label>
              <input value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} className="input-field" placeholder="https://..." />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">{error}</div>
          )}

          <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> {isEdit ? 'Save Changes' : 'Publish Tutorial'}</>}
          </button>
        </form>
      </div>
    </div>
  );
}
