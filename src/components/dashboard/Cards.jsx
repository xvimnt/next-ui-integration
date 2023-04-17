import React, {useState} from 'react'
import { Card } from './Card'
import { useSession, signIn, signOut } from "next-auth/react"
import { AudiencesModal } from './AudiencesModal'
import { UsersModal } from './UsersModal'
import { ConfigurationModal } from './ConfigurationModal'

export const Cards = () => {
    // modal's states
    const [showAudiencesModal, setShowAudiencesModal] = useState(false)
    const [showUsersModal, setShowUsersModal] = useState(false)
    const [showConfigurationModal, setShowConfigurationModal] = useState(false)
    
    return (
        <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
            {/* Asociar cuenta de facebook */}
            <Card
                svg={
                    <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z" />
                    </svg>
                }
                title="Asociar Cuenta"
                description="Asocia tu cuenta de facebook para enlazar tu token."
                action={() => signIn()}
            />
            {/* Asociar usuarios con organizaciones */}
            <Card
                svg={
                    <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                    >
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                }
                title="Usuarios"
                description="Asocia usuarios con organizaciones existentes, para que los mismos tengan acceso a los tokens de facebook de la organizacion."
                action={() => setShowUsersModal(true)}
            />
            {/* Configuracion */}
            <Card
                svg={
                    <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                    >
                        <path d="M23.269 19.743l-11.945-11.945c-.557-.557-.842-1.33-.783-2.115.115-1.485-.395-3.009-1.529-4.146-1.03-1.028-2.376-1.537-3.723-1.537-.507 0-1.015.072-1.505.216l3.17 3.17c.344 1.589-1.959 3.918-3.567 3.567l-3.169-3.17c-.145.492-.218 1-.218 1.509 0 1.347.51 2.691 1.538 3.721 1.135 1.136 2.66 1.645 4.146 1.53.783-.06 1.557.226 2.113.783l11.946 11.944c.468.468 1.102.73 1.763.73 1.368 0 2.494-1.108 2.494-2.494 0-.638-.244-1.276-.731-1.763zm-1.769 2.757c-.553 0-1-.448-1-1s.447-1 1-1c.553 0 1 .448 1 1s-.447 1-1 1zm-7.935-15.289l5.327-5.318c.584-.585 1.348-.878 2.113-.878.764 0 1.529.292 2.113.878.589.587.882 1.357.882 2.125 0 .764-.291 1.528-.873 2.11l-5.326 5.318-4.236-4.235zm-3.53 9.18l-5.227 5.185c-.227.23-.423.488-.574.774l-.301.58-2.1 1.07-.833-.834 1.025-2.146.58-.302c.286-.15.561-.329.79-.558l5.227-5.185 1.413 1.416z"/>
                    </svg>
                }
                title="Configuracion"
                description="Configura los parametros de la aplicacion."
                action={() => setShowConfigurationModal(true)}
            />
            {/* Audiencias */}
            <Card
                svg={
                    <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                    >
                        <path d="M10.644 17.08c2.866-.662 4.539-1.241 3.246-3.682-3.932-7.427-1.042-11.398 3.111-11.398 4.235 0 7.054 4.124 3.11 11.398-1.332 2.455.437 3.034 3.242 3.682 2.483.574 2.647 1.787 2.647 3.889v1.031h-18c0-2.745-.22-4.258 2.644-4.92zm-12.644 4.92h7.809c-.035-8.177 3.436-5.313 3.436-11.127 0-2.511-1.639-3.873-3.748-3.873-3.115 0-5.282 2.979-2.333 8.549.969 1.83-1.031 2.265-3.181 2.761-1.862.43-1.983 1.34-1.983 2.917v.773z" />
                    </svg>
                }
                title="Audiencias"
                description="Lista audiencias y permite agregar correos a ellas."
                action={() => setShowAudiencesModal(true)}
            />
            <>
                <AudiencesModal setShowModal={setShowAudiencesModal} showModal={showAudiencesModal} />
                <UsersModal setShowModal={setShowUsersModal} showModal={showUsersModal} />
                <ConfigurationModal setShowModal={setShowConfigurationModal} showModal={showConfigurationModal} />
            </>
        </div>
    )
}
