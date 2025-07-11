import { useLocation, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import { useCallback, useEffect, useState } from "react";
import type { Show, ShowApiResponse } from "../types/movies";

interface LocationState{
  show: Show;
}

export default function TVShowDetails(){
  const location = useLocation();
  const navigate = useNavigate();
  const [show, setShow] = useState<Show | null>(null);
  const [similarShows, setSimilarShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchShowDetails = useCallback(async (id: string) => {
    try{
      setLoading(true);
      setError(null);

      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      const [showResponse, similarResponse] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`),
        fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`)
      ]);

      if(!showResponse.ok) throw new Error("Failed to fetch TV Show Details");
      if(!similarResponse.ok) throw new Error("Faile to fetch similar TV Shows");
    
      const showData: Show = await showResponse.json();
      const similarData: ShowApiResponse = await similarResponse.json();

      setShow(showData);
      setSimilarShows(similarData.results)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  },[]);

  useEffect(() => {
    if(location.state?.show){
      setShow((location.state as LocationState).show);
      fetchSimilarShows((location.state as LocationState).show.id.toString());
      setLoading(false);
      
    }
    else{
      const showId = window.location.pathname.split('/').pop();
      if(showId){
        fetchShowDetails(showId)
      }
      else{
        setError("Invalid movie ID");
        setLoading(false);
      }
    }
  }, [location.state, fetchShowDetails]);

  const fetchSimilarShows = useCallback(async (id: string) => {
    try{
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      const res = await fetch(
        `https:api.themoviedb.org/3/tv/${id}/similar?api_key=${apiKey}`
      );
      if(!res.ok) throw new Error("Failed to fetch similar TV Shows");
      const json: ShowApiResponse = await res.json();
      setSimilarShows(json.results);
    }
    catch(err){
      console.error("Error fetching similar movies: ", err);
    }
  }, []);

  const handleClick = useCallback((show: Show) => {
    navigate(`/tv/${show.id}`, {state: {show}});
  }, [navigate]
  );

  if(loading){
    return(
      <>
      <Menu/>
      <div className="loading-spinner">Loading...</div>
      </>
    );
  }
  if(error){
    return(
      <>
      <Menu/>
      <div className="error-message">
          <h2>Error: {error}</h2>
          <button onClick={() => navigate('/')}>Return to Home</button>
        </div>
      </>
    );
  }
  if(!show){
    return (
      <>
        <Menu />
        <div className="error-message">
          <h2>Show not found</h2>
          <button onClick={() => navigate('/')}>Return to Home</button>
        </div>
      </>
    )
  }
  return(
    <>
      <Menu/>
      <div className="show-details-cotainer">
        {show.backdrop_path && (
          <div className="backdrop">
            <iframe
            src={`https://vidlink.pro/tv/${show.id}/1/1`}
            allowFullScreen
            width="100%"
            height="600"
            className="rounded-xl"
            />
            

          </div>
        )}
      </div>
    </>
  )
}