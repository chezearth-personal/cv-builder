import { Routes, Route, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { fetchWrapper } from '../_helpers/fetch-wrapper';

export const VerifyEmail = () => {
  console.log('Loading VerifyEmail ...');
  const { verificationcode } = useParams();
  const url = `${process.env.REACT_APP_AUTH_API_BASE_URL}/api/v1/auth/verify-email/${verificationcode}`;
  const initialResponse = {
    status: 'unknown',
    statusCode: 0,
    message: 'Verifying your email address ...'
  };
  /** State to handle useEffect() hook being called twice in render (for dev builds) */
  /** persists inside render but gets reset on each render */
  const ref = useRef(false);
  /** State to persist over a whole render */
  /** Response from verification API call */ 
  const [ response, setResponse ] = useState(initialResponse);
  /** The API call to verify the email */
  // console.log('1. ref.current =', ref.current);
  const verifyEmail = async () => {
    console.log('Running the verifyEmail() async function ...');
    try {
      // console.log('2. ref.current =', ref.current);
      if (!ref.current) {
        ref.current = true;
        // console.log('3. ref.current =', ref.current);
        const response = await fetchWrapper.get(url);
        // console.log('API call completed.');
        console.log('response.status =', response && response.status);
        setResponse({ ...initialResponse, ...(response || {}) });
        // console.log('4. ref.current =', ref.current);
      }
    } catch (error) {
      console.error('error =', error);
      setResponse({ ...initialResponse, message: error.message });
    }
  }
  useEffect(() => {
    console.log('Running the useEffect() hook ...');
    // console.log('5. ref.current =', ref.current);
    verifyEmail();
    // console.log('6. ref.current =', ref.current);
  }, []);
  // console.log('(Re)Painting the screen ...');
  
  return (
    <div>
    <h1>Verify Email Address</h1>
    {/* <VerificationResponse url={url} verified={verified} setVerified={setVerified} response={response} setResponse={setResponse}/> */}
      {response.status === 'unknown'
        ? null
        : <div className='alert'>
            <h3>Email Verification Complete</h3>
            {response.status === 'success'
              ? <div className='alert'>
                  <p>{`Congratulations! Your ${response.message.toLowerCase()}.`}</p>
                  <br></br>
                  <p>You may login to your account</p>
                </div>
              : <div className='alert'>
                  <p>{response.message}</p>
                </div>
            }
          </div>
      }
      <Routes>
        <Route path="/verify-email/:verificationcode/*" />
      </Routes>
    </div>
  )
}
