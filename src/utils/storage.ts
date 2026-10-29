import { Habit, HabitCompletionsMap } from '../types/habit';
import { formatDateKey } from './dateUtils';

const STORAGE_KEY_HABITS = 'daily_momentum_habits_v1';
const STORAGE_KEY_COMPLETIONS = 'daily_momentum_completions_v1';

// Helper to generate past dates relative to today
function getPastDateKey(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return formatDateKey(d);
}

export function getDefaultHabits(): Habit[] {
  return [
    {
      id: 'habit-water',
      title: 'Drink Water',
      description: 'Drink 2.5 liters throughout the day for focus and vitality',
      category: 'Health',
      colorId: 'mint',
      icon: 'droplets',
      targetPerWeek: 7,
      createdAt: getPastDateKey(30),
    },
    {
      id: 'habit-reading',
      title: 'Read 20 Minutes',
      description: 'Read high-signal books or essays before bedtime',
      category: 'Learning',
      colorId: 'emerald',
      icon: 'book',
      targetPerWeek: 7,
      createdAt: getPastDateKey(25),
    },
    {
      id: 'habit-exercise',
      title: 'Exercise',
      description: '30-minute cardio, strength training, or brisk movement',
      category: 'Fitness',
      colorId: 'forest',
      icon: 'dumbbell',
      targetPerWeek: 5,
      createdAt: getPastDateKey(20),
    },
    {
      id: 'habit-meditation',
      title: 'Morning Meditation',
      description: '10 minutes of quiet box breathing and clear grounding',
      category: 'Mindfulness',
      colorId: 'sage',
      icon: 'sun',
      targetPerWeek: 7,
      createdAt: getPastDateKey(21),
    },
  ];
}

export function getDefaultCompletions(): HabitCompletionsMap {
  // Pre-fill realistic momentum
  return {
    'habit-water': [
      getPastDateKey(0), // Today
      getPastDateKey(1), // Yesterday
      getPastDateKey(2),
      getPastDateKey(3),
      getPastDateKey(4),
      getPastDateKey(6),
      getPastDateKey(7),
      getPastDateKey(8),
      getPastDateKey(9),
      getPastDateKey(10),
      getPastDateKey(11),
      getPastDateKey(12),
      getPastDateKey(15),
      getPastDateKey(16),
      getPastDateKey(18),
    ],
    'habit-reading': [
      getPastDateKey(1), // Yesterday (awaiting check today!)
      getPastDateKey(2),
      getPastDateKey(3),
      getPastDateKey(4),
      getPastDateKey(6),
      getPastDateKey(7),
      getPastDateKey(8),
      getPastDateKey(10),
      getPastDateKey(11),
      getPastDateKey(13),
      getPastDateKey(14),
    ],
    'habit-exercise': [
      getPastDateKey(1), // Yesterday
      getPastDateKey(2),
      getPastDateKey(3),
      getPastDateKey(5),
      getPastDateKey(6),
      getPastDateKey(7),
      getPastDateKey(9),
      getPastDateKey(10),
      getPastDateKey(12),
    ],
    'habit-meditation': [
      getPastDateKey(0), // Today
      getPastDateKey(1),
      getPastDateKey(2),
      getPastDateKey(3),
      getPastDateKey(4),
      getPastDateKey(5),
      getPastDateKey(6),
      getPastDateKey(8),
      getPastDateKey(9),
      getPastDateKey(10),
      getPastDateKey(11),
      getPastDateKey(12),
      getPastDateKey(13),
    ],
  };
}

export function loadHabitsFromStorage(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HABITS);
    if (!raw) {
      const defaults = getDefaultHabits();
      saveHabitsToStorage(defaults);
      return defaults;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const defaults = getDefaultHabits();
      saveHabitsToStorage(defaults);
      return defaults;
    }
    return parsed;
  } catch (e) {
    console.error('Failed to load habits from storage:', e);
    return getDefaultHabits();
  }
}

export function saveHabitsToStorage(habits: Habit[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(habits));
  } catch (e) {
    console.error('Failed to save habits to storage:', e);
  }
}

export function loadCompletionsFromStorage(): HabitCompletionsMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPLETIONS);
    if (!raw) {
      const defaults = getDefaultCompletions();
      saveCompletionsToStorage(defaults);
      return defaults;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load completions from storage:', e);
    return getDefaultCompletions();
  }
}

export function saveCompletionsToStorage(completions: HabitCompletionsMap): void {
  try {
    localStorage.setItem(STORAGE_KEY_COMPLETIONS, JSON.stringify(completions));
  } catch (e) {
    console.error('Failed to save completions to storage:', e);
  }
}

export function resetToDemoData(): { habits: Habit[]; completions: HabitCompletionsMap } {
  const habits = getDefaultHabits();
  const completions = getDefaultCompletions();
  saveHabitsToStorage(habits);
  saveCompletionsToStorage(completions);
  return { habits, completions };
}
