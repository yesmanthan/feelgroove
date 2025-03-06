import React, { useState } from 'react';
import { CardGlass, CardGlassTitle, CardGlassContent } from './ui/card-glass';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Play, Plus, Heart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { searchTracks } from '@/lib/spotifyApi';
import { transformTracks, formatDuration } from '@/lib/spotifyTransform';
import { useSpotifyAuth } from '@/hooks/useSpotifyAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { Skeleton } from './ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { usePlaylists } from '@/hooks/usePlaylists';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SearchSongsProps {
  onSelectSong?: (songId: string) => void;
}

const SearchSongs: React.FC<SearchSongsProps> = ({ onSelectSong }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { token } = useSpotifyAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { playlists, createPlaylist, addSongToPlaylist } = usePlaylists();

  const { data: searchResults, isLoading, refetch } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim() || !token) return [];
      const response = await searchTracks(token, searchQuery, 20);
      return transformTracks(response.tracks.items);
    },
    enabled: false, // Don't run on mount
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      refetch();
    }
  };

  const handleAddToPlaylist = async (playlistId: string, songId: string) => {
    const song = searchResults?.find(s => s.id === songId);
    if (song && playlistId) {
      addSongToPlaylist({ playlistId, song });
    }
  };

  const handleCreatePlaylist = async (songId: string) => {
    const song = searchResults?.find(s => s.id === songId);
    if (!song) return;

    // Prompt for playlist name
    const name = prompt('Enter playlist name:');
    if (!name) return;

    try {
      const playlist = await createPlaylist({ name });
      if (playlist) {
        addSongToPlaylist({ playlistId: playlist.id, song });
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast.error('Failed to create playlist');
    }
  };

  return (
    <CardGlass className="w-full">
      <CardGlassTitle className="mb-4">Search Songs</CardGlassTitle>
      <CardGlassContent>
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <Input
            placeholder="Search for songs, artists, or albums"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading}>
            <Search size={18} className="mr-2" />
            Search
          </Button>
        </form>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded" />
                <div className="space-y-2 flex-grow">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : !searchResults || searchResults.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery
              ? 'No results found. Try a different search term.'
              : 'Search for songs to see results here.'}
          </div>
        ) : (
          <div className="space-y-1">
            {searchResults.map((song) => (
              <div
                key={song.id}
                className="flex items-center p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              >
                <div className="w-12 h-12 rounded overflow-hidden mr-3 flex-shrink-0">
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-grow mr-3 min-w-0">
                  <h3 className="font-medium text-sm line-clamp-1">{song.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">{song.artist}</p>
                </div>

                <div className="text-xs text-muted-foreground mr-3 whitespace-nowrap">
                  {formatDuration(song.duration)}
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onSelectSong && onSelectSong(song.id)}
                    title="Play"
                    className="h-8 w-8"
                  >
                    <Play size={16} />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => toggleFavorite(song)}
                    title={isFavorite(song.id) ? 'Remove from favorites' : 'Add to favorites'}
                    className={cn(
                      "h-8 w-8",
                      isFavorite(song.id) && "text-red-500 hover:text-red-600"
                    )}
                  >
                    <Heart
                      size={16}
                      className={cn(isFavorite(song.id) && "fill-current")}
                    />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        title="Add to playlist"
                      >
                        <Plus size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleCreatePlaylist(song.id)}
                        className="cursor-pointer"
                      >
                        Create new playlist
                      </DropdownMenuItem>
                      
                      {playlists && playlists.length > 0 && (
                        <>
                          <div className="px-2 py-1.5 text-xs text-muted-foreground">
                            Add to existing playlist
                          </div>
                          {playlists.map((playlist) => (
                            <DropdownMenuItem
                              key={playlist.id}
                              onClick={() => handleAddToPlaylist(playlist.id, song.id)}
                              className="cursor-pointer"
                            >
                              {playlist.name}
                            </DropdownMenuItem>
                          ))}
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardGlassContent>
    </CardGlass>
  );
};

export default SearchSongs;
