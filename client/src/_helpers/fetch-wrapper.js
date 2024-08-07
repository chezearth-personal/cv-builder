import axios from 'axios';
import Cookies from 'js-cookie';
import { authActions } from '_store/auth.slice';
import { store } from '_store/store';

export const fetchWrapper = {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE')
}


function request(method) {
  return (url, data, handleSuccess, handleError) => {
    console.log('request(): handleSuccess =', handleSuccess);
    console.log('request(): handleError =', handleError);
    console.log('request(): url =', url);
    console.log('request(): data =', data);
    /** Path for auth endpoints */
    const AUTH_PATH = `${process.env.REACT_APP_AUTH_API_BASE_URL}/api/v1/auth`;
    /** function to check url is not a register or verify email auth path, */
    /** which do not require credentials (all other paths do) */
    const isRequireCredentials = url => !url.startsWith(AUTH_PATH)
      || (!url.endsWith('/register')
        && !url.includes('/verify-email/')
        && !url.endsWith('/confirm-email')
        && !url.includes('/reset-password/')
      );
    const initConfig = {
      method,
      url,
      headers: {},
      withCredentials: isRequireCredentials(url)
    }
    if (data) {
      initConfig.headers['Content-Type'] = 'application/json'
      initConfig.data = data;
    }
    console.log('request():initConfig =', initConfig);
    // console.log('request():initConfig =', initConfig);
    /** Response interceptor, used to catch 401 (unauthorized) responses and renew access_tokens*/
    axios.interceptors.response.use(
      (response) => {
        // console.log('response interceptor:response =', response);
        return response;
      },
      async (error) => {
        const originalConfig = error.config;
        if (originalConfig) {
          console.log('isRequireCredentials(originalConfig.url)?', isRequireCredentials(originalConfig.url));
          // console.log('error.response =', error.response);
          if (isRequireCredentials(originalConfig.url) && error.response) {
            /** Access token has expired */
            if (error.response.status === 401 && !originalConfig._retry) {
              originalConfig._retry = true;
              Cookies.remove('access_token');
              Cookies.remove('logged_in');
              // console.log('originalConfig._retry?', originalConfig._retry);
              console.log('!originalConfig._retry?', !originalConfig._retry);
              try {
                await axios.request({
                  method: 'GET',
                  url: `${AUTH_PATH}/refresh`,
                  withCredentials: true
                });
                // console.log('response interceptor:result =', response);
                return axios(originalConfig);
              } catch (err) {
                console.log('err.response?', !!err.response);
                return Promise.reject(err);
              }
            }
          }
        }
        return Promise.reject(error);
      }
    );
    return axios(initConfig)
      .then(handleSuccess ? handleSuccess : handleSuccessResponse)
      .catch(handleError ? handleError : handleErrorResponse);
  }
}

function authToken() {
  return {
    access_token: Cookies.get('access_token'),
    refresh_token: Cookies.get('refresh_token'),
    logged_in: Cookies.get('logged_in')
  };
}

async function handleSuccessResponse(response) {
  console.log('handleSuccessResponse():response =', response);
  if (response) {
    // console.log('handleSuccessResponse():response.data =', response.data);
    // console.log('handleSuccessResponse():response.statusText =', response.statusText);
    console.log('handleSuccessResponse():response.status =', response.status);
    const data = response.data;
    /** Check for success */
    if (response.status >= 200 && response.status < 300) {
      console.log('All good! handleSuccessResponse():data =', data);
      return data;
    }
    /** check for error response */
    if ([401, 403].includes(response.response.status) && authToken()) {
      /** auto logout if 401 Unauthorized or 403 Forbidden response from api */
      const logout = () => store.dispatch(authActions.logout());
      logout();
    }
    /** get error message from body or default to response status */
    const error = (data && data.message) || response.status;
    return Promise.reject(error);
  }
  return Promise.reject('No response');
}

async function handleErrorResponse(error) {
  console.log('handleErrorResponse():error =', error);
  if (error && error.response) {
    console.log('handleErrorResponse():error.response =', error.response);
    // console.log('handleErrorResponse():error.response.statusText =', error.response.statusText);
    console.log('handleErrorResponse():error.response.status =', error.response.status);
    if ([401, 403].includes(error.response.status) && authToken()) {
      /** auto logout if 401 Unauthorized or 403 Forbidden response from api */
      const logout = () => store.dispatch(authActions.logout());
      logout();
    }
    return Promise.reject(error.response.data);
  }
  return Promise.reject('No response');
}
