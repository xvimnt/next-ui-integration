import { create } from 'zustand'

export const useStore = create(set => ({
    accounts: [],
    token: null,
    updateAccounts: accounts => set({ accounts }),
    updateToken: token => set({ token }),
}))