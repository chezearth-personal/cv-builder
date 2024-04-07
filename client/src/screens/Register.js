import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ErrorPage } from '../components/placeholders/ErrorPage';
import Spinner from '../components/placeholders/Spinner';
import { registerUser } from '../features/auth/authActions';

const Register = () => {
  const { loading, userInfo, error, success } = useSelector(
    state => state.user
  );
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate()

  useEffect(() => {
    /** redirect user to login page if registration was successful */
    if (success) navigate('/login');
    /** redirect authenticated user to user profile screen */
    if (userInfo) navigate('/user-profile');
  }, [ navigate, userInfo, success ]);

  const submitForm = data => {
    /** check if passwords match */
    if (data.password !== data.confirmPassword) {
      alert('Passwords do not match');
    }
    /** convert email string to lower case to avoid sensitivity issues */
    data.email = data.email.toLowerCase();
    dispatch(registerUser(data));
  }
  return (
    <form onSubmit={handleSubmit(submitForm)}>
      {error && <ErrorPage message={error} />}
      <div className='form-group'>
        <label htmlFor='fullName'>
          Enter your full name <span className='req'>*</span>
        </label>
        <input
          type='text'
          name='fullName'
          id='fullName'
          className='form-input'
          {...register('fullName')}
          required
        />
      </div>
      <div className='form-group'>
        <label htmlFor='email'>
          Enter your email <span className='req'>*</span>
        </label>
        <input
          type='email'
          name='email'
          id='email'
          className='form-input'
          {...register('email')}
          required
        />
      </div>
      <div className='form-group'>
        <label htmlFor='password'>
          Enter your password <span className='req'>*</span>
        </label>
        <input
          type='password'
          name='password'
          id='password'
          className='form-input'
          {...register('password')}
          required
        />
      </div>
      <div className='form-group'>
        <label htmlFor='confirmPassword'>
          Confirm your password <span className='req'>*</span>
        </label>
        <input
          type='password'
          name='confirmPassword'
          id='confirmPassword'
          className='form-input'
          {...register('confirmPassword')}
          required
        />
      </div>
      <button type='submit' className='btn' disabled={loading}>
        {loading ? <Spinner /> : 'Register'}
      </button>
    </form>
  );
}

export default Register;
