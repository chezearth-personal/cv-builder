// import { useState, useRef } from 'react';
// import { useEffect, useState, useRef } from 'react';
import { Route, Routes, useParams, Link } from 'react-router-dom';
// import { fetchWrapper } from '../_helpers/fetch-wrapper';
// import { Link } from 'react-router-dom';
// import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
// import { useSelector, useDispatch } from 'react-redux';
import { history } from '_helpers/history';
import { alertActions } from '_store/alert.slice';
// import { userActions } from '_store/users.slice';
import { authActions } from '_store/auth.slice';

export function NewPassword() {
  console.log('Loading NewPassword ...');
  const dispatch = useDispatch();
  const { verificationcode } = useParams();
  // const url = `${process.env.REACT_APP_AUTH_API_BASE_URL}/api/v1/auth/verify-email/${verificationcode}`;
  // const initialResponse = {
    // status: 'unknown',
    // statusCode: 0,
    // message: 'Confirming your email address ...'
  // };
  /** Form validation rules */
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  /** State to handle useEffect() hook being called twice in render (for dev builds) */
  /** persists inside render but gets reset on each render */
  // const ref = useRef(false);
  /** State to persist over a whole render */
  /** Response from verification API call */ 
  // const [ response, setResponse ] = useState(initialResponse);
  /** The API call to verify the email */
  // console.log('1. ref.current =', ref.current);
  const confirmEmail = (data) => {
    console.log('Running the confirmEmail() async function ...');
    try {
      // console.log('2. ref.current =', ref.current);
      // if (!ref.current) {
        // ref.current = true;
        // console.log('3. ref.current =', ref.current);
        const response = dispatch(authActions.confirmEmail({ ...data, verificationcode })).unwrap();
        // const result = await fetchWrapper.post(url, data);
        // console.log('API call completed.');
        history.navigate('/account/login');
        dispatch(alertActions.success({
          message: `${response.message} `,
          showAfterRedirect: true
        }));
        // console.log('4. response.status =', response && response.status);
        // setResponse({ ...initialResponse, ...(result || {}) });
        // console.log('5. ref.current =', ref.current);
      // }
    } catch (error) {
      console.error('error =', error);
      dispatch(alertActions.error(error));
      // setResponse({ ...initialResponse, message: error.message });
    }
  }
  async function onSubmit(data) {
    dispatch(alertActions.clear());
    try {
      const message = 'Your password has been updated.';
      /** Redirect to user list with success message */
      // await dispatch(userActions.register(data)).unwrap();
      confirmEmail(data);
      history.navigate('/login');
      dispatch(alertActions.success({ message, showAfterRedirect: true }));
    } catch (error) {
      dispatch(alertActions.error(error));
    }
  }

  // useEffect(() => {
    // console.log('6. Running the useEffect() hook ...');
    // console.log('7. ref.current =', ref.current);
    // confirmEmail(data);
    // console.log('8. ref.current =', ref.current);
  // }, []);
  console.log('9. (Re)Painting the screen ...');
  // const { id } = useParams();
  // const [ title, setTitle ] = useState();
  // const userJson = localStorage.getItem('auth');
  // const user = userJson && JSON.parse(userJson);
  // console.log('user =', user);
  // const id = user?.id;
  // const user = useSelector(x => x.users?.item);
  /** Get functions to build formi with useForm() hook */
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;
  // useEffect(() => {
    // if (id) {
      // setTitle('Edit Account Profile');
      /** Fetch user details into Redux state and */
      /** populate form fields with reset() */
      // dispatch(userActions.getById(id)).unwrap()
        // .then(user => reset(user));
    // }
  // }, []);
  return (
    <>
      <h1>Enter your new password</h1>
      {/*{!(user?.loading || user?.error) && */}
        <form onSubmit={handleSubmit(onSubmit)}>
            <label className='form__label'>
              Password
              {/*{id && <em className='ml__1'>(leave blank to keep the same password)</em>}*/}
            </label>
            <input
              name='password'
              type='password'
              {...register('password')}
              className={`form__input ${errors.password ? 'is-invalid' : ''}`}
            />
            <div className='invalid-feedback'>{errors.password?.message}</div>
            <label className='form__label'>
              Confirm Password
              {/*{id && <em className='ml__1'>(leave blank to keep the same password)</em>}*/}
            </label>
            <input
              name='confirmPassword'
              type='password'
              {...register('confirmPassword')}
              className={`form__input ${errors.confirmPassword ? 'is-invalid' : ''}`}
            />
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
            <Link to='/login' className='btn btn__link'>Cancel</Link>
        </form>
      <Routes>
        <Route path="/confirm-email/:verificationcode" />
      </Routes>
      {/*}*/}
      {/*{user?.loading && */}
        {/*<div className='text__center m__5'>*/}
          {/*<span className='spinner__border spinner__border__lg align-center'></span>*/}
        {/*</div>*/}
      {/*}*/}
      {/*{user?.error && */}
        {/*<div className='text__center m__5'>*/}
          {/*<div className='text__danger'>Error loading user: {user.error}</div>*/}
        {/*</div>*/}
      {/*}*/}
    </>
  );
}
