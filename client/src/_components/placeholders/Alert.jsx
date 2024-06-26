import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { alertActions } from '_store/alert.slice';

export function Alert() {
  const dispatch = useDispatch();
  const location = useLocation();
  const alert = useSelector(x => x.alert.value);
  useEffect(() => {
    /** clear alert on location change */
    dispatch(alertActions.clear());
  }, [location]);
  if (!alert) return null;
  return (
    <div className='container'>
      <div className='m-3'>
        <div className={`alert alert-dismissable ${alert.type}`}>
          {`${alert.message} `}
          <button
            type='button'
            className='btn__close'
            onClick={() => dispatch(alertActions.clear())}
          >Close</button>
        </div>
      </div>
    </div>
  );
}
