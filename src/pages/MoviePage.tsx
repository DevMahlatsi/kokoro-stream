// import MovieLayout from "../Layout/MovieLayout";
import { useEffect } from "react";
import NavBar from "../Layout/Navbar";

export default function(){
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
    }
  })

  return(
    <>
      This is the the movie page for the users wondering at home
      <NavBar/>
      {/* <MovieLayout/> */}
    </>
  )
}