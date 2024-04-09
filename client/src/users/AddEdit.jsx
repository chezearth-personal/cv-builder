import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { history } from '_helpers';
import { userActions, alertActions } from '_store';

export { AddEdit };

function AddEdit() {
  const { id } = useParams();
  const [ title, setTitle ] = useState();
  const dispatch = useDispatch();
  const user = useSelector(x => x.users?.item);
  /** Form validation rules */
  const validationSchema = yup.object().shape({
    firstName: yup.string()
      .required('First Name is required'),
    lastName: yup.string()
      .required('Last Name is required'),
    username: yup.string()
      .required('Username is required'),
    password: yup.string()
      .transform(x => x === '' ? undefined : x)
      .concat(id ? null : yup.string().required('Password is required'))
      .min(8, 'Password must be at least 8 characters'),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  /** Get functions to build formi with useForm() hook */
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;
  useEffect(() => {
    if (id) {
      setTitle('Edit User');
      /** Fetch user details into Redux state and */
      /** populate form fields with reset() */
      dispatch(userActions.getById(id)).unwrap()
        .then(user => reset(user));
    } else {
      setTitle('Add User');
    }
  }, []);
  async function onSubmit(data) {
    dispatch(alertActions.clear());
    try {
      /** Create or update user based on id param */
      let message;
      if (id) {
        await dispatch(userActions.update({ id, data })).unwrap();
        message = 'User updated';
      } else {
        await dispatch(userActions.register(data)).unwrap();
        message = 'User added';
      }
      /** Redirect to user list with success message */
      history.navigate('/users');
      dispatch(alertActions.success({ message, showAfterRedirect: true }));
    } catch (error) {
      dispatch(alertActions.error(error));
    }
  }

  return (
    <>
      <h1>{title}</h1>
      {!(user?.loading || user?.error) &&
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='row'>
            <div className='mb__3 col'>
              <label className='form__label'>
                First Name <span className='req'>*</span>
              </label>
              <input
                name='firstName'
                type='text'
                {...register('firstName')}
                className={`form__input ${errors.firstName ? 'is-invalid' : ''}`}
              />
              <div className='invalid-feedback'>{errors.firstName?.message}</div>
            </div>
            <div className='mb__3 col'>
              <label className='form__label'>
                Last Name <span className='req'>*</span>
              </label>
              <input
                name='lastName'
                type='text'
                {...register('lastName')}
                className={`form__input ${errors.lastName ? 'is-invalid' : ''}`}
              />
              <div className='invalid-feedback'>{errors.lastName?.message}</div>
            </div>
          </div>
          <div className='row'>
            <div className='mb__3 col'>
              <label className='form__label'>
                Username <span className='req'>*</span>
              </label>
              <input
                name='username'
                type='text'
                {...register('username')}
                className={`form__input ${errors.username ? 'is-invalid' : ''}`}
              />
              <div className='invalid-feedback'>{errors.username?.message}</div>
            </div>
            <div className='mb__3 col'>
              <label className='form__label'>
                Password
                {id && <em className='ml__1'>(leave blank to keep the same password)</em>}
              </label>
              <input
                name='password'
                type='password'
                {...register('password')}
                className={`form__input ${errors.password ? 'is-invalid' : ''}`}
              />
              <div className='invalid-feedback'>{errors.password?.message}</div>
            </div>
          </div>
          <div className='mb__3'>
            <button
              type='submit'
              disabled={isSubmitting}
              className='btn btn__primary me__2'
            >
              {isSubmitting && <span className='spinner__border spinner__border__sm me__1' />}
              Save
            </button>
            <button
              onClick={() => reset()}
              type='button'
              disabled={isSubmitting}
              className='btn btn__secondary'
            >
              Reset
            </button>
            <Link to='/users' className='btn btn__link'>Cancel</Link>
          </div>
        </form>
      }
      {user?.loading &&
        <div className='text__center m__5'>
          <span className='spinner__border spinner__border__lg align-center'></span>
        </div>
      }
      {user?.error &&
        <div className='text__center m__5'>
          <div className='text__danger'>Error loading user: {user.error}</div>
        </div>
      }
    </>
  );
}