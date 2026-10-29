export type HabitCategory = 
  | 'Health'
  | 'Fitness'
  | 'Learning'
  | 'Mindfulness'
  | 'Productivity'
  | 'Lifestyle';

export interface HabitColor {
  id: string;
  name: string;
  primary: string; // e.g. '#059669' (emerald-600)
  bgLight: string; // e.g. '#ecfdf5' (emerald-50)
  border: string; // e.g. '#a7f3d0' (emerald-200)
  text: string; // e.g. '#065f46' (emerald-800)
  accent: string; // e.g. '#10b981' (emerald-500)
}

export type HabitIconName =
  | 'droplets'
  | 'book'
  | 'dumbbell'
  | 'sun'
  | 'brain'
  | 'heart'
  | 'moon'
  | 'sparkles'
  | 'flame'
  | 'target'
  | 'coffee'
  | 'footprints'
  | 'pencil'
  | 'apple'
  | 'bike';

export interface Habit {
  id: string;
  title: string;
  description?: string;
  category: HabitCategory;
  colorId: string;
  icon: HabitIconName;
  targetPerWeek: number; // e.g. 7 for every day, 5 for weekdays
  createdAt: string; // YYYY-MM-DD
  archived?: boolean;
}

// Completed date strings in YYYY-MM-DD format
export type HabitCompletionsMap = Record<string, string[]>; // habitId -> array of completed 'YYYY-MM-DD' dates

export interface HabitWithStats extends Habit {
  currentStreak: number;
  longestStreak: number;
  completedToday: boolean;
  totalCompletions: number;
  weeklyCompletions: number;
  weeklyTarget: number;
}
