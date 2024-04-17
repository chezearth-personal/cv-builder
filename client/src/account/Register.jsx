import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { history } from '_helpers/history';
import { alertActions } from '_store/alert.slice';
import { userActions } from '_store/users.slice';

export const Register = () => {
  const dispatch = useDispatch();
  /** Form validation rules */
  const validationSchema = Yup.object().shape({
    firstname: Yup.string()
      .required('First Name is required'),
    lastname: Yup.string()
      .required('Last Name is required'),
    email: Yup.string()
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  /** Get functions to build form with useForm() hook */
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  async function onSubmit(data) {
    dispatch(alertActions.clear());
    try {
      await dispatch(userActions.register(data)).unwrap();
      /** Redirect to login page and display success alert */
      history.navigate('/account/login');
      dispatch(alertActions.success({
        message: 'Registration successful ',
        showAfterRedirect: true
      }));
    } catch (error) {
      dispatch(alertActions.error(error));
    }
  }

  return (
    <div className='card m__3'>
      <h3 className='card__header'>Register</h3>
      <div className='card__body'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor='firstname'>
            First Name <span className='req'>*</span>
          </label>
          <input
            name='firstname'
            type='text'
            { ...register('firstname') }
            className={`form__control ${errors.firstname ? 'is-invalid' : ''}`}
          />
          <div className='invalid-feedback'>{errors.firstname?.message}</div>
          <label htmlFor='lastname'>
            Last Name <span className='req'>*</span>
          </label>
          <input
            name='lastname'
            type='text'
            { ...register('lastname') }
            className={`form__control ${errors.lastname ? 'is-invalid' : ''}`}
          />
          <div className='invalid-feedback'>{errors.lastname?.message}</div>
          <label htmlFor='email'>
            email <span className='req'>*</span>
          </label>
          <input
            name='email'
            type='email'
            { ...register('email') }
            className={`form__control ${errors.email ? 'is-invalid' : ''}`}
          />
          <div className='invalid-feedback'>{errors.email?.message}</div>
          <label htmlFor='password'>
            Password <span className='req'>*</span>
          </label>
          <input
            name='password'
            type='password'
            { ...register('password') }
            className={`form__control ${errors.password ? 'is-invalid' : ''}`}
          />
          <div className='invalid-feedback'>{errors.password?.message}</div>
          <label htmlFor='confirmPassword'>
            Confirm Password <span className='req'>*</span>
          </label>
          <input
            name='confirmPassword'
            type='password'
            { ...register('confirmPassword') }
            className={`form__control ${errors.confirmPassword ? 'is-invalid' : ''}`}
          />
          <button disabled={isSubmitting} className='btn btn__primary'>
            {isSubmitting && <span className='spinner__border spinner__border__sm me__1'></span>}
            Register
          </button>
          <Link to='../login' className='btn btn__link'>Cancel</Link>
        </form>
      </div>
    </div>
  )
}  


          //<div className='mb__3'>

          // </div>
          // <div className='mb__3'>

          // </div>
          // <div className='mb__3'>

          // </div>
          // <div className='mb__3'>

          // </div>
          // <div className='mb__3'>

          // </div>
