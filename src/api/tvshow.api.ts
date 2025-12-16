import type { MediaItem } from "../types/movies";

const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const baseURL = `https://api.themoviedb.org/3/tv/`;

// Reusable function to fetch TV shows for a given endpoint and combine results from 2 pages
async function fetchTVShows(endpoint: string): Promise<MediaItem[]> {
  try {
    const page1 = await fetch(`${baseURL}${endpoint}?api_key=${apiKey}&page=1`);
    if (!page1.ok) {
      throw new Error(`TMDB API error (page 1): ${page1.status}`);
    }
    const data1 = await page1.json();

    const page2 = await fetch(`${baseURL}${endpoint}?api_key=${apiKey}&page=2`);
    if (!page2.ok) {
      throw new Error(`TMDB API error (page 2): ${page2.status}`);
    }
    const data2 = await page2.json();

    // Combine the results from both pages
    return [...(data1.results || []), ...(data2.results || [])];
  } catch (error) {
    console.error(`Error fetching ${endpoint} TV shows:`, error);
    return [];
  }
}

// Specific functions for fetching different TV shows categories
export const getAiringToday = () => fetchTVShows('airing_today');
export const getOnAir = () => fetchTVShows('on_the_air');
export const getPopularTV = () => fetchTVShows('popular');
export const getTopRatedTV = () => fetchTVShows('top_rated');
