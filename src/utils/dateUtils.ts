export const getGreetingTime = (): string => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 22) return 'Good Evening';
  return 'Good Night';
};

export const formatCurrentDate = (): { dayName: string; dayNumber: number; monthYear: string; fullDate: string } => {
  const now = new Date();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
  const dayNumber = now.getDate();
  const monthYear = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const fullDate = now.toISOString().split('T')[0];
  return { dayName, dayNumber, monthYear, fullDate };
};

export const formatRelativeTime = (timestampStr: string): string => {
  try {
    const date = new Date(timestampStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
};

export const formatDueCountdown = (dueDateStr?: string): { text: string; colorClass: string; isPast: boolean } => {
  if (!dueDateStr) return { text: 'No date', colorClass: 'bg-slate-100 text-slate-600', isPast: false };
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dueDateStr);
  target.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: `${Math.abs(diffDays)}d overdue`, colorClass: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300', isPast: true };
  }
  if (diffDays === 0) {
    return { text: 'Today', colorClass: 'bg-sand-200 text-sand-800 dark:bg-sand-900/40 dark:text-sand-300', isPast: false };
  }
  if (diffDays === 1) {
    return { text: 'Tomorrow', colorClass: 'bg-lavender-100 text-lavender-700 dark:bg-lavender-950/40 dark:text-lavender-300', isPast: false };
  }
  return { text: `${diffDays} days left`, colorClass: 'bg-sage-100 text-sage-700 dark:bg-sage-950/40 dark:text-sage-300', isPast: false };
};
