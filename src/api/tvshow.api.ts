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
    console.error(`Error fetching TV shows airing today:`, error);
    return [];
  }

}
export async function getOnAir(): Promise<MediaItem[]>{
  try {
    const response = await fetch(
      `${baseURL}on_the_air?api_key=${apiKey}&page=1`
    );
    if(!response.ok){
      throw new Error("Network error");
  }
  const data = await response.json();
  return data.results || [];

  } catch (error) {
    console.error('Error fetching shows on air', error);
    return[]
  }
}
  export async function getPopularTV(): Promise<MediaItem[]>{
    try {
      const response = await fetch(
        `${baseURL}popular?api_key=${apiKey}&page=1`
      );
      if(!response.ok){
        throw new Error("Network error");
      }
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching popular TV shows', error);
      return []
    }
    
  }
  export async function getTopRatedTV(): Promise<MediaItem[]>{
    try{
      const response = await fetch(
        `${baseURL}top_rated?api_key=${apiKey}&page=1`
      );
      if(!response.ok){
        throw new Error("Network error");
      }
      const data = await response.json();
      return data.results || [];
    }catch(error){
      console.error("Error fetching top rated shows", error);
      return [];
    }
  }

  