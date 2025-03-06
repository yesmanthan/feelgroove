
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { CardGlass, CardGlassHeader, CardGlassTitle, CardGlassDescription, CardGlassContent } from './ui/card-glass';
import MusicControls from './MusicControls';
import { toast } from 'sonner';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  coverUrl: string;
  duration: number;
  uri?: string;
  previewUrl?: string;
}

interface MusicPlayerProps {
  className?: string;
  song?: Song;
  onNext?: () => void;
  onPrevious?: () => void;
  onComplete?: () => void;
}

const defaultSong: Song = {
  id: '1',
  title: 'Select a track to play',
  artist: 'Connect with Spotify to get started',
  album: 'FeelGroove',
  coverUrl: 'https://placehold.co/300x300/1db954/ffffff?text=Music',
  duration: 0
};

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  className,
  song = defaultSong,
  onNext,
  onPrevious,
  onComplete
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio element when song changes
  useEffect(() => {
    if (!song.previewUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }
    
    if (!audioRef.current) {
      audioRef.current = new Audio(song.previewUrl);
    } else {
      audioRef.current.src = song.previewUrl;
    }
    
    audioRef.current.volume = volume;
    
    // Set up event listeners
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      if (audio) {
        setCurrentTime(audio.currentTime);
      }
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (onComplete) onComplete();
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    
    // Reset state when song changes
    setCurrentTime(0);
    setIsPlaying(false);
    
    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.pause();
      }
    };
  }, [song.previewUrl, onComplete, volume]);
  
  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  
  const handlePlayPause = () => {
    if (!song.previewUrl) {
      toast.error("No preview available for this track");
      return;
    }
    
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(error => {
        console.error("Error playing audio:", error);
        toast.error("Couldn't play track. Please try again.");
      });
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const handlePrevious = () => {
    if (onPrevious) {
      setCurrentTime(0);
      onPrevious();
    }
  };
  
  const handleNext = () => {
    if (onNext) {
      setCurrentTime(0);
      onNext();
    }
  };
  
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      toast.success(`Added "${song.title}" to liked songs`);
    } else {
      toast.info(`Removed "${song.title}" from liked songs`);
    }
  };
  
  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
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
              
              {!song.previewUrl && song.id !== '1' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <div className="bg-black/70 text-white px-3 py-1 rounded text-sm">
                    Preview unavailable
                  </div>
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
            disablePlayback={!song.previewUrl && song.id !== '1'}
          />
        </CardGlassContent>
      </CardGlass>
    </div>
  );
};

export default MusicPlayer;
