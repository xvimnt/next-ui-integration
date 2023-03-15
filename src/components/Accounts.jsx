import { getAdsAccounts } from "../services/facebook"
import { useState, useEffect } from "react"
export const Accounts = ({accessToken}) => {
    const [accounts, setAccounts] = useState()
    
    useEffect(() => {
        getAdsAccounts(setAccounts,{accessToken})
    }, [])
    return (
        <>
            <hr className='my-3' />
            <h1 className='text-3xl font-bold flex flex-col items-center my-4'>Cuentas Publicitarias</h1>

            <div className='grid grid-cols-3 gap-2'>
                {
                }
            </div>
        </>
    )
}
