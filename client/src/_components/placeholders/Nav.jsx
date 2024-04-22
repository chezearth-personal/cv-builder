// import { useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '_store/auth.slice';

function LogoutButton({ logout }) {
  return (
    <button onClick={logout} className='btn btn__link nav__item nav__link'>Logout</button>
  );
}

function LoginButton({ login }) {
  return (
    <button onClick={login} className='btn btn__link nav__item nav__link'>Login</button>
  );
}

function Buttons({ path, auth, login, logout}) {
  if (path === '/account/login' || path === '/account/register') return (
    <NavLink to='/' className='nav__item nav__link'>Home</NavLink>
  )
  if (auth) return (<LogoutButton logout={logout} />);
  return (<LoginButton login={login} />)
}

export function Nav() {
  const auth = useSelector(x => x.auth.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const logout = () => {
    return dispatch(authActions.logout());
  }
  const login = () => navigate('account/login');
  return (
    <nav className='navbar navbar__expand navbar__dark bg__dark px__3'>
      <div className='navbar__nav'>
        <Buttons path={location.pathname} auth={auth} login={login} logout={logout} />
      </div>
    </nav>
  );
}
