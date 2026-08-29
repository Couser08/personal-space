export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

export interface FocusSession {
  id: string;
  userId: string;
  durationMinutes: number;
  sessionType: string;
  completedAt: string;
}

export interface FocusTimerState {
  mode: TimerMode;
  timeLeftSeconds: number;
  isRunning: boolean;
  totalCompletedToday: number;
}
