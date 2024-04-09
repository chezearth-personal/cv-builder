import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userActions } from '_store';

export { List };

function List() {
  const users = useSelector(x => x.users.list);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(userActions.getAll());
  }, []);
  
  return (
    <div>
      <h1>Users</h1>
      <Link to='add' className='btn btn__sm btn__success mb__2'>Add user</Link>
      <table className='table table__striped'>
        <thead>
          <tr>
            <th style={{ width: '30%' }}>First name</th>
            <th style={{ width: '30%' }}>Last name</th>
            <th style={{ width: '30%' }}>User name</th>
            <th style={{ width: '10%' }}></th>
          </tr>
        </thead>
        <tbody>
          {users?.value?.map(user =>
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.username}</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                <Link to={`edit/${user.id}`} className='btn btn__sm btn__primary me__1'>Edit</Link>
                <button
                  onClick={() => dispatch(userActions.delete(user.id))}
                  className='btn btn__sm btn__danger'
                  style={{ width: '60px' }}
                  disabled={user.isDeleting}
                >
                  {user.isDeleting
                    ? <span className='spinner__border spinner__border__sm'></span>
                    : <span>Delete</span>
                  }
                </button>
              </td>
            </tr>
          )}
          {users?.loading &&
            <tr>
              <td colSpan='4' className='text__center'>
                <span className='spinner__border spinner__border__lg align__center'></span>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  );
}
