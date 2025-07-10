import type { ShowCardProps } from "../types/movies";

export const ShowCard: React.FC<ShowCardProps> = ({show, onClick }) =>{
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {e.currentTarget.src = 'https://moviereelist.com/wp-content/uploads/2019/08/cinema-bg-01.jpg';

    };
    return(
      <div
        onClick={() => onClick(show)}
        key={show.id}
        className="hover:cursor-pointer p-2 basis-30 shrink-1 grow-1 max-w-40 hover:bg-black hover:text-white rounded-2xl text-purple-800 transition-all text-2xl"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick(show)}>

        <img 
          className="rounded-2xl w-full h-auto"
          src={
          show.poster_path
            ? `https://image.tmdb.org/t/p/w300${show.poster_path}`
            : 'https://luchadb.com/events/posters/noposter.png'
          } alt={show.original_name} 
            loading="lazy"
            onError={handleImageError}/>
          <h6 className="text-xs pt-1 line-clamp-2">
            {show.original_name}
          </h6>
      </div>
    );
};