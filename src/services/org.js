import { axiosFetch } from "../utils/functions"

export const getAllOrganizations = async () => {
    return axiosFetch('/org', 'get')
}

export const shareAccounts = async (items) => {
    // post each item
    const promises = items.map(item => {
        return axiosFetch('/org/accounts', 'post', item)
    })
    return Promise.all(promises)
}

// Get Shared Accounts
export const getSharedAccounts = async (app_id) => {
    return axiosFetch(`/org/accounts/${app_id}`, 'get')
}

// Delete shared account
export const deleteSharedAccounts = async (items) => {
    // delete each items
    const promises = items.map(item => {
        return axiosFetch(`/org/accounts/${item}`, 'delete', {})
    })
    return Promise.all(promises)
}