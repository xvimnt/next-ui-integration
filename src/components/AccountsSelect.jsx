import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getSharedAccounts } from 'src/services/org'

export const AccountsSelect = ({ selectedOption, handleSelectChange, accounts }) => {
    if (!accounts) return
    const router = useRouter()
    // get shared accounts for the app_id
    const [sharedAccounts, setSharedAccounts] = useState([])

    useEffect(() => {
        const hydrate = async () => {
            if(!accounts) return
            // get app_id from router
            const { app_id } = router.query
            // get shared accounts
            const res = await getSharedAccounts(app_id)
            if (res) {
                setSharedAccounts([])
                accounts.forEach(account => {
                    res.forEach(sharedAccount => {
                        if (account.id == sharedAccount.account_id) {
                            setSharedAccounts(prev => [...prev, account])
                        }
                    })
                })
            }
        }
        hydrate()
    }, [])

    return (
        <select value={selectedOption?.id} onChange={handleSelectChange} className="my-2  block max-w-sm w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded-2xl shadow leading-tight focus:outline-none focus:shadow-outline-blue focus:border-blue-500">
            <option value="">Selecciona una cuenta...</option>
            {
                sharedAccounts?.map(account => {
                    return <option key={account.id} value={account.id}>{account.id} - {account.name}</option>
                })
            }
        </select>
    )
}
