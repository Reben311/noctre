import { Link } from "@tanstack/react-router";

export function Navbar() {
  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-7 w-7 brutal-sm rounded-md bg-accent grid place-items-center">
            <div className="flex items-end gap-[2px] h-3">
              <span className="w-[2px] h-full bg-foreground rounded-full" />
              <span className="w-[2px] h-2 bg-foreground rounded-full" />
              <span className="w-[2px] h-full bg-foreground rounded-full" />
            </div>
          </div>
          <span className="font-display text-lg tracking-tight">noctra</span>
        </Link>
        <Link
          to="/analyze"
          className="text-xs font-mono uppercase brutal-sm rounded-md bg-foreground text-background px-3 py-1.5 brutal-hover"
        >
          Try it →
        </Link>
      </div>
    </header>
  );
}
