import { Document } from '@/api/documents';
import PublicationCard from '@/components/PublicationCard';

function CardSkeleton() {
  return (
    <div className="paper-card p-6">
      <div className="paper-shimmer h-4 w-24 rounded-full" />
      <div className="paper-shimmer mt-4 h-6 w-3/4 rounded" />
      <div className="paper-shimmer mt-3 h-4 w-full rounded" />
      <div className="paper-shimmer mt-2 h-4 w-5/6 rounded" />
      <div className="paper-shimmer mt-5 h-8 w-32 rounded-full" />
    </div>
  );
}

interface PublicationGridProps {
  documents: Document[], 
  loading?: boolean, 
  layout?: string;
}

export default function PublicationGrid({ documents, loading, layout = 'grid' }: PublicationGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!documents?.length) return null;

  if (layout === 'featured') {
    const [first, ...rest] = documents;
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PublicationCard doc={first} featured />
        {rest.map((d) => (
          <PublicationCard doc={d} />
        ))}
      </div>
    );
  }

  return (
    <div
      data-testid="publications-grid"
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {documents.map((d) => (
        <PublicationCard doc={d} />
      ))}
    </div>
  );
}
