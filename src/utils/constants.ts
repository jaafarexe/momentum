import { HabitCategory, HabitColor, HabitIconName } from '../types/habit';

export const HABIT_CATEGORIES: HabitCategory[] = [
  'Health',
  'Fitness',
  'Learning',
  'Mindfulness',
  'Productivity',
  'Lifestyle',
];

export const HABIT_COLORS: HabitColor[] = [
  {
    id: 'emerald',
    name: 'Emerald Green',
    primary: '#059669', // emerald-600
    bgLight: '#ecfdf5', // emerald-50
    border: '#a7f3d0', // emerald-200
    text: '#065f46', // emerald-800
    accent: '#10b981', // emerald-500
  },
  {
    id: 'forest',
    name: 'Forest Green',
    primary: '#15803d', // green-700
    bgLight: '#f0fdf4', // green-50
    border: '#bbf7d0', // green-200
    text: '#14532d', // green-900
    accent: '#22c55e', // green-500
  },
  {
    id: 'mint',
    name: 'Mint Teal',
    primary: '#0d9488', // teal-600
    bgLight: '#f0fdfa', // teal-50
    border: '#99f6e4', // teal-200
    text: '#115e59', // teal-800
    accent: '#14b8a6', // teal-500
  },
  {
    id: 'sage',
    name: 'Sage Olive',
    primary: '#4d7c0f', // lime-700
    bgLight: '#f7fee7', // lime-50
    border: '#d9f99d', // lime-200
    text: '#365314', // lime-900
    accent: '#65a30d', // lime-600
  },
  {
    id: 'pine',
    name: 'Deep Pine',
    primary: '#064e3b', // emerald-900
    bgLight: '#f2fbf6',
    border: '#86efac',
    text: '#022c22',
    accent: '#059669',
  },
  {
    id: 'sky',
    name: 'Sky Cyan',
    primary: '#0284c7', // sky-600
    bgLight: '#f0f9ff', // sky-50
    border: '#bae6fd', // sky-200
    text: '#0369a1', // sky-800
    accent: '#0ea5e9', // sky-500
  },
  {
    id: 'amber',
    name: 'Amber Gold',
    primary: '#d97706', // amber-600
    bgLight: '#fffbeb', // amber-50
    border: '#fde68a', // amber-200
    text: '#92400e', // amber-800
    accent: '#f59e0b', // amber-500
  },
];

export const HABIT_ICONS: { name: HabitIconName; label: string }[] = [
  { name: 'droplets', label: 'Water' },
  { name: 'book', label: 'Reading' },
  { name: 'dumbbell', label: 'Exercise' },
  { name: 'sun', label: 'Morning' },
  { name: 'brain', label: 'Mind' },
  { name: 'heart', label: 'Health' },
  { name: 'target', label: 'Focus' },
  { name: 'sparkles', label: 'Habit' },
  { name: 'flame', label: 'Streak' },
  { name: 'coffee', label: 'Routine' },
  { name: 'moon', label: 'Sleep' },
  { name: 'footprints', label: 'Steps' },
  { name: 'pencil', label: 'Journal' },
  { name: 'apple', label: 'Nutrition' },
  { name: 'bike', label: 'Outdoors' },
];

export function getColorById(id: string): HabitColor {
  return HABIT_COLORS.find(c => c.id === id) || HABIT_COLORS[0];
}
