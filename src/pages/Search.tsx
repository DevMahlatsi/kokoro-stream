import { useLocation, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import { useEffect, useState } from "react";
import type { MediaItem, MultiSearchResponse } from "../types/movies";
import { MovieCard } from "../components/MovieCard";
import MovieLayout from "../Layout/MovieLayout";

export default function Search() {
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const query = location.state?.query || '';

        if (!query.trim()) {
          setSearchResults([]);
          return;
        }

        const response = await fetch(
          `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&api_key=${apiKey}`
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const json: MultiSearchResponse = await response.json();
        
        // Filter out "person" results if you don't want them
        const filteredResults = json.results.filter(
          item => item.media_type !== 'person'
        );
        
        setSearchResults(filteredResults);
      } catch (err) {
        console.error('Fetch error:', err);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [location.state]);

  const handleClick = (item: MediaItem) => {
    // Navigate to different routes based on media type
    if (item.media_type === 'movie') {
      navigate(`/movie/${item.id}`, {
        state: { movie: item }
      });
    } else if (item.media_type === 'tv') {
      navigate(`/tv/${item.id}`, {
        state: { show: item }
      });
    }
    // Note: We filtered out 'person' above, but if you keep them:
    // else if (item.media_type === 'person') {
    //   navigate(`/person/${item.id}`);
    // }
  };

  if (loading) {
    return (
      <>
        <Menu />
        <div className="flex justify-center items-center h-64">
          <p>Loading search results...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Menu />
      <div>
        {searchResults.length === 0 ? (
          <div className="text-center py-10">
            <p>No results found for "{location.state?.query}"</p>
          </div>
        ) : (
          <MovieLayout>
            {searchResults.map((item) => (
              <MovieCard
                key={`${item.media_type}-${item.id}`}
                movie={item}
                onClick={() => handleClick(item)}
              />
            ))}
          </MovieLayout>
        )}
      </div>
    </>
  );
}