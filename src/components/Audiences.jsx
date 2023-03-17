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

export const Audiences = ({ accessToken, selectedAccount }) => {
    const [audiences, setAudiences] = useState()
    const [filteredAudiences, setFilteredAudiences] = useState()
    const [showModal, setShowModal] = useState(false)
    const [showConfigModal, setShowConfigModal] = useState(false)
    const [selectedAudience, setSelectedAudience] = useState()

    const searchRef = useRef(null)
    const nameRef = useRef(null)
    const phoneRef = useRef(null)

    useEffect(() => {
        if (selectedAccount) {
            const adsId = selectedAccount.account_id
            getAudiences(setAudiences, { adsId, accessToken })
        }
    }, [selectedAccount, accessToken])

    useEffect(() => {
        if (audiences) {
            setFilteredAudiences([...audiences.data])
        }
    }, [audiences])

    const handleClick = (item) => {
        setShowModal(true)
        setSelectedAudience(item)
    }
    const handleConfig = (item) => {
        setShowConfigModal(true)
        setSelectedAudience(item)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const nameValue = nameRef.current?.value
        const phoneValue = phoneRef.current?.value
        if (nameValue && phoneValue) {
            const data = {
                content: [encryptStringToSHA256(phoneValue)],
                accessToken: accessToken
            }
            const res = await insertData(selectedAudience.id, data)
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
            <div className="relative w-full max-w-md border rounded-md my-3">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <svg className='w-6 h-6' clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m15.985 17.031c-1.479 1.238-3.384 1.985-5.461 1.985-4.697 0-8.509-3.812-8.509-8.508s3.812-8.508 8.509-8.508c4.695 0 8.508 3.812 8.508 8.508 0 2.078-.747 3.984-1.985 5.461l4.749 4.75c.146.146.219.338.219.531 0 .587-.537.75-.75.75-.192 0-.384-.073-.531-.22zm-5.461-13.53c-3.868 0-7.007 3.14-7.007 7.007s3.139 7.007 7.007 7.007c3.866 0 7.007-3.14 7.007-7.007s-3.141-7.007-7.007-7.007zm.741 8.499h-4.5c-.414 0-.75.336-.75.75s.336.75.75.75h4.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75zm3-2.5h-7.5c-.414 0-.75.336-.75.75s.336.75.75.75h7.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75zm0-2.5h-7.5c-.414 0-.75.336-.75.75s.336.75.75.75h7.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75z" fill-rule="nonzero" /></svg>
                </span>
                <input onChange={handleSearch} ref={searchRef} className="block w-full rounded-lg pl-10 pr-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:shadow-outline-blue focus:text-gray-900 focus:placeholder-gray-400 sm:text-sm sm:leading-5" placeholder="Search" />
            </div>
            <div className='grid grid-cols-3 gap-2'>
                {(
                    filteredAudiences?.map(el => {
                        return (
                            <Audience key={el.id} audience={el} handleClick={handleClick} handleConfig={handleConfig} />
                        )
                    })
                )
                }
            </div>
            <Modal showModal={showConfigModal} setShowModal={setShowConfigModal}>
                <h1 className='font-bold text-2xl p-1 m-2 text-center'>Configuracion</h1>
                <div className='grid grid-rows-3 justify-items-center gap-2 p-4 w-full'>
                    <h1 className='font-semibold p-1 text-center'>Cuenta: <span className='font-light'>{selectedAccount?.name}</span></h1>
                    <h1 className='font-semibold p-1 text-center'>Audiencia: <span className='font-light'>{selectedAudience?.name}</span></h1>
                    <div className="flex flex-col items-center justify-between">
                        <button onClick={handleSubmit} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline" type="button">
                            Guardar Configuracion
                        </button>
                    </div>
                </div>
            </Modal>
            <Modal showModal={showModal} setShowModal={setShowModal}>
                <h1 className='font-bold text-2xl p-1 m-2 text-center'>Agregar usuarios</h1>
                <h1 className='font-light p-1 m-2 text-center'>{selectedAudience?.name}</h1>
                <form className="w-96 mx-auto p-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
                            Usuario
                        </label>
                        <input ref={nameRef} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="John Doe" />
                    </div>
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
