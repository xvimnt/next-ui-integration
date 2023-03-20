import { useState } from "react"
import {Modal} from '../components/Modal'
export default function AsociateOrganization() {
    const [showModal, setShowModal] = useState(false)
    return (
        <>
            <hr />
            <div className='container mx-auto'>
                <button className="bg-red-500 rounded-2xl font-bold text-white p-4" onClick={() => setShowModal(true)}>Asociar Usuarios</button>
                <Modal showModal={showModal} setShowModal={setShowModal} >
                    <h1 className='text-3xl font-bold flex flex-col items-center my-4'>Asociar Usuario y Organizacion</h1>
                    <div className='flex justify-center items-center '>
                        <form action="">
                            <div className='flex flex-col gap-4 justify-items-center p-4 w-full'>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                                        User
                                    </label>
                                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="phone" type="number" placeholder="12345678" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                                        Organization
                                    </label>
                                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="phone" type="number" placeholder="12345678" />
                                </div>
                                <div className="flex flex-col items-center justify-between">
                                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline" type="button">
                                        Asociar
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
        </>
    )
}
