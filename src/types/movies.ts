export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview?: string;
  release_date?: string;
  vote_average?: number;
  runtime?: number;
  genres?: Array<{
    id: number;
    name: string;
  }>;
}
export interface Show {
  id: number;
  original_name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview?: string;
  first_air_date?: string;
  vote_average?: number;
  number_of_seasons? : number;
  number_of_episodes? : number;
  genres?: Array<{
    id: number;
    name: string;

  }>;
}
export interface MovieApiResponse {
  results: Movie[];
  page: number;
  total_pages: number;
}
export interface ShowApiResponse {
  results: Show[];
  page: number;
  total_pages: number;
}
export interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}
export interface ShowCardProps{
  show: Show;
  onClick: (media: Show) => void;
}