import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { UploadDropzone } from "@/components/UploadDropzone";
import { AnalyzingState } from "@/components/AnalyzingState";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { SAMPLE_ANALYSIS, type VibeAnalysis } from "@/lib/sample-analysis";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Analyze your photo — Noctra" },
      {
        name: "description",
        content:
          "Upload a photo and get an instant AI vibe reading plus song recommendations tailored to your post.",
      },
    ],
  }),
  component: AnalyzePage,
});

const PLATFORMS = ["IG Story", "IG Post", "TikTok", "FB Story"] as const;
type Platform = (typeof PLATFORMS)[number];

function AnalyzePage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<VibeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [platform, setPlatform] = useState<Platform>("IG Story");

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("storysound:image");
      if (stored) setImageUrl(stored);
    } catch { /* noop */ }
  }, []);

  const runAnalysis = async (img: string, plat: Platform) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke("analyze-vibe", {
        body: { imageBase64: img, platform: plat },
      });
      if (fnErr) throw fnErr;
      if (data?.error) throw new Error(data.error);
      if (!data?.analysis) throw new Error("No analysis returned");
      setAnalysis(data.analysis as VibeAnalysis);
    } catch (e) {
      console.error(e);
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setError(msg);
      setAnalysis(SAMPLE_ANALYSIS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (imageUrl && !analysis && !loading) {
      void runAnalysis(imageUrl, platform);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl]);

  const reset = () => {
    setImageUrl(null);
    setAnalysis(null);
    setError(null);
    try {
      sessionStorage.removeItem("storysound:image");
      sessionStorage.removeItem("storysound:analysis");
    } catch { /* noop */ }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-4 pb-32">
        <div className="mx-auto max-w-2xl">
          {!imageUrl && (
            <div className="text-center pt-8">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
                › Upload
              </p>
              <h1 className="font-display text-3xl sm:text-4xl tracking-tight leading-[1.05] mb-2">
                Drop the photo.<br />
                <span className="bg-accent px-2">Hear the vibe.</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-3 mb-6">
                One upload, one perfect track.
              </p>
              <UploadDropzone
                onImageReady={(nextImageUrl) => {
                  setImageUrl(nextImageUrl);
                  setAnalysis(null);
                  setError(null);
                }}
              />
            </div>
          )}

          {imageUrl && (
            <div className="space-y-3">
              {/* Compact controls — single row */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4">
                <button
                  onClick={reset}
                  className="shrink-0 text-xs font-mono uppercase brutal-sm rounded-md bg-card px-2.5 py-1.5 brutal-hover"
                >
                  ← New
                </button>
                <Link
                  to="/"
                  className="shrink-0 text-xs font-mono uppercase brutal-sm rounded-md bg-card px-2.5 py-1.5 brutal-hover"
                >
                  Home
                </Link>
                <div className="h-5 w-px bg-border mx-1 shrink-0" />
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setPlatform(p);
                      if (imageUrl) void runAnalysis(imageUrl, p);
                    }}
                    className={`shrink-0 text-xs font-mono uppercase rounded-md px-2.5 py-1.5 transition-all ${
                      platform === p
                        ? "bg-foreground text-background"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {loading && <AnalyzingState />}

              {!loading && analysis && (
                <>
                  {error && (
                    <div className="rounded-md brutal-sm bg-destructive/10 border-destructive p-3 text-xs">
                      <p className="font-mono uppercase">Showing sample</p>
                      <p className="text-muted-foreground mt-0.5">{error}</p>
                    </div>
                  )}
                  <ResultsDashboard
                    analysis={analysis}
                    imageUrl={imageUrl}
                    onRegenerate={() => void runAnalysis(imageUrl, platform)}
                    regenerating={loading}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
