import React, { useEffect, useRef, useState } from 'react'
import { getAudiences, insertData } from '../services/facebook'
import { Modal } from './Modal'
const crypto = require('crypto');

function encryptStringToSHA256(string) {
    const hash = crypto.createHash('sha256');
    hash.update(string);
    return hash.digest('hex');
}

export const Audiences = ({adsId, accessToken}) => {
    const [audiences, setAudiences] = useState()
    const [filteredAudiences, setFilteredAudiences] = useState()
    const [showModal, setShowModal] = useState(false)
    const [selectedAudience, setSelectedAudience] = useState()

    const searchRef = useRef(null)
    const nameRef = useRef(null)
    const phoneRef = useRef(null)

    useEffect(() => {
        getAudiences(setAudiences,{adsId, accessToken})
        setFilteredAudiences(audiences?.data)
    }, [])


    const handleClick = (item) => {
        setShowModal(true)
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
            console.log(res)
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
                    <svg className="h-6 w-6 fill-current text-gray-500" viewBox="0 0 24 24">
                        <path d="M15.56 14.44a9 9 0 1 1 1.42-1.42l5.09 5.08a1 1 0 0 1-1.42 1.42l-5.09-5.08zM4.5 10a5.5 5.5 0 1 0 11 0 5.5 5.5 0 0 0-11 0z" />
                    </svg>
                </span>
                <input onChange={handleSearch} ref={searchRef} className="block w-full rounded-lg pl-10 pr-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:shadow-outline-blue focus:text-gray-900 focus:placeholder-gray-400 sm:text-sm sm:leading-5" placeholder="Search" />
            </div>

            <div className='grid grid-cols-3 gap-2'>

                {filteredAudiences?.length > 0 && (
                    filteredAudiences.map(el => {
                        return (
                            <div key={el.id} className="w-full">
                                <div className="border-gray-400 rounded-2xl border-2 bg-white p-4 flex flex-col">
                                    <div className="mb-8">
                                        <div className="text-gray-900 font-bold text-xl mb-2">{el.id}</div>
                                        <p className="text-gray-700 text-base">{el.name}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="text-sm">
                                            <button onClick={() => handleClick(el)} className='bg-red-500 rounded-3xl text-xl p-3'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M23 18h-2v2h-1v-2h-2v-1h2v-2h1v2h2v1zm-15.999-10c-2.493 0-4.227 2.383-1.866 6.839.774 1.464-.826 1.812-2.545 2.209-1.491.345-1.59 1.072-1.59 2.334l.002.618h1.329c0-1.918-.186-1.385 1.824-1.973 1.014-.295 1.91-.723 2.316-1.612.212-.463.355-1.22-.162-2.197-.952-1.798-1.219-3.374-.712-4.215.547-.909 2.27-.908 2.819.015.935 1.567-.793 3.982-1.02 4.982h1.396c.44-1 1.206-2.208 1.206-3.9.001-2.01-1.31-3.1-2.997-3.1zm7.754-1.556c.895-1.487 3.609-1.494 4.512.022.77 1.291.423 3.484-.949 6.017-.098.18-.17.351-.232.517h1.464c3.057-5.744.816-9-2.548-9-3.323 0-5.635 3.177-2.488 9.119 1.033 1.952-1.101 2.416-3.394 2.946-1.988.458-2.12 1.429-2.12 3.11l.003.825h1.331c0-2.069-.08-2.367 1.173-2.657 1.918-.442 3.729-.86 4.39-2.305.241-.527.401-1.397-.206-2.543-1.362-2.572-1.704-4.777-.936-6.051z" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

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
                            Submit
                        </button>
                    </div>
                </form>

            </Modal>
        </>
    )
}
