
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MoodSelector, { type Mood } from '@/components/MoodSelector';
import FaceMoodDetector from '@/components/FaceMoodDetector';
import { Button } from '@/components/ui/button';
import { LibraryBig, Music, Radio } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';

const Index = () => {
  const [selectedMood, setSelectedMood] = useState<Mood>('relaxed');
  const [showDetector, setShowDetector] = useState(false);
  const navigate = useNavigate();
  
  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
  };
  
  const handleDetectMood = () => {
    setShowDetector(true);
  };
  
  const handleDetectionComplete = (detectedMood: Mood) => {
    setSelectedMood(detectedMood);
    setShowDetector(false);
  };
  
  const handleGetRecommendations = () => {
    navigate(`/recommendations?mood=${selectedMood}`);
  };
  
  const handleGoToLibrary = () => {
    navigate('/library');
  };
  
  const handleGoToSoundCloud = () => {
    navigate('/soundcloud');
  };
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative">
      <AnimatedBackground mood={selectedMood} />
      
      <div className="max-w-3xl mx-auto w-full z-10">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 dark:to-blue-400">
            FeelGroove
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover music that matches your mood
          </p>
        </header>
        
        {showDetector ? (
          <FaceMoodDetector onMoodDetected={handleDetectionComplete} />
        ) : (
          <div className="space-y-8">
            <MoodSelector selectedMood={selectedMood} onSelectMood={handleMoodSelect} />
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={handleDetectMood}>
                Detect My Mood
              </Button>
              
              <Button 
                onClick={handleGetRecommendations}
                variant="default"
              >
                <Radio className="mr-2 h-4 w-4" /> 
                Get Recommendations
              </Button>
              
              <Button
                onClick={handleGoToLibrary}
                variant="outline"
              >
                <LibraryBig className="mr-2 h-4 w-4" />
                Music Library
              </Button>
              
              <Button
                onClick={handleGoToSoundCloud}
                variant="outline"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white hover:text-white"
              >
                <Music className="mr-2 h-4 w-4" />
                SoundCloud Player
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
