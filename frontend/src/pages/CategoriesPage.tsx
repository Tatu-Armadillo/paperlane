import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import { listCategories, createCategory, updateCategory, deleteCategory, } from '../api/categories.js';
import { useToast } from '../hooks/useToast.tsx';
import SearchBar from '../components/SearchBar.tsx';
import Pagination from '../components/Pagination.tsx';
import EmptyState from '../components/EmptyState.tsx';
import Loading from '../components/Loading.tsx';
import Modal from '../components/Modal.tsx';

const PAGE_SIZE = 10;

export default function CategoriesPage() {
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formKey, setFormKey] = useState('');
  const [formValue, setFormValue] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { push } = useToast();

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => setPage(1), [debounced]);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    listCategories({
      page,
      limit: PAGE_SIZE,
      search: debounced || undefined,
      sort: 'value',
    })
      .then(setData)
      .catch((e) => setError(e.paperlaneMessage || 'Failed to load'))
      .finally(() => setLoading(false));
  }, [page, debounced]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setFormKey('');
    setFormValue('');
    setFormErrors({});
    setFormOpen(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setFormKey(c.key);
    setFormValue(c.value);
    setFormErrors({});
    setFormOpen(true);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!formKey.trim()) errs.key = 'Key is required';
    else if (!/^[a-z0-9][a-z0-9\-_]*$/.test(formKey.trim().toLowerCase()))
      errs.key = 'Use lowercase letters, numbers, hyphens or underscores';
    if (!formValue.trim()) errs.value = 'Display name is required';
    setFormErrors(errs);
    if (Object.keys(errs).length) return;
    setSaving(true);
    try {
      const payload = { key: formKey.trim().toLowerCase(), value: formValue.trim() };
      if (editing) {
        await updateCategory(editing.id, payload);
        push({ variant: 'success', title: 'Category updated' });
      } else {
        await createCategory(payload);
        push({ variant: 'success', title: 'Category created' });
      }
      setFormOpen(false);
      load();
    } catch (err) {
      const msg = err.paperlaneMessage || 'Save failed';
      if (msg.toLowerCase().includes('already exists')) {
        setFormErrors({ key: msg });
      } else {
        push({ variant: 'error', title: 'Save failed', description: msg });
      }
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCategory(deleteTarget.id);
      push({ variant: 'success', title: `${deleteTarget.value} removed` });
      setDeleteTarget(null);
      load();
    } catch (err) {
      push({
        variant: 'error',
        title: 'Could not delete',
        description: err.paperlaneMessage,
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="paper-container max-w-5xl py-14 md:py-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="paper-eyebrow text-accent">Categories</p>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Organise the shelves.
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Categories are how readers navigate Paperlane. Create the ones that
            fit your library, rename them anytime, and remove the ones you no
            longer need.
          </p>
        </div>
        <button
          onClick={openCreate}
          data-testid="cat-new-btn"
          className="paper-btn-accent self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          New category
        </button>
      </div>

      <div className="mt-10">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by key or display name…"
          testId="cat-search"
        />
      </div>

      <div className="mt-8">
        {loading && <Loading label="Loading categories…" />}
        {error && !loading && (
          <EmptyState title="Something went wrong" description={error} icon={Tag} action={() => {}} />
        )}
        {!loading && !error && data.items.length === 0 && (
          <EmptyState
            testId="cat-empty"
            icon={Tag}
            title="No categories yet"
            description="Create your first category to start publishing documents."
            action={
              <button onClick={openCreate} className="paper-btn-primary">
                <Plus className="h-3.5 w-3.5" />
                New category
              </button>
            }
          />
        )}
        {!loading && !error && data.items.length > 0 && (
          <div
            data-testid="cat-list"
            className="paper-card divide-y divide-border overflow-hidden"
          >
            {data.items.map((c) => (
              <div
                key={c.id}
                data-testid={`cat-row-${c.key}`}
                className="flex items-center justify-between gap-4 px-6 py-4"
              >
                <div>
                  <p className="font-display text-lg font-semibold">
                    {c.value}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {c.key}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(c)}
                    data-testid={`cat-edit-${c.key}`}
                    className="paper-btn-ghost !px-3 !py-1.5 text-xs"
                    aria-label={`Edit ${c.value}`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(c)}
                    data-testid={`cat-delete-${c.key}`}
                    className="paper-btn-ghost !px-3 !py-1.5 text-xs text-destructive hover:!bg-destructive/10"
                    aria-label={`Delete ${c.value}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <Pagination
          page={page}
          totalPages={data.totalPages}
          onChange={setPage}
          testId="cat-pagination"
        />
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit category' : 'Create category'}
        testId="cat-form-modal"
        footer=''
      >
        <form onSubmit={submitForm} className="space-y-4" data-testid="cat-form">
          <div>
            <label className="paper-label">Key</label>
            <input
              type="text"
              value={formKey}
              onChange={(e) => setFormKey(e.target.value)}
              data-testid="cat-form-key"
              placeholder="e.g. technology"
              className="paper-input mt-2 font-mono text-sm"
              autoFocus
            />
            {formErrors.key && (
              <p className="mt-1 text-xs text-destructive">{formErrors.key}</p>
            )}
          </div>
          <div>
            <label className="paper-label">Display name</label>
            <input
              type="text"
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              data-testid="cat-form-value"
              placeholder="e.g. Technology"
              className="paper-input mt-2"
            />
            {formErrors.value && (
              <p className="mt-1 text-xs text-destructive">{formErrors.value}</p>
            )}
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="paper-btn-ghost"
              data-testid="cat-form-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              data-testid="cat-form-submit"
              className="paper-btn-accent"
            >
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Create category'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete this category?"
        testId="cat-delete-modal"
        footer={
          <>
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="paper-btn-ghost"
              data-testid="cat-delete-cancel"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={deleting}
              data-testid="cat-delete-confirm"
              className="paper-btn bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting…' : 'Delete category'}
            </button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          You are about to delete{' '}
          <span className="font-medium">{deleteTarget?.value}</span>. If any
          documents are still associated with this category, the backend will
          refuse the request and tell you which ones.
        </p>
      </Modal>
    </div>
  );
}
