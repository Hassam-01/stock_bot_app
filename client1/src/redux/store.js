import { configureStore } from '@reduxjs/toolkit'
import userIdReducer from '../features/userID/userIdSlice'
import userNameReducer from '../features/username/usernameSlice'
import authReducer from '../features/authentication/authSlice'
import dashboardReducer from '../features/dashboard/dashboardSlice'
export const store = configureStore({
  reducer: {
    userId: userIdReducer,
    username: userNameReducer,
    auth: authReducer,
    dashboard: dashboardReducer,
  },
})