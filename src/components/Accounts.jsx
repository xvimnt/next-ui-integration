import { getAdsAccounts } from "../services/facebook"
import { useState, useEffect } from "react"
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
            <div className="relative flex flex-col items-center justify-center">

                <select value={selectedOption} onChange={handleSelectChange} className="my-2  block max-w-sm appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded-2xl shadow leading-tight focus:outline-none focus:shadow-outline-blue focus:border-blue-500">
                    <option value="">Selecciona una cuenta...</option>
                    {
                        accounts.data &&
                        accounts.data.map(account => {
                            return <option key={account.account_id} value={account.account_id}>{account.id} - {account.name}</option>
                        })
                    }
                </select>

            </div>
        </>
    )
}
