export type MoodLevel = 'great' | 'good' | 'okay' | 'not_great' | 'bad';

export interface MoodLog {
  id: string;
  userId: string;
  mood: MoodLevel;
  note?: string;
  logDate: string; // YYYY-MM-DD
  createdAt: string;
}

export interface MoodConfig {
  level: MoodLevel;
  label: string;
  emoji: string;
  colorClass: string;
  bgClass: string;
  activeBgClass: string;
}
