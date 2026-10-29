import React, { useState } from 'react';
import { Sparkles, Calendar as CalendarIcon, CheckCircle2, ChevronRight, Plus } from 'lucide-react';
import { HabitWithStats, HabitCategory, HabitCompletionsMap } from '../types/habit';
import { HABIT_CATEGORIES } from '../utils/constants';
import { getRecentDays, formatDisplayDate, getTodayDateKey } from '../utils/dateUtils';
import { HabitCard } from './HabitCard';

interface TodayViewProps {
  habits: HabitWithStats[];
  completionsMap: HabitCompletionsMap;
  selectedDateKey: string;
  onSelectDate: (dateKey: string) => void;
  onToggleHabit: (habitId: string, dateKey: string) => void;
  onEditHabit: (habit: HabitWithStats) => void;
  onDeleteHabit: (habit: HabitWithStats) => void;
  onNewHabit: () => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  habits,
  completionsMap,
  selectedDateKey,
  onSelectDate,
  onToggleHabit,
  onEditHabit,
  onDeleteHabit,
  onNewHabit,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const todayKey = getTodayDateKey();
  const isToday = selectedDateKey === todayKey;

  const recentDays = getRecentDays(7);

  // Filter habits by category
  const filteredHabits = habits.filter(
    h => selectedCategory === 'All' || h.category === selectedCategory
  );

  // Compute stats for selected date
  const totalHabits = habits.length;
  const completedForSelectedDate = habits.filter(h => {
    const dates = completionsMap[h.id] || [];
    return dates.includes(selectedDateKey);
  }).length;

  const percentage = totalHabits > 0 ? Math.round((completedForSelectedDate / totalHabits) * 100) : 0;

  // Available categories that currently have habits
  const activeCategories = ['All', ...HABIT_CATEGORIES.filter(cat => habits.some(h => h.category === cat))];

  return (
    <div className="space-y-6">
      {/* Date Scroller Carousel */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-slate-800">
              {formatDisplayDate(selectedDateKey)}
            </span>
          </div>

          {!isToday && (
            <button
              onClick={() => onSelectDate(todayKey)}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-0.5"
            >
              Back to Today <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 7-day selector pills */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {recentDays.map(day => {
            const isSelected = day.dateKey === selectedDateKey;
            return (
              <button
                key={day.dateKey}
                onClick={() => onSelectDate(day.dateKey)}
                className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800'
                }`}
              >
                <span className="text-[11px] uppercase tracking-wider font-medium opacity-80">
                  {day.dayName}
                </span>
                <span className="text-base sm:text-lg font-bold font-mono tabular-nums mt-0.5">
                  {day.dayNum}
                </span>
                {day.isToday && (
                  <span
                    className={`w-1 h-1 rounded-full mt-1 ${
                      isSelected ? 'bg-white' : 'bg-emerald-600'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Momentum Progress Banner */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-5 sm:p-6 text-white shadow-sm shadow-emerald-900/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-100 text-xs font-medium uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>Daily Momentum Status</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
              {percentage === 100
                ? 'All Habits Crushed!'
                : percentage >= 50
                ? 'Great Momentum Building'
                : 'Build Your Daily Flow'}
            </h2>
            <p className="text-sm text-emerald-100/90 mt-1 max-w-xl">
              {percentage === 100
                ? 'Outstanding commitment today. You completed 100% of your planned habits.'
                : `${completedForSelectedDate} of ${totalHabits} habits completed (${percentage}%). ${
                    totalHabits - completedForSelectedDate
                  } remaining.`}
            </p>
          </div>

          {/* Circular or Compact Score indicator */}
          <div className="flex items-center gap-3 self-start sm:self-center bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15">
            <div className="text-right">
              <div className="text-2xl font-bold font-mono tabular-nums leading-none">
                {percentage}%
              </div>
              <div className="text-[11px] text-emerald-100 uppercase tracking-wider font-medium mt-1">
                Completed
              </div>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center">
              <CheckCircle2
                className={`w-6 h-6 transition-transform ${
                  percentage === 100 ? 'text-emerald-200 scale-110' : 'text-white/60'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5 w-full bg-black/20 rounded-full h-2.5 overflow-hidden p-0.5">
          <div
            className="bg-white h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.max(percentage, 2)}%` }}
          />
        </div>
      </div>

      {/* Filter Tabs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {activeCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="text-slate-800 font-semibold">{filteredHabits.length}</span>{' '}
          {filteredHabits.length === 1 ? 'habit' : 'habits'}
        </div>
      </div>

      {/* Habits List */}
      {filteredHabits.length > 0 ? (
        <div className="space-y-3">
          {filteredHabits.map(habit => {
            const dates = completionsMap[habit.id] || [];
            const isCompleted = dates.includes(selectedDateKey);
            return (
              <HabitCard
                key={habit.id}
                habit={habit}
                isCompletedOnDate={isCompleted}
                selectedDateKey={selectedDateKey}
                isToday={isToday}
                onToggle={() => onToggleHabit(habit.id, selectedDateKey)}
                onEdit={onEditHabit}
                onDelete={onDeleteHabit}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">No habits in this category</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don't have any habits configured under "{selectedCategory}". Add a new habit or switch back to "All".
          </p>
          <button
            onClick={onNewHabit}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Habit
          </button>
        </div>
      )}
    </div>
  );
};
