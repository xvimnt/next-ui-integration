import { useRouter } from 'next/router'
import { getAdsAccounts } from "../../../../../../../services/facebook"
import { useState, useEffect } from "react"
import { AccountsSelect } from '../../../../../../../components/AccountsSelect'
import React from 'react'
import { AudiencesSelect } from '../../../../../../../components/AudienceSelect'
import { createInstanceConfig, getInstanceConfig } from '../../../../../../../services/instance'
import { createUser } from '../../../../../../../services/users'
import { Toast } from '../../../../../../../components/Toast'
import { useSession, signIn } from "next-auth/react"
import { saveAccessToken } from "src/services/auth.js";

export default function Configuration() {
  const router = useRouter()
  const { instance_id, app_id, user_name, user_id } = router.query
  const { data: session } = useSession()

  const [accounts, setAccounts] = useState([])
  const [selectedAccount, setSelectedAccount] = useState("")
  const [selectedAudience, setSelectedAudience] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [showErrorToast, setShowErrorToast] = useState(false)

  function handleSelectAccount(event) {
    setSelectedAccount(event.target.value);
  }
  function handleSelectAudience(event) {
    setSelectedAudience(event.target.value);
  }

  const handleSubmit = async () => {
    if (selectedAccount && selectedAudience) {
      const newConf = {
        app_id: app_id,
        instance_id: instance_id,
        configuration: {
          account_id: selectedAccount,
          account_name: accounts.find(account => account.id === selectedAccount).name,
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

  useEffect(() => {
    const checkConfig = async () => {
      const res = await getInstanceConfig({ instance_id: instance_id, app_id: app_id })
      if (res) {
        setSelectedAccount(res.configuration.account_id)
        setSelectedAudience(res.configuration.audience_id)
      }
    }
    if (typeof window !== 'undefined') {
      getAdsAccounts(setAccounts)
      // check if a config exists
      checkConfig()
    }
  }, [instance_id, app_id])

  useEffect(() => {
    const saveToken = async () => {
      // save the token in the database and in the local storage of the browser 
      localStorage.setItem('accessToken', session?.accessToken)
      const facebook_token = {
        app_id: app_id,
        account_id: selectedAccount,
        token: session?.accessToken,
        account_name: accounts?.find(account => account.id === selectedAccount).name
      }
      await saveAccessToken(facebook_token)
    }

    if (session?.accessToken && accounts) saveToken()
  }, [session])

  return (
    <div className='container mx-auto h-[100vh] bg-black/80'>
      <Toast body={'Configuracion Exitosa!'} show={showToast} color='bg-green-500' />
      <Toast body={'Error en la configuracion!'} show={showErrorToast} color='bg-red-500' />
      <div className='grid grid-rows-2'>
        <div className='flex justify-center items-center p-4'>
          <form action="" className='bg-white rounded-2xl'>
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
                <AudiencesSelect account_id={selectedAccount} selectedOption={selectedAudience} handleSelectChange={handleSelectAudience} />
              </div>
              <div className="flex flex-col items-center justify-between" hidden={!selectedAccount || !selectedAudience}>
                <button onClick={handleSubmit} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline" type="button">
                  Guardar Configuracion
                </button>
              </div>
            </div>
          </form>
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
  )
}
