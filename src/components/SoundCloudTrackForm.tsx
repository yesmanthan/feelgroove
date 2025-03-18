
import React, { useState } from 'react';
import { CardGlass, CardGlassContent, CardGlassHeader, CardGlassTitle } from './ui/card-glass';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useSoundCloudPlayer, SoundCloudTrack } from '@/hooks/useSoundCloudPlayer';
import { toast } from 'sonner';
import { InfoIcon } from 'lucide-react';

interface SoundCloudTrackFormProps {
  onTrackPlay: (track: SoundCloudTrack) => void;
}

// Sample track data for user testing
const SAMPLE_TRACK = {
  streamId: 'soundcloud:tracks:1479458126',
  trackAuthorization: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJnZW8iOiJVUyIsInN1YiI6IiIsInJpZCI6IjkxZjRlNjY0LTQwZTItNDFlOS04OWY0LTVmN2YzZGQyY2MxMCIsImlhdCI6MTcxNTUzMzAyNH0._E0eLOLfwZ3h8yn_4_bHn_UQbmtTIxgzhZNJX-pPEpQ',
  title: 'Sample SoundCloud Track',
  artist: 'SoundCloud Artist'
};

const SoundCloudTrackForm: React.FC<SoundCloudTrackFormProps> = ({ onTrackPlay }) => {
  const { rapidApiKey, setRapidApiKey, isLoading } = useSoundCloudPlayer();
  
  const [trackDetails, setTrackDetails] = useState<SoundCloudTrack>({
    streamId: '',
    trackAuthorization: '',
    title: 'SoundCloud Track',
    artist: 'SoundCloud Artist',
    coverUrl: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTrackDetails(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackDetails.streamId || !trackDetails.trackAuthorization) {
      toast.error('StreamId and trackAuthorization are required');
      return;
    }
    
    if (!rapidApiKey) {
      toast.error('Please enter your RapidAPI key');
      return;
    }
    
    onTrackPlay(trackDetails);
  };
  
  const loadSampleTrack = () => {
    setTrackDetails({
      ...SAMPLE_TRACK,
      coverUrl: trackDetails.coverUrl
    });
    toast.info('Sample track loaded into form');
  };
  
  return (
    <CardGlass>
      <CardGlassHeader>
        <CardGlassTitle>SoundCloud Track Player</CardGlassTitle>
      </CardGlassHeader>
      
      <CardGlassContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium">
              RapidAPI Key (Pre-filled)
            </label>
            <Input
              id="apiKey"
              type="password"
              value={rapidApiKey}
              onChange={(e) => setRapidApiKey(e.target.value)}
              placeholder="Enter your RapidAPI key"
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              This field has been pre-filled with your API key
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="streamId" className="text-sm font-medium">
                Stream ID
              </label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={loadSampleTrack}
                className="text-xs"
              >
                Load Sample Track
              </Button>
            </div>
            <Textarea
              id="streamId"
              name="streamId"
              value={trackDetails.streamId}
              onChange={handleInputChange}
              placeholder="Enter SoundCloud streamId (e.g., soundcloud:tracks:1234567890)"
              className="font-mono text-xs h-20"
            />
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <InfoIcon size={14} className="mt-0.5 shrink-0" />
              <p>
                The streamId should be in the format: soundcloud:tracks:1234567890
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="trackAuthorization" className="text-sm font-medium">
              Track Authorization
            </label>
            <Textarea
              id="trackAuthorization"
              name="trackAuthorization"
              value={trackDetails.trackAuthorization}
              onChange={handleInputChange}
              placeholder="Enter SoundCloud JWT authorization token"
              className="font-mono text-xs h-20"
            />
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <InfoIcon size={14} className="mt-0.5 shrink-0" />
              <p>
                The authorization token is a JWT string that starts with "eyJ0eXAi..."
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Track Title
              </label>
              <Input
                id="title"
                name="title"
                value={trackDetails.title}
                onChange={handleInputChange}
                placeholder="Enter track title"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="artist" className="text-sm font-medium">
                Artist
              </label>
              <Input
                id="artist"
                name="artist"
                value={trackDetails.artist}
                onChange={handleInputChange}
                placeholder="Enter artist name"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="coverUrl" className="text-sm font-medium">
              Cover Image URL (optional)
            </label>
            <Input
              id="coverUrl"
              name="coverUrl"
              value={trackDetails.coverUrl}
              onChange={handleInputChange}
              placeholder="Enter cover image URL"
            />
          </div>
          
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Loading...' : 'Play Track'}
          </Button>
        </form>
      </CardGlassContent>
    </CardGlass>
  );
};

export default SoundCloudTrackForm;
