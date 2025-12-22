import type { MediaItem } from "../types/movies";

const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const baseUrl = 'https://api.themoviedb.org/3/movie/';

// Reusable function to fetch movies for a given endpoint and combine results from 2 pages
async function fetchMovies(endpoint: string): Promise<MediaItem[]> {
  try {
    const page1 = await fetch(`${baseUrl}${endpoint}?api_key=${apiKey}&page=1`);
    if (!page1.ok) {
      throw new Error(`TMDB API error (page 1): ${page1.status}`);
    }
    const data1 = await page1.json();

    const page2 = await fetch(`${baseUrl}${endpoint}?api_key=${apiKey}&page=2`);
    if (!page2.ok) {
      throw new Error(`TMDB API error (page 2): ${page2.status}`);
    }
    const data2 = await page2.json();

    // Combine the results from both pages
    return [...(data1.results || []), ...(data2.results || [])];
  } catch (error) {
    console.error(`Error fetching ${endpoint} movies:`, error);
    return [];
  }
}

// Specific functions for fetching different movie categories
export const getNowPlaying = () => fetchMovies('now_playing');
export const getUpcomingMovies = () => fetchMovies('upcoming');
export const getTopRatedMovies = () => fetchMovies('top_rated');
export const getPopularMovies = () => fetchMovies('popular');

