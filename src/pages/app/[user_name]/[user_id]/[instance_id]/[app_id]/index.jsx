import { useState, useEffect } from "react"
import React from 'react'
import { useRouter } from 'next/router'

import { AccountsSelect } from '../../../../../../components/AccountsSelect'
import { AudiencesSelect } from '../../../../../../components/AudienceSelect'
import { Toast } from '../../../../../../components/Toast'

import { getAdsAccountsWithToken, createAudience } from "../../../../../../services/facebook"
import { createInstanceConfig, getInstanceConfig } from '../../../../../../services/instance'
import { createUser, getUserByEloquaId } from '../../../../../../services/users'
import { getTokensByAppId } from '../../../../../../services/auth'
import { saveAccessToken } from "src/services/auth.js";

import { useSession, signIn } from "next-auth/react"
import { Cards } from "../../../../../../components/dashboard/Cards"

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
      {/* Features */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <center>
            <img className="lg:w-1/6 md:w-2/6 w-4/6 mb-10 object-cover object-center rounded" alt="hero" src="//www.dxlatam.com/wp-content/uploads/2021/04/New-Project-2.png" />
          </center>
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-center text-gray-900">Funcionalidades</h1>
          <h2 className="sm:text-2xl text-xl title-font text-center text-gray-700 font-light mb-20">Administra tu cuenta publicitaria desde un solo lugar</h2>
          <Cards />
        </div>
      </section >
    </>
  )
}
