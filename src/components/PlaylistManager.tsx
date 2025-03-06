
import React, { useState } from 'react';
import { CardGlass, CardGlassTitle, CardGlassContent } from './ui/card-glass';
import { usePlaylists } from '@/hooks/usePlaylists';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Music, Play, Trash, ArrowLeft, ListMusic } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { toast } from 'sonner';
import { formatDuration } from '@/lib/spotifyTransform';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { type Song } from './MusicPlayer';

interface PlaylistManagerProps {
  onSelectSong?: (songId: string) => void;
}

const PlaylistManager: React.FC<PlaylistManagerProps> = ({ onSelectSong }) => {
  const {
    playlists,
    isLoadingPlaylists,
    selectedPlaylistId,
    setSelectedPlaylistId,
    playlistSongs,
    isLoadingPlaylistSongs,
    createPlaylist,
    deletePlaylist,
    removeSongFromPlaylist
  } = usePlaylists();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) {
      toast.error('Please enter a playlist name');
      return;
    }

    createPlaylist({
      name: newPlaylistName.trim(),
      description: newPlaylistDescription.trim() || undefined
    });
    
    setNewPlaylistName('');
    setNewPlaylistDescription('');
    setIsCreateDialogOpen(false);
  };

  const handleDeletePlaylist = (id: string) => {
    if (confirm('Are you sure you want to delete this playlist?')) {
      deletePlaylist(id);
      setSelectedPlaylistId(null);
    }
  };

  const renderPlaylistList = () => {
    if (isLoadingPlaylists) {
      return (
        <div className="py-4 text-center">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading playlists...</p>
        </div>
      );
    }

    if (!playlists || playlists.length === 0) {
      return (
        <div className="py-8 text-center">
          <ListMusic className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">No playlists yet</p>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)} 
            className="mt-4"
            variant="outline"
          >
            <Plus size={16} className="mr-2" />
            Create a playlist
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {playlists.map(playlist => (
          <div 
            key={playlist.id} 
            className={`flex items-center p-3 rounded-md cursor-pointer 
              ${selectedPlaylistId === playlist.id 
                ? 'bg-primary/10'
                : 'hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            onClick={() => setSelectedPlaylistId(playlist.id)}
          >
            <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center mr-3">
              <Music size={20} className="text-primary" />
            </div>
            <div className="flex-grow">
              <h3 className="font-medium text-sm">{playlist.name}</h3>
              <p className="text-xs text-muted-foreground">
                {playlist.song_count} {playlist.song_count === 1 ? 'song' : 'songs'}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPlaylistSongs = () => {
    if (!selectedPlaylistId) return null;

    if (isLoadingPlaylistSongs) {
      return (
        <div className="py-4 text-center">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading songs...</p>
        </div>
      );
    }

    if (!playlistSongs || playlistSongs.length === 0) {
      return (
        <div className="py-8 text-center">
          <Music className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">No songs in this playlist yet</p>
        </div>
      );
    }

    return (
      <div className="space-y-1 mt-4">
        {playlistSongs.map((song, index) => (
          <div
            key={song.id}
            className="flex items-center p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          >
            <div className="w-6 text-center mr-2 text-muted-foreground text-sm">
              {index + 1}
            </div>
            
            <div className="w-10 h-10 rounded overflow-hidden mr-3 flex-shrink-0">
              <img
                src={song.cover_url || 'https://placehold.co/300x300/1db954/ffffff?text=Music'}
                alt={song.song_title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-grow min-w-0">
              <h3 className="font-medium text-sm line-clamp-1">{song.song_title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-1">{song.artist}</p>
            </div>

            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onSelectSong && onSelectSong(song.song_id)}
                title="Play"
                className="h-8 w-8"
              >
                <Play size={16} />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeSongFromPlaylist({ playlistId: selectedPlaylistId, songId: song.song_id })}
                title="Remove from playlist"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPlaylistDetail = () => {
    if (!selectedPlaylistId) {
      return (
        <div className="py-8 text-center">
          <Music className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">Select a playlist to view its songs</p>
        </div>
      );
    }

    const playlist = playlists?.find(p => p.id === selectedPlaylistId);
    if (!playlist) return null;

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedPlaylistId(null)}
            className="flex items-center"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeletePlaylist(selectedPlaylistId)}
            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
          >
            <Trash size={16} className="mr-1" />
            Delete
          </Button>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold">{playlist.name}</h2>
          {playlist.description && (
            <p className="text-sm text-muted-foreground mt-1">{playlist.description}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            {playlist.song_count} {playlist.song_count === 1 ? 'song' : 'songs'}
          </p>
        </div>

        {renderPlaylistSongs()}
      </div>
    );
  };

  return (
    <>
      <CardGlass>
        <CardGlassTitle className="flex justify-between items-center mb-4">
          <span>Your Playlists</span>
          <Button 
            size="sm" 
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center"
          >
            <Plus size={16} className="mr-1" />
            New
          </Button>
        </CardGlassTitle>
        <CardGlassContent>
          <Tabs defaultValue={selectedPlaylistId ? "detail" : "list"} value={selectedPlaylistId ? "detail" : "list"}>
            <TabsContent value="list" className="mt-0">
              {renderPlaylistList()}
            </TabsContent>
            <TabsContent value="detail" className="mt-0">
              {renderPlaylistDetail()}
            </TabsContent>
          </Tabs>
        </CardGlassContent>
      </CardGlass>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Playlist</DialogTitle>
            <DialogDescription>
              Add a name and optional description for your playlist.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="playlist-name">
                Playlist Name
              </label>
              <Input
                id="playlist-name"
                placeholder="My Awesome Playlist"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="playlist-description">
                Description (optional)
              </label>
              <Input
                id="playlist-description"
                placeholder="A collection of my favorite songs"
                value={newPlaylistDescription}
                onChange={(e) => setNewPlaylistDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePlaylist}>Create Playlist</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlaylistManager;
