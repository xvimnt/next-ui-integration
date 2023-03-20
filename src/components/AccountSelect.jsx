import React from 'react'

export const AccountSelect = ({selectedOption, handleSelectChange, accounts}) => {
    return (
        <select value={selectedOption} onChange={handleSelectChange} className="my-2  block max-w-sm appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded-2xl shadow leading-tight focus:outline-none focus:shadow-outline-blue focus:border-blue-500">
            <option value="">Selecciona una cuenta...</option>
            {
                accounts.data &&
                accounts.data.map(account => {
                    return <option key={account.account_id} value={account.account_id}>{account.id} - {account.name}</option>
                })
            }
        </select>
    )
}
