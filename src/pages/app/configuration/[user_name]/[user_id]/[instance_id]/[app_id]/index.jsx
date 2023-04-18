import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Hero } from 'src/components/dashboard/Hero'

export default function Configuration() {
  const router = useRouter()
  const { instance_id, app_id, user_name, user_id } = router.query
  
  return (
    <section className="text-gray-600 body-font bg-white h-[100vh]">
      <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
        <Hero />        
        <div className="text-center lg:w-2/3 w-full">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-bold text-gray-900">Bienvenido</h1>
          <p className="mb-8 leading-relaxed">Gestiona tus cuentas publicitarias de Facebook y crea audiencias fácilmente con nuestra aplicación.</p>
          <div className="flex justify-center">
            <Link href={`/app/${user_name}/${user_id}/${instance_id}/${app_id}`} target='_blank' className="inline-flex text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg">Empezar</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
