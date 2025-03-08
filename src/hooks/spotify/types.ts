
import { type Mood } from '@/components/MoodSelector';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  coverUrl: string;
  duration: number; // Changed from optional to required
  uri: string;
  previewUrl?: string | null;
  playedAt?: string;
}

export interface SpotifyRecommendationsState {
  loading: boolean;
  recommendations: Song[];
  recentlyPlayed: any[];
  currentSong: Song | null;
  currentSongIndex: number;
  error: Error | null;
  lastMood: Mood | null;
}

export interface UseRecommendationsResult {
  loading: boolean;
  recommendations: Song[];
  recentlyPlayed: any[];
  currentSong: Song | null;
  error: Error | null;
  fetchRecommendations: (mood: Mood) => Promise<void>;
  setCurrentSong: (song: Song) => void;
  nextSong: () => void;
  previousSong: () => void;
  searchSongs: (query: string) => Promise<Song[]>;
  retryLastFetch: () => Promise<void>;
}
