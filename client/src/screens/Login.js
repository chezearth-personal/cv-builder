import { useForm } from 'react-hook-form';
import { logger } from '../../utils/logger';

const Login = () => {
  const { register, handleSubmit } = useForm();
  const submitForm = (data) => {
    logger.info(data);
  }
  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <div className='auth-group'>
        <label htmlFor='email'>Email</label>
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
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          name='password'
          id='password'
          className='auth-input'
          { ...register('password') }
          required
        />
      </div>
      <button type='submit' className='btn__submit'>
        Login
      </button>
    </form>
  );
}

export default Login;
