import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchWrapper } from '_helpers/fetch-wrapper';

/** Create slice */
const name = 'cv';
const initialState = createInitialState();
const extraActions = createExtraActions();
const cvSlice = createSlice({ name, initialState });
const keyTopicsSlice = createSlice({
  name: 'keyTopics',
  initialState: { list: null }
});

/** Exports */
export const cvActions = { ...cvSlice.actions, ...extraActions };
export const cvReducer = cvSlice.reducer;

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
      async (cvInput) => await fetchWrapper.post(
        `${BASE_URL}/cv/create`,
        cvInput
      )
    );
  }
}
