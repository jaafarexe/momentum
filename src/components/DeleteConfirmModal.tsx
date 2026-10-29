import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { HabitWithStats } from '../types/habit';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  habit: HabitWithStats | null;
  onClose: () => void;
  onConfirm: (habitId: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  habit,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !habit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Trash2 className="w-5 h-5" />
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900">Delete Habit?</h3>
          <p className="text-xs text-slate-500 mt-1">
            Are you sure you want to delete <span className="font-semibold text-slate-800">"{habit.title}"</span>? This will remove all associated completion records and streak history. This action cannot be undone.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(habit.id);
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors cursor-pointer"
          >
            Delete Habit
          </button>
        </div>
      </div>
    </div>
  );
};
