import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authActions } from '_store';
import { fetchWrapper } from '_helpers';

/** Create slice */
const name = 'users';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

/** Exports */
export const userActions = { ...slice.actions, ...extraActions };
export const usersReducer = slice.reducer;

/** Implementation */
function createInitialState() {
  return {
    list: null,
    item: null
  }
}

function createExtraActions() {
  const baseUrl = `${process.env.REACT_APP_API_URL}/users`;
  return {
    register: register(),
    getAll: getAll(),
    getById: getById(),
    update: update(),
    delete: _delete()
  };

  function register() {
    return createAsyncThunk(
      `${name}/register`,
      async (user) => await fetchWrapper.post(`${baseUrl}/register`, user)
    );
  }
  function getAll() {
    return createAsyncThunk(
      `${name}/getAll`,
      async () => await fetchWrapper.get(baseUrl)
    );
  }
  function getById() {
    return createAsyncThunk(
      `${name}/getById`,
      async (id) => await fetchWrapper.get(`${baseUrl}/${id}`)
    );
  }
  function update() {
    return createAsyncThunk(
      `${name}/update`,
      async function({ id, data }, { getState, dispatch }) {
        await fetchWrapper.put(`${baseUrl}/${id}`, data);
        /** Update stored user if the logged in user updated their own record */
        const auth = getState().auth.value;
        if (id === auth?.id.toString()) {
          /** Update local storage */
          const user = { ...auth, ...data };
          localStorage.setItem('auth', JSON.stringify(user));
          /** Update auth user in Redux state */
          dispatch(authActions.setAuth(user));
        }
      }
    );
  }
  /** Prefixed with underscore because delete is a reserved word in Javascript */
  function _delete() {
    return createAsyncThunk(
      `${name}/delete`,
      async function(id, { getState, dispatch }) {
        await fetchWrapper.delete(`${baseUrl}/${id}`);
        /** Auto logout if the logged in user deleted their own record */
        if (id === getState().auth.value?.id) {
          dispatch(authActions.logout());
        }
      }
    );
  }
}

function createExtraReducers() {
  return (builder) => {
    getAll();
    getById();
    _delete();

    function getAll() {
      var { pending, fulfilled, rejected } = extraActions.getAll;
      builder
        .addCase(pending, (state) => {
          state.list = { loading: true };
        })
        .addCase(fulfilled, (state, action) => {
          state.list = { value: action.payload };
        })
        .addCase(rejected, (state, action) => {
          state.list = { error: action.error };
        });
    }
    function getById() {
      var { pending, fulfilled, rejected } = extraActions.getById;
      builder
        .addCase(pending, (state) => {
          state.list = { loading: true };
        })
        .addCase(fulfilled, (state, action) => {
          state.list = { value: action.payload };
        })
        .addCase(rejected, (state, action) => {
          state.list = { error: action.error };
        });
    }
    function _delete() {
      var { pending, fulfilled, rejected } = extraActions.delete;
      builder
        .addCase(pending, (state, action) => {
          const user = state.list.value.find(x => x.id === action.meta.arg);
          user.deleting = true;
        })
        .addCase(fulfilled, (state, action) => {
          state.list.value = state.list.value.filter(x => x.id !== action.meta.arg);
        })
        .addCase(rejected, (state, action) => {
          const user = state.list.value.find(x => x.id === action.meta.arg);
          user.isDeleting = false;
        });
    }
  }
}

