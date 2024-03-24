import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './home/Home';
import Cv from './cv/Cv';
import './App.css';

const App = () => {
  const [result, setResult] = useState({});
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home setResult={setResult} />} />
          <Route path='/cv' element={<Cv result={result} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
