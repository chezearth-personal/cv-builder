// import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '_store';

export function Nav() {
  const auth = useSelector(x => x.auth.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  if (!auth) return (
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
        <NavLink to='/users' className='nav__item nav__link'>Users</NavLink>
        <button onClick={logout} className='btn btn__link nav__item nav__link'>Logout</button>
      </div>
    </nav>
  );
}
