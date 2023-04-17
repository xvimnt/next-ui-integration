import React, { useState, useEffect } from 'react'
import { Modal } from '../Modal'
import { AccountsSelect } from 'src/components/AccountsSelect'
import { Toast } from 'src/components/Toast'
import { AudiencesSelect } from 'src/components/AudienceSelect'
import { createAudience } from 'src/services/facebook'
import { createInstanceConfig } from 'src/services/instance'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

// Services
import { getUserByEloquaId } from 'src/services/users'
import { getTokensByAppId } from 'src/services/auth'
import { getAdsAccountsWithToken } from 'src/services/facebook'
import { getInstanceConfig } from 'src/services/instance'


export const ConfigurationModal = ({ showModal, setShowModal }) => {
    const [accounts, setAccounts] = useState([])
    const [selectedAccount, setSelectedAccount] = useState("")
    const [selectedAudience, setSelectedAudience] = useState("")
    const [showToast, setShowToast] = useState(false)
    const [showErrorToast, setShowErrorToast] = useState(false)


    const { data: session } = useSession()
    const router = useRouter()
    const { instance_id, app_id, user_name, user_id } = router.query

    // Audience refs
    const audienceNameRef = React.createRef()
    const audienceDescriptionRef = React.createRef()

    function handleSelectAccount(event) {
        setSelectedAccount(event.target.value);
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
            access_token: session?.accessToken || localStorage.getItem('accessToken')
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
                    account_id: selectedAccount,
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

    const setAccountsWithTokens = async (tokens) => {
        // for each token get the ads accounts and save them in an array
        const accountsRes = []
        accountsRes.data = []
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i]
            const accounts = await getAdsAccountsWithToken(token.token)
            if (!accounts) continue
            accounts.data.forEach(account => {
                accountsRes.data.push(account)
            })
        }
        setAccounts(accountsRes)
    }

    const getAccountsWithToken = async () => {
        // Check if user ID is present
        if (!user_id) {
            return;
        }

        // Retrieve the user associated with the user ID, or create a new one if no user is found
        const user = await getUserByEloquaId(user_id) ||
            await createUser({ username: user_name, eloqua_id: user_id, app_id: app_id });

        // If there was an error retrieving or creating the user, stop here
        if (!user) {
            return;
        }

        // Retrieve the tokens associated with the user's app ID
        const tokens = await getTokensByAppId(user.app_id);

        // If there was an error retrieving the tokens, stop here
        if (!tokens) {
            return;
        }

        // Set the accounts with the retrieved tokens
        setAccountsWithTokens(tokens);
    }

    useEffect(() => {
        const checkConfig = async () => {
            if (!instance_id || !app_id) return
            await getAccountsWithToken()

            // check if a config exists
            const res = await getInstanceConfig({ instance_id: instance_id, app_id: app_id })
            if (res) {
                setSelectedAccount(res.configuration.account_id)
                setSelectedAudience(res.configuration.audience_id)
            }
        }
        if (typeof window !== 'undefined') {
            // check if a config exists
            checkConfig()
        }
    }, [instance_id, app_id])

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
                                        <AudiencesSelect account_id={selectedAccount} selectedOption={selectedAudience} handleSelectChange={handleSelectAudience} />
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
