import { Link } from 'react-router-dom';
import { Download, Eye } from 'lucide-react';
import { getTypeMeta } from '@/utils/documentTypes';
import { cn } from '@/utils/cn';
import { Document } from '@/api/documents';

interface DocumentCardProps {
  key: string | number,
  document: Document, 
  style: any
}

export default function DocumentCard({key, document, style }: DocumentCardProps) {
  const type = getTypeMeta(document.type);
  const Icon = type.icon;
  const docId = document.id ?? document.id ?? '';
  return (
    <article
      data-testid={`document-card-${docId || 'unknown'}`}
      style={style}
      className="fade-up group relative flex h-full flex-col rounded-3xl border border-border bg-card p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-foreground/20 paper-shadow md:p-8"
    >
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 h-24 rounded-t-3xl bg-gradient-to-b opacity-70 transition-opacity group-hover:opacity-100',
          type.accent
        )}
      />
      <div className="relative flex items-center justify-between">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
            type.badgeClass
          )}
          data-testid={`document-card-type-${docId}`}
        >
          <Icon size={12} strokeWidth={2.2} />
          {type.label}
        </span>
      </div>

      <Link
        to={docId ? `/documents/${encodeURIComponent(docId)}` : '#'}
        data-testid={`document-card-title-link-${docId}`}
        className="relative mt-5 block"
      >
        <h3 className="font-display text-2xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
          {document.title || 'Untitled document'}
        </h3>
      </Link>

      <p className="relative mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-4">
        {document.description || 'No description provided for this document.'}
      </p>

      <div className="relative mt-6 flex items-center gap-2">
        <button
          type="button"
          // onClick={() => onPreview?.(document)}
          data-testid={`document-card-preview-${docId}`}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:-translate-y-0.5 hover:border-foreground/30 active:scale-95"
        >
          <Eye size={15} /> Preview
        </button>
        <button
          type="button"
          // onClick={() => onDownload?.(document)}
          data-testid={`document-card-download-${docId}`}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-all hover:-translate-y-0.5 active:scale-95"
        >
          <Download size={15} /> Download
        </button>
      </div>
    </article>
  );
}
