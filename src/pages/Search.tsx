import { useLocation } from "react-router-dom";
import Menu from "../components/Menu";

export default function Search(){
  const location = useLocation();
  interface SearchParams {
    q: string;
  }
  const data = fetchSearchResults(location.state?.query);


  console.log(data);
  async function fetchSearchResults(query: string) {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`
    );
    if (!response.ok) throw new Error('Network error');
    const json = await response.json();
    return json.results || [];
  }

  return (
    <>
      <Menu/>
      <p>
        What do you mean this is a void page huh?
          Kere what do they mean

      </p>
    </>
  )
}