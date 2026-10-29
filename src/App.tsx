/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Calendar as CalendarIcon,
  BarChart2,
  Settings,
  Sparkles,
} from 'lucide-react';
import { Habit, HabitCompletionsMap, HabitWithStats } from './types/habit';
import {
  loadHabitsFromStorage,
  saveHabitsToStorage,
  loadCompletionsFromStorage,
  saveCompletionsToStorage,
  resetToDemoData,
} from './utils/storage';
import {
  getTodayDateKey,
  calculateStreaks,
  getCurrentWeekDates,
} from './utils/dateUtils';
import { Header, ActiveTab } from './components/Header';
import { TodayView } from './components/TodayView';
import { CalendarView } from './components/CalendarView';
import { StatsView } from './components/StatsView';
import { ManageHabitsView } from './components/ManageHabitsView';
import { HabitModal } from './components/HabitModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';

export default function App() {
  const [habits, setHabits] = useState<Habit[]>(() => loadHabitsFromStorage());
  const [completionsMap, setCompletionsMap] = useState<HabitCompletionsMap>(() =>
    loadCompletionsFromStorage()
  );

  const [activeTab, setActiveTab] = useState<ActiveTab>('today');
  const [selectedDateKey, setSelectedDateKey] = useState<string>(getTodayDateKey());

  // Modals state
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<HabitWithStats | null>(null);

  const todayKey = getTodayDateKey();
  const weekDates = useMemo(() => getCurrentWeekDates(), []);

  // Compute stats for each habit
  const habitsWithStats: HabitWithStats[] = useMemo(() => {
    return habits.map(habit => {
      const dates = completionsMap[habit.id] || [];
      const { currentStreak, longestStreak } = calculateStreaks(dates);
      const completedToday = dates.includes(todayKey);
      const weeklyCompletions = weekDates.filter(d => dates.includes(d)).length;

      return {
        ...habit,
        currentStreak,
        longestStreak,
        completedToday,
        totalCompletions: dates.length,
        weeklyCompletions,
        weeklyTarget: habit.targetPerWeek,
      };
    });
  }, [habits, completionsMap, todayKey, weekDates]);

  // Overall today completion rate
  const todayCompletionRate = useMemo(() => {
    if (habits.length === 0) return 0;
    const completedCount = habitsWithStats.filter(h => h.completedToday).length;
    return (completedCount / habits.length) * 100;
  }, [habits, habitsWithStats]);

  // Toggle habit completion on a given date
  const handleToggleHabit = (habitId: string, dateKey: string) => {
    setCompletionsMap(prev => {
      const currentList = prev[habitId] || [];
      const isAlreadyCompleted = currentList.includes(dateKey);

      let updatedList: string[];
      if (isAlreadyCompleted) {
        updatedList = currentList.filter(d => d !== dateKey);
      } else {
        updatedList = [...currentList, dateKey];
      }

      const nextMap = {
        ...prev,
        [habitId]: updatedList,
      };

      saveCompletionsToStorage(nextMap);

      // Check if this action completes all habits for today -> celebrate!
      if (!isAlreadyCompleted && dateKey === todayKey) {
        const otherHabitsAllCompleted = habits.every(h => {
          if (h.id === habitId) return true;
          return (nextMap[h.id] || []).includes(todayKey);
        });

        if (otherHabitsAllCompleted && habits.length > 0) {
          try {
            confetti({
              particleCount: 90,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
            });
          } catch {
            // fallback gracefully
          }
        }
      }

      return nextMap;
    });
  };

  // Create or edit habit
  const handleSaveHabit = (
    habitData: Omit<Habit, 'id' | 'createdAt'>,
    habitId?: string
  ) => {
    if (habitId) {
      // Edit existing
      setHabits(prev => {
        const updated = prev.map(h =>
          h.id === habitId ? { ...h, ...habitData } : h
        );
        saveHabitsToStorage(updated);
        return updated;
      });
    } else {
      // Create new
      const newHabit: Habit = {
        ...habitData,
        id: `habit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        createdAt: getTodayDateKey(),
      };
      setHabits(prev => {
        const updated = [...prev, newHabit];
        saveHabitsToStorage(updated);
        return updated;
      });
    }
  };

  // Delete habit
  const handleDeleteHabit = (habitId: string) => {
    setHabits(prev => {
      const updated = prev.filter(h => h.id !== habitId);
      saveHabitsToStorage(updated);
      return updated;
    });

    setCompletionsMap(prev => {
      const copy = { ...prev };
      delete copy[habitId];
      saveCompletionsToStorage(copy);
      return copy;
    });
  };

  // Reset to default preloaded example habits
  const handleResetDemo = () => {
    const { habits: resetHabits, completions: resetCompletions } = resetToDemoData();
    setHabits(resetHabits);
    setCompletionsMap(resetCompletions);
  };

  const openNewHabitModal = () => {
    setEditingHabit(null);
    setIsHabitModalOpen(true);
  };

  const openEditHabitModal = (habit: HabitWithStats) => {
    setEditingHabit(habit);
    setIsHabitModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8faf8] text-slate-900 pb-20 sm:pb-12">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNewHabit={openNewHabitModal}
        todayCompletionRate={todayCompletionRate}
      />

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'today' && (
          <TodayView
            habits={habitsWithStats}
            completionsMap={completionsMap}
            selectedDateKey={selectedDateKey}
            onSelectDate={setSelectedDateKey}
            onToggleHabit={handleToggleHabit}
            onEditHabit={openEditHabitModal}
            onDeleteHabit={setDeletingHabit}
            onNewHabit={openNewHabitModal}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            habits={habitsWithStats}
            completionsMap={completionsMap}
            onToggleHabit={handleToggleHabit}
            onSelectDate={dateKey => {
              setSelectedDateKey(dateKey);
              setActiveTab('today');
            }}
          />
        )}

        {activeTab === 'stats' && (
          <StatsView
            habits={habitsWithStats}
            completionsMap={completionsMap}
          />
        )}

        {activeTab === 'manage' && (
          <ManageHabitsView
            habits={habitsWithStats}
            onNewHabit={openNewHabitModal}
            onEditHabit={openEditHabitModal}
            onDeleteHabit={setDeletingHabit}
            onResetDemo={handleResetDemo}
          />
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar (Thumb ergonomics) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200">
        <div className="grid grid-cols-4 items-center h-16 px-2">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'today' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Today</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'calendar' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <CalendarIcon className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Calendar</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'stats' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <BarChart2 className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('manage')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'manage' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Habits</span>
          </button>
        </div>
      </div>

      {/* Habit Create / Edit Modal */}
      <HabitModal
        isOpen={isHabitModalOpen}
        habitToEdit={editingHabit}
        onClose={() => {
          setIsHabitModalOpen(false);
          setEditingHabit(null);
        }}
        onSave={handleSaveHabit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingHabit}
        habit={deletingHabit}
        onClose={() => setDeletingHabit(null)}
        onConfirm={handleDeleteHabit}
      />
    </div>
  );
}
