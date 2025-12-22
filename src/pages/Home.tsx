import { useEffect, useState } from "react";
import type { MediaItem } from "../types/movies";
import Navbar from "../Layout/Navbar";
import { useNavigate } from "react-router-dom";
import { MovieCard } from "../components/MovieCard";
import MovieLayout from "../Layout/MovieLayout";
import { ShowCard } from "../components/ShowCard";
import { getNowPlaying } from "../api/movie.api";
import { getAiringToday } from "../api/tvshow.api";

export default function Home() {
  const [query, setQuery] = useState<string>("");
  const [nowPlaying, setNowPlaying] = useState<MediaItem[]>([]);
  const [airingToday, setAiringToday] = useState<MediaItem[]>([]);
  const [moviesLoading, setMoviesLoading] = useState<boolean>(true);
  const [showsLoading, setShowsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const movies = await getNowPlaying();
        setNowPlaying(movies);
      } catch (err) {
        console.error('Fetch error for movies:', err);
      } finally {
        setMoviesLoading(false);
      }
      try {
        const shows = await getAiringToday();
        setAiringToday(shows);
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
    navigate(`/tv/${show.id}/season/1/episode/1`, {
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
  // const handleSubmit = (e) =>{
  //   e.preventDefault();
  // }

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
          
          {/* <div className='py-23'>
            <button type="button" className='hover:cursor-pointer border py-3 rounded-xl text-purple-400 hover:text-purple-700 p-4'>
              Explore Library
            </button>
          </div> */}
          
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