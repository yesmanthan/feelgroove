
import React from 'react';
import { cn } from '@/lib/utils';
import { CardGlass, CardGlassTitle, CardGlassDescription } from './ui/card-glass';
import { Play, Clock } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
}

interface RecentlyPlayedProps {
  className?: string;
  songs: Song[];
  onSongSelect: (songId: string) => void;
}

const RecentlyPlayed: React.FC<RecentlyPlayedProps> = ({
  className,
  songs = [],
  onSongSelect
}) => {
  if (songs.length === 0) {
    return null;
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center gap-2 mb-4">
        <Clock size={16} className="text-muted-foreground" />
        <h3 className="text-lg font-medium">Recently Played</h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {songs.map((song, index) => (
          <CardGlass
            key={song.id}
            className="p-3 group cursor-pointer animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => onSongSelect(song.id)}
          >
            <div className="relative mb-3 aspect-square rounded-md overflow-hidden">
              <img 
                src={song.coverUrl} 
                alt={`${song.title} by ${song.artist}`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                <div className="bg-white rounded-full p-2 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                  <Play size={16} className="text-black ml-0.5" />
                </div>
              </div>
            </div>
            
            <CardGlassTitle className="text-sm font-medium line-clamp-1">{song.title}</CardGlassTitle>
            <CardGlassDescription className="text-xs line-clamp-1">{song.artist}</CardGlassDescription>
          </CardGlass>
        ))}
      </div>
    </div>
  );
};

export default RecentlyPlayed;
