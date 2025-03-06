
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Smile, 
  Frown, 
  Zap, 
  Leaf, 
  BookOpen,
  Heart
} from 'lucide-react';
import { CardGlass } from './ui/card-glass';

export type Mood = 'happy' | 'sad' | 'energetic' | 'relaxed' | 'focused' | 'romantic';

interface MoodSelectorProps {
  className?: string;
  onMoodSelect: (mood: Mood) => void;
  selectedMood?: Mood;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({
  className,
  onMoodSelect,
  selectedMood
}) => {
  // Mood data with icons and colors
  const moods = [
    { id: 'happy' as Mood, label: 'Happy', icon: Smile, color: 'text-mood-happy' },
    { id: 'sad' as Mood, label: 'Sad', icon: Frown, color: 'text-mood-sad' },
    { id: 'energetic' as Mood, label: 'Energetic', icon: Zap, color: 'text-mood-energetic' },
    { id: 'relaxed' as Mood, label: 'Relaxed', icon: Leaf, color: 'text-mood-relaxed' },
    { id: 'focused' as Mood, label: 'Focused', icon: BookOpen, color: 'text-mood-focused' },
    { id: 'romantic' as Mood, label: 'Romantic', icon: Heart, color: 'text-mood-romantic' }
  ];

  return (
    <div className={cn('w-full', className)}>
      <h2 className="text-2xl font-semibold mb-6 text-center animate-fade-in">How are you feeling today?</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {moods.map((mood, index) => {
          const Icon = mood.icon;
          const isSelected = selectedMood === mood.id;
          
          return (
            <CardGlass
              key={mood.id}
              className={cn(
                'mood-button animate-fade-in',
                isSelected && 'ring-2 ring-primary/50 bg-white/30 dark:bg-black/30',
                `--index: ${index}`
              )}
              onClick={() => onMoodSelect(mood.id)}
            >
              <Icon 
                className={cn(
                  'mood-icon',
                  mood.color,
                  isSelected ? 'scale-110' : ''
                )} 
              />
              <span className="mood-label">{mood.label}</span>
            </CardGlass>
          );
        })}
      </div>
    </div>
  );
};

export default MoodSelector;
