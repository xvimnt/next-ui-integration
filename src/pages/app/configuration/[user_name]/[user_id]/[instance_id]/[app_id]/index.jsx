import { useState, useEffect } from "react"
import React from 'react'
import { useRouter } from 'next/router'

import { AccountsSelect } from '../../../../../../../components/AccountsSelect'
import { AudiencesSelect } from '../../../../../../../components/AudienceSelect'
import { Toast } from '../../../../../../../components/Toast'

import { getAdsAccountsWithToken, createAudience } from "../../../../../../../services/facebook"
import { createInstanceConfig, getInstanceConfig } from '../../../../../../../services/instance'
import { createUser, getUserByEloquaId } from '../../../../../../../services/users'
import { getTokensByAppId } from '../../../../../../../services/auth'
import { saveAccessToken } from "src/services/auth.js";

import { useSession, signIn } from "next-auth/react"

export default function Configuration() {
  const router = useRouter()
  const { instance_id, app_id, user_name, user_id } = router.query
  const { data: session } = useSession()

  const [accounts, setAccounts] = useState([])
  const [selectedAccount, setSelectedAccount] = useState("")
  const [selectedAudience, setSelectedAudience] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [showErrorToast, setShowErrorToast] = useState(false)

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
      setSelectedAudience(res.id)
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
      // create new user
      const userRes = await createUser({ username: user_name, eloqua_id: user_id, app_id: app_id })
      if (res?.status === 201 && userRes) {
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

  const getAccountsWithToken = async () => {
    // check if the user exists
    if (!user_id) return
    const user = await getUserByEloquaId(user_id)

    if (!user) {
      console.log('no user with that eloqua id')
    } else {
      // obtain the app_id from the user and get all the tokens asociated to the app_id
      const tokens = await getTokensByAppId(user.app_id)
      if (!tokens) return
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
  }

  useEffect(() => {
    const checkConfig = async () => {
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
  }, [instance_id, app_id, user_id])

  useEffect(() => {
    const saveToken = async () => {
      // save the token in the database and in the local storage of the browser 
      localStorage.setItem('accessToken', session?.accessToken)
      const facebook_token = {
        app_id: app_id,
        account_id: selectedAccount,
        token: session?.accessToken,
      }
      await saveAccessToken(facebook_token)
    }

    if (session?.accessToken && selectedAccount) saveToken()
  }, [session])

  return (
    <>
      <div className='container mx-auto h-[100vh] bg-black/80'>
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
          <div className='flex justify-center items-center p-4'>
            <form action="" className='bg-white rounded-2xl'>
              <h1 className='font-bold text-2xl p-1 m-2 text-center'>Facebook Token</h1>
              <div className='flex flex-col gap-4 justify-items-center p-4 w-full'>
                {session ? (<>
                  <img src={session.user.image} alt="" className="w-20 h-20 rounded-3xl border-2 border-gray-800" />
                  <h2 className="font-bold ">{session.user.name}</h2>
                  <h2 className="font-light ">{session.user.email}</h2>
                  <button className="text-lg rounded-xl bg-red-500 text-white font-bold p-3 border" onClick={() => signIn()}>Asociar Cuenta</button>
                </>) : (<>
                  <button className="text-lg rounded-xl bg-red-500 text-white font-bold p-3 border" onClick={() => signIn()}>Asociar Cuenta</button>
                </>)}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
