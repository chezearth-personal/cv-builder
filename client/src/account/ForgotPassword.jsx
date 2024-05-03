// import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
// import { useSelector, useDispatch } from 'react-redux';
import { history } from '_helpers/history';
// import { post } from '_helpers/fetch-wrapper';
import { alertActions } from '_store/alert.slice';
import { authActions } from '_store/auth.slice';
// import { userActions } from '_store/users.slice';

export function ForgotPassword() {
  // const { id } = useParams();
  // const [ title, setTitle ] = useState();
  const dispatch = useDispatch();
  // const userJson = localStorage.getItem('auth');
  // const user = userJson && JSON.parse(userJson);
  // console.log('user =', user);
  // const id = user?.id;
  // const user = useSelector(x => x.users?.item);
  /** Form validation rules */
  const validationSchema = yup.object().shape({
    // firstname: yup.string()
      // .required('First Name is required'),
    // lastname: yup.string()
      // .required('Last Name is required'),
    email: yup.string()
      .required('Email is required')
    // password: yup.string()
      // .transform(x => x === '' ? undefined : x)
      // .concat(id ? null : yup.string().required('Password is required'))
      // .min(8, 'Password must be at least 8 characters'),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  /** Get functions to build formi with useForm() hook */
  const { register, handleSubmit, formState } = useForm(formOptions);
  // const { register, handleSubmit, reset, formState } = useForm(formOptions);
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
  async function onSubmit(data) {
    dispatch(alertActions.clear());
    try {
      /** Look up the user to confirm the email address given */
      const response = await dispatch(authActions.confirmEmail(data)).unwrap();
      // console.log('user =', user);
      // if (user) {
        // console.log('user =', user);
        // const response = await post('http://localhost:3000/api/v1/auth/forgotpassword', {
          // method: 'POST',
          // headers: { 'Content-Type': 'application/json' },
          // body: JSON.stringify({ email: data.email })
        // });
        if (response.ok) {
          console.log('response =', response);
          const json = await response.json();
          console.log('json =', json);
        }
        /** Send a message to look for the confirmation email */
        const message = 'Please check your email for a confirmation link to reset your password';
        history.navigate('/login');
        dispatch(alertActions.success({ message, showAfterRedirect: true }));
      // }
      /** Create or update user based on id param */
      // let message;
      // if (id) {
        // await dispatch(userActions.update({ id, data })).unwrap();
        // message = 'User updated';
      // } else {
        // await dispatch(userActions.register(data)).unwrap();
        // message = 'User added';
      // }
      /** Redirect to user list with success message */
    } catch (error) {
      console.log(error);
      // dispatch(alertActions.error(error));
    }
    /** Redirect the user to the Home page */
    history.navigate('/');
  }

  return (
    <>
      <h1>Forgot Password: Confirm your Email Address</h1>
      {/*{!(user?.loading || user?.error) &&*/}
        <form onSubmit={handleSubmit(onSubmit)}>
              <label className='form__label'>
                Enter your email for confirmation <span className='req'>*</span>
              </label>
              <input
                name='email'
                type='email'
                {...register('email')}
                className={`form__input ${errors.email ? 'is-invalid' : ''}`}
              />
              <div className='invalid-feedback'>{errors.email?.message}</div>
            <button
              type='submit'
              disabled={isSubmitting}
              className='btn btn__primary me__2'
            >
              {isSubmitting && <span className='spinner__border spinner__border__sm me__1' />}
              Send confirmation to reset password
            </button>
          {/*<button*/}
            {/*onClick={() => reset()}*/}
            {/*type='button'*/}
            {/*disabled={isSubmitting}*/}
            {/*className='btn btn__secondary'*/}
          {/*}>*/}
            {/*Reset*/}
          {/*</button>*/}
            <Link to='/' className='btn btn__link'>Cancel</Link>
        </form>
      {/*}*/}
      {/*{user?.loading &&*/}
        {/*<div className='text__center m__5'>*/}
          {/*<span className='spinner__border spinner__border__lg align-center'></span>*/}
        {/*</div>*/}
      {/*}*/}
      {/*{user?.error &&*/}
        {/*<div className='text__center m__5'>*/}
          {/*<div className='text__danger'>Error loading user: {user.error}</div>*/}
        {/*</div>*/}
      {/*}*/}
    </>
  );
}
