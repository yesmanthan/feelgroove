
import React from 'react';
import { CardGlass, CardGlassTitle, CardGlassContent } from './ui/card-glass';
import { useFavorites } from '@/hooks/useFavorites';
import { Play, Heart, Plus, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { formatDuration } from '@/lib/spotifyTransform';
import { usePlaylists } from '@/hooks/usePlaylists';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { type Song } from './MusicPlayer';
import { toast } from 'sonner';

interface FavoritesListProps {
  onSelectSong?: (songId: string) => void;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ onSelectSong }) => {
  const { favorites, isLoading, removeFromFavorites } = useFavorites();
  const { playlists, createPlaylist, addSongToPlaylist } = usePlaylists();

  const handleAddToPlaylist = (playlistId: string, favorite: any) => {
    const song: Song = {
      id: favorite.song_id,
      title: favorite.song_title,
      artist: favorite.artist,
      album: favorite.album,
      coverUrl: favorite.cover_url || 'https://placehold.co/300x300/1db954/ffffff?text=Music',
      duration: 0, // We don't have duration stored
      uri: favorite.spotify_uri
    };

    addSongToPlaylist({ playlistId, song });
  };

  const handleCreatePlaylist = async (favorite: any) => {
    // Prompt for playlist name
    const name = prompt('Enter playlist name:');
    if (!name) return;

    try {
      const playlist = await createPlaylist({ name });
      if (playlist) {
        const song: Song = {
          id: favorite.song_id,
          title: favorite.song_title,
          artist: favorite.artist,
          album: favorite.album,
          coverUrl: favorite.cover_url || 'https://placehold.co/300x300/1db954/ffffff?text=Music',
          duration: 0, // We don't have duration stored
          uri: favorite.spotify_uri
        };
        
        addSongToPlaylist({ playlistId: playlist.id, song });
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast.error('Failed to create playlist');
    }
  };

  if (isLoading) {
    return (
      <CardGlass>
        <CardGlassTitle className="mb-4">Your Favorites</CardGlassTitle>
        <CardGlassContent>
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardGlassContent>
      </CardGlass>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <CardGlass>
        <CardGlassTitle className="mb-4">Your Favorites</CardGlassTitle>
        <CardGlassContent>
          <div className="text-center py-8 text-muted-foreground">
            You haven't saved any favorites yet. Like a song to see it here!
          </div>
        </CardGlassContent>
      </CardGlass>
    );
  }

  return (
    <CardGlass>
      <CardGlassTitle className="mb-4">Your Favorites</CardGlassTitle>
      <CardGlassContent>
        <div className="space-y-1">
          {favorites.map((favorite) => (
            <div
              key={favorite.id}
              className="flex items-center p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            >
              <div className="w-12 h-12 rounded overflow-hidden mr-3 flex-shrink-0">
                <img
                  src={favorite.cover_url || 'https://placehold.co/300x300/1db954/ffffff?text=Music'}
                  alt={favorite.song_title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-grow mr-3 min-w-0">
                <h3 className="font-medium text-sm line-clamp-1">{favorite.song_title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1">{favorite.artist}</p>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onSelectSong && onSelectSong(favorite.song_id)}
                  title="Play"
                  className="h-8 w-8"
                >
                  <Play size={16} />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeFromFavorites(favorite.song_id)}
                  title="Remove from favorites"
                  className="h-8 w-8 text-red-500 hover:text-red-600"
                >
                  <Heart size={16} className="fill-current" />
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
                      onClick={() => handleCreatePlaylist(favorite)}
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
                            onClick={() => handleAddToPlaylist(playlist.id, favorite)}
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
      </CardGlassContent>
    </CardGlass>
  );
};

export default FavoritesList;
