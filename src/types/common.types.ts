export type NavTab = 'home' | 'todo' | 'notes' | 'goals' | 'calendar' | 'mood' | 'settings';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  dailyQuote: string;
  themePreference: ThemeMode;
}

export interface QuoteItem {
  text: string;
  author?: string;
}
