
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CardGlass, CardGlassHeader, CardGlassTitle, CardGlassDescription, CardGlassContent } from './ui/card-glass';
import MusicControls from './MusicControls';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: number;
}

interface MusicPlayerProps {
  className?: string;
  song?: Song;
}

const defaultSong: Song = {
  id: '1',
  title: 'Placeholder Song',
  artist: 'Artist Name',
  album: 'Album Name',
  coverUrl: 'https://placehold.co/300x300/1db954/ffffff?text=Music',
  duration: 214 // 3:34 in seconds
};

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  className,
  song = defaultSong
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  
  // Simulate playback progress for demo purposes
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= song.duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, song.duration]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handlePrevious = () => {
    setCurrentTime(0);
  };
  
  const handleNext = () => {
    setCurrentTime(0);
    // In a real app, we would load the next song here
  };
  
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const handleLike = () => {
    setIsLiked(!isLiked);
  };
  
  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };
  
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };
  
  return (
    <div className={cn('w-full flex flex-col', className)}>
      <CardGlass className="mb-4 max-w-sm mx-auto w-full">
        <CardGlassHeader>
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-xs aspect-square mb-6 rounded-lg overflow-hidden">
              <img 
                src={song.coverUrl} 
                alt={`${song.title} by ${song.artist}`} 
                className="w-full h-full object-cover transition-transform duration-500 transform hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60" />
              
              {isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-black/10 backdrop-blur-sm animate-pulse-slow"></div>
                </div>
              )}
            </div>
            
            <CardGlassTitle className="text-center">{song.title}</CardGlassTitle>
            <CardGlassDescription className="text-center">{song.artist}</CardGlassDescription>
          </div>
        </CardGlassHeader>
        
        <CardGlassContent>
          <MusicControls
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onToggleMute={handleToggleMute}
            isMuted={isMuted}
            onLike={handleLike}
            isLiked={isLiked}
            currentTime={currentTime}
            duration={song.duration}
            onSeek={handleSeek}
            volume={volume}
            onVolumeChange={handleVolumeChange}
          />
        </CardGlassContent>
      </CardGlass>
    </div>
  );
};

export default MusicPlayer;
