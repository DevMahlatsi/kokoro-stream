import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import './App.css';
import Home from './pages/Home';
import MovieDetailsPage from './pages/MovieDetailsPage';
import Search from './pages/Search';
import TVShowDetails from './pages/TVShowDetailsPage';
import MoviePage from './pages/MoviePage';
import TVShowPage from './pages/TVShowPage';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element = {<Home />} />

        <Route path='/movie/:id'  element = {<MovieDetailsPage/>} />;
        {/* <Route path='/tv/:id' element = {<TVShowDetails/>} />; */}
        <Route path="/tv/:id/season/:season/episode/:episode" element={<TVShowDetails />} />
        <Route path="/tv/:id" element={<Navigate to="/tv/:id/season/1/episode/1" replace />} />
        <Route path='/movies' element = {<MoviePage/>}/>;
        <Route path='/shows' element = {<TVShowPage/>}/>;
        <Route path='*' element = {<div>404 - Chief the page was not found.</div>}/>;
        <Route path='/search' element = {<Search/>}/>;

      </Routes>
      
      
     
        
    </BrowserRouter>
  )
}

export default App