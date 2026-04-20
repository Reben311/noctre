import { useEffect, useRef, useState } from "react";
import { Play, Pause, ExternalLink } from "lucide-react";
import { fetchPreview, type ItunesPreview } from "@/lib/itunes-preview";
import type { SongMatch } from "@/lib/sample-analysis";

interface Props {
  song: SongMatch;
  compact?: boolean;
  isActive: boolean;
  onPlay: () => void;
  onStop: () => void;
}

// Shared audio singleton across cards
let activeAudio: HTMLAudioElement | null = null;

export function SongCard({ song, compact = false, isActive, onPlay, onStop }: Props) {
  const [preview, setPreview] = useState<ItunesPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isActive && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isActive]);

  const togglePlay = async () => {
    if (isActive && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      onStop();
      return;
    }

    let p = preview;
    if (!p) {
      setLoading(true);
      p = await fetchPreview(song.title, song.artist);
      setLoading(false);
      setPreview(p);
    }
    if (!p) {
      // No preview found — open spotify search
      window.open(
        `https://open.spotify.com/search/${encodeURIComponent(song.title + " " + song.artist)}`,
        "_blank"
      );
      return;
    }

    if (activeAudio && activeAudio !== audioRef.current) activeAudio.pause();
    if (!audioRef.current) {
      const audio = new Audio(p.previewUrl);
      audio.addEventListener("timeupdate", () => {
        setProgress((audio.currentTime / (audio.duration || 30)) * 100);
      });
      audio.addEventListener("ended", () => {
        setProgress(0);
        onStop();
      });
      audioRef.current = audio;
    }
    activeAudio = audioRef.current;
    audioRef.current.play();
    onPlay();
  };

  const artworkUrl = preview?.artworkUrl;

  return (
    <div
      className={`bg-card brutal-sm rounded-lg p-3 flex items-center gap-3 transition-all ${
        isActive ? "ring-2 ring-foreground" : ""
      }`}
    >
      <button
        onClick={togglePlay}
        className="relative h-12 w-12 shrink-0 rounded-md bg-foreground text-background grid place-items-center brutal-hover overflow-hidden"
        aria-label={isActive ? "Pause" : "Play preview"}
      >
        {artworkUrl && (
          <img src={artworkUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        )}
        <span className="relative z-10">
          {loading ? (
            <span className="block h-3 w-3 rounded-full border-2 border-background border-t-transparent animate-spin-slow" />
          ) : isActive ? (
            <Pause size={16} fill="currentColor" />
          ) : (
            <Play size={16} fill="currentColor" />
          )}
        </span>
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="font-medium text-sm truncate">{song.title}</p>
          <span className="font-mono text-xs shrink-0">{song.matchPercent}%</span>
        </div>
        <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
        {!compact && (
          <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">{song.why}</p>
        )}
        {isActive && (
          <div className="mt-1.5 h-0.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-foreground transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      <a
        href={`https://open.spotify.com/search/${encodeURIComponent(song.title + " " + song.artist)}`}
        target="_blank"
        rel="noreferrer"
        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1"
        aria-label="Open in Spotify"
        onClick={(e) => e.stopPropagation()}
      >
        <ExternalLink size={14} />
      </a>
    </div>
  );
}
