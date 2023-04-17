import React, { useState } from 'react'
import { Modal } from '../Modal'
import { UsersSelect } from 'src/components/UsersSelect'
import { OrgSelect } from 'src/components/OrgSelect'
import { updateUser } from 'src/services/users'
import { Toast } from '../Toast'

export const UsersModal = ({ showModal, setShowModal }) => {
    const [selectedUser, setSelectedUser] = useState()
    const [selectedOrg, setSelectedOrg] = useState()
    const [showToast, setShowToast] = useState(false)

    const handleSelectUser = (event) => {
        setSelectedUser(event.target.value)
    }
    const handleSelectOrg = (event) => {
        setSelectedOrg(event.target.value)
    }
    const handleSubmit = () => {
        // updating user
        const user = {
            id: selectedUser,
            app_id: selectedOrg
        }
        updateUser(user)

        // reseting state
        setSelectedOrg()
        setSelectedUser()
        setShowModal(false)
        setShowToast(true)
        setTimeout(() => {
            setShowToast(false)
        }, 3000);

    }

    return (
        <>
            <Toast body="Usuario asociado con exito" show={showToast} color='bg-green-500' />
            <Modal showModal={showModal} setShowModal={setShowModal}>
                <div className='container mx-auto'>
                    <h1 className='font-bold text-2xl p-1 m-2 text-center'>Asociar Usuarios</h1>
                    <form className="w-96 mx-auto p-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
                                Usuario
                            </label>
                            <UsersSelect selectedOption={selectedUser} handleSelectChange={handleSelectUser} />
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
                </div>
            </Modal>
        </>
    )
}
