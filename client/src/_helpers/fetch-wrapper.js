import { authActions } from '_store/auth.slice';
import { store } from '_store/store';

export const fetchWrapper = {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE')
}

function request(method) {
  return (url, body) => {
    const requestOptions = {
      method,
      headers: authHeader(url)
    };
    if (body) {
      requestOptions.headers['Content-Type'] = 'application/json';
      requestOptions.body = JSON.stringify(body);
    }
    console.log('url =', url);
    return fetch(url, requestOptions).then(handleResponse);
  }
}

function authHeader(url) {
  /** return auth header with jwt if user is logged in and request is to the api url */
  const token = authToken();
  const isLoggedIn = !!token;
  console.log('url =', url);
  console.log('process.env.REACT_APP_API_URL =', process.env.REACT_APP_API_URL);
  const isApiUrl = url.startsWith(process.env.REACT_APP_API_URL);
  if (isLoggedIn && isApiUrl) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
}

function authToken() {
  return store.getState().auth.value?.token;
}

async function handleResponse(response) {
  const isJson = response.headers?.get('Content-Type')?.includes('application/json');
  const data = isJson ? await response.json() : null;
  /** check for error response */
  if (!response.ok) {
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
