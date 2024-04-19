import { Routes, Route, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchWrapper } from '../../_helpers/fetch-wrapper';

export const VerifyEmail = () => {
  console.log('Loading the component ...');
  const { verificationcode } = useParams();
  const url = `${process.env.REACT_APP_AUTH_API_BASE_URL}/api/v1/auth/verifyemail/${verificationcode}`;
  // console.log('verificationcode =', verificationcode);
  const initialResponse = {
    status: 'unknown',
    statusCode: 0,
    message: 'Verifying your email address ...'
  };
  /** State to handle useEffect() hook being called twice in render (for dev builds) */
  /** persists inside render but gets reset on each render */
  let doneVerifying = false;
  /** State to persist over a whole render */
  const [ verified, setVerified ] = useState(false);
  /** Response from verification API call */ 
  const [ response, setResponse ] = useState(initialResponse);
  // console.log('1. verified =', verified);
  // console.log('1. doneVerifying =', doneVerifying);
  // console.log('Loading the verifyEmail() async function ...');
  const verifyEmail = async () => {
    console.log('Running the verifyEmail() async function ...');
    try {
      console.log('1. verified =', verified);
      console.log('1. doneVerifying =', doneVerifying);
      if (!verified && !doneVerifying) {
        // console.log('3. verified =', verified);
        // console.log('3. doneVerifying =', doneVerifying);
        setVerified(true);
        doneVerifying = true;
        console.log('2. verified =', verified);
        console.log('2. doneVerifying =', doneVerifying);
        const response = await fetchWrapper.get(url);
        console.log('API call completed.');
        console.log('response.status =', response && response.status);
        // console.log('5. verified =', verified);
        // console.log('5. doneVerifying =', doneVerifying);
        setResponse({ ...initialResponse, ...(response || {}) });
      }
    } catch (error) {
      console.error('error =', error);
      setResponse({ ...initialResponse, message: error.message });
    }
  }
  // console.log('6. verified =', verified);
  // console.log('6. doneVerifying =', doneVerifying);
  // console.log('Loading the useEffect() hook ...');
  useEffect(() => {
    console.log('Running the useEffect() hook ...');
    // console.log('7. verified =', verified);
    // console.log('7. doneVerifying =', doneVerifying);
    // if (!verified) {
      // console.log('8. verified =', verified);
      // if (!doneVerifying) {
    verifyEmail();
      // }
      // doneVerifying = true;
      // console.log('9. verified =', verified);
    // }
    console.log('3. verified =', verified);
    console.log('3. doneVerifying =', doneVerifying);
    // // verified = true;
  }, []);
  // useEffect(verifyEmail, [setVerified]);
  // if (!verified) {
    // verifyEmail();
  // }
  // console.log('11. verified =', verified);
  // setVerified(true);
  console.log('4. verified =', verified);
  console.log('4. doneVerifying =', doneVerifying);
  console.log('(Re)Painting the screen ...');
  
  return (
    <div>
      <h1>{response.message}</h1>
      {response.status === 'unknown'
        ? null
        : <div className='alert'>
            <h3>Verification Complete</h3>
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
        <Route path="/verifyemail/:verificationcode/*" />
      </Routes>
    </div>
  )
}
