import { useState } from "react";
import { loginFields as fields } from "../data/constants";
import Input from "../components/Input";
import { signInWithEmailAndPassword } from "../services/auth"
import { useRouter } from 'next/navigation'
function Home() {
  const router = useRouter()
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const userCredentials = await signInWithEmailAndPassword(state.email, state.password)
            if (userCredentials?.data) {
                localStorage.setItem('jwt', userCredentials.data.access_token);
                router.push('/home')
            } else throw new Error('')
        } catch (err) {
          console.error(err)
            alert('Usuario incorrecto')
        }
    }

    const fieldState = {}
    fields.forEach(field => {
        fieldState[field.id] = ''
    })

    const [state, setState] = useState(fieldState)

    return (
        <>
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <img className="mx-auto h-[100px] w-auto rounded-xl" src="https://pbs.twimg.com/profile_images/1142331447816130560/4uWxGsL6_400x400.png" alt="Your Company" />
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Ingresa a tu cuenta</h2>
                    </div>
                    <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
                        {fields.map(field => {
                            const handleChange = (e) => {
                                state[field.id] = e.target.value
                                setState({ ...state })
                            }
                            return <Input key={field.id} {...field} value={state[field.id]} handleChange={handleChange} />
                        }
                        )}
                        <center>
                            <button className="rounded-xl text-xl text-white font-semibold bg-red-600 p-3">Ingresar</button>
                        </center>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Home;
