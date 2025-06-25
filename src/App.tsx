import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import Home from './pages/Home';
import MovieDetailsPage from './pages/MovieDetailsPage';
import Search from './pages/Search';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element = {<Home />} />

        <Route path='/movie/:id'  element = {<MovieDetailsPage/>} />

        <Route path='*' element = {<div>404 - Page Not Found</div>}/>
        <Route path='/search/:query' element = {<Search/>}/>

      </Routes>
      
      
     
        
    </BrowserRouter>
  )
}

export default App