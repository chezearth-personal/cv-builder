// import { useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '_store/auth.slice';

export function Nav() {
  const auth = useSelector(x => x.auth.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  console.log('location =', location);
  console.log('!auth =', !auth);
  const logout = () => {
    // navigate('/');
    return dispatch(authActions.logout());
  }
  const login = () => navigate('account/login');
  // const login = () => navigate('/login');
  // useEffect(() => {
    // login();
  // }, [login]);
  // const login = () => navigate('/login');

  /** Only show Nav when logged in! */
  // if (!auth) return null;
  if (!auth && location.pathname !== '/account/login') return (
    <nav className='navbar navbar__expand navbar__dark bg__dark px__3'>
      <div className='navbar__nav'>
        {/* <NavLink to='/' className='nav__item nav__link'>Home</NavLink> */}
        <button onClick={login} className='btn btn__link nav__item nav__link'>Login</button>
      </div>    
    </nav>
  )

  return (
    <nav className='navbar navbar__expand navbar__dark bg__dark px__3'>
      <div className='navbar__nav'>
        <NavLink to='/' className='nav__item nav__link'>Home</NavLink>
        {!auth
          ? <></>
          : <>
              <NavLink to='/users' className='nav__item nav__link'>Users</NavLink>
              <button onClick={logout} className='btn btn__link nav__item nav__link'>Logout</button>
            </>
        }
      </div>
    </nav>
  );
}
