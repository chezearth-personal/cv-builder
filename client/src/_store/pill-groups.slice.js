import { createSlice } from '@reduxjs/toolkit';
// import { PillGroups } from '../_components/pill-groups/PillGroups';

const initialState = {
  value: [{ name: '', itemPills: [] }],
  status: 'idle'
};

export const pillGroupSlice = createSlice({
  name: 'pillGroups',
  initialState,
  reducers: {
    addPillGroup: (state, action) => {
      state.value.push(action.payload);
    },
    updatePillGroup: (state, action) => {
      console.log('action.payload =', action.payload);
      // const index = state.value.findIndex((group) => group.key === action.payload.key);
      // state.value[index] = action.payload;
    },
    removePillGroup: (state, action) => {
      state.value = state.value.filter((group) => group.id !== action.payload);
    }
  }
});

export const {
  addPillGroup,
  updatePillGroup,
  removePillGroup
} = pillGroupSlice.actions;

export const selectPillGroups = (state) => state.pillGroups.value;

export const pillGroupsReducer = pillGroupSlice.reducer;
