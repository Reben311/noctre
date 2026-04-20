// Free iTunes Search API — returns 30s song previews with artwork. No auth.
export interface ItunesPreview {
  previewUrl: string;
  artworkUrl: string;
  trackName: string;
  artistName: string;
}

const cache = new Map<string, ItunesPreview | null>();

export async function fetchPreview(title: string, artist: string): Promise<ItunesPreview | null> {
  const key = `${title}|${artist}`.toLowerCase();
  if (cache.has(key)) return cache.get(key) ?? null;
  try {
    const term = encodeURIComponent(`${title} ${artist}`);
    const res = await fetch(
      `https://itunes.apple.com/search?term=${term}&media=music&entity=song&limit=1`
    );
    if (!res.ok) {
      cache.set(key, null);
      return null;
    }
    const data = await res.json();
    const r = data?.results?.[0];
    if (!r?.previewUrl) {
      cache.set(key, null);
      return null;
    }
    const result: ItunesPreview = {
      previewUrl: r.previewUrl,
      artworkUrl: (r.artworkUrl100 || r.artworkUrl60 || "").replace("100x100", "300x300"),
      trackName: r.trackName,
      artistName: r.artistName,
    };
    cache.set(key, result);
    return result;
  } catch {
    cache.set(key, null);
    return null;
  }
}
