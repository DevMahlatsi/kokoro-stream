export interface Season {
  season_number: number;
  episode_count: number;
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string;
}

export interface Episode {
  episode_number: number;
  name: string;
  overview: string;
  air_date: string;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
}

export interface Show {
  id: number;
  original_name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview?: string;
  first_air_date?: string;
  vote_average?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: Season[];  // ADD THIS LINE
  genres?: Array<{
    id: number;
    name: string;
  }>;
}
export interface MovieApiResponse{
  results: Movie[];
  page: number;
  total_pages: number;
}
export interface ShowApiResponse{
  results: Show[];
  page: number;
  total_pages: number;

}
export interface MovieCardProps{
  movie: Movie;
  onClick: (movie: Movie) => void;
}
export interface ShowCardProps{
  show: Show;
  onClick: (media: Show) => void;
}
export interface Movie {
  id: number;
  title: string;
  original_title?: string; // ADD THIS
  poster_path: string | null;
  backdrop_path: string | null;
  overview?: string;
  tagline?: string; // ADD THIS
  release_date?: string;
  vote_average?: number;
  vote_count?: number; // ADD THIS
  runtime?: number;
  status?: string; // ADD THIS
  budget?: number; // ADD THIS
  revenue?: number; // ADD THIS
  genres?: Array<{
    id: number;
    name: string;
  }>;
  production_companies?: Array<{ // ADD THIS
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }>;
  spoken_languages?: Array<{ // ADD THIS
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
}