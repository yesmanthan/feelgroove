
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Disc } from 'lucide-react';
import { useSpotifyAuth } from '@/hooks/useSpotifyAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { search } from '@/lib/spotifyApi';
import { Song } from '@/components/MusicPlayer';
import { toast } from 'sonner';

interface SearchSongsProps {
  onSelectSong: (songId: string) => void;
}

const SearchSongs = ({ onSelectSong }: SearchSongsProps) => {
  const { token } = useSpotifyAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = async () => {
    if (!token) {
      toast.error('Please log in to search for songs');
      return;
    }
    
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }
    
    setIsSearching(true);
    
    try {
      const response = await search(token, searchQuery, 'track', 20);
      
      const songs: Song[] = response.tracks.items.map((track: any) => ({
        id: track.id,
        title: track.name,
        artist: track.artists.map((artist: any) => artist.name).join(', '),
        album: track.album.name,
        coverUrl: track.album.images[0]?.url || '',
        duration: track.duration_ms,
        uri: track.uri
      }));
      
      setSearchResults(songs);
      
      if (songs.length === 0) {
        toast.info('No songs found matching your search');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Error searching for songs');
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search for songs, artists, or albums..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button 
          onClick={handleSearch} 
          disabled={isSearching}
          className="flex items-center gap-2"
        >
          <Search size={16} />
          <span>{isSearching ? 'Searching...' : 'Search'}</span>
        </Button>
      </div>
      
      {searchResults.length > 0 && (
        <div className="space-y-2 mt-4">
          <h3 className="text-lg font-medium mb-3">Search Results</h3>
          
          {searchResults.map((song) => (
            <div 
              key={song.id}
              className="flex items-center p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              onClick={() => onSelectSong(song.id)}
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
                className={`flex-shrink-0 ${isFavorite(song.id) ? 'text-red-500' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(song);
                }}
              >
                {isFavorite(song.id) ? '❤️' : '🤍'}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchSongs;
