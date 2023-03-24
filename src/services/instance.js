import { axiosFetchResponse, axiosFetch } from "../utils/functions"

export const createInstanceConfig = async (config) => {
    return await axiosFetchResponse(`/instances/config/create`, 'post', config)
}
export const getInstanceConfig = async (config) => {
    return await axiosFetch(`/instances/config/${config.instance_id}/app/${config.app_id}`, 'get')
}