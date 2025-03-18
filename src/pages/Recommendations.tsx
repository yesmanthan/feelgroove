
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AnimatedBackground from '@/components/AnimatedBackground';
import { type Mood } from '@/components/MoodSelector';
import { CardGlass, CardGlassTitle, CardGlassDescription } from '@/components/ui/card-glass';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import RecommendationsHeader from '@/components/recommendations/RecommendationsHeader';
import MusicPlayer from '@/components/MusicPlayer';

const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const mood = queryParams.get('mood') as Mood || 'relaxed';
  
  const handleBack = () => {
    navigate('/');
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
            <CardGlass className="mb-6">
              <CardGlassTitle className="mb-4 text-xl">
                {`${getMoodName(mood)} Music for You`}
              </CardGlassTitle>
              
              <CardGlassDescription className="mb-6">
                We currently don't have any streaming options available. Please try the SoundCloud player.
              </CardGlassDescription>
              
              <div className="flex flex-col items-center gap-4 py-8">
                <Button
                  onClick={() => navigate('/soundcloud')}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white hover:text-white"
                >
                  Go to SoundCloud Player
                </Button>
                
                <Button variant="outline" onClick={handleBack}>
                  Back to Home
                </Button>
              </div>
            </CardGlass>
          </div>
          
          {/* Information Section */}
          <div className="animate-fade-in animation-delay-200">
            <CardGlass>
              <CardGlassTitle className="mb-6 text-xl">
                About Mood-Based Music
              </CardGlassTitle>
              
              <CardGlassDescription>
                <p className="mb-4">
                  Music has a profound effect on our emotions. Different genres and tempos can help enhance or change your current mood.
                </p>
                
                <p className="mb-4">
                  For your {getMoodName(mood).toLowerCase()} mood, we would typically recommend:
                </p>
                
                <ul className="list-disc pl-5 mb-4 space-y-2">
                  {mood === 'happy' && (
                    <>
                      <li>Upbeat pop songs with major keys</li>
                      <li>Dance music with energetic rhythms</li>
                      <li>Positive and uplifting lyrics</li>
                    </>
                  )}
                  
                  {mood === 'sad' && (
                    <>
                      <li>Slower songs in minor keys</li>
                      <li>Acoustic and piano-focused pieces</li>
                      <li>Emotional vocals with reflective lyrics</li>
                    </>
                  )}
                  
                  {mood === 'energetic' && (
                    <>
                      <li>Fast-tempo electronic dance music</li>
                      <li>High-energy rock and metal</li>
                      <li>Workout and motivation playlists</li>
                    </>
                  )}
                  
                  {mood === 'relaxed' && (
                    <>
                      <li>Ambient and chill electronic music</li>
                      <li>Soft acoustic and indie folk</li>
                      <li>Nature sounds and instrumental pieces</li>
                    </>
                  )}
                  
                  {mood === 'focused' && (
                    <>
                      <li>Classical music and film scores</li>
                      <li>Lo-fi beats and minimal electronics</li>
                      <li>Instrumental music without distracting lyrics</li>
                    </>
                  )}
                  
                  {mood === 'romantic' && (
                    <>
                      <li>Smooth R&B and soul music</li>
                      <li>Jazz standards and ballads</li>
                      <li>Acoustic love songs</li>
                    </>
                  )}
                </ul>
              </CardGlassDescription>
            </CardGlass>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
