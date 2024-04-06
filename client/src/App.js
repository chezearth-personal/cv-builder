import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './screens/Home';
import Cv from './components/cv/Cv';
import Login from './screens/Login';
import './App.css';

const App = () => {
  const [result, setResult] = useState({});
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home setResult={setResult} />} />
          <Route path='/cv' element={<Cv result={result} />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
