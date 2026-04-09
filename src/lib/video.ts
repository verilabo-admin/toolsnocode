export interface VideoInfo {
  type: 'youtube' | 'vimeo' | 'loom' | 'other';
  embedUrl: string;
  videoId?: string;
  thumbnailUrl?: string;
}

export function parseVideoUrl(url: string): VideoInfo | null {
  if (!url) return null;

  try {
    const u = new URL(url);

    if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
      let videoId: string | null = null;

      if (u.hostname === 'youtu.be') {
        videoId = u.pathname.slice(1).split('?')[0];
      } else if (u.pathname.startsWith('/embed/')) {
        videoId = u.pathname.split('/embed/')[1].split('?')[0];
      } else {
        videoId = u.searchParams.get('v');
      }

      if (videoId) {
        return {
          type: 'youtube',
          videoId,
          embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`,
          thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        };
      }
    }

    if (u.hostname.includes('vimeo.com')) {
      if (u.hostname === 'player.vimeo.com') {
        return { type: 'vimeo', embedUrl: url };
      }
      const match = u.pathname.match(/\/(\d+)/);
      if (match) {
        return { type: 'vimeo', videoId: match[1], embedUrl: `https://player.vimeo.com/video/${match[1]}` };
      }
    }

    if (u.hostname.includes('loom.com')) {
      const match = u.pathname.match(/\/share\/([a-zA-Z0-9]+)/);
      if (match) {
        return { type: 'loom', videoId: match[1], embedUrl: `https://www.loom.com/embed/${match[1]}` };
      }
    }

    return { type: 'other', embedUrl: url };
  } catch {
    return null;
  }
}
