import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Loader2, ArrowLeft, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import ImageUploader from '../components/ui/ImageUploader';
import type { Tool } from '../types';

export default function ProjectFormPage() {
  const { slug } = useParams();
  const isEdit = Boolean(slug);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [projectId, setProjectId] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    screenshot_url: '',
    live_url: '',
    author_name: '',
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
      .from('projects')
      .select('*, project_tools(tool_id)')
      .eq('slug', slug)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) { navigate('/projects'); return; }
        if (data.user_id !== user?.id) { navigate(`/projects/${slug}`); return; }
        setProjectId(data.id);
        setForm({
          title: data.title,
          description: data.description ?? '',
          screenshot_url: data.screenshot_url ?? '',
          live_url: data.live_url ?? '',
          author_name: data.author_name ?? '',
        });
        const toolIds = ((data.project_tools as { tool_id: string }[]) ?? []).map((pt) => pt.tool_id);
        setSelectedToolIds(toolIds);
        setLoading(false);
      });
  }, [slug, user, navigate]);

  if (!user) { navigate('/auth'); return null; }

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const toggleTool = (toolId: string) => {
    setSelectedToolIds((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const newSlug = generateSlug(form.title);

    const payload = {
      title: form.title,
      slug: newSlug,
      description: form.description,
      screenshot_url: form.screenshot_url,
      live_url: form.live_url,
      author_name: form.author_name,
      user_id: user.id,
    };

    let pid = projectId;

    if (isEdit) {
      const { error: err } = await supabase.from('projects').update(payload).eq('id', projectId);
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      const { data, error: err } = await supabase.from('projects').insert(payload).select('id').maybeSingle();
      if (err || !data) { setError(err?.message ?? 'Error creating project'); setSaving(false); return; }
      pid = data.id;
    }

    if (isEdit) {
      await supabase.from('project_tools').delete().eq('project_id', pid);
    }
    if (selectedToolIds.length > 0) {
      await supabase.from('project_tools').insert(
        selectedToolIds.map((tool_id) => ({ project_id: pid, tool_id }))
      );
    }

    setSaving(false);
    navigate(`/projects/${newSlug}`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    setDeleting(true);
    await supabase.from('project_tools').delete().eq('project_id', projectId);
    await supabase.from('projects').delete().eq('id', projectId);
    navigate('/projects');
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
            {isEdit ? 'Edit Project' : 'New Project'}
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
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="input-field" placeholder="Project name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Author</label>
              <input value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} className="input-field" placeholder="Your name" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="input-field resize-none" placeholder="Describe your project..." />
          </div>

          <ImageUploader
            value={form.screenshot_url}
            onChange={(url) => setForm({ ...form, screenshot_url: url })}
            folder="screenshots"
            label="Project Screenshot"
            hint="Landscape image recommended (16:9)."
            aspectRatio="landscape"
          />

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Live URL</label>
            <input value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} className="input-field" placeholder="https://..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Tools Used</label>
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
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> {isEdit ? 'Save Changes' : 'Publish Project'}</>}
          </button>
        </form>
      </div>
    </div>
  );
}
