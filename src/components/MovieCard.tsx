import React from 'react';
import type { Movie, MovieCardProps } from '../types/movies';



// interface MovieCardProps {
//   movie: Movie;
//   onClick: (movie: Movie) => void;
// }

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://moviereelist.com/wp-content/uploads/2019/08/cinema-bg-01.jpg';
  };

  return (
    <div 
      onClick={() => onClick(movie)}
      key={movie.id}
      className="hover:cursor-pointer p-2 basis-30 shrink-1 grow-1 max-w-40 hover:bg-black hover:text-purple-400 rounded-2xl transition-all"
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
        alt={movie.title}
        loading="lazy"
        onError={handleImageError}
      />
      <h6 className="text-xs pt-1 line-clamp-2">{movie.title}</h6>
    </div>
  );
};