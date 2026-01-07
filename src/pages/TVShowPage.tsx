import { useLocation, useNavigate, useParams } from "react-router-dom";
import Menu from "../components/Menu";
import { useCallback, useEffect, useState } from "react";
import type { MediaItem, ShowApiResponse, Season, Episode } from "../types/movies";
import { ShowCard } from "../components/ShowCard";
import MovieLayout from "../Layout/MovieLayout";
import NavBar from "../Layout/Navbar";

interface LocationState {
  show: MediaItem;
}

interface SeasonDetails {
  season_number: number;
  episode_count: number;
  episodes: Episode[];
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string;
}

export default function TVShowDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, season: urlSeason, episode: urlEpisode } = useParams<{
    id: string;
    season?: string;
    episode?: string;
  }>();
  
  // Main states
  const [show, setShow] = useState<MediaItem | null>(null);
  const [similarShows, setSimilarShows] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Player states - initialize from URL params if available
  const [season, setSeason] = useState(urlSeason ? parseInt(urlSeason, 10) : 1);
  const [episode, setEpisode] = useState(urlEpisode ? parseInt(urlEpisode, 10) : 1);
  const [seasonDetails, setSeasonDetails] = useState<SeasonDetails | null>(null);
  const [loadingSeason, setLoadingSeason] = useState(false);
  
  // Theater mode state
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  const fetchShowDetails = useCallback(async (showId: string) => {
    try {
      setLoading(true);
      setError(null);

      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      const [showResponse, similarResponse] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/tv/${showId}?api_key=${apiKey}`),
        fetch(`https://api.themoviedb.org/3/tv/${showId}/similar?api_key=${apiKey}`)
      ]);

      if (!showResponse.ok) throw new Error("Failed to fetch TV Show Details");
      if (!similarResponse.ok) throw new Error("Failed to fetch similar TV Shows");

      const showData: any = await showResponse.json();
      const similarData: ShowApiResponse = await similarResponse.json();

      // Process show data to ensure seasons is an array
      const processedShowData: MediaItem = {
        ...showData,
        seasons: showData.seasons || []
      };

      setShow(processedShowData);
      setSimilarShows(similarData.results);

      // Fetch season details based on URL params or default to season 1
      const initialSeason = urlSeason ? parseInt(urlSeason, 10) : 1;
      const initialEpisode = urlEpisode ? parseInt(urlEpisode, 10) : 1;
      
      if (showData.id) {
        await fetchSeasonDetails(showData.id, initialSeason);
        
        // Set episode after season details are loaded
        setEpisode(initialEpisode);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [urlSeason, urlEpisode]);

  const fetchSimilarShows = useCallback(async (id: string) => {
    try {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/similar?api_key=${apiKey}`
      );
      if (!res.ok) throw new Error("Failed to fetch similar TV Shows");
      const json: ShowApiResponse = await res.json();
      setSimilarShows(json.results);
    } catch (err) {
      console.error("Error fetching similar movies: ", err);
    }
  }, []);

  const fetchSeasonDetails = useCallback(async (showId: number, seasonNumber: number) => {
    try {
      setLoadingSeason(true);
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${showId}/season/${seasonNumber}?api_key=${apiKey}`
      );
      if (res.ok) {
        const data = await res.json();
        const newSeasonDetails = {
          season_number: data.season_number,
          episode_count: data.episodes?.length || 0,
          episodes: data.episodes || [],
          name: data.name || `Season ${seasonNumber}`,
          overview: data.overview || '',
          poster_path: data.poster_path,
          air_date: data.air_date || ''
        };
        setSeasonDetails(newSeasonDetails);
        
        // If current episode is invalid for this season, reset to episode 1
        if (episode > newSeasonDetails.episode_count) {
          setEpisode(1);
        }
      }
    } catch (err) {
      console.error("Error fetching season details:", err);
    } finally {
      setLoadingSeason(false);
    }
  }, [episode]);

  useEffect(() => {
    // If we have URL params but no location state (direct URL access)
    if (id && !location.state?.show) {
      fetchShowDetails(id);
    } 
    // If we have location state (navigation from another page)
    else if (location.state?.show) {
      const currentShow = (location.state as LocationState).show;
      setShow(currentShow);
      fetchSimilarShows(currentShow.id.toString());
      
      // Use URL params if available, otherwise fetch season 1
      const initialSeason = urlSeason ? parseInt(urlSeason, 10) : 1;
      const initialEpisode = urlEpisode ? parseInt(urlEpisode, 10) : 1;
      
      fetchSeasonDetails(currentShow.id, initialSeason);
      setEpisode(initialEpisode);
      setLoading(false);
    } else {
      setError("Invalid TV show ID");
      setLoading(false);
    }
  }, [location.state, id, urlSeason, urlEpisode, fetchShowDetails, fetchSimilarShows, fetchSeasonDetails]);

  const handleClick = useCallback((show: MediaItem) => {
    navigate(`/tv/${show.id}/season/1/episode/1`, { state: { show } });
  }, [navigate]);

  if (loading) {
    return (
      <>
        <Menu />
        <div className="flex justify-center items-center h-64">
          <div className="loading-spinner text-xl">Loading show details...</div>
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

  if (!show) {
    return (
      <>
        <Menu />
        <div className="error-message p-8">
          <h2 className="text-2xl font-bold">Show not found</h2>
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

  // Functions that depend on show being not null
  const updateUrlParams = useCallback((newSeason: number, newEpisode: number) => {
    navigate(`/tv/${show.id}/season/${newSeason}/episode/${newEpisode}`, {
      replace: true,
      state: { show }
    });
  }, [show, navigate]);

  const handleSeasonChange = useCallback((newSeason: number) => {
    fetchSeasonDetails(show.id, newSeason);
    setSeason(newSeason);
    updateUrlParams(newSeason, 1);
  }, [show, fetchSeasonDetails, updateUrlParams]);

  const handleEpisodeChange = useCallback((newEpisode: number) => {
    setEpisode(newEpisode);
    updateUrlParams(season, newEpisode);
  }, [show, season, updateUrlParams]);

  const goToNextEpisode = () => {
    if (seasonDetails && episode < seasonDetails.episode_count) {
      const newEpisode = episode + 1;
      setEpisode(newEpisode);
      updateUrlParams(season, newEpisode);
    } else if (show.number_of_seasons && season < show.number_of_seasons) {
      // Go to next season, episode 1
      const newSeason = season + 1;
      handleSeasonChange(newSeason);
    }
  };

  const goToPrevEpisode = () => {
    if (episode > 1) {
      const newEpisode = episode - 1;
      setEpisode(newEpisode);
      updateUrlParams(season, newEpisode);
    } else if (season > 1) {
      // Go to previous season
      const newSeason = season - 1;
      handleSeasonChange(newSeason);
    }
  };

  return (
    <>
      {/* Conditionally render NavBar based on theater mode */}
      {!isTheaterMode && <NavBar />}
      
      <div className={`show-details-container px-4 md:px-8 mx-auto ${
        isTheaterMode ? 'max-w-full px-0' : 'max-w-7xl'
      }`}>
        {/* Player Section */}
        <div className={`backdrop mb-6 md:mb-8 ${
          isTheaterMode ? 'px-4 md:px-8' : ''
        }`}>
          <div className={`player-container bg-black rounded-xl overflow-hidden shadow-lg ${
            isTheaterMode ? 'rounded-none md:rounded-none' : ''
          }`}>
            <div className="aspect-video w-full">
              <iframe
                src={`https://player.videasy.net/tv/${show.id}/${season}/${episode}`}
                allowFullScreen
                width="100%"
                height="100%"
                title={`${show.original_name} - Season ${season}, Episode ${episode}`}
                className="w-full h-full"
              />
            </div>
            
            {/* Player Controls - Improved for mobile */}
            <div className="player-controls bg-gray-900 p-3 md:p-4">
              {/* Mobile: Simplified controls */}
              <div className="md:hidden">
                <div className="text-white mb-3">
                  <h3 className="text-lg font-bold truncate">{show.original_name}</h3>
                  <p className="text-gray-300 text-sm">
                    S{season}E{episode}
                    {seasonDetails?.episodes?.[episode - 1]?.name && 
                      `: ${seasonDetails.episodes[episode - 1].name.substring(0, 20)}...`}
                  </p>
                </div>
                
                <div className="flex justify-between items-center gap-2">
                  <button
                    onClick={goToPrevEpisode}
                    disabled={(episode === 1 && season === 1) || loadingSeason}
                    className="px-3 py-2 bg-gray-800 text-white rounded text-sm flex-1 disabled:opacity-50"
                  >
                    ← Prev
                  </button>
                  
                  <div className="flex gap-2">
                    <select
                      value={season}
                      onChange={(e) => handleSeasonChange(Number(e.target.value))}
                      className="bg-gray-800 text-white p-1 rounded text-sm w-20"
                    >
                      {/* Type-safe season selector for mobile */}
                      {show.seasons && show.seasons.length > 0 ? (
                        show.seasons.slice(0, 5).map((s: Season) => (
                          <option key={s.season_number} value={s.season_number}>
                            S{s.season_number}
                          </option>
                        ))
                      ) : (
                        Array.from({ length: show.number_of_seasons || 1 }, (_, i) => i + 1)
                          .slice(0, 5)
                          .map((seasonNum) => (
                            <option key={seasonNum} value={seasonNum}>
                              S{seasonNum}
                            </option>
                          ))
                      )}
                    </select>
                    
                    <select
                      value={episode}
                      onChange={(e) => handleEpisodeChange(Number(e.target.value))}
                      className="bg-gray-800 text-white p-1 rounded text-sm w-24"
                    >
                      {seasonDetails?.episodes?.slice(0, 10).map((ep: Episode) => (
                        <option key={ep.episode_number} value={ep.episode_number}>
                          Ep {ep.episode_number}
                        </option>
                      ))}
                    </select>
                    
                    {/* Theater Mode Button - Mobile */}
                    <button
                      onClick={() => setIsTheaterMode(!isTheaterMode)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                      title={isTheaterMode ? "Exit Theater Mode" : "Theater Mode"}
                    >
                      {isTheaterMode ? '✕' : '◼'}
                    </button>
                  </div>
                  
                  <button
                    onClick={goToNextEpisode}
                    disabled={loadingSeason}
                    className="px-3 py-2 bg-gray-800 text-white rounded text-sm flex-1 disabled:opacity-50"
                  >
                    Next →
                  </button>
                </div>
              </div>
              
              {/* Desktop: Full controls */}
              <div className="hidden md:block">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-white">
                    <h3 className="text-xl font-bold">{show.original_name}</h3>
                    <p className="text-gray-300">
                      Season {season} • Episode {episode}
                      {seasonDetails?.episodes?.[episode - 1]?.name && 
                        `: ${seasonDetails.episodes[episode - 1].name}`}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      <button
                        onClick={goToPrevEpisode}
                        disabled={(episode === 1 && season === 1) || loadingSeason}
                        className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                      >
                        ← Prev
                      </button>
                      <button
                        onClick={goToNextEpisode}
                        disabled={loadingSeason}
                        className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                      >
                        Next →
                      </button>
                      
                      {/* Theater Mode Button - Desktop */}
                      <button
                        onClick={() => setIsTheaterMode(!isTheaterMode)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                        title={isTheaterMode ? "Exit Theater Mode" : "Theater Mode"}
                      >
                        {isTheaterMode ? (
                          <>
                            <span>✕</span>
                            <span>Exit Theater</span>
                          </>
                        ) : (
                          <>
                            <span>◼</span>
                            <span>Theater</span>
                          </>
                        )}
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <label className="text-white">Season:</label>
                      <select
                        value={season}
                        onChange={(e) => handleSeasonChange(Number(e.target.value))}
                        className="bg-gray-800 text-white p-2 rounded"
                      >
                        {/* Type-safe season selector for desktop */}
                        {show.seasons && show.seasons.length > 0 ? (
                          show.seasons.map((s: Season) => (
                            <option key={s.season_number} value={s.season_number}>
                              Season {s.season_number} ({s.episode_count || '?'} eps)
                            </option>
                          ))
                        ) : show.number_of_seasons ? (
                          Array.from({ length: show.number_of_seasons }, (_, i) => i + 1).map((seasonNum) => (
                            <option key={seasonNum} value={seasonNum}>
                              Season {seasonNum}
                            </option>
                          ))
                        ) : (
                          <option value={1}>Season 1</option>
                        )}
                      </select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <label className="text-white">Episode:</label>
                      <select
                        value={episode}
                        onChange={(e) => handleEpisodeChange(Number(e.target.value))}
                        className="bg-gray-800 text-white p-2 rounded min-w-[180px]"
                      >
                        {seasonDetails?.episodes?.map((ep: Episode) => (
                          <option key={ep.episode_number} value={ep.episode_number}>
                            Ep {ep.episode_number}: {ep.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Episode Description */}
              {seasonDetails?.episodes?.[episode - 1]?.overview && (
                <div className="mt-3 md:mt-4 p-3 bg-gray-800 rounded">
                  <p className="text-gray-300 text-sm md:text-base">
                    {seasonDetails.episodes[episode - 1].overview}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Conditionally render content based on theater mode */}
        {!isTheaterMode && (
          <>
            {/* Show Details - FIXED RESPONSIVE IMAGE */}
            <div className="tv-content flex flex-col lg:flex-row gap-6 md:gap-8 mb-10 md:mb-12">
              {/* Poster - Fixed sizing */}
              <div className="lg:w-1/4">
                <div className="max-w-sm mx-auto lg:max-w-none">
                  <img
                    className="rounded-xl shadow-lg w-full h-auto"
                    src={
                      show.poster_path
                        ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                        : 'https://moviereelist.com/wp-content/uploads/2019/08/cinema-bg-01.jpg'
                    }
                    alt={show.original_name}
                  />
                </div>
              </div>
              
              {/* Details */}
              <div className="lg:w-3/4 text-left mt-4 lg:mt-0">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                  {show.original_name}
                </h1>
                
                {show.first_air_date && (
                  <p className="text-gray-400 mb-3 md:mb-4">
                    First aired: {new Date(show.first_air_date).toLocaleDateString()}
                  </p>
                )}
                
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  {show.vote_average && (
                    <div className="flex items-center gap-2 bg-gray-800 px-3 py-1 md:px-4 md:py-2 rounded-full">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-white font-bold">
                        {show.vote_average.toFixed(1)}/10
                      </span>
                    </div>
                  )}
                  
                  {show.number_of_seasons && (
                    <div className="text-gray-300">
                      {show.number_of_seasons} season{show.number_of_seasons > 1 ? 's' : ''}
                    </div>
                  )}
                  
                  {show.genres && show.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {show.genres.slice(0, 3).map((genre) => (
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
                
                {show.overview && (
                  <div className="mb-6 md:mb-8">
                    <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">Overview</h3>
                    <p className="text-gray-300 md:text-lg leading-relaxed">{show.overview}</p>
                  </div>
                )}
                
                {/* Season Info */}
                {seasonDetails && (
                  <div className="bg-gray-900 p-4 md:p-6 rounded-xl">
                    <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4">
                      {seasonDetails.name}
                    </h3>
                    {seasonDetails.overview && (
                      <p className="text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
                        {seasonDetails.overview}
                      </p>
                    )}
                    <div className="text-gray-400 text-sm md:text-base">
                      {seasonDetails.episode_count} episodes • 
                      {seasonDetails.air_date && (
                        ` Aired ${new Date(seasonDetails.air_date).getFullYear()}`
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Similar Shows */}
            {similarShows.length > 0 && (
              <div className="similar-shows mb-10 md:mb-16">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">
                  Similar Shows
                </h2>
                <MovieLayout>
                  {similarShows.map((similarShow) => (
                    <ShowCard
                      key={similarShow.id}
                      show={similarShow}
                      onClick={handleClick}
                    />
                  ))}
                </MovieLayout>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}