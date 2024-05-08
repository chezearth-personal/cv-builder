import { Route, Routes, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { history } from '_helpers/history';
import { alertActions } from '_store/alert.slice';
// import { userActions } from '_store/users.slice';
import { authActions } from '_store/auth.slice';

export function ResetPassword() {
  console.log('Loading ResetPassword ...');
  const dispatch = useDispatch();
  const { verificationcode } = useParams();
  /** Form validation rules */
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;
  /** State to handle useEffect() hook being called twice in render (for dev builds) */
  /** persists inside render but gets reset on each render */
  // const ref = useRef(false);
  /** State to persist over a whole render */
  /** Response from verification API call */ 
  // const [ response, setResponse ] = useState(initialResponse);
  async function onSubmit(data) {
    dispatch(alertActions.clear());
    try {
      // const message = 'Your password has been updated.';
      /** Redirect to user list with success message */
      // await dispatch(userActions.register(data)).unwrap();
      console.log('data =', data);
      const response = dispatch(authActions.resetPassword({ ...data, verificationcode })).unwrap();
      // resetPassword(data);
        history.navigate('/account/login');
        dispatch(alertActions.success({
          message: `${response.message} `,
          showAfterRedirect: true
        }));
      // history.navigate('/login');
      // dispatch(alertActions.success({ message, showAfterRedirect: true }));
    } catch (error) {
      console.error('error =', error);
      dispatch(alertActions.error(error));
    }
  }

  // const { id } = useParams();
  // const [ title, setTitle ] = useState();
  // const userJson = localStorage.getItem('auth');
  // const user = userJson && JSON.parse(userJson);
  // console.log('user =', user);
  // const id = user?.id;
  // const user = useSelector(x => x.users?.item);
  return (
    <>
      <h1>Enter your new password</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            <label className='form__label'>
              Password
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
            </label>
            <input
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
    </>
  );
}
