import type { MediaItem } from "../types/movies";

const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const baseURL = `https://api.themoviedb.org/3/tv/`;

// Reusable fetch function for TV shows
async function fetchTVShows(endpoint: string): Promise<MediaItem[]> {
  try {
    const response = await fetch(`${baseURL}${endpoint}?api_key=${apiKey}&page=1`);
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching ${endpoint} TV shows:`, error);
    return [];
  }
}

// API call functions using the reusable fetchTVShows function
export const getAiringToday = () => fetchTVShows('airing_today');
export const getOnAir = () => fetchTVShows('on_the_air');
export const getPopularTV = () => fetchTVShows('popular');
export const getTopRatedTV = () => fetchTVShows('top_rated');
