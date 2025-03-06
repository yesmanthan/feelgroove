
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '@/components/AnimatedBackground';
import MoodSelector, { Mood } from '@/components/MoodSelector';
import { CardGlass } from '@/components/ui/card-glass';
import { Button } from '@/components/ui/button';
import { Library, Music } from 'lucide-react';
import { toast } from 'sonner';
import SpotifyLogin from '@/components/SpotifyLogin';
import { useSpotifyAuth } from '@/hooks/useSpotifyAuth';

const Index = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<Mood | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { token, loading } = useSpotifyAuth();

  const getRecommendations = () => {
    if (!token) {
      toast.error('Please connect to Spotify first!');
      return;
    }
    
    if (!selectedMood) {
      toast.error('Please select a mood first!');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      navigate(`/recommendations?mood=${selectedMood}`);
    }, 1500);
  };

  const goToLibrary = () => {
    navigate('/library');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 relative">
      <AnimatedBackground mood={selectedMood} />
      
      <div className="w-full max-w-4xl mx-auto z-10 animate-fade-in">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">FeelGroove</h1>
          <p className="text-lg text-muted-foreground">Music that matches your mood</p>
        </header>
        
        <CardGlass className="mb-8">
          {!token && !loading ? (
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-4">Get Started</h2>
              <SpotifyLogin />
            </div>
          ) : (
            <>
              <MoodSelector 
                onMoodSelect={setSelectedMood}
                selectedMood={selectedMood}
              />
              
              <div className="mt-8 flex justify-center gap-4">
                <Button 
                  size="lg" 
                  className="animate-fade-in"
                  onClick={getRecommendations}
                  disabled={!selectedMood || isLoading}
                >
                  {isLoading ? 'Finding Perfect Songs...' : 'Get Recommendations'}
                </Button>
                
                {token && (
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="animate-fade-in flex items-center gap-2"
                    onClick={goToLibrary}
                  >
                    <Library size={18} />
                    My Library
                  </Button>
                )}
              </div>
            </>
          )}
        </CardGlass>
        
        {/* App Description */}
        <CardGlass className="mt-12 text-center p-8 max-w-2xl mx-auto animate-fade-in animation-delay-500">
          <h2 className="text-xl font-semibold mb-4">Discover Music Based on Your Mood</h2>
          <p className="text-muted-foreground mb-6">
            FeelGroove analyzes your mood and creates personalized playlists that match 
            exactly how you're feeling. Select your mood or let us detect it using 
            our advanced emotion recognition technology.
          </p>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <span className="text-primary text-lg font-semibold">1</span>
              </div>
              <p className="text-sm">Select Mood</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <span className="text-primary text-lg font-semibold">2</span>
              </div>
              <p className="text-sm">Get Recommendations</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <span className="text-primary text-lg font-semibold">3</span>
              </div>
              <p className="text-sm">Enjoy Music</p>
            </div>
          </div>
        </CardGlass>
      </div>
    </div>
  );
};

export default Index;
