import { configureStore } from '@reduxjs/toolkit';
import accountsSlice from "src/app/slices/accountsSlice"

export const store = configureStore({
  reducer: {
    accounts: accountsSlice,
  },
});

