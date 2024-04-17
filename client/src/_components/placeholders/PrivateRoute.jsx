import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { history } from '_helpers';

export function PrivateRoute() {
  const auth = useSelector(x => x.auth.value);
  if (!auth) {
    /** not logged in so redirect to login page with  the retiurn URL */
    return <Navigate to='account/login' state={{ from: history.location }} />;
  }
  /** authorised so return outlet foir child routes */
  return <Outlet />;
}
