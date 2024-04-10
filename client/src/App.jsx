import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { history } from '_helpers';
import { Nav, Alert, PrivateRoute } from '_components';
import { Home } from 'home';
import { AccountLayout } from 'account';
import { UsersLayout } from 'users';
import { Cv } from 'screens';
import 'App.css';

export { App };

function App() {
  const [result, setResult] = useState({});
  history.navigate = useNavigate();
  history.location = useLocation();

  return (
    <div className='app__container bg__light'>
      <Nav />
      <Alert />
      <div className='container pt__4 pb__4'>
        <Routes>
          {/** Private */}
          <Route element={<PrivateRoute />} >
            <Route path='users/*' element={<UsersLayout />} />
            <Route path='/cv' element={<Cv result={result} />} />
          </Route>
          {/** Public */}
            <Route path='/' element={<Home setResult={setResult} />} />
          <Route path='account/*' element={<AccountLayout />} />
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </div>
    </div>
  );
}
