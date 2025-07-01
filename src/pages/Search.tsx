import { useLocation, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import { useEffect, useState } from "react";
import type { Movie, MovieApiResponse } from "../types/movies";
import {MovieCard} from "../components/MovieCard";
import MovieLayout from "../Layout/MovieLayout";

export default function Search(){
  const [qMovies, setQMovies] = useState<Movie[]>([]);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const query = location.state?.query || ''; // Safely access state
        
        if (!query.trim()) {
          setQMovies([]);
          return;
        }

        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const json: MovieApiResponse = await response.json();
        setQMovies(json.results || []);
        
      } catch (err) {
        console.error('Fetch error:', err);
        setQMovies([]); // Reset on error
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [location.state]);

    const handleClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`, { 
      state: { movie } // Pass full movie data
    });
  };
  if (loading){
    console.log("It is loading");
  }
  return (
    <>
      <Menu/>
      
      <div>
        <MovieLayout>
          {qMovies.map((movie) => (
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