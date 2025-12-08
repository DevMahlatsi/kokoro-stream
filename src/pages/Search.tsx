import { useLocation, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import { useEffect, useState } from "react";
import type { MediaItem, MultiSearchResponse } from "../types/movies";
import {MovieCard} from "../components/MovieCard";
import MovieLayout from "../Layout/MovieLayout";

export default function Search(){
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const query = location.state?.query || ''; // Safely access state
        
        if (!query.trim()) {
          setSearchResults([]);
          return;
        }

        const response = await fetch(
          // `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`
          `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&api_key=${apiKey}`
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        

        const json: MultiSearchResponse = await response.json();
        const filteredResults = json.results.filter(item => item.media_type !== 'person');
        setSearchResults(filteredResults || []);


        
      } catch (err) {
        console.error('Fetch error:', err);
        setSearchResults([]); // Reset on error
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [location.state]);


    const handleClick = (item: MediaItem) => {
      if(item.media_type === 'movie'){
        navigate(`/movie/${item.id}`, { 
      state: { movie: item } // Pass full movie data
    });
      }
      else if(item.media_type === 'tv'){
          navigate(`/tv/${item.id}`,{
            state: {show: item}
          });
      }
    
  };
  if (loading){
    console.log("It is loading");
  }
  return (
    <>
      <Menu/>
      
      <div>
        <MovieLayout>
          {searchResults.map((movie) => (
          <MovieCard
            key={movie.id}
            movie = {movie}
            onClick={handleClick}
            
          />
        ))}
        </MovieLayout>
        
      </div>
    </>
  )
}