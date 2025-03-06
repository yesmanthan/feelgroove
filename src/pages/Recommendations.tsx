
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AnimatedBackground from '@/components/AnimatedBackground';
import { CardGlass, CardGlassTitle, CardGlassDescription } from '@/components/ui/card-glass';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Shuffle } from 'lucide-react';
import { type Mood } from '@/components/MoodSelector';
import MusicPlayer from '@/components/MusicPlayer';
import RecentlyPlayed from '@/components/RecentlyPlayed';

// Mock data for demonstration
const getMockSongs = (mood: Mood) => {
  const baseSongs = [
    {
      id: '1',
      title: 'Sunshine Vibes',
      artist: 'Happy Tunes',
      album: 'Summer Collection',
      coverUrl: 'https://placehold.co/300x300/FFD166/ffffff?text=Happy',
      duration: 214,
    },
    {
      id: '2',
      title: 'Blue Rain',
      artist: 'Melancholy Melodies',
      album: 'Rainy Days',
      coverUrl: 'https://placehold.co/300x300/118AB2/ffffff?text=Sad',
      duration: 187,
    },
    {
      id: '3',
      title: 'Electric Energy',
      artist: 'Power Pulse',
      album: 'Workout Mix',
      coverUrl: 'https://placehold.co/300x300/EF476F/ffffff?text=Energy',
      duration: 198,
    },
    {
      id: '4',
      title: 'Calm Waters',
      artist: 'Peaceful Streams',
      album: 'Meditation Collection',
      coverUrl: 'https://placehold.co/300x300/06D6A0/ffffff?text=Relax',
      duration: 246,
    },
    {
      id: '5',
      title: 'Deep Focus',
      artist: 'Concentration',
      album: 'Study Sessions',
      coverUrl: 'https://placehold.co/300x300/073B4C/ffffff?text=Focus',
      duration: 328,
    },
    {
      id: '6',
      title: 'Love Story',
      artist: 'Heart Beats',
      album: 'Romance Vol. 1',
      coverUrl: 'https://placehold.co/300x300/FF9E9E/ffffff?text=Love',
      duration: 232,
    },
  ];
  
  // Add some more mock songs based on mood
  switch (mood) {
    case 'happy':
      return [
        baseSongs[0],
        { ...baseSongs[0], id: '7', title: 'Happy Days', artist: 'Sunshine Band' },
        { ...baseSongs[0], id: '8', title: 'Bright Morning', artist: 'The Smiles' },
        { ...baseSongs[0], id: '9', title: 'Joy Ride', artist: 'Happy Feet' },
        { ...baseSongs[3], id: '10' },
        { ...baseSongs[5], id: '11' },
      ];
    case 'sad':
      return [
        baseSongs[1],
        { ...baseSongs[1], id: '12', title: 'Lonely Night', artist: 'Blue Notes' },
        { ...baseSongs[1], id: '13', title: 'Missing You', artist: 'The Heartaches' },
        { ...baseSongs[1], id: '14', title: 'Empty Room', artist: 'Echo Chamber' },
        { ...baseSongs[4], id: '15' },
        { ...baseSongs[5], id: '16' },
      ];
    case 'energetic':
      return [
        baseSongs[2],
        { ...baseSongs[2], id: '17', title: 'Power Up', artist: 'Energy Boost' },
        { ...baseSongs[2], id: '18', title: 'Run Fast', artist: 'Sprinters' },
        { ...baseSongs[2], id: '19', title: 'Adrenaline', artist: 'High Voltage' },
        { ...baseSongs[0], id: '20' },
        { ...baseSongs[4], id: '21' },
      ];
    case 'relaxed':
      return [
        baseSongs[3],
        { ...baseSongs[3], id: '22', title: 'Gentle Waves', artist: 'Ocean Sounds' },
        { ...baseSongs[3], id: '23', title: 'Floating', artist: 'Cloud Walkers' },
        { ...baseSongs[3], id: '24', title: 'Soft Breeze', artist: 'Nature\'s Touch' },
        { ...baseSongs[1], id: '25' },
        { ...baseSongs[4], id: '26' },
      ];
    case 'focused':
      return [
        baseSongs[4],
        { ...baseSongs[4], id: '27', title: 'Concentration', artist: 'Mind Masters' },
        { ...baseSongs[4], id: '28', title: 'Deep Work', artist: 'Productivists' },
        { ...baseSongs[4], id: '29', title: 'Flow State', artist: 'Brain Waves' },
        { ...baseSongs[3], id: '30' },
        { ...baseSongs[2], id: '31' },
      ];
    case 'romantic':
      return [
        baseSongs[5],
        { ...baseSongs[5], id: '32', title: 'First Kiss', artist: 'The Romantics' },
        { ...baseSongs[5], id: '33', title: 'Hold Me Close', artist: 'Tender Touch' },
        { ...baseSongs[5], id: '34', title: 'Forever Yours', artist: 'Love Letters' },
        { ...baseSongs[0], id: '35' },
        { ...baseSongs[3], id: '36' },
      ];
    default:
      return baseSongs;
  }
};

