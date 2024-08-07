import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { authActions } from '_store/auth.slice';

export function Login() {
  const dispatch = useDispatch();
  /** Form violation rules */
  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required'),
    password: Yup.string().required('Password is required')
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  /** Get functions to build form with useForm() hool */
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;
  
  function onSubmit({ email, password }) {
    return dispatch(authActions.login({ email, password }));
  }

  return (
    <div className='card m__3'>
      <h3 className='card__header'>Login</h3>
      <div className='card__body'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor='email'>
            Email <span className='req'>*</span>
          </label>
          <input
            id='email'
            name='email'
            type='email'
            autoComplete='email work home'
            {...register('email')}
            className={`form__control ${errors.email ? 'is__ivalid' : ''}`}
          />
          <div className='invalid__feedback'>{errors.email?.message}</div>
          <label htmlFor='password'>
            Password <span className='req'>*</span>
          </label>
          <input
            id='password'
            name='password'
            type='password'
            {...register('password')}
            className={`form__control ${errors.password ? 'is__ivalid' : ''}`}
          />
          <div className='invalid__feedback'>{errors.password?.message}</div>
          <button disabled={isSubmitting} className='btn btn__primary'>
            {isSubmitting && <span className='spinner__border spinner__border__sm me__1'></span>}
            Login
          </button>
          <Link to='../forgot-password' className='btn btn__link'>Forgot Password?</Link>
          <Link to='../register' className='btn btn__link'>Register</Link>
        </form>
      </div>
    </div>
  );
}
