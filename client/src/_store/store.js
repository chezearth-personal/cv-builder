import { configureStore } from '@reduxjs/toolkit';
import { alertReducer } from './alert.slice';
import { authReducer } from './auth.slice';
import { usersReducer } from './users.slice';
import { cvReducer } from './cv.slice';
import { pillGroupsReducer } from './pill-groups.slice';

// export * from './alert.slice';
// export * from './auth.slice';
// export * from './users.slice';
export const store = configureStore({
  reducer: {
    alert: alertReducer,
    auth: authReducer,
    users: usersReducer,
    cv: cvReducer,
    pillGroups: pillGroupsReducer,
  }
});
