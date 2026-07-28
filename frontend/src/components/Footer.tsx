import { Rss, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      data-testid="site-footer"
      className="mt-24 border-t border-border/70 bg-background/70"
    >
      <div className="paper-container grid gap-10 py-14 md:grid-cols-3">
        <div>
          <h3 className="font-display text-2xl font-semibold">Paperlane</h3>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground leading-relaxed">
            A quiet corner of the internet where independent writers publish
            articles, chapters, projects, short stories and images.
          </p>
        </div>
        <div>
          <p className="paper-eyebrow">Library</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href="/"
                className="text-foreground/80 hover:text-foreground transition"
              >
                Browse documents
              </a>
            </li>
            <li>
              <a
                href="/publish"
                className="text-foreground/80 hover:text-foreground transition"
              >
                Publish your work
              </a>
            </li>
            <li>
              <a
                href="/categories"
                className="text-foreground/80 hover:text-foreground transition"
              >
                Manage categories
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="paper-eyebrow">Follow along</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex items-center gap-2 text-foreground/80">
              <Rss className="h-3.5 w-3.5" />
              RSS feed
              <span className="text-xs text-muted-foreground">
                (coming soon)
              </span>
            </li>
            <li className="flex items-center gap-2 text-foreground/80">
              <Github className="h-3.5 w-3.5" />
              Open source
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/70">
        <div className="paper-container flex items-center justify-center py-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Paperlane · Built for readers
        </div>
      </div>
    </footer>
  );
}
