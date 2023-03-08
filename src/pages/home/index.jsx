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

    useEffect(() => {
        if (accessToken === '' && session?.accessToken) {
            setAccessToken(session.accessToken)
            saveAccessToken(accessToken)
        }
    }, [session])
    const [accessToken, setAccessToken] = useState('')

    return (
        <>
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <img className="mx-auto h-[100px] w-auto rounded-xl" src="https://pbs.twimg.com/profile_images/1142331447816130560/4uWxGsL6_400x400.png" alt="Your Company" />
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Asociar cuenta de facebook</h2>

                    </div>
                    {accessToken && <p className="font-light flex flex-row items-center justify-center">Tu cuenta ha sido asociada con exito!</p>}
                    <form className="mt-8 space-y-6 flex flex-col items-center justify-center" action="#" method="POST">
                        {session ? (<>
                            <img src={session.user.image} alt="" className="w-20 h-20 rounded-3xl border-2 border-gray-800" />
                            <h2 className="font-bold ">{session.user.name}</h2>
                            <h2 className="font-light ">{session.user.email}</h2>
                            <button className="text-lg rounded-xl bg-red-500 text-white font-bold p-3 border" onClick={() => signOut()}>Salir</button>
                        </>) : (<>
                            <button className="text-lg rounded-xl bg-red-500 text-white font-bold p-3 border" onClick={() => signIn()}>Asociar Cuenta</button>
                        </>)}
                    </form>

                </div>
            </div>
        </>
    );
}

export default Home;
