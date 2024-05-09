import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Login } from './Login';
import { Register } from './Register';
import { VerifyEmail } from 'account/VerifyEmail';
import { ConfirmEmail } from './ConfirmEmail';
import { ResetPassword } from 'account/ResetPassword';

export function AccountLayout() {
  const auth = useSelector(x => x.auth.value);
  /** Redirect to Home if already logged in */
  if (auth) return <Navigate to='/' />;
  return (
    <div className='container'>
      <div className='row'>
        <div className='col__sm__8 offset__sm__2 mt__5'>
          <Routes>
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='forgot-password' element={<ConfirmEmail />} />
            <Route path='/verify-email/:verificationcode/*' element={<VerifyEmail />} />
            <Route path='/reset-password/:verificationcode/*' element={<ResetPassword />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
