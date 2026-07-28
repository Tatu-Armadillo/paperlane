import { Link } from 'react-router-dom';
import { ArrowUpRight, Download, Eye } from 'lucide-react';
import TypeBadge from './TypeBadge.jsx';
import { formatDate, readTimeFromText, formatBytes } from '@/utils/format.ts';
import { downloadUrl, previewUrl } from '@/api/documents.ts';
import { Document } from '@/types/Documents';

interface PublicationCardProps {
    doc: Document;
    featured?: boolean;
}

export default function PublicationCard({ doc, featured = false }: PublicationCardProps) {

    console.log(doc);
    const readMeta = doc.isText
        ? readTimeFromText(doc.textContent || '')
        : `${(doc.mimeType || '').split('/')[1]?.toUpperCase() || 'FILE'} · ${formatBytes(doc.fileSize)}`;

    return (
        <article
            data-testid={`publication-card-${doc.id}`}
            className={
                'paper-card group relative flex flex-col overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/40 hover:shadow-xl ' +
                (featured ? 'md:col-span-2' : '')
            }
        >
            <header className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <TypeBadge type={doc.type} />
                    <span className="text-xs text-muted-foreground">
                        {doc.category?.description}
                    </span>
                </div>
                <span className="text-xs text-muted-foreground">
                    {formatDate(doc.createdAt)}
                </span>
            </header>

            <Link
                to={`/documents/${doc.id}`}
                data-testid={`publication-title-${doc.id}`}
                className="block"
            >
                <h3
                    className={
                        'font-display font-semibold leading-snug text-foreground transition group-hover:text-accent ' +
                        (featured ? 'text-2xl md:text-3xl' : 'text-xl')
                    }
                >
                    {doc.title}
                </h3>
            </Link>

            <p className="mt-3 line-clamp-3 flex-1 text-sm text-muted-foreground leading-relaxed">
                {doc.description}
            </p>

            <footer className="mt-5 flex items-center justify-between border-t border-border/70 pt-4">
                <span className="text-xs text-muted-foreground">{readMeta}</span>
                <div className="flex items-center gap-2">
                    <a
                        href={previewUrl(doc.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid={`publication-preview-${doc.id}`}
                        className="paper-btn-ghost !px-3 !py-1.5 text-xs"
                        title="Preview"
                    >
                        <Eye className="h-3.5 w-3.5" />
                        Preview
                    </a>
                    <a
                        href={downloadUrl(doc.id)}
                        data-testid={`publication-download-${doc.id}`}
                        className="paper-btn-accent !px-3 !py-1.5 text-xs"
                        title="Download"
                    >
                        <Download className="h-3.5 w-3.5" />
                        Download
                    </a>
                </div>
            </footer>

            <Link
                to={`/documents/${doc.id}`}
                aria-label={`Read ${doc.title}`}
                className="absolute right-5 top-5 hidden text-muted-foreground/60 transition group-hover:text-accent md:block"
            >
                <ArrowUpRight className="h-4 w-4" />
            </Link>
        </article>
    );
}
