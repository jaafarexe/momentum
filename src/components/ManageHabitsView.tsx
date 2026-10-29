import React from 'react';
import { Plus, Edit2, Trash2, Flame, Trophy, RotateCcw, Sparkles } from 'lucide-react';
import { HabitWithStats } from '../types/habit';
import { getColorById } from '../utils/constants';
import { HabitIcon } from './HabitIcon';

interface ManageHabitsViewProps {
  habits: HabitWithStats[];
  onNewHabit: () => void;
  onEditHabit: (habit: HabitWithStats) => void;
  onDeleteHabit: (habit: HabitWithStats) => void;
  onResetDemo: () => void;
}

export const ManageHabitsView: React.FC<ManageHabitsViewProps> = ({
  habits,
  onNewHabit,
  onEditHabit,
  onDeleteHabit,
  onResetDemo,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Custom Habit Management</h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure habits, categories, target frequencies, and visual styling.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onResetDemo}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            title="Reset to default example habits"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Examples</span>
          </button>
          <button
            onClick={onNewHabit}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Habit</span>
          </button>
        </div>
      </div>

      {/* Habit List Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Active Habits ({habits.length})
          </span>
          <span className="text-xs text-slate-400">
            Tap edit or trash to customize
          </span>
        </div>

        {habits.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {habits.map(habit => {
              const color = getColorById(habit.colorId);

              return (
                <div
                  key={habit.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                >
                  {/* Left: Info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: color.bgLight,
                        color: color.primary,
                        border: `1px solid ${color.border}`,
                      }}
                    >
                      <HabitIcon name={habit.icon} className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="text-base font-semibold text-slate-900 truncate">
                        {habit.title}
                      </div>
                      {habit.description && (
                        <div className="text-xs text-slate-500 truncate mt-0.5">
                          {habit.description}
                        </div>
                      )}
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <span className="font-medium text-slate-700">{habit.category}</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span>{habit.targetPerWeek === 7 ? 'Every day' : `${habit.targetPerWeek} days/wk`}</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-mono tabular-nums">{habit.currentStreak}</span> streak
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-amber-500" />
                          Best <span className="font-mono tabular-nums">{habit.longestStreak}</span>
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span>
                          Total <span className="font-mono tabular-nums">{habit.totalCompletions}</span> completions
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => onEditHabit(habit)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onDeleteHabit(habit)}
                      className="px-3 py-1.5 rounded-lg border border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">No habits remaining</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create your first custom habit or restore the preloaded example habits to get started.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={onResetDemo}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Restore Examples
              </button>
              <button
                onClick={onNewHabit}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer"
              >
                Create Habit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
