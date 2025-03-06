
import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Repeat,
  Shuffle,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CardGlass } from './ui/card-glass';

interface MusicControlsProps {
  className?: string;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onToggleMute?: () => void;
  isMuted?: boolean;
  onLike?: () => void;
  isLiked?: boolean;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
}

const MusicControls: React.FC<MusicControlsProps> = ({
  className,
  isPlaying = false,
  onPlayPause = () => {},
  onNext = () => {},
  onPrevious = () => {},
  onToggleMute = () => {},
  isMuted = false,
  onLike = () => {},
  isLiked = false,
  currentTime = 0,
  duration = 0,
  onSeek = () => {},
  volume = 1,
  onVolumeChange = () => {}
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Format time to MM:SS
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    onSeek(percent * duration);
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVolumeChange(parseFloat(e.target.value));
  };

  return (
    <CardGlass className={cn('p-4 w-full', className)}>
      {/* Progress Bar */}
      <div 
        className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 cursor-pointer"
        onClick={handleProgressClick}
      >
        <div 
          className="h-full bg-primary rounded-full relative"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full transform scale-150" />
        </div>
      </div>
      
      {/* Time Display */}
      <div className="flex justify-between text-xs text-muted-foreground mb-4">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      
      {/* Main Controls */}
      <div className="flex items-center justify-center gap-4 md:gap-8">
        <button 
          className="text-muted-foreground hover:text-foreground transition"
          onClick={() => {}}
        >
          <Shuffle size={16} />
        </button>
        
        <button 
          className="text-foreground hover:text-primary transition transform hover:scale-110"
          onClick={onPrevious}
        >
          <SkipBack size={24} />
        </button>
        
        <button 
          className="bg-primary text-white p-3 rounded-full hover:scale-105 transition transform"
          onClick={onPlayPause}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>
        
        <button 
          className="text-foreground hover:text-primary transition transform hover:scale-110"
          onClick={onNext}
        >
          <SkipForward size={24} />
        </button>
        
        <button 
          className="text-muted-foreground hover:text-foreground transition"
          onClick={() => {}}
        >
          <Repeat size={16} />
        </button>
      </div>
      
      {/* Secondary Controls */}
      <div className="flex items-center justify-between mt-6">
        <button 
          className={cn(
            "transition transform hover:scale-110",
            isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
          )}
          onClick={onLike}
        >
          <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
        </button>
        
        <div className="relative flex items-center">
          <button 
            className="text-muted-foreground hover:text-foreground transition"
            onClick={onToggleMute}
            onMouseEnter={() => setShowVolumeSlider(true)}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          
          {showVolumeSlider && (
            <div 
              className="absolute left-8 w-24 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg animate-fade-in z-10"
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full accent-primary"
              />
            </div>
          )}
        </div>
      </div>
    </CardGlass>
  );
};

export default MusicControls;
