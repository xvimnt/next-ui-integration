import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Configuration() {
  const router = useRouter()
  const { instance_id, app_id, user_name, user_id } = router.query

  return (
    <section className="text-gray-600 body-font">
      <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
        <img className="lg:w-1/6 md:w-2/6 w-4/6 mb-10 object-cover object-center rounded" alt="hero" src="//www.dxlatam.com/wp-content/uploads/2021/04/New-Project-2.png" />
        <div className="text-center lg:w-2/3 w-full">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Gestiona tus cuentas publicitarias de Facebook y crea audiencias fácilmente con nuestra aplicación.</h1>
          <p className="mb-8 leading-relaxed">Nuestra aplicación te permite enlazar tus cuentas de Facebook y acceder a ellas desde un solo lugar. Podrás gestionar tus anuncios, crear audiencias personalizadas y configurar tus preferencias de manera rápida y sencilla. Simplifica tus tareas de marketing en Facebook y optimiza tus resultados con nuestra plataforma todo en uno.</p>
          <div className="flex justify-center">
            <Link href={`/app/${user_name}/${user_id}/${instance_id}/${app_id}`} target='_blank' className="inline-flex text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg">Empezar</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
