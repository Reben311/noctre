import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, RefreshCw, Sparkles } from "lucide-react";
import type { VibeAnalysis } from "@/lib/sample-analysis";
import { SongCard } from "./SongCard";

const TABS = ["Songs", "Captions", "Vibe"] as const;
type Tab = (typeof TABS)[number];

interface Props {
  analysis: VibeAnalysis;
  imageUrl: string;
  onRegenerate?: () => void;
  regenerating?: boolean;
}

export function ResultsDashboard({ analysis, imageUrl, onRegenerate, regenerating }: Props) {
  const [tab, setTab] = useState<Tab>("Songs");
  const [activeSong, setActiveSong] = useState<string | null>(null);

  const allSongs = [...analysis.topMatches, ...analysis.moreRecommendations];

  return (
    <div className="space-y-4">
      {/* Compact preview header — image + vibe in one row */}
      <div className="bg-card brutal rounded-xl p-4 grain relative overflow-hidden">
        <div className="flex gap-4 items-start">
          <div className="relative h-24 w-20 sm:h-28 sm:w-24 shrink-0 brutal-sm rounded-md overflow-hidden">
            <img src={imageUrl} alt="Your upload" className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles size={12} className="text-foreground" />
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Vibe detected
              </p>
            </div>
            <p className="font-display text-lg sm:text-xl leading-tight">
              {analysis.vibeReading}
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {analysis.aesthetics.slice(0, 3).map((a) => (
                <span
                  key={a}
                  className="text-[10px] font-mono uppercase bg-accent text-accent-foreground px-1.5 py-0.5 rounded"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tab nav — sticky, mobile-first */}
      <div className="sticky top-[68px] z-30 bg-background/95 backdrop-blur-sm -mx-4 px-4 py-2 border-b border-border">
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1 bg-secondary rounded-full p-1">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                  tab === t
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={regenerating}
              className="text-xs font-mono uppercase brutal-sm rounded-md bg-card px-2.5 py-1.5 brutal-hover disabled:opacity-50 flex items-center gap-1.5"
            >
              <RefreshCw size={11} className={regenerating ? "animate-spin-slow" : ""} />
              {regenerating ? "..." : "New"}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          {tab === "Songs" && (
            <div className="space-y-4">
              <Section
                title="Top picks"
                hint={`${analysis.topMatches.length} perfect matches`}
              >
                <div className="space-y-2">
                  {analysis.topMatches.map((s, i) => {
                    const id = `top-${i}`;
                    return (
                      <SongCard
                        key={id}
                        song={s}
                        isActive={activeSong === id}
                        onPlay={() => setActiveSong(id)}
                        onStop={() => setActiveSong(null)}
                      />
                    );
                  })}
                </div>
              </Section>

              <Section title="More to explore" hint={`${analysis.moreRecommendations.length} extras`}>
                <div className="space-y-2">
                  {analysis.moreRecommendations.map((s, i) => {
                    const id = `more-${i}`;
                    return (
                      <SongCard
                        key={id}
                        song={s}
                        compact
                        isActive={activeSong === id}
                        onPlay={() => setActiveSong(id)}
                        onStop={() => setActiveSong(null)}
                      />
                    );
                  })}
                </div>
              </Section>
            </div>
          )}

          {tab === "Captions" && <CaptionsView captions={analysis.captions} />}

          {tab === "Vibe" && (
            <VibeView mood={analysis.mood} suggestion={analysis.postingSuggestion} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Story preview — shows what it would look like with active song */}
      {activeSong && (
        <StoryPreview
          imageUrl={imageUrl}
          song={allSongs[parseInt(activeSong.split("-")[1])] ? allSongs.find((_, i) => {
            const [type, idx] = activeSong.split("-");
            const songs = type === "top" ? analysis.topMatches : analysis.moreRecommendations;
            return songs.indexOf(allSongs[i]) === parseInt(idx);
          }) ?? null : null}
          activeId={activeSong}
          analysis={analysis}
        />
      )}
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="font-display text-base">{title}</h2>
        {hint && <span className="font-mono text-[10px] text-muted-foreground uppercase">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function CaptionsView({ captions }: { captions: VibeAnalysis["captions"] }) {
  const groups: Array<[string, string[]]> = [
    ["Short", captions.short],
    ["Classy", captions.classy],
    ["Playful", captions.playful],
    ["Minimalist", captions.minimalist],
  ];
  return (
    <div className="space-y-3">
      {groups.map(([label, lines]) => (
        <div key={label} className="bg-card brutal-sm rounded-lg p-3">
          <p className="font-mono text-[10px] uppercase text-muted-foreground mb-2">{label}</p>
          <ul className="space-y-1.5">
            {lines.map((l, i) => (
              <CaptionLine key={i} text={l} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function CaptionLine({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <li
      onClick={copy}
      className="flex items-center justify-between gap-2 text-sm py-1.5 px-2 -mx-2 rounded hover:bg-secondary cursor-pointer group"
    >
      <span className="leading-snug">{text}</span>
      <span className="opacity-0 group-hover:opacity-100 shrink-0 text-muted-foreground">
        {copied ? <Check size={12} className="text-accent" /> : <Copy size={12} />}
      </span>
    </li>
  );
}

function VibeView({
  mood,
  suggestion,
}: {
  mood: VibeAnalysis["mood"];
  suggestion: string;
}) {
  const stats = [
    { label: "Confidence", v: mood.confidence },
    { label: "Chill", v: mood.chill },
    { label: "Hype", v: mood.hype },
    { label: "Melancholy", v: mood.melancholy },
  ];
  const fields = [
    ["Tone", mood.emotionalTone],
    ["Energy", mood.energyLevel],
    ["Social", mood.socialVibe],
    ["Temp", mood.visualTemperature],
  ] as const;
  return (
    <div className="space-y-3">
      <div className="bg-card brutal-sm rounded-lg p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {fields.map(([k, v]) => (
            <div key={k}>
              <p className="font-mono text-[10px] uppercase text-muted-foreground">{k}</p>
              <p className="text-sm capitalize mt-0.5">{v}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="flex justify-between font-mono text-[10px] mb-1">
                <span className="text-muted-foreground uppercase">{s.label}</span>
                <span>{s.v}</span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-foreground"
                  style={{ width: `${s.v}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-accent text-accent-foreground brutal-sm rounded-lg p-4">
        <p className="font-mono text-[10px] uppercase mb-1.5">Posting tip</p>
        <p className="text-sm leading-snug">{suggestion}</p>
      </div>
    </div>
  );
}

// Sticky bottom story-preview while a song is playing
function StoryPreview({
  imageUrl,
  song,
  activeId,
  analysis,
}: {
  imageUrl: string;
  song: any;
  activeId: string;
  analysis: VibeAnalysis;
}) {
  const idx = parseInt(activeId.split("-")[1]);
  const list = activeId.startsWith("top") ? analysis.topMatches : analysis.moreRecommendations;
  const s = list[idx];
  if (!s) return null;
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto"
    >
      <div className="bg-foreground text-background rounded-2xl p-3 flex items-center gap-3 shadow-2xl">
        <div className="relative h-12 w-9 rounded-md overflow-hidden shrink-0">
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          {/* IG story style overlay with song */}
          <div className="absolute bottom-0.5 left-0.5 right-0.5 bg-background/90 text-foreground rounded px-1 py-0.5 flex items-center gap-0.5">
            <div className="flex items-end gap-[1px] h-2">
              <span className="eq-bar w-[1.5px] bg-foreground rounded-full" />
              <span className="eq-bar w-[1.5px] bg-foreground rounded-full" />
              <span className="eq-bar w-[1.5px] bg-foreground rounded-full" />
            </div>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-mono uppercase opacity-60">Story preview · now playing</p>
          <p className="text-sm font-medium truncate">{s.title} — {s.artist}</p>
        </div>
      </div>
    </motion.div>
  );
}
