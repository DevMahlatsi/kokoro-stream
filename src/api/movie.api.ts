import type { MediaItem } from "../types/movies"


export async function fetchNowPlaying(): Promise<MediaItem[]>{
	try{
		const apiKey = import.meta.env.VITE_TMDB_API_KEY;

		const response = await fetch(
			`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`
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