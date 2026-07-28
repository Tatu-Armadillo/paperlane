export function classNames(...values) {
  return values.filter(Boolean).join(' ');
}

export const DOCUMENT_TYPES = [
  { key: 'article', label: 'Article', icon: 'FileText' },
  { key: 'book_chapter', label: 'Book Chapter', icon: 'BookOpen' },
  { key: 'project', label: 'Project', icon: 'Boxes' },
  { key: 'short_story', label: 'Short Story', icon: 'Feather' },
  { key: 'image', label: 'Image', icon: 'Image' },
];

export const TYPE_LABEL_BY_KEY = DOCUMENT_TYPES.reduce(
  (acc, t) => ({ ...acc, [t.key]: t.label }),
  {},
);

export const TYPE_TOKEN_BY_KEY = {
  article: 'article',
  book_chapter: 'book',
  project: 'project',
  short_story: 'story',
  image: 'image',
};

export function formatDate(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

export function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let n = bytes;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i += 1;
  }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

export function readTimeFromText(text) {
  if (!text) return null;
  const words = text.trim().split(/\s+/).length;
  const min = Math.max(1, Math.round(words / 220));
  return `${min} min read`;
}
