import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  userInfo: {}, /**  for user object */
  userToken: null, /** for user token */
  error: null,
  success: false, /** for monitoring registration */
};

const authSlice = createSlice({
  mame: 'auth',
  initialState,
  reducers: {},
  extraReducers: {}
});

export default authSlice.reducer;
