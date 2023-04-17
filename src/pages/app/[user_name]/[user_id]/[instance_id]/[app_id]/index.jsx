import { useEffect } from "react"
import React from 'react'
import { useRouter } from 'next/router'
import { saveAccessToken } from "src/services/auth.js";

import { useSession } from "next-auth/react"
import { Cards } from "../../../../../../components/dashboard/Cards"

export default function Configuration() {
  const router = useRouter()
  const { app_id} = router.query
  const { data: session } = useSession()

  useEffect(() => {
    const saveToken = async () => {
      // save the token in the database and in the local storage of the browser 
      localStorage.setItem('accessToken', session?.accessToken)
      const facebook_token = {
        app_id: app_id,
        token: session?.accessToken,
      }
      await saveAccessToken(facebook_token)
    }

    if (session?.accessToken) saveToken()
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
