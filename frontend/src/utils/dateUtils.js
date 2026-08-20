import { format, differenceInDays, isToday, isTomorrow, isPast } from 'date-fns';

/**
 * Safely parses "YYYY-MM-DD" string into a local Date object without timezone shift bugs
 */
export const parseReleaseDate = (dateString) => {
  if (!dateString) return null;
  const parts = dateString.split('-');
  if (parts.length !== 3) return new Date(dateString);
  const year = parseInt(parts[0], 10);
  const monthIndex = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JS
  const day = parseInt(parts[2], 10);
  return new Date(year, monthIndex, day);
};

/**
 * Formats date into readable strings like "Nov 24, 2026" or "Tuesday, Nov 24"
 */
export const formatDisplayDate = (dateString, formatStr = 'MMM d, yyyy') => {
  const parsed = parseReleaseDate(dateString);
  if (!parsed || isNaN(parsed)) return 'Release Date TBA';
  return format(parsed, formatStr);
};

/**
 * Generates human-friendly countdown strings like "Today", "Tomorrow", "In 14 days"
 */
export const getCountdownLabel = (dateString) => {
  const parsed = parseReleaseDate(dateString);
  if (!parsed || isNaN(parsed)) return { text: 'TBA', urgent: false };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  parsed.setHours(0, 0, 0, 0);

  if (isToday(parsed)) {
    return { text: 'Releasing Today!', urgent: true, highlight: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
  }
  if (isTomorrow(parsed)) {
    return { text: 'Releasing Tomorrow', urgent: true, highlight: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
  }
  if (isPast(parsed)) {
    return { text: 'Recently Released', urgent: false, highlight: 'bg-slate-800 text-slate-400 border-slate-700' };
  }

  const daysLeft = differenceInDays(parsed, today);
  if (daysLeft <= 7) {
    return { text: `In ${daysLeft} days`, urgent: true, highlight: 'bg-brand-accent/20 text-rose-300 border-brand-accent/40' };
  }
  if (daysLeft <= 30) {
    const weeks = Math.ceil(daysLeft / 7);
    return { text: `In ~${weeks} weeks`, urgent: false, highlight: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
  }

  const months = Math.ceil(daysLeft / 30);
  return { text: `In ~${months} months`, urgent: false, highlight: 'bg-slate-800/80 text-slate-300 border-slate-700' };
};

/**
 * Groups a flat array of content items by "Month Year" (e.g., "October 2026", "November 2026")
 */
export const groupContentByMonth = (items = []) => {
  const groups = {};

  items.forEach((item) => {
    if (!item.release_date) {
      const key = 'Release Date Unannounced';
      if (!groups[key]) groups[key] = { title: key, items: [] };
      groups[key].items.push(item);
      return;
    }

    const parsed = parseReleaseDate(item.release_date);
    const groupKey = format(parsed, 'MMMM yyyy'); // e.g. "November 2026"

    if (!groups[groupKey]) {
      groups[groupKey] = {
        title: groupKey,
        monthDate: parsed,
        items: []
      };
    }
    groups[groupKey].items.push(item);
  });

  return Object.values(groups);
};