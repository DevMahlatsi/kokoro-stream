// import Logo from "../components/Logo";
import { useEffect, useState } from "react";
import NavBar from "../Layout/Navbar";
import { useNavigate } from "react-router-dom";
// import Search from "./Search";
import { getAiringToday, getOnAir } from "../api/tvshow.api";
import type { MediaItem } from "../types/movies";
import MovieLayout from "../Layout/MovieLayout";
import { ShowCard } from "../components/ShowCard";
export default function(){
  const navigate = useNavigate();
  const [airingToday, setAiringToday] = useState<MediaItem[]>([]);
  const [onAir, setOnAir] = useState<MediaItem[]>([]);
  const [showsLoading, setShowsLoading] = useState<boolean>(true);
  const handleShowClick = (show: MediaItem) =>{
    navigate(`/tv/${show.id}`,{
      state: {show}
  });
  };
  useEffect(() => {
    async function fetchAll(){
      try{
        const shows = await getAiringToday();
        setAiringToday(shows);
      }catch(err){
        console.error("Something wrong with getAiringToday", error);
        setShowsLoading(false);
      }finally{
        setShowsLoading(false);
      }
      try{
        const shows = await getOnAir();
        setOnAir(shows);
      }catch(error){
        console.error("Error feching shows on air", error);
      }
      finally{
        setShowsLoading(true);
      }
      
    
  }
  
  })
  
  
    
    
  
  return(
    <>
       <NavBar/>
       <p className="text-purple-500 text-left text-3xl p-2 mt-4">
          TV Shows Airing Today
        </p>
       <section className="for-the-tv-shows">
        {showsLoading? (
          <p> Loading TV shows...</p>

        ): airingToday.length === 0? (
          <p>No TV shows available</p>
        ) : (
          <MovieLayout>
            {airingToday.map((show) => (
              <ShowCard 
                key = {show.id}
                show = {show}
                //Jerry we need a handld movie for when they click on the movie
                onClick={() => handleShowClick(show)}
              />
            ))}
          </MovieLayout>
        )
      }
       </section>
       
    </>
  )
}