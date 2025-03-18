
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

// Pages
import Index from './pages/Index';
import Recommendations from './pages/Recommendations';
import Library from './pages/Library';
import SoundCloudPlayer from './pages/SoundCloudPlayer';
import NotFound from './pages/NotFound';

function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/library" element={<Library />} />
        <Route path="/soundcloud" element={<SoundCloudPlayer />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
