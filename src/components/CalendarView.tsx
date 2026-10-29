import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Check,
  Calendar as CalendarIcon,
  Flame,
} from 'lucide-react';
import { HabitWithStats, HabitCompletionsMap } from '../types/habit';
import {
  getMonthDays,
  getTodayDateKey,
  formatDisplayDate,
  formatDateKey,
} from '../utils/dateUtils';
import { getColorById } from '../utils/constants';
import { HabitIcon } from './HabitIcon';

interface CalendarViewProps {
  habits: HabitWithStats[];
  completionsMap: HabitCompletionsMap;
  onToggleHabit: (habitId: string, dateKey: string) => void;
  onSelectDate: (dateKey: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  habits,
  completionsMap,
  onToggleHabit,
  onSelectDate,
}) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [inspectedDateKey, setInspectedDateKey] = useState<string>(getTodayDateKey());

  const days = getMonthDays(currentYear, currentMonth);
  const monthName = new Date(currentYear, currentMonth).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const handleJumpToToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setInspectedDateKey(getTodayDateKey());
  };

  // Calculate day completion status
  const getDayCompletions = (dateKey: string) => {
    let completedCount = 0;
    habits.forEach(h => {
      const dates = completionsMap[h.id] || [];
      if (dates.includes(dateKey)) {
        completedCount++;
      }
    });
    return completedCount;
  };

  // Month Statistics
  const monthDaysInCurrentMonth = days.filter(d => d.isCurrentMonth && !d.isFuture);
  let totalPossibleCompletions = 0;
  let totalActualCompletions = 0;
  let perfectDaysCount = 0;

  monthDaysInCurrentMonth.forEach(d => {
    const count = getDayCompletions(d.dateKey);
    totalActualCompletions += count;
    totalPossibleCompletions += habits.length;
    if (count === habits.length && habits.length > 0) {
      perfectDaysCount++;
    }
  });

  const monthCompletionRate =
    totalPossibleCompletions > 0
      ? Math.round((totalActualCompletions / totalPossibleCompletions) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Month Navigation & Metrics Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {monthName}
            </h2>
            <button
              onClick={handleJumpToToday}
              className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
            >
              Today
            </button>
          </div>

          {/* Month Switcher Arrows */}
          <div className="flex items-center gap-1 self-start sm:self-auto">
            <button
              onClick={handlePrevMonth}
              title="Previous Month"
              className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              title="Next Month"
              className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Clean unboxed 3-metric strip */}
        <div className="grid grid-cols-3 gap-4 pt-4 text-center">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium">Monthly Consistency</span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {monthCompletionRate}%
            </div>
          </div>
          <div className="space-y-1 border-x border-slate-100">
            <span className="text-xs text-slate-500 font-medium">100% Perfect Days</span>
            <div className="text-xl sm:text-2xl font-bold text-emerald-600 font-mono tabular-nums">
              {perfectDaysCount} <span className="text-xs text-slate-400 font-sans font-normal">days</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium">Total Check-offs</span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {totalActualCompletions}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center pb-2 mb-1 border-b border-slate-100">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {days.map(day => {
            const completedCount = getDayCompletions(day.dateKey);
            const total = habits.length;
            const isFull = total > 0 && completedCount === total;
            const isPartial = completedCount > 0 && completedCount < total;
            const isSelected = day.dateKey === inspectedDateKey;

            return (
              <button
                key={day.dateKey}
                onClick={() => setInspectedDateKey(day.dateKey)}
                disabled={day.isFuture}
                className={`min-h-[56px] sm:min-h-[72px] p-1.5 sm:p-2 rounded-xl flex flex-col justify-between transition-all cursor-pointer relative text-left ${
                  !day.isCurrentMonth
                    ? 'opacity-30 bg-slate-50/50'
                    : day.isFuture
                    ? 'bg-slate-50/70 text-slate-300 cursor-not-allowed'
                    : isFull
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isPartial
                    ? 'bg-emerald-50/80 border border-emerald-200/90 text-emerald-950'
                    : 'bg-slate-50/70 hover:bg-slate-100 text-slate-700'
                } ${
                  isSelected
                    ? 'ring-2 ring-slate-900 ring-offset-2'
                    : ''
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs sm:text-sm font-semibold font-mono tabular-nums ${
                      day.isToday && !isFull
                        ? 'text-emerald-700 font-bold underline'
                        : ''
                    }`}
                  >
                    {day.dayNumber}
                  </span>

                  {day.isToday && (
                    <span
                      className={`text-[9px] font-bold uppercase tracking-tight px-1 rounded ${
                        isFull ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      Today
                    </span>
                  )}
                </div>

                {/* Completion Indicator */}
                {!day.isFuture && day.isCurrentMonth && (
                  <div className="flex items-center justify-between w-full mt-1">
                    {isFull ? (
                      <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-100">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span className="hidden sm:inline font-mono">100%</span>
                      </div>
                    ) : isPartial ? (
                      <div className="text-[10px] sm:text-[11px] font-mono font-medium text-emerald-800">
                        {completedCount}/{total}
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-300 font-mono">0/{total}</div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 pt-5 mt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-600" />
            <span>100% Complete</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-50 border border-emerald-200" />
            <span>Partial Completion</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-200" />
            <span>0 Completed</span>
          </div>
        </div>
      </div>

      {/* Selected Day Inspector & Quick Toggle Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>Day Breakdown & Check-off</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              {formatDisplayDate(inspectedDateKey)}
            </h3>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500">Day Total:</span>{' '}
            <span className="text-sm font-bold text-emerald-700 font-mono tabular-nums">
              {getDayCompletions(inspectedDateKey)} of {habits.length}
            </span>
          </div>
        </div>

        <div className="divide-y divide-slate-100 mt-2">
          {habits.map(habit => {
            const completedDates = completionsMap[habit.id] || [];
            const isDone = completedDates.includes(inspectedDateKey);
            const color = getColorById(habit.colorId);

            return (
              <div
                key={habit.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: color.bgLight,
                      color: color.primary,
                      border: `1px solid ${color.border}`,
                    }}
                  >
                    <HabitIcon name={habit.icon} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate">
                      {habit.title}
                    </div>
                    <div className="text-xs text-slate-400">
                      {habit.category} · streak: {habit.currentStreak}
                    </div>
                  </div>
                </div>

                {/* Interactive checkmark toggle for this exact day */}
                <button
                  onClick={() => onToggleHabit(habit.id, inspectedDateKey)}
                  className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 stroke-[2.5] ${isDone ? 'opacity-100' : 'opacity-40'}`} />
                  <span>{isDone ? 'Done' : 'Mark Done'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
