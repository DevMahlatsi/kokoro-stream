import type { MediaItem } from "../types/movies";

export async function getAiringToday(): Promise<MediaItem[]>{
  try{
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/airing_today?api_key=${apiKey}&language=en-US&page=1`
    );
    if(!response.ok){
      throw new Error("Network Error");
    }
      const data = await response.json();
      return data.results || [];
  }catch(error){
    console.error(`Error fetching TV shows:`, error);
    return [];
  }

}