import { useEffect, useMemo, useRef, useState } from 'react';
import { UploadCloud, X, FileText, FileTextIcon, BookOpen, Boxes, Feather, Image as ImageIcon, } from 'lucide-react';
import { DOCUMENT_TYPES, formatBytes, classNames } from '@/utils/format.js';
import { listCategories } from '@/api/categories.js';

const ICONS = {
  article: FileTextIcon,
  book_chapter: BookOpen,
  project: Boxes,
  short_story: Feather,
  image: ImageIcon,
};

type ValidationErrors = {
  type?: string;
  title?: string;
  description?: string;
  categoryId?: string;
  file?: string;
};

export default function UploadForm({ onSubmit, submitting }) {
  const [type, setType] = useState('article');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const fileInputRef = useRef(null);
  const catBoxRef = useRef(null);

  useEffect(() => {
    listCategories({ limit: 100, sort: 'value' })
      .then((res) => setCategories(res.items || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (catBoxRef.current && !catBoxRef.current.contains(e.target)) {
        setCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const filteredCategories = useMemo(() => {
    const q = categorySearch.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (c) =>
        c.value.toLowerCase().includes(q) || c.key.toLowerCase().includes(q),
    );
  }, [categorySearch, categories]);

  const chosenCategory = categories.find((c) => String(c.id) === String(categoryId));

  const validate = () => {
    const e: ValidationErrors = {};
    if (!type) e.type = 'Please choose a document type';
    if (!title.trim()) e.title = 'Give your document a title';
    if (!description.trim()) e.description = 'Add a short description';
    if (!categoryId) e.categoryId = 'Choose a category';
    if (!file) e.file = 'Attach a file';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const form = new FormData();
    form.append('type', type);
    form.append('title', title.trim());
    form.append('description', description.trim());
    form.append('categoryId', categoryId);
    form.append('file', file);
    onSubmit(form);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };

  return (
    <form
      onSubmit={handleSubmit}
      data-testid="upload-form"
      className="paper-card space-y-7 p-7 sm:p-8"
    >
      <div>
        <p className="paper-label">
          Document type <span className="text-accent">*</span>
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {DOCUMENT_TYPES.map((t) => {
            const Icon = ICONS[t.key];
            const active = type === t.key;
            return (
              <button
                type="button"
                key={t.key}
                onClick={() => setType(t.key)}
                data-testid={`upload-type-${t.key}`}
                className={classNames(
                  'paper-chip',
                  active && 'paper-chip-active',
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
        {errors.type && <FieldError message={errors.type} />}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="up-title" className="paper-label">
            Title <span className="text-accent">*</span>
          </label>
          <span className="text-xs text-muted-foreground">{title.length}/120</span>
        </div>
        <input
          id="up-title"
          data-testid="upload-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, 120))}
          placeholder="Give your document a clear, memorable title"
          className="paper-input mt-2"
        />
        {errors.title && <FieldError message={errors.title} />}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="up-desc" className="paper-label">
            Description <span className="text-accent">*</span>
          </label>
          <span className="text-xs text-muted-foreground">
            {description.length}/500
          </span>
        </div>
        <textarea
          id="up-desc"
          data-testid="upload-description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, 500))}
          placeholder="A short summary so readers know what to expect"
          className="paper-textarea mt-2 resize-none"
        />
        {errors.description && <FieldError message={errors.description} />}
      </div>

      <div ref={catBoxRef} className="relative">
        <label className="paper-label">
          Category <span className="text-accent">*</span>
        </label>
        <button
          type="button"
          onClick={() => setCategoryOpen((o) => !o)}
          data-testid="upload-category-trigger"
          className="paper-input mt-2 flex items-center justify-between text-left"
        >
          <span className={chosenCategory ? '' : 'text-muted-foreground'}>
            {chosenCategory
              ? `${chosenCategory.value} · ${chosenCategory.key}`
              : 'Select a category'}
          </span>
          <span className="text-xs text-muted-foreground">
            {categories.length} available
          </span>
        </button>
        {categoryOpen && (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl">
            <div className="border-b border-border p-2">
              <input
                autoFocus
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="Search categories…"
                className="w-full rounded-full bg-secondary px-4 py-2 text-sm outline-none placeholder:text-muted-foreground"
                data-testid="upload-category-search"
              />
            </div>
            <div className="max-h-60 overflow-y-auto py-1">
              {filteredCategories.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No categories match. Create one in Categories.
                </div>
              )}
              {filteredCategories.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => {
                    setCategoryId(String(c.id));
                    setCategoryOpen(false);
                  }}
                  data-testid={`upload-category-option-${c.key}`}
                  className={classNames(
                    'flex w-full items-center justify-between px-4 py-2.5 text-sm transition hover:bg-secondary',
                    String(c.id) === String(categoryId) && 'bg-secondary',
                  )}
                >
                  <span className="font-medium">{c.value}</span>
                  <span className="text-xs text-muted-foreground">{c.key}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {errors.categoryId && <FieldError message={errors.categoryId} />}
      </div>

      <div>
        <p className="paper-label">
          File <span className="text-accent">*</span>
        </p>
        {!file ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            data-testid="upload-file-dropzone"
            className={classNames(
              'mt-3 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/40 px-6 py-12 text-center transition',
              dragging && 'border-accent bg-accent/5',
            )}
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-muted text-muted-foreground">
              <UploadCloud className="h-5 w-5" />
            </span>
            <p className="mt-3 text-sm">
              Drop your file here, or{' '}
              <span className="text-accent underline">browse</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              PDF, TXT, MD, PNG, JPG — anything readable is welcome. Max 25 MB.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              data-testid="upload-file-input"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setFile(f);
              }}
            />
          </div>
        ) : (
          <div
            data-testid="upload-file-selected"
            className="mt-3 flex items-center justify-between rounded-2xl border border-border bg-secondary/40 px-4 py-3"
          >
            <div className="flex items-center gap-3 truncate">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-muted text-muted-foreground">
                <FileText className="h-4 w-4" />
              </span>
              <div className="truncate">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(file.size)} · {file.type || 'unknown'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-muted-foreground transition hover:text-foreground"
              aria-label="Remove file"
              data-testid="upload-file-remove"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        {errors.file && <FieldError message={errors.file} />}
      </div>

      <div className="flex items-center justify-end border-t border-border pt-6">
        <button
          type="submit"
          disabled={submitting}
          data-testid="upload-submit"
          className="paper-btn-accent"
        >
          <UploadCloud className="h-3.5 w-3.5" />
          {submitting ? 'Publishing…' : 'Publish document'}
        </button>
      </div>
    </form>
  );
}

function FieldError({ message }) {
  return (
    <p className="mt-2 text-xs text-destructive" role="alert">
      {message}
    </p>
  );
}
