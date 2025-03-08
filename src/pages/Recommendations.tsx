import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AnimatedBackground from '@/components/AnimatedBackground';
import { CardGlass, CardGlassTitle, CardGlassDescription } from '@/components/ui/card-glass';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Shuffle } from 'lucide-react';
import { type Mood } from '@/components/MoodSelector';
import MusicPlayer from '@/components/MusicPlayer';
import RecentlyPlayed from '@/components/RecentlyPlayed';
import { useSpotifyRecommendations } from '@/hooks/useSpotifyRecommendations';
import { useSpotifyAuth } from '@/hooks/useSpotifyAuth';
import { formatDuration } from '@/lib/spotifyTransform';
import SpotifyLogin from '@/components/SpotifyLogin';
import { toast } from 'sonner';

const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const mood = queryParams.get('mood') as Mood || 'relaxed';
  const { token } = useSpotifyAuth();
  
  const {
    loading,
    recommendations,
    recentlyPlayed,
    currentSong,
    fetchRecommendations,
    setCurrentSong,
    nextSong,
    previousSong
  } = useSpotifyRecommendations();
  
  useEffect(() => {
    if (token && mood) {
      fetchRecommendations(mood);
    }
  }, [token, mood, fetchRecommendations]);
  
  const handleBack = () => {
    navigate('/');
  };
  
  const handleSongSelect = (songId: string) => {
    const song = recommendations.find(s => s.id === songId);
    if (song) {
      setCurrentSong(song);
    } else {
      // If not in recommendations, check recently played
      const recentSong = recentlyPlayed.find(s => s.id === songId);
      if (recentSong) {
        setCurrentSong(recentSong);
      }
    }
  };
  
  const handlePlayAll = () => {
    if (recommendations.length > 0) {
      setCurrentSong(recommendations[0]);
      toast.success('Playing all songs');
    }
  };
  
  const handleShuffle = () => {
    if (recommendations.length > 0) {
      const randomIndex = Math.floor(Math.random() * recommendations.length);
      setCurrentSong(recommendations[randomIndex]);
      toast.success('Shuffling songs');
    }
  };
  
  const getMoodName = (moodKey: Mood): string => {
    const names: Record<Mood, string> = {
      happy: 'Happy',
      sad: 'Sad',
      energetic: 'Energetic',
      relaxed: 'Relaxed',
      focused: 'Focused',
      romantic: 'Romantic'
    };
    return names[moodKey] || 'Unknown';
  };
  
  if (!token) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 relative">
        <AnimatedBackground mood={mood} />
        
        <CardGlass className="max-w-md mx-auto">
          <CardGlassTitle className="mb-4">Please Login to Continue</CardGlassTitle>
          <CardGlassDescription className="mb-6">
            You need to connect to Spotify to see recommendations for your {getMoodName(mood).toLowerCase()} mood.
          </CardGlassDescription>
          
          <div className="flex flex-col items-center gap-4">
            <SpotifyLogin />
            <Button variant="outline" onClick={handleBack}>
              Go Back
            </Button>
          </div>
        </CardGlass>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen w-full flex flex-col p-4 md:p-8 relative">
      {/* Animated Background */}
      <AnimatedBackground mood={mood} />
      
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
          
          <h1 className="text-xl font-bold">FeelGroove</h1>
          
          <div className="w-24">
            {/* Placeholder for user menu or other actions */}
          </div>
        </header>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Music Player Section */}
          <div className="animate-fade-in">
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
                      onClick={handlePlayAll}
                      disabled={recommendations.length === 0}
                    >
                      <Play size={16} className="ml-0.5" />
                      <span>Play All</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={handleShuffle}
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
                      onNext={nextSong}
                      onPrevious={previousSong}
                      onComplete={nextSong}
                    />
                  )}
                </>
              )}
            </CardGlass>
            
            {/* Recently Played */}
            {!loading && recentlyPlayed.length > 0 && (
              <RecentlyPlayed 
                songs={recentlyPlayed} 
                onSongSelect={handleSongSelect} 
                className="animate-fade-in animation-delay-300"
              />
            )}
          </div>
          
          {/* Playlist Section */}
          <div className="animate-fade-in animation-delay-200">
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
                  <Button onClick={() => fetchRecommendations(mood)}>Try Again</Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {recommendations.map((song, index) => (
                    <div 
                      key={song.id}
                      className={`flex items-center p-3 rounded-lg transition-colors cursor-pointer
                        ${currentSong?.id === song.id ? 'bg-primary/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}
                      `}
                      onClick={() => handleSongSelect(song.id)}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
