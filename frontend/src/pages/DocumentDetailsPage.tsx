import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Eye, Calendar, Trash2 } from 'lucide-react';
import { getDocument, deleteDocument, downloadUrl, previewUrl } from '../api/documents.ts';
import { formatDate, readTimeFromText, formatBytes } from '../utils/format.js';
import TypeBadge from '../components/TypeBadge.tsx';
import DocumentViewer from '../components/DocumentViewer.tsx';
import Loading from '../components/Loading.tsx';
import EmptyState from '../components/EmptyState.tsx';
import Modal from '../components/Modal.tsx';
import { useToast } from '../hooks/useToast.tsx';
import { Document } from '@/api/interfaces/Documents.ts';

export default function DocumentDetailsPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { push } = useToast();
  const [doc, setDoc] = useState<Document>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    getDocument(id)
      .then(setDoc)
      .catch((e) => setError(e.paperlaneMessage || 'Not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const onDelete = async () => {
    setDeleting(true);
    try {
      await deleteDocument(id);
      push({ variant: 'success', title: 'Document removed from the library.' });
      nav('/');
    } catch (e) {
      push({
        variant: 'error',
        title: 'Could not delete',
        description: e.paperlaneMessage,
      });
    } finally {
      setDeleting(false);
      setConfirm(false);
    }
  };

  if (loading) return <Loading label="Fetching document…" />;

  if (error || !doc) {
    return (
      <div className="paper-container max-w-3xl py-20">
        <EmptyState
          title="This document doesn't exist"
          description={error || 'It may have been removed from the library.'}
          action={
            <Link to="/home" className="paper-btn-primary">
              Back to library
            </Link>
          }
          testId="document-not-found"
        />
      </div>
    );
  }

  const readMeta = doc.isText
    ? readTimeFromText(doc.textContent || '')
    : `${formatBytes(doc.fileSize)}`;

  return (
    <article className="paper-container max-w-4xl py-14 md:py-20">
      <Link
        to="/home"
        data-testid="doc-back"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to library
      </Link>

      <header className="mt-6 border-b border-border pb-10">
        <div className="flex flex-wrap items-center gap-2">
          <TypeBadge type={doc.type} size="md" />
          <span className="paper-chip">{doc.category?.value}</span>
        </div>
        <h1
          data-testid="document-title"
          className="mt-6 font-display text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl"
        >
          {doc.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {doc.description}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Published {formatDate(doc.createdAt)}
          </span>
          {readMeta && <span>· {readMeta}</span>}
          <span>· {doc.originalFilename}</span>
        </div>
      </header>

      <div className="sticky top-16 z-20 -mx-6 mt-6 border-b border-border/60 bg-background/80 px-6 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            The reading room
          </span>
          <div className="flex flex-wrap gap-2">
            <a
              href={previewUrl(doc.id)}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="doc-preview-btn"
              className="paper-btn-ghost"
            >
              <Eye className="h-3.5 w-3.5" />
              Open preview
            </a>
            <a
              href={downloadUrl(doc.id)}
              data-testid="doc-download-btn"
              className="paper-btn-accent"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </a>
            <button
              type="button"
              onClick={() => setConfirm(true)}
              data-testid="doc-delete-btn"
              className="paper-btn-ghost text-destructive hover:!bg-destructive/10"
              title="Remove from library"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <DocumentViewer doc={doc} />
      </div>

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Remove this document?"
        testId="doc-delete-modal"
        footer={
          <>
            <button
              type="button"
              onClick={() => setConfirm(false)}
              className="paper-btn-ghost"
              data-testid="doc-delete-cancel"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              data-testid="doc-delete-confirm"
              className="paper-btn bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Removing…' : 'Remove permanently'}
            </button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          This will delete <span className="font-medium">{doc.title}</span> and
          its file from the library. This action cannot be undone.
        </p>
      </Modal>
    </article>
  );
}
