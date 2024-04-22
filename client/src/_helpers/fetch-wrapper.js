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
  return (url, body, handleSuccess, handleError) => {
    const requestOptions = {
      method,
      url,
      headers: authHeader(url),
    };
    console.log('request():requestOptions =', requestOptions);
    if (body) {
      requestOptions.headers['Content-Type'] = 'application/json'
      requestOptions.data = body;
      // requestOptions.body = JSON.stringify(body);
    }
    console.log('request():requestOptions =', requestOptions);
    return axios(requestOptions)
      .then(handleSuccess ? handleSuccess : handleResponse)
      .catch(handleError ? handleError : handleResponse);
    // return fetch(url, requestOptions).then(handleResponse);
  }
}

function authHeader(url) {
  /** return auth header with jwt if user is logged in and request is to the api url */
  const { access_token, refresh_token, logged_in } = authToken();
  console.log(`authHeader():access_token = ${access_token}`);
  console.log(`authHeader():refresh_token = ${refresh_token}`);
  console.log(`authHeader():logged_in = ${logged_in}`);
  const isLoggedIn = !!access_token;
  // console.log(`authHeader():isLoggedIn = ${isLoggedIn}`);
  const isApiUrl = url.startsWith(process.env.REACT_APP_AUTH_API_BASE_URL);
  if (isLoggedIn && isApiUrl) {
    return { Authorization: `Bearer ${access_token}` };
  } else {
    return {};
  }
}

function authToken() {
  return {
    access_token: Cookies.get('access_token'),
    refresh_token: Cookies.get('refresh_token'),
    logged_in: Cookies.get('logged_in')
  };
}

async function handleResponse( response ) {
  console.log('handleResponse():response =', response);
  console.log('handleResponse():response.data =', response.data);
  console.log('handleResponse():response.headers =', response.headers);
  const data = response.data;
  /** check for error response */
  if (response.statusText !== 'OK') {
    if ([401, 403].includes(response.status) && authToken()) {
      /** auto logout if 401 Unauthorized or 403 Forbidden response from api */
      const logout = () => store.dispatch(authActions.logout());
      logout();
    }
    /** get error message from body or default to response status */
    const error = (data && data.message) || response.status;
    return Promise.reject(error);
  }
  return data;
}
