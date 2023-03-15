import axios from "axios"

export const getAudiences = async (setAudiences, data) => {
    try {
        const res = await axios.get(`https://graph.facebook.com/v16.0/act_${data.adsId}/customaudiences?fields=id,name&&access_token=${data.accessToken}`)
        if(res.status !== 200) {
            throw new Error(res.data)
        } else {
            setAudiences(res.data)
        }
    }catch (err) {
        console.error(err)
    }
}

export const getAdsAccounts = async (setAccounts, data) => {
    try {
        const res = await axios.get(`https://graph.facebook.com/v16.0/me?fields=adaccounts&messages?access_token=${data.accessToken}`)
        if(res.status !== 200) {
            throw new Error(res.data)
        } else {
            console.log('accounts',res.data)
            setAccounts(res.data)
        }
    }catch (err) {
        console.error(err)
    }
}

export const insertData = async (audienceId, data) => {
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
            "access_token": data.accessToken
        })
        if(res.status !== 200) {
            throw new Error(res.data)
        }
    } catch (error) {
        console.error(error)
    }
}
