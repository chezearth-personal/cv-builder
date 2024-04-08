import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from 'home';
import { Cv } from 'screens';
// import Login from './screens/Login';
import './App.css';

export { App };

function App() {
  const [result, setResult] = useState({});
  return (
    <div>
        <Routes>
          <Route path='/' element={<Home setResult={setResult} />} />
          <Route path='/cv' element={<Cv result={result} />} />
        </Routes>
    </div>
  );
}

      // <BrowserRouter>
      // </BrowserRouter>

          // <Route path='/login' element={<Login />} />
