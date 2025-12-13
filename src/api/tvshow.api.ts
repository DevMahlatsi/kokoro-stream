import type { MediaItem } from "../types/movies";

const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const baseURL = `https://api.themoviedb.org/3/tv/`;
export async function getAiringToday(): Promise<MediaItem[]>{
  try{
    const response = await fetch(
      `${baseURL}airing_today?api_key=${apiKey}&page=1`
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
export async function getOnAir(): Promise<MediaItem[]>{
  try {
    const response = await fetch(
      `${baseURL}on_the_air=${apiKey}&page=1`
    );
    if(!response.ok){
      throw new Error("Network error");
  }
  const data = await response.json();
  return data.results || [];

  } catch (error) {
    console.error('Error fetching getting shows on air', error);
    return[]
  }
  
  
  
}