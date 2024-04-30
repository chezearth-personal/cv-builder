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

function request(method) {
  return (url, data, handleSuccess, handleError) => {
    /** Path for auth endpoints */
    const authPath = `${process.env.REACT_APP_AUTH_API_BASE_URL}/api/v1/auth`;
    /** function to check url is not a login, register or veirfy email auth path, */
    /** which do not require credentials (all other paths do) */
    const isRequireCredentials = url => !url.startsWith(authPath)
      || (!url.endsWith('/register')
        && !url.includes('/verifyemail/')
        // && !url.endsWith('/login')
      );
    console.log('request():url =', url);
    console.log('request():method =', method);
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
    // const instance = axios.create(initConfig);
    /** Request interceptor */
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
        // console.log('isRequireCredentials(url)?', isRequireCredentials(url));
        // config.withCredentials = isRequireCredentials(url);
        // console.log('!!data?', !!data);
        // if (data) {
          // config.headers['Content-Type'] = 'application/json';
          // config.data = data;
        // }
        // console.log('request interceptor:config =', config);
        // return config;
      // },
      // error => {
        // console.log('request interceptor:error =', error);
        // return Promise.reject(error);
      // }
    // );
    /** Response interceptor, used to catch 401 (unauthorized) responses and renew access_tokens*/
    axios.interceptors.response.use(
    // instance.interceptors.response.use(
      (response) => {
        console.log('response interceptor:response =', response);
        return response;
      },
      async (error) => {
        const originalConfig = error.config;
        if (originalConfig) {
          console.log('originalConfig.url =', originalConfig.url);
          console.log('isRequireCredentials(originalConfig.url)?', isRequireCredentials(originalConfig.url));
          console.log('error.response =', error.response);
          console.log('error.response?', !!error.response);
          console.log('error.response.status === 401?', error.response.status === 401);
          console.log('originalConfig._retry?', originalConfig._retry);
          console.log('!originalConfig._retry?', !originalConfig._retry);
          if (isRequireCredentials(originalConfig.url) && error.response) {
            /** Access token has expired */
            if (error.response.status === 401 && !originalConfig._retry) {
              originalConfig._retry = true;
              Cookies.remove('access_token');
              Cookies.remove('logged_in');
              console.log('originalConfig._retry?', originalConfig._retry);
              console.log('!originalConfig._retry?', !originalConfig._retry);
              try {
                const response = await axios.request({
                // const response = instance.request({
                  method: 'GET',
                  url: `${authPath}/refresh`,
                  withCredentials: true
                });
                console.log('response interceptor:result =', response);
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
    // const requestOptions = {
      // method,
      // url,
      // headers: {},
      // withCredentials: isRequireCredentials(url)
    // };
    // instance.interceptors.response.use(
    // );
    // return instance.request()
      // .then(handleSuccess ? handleSuccess : handleResponse)
      // .catch(handleError ? handleError : handleResponse);
    // // console.log('request():requestOptions =', requestOptions);
    return axios(initConfig)
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
  if (response) {
    console.log('handleResponse():response.data =', response.data);
    console.log('handleResponse():response.statusText =', response.statusText);
    const data = response.data;
    /** Check for success */
    if (response.status >= 200 && response.status < 300) {
      console.log('All good! handleResponse():data =', data);
      return data;
    }
    /** check for error response */
    if ([401, 403].includes(response.status) && authToken()) {
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
