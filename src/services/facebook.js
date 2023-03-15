import axios from "axios"

export const getAudiences = async (setAudiences) => {
    try {
        const res = await axios.get(`https://graph.facebook.com/v16.0/act_3429415270670299/customaudiences?fields=id,name&&access_token=EAAKVNbIy5ycBADJSZA8cwcLF7A60OGoAZAvkAbtWuXW3IliAxB75vCoqjwi2SzE3qdMScZBrJKDYJRDn0upVw3p7Srb25OBwppdr1cQFSqCfDuQyvqwK0oZApbZCIEpnqEVUlvquntVPtLtwAys6MSQatHLsp57pcYXYLAF5caBO39da0Hxo96EBRR2Lixdyj3MeesN1aQwZDZD`)
        if(res.status !== 200) {
            throw new Error(res.data)
        } else {
            setAudiences(res.data)
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
                "data": data
            },
            "session": {
                "session_id": 9778993,
                "batch_seq": 10,
                "last_batch_flag": true,
                "estimated_num_total": 99996
            },
            "access_token": "EAAKVNbIy5ycBADJSZA8cwcLF7A60OGoAZAvkAbtWuXW3IliAxB75vCoqjwi2SzE3qdMScZBrJKDYJRDn0upVw3p7Srb25OBwppdr1cQFSqCfDuQyvqwK0oZApbZCIEpnqEVUlvquntVPtLtwAys6MSQatHLsp57pcYXYLAF5caBO39da0Hxo96EBRR2Lixdyj3MeesN1aQwZDZD"
        })
        if(res.status !== 200) {
            throw new Error(res.data)
        }
    } catch (error) {
        console.error(error)
    }
}
