import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import Home from './pages/Home';
import MovieDetailsPage from './pages/MovieDetailsPage';
import Search from './pages/Search';
import TVShowDetails from './pages/TVShowDetailsPage';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element = {<Home />} />

        <Route path='/movie/:id'  element = {<MovieDetailsPage/>} />
        <Route path='/tv/:id' element = {<TVShowDetails/>} />
        <Route path='*' element = {<div>404 - Chief the page was not Found</div>}/>
        <Route path='/search' element = {<Search/>}/>

      </Routes>
      
      
     
        
    </BrowserRouter>
  )
}

export default App