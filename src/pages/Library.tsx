
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '@/components/AnimatedBackground';
import { CardGlass } from '@/components/ui/card-glass';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FavoritesList from '@/components/FavoritesList';
import PlaylistManager from '@/components/PlaylistManager';
import MusicPlayer from '@/components/MusicPlayer';

const Library = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('favorites');
  
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
          
          <h1 className="text-xl font-bold">FeelGroove Library</h1>
          
          <div className="w-24">
            {/* Placeholder for other actions */}
          </div>
        </header>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Music Player Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <MusicPlayer />
            </div>
          </div>
          
          {/* Library Content Section */}
          <div className="lg:col-span-2">
            <CardGlass className="mb-6">
              <Tabs 
                defaultValue="favorites" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                  <TabsTrigger value="playlists">Playlists</TabsTrigger>
                </TabsList>
                
                <div className="p-4">
                  <TabsContent value="favorites" className="mt-0">
                    <FavoritesList />
                  </TabsContent>
                  
                  <TabsContent value="playlists" className="mt-0">
                    <PlaylistManager />
                  </TabsContent>
                </div>
              </Tabs>
            </CardGlass>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
