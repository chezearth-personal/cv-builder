import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { authActions } from '_store';

export { Login };

function Login() {
  const dispatch = useDispatch();
  /** Form violation rules */
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required')
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  /** Get functions to build form with useForm() hool */
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;
  
  function onSubmit({ username, password }) {
    return dispatch(authActions.login({ username, password }));
  }

  return (
    <div className='card m__3'>
      <h4 className='card__header'>Login</h4>
      <div className='card__body'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb__3'>
            <label htmlFor='username'>
              User name <span className='req'>*</span>
            </label>
            <input
              name='username'
              type='text'
              {...register('username')}
              className={`form__control ${errors.username ? 'is__ivalid' : ''}`}
            />
            <div className='invalid__feedback'>{errors.username?.message}</div>
          </div>
          <div className='mb__3'>
            <label htmlFor='password'>
              Password <span className='req'>*</span>
            </label>
            <input
              name='password'
              type='password'
              {...register('password')}
              className={`form__control ${errors.password ? 'is__ivalid' : ''}`}
            />
            <div className='invalid__feedback'>{errors.password?.message}</div>
          </div>
          <button disabled={isSubmitting} className='btn btn__primary'>
            {isSubmitting && <span className='spinner__border spinner__border__sm me__1'></span>}
            Login
          </button>
          <Link to='../register' className='btn btn__link'>Register</Link>
        </form>
      </div>
    </div>
  );
}
