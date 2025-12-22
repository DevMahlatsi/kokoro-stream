// hooks/useMediaRecommendations.js
import { useState, useEffect } from 'react';
import { getNowPlaying } from '../api/movie.api';
import { getAiringToday } from '../api/tvshow.api';
import type { MediaItem } from '../types/movies';
// Adjust path

export const useMediaRecommendations = () => {
  const [nowPlaying, setNowPlaying] = useState<MediaItem[]>([]);
  const [airingToday, setAiringToday] = useState<MediaItem[]>([]);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [showsLoading, setShowsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const movies = await getNowPlaying();
        setNowPlaying(movies);
      } catch (err) {
        console.error('Fetch error for movies:', err);
        setError('Failed to fetch movies');
      } finally {
        setMoviesLoading(false);
      }

      try {
        const shows = await getAiringToday();
        setAiringToday(shows);
      } catch (err) {
        console.error('Fetch Error for TV Shows:', err);
        setError('Failed to fetch TV shows');
      } finally {
        setShowsLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  return {
    nowPlaying,
    airingToday,
    moviesLoading,
    showsLoading,
    error,
    allLoading: moviesLoading || showsLoading
  };
};