const getMockRecentlyPlayed = () => {
  return [
    {
      id: 'recent1',
      title: 'Recently Played Song 1',
      artist: 'Recent Artist 1',
      coverUrl: 'https://placehold.co/300x300/1db954/ffffff?text=Recent'
    },
    {
      id: 'recent2',
      title: 'Recently Played Song 2',
      artist: 'Recent Artist 2',
      coverUrl: 'https://placehold.co/300x300/1db954/ffffff?text=Recent'
    },
    {
      id: 'recent3',
      title: 'Recently Played Song 3',
      artist: 'Recent Artist 3',
      coverUrl: 'https://placehold.co/300x300/1db954/ffffff?text=Recent'
    },
    {
      id: 'recent4',
      title: 'Recently Played Song 4',
      artist: 'Recent Artist 4',
      coverUrl: 'https://placehold.co/300x300/1db954/ffffff?text=Recent'
    }
  ];
};

const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const mood = queryParams.get('mood') as Mood || 'relaxed';
  
  const [songs, setSongs] = useState<any[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<any[]>([]);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call to get recommendations
    setLoading(true);
    setTimeout(() => {
      const recommendedSongs = getMockSongs(mood);
      const recentSongs = getMockRecentlyPlayed();
      
      setSongs(recommendedSongs);
      setRecentlyPlayed(recentSongs);
      setCurrentSong(recommendedSongs[0]);
      setLoading(false);
    }, 1000);
  }, [mood]);
  
  const handleSongSelect = (songId: string) => {
    const song = songs.find(s => s.id === songId);
    if (song) {
      setCurrentSong(song);
    }
  };
  
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
          
          <h1 className="text-xl font-bold">FeelGroove</h1>
          
          <div className="w-24">
            {/* Placeholder for user menu or other actions */}
          </div>
        </header>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Music Player Section */}
          <div className="animate-fade-in">
            <CardGlass className="mb-6">
              <CardGlassTitle className="mb-4 text-xl">
                {loading ? 'Loading Recommendations...' : `${getMoodName(mood)} Music for You`}
              </CardGlassTitle>
              
              <CardGlassDescription className="mb-6">
                We've curated these songs to match your {getMoodName(mood).toLowerCase()} mood. Enjoy!
              </CardGlassDescription>
              
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <Button className="flex items-center gap-2">
                      <Play size={16} className="ml-0.5" />
                      <span>Play All</span>
                    </Button>
                    
                    <Button variant="outline" className="flex items-center gap-2">
                      <Shuffle size={16} />
                      <span>Shuffle</span>
                    </Button>
                  </div>
                  
                  {/* Current Song Player */}
                  {currentSong && <MusicPlayer song={currentSong} />}
                </>
              )}
            </CardGlass>
            
            {/* Recently Played */}
            {!loading && (
              <RecentlyPlayed 
                songs={recentlyPlayed} 
                onSongSelect={handleSongSelect} 
                className="animate-fade-in animation-delay-300"
              />
            )}
          </div>
          
          {/* Playlist Section */}
          <div className="animate-fade-in animation-delay-200">
            <CardGlass>
              <CardGlassTitle className="mb-6 text-xl">
                {loading ? 'Loading Playlist...' : `${getMoodName(mood)} Playlist`}
              </CardGlassTitle>
              
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-2">
                  {songs.map((song, index) => (
                    <div 
                      key={song.id}
                      className={`flex items-center p-3 rounded-lg transition-colors cursor-pointer
                        ${currentSong?.id === song.id ? 'bg-primary/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}
                      `}
                      onClick={() => handleSongSelect(song.id)}
                    >
                      <div className="w-10 text-center text-sm text-muted-foreground">
                        {index + 1}
                      </div>
                      
                      <div className="w-12 h-12 rounded overflow-hidden mr-4">
                        <img 
                          src={song.coverUrl} 
                          alt={song.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-grow mr-4">
                        <h3 className="font-medium line-clamp-1">{song.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{song.artist}</p>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardGlass>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
