
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Recommendations from "./pages/Recommendations";
import Library from "./pages/Library";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { useSupabaseRealtime } from "./hooks/useSupabaseRealtime";

// Configure queryClient with shorter staleTime to ensure fresher data
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 1000, // 10 seconds
      retry: 2,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

const AppContent = () => {
  // Use our realtime hook
  useSupabaseRealtime();

  // Clear cached data on page reload
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear React Query cache before page refresh
      queryClient.clear();
      
      // We don't want to clear Spotify token on refresh
      // That would log the user out unnecessarily
      // Instead we'll focus on clearing potential stale data
      
      // Option to clear local session keys except authentication
      const spotifyTokenKey = 'spotify_token';
      const spotifyTokenTimestamp = 'spotify_token_timestamp';
      
      // Save auth values
      const spotifyToken = localStorage.getItem(spotifyTokenKey);
      const tokenTimestamp = localStorage.getItem(spotifyTokenTimestamp);
      
      // Clear sessionStorage completely
      sessionStorage.clear();
      
      // Restore auth values if they existed
      if (spotifyToken) localStorage.setItem(spotifyTokenKey, spotifyToken);
      if (tokenTimestamp) localStorage.setItem(spotifyTokenTimestamp, tokenTimestamp);
      
      console.log('Cache cleared on page refresh');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/library" element={<Library />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
