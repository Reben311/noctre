export function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between gap-4">
        <p className="font-mono text-[10px] uppercase text-muted-foreground">
          © {new Date().getFullYear()} noctra
        </p>
        <p className="font-mono text-[10px] uppercase text-muted-foreground">
          made for posting
        </p>
      </div>
    </footer>
  );
}
