import { Routes, Route, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { fetchWrapper } from '../../_helpers/fetch-wrapper';
// import {set} from 'react-hook-form';

// const VerificationResponse = ({ url, verified, setVerified, response, setResponse }) => {
  // console.log('Loading the VerificationResponse component ...');
  // console.log('1. verified =', verified);
  // const verifyEmail = async (url, verified, response) => {
    // console.log('Running the verifyEmail() async function ...');
    // try {
      // console.log('2. verified =', verified);
      // if (!verified) {
        // // setVerified(true);
        // // console.log('2. verified =', verified);
        // const res = await fetchWrapper.get(url);
        // console.log('API call completed.');
        // console.log('response.status =', response && response.status);
        // console.log('3. verified =', verified);
        // setResponse({ ...response, ...(res || {}) });
      // }
    // } catch (error) {
      // console.error('error =', error);
      // // return { ...initialResponse, message: error.message };
      // setResponse({ ...response, message: error.message });
    // }
  // }
  // console.log('4. verified =', verified);
  // verifyEmail(url, verified, response);
  // useEffect(() => {
    // console.log('5. verified =', verified);
    // setVerified(true);
    // console.log('6. verified =', verified);
  // }, []);
  // return (
    // <div>
      // <h1>{response.message}</h1>
    // </div>
  // );
// }

export const VerifyEmail = () => {
  console.log('Loading the component ...');
  const { verificationcode } = useParams();
  const url = `${process.env.REACT_APP_AUTH_API_BASE_URL}/api/v1/auth/verifyemail/${verificationcode}`;
  const initialResponse = {
    status: 'unknown',
    statusCode: 0,
    message: 'Verifying your email address ...'
  };
  /** State to handle useEffect() hook being called twice in render (for dev builds) */
  /** persists inside render but gets reset on each render */
  const ref = useRef(false);
  // const localVerified = [ false ];
  /** State to persist over a whole render */
  // const [ verified, setVerified ] = useState(false);
  /** Response from verification API call */ 
  const [ response, setResponse ] = useState(initialResponse);
  /** The API call to verify the email */
  // console.log('1. verified =', verified);
  console.log('1. ref.current =', ref.current);
  const verifyEmail = async () => {
    console.log('Running the verifyEmail() async function ...');
    try {
      // console.log('2. verified =', verified);
      console.log('2. ref.current =', ref.current);
      // console.log('1. localVerified =', localVerified[0]);
      if (!ref.current) {
      // if (!verified && !ref.current) {
      // if (!verified && !localVerified[0]) {
        // setVerified(true);
        ref.current = true;
        // localVerified[0] = true;
        // console.log('3. verified =', verified);
        console.log('3. ref.current =', ref.current);
        // console.log('2. localVerified[0] =', localVerified[0]);
        const response = await fetchWrapper.get(url);
        console.log('API call completed.');
        console.log('response.status =', response && response.status);
        setResponse({ ...initialResponse, ...(response || {}) });
        // console.log('4. verified =', verified);
        console.log('4. ref.current =', ref.current);
      }
    } catch (error) {
      console.error('error =', error);
      setResponse({ ...initialResponse, message: error.message });
    }
  }
  // const handleVerificationCall = () => {
    // setResponse(verifyEmail(url, verified, response));
    // return response;
  // }
  useEffect(() => {
    console.log('Running the useEffect() hook ...');
    // console.log('5. verified =', verified);
    console.log('5. ref.current =', ref.current);
    // setVerified(true);
    verifyEmail();
    // console.log('6. verified =', verified);
    console.log('6. ref.current =', ref.current);
    // console.log('3. localVerified =', localVerified[0]);
  }, []);
  // setVerified(true);
  // console.log('7. verified =', verified);
  console.log('7. ref.current =', ref.current);
  // console.log('4. localVerified =', localVerified[0]);
  console.log('(Re)Painting the screen ...');
  
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
        <Route path="/verifyemail/:verificationcode/*" />
      </Routes>
    </div>
  )
}
