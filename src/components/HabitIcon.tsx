import React from 'react';
import {
  Droplets,
  BookOpen,
  Dumbbell,
  Sun,
  Brain,
  Heart,
  Moon,
  Sparkles,
  Flame,
  Target,
  Coffee,
  Footprints,
  PenLine,
  Apple,
  Bike,
  CheckCircle2,
} from 'lucide-react';
import { HabitIconName } from '../types/habit';

interface HabitIconProps {
  name: HabitIconName;
  className?: string;
  size?: number;
}

export const HabitIcon: React.FC<HabitIconProps> = ({ name, className = 'w-5 h-5', size }) => {
  const props = { className, size };

  switch (name) {
    case 'droplets':
      return <Droplets {...props} />;
    case 'book':
      return <BookOpen {...props} />;
    case 'dumbbell':
      return <Dumbbell {...props} />;
    case 'sun':
      return <Sun {...props} />;
    case 'brain':
      return <Brain {...props} />;
    case 'heart':
      return <Heart {...props} />;
    case 'moon':
      return <Moon {...props} />;
    case 'sparkles':
      return <Sparkles {...props} />;
    case 'flame':
      return <Flame {...props} />;
    case 'target':
      return <Target {...props} />;
    case 'coffee':
      return <Coffee {...props} />;
    case 'footprints':
      return <Footprints {...props} />;
    case 'pencil':
      return <PenLine {...props} />;
    case 'apple':
      return <Apple {...props} />;
    case 'bike':
      return <Bike {...props} />;
    default:
      return <CheckCircle2 {...props} />;
  }
};
