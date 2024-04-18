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
          const user = await fetchWrapper.post(
            `${baseUrl}/auth/login`,
            { email, password }
          );
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
