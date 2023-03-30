import { useState } from "react"
import { Modal } from './Modal'
import { UsersSelect } from './UsersSelect'
import { OrgSelect } from './OrgSelect'
import { updateUser } from "../services/users"
import { Card } from "./Card"

export default function AdminCards() {
    const [showModal, setShowModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState("")
    const [selectedOrg, setSelectedOrg] = useState("")

    const handleSelectChange = (e) => {
        setSelectedUser(e.target.value)
    }

    const handleSelectOrg = (e) => {
        setSelectedOrg(e.target.value)
    }

    const handleSubmit = () => {
        const user = {
            id: selectedUser,
            app_id: selectedOrg,
            // TODO: remove
            facebook_token: localStorage.getItem('accessToken')
        }
        updateUser(user)
        setShowModal(false)
    }

    return (
        <>
            <hr />
            <div className='container mx-auto'>
                <h1 className='text-3xl font-bold flex flex-col items-center my-4'>Admin</h1>
                <div className="grid grid-cols-4">
                    <Card
                        title="Asociar Usuarios"
                        subtitle="Relaciona el app id de una organizacion con un usuario"
                        action={() => setShowModal(true)}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="mx-4" viewBox="0 0 24 24"><path d="M19.5 15c-2.483 0-4.5 2.015-4.5 4.5s2.017 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.017-4.5-4.5-4.5zm2.5 5h-2v2h-1v-2h-2v-1h2v-2h1v2h2v1zm-7.18 4h-14.815l-.005-1.241c0-2.52.199-3.975 3.178-4.663 3.365-.777 6.688-1.473 5.09-4.418-4.733-8.729-1.35-13.678 3.732-13.678 6.751 0 7.506 7.595 3.64 13.679-1.292 2.031-2.64 3.63-2.64 5.821 0 1.747.696 3.331 1.82 4.5z" /></svg>
                        } />
                </div>
                <Modal showModal={showModal} setShowModal={setShowModal} >
                    <h1 className='font-bold text-2xl p-1 m-2 text-center'>Asociar Usuarios</h1>
                    <form className="w-96 mx-auto p-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
                                Usuario
                            </label>
                            <UsersSelect selectedOption={selectedUser} handleSelectChange={handleSelectChange} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                                Organizacion
                            </label>
                            <OrgSelect selectedOption={selectedOrg} handleSelectChange={handleSelectOrg} />
                        </div>
                        <div className="flex flex-col items-center justify-between">
                            <button onClick={handleSubmit} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline" type="button">
                                Guardar
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </>
    )
}
