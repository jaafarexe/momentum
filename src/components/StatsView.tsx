import React from 'react';
import { Flame, Trophy, TrendingUp, CheckCircle, BarChart3 } from 'lucide-react';
import { HabitWithStats, HabitCompletionsMap } from '../types/habit';
import { getCurrentWeekDates, formatDisplayDate, getTodayDateKey, parseDateKey } from '../utils/dateUtils';
import { getColorById } from '../utils/constants';
import { HabitIcon } from './HabitIcon';

interface StatsViewProps {
  habits: HabitWithStats[];
  completionsMap: HabitCompletionsMap;
}

export const StatsView: React.FC<StatsViewProps> = ({ habits, completionsMap }) => {
  const weekDates = getCurrentWeekDates(); // Mon - Sun
  const todayKey = getTodayDateKey();

  // Weekly daily totals
  const dailyStats = weekDates.map(dateKey => {
    let completedCount = 0;
    habits.forEach(h => {
      const dates = completionsMap[h.id] || [];
      if (dates.includes(dateKey)) {
        completedCount++;
      }
    });

    const d = parseDateKey(dateKey);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const isToday = dateKey === todayKey;
    const rate = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

    return {
      dateKey,
      dayName,
      completedCount,
      total: habits.length,
      rate,
      isToday,
    };
  });

  // Calculate overall weekly completion rate
  const totalWeeklyPossible = habits.length * 7;
  const totalWeeklyDone = dailyStats.reduce((sum, d) => sum + d.completedCount, 0);
  const weeklyRate = totalWeeklyPossible > 0 ? Math.round((totalWeeklyDone / totalWeeklyPossible) * 100) : 0;

  // Find longest current streak and best all-time streak among all habits
  let topCurrentStreak = 0;
  let topCurrentStreakHabit = '';
  let bestAllTimeStreak = 0;
  let bestAllTimeStreakHabit = '';

  habits.forEach(h => {
    if (h.currentStreak > topCurrentStreak) {
      topCurrentStreak = h.currentStreak;
      topCurrentStreakHabit = h.title;
    }
    if (h.longestStreak > bestAllTimeStreak) {
      bestAllTimeStreak = h.longestStreak;
      bestAllTimeStreakHabit = h.title;
    }
  });

  // Category breakdown
  const categoryStats: Record<string, { total: number; done: number; habitCount: number }> = {};
  habits.forEach(h => {
    if (!categoryStats[h.category]) {
      categoryStats[h.category] = { total: 0, done: 0, habitCount: 0 };
    }
    categoryStats[h.category].habitCount++;
    categoryStats[h.category].total += 7;

    const dates = completionsMap[h.id] || [];
    const thisWeekDone = weekDates.filter(d => dates.includes(d)).length;
    categoryStats[h.category].done += thisWeekDone;
  });

  return (
    <div className="space-y-6">
      {/* Top 4 KPI metric strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Weekly Momentum</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {weeklyRate}%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {totalWeeklyDone} of {totalWeeklyPossible} planned completions
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <Flame className="w-4 h-4 text-emerald-600 fill-emerald-500/20" />
            <span>Active Streak Leader</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {topCurrentStreak}
            </span>
            <span className="text-xs text-slate-500 font-medium">days</span>
          </div>
          <p className="text-xs text-emerald-700 font-medium truncate mt-1">
            {topCurrentStreakHabit || 'None yet'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Best Streak Record</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {bestAllTimeStreak}
            </span>
            <span className="text-xs text-slate-500 font-medium">days</span>
          </div>
          <p className="text-xs text-slate-500 truncate mt-1">
            {bestAllTimeStreakHabit || 'None yet'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Active Habits</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {habits.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">habits</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Across {Object.keys(categoryStats).length} categories
          </p>
        </div>
      </div>

      {/* 7-Day Weekly Momentum Bar Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Weekly Consistency Chart</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daily habit completion percentage for the current week (Monday – Sunday)
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-3 h-3 rounded bg-emerald-600 inline-block" /> Completed Rate
          </div>
        </div>

        {/* Bar chart grid */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 pt-6 pb-2 border-b border-slate-100">
          {dailyStats.map(stat => {
            const barHeight = Math.max(stat.rate, 4); // min height for visibility
            return (
              <div key={stat.dateKey} className="flex flex-col items-center h-full justify-end group">
                {/* Rate tooltip/label */}
                <span className="text-[11px] font-mono font-medium text-slate-600 mb-1 opacity-80 group-hover:opacity-100">
                  {stat.rate}%
                </span>

                {/* The vertical bar */}
                <div className="w-full max-w-[36px] bg-slate-100 rounded-t-lg h-full flex items-end overflow-hidden">
                  <div
                    className={`w-full transition-all duration-500 ease-out rounded-t-lg ${
                      stat.isToday
                        ? 'bg-emerald-600 shadow-sm'
                        : stat.rate === 100
                        ? 'bg-emerald-500'
                        : stat.rate >= 50
                        ? 'bg-emerald-400'
                        : 'bg-emerald-300'
                    }`}
                    style={{ height: `${barHeight}%` }}
                  />
                </div>

                {/* Day name below */}
                <div className="mt-2 text-center">
                  <div
                    className={`text-xs font-semibold ${
                      stat.isToday ? 'text-emerald-700 font-bold' : 'text-slate-600'
                    }`}
                  >
                    {stat.dayName}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {stat.completedCount}/{stat.total}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Habit-by-Habit Weekly Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Habit Weekly Progress & Streaks
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Individual progress towards weekly targets and day-by-day logs
        </p>

        <div className="space-y-4">
          {habits.map(habit => {
            const dates = completionsMap[habit.id] || [];
            const thisWeekCompletions = weekDates.filter(d => dates.includes(d)).length;
            const progressPercent = Math.min(
              100,
              Math.round((thisWeekCompletions / habit.targetPerWeek) * 100)
            );
            const color = getColorById(habit.colorId);

            return (
              <div
                key={habit.id}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: color.bgLight,
                        color: color.primary,
                        border: `1px solid ${color.border}`,
                      }}
                    >
                      <HabitIcon name={habit.icon} className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{habit.title}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>{habit.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-700 font-medium">
                          {habit.currentStreak} day streak
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>Best: {habit.longestStreak}</span>
                      </div>
                    </div>
                  </div>

                  {/* 7-day mini dot timeline for this habit */}
                  <div className="flex items-center gap-1.5 self-start sm:self-auto">
                    {weekDates.map(dateKey => {
                      const isDone = dates.includes(dateKey);
                      const isToday = dateKey === todayKey;
                      const d = parseDateKey(dateKey);
                      const dayLetter = d.toLocaleDateString('en-US', { weekday: 'narrow' });

                      return (
                        <div
                          key={dateKey}
                          title={`${d.toLocaleDateString()}: ${isDone ? 'Completed' : 'Not done'}`}
                          className="flex flex-col items-center gap-1"
                        >
                          <span className="text-[10px] text-slate-400 uppercase font-medium">
                            {dayLetter}
                          </span>
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs transition-colors ${
                              isDone
                                ? 'bg-emerald-600 text-white font-bold'
                                : 'bg-slate-200/80 text-slate-400'
                            } ${isToday ? 'ring-2 ring-emerald-500/40' : ''}`}
                          >
                            {isDone ? '✓' : ''}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Progress bar towards weekly target */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 font-mono tabular-nums shrink-0">
                    {thisWeekCompletions}/{habit.targetPerWeek} days ({progressPercent}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Performance Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1">Consistency by Category</h3>
        <p className="text-xs text-slate-500 mb-4">
          How reliably you follow through across various life domains
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(categoryStats).map(([cat, stat]) => {
            const catRate = stat.total > 0 ? Math.round((stat.done / stat.total) * 100) : 0;
            return (
              <div key={cat} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
                  <span>{cat}</span>
                  <span className="font-mono text-emerald-700 font-bold">{catRate}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${catRate}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-400 mt-1.5">
                  {stat.habitCount} {stat.habitCount === 1 ? 'habit' : 'habits'} · {stat.done} check-offs this week
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
