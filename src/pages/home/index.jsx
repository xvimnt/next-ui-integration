import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
// Router
import { getCurrentProfile, saveAccessToken } from "../../services/auth";
import { useSession, signIn, signOut } from "next-auth/react"
import { Audiences } from "../../components/Audiences";
import { Accounts } from "../../components/Accounts";
import AdminCards from '../../components/AdminCards'
import { updateUser } from "../../services/users";
function Home() {
    const { data: session } = useSession()
    const [userProfile, setUserProfile] = useState({})
    const router = useRouter()
    
    useEffect(() => {
        const setProfile = async () => {
            const currentProfile = await getCurrentProfile()
            setUserProfile(currentProfile)
        }
        if (!localStorage.getItem('jwt')) router.push('/')
        else setProfile()
    }, [])

    useEffect(() => {

        const saveToken = async () => {
            // First we save the token to the local storage then to fbToken table and then we save the user
            localStorage.setItem('accessToken', accessToken)
            await saveAccessToken(session.accessToken)
            const user = {
                id: session.user.id,
                facebook_token: accessToken
            }
            await updateUser(user)
        }

        if (session?.accessToken) saveToken()
    }, [session])

    const handleLogout = (e) => {
        e.prevent.default()
        signOut(session)
    }
    const [selectedAccount, setSelectedAccount] = useState()
    return (
        <>
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full container">
                    <div>
                        <img className="mx-auto h-[100px] w-auto rounded-xl" src="https://pbs.twimg.com/profile_images/1142331447816130560/4uWxGsL6_400x400.png" alt="Your Company" />
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Asociar cuenta de facebook</h2>
                    </div>
                    {session && <p className="font-light flex flex-row items-center justify-center">Tu cuenta ha sido asociada con exito!</p>}
                    <form className="mt-8 space-y-6 flex flex-col items-center justify-center" action="#" method="POST">
                        {session ? (<>
                            <img src={session.user.image} alt="" className="w-20 h-20 rounded-3xl border-2 border-gray-800" />
                            <h2 className="font-bold ">{session.user.name}</h2>
                            <h2 className="font-light ">{session.user.email}</h2>
                            <button className="text-lg rounded-xl bg-red-500 text-white font-bold p-3 border" onClick={handleLogout}>Salir</button>
                        </>) : (<>
                            <button className="text-lg rounded-xl bg-red-500 text-white font-bold p-3 border" onClick={() => signIn()}>Asociar Cuenta</button>
                        </>)}
                    </form>
                    {userProfile?.role === 'admin' && <AdminCards />}
                    <Accounts selectedOption={selectedAccount} setSelectedOption={setSelectedAccount} />
                    <Audiences selectedAccount={selectedAccount} />
                </div>
            </div>
        </>
    );
}

export default Home;
