import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { history } from '_helpers/history';

export function PrivateRoute() {
  const auth = useSelector(x => x.auth.value);
  if (!auth) {
    /** not logged in so redirect to login page with  the return URL */
    return <Navigate to='account/login' state={{ from: history.location }} />;
  }
  /** authorised so return outlet foir child routes */
  return <Outlet />;
}
