
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AnimatedBackground from '@/components/AnimatedBackground';
import { type Mood } from '@/components/MoodSelector';
import RecentlyPlayed from '@/components/RecentlyPlayed';
import { useSpotifyRecommendations } from '@/hooks/useSpotifyRecommendations';
import { useSpotifyAuth } from '@/hooks/useSpotifyAuth';
import { toast } from 'sonner';

// Import refactored components
import SpotifyLoginPrompt from '@/components/recommendations/SpotifyLoginPrompt';
import RecommendationsHeader from '@/components/recommendations/RecommendationsHeader';
import MusicPlayerCard from '@/components/recommendations/MusicPlayerCard';
import RecommendationsList from '@/components/recommendations/RecommendationsList';

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
        <SpotifyLoginPrompt 
          mood={mood} 
          onBack={handleBack}
          getMoodName={getMoodName}
        />
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
        <RecommendationsHeader onBack={handleBack} />
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Music Player Section */}
          <div className="animate-fade-in">
            <MusicPlayerCard
              loading={loading}
              recommendations={recommendations}
              currentSong={currentSong}
              mood={mood}
              getMoodName={getMoodName}
              onPlayAll={handlePlayAll}
              onShuffle={handleShuffle}
              onNext={nextSong}
              onPrevious={previousSong}
            />
            
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
            <RecommendationsList 
              loading={loading}
              recommendations={recommendations}
              currentSong={currentSong}
              mood={mood}
              getMoodName={getMoodName}
              onSongSelect={handleSongSelect}
              onFetchRecommendations={fetchRecommendations}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
