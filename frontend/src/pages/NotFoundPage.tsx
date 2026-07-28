import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import EmptyState from '../components/EmptyState.tsx';

export default function NotFoundPage() {
  return (
    <div className="paper-container max-w-2xl py-24">
      <EmptyState
        title="This shelf is empty"
        description="We couldn't find the page you were looking for."
        icon={Compass}
        testId="not-found"
        action={
          <Link to="/" className="paper-btn-primary">
            Back to library
          </Link>
        }
      />
    </div>
  );
}
