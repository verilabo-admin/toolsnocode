import { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder: 'logos' | 'avatars' | 'screenshots' | 'thumbnails';
  label?: string;
  hint?: string;
  aspectRatio?: 'square' | 'landscape';
}

async function convertToWebP(file: File, maxDimension = 1280): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height / width) * maxDimension);
          width = maxDimension;
        } else {
          width = Math.round((width / height) * maxDimension);
          height = maxDimension;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context unavailable'));
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Conversion failed'));
          resolve(blob);
        },
        'image/webp',
        0.85,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image'));
    };
    img.src = objectUrl;
  });
}

export default function ImageUploader({
  value,
  onChange,
  folder,
  label,
  hint,
  aspectRatio = 'square',
}: ImageUploaderProps) {
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = async (file: File) => {
    if (!user) return;
    if (!file.type.startsWith('image/')) {
      setError('Only image files are supported');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File must be smaller than 10 MB');
      return;
    }
    setError(null);
    setUploading(true);

    try {
      const webpBlob = await convertToWebP(file, folder === 'logos' || folder === 'avatars' ? 512 : 1280);
      const ext = 'webp';
      const filename = `${Date.now()}.${ext}`;
      const path = `${folder}/${user.id}/${filename}`;

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(path, webpBlob, { contentType: 'image/webp', upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('uploads').getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
  };

  const previewAspect = aspectRatio === 'landscape' ? 'aspect-[16/9]' : 'aspect-square';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-surface-300">{label}</label>
      )}

      {value ? (
        <div className="relative group w-full">
          <div className={`${previewAspect} max-w-xs rounded-xl overflow-hidden border border-surface-700/50 bg-surface-800`}>
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-sm rounded-lg text-white hover:bg-red-500/80 transition-colors opacity-0 group-hover:opacity-100"
            title="Remove image"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-2 right-2 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-xs hover:bg-surface-700/80 transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1.5"
          >
            <Upload className="w-3 h-3" />
            Replace
          </button>
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`
            relative cursor-pointer rounded-xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-3 transition-all duration-200
            ${dragging
              ? 'border-brand-400 bg-brand-500/10'
              : 'border-surface-700 hover:border-surface-500 bg-surface-800/40 hover:bg-surface-800/60'
            }
            ${uploading ? 'pointer-events-none opacity-70' : ''}
          `}
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
              <p className="text-sm text-surface-400">Converting and uploading...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-surface-700/60 border border-surface-600/50 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-surface-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-surface-300">
                  <span className="text-brand-400">Click to upload</span> or drag & drop
                </p>
                <p className="text-xs text-surface-500 mt-1">
                  PNG, JPG, GIF, WebP — auto-converted to WebP
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <X className="w-3 h-3" />
          {error}
        </p>
      )}

      {hint && !error && (
        <p className="text-xs text-surface-500">{hint}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />

      {value && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Or paste a URL directly"
            className="input-field text-xs flex-1"
          />
        </div>
      )}

      {!value && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste a URL directly"
          className="input-field text-xs"
        />
      )}
    </div>
  );
}
