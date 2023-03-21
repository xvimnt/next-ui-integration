import { getAdsAccounts } from "../services/facebook"
import { useState, useEffect } from "react"
import {AccountsSelect } from './AccountsSelect'
export const Accounts = ({ accessToken, selectedOption, setSelectedOption }) => {

    const [accounts, setAccounts] = useState([])

    function handleSelectChange(event) {
        const selected = accounts.data.filter(acc => acc.account_id === event.target.value)[0]
        setSelectedOption(selected);
    }

    useEffect(() => {
        getAdsAccounts(setAccounts, { accessToken })
    }, [])

    return (
        <>
            <hr className='my-3' />
            <h1 className='text-3xl font-bold flex flex-col items-center my-4'>Cuentas Publicitarias</h1>
            <div className="flex flex-col items-center justify-center">
                <AccountsSelect selectedOption={selectedOption?.account_id} handleSelectChange={handleSelectChange} accounts={accounts} />
            </div>
        </>
    )
}
