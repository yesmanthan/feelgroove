
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '@/components/AnimatedBackground';
import SoundCloudTrackForm from '@/components/SoundCloudTrackForm';
import MusicPlayer from '@/components/MusicPlayer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useSoundCloudPlayer, type SoundCloudTrack } from '@/hooks/useSoundCloudPlayer';
import { Song } from '@/components/MusicPlayer';
import { toast } from 'sonner';

const SoundCloudPlayer = () => {
  const navigate = useNavigate();
  const { playTrack, isLoading } = useSoundCloudPlayer();
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  
  const handleTrackPlay = async (track: SoundCloudTrack) => {
    const song = await playTrack(track);
    if (song) {
      setCurrentSong(song);
    }
  };
  
  const handleBack = () => {
    navigate('/');
  };
  
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
          
          <h1 className="text-xl font-bold">SoundCloud Player</h1>
          
          <div className="w-24">
            {/* Placeholder for user menu or other actions */}
          </div>
        </header>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Player Section */}
          <div className="animate-fade-in">
            {currentSong ? (
              <MusicPlayer
                song={currentSong}
                onComplete={() => toast.info('Track completed')}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 bg-black/5 dark:bg-white/5 rounded-lg">
                <p className="text-center text-muted-foreground">
                  Enter SoundCloud track details and click "Play Track" to start streaming
                </p>
              </div>
            )}
          </div>
          
          {/* Form Section */}
          <div className="animate-fade-in animation-delay-200">
            <SoundCloudTrackForm onTrackPlay={handleTrackPlay} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoundCloudPlayer;
