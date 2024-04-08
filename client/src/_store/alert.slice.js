import { createSlice } from '@reduxjs/toolkit';

/** Create slice */
const name='alert';
const initialState = createInitialState();
const reducers = createReducers();
const slice = createSlice({ name, initialState, reducers });

/** Exports */
export const alertActions = { ...slice.actions };
export const alertReducer = slice.reducer;

/** Implementation*/
function createInitialState() {
  return { value: null };
}

function createReducers() {
  return { success, error, clear };
  /** Payload can be a string message ('alert message') or */
  /** an object ({ message: 'alert message', showAfterRedirect: treu }) */
  function success(state, action) {
    state.value = {
      type: 'alert-success',
      message: action.payload?.message || action.payload,
      showAfterRedirect: action.payload?.showAfterRedirect
    };
  }
  function error(state, action) {
    state.value = {
      type: 'alert-danger',
      message: action.payload?.message || action.payload,
      showAfterRedirect: action.payload?.showAfterRedirect
    };
  }
  function clear(state) {
    /** If showAfterRedirect flag is true the alert is not cleared */
    /** for one route change (e.g. after successful registration ) */
    if (state.value?.showAfterRedirect) {
      state.value.showAfterRedirect = false;
    } else {
      state.value = null;
    }
  }
}
