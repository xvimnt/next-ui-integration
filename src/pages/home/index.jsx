import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
// Router
import { saveAccessToken } from "../../services/auth";
import { useSession, signIn, signOut } from "next-auth/react"

function Home() {
    const { data: session } = useSession()
    const router = useRouter()
    useEffect(() => {
        if (!localStorage.getItem('jwt')) router.push('/')
    }, [])

    const [accessToken, setAccessToken] = useState('')

    return (
        <>
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <img className="mx-auto h-[100px] w-auto rounded-xl" src="https://pbs.twimg.com/profile_images/1142331447816130560/4uWxGsL6_400x400.png" alt="Your Company" />
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Asociar cuenta de facebook</h2>
                        
                    </div>
                    {accessToken ? (<p className="mt-2 text-center text-sm text-gray-600">
                        Tu cuenta ha sido asociada con exito
                    </p>
                    ) : (
                        <form className="mt-8 space-y-6 flex flex-col items-center justify-center" action="#" method="POST">
                            {session ? (<>
                                <h2 className="text-2xlfont-bold">{session.user.email}</h2>
                                <button onClick={() => signOut()}>Sign out</button>
                            </>) : (<>
                                <button className="text-lg bg-red-500 text-white font-bold p-3 border" onClick={() => signIn()}>Asociar Cuenta</button>
                            </>)}
                        </form>
                    )}

                </div>
            </div>
        </>
    );
}

export default Home;
