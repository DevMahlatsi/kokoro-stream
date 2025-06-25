import { useEffect, useState } from "react";
import type { Movie } from "../types/movies";
import Navbar from "../Layout/Navbar";
import { useNavigate } from "react-router-dom";
import type {MovieApiResponse} from "../types/movies";


export default function Home() {
  const [query, setQuery] = useState<string>("");
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`
        );
        if (!response.ok) throw new Error('Network error');
        const json: MovieApiResponse = await response.json();
        setNowPlaying(json.results || []);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRecommendations();
  }, []);
    
  const handleClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`, { 
      state: { movie } // Pass full movie data
    });
  };

  return (
    <>
      <Navbar />
      <main className='text-2xl text-white-800'>
        <form>
          
          <div className='wrap flex-c justify-center text-2xl'>
            <input 
              value={query}
              type="search" 
              
              className='border border-purple-400 m-0 w-60 h-13 px-3 transition placeholder-purple-400 text-purple-400 hover:border-purple-800 outline-none rounded-l-lg' 
              placeholder='Search...'
              onChange={(e) => {setQuery(e.target.value); console.log(query)}}
              
            />
            <input 
              type="button" 
              value="Search" 
              className='m-0 text-purple-400 border h-13 px-3 hover:cursor-pointer hover:border-purple-500 hover:text-purple-500 transition rounded-r-lg border-l-none' 
            />
          </div>
          
          <div className='py-23'>
            <button className='hover:cursor-pointer border py-3 rounded-xl text-purple-400 hover:text-purple-700 p-4'>
              Explore Library
            </button>
          </div>
        </form>

        {/* Display movies */}
        <section>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className='text-white-800 flex flex-wrap gap-2 justify-center'>
              {nowPlaying.map((movie) => (
                <div 
                  onClick={() => handleClick(movie)}
                  key={movie.id} 
                  className='hover:cursor-pointer p-2 basis-30 shrink-1 grow-1 max-w-40 hover:bg-black hover:text-purple-400 rounded-2xl transition-all'
                  role="button"
                  tabIndex={0}
                >
                  <img 
                    className='rounded-2xl w-full h-auto' 
                    src={
                      movie.poster_path 
                        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` 
                        : 'https://moviereelist.com/wp-content/uploads/2019/08/cinema-bg-01.jpg'
                    } 
                    alt={movie.title} 
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://moviereelist.com/wp-content/uploads/2019/08/cinema-bg-01.jpg';
                    }}
                  />
                  <h6 className='text-xs pt-1 line-clamp-2'>{movie.title}</h6>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}