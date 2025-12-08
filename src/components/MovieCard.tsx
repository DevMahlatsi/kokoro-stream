import React from 'react';
import type { MovieCardProps } from '../types/movies';

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://moviereelist.com/wp-content/uploads/2019/08/cinema-bg-01.jpg';
  };

  // Get the correct title/name
  const title = movie.title || movie.name || 'Untitled';
  
  // Get the correct date
  const date = movie.release_date || movie.first_air_date;
  const year = date ? new Date(date).getFullYear() : null;

  return (
    <div 
      onClick={() => onClick(movie)}
      key={movie.id}
      className="hover:cursor-pointer p-2 basis-30 shrink-1 grow-1 max-w-40 hover:bg-black hover:text-white rounded-2xl text-purple-800 transition-all text-2xl"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(movie)}
    >
      <img
        className="rounded-2xl w-full h-auto"
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
            : 'https://luchadb.com/events/posters/noposter.png'
        }
        alt={title}  // Changed from movie.title to title
        loading="lazy"
        onError={handleImageError}
      />
      <h6 className="text-xs pt-1 line-clamp-2">{title}</h6>  {/* Changed here */}
      {year && (
        <p className="text-xs text-gray-500">{year}</p>
      )}
      {/* Optional: Show media type badge */}
      {movie.media_type && (
        <span className="text-xs px-1 py-0.5 rounded bg-gray-200">
          {movie.media_type === 'movie' ? 'Movie' : 'TV'}
        </span>
      )}
    </div>
  );
};