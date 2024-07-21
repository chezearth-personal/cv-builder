import { Route, Routes, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { history } from '_helpers/history';
import { alertActions } from '_store/alert.slice';
import { authActions } from '_store/auth.slice';

export function ResetPassword() {
  console.log('Loading ResetPassword ...');
  const dispatch = useDispatch();
  const { verificationCode } = useParams();
  /** Form validation rules */
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(32, 'Password must not exceed 32 characters')
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;
  async function onSubmit(data) {
    dispatch(alertActions.clear());
    try {
      const response = await dispatch(authActions.resetPassword({ ...data, verificationCode })).unwrap();
      if (response.status === 'success') {
        /** Redirect to login with success message */
        history.navigate('/account/login');
        dispatch(alertActions.success({
          message: `${response.message} `,
          showAfterRedirect: true
        }));
      } else {
        /** Clear fields after error message */
        reset();
        dispatch(alertActions.error({
          message: `${response.message} `,
          showAfterRedirect: true
        }));
      }
    } catch (error) {
      console.error('error =', error);
      history.navigate('/');
      dispatch(alertActions.error({
        message: `${error} `,
        showAfterRedirect: true
      }));
    }
  }

  return (
    <>
      <h1>Reset your password</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor='password' className='form__label'>
              Password
            </label>
            <input
              id='password'
              name='password'
              type='password'
              {...register('password')}
              className={`form__input ${errors.password ? 'is-invalid' : ''}`}
            />
            <div className='invalid-feedback'>{errors.password?.message}</div>
            <label htmlFor='passwordConfirm' className='form__label'>
              Confirm Password
            </label>
            <input
              id='passwordConfirm'
              name='passwordConfirm'
              type='password'
              {...register('passwordConfirm')}
              className={`form__input ${errors.passwordConfirm ? 'is-invalid' : ''}`}
            />
            <button
              type='submit'
              disabled={isSubmitting}
              className='btn btn__primary me__2'
            >
              {isSubmitting && <span className='spinner__border spinner__border__sm me__1' />}
              Reset Password
            </button>
            <Link to='/login' className='btn btn__link'>Cancel</Link>
        </form>
      <Routes>
        <Route path="/confirm-email/:verificationCode" />
      </Routes>
    </>
  );
}
