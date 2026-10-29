import React from 'react';
import { Check, Flame, Trophy, Edit2, Trash2 } from 'lucide-react';
import { HabitWithStats } from '../types/habit';
import { getColorById } from '../utils/constants';
import { HabitIcon } from './HabitIcon';

interface HabitCardProps {
  habit: HabitWithStats;
  isCompletedOnDate: boolean;
  selectedDateKey: string;
  isToday: boolean;
  onToggle: (habitId: string) => void;
  onEdit: (habit: HabitWithStats) => void;
  onDelete: (habit: HabitWithStats) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  isCompletedOnDate,
  isToday,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const color = getColorById(habit.colorId);

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-200 ${
        isCompletedOnDate
          ? 'border-emerald-200 bg-emerald-50/20 shadow-xs'
          : 'border-slate-200 hover:border-emerald-200 hover:shadow-xs'
      }`}
    >
      <div className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3 sm:gap-4">
        {/* Left: Icon and Details */}
        <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
          {/* Habit Icon Container */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
            style={{
              backgroundColor: color.bgLight,
              color: color.primary,
              border: `1px solid ${color.border}`,
            }}
          >
            <HabitIcon name={habit.icon} className="w-5 h-5" />
          </div>

          {/* Texts & Metadata */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3
                className={`text-base font-semibold truncate transition-colors ${
                  isCompletedOnDate ? 'text-slate-900' : 'text-slate-800'
                }`}
              >
                {habit.title}
              </h3>
            </div>

            {habit.description && (
              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                {habit.description}
              </p>
            )}

            {/* Unboxed Metadata with typographic separators */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mt-1">
              <span className="font-medium text-slate-600">{habit.category}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{habit.targetPerWeek === 7 ? 'Daily' : `${habit.targetPerWeek} days/wk`}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                <Flame className="w-3.5 h-3.5 text-emerald-600 fill-emerald-500/20" />
                <span className="font-mono tabular-nums">{habit.currentStreak}</span> streak
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="inline-flex items-center gap-1 text-slate-500">
                <Trophy className="w-3 h-3 text-amber-500" />
                Best <span className="font-mono tabular-nums">{habit.longestStreak}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions and Primary Checkbox */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Edit and Delete buttons (subtle, accessible) */}
          <div className="hidden sm:flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(habit)}
              title="Edit Habit"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(habit)}
              title="Delete Habit"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Big satisfying check-off button */}
          <button
            onClick={() => onToggle(habit.id)}
            aria-label={
              isCompletedOnDate
                ? `Mark ${habit.title} incomplete`
                : `Mark ${habit.title} complete`
            }
            className={`min-h-[44px] min-w-[44px] sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 ${
              isCompletedOnDate
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 ring-2 ring-emerald-600/20'
                : 'bg-slate-100 text-slate-300 hover:bg-emerald-100 hover:text-emerald-600 border border-slate-200'
            }`}
          >
            <Check
              className={`w-6 h-6 stroke-[3] transition-transform duration-200 ${
                isCompletedOnDate ? 'scale-100 opacity-100' : 'scale-75 opacity-40 hover:opacity-100'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile action bar footer for edit/delete */}
      <div className="sm:hidden px-4 pb-3 pt-1 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
        <button
          onClick={() => onEdit(habit)}
          className="text-slate-500 hover:text-slate-800 flex items-center gap-1 py-1 px-2 rounded hover:bg-slate-50"
        >
          <Edit2 className="w-3 h-3" />
          Edit
        </button>
        <button
          onClick={() => onDelete(habit)}
          className="text-slate-500 hover:text-rose-600 flex items-center gap-1 py-1 px-2 rounded hover:bg-rose-50"
        >
          <Trash2 className="w-3 h-3" />
          Delete
        </button>
      </div>
    </div>
  );
};
