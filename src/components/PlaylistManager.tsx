
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePlaylists } from '@/hooks/usePlaylists';
import { PlusCircle } from 'lucide-react';

const PlaylistManager = () => {
  const { playlists, isLoading, createPlaylist } = usePlaylists();
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName);
      setNewPlaylistName('');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end gap-2">
        <div className="flex-grow space-y-2">
          <label htmlFor="newPlaylist" className="text-sm font-medium">
            Create New Playlist
          </label>
          <Input
            id="newPlaylist"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="Enter playlist name"
          />
        </div>
        <Button onClick={handleCreatePlaylist} disabled={!newPlaylistName.trim()}>
          <PlusCircle size={16} className="mr-2" />
          Create
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium mb-3">Your Playlists</h3>
        
        {playlists && playlists.length > 0 ? (
          <div className="space-y-2">
            {playlists.map((playlist) => (
              <div 
                key={playlist.id}
                className="flex items-center p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex-grow">
                  <h3 className="font-medium">{playlist.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {playlist.song_count} songs
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No playlists yet. Create your first playlist above.
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistManager;
