import { BookOpen, FileText, FolderKanban, Image as ImageIcon, ScrollText } from 'lucide-react';

export const DOCUMENT_TYPES = [
    {
        value: 'article',
        label: 'Article',
        icon: FileText,
        badgeClass: 'bg-type-article-bg text-type-article-fg',
        accent: 'from-orange-200/40 to-transparent',
    },
    {
        value: 'book_chapter',
        label: 'Book Chapter',
        icon: BookOpen,
        badgeClass: 'bg-type-book-bg text-type-book-fg',
        accent: 'from-amber-200/40 to-transparent',
    },
    {
        value: 'project',
        label: 'Project',
        icon: FolderKanban,
        badgeClass: 'bg-type-project-bg text-type-project-fg',
        accent: 'from-teal-200/40 to-transparent',
    },
    {
        value: 'short_story',
        label: 'Short Story',
        icon: ScrollText,
        badgeClass: 'bg-type-story-bg text-type-story-fg',
        accent: 'from-purple-200/40 to-transparent',
    },
    {
        value: 'image',
        label: 'Image',
        icon: ImageIcon,
        badgeClass: 'bg-type-image-bg text-type-image-fg',
        accent: 'from-sky-200/40 to-transparent',
    },
];

export const TYPE_MAP = DOCUMENT_TYPES.reduce((acc, t) => {
    acc[t.value] = t;
    return acc;
}, {});

export const getTypeMeta = (type) => TYPE_MAP[type] || TYPE_MAP.article;
