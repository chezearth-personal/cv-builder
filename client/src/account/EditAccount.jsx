import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
// import { useSelector, useDispatch } from 'react-redux';
import { history } from '_helpers/history';
import { alertActions } from '_store/alert.slice';
import { userActions } from '_store/users.slice';

export function EditAccount() {
  // const { id } = useParams();
  const [ title, setTitle ] = useState();
  const dispatch = useDispatch();
  const userJson = localStorage.getItem('auth');
  const user = userJson && JSON.parse(userJson);
  console.log('user =', user);
  const id = user?.id;
  // const user = useSelector(x => x.users?.item);
  /** Form validation rules */
  const validationSchema = yup.object().shape({
    firstname: yup.string()
      .required('First Name is required'),
    lastname: yup.string()
      .required('Last Name is required'),
    email: yup.string()
      .required('Email is required'),
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
      setTitle('Edit Account Profile');
      /** Fetch user details into Redux state and */
      /** populate form fields with reset() */
      dispatch(userActions.getById(id)).unwrap()
        .then(user => reset(user));
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
              <label className='form__label'>
                First Name <span className='req'>*</span>
              </label>
              <input
                name='firstname'
                type='text'
                placeholder={user?.firstname}
                {...register('firstname')}
                className={`form__input ${errors.firstname ? 'is-invalid' : ''}`}
              />
              <div className='invalid-feedback'>{errors.firstname?.message}</div>
              <label className='form__label'>
                Last Name <span className='req'>*</span>
              </label>
              <input
                name='lastname'
                type='text'
                placeholder={user?.lastname}
                {...register('lastname')}
                className={`form__input ${errors.lastname ? 'is-invalid' : ''}`}
              />
              <div className='invalid-feedback'>{errors.lastname?.message}</div>
              <label className='form__label'>
                Email <span className='req'>*</span>
              </label>
              <input
                name='email'
                type='email'
                placeholder={user?.email}
                {...register('email')}
                className={`form__input ${errors.email ? 'is-invalid' : ''}`}
              />
              <div className='invalid-feedback'>{errors.email?.message}</div>
            {/*<label className='form__label'>*/}
              {/*Password*/}
              {/*{id && <em className='ml__1'>(leave blank to keep the same password)</em>}*/}
            {/*</label>*/}
            {/*<input */}
              {/*name='password'*/}
              {/*type='password'*/}
              {/*{...register('password')}*/}
              {/*className={`form__input ${errors.password ? 'is-invalid' : ''}`}*/}
            {/*}/>*/}
            {/*<div className='invalid-feedback'>{errors.password?.message}</div>*/}
            {/*<label className='form__label'>*/}
              {/*Confirm Password*/}
              {/*{id && <em className='ml__1'>(leave blank to keep the same password)</em>}*/}
            {/*</label>*/}
            {/*<input*/}
              {/*name='confirmPassword'*/}
              {/*type='password'*/}
              {/*{...register('confirmPassword')}*/}
              {/*className={`form__input ${errors.confirmPassword ? 'is-invalid' : ''}`}*/}
            {/*}/>*/}
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
            <Link to='/' className='btn btn__link'>Cancel</Link>
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
