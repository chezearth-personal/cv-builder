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

// const initConfig = {
  // url: null,
  // method: null,
  // headers: {
    // 'Accept': 'application/json'
  // },
  // data: null
// }
// const instance = axios.create(initConfig);

function request(method) {
  return (url, data, handleSuccess, handleError) => {
    axios.interceptors.response.use(
      (response) => {
        console.log('response interceptor:response =', response);
        return response;
      },
      async (error) => {
        const originalConfig = error.config;
        console.log('originalConfig.url =', originalConfig.url);
        console.log('isUseCredentials(originalConfig.url)?', isUseCredentials(originalConfig.url));
        console.log('error.response?', !!error.response);
        console.log('error.response.status === 401?', error.response.status === 401);
        console.log('!originalConfig._retry?', !originalConfig._retry);
        if (isUseCredentials(originalConfig.url) && error.response) {
          if (error.response.status === 401 && !originalConfig._retry) {
            originalConfig._retry = true;
            console.log('originalConfig._retry?', originalConfig._retry);
            console.log('!originalConfig._retry?', !originalConfig._retry);
            try {
              const response = axios.request({
                method: 'GET',
                url: `${process.env.REACT_APP_AUTH_API_BASE_URL}/api/v1/auth/refresh`,
                withCredentials: true
              });
              console.log('response interceptor:result =', response);
              handleResponse(response);
            } catch (error) {
              console.log('error.response?', !!error.response);
              handleResponse(error.response);
            }
          }
        }
        return Promise.reject(error);
      }
    );
    const isUseCredentials = url => !url.startsWith(`${process.env.REACT_APP_AUTH_API_BASE_URL}/api/v1/auth`)
      || (!url.endsWith('/register')
        && !url.includes('/verifyemail/')
        && !url.endsWith('/login')
      );
    const requestOptions = {
      method,
      url,
      headers: {},
      withCredentials: isUseCredentials(url)
    };
    console.log('request():url =', url);
    console.log('request():method =', method);
    if (data) {
      requestOptions.headers['Content-Type'] = 'application/json'
      requestOptions.data = data;
    }
    // instance.interceptors.request.use(
      // config => {
        // console.log('Request Interceptor ...');
        // console.log('method:url =', method + ':' + url);
        // console.log('config.method:config.url =', config.method + ':' + config.url);
        // config.url = url;
        // // config.url = config.url || url;
        // config.method = method;
        // // config.method = config.method === 'GET' ? 'GET' : method;
        // config.headers = initConfig.headers;
        // config.data = initConfig.data;
        // console.log('config.method:config.url =', config.method + ':' + config.url);
        // console.log('isUseCredentials(url)?', isUseCredentials(url));
        // if (isUseCredentials(url)) {
          // config.withCredentials = true;
        // }
        // console.log('!!data?', !!data);
        // if (data) {
          // config.headers['Content-Type'] = 'application/json';
          // config.data = data;
        // }
        // console.log('request interceptor:config =', config);
        // return config;
      // }
    // );
    // instance.interceptors.response.use(
    // );
    // return instance.request()
      // .then(handleSuccess ? handleSuccess : handleResponse)
      // .catch(handleError ? handleError : handleResponse);
    // // console.log('request():requestOptions =', requestOptions);
    console.log('request():requestOptions =', requestOptions);
    return axios(requestOptions)
      .then(handleSuccess ? handleSuccess : handleResponse)
      .catch(handleError ? handleError : handleResponse);
  }
}

// function authHeader(url) {
  /** return auth header with jwt if user is logged in and request is to the api url */
  // const { access_token, refresh_token, logged_in } = authToken();
  // console.log(`authHeader():access_token = ${access_token}`);
  // console.log(`authHeader():refresh_token = ${refresh_token}`);
  // console.log(`authHeader():logged_in = ${logged_in}`);
  // const isLoggedIn = !!access_token;
  // console.log(`authHeader():isLoggedIn = ${isLoggedIn}`);
  // const isApiUrl = url.startsWith(process.env.REACT_APP_AUTH_API_BASE_URL);
  // if (isLoggedIn && isApiUrl) {
    // return { Authorization: `Bearer ${access_token}` };
  // } else {
    // return {};
  // }
// }

function authToken() {
  return {
    access_token: Cookies.get('access_token'),
    refresh_token: Cookies.get('refresh_token'),
    logged_in: Cookies.get('logged_in')
  };
}

async function handleResponse(response) {
  console.log('handleResponse():response =', response);
  console.log('handleResponse():response.data =', response.data);
  console.log('handleResponse():response.statusText =', response.statusText);
  const data = response.data;
  /** check for error response */
  if (response.statusCode >= 200 && response.statusCode < 300) {
    if ([401, 403].includes(response.statusCode) && authToken()) {
      /** auto logout if 401 Unauthorized or 403 Forbidden response from api */
      const logout = () => store.dispatch(authActions.logout());
      logout();
    }
    /** get error message from body or default to response status */
    const error = (data && data.message) || response.status;
    return Promise.reject(error);
  }
  console.log('All good! handleResponse():data =', data);
  return data;
}
