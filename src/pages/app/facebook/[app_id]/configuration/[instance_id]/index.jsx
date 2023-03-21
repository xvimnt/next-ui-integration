import { useRouter } from 'next/router'
import { getAdsAccounts } from "../../../../../../services/facebook"
import { useState, useEffect } from "react"
import { AccountsSelect } from '../../../../../../components/AccountsSelect'
import React from 'react'
import { AudiencesSelect } from '../../../../../../components/AudienceSelect'

export default function Configuration() {
  const router = useRouter()
  const { app_id, instance_id } = router.query

  const [accounts, setAccounts] = useState([])
  const [selectedAccount, setSelectedAccount] = useState("")
  const [selectedAudience, setSelectedAudience] = useState("")

  function handleSelectAccount(event) {
    setSelectedAccount(event.target.value);
  }
  function handleSelectAudience(event) {
    setSelectedAudience(event.target.value);
  }

  useEffect(() => {
    localStorage.setItem('accessToken', 'EAAKVNbIy5ycBAPwCIhJktwdUu21PQZA4KqMFMgMwsSzjvTTpG3KT4PT4dfZAGPwkLNCxOmuVSwtby6oXZAcEUGyZAzPY3SMIDZA1uu4C5VokWeCPENXKULOn4gQ2ZBDZB5dTWHhpjOoIS3tTjUN9RmGsjRdgmK8go4XzNQfeuVjVtjZCRVYNGZCFM6EnjrZBmi3CZAaoCjDN1zVUQZDZD')
    if (typeof window !== 'undefined') {
      // Perform localStorage action
      getAdsAccounts(setAccounts)
    }
  }, [])

  return (
    <div className='container mx-auto h-[100vh] bg-blue-900'>
      <h1 className='text-3xl font-bold'>
        App ID: {app_id}<br />
        Instance ID: {instance_id}
      </h1>
      <div className='flex justify-center items-center '>
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
            <div className="flex flex-col items-center justify-between">
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline" type="button">
                Guardar Configuracion
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
