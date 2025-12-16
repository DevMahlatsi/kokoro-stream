// /src/api/search.api.ts
import type { MediaItem, MultiSearchResponse } from '../types/movies';

export async function fetchSearchResults(query: string): Promise<MediaItem[]> {
  try {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;

    if (!query.trim()) {
      return [];
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&api_key=${apiKey}`
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const json: MultiSearchResponse = await response.json();
    
    // Filter out "person" results if you don't want them
    const filteredResults = json.results.filter(
      item => item.media_type !== 'person'
    );
    
    return filteredResults;
  } catch (err) {
    console.error('Fetch error:', err);
    return [];
  }
}