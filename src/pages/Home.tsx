import { useEffect, useState } from "react";
import type { MediaItem, MovieApiResponse, ShowApiResponse } from "../types/movies";
import Navbar from "../Layout/Navbar";
import { useNavigate } from "react-router-dom";
import { MovieCard } from "../components/MovieCard";
import MovieLayout from "../Layout/MovieLayout";
import { ShowCard } from "../components/ShowCard";

export default function Home() {
  const [query, setQuery] = useState<string>("");
  const [nowPlaying, setNowPlaying] = useState<MediaItem[]>([]);
  const [airingToday, setAiringToday] = useState<MediaItem[]>([]);
  const [moviesLoading, setMoviesLoading] = useState<boolean>(true);
  const [showsLoading, setShowsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    async function fetchRecommendations() {
      // Fetch movies
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const resMovies = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`
        );
        if (!resMovies.ok) throw new Error('Network error');
        const json: MovieApiResponse = await resMovies.json();
        setNowPlaying(json.results || []);
      } catch (err) {
        console.error('Fetch error for movies:', err);
      } finally {
        setMoviesLoading(false);
      }

      // Fetch TV shows
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const resShows = await fetch(`https://api.themoviedb.org/3/tv/airing_today?api_key=${apiKey}`);
        if (!resShows.ok) throw new Error('Network Error');
        const json: ShowApiResponse = await resShows.json();
        setAiringToday(json.results || []);
      } catch (err) {
        console.error('Fetch Error for TV Shows:', err);
      } finally {
        setShowsLoading(false);
      }
    }
    
    fetchRecommendations();
  }, []);
    
  const handleMovieClick = (movie: MediaItem) => {
    navigate(`/movie/${movie.id}`, { 
      state: { movie }
    });
  };

  const handleShowClick = (show: MediaItem) => {
    navigate(`/tv/${show.id}`, {
      state: { show }
    });
  };

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search`, {
        state: { query: query.trim() }
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <>
      <Navbar />
      <main className='text-2xl text-white-800'>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}>
          <div className='wrap flex-c justify-center text-2xl'>
            <input 
              value={query}
              type="search" 
              className='border border-purple-400 m-0 w-60 h-13 px-3 transition placeholder-purple-400 text-purple-400 hover:border-purple-800 outline-none rounded-l-lg' 
              placeholder='Search...'
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button 
              type="submit"
              className='m-0 text-purple-400 border h-13 px-3 hover:cursor-pointer hover:border-purple-500 hover:text-purple-500 transition rounded-r-lg border-l-none'
            >
              Search
            </button>
          </div>
          
          <div className='py-23'>
            <button type="button" className='hover:cursor-pointer border py-3 rounded-xl text-purple-400 hover:text-purple-700 p-4'>
              Explore Library
            </button>
          </div>
        </form>

        {/* Movies Section */}
        <p className="text-purple-500 text-left text-3xl p-2">
          Movies Now Playing
        </p>
        <section className="for-the-movies">
          {moviesLoading ? (
            <p>Loading movies...</p>
          ) : nowPlaying.length === 0 ? (
            <p>No movies available</p>
          ) : (
            <MovieLayout>
              {nowPlaying.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={() => handleMovieClick(movie)}
                />
              ))}
            </MovieLayout>
          )}
        </section>

        {/* TV Shows Section */}
        <p className="text-purple-500 text-left text-3xl p-2 mt-4">
          TV Shows Airing Today
        </p>
        <section className="for-the-tv-shows">
          {showsLoading ? (
            <p>Loading TV shows...</p>
          ) : airingToday.length === 0 ? (
            <p>No TV shows available</p>
          ) : (
            <MovieLayout>
              {airingToday.map((show) => (
                <ShowCard
                  key={show.id}
                  show={show}
                  onClick={() => handleShowClick(show)}
                />
              ))}
            </MovieLayout>
          )}
        </section>
      </main>
    </>
  );
}