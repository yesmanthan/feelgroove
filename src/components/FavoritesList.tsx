
import React from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import { Button } from '@/components/ui/button';
import { Disc } from 'lucide-react';
import { Song } from '@/components/MusicPlayer';

interface FavoritesListProps {
  onSelectSong?: (songId: string) => void;
}

const FavoritesList = ({ onSelectSong }: FavoritesListProps) => {
  const { favorites, isLoading, toggleFavorite } = useFavorites();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!favorites || favorites.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">You haven't added any favorites yet.</p>
        <p className="text-sm">Your favorites will appear here.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium mb-3">Your Favorite Songs</h3>
      
      {favorites.map((favorite) => {
        // Convert from favorite item to Song format
        const song: Song = {
          id: favorite.song_id,
          title: favorite.song_title,
          artist: favorite.artist,
          album: favorite.album || '',
          coverUrl: favorite.cover_url || '',
          uri: favorite.spotify_uri,
          duration: 0 // Duration not stored in favorites table
        };
        
        return (
          <div 
            key={favorite.id}
            className="flex items-center p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            onClick={() => onSelectSong && onSelectSong(song.id)}
          >
            <div className="w-12 h-12 rounded overflow-hidden mr-4 flex-shrink-0">
              {song.coverUrl ? (
                <img 
                  src={song.coverUrl} 
                  alt={song.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  <Disc size={20} className="text-primary" />
                </div>
              )}
            </div>
            
            <div className="flex-grow mr-4">
              <h3 className="font-medium line-clamp-1">{song.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{song.artist}</p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex-shrink-0 text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(song);
              }}
            >
              ❤️
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default FavoritesList;
