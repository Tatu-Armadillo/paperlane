export function createPageUrl(pageName: string) {
    return '/' + pageName.replace(/ /g, '-');
}

/**
 * Converts a "date-only" ISO string (YYYY-MM-DD) into a Date in local timezone
 * without the usual UTC midnight -> -1 day shift.
 *
 * If the input doesn't match the expected format, falls back to `new Date(value)`.
 */
export function parseDateOnly(value?: string | null): Date | null {
    if (!value) return null;
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) {
        const d = new Date(value);
        return isNaN(d.getTime()) ? null : d;
    }

    const year = Number(match[1]);
    const monthIndex = Number(match[2]) - 1;
    const day = Number(match[3]);

    return new Date(year, monthIndex, day, 0, 0, 0, 0);
}

/** Local calendar date as YYYY-MM-DD (same convention as DateInput / API date-only fields). */
export function formatDateOnlyLocal(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

/** True if the calendar day is today or in the future (local timezone). */
export function isDateTodayOrFuture(isoDate: string): boolean {
    if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return false;
    const today = formatDateOnlyLocal(new Date());
    return isoDate >= today;
}