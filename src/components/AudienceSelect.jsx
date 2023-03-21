import { useState, useEffect } from 'react'
import {getAudiences} from '../services/facebook'

export const AudiencesSelect = ({ selectedOption, handleSelectChange, account_id}) => {
    const [audiences, setAudiences] = useState([])
    useEffect(() => {
        const asyncAudiences = async () => {
            await getAudiences(setAudiences, {adsId: account_id})
        }
        asyncAudiences()
    }, [account_id])
    return (
        <select value={selectedOption} onChange={handleSelectChange} className="my-2  block max-w-sm w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded-2xl shadow leading-tight focus:outline-none focus:shadow-outline-blue focus:border-blue-500">
            <option value="">Selecciona una audiencia...</option>
            {
                audiences &&
                audiences.data.map(audience => {
                    return <option key={audience.id} value={audience.id}>{audience.name}</option>
                })
            }
        </select>
    )
}
