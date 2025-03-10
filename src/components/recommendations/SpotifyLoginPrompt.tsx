
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardGlass, CardGlassTitle, CardGlassDescription } from '@/components/ui/card-glass';
import SpotifyLogin from '@/components/SpotifyLogin';
import { type Mood } from '@/components/MoodSelector';

interface SpotifyLoginPromptProps {
  mood: Mood;
  onBack: () => void;
  getMoodName: (moodKey: Mood) => string;
}

const SpotifyLoginPrompt: React.FC<SpotifyLoginPromptProps> = ({ mood, onBack, getMoodName }) => {
  return (
    <CardGlass className="max-w-md mx-auto">
      <CardGlassTitle className="mb-4">Please Login to Continue</CardGlassTitle>
      <CardGlassDescription className="mb-6">
        You need to connect to Spotify to see recommendations for your {getMoodName(mood).toLowerCase()} mood.
      </CardGlassDescription>
      
      <div className="flex flex-col items-center gap-4">
        <SpotifyLogin />
        <Button variant="outline" onClick={onBack}>
          Go Back
        </Button>
      </div>
    </CardGlass>
  );
};

export default SpotifyLoginPrompt;
