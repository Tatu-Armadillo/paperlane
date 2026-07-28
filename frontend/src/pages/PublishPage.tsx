import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import UploadForm from '../components/UploadForm.tsx';
import { useState } from 'react';
import { createDocument } from '../api/documents.ts';
import { useToast } from '../hooks/useToast.tsx';

export default function PublishPage() {
  const [submitting, setSubmitting] = useState(false);
  const nav = useNavigate();
  const { push } = useToast();

  const onSubmit = async (form) => {
    setSubmitting(true);
    try {
      const doc = await createDocument(form);
      push({
        variant: 'success',
        title: 'Published',
        description: `${doc.title} is now on the shelf.`,
      });
      nav(`/documents/${doc.id}`);
    } catch (e) {
      push({
        variant: 'error',
        title: 'Could not publish',
        description: e.paperlaneMessage || 'Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="paper-container max-w-3xl py-14 md:py-20">
      <Link
        to="/home"
        data-testid="publish-back"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to library
      </Link>

      <div className="mt-6">
        <p className="paper-eyebrow text-accent">Publish</p>
        <h1 className="mt-2 font-display text-4xl font-semibold leading-tight sm:text-5xl">
          Share your document with the library.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
          Add a title, a short description, choose a type and drop your file.
          Once submitted, your document will live at its own permanent URL for
          readers to preview or download.
        </p>
      </div>

      <div className="mt-10">
        <UploadForm onSubmit={onSubmit} submitting={submitting} />
      </div>
    </div>
  );
}
