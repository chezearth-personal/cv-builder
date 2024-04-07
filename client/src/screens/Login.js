import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin } from '../features/auth/authActions';
import ErrorPage from '../components/placeholders/ErrorPage';
import Spinner from '../components/placeholders/Spinner';

const Login = () => {
  const { loading, error } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const submitForm = (data) => {
    console.log('login form data =', data);
    dispatch(userLogin(data));
  }
  return (
    <form onSubmit={handleSubmit(submitForm)}>
      {error && <ErrorPage message={error} />}
      <div className='auth-group'>
        <label htmlFor='email'>
          Email <span className='req'>*</span>
        </label>
        <input
          type='email'
          name='email'
          id='email'
          className='auth-input'
          { ...register('email') }
          required
        />
      </div>
      <div className='auth-group'>
        <label htmlFor='password'>
          Password <span className='req'>*</span>
        </label>
        <input
          type='password'
          name='password'
          id='password'
          className='auth-input'
          { ...register('password') }
          required
        />
      </div>
      <button type='submit' className='btn__submit' disabled={loading}>
        {loading ? <Spinner /> : 'Login'}
      </button>
    </form>
  );
}

export default Login;
