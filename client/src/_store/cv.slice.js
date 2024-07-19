import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchWrapper } from '_helpers/fetch-wrapper';

/** Create slice */
const name = 'cv';
const initialState = createInitialState();
const extraActions = createExtraActions();
const slice = createSlice({ name, initialState });

/** Exports */
export const cvActions = { ...slice.actions, ...extraActions };

/** Implementation */
function createInitialState() {
  return {
    list: null,
    item: null
  }
}

function createExtraActions() {
  const BASE_URL = `${process.env.REACT_APP_SERVER_API_BASE_URL}/api/v1`;
  return {
    create: create()
  };

  function create() {
    return createAsyncThunk(
      `${name}/create`,
      async (cvInput) => await fetchWrapper.post(`${BASE_URL}/cv/create`, cvInput)
    );
  }
}
