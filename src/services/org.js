import { axiosFetch } from "../utils/functions"

export const getAllOrganizations = async () => {
    return axiosFetch('/org', 'get')
}