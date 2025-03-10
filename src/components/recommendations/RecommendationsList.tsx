
import React from 'react';
import { CardGlass, CardGlassTitle } from '@/components/ui/card-glass';
import { Button } from '@/components/ui/button';
import { type Mood } from '@/components/MoodSelector';
import { formatDuration } from '@/lib/spotifyTransform';
import { type Song } from '@/hooks/spotify/types';

interface RecommendationsListProps {
  loading: boolean;
  recommendations: Song[];
  currentSong: Song | null;
  mood: Mood;
  getMoodName: (moodKey: Mood) => string;
  onSongSelect: (songId: string) => void;
  onFetchRecommendations: (mood: Mood) => void;
}

const RecommendationsList: React.FC<RecommendationsListProps> = ({
  loading,
  recommendations,
  currentSong,
  mood,
  getMoodName,
  onSongSelect,
  onFetchRecommendations
}) => {
  return (
    <CardGlass>
      <CardGlassTitle className="mb-6 text-xl">
        {loading ? 'Loading Playlist...' : `${getMoodName(mood)} Playlist`}
      </CardGlassTitle>
      
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No recommendations found for this mood.</p>
          <Button onClick={() => onFetchRecommendations(mood)}>Try Again</Button>
        </div>
      ) : (
        <div className="space-y-2">
          {recommendations.map((song, index) => (
            <div 
              key={song.id}
              className={`flex items-center p-3 rounded-lg transition-colors cursor-pointer
                ${currentSong?.id === song.id ? 'bg-primary/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}
              `}
              onClick={() => onSongSelect(song.id)}
            >
              <div className="w-10 text-center text-sm text-muted-foreground">
                {index + 1}
              </div>
              
              <div className="w-12 h-12 rounded overflow-hidden mr-4">
                <img 
                  src={song.coverUrl} 
                  alt={song.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-grow mr-4">
                <h3 className="font-medium line-clamp-1">{song.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{song.artist}</p>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {formatDuration(song.duration)}
              </div>
            </div>
          ))}
        </div>
      )}
    </CardGlass>
  );
};

export default RecommendationsList;
