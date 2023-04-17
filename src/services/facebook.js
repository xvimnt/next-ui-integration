import axios from "axios"

export const getAudiences = async (setAudiences, data) => {
    try {
        const accessToken = localStorage.getItem('accessToken')
        if (data.adsId) {
            const res = await axios.get(`https://graph.facebook.com/v16.0/act_${data.adsId}/customaudiences?fields=id,name&&access_token=${accessToken}`)
            if (res.status !== 200) {
                throw new Error(res.data)
            } else {
                setAudiences(res.data)
            }
        }
    } catch (err) {
        console.error(err)
    }
}

export const createAudience = async (data, account_id) => {
    try {
        const res = await axios.post(`https://graph.facebook.com/v16.0/act_${account_id}/customaudiences`, data)
        if ([200, 201].indexOf(res.status) === -1) {
            throw new Error(res.data)
        } else {
            return res.data
        }
    } catch (err) {
        console.error(err)
    }
}

export const getAdsAccountsWithToken = async (token) => {
    try {
        const res = await axios.get(`https://graph.facebook.com/v16.0/me/adaccounts?fields=account_id,id,name&&access_token=${token}`)
        if (res.status !== 200) {
            throw new Error(res.data)
        } else {
            return res.data
        }
    } catch (err) {
        console.error(err)
    }
}

export const getAdsAccounts = async (setAccounts) => {
    try {
        const accessToken = localStorage.getItem('accessToken')
        const res = await axios.get(`https://graph.facebook.com/v16.0/me/adaccounts?fields=account_id,id,name&&access_token=${accessToken}`)
        if (res.status !== 200) {
            throw new Error(res.data)
        } else {
            setAccounts(res.data)
        }
    } catch (err) {
        console.error(err)
    }
}

export const insertData = async (audienceId, data, accessToken) => {
    try {
        const res = await axios.post(`https://graph.facebook.com/v16.0/${audienceId}/users`, {
            "payload": {
                "schema": "PHONE_SHA256",
                "data": data.content
            },
            "session": {
                "session_id": 9778993,
                "batch_seq": 10,
                "last_batch_flag": true,
                "estimated_num_total": 99996
            },
            "access_token": accessToken
        })
        if (res.status !== 200) {
            throw new Error(res.data)
        }
    } catch (error) {
        console.error(error)
    }
}
