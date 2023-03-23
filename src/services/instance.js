import { axiosFetchResponse } from "../utils/functions"

export const createInstanceConfig = async (config) => {
    return await axiosFetchResponse(`/instances/config/create`, 'post', config)
}