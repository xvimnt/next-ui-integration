import { axiosFetch } from "../utils/functions"

export const getAllUsers = async () => {
    return axiosFetch('/users', 'get')
}

export const updateUser = async (user) => {
    return axiosFetch(`/users/${user.id}`, 'patch', user)
}

export const createUser = async (user) => {
    return axiosFetch(`/users`, 'post', user)
}