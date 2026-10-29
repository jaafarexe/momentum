/**
 * Date and streak calculation utilities for Daily Momentum Habit Tracker
 */

// Helper to format Date as YYYY-MM-DD in local time
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getTodayDateKey(): string {
  return formatDateKey(new Date());
}

export function formatDisplayDate(dateKey: string): string {
  const date = parseDateKey(dateKey);
  const todayKey = getTodayDateKey();
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = formatDateKey(yesterday);

  if (dateKey === todayKey) {
    return 'Today, ' + date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  if (dateKey === yesterdayKey) {
    return 'Yesterday, ' + date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

// Get consecutive array of last N days ending on targetDate (default today)
export function getRecentDays(count = 7, endDate = new Date()): { dateKey: string; dayName: string; dayNum: number; isToday: boolean }[] {
  const result = [];
  const todayKey = getTodayDateKey();

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(endDate);
    d.setDate(d.getDate() - i);
    const key = formatDateKey(d);
    result.push({
      dateKey: key,
      dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      dayNum: d.getDate(),
      isToday: key === todayKey,
    });
  }
  return result;
}

// Calculate current streak and longest streak for a list of completed dates
export function calculateStreaks(completedDates: string[]): { currentStreak: number; longestStreak: number } {
  if (!completedDates || completedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const sortedDates = Array.from(new Set(completedDates)).sort();
  const dateSet = new Set(sortedDates);
  const todayKey = getTodayDateKey();

  // Current Streak Calculation:
  // Can be active if completed today, OR if completed yesterday and today is still in progress
  let currentStreak = 0;
  const cursor = new Date();
  const isCompletedToday = dateSet.has(todayKey);

  if (isCompletedToday) {
    currentStreak++;
    cursor.setDate(cursor.getDate() - 1);
  } else {
    // Check if yesterday was completed; if so, streak continues up to yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = formatDateKey(yesterday);
    if (dateSet.has(yesterdayKey)) {
      cursor.setDate(cursor.getDate() - 1);
    } else {
      // Neither today nor yesterday was done => streak broken
      cursor.setDate(cursor.getDate() - 2);
    }
  }

  // Count backwards from cursor
  while (true) {
    const key = formatDateKey(cursor);
    if (dateSet.has(key)) {
      if (!isCompletedToday && currentStreak === 0) {
        // counted first day (yesterday)
        currentStreak++;
      } else if (isCompletedToday || currentStreak > 0) {
        currentStreak++;
      }
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  // Longest Streak Calculation:
  let longestStreak = 0;
  let runningStreak = 0;
  let previousDate: Date | null = null;

  for (const dateStr of sortedDates) {
    const currentDate = parseDateKey(dateStr);
    if (!previousDate) {
      runningStreak = 1;
    } else {
      const diffTime = currentDate.getTime() - previousDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        runningStreak++;
      } else if (diffDays > 1) {
        runningStreak = 1;
      }
    }
    previousDate = currentDate;
    if (runningStreak > longestStreak) {
      longestStreak = runningStreak;
    }
  }

  // Longest streak must be at least as large as current streak
  longestStreak = Math.max(longestStreak, currentStreak);

  return { currentStreak, longestStreak };
}

// Generate all calendar cells for a given month and year
export interface CalendarDay {
  dateKey: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isFuture: boolean;
}

export function getMonthDays(year: number, monthIndex: number): CalendarDay[] {
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const totalDays = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay(); // 0 is Sunday

  const todayKey = getTodayDateKey();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days: CalendarDay[] = [];

  // Previous month trailing days
  const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(year, monthIndex - 1, prevMonthLastDay - i);
    const key = formatDateKey(d);
    d.setHours(0, 0, 0, 0);
    days.push({
      dateKey: key,
      dayNumber: prevMonthLastDay - i,
      isCurrentMonth: false,
      isToday: key === todayKey,
      isFuture: d > today,
    });
  }

  // Current month days
  for (let i = 1; i <= totalDays; i++) {
    const d = new Date(year, monthIndex, i);
    const key = formatDateKey(d);
    d.setHours(0, 0, 0, 0);
    days.push({
      dateKey: key,
      dayNumber: i,
      isCurrentMonth: true,
      isToday: key === todayKey,
      isFuture: d > today,
    });
  }

  // Next month leading days to fill out full grid (42 cells = 6 rows)
  const remainingCells = 42 - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    const d = new Date(year, monthIndex + 1, i);
    const key = formatDateKey(d);
    d.setHours(0, 0, 0, 0);
    days.push({
      dateKey: key,
      dayNumber: i,
      isCurrentMonth: false,
      isToday: key === todayKey,
      isFuture: d > today,
    });
  }

  return days;
}

// Get the Monday-to-Sunday current week dates
export function getCurrentWeekDates(): string[] {
  const now = new Date();
  const currentDayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon ...
  const distanceToMonday = (currentDayOfWeek + 6) % 7; // 0 if Mon, 6 if Sun

  const monday = new Date(now);
  monday.setDate(now.getDate() - distanceToMonday);

  const weekKeys: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekKeys.push(formatDateKey(d));
  }
  return weekKeys;
}
