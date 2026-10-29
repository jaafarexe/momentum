import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Habit, HabitCategory, HabitIconName } from '../types/habit';
import { HABIT_CATEGORIES, HABIT_COLORS, HABIT_ICONS, getColorById } from '../utils/constants';
import { HabitIcon } from './HabitIcon';

interface HabitModalProps {
  isOpen: boolean;
  habitToEdit?: Habit | null;
  onClose: () => void;
  onSave: (habitData: Omit<Habit, 'id' | 'createdAt'>, habitId?: string) => void;
}

export const HabitModal: React.FC<HabitModalProps> = ({
  isOpen,
  habitToEdit,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('Health');
  const [colorId, setColorId] = useState('emerald');
  const [icon, setIcon] = useState<HabitIconName>('sparkles');
  const [targetPerWeek, setTargetPerWeek] = useState<number>(7);
  const [error, setError] = useState('');

  useEffect(() => {
    if (habitToEdit) {
      setTitle(habitToEdit.title);
      setDescription(habitToEdit.description || '');
      setCategory(habitToEdit.category);
      setColorId(habitToEdit.colorId);
      setIcon(habitToEdit.icon);
      setTargetPerWeek(habitToEdit.targetPerWeek || 7);
    } else {
      setTitle('');
      setDescription('');
      setCategory('Health');
      setColorId('emerald');
      setIcon('sparkles');
      setTargetPerWeek(7);
    }
    setError('');
  }, [habitToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a habit name');
      return;
    }

    onSave(
      {
        title: title.trim(),
        description: description.trim(),
        category,
        colorId,
        icon,
        targetPerWeek,
      },
      habitToEdit?.id
    );
    onClose();
  };

  const currentColor = getColorById(colorId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
              style={{
                backgroundColor: currentColor.bgLight,
                color: currentColor.primary,
                border: `1px solid ${currentColor.border}`,
              }}
            >
              <HabitIcon name={icon} className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {habitToEdit ? 'Edit Habit' : 'Create Custom Habit'}
              </h2>
              <p className="text-xs text-slate-500">
                {habitToEdit ? 'Update your habit settings' : 'Define your daily routine and momentum'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Habit Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Habit Name *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Drink 2.5L Water, Read 20 Minutes"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm text-slate-900 placeholder:text-slate-400"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Description or Target (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. 8 glasses throughout the day"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {HABIT_CATEGORIES.map(cat => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                    category === cat
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Weekly Target
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Every day', value: 7 },
                { label: '5 days/wk', value: 5 },
                { label: '4 days/wk', value: 4 },
                { label: '3 days/wk', value: 3 },
              ].map(freq => (
                <button
                  type="button"
                  key={freq.value}
                  onClick={() => setTargetPerWeek(freq.value)}
                  className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                    targetPerWeek === freq.value
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {freq.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Theme Color
            </label>
            <div className="flex flex-wrap items-center gap-2.5">
              {HABIT_COLORS.map(c => {
                const isSelected = colorId === c.id;
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setColorId(c.id)}
                    title={c.name}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform cursor-pointer ${
                      isSelected ? 'ring-2 ring-slate-900 ring-offset-2 scale-110' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.primary }}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Icon Picker */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Icon
            </label>
            <div className="grid grid-cols-5 gap-2 max-h-36 overflow-y-auto p-1 border border-slate-100 rounded-xl">
              {HABIT_ICONS.map(ic => {
                const isSelected = icon === ic.name;
                return (
                  <button
                    type="button"
                    key={ic.name}
                    onClick={() => setIcon(ic.name)}
                    className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-100 text-emerald-900 ring-1 ring-emerald-500'
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <HabitIcon name={ic.name} className="w-5 h-5" />
                    <span className="text-[10px] truncate max-w-full">{ic.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-xl shadow-sm shadow-emerald-700/20 transition-all cursor-pointer"
            >
              {habitToEdit ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
