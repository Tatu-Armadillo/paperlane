import { Download, ExternalLink, FileWarning } from 'lucide-react';
import { previewUrl, downloadUrl } from '../api/documents.ts';
import { Document } from '@/types/Documents.ts';

export default function DocumentViewer(doc: Document) {
  if (!doc) return null;

  // Text-based: render inline as article
  if (doc.isText && doc.textContent) {
    return (
      <div
        data-testid="document-viewer-text"
        className="prose-paper max-w-none whitespace-pre-wrap font-sans"
      >
        {doc.textContent}
      </div>
    );
  }

  const isImage = (doc.mimeType || '').startsWith('image/');
  const isPdf = (doc.mimeType || '').includes('pdf');

  if (isImage) {
    return (
      <figure
        data-testid="document-viewer-image"
        className="paper-card overflow-hidden p-2"
      >
        <img
          src={previewUrl(doc.id)}
          alt={doc.title}
          className="mx-auto max-h-[70vh] w-auto rounded-xl object-contain"
        />
        <figcaption className="mt-3 px-3 pb-2 text-center text-xs text-muted-foreground">
          {doc.originalFilename}
        </figcaption>
      </figure>
    );
  }

  if (isPdf) {
    return (
      <div
        data-testid="document-viewer-pdf"
        className="paper-card overflow-hidden"
      >
        <iframe
          src={previewUrl(doc.id)}
          title={doc.title}
          className="h-[80vh] w-full border-0"
        />
      </div>
    );
  }

  return (
    <div
      data-testid="document-viewer-unavailable"
      className="paper-card flex flex-col items-center gap-4 px-6 py-14 text-center"
    >
      <span className="grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
        <FileWarning className="h-5 w-5" />
      </span>
      <div>
        <h3 className="font-display text-xl font-semibold">
          Preview unavailable
        </h3>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          This file type can't be rendered inline. Download the original to
          continue reading.
        </p>
      </div>
      <div className="flex gap-2">
        <a
          href={previewUrl(doc.id)}
          target="_blank"
          rel="noopener noreferrer"
          className="paper-btn-ghost"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open in new tab
        </a>
        <a
          href={downloadUrl(doc.id)}
          className="paper-btn-accent"
          data-testid="document-viewer-download"
        >
          <Download className="h-3.5 w-3.5" />
          Download file
        </a>
      </div>
    </div>
  );
}
