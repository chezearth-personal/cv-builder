import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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
  const baseUrl = `${process.env.REACT_APP_AUTH_API_BASE_URL}/api/v1`;
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
          const auth = await fetchWrapper.post(
            `${baseUrl}/auth/login`,
            { email, password }
          );
          console.log(`createExtraActions():login():user = ${JSON.stringify(auth)}`);
          /** Store access token in auth object of local store */
          // localStorage.setItem('auth', JSON.stringify({access_token: auth.access_token}));
          dispatch(authActions.setAuth({token: auth.access_token}));
          const userDetails = await fetchWrapper.get(`${baseUrl}/users/me`);
          console.log(`userDetails = ${JSON.stringify(userDetails)}`);
          const user = userDetails
            && userDetails.data
            && userDetails.data.user
            && { ...userDetails.data.user, ...{token: auth.access_token} };
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
      `${name}/auth/logout`,
      function (arg, { dispatch }) {
        dispatch(authActions.setAuth(null));
        localStorage.removeItem('auth');
        history.navigate('/');
      }
    );
  }
}
