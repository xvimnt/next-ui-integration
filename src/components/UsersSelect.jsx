import { useState, useEffect } from 'react'
import {getAllUsers} from '../services/users'

export const UsersSelect = ({ selectedOption, handleSelectChange}) => {
    const [users, setUsers] = useState([])
    useEffect(() => {
        const getUsers = async () => {
            const users = await getAllUsers()
            setUsers(users)
        }
        getUsers()
    }, [])
    return (
        <select value={selectedOption} onChange={handleSelectChange} className="my-2  block max-w-sm w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded-2xl shadow leading-tight focus:outline-none focus:shadow-outline-blue focus:border-blue-500">
            <option value="">Selecciona un usuario...</option>
            {
                users &&
                users.map(user => {
                    return <option key={user.id} value={user.id}>{user.username}</option>
                })
            }
        </select>
    )
}
