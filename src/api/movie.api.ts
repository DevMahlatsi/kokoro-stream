import type { MediaItem } from "../types/movies";

const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const baseUrl = 'https://api.themoviedb.org/3/movie/';

async function fetchMovies(endpoint: string): Promise<MediaItem[]> {
  try {
    const response = await fetch(`${baseUrl}${endpoint}?api_key=${apiKey}&page=1`);
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching ${endpoint} movies: `, error);
    return [];
  }
}

export const getNowPlaying = () => fetchMovies('now_playing');
export const getUpcomingMovies = () => fetchMovies('upcoming');
export const getTopRatedMovies = () => fetchMovies('top_rated');
export const getPopularMovies = () => fetchMovies('popular');