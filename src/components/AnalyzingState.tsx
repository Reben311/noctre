import { motion } from "framer-motion";

export function AnalyzingState() {
  const lines = [
    "Reading colors & light",
    "Detecting aesthetic cues",
    "Mapping emotional energy",
    "Curating song matches",
  ];
  return (
    <div className="grid place-items-center py-12">
      <div className="flex flex-col items-center text-center max-w-sm w-full">
        <div className="flex items-end gap-1.5 h-12 mb-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.span
              key={i}
              animate={{ height: ["20%", "100%", "20%"] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.12,
                ease: "easeInOut",
              }}
              className="w-2 bg-foreground rounded-full"
              style={{ height: "20%" }}
            />
          ))}
        </div>
        <h2 className="font-display text-2xl tracking-tight">Listening…</h2>
        <ul className="mt-4 space-y-1.5 text-xs font-mono text-muted-foreground uppercase">
          {lines.map((l, i) => (
            <motion.li
              key={l}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.3 }}
            >
              › {l}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
