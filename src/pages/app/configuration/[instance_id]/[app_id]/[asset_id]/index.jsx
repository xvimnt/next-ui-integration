import { useRouter } from 'next/router'
import { getAdsAccounts } from "../../../../../../services/facebook"
import { useState, useEffect } from "react"
import { AccountsSelect } from '../../../../../../components/AccountsSelect'
import React from 'react'
import { AudiencesSelect } from '../../../../../../components/AudienceSelect'
import { createInstanceConfig, getInstanceConfig } from '../../../../../../services/instance'
import { Toast } from '../../../../../../components/Toast'

export default function Configuration() {
  const router = useRouter()
  const { instance_id, app_id, asset_id } = router.query

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
    if(selectedAccount && selectedAudience) {
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
      if(res?.status === 201) {
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
      const res = await getInstanceConfig({instance_id: instance_id, app_id: app_id})
      if(res) {
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

  return (
    <div className='container mx-auto h-[100vh] bg-black/80'>
      <Toast body={'Configuracion Exitosa!'} show={showToast} color='bg-green-500'/>
      <Toast body={'Error en la configuracion!'} show={showErrorToast} color='bg-red-500'/>
      <div className='flex justify-center items-center p-4'>
        <form action="" className='bg-white rounded-2xl'>
          <h1 className='font-bold text-2xl p-1 m-2 text-center'>Configuracion Facebook</h1>
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
              <button hidden={!selectedAccount || !selectedAudience} onClick={handleSubmit} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline" type="button">
                Guardar Configuracion
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
