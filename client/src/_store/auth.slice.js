import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { alertActions } from '_store/alert.slice';
import { fetchWrapper } from '_helpers/fetch-wrapper';
import { history } from '_helpers/history';

/** Create slice */
const name = 'auth';
const initialState = createInitialState();
const reducers = createReducers();
const extraActions = createExtraActions();
const slice = createSlice({ name, initialState, reducers });

/** Exports */
export const authActions = { ...slice.actions, ...extraActions };
export const authReducer = slice.reducer;

/** Implementation */
function createInitialState() {
  return {
    /** Initialise state from local storage to enable user to stay logged in */
    value: JSON.parse(localStorage.getItem('auth'))
  };
}

function createReducers() {
  return {
    setAuth
  };
  function setAuth(state, action) {
    state.value = action.payload;
  }
}

function createExtraActions() {
  const BASE_URL = `${process.env.REACT_APP_AUTH_API_BASE_URL}/api/v1`;
  return {
    login: login(),
    logout: logout()
  };
  function login() {
    return createAsyncThunk(
      `${name}/login`,
      async function ({ email, password }, { dispatch }) {
        dispatch(alertActions.clear());
        try {
          const login = await fetchWrapper.post(
            `${BASE_URL}/auth/login`,
            { email, password }
          );
          console.log(`login = ${login}`);
          console.log(`login = ${JSON.stringify(login)}`);
// NO LONGER VALID!          /** Store access token in auth object of local store */
          /** Store access token in Cookies */
          // Cookies.set(
            // 'access_token',
            // login.access_token,
            // { expires: 1 }, 
            // { httpOnly: true },
            // { secure: true },
            // { sameSite: 'strict' }
          // );
          // Cookies.set(
            // 'refresh_token',
            // login.refresh_token,
            // { expires: 1 },
            // { httpOnly: true },
            // { secure: true },
            // { sameSite: 'strict' }
          // );
          // Cookies.set(
            // 'logged_in',
            // login.logged_in,
            // { expires: 1 },
            // { httpOnly: false },
            // { secure: true },
            // { sameSite: 'strict' }
          // );
          // dispatch(authActions.setAuth({ access_token: accessToken, refresh_token: refreshToken}));
          const userDetails = await fetchWrapper.get(`${BASE_URL}/users/me`);
          console.log(`userDetails = ${JSON.stringify(userDetails)}`);
          const user = userDetails
            && userDetails.data
            && userDetails.data.user
            && {
              ...userDetails.data.user,
              // ...{ access_token: accessToken, refresh_token: refreshToken }
            };
          console.log(`user = ${JSON.stringify(user)}`);
          /** Set auth user in Redux state */
          dispatch(authActions.setAuth(user));
          /** Store user details and jwt token in local storage  to keep user logged */
          /** in between page refreshes */
          localStorage.setItem('auth', JSON.stringify(user));
          /** Get return URL from location state or default to home page */
          const { from } = history.location.state || { from: { pathname: '/' } };
          history.navigate(from);
        } catch (error) {
          dispatch(alertActions.error(error));
        }
      } 
    );
  }
  function logout() {
    return createAsyncThunk(
      `${name}/logout`,
      async function (arg, { dispatch }) {
        try {
          const logout = await fetchWrapper.post(`${BASE_URL}/auth/logout`, {});
          if (logout.status === 204) {
            console.log(`Log out successful.`);
          }
        } catch (error) {
          dispatch(alertActions.error(error));
        }
        Cookies.remove('access_token');
        dispatch(authActions.setAuth(null));
        localStorage.removeItem('auth');
        history.navigate('/');
      }
    );
  }
}
