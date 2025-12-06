import { useLocation, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import { useCallback, useEffect, useState } from "react";
import type { Movie, MovieApiResponse } from "../types/movies";
import MovieLayout from "../Layout/MovieLayout";
import { MovieCard } from "../components/MovieCard";

interface LocationState {
  movie: Movie;
}

export default function MovieDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Main states
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerLoading, setPlayerLoading] = useState(false);

  const fetchMovieDetails = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      setPlayerLoading(true);
      
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
      setTimeout(() => setPlayerLoading(false), 1000); // Simulate player load
    }
  }, []);

  useEffect(() => {
    if (location.state?.movie) {
      setMovie((location.state as LocationState).movie);
      fetchSimilarMovies((location.state as LocationState).movie.id.toString());
      setLoading(false);
      setPlayerLoading(true);
      setTimeout(() => setPlayerLoading(false), 1000);
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
        <div className="flex justify-center items-center h-64">
          <div className="loading-spinner text-xl">Loading movie details...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Menu />
        <div className="error-message p-8">
          <h2 className="text-2xl font-bold text-red-600">Error: {error}</h2>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Home
          </button>
        </div>
      </>
    );
  }

  if (!movie) {
    return (
      <>
        <Menu />
        <div className="error-message p-8">
          <h2 className="text-2xl font-bold">Movie not found</h2>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Home
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Menu />
      <div className="movie-details-container px-4 md:px-8 max-w-7xl mx-auto">
        {/* Player Section */}
        <div className="backdrop mb-6 md:mb-8">
          <div className="player-container bg-black rounded-xl overflow-hidden shadow-lg">
            <div className="aspect-video w-full relative">
              {playerLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <div className="text-white">Loading player...</div>
                </div>
              )}
              <iframe
                src={`https://vidlink.pro/movie/${movie.id}`}
                allowFullScreen
                width="100%"
                height="100%"
                title={`${movie.title}`}
                className="w-full h-full"
                onLoad={() => setPlayerLoading(false)}
              />
            </div>
            
            {/* Player Controls */}
            <div className="player-controls bg-gray-900 p-3 md:p-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
                {/* Movie Info */}
                <div className="text-white">
                  <h3 className="text-lg md:text-xl font-bold">{movie.title}</h3>
                  <p className="text-gray-300 text-sm md:text-base">
                    {movie.release_date && new Date(movie.release_date).getFullYear()}
                    {movie.runtime && ` • ${movie.runtime} minutes`}
                  </p>
                </div>
                
                {/* Player Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(-1)}
                    className="px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 text-sm md:text-base"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm md:text-base"
                  >
                    ↻ Reload Player
                  </button>
                </div>
              </div>
              
              {/* Quality/Server Selector (if you add multiple sources) */}
              <div className="mt-3 md:mt-4 flex flex-wrap gap-2">
                <span className="text-gray-400 text-sm">Currently playing: {movie.title}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Movie Details */}
        <div className="movie-content flex flex-col lg:flex-row gap-6 md:gap-8 mb-10 md:mb-12">
          {/* Poster */}
          <div className="lg:w-1/4">
            <div className="max-w-sm mx-auto lg:max-w-none">
              <img
                className="rounded-xl shadow-lg w-full h-auto"
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : 'https://moviereelist.com/wp-content/uploads/2019/08/cinema-bg-01.jpg'
                }
                alt={movie.title}
              />
            </div>
          </div>
          
          {/* Details */}
          <div className="lg:w-3/4 text-left mt-4 lg:mt-0">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
              {movie.title}
              {movie.title !== movie.title && (
                <span className="text-gray-400 text-lg md:text-xl block md:inline-block md:ml-3">
                  ({movie.title})
                </span>
              )}
            </h1>
            
            {movie.tagline && (
              <p className="text-gray-300 italic text-lg md:text-xl mb-4">
                "{movie.tagline}"
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {/* Rating */}
              {movie.vote_average && (
                <div className="flex items-center gap-2 bg-gray-800 px-3 py-1 md:px-4 md:py-2 rounded-full">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-white font-bold">
                    {movie.vote_average.toFixed(1)}/10
                  </span>
                  {movie.vote_count && (
                    <span className="text-gray-300 text-sm ml-1">
                      ({movie.vote_count.toLocaleString()} votes)
                    </span>
                  )}
                </div>
              )}
              
              {/* Release Date */}
              {movie.release_date && (
                <div className="text-gray-300">
                  📅 {new Date(movie.release_date).toLocaleDateString()}
                </div>
              )}
              
              {/* Runtime */}
              {movie.runtime && (
                <div className="text-gray-300">
                  ⏱️ {movie.runtime} minutes
                </div>
              )}
              
              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.slice(0, 4).map((genre) => (
                    <span 
                      key={genre.id}
                      className="px-2 py-1 bg-purple-900 text-purple-200 rounded-full text-xs md:text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Overview */}
            {movie.overview && (
              <div className="mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">Overview</h3>
                <p className="text-gray-300 md:text-lg leading-relaxed">{movie.overview}</p>
              </div>
            )}
            
            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Production Companies */}
              {movie.production_companies && movie.production_companies.length > 0 && (
                <div className="bg-gray-900 p-4 rounded-xl">
                  <h4 className="text-lg font-semibold text-white mb-3">Production Companies</h4>
                  <div className="flex flex-wrap gap-2">
                    {movie.production_companies.slice(0, 3).map((company) => (
                      <span 
                        key={company.id}
                        className="px-3 py-1 bg-gray-800 text-gray-300 rounded text-sm"
                      >
                        {company.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Languages */}
              {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                <div className="bg-gray-900 p-4 rounded-xl">
                  <h4 className="text-lg font-semibold text-white mb-3">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {movie.spoken_languages.slice(0, 3).map((lang) => (
                      <span 
                        key={lang.iso_639_1}
                        className="px-3 py-1 bg-gray-800 text-gray-300 rounded text-sm"
                      >
                        {lang.english_name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Status and Budget (if available) */}
            <div className="flex flex-wrap gap-4 text-sm md:text-base">
              {movie.status && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Status:</span>
                  <span className={`font-semibold ${
                    movie.status === 'Released' ? 'text-green-400' : 
                    movie.status === 'In Production' ? 'text-yellow-400' : 
                    'text-gray-300'
                  }`}>
                    {movie.status}
                  </span>
                </div>
              )}
              
              {movie.budget && movie.budget > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Budget:</span>
                  <span className="text-gray-300">
                    ${movie.budget.toLocaleString()}
                  </span>
                </div>
              )}
              
              {movie.revenue && movie.revenue > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Revenue:</span>
                  <span className="text-gray-300">
                    ${movie.revenue.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <div className="similar-movies mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">
              Similar Movies
            </h2>
            <MovieLayout>
              {similarMovies.map((similarMovie) => (
                <MovieCard
                  key={similarMovie.id}
                  movie={similarMovie}
                  onClick={handleClick}
                />
              ))}
            </MovieLayout>
          </div>
        )}
      </div>
    </>
  );
}