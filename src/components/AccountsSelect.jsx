import React from 'react'

export const AccountsSelect = ({ selectedOption, handleSelectChange, accounts }) => {
    return (
        <select value={selectedOption.id} onChange={handleSelectChange} className="my-2  block max-w-sm w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded-2xl shadow leading-tight focus:outline-none focus:shadow-outline-blue focus:border-blue-500">
            <option value="">Selecciona una cuenta...</option>
            {
                accounts &&
                accounts.map(account => {
                    return <option key={account.id} value={account.id}>{account.id} - {account.name}</option>
                })
            }
        </select>
    )
}
