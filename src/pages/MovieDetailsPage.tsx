import Menu from "../components/Menu";
import { useLocation, useNavigate } from "react-router-dom";
import type { Movie, MovieApiResponse } from "../types/movies";
import { useEffect, useState, useCallback } from "react";
import MovieLayout from "../Layout/MovieLayout";
import { MovieCard } from "../components/MovieCard";

interface LocationState {
  movie: Movie;
}

export default function MovieDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovieDetails = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      const [movieResponse, similarResponse] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`),
        fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${apiKey}`)
      ]);

      if (!movieResponse.ok) throw new Error('Failed to fetch movie details');
      if (!similarResponse.ok) throw new Error('Failed to fetch similar movies');

      const movieData: Movie = await movieResponse.json();
      const similarData: MovieApiResponse = await similarResponse.json();

      setMovie(movieData);
      setSimilarMovies(similarData.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location.state?.movie) {
      setMovie((location.state as LocationState).movie);
      fetchSimilarMovies((location.state as LocationState).movie.id.toString());
      setLoading(false);
    } else {
      const movieId = window.location.pathname.split('/').pop();
      if (movieId) {
        fetchMovieDetails(movieId);
      } else {
        setError('Invalid movie ID');
        setLoading(false);
      }
    }
  }, [location.state, fetchMovieDetails]);

  const fetchSimilarMovies = useCallback(async (id: string) => {
    try {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${apiKey}`
      );
      if (!res.ok) throw new Error('Failed to fetch similar movies');
      const json: MovieApiResponse = await res.json();
      setSimilarMovies(json.results);
    } catch (err) {
      console.error('Error fetching similar movies:', err);
    }
  }, []);

  const handleClick = useCallback((movie: Movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  }, [navigate]);

  if (loading) {
    return (
      <>
        <Menu />
        <div className="loading-spinner">Loading...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Menu />
        <div className="error-message">
          <h2>Error: {error}</h2>
          <button onClick={() => navigate('/')}>Return to Home</button>
        </div>
      </>
    );
  }

  if (!movie) {
    return (
      <>
        <Menu />
        <div className="error-message">
          <h2>Movie not found</h2>
          <button onClick={() => navigate('/')}>Return to Home</button>
        </div>
      </>
    );
  }

  return (
    <>
      <Menu />
      <div className="movie-details-container">
        {movie.backdrop_path && (
          <div className="backdrop">
            <iframe 
              src={`https://player.videasy.net/movie/${movie.id}`}
              allowFullScreen
              width="100%" 
              height="600" 
              className="rounded-xl"
              title={`${movie.title} Trailer`}
            />
          </div>
        )}

        <div className="movie-content my-10 flex gap-3  text-purple-400 rounded py-3">
          <div className="basis-200" >
            <img 
              className="rounded-xl w-70" 
              src={
                movie.poster_path 
                  ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` 
                  : 'https://moviereelist.com/wp-content/uploads/2019/08/cinema-bg-01.jpg'
              } 
              alt={movie.title} 
            />
          </div>
          <div className="text-left">
            <h1 className="text-3xl">{movie.title}</h1>
          
            {movie.release_date && (
              <p className="release-date">
                {new Date(movie.release_date).getFullYear()}
              </p>
            )}

            {movie.vote_average && (
              <div className="rating">
                ⭐ {movie.vote_average.toFixed(1)}/10
              </div>
            )}

            {movie.runtime && (
              <p className="runtime">{movie.runtime} minutes</p>
            )}

            {/* {movie.genres?.length > 0 && (
              <div className="genres">
                {movie.genres.map(genre => (
                  <span key={genre.id}>{genre.name}</span>
                ))}
              </div>
            )} */}

            {movie.overview && (
              <p className="overview">{movie.overview}</p>
            )}
          </div>
        </div>
      </div>

      {similarMovies.length > 0 && (
        <MovieLayout>
          {similarMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={handleClick}
            />
          ))}
        </MovieLayout>
      )}
    </>
  );
}