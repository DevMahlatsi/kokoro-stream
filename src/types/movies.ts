export interface Season {
  season_number: number;
  episode_count: number;
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string;
}

export type movieShow = MediaItem;

export interface Episode {
  episode_number: number;
  name: string;
  overview: string;
  air_date: string;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
}

// export interface MediaItem {
//   id: number;
//   original_name: string;
//   poster_path: string | null;
//   backdrop_path: string | null;
//   overview?: string;
//   first_air_date?: string;
//   vote_average?: number;
//   number_of_seasons?: number;
//   number_of_episodes?: number;
//   seasons?: Season[];  // ADD THIS LINE
//   genres?: Array<{
//     id: number;
//     name: string;
//   }>;
// }
export interface MovieApiResponse{
  results: MediaItem[];
  page: number;
  total_pages: number;
}
export interface ShowApiResponse{
  results: MediaItem[];
  page: number;
  total_pages: number;

}
export interface MultiSearchResponse{
  page: number;
  results: MediaItem[];
  total_pages: number;
  total_results: number;
}
export interface MovieCardProps{
  movie: {
    id: number;
    media_type?: 'movie' | 'tv' | 'person';
    title?: string;
    name?: string;
    poster_path?: string | null;
    vote_average?: number;
    release_date?: string;
    first_air_date?: string;
  };
  onClick: (movie: any) => void;
}
export interface ShowCardProps{
  show: MediaItem;
  onClick: (media: MediaItem) => void;
}
export interface SeasonDetails {
  season_number: number;
  episode_count: number;
  episodes: Episode[];
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string;
}
export interface LocationState {
  show: MediaItem;
}
export interface MediaItem {
  id: number;
  original_name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview?: string;
  first_air_date?: string;
  vote_average?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: Season[];
  media_type: 'movie' | 'tv' | 'person';
  title: string;
  name: string;
  original_title?: string; 
  tagline?: string; 
  release_date?: string;
  vote_count?: number; 
  runtime?: number;
  status?: string; 
  budget?: number; 
  revenue?: number; 
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