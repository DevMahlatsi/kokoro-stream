import { useEffect, useState } from "react";
import type { Movie, Show, ShowApiResponse, MovieApiResponse } from "../types/movies";
import Navbar from "../Layout/Navbar";
import { useNavigate } from "react-router-dom";
import { MovieCard } from "../components/MovieCard";
import MovieLayout from "../Layout/MovieLayout";
import { ShowCard } from "../components/ShowCard";


export default function Home() {
  const [query, setQuery] = useState<string>("");
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [airingToday, setAiringToday] = useState<Show[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        //fetching for movies
        const resMovies = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`
        );
        if (!resMovies.ok) throw new Error('Network error');
        const json: MovieApiResponse = await resMovies.json();
        setNowPlaying(json.results || []);
      } catch (err) {
        console.error('Fetch error for fetching:', err);
      } finally {
        setLoading(false);
      }
      try{
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      const resShows = await fetch(`https://api.themoviedb.org/3/tv/airing_today?api_key=${apiKey}`);
      if(!resShows.ok) throw new Error('Network Error');
      const json: ShowApiResponse = await resShows.json();
      setAiringToday(json.results || []);
    }
    catch(err){
      console.error('Fetch Error for fetching TV Shows:', err);
    }
    finally{
      setLoading(false);
    }
    }
    fetchRecommendations();
  }, []);
    
  const handleMediaClick = (media: Movie | Show) => {
    if('title' in media){
      navigate(`/movie/${media.id}`, { 
      state: {movie: media } // Pass full movie data
    });
    }
    else{
      navigate(`/tv/${media.id}`, {state: {show: media}})
    };
    
  };
  const handleSearch = () => {
    if (query.trim()) {
      const encodedQuery = encodeURIComponent(query);
      navigate(`/search?q=${encodedQuery}`,{
        state: {query},
      });
    }
  };

  return (
    <>
      <Navbar />
      <main className='text-2xl text-white-800'>
        <form onSubmit={(e) => {
          e.preventDefault(); // Stops reload
          handleSearch();
        }}>
          <div className='wrap flex-c justify-center text-2xl'>
            <input 
              value={query}
              type="search" 
              
              className='border border-purple-400 m-0 w-60 h-13 px-3 transition placeholder-purple-400 text-purple-400 hover:border-purple-800 outline-none rounded-l-lg' 
              placeholder='Search...'
              onChange={(e) => {setQuery(e.target.value); console.log(encodeURIComponent(e.target.value))}}

            />
            <input 
              type="button" 
              value="Search" 
              className='m-0 text-purple-400 border h-13 px-3 hover:cursor-pointer hover:border-purple-500 hover:text-purple-500 transition rounded-r-lg border-l-none'
              
              onClick={() => {
                handleSearch();
              }}
            />
          </div>
          
          <div className='py-23'>
            <button type="button" className='hover:cursor-pointer border py-3 rounded-xl text-purple-400 hover:text-purple-700 p-4'>
              Explore Library
            </button>
          </div>
        </form>

        {/* Display movies */}
        <p className="text-purple-500 text-left text-3xl p-2">
          Movies Now Playing
        </p>
        <section className="for-the-movies">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
            <MovieLayout>
              {nowPlaying.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie = {movie}
                  onClick={handleMediaClick}
                  />
              ))}
            </MovieLayout>
            </>
          
          )}
        </section>
        <p className="text-purple-500 text-left text-3xl p-2">
          TV Shows Airing
        </p>
        <section className="for-the-tv-shows">
          {loading ? (
            <p>
              Loading...
            </p>):
            (
              <>
              <MovieLayout>
                {airingToday.map((show) => (
                  <ShowCard
                  key={show.id}
                  show={show}
                  onClick={handleMediaClick}
                  />
                ))}
              </MovieLayout>
              </>
            
          )}

        </section>
        

      </main>
    </>
  );
}