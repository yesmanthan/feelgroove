
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '@/components/AnimatedBackground';
import { CardGlass } from '@/components/ui/card-glass';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SearchSongs from '@/components/SearchSongs';
import FavoritesList from '@/components/FavoritesList';
import PlaylistManager from '@/components/PlaylistManager';
import MusicPlayer from '@/components/MusicPlayer';
import { useSpotifyRecommendations } from '@/hooks/useSpotifyRecommendations';
import { useSpotifyAuth } from '@/hooks/useSpotifyAuth';
import SpotifyLogin from '@/components/SpotifyLogin';

const Library = () => {
  const navigate = useNavigate();
  const { token } = useSpotifyAuth();
  const [activeTab, setActiveTab] = useState('search');
  
  const {
    recommendations,
    currentSong,
    setCurrentSong,
    nextSong,
    previousSong
  } = useSpotifyRecommendations();
  
  const handleBack = () => {
    navigate('/');
  };
  
  const handleSongSelect = (songId: string) => {
    const song = recommendations.find(s => s.id === songId);
    if (song) {
      setCurrentSong(song);
    }
  };
  
  if (!token) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 relative">
        <AnimatedBackground mood="relaxed" />
        
        <CardGlass className="max-w-md mx-auto">
          <div className="text-center p-6">
            <h2 className="text-xl font-semibold mb-4">Please Login to Continue</h2>
            <p className="mb-6 text-muted-foreground">
              You need to connect to Spotify to access your music library.
            </p>
            
            <div className="flex flex-col items-center gap-4">
              <SpotifyLogin />
              <Button variant="outline" onClick={handleBack}>
                Go Back
              </Button>
            </div>
          </div>
        </CardGlass>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen w-full flex flex-col p-4 md:p-8 relative">
      {/* Animated Background */}
      <AnimatedBackground mood="relaxed" />
      
      {/* Content */}
      <div className="w-full max-w-6xl mx-auto z-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1" 
            onClick={handleBack}
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </Button>
          
          <h1 className="text-xl font-bold">FeelGroove Library</h1>
          
          <div className="w-24">
            {/* Placeholder for user menu or other actions */}
          </div>
        </header>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Music Player Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {currentSong && (
                <MusicPlayer 
                  song={{
                    ...currentSong,
                    duration: currentSong.duration || 0 // Ensure duration exists
                  }}
                  onNext={nextSong}
                  onPrevious={previousSong}
                  onComplete={nextSong}
                />
              )}
            </div>
          </div>
          
          {/* Library Content Section */}
          <div className="lg:col-span-2">
            <CardGlass className="mb-6">
              <Tabs 
                defaultValue="search" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="search">Search</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                  <TabsTrigger value="playlists">Playlists</TabsTrigger>
                </TabsList>
                
                <div className="p-4">
                  <TabsContent value="search" className="mt-0">
                    <SearchSongs onSelectSong={handleSongSelect} />
                  </TabsContent>
                  
                  <TabsContent value="favorites" className="mt-0">
                    <FavoritesList onSelectSong={handleSongSelect} />
                  </TabsContent>
                  
                  <TabsContent value="playlists" className="mt-0">
                    <PlaylistManager onSelectSong={handleSongSelect} />
                  </TabsContent>
                </div>
              </Tabs>
            </CardGlass>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
