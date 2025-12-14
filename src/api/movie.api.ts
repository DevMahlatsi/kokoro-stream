import type { MediaItem } from "../types/movies"
const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const baseUrl = 'https://api.themoviedb.org/3/movie/'

export async function getNowPlaying(): Promise<MediaItem[]>{
	try{
		const response = await fetch(
			`${baseUrl}now_playing?api_key=${apiKey}&page=1`
		);
		if(!response.ok){
			throw new Error(`TMDB API error: ${response.status}`);
		}
		const data = await response.json();
		return data.results || [];
	}catch(error){
		console.error(`Error fetching now playing movies: `, error);
		return[];
	}

}
export async function getUpcomingMovies(): Promise<MediaItem[]>{
	try{
		const response = await fetch(
			`${baseUrl}upcoming?api_key=${apiKey}&page=1`
		);
		if(!response.ok){
			throw new Error(`TMDB API ERROR: ${response.status}`);
		}
		const data = await response.json();
		return data.results || [];
	}catch(error){
		console.error(`Error feching upcoming movies: `, error);
		return [];
	}
}
export async function getTopRatedMovies(): Promise<MediaItem[]>{
	try{
		const response = await fetch(
			`${baseUrl}top_rated?api_key=${apiKey}&page=1`
		);
		if(!response.ok){
			throw new Error(`Problem with the api: ${response.status}`);
		}
		const data = await response.json();
		return data.results || [];
	}catch(error){
		console.error(`Error fetching top rated movies: `, error);
		return [];
	}
}
export async function getPopularMovies(): Promise<MediaItem[]>{
	try{
		const response = await fetch(
			`${baseUrl}popular?api_key=${apiKey}&page=1`
		);
		if(!response.ok){
			throw new Error(`Problem with the api: ${response.status}`);
		}
		const data = await response.json();
		return data.results || [];
	}catch(error){
		console.error(`Error fetching top rated movies: `, error);
		return [];
	}
}