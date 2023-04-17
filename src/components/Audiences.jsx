import React, { useEffect, useRef, useState } from 'react'
import { getAudiences, insertData } from '../services/facebook'
import { Audience } from './Audience';
import { Modal } from './Modal'
const crypto = require('crypto');

function encryptStringToSHA256(string) {
    const hash = crypto.createHash('sha256');
    hash.update(string);
    return hash.digest('hex');
}

export const Audiences = ({ selectedAccount }) => {
    const [audiences, setAudiences] = useState()
    const [filteredAudiences, setFilteredAudiences] = useState()
    const [showModal, setShowModal] = useState(false)
    const [selectedAudience, setSelectedAudience] = useState()

    const searchRef = useRef(null)
    const phoneRef = useRef(null)

    useEffect(() => {
        if (selectedAccount) {
            const adsId = selectedAccount.account_id
            getAudiences(setAudiences, { adsId })
        }
    }, [selectedAccount])

    useEffect(() => {
        if (audiences) {
            setFilteredAudiences([...audiences.data])
        }
    }, [audiences])

    const handleClick = (item) => {
        setShowModal(true)
        setSelectedAudience(item)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const phoneValue = phoneRef.current?.value
        if (phoneValue) {
            const data = {
                content: [encryptStringToSHA256(phoneValue)]
            }
            // TODO: get accessToken from fbToken table associated with the user
            const accessToken = localStorage.getItem('accessToken')

            await insertData(selectedAudience.id, data, accessToken)
            setShowModal(false)
        }
    }

    const handleSearch = () => {
        const searchValue = searchRef.current?.value
        const filteredAudiences = [...audiences.data].filter(audience =>
            audience.name.toLowerCase().startsWith(searchValue.toLowerCase())
            || audience.id.toString().startsWith(searchValue.toLowerCase())
        )
        setFilteredAudiences(filteredAudiences)
    }


    return (
        <>
            <hr className='my-3' />
            <h1 className='text-3xl font-bold flex flex-col items-center my-4'>Audiencias</h1>
            <div className="w-full max-w-md border rounded-md my-3">
                <input onChange={handleSearch} ref={searchRef} className="block w-full rounded-lg pl-10 pr-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:shadow-outline-blue focus:text-gray-900 focus:placeholder-gray-400 sm:text-sm sm:leading-5 -z-1000" placeholder="Buscar" />
            </div>
            <div className='grid grid-cols-3 gap-2'>
                {(
                    filteredAudiences?.map(el => {
                        return (
                            <Audience key={el.id} audience={el} handleClick={handleClick} />
                        )
                    })
                )
                }
            </div>
            <Modal showModal={showModal} setShowModal={setShowModal}>
                <h1 className='font-bold text-2xl p-1 m-2 text-center'>Agregar usuarios</h1>
                <h1 className='font-light p-1 m-2 text-center'>{selectedAudience?.name}</h1>
                <form className="w-96 mx-auto p-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                            Telefono
                        </label>
                        <input ref={phoneRef} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="phone" type="number" placeholder="12345678" />
                    </div>
                    <div className="flex flex-col items-center justify-between">
                        <button onClick={handleSubmit} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline" type="button">
                            Guardar
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    )
}
