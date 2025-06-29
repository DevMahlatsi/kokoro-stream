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
export interface MovieApiResponse {
  results: Movie[];
  page: number;
  total_pages: number;
}
export interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}