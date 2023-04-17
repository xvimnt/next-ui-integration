import { useState, useEffect } from 'react'
import {getAllOrganizations} from '../services/org'

export const OrgSelect = ({ selectedOption, handleSelectChange}) => {
    const [orgs, setOrgs] = useState([])
    useEffect(() => {
        const getOrgs = async () => {
            const orgs = await getAllOrganizations()
            setOrgs(orgs)
        }
        getOrgs()
    }, [])
    return (
        <select value={selectedOption} onChange={handleSelectChange} className="my-2  block max-w-sm w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded-2xl shadow leading-tight focus:outline-none focus:shadow-outline-blue focus:border-blue-500">
            <option value="">Selecciona una organizacion...</option>
            {
                orgs &&
                orgs.map(org => {
                    return <option key={org.id} value={org.app_id}>{org.name}</option>
                })
            }
        </select>
    )
}
