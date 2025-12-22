import { useLocation, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import { useEffect, useState } from "react";
import type { MediaItem } from "../types/movies";
import { MovieCard } from "../components/MovieCard";
import MovieLayout from "../Layout/MovieLayout";
import Logo from "../components/Logo";
import { fetchSearchResults } from "../api/search.api";

export default function Search() {
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearchResultsWrapper = async () => {
      try {
        setLoading(true);
        const query = location.state?.query || '';
        
        const results = await fetchSearchResults(query);
        
        setSearchResults(results);
      } catch (err) {
        console.error('Fetch error:', err);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResultsWrapper();
  }, [location.state]);


  const handleClick = (item: MediaItem) => {
    
    if (item.media_type === 'movie') {
      navigate(`/movie/${item.id}`, {
        state: { movie: item }
      });
    } else if (item.media_type === 'tv') {
      navigate(`/tv/${item.id}`, {
        state: { show: item }
      });
    }
    
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
      <Logo/>
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