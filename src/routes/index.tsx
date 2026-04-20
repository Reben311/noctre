import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { UploadDropzone } from "@/components/UploadDropzone";
import { Sparkles, Music2, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Noctra — Find the perfect song for your story in seconds" },
      {
        name: "description",
        content:
          "Upload a photo. AI reads the vibe and matches it with the perfect song — with 30s previews. For Stories, TikTok, and posts.",
      },
      { property: "og:title", content: "Noctra — The perfect song for every post" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-4">
        <Hero />
        <Steps />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-2xl pt-6 pb-12 text-center">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-1.5 brutal-sm rounded-full bg-card px-3 py-1 text-[10px] font-mono uppercase mb-4"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-glow" />
        Free · 30s previews · No login
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-display text-4xl sm:text-6xl tracking-[-0.04em] leading-[0.95]"
      >
        The perfect song
        <br />
        for your <span className="bg-accent px-2">story.</span>
      </motion.h1>

      <p className="mt-4 text-sm text-muted-foreground max-w-md mx-auto">
        Drop a photo. AI reads the vibe. Get matching tracks with 30-second previews — instantly.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-6"
      >
        <UploadDropzone variant="hero" />
      </motion.div>
    </section>
  );
}

function Steps() {
  const steps = [
    { icon: Sparkles, t: "Upload", d: "Drop any photo." },
    { icon: Music2, t: "Match", d: "AI picks 15 songs." },
    { icon: MessageSquare, t: "Post", d: "Copy captions, go." },
  ];
  return (
    <section className="mx-auto max-w-2xl py-8">
      <div className="grid grid-cols-3 gap-2">
        {steps.map((s, i) => (
          <motion.div
            key={s.t}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="bg-card brutal-sm rounded-lg p-3 text-center"
          >
            <s.icon size={16} className="mx-auto mb-1.5" />
            <p className="font-display text-sm">{s.t}</p>
            <p className="text-[10px] font-mono uppercase text-muted-foreground mt-0.5">{s.d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="mx-auto max-w-2xl py-12 text-center">
      <div className="bg-foreground text-background brutal rounded-2xl p-6">
        <h2 className="font-display text-2xl sm:text-3xl tracking-tight leading-tight">
          Your next post is one upload away.
        </h2>
        <Link
          to="/analyze"
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-accent text-accent-foreground px-5 py-2.5 text-xs font-mono uppercase brutal-sm brutal-hover"
        >
          Upload photo →
        </Link>
      </div>
    </section>
  );
}
