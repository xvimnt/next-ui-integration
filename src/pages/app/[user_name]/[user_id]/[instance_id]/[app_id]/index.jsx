import { useEffect } from "react"
import React from 'react'
import { useRouter } from 'next/router'
import { useSession } from "next-auth/react"
import { useStore } from "src/app/store"

// services
import { saveAccessToken } from "src/services/auth.js";
import { getAdsAccountsWithToken } from "src/services/facebook.js";
import { getUserByEloquaId } from "src/services/users.js";
import { createUser } from "src/services/users.js";
import { getTokensByAppId } from "src/services/auth.js";

// components
import { Cards } from "../../../../../../components/dashboard/Cards"

export default function Configuration() {
  const router = useRouter()
  const { app_id, user_id, user_name } = router.query
  const { data: session } = useSession()

  // state
  const [updateAccounts] = useStore(
    (state) => [state.updateAccounts]
  )

  useEffect(() => {
    const saveToken = async () => {
      // save the token in the database and in the local storage of the browser 
      if(session) {
        localStorage.setItem('accessToken', session.accessToken)
        const facebook_token = {
          app_id: app_id,
          token: session.accessToken,
          eloqua_id: user_id
        }
        await saveAccessToken(facebook_token)
      }
    }

    if (session?.accessToken) saveToken()
  }, [session])


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
    updateAccounts(accountsRes)
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
    const tokens = await getTokensByAppId(app_id);

    // If there was an error retrieving the tokens, stop here
    if (!tokens) {
      return;
    }

    // Set the accounts with the retrieved tokens
    setAccountsWithTokens(tokens);
  }

  useEffect(() => {
    getAccountsWithToken()
  }, [user_id])

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
