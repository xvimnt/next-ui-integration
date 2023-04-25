import { createSlice } from "@reduxjs/toolkit"

// Define the initial state using that type
const initialState = {
    data: [],
}

export const AccountsSlice = createSlice({
    name: "Categories",
    initialState,
    reducers: {
        setAccounts: (state, action) => {
            state.data = action.payload
        },
    },
})

export const { setAccounts } = AccountsSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectAccounts = (state) => state.accounts;

export default AccountsSlice.reducer