import Menu from "../components/Menu";
import { useLocation, useNavigate } from "react-router-dom";
import type { Movie } from "../types/movies";
import { useEffect, useState } from "react";

// Define the shape of your location state
interface LocationState {
  movie: Movie;
}

export default function MovieDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First try to get movie from navigation state
    if (location.state?.movie) {
      setMovie((location.state as LocationState).movie);
      setLoading(false);
    } else {
      // If no state, try to fetch from API using URL ID
      const movieId = window.location.pathname.split('/').pop();
      if (movieId) {
        fetchMovieDetails(movieId)
          .then(data => {
            setMovie(data);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }
  }, [location.state]);

  async function fetchMovieDetails(id: string) {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
    );
    if (!response.ok) throw new Error('Failed to fetch movie');
    return await response.json() as Movie;
  }

  if (loading) {
    return (
      <>
        <Menu />
        <div className="loading-spinner">Loading...</div>
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
        {/* Backdrop Image */}
        {movie.backdrop_path && (
          <div className="backdrop">
            {/* <img 
              className="rounded-2xl
                         my-10"
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={`${movie.title} backdrop`}
            /> */}
            <iframe src={`https://vidlink.pro/movie/${movie.id}?primaryColor=7e22ce&secondaryColor=a2a2a2&iconColor=7e22ce&autoplay=false`}
            allowFullScreen
            width={`100%`} height={"600"} className="rounded-xl"></iframe>
          </div>
        )}

        {/* Movie Content */}
        <div className="movie-content
         my-10 text-purple-400 rounded py-3">
          <div>
            <img className="rounded-xl" src={
                      movie.poster_path 
                        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` 
                        : 'https://moviereelist.com/wp-content/uploads/2019/08/cinema-bg-01.jpg'
                    } alt={`img: ${movie.title}`} /></div>
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

          {movie.genres && movie.genres.length > 0 && (
            <div className="genres">
              {movie.genres.map(genre => (
                <span key={genre.id}>{genre.name}</span>
              ))}
            </div>
          )}

          {movie.overview && (
            <p className="overview">{movie.overview}</p>
          )}
        </div>
          
        </div>
      </div>
    </>
  );
}