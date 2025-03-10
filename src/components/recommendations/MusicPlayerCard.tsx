
import React from 'react';
import { CardGlass, CardGlassTitle, CardGlassDescription } from '@/components/ui/card-glass';
import { Button } from '@/components/ui/button';
import { Play, Shuffle } from 'lucide-react';
import { type Mood } from '@/components/MoodSelector';
import MusicPlayer from '@/components/MusicPlayer';
import { type Song } from '@/hooks/spotify/types';

interface MusicPlayerCardProps {
  loading: boolean;
  recommendations: Song[];
  currentSong: Song | null;
  mood: Mood;
  getMoodName: (moodKey: Mood) => string;
  onPlayAll: () => void;
  onShuffle: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const MusicPlayerCard: React.FC<MusicPlayerCardProps> = ({
  loading,
  recommendations,
  currentSong,
  mood,
  getMoodName,
  onPlayAll,
  onShuffle,
  onNext,
  onPrevious
}) => {
  return (
    <CardGlass className="mb-6">
      <CardGlassTitle className="mb-4 text-xl">
        {loading ? 'Loading Recommendations...' : `${getMoodName(mood)} Music for You`}
      </CardGlassTitle>
      
      <CardGlassDescription className="mb-6">
        We've curated these songs to match your {getMoodName(mood).toLowerCase()} mood. Enjoy!
      </CardGlassDescription>
      
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-4">
            <Button 
              className="flex items-center gap-2"
              onClick={onPlayAll}
              disabled={recommendations.length === 0}
            >
              <Play size={16} className="ml-0.5" />
              <span>Play All</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={onShuffle}
              disabled={recommendations.length === 0}
            >
              <Shuffle size={16} />
              <span>Shuffle</span>
            </Button>
          </div>
          
          {/* Current Song Player */}
          {currentSong && (
            <MusicPlayer 
              song={{
                ...currentSong,
                duration: currentSong.duration || 0 // Ensure duration exists
              }}
              onNext={onNext}
              onPrevious={onPrevious}
              onComplete={onNext}
            />
          )}
        </>
      )}
    </CardGlass>
  );
};

export default MusicPlayerCard;
