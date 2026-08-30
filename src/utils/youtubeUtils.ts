export interface YouTubeMetadata {
  title: string;
  artist: string;
  thumbnailUrl: string;
  videoId: string;
}

export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/|live\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export function getYouTubeThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function isYouTubeUrl(url: string): boolean {
  return !!getYouTubeVideoId(url);
}

export async function fetchYouTubeMetadata(url: string): Promise<YouTubeMetadata | null> {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;

  const fallbackThumbnail = getYouTubeThumbnail(videoId);

  try {
    const res = await fetch(
      `https://noembed.com/embed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}`
    );
    if (!res.ok) {
      return {
        videoId,
        title: 'YouTube Focus Track',
        artist: 'YouTube Audio',
        thumbnailUrl: fallbackThumbnail,
      };
    }

    const data = await res.json();
    const rawTitle = (data.title as string) || 'YouTube Track';
    const rawArtist = (data.author_name as string) || 'YouTube Artist';

    // 1. Remove brackets and promotional tags
    let cleanedTitle = rawTitle
      .replace(/\[.*?\]/g, '')
      .replace(/\(Official.*?\)/gi, '')
      .replace(/\(Audio.*?\)/gi, '')
      .replace(/\(Lyric.*?\)/gi, '')
      .replace(/\(Visualizer.*?\)/gi, '')
      .replace(/\(Music Video.*?\)/gi, '')
      .replace(/\(Full Song.*?\)/gi, '')
      .replace(/\(Full Video.*?\)/gi, '')
      .trim();

    // 2. Remove pipeline separators "| Banjaare ..."
    if (cleanedTitle.includes(' | ')) {
      cleanedTitle = cleanedTitle.split(' | ')[0].trim();
    } else if (cleanedTitle.includes('|')) {
      cleanedTitle = cleanedTitle.split('|')[0].trim();
    }

    // 3. Remove subtitle suffixes like "– Animated Love Story" if author exists
    if (cleanedTitle.includes(' – ') || cleanedTitle.includes(' - ')) {
      const parts = cleanedTitle.split(/\s*[-–—]\s*/);
      if (parts.length >= 2) {
        cleanedTitle = parts[0].trim();
      }
    }

    return {
      videoId,
      title: cleanedTitle || rawTitle || 'YouTube Track',
      artist: rawArtist || 'YouTube Artist',
      thumbnailUrl: data.thumbnail_url || fallbackThumbnail,
    };
  } catch {
    return {
      videoId,
      title: 'YouTube Focus Track',
      artist: 'YouTube',
      thumbnailUrl: fallbackThumbnail,
    };
  }
}
