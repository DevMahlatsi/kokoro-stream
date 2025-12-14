// import MovieLayout from "../Layout/MovieLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../Layout/Navbar";
import type { MediaItem } from "../types/movies";
import { getNowPlaying, getPopularMovies, getTopRatedMovies, getUpcomingMovies } from "../api/movie.api";
import MovieLayout from "../Layout/MovieLayout";
import { MovieCard } from "../components/MovieCard";

export default function(){
  const navigate = useNavigate();
  const [nowPlaying, setNowPlaying] = useState<MediaItem[]>([]);
  const [topRated, setTopRated] = useState<MediaItem[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<MediaItem[]>([]);
  const [popularMovies, setPopularMovies] = useState<MediaItem[]>([]);
  const [moviesLoading, setMoviesLoading] = useState<boolean>(true);
  
  useEffect(() => {
    async function fetchAll(){
      try {
        const movies = await getNowPlaying();
        setNowPlaying(movies);
      } catch (err) {
        console.error('Fetch error for movies:', err);
      } finally {
        setMoviesLoading(false);
      }
      try{
        const movies = await getTopRatedMovies();
        setTopRated(movies);
      }catch(err){
        console.log("Error fetching top rated movies", err);
      }
      finally{
        setMoviesLoading(false);
      }
      try{
        const movies = await getPopularMovies();
        setPopularMovies(movies);
      }catch(err){
        console.log("Error fetching top rated movies", err);
      }
      finally{
        setMoviesLoading(false);
      }
      try{
        const movies = await getUpcomingMovies();
        setUpcomingMovies(movies);
      }
      catch(err){
        console.error("Error while fetching upcoming movies.");
      }
      finally{
        setMoviesLoading(false);
      }
   
    }
    fetchAll();     
  },
    []);

      const handleMovieClick = (movie: MediaItem) => {
    navigate(`/movie/${movie.id}`, { 
      state: { movie }
    });
  };

  return(
    <>
      This is the the movie page for the users wondering at home
      <NavBar/>
      <p className="text-purple-500 text-left text-3xl p-2">
          Movies Now Playing
        </p>
      <section className="for-the-movies">
        {moviesLoading? (
          <p>Loading Movies...</p>
        ): nowPlaying.length === 0 ? (
          <p> No movies available</p>
        ) :(
          <MovieLayout>
            {nowPlaying.map((movie) =>(
              <MovieCard
              key={movie.id}
              movie = {movie}
              onClick={() => handleMovieClick(movie)}
            />
            ))}
          </MovieLayout>
        )}
      </section>
      <p className="text-purple-500 text-left text-3xl p-2">
          Top Rated Movies
        </p>
        <section className="for-the-movies">
        {moviesLoading? (
          <p>Loading Movies...</p>
        ): topRated.length === 0 ? (
          <p> No movies available</p>
        ) :(
          <MovieLayout>
            {topRated.map((movie) =>(
              <MovieCard
              key={movie.id}
              movie = {movie}
              onClick={() => handleMovieClick(movie)}
            />
            ))}
          </MovieLayout>
        )}
      </section>  
      <p className="text-purple-500 text-left text-3xl p-2">
          Popular Movies
        </p>
        <section className="for-the-movies">
        {moviesLoading? (
          <p>Loading Movies...</p>
        ): popularMovies.length === 0 ? (
          <p> No movies available</p>
        ) :(
          <MovieLayout>
            {popularMovies.map((movie) =>(
              <MovieCard
              key={movie.id}
              movie = {movie}
              onClick={() => handleMovieClick(movie)}
            />
            ))}
          </MovieLayout>
        )}
      </section>  
      <p className="text-purple-500 text-left text-3xl p-2">
          Upcoming Movies
        </p>
        <section className="for-the-movies">
        {moviesLoading? (
          <p>Loading Movies...</p>
        ): upcomingMovies.length === 0 ? (
          <p> No movies available</p>
        ) :(
          <MovieLayout>
            {upcomingMovies.map((movie) =>(
              <MovieCard
              key={movie.id}
              movie = {movie}
              onClick={() => handleMovieClick(movie)}
            />
            ))}
          </MovieLayout>
        )}
      </section>
      {/* <MovieLayout/> */}
    </>
  )
}