import { useEffect } from "react"
import React from 'react'
import { useRouter } from 'next/router'
import { useSession } from "next-auth/react"

// services
import { saveAccessToken } from "src/services/auth.js";
import { getAdsAccountsWithToken } from "src/services/facebook.js";
import { getUserByEloquaId } from "src/services/users.js";
import { createUser } from "src/services/users.js";
import { getTokensByAppId } from "src/services/auth.js";

// components
import { Cards } from "../../../../../../components/dashboard/Cards"
import { Hero } from 'src/components/dashboard/Hero'

// store
import { useAppDispatch } from "src/app/hooks.js"
import { setAccounts } from "src/app/slices/accountsSlice.js"


export default function Configuration() {
  const router = useRouter()
  const { app_id, user_id, user_name } = router.query
  const { data: session } = useSession()

  // state
  const dispatch = useAppDispatch()

  useEffect(() => {
    const saveToken = async () => {
      // save the token in the database and in the local storage of the browser 
      if (session) {
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
    // Create an empty array to store the ads accounts
    const accountsRes = [];

    // Iterate through each token in the tokens array
    for (const token of tokens) {
      // Call the getAdsAccountsWithToken function with the token and wait for the response
      const accounts = await getAdsAccountsWithToken(token.token);

      // Check if the accounts array exists and is not empty
      if (accounts) {
        // Iterate through each account in the accounts array and add it to the accountsRes array
        accounts.data.forEach(account => {
          accountsRes.push({
            id: account.account_id,
            name: account.name,
            token: token.token,
          });
        });
      }
    }
    dispatch(setAccounts(accountsRes))
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
          <Hero />
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-center text-gray-900">Funcionalidades</h1>
          <h2 className="sm:text-2xl text-xl title-font text-center text-gray-700 font-light mb-20">Administra tu cuenta publicitaria desde un solo lugar</h2>
          <Cards />
        </div>
      </section >
    </>
  )
}
