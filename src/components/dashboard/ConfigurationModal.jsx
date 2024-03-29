import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Modal } from '../Modal'

// Components
import { AccountsSelect } from 'src/components/AccountsSelect'
import { Toast } from 'src/components/Toast'
import { AudiencesSelect } from 'src/components/AudienceSelect'

// Services
import { createAudience } from 'src/services/facebook'
import { createInstanceConfig } from 'src/services/instance'
import { getInstanceConfig } from 'src/services/instance'

// store
import { useAppSelector } from 'src/app/hooks'
import { selectAccounts } from 'src/app/slices/accountsSlice'


export const ConfigurationModal = ({ showModal, setShowModal }) => {
    const [selectedAccount, setSelectedAccount] = useState("")
    const [selectedAudience, setSelectedAudience] = useState("")
    const [showToast, setShowToast] = useState(false)
    const [showErrorToast, setShowErrorToast] = useState(false)

    const router = useRouter()
    const { instance_id, app_id } = router.query

    // state
    const accounts = useAppSelector(selectAccounts).data;

    // Audience refs
    const audienceNameRef = React.createRef()
    const audienceDescriptionRef = React.createRef()

    function handleSelectAccount(event) {
        const account = accounts.find(account => account.id === event.target.value)
        setSelectedAccount(account);
    }
    function handleSelectAudience(event) {
        setSelectedAudience(event.target.value);
    }
    async function handleAddAudience(event) {
        event.preventDefault()
        if (audienceNameRef.current.value === "" || audienceDescriptionRef.current.value === "") return
        const newAudience = {
            name: audienceNameRef.current.value,
            description: audienceDescriptionRef.current.value,
            subtype: 'CUSTOM',
            customer_file_source: 'USER_PROVIDED_ONLY',
            access_token: selectedAccount.token
        }
        const res = await createAudience(newAudience, selectedAccount)
        if (res) {
            setShowToast(true)
            setTimeout(() => {
                setShowToast(false)
            }, 3000);
        } else {
            setShowErrorToast(true)
            setTimeout(() => {
                setShowErrorToast(false)
            }, 3000);
        }
        setShowModal(false)
    }

    const handleSubmit = async () => {
        if (selectedAccount && selectedAudience) {
            const newConf = {
                app_id: app_id,
                instance_id: instance_id,
                configuration: {
                    account_id: selectedAccount.id,
                    audience_id: selectedAudience,
                    app_id: app_id,
                    diccionary: [
                        {
                            "tag": "<Email Address>",
                            "text": "Email Address",
                            "definition": "{{Contact.Field(C_EmailAddress)}}"
                        },
                        {
                            "tag": "<Mobile Phone>",
                            "text": "Mobile Phone",
                            "definition": "{{Contact.Field(C_MobilePhone)}}"
                        }
                    ]
                }
            }
            const res = await createInstanceConfig(newConf)
            if (res?.status === 201) {
                setShowToast(true)
                setTimeout(() => {
                    setShowToast(false)
                }, 3000);
            } else {
                setShowErrorToast(true)
                setTimeout(() => {
                    setShowErrorToast(false)
                }, 3000);
            }
        }
    }

    // Load config if exists
    useEffect(() => {
        const checkConfig = async () => {
            if (!instance_id || !app_id || !accounts) return
            // check if a config exists
            const res = await getInstanceConfig({ instance_id: instance_id, app_id: app_id })
            if (!res) return
            const account = accounts.find(account => account.id === res.configuration.account_id)
            if (!account) return
            setSelectedAccount(account)
            setSelectedAudience(res.configuration.audience_id)
        }
        // check if a config exists
        if (!instance_id || !app_id || !accounts) return
        checkConfig()
    }, [instance_id, app_id, accounts])

    return (
        <Modal showModal={showModal} setShowModal={setShowModal}>
            <div className='container mx-auto'>
                <Toast body={'Completado con exito!'} show={showToast} color='bg-green-500' />
                <Toast body={'Lo sentimos, ha ocurrido un error...'} show={showErrorToast} color='bg-red-500' />
                <div className='grid grid-rows'>
                    <div className='flex justify-center items-center p-4'>
                        <div className='bg-white rounded-2xl'>
                            <h1 className='font-bold text-2xl p-1 m-2 text-center'>Configuracion</h1>
                            <div className='flex flex-col gap-4 justify-items-center p-4 w-full'>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                                        Cuenta
                                    </label>
                                    <AccountsSelect accounts={accounts} selectedOption={selectedAccount} handleSelectChange={handleSelectAccount} />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                                        Audiencia
                                    </label>
                                    <hr className="my-3" />
                                    {/* input to add a new audience with name and description */}
                                    <form action="" className='flex flex-col gap-2'>
                                        <input required ref={audienceNameRef} type="text" name="audience" id="audience" placeholder="Nueva Audiencia" className='border-2 border-gray-300 rounded-lg p-2 w-full' />
                                        <textarea required ref={audienceDescriptionRef} type="text" name="audience_desc" id="audience_desc" placeholder="Descripcion" className='border-2 border-gray-300 rounded-lg p-2 w-full' />
                                        <button onClick={handleAddAudience} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline' type="submit">
                                            Agregar
                                        </button>
                                    </form>
                                    <hr className="my-3" />
                                    <div className='flex flex-col gap-2'>
                                        <AudiencesSelect account={selectedAccount} selectedOption={selectedAudience} handleSelectChange={handleSelectAudience} />
                                        <button onClick={handleSubmit} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline" type="button">
                                            Guardar Configuracion
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
