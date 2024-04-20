import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { PrivateRoute } from '_components/placeholders/PrivateRoute';
import { Nav } from '_components/placeholders/Nav';
import { Alert } from '_components/placeholders/Alert';
import { VerifyEmail } from '_components/placeholders/VerifyEmail';
import { history } from '_helpers/history';
import { Home } from 'home/Home';
import { AccountLayout } from 'account/AccountLayout';
import { UsersLayout } from 'users/UsersLayout';
import { Cv } from 'screens/Cv';
import 'App.css';

export { App };

function App() {
  const [result, setResult] = useState({});
  history.navigate = useNavigate();
  history.location = useLocation();

  // const { token } = useParams();

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
          <Route path='/verifyemail/:verificationcode/*' element={<VerifyEmail />} />
          <Route path='account/*' element={<AccountLayout />} />
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </div>
    </div>
  );
}
