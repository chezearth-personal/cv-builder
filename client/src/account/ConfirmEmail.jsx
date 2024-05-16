import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { history } from '_helpers/history';
import { alertActions } from '_store/alert.slice';
import { authActions } from '_store/auth.slice';

export function ConfirmEmail() {
  const dispatch = useDispatch();
  /** Form validation rules */
  const validationSchema = yup.object().shape({
    email: yup.string()
      .required('Email is required')
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  /** Get functions to build formi with useForm() hook */
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;
  async function onSubmit(data) {
    dispatch(alertActions.clear());
    try {
      /** Look up the user to confirm the email address given */
      const response = await dispatch(authActions.confirmEmail(data)).unwrap();
      if (response.status === 'success') {
        /** Redirect to user list with success message */
        history.navigate('/account/login');
        /** Show the alert with a message to look for the confirmation email */
        dispatch(alertActions.success({
          message: `${response.message} `,
          showAfterRedirect: true
        }));
      } else {
        /** Redirect the user to the Home page */
        history.navigate('/');
        /** Show the error alert */
        dispatch(alertActions.error({
          message: `${response.message} `,
          showAfterRedirect: true 
        }));
      }
    } catch (error) {
      console.log(error);
      history.navigate('/');
      dispatch(alertActions.error({
        message: `${error} `, 
        showAfterRedirect: true 
      }));
    }
  }

  return (
    <>
      <h1>Forgot Password: Confirm your Email Address</h1>
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
            <Link to='/' className='btn btn__link'>Cancel</Link>
        </form>
    </>
  );
}
