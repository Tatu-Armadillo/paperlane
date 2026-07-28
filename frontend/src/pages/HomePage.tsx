import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '@/components/Hero.tsx';
import SearchBar from '@/components/SearchBar.tsx';
import TypeFilter from '@/components/TypeFilter.tsx';
import CategoryFilter from '@/components/CategoryFilter.tsx';
import PublicationGrid from '@/components/PublicationGrid';
import Pagination from '@/components/Pagination.tsx';
import EmptyState from '@/components/EmptyState.tsx';
import { listDocuments } from '@/api/documents.ts';
import { listCategories } from '@/api/categories.js';
import { Document } from '@/api/interfaces/Documents';
import { PenLine, LibraryBig } from 'lucide-react';
import { Category } from '@/api/interfaces/Category';

const PAGE_SIZE = 6;

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [type, setType] = useState('all');
  const [categoryId, setCategoryId] = useState(null);
  const [page, setPage] = useState(1);

  const [categories, setCategories] = useState([] as Category[]);
  const [data, setData] = useState({ items: [], totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    listCategories({ limit: 100, sort: 'value' })
      .then((res) => setCategories(res.items || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, type, categoryId]);

  const params = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      title: debouncedSearch || undefined,
      type: type !== 'all' ? type : undefined,
      categoryId: categoryId || undefined,
      sort: 'createdAt',
      order: 'DESC',
    }),
    [page, debouncedSearch, type, categoryId],
  );

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    listDocuments(params)
      .then((res) => setData(res))
      .catch((e) => setError(e.paperlaneMessage || 'Failed to load'))
      .finally(() => setLoading(false));
  }, [params]);

  useEffect(() => {
    load();
  }, [load]);

  const hasFilters = debouncedSearch || type !== 'all' || categoryId;
  const showEmpty = !loading && data.items.length === 0;

  return (
    <>
      <Hero />

      <section
        id="library"
        data-testid="library-section"
        className="paper-container py-16 md:py-20"
      >
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="paper-eyebrow">The library</p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
              Every document, ready to read.
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Filter by type, search by title. Preview inside the page or
            download the original file with one click.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search documents by title…"
              />
            </div>
            <CategoryFilter
              value={categoryId}
              onChange={setCategoryId}
              categories={categories}
              loading={false}
            />
          </div>
          <TypeFilter value={type} onChange={setType} />
        </div>

        <div className="mt-10">
          {error && (
            <EmptyState
              title="Something went wrong"
              description={error}
              icon={LibraryBig}
              testId="empty-error"
              action={
                <button onClick={load} className="paper-btn-primary">
                  Try again
                </button>
              }
            />
          )}
          {!error && loading && (
            <PublicationGrid documents={[] as Document[]} loading />
          )}
          {!error && !loading && showEmpty && (
            <EmptyState
              testId="empty-library"
              icon={hasFilters ? LibraryBig : PenLine}
              title={hasFilters ? 'No matches yet.' : 'Waiting on the backend'}
              description={
                hasFilters
                  ? 'Try clearing filters or a different search term.'
                  : 'The library is ready. Publish your first document and it will appear right here.'
              }
              action={
                <Link to="/publish" className="paper-btn-primary">
                  Publish a document
                </Link>
              }
            />
          )}
          {!error && !loading && data.items.length > 0 && (
            <>
              <PublicationGrid
                documents={data.items}
                layout={page === 1 && !hasFilters ? 'featured' : 'grid'}
              />
              <Pagination
                page={page}
                totalPages={data.totalPages}
                onChange={setPage}
              />
            </>
          )}
        </div>
      </section>
    </>
  );
}
