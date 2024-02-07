// import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Cv from './components/Cv';
import './App.css';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Cv' element={<Cv />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
