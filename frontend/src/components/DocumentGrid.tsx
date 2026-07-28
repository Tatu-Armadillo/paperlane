import { Document } from '@/api/interfaces/Documents';
import DocumentCard from '@/components/DocumentCard';

interface DocumentGridProps {
  documents: Document[]
}

export default function DocumentGrid({ documents}: DocumentGridProps) {
  return (
    <div
      data-testid="document-grid"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {documents.map((doc, i) => (
        <DocumentCard
          key={doc.id ?? doc.id ?? `${doc.title}-${i}`}
          document={doc}
          style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
        />
      ))}
    </div>
  );
}
