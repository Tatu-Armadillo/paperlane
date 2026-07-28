import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpen, Feather } from 'lucide-react';

export default function Hero() {
  return (
    <section
      data-testid="hero-section"
      className="relative overflow-hidden border-b border-border/60"
    >
      <div className="paper-container grid grid-cols-1 items-center gap-14 py-20 md:py-24 lg:grid-cols-[1.15fr_1fr]">
        <div className="animate-fade-up">
          <span className="paper-chip w-fit border-accent/40 bg-accent/10 text-accent">
            <Feather className="h-3 w-3" />
            A public library for independent writing
          </span>

          <h1 className="mt-6 font-display text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl md:text-6xl">
            Publish anything worth{' '}
            <span className="italic text-accent">reading</span>.<br />
            Discover everything worth{' '}
            <span className="italic text-accent">keeping</span>.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            Paperlane is a quiet, open shelf for articles, book chapters,
            projects, short stories and images. Share your work as a
            downloadable document — no algorithm, no ads, just a permanent link.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/publish"
              data-testid="hero-publish-btn"
              className="paper-btn-primary"
            >
              Publish a document
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <a
              href="#library"
              data-testid="hero-browse-btn"
              className="paper-btn-ghost"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Browse the library
            </a>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <FloatingCard
            title="The Cartographer's Apology"
            type="Short Story"
            meta="Excerpt · 12 min read · uploaded to Paperlane"
            className="rotate-[-4deg]"
            tone="story"
          />
          <FloatingCard
            title="Notes on a slow web"
            type="Project"
            meta="PDF · 5.3 MB"
            className="absolute left-8 top-40 rotate-[3deg]"
            tone="project"
          />
        </div>
      </div>
    </section>
  );
}

function FloatingCard({ title, type, meta, className = '', tone = 'story' }) {
  const toneMap = {
    story: 'bg-type-story-bg text-type-story-fg',
    project: 'bg-type-project-bg text-type-project-fg',
    article: 'bg-type-article-bg text-type-article-fg',
  };
  return (
    <div
      className={`paper-card w-72 p-5 shadow-2xl backdrop-blur transition-transform ${className}`}
    >
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${toneMap[tone]}`}
      >
        {type}
      </span>
      <h3 className="mt-4 font-display text-lg font-semibold leading-tight">
        {title}
      </h3>
      <p className="mt-2 text-xs text-muted-foreground">{meta}</p>
    </div>
  );
}
