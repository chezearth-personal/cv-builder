import logo from './logo.svg';
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Cv from './components/Cv';
import './App.css';

const App = () => {
  const [result, setResult] = useState({});
  return (
    <div>
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </div>
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
